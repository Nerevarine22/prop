'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MOCK_PROP_FIRMS } from '@/lib/data/firms';
import { PropFirm } from '@/types/firm';
import { Scale, CheckCircle2, XCircle, Trash2, ArrowRight } from 'lucide-react';

function CompareContent() {
  const searchParams = useSearchParams();
  const [selectedFirms, setSelectedFirms] = useState<PropFirm[]>([]);

  useEffect(() => {
    const idsParam = searchParams.get('ids');
    if (idsParam) {
      const ids = idsParam.split(',');
      const found = MOCK_PROP_FIRMS.filter(f => ids.includes(f.id));
      setSelectedFirms(found.length > 0 ? found : [MOCK_PROP_FIRMS[0], MOCK_PROP_FIRMS[1]]);
    } else {
      setSelectedFirms([MOCK_PROP_FIRMS[0], MOCK_PROP_FIRMS[1], MOCK_PROP_FIRMS[2]]);
    }
  }, [searchParams]);

  const removeFirm = (id: string) => {
    if (selectedFirms.length <= 1) return;
    const updated = selectedFirms.filter(f => f.id !== id);
    setSelectedFirms(updated);
  };

  const addFirm = (firm: PropFirm) => {
    if (selectedFirms.find(f => f.id === firm.id) || selectedFirms.length >= 4) return;
    setSelectedFirms([...selectedFirms, firm]);
  };

  const unselectedFirms = MOCK_PROP_FIRMS.filter(f => !selectedFirms.some(s => s.id === f.id));

  return (
    <div className="space-y-8">
      {/* Page Title & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Scale className="h-7 w-7 text-sky-400" />
            Prop Firm Comparison Matrix
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Compare rules, leverage, drawdown limits, and pricing side-by-side for up to 4 firms.
          </p>
        </div>

        {selectedFirms.length < 4 && unselectedFirms.length > 0 && (
          <div className="flex items-center gap-2">
            <select
              onChange={(e) => {
                const found = MOCK_PROP_FIRMS.find(f => f.id === e.target.value);
                if (found) addFirm(found);
              }}
              className="bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:border-sky-500 focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>+ Add Firm to Compare</option>
              {unselectedFirms.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* COMPARISON MATRIX TABLE */}
      <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/60 shadow-2xl">
        <table className="w-full text-left text-xs min-w-[700px]">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800">
              <th className="p-4 w-48 text-slate-400 uppercase font-semibold text-[10px]">Feature / Metric</th>
              {selectedFirms.map(firm => (
                <th key={firm.id} className="p-4 border-l border-slate-800/80 min-w-[200px] relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={firm.logo} alt={firm.name} className="h-8 w-8 rounded-lg object-cover" />
                      <div>
                        <Link href={`/firms/${firm.slug}`} className="font-bold text-white hover:text-sky-400 block text-sm">
                          {firm.name}
                        </Link>
                        <span className="text-[10px] text-slate-400">★ {firm.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    {selectedFirms.length > 1 && (
                      <button
                        onClick={() => removeFirm(firm.id)}
                        className="text-slate-500 hover:text-red-400 p-1 rounded-lg"
                        title="Remove"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60">
            {/* Profit Split */}
            <tr className="hover:bg-slate-800/30 transition-colors">
              <td className="p-4 font-semibold text-slate-300">Max Profit Split</td>
              {selectedFirms.map(firm => (
                <td key={firm.id} className="p-4 border-l border-slate-800/80 font-mono text-emerald-400 font-bold text-sm">
                  {firm.profitSplit}
                </td>
              ))}
            </tr>

            {/* Crypto Leverage */}
            <tr className="hover:bg-slate-800/30 transition-colors">
              <td className="p-4 font-semibold text-slate-300">Crypto Leverage</td>
              {selectedFirms.map(firm => (
                <td key={firm.id} className="p-4 border-l border-slate-800/80 font-mono text-sky-400 font-bold">
                  {firm.cryptoLeverage}
                </td>
              ))}
            </tr>

            {/* Max Drawdown */}
            <tr className="hover:bg-slate-800/30 transition-colors">
              <td className="p-4 font-semibold text-slate-300">Max Overall Drawdown</td>
              {selectedFirms.map(firm => (
                <td key={firm.id} className="p-4 border-l border-slate-800/80 font-mono text-slate-200">
                  {firm.maxDrawdown}
                </td>
              ))}
            </tr>

            {/* Daily Drawdown */}
            <tr className="hover:bg-slate-800/30 transition-colors">
              <td className="p-4 font-semibold text-slate-300">Daily Drawdown Limit</td>
              {selectedFirms.map(firm => (
                <td key={firm.id} className="p-4 border-l border-slate-800/80 font-mono text-slate-300">
                  {firm.dailyDrawdown}
                </td>
              ))}
            </tr>

            {/* Platforms */}
            <tr className="hover:bg-slate-800/30 transition-colors">
              <td className="p-4 font-semibold text-slate-300">Supported Platforms</td>
              {selectedFirms.map(firm => (
                <td key={firm.id} className="p-4 border-l border-slate-800/80 text-slate-300">
                  {firm.platforms.join(', ')}
                </td>
              ))}
            </tr>

            {/* News Trading */}
            <tr className="hover:bg-slate-800/30 transition-colors">
              <td className="p-4 font-semibold text-slate-300">News Trading</td>
              {selectedFirms.map(firm => (
                <td key={firm.id} className="p-4 border-l border-slate-800/80">
                  {firm.newsTradingAllowed ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold"><CheckCircle2 className="h-4 w-4" /> Allowed</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-400 font-semibold"><XCircle className="h-4 w-4" /> Restricted</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Weekend Holding */}
            <tr className="hover:bg-slate-800/30 transition-colors">
              <td className="p-4 font-semibold text-slate-300">Weekend Holding</td>
              {selectedFirms.map(firm => (
                <td key={firm.id} className="p-4 border-l border-slate-800/80">
                  {firm.weekendHoldingAllowed ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold"><CheckCircle2 className="h-4 w-4" /> Yes</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-400 font-semibold"><XCircle className="h-4 w-4" /> No</span>
                  )}
                </td>
              ))}
            </tr>

            {/* EA / Bots */}
            <tr className="hover:bg-slate-800/30 transition-colors">
              <td className="p-4 font-semibold text-slate-300">EA / Trading Bots</td>
              {selectedFirms.map(firm => (
                <td key={firm.id} className="p-4 border-l border-slate-800/80">
                  {firm.eaAllowed ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold"><CheckCircle2 className="h-4 w-4" /> Allowed</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-400 font-semibold"><XCircle className="h-4 w-4" /> No</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Payout Frequency */}
            <tr className="hover:bg-slate-800/30 transition-colors">
              <td className="p-4 font-semibold text-slate-300">Payout Frequency</td>
              {selectedFirms.map(firm => (
                <td key={firm.id} className="p-4 border-l border-slate-800/80 text-slate-300 font-medium">
                  {firm.payoutFrequency}
                </td>
              ))}
            </tr>

            {/* $10k Account Price */}
            <tr className="hover:bg-slate-800/30 transition-colors">
              <td className="p-4 font-semibold text-slate-300">$10,000 Tier Price</td>
              {selectedFirms.map(firm => {
                const tier10k = firm.accountTiers.find(t => t.accountSize === 10000);
                return (
                  <td key={firm.id} className="p-4 border-l border-slate-800/80 font-mono text-sky-400 font-bold text-sm">
                    {tier10k ? `$${tier10k.price}` : 'N/A'}
                  </td>
                );
              })}
            </tr>

            {/* Active Coupon */}
            <tr className="hover:bg-slate-800/30 transition-colors">
              <td className="p-4 font-semibold text-slate-300">Promo Code</td>
              {selectedFirms.map(firm => (
                <td key={firm.id} className="p-4 border-l border-slate-800/80">
                  {firm.verifiedCoupon ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-xl text-center">
                      <span className="text-emerald-400 font-bold block text-xs">{firm.verifiedCoupon.discount}</span>
                      <span className="font-mono text-emerald-300 text-[10px] block mt-0.5">{firm.verifiedCoupon.code}</span>
                    </div>
                  ) : (
                    <span className="text-slate-500 text-xs">No active code</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Actions Row */}
            <tr>
              <td className="p-4"></td>
              {selectedFirms.map(firm => (
                <td key={firm.id} className="p-4 border-l border-slate-800/80">
                  <Link
                    href={`/firms/${firm.slug}`}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md shadow-sky-500/20"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Suspense fallback={
        <div className="p-12 text-center text-slate-400 text-xs font-semibold">
          Loading comparison matrix...
        </div>
      }>
        <CompareContent />
      </Suspense>
    </div>
  );
}
