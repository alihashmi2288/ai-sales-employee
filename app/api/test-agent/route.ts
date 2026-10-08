import { NextResponse } from 'next/server';
import { processCustomerMessage } from '@/lib/agent/orchestrator';
import { DEFAULT_TENANT_ID, getOrCreateConversation } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = body.message || 'AOA, Black cotton shirt medium me available hai? Price kya hai?';
    const channel = body.channel || 'web_widget';
    const customerId = body.customerId || `test_shopper_${Date.now()}`;

    const conv = await getOrCreateConversation(
      DEFAULT_TENANT_ID,
      channel,
      customerId,
      body.customerName || 'Test Customer'
    );

    const result = await processCustomerMessage(DEFAULT_TENANT_ID, conv.id, message);

    return NextResponse.json({
      success: true,
      conversationId: conv.id,
      inputMessage: message,
      agentReply: result.reply,
      isMuted: result.isMuted,
      status: result.status,
      toolsExecuted: result.toolCallsExecuted,
    });
  } catch (error: unknown) {
    console.error('Test Agent Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
