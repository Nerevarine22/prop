'use client';

import React from 'react';
import Link from 'next/link';
import { Star, ArrowRight, Scale, CheckCircle2, Wallet, PieChart, TrendingUp, Shield, GitCommit, Monitor } from 'lucide-react';
import { PropFirm } from '@/types/firm';

interface FirmCardProps {
  firm: PropFirm;
  onCompareToggle?: (firm: PropFirm) => void;
  isCompared?: boolean;
}

export function FirmCard({ firm, onCompareToggle, isCompared }: FirmCardProps) {
  const minPrice = firm.accountTiers?.[0]?.price ? `$${firm.accountTiers[0].price}` : '$29';
  const formattedMaxCapital = `$${Math.round(firm.maxCapital / 1000)}K`;
  
  // Format profit split to clean percentage e.g. "90%" or "95%"
  const cleanProfitSplit = firm.profitSplit.includes('95%') 
    ? '95%' 
    : firm.profitSplit.includes('90%') 
    ? '90%' 
    : firm.profitSplit.includes('85%') 
    ? '85%' 
    : firm.profitSplit;

  return (
    <Link
      href={`/firms/${firm.slug}`}
      className="relative rounded-2xl bg-[#141416] border border-zinc-800/60 p-7 flex flex-col justify-between space-y-6 hover:border-zinc-700/80 transition-all duration-200 shadow-sm h-full group font-satoshi overflow-hidden cursor-pointer block"
    >
      
      {/* Subtle Top-Left Ambient Corner Glow */}
      <div className="absolute -top-14 -left-14 w-48 h-48 bg-[#52b788]/[0.05] rounded-full blur-3xl pointer-events-none group-hover:bg-[#52b788]/[0.08] transition-colors" />

      {/* 1. HEADER & BODY CONTENT CONTAINER */}
      <div className="relative z-10 flex-1 flex flex-col justify-between space-y-6">
        
        {/* TOP SECTION: Header, Metrics & Secondary Tags */}
        <div className="space-y-6">
          
          {/* Company Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              {/* Logo 68px */}
              <div className="relative shrink-0">
                <img
                  src={firm.logo}
                  alt={firm.name}
                  className="h-[68px] w-[68px] rounded-2xl object-cover border border-zinc-800/80 shadow-sm"
                />
              </div>

              {/* Name & Rating (Scaled +10%) */}
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-lg font-bold text-white tracking-tight group-hover:text-zinc-200 transition-colors truncate block font-satoshi">
                    {firm.name}
                  </span>
                  <CheckCircle2 className="h-4 w-4 text-[#52b788] shrink-0" />
                </div>

                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-zinc-400 font-medium">
                  <div className="flex items-center font-satoshi text-zinc-400">
                    <Star className="h-3.5 w-3.5 text-zinc-400 stroke-[1.5]" />
                    <span className="font-medium ml-1 text-zinc-400">{firm.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-zinc-600">·</span>
                  <span className="text-zinc-400 font-satoshi">{firm.reviewCount} reviews</span>
                </div>
              </div>
            </div>

            {/* Compare Toggle Button */}
            {onCompareToggle && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onCompareToggle(firm);
                }}
                className={`p-2.5 rounded-xl border text-xs transition-colors shrink-0 z-20 ${
                  isCompared
                    ? 'bg-zinc-800 border-zinc-700 text-white'
                    : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
                }`}
                title="Add to comparison"
              >
                <Scale className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* DOMINANT METRICS (Scaled +10% to 32px-34px) */}
          <div className="grid grid-cols-3 gap-2 py-2 text-left items-start font-satoshi">
            
            {/* Col 1: Price */}
            <div className="flex flex-col items-start text-left">
              <Wallet className="h-4 w-4 text-zinc-400 mb-1 stroke-[1.5]" />
              <span className="text-white font-bold text-2xl sm:text-3xl lg:text-[32px] block tracking-tight whitespace-nowrap font-satoshi">
                {minPrice}
              </span>
              <span className="text-zinc-500 block text-xs uppercase font-medium tracking-wider mt-1 text-left font-satoshi">
                From
              </span>
            </div>

            {/* Col 2: Profit Split (IN THE MIDDLE) */}
            <div className="flex flex-col items-start text-left">
              <PieChart className="h-4 w-4 text-[#52b788] mb-1 stroke-[1.5]" />
              <span className="text-[#52b788] font-bold text-2xl sm:text-3xl lg:text-[32px] block tracking-tight whitespace-nowrap font-satoshi">
                {cleanProfitSplit}
              </span>
              <span className="text-zinc-500 block text-xs uppercase font-medium tracking-wider mt-1 text-left font-satoshi">
                Profit Split
              </span>
            </div>

            {/* Col 3: Max Funding */}
            <div className="flex flex-col items-start text-left">
              <TrendingUp className="h-4 w-4 text-zinc-400 mb-1 stroke-[1.5]" />
              <span className="text-white font-bold text-2xl sm:text-3xl lg:text-[32px] block tracking-tight whitespace-nowrap font-satoshi">
                {formattedMaxCapital}
              </span>
              <span className="text-zinc-500 block text-xs uppercase font-medium tracking-wider mt-1 text-left font-satoshi">
                Max Funding
              </span>
            </div>

          </div>

          {/* SECONDARY INFORMATION (Scaled to text-xs) */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium font-satoshi">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1c1c20] border border-zinc-800/80 text-zinc-300">
              <Shield className="h-3.5 w-3.5 text-zinc-400 shrink-0 stroke-[1.5]" />
              <span>{firm.maxDrawdown} Drawdown</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1c1c20] border border-zinc-800/80 text-zinc-300">
              <GitCommit className="h-3.5 w-3.5 text-zinc-400 shrink-0 stroke-[1.5]" />
              <span>{firm.evaluationSteps.join(' / ')}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1c1c20] border border-zinc-800/80 text-zinc-300">
              <Monitor className="h-3.5 w-3.5 text-zinc-400 shrink-0 stroke-[1.5]" />
              <span>{firm.platforms.slice(0, 2).join(', ')}</span>
            </span>
          </div>

        </div>

        {/* BOTTOM PINNED PROMO SUBTLE TAG */}
        <div className="pt-2 min-h-[24px] flex items-end">
          {firm.verifiedCoupon && (
            <div className="text-xs text-zinc-400 flex items-center gap-1.5 font-satoshi">
              <span className="text-[#52b788] font-semibold">{firm.verifiedCoupon.discount}</span>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-400">Code: <strong className="text-zinc-200 font-semibold">{firm.verifiedCoupon.code}</strong></span>
            </div>
          )}
        </div>

      </div>

      {/* 2. FOOTER & CTAS */}
      <div className="relative z-10 pt-4 border-t border-zinc-800/40 flex items-center justify-between gap-3 font-satoshi">
        <span className="text-xs font-semibold text-zinc-400 group-hover:text-white transition-colors px-2.5 py-1">
          Details
        </span>

        <span className="flex-1 flex items-center justify-center gap-1.5 py-3 px-5 rounded-xl bg-zinc-200/80 group-hover:bg-white text-zinc-950 font-bold text-xs transition-colors shadow-sm">
          <span>Explore Firm</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>

    </Link>
  );
}
