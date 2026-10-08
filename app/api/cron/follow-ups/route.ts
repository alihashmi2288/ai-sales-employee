import { NextResponse } from 'next/server';
import * as db from '@/lib/db';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Verify secret if configured in production
    if (cronSecret && cronSecret !== 'super_secret_cron_string_for_vercel_cron') {
      if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized cron trigger' }, { status: 401 });
      }
    }

    const dueTasks = await db.getDueFollowUps();
    const results = [];

    for (const task of dueTasks) {
      const conv = await db.getConversationById(task.conversation_id);
      if (!conv) {
        await db.updateFollowUpStatus(task.id, 'cancelled');
        continue;
      }

      // If conversation is in human takeover or resolved, cancel follow-up
      if (conv.status === 'human_takeover' || conv.status === 'resolved') {
        await db.updateFollowUpStatus(task.id, 'cancelled');
        continue;
      }

      // Check if user already placed an order
      const orders = await db.getOrders(conv.tenant_id);
      const hasRecentOrder = orders.some(
        (o) =>
          o.conversation_id === conv.id ||
          o.customer_phone === conv.customer_identifier
      );

      if (hasRecentOrder) {
        await db.updateFollowUpStatus(task.id, 'cancelled');
        results.push({ id: task.id, status: 'cancelled_order_already_placed' });
        continue;
      }

      // Formulate friendly recovery nudge
      const followUpText = `Assalam-o-Alaikum! 🌟 Ayesha here from Aura Fashion. 
Aapne hamari Classic Summer Cotton Shirt check ki thi — sirf 2 pieces remaining hain in Medium size! 
Agar aap abhi book kar lein to Cash on Delivery aur Free Shipping threshold ka faida utha sakte hain. Kya main aapke liye parcel reserve kar doon?`;

      await db.saveMessage({
        conversation_id: conv.id,
        tenant_id: conv.tenant_id,
        sender: 'agent',
        content: followUpText,
      });

      await db.updateFollowUpStatus(task.id, 'executed');
      results.push({ id: task.id, conversationId: conv.id, status: 'executed' });
    }

    return NextResponse.json({
      success: true,
      processedCount: dueTasks.length,
      tasks: results,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error('Follow-Up Cron Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Cron error' },
      { status: 500 }
    );
  }
}
