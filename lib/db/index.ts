import {
  Tenant,
  Product,
  Conversation,
  Message,
  Order,
  FollowUp,
  ChannelType,
  ConversationStatus,
  OrderStatus,
  FollowupStatus,
} from '@/lib/types';
import { createClient } from '@supabase/supabase-js';

// Default Demo Tenant
export const DEFAULT_TENANT_ID = 'ten_luxury_apparel_001';

const defaultTenant: Tenant = {
  id: DEFAULT_TENANT_ID,
  business_name: 'Aura Fashion & Apparel',
  subdomain: 'aura-apparel',
  currency: 'PKR',
  delivery_fee: 200,
  free_delivery_threshold: 3000,
  return_policy_text: '7-day hassle-free doorstep size exchange. Parcel inspected by courier upon exchange.',
  system_instructions: 'You are Ayesha, the lead personal sales associate at Aura Fashion. Speak politely, naturally, and warmly. Emphasize Cash on Delivery (COD) trust and 7-day size exchange.',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Seed Products derived from Product knowlegde.md & Real World Apparel Catalog
const initialProducts: Product[] = [
  {
    id: 'prod_001',
    tenant_id: DEFAULT_TENANT_ID,
    sku: 'SHIRT-BLK-CAS',
    title: 'Classic Summer Cotton Shirt - Obsidian Black',
    description: '100% breathable combed cotton casual button-up shirt with anti-crease finish. Perfect for warm climate and versatile styling.',
    category: 'Shirts',
    price: 2450,
    compare_at_price: 3200,
    stock_quantity: 18,
    variants: [
      { size: 'S', color: 'Black', stock: 4, sku: 'SHIRT-BLK-CAS-S' },
      { size: 'M', color: 'Black', stock: 6, sku: 'SHIRT-BLK-CAS-M' },
      { size: 'L', color: 'Black', stock: 5, sku: 'SHIRT-BLK-CAS-L' },
      { size: 'XL', color: 'Black', stock: 3, sku: 'SHIRT-BLK-CAS-XL' },
    ],
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    ],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod_002',
    tenant_id: DEFAULT_TENANT_ID,
    sku: 'SHIRT-OXF-WHT',
    title: 'Executive Oxford Slim-Fit Shirt - Crisp White',
    description: 'Tailored formal Oxford woven shirt crafted from double-ply Egyptian cotton yarn. Ideal for business and dinner events.',
    category: 'Shirts',
    price: 2850,
    compare_at_price: 3600,
    stock_quantity: 14,
    variants: [
      { size: 'S', color: 'White', stock: 3, sku: 'SHIRT-OXF-WHT-S' },
      { size: 'M', color: 'White', stock: 5, sku: 'SHIRT-OXF-WHT-M' },
      { size: 'L', color: 'White', stock: 4, sku: 'SHIRT-OXF-WHT-L' },
      { size: 'XL', color: 'White', stock: 2, sku: 'SHIRT-OXF-WHT-XL' },
    ],
    images: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
    ],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod_003',
    tenant_id: DEFAULT_TENANT_ID,
    sku: 'POLO-NVY-PIQ',
    title: 'Vintage Pique Polo - Midnight Navy',
    description: 'Classic heavy-knit pique cotton polo shirt featuring mother-of-pearl buttons and ribbed collar cuffs.',
    category: 'Polos',
    price: 1950,
    compare_at_price: 2500,
    stock_quantity: 22,
    variants: [
      { size: 'M', color: 'Navy', stock: 10, sku: 'POLO-NVY-PIQ-M' },
      { size: 'L', color: 'Navy', stock: 8, sku: 'POLO-NVY-PIQ-L' },
      { size: 'XL', color: 'Navy', stock: 4, sku: 'POLO-NVY-PIQ-XL' },
    ],
    images: [
      'https://images.unsplash.com/photo-1625910513413-7e5d89fdfec9?auto=format&fit=crop&w=800&q=80',
    ],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod_004',
    tenant_id: DEFAULT_TENANT_ID,
    sku: 'CHINO-BEI-STR',
    title: 'Flex-Stretch Smart Chinos - Desert Beige',
    description: 'Cotton-twill stretch trousers designed with hidden flex waistband for all-day mobility.',
    category: 'Trousers',
    price: 3200,
    compare_at_price: 3900,
    stock_quantity: 12,
    variants: [
      { size: '30', color: 'Beige', stock: 3, sku: 'CHINO-BEI-STR-30' },
      { size: '32', color: 'Beige', stock: 5, sku: 'CHINO-BEI-STR-32' },
      { size: '34', color: 'Beige', stock: 4, sku: 'CHINO-BEI-STR-34' },
    ],
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80',
    ],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod_005',
    tenant_id: DEFAULT_TENANT_ID,
    sku: 'ACC-POK-SILK',
    title: 'Hand-Rolled Silk Pocket Square - Paisley Gold',
    description: '100% mulberry silk pocket square. Perfect add-on accessory to unlock free delivery threshold!',
    category: 'Accessories',
    price: 650,
    compare_at_price: 900,
    stock_quantity: 35,
    variants: [
      { size: 'One Size', color: 'Gold', stock: 35, sku: 'ACC-POK-SILK-OS' },
    ],
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    ],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod_006',
    tenant_id: DEFAULT_TENANT_ID,
    sku: 'DENIM-IND-SEL',
    title: 'Raw Selvedge Denim Jeans - Deep Indigo',
    description: '13.5oz authentic Japanese selvedge denim with copper rivets and button fly closure.',
    category: 'Denim',
    price: 4200,
    compare_at_price: 5200,
    stock_quantity: 9,
    variants: [
      { size: '32', color: 'Indigo', stock: 4, sku: 'DENIM-IND-SEL-32' },
      { size: '34', color: 'Indigo', stock: 3, sku: 'DENIM-IND-SEL-34' },
      { size: '36', color: 'Indigo', stock: 2, sku: 'DENIM-IND-SEL-36' },
    ],
    images: [
      'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
    ],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Seed Orders for immediate live dashboard visualization
