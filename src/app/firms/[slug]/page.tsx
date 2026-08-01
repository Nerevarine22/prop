'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MOCK_PROP_FIRMS } from '@/lib/data/firms';
import { getFirms } from '@/lib/services/firmService';
import { PropFirm } from '@/types/firm';
import { Star, CheckCircle2, XCircle, Scale, ExternalLink, Calendar, MapPin, Copy, Check, Shield, GitCommit, Monitor, Wallet, PieChart, TrendingUp } from 'lucide-react';

export default function FirmProfilePage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [firm, setFirm] = useState<PropFirm | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'rules' | 'tiers' | 'reviews'>('overview');

  useEffect(() => {
    getFirms().then(allFirms => {
      const found = allFirms.find(f => f.slug === slug) || MOCK_PROP_FIRMS.find(f => f.slug === slug) || null;
      setFirm(found);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center space-y-4 font-satoshi">
        <div className="h-8 w-48 bg-zinc-800/60 rounded-lg animate-pulse mx-auto" />
        <p className="text-zinc-500 text-xs">Loading firm profile...</p>
      </div>
    );
  }

  if (!firm) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4 font-satoshi">
        <h1 className="text-2xl font-bold text-white">Prop Firm Not Found</h1>
        <p className="text-zinc-400 text-sm">The requested prop firm does not exist in our directory.</p>
        <Link href="/compare" className="inline-block px-5 py-2.5 bg-zinc-100 text-zinc-950 rounded-xl text-xs font-bold hover:bg-white transition-colors">
          Back to Directory
        </Link>
      </div>
    );
  }

  const externalUrl = firm.website || `https://${firm.slug}.com`;
  const brandColor = firm.brandColor || '#52b788';

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-satoshi">
      
      {/* Top Breadcrumb */}
      <nav className="text-xs text-zinc-500 flex items-center gap-2 font-medium">
        <Link href="/" className="hover:text-zinc-300 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/compare" className="hover:text-zinc-300 transition-colors">Directory</Link>
        <span>/</span>
        <span className="text-zinc-300 font-semibold">{firm.name}</span>
      </nav>

      {/* HEADER HERO CARD */}
      <div className="relative rounded-3xl border border-zinc-800/80 bg-[#141416] p-6 sm:p-8 shadow-2xl space-y-6 overflow-hidden">
        
        {/* Subtle Ambient Brand Glow */}
        <div
          className="absolute -top-20 -left-20 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-10"
          style={{ backgroundColor: brandColor }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="flex items-start gap-4 sm:gap-6 min-w-0">
            <img
              src={firm.logo}
              alt={firm.name}
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://unavatar.io/twitter/${firm.slug}`;
              }}
              className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover border border-zinc-800 shadow-md bg-zinc-900 shrink-0"
            />

            <div className="space-y-2 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{firm.name}</h1>
                <CheckCircle2 className="h-5 w-5 text-[#52b788] shrink-0" />
                {firm.badge && (
                  <span
                    className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border"
                    style={{ backgroundColor: `${brandColor}15`, color: brandColor, borderColor: `${brandColor}30` }}
                  >
                    {firm.badge}
                  </span>
                )}
                <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  Trust {firm.trustScore}/100
                </span>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">{firm.tagline}</p>

              <div className="flex items-center gap-4 text-xs text-zinc-400 pt-1 flex-wrap font-medium">
                <div className="flex items-center text-zinc-300">
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                  <span className="font-bold ml-1 text-white">{firm.rating.toFixed(1)}</span>
                  <span className="text-zinc-500 ml-1">({firm.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-zinc-400">
                  <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                  <span>{firm.headquarters}</span>
                </div>
                <div className="flex items-center gap-1 text-zinc-400">
                  <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Est. {firm.yearEstablished}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="relative z-10 flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs shadow-md transition-colors"
            >
              <span>Visit Website</span>
              <ExternalLink className="h-4 w-4" />
            </a>

            {firm.verifiedCoupon && (
              <button
                onClick={() => handleCopyCode(firm.verifiedCoupon!.code)}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#52b788] hover:bg-[#44a075] text-zinc-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                {copiedCoupon ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>{copiedCoupon ? 'Code Copied!' : `Claim ${firm.verifiedCoupon.discount}`}</span>
              </button>
            )}

            <Link
              href="/compare"
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold text-xs border border-zinc-800 transition-colors"
            >
              <Scale className="h-3.5 w-3.5 text-zinc-400" />
              <span>Compare Firm</span>
            </Link>
          </div>

        </div>

        {/* Quick Spec Metrics Bar */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 text-xs">
          <div>
            <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Profit Split</span>
            <span className="text-[#52b788] font-bold text-base">{firm.profitSplit}</span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Crypto Leverage</span>
            <span className="text-white font-bold text-base">{firm.cryptoLeverage}</span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Max Drawdown</span>
            <span className="text-zinc-200 font-bold text-base">{firm.maxDrawdown}</span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Payout Frequency</span>
            <span className="text-zinc-300 font-semibold text-xs truncate block mt-0.5">{firm.payoutFrequency}</span>
          </div>
        </div>

      </div>

      {/* PROFILE NAVIGATION TABS */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'overview' ? 'bg-zinc-800 text-white border border-zinc-700' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Overview & Specs
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'rules' ? 'bg-zinc-800 text-white border border-zinc-700' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Trading Rules
          </button>
          <button
            onClick={() => setActiveTab('tiers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'tiers' ? 'bg-zinc-800 text-white border border-zinc-700' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Account Sizes & Tiers ({firm.accountTiers.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'reviews' ? 'bg-zinc-800 text-white border border-zinc-700' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Trader Reviews ({firm.reviews?.length || 0})
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-zinc-800/80 bg-[#141416] p-6 space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">About {firm.name}</h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                {firm.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-zinc-800/80 bg-[#141416] p-5 space-y-2">
                <Shield className="h-5 w-5 text-[#52b788]" />
                <h4 className="text-xs font-bold text-white">Risk & Drawdown</h4>
                <p className="text-xs text-zinc-400">Max limit: <strong className="text-zinc-200">{firm.maxDrawdown}</strong>. Daily loss limit: <strong className="text-zinc-200">{firm.dailyDrawdown}</strong>.</p>
              </div>

              <div className="rounded-2xl border border-zinc-800/80 bg-[#141416] p-5 space-y-2">
                <GitCommit className="h-5 w-5 text-sky-400" />
                <h4 className="text-xs font-bold text-white">Evaluation Models</h4>
                <p className="text-xs text-zinc-400">Pathways: <strong className="text-zinc-200">{firm.evaluationSteps.join(', ')}</strong>. Profit target: <strong className="text-zinc-200">{firm.profitTarget}</strong>.</p>
              </div>

              <div className="rounded-2xl border border-zinc-800/80 bg-[#141416] p-5 space-y-2">
                <Monitor className="h-5 w-5 text-amber-400" />
                <h4 className="text-xs font-bold text-white">Platforms & Speed</h4>
                <p className="text-xs text-zinc-400">Supported: <strong className="text-zinc-200">{firm.platforms.join(', ')}</strong> across {firm.cryptoPairsCount}+ crypto perps.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RULES */}
        {activeTab === 'rules' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="rounded-2xl border border-zinc-800/80 bg-[#141416] p-6 space-y-4">
              <h3 className="text-sm font-bold text-white">Trading Permissions & Risk Constraints</h3>
              <ul className="space-y-3 text-xs">
                <li className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                  <span className="text-zinc-300 font-medium">News Trading Allowed</span>
                  {firm.newsTradingAllowed ? (
                    <span className="flex items-center gap-1 text-[#52b788] font-semibold"><CheckCircle2 className="h-4 w-4" /> Yes</span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-400 font-semibold"><XCircle className="h-4 w-4" /> Restricted</span>
                  )}
                </li>
                <li className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                  <span className="text-zinc-300 font-medium">Weekend Position Holding</span>
                  {firm.weekendHoldingAllowed ? (
                    <span className="flex items-center gap-1 text-[#52b788] font-semibold"><CheckCircle2 className="h-4 w-4" /> Yes</span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-400 font-semibold"><XCircle className="h-4 w-4" /> No</span>
                  )}
                </li>
                <li className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                  <span className="text-zinc-300 font-medium">Expert Advisors (EAs) / Bots</span>
                  {firm.eaAllowed ? (
                    <span className="flex items-center gap-1 text-[#52b788] font-semibold"><CheckCircle2 className="h-4 w-4" /> Allowed</span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-400 font-semibold"><XCircle className="h-4 w-4" /> Prohibited</span>
                  )}
                </li>
                <li className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                  <span className="text-zinc-300 font-medium">No Time Limit on Phase 1 & 2</span>
                  <span className="flex items-center gap-1 text-[#52b788] font-semibold"><CheckCircle2 className="h-4 w-4" /> Unlimited</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-zinc-800/80 bg-[#141416] p-6 space-y-4">
              <h3 className="text-sm font-bold text-white">Platform & Pair Support</h3>
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-zinc-400 block text-[11px] font-semibold uppercase tracking-wider mb-2">Available Trading Platforms</span>
                  <div className="flex gap-2 flex-wrap">
                    {firm.platforms.map(plat => (
                      <span key={plat} className="px-3 py-1.5 rounded-lg bg-zinc-800/80 border border-zinc-700 text-zinc-200 font-semibold">
                        {plat}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-zinc-400 block text-[11px] font-semibold uppercase tracking-wider mb-1">Crypto Asset Selection</span>
                  <p className="text-zinc-200 font-medium">{firm.cryptoPairsCount}+ Perpetual Pairs (BTC, ETH, SOL, AVAX, XRP, DOGE, NEAR, & High-Cap Altcoins)</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: PRICING TIERS */}
        {activeTab === 'tiers' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {firm.accountTiers.map((tier, idx) => (
              <div key={idx} className="rounded-2xl border border-zinc-800/80 bg-[#141416] p-6 space-y-4 hover:border-zinc-700 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-400">Account Capital</span>
                  <span className="text-xl font-extrabold text-white">${tier.accountSize.toLocaleString()}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Profit Target</span>
                    <span className="text-[#52b788] font-bold">{tier.profitTarget}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Max Drawdown</span>
                    <span className="text-zinc-200 font-semibold">{tier.maxDrawdown}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Daily Loss Limit</span>
                    <span className="text-zinc-200 font-semibold">{tier.dailyDrawdown}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-white">${tier.price}</span>
                    {tier.originalPrice && (
                      <span className="text-xs text-zinc-500 line-through">${tier.originalPrice}</span>
                    )}
                  </div>
                  <a
                    href={externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs transition-colors"
                  >
                    Select Tier
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {firm.reviews && firm.reviews.length > 0 ? (
              firm.reviews.map(rev => (
                <div key={rev.id} className="rounded-2xl border border-zinc-800/80 bg-[#141416] p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{rev.author}</span>
                      {rev.verifiedTrader && (
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">
                          Verified Trader
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-amber-400 text-xs font-bold">
                      <Star className="h-3.5 w-3.5 fill-amber-400 mr-1" />
                      <span>{rev.rating}.0</span>
                    </div>
                  </div>
                  <h4 className="text-xs font-bold text-zinc-200">{rev.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{rev.content}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-400 italic">No user reviews submitted yet.</p>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
