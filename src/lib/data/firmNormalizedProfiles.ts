import { PRIMARY_RESEARCH_BY_SLUG } from './firmPrimaryResearch.ts';
import { SOURCE_DISCREPANCIES_BY_SLUG } from './firmSourceDiscrepancies.ts';
import type {
  FirmNormalizedProfile,
  NormalizedChallengeProgram,
  NormalizedChallengeStage,
  NormalizedChallengeTier,
  NormalizedEvidence,
  NormalizedFact,
  PrimaryResearchField,
} from '@/types/database';

type Fact<T> = NormalizedFact<T>;
type Schedule = 'on-demand' | 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'conditional';
type Currency = 'USD' | 'USDC' | 'USDT' | 'BTC' | 'ETH' | 'SOL';
type ProgramKind = 'evaluation' | 'instant-funding' | 'collateralized' | 'competition' | 'progression';
type DrawdownType = 'static' | 'trailing-high-water-mark' | 'trailing-daily' | 'dynamic' | 'none';

interface FirmMeta {
  id: string;
  slug: string;
  name: string;
  website: string;
  xHandle: string;
}

const FIRM_META: FirmMeta[] = [
  { id: 'firm-propr', slug: 'propr', name: 'Propr', website: 'https://www.propr.xyz', xHandle: 'ProprXYZ' },
  { id: 'firm-foxify', slug: 'foxify', name: 'Foxify Trade', website: 'https://foxify.trade', xHandle: 'foxifytrade' },
  { id: 'firm-chainfunded', slug: 'chainfunded', name: 'ChainFunded', website: 'https://www.chainfunded.io', xHandle: 'chainfunded' },
  { id: 'firm-solanafunded', slug: 'solana-funded', name: 'Solana Funded', website: 'https://solanafunded.com', xHandle: 'solanafunded' },
  { id: 'firm-hypernova', slug: 'hypernova', name: 'Hypernova', website: 'https://hypernova.xyz', xHandle: 'HypernovaX' },
  { id: 'firm-polyquid', slug: 'polyquid', name: 'Polyquid', website: 'https://www.polyquid.xyz', xHandle: 'polyquid' },
  { id: 'firm-alphagrid', slug: 'alphagrid', name: 'AlphaGrid', website: 'https://alphagrid.capital', xHandle: 'AlphaGridProp' },
  { id: 'firm-hyperpnl', slug: 'hyperpnl', name: 'HyperPNL', website: 'https://hyperpnl.com', xHandle: 'HyperPNL' },
  { id: 'firm-dizso', slug: 'dizso', name: 'Dizso Funded', website: 'https://dizso.com', xHandle: 'dizsofunded' },
  { id: 'firm-hyrotrader', slug: 'hyrotrader', name: 'HyroTrader', website: 'https://hyrotrader.com', xHandle: 'hyrotrader_com' },
  { id: 'firm-o2', slug: 'o2', name: 'O2', website: 'https://o2.app', xHandle: 'o2dotapp' },
  { id: 'firm-carrot-funding', slug: 'carrot-funding', name: 'Carrot Funding', website: 'https://carrotfunding.io', xHandle: 'carrotfunding' },
  { id: 'firm-doji-funded', slug: 'doji-funded', name: 'Doji Funded', website: 'https://app.dojifunded.com', xHandle: 'Dojifunded' },
  { id: 'firm-hyper-stack', slug: 'hyper-stack', name: 'Hyper Stack', website: 'https://www.hyperstack.trade', xHandle: 'hyper_stack' },
  { id: 'firm-vanta-trading', slug: 'vanta-trading', name: 'Vanta Trading', website: 'https://www.vantatrading.io', xHandle: 'VantaTrading' },
  { id: 'firm-size', slug: 'size', name: 'Size', website: 'https://www.size.club', xHandle: 'sizedotclub' },
  { id: 'firm-breakout', slug: 'breakout', name: 'Breakout', website: 'https://www.breakoutprop.com', xHandle: 'breakoutprop' },
  { id: 'firm-funded-hive', slug: 'funded-hive', name: 'Funded Hive', website: 'https://fundedhive.com', xHandle: 'FundedHive' },
  { id: 'firm-klein-funding', slug: 'klein-funding', name: 'Klein Funding', website: 'https://kleinfunding.com', xHandle: 'KleinFunding' },
  { id: 'firm-cf-trader', slug: 'cf-trader', name: 'Crypto Fund Trader', website: 'https://cryptofundtrader.com', xHandle: 'CFTradercom' },
  { id: 'firm-upscale-trade', slug: 'upscale-trade', name: 'Upscale Trade', website: 'https://upscale.trade', xHandle: 'UpscaleTrade' },
];

function observations(slug: string, field: PrimaryResearchField) {
  const ledger = PRIMARY_RESEARCH_BY_SLUG[slug];
  if (!ledger) throw new Error(`Missing primary-research ledger for ${slug}.`);
  return ledger.observations.filter((observation) => observation.field === field);
}

function evidence(slug: string, field: PrimaryResearchField, sourceUrls?: string[]): NormalizedEvidence[] {
  const selected = observations(slug, field).filter(
    (observation) => !sourceUrls || sourceUrls.includes(observation.sourceUrl),
  );
  const unique = new Map<string, NormalizedEvidence>();
  for (const observation of selected) {
    const key = `${observation.sourceUrl}|${observation.checkedAt}`;
    unique.set(key, {
      sourceUrl: observation.sourceUrl,
      checkedAt: observation.checkedAt,
      ...(observation.notes ? { notes: observation.notes } : {}),
    });
  }
  return [...unique.values()];
}

function reported<T>(slug: string, field: PrimaryResearchField, value: T, sourceUrls?: string[]): Fact<T> {
  const factEvidence = evidence(slug, field, sourceUrls);
  if (!factEvidence.length) throw new Error(`Missing evidence for ${slug}.${field}.`);
  return { status: 'reported', value, evidence: factEvidence };
}

function verified<T>(slug: string, field: PrimaryResearchField, value: T): Fact<T> {
  const factEvidence = evidence(slug, field);
  if (!factEvidence.length) throw new Error(`Missing evidence for ${slug}.${field}.`);
  return { status: 'verified', value, evidence: factEvidence };
}

function nd<T>(slug: string, field: PrimaryResearchField, notes = 'ND: not documented in the inspected official sources.'): Fact<T> {
  return { status: 'ND', value: 'ND', evidence: evidence(slug, field), notes };
}

function stage(
  slug: string,
  name: string,
  values: { target?: number; minimumDays?: number; durationDays?: number; funded?: boolean; sourceUrls?: string[] } = {},
): NormalizedChallengeStage {
  return {
    name,
    profitTargetPercent: values.target === undefined ? nd(slug, 'rulebook') : reported(slug, 'rulebook', values.target, values.sourceUrls),
    minimumTradingDays: values.minimumDays === undefined ? nd(slug, 'rulebook') : reported(slug, 'rulebook', values.minimumDays, values.sourceUrls),
    durationDays: values.durationDays === undefined ? nd(slug, 'rulebook') : reported(slug, 'rulebook', values.durationDays, values.sourceUrls),
    funded: values.funded === undefined ? nd(slug, 'rulebook') : reported(slug, 'rulebook', values.funded, values.sourceUrls),
  };
}

function tier(
  slug: string,
  accountSize: number,
  fee?: number,
  currency: 'USD' | 'USDC' | 'USDT' | 'SOL' = 'USD',
  available = true,
  originalFee?: number,
  sourceUrls?: string[],
): NormalizedChallengeTier {
  return {
    accountSize: reported(slug, 'pricingCheckout', accountSize, sourceUrls),
    fee: fee === undefined ? nd(slug, 'pricingCheckout') : reported(slug, 'pricingCheckout', fee, sourceUrls),
    originalFee: originalFee === undefined ? nd(slug, 'pricingCheckout') : reported(slug, 'pricingCheckout', originalFee, sourceUrls),
    currency: reported(slug, 'pricingCheckout', currency, sourceUrls),
    available: reported(slug, 'pricingCheckout', available, sourceUrls),
  };
}

function program(
  slug: string,
  id: string,
  name: string,
  values: {
    kind?: ProgramKind;
    stages?: NormalizedChallengeStage[];
    tiers?: NormalizedChallengeTier[];
    dailyLoss?: number | 'none';
    maxDrawdown?: number;
    maxDrawdownType?: DrawdownType;
    split?: number;
    refundable?: boolean;
    noTimeLimit?: boolean;
    notes?: string;
  } = {},
): NormalizedChallengeProgram {
  return {
    id,
    name,
    kind: values.kind ? reported(slug, 'rulebook', values.kind) : nd(slug, 'rulebook'),
    stages: values.stages ? reported(slug, 'rulebook', values.stages) : nd(slug, 'rulebook'),
    tiers: values.tiers ? reported(slug, 'pricingCheckout', values.tiers) : nd(slug, 'pricingCheckout'),
    dailyLossPercent: values.dailyLoss === undefined || values.dailyLoss === 'none'
      ? nd(slug, 'rulebook', values.dailyLoss === 'none' ? 'The source reports no daily loss limit; a numeric percent is not applicable.' : undefined)
      : reported<number>(slug, 'rulebook', values.dailyLoss),
    maxDrawdownPercent: values.maxDrawdown === undefined ? nd(slug, 'rulebook') : reported<number>(slug, 'rulebook', values.maxDrawdown),
    maxDrawdownType: values.maxDrawdownType ? reported(slug, 'rulebook', values.maxDrawdownType) : nd(slug, 'rulebook'),
    fundedProfitSplitPercent: values.split === undefined ? nd(slug, 'payoutPolicy') : reported(slug, 'payoutPolicy', values.split),
    feeRefundable: values.refundable === undefined ? nd(slug, 'pricingCheckout') : reported(slug, 'pricingCheckout', values.refundable),
    noTimeLimit: values.noTimeLimit === undefined ? nd(slug, 'rulebook') : reported(slug, 'rulebook', values.noTimeLimit),
    notes: values.notes ? reported(slug, 'rulebook', values.notes) : nd(slug, 'rulebook'),
  };
}

