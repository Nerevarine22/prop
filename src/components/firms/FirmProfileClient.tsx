'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PropFirm } from '@/types/firm';
import { FirmLogo } from '@/components/firms/FirmLogo';
import { Star, CheckCircle2, XCircle, Scale, ExternalLink, Calendar, MapPin, Copy, Check, Shield, GitCommit, Monitor, Wallet, PieChart, TrendingUp, Sparkles, Coins, Database } from 'lucide-react';

interface FirmProfileClientProps {
  firm: PropFirm;
}

export function FirmProfileClient({ firm }: FirmProfileClientProps) {
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'rewards' | 'rules' | 'tiers' | 'reviews'>('overview');

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
    <div className="min-h-full bg-[#0a0c10] px-4 py-8 font-satoshi sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
      
      {/* Top Breadcrumb */}
      <nav className="text-xs text-zinc-400 flex items-center gap-2 font-medium overflow-x-auto no-scrollbar">
        <Link href="/" className="hover:text-white transition-colors shrink-0">Home</Link>
        <span className="text-zinc-600">/</span>
        <Link href="/prop-firms" className="hover:text-white transition-colors shrink-0">Directory</Link>
        <span className="text-zinc-600">/</span>
        <span className="text-zinc-200 font-bold truncate">{firm.name}</span>
      </nav>

      {/* HEADER HERO CARD */}
      {firm.dataStatus === 'mock' && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/[0.08] px-4 py-3 text-xs leading-relaxed text-amber-100">
          <Database className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
          <p><strong>Demo record.</strong> The values on this profile are sample content for product development and have not been independently verified.</p>
        </div>
      )}

      <div className="relative space-y-6 overflow-hidden rounded-2xl border border-[#29313d] bg-[#12161d] p-5 sm:p-8">
        
        {/* Subtle Ambient Brand Glow */}
        <div
          className="absolute -top-16 -left-16 w-56 h-56 rounded-full blur-3xl pointer-events-none opacity-[0.08]"
          style={{ backgroundColor: brandColor }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="flex items-start gap-4 sm:gap-6 min-w-0">
            {/* Logo 64px - 80px */}
            <div className="relative shrink-0">
              <FirmLogo
                src={firm.logo}
                name={firm.name}
                imageClassName="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover border border-zinc-800/80 shadow-sm bg-zinc-900"
                fallbackClassName="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border border-zinc-800/80 bg-zinc-900 text-[#c0c8ff] text-lg font-extrabold flex items-center justify-center"
              />
            </div>

            <div className="space-y-2 min-w-0">
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-white tracking-tight truncate">{firm.name}</h1>
                
                {/* Reward Badges */}
                {firm.rewardTags && firm.rewardTags.length > 0 && firm.rewardTags.map(tag => {
                  let tagStyle = 'bg-zinc-800/80 text-zinc-400 border-zinc-700/80';
                  if (tag === 'Points') tagStyle = 'bg-[#7774ff]/10 text-[#aaa8ff] border-[#7774ff]/25';
                  if (tag === 'Token') tagStyle = 'bg-[#7774ff]/10 text-[#aaa8ff] border-[#7774ff]/25';
                  if (tag === 'Airdrop') tagStyle = 'bg-[#7774ff]/10 text-[#aaa8ff] border-[#7774ff]/25';
                  return (
                    <span
                      key={tag}
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${tagStyle}`}
                    >
                      {tag}
                    </span>
                  );
                })}

                {firm.badge && (
                  <span
                    className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shrink-0"
                    style={{ backgroundColor: `${brandColor}15`, color: brandColor, borderColor: `${brandColor}35` }}
                  >
                    {firm.badge}
                  </span>
                )}
                <span className="shrink-0 rounded-full border border-[#32d583]/20 bg-[#32d583]/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#32d583]">
                  {firm.dataStatus === 'mock' ? 'Demo score' : 'Trust'} {firm.trustScore}/100
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
              className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-[#4f8cff] bg-[#4f8cff] px-5 py-3 text-xs font-bold text-white transition-colors hover:border-[#70a5ff] hover:bg-[#70a5ff]"
            >
              <span>Visit Website</span>
              <ExternalLink className="h-4 w-4" />
            </a>

            {firm.verifiedCoupon && (
              <button
                type="button"
                onClick={() => handleCopyCode(firm.verifiedCoupon!.code)}
                className="flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#29313d] bg-[#181d26] px-5 py-3 text-xs font-bold text-zinc-200 transition-colors hover:border-[#394453] hover:text-white"
              >
                {copiedCoupon ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>{copiedCoupon ? 'Code copied' : firm.dataStatus === 'mock' ? 'Copy sample code' : `Claim ${firm.verifiedCoupon.discount}`}</span>
              </button>
            )}

            <Link
              href="/compare"
              className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-[#29313d] bg-transparent px-5 py-2.5 text-xs font-semibold text-zinc-300 transition-colors hover:border-[#394453] hover:bg-[#181d26]"
            >
              <Scale className="h-4 w-4 text-zinc-400" />
              <span>Compare Firm</span>
            </Link>
          </div>

        </div>

        {/* DOMINANT SPEC METRICS BAR */}
        <div className="relative z-10 grid grid-cols-2 gap-3 rounded-xl border border-[#29313d] bg-[#0e1117] p-4 text-xs font-satoshi sm:grid-cols-4 sm:p-5">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] sm:text-xs font-medium uppercase tracking-wider">
              <PieChart className="h-3.5 w-3.5 text-[#32d583]" />
              <span>Profit Split</span>
            </div>
            <span className="block text-xl font-bold tracking-tight text-[#32d583] sm:text-2xl">{firm.profitSplit}</span>
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
                ? 'bg-[#4f8cff]/15 text-[#a9c7ff] ring-1 ring-inset ring-[#4f8cff]/30'
                : 'text-zinc-400 hover:text-white hover:bg-[#181d26]'
            }`}
          >
            Overview & Specs
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rewards')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 min-h-[40px] ${
              activeTab === 'rewards'
                ? 'bg-[#4f8cff]/15 text-[#a9c7ff] ring-1 ring-inset ring-[#4f8cff]/30'
                : 'text-zinc-400 hover:text-white hover:bg-[#181d26]'
            }`}
          >
            Tokenomics & Rewards
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 min-h-[40px] ${
              activeTab === 'rules'
                ? 'bg-[#4f8cff]/15 text-[#a9c7ff] ring-1 ring-inset ring-[#4f8cff]/30'
                : 'text-zinc-400 hover:text-white hover:bg-[#181d26]'
            }`}
          >
            Trading Rules
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tiers')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 min-h-[40px] ${
              activeTab === 'tiers'
                ? 'bg-[#4f8cff]/15 text-[#a9c7ff] ring-1 ring-inset ring-[#4f8cff]/30'
                : 'text-zinc-400 hover:text-white hover:bg-[#181d26]'
            }`}
          >
            Account Sizes & Pricing ({firm.accountTiers.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 min-h-[40px] ${
              activeTab === 'reviews'
                ? 'bg-[#4f8cff]/15 text-[#a9c7ff] ring-1 ring-inset ring-[#4f8cff]/30'
                : 'text-zinc-400 hover:text-white hover:bg-[#181d26]'
            }`}
          >
            Trader Reviews ({firm.reviews?.length || 0})
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="space-y-3 rounded-xl border border-[#29313d] bg-[#12161d] p-6">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">About {firm.name}</h2>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                {firm.description}
              </p>
            </div>

            {/* Tokenomics & Airdrop Ecosystem Card */}
            {firm.tokenomicsInfo && (
              <div className="space-y-4 rounded-xl border border-[#29313d] bg-[#12161d] p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Tokenomics & Rewards Ecosystem</h3>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {firm.tokenomicsInfo.hasToken && (
                      <span className="rounded-lg border border-[#32d583]/20 bg-[#32d583]/10 px-2.5 py-1 text-xs font-bold text-[#32d583]">
                        {firm.tokenomicsInfo.tokenTicker || 'Token Active'}
                      </span>
                    )}
                    {firm.tokenomicsInfo.hasAirdrop && (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-300 border border-sky-500/20">
                        {firm.tokenomicsInfo.airdropStatus || 'Airdrop Confirmed'}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                  {firm.tokenomicsInfo.rewardDescription}
                </p>

                {firm.tokenomicsInfo.pointsProgramName && (
                  <div className="flex items-center justify-between rounded-xl border border-[#29313d] bg-[#0e1117] p-3 text-xs">
                    <span className="text-zinc-400 font-medium">Points Program:</span>
                    <span className="text-amber-300 font-bold">{firm.tokenomicsInfo.pointsProgramName}</span>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 rounded-xl border border-[#29313d] bg-[#12161d] p-5">
                <Shield className="h-5 w-5 text-[#7aa8ff]" />
                <h3 className="text-xs font-bold text-white">Risk & Drawdown Limits</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Maximum drawdown: <strong className="text-zinc-200">{firm.maxDrawdown}</strong>. Daily loss limit: <strong className="text-zinc-200">{firm.dailyDrawdown}</strong>.
                </p>
              </div>

              <div className="space-y-2 rounded-xl border border-[#29313d] bg-[#12161d] p-5">
                <GitCommit className="h-5 w-5 text-sky-400" />
                <h3 className="text-xs font-bold text-white">Evaluation Pathways</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Models: <strong className="text-zinc-200">{firm.evaluationSteps.join(', ')}</strong>. Profit target: <strong className="text-zinc-200">{firm.profitTarget}</strong>.
                </p>
              </div>

              <div className="space-y-2 rounded-xl border border-[#29313d] bg-[#12161d] p-5">
                <Monitor className="h-5 w-5 text-amber-400" />
                <h3 className="text-xs font-bold text-white">Platforms & Pairs</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Supported platforms: <strong className="text-zinc-200">{firm.platforms.join(', ')}</strong> across {firm.cryptoPairsCount}+ crypto perpetual pairs.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: REWARDS & TOKENOMICS */}
        {activeTab === 'rewards' && (
          <div className="space-y-6">
            <div className="space-y-5 rounded-xl border border-[#29313d] bg-[#12161d] p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/60 pb-4">
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Coins className="h-5 w-5 text-amber-400" />
                    <span>Tokenomics, Points & Airdrop Rewards</span>
                  </h2>
                  <p className="text-xs text-zinc-400">Detailed breakdown of reward incentives for active traders on {firm.name}.</p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {firm.rewardTags?.map(tag => (
                    <span key={tag} className="text-xs font-bold px-3 py-1 rounded-xl bg-zinc-800 text-zinc-200 border border-zinc-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {firm.tokenomicsInfo ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1 rounded-xl border border-[#29313d] bg-[#0e1117] p-4">
                      <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider block">Native Token</span>
                      <span className="text-white font-bold text-sm">
                        {firm.tokenomicsInfo.hasToken ? (firm.tokenomicsInfo.tokenTicker || 'Active Token') : 'No Token Launched'}
                      </span>
                    </div>

                    <div className="space-y-1 rounded-xl border border-[#29313d] bg-[#0e1117] p-4">
                      <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider block">Points Program</span>
                      <span className="text-amber-300 font-bold text-sm">
                        {firm.tokenomicsInfo.hasPoints ? (firm.tokenomicsInfo.pointsProgramName || 'Points System') : 'No Points'}
                      </span>
                    </div>

                    <div className="space-y-1 rounded-xl border border-[#29313d] bg-[#0e1117] p-4">
                      <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider block">Airdrop Status</span>
                      <span className="text-sky-300 font-bold text-sm">
                        {firm.tokenomicsInfo.hasAirdrop ? (firm.tokenomicsInfo.airdropStatus || 'Active Airdrop') : 'Potential / None'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 rounded-xl border border-[#29313d] bg-[#0e1117] p-5">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">How to earn rewards:</h3>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                      {firm.tokenomicsInfo.rewardDescription}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-zinc-400 italic">No specific tokenomics details announced yet for {firm.name}.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: RULES */}
        {activeTab === 'rules' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-4 rounded-xl border border-[#29313d] bg-[#12161d] p-6">
              <h2 className="text-sm font-bold text-white">Trading Permissions & Risk Constraints</h2>
              <ul className="space-y-3 text-xs">
                <li className="flex items-center justify-between rounded-xl border border-[#29313d] bg-[#0e1117] p-3">
                  <span className="text-zinc-300 font-medium">News Trading Allowed</span>
                  {firm.newsTradingAllowed ? (
                    <span className="flex items-center gap-1 font-semibold text-[#32d583]"><CheckCircle2 className="h-4 w-4" /> Yes</span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-400 font-semibold"><XCircle className="h-4 w-4" /> Restricted</span>
                  )}
                </li>

                <li className="flex items-center justify-between rounded-xl border border-[#29313d] bg-[#0e1117] p-3">
                  <span className="text-zinc-300 font-medium">Weekend Position Holding</span>
                  {firm.weekendHoldingAllowed ? (
                    <span className="flex items-center gap-1 font-semibold text-[#32d583]"><CheckCircle2 className="h-4 w-4" /> Yes</span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-400 font-semibold"><XCircle className="h-4 w-4" /> No</span>
                  )}
                </li>

                <li className="flex items-center justify-between rounded-xl border border-[#29313d] bg-[#0e1117] p-3">
                  <span className="text-zinc-300 font-medium">Expert Advisors (EAs) / Bots</span>
                  {firm.eaAllowed ? (
                    <span className="flex items-center gap-1 font-semibold text-[#32d583]"><CheckCircle2 className="h-4 w-4" /> Allowed</span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-400 font-semibold"><XCircle className="h-4 w-4" /> Prohibited</span>
                  )}
                </li>

                <li className="flex items-center justify-between rounded-xl border border-[#29313d] bg-[#0e1117] p-3">
                  <span className="text-zinc-300 font-medium">No Time Limit on Evaluation</span>
                  <span className="flex items-center gap-1 font-semibold text-[#32d583]"><CheckCircle2 className="h-4 w-4" /> Unlimited</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4 rounded-xl border border-[#29313d] bg-[#12161d] p-6">
              <h2 className="text-sm font-bold text-white">Platforms & Asset Selection</h2>
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-zinc-400 block text-[11px] font-semibold uppercase tracking-wider mb-2">Supported Platforms</span>
                  <div className="flex gap-2 flex-wrap">
                    {firm.platforms.map(plat => (
                      <span key={plat} className="rounded-lg border border-[#29313d] bg-[#181d26] px-3 py-1.5 font-semibold text-zinc-200">
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

        {/* TAB 4: PRICING TIERS */}
        {activeTab === 'tiers' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {firm.accountTiers.map((tier, idx) => (
              <div key={idx} className="space-y-4 rounded-xl border border-[#29313d] bg-[#12161d] p-5 transition-colors hover:border-[#394453] sm:p-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-400">Account Capital</span>
                  <span className="text-xl font-bold text-white font-satoshi">${tier.accountSize.toLocaleString()}</span>
                </div>

                <div className="space-y-2 rounded-xl border border-[#29313d] bg-[#0e1117] p-3.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Profit Target</span>
                    <span className="font-bold text-[#32d583]">{tier.profitTarget}</span>
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
                    className="flex items-center gap-1 rounded-xl border border-[#4f8cff] bg-[#4f8cff] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:border-[#70a5ff] hover:bg-[#70a5ff]"
                  >
                    <span>Select Tier</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {firm.reviews && firm.reviews.length > 0 ? (
              firm.reviews.map(rev => (
                <div key={rev.id} className="space-y-3 rounded-xl border border-[#29313d] bg-[#12161d] p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{rev.author}</span>
                      {firm.dataStatus === 'mock' ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          Sample review
                        </span>
                      ) : rev.verifiedTrader && (
                        <span className="rounded-md border border-[#32d583]/20 bg-[#32d583]/10 px-2 py-0.5 text-[10px] font-semibold text-[#32d583]">
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
    </div>
  );
}
