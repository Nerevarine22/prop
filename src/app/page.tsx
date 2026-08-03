'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { MOCK_COUPONS } from '@/lib/data/firms';
import { PropFirm } from '@/types/firm';
import { getFirms } from '@/lib/services/firmService';
import { FirmCard } from '@/components/firms/FirmCard';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { HeroBackground } from '@/components/home/HeroBackground';
import { Search, ArrowRight, Percent, X, Zap, Moon, Bot, ArrowUpDown } from 'lucide-react';

export default function HomePage() {
  const [firms, setFirms] = useState<PropFirm[]>([]);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStep, setSelectedStep] = useState<string>('all');
  const [minProfitSplit, setMinProfitSplit] = useState<string>('all');
  const [newsAllowedOnly, setNewsAllowedOnly] = useState(false);
  const [weekendAllowedOnly, setWeekendAllowedOnly] = useState(false);
  const [eaAllowedOnly, setEaAllowedOnly] = useState(false);
  
  // Reward & Ecosystem Filters
  const [hasPointsOnly, setHasPointsOnly] = useState(false);
  const [hasTokenOnly, setHasTokenOnly] = useState(false);
  const [confirmedAirdropOnly, setConfirmedAirdropOnly] = useState(false);

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
        const matchesTags = firm.rewardTags?.some(t => t.toLowerCase().includes(query));
        if (!matchesName && !matchesTagline && !matchesPlatform && !matchesTags) return false;
      }

      // 2. Evaluation Step
      if (selectedStep !== 'all') {
        if (selectedStep === '1-Step' && !firm.evaluationSteps.includes('1-Step')) return false;
        if (selectedStep === '2-Step' && !firm.evaluationSteps.includes('2-Step')) return false;
        if (selectedStep === 'Instant Funding' && !firm.evaluationSteps.includes('Instant Funding')) return false;
      }



      // 3. Profit Split
      if (minProfitSplit === '90' && !firm.profitSplit.includes('90%') && !firm.profitSplit.includes('95%')) return false;
      if (minProfitSplit === '95' && !firm.profitSplit.includes('95%')) return false;

      // 4. Special Rules
      if (newsAllowedOnly && !firm.newsTradingAllowed) return false;
      if (weekendAllowedOnly && !firm.weekendHoldingAllowed) return false;
      if (eaAllowedOnly && !firm.eaAllowed) return false;

      // 5. Reward & Ecosystem Toggles
      if (hasPointsOnly && !firm.rewardTags?.includes('Points')) return false;
      if (hasTokenOnly && !firm.rewardTags?.includes('Token')) return false;
      if (confirmedAirdropOnly && !firm.rewardTags?.includes('Airdrop')) return false;

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
  }, [firms, searchQuery, selectedStep, minProfitSplit, newsAllowedOnly, weekendAllowedOnly, eaAllowedOnly, hasPointsOnly, hasTokenOnly, confirmedAirdropOnly, sortBy]);

  const hasActiveFilters = searchQuery || selectedStep !== 'all' || minProfitSplit !== 'all' || newsAllowedOnly || weekendAllowedOnly || eaAllowedOnly || hasPointsOnly || hasTokenOnly || confirmedAirdropOnly;

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedStep('all');
    setMinProfitSplit('all');
    setNewsAllowedOnly(false);
    setWeekendAllowedOnly(false);
    setEaAllowedOnly(false);
    setHasPointsOnly(false);
    setHasTokenOnly(false);
    setConfirmedAirdropOnly(false);
    setSortBy('trust');
  };

  return (
    <div className="space-y-10 sm:space-y-12 py-4 sm:py-6 font-satoshi">
      
      {/* 1. HERO SECTION (Aligned 1-to-1 with Filter Box Margins) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative text-center pt-16 pb-12 px-4 sm:pt-24 sm:pb-18 sm:px-8">
          {/* Pure Grey SVG Trading Chart Background */}
          <HeroBackground />

          {/* Research-focused hero copy and market signals */}
          <div className="relative z-10">
            
            <h1 className="display-heading mx-auto max-w-[820px] text-3xl xs:text-4xl sm:text-5xl md:text-[60px] lg:text-[64px] font-extrabold tracking-tight leading-[1.16] text-white">
              Start Prop Trading from the Right Place
            </h1>

            <p className="mt-5 sm:mt-6 text-sm sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed font-normal">
              Compare funding rules, profit splits, payouts, drawdowns and verified reviews.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-7 sm:mt-8 text-xs sm:text-sm text-zinc-400 max-w-3xl mx-auto font-medium">
              <div className="flex items-center gap-1.5">
                <span className="text-white font-mono font-bold">
                  <AnimatedCounter value={firms.length || 10} suffix="+" />
                </span>
                <span className="text-zinc-400">Verified Firms</span>
              </div>

              <span className="text-zinc-700 hidden sm:inline" aria-hidden="true">&middot;</span>

              <div className="flex items-center gap-1.5">
                <span className="text-zinc-200 font-mono font-bold">
                  <AnimatedCounter value={firms.reduce((total, firm) => total + firm.reviewCount, 0) || 180} suffix="+" />
                </span>
                <span className="text-zinc-400">Reviews</span>
              </div>

              <span className="text-zinc-700 hidden sm:inline" aria-hidden="true">&middot;</span>

              <div className="flex items-center gap-1.5">
                <span className="text-zinc-200 font-mono font-bold">
                  <AnimatedCounter value={MOCK_COUPONS.length} />
                </span>
                <span className="text-zinc-400">Active Deals</span>
              </div>

              <span className="text-zinc-700 hidden sm:inline" aria-hidden="true">&middot;</span>

              <div className="flex items-center gap-1.5">
                <span className="text-zinc-200 font-mono font-bold">Daily</span>
                <span className="text-zinc-400">Updates</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EXPANDED MULTI-FILTER & PROP FIRM GRID SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-10">
        
        {/* CLEAN FILTER CONSOLE */}
        <div className="py-4 sm:py-5 space-y-3">
          
          {/* TOP ROW: Search & Sorting */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search firms, platforms (MT5, cTrader, Bybit), or features..."
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
              <span className="text-xs text-zinc-400 font-medium hidden sm:inline">Sort:</span>
              <CustomSelect
                value={sortBy}
                onChange={(val) => setSortBy(val as typeof sortBy)}
                icon={<ArrowUpDown className="h-4 w-4 text-zinc-500" />}
                align="left"
                options={[
                  { value: 'trust', label: 'Highest Trust Score' },
                  { value: 'split', label: 'Highest Profit Split' },
                  { value: 'price', label: 'Lowest Entry Price' },
                  { value: 'capital', label: 'Max Funding ($)' },
                ]}
              />
            </div>

          </div>

          {/* Evaluation and profit split */}
          <div className="flex flex-col md:flex-row md:items-start gap-3 pt-2.5 border-t border-zinc-800/40">
            
            {/* 1. Evaluation Model */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">Evaluation</span>
              <div className="flex items-center gap-1.5 overflow-x-auto touch-scroll no-scrollbar pb-0.5">
                {[
                  { id: 'all', label: 'All' },
                  { id: '1-Step', label: '1-Step' },
                  { id: '2-Step', label: '2-Step' },
                  { id: 'Instant Funding', label: 'Instant' },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedStep(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 min-h-[36px] cursor-pointer ${
                      selectedStep === item.id
                        ? 'bg-white text-zinc-950 shadow-sm'
                        : 'bg-[#121214] border border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Profit Split */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">Profit Split</span>
              <div className="flex items-center gap-1.5 overflow-x-auto touch-scroll no-scrollbar pb-0.5">
                {[
                  { id: 'all', label: 'All' },
                  { id: '90', label: '90%+' },
                  { id: '95', label: '95%+' },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setMinProfitSplit(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 min-h-[36px] cursor-pointer ${
                      minProfitSplit === item.id
                        ? 'bg-white text-zinc-950 shadow-sm'
                        : 'bg-[#121214] border border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Features and results */}
          <div className="space-y-2.5 pt-2.5 border-t border-zinc-800/40">
            
            {/* Feature pills */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mr-1 shrink-0">Features</span>

              <button
                onClick={() => setHasPointsOnly(!hasPointsOnly)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-150 min-h-[34px] font-semibold whitespace-nowrap cursor-pointer ${
                  hasPointsOnly
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                    : 'bg-[#121214] border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>Points</span>
              </button>

              <button
                onClick={() => setHasTokenOnly(!hasTokenOnly)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-150 min-h-[34px] font-semibold whitespace-nowrap cursor-pointer ${
                  hasTokenOnly
                    ? 'bg-[#52b788]/15 border-[#52b788]/40 text-[#52b788]'
                    : 'bg-[#121214] border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>Token</span>
              </button>

              <button
                onClick={() => setConfirmedAirdropOnly(!confirmedAirdropOnly)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-150 min-h-[34px] font-semibold whitespace-nowrap cursor-pointer ${
                  confirmedAirdropOnly
                    ? 'bg-sky-500/15 border-sky-500/40 text-sky-300'
                    : 'bg-[#121214] border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>Confirmed Airdrop</span>
              </button>

              <button
                onClick={() => setNewsAllowedOnly(!newsAllowedOnly)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-150 min-h-[34px] font-semibold whitespace-nowrap cursor-pointer ${
                  newsAllowedOnly
                    ? 'bg-[#52b788]/15 border-[#52b788]/40 text-[#52b788]'
                    : 'bg-[#121214] border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Zap className="h-3.5 w-3.5" />
                <span>News Trading</span>
              </button>

              <button
                onClick={() => setWeekendAllowedOnly(!weekendAllowedOnly)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-150 min-h-[34px] font-semibold whitespace-nowrap cursor-pointer ${
                  weekendAllowedOnly
                    ? 'bg-[#52b788]/15 border-[#52b788]/40 text-[#52b788]'
                    : 'bg-[#121214] border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Moon className="h-3.5 w-3.5" />
                <span>Weekend Holding</span>
              </button>

              <button
                onClick={() => setEaAllowedOnly(!eaAllowedOnly)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-150 min-h-[34px] font-semibold whitespace-nowrap cursor-pointer ${
                  eaAllowedOnly
                    ? 'bg-[#52b788]/15 border-[#52b788]/40 text-[#52b788]'
                    : 'bg-[#121214] border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Bot className="h-3.5 w-3.5" />
                <span>EA &amp; Bots</span>
              </button>
            </div>

            {/* Centered Results Count & Reset Button */}
            <div className="flex items-center justify-center gap-3 pt-2 text-xs text-zinc-400 font-medium border-t border-zinc-800/30">
              <span className="whitespace-nowrap">Showing <strong className="text-white font-bold">{filteredFirms.length}</strong> prop firms</span>
              <button
                onClick={resetFilters}
                disabled={!hasActiveFilters}
                className={`text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-4 cursor-pointer transition-all duration-200 whitespace-nowrap ${
                  hasActiveFilters
                    ? 'opacity-100 pointer-events-auto translate-x-0'
                    : 'opacity-0 pointer-events-none translate-x-1'
                }`}
              >
                Reset Filters
              </button>
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
