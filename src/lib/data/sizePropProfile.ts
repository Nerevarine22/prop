import type {
  FirmContentFact,
  FirmNormalizedProfile,
  FirmNormalizedProfileV2,
  NormalizedChallengeProgram,
  NormalizedChallengeStage,
  NormalizedChallengeTier,
  NormalizedEvidence,
  NormalizedFact,
  PrimaryResearchObservation,
} from '@/types/database';

const CHECKED_AT = '2026-09-02T00:00:00.000Z';
const WEBSITE = 'https://www.sizeprop.com/';
const RULES = 'https://www.sizeprop.com/our-rules';
const HELP = 'https://help.sizeprop.com/';
const X = 'https://x.com/SizeProp';
const REFERRAL = 'https://www.sizeprop.com/referral';

function evidence(sourceUrl = RULES, notes?: string): NormalizedEvidence[] {
  return [{ sourceUrl, checkedAt: CHECKED_AT, ...(notes ? { notes } : {}) }];
}

function reported<T>(value: T, sourceUrl = RULES, notes?: string): NormalizedFact<T> {
  return { status: 'reported', value, evidence: evidence(sourceUrl, notes) };
}

function nd<T>(notes: string, sourceUrl = RULES): NormalizedFact<T> {
  return { status: 'ND', value: 'ND', evidence: evidence(sourceUrl), notes };
}

function stage(name: string, target: number, funded = false): NormalizedChallengeStage {
  return {
    name,
    profitTargetPercent: reported(target),
    minimumTradingDays: reported(0),
    durationDays: nd('No time limit is documented.'),
    funded: reported(funded),
  };
}

function tier(accountSize: number, fee: number): NormalizedChallengeTier {
  return {
    accountSize: reported(accountSize),
    fee: reported(fee),
    originalFee: nd('No permanent undiscounted comparison price was supplied.'),
    currency: reported('USD', WEBSITE),
    available: reported(true),
  };
}

const programs: NormalizedChallengeProgram[] = [
  {
    id: 'sizeprop-degen',
    name: 'Degen',
    kind: reported('evaluation'),
    stages: reported([stage('Evaluation', 8)]),
    tiers: reported([
      tier(5_000, 19), tier(10_000, 39), tier(25_000, 94), tier(50_000, 177), tier(100_000, 344),
    ]),
    dailyLossPercent: reported(2),
    maxDrawdownPercent: reported(3),
    maxDrawdownType: reported('static'),
    fundedProfitSplitPercent: reported(80, WEBSITE, 'Base split; 90% and 95% are paid checkout upgrades.'),
    feeRefundable: reported(true, WEBSITE, 'Only within 24 hours and before the first trade.'),
    noTimeLimit: reported(true),
    notes: reported('Low-entry one-phase evaluation with the tightest SizeProp loss limits.'),
  },
  {
    id: 'sizeprop-one-step',
    name: '1-Step',
    kind: reported('evaluation'),
    stages: reported([stage('Evaluation', 10)]),
    tiers: reported([
      tier(5_000, 77), tier(10_000, 132), tier(25_000, 299), tier(50_000, 539), tier(100_000, 999),
    ]),
    dailyLossPercent: reported(3),
    maxDrawdownPercent: reported(5),
    maxDrawdownType: reported('static'),
    fundedProfitSplitPercent: reported(80, WEBSITE, 'Base split; 90% and 95% are paid checkout upgrades.'),
    feeRefundable: reported(true, WEBSITE, 'Only within 24 hours and before the first trade.'),
    noTimeLimit: reported(true),
    notes: reported('Single-phase evaluation with a 10% balance-based target.'),
  },
  {
    id: 'sizeprop-two-step',
    name: '2-Step',
    kind: reported('evaluation'),
    stages: reported([stage('Phase 1', 5), stage('Phase 2', 10)]),
    tiers: reported([
      tier(5_000, 61), tier(10_000, 121), tier(25_000, 299), tier(50_000, 521),
    ]),
    dailyLossPercent: reported(4),
    maxDrawdownPercent: reported(6),
    maxDrawdownType: reported('static'),
    fundedProfitSplitPercent: reported(80, WEBSITE, 'Base split; 90% and 95% are paid checkout upgrades.'),
    feeRefundable: reported(true, WEBSITE, 'Only within 24 hours and before the first trade.'),
    noTimeLimit: reported(true),
    notes: reported('Phase 1 resets to starting balance before the 10% Phase 2 objective. A $100K tier is not offered.'),
  },
];

