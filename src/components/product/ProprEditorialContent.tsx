import { ArrowUpRight, Check, CircleAlert, Clock3, Coins, ShieldCheck, WalletCards } from 'lucide-react';
import type { FirmNormalizedProfile, NormalizedChallengeProgram, NormalizedFact } from '@/types/database';
import { getFirmModularProfile } from '@/lib/data/firmModularProfiles';
import { factValue, formatCapital, shortDate } from '@/lib/data/publicFirmProfiles';
import { ProprSectionNav } from './ProprSectionNav';
import styles from './ProprEditorialContent.module.css';

function known<T>(fact: NormalizedFact<T>): T | undefined {
  return fact.status === 'ND' ? undefined : fact.value;
}

function percentage(value: number | undefined): string {
  return value === undefined ? 'Not stated' : `${value}%`;
}

function yesNo(value: boolean | undefined): string {
  if (value === undefined) return 'Not stated';
  return value ? 'Yes' : 'No';
}

function sentenceCase(value: string | undefined): string {
  if (!value) return 'Not stated';
  return value.replaceAll('-', ' ').replace(/^./, (letter) => letter.toUpperCase());
}

function ProgramCard({ program }: { program: NormalizedChallengeProgram }) {
  const stages = known(program.stages) ?? [];
  const tiers = (known(program.tiers) ?? []).filter((tier) => known(tier.available) !== false);
  const targets = stages
    .map((stage) => known(stage.profitTargetPercent))
    .filter((value): value is number => value !== undefined);

  return (
    <article className={styles.programCard}>
      <div className={styles.programTop}>
        <div>
          <span>{stages.length > 1 ? `${stages.length}-phase evaluation` : '1-phase evaluation'}</span>
          <h3>{program.name}</h3>
        </div>
        <strong>{targets.map((target) => `${target}%`).join(' → ') || 'Target not stated'}</strong>
      </div>

      <dl className={styles.programRules}>
        <div><dt>Daily loss</dt><dd>{percentage(known(program.dailyLossPercent))}</dd></div>
        <div><dt>Maximum loss</dt><dd>{percentage(known(program.maxDrawdownPercent))}</dd></div>
        <div><dt>Drawdown</dt><dd>{sentenceCase(known(program.maxDrawdownType))}</dd></div>
        <div><dt>Time limit</dt><dd>{known(program.noTimeLimit) ? 'None' : 'Not stated'}</dd></div>
      </dl>

      <div className={styles.tiers}>
        <span>Account size and fee</span>
        <div>
          {tiers.map((tier, index) => {
            const capital = known(tier.accountSize);
            const fee = known(tier.fee);
            return (
              <p key={`${capital}-${fee}-${index}`}>
                <strong>{capital === undefined ? '—' : formatCapital(capital)}</strong>
                <span>{fee === undefined ? '—' : `$${fee}`}</span>
              </p>
            );
          })}
        </div>
      </div>
    </article>
  );
}

