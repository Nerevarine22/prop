'use client';

import { useState } from 'react';
import { Activity, ArrowUpRight, Database, ShieldCheck } from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import pageStyles from '@/components/layout/PublicPage.module.css';

const activityLogs = [
  { id: 'tx-1', firm: 'FundingPips', trader: '0x8f...3a1c', amount: '$14,250 USDT', txHash: '0xa72d...91e4' },
  { id: 'tx-2', firm: 'Breakout Prop', trader: '0x3b...90e2', amount: '$8,400 USDC', txHash: '0x49f1...28b0' },
  { id: 'tx-3', firm: 'Bybit Prop Hub', trader: '0x1c...4f88', amount: '$22,100 USDT', txHash: '0x99c2...77a1' },
  { id: 'tx-4', firm: 'Hydra Funded', trader: '0x9d...11b4', amount: '$11,600 USDT', txHash: '0x82f9...64d5' },
];

export default function TransparencyPage() {
  const [timeRange, setTimeRange] = useState('30d');

  return (
    <div className={pageStyles.page}>
      <div className={pageStyles.container}>
        <header className={pageStyles.hero}>
          <div><span className={pageStyles.eyebrow}><ShieldCheck /> Evidence layer</span><h1 className={pageStyles.title}>Transparency data prototype</h1></div>
          <div><p className={pageStyles.lead}>How payout evidence, provenance and operating metrics can be presented once verified data sources are connected.</p><div className={pageStyles.notice}><Database /><span>All values and transaction records are static sample data. No live blockchain connection is active.</span></div></div>
        </header>

        <section className={pageStyles.section} aria-labelledby="evidence-overview-heading">
          <div className={pageStyles.toolbar}>
            <div><span className={pageStyles.eyebrow}><Activity /> Evidence overview</span><h2 id="evidence-overview-heading">Inspectable operating signals</h2></div>
            <div className={pageStyles.segmented}>{['7d', '30d', '90d', 'All'].map((range) => <button type="button" key={range} aria-pressed={timeRange === range} onClick={() => setTimeRange(range)}>{range}</button>)}</div>
          </div>

          <div className={`${pageStyles.grid4} ${pageStyles.section}`}>
            <div className={pageStyles.metric}><small>Total payouts</small><strong><AnimatedCounter value={3120500} prefix="$" /></strong><p>Sample network metric</p></div>
            <div className={`${pageStyles.metric} ${pageStyles.metricPositive}`}><small>Average time to pay</small><strong><AnimatedCounter value={42} suffix=" mins" /></strong><p>USDT / USDC example</p></div>
            <div className={`${pageStyles.metric} ${pageStyles.metricInfo}`}><small>Funded traders</small><strong><AnimatedCounter value={1840} /></strong><p>Illustrative count</p></div>
            <div className={pageStyles.metric}><small>Largest payout</small><strong><AnimatedCounter value={84500} prefix="$" /></strong><p>Sample record</p></div>
          </div>
        </section>

        <section className={pageStyles.section} aria-labelledby="payout-records-heading">
          <div className={pageStyles.sectionHeader}><h2 id="payout-records-heading">Sample payout records</h2><p>Future records will connect a documented payout claim to an inspectable transaction and review status.</p></div>
          <div className={`${pageStyles.panel} ${pageStyles.tableWrap}`}>
            <table className={pageStyles.table}>
              <thead><tr><th>Prop firm</th><th>Trader wallet</th><th>Payout amount</th><th>Transaction</th><th>Status</th></tr></thead>
              <tbody>{activityLogs.map((log) => <tr key={log.id}><td><strong>{log.firm}</strong></td><td>{log.trader}</td><td>{log.amount}</td><td>{log.txHash} <ArrowUpRight className="inline h-3 w-3" /></td><td>Sample</td></tr>)}</tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
