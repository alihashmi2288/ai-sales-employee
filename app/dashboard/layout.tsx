'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  Package,
  ShoppingBag,
  ExternalLink,
  Bot,
  Sparkles,
  Zap,
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Live Inbox', href: '/dashboard/inbox', icon: MessageSquare, badge: 'Live' },
    { label: 'Product Catalog', href: '/dashboard/catalog', icon: Package },
    { label: 'Orders & COD', href: '/dashboard/orders', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-slate-800/80 bg-slate-900/60 backdrop-blur-xl flex flex-col justify-between shrink-0">
        <div>
          {/* Brand */}
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/20">
                <Bot className="h-5 w-5 text-slate-950" />
              </div>
              <div>
                <h1 className="font-bold text-sm tracking-tight text-white leading-tight">
                  Aura Fashion
                </h1>
                <p className="text-[11px] text-emerald-400 font-medium">Merchant Control Room</p>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-950/40 border border-emerald-800/50 px-2.5 py-1.5 text-xs text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-medium text-[11px]">AI Associate: Active 24/7</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
                    isActive
                      ? 'bg-emerald-600/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.2 text-[10px] text-emerald-300 font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <Link
            href="/demo"
            target="_blank"
            className="flex items-center justify-between rounded-xl border border-slate-700/80 bg-slate-850 px-3.5 py-2.5 text-xs font-medium text-slate-300 hover:border-emerald-500 hover:text-emerald-300 transition"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              Open Store Demo
            </span>
            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
          </Link>

          <div className="rounded-xl bg-slate-900 border border-slate-800/80 p-3 text-[11px] text-slate-400">
            <div className="flex items-center justify-between font-semibold text-slate-300 mb-1">
              <span>Stack Status</span>
              <span className="text-emerald-400 font-mono text-[10px]">100% Free Tier</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
              <Zap className="h-3 w-3 text-amber-400" /> Gemini 3.8 Flash • Vercel
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
