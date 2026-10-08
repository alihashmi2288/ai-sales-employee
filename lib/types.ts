export type ChannelType = 'web_widget' | 'whatsapp' | 'instagram';
export type ConversationStatus = 'active_ai' | 'human_takeover' | 'resolved' | 'archived';
export type MessageSender = 'customer' | 'agent' | 'human_staff' | 'system';
export type PaymentMethod = 'cod' | 'bank_transfer' | 'online_card';
export type OrderStatus = 'draft' | 'confirmed' | 'processing' | 'dispatched' | 'delivered' | 'cancelled';
export type FollowupStatus = 'pending' | 'executed' | 'cancelled';

export interface Tenant {
  id: string;
  business_name: string;
  subdomain: string;
  currency: string;
  delivery_fee: number;
  free_delivery_threshold: number;
  return_policy_text: string;
  system_instructions: string;
  whatsapp_phone_number_id?: string;
  whatsapp_access_token?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  size?: string;
  color?: string;
  stock: number;
  sku?: string;
}

export interface Product {
  id: string;
  tenant_id: string;
  sku: string;
  title: string;
  description: string;
  category: string;
  price: number;
  compare_at_price?: number;
  stock_quantity: number;
  variants: ProductVariant[];
  images: string[];
  is_active: boolean;
  embedding?: number[];
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  tenant_id: string;
  channel: ChannelType;
  customer_identifier: string;
  customer_name?: string;
  status: ConversationStatus;
  handoff_reason?: string;
  assigned_human_id?: string;
  last_message_at: string;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  tenant_id: string;
  sender: MessageSender;
  content: string;
  media_url?: string;
  raw_payload?: Record<string, unknown>;
  tokens_used?: number;
  created_at: string;
}

export interface OrderItem {
  sku: string;
  title: string;
  size?: string;
  color?: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  tenant_id: string;
  conversation_id?: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  shipping_address: string;
  shipping_city: string;
  subtotal: number;
  shipping_fee: number;
  total_amount: number;
  payment_method: PaymentMethod;
  status: OrderStatus;
  tracking_number?: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface FollowUp {
  id: string;
  tenant_id: string;
  conversation_id: string;
  scheduled_for: string;
  trigger_type: string;
  reminder_message?: string;
  status: FollowupStatus;
  created_at: string;
}

// Tool Parameter & Response Types
export interface SearchProductsParams {
  query: string;
  category?: string;
  maxPrice?: number;
}

export interface CheckInventoryParams {
  sku: string;
  size?: string;
  color?: string;
}

export interface DraftOrderParams {
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  paymentMethod?: PaymentMethod;
  items: Array<{
    sku: string;
    size?: string;
    color?: string;
    quantity: number;
  }>;
}

export interface TriggerHumanHandoffParams {
  reason: string;
  urgency?: 'low' | 'medium' | 'high' | 'critical';
}

export interface ScheduleFollowupParams {
  delayMinutes?: number;
  reason: string;
}
