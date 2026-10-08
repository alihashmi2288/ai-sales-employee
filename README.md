# AI Sales Employee — Autonomous Omnichannel Revenue Agent

> **An autonomous digital sales associate built to emulate high-performing retail sales representatives.**
> Deployed 100% on **Vercel Hobby** and **Supabase Free Tier** at **$0/month operating cost**.

---

## 🌟 Highlights

- **Bilingual & Culturally Fluent:** Fluidly converses in English, Roman Urdu (*"Jee bilkul available hai"*), and Urdu script.
- **Deterministic Tool Calling:** Powered by Google Gemini (`@google/genai`) with typed tool contracts for stock lookups, pricing, and order creation. Zero hallucinations.
- **Cash-on-Delivery (COD) Discipline:** Collects customer name, phone, complete street address, and city turn-by-turn, generates order summaries, and assigns tracking IDs.
- **Live 1-Click Human Takeover:** Merchants monitor conversations live at `/dashboard/inbox`. Clicking **"Take Over"** mutes the AI agent instantly for staff direct replies.
- **Storefront Simulator:** Fully functional demo e-commerce store at `/demo` with interactive product catalog and the floating sales associate widget.
- **WhatsApp Cloud API Ready:** Webhook verification and message ingestion at `/api/webhooks/whatsapp`.
- **Vercel Cron Re-engagement:** Periodic follow-up nudges for abandoned chats at `/api/cron/follow-ups` scheduled via `vercel.json`.

---

## 🏗️ Architecture & Free Tier Stack

| Layer | Service / Tech | Cost |
| :--- | :--- | :---: |
| **Framework** | Next.js 15 (App Router, TypeScript, Tailwind CSS) | $0.00 |
| **AI LLM & SDK** | Google Gemini 3.8 Flash (`@google/genai`) | $0.00 |
| **Database** | PostgreSQL 16 + `pgvector` (Supabase Free) + Resilient In-Memory Fallback | $0.00 |
| **Hosting** | Vercel Serverless (Hobby Tier) | $0.00 |
| **Follow-Ups** | Vercel Cron (`vercel.json`) | $0.00 |
| **Messaging** | Meta WhatsApp Cloud API (1,000 free conversations/mo) | $0.00 |

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(Note: The platform includes a built-in resilient mock engine and seed catalog, allowing full testing of the storefront, widget, order creation, and takeover even before API keys are added).*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser:
- **Landing Page:** [http://localhost:3000](http://localhost:3000)
- **Storefront Simulator:** [http://localhost:3000/demo](http://localhost:3000/demo)
- **Merchant Control Room:** [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
- **Live Conversation Inbox:** [http://localhost:3000/dashboard/inbox](http://localhost:3000/dashboard/inbox)

---

## 🧪 Testing Scenarios

1. **Ask for recommendations:** Type *"AOA, black shirt hai?"* in the chat widget.
2. **Check stock:** Inquire *"Medium size me mil jayegi?"* — AI checks inventory tool and confirms stock and price.
3. **Confirm order:** Reply *"Yes confirm"* with your details — AI generates a confirmed order with a unique TCS tracking ID.
4. **Human Takeover:** Open `/dashboard/inbox` in another tab, click **"Take Over (Mute AI)"**, and send a staff message directly to the customer.
