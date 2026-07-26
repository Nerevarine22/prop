'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { Activity, ShieldCheck, DollarSign, Award, Clock, Wallet, ArrowUpRight, CheckCircle2, RefreshCw } from 'lucide-react';

export default function TransparencyPage() {
  const [activeCategory, setActiveCategory] = useState<string>('Overview');
  const [timeRange, setTimeRange] = useState<string>('30d');

  // Mock Onchain Activity Stream
  const activityLogs = [
    { id: 'tx-1', firm: 'FundingPips', trader: '0x8f...3a1c', amount: '$14,250 USDT', time: '12 mins ago', status: 'Completed', txHash: '0xa72d...91e4' },
    { id: 'tx-2', firm: 'Breakout Prop', trader: '0x3b...90e2', amount: '$8,400 USDC', time: '34 mins ago', status: 'Completed', txHash: '0x49f1...28b0' },
    { id: 'tx-3', firm: 'Bybit Prop Hub', trader: '0x1c...4f88', amount: '$22,100 USDT', time: '1 hour ago', status: 'Completed', txHash: '0x99c2...77a1' },
    { id: 'tx-4', firm: 'FundingPips', trader: '0x7e...2d01', amount: '$5,900 USDT', time: '2 hours ago', status: 'Completed', txHash: '0x31a4...00c8' },
    { id: 'tx-5', firm: 'Hydra Funded', trader: '0x9d...11b4', amount: '$11,600 USDT', time: '3 hours ago', status: 'Completed', txHash: '0x82f9...64d5' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Title Banner */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-3">
        <h1 className="display-heading text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
          Real-Time Transparency Dashboard
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
          Track every metric that matters. From trader performance to payouts, hedging positions to platform uptime—see exactly how PropHub and partner firms operate in real time.
        </p>
      </div>

      {/* Main Dashboard Layout */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* Left Sticky Navigation Sidebar */}
        <aside className="w-full md:w-56 shrink-0 md:sticky md:top-24">
          <div className="propr-card p-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-3 py-2">Categories</div>
            <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-1 md:pb-0">
              {[
                { name: 'Overview', icon: ShieldCheck },
                { name: 'Activity', icon: Activity },
                { name: 'Revenue', icon: DollarSign },
                { name: 'Evaluations', icon: Award },
                { name: 'Payouts', icon: Clock },
                { name: 'Onchain Wallet', icon: Wallet },
              ].map(cat => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-200 text-left ${
                      activeCategory === cat.name
                        ? 'bg-zinc-800 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 text-zinc-400" />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 space-y-8 min-w-0 w-full">
          
          {/* Time Range Bar & Control Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>{activeCategory} Dashboard</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </h2>

            <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-xs">
              {['7d', '30d', '90d', 'All'].map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded-md font-bold transition-all duration-200 ${
                    timeRange === range ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* 10 KPI Metric Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="propr-card p-5 space-y-1">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Total Revenue</p>
              <p className="text-2xl font-bold font-mono text-white">
                <AnimatedCounter value={4850240} prefix="$" />
              </p>
              <p className="text-[10px] text-zinc-500">lifetime across network</p>
            </div>

            <div className="propr-card p-5 space-y-1">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Annualized Run Rate</p>
              <p className="text-2xl font-bold font-mono text-emerald-400">
                <AnimatedCounter value={12400000} prefix="$" />
              </p>
              <p className="text-[10px] text-zinc-500">based on trailing 30d</p>
            </div>

            <div className="propr-card p-5 space-y-1">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Total Payouts</p>
              <p className="text-2xl font-bold font-mono text-sky-400">
                <AnimatedCounter value={3120500} prefix="$" />
              </p>
              <p className="text-[10px] text-zinc-500">verified on-chain</p>
            </div>

            <div className="propr-card p-5 space-y-1">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Largest Single Payout</p>
              <p className="text-2xl font-bold font-mono text-amber-400">
                <AnimatedCounter value={84500} prefix="$" />
              </p>
              <p className="text-[10px] text-zinc-500">all-time high payout</p>
            </div>

            <div className="propr-card p-5 space-y-1">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Avg Time to Pay</p>
              <p className="text-2xl font-bold font-mono text-emerald-400">
                <AnimatedCounter value={42} suffix=" mins" />
              </p>
              <p className="text-[10px] text-zinc-500">USDT / USDC speed</p>
            </div>

            <div className="propr-card p-5 space-y-1">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Active Traders</p>
              <p className="text-2xl font-bold font-mono text-indigo-400">
                <AnimatedCounter value={18420} />
              </p>
              <p className="text-[10px] text-zinc-500">trailing 30 days</p>
            </div>

            <div className="propr-card p-5 space-y-1">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Funded Traders</p>
              <p className="text-2xl font-bold font-mono text-white">
                <AnimatedCounter value={1840} />
              </p>
              <p className="text-[10px] text-zinc-500">passed paid evaluation</p>
            </div>

            <div className="propr-card p-5 space-y-1">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Funded AUM</p>
              <p className="text-2xl font-bold font-mono text-emerald-400">
                <AnimatedCounter value={42500000} prefix="$" />
              </p>
              <p className="text-[10px] text-zinc-500">capital under mgmt</p>
            </div>
          </div>

          {/* Real-time Activity Feed Table */}
          <div className="propr-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-sky-400 animate-spin" />
                  Live Verified Payout Stream
                </h3>
                <p className="text-xs text-zinc-500">Real-time crypto payout transactions broadcasted from partner smart contracts</p>
              </div>
              <span className="eyebrow-tag border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                Auto Sync Active
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b border-zinc-800 text-zinc-500 uppercase text-[9px] font-sans">
                  <tr>
                    <th className="py-3 px-2">Prop Firm</th>
                    <th className="py-3 px-2">Trader Wallet</th>
                    <th className="py-3 px-2">Payout Amount</th>
                    <th className="py-3 px-2">Time</th>
                    <th className="py-3 px-2">Tx Hash</th>
                    <th className="py-3 px-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {activityLogs.map(log => (
                    <tr key={log.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3 px-2 font-bold font-sans text-white">{log.firm}</td>
                      <td className="py-3 px-2 text-zinc-400">{log.trader}</td>
                      <td className="py-3 px-2 text-emerald-400 font-bold">{log.amount}</td>
                      <td className="py-3 px-2 text-zinc-500 font-sans text-[11px]">{log.time}</td>
                      <td className="py-3 px-2 text-sky-400 underline flex items-center gap-1 cursor-pointer">
                        <span>{log.txHash}</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </td>
                      <td className="py-3 px-2 text-right">
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-sans font-semibold text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          <CheckCircle2 className="h-3 w-3" />
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>

      </div>
    </div>
  );
}
