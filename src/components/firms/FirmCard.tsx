'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { Star, ArrowRight, ExternalLink, Scale, Wallet, PieChart, TrendingUp, Shield, GitCommit, Monitor } from 'lucide-react';
import { PropFirm } from '@/types/firm';
import { DataStatusBadge } from '@/components/data/DataStatusBadge';

interface FirmCardProps {
  firm: PropFirm;
  onCompareToggle?: (firm: PropFirm) => void;
  isCompared?: boolean;
}

export function FirmCard({ firm, onCompareToggle, isCompared }: FirmCardProps) {
  const minPrice = firm.accountTiers?.[0]?.price ? `$${firm.accountTiers[0].price}` : '$29';
  const formattedMaxCapital = `$${Math.round(firm.maxCapital / 1000)}K`;

  // External official website URL mapping fallback
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

  // Format profit split to clean percentage e.g. "80%", "90%", "95%"
  const cleanProfitSplit = firm.profitSplit.replace(/^Up to\s*/i, '');

  // Hardcoded fallback brand colors (used before logo loads or if CORS blocks canvas)
  const fallbackBrandColor = firm.brandColor || (
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

  // Dynamic logo color extraction via Canvas API
  const [glowColor, setGlowColor] = useState<string>(fallbackBrandColor);

  const handleLogoLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    try {
      const canvas = document.createElement('canvas');
      const size = 32; // sample at small size for performance
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, size, size);
      const data = ctx.getImageData(0, 0, size, size).data;
      let r = 0, g = 0, b = 0, count = 0;
      for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3];
        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
        // Skip transparent, near-black, and near-white pixels
        if (alpha > 100 && brightness > 30 && brightness < 220) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
      }
      if (count > 0) {
        setGlowColor(`rgb(${Math.round(r / count)}, ${Math.round(g / count)}, ${Math.round(b / count)})`);
      }
    } catch {
      // CORS blocked — keep fallback color
    }
  }, []);

  return (
    <div className="relative rounded-2xl border border-zinc-800/60 bg-[#111113] bg-clip-padding p-5 sm:p-7 flex flex-col justify-between space-y-5 hover:border-zinc-700/80 transition-all duration-200 shadow-sm h-full group font-satoshi overflow-hidden">

      {/* Subtle Top-Left Ambient Brand Color Glow (Ultra-soft 5% -> 10%) */}
      <div
        className="absolute -top-16 -left-16 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-all duration-300 opacity-[0.06] group-hover:opacity-[0.12]"
        style={{ backgroundColor: glowColor }}
      />

      {/* 1. HEADER & BODY CONTENT CONTAINER */}
      <div className="relative z-10 flex-1 flex flex-col justify-between space-y-5">

        {/* TOP SECTION: Header, Metrics & Secondary Tags */}
        <div className="space-y-4">

          {/* Company Header */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">

              {/* Logo + Name & Rating */}
              <Link href={`/prop-firms/${firm.slug}`} className="flex items-center gap-4 sm:gap-5 min-w-0 group/title flex-1">
                {/* Canvas color sampling and dynamic fallbacks require a native image element. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={firm.logo}
                  alt={firm.name}
                  onLoad={handleLogoLoad}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://unavatar.io/twitter/${firm.slug}`;
                  }}
                  crossOrigin="anonymous"
                  className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl object-cover border border-zinc-800/80 shadow-sm bg-zinc-900 shrink-0"
                />

                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-base sm:text-lg font-bold text-white tracking-tight group-hover/title:text-emerald-400 transition-colors truncate block font-satoshi">
                      {firm.name}
                    </span>
                    <DataStatusBadge status={firm.dataStatus} compact />
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium whitespace-nowrap">
                    <div className="flex items-center font-satoshi text-zinc-400">
                      <Star className="h-3.5 w-3.5 text-zinc-400 stroke-[1.5]" />
                      <span className="font-medium ml-1 text-zinc-400">{firm.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-zinc-600">·</span>
                    <span className="text-zinc-400 font-satoshi">{firm.reviewCount} reviews</span>
                  </div>
                </div>
              </Link>

              {/* Compare Toggle */}
              {onCompareToggle && (
                <button
                  type="button"
                  onClick={() => onCompareToggle(firm)}
                  className={`p-2 rounded-xl border text-xs transition-colors shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center ${
                    isCompared
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 font-bold'
                      : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                  title={isCompared ? 'Comparing' : 'Add to comparison'}
                >
                  <Scale className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Reward Tags Row (Under Logo) */}
            {firm.rewardTags && firm.rewardTags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <DataStatusBadge status={firm.dataStatus} />
                {firm.rewardTags.map(tag => {
                  let tagStyle = 'bg-zinc-800/80 text-zinc-400 border-zinc-700/80';
                  if (tag === 'Points') tagStyle = 'bg-amber-500/10 text-amber-300 border-amber-500/20';
                  if (tag === 'Token') tagStyle = 'bg-[#52b788]/10 text-[#52b788] border-[#52b788]/20';
                  if (tag === 'Airdrop') tagStyle = 'bg-sky-500/10 text-sky-300 border-sky-500/20';

                  return (
                    <span
                      key={tag}
                      className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border font-satoshi shrink-0 ${tagStyle}`}
                    >
                      {tag}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* DOMINANT METRICS */}
          <Link href={`/prop-firms/${firm.slug}`} className="grid grid-cols-3 gap-1.5 sm:gap-2 py-2 text-left items-start font-satoshi block">

            {/* Col 1: Price */}
            <div className="flex flex-col items-start text-left min-w-0">
              <Wallet className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-zinc-400 mb-1 stroke-[1.5]" />
              <span className="text-white font-bold text-lg sm:text-2xl lg:text-3xl block tracking-tight whitespace-nowrap font-satoshi">
                {minPrice}
              </span>
              <span className="text-zinc-500 block text-[10px] sm:text-xs uppercase font-medium tracking-wider mt-0.5 sm:mt-1 text-left font-satoshi">
                From
              </span>
            </div>

            {/* Col 2: Profit Split */}
            <div className="flex flex-col items-start text-left min-w-0">
              <PieChart className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#52b788] mb-1 stroke-[1.5]" />
              <span className="text-[#52b788] font-bold text-lg sm:text-2xl lg:text-3xl block tracking-tight whitespace-nowrap font-satoshi">
                {cleanProfitSplit}
              </span>
              <span className="text-zinc-500 block text-[10px] sm:text-xs uppercase font-medium tracking-wider mt-0.5 sm:mt-1 text-left font-satoshi">
                Profit Split
              </span>
            </div>

            {/* Col 3: Max Funding */}
            <div className="flex flex-col items-start text-left min-w-0">
              <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-zinc-400 mb-1 stroke-[1.5]" />
              <span className="text-white font-bold text-lg sm:text-2xl lg:text-3xl block tracking-tight whitespace-nowrap font-satoshi">
                {formattedMaxCapital}
              </span>
              <span className="text-zinc-500 block text-[10px] sm:text-xs uppercase font-medium tracking-wider mt-0.5 sm:mt-1 text-left font-satoshi">
                Max Funding
              </span>
            </div>

          </Link>

          {/* SECONDARY INFORMATION */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium font-satoshi">
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-[#1c1c20] border border-zinc-800/80 text-zinc-300 text-[11px] sm:text-xs">
              <Shield className="h-3.5 w-3.5 text-zinc-400 shrink-0 stroke-[1.5]" />
              <span>{firm.maxDrawdown} Drawdown</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-[#1c1c20] border border-zinc-800/80 text-zinc-300 text-[11px] sm:text-xs">
              <GitCommit className="h-3.5 w-3.5 text-zinc-400 shrink-0 stroke-[1.5]" />
              <span>{firm.evaluationSteps.join(' / ')}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-[#1c1c20] border border-zinc-800/80 text-zinc-300 text-[11px] sm:text-xs">
              <Monitor className="h-3.5 w-3.5 text-zinc-400 shrink-0 stroke-[1.5]" />
              <span>{firm.platforms.slice(0, 2).join(', ')}</span>
            </span>
          </div>

        </div>

        {/* BOTTOM PINNED PROMO SUBTLE TAG */}
        <div className="pt-1 min-h-[24px] flex items-end">
          {firm.verifiedCoupon && (
            <div className="text-xs text-zinc-400 flex items-center gap-1.5 font-satoshi">
              <span className="text-[#52b788] font-semibold">{firm.dataStatus === 'mock' ? 'Sample promo' : firm.verifiedCoupon.discount}</span>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-400">Code: <strong className="text-zinc-200 font-semibold">{firm.verifiedCoupon.code}</strong></span>
            </div>
          )}
        </div>

      </div>

      {/* 2. FOOTER & CTAS */}
      <div className="relative z-10 pt-3 border-t border-zinc-800/40 flex items-center justify-between gap-3 font-satoshi">
        {/* Left: Small Link pointing to external site */}
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors flex items-center gap-1 px-2 py-1 shrink-0"
          title={`Visit ${firm.name} official website`}
        >
          <span>Explore</span>
          <ExternalLink className="h-3 w-3" />
        </a>

        {/* Right: Primary White Button pointing to internal page */}
        <Link
          href={`/prop-firms/${firm.slug}`}
          className="details-btn flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl font-bold text-xs shadow-sm"
        >
          <span>Details</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

    </div>
  );
}
