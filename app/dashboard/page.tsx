'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ShoppingBag,
  MessageSquare,
  Users,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { Order, Conversation } from '@/lib/types';

export default function DashboardOverviewPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/orders').then((res) => res.json()),
      fetch('/api/conversations').then((res) => res.json()),
    ])
      .then(([ordersData, convData]) => {
        if (ordersData.orders) setOrders(ordersData.orders);
        if (convData.conversations) setConversations(convData.conversations);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const totalOrders = orders.length;
  const totalConversations = conversations.length;
  const autonomousConversations = conversations.filter((c) => c.status !== 'human_takeover').length;
  const autoResolutionRate = totalConversations > 0 ? Math.round((autonomousConversations / totalConversations) * 100) : 100;

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Merchant Control Room</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time performance metrics and sales captured autonomously by your AI employee.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/inbox"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:from-emerald-500 hover:to-teal-500 transition"
          >
            <MessageSquare className="h-4 w-4" />
            Open Live Inbox
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
            <span>AI Captured Revenue</span>
            <span className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white">
            PKR {loading ? '...' : totalRevenue.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center text-[11px] text-emerald-400 font-medium">
            <ArrowUpRight className="h-3 w-3 mr-0.5" /> 100% via Cash-on-Delivery
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
            <span>Orders Completed</span>
            <span className="p-2 rounded-lg bg-teal-950/60 border border-teal-800/40 text-teal-400">
              <ShoppingBag className="h-4 w-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white">{loading ? '...' : totalOrders}</div>
          <div className="mt-2 flex items-center text-[11px] text-teal-400 font-medium">
            <ShieldCheck className="h-3 w-3 mr-0.5" /> Booked with courier tracking
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
            <span>Conversations Handled</span>
            <span className="p-2 rounded-lg bg-indigo-950/60 border border-indigo-800/40 text-indigo-400">
              <MessageSquare className="h-4 w-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white">
            {loading ? '...' : totalConversations}
          </div>
          <div className="mt-2 flex items-center text-[11px] text-indigo-400 font-medium">
            <Users className="h-3 w-3 mr-0.5" /> Urdu &amp; English shoppers
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
            <span>Autonomous Rate</span>
            <span className="p-2 rounded-lg bg-amber-950/60 border border-amber-800/40 text-amber-400">
              <Clock className="h-4 w-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white">{autoResolutionRate}%</div>
          <div className="mt-2 flex items-center text-[11px] text-amber-400 font-medium">
            Resolved without human staff
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Orders & Active Chats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-emerald-400" />
                <h2 className="font-semibold text-sm text-white">Recent Orders</h2>
              </div>
              <Link href="/dashboard/orders" className="text-xs text-emerald-400 hover:underline">
                View all →
              </Link>
            </div>

            <div className="space-y-3">
              {orders.slice(0, 4).map((ord) => (
                <div
                  key={ord.id}
                  className="rounded-xl border border-slate-800/80 bg-slate-850/60 p-3 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-white">{ord.order_number}</span>
                      <span className="rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] px-1.5 py-0.2 uppercase font-medium">
                        {ord.payment_method}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {ord.customer_name} • {ord.shipping_city}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-xs text-white">
                      PKR {ord.total_amount.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Tracking: {ord.tracking_number || 'Pending'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Conversations Stream */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-teal-400" />
                <h2 className="font-semibold text-sm text-white">Active Live Threads</h2>
              </div>
              <Link href="/dashboard/inbox" className="text-xs text-teal-400 hover:underline">
                Join live chats →
              </Link>
            </div>

            <div className="space-y-3">
              {conversations.slice(0, 4).map((c) => (
                <div
                  key={c.id}
                  className="rounded-xl border border-slate-800/80 bg-slate-850/60 p-3 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-white">
                        {c.customer_name || c.customer_identifier}
                      </span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded font-medium border ${
                          c.status === 'human_takeover'
                            ? 'bg-amber-950 text-amber-300 border-amber-800'
                            : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        }`}
                      >
                        {c.status === 'human_takeover' ? 'Human Takeover' : 'Active AI'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Channel: {c.channel} • Updated {new Date(c.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <Link
                    href={`/dashboard/inbox?id=${c.id}`}
                    className="text-xs rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 text-slate-300 hover:border-emerald-500 hover:text-emerald-300 transition"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
