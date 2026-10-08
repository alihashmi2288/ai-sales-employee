import { GoogleGenAI } from '@google/genai';
import * as db from '@/lib/db';
import { buildSystemPrompt } from './prompt';
import { agentToolDeclarations, executeTool } from './tools';
import { Message } from '@/lib/types';

export interface AgentExecutionResult {
  reply: string;
  isMuted: boolean;
  status: string;
  toolCallsExecuted: string[];
}

export async function processCustomerMessage(
  tenantId: string,
  conversationId: string,
  customerMessage: string
): Promise<AgentExecutionResult> {
  // 1. Check conversation status
  const conv = await db.getConversationById(conversationId);
  if (conv && conv.status === 'human_takeover') {
    return {
      reply: '',
      isMuted: true,
      status: 'human_takeover',
      toolCallsExecuted: [],
    };
  }

  // 2. Fetch tenant context
  const tenant = await db.getTenant(tenantId);
  const systemInstruction = buildSystemPrompt(tenant);

  // 3. Save incoming customer message
  await db.saveMessage({
    conversation_id: conversationId,
    tenant_id: tenantId,
    sender: 'customer',
    content: customerMessage,
  });

  // 4. Fetch conversation history
  const history = await db.getMessages(conversationId);

  const apiKey = process.env.GEMINI_API_KEY;
  const toolCallsExecuted: string[] = [];

  // If Gemini API Key is configured, use official @google/genai SDK
  if (apiKey && apiKey.length > 10 && !apiKey.startsWith('AIzaSy...your_gemini')) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const modelName = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

      // Format past turns (excluding the very latest customer turn which we add in loop)
      const contents: Array<{
        role: 'user' | 'model';
        parts: Array<Record<string, unknown>>;
      }> = [];

      for (const msg of history.slice(-8)) {
        contents.push({
          role: msg.sender === 'customer' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        });
      }

      // Tool execution loop (max 4 iterations)
      let iterations = 0;
      let finalReply = '';

      while (iterations < 4) {
        iterations++;
        const response = await ai.models.generateContent({
          model: modelName,
          contents: contents as unknown as string,
          config: {
            systemInstruction,
            tools: [{ functionDeclarations: agentToolDeclarations }],
            temperature: 0.4,
          },
        });

        const functionCalls = response.functionCalls;

        if (functionCalls && functionCalls.length > 0) {
          // Model decided to call tools
          const callParts: Array<Record<string, unknown>> = [];
          const responseParts: Array<Record<string, unknown>> = [];

          for (const call of functionCalls) {
            if (!call.name) continue;
            toolCallsExecuted.push(call.name);
            const toolResult = await executeTool(
              call.name,
              (call.args || {}) as Record<string, unknown>,
              { tenantId, conversationId }
            );

            callParts.push({
              functionCall: {
                name: call.name,
                args: call.args,
              },
            });

            responseParts.push({
              functionResponse: {
                name: call.name,
                response: toolResult,
              },
            });
          }

          // Append model's tool calls and our function responses to conversation turns
          contents.push({
            role: 'model',
            parts: callParts,
          });

          contents.push({
            role: 'user',
            parts: responseParts,
          });

          // Continue loop to let Gemini formulate text based on tool results
        } else {
          // Final text reply from model
          finalReply = response.text || '';
          break;
        }
      }

      if (finalReply) {
        await db.saveMessage({
          conversation_id: conversationId,
          tenant_id: tenantId,
          sender: 'agent',
          content: finalReply,
        });

        const updatedConv = await db.getConversationById(conversationId);
        return {
          reply: finalReply,
          isMuted: updatedConv?.status === 'human_takeover',
          status: updatedConv?.status || 'active_ai',
          toolCallsExecuted,
        };
      }
    } catch (err: unknown) {
      console.warn('Gemini API call encountered an error, activating resilient engine:', err);
    }
  }

  // Resilient Native Conversational Engine (when GEMINI_API_KEY is not set or network fails)
  const simulated = await runResilientSalesEngine(
    customerMessage,
    history,
    tenantId,
    conversationId
  );

  toolCallsExecuted.push(...simulated.toolsRun);

  await db.saveMessage({
    conversation_id: conversationId,
    tenant_id: tenantId,
    sender: 'agent',
    content: simulated.reply,
  });

  const updatedConv = await db.getConversationById(conversationId);
  return {
    reply: simulated.reply,
    isMuted: updatedConv?.status === 'human_takeover',
    status: updatedConv?.status || 'active_ai',
    toolCallsExecuted,
  };
}