const initialOrders: Order[] = [
  {
    id: 'ord_001',
    tenant_id: DEFAULT_TENANT_ID,
    order_number: 'ORD-84920',
    customer_name: 'Usman Ali',
    customer_phone: '03001234567',
    shipping_address: 'House 42, Street 5, Sector F-7/2',
    shipping_city: 'Islamabad',
    subtotal: 2450,
    shipping_fee: 200,
    total_amount: 2650,
    payment_method: 'cod',
    status: 'confirmed',
    tracking_number: 'TCS-892173',
    items: [
      {
        sku: 'SHIRT-BLK-CAS',
        title: 'Classic Summer Cotton Shirt - Obsidian Black',
        size: 'M',
        color: 'Black',
        qty: 1,
        price: 2450,
      },
    ],
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'ord_002',
    tenant_id: DEFAULT_TENANT_ID,
    order_number: 'ORD-84921',
    customer_name: 'Hamza Khan',
    customer_phone: '03219876543',
    shipping_address: 'Flat 304, Al-Madina Heights, Gulberg III',
    shipping_city: 'Lahore',
    subtotal: 3500,
    shipping_fee: 0,
    total_amount: 3500,
    payment_method: 'cod',
    status: 'dispatched',
    tracking_number: 'LPD-451290',
    items: [
      {
        sku: 'SHIRT-OXF-WHT',
        title: 'Executive Oxford Slim-Fit Shirt - Crisp White',
        size: 'L',
        color: 'White',
        qty: 1,
        price: 2850,
      },
      {
        sku: 'ACC-POK-SILK',
        title: 'Hand-Rolled Silk Pocket Square - Paisley Gold',
        size: 'One Size',
        color: 'Gold',
        qty: 1,
        price: 650,
      },
    ],
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
];

// In-Memory Global Store (Persists during Node server lifespan, resilient without DB)
interface StoreState {
  tenant: Tenant;
  products: Product[];
  conversations: Map<string, Conversation>;
  messages: Map<string, Message[]>;
  orders: Order[];
  followUps: FollowUp[];
}

declare global {
  // eslint-disable-next-line no-var
  var __AI_SALES_STORE__: StoreState | undefined;
}

function getStore(): StoreState {
  if (!global.__AI_SALES_STORE__) {
    const initialConversations = new Map<string, Conversation>();
    const initialMessages = new Map<string, Message[]>();

    // Initial demo conversation
    const demoConvId = 'conv_demo_001';
    const conv: Conversation = {
      id: demoConvId,
      tenant_id: DEFAULT_TENANT_ID,
      channel: 'web_widget',
      customer_identifier: 'demo_user_1',
      customer_name: 'Zubair Farooq',
      status: 'active_ai',
      last_message_at: new Date().toISOString(),
      created_at: new Date(Date.now() - 1800000).toISOString(),
    };
    initialConversations.set(demoConvId, conv);

    initialMessages.set(demoConvId, [
      {
        id: 'msg_001',
        conversation_id: demoConvId,
        tenant_id: DEFAULT_TENANT_ID,
        sender: 'customer',
        content: 'AOA, Black cotton shirt medium me available hai?',
        created_at: new Date(Date.now() - 1750000).toISOString(),
      },
      {
        id: 'msg_002',
        conversation_id: demoConvId,
        tenant_id: DEFAULT_TENANT_ID,
        sender: 'agent',
        content: 'Walaikum Assalam! Jee bilkul, hamari Classic Summer Cotton Shirt (Black) Medium size me in-stock hai for PKR 2,450. Cash on Delivery available hai. Kya main aapke liye book kar doon?',
        created_at: new Date(Date.now() - 1700000).toISOString(),
      },
    ]);

    global.__AI_SALES_STORE__ = {
      tenant: defaultTenant,
      products: [...initialProducts],
      conversations: initialConversations,
      messages: initialMessages,
      orders: [...initialOrders],
      followUps: [],
    };
  }
  return global.__AI_SALES_STORE__;
}

// Optional Supabase Client initialization
function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key && url.startsWith('http') && !url.includes('your-project')) {
    try {
      return createClient(url, key);
    } catch {
      return null;
    }
  }
  return null;
}

