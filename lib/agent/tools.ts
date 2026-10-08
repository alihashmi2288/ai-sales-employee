import { FunctionDeclaration, Type } from '@google/genai';
import * as db from '@/lib/db';
import {
  SearchProductsParams,
  CheckInventoryParams,
  DraftOrderParams,
  TriggerHumanHandoffParams,
  ScheduleFollowupParams,
  PaymentMethod,
} from '@/lib/types';

export const agentToolDeclarations: FunctionDeclaration[] = [
  {
    name: 'searchProducts',
    description: 'Searches the store catalog for products matching a natural language query, keyword, or category filter.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        query: {
          type: Type.STRING,
          description: 'Product search terms (e.g., "black casual shirt", "formal oxford", "chinos", "polo")',
        },
        category: {
          type: Type.STRING,
          description: 'Optional category filter (e.g., "Shirts", "Polos", "Trousers", "Accessories")',
        },
        maxPrice: {
          type: Type.NUMBER,
          description: 'Maximum price/budget in store currency',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'checkInventory',
    description: 'Checks live real-time stock levels, sizes, and colors for a specific product SKU.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        sku: {
          type: Type.STRING,
          description: 'The product SKU identifier (e.g. "SHIRT-BLK-CAS", "SHIRT-OXF-WHT")',
        },
        size: {
          type: Type.STRING,
          description: 'Requested size (e.g., "S", "M", "L", "XL", "32")',
        },
        color: {
          type: Type.STRING,
          description: 'Requested color (e.g., "Black", "White", "Navy")',
        },
      },
      required: ['sku'],
    },
  },
  {
    name: 'draftAndConfirmOrder',
    description: 'Creates and confirms a customer order in the system after collecting name, phone, address, city, and items. Call ONLY after customer gives explicit confirmation ("Yes", "Confirm").',
    parameters: {
      type: Type.OBJECT,
      properties: {
        customerName: {
          type: Type.STRING,
          description: 'Customer full name',
        },
        customerPhone: {
          type: Type.STRING,
          description: 'Customer contact phone number (e.g. 03001234567)',
        },
        shippingAddress: {
          type: Type.STRING,
          description: 'Complete street address and house/flat number',
        },
        shippingCity: {
          type: Type.STRING,
          description: 'Destination city name (e.g., "Islamabad", "Lahore", "Karachi")',
        },
        paymentMethod: {
          type: Type.STRING,
          enum: ['cod', 'bank_transfer', 'online_card'],
          description: 'Payment method chosen by customer. Default is "cod"',
        },
        items: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              sku: { type: Type.STRING, description: 'Product SKU' },
              size: { type: Type.STRING, description: 'Selected size' },
              color: { type: Type.STRING, description: 'Selected color' },
              quantity: { type: Type.INTEGER, description: 'Quantity to order' },
            },
            required: ['sku', 'quantity'],
          },
          description: 'Array of products being purchased',
        },
      },
      required: ['customerName', 'customerPhone', 'shippingAddress', 'shippingCity', 'items'],
    },
  },
  {
    name: 'triggerHumanHandoff',
    description: 'Escalates the conversation to human staff and mutes the AI agent. Use when customer requests human, is upset, has dispute, or needs custom negotiation.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        reason: {
          type: Type.STRING,
          description: 'Specific reason for escalating to human agent',
        },
        urgency: {
          type: Type.STRING,
          enum: ['low', 'medium', 'high', 'critical'],
          description: 'Urgency level of this escalation',
        },
      },
      required: ['reason'],
    },
  },
  {
    name: 'scheduleFollowup',
    description: 'Schedules an automated re-engagement follow-up reminder if customer hesitates or stops responding.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        delayMinutes: {
          type: Type.INTEGER,
          description: 'Minutes to wait before follow-up message (e.g. 60 or 120)',
        },
        reason: {
          type: Type.STRING,
          description: 'Reason for the follow-up reminder',
        },
      },
      required: ['reason'],
    },
  },
];

