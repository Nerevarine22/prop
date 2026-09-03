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
const WEBSITE = 'https://fundex.gg/';
const TRADE = 'https://trade.fundex.gg/get-funded';
const HELP = 'https://help.fundex.gg/en/';
const X = 'https://x.com/Fundex';
const EVALUATION = 'https://help.fundex.gg/en/articles/15444989-what-is-the-fundex-evaluation';
const TARGETS = 'https://help.fundex.gg/en/articles/15445015-profit-targets-by-account-size';
const MAX_DRAWDOWN = 'https://help.fundex.gg/en/articles/15445029-maximum-drawdown-limit-explained';
const DAILY_LOSS = 'https://help.fundex.gg/en/articles/15445065-daily-loss-limit-explained';
const MIN_DAYS = 'https://help.fundex.gg/en/articles/15445097-minimum-trading-days';
const HOLDING = 'https://help.fundex.gg/en/articles/15445112-holding-time-rule';
const CONSISTENCY = 'https://help.fundex.gg/en/articles/15445134-no-consistency-rule';
const PAYOUTS = 'https://help.fundex.gg/en/articles/15453954-how-do-payouts-work';
const PROFIT_SPLIT = 'https://help.fundex.gg/en/articles/15453965-profit-split-explained';
const EXECUTION = 'https://help.fundex.gg/en/articles/15453868-a-book-vs-b-book-explained';
const BBOOK_TRIGGER = 'https://help.fundex.gg/en/articles/15453883-what-triggers-a-switch-to-b-book';
const OFFSET = 'https://help.fundex.gg/en/articles/15453905-how-do-i-return-to-a-book';
const PLATFORM = 'https://help.fundex.gg/en/articles/15454082-what-platform-does-fundex-use';
const LEVERAGE = 'https://help.fundex.gg/en/articles/15454113-available-leverage';
const FEES = 'https://help.fundex.gg/en/articles/15454117-trading-fees';
const KYC = 'https://help.fundex.gg/en/articles/15444803-kyc-verification';
const RESTRICTED = 'https://help.fundex.gg/en/articles/15444842-restricted-countries';
const BONUS = 'https://help.fundex.gg/en/articles/15454037-what-is-the-monthly-bonus';
const REFUNDS = 'https://help.fundex.gg/en/articles/15454075-does-fundex-offer-refunds';

function evidence(sourceUrl = HELP, notes?: string): NormalizedEvidence[] {
  return [{ sourceUrl, checkedAt: CHECKED_AT, ...(notes ? { notes } : {}) }];
}

function reported<T>(value: T, sourceUrl = HELP, notes?: string): NormalizedFact<T> {
  return { status: 'reported', value, evidence: evidence(sourceUrl, notes) };
}

function nd<T>(notes: string, sourceUrl = HELP): NormalizedFact<T> {
  return { status: 'ND', value: 'ND', evidence: evidence(sourceUrl), notes };
}

function stage(name: string, target: number): NormalizedChallengeStage {
  return {
    name,
    profitTargetPercent: reported(target, TARGETS),
    minimumTradingDays: reported(5, MIN_DAYS, 'A day counts only when a qualifying trade reaches 5% of starting balance in notional size.'),
    durationDays: nd('No maximum evaluation duration is documented.', EVALUATION),
    funded: reported(false, EVALUATION),
  };
}

function tier(accountSize: number, fee: number): NormalizedChallengeTier {
  return {
    accountSize: reported(accountSize, TRADE),
    fee: reported(fee, TRADE),
    originalFee: nd('No stable undiscounted comparison price was captured.', TRADE),
    currency: reported('USD', TRADE),
    available: reported(true, TRADE),
  };
}

const programs: NormalizedChallengeProgram[] = [{
  id: 'fundex-two-step',
  name: 'Fundex Evaluation',
  kind: reported('evaluation', EVALUATION),
  stages: reported([stage('Phase 1', 8), stage('Phase 2', 5)], TARGETS),
  tiers: reported([
    tier(10_000, 89), tier(25_000, 259), tier(50_000, 359), tier(100_000, 529), tier(200_000, 1_139),
  ], TRADE),
  dailyLossPercent: reported(5, DAILY_LOSS),
  maxDrawdownPercent: reported(10, MAX_DRAWDOWN),
  maxDrawdownType: reported('static', MAX_DRAWDOWN),
  fundedProfitSplitPercent: reported(70, PROFIT_SPLIT),
  feeRefundable: reported(false, REFUNDS),
  noTimeLimit: reported(true, EVALUATION),
  notes: reported('Two-phase evaluation. A 3-minute minimum holding rule applies during evaluation, but not at the funded stage.', HOLDING),
}];