const observations: PrimaryResearchObservation[] = [
  { id: 'sizeprop-rules-current', field: 'rulebook', value: 'May 2026 rules use static 3% / 5% / 6% maximum drawdown and a 20:00 UTC daily-loss snapshot.', status: 'reported', sourceUrl: RULES, checkedAt: CHECKED_AT },
  { id: 'sizeprop-simulated', field: 'terms', value: 'Accounts are simulated and payouts are discretionary performance rewards.', status: 'reported', sourceUrl: WEBSITE, checkedAt: CHECKED_AT },
  { id: 'sizeprop-payout', field: 'payoutPolicy', value: 'On-demand USDT ERC-20 payouts; KYC at first payout and positions must be closed.', status: 'reported', sourceUrl: HELP, checkedAt: CHECKED_AT },
  { id: 'sizeprop-points', field: 'tokenRewards', value: 'Points are live; $SIZE and an airdrop are not confirmed launched products.', status: 'reported', sourceUrl: X, checkedAt: CHECKED_AT },
  { id: 'sizeprop-referral', field: 'tokenRewards', value: 'A referral portal is available; a complete public commission schedule was not captured.', status: 'reported', sourceUrl: REFERRAL, checkedAt: CHECKED_AT },
];

const sourceFact = (id: string, label: string, value: string, note?: string): FirmContentFact => ({
  id, label, value, status: 'reported', ...(note ? { note } : {}),
});