// Tool Execution Dispatcher
export async function executeTool(
  name: string,
  args: Record<string, unknown>,
  context: { tenantId: string; conversationId: string }
): Promise<Record<string, unknown>> {
  const { tenantId, conversationId } = context;

  switch (name) {
    case 'searchProducts': {
      const params = args as unknown as SearchProductsParams;
      const products = await db.searchProducts(tenantId, params.query, params.category, params.maxPrice);
      if (products.length === 0) {
        return {
          found: false,
          message: `No products matching "${params.query}" were found. Suggest checking general categories or alternative keywords.`,
          products: [],
        };
      }
      return {
        found: true,
        count: products.length,
        products: products.map((p) => ({
          sku: p.sku,
          title: p.title,
          category: p.category,
          price: p.price,
          compareAtPrice: p.compare_at_price,
          stockTotal: p.stock_quantity,
          availableSizes: p.variants.map((v) => `${v.size || ''} (${v.stock} in stock)`).join(', '),
          description: p.description,
          imageUrl: p.images[0] || null,
        })),
      };
    }

    case 'checkInventory': {
      const params = args as unknown as CheckInventoryParams;
      const product = await db.getProductBySku(tenantId, params.sku);
      if (!product) {
        return {
          available: false,
          error: `Product with SKU "${params.sku}" was not found in catalog.`,
        };
      }

      if (params.size || params.color) {
        const variant = product.variants.find((v) => {
          const sizeMatch = !params.size || v.size?.toLowerCase() === params.size.toLowerCase();
          const colorMatch = !params.color || v.color?.toLowerCase() === params.color.toLowerCase();
          return sizeMatch && colorMatch;
        });

        if (!variant || variant.stock <= 0) {
          const availableAlternatives = product.variants
            .filter((v) => v.stock > 0)
            .map((v) => `${v.size || ''} ${v.color || ''} (${v.stock} left)`);
          return {
            available: false,
            sku: product.sku,
            title: product.title,
            requestedSize: params.size,
            requestedColor: params.color,
            stock: 0,
            price: product.price,
            message: `Size ${params.size || ''} ${params.color || ''} is currently out of stock.`,
            otherAvailableVariants: availableAlternatives,
          };
        }

        return {
          available: true,
          sku: product.sku,
          title: product.title,
          size: variant.size,
          color: variant.color,
          stock: variant.stock,
          price: product.price,
          compareAtPrice: product.compare_at_price,
          message: `In stock! ${variant.stock} units available in size ${variant.size}.`,
        };
      }

      return {
        available: product.stock_quantity > 0,
        sku: product.sku,
        title: product.title,
        totalStock: product.stock_quantity,
        price: product.price,
        variants: product.variants,
      };
    }

    case 'draftAndConfirmOrder': {
      const params = args as unknown as DraftOrderParams;
      const tenant = await db.getTenant(tenantId);

      // Validate items and calculate subtotal
      let subtotal = 0;
      const orderItems = [];

      for (const item of params.items) {
        const product = await db.getProductBySku(tenantId, item.sku);
        if (!product) {
          return {
            success: false,
            error: `Product SKU ${item.sku} does not exist.`,
          };
        }
        const itemPrice = product.price;
        subtotal += itemPrice * item.quantity;
        orderItems.push({
          sku: product.sku,
          title: product.title,
          size: item.size,
          color: item.color,
          qty: item.quantity,
          price: itemPrice,
        });
      }

      const shippingFee = subtotal >= tenant.free_delivery_threshold ? 0 : tenant.delivery_fee;
      const totalAmount = subtotal + shippingFee;
      const orderNumber = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
      const trackingNumber = `TCS-${Math.floor(100000 + Math.random() * 900000)}`;

      const order = await db.createOrder({
        tenant_id: tenantId,
        conversation_id: conversationId,
        order_number: orderNumber,
        customer_name: params.customerName,
        customer_phone: params.customerPhone,
        shipping_address: params.shippingAddress,
        shipping_city: params.shippingCity,
        subtotal,
        shipping_fee: shippingFee,
        total_amount: totalAmount,
        payment_method: (params.paymentMethod as PaymentMethod) || 'cod',
        status: 'confirmed',
        tracking_number: trackingNumber,
        items: orderItems,
      });

      return {
        success: true,
        orderId: order.id,
        orderNumber: order.order_number,
        trackingNumber: order.tracking_number,
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        shippingAddress: `${order.shipping_address}, ${order.shipping_city}`,
        subtotal,
        shippingFee,
        totalAmount,
        paymentMethod: order.payment_method.toUpperCase(),
        status: 'CONFIRMED',
        estimatedDelivery: '2 to 3 business days via TCS courier',
      };
    }

    case 'triggerHumanHandoff': {
      const params = args as unknown as TriggerHumanHandoffParams;
      await db.updateConversationStatus(conversationId, 'human_takeover', params.reason);
      return {
        escalated: true,
        status: 'human_takeover',
        reason: params.reason,
        urgency: params.urgency || 'medium',
        message: 'AI agent is now muted. Human staff have been notified on the live dashboard inbox.',
      };
    }

    case 'scheduleFollowup': {
      const params = args as unknown as ScheduleFollowupParams;
      const delayMinutes = params.delayMinutes || 120;
      const scheduledFor = new Date(Date.now() + delayMinutes * 60000).toISOString();

      const followUp = await db.createFollowUp({
        tenant_id: tenantId,
        conversation_id: conversationId,
        scheduled_for: scheduledFor,
        trigger_type: 'abandoned_interest',
        reminder_message: `Follow-up on ${params.reason}`,
        status: 'pending',
      });

      return {
        scheduled: true,
        followUpId: followUp.id,
        scheduledFor,
        delayMinutes,
      };
    }

    default:
      return { error: `Unknown tool name: ${name}` };
  }
}
