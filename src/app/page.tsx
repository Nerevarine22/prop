'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { MOCK_COUPONS } from '@/lib/data/firms';
import { PropFirm } from '@/types/firm';
import { getFirms } from '@/lib/services/firmService';
import { FirmCard } from '@/components/firms/FirmCard';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { Search, Activity, ArrowRight, Percent, SlidersHorizontal, X, Shield, Zap, Moon, Bot, ArrowUpDown } from 'lucide-react';

export default function HomePage() {
  const [firms, setFirms] = useState<PropFirm[]>([]);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStep, setSelectedStep] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [minProfitSplit, setMinProfitSplit] = useState<string>('all');
  const [newsAllowedOnly, setNewsAllowedOnly] = useState(false);
  const [weekendAllowedOnly, setWeekendAllowedOnly] = useState(false);
  const [eaAllowedOnly, setEaAllowedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'trust' | 'split' | 'price' | 'capital'>('trust');

  useEffect(() => {
    getFirms().then(setFirms);
  }, []);

  // Advanced Multi-Filter Logic
  const filteredFirms = useMemo(() => {
    return firms.filter(firm => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = firm.name.toLowerCase().includes(query);
        const matchesTagline = firm.tagline.toLowerCase().includes(query);
        const matchesPlatform = firm.platforms.some(p => p.toLowerCase().includes(query));
        if (!matchesName && !matchesTagline && !matchesPlatform) return false;
      }

      // 2. Evaluation Step
      if (selectedStep !== 'all') {
        if (selectedStep === '1-Step' && !firm.evaluationSteps.includes('1-Step')) return false;
        if (selectedStep === '2-Step' && !firm.evaluationSteps.includes('2-Step')) return false;
        if (selectedStep === 'Instant Funding' && !firm.evaluationSteps.includes('Instant Funding')) return false;
      }

      // 3. Platform
      if (selectedPlatform !== 'all') {
        if (!firm.platforms.includes(selectedPlatform as any)) return false;
      }

      // 4. Profit Split
      if (minProfitSplit === '90' && !firm.profitSplit.includes('90%') && !firm.profitSplit.includes('95%')) return false;
      if (minProfitSplit === '95' && !firm.profitSplit.includes('95%')) return false;

      // 5. Special Rules
      if (newsAllowedOnly && !firm.newsTradingAllowed) return false;
      if (weekendAllowedOnly && !firm.weekendHoldingAllowed) return false;
      if (eaAllowedOnly && !firm.eaAllowed) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'trust') return b.trustScore - a.trustScore;
      if (sortBy === 'split') {
        const splitA = parseInt(a.profitSplit.replace(/\D/g, '')) || 0;
        const splitB = parseInt(b.profitSplit.replace(/\D/g, '')) || 0;
        return splitB - splitA;
      }
      if (sortBy === 'price') {
        const priceA = a.accountTiers?.[0]?.price || 999;
        const priceB = b.accountTiers?.[0]?.price || 999;
        return priceA - priceB;
      }
      if (sortBy === 'capital') return b.maxCapital - a.maxCapital;
      return 0;
    });
  }, [firms, searchQuery, selectedStep, selectedPlatform, minProfitSplit, newsAllowedOnly, weekendAllowedOnly, eaAllowedOnly, sortBy]);

  const hasActiveFilters = searchQuery || selectedStep !== 'all' || selectedPlatform !== 'all' || minProfitSplit !== 'all' || newsAllowedOnly || weekendAllowedOnly || eaAllowedOnly;

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedStep('all');
    setSelectedPlatform('all');
    setMinProfitSplit('all');
    setNewsAllowedOnly(false);
    setWeekendAllowedOnly(false);
    setEaAllowedOnly(false);
    setSortBy('trust');
  };

  return (
    <div className="space-y-12 sm:space-y-16 py-8 sm:py-16 font-satoshi">
      
      {/* 1. HERO SECTION */}
      <section className="relative text-center max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Scaled Display Title */}
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
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 pt-6 sm:pt-8 text-xs sm:text-sm text-zinc-400 border-t border-zinc-800/60 max-w-4xl mx-auto font-medium">
          <div className="flex items-center gap-1.5">
            <span className="text-white font-mono font-bold">
              <AnimatedCounter value={firms.length || 10} suffix="+" />
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

      {/* 2. EXPANDED MULTI-FILTER & PROP FIRM GRID SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* EXPANDED FILTER CONSOLE */}
        <div className="rounded-2xl border border-zinc-800/80 bg-[#141416] p-4 sm:p-6 space-y-4 shadow-sm">
          
          {/* TOP ROW: Search & Sorting */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search firm name, platform (Bybit, cTrader, MT5), or features..."
                className="w-full bg-[#121214] border border-zinc-800/80 rounded-xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors font-medium min-h-[42px]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-1"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 shrink-0">
              <ArrowUpDown className="h-4 w-4 text-zinc-500 hidden sm:inline" />
              <span className="text-xs text-zinc-400 font-medium hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#121214] border border-zinc-800/80 rounded-xl px-3 py-2.5 text-xs font-semibold text-zinc-200 focus:outline-none focus:border-zinc-700 min-h-[42px] cursor-pointer"
              >
                <option value="trust">Highest Trust Score</option>
                <option value="split">Highest Profit Split</option>
                <option value="price">Lowest Entry Price</option>
                <option value="capital">Max Funding ($)</option>
              </select>
            </div>

          </div>

          {/* MIDDLE ROW: Evaluation Steps & Platform Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-zinc-800/40">
            
            {/* 1. Evaluation Model */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">Evaluation Model</span>
              <div className="flex items-center gap-1.5 overflow-x-auto touch-scroll no-scrollbar pb-0.5">
                {[
                  { id: 'all', label: 'All Models' },
                  { id: '1-Step', label: '1-Step' },
                  { id: '2-Step', label: '2-Step' },
                  { id: 'Instant Funding', label: 'Instant' },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedStep(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 min-h-[36px] ${
                      selectedStep === item.id
                        ? 'bg-white text-zinc-950 font-bold shadow-sm'
                        : 'bg-[#121214] border border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Platform */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">Trading Platform</span>
              <div className="flex items-center gap-1.5 overflow-x-auto touch-scroll no-scrollbar pb-0.5">
                {[
                  { id: 'all', label: 'All Platforms' },
                  { id: 'cTrader', label: 'cTrader' },
                  { id: 'Bybit', label: 'Bybit' },
                  { id: 'MT5', label: 'MT5' },
                  { id: 'TradeLocker', label: 'TradeLocker' },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedPlatform(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 min-h-[36px] ${
                      selectedPlatform === item.id
                        ? 'bg-white text-zinc-950 font-bold shadow-sm'
                        : 'bg-[#121214] border border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Profit Split */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">Profit Split</span>
              <div className="flex items-center gap-1.5 overflow-x-auto touch-scroll no-scrollbar pb-0.5">
                {[
                  { id: 'all', label: 'All Splits' },
                  { id: '90', label: '90%+ Split' },
                  { id: '95', label: '95% Split' },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setMinProfitSplit(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 min-h-[36px] ${
                      minProfitSplit === item.id
                        ? 'bg-white text-zinc-950 font-bold shadow-sm'
                        : 'bg-[#121214] border border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* BOTTOM ROW: Special Rules Toggle Pills & Results Count */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-zinc-800/40">
            
            {/* Special Rules Pills */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mr-1">Rules:</span>

              <button
                onClick={() => setNewsAllowedOnly(!newsAllowedOnly)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors min-h-[34px] ${
                  newsAllowedOnly
                    ? 'bg-[#52b788]/15 border-[#52b788]/40 text-[#52b788] font-bold'
                    : 'bg-[#121214] border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Zap className="h-3.5 w-3.5" />
                <span>News Trading</span>
              </button>

              <button
                onClick={() => setWeekendAllowedOnly(!weekendAllowedOnly)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors min-h-[34px] ${
                  weekendAllowedOnly
                    ? 'bg-[#52b788]/15 border-[#52b788]/40 text-[#52b788] font-bold'
                    : 'bg-[#121214] border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Moon className="h-3.5 w-3.5" />
                <span>Weekend Holding</span>
              </button>

              <button
                onClick={() => setEaAllowedOnly(!eaAllowedOnly)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors min-h-[34px] ${
                  eaAllowedOnly
                    ? 'bg-[#52b788]/15 border-[#52b788]/40 text-[#52b788] font-bold'
                    : 'bg-[#121214] border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Bot className="h-3.5 w-3.5" />
                <span>EAs & Bots</span>
              </button>
            </div>

            {/* Results Count & Clear Button */}
            <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-zinc-400 font-medium">
              <span>Showing <strong className="text-white font-bold">{filteredFirms.length}</strong> prop firms</span>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-4 cursor-pointer"
                >
                  Reset Filters
                </button>
              )}
            </div>

          </div>

        </div>

        {/* Scaled Cards Grid (max-w-7xl) */}
        {filteredFirms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {filteredFirms.map(firm => (
              <FirmCard key={firm.id} firm={firm} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-zinc-800/80 bg-[#141416] p-12 text-center space-y-3">
            <h3 className="text-base font-bold text-white">No Matching Prop Firms Found</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">Try adjusting your search keywords, evaluation steps, or rule filters to find available firms.</p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl bg-zinc-100 text-zinc-950 text-xs font-bold hover:bg-white transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}

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
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-100 text-zinc-950 text-xs font-bold hover:bg-white transition-colors shrink-0 min-h-[44px]"
          >
            <span>View Active Deals ({MOCK_COUPONS.length})</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
