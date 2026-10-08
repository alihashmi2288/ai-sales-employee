import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Sales Employee — Autonomous Omnichannel Revenue Agent',
  description: 'AI-powered digital sales associate that converses, checks live inventory, recommends products, and captures COD orders 24/7.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