// ============================================================================
// DATABASE REPOSITORY FUNCTIONS
// ============================================================================

export async function getTenant(id = DEFAULT_TENANT_ID): Promise<Tenant> {
  const supa = getSupabaseClient();
  if (supa) {
    const { data } = await supa.from('tenants').select('*').eq('id', id).single();
    if (data) return data as Tenant;
  }
  return getStore().tenant;
}

export async function updateTenant(updates: Partial<Tenant>): Promise<Tenant> {
  const store = getStore();
  store.tenant = { ...store.tenant, ...updates, updated_at: new Date().toISOString() };
  return store.tenant;
}

export async function searchProducts(
  tenantId: string,
  query: string,
  category?: string,
  maxPrice?: number
): Promise<Product[]> {
  const store = getStore();
  const q = query.toLowerCase().trim();

  let results = store.products.filter((p) => p.is_active);

  if (category) {
    const cat = category.toLowerCase();
    results = results.filter((p) => p.category.toLowerCase().includes(cat));
  }

  if (maxPrice && maxPrice > 0) {
    results = results.filter((p) => p.price <= maxPrice);
  }

  if (q) {
    results = results.filter((p) => {
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchSku = p.sku.toLowerCase().includes(q);
      const matchVariants = p.variants.some((v) =>
        (v.color && v.color.toLowerCase().includes(q)) ||
        (v.size && v.size.toLowerCase().includes(q))
      );
      // Basic token match
      const words = q.split(/\s+/).filter(Boolean);
      const matchWords = words.some((w) =>
        p.title.toLowerCase().includes(w) ||
        p.category.toLowerCase().includes(w) ||
        p.description.toLowerCase().includes(w)
      );
      return matchTitle || matchDesc || matchSku || matchVariants || matchWords;
    });
  }

  return results;
}

export async function getProductBySku(tenantId: string, sku: string): Promise<Product | null> {
  const store = getStore();
  const cleanSku = sku.trim().toLowerCase();
  const prod = store.products.find(
    (p) => p.sku.toLowerCase() === cleanSku || p.sku.toLowerCase().startsWith(cleanSku)
  );
  return prod || null;
}

export async function updateProductStock(
  tenantId: string,
  sku: string,
  size?: string,
  color?: string,
  qtySold = 1
): Promise<boolean> {
  const store = getStore();
  const prod = store.products.find((p) => p.sku.toLowerCase() === sku.toLowerCase());
  if (!prod) return false;

  if (size || color) {
    const variant = prod.variants.find((v) => {
      const matchSize = !size || v.size?.toLowerCase() === size.toLowerCase();
      const matchColor = !color || v.color?.toLowerCase() === color.toLowerCase();
      return matchSize && matchColor;
    });
    if (variant && variant.stock >= qtySold) {
      variant.stock -= qtySold;
      prod.stock_quantity = Math.max(0, prod.stock_quantity - qtySold);
      return true;
    }
  }

  if (prod.stock_quantity >= qtySold) {
    prod.stock_quantity -= qtySold;
    return true;
  }

  return false;
}

export async function getAllProducts(tenantId = DEFAULT_TENANT_ID): Promise<Product[]> {
  return getStore().products;
}

