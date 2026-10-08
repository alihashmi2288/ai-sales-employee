# Product Requirements Document (PRD)
## AI Sales Employee — Autonomous Omnichannel Revenue Agent

---

## 1. Document Control & Metadata

| Field | Detail |
| :--- | :--- |
| **Product Name** | AI Sales Employee (Platform Code: `antigravity-sales-agent`) |
| **Document Version** | 1.0.0 (Foundational Architecture Baseline) |
| **Document Status** | Approved / Active Development |
| **Target Launch** | Phase 1 MVP |
| **Target Audience** | Engineering, Product, Founding Team, Stakeholders |
| **License / Cost Target** | 100% Free Tier ($0 Operating Cost Target for MVP) |

---

## 2. Executive Summary & Vision

### 2.1 The Problem
Retailers, direct-to-consumer (D2C) brands, e-commerce storefronts, and Cash-On-Delivery (COD) businesses in emerging and global markets face a systemic bottleneck in conversational commerce:
1. **Response Latency (The 2-Hour Drop-Off):** Customers inquiry on WhatsApp, Instagram, or web chat (asking *"Price?"*, *"Is Medium available?"*, *"Do you deliver to my city?"*). Delays over 5 minutes lead to immediate cart and conversation abandonment.
2. **High Labor Cost on Repetitive Queries:** 70–80% of daily incoming customer messages are low-complexity inquiries regarding product stock, sizing, price, delivery charges, and refund policies.
3. **Lost Orders & Zero Follow-Up:** Over 60% of interested buyers who ask questions never complete checkout because sales reps forget to follow up or lack automated abandoned-conversation recovery.
4. **Failure to Scale Spikes:** During marketing campaigns or sales events, human reps are overwhelmed, causing dropped chats, bad customer sentiment, and lost revenue.

### 2.2 The Solution
**AI Sales Employee** is not a static decision-tree chatbot. It is an **autonomous digital sales employee** built to emulate a high-performing retail sales associate:
- Engages customers in natural, multi-turn, bilingual/multilingual dialogue (Urdu, English, Roman Urdu, Arabic, Hindi, etc.).
- Proactively recommends matching products based on customer tastes and budget.
- Checks real-time stock levels, variants, and shipping times.
- Captures full customer order details (Name, Phone, Delivery Address, City, Payment Method) and confirms orders directly within the chat.
- Identifies hesitant shoppers and triggers scheduled follow-ups.
- Seamlessly hands off complex inquiries, disputes, or special negotiation requests to human representatives with context summaries.

---

## 3. Target Market & Personas

### 3.1 Primary Target Segments
1. **Direct-to-Consumer (D2C) E-commerce Brands:** Fashion, apparel, footwear, cosmetics, and jewelry sellers receiving 50–500 incoming chats/day.
2. **Social Commerce & COD Retailers:** Businesses operating via Instagram DM and WhatsApp in high Cash-On-Delivery regions (e.g., Pakistan, GCC, India, Southeast Asia).
3. **High-Ticket Local Services / Boutiques:** Tailors, furniture makers, clinic appointments, and service businesses needing qualification and calendar booking.

### 3.2 User Personas

| Persona | Role | Key Goals | Pain Points |
| :--- | :--- | :--- | :--- |
| **Tariq (Store Owner / Founder)** | Business Owner | Maximize revenue, reduce staff payroll, ensure 24/7 coverage, prevent lost leads. | Cannot hire night-shift sales reps; loses customers when away from phone. |
| **Ayesha (Customer Support / Sales Lead)** | Human Agent | Supervise automated chats, handle high-value VIP orders, resolve disputes. | Burnt out answering "price" 200 times a day; hard to track pending follow-ups. |
| **Zubair (Online Shopper)** | End Customer | Instant answers, accurate product recommendations, frictionless checkout in WhatsApp. | Annoyed by waiting hours for replies; hates filling out complex web forms. |

---

## 4. Value Proposition & Competitive Differentiation

