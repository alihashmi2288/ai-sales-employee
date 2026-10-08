'use client';

import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  Plus,
  SlidersHorizontal,
  Check,
} from 'lucide-react';
import { Product } from '@/lib/types';

export default function CatalogManagerPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingSku, setEditingSku] = useState<string | null>(null);
  const [editStock, setEditStock] = useState<number>(0);

  const fetchCatalog = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.products) setProducts(data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const handleUpdateStock = async (product: Product, newTotalStock: number) => {
    try {
      const updatedVariants = product.variants.map((v) => ({
        ...v,
        stock: Math.max(0, Math.round(newTotalStock / product.variants.length)),
      }));

      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...product,
          stock_quantity: newTotalStock,
          variants: updatedVariants,
        }),
      });

      setEditingSku(null);
      fetchCatalog();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Package className="h-6 w-6 text-emerald-400" />
            Product &amp; Inventory Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your store catalog and variant stock levels. The AI Sales Associate checks this database in real time.
          </p>
        </div>

        <button
          onClick={() => alert('New product addition will sync to Supabase.')}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:from-emerald-500 hover:to-teal-500 transition"
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 w-full sm:w-80 focus-within:border-emerald-500 transition">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by SKU, title, or category..."
            className="flex-1 bg-transparent text-xs text-slate-100 placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="text-xs text-slate-400">
          Total Products: <strong className="text-slate-200">{filtered.length}</strong>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-850/80 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              <tr>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Total Stock</th>
                <th className="py-3.5 px-4">Variants &amp; Sizes</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-850/40 transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={prod.images[0] || 'https://via.placeholder.com/100'}
                          alt={prod.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-white">{prod.title}</div>
                        <div className="text-[10px] text-slate-400 line-clamp-1">{prod.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-emerald-400">{prod.sku}</td>
                  <td className="py-3.5 px-4">
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 border border-slate-700">
                      {prod.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white">PKR {prod.price.toLocaleString()}</td>
                  <td className="py-3.5 px-4">
                    {editingSku === prod.sku ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={editStock}
                          onChange={(e) => setEditStock(Number(e.target.value))}
                          className="w-16 rounded bg-slate-800 border border-emerald-500 px-2 py-1 text-xs text-white"
                        />
                        <button
                          onClick={() => handleUpdateStock(prod, editStock)}
                          className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-500"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span
                        onClick={() => {
                          setEditingSku(prod.sku);
                          setEditStock(prod.stock_quantity);
                        }}
                        className={`cursor-pointer font-bold ${
                          prod.stock_quantity < 5 ? 'text-amber-400' : 'text-emerald-400'
                        }`}
                        title="Click to edit stock"
                      >
                        {prod.stock_quantity} units
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {prod.variants.map((v, i) => (
                        <span
                          key={i}
                          className="rounded bg-slate-800/80 px-1.5 py-0.5 text-[10px] text-slate-300 border border-slate-700/60"
                        >
                          {v.size || v.color}: <strong>{v.stock}</strong>
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        setEditingSku(prod.sku);
                        setEditStock(prod.stock_quantity);
                      }}
                      className="rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] text-slate-300 hover:border-emerald-500 hover:text-white transition"
                    >
                      Edit Stock
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No products found.
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
