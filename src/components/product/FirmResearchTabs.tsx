'use client';

import { useState } from 'react';
import { ArrowUpRight, CircleAlert } from 'lucide-react';
import type { PropFirm } from '@/types/firm';
import { ChallengeExplorer } from './ChallengeExplorer';
import { formatCapital, shortDate } from './experience';
import styles from '@/app/product-lab/page.module.css';

type TabId = 'overview' | 'challenges' | 'rules' | 'payouts' | 'rewards' | 'sources';

export function FirmResearchTabs({ firm, offerUrl }: { firm: PropFirm; offerUrl?: string }) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const conflictCount = firm.claims?.filter((claim) => claim.status === 'conflict').length ?? 0;
  const tabs: Array<{ id: TabId; label: string; count?: number }> = [
    { id: 'overview', label: 'Overview' },
    { id: 'challenges', label: 'Challenges & pricing', count: firm.challengePrograms?.length ?? firm.accountTiers.length },
    { id: 'rules', label: 'Trading rules' },
    { id: 'payouts', label: 'Payouts' },
    { id: 'rewards', label: 'Rewards' },
    { id: 'sources', label: 'Sources & changes', count: firm.sources.length },
  ];

  const overviewFacts = [
    ['Evaluation models', firm.challengePrograms?.map((program) => program.shortName).join(', ') || firm.evaluationSteps.join(', '), `${firm.challengePrograms?.length ?? firm.evaluationSteps.length} documented programs`],
    ['Trading venue', firm.tradingPolicy?.executionVenue || firm.platforms.join(', '), `${firm.tradingPolicy?.markets.length ?? firm.cryptoPairsCount} listed market groups`],
    ['Crypto leverage', firm.cryptoLeverage, 'Symbol-level limits vary'],
    ['Payout schedule', firm.payoutPolicy?.schedule === 'on-demand' ? 'On demand' : firm.payoutFrequency, firm.payoutPolicy ? `${firm.payoutPolicy.currencies.join(', ')} · ${firm.payoutPolicy.profitSplitPercent}% split` : 'Funded-account policy'],
    ['Maximum allocation', formatCapital(firm.compliancePolicy?.maximumAggregateFundedBalance ?? firm.maxCapital), `Starting from ${formatCapital(firm.minCapital)}`],
    ['Company record', `Established ${firm.yearEstablished}`, firm.headquarters],
  ];

  return (
    <div className={styles.researchWorkspace}>
      <div className={styles.researchTabs} role="tablist" aria-label={`${firm.name} research sections`}>
        {tabs.map((tab) => (
          <button key={tab.id} type="button" role="tab" aria-selected={activeTab === tab.id} aria-controls={`research-${tab.id}`} className={activeTab === tab.id ? styles.researchTabActive : undefined} onClick={() => setActiveTab(tab.id)}>
            {tab.label}{typeof tab.count === 'number' && <span>{tab.count}</span>}
          </button>
        ))}
      </div>

      <div className={styles.researchPanel} id={`research-${activeTab}`} role="tabpanel">
        {activeTab === 'overview' && (
          <section className={styles.profileSection}>
            <div className={styles.profileSectionTitle}><div><span>01</span><h2>Firm overview</h2></div><p>A quick operational picture before opening the detailed rules.</p></div>
            <article className={styles.aboutFirm}>
              <div><span>Company positioning</span><h3>About {firm.name}</h3></div>
              <div><p>{firm.description}</p><small>Based on the firm&apos;s official positioning and normalized against the current research record.</small></div>
            </article>
            <div className={styles.profileFacts}>{overviewFacts.map(([label, value, note]) => <article key={label}><span>{label}</span><strong>{value}</strong><p>{note}</p></article>)}</div>
            {(firm.executionPolicy || firm.compliancePolicy) && (
              <div className={styles.researchGrid}>
                {firm.executionPolicy && <article><span>Execution model</span><h3>{firm.executionPolicy.model.replace('-', ' / ').toUpperCase()}</h3><p>{firm.executionPolicy.notes}</p><dl><div><dt>Venue</dt><dd>{firm.executionPolicy.onchainVenue || 'Not stated'}</dd></div><div><dt>Trader selects routing</dt><dd>{firm.executionPolicy.traderCanChooseRouting ? 'Yes' : 'No'}</dd></div><div><dt>Trade-level visibility</dt><dd>{firm.executionPolicy.tradeLevelRoutingVisible ? 'Reported' : 'Not available'}</dd></div></dl></article>}
                {firm.compliancePolicy && <article><span>Legal record</span><h3>{firm.compliancePolicy.legalEntity || 'Entity not documented'}</h3><p>{firm.compliancePolicy.regulatoryStatus}</p><dl><div><dt>Jurisdiction</dt><dd>{firm.compliancePolicy.registrationJurisdiction || 'Not stated'}</dd></div><div><dt>KYC stage</dt><dd>{firm.compliancePolicy.kycRequiredAt.replaceAll('-', ' ')}</dd></div><div><dt>Account environment</dt><dd>{firm.compliancePolicy.simulatedAccounts ? 'Simulated' : 'Live'}</dd></div></dl></article>}
              </div>
            )}
          </section>
        )}

        {activeTab === 'challenges' && (
          <section className={styles.profileSection}>
            <div className={styles.profileSectionTitle}><div><span>02</span><h2>Challenges & pricing</h2></div><p>Choose a model first: its loss formula changes the economics of every account size.</p></div>
            {firm.challengePrograms?.length ? <ChallengeExplorer programs={firm.challengePrograms} firmName={firm.name} offerUrl={offerUrl} isReferral={Boolean(firm.verifiedCoupon?.referralUrl)} /> : <p className={styles.emptyResearchState}>Program-level pricing has not been researched yet.</p>}
          </section>
        )}

        {activeTab === 'rules' && (
          <section className={styles.profileSection}>
            <div className={styles.profileSectionTitle}><div><span>03</span><h2>Trading rules</h2></div><p>Permissions, loss mechanics and asset-level leverage in one focused view.</p></div>
            <div className={styles.rulesList}>
              {[
                ['Weekend holding', firm.weekendHoldingAllowed ? 'Allowed' : 'Restricted', 'Positions may remain open over the weekend under the reviewed rulebook.'],
                ['News trading', firm.newsTradingAllowed ? 'Allowed' : 'Restricted', 'Trading through high-impact events is covered separately from platform availability.'],
                ['Automated trading', firm.eaAllowed ? 'Allowed' : 'Restricted', 'Bots and copy trading are allowed, subject to prohibited-conduct rules.'],
                ['Time limit', firm.noTimeLimit ? 'No time limit' : 'Time limit applies', 'Minimum trading days and evaluation deadlines are tracked separately.'],
              ].map(([label, value, description]) => <div key={label}><div><strong>{label}</strong><p>{description}</p></div><span className={value === 'Allowed' || value === 'No time limit' ? styles.rulePositive : styles.ruleNeutral}>{value}</span><em>Reported</em></div>)}
            </div>
            {firm.tradingPolicy && <div className={styles.leverageTable}><div className={styles.leverageHeading}><div><span>Asset limits</span><h3>Maximum leverage by market</h3></div><p>{firm.tradingPolicy.tradingFees}</p></div>{firm.tradingPolicy.leverage.map((rule) => <div key={rule.market}><span>{rule.market}</span><strong>{rule.maxLeverage}</strong></div>)}</div>}
          </section>
        )}

        {activeTab === 'payouts' && (
          <section className={styles.profileSection}>
            <div className={styles.profileSectionTitle}><div><span>04</span><h2>Funded account & payouts</h2></div><p>What happens after passing matters as much as the evaluation price.</p></div>
            {firm.payoutPolicy ? <><div className={styles.policyGrid}><article><span>Profit split</span><strong>{firm.payoutPolicy.profitSplitPercent}%</strong><p>Trader share of an approved payout.</p></article><article><span>Request timing</span><strong>{firm.payoutPolicy.schedule === 'on-demand' ? 'On demand' : firm.payoutPolicy.schedule}</strong><p>{firm.payoutPolicy.processingTimeHours ? `Reported processing within ${firm.payoutPolicy.processingTimeHours} hours.` : 'Processing time not documented.'}</p></article><article><span>Minimum payout</span><strong>{firm.payoutPolicy.minimumAmount ? `$${firm.payoutPolicy.minimumAmount}` : 'Not stated'}</strong><p>Paid in {firm.payoutPolicy.currencies.join(', ')}.</p></article><article><span>Withdrawal type</span><strong>{firm.payoutPolicy.partialWithdrawalsAllowed ? 'Partial or full' : 'Full sweep only'}</strong><p>{firm.payoutPolicy.positionsMustBeClosed ? 'All positions must be closed first.' : 'Open-position rule not documented.'}</p></article></div>{firm.payoutPolicy.payoutResetsBalance && <p className={styles.policyNote}><CircleAlert /> An approved payout resets the funded balance and drawdown reference. The next trading cycle starts from a fresh risk window.</p>}</> : <p className={styles.emptyResearchState}>The payout policy has not been researched yet.</p>}
          </section>
        )}

        {activeTab === 'rewards' && (
          <section className={styles.profileSection}>
            <div className={styles.profileSectionTitle}><div><span>05</span><h2>Tokenomics & rewards</h2></div><p>Reward claims stay separate from the value of the trading challenge.</p></div>
            <div className={styles.rewardResearch}><div><span>Programs tracked</span><h3>{firm.rewardTags?.join(', ') || 'None documented'}</h3><p>{firm.tokenomicsInfo?.rewardDescription || 'No reward program has been documented.'}</p></div><dl><div><dt>Token</dt><dd>{firm.tokenomicsInfo?.hasToken ? firm.tokenomicsInfo.tokenTicker || 'Reported' : 'No'}</dd></div><div><dt>Points program</dt><dd>{firm.tokenomicsInfo?.hasPoints ? firm.tokenomicsInfo.pointsProgramName || 'Yes' : 'No'}</dd></div><div><dt>Airdrop status</dt><dd>{firm.tokenomicsInfo?.hasAirdrop ? firm.tokenomicsInfo.airdropStatus || 'Reported' : 'No'}</dd></div></dl></div>
          </section>
        )}

        {activeTab === 'sources' && (
          <section className={styles.profileSection}>
            <div className={styles.profileSectionTitle}><div><span>06</span><h2>Sources & change log</h2></div><p>Primary evidence, unresolved conflicts and material rule changes.</p></div>
            {conflictCount > 0 && <p className={styles.policyNote}><CircleAlert /> {conflictCount} source conflict is preserved instead of being silently resolved.</p>}
            <div className={styles.sourceList}>{firm.sources.map((source) => <article key={source.id}><div><span>{source.type.replaceAll('-', ' ')}</span><h3>{source.label}</h3><p>{source.notes}</p></div><div><time>{shortDate(source.accessedAt)}</time>{source.url && <a href={source.url} target="_blank" rel="noopener noreferrer">Open source <ArrowUpRight /></a>}</div></article>)}</div>
            {firm.changeHistory.length > 0 && <div className={styles.changeLog}><h3>Material changes</h3>{firm.changeHistory.map((change) => <div key={change.id}><time>{shortDate(change.changedAt)}</time><div><strong>{change.nextValue}</strong><p>{change.note}</p></div></div>)}</div>}
          </section>
        )}
      </div>
    </div>
  );
}