export function ProprEditorialContent({ firm }: { firm: FirmNormalizedProfile }) {
  const researchProfile = getFirmModularProfile(firm);
  const programs = factValue(firm.challengePrograms) ?? [];
  const platforms = factValue(firm.tradingPolicy.platforms) ?? [];
  const markets = factValue(firm.tradingPolicy.markets) ?? [];
  const leverage = factValue(firm.tradingPolicy.leverage) ?? [];
  const payoutCurrency = factValue(firm.payoutPolicy.currencies)?.join(', ') ?? 'Not stated';
  const sourceUrls = researchProfile.sourcesInspected?.map((source) => source.url)
    ?? [...new Set(firm.claims.map((claim) => claim.sourceUrl))];
  const officialWebsite = factValue(firm.identity.officialWebsite);
  const permissions = [
    ['News trading', sentenceCase(factValue(firm.tradingPolicy.newsTrading))],
    ['Weekend holding', sentenceCase(factValue(firm.tradingPolicy.weekendHolding))],
    ['Automated trading', sentenceCase(factValue(firm.tradingPolicy.automatedTrading))],
    ['Copy trading', sentenceCase(factValue(firm.tradingPolicy.copyTrading))],
  ];

  return (
    <div className={styles.editorial}>
      <ProprSectionNav />

      <section className={styles.decision} id="decision">
        <div className={styles.decisionCopy}>
          <span className={styles.eyebrow}>Decision brief</span>
          <h2>A conventional evaluation with crypto-native execution.</h2>
          <p>
            Propr offers one- and two-phase evaluations across three rule sets. Evaluation accounts are simulated,
            while qualifying flow can be routed through Hyperliquid and settled on-chain.
          </p>
        </div>
        <aside className={styles.fitNote}>
          <ShieldCheck />
          <div><span>What stands out</span><p>Three ways to balance entry price, profit target and drawdown allowance.</p></div>
        </aside>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <span className={styles.eyebrow}>How it works</span>
          <h2>From purchase to payout</h2>
          <p>The essential path, separated from the detailed rulebook.</p>
        </div>
        <ol className={styles.process}>
          <li><span>01</span><div><strong>Choose a rule set</strong><p>Classic 1-Step, Turbo 1-Step or Classic 2-Step.</p></div></li>
          <li><span>02</span><div><strong>Meet the objective</strong><p>Reach the program target without breaching its loss limits.</p></div></li>
          <li><span>03</span><div><strong>Activate the funded stage</strong><p>KYC is required at funded activation; accounts remain simulated.</p></div></li>
          <li><span>04</span><div><strong>Request a payout</strong><p>Eligible profit is paid in USDC under the documented payout conditions.</p></div></li>
        </ol>
      </section>

      <section className={styles.section} id="programs">
        <div className={styles.sectionHeading}>
          <span className={styles.eyebrow}>Programs and pricing</span>
          <h2>Pick the constraint set, not just the cheapest fee.</h2>
          <p>Each program changes the profit target and loss allowance. Account sizes stay comparable across offers.</p>
        </div>
        <div className={styles.programGrid}>
          {programs.map((program) => <ProgramCard key={program.id} program={program} />)}
        </div>
        <p className={styles.sectionNote}><CircleAlert /> Challenge fees are documented as non-refundable.</p>
      </section>

      <section className={`${styles.section} ${styles.payoutSection}`} id="payouts">
        <div className={styles.payoutLead}>
          <span className={styles.eyebrow}>How payouts work</span>
          <strong>{percentage(factValue(firm.payoutPolicy.profitSplitPercent))}</strong>
          <h2>of eligible profit goes to the trader.</h2>
          <p>{factValue(firm.payoutPolicy.notes) ?? 'Payout conditions are not stated.'}</p>
        </div>
        <div className={styles.payoutDetails}>
          <div><WalletCards /><span>Minimum request</span><strong>${factValue(firm.payoutPolicy.minimumAmount) ?? '—'}</strong></div>
          <div><Clock3 /><span>Stated processing</span><strong>Within {factValue(firm.payoutPolicy.processingTimeHours) ?? '—'} hours</strong></div>
          <div><Coins /><span>Settlement currency</span><strong>{payoutCurrency}</strong></div>
          <ul>
            <li><Check /> Positions must be closed before payout.</li>
            <li><Check /> The request withdraws the full available balance.</li>
            <li><CircleAlert /> Payout resets the funded account balance.</li>
          </ul>
        </div>
      </section>

      <section className={styles.section} id="trading">
        <div className={styles.sectionHeading}>
          <span className={styles.eyebrow}>Trading environment</span>
          <h2>Execution is concentrated around Hyperliquid.</h2>
          <p>{factValue(firm.executionPolicy.notes) ?? 'Execution details are not stated.'}</p>
        </div>
        <div className={styles.tradingLayout}>
          <div className={styles.tradingIntro}>
            <span>Where you trade</span>
            <h3>{platforms.join(' + ') || 'Not stated'}</h3>
            <p>{markets.join(', ') || 'Markets are not stated.'}</p>
            <small>{factValue(firm.tradingPolicy.tradingFees) ?? 'Trading fees are not stated.'}</small>
          </div>
          <dl className={styles.permissions}>
            {permissions.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
            <div><dt>Mandatory stop loss</dt><dd>{yesNo(factValue(firm.tradingPolicy.mandatoryStopLoss))}</dd></div>
            <div><dt>Consistency rule</dt><dd>{sentenceCase(factValue(firm.tradingPolicy.consistencyRule))}</dd></div>
          </dl>
          <div className={styles.leverage}>
            <span>Leverage bands</span>
            {leverage.map((item) => <p key={item}>{item}</p>)}
          </div>
        </div>
      </section>

      <section className={styles.section} id="consider">
        <div className={styles.sectionHeading}>
          <span className={styles.eyebrow}>Before you choose</span>
          <h2>The details most likely to change the decision.</h2>
        </div>
        <div className={styles.considerList}>
          <article><span>01</span><div><h3>Program rules differ materially</h3><p>Maximum drawdown ranges from 3% to 8%. The cheapest program is also the tightest.</p></div></article>
          <article><span>02</span><div><h3>A payout closes the cycle</h3><p>Partial withdrawals are not documented as available, and a payout resets the account balance.</p></div></article>
          <article><span>03</span><div><h3>The environment is simulated</h3><p>Propr is not a regulated broker or investment service. Qualifying flow may be routed on-chain.</p></div></article>
          <article><span>04</span><div><h3>Eligibility still matters</h3><p>KYC applies at funded activation, and the rulebook lists restricted jurisdictions.</p></div></article>
        </div>
      </section>

      <section className={styles.sources} id="sources">
        <div>
          <span className={styles.eyebrow}>Research record</span>
          <h2>{sourceUrls.length} official sources inspected</h2>
          <p>Last reviewed {shortDate(researchProfile.checkedAt)}. Unknown values are grouped here instead of interrupting the main explanation.</p>
        </div>
        <div className={styles.sourceLinks}>
          {officialWebsite && <a href={officialWebsite} target="_blank" rel="noreferrer">Official website <ArrowUpRight /></a>}
          {sourceUrls.map((url) => <a href={url} target="_blank" rel="noreferrer" key={url}>{new URL(url).hostname.replace('www.', '')} <ArrowUpRight /></a>)}
        </div>
        <p className={styles.unknowns}><strong>Not documented in the current review:</strong> company founding date, headquarters, profit-day definition and points-program details.</p>
      </section>
    </div>
  );
}
