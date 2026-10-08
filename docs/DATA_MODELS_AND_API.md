# Data Models, Tool Schemas & API Specifications (LLD)
## AI Sales Employee — Low-Level Technical Blueprint (100% Vercel & TypeScript)

---

## 1. Database Schema & Relational DDL (PostgreSQL 16 + pgvector)

The database schema is hosted on Supabase (Free Tier) with PostgreSQL 16, pgvector for semantic search, and native Row-Level Security (RLS).

```sql
-- ============================================================================
-- EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ============================================================================
-- ENUM TYPES
-- ============================================================================
CREATE TYPE channel_type AS ENUM ('web_widget', 'whatsapp', 'instagram');
CREATE TYPE conversation_status AS ENUM ('active_ai', 'human_takeover', 'resolved', 'archived');
CREATE TYPE message_sender AS ENUM ('customer', 'agent', 'human_staff', 'system');
CREATE TYPE order_status AS ENUM ('draft', 'confirmed', 'processing', 'dispatched', 'delivered', 'cancelled');
CREATE TYPE payment_method AS ENUM ('cod', 'bank_transfer', 'online_card');
CREATE TYPE followup_status AS ENUM ('pending', 'executed', 'cancelled');

-- ============================================================================
-- 1. TENANTS (Stores / Businesses)
-- ============================================================================
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    currency VARCHAR(10) DEFAULT 'PKR',
    delivery_fee NUMERIC(10, 2) DEFAULT 200.00,
    free_delivery_threshold NUMERIC(10, 2) DEFAULT 3000.00,
    return_policy_text TEXT,
    system_instructions TEXT,
    whatsapp_phone_number_id VARCHAR(100),
    whatsapp_access_token TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. PRODUCTS & INVENTORY
-- ============================================================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    sku VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    price NUMERIC(10, 2) NOT NULL,
    compare_at_price NUMERIC(10, 2),
    stock_quantity INT DEFAULT 0,
    variants JSONB DEFAULT '[]'::jsonb, -- e.g. [{"size": "M", "color": "Black", "stock": 5}]
    images JSONB DEFAULT '[]'::jsonb,   -- e.g. ["https://.../img1.jpg"]
    embedding vector(768),              -- Gemini text-embedding-004 (768-dim)
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_tenant_sku UNIQUE (tenant_id, sku)
);

CREATE INDEX idx_products_tenant ON products(tenant_id);
CREATE INDEX idx_products_embedding ON products USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ============================================================================
-- 3. CONVERSATIONS
-- ============================================================================
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    channel channel_type NOT NULL DEFAULT 'web_widget',
    customer_identifier VARCHAR(255) NOT NULL, -- Phone number for WhatsApp, session token for web
    customer_name VARCHAR(255),
    status conversation_status NOT NULL DEFAULT 'active_ai',
    handoff_reason VARCHAR(255),
    assigned_human_id VARCHAR(255),
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_tenant_customer UNIQUE (tenant_id, channel, customer_identifier)
);

CREATE INDEX idx_conversations_tenant_status ON conversations(tenant_id, status);

-- ============================================================================
-- 4. MESSAGES
-- ============================================================================
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    sender message_sender NOT NULL,
    content TEXT NOT NULL,
    media_url TEXT,
    raw_payload JSONB,
    tokens_used INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at ASC);

-- ============================================================================
-- 5. ORDERS
-- ============================================================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
    order_number VARCHAR(50) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_city VARCHAR(100) NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    shipping_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_method payment_method NOT NULL DEFAULT 'cod',
    status order_status NOT NULL DEFAULT 'confirmed',
    tracking_number VARCHAR(100),
    items JSONB NOT NULL, -- [{"sku": "JKT-01", "title": "Black Jacket", "size": "M", "qty": 1, "price": 4500}]
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_tenant_order_number UNIQUE (tenant_id, order_number)
);

CREATE INDEX idx_orders_tenant ON orders(tenant_id, status);

-- ============================================================================
-- 6. FOLLOW-UP TASKS
-- ============================================================================
CREATE TABLE follow_ups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    scheduled_for TIMESTAMPTZ NOT NULL,
    trigger_type VARCHAR(100) NOT NULL, -- 'abandoned_cart', 'check_satisfaction'
    reminder_message TEXT,
    status followup_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_followups_pending ON follow_ups(status, scheduled_for) WHERE status = 'pending';
```

---

## 2. Gemini Function Declarations (`@google/genai` TypeScript SDK)

