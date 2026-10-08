import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Bot,
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowRight,
  MessageSquare,
  Users,
  CheckCircle,
  ExternalLink,
  Layers,
  Clock,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
              <Bot className="h-5 w-5 text-slate-950" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white">AI Sales Employee</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded ml-2 font-mono">
                v1.0 MVP
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/demo"
              className="rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:border-emerald-500 hover:text-emerald-400 transition flex items-center gap-1.5"
            >
              Store Simulator <ExternalLink className="h-3 w-3" />
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md hover:from-emerald-500 hover:to-teal-500 transition"
            >
              Merchant Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
          {/* Subtle gradient glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />

          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1 text-xs font-medium text-emerald-300 mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Autonomous Omnichannel Revenue Agent • 100% Vercel Native
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
            The Digital Sales Employee That Never Sleeps.
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Engages customers in Urdu and English, verifies real-time stock levels, handles pricing objections, and collects complete Cash-on-Delivery (COD) orders directly inside the chat.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/demo"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-emerald-950/60 hover:from-emerald-500 hover:to-teal-500 transition"
            >
              <MessageSquare className="h-4 w-4" />
              Launch Live Storefront Simulator
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/dashboard/inbox"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:border-slate-600 hover:bg-slate-800 transition"
            >
              <Users className="h-4 w-4 text-emerald-400" />
              Live Inbox & Human Takeover
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-emerald-400" /> Response Latency
              </div>
              <div className="text-2xl font-bold text-white">&lt; 2.5s</div>
              <div className="text-[11px] text-emerald-400 mt-1">Instant 24/7 replies</div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-teal-400" /> COD Conversion
              </div>
              <div className="text-2xl font-bold text-white">70%+</div>
              <div className="text-[11px] text-teal-400 mt-1">Direct chat checkout</div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-indigo-400" /> Autonomous Ratio
              </div>
              <div className="text-2xl font-bold text-white">82%</div>
              <div className="text-[11px] text-indigo-400 mt-1">Zero human effort needed</div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-400" /> Monthly Infra Cost
              </div>
              <div className="text-2xl font-bold text-white">$0.00</div>
              <div className="text-[11px] text-amber-400 mt-1">100% Free tier stack</div>
            </div>
          </div>
        </section>

        {/* Core Pillars */}
        <section className="border-t border-slate-800/80 bg-slate-900/40 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Why Traditional Chatbots Fail & Why AI Sales Employees Win
              </h2>
              <p className="text-sm text-slate-400 max-w-xl mx-auto">
                Built specifically for conversational commerce, WhatsApp D2C brands, and emerging markets.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 flex flex-col justify-between">
                <div>
                  <div className="h-10 w-10 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 mb-4">
                    <Zap className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-lg text-white mb-2">Deterministic Tool Execution</h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">
                    The agent never invents out-of-stock sizes or fake pricing. Every promise is checked against the database via typed tools before responding.
                  </p>
                </div>
                <ul className="text-xs text-slate-300 space-y-2 border-t border-slate-800 pt-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400" /> Live SKU & variant stock lookup
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400" /> Auto-deducts inventory upon order
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 flex flex-col justify-between">
                <div>
                  <div className="h-10 w-10 rounded-xl bg-teal-950 border border-teal-800 flex items-center justify-center text-teal-400 mb-4">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-lg text-white mb-2">Bilingual & Cultural Fluency</h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">
                    Fluidly speaks Roman Urdu (*&quot;Jee bilkul, medium size available hai!&quot;*), English, and Urdu script. Handles customer bargaining, sizing fears, and COD doubts.
                  </p>
                </div>
                <ul className="text-xs text-slate-300 space-y-2 border-t border-slate-800 pt-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-teal-400" /> 7-Day exchange reassurance
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-teal-400" /> Free delivery upsells over PKR 3k
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 flex flex-col justify-between">
                <div>
                  <div className="h-10 w-10 rounded-xl bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400 mb-4">
                    <Users className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-lg text-white mb-2">1-Click Live Human Takeover</h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">
                    Store owners monitor incoming conversations in real-time. If an upset customer appears, click Take Over to immediately mute the AI and type directly.
                  </p>
                </div>
                <ul className="text-xs text-slate-300 space-y-2 border-t border-slate-800 pt-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-indigo-400" /> Instant mute & resume controls
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-indigo-400" /> Real-time status badge indicators
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Launch Cards */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                <Layers className="h-4 w-4" /> Ready to Explore
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Experience the Full Platform Now
              </h2>
              <p className="text-sm text-slate-400 max-w-lg">
                Test the customer purchase flow on the storefront demo or supervise active chats in the merchant control room.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="/demo"
                className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-500 transition text-center"
              >
                Open Store Demo
              </Link>
              <Link
                href="/dashboard"
                className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition text-center"
              >
                Open Merchant Control Room
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 px-4 text-center text-xs text-slate-500">
        AI Sales Employee — Autonomous Omnichannel Revenue Platform • Powered by Google Gemini &amp; Next.js 15
      </footer>
    </div>
  );
}