interface ProfileValues {
  summary?: Partial<Record<keyof FirmNormalizedProfile['summary'], Fact<never> | unknown>>;
  programs?: NormalizedChallengeProgram[];
  payout?: Partial<Record<keyof FirmNormalizedProfile['payoutPolicy'], Fact<never> | unknown>>;
  trading?: Partial<Record<keyof FirmNormalizedProfile['tradingPolicy'], Fact<never> | unknown>>;
  execution?: Partial<Record<keyof FirmNormalizedProfile['executionPolicy'], Fact<never> | unknown>>;
  compliance?: Partial<Record<keyof FirmNormalizedProfile['compliancePolicy'], Fact<never> | unknown>>;
  token?: Partial<Record<keyof FirmNormalizedProfile['tokenRewards'], Fact<never> | unknown>>;
}

const isFact = (value: unknown): value is Fact<unknown> => Boolean(
  value && typeof value === 'object' && 'status' in value && 'value' in value,
);

function factOr<T>(value: unknown, fallback: Fact<T>): Fact<T> {
  return (isFact(value) ? value : fallback) as Fact<T>;
}

function buildProfile(meta: FirmMeta, values: ProfileValues): FirmNormalizedProfile {
  const slug = meta.slug;
  const checkedAt = PRIMARY_RESEARCH_BY_SLUG[slug].checkedAt;
  const profile: FirmNormalizedProfile = {
    version: 1,
    methodology: 'primary-sources-only',
    id: meta.id,
    slug,
    name: meta.name,
    checkedAt,
    identity: {
      officialWebsite: observations(slug, 'officialWebsite')[0]?.status === 'verified'
        ? verified(slug, 'officialWebsite', meta.website)
        : reported(slug, 'officialWebsite', meta.website),
      xHandle: observations(slug, 'officialWebsite')[0]?.status === 'verified'
        ? verified(slug, 'officialWebsite', `@${meta.xHandle}`)
        : reported(slug, 'officialWebsite', `@${meta.xHandle}`),
      logo: nd(slug, 'officialWebsite'),
      tagline: nd(slug, 'officialWebsite'),
      description: nd(slug, 'officialWebsite'),
    },
    summary: {
      profitSplit: factOr(values.summary?.profitSplit, nd(slug, 'payoutPolicy')),
      maxDrawdown: factOr(values.summary?.maxDrawdown, nd(slug, 'rulebook')),
      dailyDrawdown: factOr(values.summary?.dailyDrawdown, nd(slug, 'rulebook')),
      profitTarget: factOr(values.summary?.profitTarget, nd(slug, 'rulebook')),
      minCapital: factOr(values.summary?.minCapital, nd(slug, 'pricingCheckout')),
      maxCapital: factOr(values.summary?.maxCapital, nd(slug, 'pricingCheckout')),
      cryptoLeverage: factOr(values.summary?.cryptoLeverage, nd(slug, 'rulebook')),
      payoutFrequency: factOr(values.summary?.payoutFrequency, nd(slug, 'payoutPolicy')),
    },
    challengePrograms: values.programs
      ? reported(slug, 'rulebook', values.programs)
      : nd(slug, 'rulebook'),
    payoutPolicy: {
      schedule: factOr(values.payout?.schedule, nd(slug, 'payoutPolicy')),
      profitSplitPercent: factOr(values.payout?.profitSplitPercent, nd(slug, 'payoutPolicy')),
      minimumAmount: factOr(values.payout?.minimumAmount, nd(slug, 'payoutPolicy')),
      currencies: factOr(values.payout?.currencies, nd(slug, 'payoutPolicy')),
      processingTimeHours: factOr(values.payout?.processingTimeHours, nd(slug, 'payoutPolicy')),
      positionsMustBeClosed: factOr(values.payout?.positionsMustBeClosed, nd(slug, 'payoutPolicy')),
      partialWithdrawalsAllowed: factOr(values.payout?.partialWithdrawalsAllowed, nd(slug, 'payoutPolicy')),
      payoutResetsBalance: factOr(values.payout?.payoutResetsBalance, nd(slug, 'payoutPolicy')),
      notes: factOr(values.payout?.notes, nd(slug, 'payoutPolicy')),
    },
    tradingPolicy: {
      platforms: factOr(values.trading?.platforms, nd(slug, 'rulebook')),
      markets: factOr(values.trading?.markets, nd(slug, 'rulebook')),
      leverage: factOr(values.trading?.leverage, nd(slug, 'rulebook')),
      consistencyRule: factOr(values.trading?.consistencyRule, nd(slug, 'rulebook')),
      profitDayDefinition: factOr(values.trading?.profitDayDefinition, nd(slug, 'rulebook')),
      newsTrading: factOr(values.trading?.newsTrading, nd(slug, 'rulebook')),
      weekendHolding: factOr(values.trading?.weekendHolding, nd(slug, 'rulebook')),
      automatedTrading: factOr(values.trading?.automatedTrading, nd(slug, 'rulebook')),
      copyTrading: factOr(values.trading?.copyTrading, nd(slug, 'rulebook')),
      mandatoryStopLoss: factOr(values.trading?.mandatoryStopLoss, nd(slug, 'rulebook')),
      tradingFees: factOr(values.trading?.tradingFees, nd(slug, 'rulebook')),
    },
    executionPolicy: {
      model: factOr(values.execution?.model, nd(slug, 'terms')),
      venue: factOr(values.execution?.venue, nd(slug, 'terms')),
      onchainSettlement: factOr(values.execution?.onchainSettlement, nd(slug, 'terms')),
      notes: factOr(values.execution?.notes, nd(slug, 'terms')),
    },
    compliancePolicy: {
      legalEntity: factOr(values.compliance?.legalEntity, nd(slug, 'terms')),
      registrationJurisdiction: factOr(values.compliance?.registrationJurisdiction, nd(slug, 'terms')),
      regulatoryStatus: factOr(values.compliance?.regulatoryStatus, nd(slug, 'terms')),
      kycRequiredAt: factOr(values.compliance?.kycRequiredAt, nd(slug, 'terms')),
      restrictedJurisdictions: factOr(values.compliance?.restrictedJurisdictions, nd(slug, 'terms')),
      maximumAggregateFundedBalance: factOr(values.compliance?.maximumAggregateFundedBalance, nd(slug, 'terms')),
      simulatedAccounts: factOr(values.compliance?.simulatedAccounts, nd(slug, 'terms')),
    },
    tokenRewards: {
      hasToken: factOr(values.token?.hasToken, nd(slug, 'tokenRewards')),
      tokenTicker: factOr(values.token?.tokenTicker, nd(slug, 'tokenRewards')),
      tokenSupply: factOr(values.token?.tokenSupply, nd(slug, 'tokenRewards')),
      hasPoints: factOr(values.token?.hasPoints, nd(slug, 'tokenRewards')),
      pointsProgramName: factOr(values.token?.pointsProgramName, nd(slug, 'tokenRewards')),
      hasAirdrop: factOr(values.token?.hasAirdrop, nd(slug, 'tokenRewards')),
      airdropStatus: factOr(values.token?.airdropStatus, nd(slug, 'tokenRewards')),
      description: factOr(values.token?.description, nd(slug, 'tokenRewards')),
    },
    company: {
      yearEstablished: nd(slug, 'terms'),
      headquarters: nd(slug, 'terms'),
    },
    sourceDiscrepancies: SOURCE_DISCREPANCIES_BY_SLUG[slug] ?? [],
    claims: PRIMARY_RESEARCH_BY_SLUG[slug].observations,
    ndFields: [],
  };
  profile.ndFields = collectNDFields(profile);
  return profile;
}

function collectNDFields(value: unknown, path = ''): string[] {
  if (!value || typeof value !== 'object') return [];
  if ('status' in value && 'value' in value) {
    const fact = value as Fact<unknown>;
    return fact.status === 'ND' ? [path] : [];
  }
  return Object.entries(value as Record<string, unknown>)
    .filter(([key]) => !['claims', 'ndFields'].includes(key))
    .flatMap(([key, item]) => collectNDFields(item, path ? `${path}.${key}` : key));
}

function tierMatrix(
  slug: string,
  sizes: number[],
  fees: Array<number | undefined>,
  currency: 'USD' | 'USDC' | 'USDT' | 'SOL' = 'USD',
  available = true,
): NormalizedChallengeTier[] {
  return sizes.map((size, index) => tier(slug, size, fees[index], currency, available));
}

