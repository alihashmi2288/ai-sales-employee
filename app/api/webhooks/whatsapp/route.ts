import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { processCustomerMessage } from '@/lib/agent/orchestrator';
import { DEFAULT_TENANT_ID, getOrCreateConversation } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const expectedToken = process.env.META_VERIFY_TOKEN || 'sales_emp_secret_token_123';

  if (mode === 'subscribe' && token === expectedToken) {
    console.log('[WhatsApp Webhook] Handshake verified successfully.');
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: 'Verification token mismatch' }, { status: 403 });
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();

    // 1. Validate signature if META_APP_SECRET is set
    const appSecret = process.env.META_APP_SECRET;
    const signature = req.headers.get('x-hub-signature-256');

    if (appSecret && signature) {
      const hmac = crypto.createHmac('sha256', appSecret);
      const digest = 'sha256=' + hmac.update(rawBody).digest('hex');
      if (signature !== digest) {
        console.warn('[WhatsApp Webhook] Invalid signature rejected');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);

    // Meta sends webhook events in an array of entries
    const entry = payload?.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messageObj = value?.messages?.[0];

    if (!messageObj) {
      // Receipt or status update (delivered/read)
      return NextResponse.json({ status: 'ok_no_inbound_message' });
    }

    const customerPhone = messageObj.from;
    const messageType = messageObj.type;
    const customerText =
      messageType === 'text'
        ? messageObj.text?.body
        : messageType === 'button'
        ? messageObj.button?.text
        : messageType === 'interactive'
        ? messageObj.interactive?.button_reply?.title || messageObj.interactive?.list_reply?.title
        : null;

    if (!customerText) {
      return NextResponse.json({ status: 'unsupported_media_type' });
    }

    const customerName = value?.contacts?.[0]?.profile?.name || `Customer +${customerPhone}`;

    // Get or create conversation in DB
    const conversation = await getOrCreateConversation(
      DEFAULT_TENANT_ID,
      'whatsapp',
      customerPhone,
      customerName
    );

    // Run autonomous agent
    const result = await processCustomerMessage(DEFAULT_TENANT_ID, conversation.id, customerText);

    // If agent replied and is not muted, dispatch back via WhatsApp Cloud API
    if (result.reply && !result.isMuted) {
      await sendWhatsAppTextMessage(customerPhone, result.reply);
    }

    return NextResponse.json({
      status: 'success',
      conversationId: conversation.id,
      agentReply: result.reply,
      isMuted: result.isMuted,
    });
  } catch (error: unknown) {
    console.error('[WhatsApp Webhook Error]:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Webhook error' },
      { status: 500 }
    );
  }
}

async function sendWhatsAppTextMessage(to: string, bodyText: string) {
  const phoneNumberId = process.env.META_PHONE_NUMBER_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;

  if (!phoneNumberId || !accessToken || accessToken.startsWith('EAAG...')) {
    console.log(`[WhatsApp Outbound Simulation] To: ${to} | Reply: "${bodyText.substring(0, 60)}..."`);
    return;
  }

  try {
    const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'text',
        text: { preview_url: true, body: bodyText },
      }),
    });

    const resJson = await res.json();
    console.log('[WhatsApp Graph API Response]:', resJson);
  } catch (err) {
    console.error('[WhatsApp Dispatch Error]:', err);
  }
}
