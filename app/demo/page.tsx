'use client';

import React, { useState } from 'react';
import ChatWidget from '@/components/widget/ChatWidget';
import {
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';
import Link from 'next/link';

interface DemoProduct {
  sku: string;
  title: string;
  category: string;
  price: number;
  compareAt: number;
  stock: number;
  image: string;
  sizes: string[];
}

const DEMO_PRODUCTS: DemoProduct[] = [
  {
    sku: 'SHIRT-BLK-CAS',
    title: 'Classic Summer Cotton Shirt - Obsidian Black',
    category: 'Shirts',
    price: 2450,
    compareAt: 3200,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    sku: 'SHIRT-OXF-WHT',
    title: 'Executive Oxford Slim-Fit Shirt - Crisp White',
    category: 'Shirts',
    price: 2850,
    compareAt: 3600,
    stock: 14,
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    sku: 'POLO-NVY-PIQ',
    title: 'Vintage Pique Polo - Midnight Navy',
    category: 'Polos',
    price: 1950,
    compareAt: 2500,
    stock: 22,
    image: 'https://images.unsplash.com/photo-1625910513413-7e5d89fdfec9?auto=format&fit=crop&w=800&q=80',
    sizes: ['M', 'L', 'XL'],
  },
  {
    sku: 'CHINO-BEI-STR',
    title: 'Flex-Stretch Smart Chinos - Desert Beige',
    category: 'Trousers',
    price: 3200,
    compareAt: 3900,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80',
    sizes: ['30', '32', '34'],
  },
  {
    sku: 'DENIM-IND-SEL',
    title: 'Raw Selvedge Denim Jeans - Deep Indigo',
    category: 'Denim',
    price: 4200,
    compareAt: 5200,
    stock: 9,
    image: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
    sizes: ['32', '34', '36'],
  },
  {
    sku: 'ACC-POK-SILK',
    title: 'Hand-Rolled Silk Pocket Square - Paisley Gold',
    category: 'Accessories',
    price: 650,
    compareAt: 900,
    stock: 35,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    sizes: ['One Size'],
  },
];

export default function StorefrontSimulatorPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activePrompt, setActivePrompt] = useState<string | undefined>(undefined);

  const categories = ['All', 'Shirts', 'Polos', 'Trousers', 'Denim', 'Accessories'];

  const filteredProducts =
    selectedCategory === 'All'
      ? DEMO_PRODUCTS
      : DEMO_PRODUCTS.filter((p) => p.category === selectedCategory);

  const askAboutProduct = (prod: DemoProduct) => {
    setActivePrompt(`AOA! Is ${prod.title} (SKU: ${prod.sku}) available in Medium size?`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-950 border-b border-emerald-800/40 px-4 py-2 text-center text-xs text-emerald-200 flex items-center justify-center gap-2">
        <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
        <span>
          <strong>STOREFRONT SIMULATOR:</strong> Test live customer conversations, inventory checks, and COD orders below.
        </span>
        <Link
          href="/dashboard"
          className="ml-3 rounded bg-emerald-700/60 px-2 py-0.5 text-xs font-semibold text-white hover:bg-emerald-600 transition"
        >
          Open Merchant Dashboard →
        </Link>
      </div>

      {/* Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
              A
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white">AURA</span>
              <span className="text-xs text-emerald-400 font-medium ml-1.5 uppercase tracking-widest">
                Apparel
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <span className="hover:text-emerald-400 cursor-pointer transition">New Arrivals</span>
            <span className="hover:text-emerald-400 cursor-pointer transition">Summer Essentials</span>
            <span className="hover:text-emerald-400 cursor-pointer transition">COD Nationwide</span>
            <span className="hover:text-emerald-400 cursor-pointer transition">Exchange Policy</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/inbox"
              className="rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-1.5 text-xs font-medium text-slate-200 hover:border-emerald-500 hover:text-emerald-400 transition"
            >
              Merchant Control Room
            </Link>
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/40 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <ShoppingBag className="h-4 w-4 text-emerald-400" />
              <span>Cart: 0 items</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 py-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs font-medium text-emerald-300 mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Summer 2026 Ready-To-Wear • 100% Cash On Delivery
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Luxury Apparel, Delivered to Your Doorstep.
          </h1>
          <p className="text-base text-slate-400 max-w-xl mx-auto mb-8">
            Shop premium combed cotton shirts, polos, and trousers. Have questions or want to place an order? Click the chat button below to converse with our AI sales associate <strong>Ayesha</strong>!
          </p>

          {/* Benefits Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3 flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-slate-200">100% COD</div>
                <div className="text-[10px] text-slate-400">Pay on delivery</div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3 flex items-center gap-3">
              <Truck className="h-5 w-5 text-teal-400 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-slate-200">2-3 Days TCS</div>
                <div className="text-[10px] text-slate-400">Nationwide courier</div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3 flex items-center gap-3">
              <RotateCcw className="h-5 w-5 text-indigo-400 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-slate-200">7-Day Exchange</div>
                <div className="text-[10px] text-slate-400">Doorstep pickup</div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3 flex items-center gap-3">
              <Tag className="h-5 w-5 text-amber-400 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-slate-200">Free Shipping</div>
                <div className="text-[10px] text-slate-400">Orders &gt; PKR 3,000</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Category Filters */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <SlidersHorizontal className="h-4 w-4 text-slate-400 mr-1" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-400">
            Showing <strong className="text-slate-200">{filteredProducts.length}</strong> products
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((prod) => (
            <div
              key={prod.sku}
              className="group rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden shadow-lg hover:border-slate-700 transition flex flex-col"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={prod.image}
                  alt={prod.title}
                  className="h-full w-full object-cover object-center group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 rounded-full bg-slate-950/80 backdrop-blur px-2.5 py-1 text-[10px] font-semibold text-emerald-400 border border-emerald-500/30">
                  {prod.category}
                </span>
                <span className="absolute top-3 right-3 rounded-full bg-slate-950/80 backdrop-blur px-2 py-0.5 text-[10px] text-slate-300">
                  SKU: {prod.sku}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-slate-100 text-base leading-snug mb-2 group-hover:text-emerald-400 transition">
                    {prod.title}
                  </h3>

                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-xl font-bold text-white">PKR {prod.price.toLocaleString()}</span>
                    {prod.compareAt > prod.price && (
                      <span className="text-xs text-slate-400 line-through">
                        PKR {prod.compareAt.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap mb-4">
                    <span className="text-[11px] text-slate-400">Sizes:</span>
                    {prod.sizes.map((s) => (
                      <span
                        key={s}
                        className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-300 border border-slate-700"
                      >
                        {s}
                      </span>
                    ))}
                    <span className="text-[10px] text-emerald-400 font-medium ml-auto">
                      ● {prod.stock} in stock
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => askAboutProduct(prod)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:from-emerald-500 hover:to-teal-500 transition active:scale-[0.98]"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Ask AI About Sizing & Order
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © 2026 Aura Fashion & Apparel. Operating on <strong>AI Sales Employee</strong> Autonomous Platform.
          </div>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-white transition">Platform Overview</Link>
            <Link href="/dashboard" className="hover:text-white transition">Merchant Dashboard</Link>
            <Link href="/dashboard/inbox" className="hover:text-white transition">Live Inbox</Link>
          </div>
        </div>
      </footer>

      {/* Embedded Floating Sales Associate Widget */}
      <ChatWidget initialPrompt={activePrompt} />
    </div>
  );
}