const configs: Record<string, ProfileValues> = {
  propr: {
    summary: {
      profitSplit: reported('propr', 'payoutPolicy', '80%'),
      maxDrawdown: reported('propr', 'rulebook', '3–8%, program-dependent'),
      dailyDrawdown: reported('propr', 'rulebook', '3–5%, program-dependent'),
      profitTarget: reported('propr', 'rulebook', '5–10%, stage-dependent'),
      minCapital: reported('propr', 'pricingCheckout', 5_000),
      maxCapital: reported('propr', 'pricingCheckout', 100_000),
      cryptoLeverage: reported('propr', 'rulebook', '2x–25x, market-dependent'),
      payoutFrequency: reported('propr', 'payoutPolicy', 'On demand; stated processing within 24 hours'),
    },
    programs: [
      program('propr', 'classic-1-step', 'Classic 1-Step', {
        kind: 'evaluation', stages: [stage('propr', 'Evaluation', { target: 10 })],
        tiers: tierMatrix('propr', [5_000, 10_000, 25_000, 50_000, 100_000], [60, 110, 275, 495, 999]),
        dailyLoss: 3, maxDrawdown: 6, maxDrawdownType: 'static', split: 80, refundable: false, noTimeLimit: true,
      }),
      program('propr', 'turbo-1-step', 'Turbo 1-Step', {
        kind: 'evaluation', stages: [stage('propr', 'Evaluation', { target: 9 })],
        tiers: tierMatrix('propr', [5_000, 10_000, 25_000, 50_000, 100_000], [25, 50, 125, 245, 450]),
        dailyLoss: 3, maxDrawdown: 3, maxDrawdownType: 'static', split: 80, refundable: false, noTimeLimit: true,
      }),
      program('propr', 'classic-2-step', 'Classic 2-Step', {
        kind: 'evaluation', stages: [stage('propr', 'Phase 1', { target: 5 }), stage('propr', 'Phase 2', { target: 10 })],
        tiers: tierMatrix('propr', [5_000, 10_000, 25_000, 50_000, 100_000], [50, 100, 250, 450, 749]),
        dailyLoss: 5, maxDrawdown: 8, maxDrawdownType: 'trailing-high-water-mark', split: 80, refundable: false, noTimeLimit: true,
      }),
    ],
    payout: {
      schedule: reported('propr', 'payoutPolicy', 'on-demand' satisfies Schedule), profitSplitPercent: reported('propr', 'payoutPolicy', 80),
      minimumAmount: reported('propr', 'payoutPolicy', 20), currencies: reported('propr', 'payoutPolicy', ['USDC'] satisfies Currency[]),
      processingTimeHours: reported('propr', 'payoutPolicy', 24), positionsMustBeClosed: reported('propr', 'payoutPolicy', true),
      partialWithdrawalsAllowed: reported('propr', 'payoutPolicy', false), payoutResetsBalance: reported('propr', 'payoutPolicy', true),
      notes: reported('propr', 'payoutPolicy', 'Full-balance USDC payout on demand.'),
    },
    trading: {
      platforms: reported('propr', 'rulebook', ['Hyperliquid', 'Propr terminal']),
      markets: reported('propr', 'rulebook', ['Cryptocurrency perpetual futures']),
      leverage: reported('propr', 'rulebook', ['BTC/ETH 25x', 'Major alts 10x', 'Other markets 2x–5x']),
      consistencyRule: reported('propr', 'rulebook', 'none'), newsTrading: reported('propr', 'rulebook', 'allowed'),
      weekendHolding: reported('propr', 'rulebook', 'allowed'), automatedTrading: reported('propr', 'rulebook', 'allowed'),
      copyTrading: reported('propr', 'rulebook', 'allowed'), mandatoryStopLoss: reported('propr', 'rulebook', false),
      tradingFees: reported('propr', 'rulebook', 'Hyperliquid trading and funding fees apply.'),
    },
    execution: {
      model: reported('propr', 'terms', 'hybrid'), venue: reported('propr', 'terms', 'Hyperliquid'),
      onchainSettlement: reported('propr', 'terms', true), notes: reported('propr', 'terms', 'Evaluation accounts are simulated; qualifying flow can be routed on-chain.'),
    },
    compliance: {
      legalEntity: reported('propr', 'terms', 'Propr Limited'), registrationJurisdiction: reported('propr', 'terms', 'British Virgin Islands'),
      regulatoryStatus: reported('propr', 'terms', 'Not a regulated broker or investment service'),
      kycRequiredAt: reported('propr', 'terms', 'funded-activation'),
      restrictedJurisdictions: reported('propr', 'terms', ['United States and other rulebook-listed jurisdictions']),
      maximumAggregateFundedBalance: reported('propr', 'terms', 300_000), simulatedAccounts: reported('propr', 'terms', true),
    },
    token: {
      hasToken: reported('propr', 'tokenRewards', true), tokenTicker: reported('propr', 'tokenRewards', '$PROPR'),
      tokenSupply: reported('propr', 'tokenRewards', 1_000_000_000), hasPoints: nd('propr', 'tokenRewards'),
      pointsProgramName: nd('propr', 'tokenRewards'), hasAirdrop: reported('propr', 'tokenRewards', true),
      airdropStatus: reported('propr', 'tokenRewards', 'confirmed'),
      description: reported('propr', 'tokenRewards', 'Fixed supply; 13% allocation reported for XBG stakers. Challenge-trader eligibility is ND.'),
    },
  },

  foxify: {
    summary: {
      profitSplit: reported('foxify', 'payoutPolicy', '80% manual / 70% automated beta'),
      maxDrawdown: reported('foxify', 'rulebook', 'Fixed from initial funded balance; percentage varies by track and level'),
      profitTarget: reported('foxify', 'rulebook', '100 points plus at least 15% P&L'), minCapital: reported('foxify', 'pricingCheckout', 500),
      maxCapital: reported('foxify', 'pricingCheckout', 10_000, ['https://docs.foxify.trade/']), payoutFrequency: reported('foxify', 'payoutPolicy', 'Conditional; instant after points and profit targets'),
    },
    programs: [
      program('foxify', 'entry', 'Entry', { kind: 'collateralized', stages: [stage('foxify', 'Funded', { funded: true, minimumDays: 1, sourceUrls: ['https://docs.foxify.trade/'] })], tiers: [tier('foxify', 500, 100, 'USDC')], split: 80, notes: '$100 collateral deposit for $500 starting funding; consolidated documentation is canonical for the one-day minimum.' }),
      program('foxify', 'pro', 'Pro', { kind: 'collateralized', stages: [stage('foxify', 'Funded', { funded: true, minimumDays: 1, sourceUrls: ['https://docs.foxify.trade/'] })], tiers: [tier('foxify', 2_500, 500, 'USDC'), ...tierMatrix('foxify', [5_000, 7_500, 10_000], [undefined, undefined, undefined], 'USDC')], split: 80, notes: 'Scales from $2,500 through $5,000, $7,500 and $10,000; consolidated documentation is canonical for the one-day minimum.' }),
    ],
    payout: { schedule: reported('foxify', 'payoutPolicy', 'conditional'), profitSplitPercent: reported('foxify', 'payoutPolicy', 80), currencies: reported('foxify', 'payoutPolicy', ['USDC']), notes: reported('foxify', 'payoutPolicy', 'Instant smart-contract settlement after eligibility; automated beta uses 70%.') },
    execution: { onchainSettlement: reported('foxify', 'payoutPolicy', true), notes: reported('foxify', 'payoutPolicy', 'USDC smart-contract execution.') },
    compliance: { kycRequiredAt: reported('foxify', 'rulebook', 'not-required') },
    token: { hasToken: reported('foxify', 'tokenRewards', true), tokenTicker: reported('foxify', 'tokenRewards', 'FOX'), hasPoints: reported('foxify', 'rulebook', true), pointsProgramName: reported('foxify', 'rulebook', 'FOXIFY promotion points'), description: reported('foxify', 'tokenRewards', 'Deflationary utility token; 30% of net fees buy FOX for stakers. Silver/Gold NFTs add 10%/25% funding.') },
  },

  chainfunded: {
    summary: { profitSplit: reported('chainfunded', 'payoutPolicy', '80%'), maxDrawdown: reported('chainfunded', 'rulebook', '10%'), dailyDrawdown: reported('chainfunded', 'rulebook', '5%'), profitTarget: reported('chainfunded', 'rulebook', '10% / 5%'), minCapital: reported('chainfunded', 'pricingCheckout', 1_000), maxCapital: reported('chainfunded', 'pricingCheckout', 200_000), payoutFrequency: reported('chainfunded', 'payoutPolicy', 'Conditional request; settlement stated in seconds') },
    programs: [program('chainfunded', 'two-phase', 'Two-Phase Evaluation', { kind: 'evaluation', stages: [stage('chainfunded', 'Phase 1', { target: 10, minimumDays: 4 }), stage('chainfunded', 'Phase 2', { target: 5, minimumDays: 4 })], dailyLoss: 5, maxDrawdown: 10, split: 80, notes: 'Published account range is $1K–$200K; exact tier matrix is ND.' })],
    payout: { schedule: reported('chainfunded', 'payoutPolicy', 'conditional'), profitSplitPercent: reported('chainfunded', 'payoutPolicy', 80), currencies: reported('chainfunded', 'payoutPolicy', ['USDC']), notes: reported('chainfunded', 'payoutPolicy', 'Signed performance proof; Ethereum smart contract transfers USDC from the LP pool.') },
    execution: { venue: reported('chainfunded', 'payoutPolicy', 'Ethereum'), onchainSettlement: reported('chainfunded', 'payoutPolicy', true), notes: reported('chainfunded', 'rulebook', 'Challenge rules are fixed in a smart contract at registration.') },
    compliance: { legalEntity: reported('chainfunded', 'terms', 'MZF Protocol Inc., trading as ChainFunded Labs'), registrationJurisdiction: reported('chainfunded', 'terms', 'Panama') },
    token: { hasToken: reported('chainfunded', 'tokenRewards', true), tokenTicker: reported('chainfunded', 'tokenRewards', 'CFG'), tokenSupply: reported('chainfunded', 'tokenRewards', 100_000_000), description: reported('chainfunded', 'tokenRewards', 'Fixed-supply governance token; seasonal rewards for registered challenge accounts and staked CFND liquidity tokens.') },
  },

  'solana-funded': {
    summary: { profitSplit: reported('solana-funded', 'payoutPolicy', '80% standard; up to 90% with add-on', ['https://docs.solanafunded.com/account-rules/payout-rules-funded-accounts/payout-cycles']), maxDrawdown: reported('solana-funded', 'rulebook', '20–25% for documented 1-Step paths; 2-Step ND'), dailyDrawdown: reported('solana-funded', 'rulebook', '10% for documented 1-Step paths; 2-Step ND'), profitTarget: reported('solana-funded', 'rulebook', '45–50% 1-Step; 30%/20% or 35%/25% 2-Step'), minCapital: reported('solana-funded', 'pricingCheckout', 2_500), maxCapital: reported('solana-funded', 'terms', 100_000), payoutFrequency: reported('solana-funded', 'payoutPolicy', 'First payout after 21 days, then every 14 days; 7-day add-on available', ['https://docs.solanafunded.com/account-rules/payout-rules-funded-accounts/payout-cycles']) },
    programs: [
      program('solana-funded', 'one-step-standard', '1-Step Standard', { kind: 'evaluation', stages: [stage('solana-funded', 'Evaluation', { target: 45, minimumDays: 5 })], dailyLoss: 10, maxDrawdown: 25, notes: 'Five-position requirement.' }),
      program('solana-funded', 'one-step-elite', '1-Step Elite', { kind: 'evaluation', stages: [stage('solana-funded', 'Evaluation', { target: 50, minimumDays: 5 })], dailyLoss: 10, maxDrawdown: 20, notes: 'Unlimited positions.' }),
      program('solana-funded', 'two-step-standard', '2-Step Standard', { kind: 'evaluation', stages: [stage('solana-funded', 'Phase 1', { target: 30 }), stage('solana-funded', 'Phase 2', { target: 20 })] }),
      program('solana-funded', 'two-step-elite', '2-Step Elite', { kind: 'evaluation', stages: [stage('solana-funded', 'Phase 1', { target: 35 }), stage('solana-funded', 'Phase 2', { target: 25 })] }),
    ],
    payout: { schedule: reported('solana-funded', 'payoutPolicy', 'bi-weekly', ['https://docs.solanafunded.com/account-rules/payout-rules-funded-accounts/payout-cycles']), profitSplitPercent: reported('solana-funded', 'payoutPolicy', 80, ['https://docs.solanafunded.com/account-rules/payout-rules-funded-accounts/payout-cycles']), currencies: reported('solana-funded', 'payoutPolicy', ['SOL', 'USDC']), notes: reported('solana-funded', 'payoutPolicy', 'Account rules define 80% standard, first payout after 21 days and then every 14 days; paid add-ons can change split and cycle.', ['https://docs.solanafunded.com/account-rules/payout-rules-funded-accounts/payout-cycles']) },
    execution: { model: reported('solana-funded', 'terms', 'simulated', ['https://solanafunded.com/terms-of-service']), notes: reported('solana-funded', 'terms', 'Terms state evaluations and platform trading are simulated; payout settlement can still use SOL or USDC.', ['https://solanafunded.com/terms-of-service']) },
    compliance: { legalEntity: reported('solana-funded', 'terms', 'SolaraX Markets'), simulatedAccounts: reported('solana-funded', 'terms', true, ['https://solanafunded.com/terms-of-service']) },
    token: { hasPoints: reported('solana-funded', 'tokenRewards', true), pointsProgramName: reported('solana-funded', 'tokenRewards', 'SF Points'), description: reported('solana-funded', 'tokenRewards', 'Non-transferable points with no cash value; creator rewards use USDC/SOL bounties and funded-account prizes.') },
  },

  hypernova: {
    summary: { profitSplit: reported('hypernova', 'payoutPolicy', '80%'), maxDrawdown: reported('hypernova', 'rulebook', '3–8% static by risk tier'), dailyDrawdown: reported('hypernova', 'rulebook', '3–5% by risk tier'), profitTarget: reported('hypernova', 'rulebook', '9–10%'), minCapital: reported('hypernova', 'pricingCheckout', 5_000), maxCapital: reported('hypernova', 'pricingCheckout', 200_000), payoutFrequency: reported('hypernova', 'payoutPolicy', 'On-demand, 24/7') },
    programs: [
      program('hypernova', 'tight', 'Tight Risk', { kind: 'evaluation', stages: [stage('hypernova', 'Evaluation', { target: 9 })], tiers: [tier('hypernova', 25_000, 120)], dailyLoss: 3, maxDrawdown: 3, maxDrawdownType: 'static', split: 80 }),
      program('hypernova', 'low', 'Low Risk', { kind: 'evaluation', stages: [stage('hypernova', 'Evaluation', { target: 10 })], tiers: [tier('hypernova', 25_000, 280, 'USD', true, undefined, ['https://hypernova.xyz/rulebook'])], dailyLoss: 3, maxDrawdown: 6, maxDrawdownType: 'static', split: 80, notes: 'Rulebook v1.1 is canonical for the $25K fee ($280); the homepage $275 card is retained as a resolved discrepancy.' }),
      program('hypernova', 'medium', 'Medium Risk', { kind: 'evaluation', stages: [stage('hypernova', 'Evaluation', { target: 10 })], tiers: [tier('hypernova', 25_000, 365)], dailyLoss: 4, maxDrawdown: 7, maxDrawdownType: 'static', split: 80 }),
      program('hypernova', 'high', 'High Risk', { kind: 'evaluation', stages: [stage('hypernova', 'Evaluation', { target: 10 })], dailyLoss: 5, maxDrawdown: 8, maxDrawdownType: 'static', split: 80, notes: 'Restricted tier.' }),
    ],
    payout: { schedule: reported('hypernova', 'payoutPolicy', 'on-demand'), profitSplitPercent: reported('hypernova', 'payoutPolicy', 80), currencies: reported('hypernova', 'payoutPolicy', ['USDC']), notes: reported('hypernova', 'payoutPolicy', 'Rulebook reports average processing under 0.02 seconds; the exact value is kept as text rather than converted into an invented hour value.', ['https://hypernova.xyz/rulebook']) },
    execution: { model: reported('hypernova', 'terms', 'simulated'), onchainSettlement: reported('hypernova', 'payoutPolicy', true) },
    compliance: { legalEntity: reported('hypernova', 'terms', 'Hypernova Systems'), registrationJurisdiction: reported('hypernova', 'terms', 'Cayman Islands'), regulatoryStatus: reported('hypernova', 'terms', 'Not a brokerage, investment or custodial account'), simulatedAccounts: reported('hypernova', 'terms', true) },
    token: { description: reported('hypernova', 'tokenRewards', 'Monthly cash grants, additional funding and priority feature access are reported; token, points and airdrop are ND.') },
  },

  polyquid: {
    execution: { venue: reported('polyquid', 'officialWebsite', 'Hyperliquid and Polymarket (marketing statement)'), notes: reported('polyquid', 'officialWebsite', 'Official site positioning says one challenge and every market; rules and mechanics are ND.') },
  },

  alphagrid: {
    summary: { profitSplit: reported('alphagrid', 'payoutPolicy', '70–80%, exact value determined by vault policy'), maxDrawdown: reported('alphagrid', 'rulebook', '15% Challenge / 12% Funded / 10% Prime'), dailyDrawdown: reported('alphagrid', 'rulebook', '5% / 4% / 3% realized loss'), minCapital: reported('alphagrid', 'pricingCheckout', 10_000), maxCapital: reported('alphagrid', 'pricingCheckout', 100_000) },
    programs: [program('alphagrid', 'lifecycle', 'Challenge → Funded → Prime', { kind: 'progression', stages: [stage('alphagrid', 'Challenge', { durationDays: 14 }), stage('alphagrid', 'Funded', { durationDays: 30, funded: true }), stage('alphagrid', 'Prime', { funded: true })], dailyLoss: 5, maxDrawdown: 15, maxDrawdownType: 'dynamic', notes: 'Challenge is simulated $10K; Funded real $50K; Prime real $100K. Progression uses trade counts and scores, not documented profit targets.' })],
    execution: { model: reported('alphagrid', 'rulebook', 'hybrid'), notes: reported('alphagrid', 'rulebook', 'Challenge is simulated; Funded and Prime are described as real-capital stages.') },
  },

  hyperpnl: {
    summary: { profitSplit: reported('hyperpnl', 'payoutPolicy', '80%'), maxDrawdown: reported('hyperpnl', 'rulebook', '9% static', ['https://hyperpnl.gitbook.io/docs/challenges-101/evaluation-rules']), dailyDrawdown: reported('hyperpnl', 'rulebook', '5%', ['https://hyperpnl.gitbook.io/docs/challenges-101/evaluation-rules']), profitTarget: reported('hyperpnl', 'rulebook', '10% then 5%', ['https://hyperpnl.gitbook.io/docs/challenges-101/evaluation-rules']), minCapital: reported('hyperpnl', 'pricingCheckout', 5_000), maxCapital: reported('hyperpnl', 'pricingCheckout', 25_000), payoutFrequency: reported('hyperpnl', 'payoutPolicy', 'Daily/on-demand; maximum one request per day') },
    programs: [program('hyperpnl', 'two-phase', 'Two-Phase Evaluation', { kind: 'evaluation', stages: [stage('hyperpnl', 'Phase 1', { target: 10, minimumDays: 2 }), stage('hyperpnl', 'Phase 2', { target: 5, minimumDays: 3 })], tiers: tierMatrix('hyperpnl', [5_000, 10_000, 25_000], [42, 86, 215]), dailyLoss: 5, maxDrawdown: 9, maxDrawdownType: 'static', split: 80, notes: 'Canonical structure follows the official GitBook evaluation rules.' })],
    payout: { schedule: reported('hyperpnl', 'payoutPolicy', 'daily'), profitSplitPercent: reported('hyperpnl', 'payoutPolicy', 80), positionsMustBeClosed: reported('hyperpnl', 'payoutPolicy', true), notes: reported('hyperpnl', 'payoutPolicy', 'Processing is reported as under three seconds, which is not stored as an invented exact hour value. Minimum is 1% of account size, not a fixed amount; on-chain currency is ND.') },
    trading: { copyTrading: reported('hyperpnl', 'rulebook', 'restricted', ['https://hyperpnl.gitbook.io/docs/challenges-101/evaluation-rules']) },
  },

  dizso: {
    summary: { profitSplit: reported('dizso', 'officialWebsite', 'Up to 80% — marketing statement only') },
  },

  hyrotrader: {
    summary: { profitSplit: reported('hyrotrader', 'payoutPolicy', '80% starting; increases by 5 points every four months to 90%', ['https://www.hyrotrader.com/faq/hyrotrader-account/how-can-i-withdraw-my-profits/']), maxDrawdown: reported('hyrotrader', 'rulebook', '6% for 1-Step; 2-Step ND'), dailyDrawdown: reported('hyrotrader', 'rulebook', '4% 1-Step / 5% 2-Step'), profitTarget: reported('hyrotrader', 'rulebook', '10% 1-Step / 10% then 5% 2-Step'), minCapital: reported('hyrotrader', 'pricingCheckout', 5_000), maxCapital: reported('hyrotrader', 'pricingCheckout', 200_000), payoutFrequency: reported('hyrotrader', 'payoutPolicy', 'On demand from the first funded trading day') },
    programs: [
      program('hyrotrader', 'one-step', 'One-Step', { kind: 'evaluation', stages: [stage('hyrotrader', 'Evaluation', { target: 10, minimumDays: 5 })], dailyLoss: 4, maxDrawdown: 6, split: 80, refundable: true, noTimeLimit: true }),
      program('hyrotrader', 'two-step', 'Two-Step', { kind: 'evaluation', stages: [stage('hyrotrader', 'Phase 1', { target: 10 }), stage('hyrotrader', 'Phase 2', { target: 5 })], tiers: tierMatrix('hyrotrader', [5_000, 10_000, 25_000, 50_000, 100_000, 200_000], [59, 119, 249, 379, 579, 969]), dailyLoss: 5, split: 80, refundable: true, noTimeLimit: true }),
    ],
    payout: { schedule: reported('hyrotrader', 'payoutPolicy', 'on-demand'), profitSplitPercent: reported('hyrotrader', 'payoutPolicy', 80, ['https://www.hyrotrader.com/faq/hyrotrader-account/how-can-i-withdraw-my-profits/']), minimumAmount: reported('hyrotrader', 'payoutPolicy', 100), currencies: reported('hyrotrader', 'payoutPolicy', ['USDT', 'USDC']), notes: reported('hyrotrader', 'payoutPolicy', 'The dedicated payout FAQ is canonical: 80% starting split, scaling to 90%; stated processing is 12–24 hours with no withdrawal commission.', ['https://www.hyrotrader.com/faq/hyrotrader-account/how-can-i-withdraw-my-profits/']) },
    trading: { consistencyRule: reported('hyrotrader', 'rulebook', 'applies'), tradingFees: reported('hyrotrader', 'rulebook', '40% best-day contribution and 3% maximum realized loss per trade; martingale and cross-account hedging prohibited.') },
    execution: { model: reported('hyrotrader', 'terms', 'simulated'), notes: reported('hyrotrader', 'terms', 'Challenge and verification trading are simulated.') },
    compliance: { legalEntity: reported('hyrotrader', 'terms', 'Hyro Finance, j. s. a. and Hyro Trading s. r. o.'), simulatedAccounts: reported('hyrotrader', 'terms', true) },
    token: { hasToken: reported('hyrotrader', 'tokenRewards', true), tokenTicker: reported('hyrotrader', 'tokenRewards', '$HYRO'), tokenSupply: reported('hyrotrader', 'tokenRewards', 50_000_000), hasAirdrop: reported('hyrotrader', 'tokenRewards', true), description: reported('hyrotrader', 'tokenRewards', 'ERC-20 token; 10% community/airdrops and 10% staking/cashbacks. Launch status and trader eligibility are ND.') },
  },

  o2: {
    summary: { profitSplit: reported('o2', 'payoutPolicy', '100%'), maxDrawdown: reported('o2', 'rulebook', 'Selected refundable margin caps loss; percentage ND'), profitTarget: reported('o2', 'rulebook', 'None'), payoutFrequency: reported('o2', 'payoutPolicy', 'On demand / anytime') },
    programs: [program('o2', 'turbo', 'Turbo', { kind: 'collateralized', stages: [stage('o2', 'Funded', { funded: true })], maxDrawdownType: 'dynamic', split: 100, refundable: true, notes: 'No evaluation, profit target or minimum days. Premium is non-refundable; margin is refundable net of losses. Exact configurations and prices are variable and ND.' })],
    payout: { schedule: reported('o2', 'payoutPolicy', 'on-demand'), profitSplitPercent: reported('o2', 'payoutPolicy', 100), minimumAmount: reported('o2', 'payoutPolicy', 0), currencies: reported('o2', 'payoutPolicy', ['USDC']), notes: reported('o2', 'payoutPolicy', 'No minimum, waiting period, withdrawal charge or manual review is reported.') },
    trading: { tradingFees: reported('o2', 'rulebook', 'Maker 0.00%; taker 0.01%.') },
    execution: { onchainSettlement: reported('o2', 'terms', true), notes: reported('o2', 'terms', 'Wallet-based on-chain trading.') },
    compliance: { legalEntity: reported('o2', 'terms', 'Breathe Speed Inc.'), registrationJurisdiction: reported('o2', 'terms', 'Panama governing law; incorporation jurisdiction ND') },
    token: { hasPoints: reported('o2', 'tokenRewards', true), pointsProgramName: reported('o2', 'tokenRewards', 'o2 Legend Score'), description: reported('o2', 'tokenRewards', 'Lifetime score, USDC competitions and referral benefits; proprietary token and airdrop are ND.') },
  },

  'carrot-funding': {
    summary: { profitSplit: reported('carrot-funding', 'payoutPolicy', '80% base'), maxDrawdown: reported('carrot-funding', 'rulebook', '1-Step 8%; 2-Phase 10%', ['https://www.carrotfunding.io/rulebook/']), dailyDrawdown: reported('carrot-funding', 'rulebook', '1-Step 4%; 2-Phase 5%'), profitTarget: reported('carrot-funding', 'rulebook', '1-Step 8%; 2-Phase 5% / 8%'), minCapital: reported('carrot-funding', 'pricingCheckout', 5_000), maxCapital: reported('carrot-funding', 'pricingCheckout', 100_000), cryptoLeverage: reported('carrot-funding', 'rulebook', 'Up to 5x'), payoutFrequency: reported('carrot-funding', 'payoutPolicy', 'On demand; within 24 hours', ['https://www.carrotfunding.io/rulebook/']) },
    programs: [
      program('carrot-funding', 'one-phase', '1-Phase', { kind: 'evaluation', stages: [stage('carrot-funding', 'Evaluation', { target: 8, minimumDays: 0 })], tiers: tierMatrix('carrot-funding', [5_000, 10_000, 20_000, 50_000, 100_000], [75, 129, 249, 499, 799]), dailyLoss: 4, maxDrawdown: 8, maxDrawdownType: 'static', split: 80, refundable: false, noTimeLimit: true }),
      program('carrot-funding', 'two-phase', '2-Phase', { kind: 'evaluation', stages: [stage('carrot-funding', 'Phase 1', { target: 5, minimumDays: 0 }), stage('carrot-funding', 'Phase 2', { target: 8, minimumDays: 0 })], tiers: tierMatrix('carrot-funding', [5_000, 10_000, 20_000, 50_000, 100_000], [65, 119, 239, 449, 699]), dailyLoss: 5, maxDrawdown: 10, maxDrawdownType: 'static', split: 80, refundable: false, noTimeLimit: true, notes: 'Formal rulebook is canonical for the 10% maximum loss.' }),
    ],
    payout: { schedule: reported('carrot-funding', 'payoutPolicy', 'on-demand', ['https://www.carrotfunding.io/rulebook/']), profitSplitPercent: reported('carrot-funding', 'payoutPolicy', 80, ['https://www.carrotfunding.io/rulebook/']), minimumAmount: reported('carrot-funding', 'payoutPolicy', 100, ['https://www.carrotfunding.io/rulebook/']), currencies: reported('carrot-funding', 'payoutPolicy', ['USDC'], ['https://www.carrotfunding.io/rulebook/']), processingTimeHours: reported('carrot-funding', 'payoutPolicy', 24, ['https://www.carrotfunding.io/rulebook/']), positionsMustBeClosed: reported('carrot-funding', 'payoutPolicy', true, ['https://www.carrotfunding.io/rulebook/']), partialWithdrawalsAllowed: reported('carrot-funding', 'payoutPolicy', false, ['https://www.carrotfunding.io/rulebook/']), notes: reported('carrot-funding', 'payoutPolicy', 'Formal rulebook is canonical: on-demand full-balance payout in USDC on Arbitrum; the Terms weekly qualification is retained as a resolved discrepancy.', ['https://www.carrotfunding.io/rulebook/']) },
    trading: { leverage: reported('carrot-funding', 'rulebook', ['Up to 5x']) },
    execution: { model: reported('carrot-funding', 'terms', 'simulated') },
    compliance: { legalEntity: reported('carrot-funding', 'terms', 'CTECHNOLOGIES GAMING DEVELOPMENT - FZCO'), registrationJurisdiction: reported('carrot-funding', 'terms', 'United Arab Emirates'), regulatoryStatus: reported('carrot-funding', 'terms', 'Not brokerage or investment services'), simulatedAccounts: reported('carrot-funding', 'terms', true) },
    token: { hasToken: reported('carrot-funding', 'tokenRewards', true), tokenTicker: reported('carrot-funding', 'tokenRewards', 'CRT'), hasPoints: reported('carrot-funding', 'tokenRewards', true), pointsProgramName: reported('carrot-funding', 'tokenRewards', 'Points Program Season 1'), hasAirdrop: reported('carrot-funding', 'tokenRewards', true), airdropStatus: reported('carrot-funding', 'tokenRewards', 'potential'), description: reported('carrot-funding', 'tokenRewards', 'Season 1 reserves 50% of CRT supply for the community; points include 10 per USDC NFT cost and 5 per USDC profit at payout. Weekly Harvest distributes 10% of platform revenue in USDC to the top 10.', ['https://www.carrotfunding.io/docs/community/points-program-season-1/']) },
  },

  'doji-funded': {
    summary: { profitSplit: reported('doji-funded', 'payoutPolicy', '80%; 90% with add-on'), maxDrawdown: reported('doji-funded', 'rulebook', 'Instant 5%; 1-Step/Classic 6%; Elite 8%'), dailyDrawdown: reported('doji-funded', 'rulebook', 'Instant none; 1-Step/Classic 3%; Elite 5%'), minCapital: reported('doji-funded', 'pricingCheckout', 1_000), maxCapital: reported('doji-funded', 'pricingCheckout', 100_000) },
    programs: [
      program('doji-funded', 'instant', 'Instant Funding', { kind: 'instant-funding', stages: [stage('doji-funded', 'Funded', { funded: true })], tiers: tierMatrix('doji-funded', [1_000, 5_000, 10_000, 25_000, 50_000], [33, 157, 304, 770, 1540], 'USD', false), dailyLoss: 'none', maxDrawdown: 5, maxDrawdownType: 'static', split: 80, notes: 'Marked coming soon.' }),
      program('doji-funded', 'one-step', '1-Step', { kind: 'evaluation', stages: [stage('doji-funded', 'Evaluation')], tiers: tierMatrix('doji-funded', [1_000, 5_000, 10_000, 25_000, 50_000, 100_000], [17, 55, 100, 248, 446, 899]), dailyLoss: 3, maxDrawdown: 6, maxDrawdownType: 'static', split: 80 }),
      program('doji-funded', 'two-step-classic', '2-Step Classic', { kind: 'evaluation', stages: [stage('doji-funded', 'Phase 1'), stage('doji-funded', 'Phase 2')], tiers: tierMatrix('doji-funded', [5_000, 10_000, 25_000, 50_000, 100_000], [45, 90, 225, 407, 805]), dailyLoss: 3, maxDrawdown: 6, maxDrawdownType: 'static', split: 80 }),
      program('doji-funded', 'two-step-elite', '2-Step Elite', { kind: 'evaluation', stages: [stage('doji-funded', 'Phase 1'), stage('doji-funded', 'Phase 2')], tiers: tierMatrix('doji-funded', [5_000, 10_000, 25_000, 50_000, 100_000], [65, 118, 268, 482, 963]), dailyLoss: 5, maxDrawdown: 8, maxDrawdownType: 'static', split: 80 }),
    ],
    payout: { profitSplitPercent: reported('doji-funded', 'payoutPolicy', 80), currencies: reported('doji-funded', 'payoutPolicy', ['USDC']), notes: reported('doji-funded', 'payoutPolicy', '90% add-on; minimum eligible profit is percentage-based, so absolute minimum amount is ND.') },
    trading: { automatedTrading: reported('doji-funded', 'rulebook', 'conditional'), tradingFees: reported('doji-funded', 'rulebook', 'Automation is subject to anti-abuse rules; 60-second minimum position duration.') },
    compliance: { kycRequiredAt: reported('doji-funded', 'terms', 'payout'), maximumAggregateFundedBalance: reported('doji-funded', 'terms', 200_000) },
  },

  'hyper-stack': {
    summary: { profitSplit: reported('hyper-stack', 'payoutPolicy', '90% if invited and eligible under the ICA'), maxDrawdown: reported('hyper-stack', 'rulebook', '5% EOD trailing'), dailyDrawdown: reported('hyper-stack', 'rulebook', '5% intraday'), profitTarget: reported('hyper-stack', 'rulebook', '10%'), minCapital: reported('hyper-stack', 'pricingCheckout', 1_000), maxCapital: reported('hyper-stack', 'pricingCheckout', 100_000), payoutFrequency: reported('hyper-stack', 'payoutPolicy', 'Conditional; invitation and compensation are not guaranteed', ['https://www.hyperstack.trade/terms']) },
    programs: [program('hyper-stack', 'one-step', 'Vanta-powered 1-Step', { kind: 'evaluation', stages: [stage('hyper-stack', 'Evaluation', { target: 10, minimumDays: 0 })], tiers: tierMatrix('hyper-stack', [1_000, 5_000, 10_000, 25_000, 50_000, 100_000], [0, 74, 135, 309, 579, 999]), dailyLoss: 5, maxDrawdown: 5, maxDrawdownType: 'trailing-daily', split: 90, refundable: false, noTimeLimit: true, notes: 'Elimination after 30 inactive days.' })],
    payout: { schedule: reported('hyper-stack', 'payoutPolicy', 'conditional', ['https://www.hyperstack.trade/terms']), profitSplitPercent: reported('hyper-stack', 'payoutPolicy', 90, ['https://www.hyperstack.trade/rules']), currencies: reported('hyper-stack', 'payoutPolicy', ['USDC']), notes: reported('hyper-stack', 'payoutPolicy', 'Terms are canonical for eligibility: passing does not guarantee a Scaled Trader invitation or compensation; a separate ICA and KYC are required. Rules describe a monthly 90/10 reward when eligible.', ['https://www.hyperstack.trade/terms']) },
    execution: { model: reported('hyper-stack', 'terms', 'simulated') },
    compliance: { kycRequiredAt: reported('hyper-stack', 'terms', 'funded-activation'), simulatedAccounts: reported('hyper-stack', 'terms', true) },
    token: { description: reported('hyper-stack', 'tokenRewards', 'Rewards are denominated in USDC; no official proprietary token, points or airdrop was established.') },
  },

  'vanta-trading': {
    summary: { profitSplit: reported('vanta-trading', 'payoutPolicy', '100% under the formal rules', ['https://www.vantatrading.io/rules']), maxDrawdown: reported('vanta-trading', 'rulebook', '5%'), dailyDrawdown: reported('vanta-trading', 'rulebook', '5%'), profitTarget: reported('vanta-trading', 'rulebook', '10%', ['https://www.vantatrading.io/rules']), minCapital: reported('vanta-trading', 'pricingCheckout', 1_000), maxCapital: reported('vanta-trading', 'pricingCheckout', 100_000), payoutFrequency: reported('vanta-trading', 'payoutPolicy', 'Weekly / every seven days', ['https://www.vantatrading.io/rules']) },
    programs: [program('vanta-trading', 'one-step', 'One-Step', { kind: 'evaluation', stages: [stage('vanta-trading', 'Evaluation', { target: 10, minimumDays: 0 })], tiers: tierMatrix('vanta-trading', [1_000, 5_000, 10_000, 25_000, 50_000, 100_000], [0, 74, 135, 309, 579, 999]), dailyLoss: 5, maxDrawdown: 5, maxDrawdownType: 'trailing-daily', split: 100, noTimeLimit: true, notes: 'Formal rules are canonical for the 10% target and weekly 100% reward policy.' })],
    payout: { schedule: reported('vanta-trading', 'payoutPolicy', 'weekly', ['https://www.vantatrading.io/rules']), profitSplitPercent: reported('vanta-trading', 'payoutPolicy', 100, ['https://www.vantatrading.io/rules']), minimumAmount: reported('vanta-trading', 'payoutPolicy', 0, ['https://www.vantatrading.io/rules']), notes: reported('vanta-trading', 'payoutPolicy', 'Formal rules are canonical: immediate Scaled Account activation and rewards every seven days at a 100% split with no minimum. Terms qualifications remain a resolved discrepancy.', ['https://www.vantatrading.io/rules']) },
    execution: { model: reported('vanta-trading', 'terms', 'simulated') },
    compliance: { legalEntity: reported('vanta-trading', 'terms', 'Taoshi VT Services'), registrationJurisdiction: reported('vanta-trading', 'terms', 'Cayman Islands'), kycRequiredAt: reported('vanta-trading', 'terms', 'funded-activation'), simulatedAccounts: reported('vanta-trading', 'terms', true) },
    token: { description: reported('vanta-trading', 'tokenRewards', 'Finite $200,000 2X Rewards pool and quarterly 25% realized-PnL bonus; proprietary token, points and airdrop are ND.') },
  },

  size: {
    summary: { profitSplit: reported('size', 'payoutPolicy', '60–85% by tier; Alpha 80%'), maxDrawdown: reported('size', 'rulebook', '10% Alpha–Gold; 8% Diamond/Ruby'), dailyDrawdown: reported('size', 'rulebook', '5% Alpha–Gold; 4% Diamond/Ruby'), minCapital: reported('size', 'pricingCheckout', 100), maxCapital: reported('size', 'pricingCheckout', 200_000), payoutFrequency: reported('size', 'payoutPolicy', 'On demand') },
    programs: [
      program('size', 'alpha', 'Alpha Competition', { kind: 'competition', stages: [stage('size', '15-minute Trial')], tiers: [tier('size', 100, 1)], dailyLoss: 5, maxDrawdown: 10, split: 80, refundable: false, noTimeLimit: false }),
      program('size', 'bronze', 'Bronze Competition', { kind: 'competition', stages: [stage('size', '15-minute Trial')], tiers: [tier('size', 1_000, 9, 'USD', true, undefined, ['https://www.size.club/docs/how-size-works/product-tiers-keys-and-lives'])], dailyLoss: 5, maxDrawdown: 10, refundable: false, noTimeLimit: false, notes: 'Dedicated current product-tier documentation is canonical for the $9 fee; the Terms “Free” schedule is retained as a resolved discrepancy.' }),
      program('size', 'silver', 'Silver Competition', { kind: 'competition', stages: [stage('size', '15-minute Trial')], tiers: [tier('size', 5_000, 49)], dailyLoss: 5, maxDrawdown: 10, refundable: false, noTimeLimit: false }),
      program('size', 'gold', 'Gold Competition', { kind: 'competition', stages: [stage('size', '15-minute Trial')], tiers: [tier('size', 25_000, 199)], dailyLoss: 5, maxDrawdown: 10, refundable: false, noTimeLimit: false }),
      program('size', 'diamond', 'Diamond Competition', { kind: 'competition', stages: [stage('size', '15-minute Trial')], tiers: [tier('size', 100_000, 799)], dailyLoss: 4, maxDrawdown: 8, refundable: false, noTimeLimit: false }),
      program('size', 'ruby', 'Ruby Competition', { kind: 'competition', stages: [stage('size', '15-minute Trial')], tiers: [tier('size', 200_000, 1499)], dailyLoss: 4, maxDrawdown: 8, refundable: false, noTimeLimit: false }),
    ],
    payout: { schedule: reported('size', 'payoutPolicy', 'on-demand'), minimumAmount: reported('size', 'payoutPolicy', 5), currencies: reported('size', 'payoutPolicy', ['USDC']), partialWithdrawalsAllowed: reported('size', 'payoutPolicy', true), notes: reported('size', 'payoutPolicy', 'Smart-contract transfer to Size wallet; no Size fee; external withdrawal fee stated as $1.') },
    execution: { model: reported('size', 'terms', 'simulated'), venue: reported('size', 'payoutPolicy', 'HyperEVM for USDC wallet and settlement'), onchainSettlement: reported('size', 'payoutPolicy', true) },
    compliance: { legalEntity: reported('size', 'terms', 'Trench Labs Group Ltd.'), regulatoryStatus: reported('size', 'terms', 'Simulated skill-based entertainment service; non-custodial'), simulatedAccounts: reported('size', 'terms', true) },
    token: { hasPoints: reported('size', 'tokenRewards', true), pointsProgramName: reported('size', 'tokenRewards', 'XP'), description: reported('size', 'tokenRewards', 'Permanent XP score; Preseason XP standings award funded-Life prizes. Token and airdrop are ND.') },
  },

  breakout: {
    summary: { profitSplit: reported('breakout', 'payoutPolicy', '80%; optional permanent 90%'), maxDrawdown: reported('breakout', 'rulebook', 'Classic 6%; Pro 5%; Turbo 3%; 2-Step 6%'), dailyDrawdown: reported('breakout', 'rulebook', '1-Step 3%; 2-Step 4%', ['https://checkout.breakoutprop.com/program-rules/']), profitTarget: reported('breakout', 'rulebook', 'Classic 10%; Pro 12%; Turbo 9%; 2-Step 5% / 10%'), maxCapital: reported('breakout', 'pricingCheckout', 100_000), cryptoLeverage: reported('breakout', 'rulebook', 'BTC/ETH 5x; other instruments 2x', ['https://checkout.breakoutprop.com/program-rules/']), payoutFrequency: reported('breakout', 'payoutPolicy', 'On demand') },
    programs: [
      program('breakout', 'classic', '1-Step Classic', { kind: 'evaluation', stages: [stage('breakout', 'Evaluation', { target: 10 })], tiers: [tier('breakout', 100_000, 800)], dailyLoss: 3, maxDrawdown: 6, maxDrawdownType: 'static', split: 80, refundable: false, noTimeLimit: true }),
      program('breakout', 'pro', '1-Step Pro', { kind: 'evaluation', stages: [stage('breakout', 'Evaluation', { target: 12 })], tiers: [tier('breakout', 100_000, 545)], dailyLoss: 3, maxDrawdown: 5, maxDrawdownType: 'static', split: 80, refundable: false, noTimeLimit: true }),
      program('breakout', 'turbo', '1-Step Turbo', { kind: 'evaluation', stages: [stage('breakout', 'Evaluation', { target: 9 })], tiers: [tier('breakout', 100_000, 330)], dailyLoss: 3, maxDrawdown: 3, maxDrawdownType: 'static', split: 80, refundable: false, noTimeLimit: true }),
      program('breakout', 'two-step', '2-Step', { kind: 'evaluation', stages: [stage('breakout', 'Phase 1', { target: 5 }), stage('breakout', 'Phase 2', { target: 10 })], dailyLoss: 4, maxDrawdown: 6, maxDrawdownType: 'static', split: 80, refundable: false, noTimeLimit: true, notes: 'Formal Program Rules are canonical; tier matrix remains ND.' }),
    ],
    payout: { schedule: reported('breakout', 'payoutPolicy', 'on-demand'), profitSplitPercent: reported('breakout', 'payoutPolicy', 80), minimumAmount: reported('breakout', 'payoutPolicy', 50), currencies: reported('breakout', 'payoutPolicy', ['USDC']), positionsMustBeClosed: reported('breakout', 'payoutPolicy', true), notes: reported('breakout', 'payoutPolicy', 'The dedicated funded-trader procedure is canonical: POL approval is required before USDC ERC-20 payment; minimum $50 and no open positions.', ['https://intercom.help/breakoutprop/en/articles/11647224-when-can-i-request-a-payout-from-my-funded-account']) },
    execution: { venue: reported('breakout', 'payoutPolicy', 'Ethereum ERC-20 for payout only') },
    compliance: { legalEntity: reported('breakout', 'terms', 'Breakout Trading Group, LLC') },
  },

  'funded-hive': {
    summary: { minCapital: reported('funded-hive', 'pricingCheckout', 5_000), maxCapital: reported('funded-hive', 'pricingCheckout', 200_000), payoutFrequency: reported('funded-hive', 'payoutPolicy', 'Conditional; verification and third-party delays may apply', ['https://fundedhive.com/downloads/terms-and-conditions.pdf']) },
    programs: [
      program('funded-hive', 'pay-after-pass', 'Pay After You Pass 1-Step', { kind: 'evaluation', stages: [stage('funded-hive', 'Evaluation')], tiers: tierMatrix('funded-hive', [5_000, 10_000, 25_000, 50_000, 100_000, 200_000], [19, 39, 99, 149, 249, 399]), notes: 'Post-pass funded fee is 1–3% of account size depending on risk category.' }),
      program('funded-hive', 'classic-two-step', 'Classic 2-Step'),
      program('funded-hive', 'pay-from-profits', 'Pay From Profits 2-Step'),
      program('funded-hive', 'instant-growth', 'InstantGrowth', { kind: 'instant-funding' }),
    ],
    payout: { schedule: reported('funded-hive', 'payoutPolicy', 'conditional', ['https://fundedhive.com/downloads/terms-and-conditions.pdf']), minimumAmount: reported('funded-hive', 'payoutPolicy', 50, ['https://fundedhive.com/downloads/terms-and-conditions.pdf']), currencies: reported('funded-hive', 'payoutPolicy', ['USDC'], ['https://fundedhive.com/downloads/terms-and-conditions.pdf']), positionsMustBeClosed: reported('funded-hive', 'payoutPolicy', true, ['https://fundedhive.com/downloads/terms-and-conditions.pdf']), notes: reported('funded-hive', 'payoutPolicy', 'Terms are canonical: only verified positive A-Book PnL is withdrawable; verification or third-party delays, withholding, correction and reversal may apply. Daily caps are $1,000 Classic/PFP and $2,000 Instant; user pays Ethereum gas.', ['https://fundedhive.com/downloads/terms-and-conditions.pdf']) },
    execution: { model: reported('funded-hive', 'terms', 'hybrid'), notes: reported('funded-hive', 'terms', 'Terms distinguish A-Book, B-Book and AADS routing; only A-Book positive PnL is withdrawable.') },
    token: { hasToken: reported('funded-hive', 'tokenRewards', true), description: reported('funded-hive', 'tokenRewards', 'Hive Coin utility can cover up to 50% of another challenge; a 200% fee refund may be issued in Hive Coins.') },
  },

  'klein-funding': {
    summary: { profitSplit: reported('klein-funding', 'payoutPolicy', '60–90% Bybit/Cleo; 70–90% Instant Pro', ['https://kleinfunding.com/pricing']), maxDrawdown: reported('klein-funding', 'rulebook', 'Bybit configurable 6–10%; Cleo 3–8%'), dailyDrawdown: reported('klein-funding', 'rulebook', 'Bybit half of max drawdown; Cleo 3–4%'), profitTarget: reported('klein-funding', 'rulebook', 'Bybit configurable 6–10%; Cleo 9–14%'), minCapital: reported('klein-funding', 'pricingCheckout', 1_250), maxCapital: reported('klein-funding', 'pricingCheckout', 100_000), cryptoLeverage: reported('klein-funding', 'rulebook', 'Bybit up to 1:100; Cleo up to 1:5'), payoutFrequency: reported('klein-funding', 'payoutPolicy', 'On demand') },
    programs: [
      program('klein-funding', 'bybit-one-step', 'Bybit Standard One-Step', { kind: 'evaluation', stages: [stage('klein-funding', 'Evaluation')], notes: 'Target and drawdown are configurable in a 6–10% range; stability 30%.' }),
      program('klein-funding', 'bybit-two-step', 'Bybit Standard Two-Step', { kind: 'evaluation', stages: [stage('klein-funding', 'Phase 1'), stage('klein-funding', 'Phase 2')], notes: 'Target and drawdown are configurable in a 6–10% range; stability 45%.' }),
      program('klein-funding', 'cleo', 'Cleo Standard/Flex', { kind: 'evaluation', tiers: [tier('klein-funding', 5_000, 52.25, 'USD', true, 66)], notes: 'Target 9–14%; maximum drawdown 3–8%; daily drawdown 3–4%.' }),
      program('klein-funding', 'instant-pro', 'Instant Pro', { kind: 'instant-funding', stages: [stage('klein-funding', 'Funded', { funded: true })], notes: 'Account range starts at $1,250; upper bound and risk parameters are ND.' }),
    ],
    payout: { schedule: reported('klein-funding', 'payoutPolicy', 'on-demand', ['https://kleinfunding.com/pricing']), currencies: reported('klein-funding', 'payoutPolicy', ['USD', 'USDT', 'BTC', 'ETH'], ['https://kleinfunding.com/pricing']), notes: reported('klein-funding', 'payoutPolicy', 'Pricing is canonical for configurable splits: 60–90% Bybit/Cleo and 70–90% Instant Pro. No single numeric split or exact processing time applies, so those fields remain ND. Instant Pro requires three 0.5% profitable days and 4% minimum profit.', ['https://kleinfunding.com/pricing']) },
    trading: { leverage: reported('klein-funding', 'rulebook', ['Bybit up to 1:100', 'Cleo up to 1:5']), consistencyRule: reported('klein-funding', 'rulebook', 'applies') },
    execution: { model: reported('klein-funding', 'terms', 'simulated') },
    compliance: { legalEntity: reported('klein-funding', 'terms', 'KUENTECH LLC'), simulatedAccounts: reported('klein-funding', 'terms', true) },
  },

  'cf-trader': {
    summary: { profitTarget: reported('cf-trader', 'rulebook', '2-Phase 8% / 5%; 1-Phase 10%'), maxDrawdown: reported('cf-trader', 'rulebook', '2-Phase 10% fixed; 1-Phase 6% trailing'), dailyDrawdown: reported('cf-trader', 'rulebook', '2-Phase 5%; 1-Phase 4%'), minCapital: reported('cf-trader', 'pricingCheckout', 2_500), maxCapital: reported('cf-trader', 'pricingCheckout', 200_000), payoutFrequency: reported('cf-trader', 'payoutPolicy', 'After 15 traded days or monthly; weekly add-on available') },
    programs: [
      program('cf-trader', 'two-phase', '2-Phase', { kind: 'evaluation', stages: [stage('cf-trader', 'Phase 1', { target: 8, minimumDays: 0 }), stage('cf-trader', 'Phase 2', { target: 5, minimumDays: 0 })], tiers: [tier('cf-trader', 5_000, 58), tier('cf-trader', 200_000, 1250)], dailyLoss: 5, maxDrawdown: 10, maxDrawdownType: 'static', noTimeLimit: true }),
      program('cf-trader', 'one-phase', '1-Phase', { kind: 'evaluation', stages: [stage('cf-trader', 'Evaluation', { target: 10, minimumDays: 0 })], tiers: [tier('cf-trader', 5_000, 40), tier('cf-trader', 200_000, 1199)], dailyLoss: 4, maxDrawdown: 6, maxDrawdownType: 'trailing-high-water-mark', noTimeLimit: true }),
      program('cf-trader', 'instant', 'Instant', { kind: 'instant-funding', stages: [stage('cf-trader', 'Funded', { funded: true })], tiers: [tier('cf-trader', 2_500, 125), tier('cf-trader', 10_000, 475)] }),
    ],
    payout: { schedule: reported('cf-trader', 'payoutPolicy', 'conditional'), currencies: reported('cf-trader', 'payoutPolicy', ['USD', 'USDT', 'BTC', 'ETH']), processingTimeHours: reported('cf-trader', 'payoutPolicy', 8), positionsMustBeClosed: reported('cf-trader', 'payoutPolicy', true), notes: reported('cf-trader', 'payoutPolicy', 'Standard request after at least 15 traded days or every 30 calendar days; weekly add-on after 7 traded days. Maximum stated processing is 48 business hours.') },
    trading: { automatedTrading: reported('cf-trader', 'rulebook', 'restricted'), tradingFees: reported('cf-trader', 'rulebook', 'HFT, tick scalping, latency/arbitrage and gambling-style trading are prohibited.') },
    execution: { model: reported('cf-trader', 'terms', 'simulated') },
    compliance: { legalEntity: reported('cf-trader', 'terms', 'SWISS RLCRATES AG'), registrationJurisdiction: reported('cf-trader', 'terms', 'Zug, Switzerland'), regulatoryStatus: reported('cf-trader', 'terms', 'Education and simulated trading using demo funds'), kycRequiredAt: reported('cf-trader', 'terms', 'payout'), simulatedAccounts: reported('cf-trader', 'terms', true) },
    token: { hasPoints: reported('cf-trader', 'tokenRewards', true), pointsProgramName: reported('cf-trader', 'tokenRewards', 'Competitive Ranking / ELO'), description: reported('cf-trader', 'tokenRewards', 'Season ranking awards cash, evaluations, TradingView and custom titles; proprietary token and airdrop are ND.') },
  },

  'upscale-trade': {
    summary: { profitSplit: reported('upscale-trade', 'payoutPolicy', '80%; 90% upgrade'), maxDrawdown: reported('upscale-trade', 'rulebook', 'Basic 10%; Accelerated 6%; Turbo 6% trailing'), dailyDrawdown: reported('upscale-trade', 'rulebook', 'Basic 5%; Accelerated 3%; Turbo none'), profitTarget: reported('upscale-trade', 'rulebook', 'Basic 5% / 8%; Accelerated 10%; Turbo none'), maxCapital: reported('upscale-trade', 'rulebook', 400_000), payoutFrequency: reported('upscale-trade', 'payoutPolicy', 'Every 14 calendar days, conditional') },
    programs: [
      program('upscale-trade', 'basic', 'Basic', { kind: 'evaluation', stages: [stage('upscale-trade', 'Phase 1', { target: 5 }), stage('upscale-trade', 'Phase 2', { target: 8 })], dailyLoss: 5, maxDrawdown: 10, maxDrawdownType: 'static', split: 80, notes: 'Published fee range $59–$1,499; exact tiers are ND.' }),
      program('upscale-trade', 'accelerated', 'Accelerated', { kind: 'evaluation', stages: [stage('upscale-trade', 'Evaluation', { target: 10 })], dailyLoss: 3, maxDrawdown: 6, maxDrawdownType: 'static', split: 80, notes: 'Published fee range $69–$1,599; exact tiers are ND.' }),
      program('upscale-trade', 'turbo', 'Turbo', { kind: 'instant-funding', stages: [stage('upscale-trade', 'Funded', { funded: true })], dailyLoss: 'none', maxDrawdown: 6, maxDrawdownType: 'trailing-high-water-mark', split: 80, notes: 'Published fee range $199–$1,099; exact tiers are ND.' }),
    ],
    payout: { schedule: reported('upscale-trade', 'payoutPolicy', 'bi-weekly'), profitSplitPercent: reported('upscale-trade', 'payoutPolicy', 80), minimumAmount: reported('upscale-trade', 'payoutPolicy', 1), currencies: reported('upscale-trade', 'payoutPolicy', ['USDT']), notes: reported('upscale-trade', 'payoutPolicy', 'Eligibility: 14 calendar days, five profit days, no breach and a size-dependent cap. Terms are canonical for KYC before withdrawal.') },
    trading: { profitDayDefinition: reported('upscale-trade', 'rulebook', 'At least 0.5% balance change; unrealized PnL is included', ['https://docs.upscale.trade/how-to-join-upscale/participation_requirements']) },
    execution: { venue: reported('upscale-trade', 'payoutPolicy', 'TON, Base or BSC for USDT payout only') },
    compliance: { regulatoryStatus: reported('upscale-trade', 'terms', 'Software and professional-development service; not a financial institution', ['https://app.upscale.trade/terms-of-use-upscale.pdf']), kycRequiredAt: reported('upscale-trade', 'payoutPolicy', 'payout', ['https://app.upscale.trade/terms-of-use-upscale.pdf']), restrictedJurisdictions: reported('upscale-trade', 'terms', ['United States residents', 'Sanctions-connected persons'], ['https://app.upscale.trade/terms-of-use-upscale.pdf']), maximumAggregateFundedBalance: reported('upscale-trade', 'rulebook', 400_000) },
    token: { description: reported('upscale-trade', 'tokenRewards', 'Tournament prizes, one-time 20% demo-payout discount and tiered referrals; proprietary token, points and airdrop are ND.') },
  },
};