In the 100% Vercel architecture, agent tools are defined using the official Google Gen AI TypeScript SDK function declarations and executed within the Next.js serverless route handler.

```typescript
import { FunctionDeclaration, Type } from '@google/genai';

export const agentTools: FunctionDeclaration[] = [
  {
    name: 'searchProducts',
    description: 'Searches the store catalog for products matching a natural language query or category.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        query: {
          type: Type.STRING,
          description: 'Product search terms (e.g., "black dress", "summer polo", "leather wallet")',
        },
        category: {
          type: Type.STRING,
          description: 'Optional category filter (e.g., "Men", "Women", "Accessories")',
        },
        maxPrice: {
          type: Type.NUMBER,
          description: 'Maximum budget or price filter in store currency',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'checkInventory',
    description: 'Checks real-time stock levels, sizes, and colors for a specific product SKU.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        sku: {
          type: Type.STRING,
          description: 'The unique product SKU identifier',
        },
        size: {
          type: Type.STRING,
          description: 'Size variant requested (e.g., "S", "M", "L", "XL")',
        },
        color: {
          type: Type.STRING,
          description: 'Color variant requested (e.g., "Black", "Navy")',
        },
      },
      required: ['sku'],
    },
  },
  {
    name: 'draftAndConfirmOrder',
    description: 'Creates and confirms a customer order after all details (name, phone, address, items) are collected.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        customerName: { type: Type.STRING, description: 'Customer full name' },
        customerPhone: { type: Type.STRING, description: 'Customer contact phone number' },
        shippingAddress: { type: Type.STRING, description: 'Full shipping street address' },
        shippingCity: { type: Type.STRING, description: 'City name for courier shipping' },
        paymentMethod: { 
          type: Type.STRING, 
          enum: ['cod', 'bank_transfer', 'online_card'],
          description: 'Payment method chosen by customer' 
        },
        items: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              sku: { type: Type.STRING },
              size: { type: Type.STRING },
              color: { type: Type.STRING },
              quantity: { type: Type.INTEGER },
            },
            required: ['sku', 'quantity'],
          },
          description: 'List of product items to order',
        },
      },
      required: ['customerName', 'customerPhone', 'shippingAddress', 'shippingCity', 'items'],
    },
  },
  {
    name: 'triggerHumanHandoff',
    description: 'Escalates the conversation to human staff and mutes the AI agent.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        reason: {
          type: Type.STRING,
          description: 'Reason for handoff (e.g., "Customer angry regarding late delivery", "Requested manager")',
        },
        urgency: {
          type: Type.STRING,
          enum: ['low', 'medium', 'high', 'critical'],
          description: 'Urgency priority level',
        },
      },
      required: ['reason'],
    },
  },
  {
    name: 'scheduleFollowup',
    description: 'Schedules an automated re-engagement message if the customer abandons the conversation.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        delayMinutes: {
          type: Type.INTEGER,
          description: 'Minutes to wait before sending reminder (default: 120)',
        },
        reason: {
          type: Type.STRING,
          description: 'Reason for follow-up (e.g., "abandoned_checkout", "pending_address")',
        },
      },
      required: ['reason'],
    },
  },
];
```

---

## 3. Next.js Serverless Route Endpoints (Vercel Native)

### 3.1 WhatsApp Webhook Route (`app/api/webhooks/whatsapp/route.ts`)
- **GET:** Handles Meta webhook handshake challenge (`hub.challenge`).
- **POST:** Ingests customer messages, verifies `X-Hub-Signature-256`, executes the Gemini agent turn, and replies back via Meta Graph API.

### 3.2 Web Chat Widget Route (`app/api/chat/message/route.ts`)
- **POST:** Ingests web chat widget turns, calls Gemini agent with tools, returns reply and suggested action chips.

### 3.3 Vercel Cron Follow-Up Route (`app/api/cron/follow-ups/route.ts`)
- **GET:** Triggered automatically every 10–30 minutes by Vercel Cron.
- **Security:** Verifies `Authorization: Bearer ${CRON_SECRET}`.
- **Action:** Queries due rows in `follow_ups`, sends reminder messages via WhatsApp/Widget, marks task as `executed`.

### 3.4 Dashboard Human Takeover Route (`app/api/conversations/[id]/takeover/route.ts`)
- **POST:** Updates conversation status to `human_takeover`, muting the AI.
- **POST** (`.../reply`): Dispatches human agent message directly to customer.
- **POST** (`.../resume`): Re-enables the AI agent.
