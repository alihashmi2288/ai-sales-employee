# Deployment & Infrastructure Runbook
## 100% Vercel Native & Supabase Zero-Cost ($0/Month) Production Setup

---

## 1. Operating Cost Breakdown ($0/Month Forever Free Stack)

| Service | Tier / Plan | Included Free Quota | Monthly Expense |
| :--- | :--- | :--- | :---: |
| **Vercel** | Hobby Plan | 100GB Bandwidth, Edge Routing, Serverless Functions, Free SSL, Custom Domains | **$0.00** |
| **Google AI Studio** | Developer API | Gemini 2.5 Flash / 2.0 Flash (15 RPM, 1M TPM, 1,500 RPD) | **$0.00** |
| **Supabase** | Free Tier | 500MB PostgreSQL 16 DB, pgvector, 50,000 MAU Auth, 200 Realtime Connections | **$0.00** |
| **Meta WhatsApp Cloud API** | Business Platform | 1,000 Free Service Conversations / month + Free Developer Sandbox | **$0.00** |
| **Vercel Cron** | Hobby Plan | Serverless scheduled invocations for abandoned cart follow-ups | **$0.00** |
| **TOTAL MONTHLY OPERATING EXPENSE** | | | **$0.00 / mo** |

---

## 2. Step-by-Step Production Deployment Guide

### Step 1: Supabase Database & Realtime Setup (5 Minutes)
1. Navigate to [Supabase](https://supabase.com) and create a free account.
2. Click **New Project** (Name: `ai-sales-employee`, Database Password: Save securely, Region: choose closest to your target customers e.g. Frankfurt or Singapore).
3. Once provisioned, open the **SQL Editor** tab.
4. Copy and paste the complete DDL script from [`docs/DATA_MODELS_AND_API.md`](file:///c:/Users/umerh/Desktop/Ai%20Sales%20Employee/docs/DATA_MODELS_AND_API.md#1-database-schema--relational-ddl-postgresql-16--pgvector).
5. Click **Run** to generate the extensions (`vector`, `uuid-ossp`), enums, and tables (`tenants`, `products`, `conversations`, `messages`, `orders`, `follow_ups`).
6. Navigate to **Database -> Replication** in the Supabase sidebar and toggle ON replication for the `messages` and `conversations` tables to enable Supabase Realtime WebSockets for the live dashboard inbox.
7. Navigate to **Project Settings -> API** and copy:
   - `Project URL` (`NEXT_PUBLIC_SUPABASE_URL`)
   - `anon public key` (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - `service_role secret` (`SUPABASE_SERVICE_ROLE_KEY`)

---

### Step 2: Google AI Studio API Key (2 Minutes)
1. Visit [Google AI Studio](https://aistudio.google.com/app/api-keys).
2. Click **Create API Key**.
3. Copy the generated key. This will be your `GEMINI_API_KEY`.
4. (No credit card or billing configuration is required for the free tier).

---

### Step 3: Meta WhatsApp Cloud API Setup (10 Minutes)
1. Visit the [Meta for Developers Portal](https://developers.facebook.com).
2. Click **My Apps -> Create App -> Other -> Business**.
3. Under **Add products to your app**, locate **WhatsApp** and click **Set up**.
4. In the WhatsApp Getting Started page:
   - Copy the **Temporary Access Token** (or generate a permanent System User Token under Business Settings) -> `META_ACCESS_TOKEN`.
   - Copy the **Phone Number ID** -> `META_PHONE_NUMBER_ID`.
5. Under **WhatsApp -> Configuration**:
   - Set **Callback URL**: `https://your-app-domain.vercel.app/api/webhooks/whatsapp`
   - Set **Verify Token**: Any secure random string (e.g., `sales_emp_secret_token_123`) -> `META_VERIFY_TOKEN`.
   - Subscribe to the `messages` webhook field.

---

### Step 4: Vercel Deployment & Environment Variables (3 Minutes)
1. Push your repository to GitHub.
2. Visit [Vercel](https://vercel.com) and click **Add New -> Project**.
3. Import your GitHub repository.
4. In the **Environment Variables** section, paste all values from the `.env.example` below.
5. Click **Deploy**. Vercel will automatically build the Next.js application and assign an SSL URL (e.g., `https://ai-sales-employee.vercel.app`).

---

### Step 5: Vercel Cron Configuration (`vercel.json`)
To enable the automated abandoned conversation follow-up engine without running a paid background worker, ensure `vercel.json` exists in the project root:

```json
{
  "crons": [
    {
      "path": "/api/cron/follow-ups",
      "schedule": "*/15 * * * *"
    }
  ]
}
```

*Note: In the Vercel Dashboard under **Project Settings -> Cron Jobs**, Vercel will automatically execute `/api/cron/follow-ups` every 15 minutes, sending pending follow-up nudges at $0 cost.*

---

## 3. Environment Variables Reference (`.env.example`)

```bash
# ==============================================================================
# AI ENGINE CONFIGURATION (Google Gemini Free Tier)
# ==============================================================================
GEMINI_API_KEY=AIzaSy...your_gemini_api_key_from_aistudio

# ==============================================================================
# DATABASE & REALTIME (Supabase Free Tier)
# ==============================================================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...public_anon_key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...private_service_role_key

# ==============================================================================
# META WHATSAPP CLOUD API
# ==============================================================================
META_PHONE_NUMBER_ID=109283746501928
META_ACCESS_TOKEN=EAAG...meta_system_user_token
META_VERIFY_TOKEN=sales_emp_secret_token_123
META_APP_SECRET=a8f9c1b2d3e4...your_meta_app_secret

# ==============================================================================
# SECURITY & CRON SECRETS
# ==============================================================================
CRON_SECRET=super_secret_cron_string_for_vercel_cron
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
NEXT_PUBLIC_APP_URL=https://your-app-domain.vercel.app
```

---

## 4. Production Health Verification Checklist

- [ ] **Database Connectivity:** Open Supabase Table Editor and verify records can be inserted.
- [ ] **Webhook Handshake:** Trigger Meta Webhook test button; verify 200 OK challenge response.
- [ ] **Live Agent Turn:** Send a test message on WhatsApp or `/demo` widget; verify AI replies with stock and price in `< 2.5 seconds`.
- [ ] **Realtime Dashboard Sync:** Open `/dashboard/inbox` in browser; send a test message from a mobile phone and verify it appears in real-time without refreshing.
- [ ] **Human Takeover:** Click "Take Over" in dashboard; send another WhatsApp message and verify the AI stays muted while the merchant replies.
- [ ] **Vercel Cron Execution:** Check Vercel project logs under **Logs -> Cron** to confirm `/api/cron/follow-ups` runs every 15 minutes with HTTP 200.
