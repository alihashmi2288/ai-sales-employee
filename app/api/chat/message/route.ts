import { NextResponse } from 'next/server';
import { processCustomerMessage } from '@/lib/agent/orchestrator';
import { DEFAULT_TENANT_ID, getOrCreateConversation, getMessages } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, customerId, customerName } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message content is required.' }, { status: 400 });
    }

    const sessionId = customerId || 'guest_web_shopper';

    const conversation = await getOrCreateConversation(
      DEFAULT_TENANT_ID,
      'web_widget',
      sessionId,
      customerName || 'Shopper'
    );

    const result = await processCustomerMessage(DEFAULT_TENANT_ID, conversation.id, message.trim());
    const messages = await getMessages(conversation.id);

    return NextResponse.json({
      success: true,
      conversationId: conversation.id,
      reply: result.reply,
      isMuted: result.isMuted,
      status: result.status,
      toolsExecuted: result.toolCallsExecuted,
      messages,
    });
  } catch (error: unknown) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const customerId = searchParams.get('customerId') || 'guest_web_shopper';

  const conversation = await getOrCreateConversation(
    DEFAULT_TENANT_ID,
    'web_widget',
    customerId,
    'Shopper'
  );

  const messages = await getMessages(conversation.id);

  return NextResponse.json({
    conversationId: conversation.id,
    status: conversation.status,
    messages,
  });
}
