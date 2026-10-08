'use client';

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Truck,
  Copy,
  Check,
  Search,
  Filter,
} from 'lucide-react';
import { Order, OrderStatus } from '@/lib/types';

export default function OrdersManagementPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.orders) setOrders(data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const copyTracking = (tracking: string) => {
    navigator.clipboard.writeText(tracking);
    setCopiedId(tracking);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = orders.filter(
    (o) =>
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_phone.includes(search) ||
      o.shipping_city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-emerald-400" />
            Orders &amp; COD Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time feed of orders captured by your autonomous sales associate. Manage dispatch and courier tracking.
          </p>
        </div>

        <div className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
          Total Captured: <strong className="text-white">{orders.length} orders</strong>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 w-full sm:w-80 focus-within:border-emerald-500 transition">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, name, city, phone..."
            className="flex-1 bg-transparent text-xs text-slate-100 placeholder-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-850/80 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              <tr>
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Delivery Destination</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Total (COD)</th>
                <th className="py-3.5 px-4">Courier Tracking</th>
                <th className="py-3.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-850/40 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-white text-xs">{ord.order_number}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(ord.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">{ord.customer_name}</div>
                    <div className="text-[11px] text-emerald-400 font-mono">{ord.customer_phone}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-white font-medium">{ord.shipping_city}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-1">{ord.shipping_address}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      {ord.items.map((it, i) => (
                        <div key={i} className="text-[11px] text-slate-200">
                          {it.qty}x {it.title} ({it.size || ''} {it.color || ''})
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white text-xs">PKR {ord.total_amount.toLocaleString()}</div>
                    <div className="text-[10px] text-emerald-400 font-semibold uppercase">
                      {ord.payment_method}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    {ord.tracking_number ? (
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-300">
                        <Truck className="h-3.5 w-3.5 text-teal-400" />
                        <span>{ord.tracking_number}</span>
                        <button
                          onClick={() => copyTracking(ord.tracking_number!)}
                          className="text-slate-400 hover:text-white"
                          title="Copy tracking ID"
                        >
                          {copiedId === ord.tracking_number ? (
                            <Check className="h-3 w-3 text-emerald-400" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400">Assigned upon dispatch</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <select
                      value={ord.status}
                      onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold bg-slate-800 border focus:outline-none transition ${
                        ord.status === 'confirmed'
                          ? 'text-emerald-400 border-emerald-700/60'
                          : ord.status === 'dispatched'
                          ? 'text-teal-400 border-teal-700/60'
                          : ord.status === 'delivered'
                          ? 'text-indigo-400 border-indigo-700/60'
                          : 'text-slate-400 border-slate-700'
                      }`}
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="dispatched">Dispatched</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No orders matching search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
