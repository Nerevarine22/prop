'use client';

import { useState } from 'react';
import { ArrowUpRight, CircleAlert } from 'lucide-react';
import type { FirmNormalizedProfile, NormalizedFact } from '@/types/database';
import {
  factArrayText,
  factBooleanText,
  factText,
  factValue,
  formatCapital,
  profilePrograms,
  profileRewardLabels,
  shortDate,
} from '@/lib/data/publicFirmProfiles';
import styles from '@/app/product-lab/page.module.css';

type TabId = 'overview' | 'challenges' | 'rules' | 'payouts' | 'rewards' | 'sources';

function FactState({ fact }: { fact: NormalizedFact<unknown> }) {
  return <em>{fact.status}</em>;
}

export function FirmResearchTabs({ firm, offerUrl }: { firm: FirmNormalizedProfile; offerUrl?: string }) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const programs = profilePrograms(firm);
  const discrepancyCount = firm.sourceDiscrepancies.length;
  const tabs: Array<{ id: TabId; label: string; count?: number }> = [
    { id: 'overview', label: 'Overview' },
    { id: 'challenges', label: 'Challenges & pricing', count: programs.length },
    { id: 'rules', label: 'Trading rules' },
    { id: 'payouts', label: 'Payouts' },
    { id: 'rewards', label: 'Rewards' },
    { id: 'sources', label: 'Sources & differences', count: discrepancyCount },
  ];

  const overviewFacts = [
    ['Evaluation models', programs.length ? programs.map((program) => program.name).join(', ') : factText(firm.challengePrograms), `${programs.length || 'No'} documented programs`],
    ['Trading venue', factText(firm.executionPolicy.venue), factArrayText(firm.tradingPolicy.platforms)],
    ['Crypto leverage', factText(firm.summary.cryptoLeverage), factArrayText(firm.tradingPolicy.leverage)],
    ['Payout schedule', factText(firm.summary.payoutFrequency), factArrayText(firm.payoutPolicy.currencies)],
    ['Maximum allocation', formatCapital(factValue(firm.summary.maxCapital)), `Starting from ${formatCapital(factValue(firm.summary.minCapital))}`],
    ['Company record', factText(firm.company.yearEstablished, (value) => `Established ${value}`), factText(firm.company.headquarters)],
  ];

  const rules: Array<[string, NormalizedFact<unknown>, string]> = [
    ['Weekend holding', firm.tradingPolicy.weekendHolding, factText(firm.tradingPolicy.weekendHolding)],
    ['News trading', firm.tradingPolicy.newsTrading, factText(firm.tradingPolicy.newsTrading)],
    ['Automated trading', firm.tradingPolicy.automatedTrading, factText(firm.tradingPolicy.automatedTrading)],
    ['Copy trading', firm.tradingPolicy.copyTrading, factText(firm.tradingPolicy.copyTrading)],
    ['Mandatory stop loss', firm.tradingPolicy.mandatoryStopLoss, factBooleanText(firm.tradingPolicy.mandatoryStopLoss, 'Required', 'Not required')],
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
            <div className={styles.profileSectionTitle}><div><span>01</span><h2>Firm overview</h2></div><p>Canonical values, resolved source differences and explicit ND fields.</p></div>
            <article className={styles.aboutFirm}>
              <div><span>Company positioning</span><h3>About {firm.name}</h3></div>
              <div><p>{factText(firm.identity.description)}</p><small>Status: {firm.identity.description.status}. No marketing copy is substituted when the official description is ND.</small></div>
            </article>
            <div className={styles.profileFacts}>{overviewFacts.map(([label, value, note]) => <article key={label}><span>{label}</span><strong>{value}</strong><p>{note}</p></article>)}</div>
            <div className={styles.researchGrid}>
              <article><span>Execution model</span><h3>{factText(firm.executionPolicy.model).replaceAll('-', ' ').toUpperCase()}</h3><p>{factText(firm.executionPolicy.notes)}</p><dl><div><dt>Venue</dt><dd>{factText(firm.executionPolicy.venue)}</dd></div><div><dt>On-chain settlement</dt><dd>{factBooleanText(firm.executionPolicy.onchainSettlement)}</dd></div><div><dt>Status</dt><dd>{firm.executionPolicy.model.status}</dd></div></dl></article>
              <article><span>Legal record</span><h3>{factText(firm.compliancePolicy.legalEntity)}</h3><p>{factText(firm.compliancePolicy.regulatoryStatus)}</p><dl><div><dt>Jurisdiction</dt><dd>{factText(firm.compliancePolicy.registrationJurisdiction)}</dd></div><div><dt>KYC stage</dt><dd>{factText(firm.compliancePolicy.kycRequiredAt).replaceAll('-', ' ')}</dd></div><div><dt>Account environment</dt><dd>{factBooleanText(firm.compliancePolicy.simulatedAccounts, 'Simulated', 'Not simulated')}</dd></div></dl></article>
            </div>
          </section>
        )}

        {activeTab === 'challenges' && (
          <section className={styles.profileSection}>
            <div className={styles.profileSectionTitle}><div><span>02</span><h2>Challenges & pricing</h2></div><p>Unknown numeric rules stay ND and are excluded from calculations.</p></div>
            {programs.length ? <div className={styles.sourceList}>{programs.map((program) => {
              const stages = factValue(program.stages) ?? [];
              const tiers = factValue(program.tiers) ?? [];
              return <article key={program.id}><div><span>{factText(program.kind)}</span><h3>{program.name}</h3><p>{factText(program.notes)}</p><dl><div><dt>Daily loss</dt><dd>{factText(program.dailyLossPercent, (value) => `${value}%`)}</dd></div><div><dt>Maximum drawdown</dt><dd>{factText(program.maxDrawdownPercent, (value) => `${value}%`)}</dd></div><div><dt>Funded split</dt><dd>{factText(program.fundedProfitSplitPercent, (value) => `${value}%`)}</dd></div><div><dt>No time limit</dt><dd>{factBooleanText(program.noTimeLimit)}</dd></div></dl></div><div><p>{stages.length ? stages.map((stage) => `${stage.name}: ${factText(stage.profitTargetPercent, (value) => `${value}% target`)}`).join(' · ') : `Stages: ${factText(program.stages)}`}</p><p>{tiers.length ? tiers.map((tier) => `${formatCapital(factValue(tier.accountSize))}: ${factText(tier.fee, (value) => `$${value}`)}`).join(' · ') : `Pricing: ${factText(program.tiers)}`}</p>{offerUrl && <a href={offerUrl} target="_blank" rel="noopener noreferrer">Official site <ArrowUpRight /></a>}</div></article>;
            })}</div> : <p className={styles.emptyResearchState}>{factText(firm.challengePrograms)} — no program structure was documented in the inspected official sources.</p>}
          </section>
        )}

        {activeTab === 'rules' && (
          <section className={styles.profileSection}>
            <div className={styles.profileSectionTitle}><div><span>03</span><h2>Trading rules</h2></div><p>ND is not interpreted as restricted or allowed.</p></div>
            <div className={styles.rulesList}>{rules.map(([label, fact, value]) => <div key={label}><div><strong>{label}</strong><p>Primary-source normalized field.</p></div><span className={value === 'allowed' || value === 'Not required' ? styles.rulePositive : styles.ruleNeutral}>{value}</span><FactState fact={fact} /></div>)}</div>
            <div className={styles.leverageTable}><div className={styles.leverageHeading}><div><span>Trading scope</span><h3>Platforms, markets and leverage</h3></div><p>{factText(firm.tradingPolicy.tradingFees)}</p></div><div><span>Platforms</span><strong>{factArrayText(firm.tradingPolicy.platforms)}</strong></div><div><span>Markets</span><strong>{factArrayText(firm.tradingPolicy.markets)}</strong></div><div><span>Leverage</span><strong>{factArrayText(firm.tradingPolicy.leverage)}</strong></div><div><span>Profit-day definition</span><strong>{factText(firm.tradingPolicy.profitDayDefinition)}</strong></div></div>
          </section>
        )}

        {activeTab === 'payouts' && (
          <section className={styles.profileSection}>
            <div className={styles.profileSectionTitle}><div><span>04</span><h2>Funded account & payouts</h2></div><p>Every payout value retains its evidence status.</p></div>
            <div className={styles.policyGrid}>
              <article><span>Profit split</span><strong>{factText(firm.payoutPolicy.profitSplitPercent, (value) => `${value}%`)}</strong><p>{firm.payoutPolicy.profitSplitPercent.status}</p></article>
              <article><span>Request timing</span><strong>{factText(firm.payoutPolicy.schedule)}</strong><p>{factText(firm.payoutPolicy.processingTimeHours, (value) => `Within ${value} hours`)}</p></article>
              <article><span>Minimum payout</span><strong>{factText(firm.payoutPolicy.minimumAmount, (value) => `$${value}`)}</strong><p>Paid in {factArrayText(firm.payoutPolicy.currencies)}.</p></article>
              <article><span>Withdrawal type</span><strong>{factBooleanText(firm.payoutPolicy.partialWithdrawalsAllowed, 'Partial allowed', 'Full only')}</strong><p>Positions closed: {factBooleanText(firm.payoutPolicy.positionsMustBeClosed)}</p></article>
            </div>
            <p className={styles.policyNote}><CircleAlert /> {factText(firm.payoutPolicy.notes)}</p>
          </section>
        )}

        {activeTab === 'rewards' && (
          <section className={styles.profileSection}>
            <div className={styles.profileSectionTitle}><div><span>05</span><h2>Tokenomics & rewards</h2></div><p>Absence of documentation is ND, not “No”.</p></div>
            <div className={styles.rewardResearch}><div><span>Programs tracked</span><h3>{profileRewardLabels(firm).join(', ') || 'ND'}</h3><p>{factText(firm.tokenRewards.description)}</p></div><dl><div><dt>Token</dt><dd>{factBooleanText(firm.tokenRewards.hasToken, factText(firm.tokenRewards.tokenTicker), 'No')}</dd></div><div><dt>Points program</dt><dd>{factBooleanText(firm.tokenRewards.hasPoints, factText(firm.tokenRewards.pointsProgramName), 'No')}</dd></div><div><dt>Airdrop status</dt><dd>{factBooleanText(firm.tokenRewards.hasAirdrop, factText(firm.tokenRewards.airdropStatus), 'No')}</dd></div></dl></div>
          </section>
        )}

        {activeTab === 'sources' && (
          <section className={styles.profileSection}>
            <div className={styles.profileSectionTitle}><div><span>06</span><h2>Sources & resolved differences</h2></div><p>The rulebook wins for trading rules; otherwise the most specific formal policy is canonical.</p></div>
            {discrepancyCount > 0 && <p className={styles.policyNote}><CircleAlert /> {discrepancyCount} official-source {discrepancyCount === 1 ? 'difference is' : 'differences are'} resolved and preserved with both URLs.</p>}
            {discrepancyCount > 0 && <div className={styles.sourceList}>{firm.sourceDiscrepancies.map((item) => <article key={item.id}><div><span>resolved · {item.resolutionBasis.replaceAll('-', ' ')}</span><h3>{item.label}</h3><p><strong>Canonical:</strong> {item.canonical.value}</p><p><strong>Alternate:</strong> {item.alternates.map((candidate) => candidate.value).join(' · ')}</p><p>{item.notes}</p></div><div><time>{shortDate(item.checkedAt)}</time><a href={item.canonical.sourceUrl} target="_blank" rel="noopener noreferrer">Canonical source <ArrowUpRight /></a>{item.alternates.map((candidate, index) => <a key={`${item.id}-${index}`} href={candidate.sourceUrl} target="_blank" rel="noopener noreferrer">Alternate source <ArrowUpRight /></a>)}</div></article>)}</div>}
            <div className={styles.sourceList}>{firm.claims.map((claim) => <article key={claim.id}><div><span>{claim.field} · {claim.status === 'conflict' ? 'archived observation' : claim.status}</span><h3>{claim.value}</h3><p>{claim.notes || 'Official-source observation.'}</p></div><div><time>{shortDate(claim.checkedAt)}</time><a href={claim.sourceUrl} target="_blank" rel="noopener noreferrer">Open source <ArrowUpRight /></a></div></article>)}</div>
          </section>
        )}
      </div>
    </div>
  );
}
