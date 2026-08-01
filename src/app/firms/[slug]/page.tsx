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
        <div className="h-8 w-48 bg-zinc-800/60 rounded-xl animate-pulse mx-auto" />
        <p className="text-zinc-500 text-xs font-medium">Loading firm details...</p>
      </div>
    );
  }

  if (!firm) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4 font-satoshi">
        <h1 className="text-2xl font-bold text-white tracking-tight">Prop Firm Not Found</h1>
        <p className="text-zinc-400 text-xs sm:text-sm">The requested firm profile could not be found in our directory.</p>
        <Link href="/compare" className="inline-flex items-center gap-2 px-5 py-3 bg-zinc-100 text-zinc-950 rounded-xl text-xs font-bold hover:bg-white transition-colors">
          <span>Back to Directory</span>
        </Link>
      </div>
    );
  }

  const externalUrl = firm.website || (
    firm.slug === 'propr' ? 'https://propr.xyz' :
    firm.slug === 'foxify' ? 'https://foxify.trade' :
    firm.slug === 'polyquid' ? 'https://polyquid.xyz' :
    firm.slug === 'alphagrid' ? 'https://alphagrid.fun' :
    firm.slug === 'hyrotrader' ? 'https://hyrotrader.com' :
    firm.slug === 'dizso' ? 'https://dizso.com' :
    firm.slug === 'hypernova' ? 'https://hypernova.xyz' :
    firm.slug === 'hyperpnl' ? 'https://hyperpnl.com' :
    firm.slug === 'chainfunded' ? 'https://chainfunded.io' :
    firm.slug === 'solana-funded' ? 'https://solanafunded.com' :
    `https://${firm.slug}.com`
  );

  const brandColor = firm.brandColor || (
    firm.slug === 'propr' ? '#52b788' :
    firm.slug === 'foxify' ? '#f97316' :
    firm.slug === 'polyquid' ? '#8b5cf6' :
    firm.slug === 'alphagrid' ? '#06b6d4' :
    firm.slug === 'hyrotrader' ? '#f59e0b' :
    firm.slug === 'dizso' ? '#ec4899' :
    firm.slug === 'hypernova' ? '#3b82f6' :
    firm.slug === 'hyperpnl' ? '#10b981' :
    firm.slug === 'chainfunded' ? '#22c55e' :
    firm.slug === 'solana-funded' ? '#a855f7' :
    '#52b788'
  );

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8 font-satoshi">
      
      {/* Top Breadcrumb */}
      <nav className="text-xs text-zinc-400 flex items-center gap-2 font-medium overflow-x-auto no-scrollbar">
        <Link href="/" className="hover:text-white transition-colors shrink-0">Home</Link>
        <span className="text-zinc-600">/</span>
        <Link href="/compare" className="hover:text-white transition-colors shrink-0">Directory</Link>
        <span className="text-zinc-600">/</span>
        <span className="text-zinc-200 font-bold truncate">{firm.name}</span>
      </nav>

      {/* HEADER HERO CARD */}
      <div className="relative rounded-2xl sm:rounded-3xl border border-zinc-800/60 bg-[#141416] p-5 sm:p-8 shadow-sm space-y-6 overflow-hidden">
        
        {/* Subtle Ambient Brand Glow */}
        <div
          className="absolute -top-16 -left-16 w-56 h-56 rounded-full blur-3xl pointer-events-none opacity-[0.08]"
          style={{ backgroundColor: brandColor }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="flex items-start gap-4 sm:gap-6 min-w-0">
            {/* Logo 64px - 80px */}
            <div className="relative shrink-0">
              <img
                src={firm.logo}
                alt={firm.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://unavatar.io/twitter/${firm.slug}`;
                }}
                className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover border border-zinc-800/80 shadow-sm bg-zinc-900"
              />
            </div>

            <div className="space-y-2 min-w-0">
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-white tracking-tight truncate">{firm.name}</h1>
                <CheckCircle2 className="h-5 w-5 text-[#52b788] shrink-0" />
                {firm.badge && (
                  <span
                    className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shrink-0"
                    style={{ backgroundColor: `${brandColor}15`, color: brandColor, borderColor: `${brandColor}35` }}
                  >
                    {firm.badge}
                  </span>
                )}
                <span className="text-[11px] font-bold uppercase tracking-wider bg-[#52b788]/10 text-[#52b788] border border-[#52b788]/20 px-2.5 py-0.5 rounded-full shrink-0">
                  Trust {firm.trustScore}/100
                </span>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed font-normal">{firm.tagline}</p>

              <div className="flex items-center gap-3 sm:gap-5 text-xs text-zinc-400 pt-1 flex-wrap font-medium">
                <div className="flex items-center text-zinc-300">
                  <Star className="h-4 w-4 text-zinc-400 stroke-[1.5]" />
                  <span className="font-bold ml-1 text-white">{firm.rating.toFixed(1)}</span>
                  <span className="text-zinc-500 ml-1">({firm.reviewCount} reviews)</span>
                </div>
                <span className="text-zinc-700 hidden xs:inline">·</span>
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                  <span>{firm.headquarters}</span>
                </div>
                <span className="text-zinc-700 hidden xs:inline">·</span>
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Est. {firm.yearEstablished}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="relative z-10 flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 w-full sm:w-auto">
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs shadow-sm transition-colors min-h-[44px]"
            >
              <span>Visit Website</span>
              <ExternalLink className="h-4 w-4" />
            </a>

            {firm.verifiedCoupon && (
              <button
                type="button"
                onClick={() => handleCopyCode(firm.verifiedCoupon!.code)}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#52b788] hover:bg-[#44a075] text-zinc-950 font-bold text-xs shadow-sm transition-colors cursor-pointer min-h-[44px]"
              >
                {copiedCoupon ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>{copiedCoupon ? 'Code Copied!' : `Claim ${firm.verifiedCoupon.discount}`}</span>
              </button>
            )}

            <Link
              href="/compare"
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1c1c20] hover:bg-zinc-800 text-zinc-300 font-semibold text-xs border border-zinc-800/80 transition-colors min-h-[44px]"
            >
              <Scale className="h-4 w-4 text-zinc-400" />
              <span>Compare Firm</span>
            </Link>
          </div>

        </div>

        {/* DOMINANT SPEC METRICS BAR */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:p-5 rounded-xl bg-[#121214] border border-zinc-800/60 text-xs font-satoshi">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] sm:text-xs font-medium uppercase tracking-wider">
              <PieChart className="h-3.5 w-3.5 text-[#52b788]" />
              <span>Profit Split</span>
            </div>
            <span className="text-[#52b788] font-bold text-xl sm:text-2xl block tracking-tight">{firm.profitSplit}</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] sm:text-xs font-medium uppercase tracking-wider">
              <Wallet className="h-3.5 w-3.5 text-zinc-400" />
              <span>Leverage</span>
            </div>
            <span className="text-white font-bold text-xl sm:text-2xl block tracking-tight">{firm.cryptoLeverage}</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] sm:text-xs font-medium uppercase tracking-wider">
              <Shield className="h-3.5 w-3.5 text-zinc-400" />
              <span>Max Drawdown</span>
            </div>
            <span className="text-zinc-200 font-bold text-xl sm:text-2xl block tracking-tight">{firm.maxDrawdown}</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] sm:text-xs font-medium uppercase tracking-wider">
              <TrendingUp className="h-3.5 w-3.5 text-zinc-400" />
              <span>Payouts</span>
            </div>
            <span className="text-zinc-300 font-semibold text-xs sm:text-sm block truncate mt-1">{firm.payoutFrequency}</span>
          </div>
        </div>

      </div>

      {/* NAVIGATION TABS BAR */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-zinc-800/60 pb-3 overflow-x-auto touch-scroll no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 min-h-[40px] ${
              activeTab === 'overview'
                ? 'bg-white text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            Overview & Specs
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 min-h-[40px] ${
              activeTab === 'rules'
                ? 'bg-white text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            Trading Rules
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tiers')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 min-h-[40px] ${
              activeTab === 'tiers'
                ? 'bg-white text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            Account Sizes & Pricing ({firm.accountTiers.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 min-h-[40px] ${
              activeTab === 'reviews'
                ? 'bg-white text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            Trader Reviews ({firm.reviews?.length || 0})
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-zinc-800/60 bg-[#141416] p-6 space-y-3 shadow-sm">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">About {firm.name}</h2>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                {firm.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-zinc-800/60 bg-[#141416] p-5 space-y-2">
                <Shield className="h-5 w-5 text-[#52b788]" />
                <h3 className="text-xs font-bold text-white">Risk & Drawdown Limits</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Maximum drawdown: <strong className="text-zinc-200">{firm.maxDrawdown}</strong>. Daily loss limit: <strong className="text-zinc-200">{firm.dailyDrawdown}</strong>.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800/60 bg-[#141416] p-5 space-y-2">
                <GitCommit className="h-5 w-5 text-sky-400" />
                <h3 className="text-xs font-bold text-white">Evaluation Pathways</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Models: <strong className="text-zinc-200">{firm.evaluationSteps.join(', ')}</strong>. Profit target: <strong className="text-zinc-200">{firm.profitTarget}</strong>.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800/60 bg-[#141416] p-5 space-y-2">
                <Monitor className="h-5 w-5 text-amber-400" />
                <h3 className="text-xs font-bold text-white">Platforms & Pairs</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Supported platforms: <strong className="text-zinc-200">{firm.platforms.join(', ')}</strong> across {firm.cryptoPairsCount}+ crypto perpetual pairs.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RULES */}
        {activeTab === 'rules' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="rounded-2xl border border-zinc-800/60 bg-[#141416] p-6 space-y-4">
              <h2 className="text-sm font-bold text-white">Trading Permissions & Risk Constraints</h2>
              <ul className="space-y-3 text-xs">
                <li className="flex items-center justify-between p-3 rounded-xl bg-[#121214] border border-zinc-800/60">
                  <span className="text-zinc-300 font-medium">News Trading Allowed</span>
                  {firm.newsTradingAllowed ? (
                    <span className="flex items-center gap-1 text-[#52b788] font-semibold"><CheckCircle2 className="h-4 w-4" /> Yes</span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-400 font-semibold"><XCircle className="h-4 w-4" /> Restricted</span>
                  )}
                </li>

                <li className="flex items-center justify-between p-3 rounded-xl bg-[#121214] border border-zinc-800/60">
                  <span className="text-zinc-300 font-medium">Weekend Position Holding</span>
                  {firm.weekendHoldingAllowed ? (
                    <span className="flex items-center gap-1 text-[#52b788] font-semibold"><CheckCircle2 className="h-4 w-4" /> Yes</span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-400 font-semibold"><XCircle className="h-4 w-4" /> No</span>
                  )}
                </li>

                <li className="flex items-center justify-between p-3 rounded-xl bg-[#121214] border border-zinc-800/60">
                  <span className="text-zinc-300 font-medium">Expert Advisors (EAs) / Bots</span>
                  {firm.eaAllowed ? (
                    <span className="flex items-center gap-1 text-[#52b788] font-semibold"><CheckCircle2 className="h-4 w-4" /> Allowed</span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-400 font-semibold"><XCircle className="h-4 w-4" /> Prohibited</span>
                  )}
                </li>

                <li className="flex items-center justify-between p-3 rounded-xl bg-[#121214] border border-zinc-800/60">
                  <span className="text-zinc-300 font-medium">No Time Limit on Evaluation</span>
                  <span className="flex items-center gap-1 text-[#52b788] font-semibold"><CheckCircle2 className="h-4 w-4" /> Unlimited</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-zinc-800/60 bg-[#141416] p-6 space-y-4">
              <h2 className="text-sm font-bold text-white">Platforms & Asset Selection</h2>
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-zinc-400 block text-[11px] font-semibold uppercase tracking-wider mb-2">Supported Platforms</span>
                  <div className="flex gap-2 flex-wrap">
                    {firm.platforms.map(plat => (
                      <span key={plat} className="px-3 py-1.5 rounded-lg bg-[#1c1c20] border border-zinc-800/80 text-zinc-200 font-semibold">
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
              <div key={idx} className="rounded-2xl border border-zinc-800/60 bg-[#141416] p-5 sm:p-6 space-y-4 hover:border-zinc-700/80 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-400">Account Capital</span>
                  <span className="text-xl font-bold text-white font-satoshi">${tier.accountSize.toLocaleString()}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#121214] border border-zinc-800/60 space-y-2 text-xs">
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
                    <span className="text-2xl font-bold text-white font-satoshi">${tier.price}</span>
                    {tier.originalPrice && (
                      <span className="text-xs text-zinc-500 line-through">${tier.originalPrice}</span>
                    )}
                  </div>
                  <a
                    href={externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs transition-colors flex items-center gap-1"
                  >
                    <span>Select Tier</span>
                    <ExternalLink className="h-3 w-3" />
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
                <div key={rev.id} className="rounded-2xl border border-zinc-800/60 bg-[#141416] p-5 sm:p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{rev.author}</span>
                      {rev.verifiedTrader && (
                        <span className="text-[10px] bg-[#52b788]/10 text-[#52b788] px-2 py-0.5 rounded-md border border-[#52b788]/20 font-semibold">
                          Verified Trader
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-amber-400 text-xs font-bold">
                      <Star className="h-3.5 w-3.5 fill-amber-400 mr-1" />
                      <span>{rev.rating}.0</span>
                    </div>
                  </div>
                  <h3 className="text-xs font-bold text-zinc-200">{rev.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-normal">{rev.content}</p>
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
