'use client';

import React, { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import { MOCK_PROP_FIRMS } from '@/lib/data/firms';
import { getFirms } from '@/lib/services/firmService';
import { PropFirm } from '@/types/firm';
import { Star, ShieldCheck, CheckCircle2, XCircle, Percent, ArrowUpRight, Scale, ExternalLink, Calendar, MapPin, Building2, Copy, Check } from 'lucide-react';

export default function FirmProfilePage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [firm, setFirm] = useState<PropFirm | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const [activeTab, setActiveTab] = useState<'rules' | 'tiers' | 'reviews'>('rules');

  useEffect(() => {
    getFirms().then(allFirms => {
      const found = allFirms.find(f => f.slug === slug) || MOCK_PROP_FIRMS.find(f => f.slug === slug) || null;
      setFirm(found);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4 font-satoshi">
        <div className="h-8 w-48 bg-zinc-800/60 rounded-lg animate-pulse mx-auto" />
        <p className="text-zinc-500 text-xs">Loading prop firm profile...</p>
      </div>
    );
  }

  if (!firm) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-white">Prop Firm Not Found</h1>
        <p className="text-slate-400 text-sm">The requested firm slug does not exist in our directory.</p>
        <Link href="/firms" className="inline-block px-4 py-2 bg-sky-500 text-white rounded-xl text-xs font-bold">
          Back to Directory
        </Link>
      </div>
    );
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Top Breadcrumb */}
      <nav className="text-xs text-slate-500 flex items-center gap-2">
        <Link href="/" className="hover:text-slate-300">Home</Link>
        <span>/</span>
        <Link href="/firms" className="hover:text-slate-300">Directory</Link>
        <span>/</span>
        <span className="text-slate-300 font-semibold">{firm.name}</span>
      </nav>

      {/* HEADER HERO CARD */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-start gap-4">
            <img
              src={firm.logo}
              alt={firm.name}
              className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover border border-slate-800 shadow-md"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{firm.name}</h1>
                {firm.badge && (
                  <span className="text-xs font-bold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2.5 py-0.5 rounded-full">
                    {firm.badge}
                  </span>
                )}
                <span className="text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  Trust Score {firm.trustScore}/100
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">{firm.tagline}</p>

              <div className="flex items-center gap-4 text-xs text-slate-400 pt-1 flex-wrap">
                <div className="flex items-center text-amber-400">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-bold ml-1 text-slate-200">{firm.rating.toFixed(1)}</span>
                  <span className="text-slate-500 ml-1">({firm.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-500" />
                  <span>{firm.headquarters}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-500" />
                  <span>Est. {firm.yearEstablished}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5">
            {firm.verifiedCoupon && (
              <button
                onClick={() => handleCopyCode(firm.verifiedCoupon!.code)}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
              >
                {copiedCoupon ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>{copiedCoupon ? 'Code Copied!' : `Claim ${firm.verifiedCoupon.discount}`}</span>
              </button>
            )}
            <Link
              href="/compare"
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
            >
              <Scale className="h-4 w-4 text-sky-400" />
              <span>Compare with Others</span>
            </Link>
          </div>

        </div>

        {/* Quick Spec Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs font-mono">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-sans">Profit Split</span>
            <span className="text-emerald-400 font-bold text-base">{firm.profitSplit}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-sans">Crypto Leverage</span>
            <span className="text-sky-400 font-bold text-base">{firm.cryptoLeverage}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-sans">Max Drawdown</span>
            <span className="text-slate-200 font-bold text-base">{firm.maxDrawdown}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-sans">Payout Frequency</span>
            <span className="text-slate-300 font-medium text-xs truncate block">{firm.payoutFrequency}</span>
          </div>
        </div>
      </div>

      {/* PROFILE TABS */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'rules' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Trading Rules & Conditions
          </button>
          <button
            onClick={() => setActiveTab('tiers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'tiers' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Account Sizes & Pricing ({firm.accountTiers.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'reviews' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Trader Reviews ({firm.reviews?.length || 0})
          </button>
        </div>

        {/* TAB 1: RULES */}
        {activeTab === 'rules' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Rules Checklist */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
              <h3 className="text-sm font-bold text-white">Evaluation & Trading Permissions</h3>
              <ul className="space-y-3 text-xs">
                <li className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-300 font-medium">News Trading Allowed</span>
                  {firm.newsTradingAllowed ? (
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold"><CheckCircle2 className="h-4 w-4" /> Yes</span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-400 font-semibold"><XCircle className="h-4 w-4" /> Restricted</span>
                  )}
                </li>
                <li className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-300 font-medium">Weekend Position Holding</span>
                  {firm.weekendHoldingAllowed ? (
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold"><CheckCircle2 className="h-4 w-4" /> Yes</span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-400 font-semibold"><XCircle className="h-4 w-4" /> No</span>
                  )}
                </li>
                <li className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-300 font-medium">Expert Advisors (EAs) / Bots</span>
                  {firm.eaAllowed ? (
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold"><CheckCircle2 className="h-4 w-4" /> Allowed</span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-400 font-semibold"><XCircle className="h-4 w-4" /> Prohibited</span>
                  )}
                </li>
                <li className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-300 font-medium">No Time Limit on Phase 1 & 2</span>
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold"><CheckCircle2 className="h-4 w-4" /> Unlimited</span>
                </li>
              </ul>
            </div>

            {/* Platforms & Assets */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
              <h3 className="text-sm font-bold text-white">Supported Platforms & Crypto Assets</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px] mb-1">Trading Platforms</span>
                  <div className="flex gap-2 flex-wrap">
                    {firm.platforms.map(plat => (
                      <span key={plat} className="px-3 py-1 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-300 font-semibold">
                        {plat}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px] mb-1">Crypto Assets Available</span>
                  <p className="text-slate-200 font-medium">{firm.cryptoPairsCount}+ Pairs (BTC, ETH, SOL, AVAX, XRP, DOGE, NEAR, & Top Altcoins)</p>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px] mb-1">Evaluation Steps Available</span>
                  <div className="flex gap-2 flex-wrap">
                    {firm.evaluationSteps.map(step => (
                      <span key={step} className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                        {step}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: PRICING TIERS */}
        {activeTab === 'tiers' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {firm.accountTiers.map((tier, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Account Size</span>
                  <span className="text-lg font-extrabold text-white">${tier.accountSize.toLocaleString()}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Profit Target</span>
                    <span className="text-emerald-400 font-bold">{tier.profitTarget}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Max Drawdown</span>
                    <span className="text-slate-300">{tier.maxDrawdown}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Daily Limit</span>
                    <span className="text-slate-300">{tier.dailyDrawdown}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-extrabold text-sky-400">${tier.price}</span>
                    {tier.originalPrice && (
                      <span className="text-xs text-slate-500 line-through">${tier.originalPrice}</span>
                    )}
                  </div>
                  <button className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs">
                    Select Tier
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {firm.reviews && firm.reviews.length > 0 ? (
              firm.reviews.map(rev => (
                <div key={rev.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{rev.author}</span>
                      {rev.verifiedTrader && (
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">
                          Verified Trader
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-amber-400 text-xs">
                      ★ {rev.rating}
                    </div>
                  </div>
                  <h4 className="text-xs font-bold text-slate-200">{rev.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{rev.content}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No user reviews submitted yet.</p>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