// Resilient Native Rule Engine emulating Ayesha for zero-dependency demos
async function runResilientSalesEngine(
  text: string,
  history: Message[],
  tenantId: string,
  conversationId: string
): Promise<{ reply: string; toolsRun: string[] }> {
  const lower = text.toLowerCase();
  const toolsRun: string[] = [];

  // Escalation / Human Takeover Intent
  if (
    lower.includes('human') ||
    lower.includes('agent') ||
    lower.includes('manager') ||
    lower.includes('baat karwao') ||
    lower.includes('call me')
  ) {
    toolsRun.push('triggerHumanHandoff');
    await executeTool(
      'triggerHumanHandoff',
      { reason: 'Customer explicitly requested human representative', urgency: 'high' },
      { tenantId, conversationId }
    );
    return {
      reply:
        'Jee zaroor! Main ne hamari human sales team ko live alert bhej diya hai. Ek senior customer representative abhi chat join kar rahe hain. Please thora sa intezar farmaiye ga.',
      toolsRun,
    };
  }

  // Order Confirmation Intent
  if (
    lower.includes('yes confirm') ||
    lower.includes('confirm kar do') ||
    lower.includes('yes book') ||
    (lower === 'yes' && history.some((h) => h.content.includes('order summary') || h.content.includes('Summary')))
  ) {
    toolsRun.push('draftAndConfirmOrder');
    const orderResult = (await executeTool(
      'draftAndConfirmOrder',
      {
        customerName: 'Valued Customer',
        customerPhone: '03001234567',
        shippingAddress: 'House 42, Street 5, Sector F-7/2',
        shippingCity: 'Islamabad',
        paymentMethod: 'cod',
        items: [{ sku: 'SHIRT-BLK-CAS', size: 'M', color: 'Black', quantity: 1 }],
      },
      { tenantId, conversationId }
    )) as Record<string, unknown>;

    return {
      reply: `Mubarak ho! 🎉 Aapka order successfully confirm ho gaya hai!

📦 **Order ID:** ${orderResult.orderNumber}
🚚 **Tracking Number:** ${orderResult.trackingNumber}
💵 **Total Payable (Cash On Delivery):** PKR ${orderResult.totalAmount}
📍 **Delivery Address:** ${orderResult.shippingAddress}

Courier rider 2-3 working days me parcel deliver karega aur tabhi payment receive karega. Parcel dispatch hotay hi aapko SMS tracking update mil jayegi! Agar koi aur cheez dekhna chahein to batayein?`,
      toolsRun,
    };
  }

  // Size / Stock Check Intent
  if (lower.includes('medium') || lower.includes('size') || lower.includes('stock') || lower.includes('available')) {
    toolsRun.push('checkInventory');
    const inv = (await executeTool(
      'checkInventory',
      { sku: 'SHIRT-BLK-CAS', size: 'M', color: 'Black' },
      { tenantId, conversationId }
    )) as Record<string, unknown>;

    return {
      reply: `Jee bilkul! ${inv.title} **Medium (M)** size me bilkul in-stock hai! 

💰 **Price:** PKR ${inv.price}
🚚 **Delivery:** 2-3 days nationwide via TCS
💵 **Payment:** 100% Cash on Delivery (COD)

Sath me 7-day hassle-free doorstep size exchange guarantee bhi shamil hai. Kya main aapke liye yeh book kar doon? Apna delivery Name aur WhatsApp number share farma dein!`,
      toolsRun,
    };
  }

  // Product Search / Catalog Inquiries
  if (
    lower.includes('shirt') ||
    lower.includes('black') ||
    lower.includes('polo') ||
    lower.includes('chino') ||
    lower.includes('denim') ||
    lower.includes('price') ||
    lower.includes('dikhao')
  ) {
    toolsRun.push('searchProducts');
    const res = (await executeTool(
      'searchProducts',
      { query: text },
      { tenantId, conversationId }
    )) as { products?: Array<Record<string, unknown>> };

    const top = res.products?.[0];
    if (top) {
      return {
        reply: `Hamare paas **${top.title}** available hai!

• **Category:** ${top.category}
• **Price:** PKR ${top.price} (Discounted from PKR ${top.compareAtPrice})
• **Sizes in Stock:** ${top.availableSizes}
• **Fabric:** ${top.description}

Aapko casual wear ke liye chahiye ya formal events ke liye? Size batayein to main stock reserve kar loon!`,
        toolsRun,
      };
    }
  }

  // General Greeting / Welcome
  return {
    reply:
      'Walaikum Assalam & Welcome to Aura Fashion! 🌟 Main Ayesha hoon, aapki personal sales associate. Main aapko hamare best-selling summer cotton shirts, polos, chinos aur special COD offers ke baray me guide kar sakti hoon. Aaj aap kis category me shopping karna chahein ge?',
    toolsRun,
  };
}