export const FIRM_NORMALIZED_PROFILES_BY_SLUG: Record<string, FirmNormalizedProfile> = Object.fromEntries(
  FIRM_META.map((meta) => [meta.slug, buildProfile(meta, configs[meta.slug] ?? {})]),
);

function assertNormalizedProfiles(): void {
  const profiles = Object.values(FIRM_NORMALIZED_PROFILES_BY_SLUG);
  if (profiles.length !== FIRM_META.length || profiles.length !== 21) {
    throw new Error(`Expected 21 normalized profiles, received ${profiles.length}.`);
  }

  const inspect = (value: unknown, path: string): void => {
    if (value === undefined) throw new Error(`Undefined normalized value at ${path}.`);
    if (!value || typeof value !== 'object') return;
    if ('status' in value && 'value' in value) {
      const fact = value as Fact<unknown>;
      if (fact.status === 'ND') {
        if (fact.value !== 'ND' || !fact.notes || !fact.evidence.length) throw new Error(`Invalid ND fact at ${path}.`);
      } else if (!fact.evidence.length || fact.value === 'ND') {
        throw new Error(`Invalid reported fact at ${path}.`);
      }
      for (const item of fact.evidence) {
        if (!item.sourceUrl.startsWith('https://') || !item.checkedAt) throw new Error(`Invalid evidence at ${path}.`);
        if (/aggregator|mock|demo-seed/i.test(item.sourceUrl)) throw new Error(`Disallowed evidence at ${path}.`);
      }
      return;
    }
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      if (key === 'claims' || key === 'ndFields') continue;
      inspect(item, `${path}.${key}`);
    }
  };

  for (const profile of profiles) {
    inspect(profile, profile.slug);
    const expected = collectNDFields(profile);
    if (JSON.stringify(expected) !== JSON.stringify(profile.ndFields)) throw new Error(`Stale ndFields for ${profile.slug}.`);

    const conflictObservationIds = new Set(
      profile.claims.filter((claim) => claim.status === 'conflict').map((claim) => claim.id),
    );
    const discrepancyObservationIds = new Set(
      profile.sourceDiscrepancies.flatMap((item) => [item.canonical, ...item.alternates])
        .map((candidate) => candidate.observationId)
        .filter((id): id is string => Boolean(id)),
    );
    for (const id of conflictObservationIds) {
      if (!discrepancyObservationIds.has(id)) throw new Error(`Ungrouped source discrepancy observation ${id}.`);
    }
    for (const discrepancy of profile.sourceDiscrepancies) {
      if (discrepancy.status !== 'resolved' || !discrepancy.alternates.length) {
        throw new Error(`Invalid source discrepancy ${discrepancy.id}.`);
      }
      for (const candidate of [discrepancy.canonical, ...discrepancy.alternates]) {
        if (!candidate.sourceUrl.startsWith('https://') || !candidate.checkedAt || !candidate.value) {
          throw new Error(`Invalid source discrepancy evidence ${discrepancy.id}.`);
        }
      }
    }
  }

  if (profiles.flatMap((profile) => profile.sourceDiscrepancies).length !== 24) {
    throw new Error('Expected 24 resolved source discrepancies.');
  }
}

assertNormalizedProfiles();
