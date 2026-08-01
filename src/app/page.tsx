'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MOCK_COUPONS } from '@/lib/data/firms';
import { PropFirm } from '@/types/firm';
import { getFirms } from '@/lib/services/firmService';
import { FirmCard } from '@/components/firms/FirmCard';
import { AiMatchmaker } from '@/components/home/AiMatchmaker';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { Search, Activity, ArrowRight, Percent } from 'lucide-react';

export default function HomePage() {
  const [firms, setFirms] = useState<PropFirm[]>([]);
  const [activeTab, setActiveTab] = useState<'featured' | 'high-split' | 'instant'>('featured');

  useEffect(() => {
    getFirms().then(setFirms);
  }, []);

  const filteredFirms = firms.filter(firm => {
    if (activeTab === 'high-split') return firm.profitSplit.includes('90%') || firm.profitSplit.includes('95%');
    if (activeTab === 'instant') return firm.evaluationSteps.includes('Instant Funding');
    return true;
  });

  return (
    <div className="space-y-16 py-12 md:py-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative text-center max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Scaled Grotesk Display Title */}
        <h1 className="display-heading text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-extrabold tracking-tight leading-[1.08] text-white">
          The CoinMarketCap for <br className="hidden xs:inline" />
          Crypto Prop Trading Firms
        </h1>

        <p className="text-sm sm:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed font-normal">
          Institutional 1:100 crypto leverage, verified 95% profit splits, real-time drawdown tracking, and live on-chain transparency in one place.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-3 max-w-md sm:max-w-none mx-auto">
          <Link
            href="/compare"
            className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-zinc-100 text-zinc-950 text-xs sm:text-sm font-bold hover:bg-white transition-colors shadow-sm min-h-[44px]"
          >
            <Search className="h-4 w-4" />
            <span>Explore Directory</span>
          </Link>

          <Link
            href="/transparency"
            className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs sm:text-sm font-bold hover:bg-zinc-800 transition-colors min-h-[44px]"
          >
            <Activity className="h-4 w-4 text-emerald-400" />
            <span>Transparency Dashboard</span>
          </Link>
        </div>

        {/* Minimalist Text-Only Stats Line */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 pt-6 sm:pt-8 text-xs sm:text-sm text-zinc-400 border-t border-zinc-800/60 max-w-4xl mx-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-white font-mono font-bold">
              <AnimatedCounter value={firms.length || 9} suffix="+" />
            </span>
            <span className="text-zinc-400">Verified Firms</span>
          </div>

          <span className="text-zinc-700 hidden sm:inline">•</span>

          <div className="flex items-center gap-1.5">
            <span className="text-zinc-200 font-mono font-bold">
              <AnimatedCounter value={95} suffix="%" />
            </span>
            <span className="text-zinc-400">Max Profit Split</span>
          </div>

          <span className="text-zinc-700 hidden sm:inline">•</span>

          <div className="flex items-center gap-1.5">
            <span className="text-zinc-200 font-mono font-bold">1:100</span>
            <span className="text-zinc-400">Crypto Leverage</span>
          </div>

          <span className="text-zinc-700 hidden sm:inline">•</span>

          <div className="flex items-center gap-1.5">
            <span className="text-zinc-200 font-mono font-bold">
              <AnimatedCounter value={20} suffix="% OFF" />
            </span>
            <span className="text-zinc-400">Active Deals</span>
          </div>
        </div>

      </section>

      {/* 2. FEATURED SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Tab Controls Bar (Horizontally scrollable on mobile) */}
        <div className="flex justify-start sm:justify-end overflow-x-auto no-scrollbar pb-1">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs shrink-0">
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-4 py-2 sm:py-1.5 rounded-lg font-bold transition-all duration-200 min-h-[38px] ${
                activeTab === 'featured' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Featured
            </button>
            <button
              onClick={() => setActiveTab('high-split')}
              className={`px-4 py-2 sm:py-1.5 rounded-lg font-bold transition-all duration-200 min-h-[38px] ${
                activeTab === 'high-split' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              90%+ Split
            </button>
            <button
              onClick={() => setActiveTab('instant')}
              className={`px-4 py-2 sm:py-1.5 rounded-lg font-bold transition-all duration-200 min-h-[38px] ${
                activeTab === 'instant' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Instant Funding
            </button>
          </div>
        </div>

        {/* Scaled Cards Grid (max-w-7xl) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {filteredFirms.map(firm => (
            <FirmCard key={firm.id} firm={firm} />
          ))}
        </div>
      </section>

      {/* 3. VERIFIED DEALS BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="propr-card p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="eyebrow-tag border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
              <Percent className="h-3.5 w-3.5" />
              VERIFIED PROMO ENGINE
            </div>
            <h3 className="text-2xl font-extrabold text-white">Save Up to 20% on Challenge Fees</h3>
            <p className="text-xs text-zinc-400">Automated verification checks promo codes daily for valid status and maximum discount rates.</p>
          </div>

          <Link
            href="/coupons"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-100 text-zinc-950 text-xs font-bold hover:bg-white transition-colors shrink-0"
          >
            <span>View Active Deals ({MOCK_COUPONS.length})</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