const observations: PrimaryResearchObservation[] = [
  { id: 'fundex-evaluation', field: 'rulebook', value: 'Two phases: 8% then 5%, five qualifying trading days per phase, 5% daily loss and 10% static maximum drawdown.', status: 'reported', sourceUrl: EVALUATION, checkedAt: CHECKED_AT },
  { id: 'fundex-payouts', field: 'payoutPolicy', value: '70% of eligible A-Book profit, $50 minimum, on-demand request, company-stated typical completion within 60 minutes and maximum 24 hours.', status: 'reported', sourceUrl: PROFIT_SPLIT, checkedAt: CHECKED_AT },
  { id: 'fundex-execution', field: 'rulebook', value: 'Funded accounts use a simulated A-Book/B-Book model; external hedging or routing remains at Fundex discretion.', status: 'reported', sourceUrl: EXECUTION, checkedAt: CHECKED_AT },
  { id: 'fundex-offset', field: 'rulebook', value: 'B-Book losses accumulate as an offset that must be cleared before new Reward share becomes payable.', status: 'reported', sourceUrl: OFFSET, checkedAt: CHECKED_AT },
  { id: 'fundex-bonus', field: 'tokenRewards', value: 'A discretionary monthly participation bonus is documented from day 30 subject to volume requirements.', status: 'reported', sourceUrl: BONUS, checkedAt: CHECKED_AT },
];

const contentFact = (id: string, label: string, value: string, note?: string): FirmContentFact => ({
  id, label, value, status: 'reported', ...(note ? { note } : {}),
});