export const SIZEPROP_PAGE_PROFILE: FirmNormalizedProfileV2 = {
  version: 2,
  contentStage: 'editorial',
  methodology: 'primary-sources-only',
  researchStandard: 'model-first-v1',
  researchMode: 'manual',
  id: 'firm-sizeprop',
  slug: 'sizeprop',
  name: 'SizeProp',
  checkedAt: CHECKED_AT,
  modelTypes: ['evaluation'],
  offerNames: ['Degen', '1-Step', '2-Step'],
  editorialCopy: {
    'promo.code': 'IGLOO',
    'decision.title': 'A retail evaluation built around simulated multi-asset trading.',
    'decision.description': 'SizeProp sells three challenge paths with no time limit or minimum trading days. Prices come from market infrastructure associated with Hyperliquid, Trade.xyz and Bybit, while user trades remain simulated and payouts are discretionary USDT rewards.',
    'decision.highlight': 'Low-cost entry and static drawdown, with a material gap between the marketing language and legal account model.',
    'process.title': 'From challenge purchase to USDT reward',
    'process.description': 'The practical lifecycle, separated from marketing shorthand and the detailed rulebook.',
    'process.1.title': 'Choose a challenge',
    'process.1.description': 'Select Degen, 1-Step or 2-Step and an account size from $5K to $100K.',
    'process.2.title': 'Reach the balance target',
    'process.2.description': 'Close enough profit to meet the objective while realtime equity stays inside daily and maximum loss limits.',
    'process.3.title': 'Enter the funded simulation',
    'process.3.description': 'Passing unlocks another simulated account. KYC is deferred until the first payout request.',
    'process.4.title': 'Request a USDT payout',
    'process.4.description': 'Close every position, submit realized profit for discretionary approval, then receive USDT on ERC-20.',
    'programs.title': 'Three ways to trade the same static-risk framework.',
    'programs.description': 'Degen minimizes entry cost but allows only 3% maximum loss. The standard routes trade higher fees for wider limits or a two-phase objective.',
    'programs.note': 'Full refund within 24 hours only if no trade has been placed. Higher 90% and 95% profit splits are paid checkout upgrades.',
    'payouts.title': 'base share of approved simulated profit.',
    'payouts.description': 'Payouts are on demand and may be requested after the first profitable funded trade. The legal Terms characterize every payment as a discretionary reward.',
    'payouts.minimum': 'No stated minimum',
    'payouts.processing': 'Usually within 24h after approval',
    'payouts.rule.1': 'All positions must be closed before the request.',
    'payouts.rule.2': 'Partial payouts are allowed; unwithdrawn balance remains.',
    'payouts.rule.3': 'Current static maximum drawdown is not affected by payouts.',
    'trading.title': 'One web terminal, with live-derived prices and simulated execution.',
    'trading.description': 'SizeProp combines crypto perpetuals with stocks, forex and metals through its browser terminal. A real order-book price feed does not mean the user order reaches a live market.',
    'consider.eyebrow': 'What to verify',
    'consider.title': 'The details most likely to change the decision.',
    'consider.1.title': 'Current rules replaced the old HWM model',
    'consider.1.description': 'May 2026 uses static drawdown and a 20:00 UTC daily snapshot. Older pages and directories may still show trailing limits or 04:00 UTC.',
    'consider.2.title': 'Payout approval remains discretionary',
    'consider.2.description': 'The public checklist is clear, but Terms and FAQ outrank the simplified rulebook and preserve approval discretion.',
    'consider.3.title': 'Points are live; a token is not',
    'consider.3.description': 'Points, tiers and promotions exist. $SIZE has no confirmed live contract, supply or utility paper, and no guaranteed airdrop.',
    'consider.4.title': 'Transparency is still marketing-led',
    'consider.4.description': '$50M allocation and zero-denial claims are unaudited, and the announced on-chain payout registry is not live.',
    'rewards.title': 'Points are useful today; token expectations remain speculative.',
    'rewards.description': 'Purchases, passes, payouts and referrals can earn points across Bronze-to-Obsidian progression. Temporary boosts and giveaways are promotions, not permanent economics.',
    'trust.title': 'Readable rules, short history and unresolved source conflicts.',
    'trust.description': 'The strongest positives are a named founder, public backing, a dedicated rules page and reported USDT payouts. The main cautions are technical complaints, unaudited statistics and changing rule versions.',
    'sources.unknowns': 'Exact swap-fee tables, leverage for Trade.xyz asset classes, the verified registry record, a complete affiliate schedule and the exact minimum-age clause remain undocumented in this review.',
  },
  comparison: {
    modelTypes: ['evaluation'],
    capital: { status: 'varies', min: 5_000, max: 100_000, unit: 'USD', notes: 'Available account size varies by program.' },
    entryCost: { status: 'varies', min: 19, max: 999, unit: 'USD', notes: 'Base price before temporary promo codes.' },
    profitSplit: { status: 'varies', min: 80, max: 95, unit: 'percent', notes: '80% base; 90% and 95% are paid checkout options.' },
    maxDrawdown: { status: 'varies', min: 3, max: 6, unit: 'percent', notes: 'Static from starting balance under the May 2026 rules.' },
    payoutSchedules: { status: 'known', values: ['on-demand'], notes: 'Subject to eligibility and discretionary approval.' },
    executionModels: { status: 'known', values: ['simulated'], notes: 'Live-derived pricing does not imply live order routing.' },
  },
  sections: [
    {
      id: 'overview', tabLabel: 'Brief', title: 'How SizeProp works', description: 'The operating model before individual rules.',
      blocks: [
        { id: 'notebooklm-1', type: 'text', eyebrow: 'Decision brief', title: 'A simulated evaluation with a crypto-native front end.', paragraphs: ['SizeProp markets access to prop capital up to $100K. Legally, the challenge and funded stages are simulations and approved payouts are discretionary rewards rather than a share of live-market PnL.'], status: 'reported' },
        { id: 'notebooklm-2', type: 'fact-grid', columns: 4, presentation: 'steps', items: [
          sourceFact('sizeprop-step-1', '01', 'Choose Degen, 1-Step or 2-Step'),
          sourceFact('sizeprop-step-2', '02', 'Reach the balance target'),
          sourceFact('sizeprop-step-3', '03', 'Enter the funded simulation'),
          sourceFact('sizeprop-step-4', '04', 'Request an approved USDT reward'),
        ] },
      ],
    },
    {
      id: 'offers', tabLabel: 'Challenges', title: 'Programs and pricing', description: 'Three programs with different entry costs and risk limits.',
      blocks: [{ id: 'offer-records', type: 'record-list', presentation: 'records', items: programs.map((program) => ({ id: program.id, eyebrow: 'Evaluation', title: program.name })) }],
    },
    {
      id: 'payouts', tabLabel: 'Payouts', title: 'How payouts work', description: 'Access, processing and account impact.',
      blocks: [{ id: 'payout-facts', type: 'fact-grid', columns: 3, presentation: 'metrics', items: [
        sourceFact('sizeprop-payout-split', 'Base split', '80%', '90% and 95% are paid upgrades.'),
        sourceFact('sizeprop-payout-time', 'Processing', 'Usually within 24h after approval'),
        sourceFact('sizeprop-payout-currency', 'Settlement', 'USDT · ERC-20'),
      ] }],
    },
    {
      id: 'trading', tabLabel: 'Trading', title: 'Trading environment', description: 'Market access, permissions and risk enforcement.',
      blocks: [{ id: 'trading-facts', type: 'fact-grid', columns: 3, presentation: 'details', items: [
        sourceFact('sizeprop-terminal', 'Terminal', 'SizeProp web terminal'),
        sourceFact('sizeprop-assets', 'Markets', 'Crypto perps · stocks · forex · metals'),
        sourceFact('sizeprop-leverage', 'Published leverage', 'BTC 5x · ETH and alts 2x'),
      ] }],
    },
    {
      id: 'rewards', tabLabel: 'Rewards', title: 'Points and incentives', description: 'Live mechanics separated from future-token speculation.',
      blocks: [{ id: 'reward-facts', type: 'fact-grid', columns: 3, items: [
        sourceFact('sizeprop-points-status', 'Points', 'Live'),
        sourceFact('sizeprop-token-status', '$SIZE token', 'Teased · not launched'),
        sourceFact('sizeprop-airdrop-status', 'Airdrop', 'Unconfirmed'),
      ] }],
    },
    {
      id: 'trust', tabLabel: 'Trust & risks', title: 'Evidence and decision risks', description: 'Positive signals and unresolved cautions shown together.',
      blocks: [{ id: 'trust-facts', type: 'fact-grid', columns: 2, items: [
        sourceFact('sizeprop-trust-positive', 'Positive signals', 'Named founder · public backing · dedicated rulebook · reported payouts'),
        sourceFact('sizeprop-trust-cautions', 'Material cautions', 'Changing rules · discretionary rewards · technical complaints · unaudited statistics'),
      ] }],
    },
    {
      id: 'sources', tabLabel: 'Sources', title: 'Sources and open questions', description: 'Current first-party trail and unresolved fields.',
      blocks: [{ id: 'source-claims', type: 'record-list', presentation: 'sources', items: [
        { id: 'sizeprop-source-website', title: 'Official website and disclosures', links: [{ label: 'Open source', url: WEBSITE }] },
        { id: 'sizeprop-source-rules', title: 'Current rule summary', links: [{ label: 'Open source', url: RULES }] },
        { id: 'sizeprop-source-help', title: 'Help center', links: [{ label: 'Open source', url: HELP }] },
        { id: 'sizeprop-source-x', title: 'Official X account', links: [{ label: 'Open source', url: X }] },
      ] }],
    },
  ],
  sourcesInspected: [
    { category: 'website', url: WEBSITE, checkedAt: CHECKED_AT, outcome: 'accessed' },
    { category: 'rulebook', url: RULES, checkedAt: CHECKED_AT, outcome: 'accessed' },
    { category: 'faq', url: HELP, checkedAt: CHECKED_AT, outcome: 'accessed' },
    { category: 'x-account', url: X, checkedAt: CHECKED_AT, outcome: 'accessed' },
    { category: 'other', url: REFERRAL, checkedAt: CHECKED_AT, outcome: 'accessed' },
  ],
  sourceDiscrepancies: [
    {
      id: 'sizeprop-drawdown-version-conflict', field: 'rulebook', label: 'Maximum drawdown model', kind: 'official-source-mismatch', status: 'resolved', resolutionBasis: 'rulebook-preferred',
      canonical: { value: 'May 2026: static 3% / 5% / 6% from starting balance', sourceUrl: RULES, checkedAt: CHECKED_AT, sourceRole: 'canonical' },
      alternates: [{ value: 'February 2026: trailing/HWM 7% / 8%', sourceUrl: WEBSITE, checkedAt: CHECKED_AT, sourceRole: 'alternate' }],
      checkedAt: CHECKED_AT, notes: 'The current dated rulebook replaces the earlier HWM model; stale pages may still repeat the old values.',
    },
    {
      id: 'sizeprop-execution-model-conflict', field: 'terms', label: 'Prop capital and execution', kind: 'page-vs-rulebook', status: 'resolved', resolutionBasis: 'terms-preferred',
      canonical: { value: 'Simulated accounts with discretionary rewards', sourceUrl: WEBSITE, checkedAt: CHECKED_AT, sourceRole: 'canonical' },
      alternates: [{ value: 'Trade with up to $100K in prop capital', sourceUrl: WEBSITE, checkedAt: CHECKED_AT, sourceRole: 'alternate' }],
      checkedAt: CHECKED_AT, notes: 'The legal disclosure controls account classification; the marketing phrase remains visible as positioning.',
    },
  ],
};

