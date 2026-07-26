'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { FirmCard } from '@/components/firms/FirmCard';
import { PropFirm } from '@/types/firm';
import { getFirms } from '@/lib/services/firmService';
import { Search, Filter, ArrowUpDown, LayoutGrid, Table, RotateCcw, Scale } from 'lucide-react';

export default function DirectoryPage() {
  const [firms, setFirms] = useState<PropFirm[]>([]);
  const [search, setSearch] = useState('');
  const [selectedStep, setSelectedStep] = useState<string>('All');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [minProfitSplit, setMinProfitSplit] = useState<number>(0);
  const [newsAllowedOnly, setNewsAllowedOnly] = useState(false);
  const [weekendAllowedOnly, setWeekendAllowedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'split' | 'trust'>('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const [comparedFirmIds, setComparedFirmIds] = useState<string[]>([]);

  useEffect(() => {
    getFirms().then(setFirms);
  }, []);

  const handleCompareToggle = (firm: PropFirm) => {
    setComparedFirmIds(prev =>
      prev.includes(firm.id)
        ? prev.filter(id => id !== firm.id)
        : prev.length < 4 ? [...prev, firm.id] : prev
    );
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
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-10 space-y-8 font-satoshi">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <div className="eyebrow-tag mb-2 border-zinc-800 text-zinc-400 bg-zinc-900">DIRECTORY REGISTRY</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Verified Crypto Prop Firm Directory
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Displaying {filteredFirms.length} active prop trading platforms with verified rules.
          </p>
        </div>

        {comparedFirmIds.length > 0 && (
          <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 p-2.5 pl-4 rounded-xl">
            <span className="text-xs text-zinc-300 font-bold">{comparedFirmIds.length} firms selected</span>
            <Link
              href={`/compare?ids=${comparedFirmIds.join(',')}`}
              className="px-4 py-2 rounded-lg bg-zinc-100 text-zinc-950 font-bold text-xs hover:bg-white transition-colors"
            >
              <span>Compare Now</span>
            </Link>
          </div>
        )}
      </div>

      {/* Main Flex Layout: Left Sidebar + Right Card Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Filter Sidebar (Fixed Width, Outside Content) */}
        <aside className="w-full lg:w-72 xl:w-80 shrink-0 space-y-6 propr-card p-6 lg:sticky lg:top-24">
          <div className="space-y-6">
            
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <Filter className="h-4 w-4 text-emerald-400" />
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
              <select
                value={selectedStep}
                onChange={e => setSelectedStep(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-3.5 text-xs text-white focus:border-zinc-700 focus:outline-none font-medium"
              >
                <option value="All">All Evaluation Types</option>
                <option value="1-Step">1-Step Evaluation</option>
                <option value="2-Step">2-Step Evaluation</option>
                <option value="Instant Funding">Instant Funding</option>
              </select>
            </div>

            {/* Platform */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">Trading Platform</label>
              <select
                value={selectedPlatform}
                onChange={e => setSelectedPlatform(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-3.5 text-xs text-white focus:border-zinc-700 focus:outline-none font-medium"
              >
                <option value="All">All Platforms</option>
                <option value="cTrader">cTrader</option>
                <option value="MT5">MT5</option>
                <option value="Bybit">Bybit</option>
                <option value="TradeLocker">TradeLocker</option>
                <option value="Match-Trader">Match-Trader</option>
              </select>
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
                className="w-full accent-emerald-400 bg-zinc-900 rounded-lg cursor-pointer"
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

          </div>
        </aside>

        {/* Right Main Content Area */}
        <main className="flex-1 min-w-0 space-y-6 w-full">
          
          {/* Controls Bar */}
          <div className="flex items-center justify-between bg-[#141416] p-3.5 rounded-2xl border border-zinc-800/80 text-xs">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-zinc-500" />
              <span className="text-zinc-400 font-semibold">Sort by:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-zinc-900 border border-zinc-800 rounded-xl py-1.5 px-3 text-xs text-white focus:outline-none font-medium"
              >
                <option value="rating">Rating (Highest)</option>
                <option value="split">Profit Split (Highest)</option>
                <option value="trust">Trust Score</option>
              </select>
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

          {/* Cards Grid / Table View */}
          {filteredFirms.length === 0 ? (
            <div className="p-12 text-center bg-[#141416] rounded-2xl border border-zinc-800/80 text-zinc-400 space-y-3">
              <p className="text-sm font-semibold">No prop firms match your filter criteria.</p>
              <button onClick={resetFilters} className="text-xs text-emerald-400 font-bold underline">Reset all filters</button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
              {filteredFirms.map(firm => (
                <FirmCard
                  key={firm.id}
                  firm={firm}
                  onCompareToggle={handleCompareToggle}
                  isCompared={comparedFirmIds.includes(firm.id)}
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
                        <Link
                          href={`/firms/${firm.slug}`}
                          className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:text-white text-zinc-300 font-bold text-xs"
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
    </div>
  );
}
