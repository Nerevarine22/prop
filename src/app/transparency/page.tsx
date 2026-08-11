'use client';

import React, { useState } from 'react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { Activity, ShieldCheck, DollarSign, Award, Clock, Wallet, ArrowUpRight, Database } from 'lucide-react';
import pageStyles from '@/components/layout/PublicPage.module.css';

export default function TransparencyPage() {
  const [activeCategory, setActiveCategory] = useState<string>('Overview');
  const [timeRange, setTimeRange] = useState<string>('30d');

  // Static sample records for UI development only.
  const activityLogs = [
    { id: 'tx-1', firm: 'FundingPips', trader: '0x8f...3a1c', amount: '$14,250 USDT', time: 'Example', status: 'Sample', txHash: '0xa72d...91e4' },
    { id: 'tx-2', firm: 'Breakout Prop', trader: '0x3b...90e2', amount: '$8,400 USDC', time: 'Example', status: 'Sample', txHash: '0x49f1...28b0' },
    { id: 'tx-3', firm: 'Bybit Prop Hub', trader: '0x1c...4f88', amount: '$22,100 USDT', time: 'Example', status: 'Sample', txHash: '0x99c2...77a1' },
    { id: 'tx-4', firm: 'FundingPips', trader: '0x7e...2d01', amount: '$5,900 USDT', time: 'Example', status: 'Sample', txHash: '0x31a4...00c8' },
    { id: 'tx-5', firm: 'Hydra Funded', trader: '0x9d...11b4', amount: '$11,600 USDT', time: 'Example', status: 'Sample', txHash: '0x82f9...64d5' },
  ];

  return (
    <div className={pageStyles.page}>
      <div className={pageStyles.container}>
      
      {/* Title Banner */}
      <header className={pageStyles.hero}>
        <div>
          <span className={pageStyles.eyebrow}><ShieldCheck /> Evidence layer</span>
          <h1 className={pageStyles.title}>Transparency data prototype</h1>
        </div>
        <div>
          <p className={pageStyles.lead}>A development preview of how payout evidence, provenance and operating metrics can be presented once verified data sources are connected.</p>
          <div className={pageStyles.notice}><Database /><span>All values and transaction records are static sample data. No live blockchain connection is active.</span></div>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <div className="mt-12 flex flex-col items-start gap-6 md:flex-row md:gap-8">
        
        {/* Left Sticky Navigation Sidebar */}
        <aside className="w-full md:w-56 shrink-0 md:sticky md:top-24">
          <div className="propr-card p-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-3 py-1.5 hidden md:block">Categories</div>
            <nav className="flex md:flex-col gap-1.5 overflow-x-auto no-scrollbar touch-scroll pb-1 md:pb-0">
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
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold rounded-lg transition-all duration-200 text-left shrink-0 md:shrink md:w-full min-h-[38px] ${
                      activeCategory === cat.name
                        ? 'bg-[#4f8cff]/15 text-[#a9c7ff] font-bold'
                        : 'text-zinc-400 hover:text-white hover:bg-[#181d26]'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                    <span className="whitespace-nowrap">{cat.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 space-y-8 min-w-0 w-full">
          
          {/* Time Range Bar & Control Header */}
          <div className="flex flex-col xs:flex-row xs:items-center justify-between border-b border-zinc-800 pb-4 gap-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>{activeCategory} Dashboard</span>
              <span className="rounded-md border border-amber-500/25 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300">Demo</span>
            </h2>

            <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-xs self-start xs:self-auto">
              {['7d', '30d', '90d', 'All'].map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded-md font-bold transition-all duration-200 min-h-[32px] ${
                    timeRange === range ? 'bg-[#4f8cff]/15 text-[#a9c7ff]' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* 10 KPI Metric Cards Grid (1 col small mobile, 2 cols mobile, 4 cols desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="propr-card p-4 sm:p-5 space-y-1">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Total Revenue</p>
              <p className="text-xl sm:text-2xl font-bold font-mono text-white">
                <AnimatedCounter value={4850240} prefix="$" />
              </p>
              <p className="text-[10px] text-zinc-500">lifetime across network</p>
            </div>

            <div className="propr-card p-4 sm:p-5 space-y-1">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Annualized Run Rate</p>
              <p className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">
                <AnimatedCounter value={12400000} prefix="$" />
              </p>
              <p className="text-[10px] text-zinc-500">based on trailing 30d</p>
            </div>

            <div className="propr-card p-4 sm:p-5 space-y-1">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Total Payouts</p>
              <p className="text-xl sm:text-2xl font-bold font-mono text-[#7aa8ff]">
                <AnimatedCounter value={3120500} prefix="$" />
              </p>
              <p className="text-[10px] text-zinc-500">sample on-chain metric</p>
            </div>

            <div className="propr-card p-4 sm:p-5 space-y-1">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Largest Single Payout</p>
              <p className="text-xl sm:text-2xl font-bold font-mono text-amber-400">
                <AnimatedCounter value={84500} prefix="$" />
              </p>
              <p className="text-[10px] text-zinc-500">all-time high payout</p>
            </div>

            <div className="propr-card p-4 sm:p-5 space-y-1">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Avg Time to Pay</p>
              <p className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">
                <AnimatedCounter value={42} suffix=" mins" />
              </p>
              <p className="text-[10px] text-zinc-500">USDT / USDC speed</p>
            </div>

            <div className="propr-card p-4 sm:p-5 space-y-1">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Active Traders</p>
              <p className="text-xl sm:text-2xl font-bold font-mono text-[#aaa8ff]">
                <AnimatedCounter value={18420} />
              </p>
              <p className="text-[10px] text-zinc-500">trailing 30 days</p>
            </div>

            <div className="propr-card p-4 sm:p-5 space-y-1">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Funded Traders</p>
              <p className="text-xl sm:text-2xl font-bold font-mono text-white">
                <AnimatedCounter value={1840} />
              </p>
              <p className="text-[10px] text-zinc-500">passed paid evaluation</p>
            </div>

            <div className="propr-card p-4 sm:p-5 space-y-1">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Funded AUM</p>
              <p className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">
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
                  <Database className="h-4 w-4 text-amber-300" />
                  Sample payout records
                </h3>
                <p className="text-xs text-zinc-500">Static records used to design the future evidence interface</p>
              </div>
              <span className="eyebrow-tag border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                Static demo
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
                      <td className="py-3 px-2 text-zinc-400 flex items-center gap-1">
                        <span>{log.txHash}</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </td>
                      <td className="py-3 px-2 text-right">
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-sans font-semibold text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          <Database className="h-3 w-3" />
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
    </div>
  );
}
