'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { MOCK_PROP_FIRMS } from '@/lib/data/firms';
import { FirmCard } from '@/components/firms/FirmCard';
import { PropFirm } from '@/types/firm';
import { Search, Filter, ArrowUpDown, LayoutGrid, Table, RotateCcw, Scale, ArrowRight } from 'lucide-react';

export default function DirectoryPage() {
  const [search, setSearch] = useState('');
  const [selectedStep, setSelectedStep] = useState<string>('All');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [minProfitSplit, setMinProfitSplit] = useState<number>(0);
  const [newsAllowedOnly, setNewsAllowedOnly] = useState(false);
  const [weekendAllowedOnly, setWeekendAllowedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'split' | 'trust'>('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const [comparedFirmIds, setComparedFirmIds] = useState<string[]>([]);

  const handleCompareToggle = (firm: PropFirm) => {
    setComparedFirmIds(prev =>
      prev.includes(firm.id)
        ? prev.filter(id => id !== firm.id)
        : prev.length < 4 ? [...prev, firm.id] : prev
    );
  };

  const filteredFirms = useMemo(() => {
    return MOCK_PROP_FIRMS.filter(firm => {
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
      if (sortBy === 'trust') return b.trustScore - a.trustScore;
      if (sortBy === 'split') {
        const splitA = parseInt(a.profitSplit.replace(/[^0-9]/g, '')) || 0;
        const splitB = parseInt(b.profitSplit.replace(/[^0-9]/g, '')) || 0;
        return splitB - splitA;
      }
      return 0;
    });
  }, [search, selectedStep, selectedPlatform, minProfitSplit, newsAllowedOnly, weekendAllowedOnly, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setSelectedStep('All');
    setSelectedPlatform('All');
    setMinProfitSplit(0);
    setNewsAllowedOnly(false);
    setWeekendAllowedOnly(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="eyebrow-tag mb-2 border-zinc-800 text-zinc-400 bg-zinc-900">DIRECTORY REGISTRY</div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Verified Crypto Prop Firm Directory
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Displaying {filteredFirms.length} active prop trading platforms with verified rules.
          </p>
        </div>

        {comparedFirmIds.length > 0 && (
          <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 p-2 pl-4 rounded-lg">
            <span className="text-xs text-zinc-300 font-bold">{comparedFirmIds.length} firms selected</span>
            <Link
              href={`/compare?ids=${comparedFirmIds.join(',')}`}
              className="px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-950 font-bold text-xs hover:bg-white transition-colors"
            >
              <span>Compare Now</span>
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Filter Sidebar */}
        <aside className="lg:col-span-3 space-y-6 propr-card p-5 h-fit">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-zinc-400" />
                Filters
              </h3>
              <button
                onClick={resetFilters}
                className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            </div>

            {/* Search */}
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Search Firm Name</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-1.5 pl-8 pr-3 text-xs text-zinc-200 focus:border-zinc-700 focus:outline-none"
                />
              </div>
            </div>

            {/* Evaluation Step */}
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Evaluation Model</label>
              <select
                value={selectedStep}
                onChange={e => setSelectedStep(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-1.5 px-3 text-xs text-zinc-200 focus:border-zinc-700 focus:outline-none"
              >
                <option value="All">All Evaluation Types</option>
                <option value="1-Step">1-Step Evaluation</option>
                <option value="2-Step">2-Step Evaluation</option>
                <option value="Instant Funding">Instant Funding</option>
              </select>
            </div>

            {/* Platform */}
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Trading Platform</label>
              <select
                value={selectedPlatform}
                onChange={e => setSelectedPlatform(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-1.5 px-3 text-xs text-zinc-200 focus:border-zinc-700 focus:outline-none"
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
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 mb-1.5">
                <span>Min Profit Split</span>
                <span className="text-emerald-400 font-extrabold">{minProfitSplit > 0 ? `${minProfitSplit}%+` : 'Any'}</span>
              </div>
              <input
                type="range"
                min="0"
                max="95"
                step="5"
                value={minProfitSplit}
                onChange={e => setMinProfitSplit(Number(e.target.value))}
                className="w-full accent-zinc-100 bg-zinc-900 rounded-lg cursor-pointer"
              />
            </div>

            {/* Rule Checkboxes */}
            <div className="space-y-2.5 pt-3 border-t border-zinc-800 text-xs text-zinc-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newsAllowedOnly}
                  onChange={e => setNewsAllowedOnly(e.target.checked)}
                  className="rounded border-zinc-800 bg-zinc-900 text-zinc-100 focus:ring-zinc-700"
                />
                News Trading Allowed
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={weekendAllowedOnly}
                  onChange={e => setWeekendAllowedOnly(e.target.checked)}
                  className="rounded border-zinc-800 bg-zinc-900 text-zinc-100 focus:ring-zinc-700"
                />
                Weekend Holding Allowed
              </label>
            </div>

          </div>
        </aside>

        {/* Results */}
        <main className="lg:col-span-9 space-y-6">
          
          <div className="flex items-center justify-between bg-zinc-900 p-3 rounded-lg border border-zinc-800 text-xs">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-3.5 w-3.5 text-zinc-500" />
              <span className="text-zinc-400 font-semibold">Sort by:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-zinc-950 border border-zinc-800 rounded-lg py-1 px-2.5 text-xs text-zinc-200 focus:outline-none"
              >
                <option value="rating">Rating (Highest)</option>
                <option value="split">Profit Split (Highest)</option>
                <option value="trust">Trust Score</option>
              </select>
            </div>

            <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'table' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}
              >
                <Table className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {filteredFirms.length === 0 ? (
            <div className="p-12 text-center bg-zinc-900/60 rounded-xl border border-zinc-800 text-zinc-400">
              <p className="text-sm font-semibold mb-2">No prop firms match your filter criteria.</p>
              <button onClick={resetFilters} className="text-xs text-zinc-200 underline">Reset all filters</button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="overflow-x-auto propr-card p-0 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-500 font-bold uppercase text-[9px]">
                  <tr>
                    <th className="p-4">Prop Firm</th>
                    <th className="p-4">Profit Split</th>
                    <th className="p-4">Leverage</th>
                    <th className="p-4">Max Drawdown</th>
                    <th className="p-4">Platforms</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {filteredFirms.map(firm => (
                    <tr key={firm.id} className="hover:bg-zinc-900/60 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img src={firm.logo} alt={firm.name} className="h-8 w-8 rounded-lg object-cover" />
                        <div>
                          <Link href={`/firms/${firm.slug}`} className="font-bold text-white hover:text-zinc-300">
                            {firm.name}
                          </Link>
                          <span className="block text-[10px] text-zinc-500">★ {firm.rating.toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-emerald-400 font-extrabold">{firm.profitSplit}</td>
                      <td className="p-4 font-mono text-sky-400">{firm.cryptoLeverage}</td>
                      <td className="p-4 text-zinc-300">{firm.maxDrawdown}</td>
                      <td className="p-4 text-zinc-400">{firm.platforms.join(', ')}</td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/firms/${firm.slug}`}
                          className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs"
                        >
                          Details
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
