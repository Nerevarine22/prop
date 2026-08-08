'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { MOCK_PROP_FIRMS } from '@/lib/data/firms';
import { EvaluationStep, PropFirm, TradingPlatform } from '@/types/firm';

export function AiMatchmaker() {
  const [stepStyle, setStepStyle] = useState<EvaluationStep>('2-Step');
  const [leverage, setLeverage] = useState<string>('1:100');
  const [platform, setPlatform] = useState<TradingPlatform>('cTrader');
  const [result, setResult] = useState<PropFirm | null>(MOCK_PROP_FIRMS[0]);
  const [analyzing, setAnalyzing] = useState(false);

  const handleMatch = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const matched = MOCK_PROP_FIRMS.find(f =>
        f.evaluationSteps.includes(stepStyle) ||
        f.platforms.includes(platform)
      ) || MOCK_PROP_FIRMS[0];
      
      setResult(matched);
      setAnalyzing(false);
    }, 300);
  };

  return (
    <div id="ai-finder" className="propr-card relative p-6 sm:p-8 my-8">
      <div className="relative z-10 max-w-5xl mx-auto space-y-6">
        
        {/* Header Title */}
        <div>
          <h2 className="display-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Algorithmic Crypto Prop Firm Match
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mt-1 leading-relaxed">
            Select your execution preferences below. Our algorithm calculates drawdown risk, profit split efficiency, and platform latency to present your ideal firm.
          </p>
        </div>

        {/* Form & Result Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Control Console */}
          <div className="lg:col-span-7 space-y-5 bg-zinc-900/60 p-5 rounded-xl border border-zinc-800 flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* Option 1 */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-400 mb-2 uppercase tracking-wider">
                  1. Evaluation Model
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['1-Step', '2-Step', 'Instant Funding'].map(style => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setStepStyle(style as EvaluationStep)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold text-center transition-colors ${
                        stepStyle === style
                          ? 'bg-zinc-800 border border-zinc-700 text-white'
                          : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 2 */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-400 mb-2 uppercase tracking-wider">
                  2. Crypto Leverage Ratio
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['1:30', '1:50', '1:100'].map(lev => (
                    <button
                      key={lev}
                      type="button"
                      onClick={() => setLeverage(lev)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold text-center transition-colors ${
                        leverage === lev
                          ? 'bg-zinc-800 border border-zinc-700 text-white'
                          : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      {lev}
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 3 */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-400 mb-2 uppercase tracking-wider">
                  3. Execution Engine / Platform
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['cTrader', 'MT5', 'Bybit', 'TradeLocker'].map(plat => (
                    <button
                      key={plat}
                      type="button"
                      onClick={() => setPlatform(plat as TradingPlatform)}
                      className={`py-2 px-2 rounded-lg text-[11px] font-bold text-center transition-colors ${
                        platform === plat
                          ? 'bg-zinc-800 border border-zinc-700 text-white'
                          : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      {plat}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            <button
              onClick={handleMatch}
              disabled={analyzing}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-zinc-100 text-zinc-950 font-bold text-xs hover:bg-white transition-colors cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>{analyzing ? 'Computing Optimal Parameters...' : 'Calculate Best Match'}</span>
            </button>
          </div>

          {/* AI Result Card */}
          <div className="lg:col-span-5 flex flex-col">
            {result && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="eyebrow-tag border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                      Demo match
                    </span>
                    <span className="text-[11px] text-zinc-500 font-mono">Rule-based prototype</span>
                  </div>

                  <div className="flex items-center gap-3.5">
                    {/* Match results can reference dynamic external firm logos. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={result.logo} alt={result.name} className="h-12 w-12 rounded-lg object-cover border border-zinc-800" />
                    <div>
                      <h3 className="text-xl font-extrabold text-white flex items-center gap-1.5">
                        {result.name}
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      </h3>
                      <p className="text-xs text-zinc-400 line-clamp-1">{result.tagline}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono">
                    <div>
                      <span className="text-zinc-500 block text-[9px] uppercase font-sans">Profit Split</span>
                      <span className="text-emerald-400 font-extrabold text-sm">{result.profitSplit}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[9px] uppercase font-sans">Crypto Leverage</span>
                      <span className="text-zinc-200 font-extrabold text-sm">{result.cryptoLeverage}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[9px] uppercase font-sans">Max Drawdown</span>
                      <span className="text-zinc-300 font-bold">{result.maxDrawdown}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[9px] uppercase font-sans">Evaluation</span>
                      <span className="text-zinc-400 font-medium text-[11px] font-sans truncate block">{result.evaluationSteps.join(', ')}</span>
                    </div>
                  </div>

                  {result.verifiedCoupon && (
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
                      <span className="text-emerald-300 font-bold">Sample promo</span>
                      <span className="font-mono bg-zinc-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 text-[10px] font-bold">
                        {result.verifiedCoupon.code}
                      </span>
                    </div>
                  )}
                </div>

                <Link
                  href={`/prop-firms/${result.slug}`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition-colors border border-zinc-700 mt-2"
                >
                  <span>View Rules & Pricing</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
