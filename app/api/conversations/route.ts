import { NextResponse } from 'next/server';
import * as db from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('id');

    if (conversationId) {
      const conv = await db.getConversationById(conversationId);
      const messages = await db.getMessages(conversationId);
      return NextResponse.json({ conversation: conv, messages });
    }

    const conversations = await db.getAllConversations();
    return NextResponse.json({ conversations });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 }
    );
  }
}
