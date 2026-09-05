'use client';

import { ArrowUpRight, Check, CircleAlert, Clock3, Coins, ShieldCheck, WalletCards } from 'lucide-react';
import type { FirmNormalizedProfile, FirmNormalizedProfileV2, NormalizedChallengeProgram, NormalizedFact } from '@/types/database';
import { getFirmModularProfile } from '@/lib/data/firmModularProfiles';
import { factValue, formatCapital, shortDate } from '@/lib/data/publicFirmProfiles';
import { ProprSectionNav } from './ProprSectionNav';
import { InlineEditableText } from './InlineEditableText';
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

function sourceLabel(url: string): string {
  const source = new URL(url);
  const host = source.hostname.replace('www.', '');
  const path = source.pathname.replace(/\/$/, '');
  return path ? `${host}${path}` : host;
}

function ProgramCard({ program }: { program: NormalizedChallengeProgram }) {
  const kind = known(program.kind);
  const stages = known(program.stages) ?? [];
  const tiers = (known(program.tiers) ?? []).filter((tier) => known(tier.available) !== false);
  const targets = stages
    .map((stage) => known(stage.profitTargetPercent))
    .filter((value): value is number => value !== undefined);

  return (
    <article className={styles.programCard}>
      <div className={styles.programTop}>
        <div>
          <span>{kind === 'instant-funding' ? 'Instant Fund' : kind === 'collateralized' ? 'Collateralized funding' : kind === 'progression' ? 'Progression' : stages.length > 1 ? `${stages.length}-phase evaluation` : '1-phase evaluation'}</span>
          <h3>{program.name}</h3>
        </div>
        <div className={styles.programTarget}>
          <span>{targets.length > 1 ? 'Profit targets' : 'Profit target'}</span>
          <strong>{targets.map((target) => `${target}%`).join(' → ') || 'Not stated'}</strong>
        </div>
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

export function ProprEditorialContent({
  firm,
  profileOverride,
  editMode = false,
  selectedBlockId,
  onProfileChange,
}: {
  firm: FirmNormalizedProfile;
  profileOverride?: FirmNormalizedProfileV2;
  editMode?: boolean;
  selectedBlockId?: string | null;
  onProfileChange?: (profile: FirmNormalizedProfileV2) => void;
}) {
  const researchProfile = getFirmModularProfile(firm);
  const programs = factValue(firm.challengePrograms) ?? [];
  const platforms = factValue(firm.tradingPolicy.platforms) ?? [];
  const markets = factValue(firm.tradingPolicy.markets) ?? [];
  const leverage = factValue(firm.tradingPolicy.leverage) ?? [];
  const payoutCurrency = factValue(firm.payoutPolicy.currencies)?.join(', ') ?? 'Not stated';
  const sourceUrls = researchProfile.sourcesInspected?.map((source) => source.url)
    ?? [...new Set(firm.claims.map((claim) => claim.sourceUrl))];
  const officialWebsite = factValue(firm.identity.officialWebsite);
  const supportingSourceUrls = sourceUrls.filter((url) => url !== officialWebsite);
  const pageProfile = profileOverride ?? researchProfile;
  const copy = (key: string, fallback: string) => pageProfile.editorialCopy?.[key] ?? fallback;
  const isSizeProp = firm.slug === 'sizeprop';
  const isFundex = firm.slug === 'fundex';
  const isAceTrader = firm.slug === 'acetrader';
  const isBreakout = firm.slug === 'breakout';
  const isChainFunded = firm.slug === 'chainfunded';
  const isFoxify = firm.slug === 'foxify';
  const isHypernova = firm.slug === 'hypernova';
  const isO2 = firm.slug === 'o2';
  const hasStandardRewards = isFoxify || isO2;
  const changeCopy = (key: string, value: string) => {
    if (!profileOverride || !onProfileChange) return;
    onProfileChange({ ...profileOverride, editorialCopy: { ...profileOverride.editorialCopy, [key]: value } });
  };
  const permissions = [
    ['News trading', sentenceCase(factValue(firm.tradingPolicy.newsTrading))],
    ['Weekend holding', sentenceCase(factValue(firm.tradingPolicy.weekendHolding))],
    ['Automated trading', sentenceCase(factValue(firm.tradingPolicy.automatedTrading))],
    ['Copy trading', sentenceCase(factValue(firm.tradingPolicy.copyTrading))],
  ];
  const cmsSection = (sectionId: string) => ({
    'data-cms-section-id': profileOverride?.sections.find((section) => section.id === sectionId)?.id,
  });
  const cmsBlock = (sectionId: string, blockId: string) => {
    const section = profileOverride?.sections.find((item) => item.id === sectionId);
    const block = section?.blocks.find((item) => item.id === blockId);
    return {
      'data-cms-section-id': section?.id,
      'data-cms-block-id': block?.id,
      'data-selected': block?.id === selectedBlockId ? 'true' : 'false',
    };
  };
  const navItems = isSizeProp ? [
    { id: 'decision', label: 'Brief' },
    { id: 'programs', label: 'Challenges' },
    { id: 'payouts', label: 'Payouts' },
    { id: 'trading', label: 'Trading' },
    { id: 'rewards', label: 'Rewards' },
    { id: 'trust', label: 'Trust & risks' },
    { id: 'sources', label: 'Sources' },
  ] : isFundex ? [
    { id: 'decision', label: 'Brief' },
    { id: 'programs', label: 'Challenges' },
    { id: 'payouts', label: 'Payouts' },
    { id: 'trading', label: 'Trading' },
    { id: 'consider', label: 'Risk model' },
    { id: 'sources', label: 'Sources' },
  ] : isAceTrader ? [
    { id: 'decision', label: 'Brief' },
    { id: 'programs', label: 'Plans' },
    { id: 'payouts', label: 'Payouts' },
    { id: 'trading', label: 'Trading' },
    { id: 'transparency', label: 'Transparency' },
    { id: 'consider', label: 'Risk & proof' },
    { id: 'rewards', label: 'Rewards' },
    { id: 'sources', label: 'Sources' },
  ] : isBreakout ? [
    { id: 'decision', label: 'Brief' },
    { id: 'programs', label: 'Challenges' },
    { id: 'payouts', label: 'Payouts' },
    { id: 'trading', label: 'Trading' },
    { id: 'consider', label: 'Risk & proof' },
    { id: 'sources', label: 'Sources' },
  ] : isChainFunded ? [
    { id: 'decision', label: 'Brief' },
    { id: 'programs', label: 'Challenge' },
    { id: 'payouts', label: 'Payouts' },
    { id: 'trading', label: 'Trading' },
    { id: 'consider', label: 'Risk & proof' },
    { id: 'rewards', label: 'Rewards' },
    { id: 'sources', label: 'Sources' },
  ] : isFoxify || isHypernova || isO2 ? [
    { id: 'decision', label: 'Brief' },
    { id: 'programs', label: isO2 ? 'Accounts' : 'Programs' },
    { id: 'payouts', label: 'Payouts' },
    { id: 'trading', label: 'Trading' },
    { id: 'consider', label: 'Risk & proof' },
    ...(hasStandardRewards ? [{ id: 'rewards', label: 'Rewards' }] : []),
    { id: 'sources', label: 'Sources' },
  ] : undefined;

  return (
    <div className={styles.editorial} data-editing={editMode ? 'true' : 'false'}>
      <ProprSectionNav items={navItems} firmName={firm.name} promoCode={copy('promo.code', firm.slug === 'propr' ? 'PROP20' : '')} />

      <section className={styles.decision} id="decision" {...cmsSection('overview')}>
        <div className={styles.decisionCopy} {...cmsBlock('overview', 'notebooklm-1')}>
          <span className={styles.eyebrow}>Decision brief</span>
          <InlineEditableText as="h2" value={copy('decision.title', 'A conventional evaluation with crypto-native execution.')} enabled={editMode} multiline onCommit={(value) => changeCopy('decision.title', value)} />
          <InlineEditableText as="p" value={copy('decision.description', 'Propr offers one- and two-phase evaluations across three rule sets. Evaluation accounts are simulated, while qualifying flow can be routed through Hyperliquid and settled on-chain.')} enabled={editMode} multiline onCommit={(value) => changeCopy('decision.description', value)} />
        </div>
        <aside className={styles.fitNote} {...cmsBlock('overview', 'overview-facts')}>
          <ShieldCheck />
          <div><span>What stands out</span><InlineEditableText as="p" value={copy('decision.highlight', 'Three ways to balance entry price, profit target and drawdown allowance.')} enabled={editMode} multiline onCommit={(value) => changeCopy('decision.highlight', value)} /></div>
        </aside>
      </section>

      <section className={styles.section} {...cmsSection('overview')}>
        <div className={styles.sectionHeading} {...cmsBlock('overview', 'notebooklm-2')}>
          <span className={styles.eyebrow}>How it works</span>
          <InlineEditableText as="h2" value={copy('process.title', 'From purchase to payout')} enabled={editMode} onCommit={(value) => changeCopy('process.title', value)} />
          <InlineEditableText as="p" value={copy('process.description', 'The essential path, separated from the detailed rulebook.')} enabled={editMode} multiline onCommit={(value) => changeCopy('process.description', value)} />
        </div>
        <ol className={styles.process} {...cmsBlock('overview', 'notebooklm-2')}>
          <li><span>01</span><div><InlineEditableText as="strong" value={copy('process.1.title', 'Choose a rule set')} enabled={editMode} onCommit={(value) => changeCopy('process.1.title', value)} /><InlineEditableText as="p" value={copy('process.1.description', 'Classic 1-Step, Turbo 1-Step or Classic 2-Step.')} enabled={editMode} multiline onCommit={(value) => changeCopy('process.1.description', value)} /></div></li>
          <li><span>02</span><div><InlineEditableText as="strong" value={copy('process.2.title', 'Meet the objective')} enabled={editMode} onCommit={(value) => changeCopy('process.2.title', value)} /><InlineEditableText as="p" value={copy('process.2.description', 'Reach the program target without breaching its loss limits.')} enabled={editMode} multiline onCommit={(value) => changeCopy('process.2.description', value)} /></div></li>
          <li><span>03</span><div><InlineEditableText as="strong" value={copy('process.3.title', 'Activate the funded stage')} enabled={editMode} onCommit={(value) => changeCopy('process.3.title', value)} /><InlineEditableText as="p" value={copy('process.3.description', 'KYC is required at funded activation; accounts remain simulated.')} enabled={editMode} multiline onCommit={(value) => changeCopy('process.3.description', value)} /></div></li>
          <li><span>04</span><div><InlineEditableText as="strong" value={copy('process.4.title', 'Request a payout')} enabled={editMode} onCommit={(value) => changeCopy('process.4.title', value)} /><InlineEditableText as="p" value={copy('process.4.description', 'Eligible profit is paid in USDC under the documented payout conditions.')} enabled={editMode} multiline onCommit={(value) => changeCopy('process.4.description', value)} /></div></li>
        </ol>
      </section>

      <section className={styles.section} id="programs" {...cmsSection('offers')}>
        <div className={styles.sectionHeading} {...cmsBlock('offers', 'notebooklm-3')}>
          <span className={styles.eyebrow}>Programs and pricing</span>
          <InlineEditableText as="h2" value={copy('programs.title', 'Pick the constraint set, not just the cheapest fee.')} enabled={editMode} multiline onCommit={(value) => changeCopy('programs.title', value)} />
          <InlineEditableText as="p" value={copy('programs.description', 'Each program changes the profit target and loss allowance. Account sizes stay comparable across offers.')} enabled={editMode} multiline onCommit={(value) => changeCopy('programs.description', value)} />
        </div>
        <div className={styles.programGrid} {...cmsBlock('offers', 'offer-records')}>
          {programs.map((program) => <ProgramCard key={program.id} program={program} />)}
        </div>
        <p className={styles.sectionNote}><CircleAlert /> {copy('programs.note', 'Challenge fees are documented as non-refundable.')}</p>
      </section>

      <section className={`${styles.section} ${styles.payoutSection}`} id="payouts" {...cmsSection('payouts')}>
        <div className={styles.payoutLead} {...cmsBlock('payouts', 'notebooklm-8')}>
          <span className={styles.eyebrow}>How payouts work</span>
          <strong>{percentage(factValue(firm.payoutPolicy.profitSplitPercent))}</strong>
          <InlineEditableText as="h2" value={copy('payouts.title', 'of eligible profit goes to the trader.')} enabled={editMode} multiline onCommit={(value) => changeCopy('payouts.title', value)} />
          <InlineEditableText as="p" value={copy('payouts.description', factValue(firm.payoutPolicy.notes) ?? 'Payout conditions are not stated.')} enabled={editMode} multiline onCommit={(value) => changeCopy('payouts.description', value)} />
        </div>
        <div className={styles.payoutDetails} {...cmsBlock('payouts', 'payout-facts')}>
          <div><WalletCards /><span>Minimum request</span><strong>{copy('payouts.minimum', factValue(firm.payoutPolicy.minimumAmount) === undefined ? 'Not stated' : `$${factValue(firm.payoutPolicy.minimumAmount)}`)}</strong></div>
          <div><Clock3 /><span>Stated processing</span><strong>{copy('payouts.processing', factValue(firm.payoutPolicy.processingTimeHours) === undefined ? 'Not stated' : `Within ${factValue(firm.payoutPolicy.processingTimeHours)} hours`)}</strong></div>
          <div><Coins /><span>Settlement currency</span><strong>{payoutCurrency}</strong></div>
          <ul>
            <li><Check /> {copy('payouts.rule.1', 'Positions must be closed before payout.')}</li>
            <li><Check /> {copy('payouts.rule.2', 'The request withdraws the full available balance.')}</li>
            <li><CircleAlert /> {copy('payouts.rule.3', 'Payout resets the funded account balance.')}</li>
          </ul>
        </div>
      </section>

      <section className={`${styles.section} ${isAceTrader ? styles.beforeTransparency : ''}`} id="trading" {...cmsSection('trading')}>
        <div className={styles.sectionHeading} {...cmsBlock('trading', 'notebooklm-4')}>
          <span className={styles.eyebrow}>Trading environment</span>
          <InlineEditableText as="h2" value={copy('trading.title', 'Execution is concentrated around Hyperliquid.')} enabled={editMode} multiline onCommit={(value) => changeCopy('trading.title', value)} />
          <InlineEditableText as="p" value={copy('trading.description', factValue(firm.executionPolicy.notes) ?? 'Execution details are not stated.')} enabled={editMode} multiline onCommit={(value) => changeCopy('trading.description', value)} />
        </div>
        <div className={styles.tradingLayout} {...cmsBlock('trading', 'trading-facts')}>
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

      {isAceTrader && <section className={`${styles.section} ${styles.transparencySection}`} id="transparency" {...cmsSection('transparency')}>
        <div className={styles.sectionHeading} {...cmsBlock('transparency', 'transparency-facts')}>
          <span className={styles.eyebrow}>Published transparency</span>
          <InlineEditableText as="h2" value={copy('transparency.title', 'Payout transactions are visible; aggregate claims remain company-published.')} enabled={editMode} multiline onCommit={(value) => changeCopy('transparency.title', value)} />
          <InlineEditableText as="p" value={copy('transparency.description', 'Transaction-level links improve traceability without replacing an independent reserve or solvency audit.')} enabled={editMode} multiline onCommit={(value) => changeCopy('transparency.description', value)} />
        </div>
        <div className={styles.transparencyMetrics} {...cmsBlock('transparency', 'transparency-facts')}>
          <article data-tone="value"><span>Total processed</span><strong>$94,524.50</strong><p>73 published payouts</p><small>Largest: $10,260</small></article>
          <article data-tone="research"><span>Evaluation funnel</span><strong>11.8%</strong><p>165 funded from 1,397 subscriptions</p><small>21 reached a payout</small></article>
          <article data-tone="settlement"><span>Instant Fund</span><strong>52</strong><p>paid from 367 accounts</p><small>14.1% shown as earned</small></article>
          <article data-tone="condition"><span>Processing</span><strong>2.3d</strong><p>company-reported average</p><small>Txn links published per row</small></article>
        </div>
        <div className={styles.transparencyFoot}><span>Evidence boundary</span><p>Transaction hashes improve payout traceability. The aggregate funnel and capital figures remain company-published and are not proof of reserves or an independent financial audit.</p></div>
      </section>}

      <section className={`${styles.section} ${isAceTrader ? styles.riskSection : ''}`} id="consider" {...cmsSection('trading')}>
        <div className={styles.sectionHeading}>
          <span className={styles.eyebrow}>{copy('consider.eyebrow', 'Before you choose')}</span>
          <InlineEditableText as="h2" value={copy('consider.title', 'The details most likely to change the decision.')} enabled={editMode} multiline onCommit={(value) => changeCopy('consider.title', value)} />
        </div>
        <div className={isAceTrader ? styles.riskGrid : styles.considerList}>
          <article {...cmsBlock('trading', 'notebooklm-7')}><span>01</span><div><InlineEditableText as="h3" value={copy('consider.1.title', 'Program rules differ materially')} enabled={editMode} onCommit={(value) => changeCopy('consider.1.title', value)} /><InlineEditableText as="p" value={copy('consider.1.description', 'Maximum drawdown ranges from 3% to 8%. The cheapest program is also the tightest.')} enabled={editMode} multiline onCommit={(value) => changeCopy('consider.1.description', value)} /></div></article>
          <article {...cmsBlock('trading', 'notebooklm-6')}><span>02</span><div><InlineEditableText as="h3" value={copy('consider.2.title', 'A payout closes the cycle')} enabled={editMode} onCommit={(value) => changeCopy('consider.2.title', value)} /><InlineEditableText as="p" value={copy('consider.2.description', 'Partial withdrawals are not documented as available, and a payout resets the account balance.')} enabled={editMode} multiline onCommit={(value) => changeCopy('consider.2.description', value)} /></div></article>
          <article {...cmsBlock('trading', 'notebooklm-5')}><span>03</span><div><InlineEditableText as="h3" value={copy('consider.3.title', 'The environment is simulated')} enabled={editMode} onCommit={(value) => changeCopy('consider.3.title', value)} /><InlineEditableText as="p" value={copy('consider.3.description', 'Propr is not a regulated broker or investment service. Qualifying flow may be routed on-chain.')} enabled={editMode} multiline onCommit={(value) => changeCopy('consider.3.description', value)} /></div></article>
          <article {...cmsBlock('trading', 'notebooklm-4')}><span>04</span><div><InlineEditableText as="h3" value={copy('consider.4.title', 'Eligibility still matters')} enabled={editMode} onCommit={(value) => changeCopy('consider.4.title', value)} /><InlineEditableText as="p" value={copy('consider.4.description', 'KYC applies at funded activation, and the rulebook lists restricted jurisdictions.')} enabled={editMode} multiline onCommit={(value) => changeCopy('consider.4.description', value)} /></div></article>
        </div>
      </section>

      {isSizeProp && <section className={styles.section} id="rewards" {...cmsSection('rewards')}>
        <div className={styles.sectionHeading} {...cmsBlock('rewards', 'reward-facts')}>
          <span className={styles.eyebrow}>Rewards status</span>
          <InlineEditableText as="h2" value={copy('rewards.title', 'Points are live; token expectations are not.')} enabled={editMode} multiline onCommit={(value) => changeCopy('rewards.title', value)} />
          <InlineEditableText as="p" value={copy('rewards.description', factValue(firm.tokenRewards.description) ?? 'Reward details are not documented.')} enabled={editMode} multiline onCommit={(value) => changeCopy('rewards.description', value)} />
        </div>
        <div className={styles.considerList} {...cmsBlock('rewards', 'reward-facts')}>
          <article><span>01</span><div><h3>Points program</h3><p>Live · earned through purchases, passes, payouts and referrals.</p></div></article>
          <article><span>02</span><div><h3>Progression</h3><p>Bronze-to-Obsidian tiers, with time-limited boosts and account giveaways.</p></div></article>
          <article><span>03</span><div><h3>$SIZE token</h3><p>Teased, but no confirmed live contract, supply or utility paper.</p></div></article>
          <article><span>04</span><div><h3>Airdrop</h3><p>Unconfirmed. Holding points is not a guaranteed token allocation.</p></div></article>
        </div>
      </section>}

      {isAceTrader && <section className={`${styles.section} ${styles.rewardSection}`} id="rewards" {...cmsSection('rewards')}>
        <div className={styles.sectionHeading} {...cmsBlock('rewards', 'reward-facts')}>
          <span className={styles.eyebrow}>Rewards and points</span>
          <InlineEditableText as="h2" value={copy('rewards.title', 'Every purchase and leaderboard point creates optional upside.')} enabled={editMode} multiline onCommit={(value) => changeCopy('rewards.title', value)} />
          <InlineEditableText as="p" value={copy('rewards.description', 'The documented monthly draw and the open-ended points teaser are separate reward signals.')} enabled={editMode} multiline onCommit={(value) => changeCopy('rewards.description', value)} />
        </div>
        <div className={styles.rewardSplit} {...cmsBlock('rewards', 'reward-facts')}>
          <article className={styles.rewardDraw}>
            <span>Documented program</span>
            <strong>$1 = 1 ticket</strong>
            <h3>Monthly Community Reward</h3>
            <p>The pool scales with purchases, up to an advertised $330K in combined Starter, Standard and Pro Instant Fund access.</p>
            <small>Nominal Trade Fund allocation · not a cash prize</small>
          </article>
          <article className={styles.rewardPoints}>
            <span>Live signal · future terms unknown</span>
            <strong>Points</strong>
            <h3>Leaderboard is already active</h3>
            <p>Users can accumulate points while AceTrader asks “who knows what the rewards will be?”. No conversion, snapshot or redemption rules are published.</p>
            <small>No confirmed token or airdrop</small>
          </article>
        </div>
        <dl className={styles.rewardStatus}>
          <div><dt>Community draw</dt><dd>Live · monthly</dd></div>
          <div><dt>Points leaderboard</dt><dd>Live</dd></div>
          <div><dt>Future utility</dt><dd>Teased</dd></div>
          <div><dt>Referral rebates</dt><dd>Separate program</dd></div>
        </dl>
      </section>}

      {isChainFunded && <section className={`${styles.section} ${styles.rewardSection}`} id="rewards" {...cmsSection('rewards')}>
        <div className={styles.sectionHeading} {...cmsBlock('rewards', 'reward-facts')}>
          <span className={styles.eyebrow}>Protocol rewards</span>
          <InlineEditableText as="h2" value={copy('rewards.title', 'CFG governance and CFND liquidity rewards form a separate protocol layer.')} enabled={editMode} multiline onCommit={(value) => changeCopy('rewards.title', value)} />
          <InlineEditableText as="p" value={copy('rewards.description', factValue(firm.tokenRewards.description) ?? 'Reward details are not documented.')} enabled={editMode} multiline onCommit={(value) => changeCopy('rewards.description', value)} />
        </div>
        <div className={styles.rewardSplit} {...cmsBlock('rewards', 'reward-facts')}>
          <article className={styles.rewardDraw}>
            <span>Governance layer</span>
            <strong>100M CFG</strong>
            <h3>Fixed-supply governance token</h3>
            <p>The captured protocol material states that CFG has a fixed 100,000,000 supply with no future minting.</p>
            <small>Current utility should be rechecked after maintenance</small>
          </article>
          <article className={styles.rewardPoints}>
            <span>Liquidity and trader incentives</span>
            <strong>CFND</strong>
            <h3>Seasonal reward budgets</h3>
            <p>Registered challenge accounts and CFND liquidity providers are the documented participant groups.</p>
            <small>Campaign terms are time-sensitive</small>
          </article>
        </div>
        <dl className={styles.rewardStatus}>
          <div><dt>CFG supply</dt><dd>100,000,000 fixed</dd></div>
          <div><dt>CFND</dt><dd>Staked liquidity representation</dd></div>
          <div><dt>Trader eligibility</dt><dd>Challenge registration required</dd></div>
          <div><dt>Current status</dt><dd>Recheck after maintenance</dd></div>
        </dl>
      </section>}

      {hasStandardRewards && <section className={`${styles.section} ${styles.rewardSection}`} id="rewards" {...cmsSection('rewards')}>
        <div className={styles.sectionHeading} {...cmsBlock('rewards', 'reward-facts')}>
          <span className={styles.eyebrow}>Rewards layer</span>
          <InlineEditableText as="h2" value={copy('rewards.title', 'Additional rewards sit outside the core account economics.')} enabled={editMode} multiline onCommit={(value) => changeCopy('rewards.title', value)} />
          <InlineEditableText as="p" value={copy('rewards.description', factValue(firm.tokenRewards.description) ?? 'Reward details are not documented.')} enabled={editMode} multiline onCommit={(value) => changeCopy('rewards.description', value)} />
        </div>
        <div className={styles.considerList} {...cmsBlock('rewards', 'reward-facts')}>
          {(isFoxify ? [
            ['FOX', 'Fee buybacks and staking rewards are documented; dynamic APY is intentionally not treated as a stable fact.'],
            ['NFT', 'Silver and Gold NFTs add 10% and 25% funding when staked before activation.'],
            ['30%', 'Thirty percent of net trading fees is described as buying FOX for stakers.'],
            ['Live', 'Token contract and current platform integrations are linked in official documentation.'],
          ] : [
            ['Score', 'Legend Score is a lifetime reputation metric on the O2 platform.'],
            ['USDC', 'Trading competitions distribute USDC rather than an O2 token.'],
            ['Referral', 'Turbo referral tiers share a portion of referred opening premiums.'],
            ['ND', 'No proprietary token or confirmed airdrop is documented.'],
          ]).map(([label, description], index) => <article key={label}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{label}</h3><p>{description}</p></div></article>)}
        </div>
      </section>}

      {isSizeProp && <section className={styles.section} id="trust" {...cmsSection('trust')}>
        <div className={styles.sectionHeading} {...cmsBlock('trust', 'trust-facts')}>
          <span className={styles.eyebrow}>Trust and evidence</span>
          <InlineEditableText as="h2" value={copy('trust.title', 'Signals that help — and limits that remain.')} enabled={editMode} multiline onCommit={(value) => changeCopy('trust.title', value)} />
          <InlineEditableText as="p" value={copy('trust.description', 'Positive and negative evidence should be read together.')} enabled={editMode} multiline onCommit={(value) => changeCopy('trust.description', value)} />
        </div>
        <div className={styles.considerList} {...cmsBlock('trust', 'trust-facts')}>
          <article><span>+</span><div><h3>Positive signals</h3><p>Named founder, reported Igloo backing, readable rules, no consistency requirement and user-reported USDT payouts.</p></div></article>
          <article><span>!</span><div><h3>Material cautions</h3><p>Short history, discretionary reward language, changing rule versions and no independent payout ledger.</p></div></article>
          <article><span>4.3</span><div><h3>Small review sample</h3><p>Trustpilot was approximately 4.3–4.4 from roughly 43–45 reviews on 1–2 September 2026.</p></div></article>
          <article><span>C</span><div><h3>Recurring complaints</h3><p>Technical reliability and payout-processing delays appear more often than systematic denial claims.</p></div></article>
        </div>
      </section>}

      <section className={styles.sources} id="sources" {...cmsSection('sources')}>
        <div {...cmsBlock('sources', 'notebooklm-10')}>
          <span className={styles.eyebrow}>Research record</span>
          <h2>{sourceUrls.length} official sources inspected</h2>
          <p>Last reviewed {shortDate(researchProfile.checkedAt)}. Unknown values are grouped here instead of interrupting the main explanation.</p>
        </div>
        <div className={styles.sourceLinks} {...cmsBlock('sources', 'source-claims')}>
          {officialWebsite && <a href={officialWebsite} target="_blank" rel="noreferrer">Official website <ArrowUpRight /></a>}
          {supportingSourceUrls.map((url) => <a href={url} target="_blank" rel="noreferrer" key={url}>{sourceLabel(url)} <ArrowUpRight /></a>)}
        </div>
        <p className={styles.unknowns}><strong>Not documented in the current review:</strong> {copy('sources.unknowns', 'company founding date, headquarters, profit-day definition and points-program details.')}</p>
      </section>
    </div>
  );
}