export const FUNDEX_PAGE_PROFILE: FirmNormalizedProfileV2 = {
  version: 2,
  contentStage: 'editorial',
  methodology: 'primary-sources-only',
  researchStandard: 'model-first-v1',
  researchMode: 'agent-assisted',
  id: 'firm-fundex',
  slug: 'fundex',
  name: 'Fundex',
  checkedAt: CHECKED_AT,
  modelTypes: ['evaluation'],
  offerNames: ['Fundex Evaluation'],
  editorialCopy: {
    'promo.code': '',
    'decision.title': 'A two-phase evaluation with an unusual internal risk model.',
    'decision.description': 'Fundex sells a simulated evaluation, then applies its own A-Book/B-Book classification to funded performance. The firm may hedge or mirror activity externally, but user balances remain performance metrics rather than deposits or trader-owned live accounts.',
    'decision.highlight': 'Simple evaluation limits sit above a materially more complex funded-stage reward calculation.',
    'process.title': 'From evaluation to eligible Reward',
    'process.description': 'Passing the challenge is only the first half; funded profit must also remain eligible under the A‑Book and offset rules.',
    'process.1.title': 'Buy the two-phase evaluation',
    'process.1.description': 'Choose $10K–$200K and complete five qualifying trading days in each phase.',
    'process.2.title': 'Reach 8%, then 5%',
    'process.2.description': 'Stay inside the 5% daily-loss and 10% static maximum-drawdown limits.',
    'process.3.title': 'Complete review and KYC',
    'process.3.description': 'RiskDesk reviews the account; RISE KYC and the Trader Agreement precede funded activation.',
    'process.4.title': 'Generate eligible A‑Book profit',
    'process.4.description': 'Clear any accumulated offset, reach at least $50 in eligible Reward and submit an on-demand request.',
    'programs.title': 'One evaluation path across five account sizes.',
    'programs.description': 'Every tier uses the same two targets and risk framework. Price and nominal account size are the main variables.',
    'programs.note': 'Evaluation fees are documented as non-refundable. A free test account and giveaway accounts follow separate reward conditions.',
    'payouts.title': 'of eligible A‑Book profit goes to the trader.',
    'payouts.description': 'Only closed gains above starting balance, generated in A‑Book with no outstanding offset, enter the Reward calculation. Processing times are company claims, not independently audited performance.',
    'payouts.minimum': '$50',
    'payouts.processing': 'Typically 60 min · maximum 24h',
    'payouts.rule.1': 'No payout calendar or funded-stage minimum trading days.',
    'payouts.rule.2': 'RISE KYC and the Trader Agreement are required before funded activation.',
    'payouts.rule.3': 'An outstanding B‑Book offset blocks new profit share until fully recovered.',
    'trading.title': 'Simulated accounts use live-derived crypto and CFD pricing.',
    'trading.description': 'Fundex uses Bitunix for crypto perpetuals and the current platform-specific article names MarketMates for CFDs. Other official articles use inconsistent venue names; external routing or hedging remains solely Fundex’s own risk-management action.',
    'consider.eyebrow': 'Funded risk model',
    'consider.title': 'A‑Book and B‑Book change what profit is eligible.',
    'consider.1.title': 'A 1% drop can trigger B‑Book mode',
    'consider.1.description': 'The threshold is tied to original starting balance. Entering B‑Book is not itself a breach, but it changes reward eligibility.',
    'consider.2.title': 'Losses become an offset',
    'consider.2.description': 'Accumulated B‑Book offset must be recovered before the 70% trader share starts applying again.',
    'consider.3.title': 'Four unrecovered switches can breach the account',
    'consider.3.description': 'The counter resets only after the accumulated offset has been fully cleared.',
    'consider.4.title': '“A‑Book” does not make the user account live',
    'consider.4.description': 'The environment remains simulated; whether Fundex mirrors or hedges exposure externally is its own discretionary action.',
    'sources.unknowns': 'Legal entity, registration number, physical headquarters, governing law, complete CFD fee schedule, founder identities and independently audited payout statistics were not established by the captured official sources.',
  },
  operatingModel: {
    classification: contentFact('fundex-model', 'Operating model', 'Two-phase evaluation · simulated funded stage · discretionary risk mirroring'),
    summary: contentFact('fundex-model-summary', 'How it works', 'Evaluation results are simulated. At the funded stage, RiskDesk classifies activity into A‑Book or B‑Book episodes while Fundex decides independently whether to hedge or mirror exposure.'),
    lifecycle: [contentFact('fundex-lifecycle', 'Trader lifecycle', 'Purchase → Phase 1 → Phase 2 → RiskDesk review → KYC and agreement → funded simulation → eligible Reward request')],
    accountEnvironment: contentFact('fundex-environment', 'Account environment', 'Simulated account'),
    traderCompensation: contentFact('fundex-compensation', 'Trader compensation', '70% of eligible A‑Book profit after offsets'),
  },
  comparison: {
    modelTypes: ['evaluation'],
    capital: { status: 'varies', min: 10_000, max: 200_000, unit: 'USD', notes: 'Nominal evaluation account size.' },
    entryCost: { status: 'varies', min: 89, max: 1_139, unit: 'USD', notes: 'Captured pricing before temporary discounts.' },
    profitSplit: { status: 'known', min: 70, max: 70, unit: 'percent', notes: 'Applies only to eligible profit after A‑Book and offset conditions.' },
    maxDrawdown: { status: 'known', min: 10, max: 10, unit: 'percent', notes: 'Static from initial balance during evaluation.' },
    payoutSchedules: { status: 'known', values: ['on-demand'], notes: 'Company states typical 60-minute and maximum 24-hour processing.' },
    executionModels: { status: 'known', values: ['simulated', 'discretionary mirroring'], notes: 'User balances are simulated; Fundex may hedge its own exposure externally.' },
  },
  sections: [
    {
      id: 'overview', tabLabel: 'Brief', title: 'How Fundex works', description: 'The operating model before the individual constraints.',
      blocks: [
        { id: 'notebooklm-1', type: 'text', eyebrow: 'Decision brief', title: 'A simulated evaluation with a proprietary risk layer.', paragraphs: ['Fundex combines a conventional two-phase challenge with RiskDesk, a funded-stage system that changes reward eligibility according to A‑Book/B‑Book state and accumulated offset.'], status: 'reported' },
        { id: 'notebooklm-2', type: 'fact-grid', columns: 4, presentation: 'steps', items: [
          contentFact('fundex-step-1', '01', 'Pass Phase 1 · 8%'),
          contentFact('fundex-step-2', '02', 'Pass Phase 2 · 5%'),
          contentFact('fundex-step-3', '03', 'Complete review and KYC'),
          contentFact('fundex-step-4', '04', 'Earn eligible A‑Book Reward'),
        ] },
      ],
    },
    {
      id: 'offers', tabLabel: 'Challenges', title: 'Programs and pricing', description: 'One two-phase model across five account sizes.',
      blocks: [{ id: 'offer-records', type: 'record-list', presentation: 'records', items: [{ id: programs[0].id, eyebrow: '2-phase evaluation', title: programs[0].name }] }],
    },
    {
      id: 'payouts', tabLabel: 'Payouts', title: 'How payouts work', description: 'Reward access, timing and the offset condition.',
      blocks: [{ id: 'payout-facts', type: 'fact-grid', columns: 3, presentation: 'metrics', items: [
        contentFact('fundex-payout-split', 'Trader share', '70% of eligible profit'),
        contentFact('fundex-payout-minimum', 'Minimum', '$50'),
        contentFact('fundex-payout-processing', 'Company-stated processing', 'Typically 60 min · max 24h'),
      ] }],
    },
    {
      id: 'trading', tabLabel: 'Trading', title: 'Trading environment', description: 'Markets, platforms, permissions and evaluation constraints.',
      blocks: [{ id: 'trading-facts', type: 'fact-grid', columns: 3, presentation: 'details', items: [
        contentFact('fundex-terminal', 'Platform', 'Fundex web dashboard · Bitunix · MarketMates'),
        contentFact('fundex-assets', 'Markets', '200+ crypto pairs · forex · metals · stocks · ETFs · indices'),
        contentFact('fundex-leverage', 'Published leverage', 'Forex 16x · metals/BTC/ETH 4x · alts 2x'),
      ] }],
    },
    {
      id: 'risk-model', tabLabel: 'Risk model', title: 'A‑Book, B‑Book and offset', description: 'The Fundex-specific mechanism that controls reward eligibility.',
      blocks: [
        { id: 'fundex-risk-model', type: 'text', eyebrow: 'Funded mechanics', title: 'An internal classification, not a live account promise.', paragraphs: ['A drop below the documented threshold can start a B‑Book episode. Losses accumulated during these episodes form an offset, and new closed profit does not receive the trader share until that offset is fully cleared.'], status: 'reported' },
        { id: 'fundex-risk-facts', type: 'fact-grid', columns: 3, items: [
          contentFact('fundex-trigger', 'B‑Book trigger', '1% below original starting balance'),
          contentFact('fundex-recovery', 'Return condition', 'Recover to starting balance and clear offset'),
          contentFact('fundex-counter', 'Permanent breach', '4 consecutive unrecovered switches'),
        ] },
      ],
    },
    {
      id: 'sources', tabLabel: 'Sources', title: 'Sources and unresolved questions', description: 'Official source trail and remaining unknowns.',
      blocks: [{ id: 'source-claims', type: 'record-list', presentation: 'sources', items: [
        { id: 'fundex-source-site', title: 'Official website', links: [{ label: 'Open source', url: WEBSITE }] },
        { id: 'fundex-source-trade', title: 'Programs and pricing', links: [{ label: 'Open source', url: TRADE }] },
        { id: 'fundex-source-help', title: 'Help Center', links: [{ label: 'Open source', url: HELP }] },
        { id: 'fundex-source-execution', title: 'A‑Book and B‑Book explanation', links: [{ label: 'Open source', url: EXECUTION }] },
        { id: 'fundex-source-offset', title: 'Offset and recovery', links: [{ label: 'Open source', url: OFFSET }] },
      ] }],
    },
  ],
  sourcesInspected: [
    { category: 'website', url: WEBSITE, checkedAt: CHECKED_AT, outcome: 'accessed' },
    { category: 'pricing-checkout', url: TRADE, checkedAt: CHECKED_AT, outcome: 'accessed' },
    { category: 'faq', url: HELP, checkedAt: CHECKED_AT, outcome: 'accessed', notes: '73 official articles captured.' },
    { category: 'rulebook', url: EVALUATION, checkedAt: CHECKED_AT, outcome: 'accessed' },
    { category: 'payout-policy', url: PAYOUTS, checkedAt: CHECKED_AT, outcome: 'accessed' },
    { category: 'other', url: EXECUTION, checkedAt: CHECKED_AT, outcome: 'accessed' },
    { category: 'other', url: BBOOK_TRIGGER, checkedAt: CHECKED_AT, outcome: 'accessed' },
    { category: 'x-account', url: X, checkedAt: CHECKED_AT, outcome: 'accessed' },
  ],
  sourceDiscrepancies: [{
    id: 'fundex-cfd-venue-name-conflict', field: 'rulebook', label: 'Named CFD venue', kind: 'official-source-mismatch', status: 'resolved', resolutionBasis: 'specific-policy-preferred',
    canonical: { value: 'MarketMates', sourceUrl: PLATFORM, checkedAt: CHECKED_AT, sourceRole: 'canonical' },
    alternates: [
      { value: 'Pure Market', sourceUrl: HELP, checkedAt: CHECKED_AT, sourceRole: 'alternate' },
      { value: 'MarketMarket / MarketMates', sourceUrl: HELP, checkedAt: CHECKED_AT, sourceRole: 'alternate' },
    ],
    checkedAt: CHECKED_AT, notes: 'The current platform-specific article is treated as canonical; the conflicting names remain visible as alternates.',
  }],
};

