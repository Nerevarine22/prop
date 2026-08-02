'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PropFirm } from '@/types/firm';
import { getFirms } from '@/lib/services/firmService';
import { FirmCard } from '@/components/firms/FirmCard';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { Scale, CheckCircle2, XCircle, Trash2, ArrowRight, Search, Filter, ArrowUpDown, LayoutGrid, Table, RotateCcw, Plus, X } from 'lucide-react';

function CompareContent() {
  const searchParams = useSearchParams();
  const [firms, setFirms] = useState<PropFirm[]>([]);
  const [loading, setLoading] = useState(true);

  // Directory filter states
  const [search, setSearch] = useState('');
  const [selectedStep, setSelectedStep] = useState<string>('All');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [minProfitSplit, setMinProfitSplit] = useState<number>(0);
  const [newsAllowedOnly, setNewsAllowedOnly] = useState(false);
  const [weekendAllowedOnly, setWeekendAllowedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'split' | 'trust'>('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Comparison Matrix state
  const [selectedFirms, setSelectedFirms] = useState<PropFirm[]>([]);

  useEffect(() => {
    getFirms().then(data => {
      setFirms(data);
      setLoading(false);

      const idsParam = searchParams.get('ids');
      if (idsParam) {
        const ids = idsParam.split(',');
        const found = data.filter(f => ids.includes(f.id));
        if (found.length > 0) {
          setSelectedFirms(found);
          return;
        }
      }
      // Default to first 2 firms for comparison
      if (data.length >= 2) {
        setSelectedFirms([data[0], data[1]]);
      } else {
        setSelectedFirms(data);
      }
    });
  }, [searchParams]);

  const handleCompareToggle = (firm: PropFirm) => {
    setSelectedFirms(prev => {
      const exists = prev.some(f => f.id === firm.id);
      if (exists) {
        return prev.filter(f => f.id !== firm.id);
      } else {
        if (prev.length >= 4) {
          alert('You can compare up to 4 firms side-by-side.');
          return prev;
        }
        return [...prev, firm];
      }
    });
  };

  const removeFirm = (id: string) => {
    setSelectedFirms(prev => prev.filter(f => f.id !== id));
  };

  const filteredFirms = useMemo(() => {
    return firms.filter(firm => {
      if (search.trim() && !firm.name.toLowerCase().includes(search.toLowerCase()) && !firm.tagline.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (selectedStep !== 'All' && !firm.evaluationSteps.includes(selectedStep as any)) {
        return false;
      }
      if (selectedPlatform !== 'All' && !firm.platforms.includes(selectedPlatform as any)) {
        return false;
      }
      if (minProfitSplit > 0) {
        const splitVal = parseInt(firm.profitSplit.replace(/[^0-9]/g, '')) || 0;
        if (splitVal < minProfitSplit) return false;
      }
      if (newsAllowedOnly && !firm.newsTradingAllowed) return false;
      if (weekendAllowedOnly && !firm.weekendHoldingAllowed) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'trust') return (b.trustScore || 90) - (a.trustScore || 90);
      if (sortBy === 'split') {
        const splitA = parseInt(a.profitSplit.replace(/[^0-9]/g, '')) || 0;
        const splitB = parseInt(b.profitSplit.replace(/[^0-9]/g, '')) || 0;
        return splitB - splitA;
      }
      return 0;
    });
  }, [firms, search, selectedStep, selectedPlatform, minProfitSplit, newsAllowedOnly, weekendAllowedOnly, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setSelectedStep('All');
    setSelectedPlatform('All');
    setMinProfitSplit(0);
    setNewsAllowedOnly(false);
    setWeekendAllowedOnly(false);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-10 space-y-12 font-satoshi">
      
      {/* 1. HEADER & MATRIX TOGGLE BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <div className="eyebrow-tag mb-2 border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
            <Scale className="h-3.5 w-3.5" />
            COMPARE & DIRECTORY REGISTRY
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Crypto Prop Firm Comparison Engine
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Compare rules, leverage, drawdown limits, and pricing side-by-side or explore the full directory below.
          </p>
        </div>

        {/* Selected Counter & Toolbar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#141416] border border-zinc-800/80 px-4 py-2 rounded-xl text-xs font-bold">
            <span className="text-zinc-400">Comparing:</span>
            <span className="text-[#52b788] font-mono font-extrabold">{selectedFirms.length} / 4</span>
          </div>

          {selectedFirms.length > 0 && (
            <button
              onClick={() => setSelectedFirms([])}
              className="py-2 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-bold transition-colors"
            >
              Clear Comparison
            </button>
          )}
        </div>
      </div>

      {/* 2. SIDE-BY-SIDE COMPARISON MATRIX (When firms are selected) */}
      {selectedFirms.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
              <Scale className="h-4 w-4 text-[#52b788]" />
              <span>Side-by-Side Comparison Matrix</span>
            </h2>
            <span className="text-xs text-zinc-400">Showing {selectedFirms.length} selected prop firms</span>
          </div>

          <div className="overflow-x-auto rounded-2xl bg-[#141416] border border-zinc-800/80 shadow-xl">
            <table className="w-full text-left text-xs min-w-[750px]">
              <thead>
                <tr className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 uppercase font-semibold text-[10px]">
                  <th className="p-4 w-52">Feature / Spec</th>
                  {selectedFirms.map(firm => (
                    <th key={firm.id} className="p-4 border-l border-zinc-800/80 min-w-[220px] relative">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <img src={firm.logo} alt={firm.name} className="h-10 w-10 rounded-xl object-cover border border-zinc-800 shrink-0" />
                          <div className="min-w-0">
                            <Link href={`/firms/${firm.slug}`} className="font-bold text-white hover:text-[#52b788] block text-sm truncate font-satoshi">
                              {firm.name}
                            </Link>
                            <span className="text-[11px] text-zinc-500 font-mono">★ {firm.rating.toFixed(1)}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => removeFirm(firm.id)}
                          className="text-zinc-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
                          title="Remove from comparison"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-800/60 font-medium text-zinc-300">
                {/* Profit Split */}
                <tr className="hover:bg-zinc-900/40 transition-colors">
                  <td className="p-4 font-semibold text-zinc-400">Max Profit Split</td>
                  {selectedFirms.map(firm => (
                    <td key={firm.id} className="p-4 border-l border-zinc-800/80 font-mono text-[#52b788] font-bold text-sm">
                      {firm.profitSplit}
                    </td>
                  ))}
                </tr>

                {/* Crypto Leverage */}
                <tr className="hover:bg-zinc-900/40 transition-colors">
                  <td className="p-4 font-semibold text-zinc-400">Crypto Leverage</td>
                  {selectedFirms.map(firm => (
                    <td key={firm.id} className="p-4 border-l border-zinc-800/80 font-mono text-sky-400 font-bold">
                      {firm.cryptoLeverage}
                    </td>
                  ))}
                </tr>

                {/* Max Drawdown */}
                <tr className="hover:bg-zinc-900/40 transition-colors">
                  <td className="p-4 font-semibold text-zinc-400">Max Drawdown</td>
                  {selectedFirms.map(firm => (
                    <td key={firm.id} className="p-4 border-l border-zinc-800/80 font-mono text-white">
                      {firm.maxDrawdown}
                    </td>
                  ))}
                </tr>

                {/* Daily Drawdown */}
                <tr className="hover:bg-zinc-900/40 transition-colors">
                  <td className="p-4 font-semibold text-zinc-400">Daily Drawdown</td>
                  {selectedFirms.map(firm => (
                    <td key={firm.id} className="p-4 border-l border-zinc-800/80 font-mono text-zinc-300">
                      {firm.dailyDrawdown}
                    </td>
                  ))}
                </tr>

                {/* Supported Platforms */}
                <tr className="hover:bg-zinc-900/40 transition-colors">
                  <td className="p-4 font-semibold text-zinc-400">Trading Platforms</td>
                  {selectedFirms.map(firm => (
                    <td key={firm.id} className="p-4 border-l border-zinc-800/80 text-zinc-300">
                      {firm.platforms.join(', ')}
                    </td>
                  ))}
                </tr>

                {/* News Trading */}
                <tr className="hover:bg-zinc-900/40 transition-colors">
                  <td className="p-4 font-semibold text-zinc-400">News Trading</td>
                  {selectedFirms.map(firm => (
                    <td key={firm.id} className="p-4 border-l border-zinc-800/80">
                      {firm.newsTradingAllowed ? (
                        <span className="inline-flex items-center gap-1.5 text-[#52b788] font-bold"><CheckCircle2 className="h-4 w-4" /> Allowed</span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-red-400 font-bold"><XCircle className="h-4 w-4" /> Restricted</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Weekend Holding */}
                <tr className="hover:bg-zinc-900/40 transition-colors">
                  <td className="p-4 font-semibold text-zinc-400">Weekend Holding</td>
                  {selectedFirms.map(firm => (
                    <td key={firm.id} className="p-4 border-l border-zinc-800/80">
                      {firm.weekendHoldingAllowed ? (
                        <span className="inline-flex items-center gap-1.5 text-[#52b788] font-bold"><CheckCircle2 className="h-4 w-4" /> Allowed</span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-red-400 font-bold"><XCircle className="h-4 w-4" /> No</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Promo Deal */}
                <tr className="hover:bg-zinc-900/40 transition-colors">
                  <td className="p-4 font-semibold text-zinc-400">Active Verified Code</td>
                  {selectedFirms.map(firm => (
                    <td key={firm.id} className="p-4 border-l border-zinc-800/80">
                      {firm.verifiedCoupon ? (
                        <div className="bg-[#52b788]/10 border border-[#52b788]/20 p-2.5 rounded-xl text-center">
                          <span className="text-[#52b788] font-bold block text-xs">{firm.verifiedCoupon.discount}</span>
                          <span className="font-mono text-zinc-300 text-[11px] block mt-0.5">Code: <strong>{firm.verifiedCoupon.code}</strong></span>
                        </div>
                      ) : (
                        <span className="text-zinc-600 text-xs">No active promo</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Profile Link CTAs */}
                <tr>
                  <td className="p-4"></td>
                  {selectedFirms.map(firm => (
                    <td key={firm.id} className="p-4 border-l border-zinc-800/80">
                      <Link
                        href={`/firms/${firm.slug}`}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs shadow-sm transition-colors"
                      >
                        <span>Explore Profile</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>

            </table>
          </div>
        </section>
      )}

      {/* 3. FULL DIRECTORY GRID WITH LEFT SIDEBAR FILTERS */}
      <section className="space-y-6 pt-4">
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Prop Firm Directory & Filter Registry</h2>
            <p className="text-xs text-zinc-400">Select any firm below to instantly add or remove it from the comparison matrix above.</p>
          </div>
        </div>

        {/* Main Flex Layout: Left Sidebar Filters + Right 3-Column Cards Grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Filter Sidebar (Collapsible on mobile) */}
          <aside className="w-full lg:w-72 xl:w-80 shrink-0 propr-card p-5 lg:p-6 lg:sticky lg:top-24">
            
            {/* Mobile Filter Header Toggle */}
            <div className="flex items-center justify-between lg:hidden cursor-pointer" onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <Filter className="h-4 w-4 text-[#52b788]" />
                <span>Filters & Options</span>
              </h3>
              <button
                type="button"
                className="text-xs font-bold text-[#52b788] px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800"
              >
                {mobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>

            <div className={`space-y-6 mt-4 lg:mt-0 ${mobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
              
              <div className="hidden lg:flex items-center justify-between">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                  <Filter className="h-4 w-4 text-[#52b788]" />
                  <span>Filters</span>
                </h3>
                <button
                  onClick={resetFilters}
                  className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors font-medium"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </button>
              </div>

              {/* Search */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">Search Firm Name</label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search firms..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-500 focus:border-zinc-700 focus:outline-none font-medium"
                  />
                </div>
              </div>

              {/* Evaluation Step */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">Evaluation Model</label>
                <CustomSelect
                  value={selectedStep}
                  onChange={val => setSelectedStep(val)}
                  options={[
                    { value: 'All', label: 'All Evaluation Types' },
                    { value: '1-Step', label: '1-Step Evaluation' },
                    { value: '2-Step', label: '2-Step Evaluation' },
                    { value: 'Instant Funding', label: 'Instant Funding' },
                  ]}
                />
              </div>

              {/* Platform */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">Trading Platform</label>
                <CustomSelect
                  value={selectedPlatform}
                  onChange={val => setSelectedPlatform(val)}
                  options={[
                    { value: 'All', label: 'All Platforms' },
                    { value: 'cTrader', label: 'cTrader' },
                    { value: 'MT5', label: 'MT5' },
                    { value: 'Bybit', label: 'Bybit' },
                    { value: 'TradeLocker', label: 'TradeLocker' },
                    { value: 'Match-Trader', label: 'Match-Trader' },
                  ]}
                />
              </div>

              {/* Min Profit Split */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                  <span>Min Profit Split</span>
                  <span className="text-[#52b788] font-extrabold">{minProfitSplit > 0 ? `${minProfitSplit}%+` : 'Any'}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="95"
                  step="5"
                  value={minProfitSplit}
                  onChange={e => setMinProfitSplit(Number(e.target.value))}
                  className="w-full accent-[#52b788] bg-zinc-900 rounded-lg cursor-pointer"
                />
              </div>

              {/* Rule Checkboxes */}
              <div className="space-y-3 pt-4 border-t border-zinc-800/80 text-xs text-zinc-300">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newsAllowedOnly}
                    onChange={e => setNewsAllowedOnly(e.target.checked)}
                    className="rounded border-zinc-800 bg-zinc-900 text-emerald-400 focus:ring-emerald-500"
                  />
                  <span className="font-medium">News Trading Allowed</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={weekendAllowedOnly}
                    onChange={e => setWeekendAllowedOnly(e.target.checked)}
                    className="rounded border-zinc-800 bg-zinc-900 text-emerald-400 focus:ring-emerald-500"
                  />
                  <span className="font-medium">Weekend Holding Allowed</span>
                </label>
              </div>

              <button
                onClick={resetFilters}
                className="w-full py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-bold lg:hidden"
              >
                Reset All Filters
              </button>

            </div>
          </aside>

          {/* Right Cards Grid Content */}
          <main className="flex-1 min-w-0 space-y-6 w-full">
            
            {/* Sorting & Layout Toolbar */}
            <div className="flex items-center justify-between bg-[#141416] p-3.5 rounded-2xl border border-zinc-800/80 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-zinc-400 font-semibold">Sort by:</span>
                <CustomSelect
                  value={sortBy}
                  onChange={val => setSortBy(val as any)}
                  icon={<ArrowUpDown className="h-4 w-4 text-zinc-500" />}
                  options={[
                    { value: 'rating', label: 'Rating (Highest)' },
                    { value: 'split', label: 'Profit Split (Highest)' },
                    { value: 'trust', label: 'Trust Score' },
                  ]}
                />
              </div>

              <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}
                  title="Grid View"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}
                  title="Table View"
                >
                  <Table className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Grid / Table View */}
            {loading ? (
              <div className="p-12 text-center text-zinc-500 text-xs">Loading directory...</div>
            ) : filteredFirms.length === 0 ? (
              <div className="p-12 text-center bg-[#141416] rounded-2xl border border-zinc-800/80 text-zinc-400 space-y-3">
                <p className="text-sm font-semibold">No prop firms match your filter criteria.</p>
                <button onClick={resetFilters} className="text-xs text-[#52b788] font-bold underline">Reset all filters</button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
                {filteredFirms.map(firm => (
                  <FirmCard
                    key={firm.id}
                    firm={firm}
                    onCompareToggle={handleCompareToggle}
                    isCompared={selectedFirms.some(s => s.id === firm.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl bg-[#141416] border border-zinc-800/80 overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-4">Prop Firm</th>
                      <th className="p-4">Profit Split</th>
                      <th className="p-4">Leverage</th>
                      <th className="p-4">Max Drawdown</th>
                      <th className="p-4">Platforms</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 font-medium text-zinc-300">
                    {filteredFirms.map(firm => (
                      <tr key={firm.id} className="hover:bg-zinc-900/40 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img src={firm.logo} alt={firm.name} className="h-10 w-10 rounded-xl object-cover border border-zinc-800 shrink-0" />
                          <div>
                            <Link href={`/firms/${firm.slug}`} className="font-bold text-white hover:text-zinc-200">
                              {firm.name}
                            </Link>
                            <span className="block text-[11px] text-zinc-500">★ {firm.rating.toFixed(1)} ({firm.reviewCount})</span>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-[#52b788] font-bold">{firm.profitSplit}</td>
                        <td className="p-4 font-mono text-sky-400">{firm.cryptoLeverage}</td>
                        <td className="p-4 text-zinc-300">{firm.maxDrawdown}</td>
                        <td className="p-4 text-zinc-400">{firm.platforms.join(', ')}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleCompareToggle(firm)}
                            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors mr-2 ${
                              selectedFirms.some(s => s.id === firm.id)
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                            }`}
                          >
                            {selectedFirms.some(s => s.id === firm.id) ? 'Comparing' : '+ Compare'}
                          </button>
                          <Link
                            href={`/firms/${firm.slug}`}
                            className="px-3.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs transition-colors inline-block"
                          >
                            Explore
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </main>

        </div>

      </section>

    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="p-12 text-center text-zinc-400 text-xs font-semibold font-satoshi">
        Loading comparison directory...
      </div>
    }>
      <CompareContent />
    </Suspense>
  );
}
