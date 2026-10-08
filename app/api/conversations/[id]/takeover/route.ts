import { NextResponse } from 'next/server';
import * as db from '@/lib/db';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params;
    const body = await req.json();
    const { action, message, reason } = body;

    const conv = await db.getConversationById(conversationId);
    if (!conv) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    if (action === 'takeover') {
      const updated = await db.updateConversationStatus(
        conversationId,
        'human_takeover',
        reason || 'Manual merchant takeover from live dashboard'
      );
      return NextResponse.json({
        success: true,
        status: updated?.status,
        message: 'AI agent is now muted. Human staff can converse directly.',
      });
    }

    if (action === 'resume') {
      const updated = await db.updateConversationStatus(conversationId, 'active_ai');
      return NextResponse.json({
        success: true,
        status: updated?.status,
        message: 'AI agent is resumed and active.',
      });
    }

    if (action === 'reply') {
      if (!message || typeof message !== 'string') {
        return NextResponse.json({ error: 'Message content required' }, { status: 400 });
      }

      // Save human message
      const saved = await db.saveMessage({
        conversation_id: conversationId,
        tenant_id: conv.tenant_id,
        sender: 'human_staff',
        content: message.trim(),
      });

      const messages = await db.getMessages(conversationId);

      return NextResponse.json({
        success: true,
        message: saved,
        messages,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: unknown) {
    console.error('Takeover Route Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 }
    );
  }
}
