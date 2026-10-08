# Development Roadmap & Sprint Execution Plan
## AI Sales Employee — 100% Vercel Native Zero-Cost Launch

---

## 1. Executive Roadmap Overview

The delivery plan is organized into **5 progressive milestones** designed to achieve a rapid, working, zero-cost MVP deployed completely to **Vercel Hobby ($0/mo)** and **Supabase ($0/mo)**.

```
┌─────────────────┐     ┌──────────────────┐     ┌───────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Milestone 1   │     │   Milestone 2    │     │    Milestone 3    │     │   Milestone 4    │     │   Milestone 5   │
│ Next.js Core &  │ ──► │ Web Widget & Live│ ──► │ Merchant Dashboard│ ──► │  WhatsApp Cloud  │ ──► │ Production 100% │
│  Gemini Tools   │     │  Test Simulator  │     │  & Live Takeover  │     │ API & Cron Engine│     │ Vercel Launch   │
│   (Weeks 1-2)   │     │   (Weeks 3-4)    │     │    (Weeks 5-6)    │     │   (Weeks 7-8)    │     │   (Weeks 9-10)  │
└─────────────────┘     └──────────────────┘     └───────────────────┘     └──────────────────┘     └─────────────────┘
```

---

## 2. Detailed Milestone Specifications

### Milestone 1: Next.js Foundation, `@google/genai` & Agent Tools (Weeks 1–2)
**Goal:** A working Next.js project with official `@google/genai` TypeScript SDK integration, executing autonomous tool calls (searching products, checking stock, and drafting orders).

- [x] **Architecture & Requirements Alignment:** Complete PRD, System Architecture, Data Models, Prompt Specs, Deployment Runbook, and Roadmap.
- [ ] **Next.js 15 Project Setup:** Scaffold Next.js 15 (TypeScript, App Router, Tailwind CSS, `@google/genai`, `@supabase/supabase-js`, `lucide-react`).
- [ ] **Agent Persona & Prompt Integration:** Implement system instructions in `lib/agent/prompt.ts` defining the polite, consultative, sales-driven persona (handling Urdu, Roman Urdu, English, COD policies, and objection handling).
- [ ] **TypeScript Tool Handlers:**
  - `searchProducts(query, category, maxPrice)`
  - `checkInventory(sku, size, color)`
  - `draftAndConfirmOrder(customerName, phone, address, city, items)`
  - `triggerHumanHandoff(reason, urgency)`
  - `scheduleFollowup(delayMinutes, reason)`
- [ ] **Agent Test Harness Route (`/api/test-agent`):** Test route executing multi-turn tool-calling sessions with Google Gemini 2.5 Flash via Google AI Studio API key.
- **Definition of Done (DoD):** A simulated shopper turn triggers inventory lookup, pricing calculation, and order drafting with verified JSON outputs.

---

### Milestone 2: Embeddable Web Chat Widget & Storefront Simulator (Weeks 3–4)
**Goal:** A customer-facing conversational web widget and browser-based demo storefront for instant zero-friction testing without third-party API dependencies.

- [ ] **Chat Route Handler (`app/api/chat/message/route.ts`):** Edge-compatible serverless route processing customer turns and streaming back replies.
- [ ] **Embeddable Web Widget Component (`components/widget/ChatWidget.tsx`):**
  - Lightweight, responsive floating chat button and conversation drawer.
  - Supports Markdown rendering, product image previews, and suggested quick-reply chips.
- [ ] **Storefront Simulator Page (`app/demo/page.tsx`):**
  - A clean mockup e-commerce storefront showcasing products where the chat widget can be tested live.
- **Definition of Done (DoD):** Anyone can visit `/demo`, open the chat bubble, ask for clothing in their size, provide a delivery address, and receive an order confirmation tracking number.

---

### Milestone 3: Merchant Dashboard & Real-Time Human Takeover (Weeks 5–6)
**Goal:** The merchant management portal allowing business owners to monitor conversations in real-time, inspect orders, and take over chats immediately.

- [ ] **Live Conversation Feed (`app/dashboard/inbox/page.tsx`):**
  - Real-time inbox powered by Supabase Realtime WebSockets, categorizing chats into `Active AI`, `Needs Handoff`, `Human Takeover`, and `Resolved`.
- [ ] **One-Click Human Takeover:**
  - Button to toggle `Take Over` (calls `/api/conversations/[id]/takeover`, muting the AI agent).
  - Manual message input allowing human staff to chat directly with the shopper.
  - Button to `Resume AI` once human consultation concludes.
- [ ] **Catalog & Inventory Manager (`app/dashboard/catalog/page.tsx`):**
  - CRUD interface to add products, upload images, set sizes/colors, and manage stock.
- [ ] **Order Tracking Table (`app/dashboard/orders/page.tsx`):**
  - Real-time list of all captured COD and prepaid orders.
- **Definition of Done (DoD):** A store owner watching a live chat can click "Take Over", send a manual reply, and see the AI remain paused until "Resume AI" is clicked.

---

### Milestone 4: WhatsApp Cloud API & Vercel Cron Follow-Up Engine (Weeks 7–8)
**Goal:** Connect to WhatsApp Cloud API and deploy automated abandoned cart recovery via Vercel Cron.

- [ ] **Meta WhatsApp Webhook (`app/api/webhooks/whatsapp/route.ts`):**
  - Handles `GET` challenge handshake and `POST` inbound message payloads.
  - Verifies `X-Hub-Signature-256` HMAC sha256 header.
  - Sends outgoing WhatsApp replies using the Meta Graph API client.
- [ ] **Vercel Cron Configuration (`vercel.json`):**
  - Configures cron job hitting `/api/cron/follow-ups` every 10–30 minutes.
- [ ] **Automated Recovery Route (`app/api/cron/follow-ups/route.ts`):**
  - Verifies `Authorization: Bearer ${CRON_SECRET}`.
  - Dispatches automated WhatsApp/Widget reminders for conversations inactive > 2 hours.
- **Definition of Done (DoD):** Real WhatsApp messages sent from a mobile phone receive AI replies within 2.5s, complete orders, and receive automated follow-ups if abandoned.

---

### Milestone 5: 100% Vercel Production Deployment & Supabase Migration (Weeks 9–10)
**Goal:** One-click deployment from GitHub to Vercel Hobby ($0/mo) and Supabase Free Tier ($0/mo).

- [ ] **Supabase Cloud Database Setup:** Run SQL DDL migrations with `pgvector` enabled and configure Supabase Auth.
- [ ] **Vercel Project Deployment:** Link GitHub repo to Vercel, configure environment variables (`GEMINI_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `META_ACCESS_TOKEN`, `CRON_SECRET`).
- [ ] **Production Verification:** Verify sub-2.5s response times, WhatsApp webhook delivery, and zero monthly cloud expenses.
- **Definition of Done (DoD):** Complete platform is live on a custom or `vercel.app` domain, handling live customers with $0 cloud bills.