export const FUNDEX_NORMALIZED_PROFILE: FirmNormalizedProfile = {
  version: 1,
  methodology: 'primary-sources-only',
  id: 'firm-fundex',
  slug: 'fundex',
  name: 'Fundex',
  checkedAt: CHECKED_AT,
  identity: {
    officialWebsite: reported(WEBSITE, WEBSITE),
    xHandle: reported('@Fundex', X),
    logo: reported('/firm-logos/fundex/logo.png', WEBSITE),
    tagline: reported('A-Book prop-firm evaluation with RiskDesk monitoring.', WEBSITE),
    description: reported('Fundex sells a two-phase simulated trading evaluation and calculates funded-stage rewards through its A‑Book/B‑Book and offset framework.', EVALUATION),
  },
  summary: {
    profitSplit: reported('70% of eligible A‑Book profit', PROFIT_SPLIT),
    maxDrawdown: reported('10% static during evaluation', MAX_DRAWDOWN),
    dailyDrawdown: reported('5% · reset at 00:00 UTC during evaluation', DAILY_LOSS),
    profitTarget: reported('Phase 1: 8% · Phase 2: 5%', TARGETS),
    minCapital: reported(10_000, TRADE),
    maxCapital: reported(200_000, TRADE),
    cryptoLeverage: reported('BTC/ETH 4x · altcoins 2x', LEVERAGE),
    payoutFrequency: reported('on-demand', PAYOUTS),
  },
  challengePrograms: reported(programs, EVALUATION),
  payoutPolicy: {
    schedule: reported('on-demand', PAYOUTS),
    profitSplitPercent: reported(70, PROFIT_SPLIT),
    minimumAmount: reported(50, PROFIT_SPLIT),
    currencies: nd<Array<'USD' | 'USDC' | 'USDT' | 'BTC' | 'ETH' | 'SOL'>>('The captured source names Rise and crypto payout rails but does not establish a single settlement token or network.', PAYOUTS),
    processingTimeHours: reported(24, PAYOUTS, 'Company states typical completion within 60 minutes and a maximum of 24 hours, including weekends.'),
    positionsMustBeClosed: nd('The captured payout articles do not clearly establish a universal closed-position requirement.', PAYOUTS),
    partialWithdrawalsAllowed: reported(true, PROFIT_SPLIT, 'Any amount at or above the $50 eligible Reward threshold may be requested.'),
    payoutResetsBalance: nd('The account-balance impact of a withdrawal was not stated clearly in the captured source set.', PAYOUTS),
    notes: reported('Eligible profit must be closed in A‑Book, above original starting balance and free of outstanding offset. Funded activation requires RISE KYC and the Trader Agreement.', PROFIT_SPLIT),
  },
  tradingPolicy: {
    platforms: reported(['Fundex web dashboard', 'Bitunix', 'MarketMates'], PLATFORM),
    markets: reported(['Crypto perpetuals', 'Forex', 'Metals', 'Stocks', 'ETFs', 'Indices'], PLATFORM),
    leverage: reported(['Forex 16x', 'Metals, BTC and ETH 4x', 'Altcoins 2x'], LEVERAGE),
    consistencyRule: reported('none', CONSISTENCY),
    profitDayDefinition: reported('A qualifying evaluation day requires a trade with notional size of at least 5% of starting balance.', MIN_DAYS),
    newsTrading: reported('allowed', HELP),
    weekendHolding: reported('allowed', HELP),
    automatedTrading: reported('restricted', HELP, 'Some automated systems are allowed, while prohibited strategies and execution abuse remain disallowed.'),
    copyTrading: reported('restricted', HELP),
    mandatoryStopLoss: nd('No universal mandatory-stop requirement was established.', HELP),
    tradingFees: reported('Crypto maker 0.02% · taker 0.06%; CFD schedule not captured.', FEES),
  },
  executionPolicy: {
    model: reported('hybrid', EXECUTION),
    venue: reported('Bitunix for crypto and MarketMates for CFDs', PLATFORM, 'Other official articles use inconsistent CFD venue names.'),
    onchainSettlement: nd('No public on-chain settlement or payout ledger was established.', WEBSITE),
    notes: reported('A‑Book and B‑Book describe Fundex internal risk handling. The user account remains simulated and Fundex decides whether to route or hedge its own exposure.', EXECUTION),
  },
  compliancePolicy: {
    legalEntity: nd('Legal entity was not established by the captured official sources.', WEBSITE),
    registrationJurisdiction: nd('Registration jurisdiction was not established by the captured official sources.', WEBSITE),
    regulatoryStatus: nd('No regulator or brokerage licence was established by the captured official sources.', WEBSITE),
    kycRequiredAt: reported('funded-activation', KYC),
    restrictedJurisdictions: reported(['Pakistan', 'Afghanistan', 'Myanmar', 'Iraq', 'Somalia', 'Sudan', 'South Sudan', 'Libya', 'Yemen', 'UAE', 'North Korea', 'Iran', 'Syria', 'Cuba', 'Belarus', 'Russia'], RESTRICTED),
    maximumAggregateFundedBalance: nd('No aggregate funded-capital ceiling was established.', HELP),
    simulatedAccounts: reported(true, EXECUTION),
  },
  tokenRewards: {
    hasToken: reported(false, WEBSITE),
    tokenTicker: nd('No Fundex token was documented.', WEBSITE),
    tokenSupply: nd('No Fundex token supply was documented.', WEBSITE),
    hasPoints: reported(false, WEBSITE),
    pointsProgramName: nd('No points program was documented.', WEBSITE),
    hasAirdrop: reported(false, WEBSITE),
    airdropStatus: reported('unconfirmed', WEBSITE),
    description: reported('Fundex documents a discretionary monthly participation bonus and a recurring affiliate program rather than a token or points system.', BONUS),
  },
  company: {
    yearEstablished: nd('Product launch year was not established by the captured official sources.', WEBSITE),
    headquarters: nd('Physical headquarters was not established by the captured official sources.', WEBSITE),
  },
  sourceDiscrepancies: FUNDEX_PAGE_PROFILE.sourceDiscrepancies,
  claims: observations,
  ndFields: [
    'payoutPolicy.positionsMustBeClosed',
    'payoutPolicy.payoutResetsBalance',
    'tradingPolicy.mandatoryStopLoss',
    'executionPolicy.onchainSettlement',
    'compliancePolicy.legalEntity',
    'compliancePolicy.registrationJurisdiction',
    'compliancePolicy.regulatoryStatus',
    'compliancePolicy.maximumAggregateFundedBalance',
    'company.yearEstablished',
    'company.headquarters',
  ],
  modularProfile: FUNDEX_PAGE_PROFILE,
};