export async function upsertProduct(product: Partial<Product>): Promise<Product> {
  const store = getStore();
  const existingIdx = store.products.findIndex((p) => p.id === product.id || p.sku === product.sku);

  if (existingIdx >= 0) {
    store.products[existingIdx] = {
      ...store.products[existingIdx],
      ...product,
      updated_at: new Date().toISOString(),
    } as Product;
    return store.products[existingIdx];
  }

  const newProd: Product = {
    id: product.id || `prod_${Date.now()}`,
    tenant_id: product.tenant_id || DEFAULT_TENANT_ID,
    sku: product.sku || `SKU-${Date.now()}`,
    title: product.title || 'Untitled Product',
    description: product.description || '',
    category: product.category || 'General',
    price: product.price || 0,
    compare_at_price: product.compare_at_price,
    stock_quantity: product.stock_quantity || 0,
    variants: product.variants || [],
    images: product.images || [],
    is_active: product.is_active ?? true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  store.products.unshift(newProd);
  return newProd;
}

export async function getOrCreateConversation(
  tenantId: string,
  channel: ChannelType,
  customerIdentifier: string,
  customerName?: string
): Promise<Conversation> {
  const store = getStore();
  for (const conv of store.conversations.values()) {
    if (
      conv.tenant_id === tenantId &&
      conv.channel === channel &&
      conv.customer_identifier === customerIdentifier
    ) {
      if (customerName && !conv.customer_name) {
        conv.customer_name = customerName;
      }
      return conv;
    }
  }

  const newId = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newConv: Conversation = {
    id: newId,
    tenant_id: tenantId,
    channel,
    customer_identifier: customerIdentifier,
    customer_name: customerName,
    status: 'active_ai',
    last_message_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  };

  store.conversations.set(newId, newConv);
  store.messages.set(newId, []);
  return newConv;
}

export async function getConversationById(id: string): Promise<Conversation | null> {
  const store = getStore();
  return store.conversations.get(id) || null;
}

export async function getAllConversations(tenantId = DEFAULT_TENANT_ID): Promise<Conversation[]> {
  const store = getStore();
  return Array.from(store.conversations.values())
    .filter((c) => c.tenant_id === tenantId)
    .sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime());
}

export async function updateConversationStatus(
  id: string,
  status: ConversationStatus,
  handoffReason?: string
): Promise<Conversation | null> {
  const store = getStore();
  const conv = store.conversations.get(id);
  if (!conv) return null;

  conv.status = status;
  if (handoffReason) {
    conv.handoff_reason = handoffReason;
  }
  return conv;
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const store = getStore();
  return store.messages.get(conversationId) || [];
}

export async function saveMessage(
  msg: Omit<Message, 'id' | 'created_at'>
): Promise<Message> {
  const store = getStore();
  const newMessage: Message = {
    ...msg,
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    created_at: new Date().toISOString(),
  };

  let list = store.messages.get(msg.conversation_id);
  if (!list) {
    list = [];
    store.messages.set(msg.conversation_id, list);
  }
  list.push(newMessage);

  // Update conversation last_message_at
  const conv = store.conversations.get(msg.conversation_id);
  if (conv) {
    conv.last_message_at = newMessage.created_at;
  }

  return newMessage;
}

export async function createOrder(
  order: Omit<Order, 'id' | 'created_at' | 'updated_at'>
): Promise<Order> {
  const store = getStore();
  const newOrder: Order = {
    ...order,
    id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  store.orders.unshift(newOrder);

  // Auto-deduct stock
  for (const item of newOrder.items) {
    await updateProductStock(order.tenant_id, item.sku, item.size, item.color, item.qty);
  }

  return newOrder;
}

export async function getOrders(tenantId = DEFAULT_TENANT_ID): Promise<Order[]> {
  const store = getStore();
  return store.orders.filter((o) => o.tenant_id === tenantId);
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | null> {
  const store = getStore();
  const ord = store.orders.find((o) => o.id === orderId || o.order_number === orderId);
  if (!ord) return null;
  ord.status = status;
  ord.updated_at = new Date().toISOString();
  return ord;
}

export async function createFollowUp(
  followUp: Omit<FollowUp, 'id' | 'created_at'>
): Promise<FollowUp> {
  const store = getStore();
  const newFollow: FollowUp = {
    ...followUp,
    id: `fol_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    created_at: new Date().toISOString(),
  };
  store.followUps.push(newFollow);
  return newFollow;
}

export async function getDueFollowUps(): Promise<FollowUp[]> {
  const store = getStore();
  const now = new Date().getTime();
  return store.followUps.filter(
    (f) => f.status === 'pending' && new Date(f.scheduled_for).getTime() <= now
  );
}

export async function updateFollowUpStatus(id: string, status: FollowupStatus): Promise<void> {
  const store = getStore();
  const f = store.followUps.find((item) => item.id === id);
  if (f) {
    f.status = status;
  }
}