```
Traditional Rule Chatbot               Generic LLM Wrapper                 AI Sales Employee
[ Rigid Button Flow ]                   [ Hallucinating Bot ]             [ Autonomous Revenue Agent ]
  • Breaks on open text                   • Gives false stock info          • Live inventory tool integration
  • Cannot understand slang               • Cannot create orders            • End-to-end order capture
  • Frustrating menus                     • Zero business guardrails        • Human takeover & safety gates
  • Zero memory                           • High token costs                • Follow-up & recovery engine
```

---

## 5. Functional Requirements (FR)

### FR-1: Natural Language Sales Consultation & Multilingual Support
- **FR-1.1:** The agent must understand natural language queries, slang, colloquialisms, and code-mixed dialects (e.g., Roman Urdu: *"Ye medium size black color me mil jayega?"*).
- **FR-1.2:** The agent must identify buying intent, product preference, budget, and urgency from unstructured messages.
- **FR-1.3:** The agent must present product suggestions with title, description, price, variant options, and direct image/media links.

### FR-2: Product Catalog & Real-Time Inventory Checks
- **FR-2.1:** Semantic search across product titles, tags, categories, and attributes using vector embeddings (`pgvector`).
- **FR-2.2:** Real-time verification of SKU availability, colors, and sizes before making sales promises.
- **FR-2.3:** Out-of-stock alternative suggestion: If requested size/color is sold out, suggest the closest matching in-stock alternative.

### FR-3: Conversational Order Capture & Checkout
- **FR-3.1:** Extract structured order parameters during natural dialogue:
  - Full Customer Name
  - Contact Phone Number (with format validation)
  - Delivery Street Address & City
  - Selected Product SKU(s), Size, Color, and Quantity
  - Preferred Payment Method (Cash on Delivery / Bank Transfer / Card)
- **FR-3.2:** Generate an Order Summary preview and request customer confirmation before locking the order.
- **FR-3.3:** Transition order state to `CONFIRMED` upon customer approval, generating a unique Tracking ID.

### FR-4: Human Escalation & Live Takeover Protocol
- **FR-4.1:** Automatic escalation triggers:
  - Customer sentiment turns hostile or mentions dispute/lawsuit/fraud.
  - Customer explicitly requests human (e.g., *"Let me talk to an agent"*).
  - Price bargaining exceeding configured agent discount threshold.
  - Three consecutive fallback turns where agent cannot fulfill request.
- **FR-4.2:** Instant notification to the Business Dashboard via real-time event bus.
- **FR-4.3:** Seamless handoff: When a human clicks **"Take Over"**, the AI agent transitions to `MUTED` state for that conversation. The human agent can type directly.

### FR-5: Automated Follow-Up & Abandoned Chat Recovery
- **FR-5.1:** If a customer initiates checkout or asks about a product but stops responding for a configurable window (e.g., 2 hours), trigger an intelligent follow-up.
- **FR-5.2:** Dynamic message tone: Soft nudge, limited stock alert, or free delivery voucher.
- **FR-5.3:** Cancellation rule: If the customer already placed an order or opted out, cancel pending follow-up timers immediately.

### FR-6: Business Owner Dashboard & Administration
- **FR-6.1 Live Inbox:** Real-time stream of all customer conversations categorized by status (`Active AI`, `Needs Human Attention`, `Human Handling`, `Resolved`).
- **FR-6.2 Catalog Manager:** Web interface to add, edit, upload CSV, and manage products and variants.
- **FR-6.3 Knowledge Base / FAQ Config:** Form to enter return policies, delivery zones, shipping fees, and company hours.
- **FR-6.4 Sales & Performance Analytics:** Daily revenue captured by AI, total conversations, human handoff rate, and conversion rate.

---

## 6. Non-Functional Requirements (NFR)

### NFR-1: Latency & Responsiveness
- **NFR-1.1:** First token response latency must be under **2.5 seconds** for standard text queries under normal network conditions.
- **NFR-1.2:** Database queries and tool execution (inventory lookup, order drafting) must complete in under **200 milliseconds**.

### NFR-2: Zero-Cost / Free-Tier Operational Constraints
- **NFR-2.1:** System must operate completely within free-tier quotas:
  - Google Gemini 2.5 Flash / 2.0 Flash via Google AI Studio API key (15 requests/minute free quota, 1M tokens/minute).
  - Supabase Free Tier (500MB PostgreSQL storage, 200 concurrent Realtime connections, 50,000 MAU auth).
  - Vercel Hobby Free Tier for the entire unified Next.js full-stack application (frontend + agent serverless route handlers).
  - Vercel Cron for automated background follow-up tasks at $0 cost.