export const SIZEPROP_NORMALIZED_PROFILE: FirmNormalizedProfile = {
  version: 1,
  methodology: 'primary-sources-only',
  id: 'firm-sizeprop',
  slug: 'sizeprop',
  name: 'SizeProp',
  checkedAt: CHECKED_AT,
  identity: {
    officialWebsite: reported(WEBSITE, WEBSITE),
    xHandle: reported('@SizeProp', X),
    logo: reported('/firm-logos/sizeprop/logo.png', WEBSITE),
    tagline: reported('Crypto-native evaluation platform for perpetual-futures traders.', WEBSITE),
    description: reported('SizeProp sells skill-based challenges that lead to a funded-stage simulation and discretionary USDT performance rewards.', WEBSITE),
  },
  summary: {
    profitSplit: reported('80% base · 90% or 95% paid upgrade', WEBSITE),
    maxDrawdown: reported('3%–6% static', RULES),
    dailyDrawdown: reported('2%–4% · snapshot at 20:00 UTC', RULES),
    profitTarget: reported('5%–10% by phase', RULES),
    minCapital: reported(5_000, WEBSITE),
    maxCapital: reported(100_000, WEBSITE),
    cryptoLeverage: reported('BTC 5x · ETH and alts 2x', WEBSITE),
    payoutFrequency: reported('on-demand', HELP),
  },
  challengePrograms: reported(programs),
  payoutPolicy: {
    schedule: reported('on-demand', HELP),
    profitSplitPercent: reported(80, WEBSITE, 'Base share; optional paid upgrades increase it to 90% or 95%.'),
    minimumAmount: nd('No official minimum is stated; a blog mentions a $10 example.', HELP),
    currencies: reported(['USDT'], HELP),
    processingTimeHours: reported(24, HELP, 'Usually within 24 hours after approval, not necessarily from request submission.'),
    positionsMustBeClosed: reported(true, HELP),
    partialWithdrawalsAllowed: reported(true, HELP),
    payoutResetsBalance: reported(false, RULES, 'Withdrawn realized profit is removed; unwithdrawn balance remains and static maximum drawdown is unchanged.'),
    notes: reported('First payout requires one-time KYC. Eligibility requires funded status, closed realized profit, closed positions, no breach and discretionary approval.', HELP),
  },
  tradingPolicy: {
    platforms: reported(['SizeProp web terminal', 'Hyperliquid', 'Trade.xyz', 'Bybit order books'], WEBSITE),
    markets: reported(['Crypto perpetuals', 'Stocks', 'Forex', 'Metals'], WEBSITE),
    leverage: reported(['BTC 5x', 'ETH and altcoins 2x', 'Trade.xyz asset classes not published'], WEBSITE),
    consistencyRule: reported('none', RULES),
    profitDayDefinition: nd('No separate profit-day or consistency definition is used.', RULES),
    newsTrading: reported('allowed', RULES),
    weekendHolding: reported('allowed', RULES),
    automatedTrading: reported('allowed', RULES, 'Frontend browser automation is allowed; public API access and reverse engineering are not.'),
    copyTrading: reported('restricted', RULES),
    mandatoryStopLoss: reported(false, RULES),
    tradingFees: reported('Swap fee applies to long and short positions; exact public fee table not found.', RULES),
  },
  executionPolicy: {
    model: reported('simulated', WEBSITE),
    venue: reported('SizeProp web terminal using live-derived Hyperliquid, Trade.xyz and Bybit pricing', WEBSITE),
    onchainSettlement: reported(false, WEBSITE, 'The complete on-chain payout verification page remains announced rather than live.'),
    notes: reported('User orders do not route to a live market on the user’s behalf. Risk limits are monitored in realtime against equity.', WEBSITE),
  },
  compliancePolicy: {
    legalEntity: reported('SIZ EDU Limited', WEBSITE),
    registrationJurisdiction: reported('Cayman Islands', WEBSITE),
    regulatoryStatus: reported('Educational simulation provider; not a broker, investment firm, custodian or investment adviser.', WEBSITE),
    kycRequiredAt: reported('payout', HELP),
    restrictedJurisdictions: reported(['UAE', 'Afghanistan', 'Belarus', 'Myanmar', 'Cambodia', 'Central African Republic', 'China', 'Cuba', 'DR Congo', 'Ethiopia', 'Eritrea', 'Haiti', 'Iran', 'Iraq', 'Lebanon', 'Libya', 'Nicaragua', 'North Korea', 'Russia', 'Somalia', 'South Sudan', 'Sudan', 'Syria', 'Venezuela', 'Vietnam', 'Yemen', 'Zimbabwe', 'Crimea', 'Donetsk', 'Luhansk'], WEBSITE, 'May 2026 policy snapshot.'),
    maximumAggregateFundedBalance: reported(100_000, WEBSITE, 'Maximum documented capital per account; a separate aggregate scaling plan was not documented.'),
    simulatedAccounts: reported(true, WEBSITE),
  },
  tokenRewards: {
    hasToken: reported(false, X, '$SIZE is teased but no live contract, supply or utility paper was confirmed.'),
    tokenTicker: nd('A teased $SIZE name is not stored as a launched token ticker.', X),
    tokenSupply: nd('No official token supply is published.', X),
    hasPoints: reported(true, X),
    pointsProgramName: reported('SizeProp Points', X),
    hasAirdrop: reported(false, X, 'No guaranteed airdrop has been announced.'),
    airdropStatus: reported('unconfirmed', X),
    description: reported('Points are earned through challenge purchases, passes, payouts and referrals. Bronze-to-Obsidian tiers and temporary boosts exist; token expectations remain speculative.', X),
  },
  company: {
    yearEstablished: reported(2025, WEBSITE, 'Product launch year, not independently verified legal incorporation year.'),
    headquarters: reported('George Town, Grand Cayman, Cayman Islands', WEBSITE),
  },
  sourceDiscrepancies: SIZEPROP_PAGE_PROFILE.sourceDiscrepancies,
  claims: observations,
  ndFields: [
    'payoutPolicy.minimumAmount',
    'tradingPolicy.profitDayDefinition',
    'tokenRewards.tokenTicker',
    'tokenRewards.tokenSupply',
  ],
  modularProfile: SIZEPROP_PAGE_PROFILE,
};
