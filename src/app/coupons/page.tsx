'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_COUPONS } from '@/lib/data/firms';
import { Percent, Copy, Check, ShieldCheck, ArrowRight } from 'lucide-react';

export default function CouponsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Hero Header */}
      <div className="propr-card p-8 text-center space-y-3 relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold uppercase tracking-wider">
          <Percent className="h-3.5 w-3.5 text-emerald-400" />
          Verified Daily Promo Engine
        </div>
        <h1 className="text-3xl sm:text-5xl font-normal tracking-tight font-serif text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
          Active Crypto Prop Firm Coupons & Deals
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
          Save on your evaluation challenge accounts. All promo codes are tested daily for valid status and maximum discount rate.
        </p>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_COUPONS.map(coupon => (
          <div
            key={coupon.id}
            className="propr-card p-6 space-y-5 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-base font-extrabold text-white">{coupon.firmName}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  Verified
                </span>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center space-y-1">
                <span className="text-xl font-black text-emerald-400 block font-mono">{coupon.discount}</span>
                <p className="text-xs text-zinc-300">{coupon.description}</p>
              </div>
            </div>

            {/* Code & Copy button */}
            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="flex-1 font-mono text-center text-xs font-extrabold text-emerald-300 bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 tracking-wider">
                  {coupon.code}
                </div>
                <button
                  onClick={() => handleCopy(coupon.id, coupon.code)}
                  className="px-4 py-2.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedId === coupon.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span>{copiedId === coupon.id ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <Link
                href={`/firms`}
                className="w-full flex items-center justify-center gap-1 text-[11px] font-semibold text-zinc-400 hover:text-white transition-colors pt-1"
              >
                <span>Use on Challenge Page</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