### NFR-3: Security & Multi-Tenant Data Isolation
- **NFR-3.1:** Strict tenant separation using PostgreSQL Row-Level Security (`tenant_id`). No tenant may query or view another tenant's catalog, orders, or chats.
- **NFR-3.2:** Safe storage of third-party API credentials (Meta tokens, WhatsApp phone number IDs).
- **NFR-3.3:** Prompt injection defense: Agent system prompts must isolate customer text in sandboxed user turns, forbidding disclosure of internal system prompts or confidential profit margins.

### NFR-4: Availability & Reliability
- **NFR-4.1:** Stateless backend architecture allowing graceful restarts without losing ongoing conversation context.
- **NFR-4.2:** Webhook idempotency: WhatsApp webhook retries must be deduplicated using message ID keys in PostgreSQL.

---

## 7. User Stories

| ID | As a... | I want to... | So that... |
| :--- | :--- | :--- | :--- |
| **US-01** | Shopper | Ask for dress recommendations in my size and budget | I quickly find products without browsing hundreds of web pages. |
| **US-02** | Shopper | Place an order via chat using Cash on Delivery | I don't have to fill out clunky web checkout forms. |
| **US-03** | Store Owner | Have the AI answer customer messages at 2:00 AM | I capture late-night buyers who would otherwise buy from competitors. |
| **US-04** | Support Agent | Click "Take Over" to instantly talk to an angry customer | I prevent negative reviews and resolve sensitive issues immediately. |
| **US-05** | Store Owner | See daily statistics on AI sales and popular products | I know my ROI and understand what customers are demanding. |

---

## 8. Success Metrics & Key Performance Indicators (KPIs)

```
        PRIMARY SUCCESS METRIC:
        Automated Conversion Rate = (Orders Generated by AI / Total Active Conversations) >= 15%

        SUPPORTING METRICS:
        ┌─────────────────────────────┬───────────────────────────┬──────────────────────────┐
        │ Metric                      │ Target Benchmark          │ Measurement Method       │
        ├─────────────────────────────┼───────────────────────────┼──────────────────────────┤
        │ First Response Time (FRT)   │ < 3 seconds               │ Timestamp diff logging   │
        │ Autonomous Resolution Rate  │ > 80% without handoff     │ Conversation status flag │
        │ Order Completion Rate       │ > 70% of checkout intents │ Order funnel tracker     │
        │ Follow-Up Recovery Rate     │ > 12% of abandoned chats  │ Scheduled task log       │
        │ Zero-Cost Maintenance       │ $0/month in Phase 1 MVP   │ Cloud billing monitoring │
        └─────────────────────────────┴───────────────────────────┴──────────────────────────┘
```

---

## 9. Feature Scope & Phased Release Matrix

| Feature Module | MVP (Phase 1) | Phase 2 | Phase 3 (Scale) |
| :--- | :---: | :---: | :---: |
| **Autonomous Sales Agent Core** | Included | Included | Included |
| **Google Antigravity SDK Tooling** | Included | Included | Included |
| **Embeddable Web Chat Widget** | Included | Included | Included |
| **WhatsApp Cloud API Integration** | Included | Included | Included |
| **Next.js Live Dashboard & Inbox** | Included | Included | Included |
| **Manual Human Takeover (Mute AI)** | Included | Included | Included |
| **Product Catalog (CRUD + Vector)** | Included | Included | Included |
| **Basic Abandoned Follow-Ups** | Included | Included | Included |
| **Instagram Direct DM Integration** | Deferred | Included | Included |
| **Voice Note Processing (Audio Gemini)** | Deferred | Included | Included |
| **Photo / Screenshot Product Match** | Deferred | Included | Included |
| **Shopify / WooCommerce Direct Sync** | Deferred | Phase 2.5 | Included |
| **Multi-Agent Voice Phone Calling** | Deferred | Deferred | Phase 3 |
