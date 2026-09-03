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

const CHECKED_AT = '2026-09-03T00:00:00.000Z';
const WEBSITE = 'https://acetrader.com/';
const PRICING = 'https://acetrader.com/pricing';
const DOCS = 'https://docs.acetrader.com/';
const DOCS_EXPORT = 'https://docs.acetrader.com/llms-full.txt';
const TRANSPARENCY = 'https://acetrader.com/transparency';
const REWARDS = 'https://acetrader.com/community-reward';
const TERMS = 'https://acetrader.com/terms';
const X = 'https://x.com/AceTrader';

function evidence(sourceUrl = DOCS, notes?: string): NormalizedEvidence[] {
  return [{ sourceUrl, checkedAt: CHECKED_AT, ...(notes ? { notes } : {}) }];
}

function reported<T>(value: T, sourceUrl = DOCS, notes?: string): NormalizedFact<T> {
  return { status: 'reported', value, evidence: evidence(sourceUrl, notes) };
}

function nd<T>(notes: string, sourceUrl = DOCS): NormalizedFact<T> {
  return { status: 'ND', value: 'ND', evidence: evidence(sourceUrl), notes };
}

function evaluationStage(): NormalizedChallengeStage {
  return {
    name: 'Paper Trading',
    profitTargetPercent: nd('Current plan-specific targets are not fully published. The docs include a Standard-plan example, not a universal target.'),
    minimumTradingDays: nd('The current minimum trading-day count is not clearly published.'),
    durationDays: nd('The evaluation has no stated completion deadline, but access is sold in recurring 30-day subscription cycles.', PRICING),
    funded: reported(false),
  };
}

function instantStage(): NormalizedChallengeStage {
  return {
    name: 'Trade Fund access',
    profitTargetPercent: nd('Instant Fund has no evaluation profit target.', PRICING),
    minimumTradingDays: reported(0, PRICING),
    durationDays: nd('No fixed account duration is stated.', PRICING),
    funded: reported(true, PRICING),
  };
}

function tier(accountSize: number, fee: number): NormalizedChallengeTier {
  return {
    accountSize: reported(accountSize, PRICING),
    fee: reported(fee, PRICING),
    originalFee: nd('No stable undiscounted comparison price was captured.', PRICING),
    currency: reported('USD', PRICING),
    available: reported(true, PRICING),
  };
}

const programs: NormalizedChallengeProgram[] = [
  {
    id: 'acetrader-evaluation-starter',
    name: 'Evaluation · Starter',
    kind: reported('evaluation', PRICING),
    stages: reported([evaluationStage()]),
    tiers: reported([tier(1_000, 9)], PRICING),
    dailyLossPercent: nd('No separate daily-loss rule was established.'),
    maxDrawdownPercent: reported(10, PRICING, '$100 MLL on $1,000 capital.'),
    maxDrawdownType: reported('trailing-high-water-mark'),
    fundedProfitSplitPercent: reported(80, PRICING, '90% when paying with $MEME or $HYPE.'),
    feeRefundable: reported(false, TERMS),
    noTimeLimit: reported(true, DOCS, 'The evaluation has no completion deadline, but the $9 subscription renews every 30 days.'),
    notes: reported('Recurring 30-day evaluation subscription with a 50% best-day consistency rule.'),
  },
  {
    id: 'acetrader-evaluation-standard-pro',
    name: 'Evaluation · Standard / Pro',
    kind: reported('evaluation', PRICING),
    stages: reported([evaluationStage()]),
    tiers: reported([tier(10_000, 99), tier(20_000, 169)], PRICING),
    dailyLossPercent: nd('No separate daily-loss rule was established.'),
    maxDrawdownPercent: reported(6, PRICING),
    maxDrawdownType: reported('trailing-high-water-mark'),
    fundedProfitSplitPercent: reported(80, PRICING, '90% when paying with $MEME or $HYPE.'),
    feeRefundable: reported(false, TERMS),
    noTimeLimit: reported(true, DOCS, 'Subscriptions renew every 30 days.'),
    notes: reported('Standard and Pro share a 6% MLL. Token payment increases nominal capital to $12K / $24K.'),
  },
  {
    id: 'acetrader-instant-lite-starter',
    name: 'Instant Fund · Lite / Starter',
    kind: reported('instant-funding', PRICING),
    stages: reported([instantStage()]),
    tiers: reported([tier(200, 9), tier(1_000, 49)], PRICING),
    dailyLossPercent: nd('No separate daily-loss rule was established.'),
    maxDrawdownPercent: reported(10, PRICING),
    maxDrawdownType: reported('trailing-high-water-mark'),
    fundedProfitSplitPercent: reported(80, PRICING, '90% when paying with $MEME or $HYPE.'),
    feeRefundable: reported(false, TERMS),
    noTimeLimit: reported(true, PRICING),
    notes: reported('One-time payment with immediate Trade Fund access and no evaluation phase.'),
  },
  {
    id: 'acetrader-instant-standard-pro',
    name: 'Instant Fund · Standard / Pro',
    kind: reported('instant-funding', PRICING),
    stages: reported([instantStage()]),
    tiers: reported([tier(10_000, 499), tier(20_000, 999)], PRICING),
    dailyLossPercent: nd('No separate daily-loss rule was established.'),
    maxDrawdownPercent: reported(6, PRICING),
    maxDrawdownType: reported('trailing-high-water-mark'),
    fundedProfitSplitPercent: reported(80, PRICING, '90% when paying with $MEME or $HYPE.'),
    feeRefundable: reported(false, TERMS),
    noTimeLimit: reported(true, PRICING),
    notes: reported('One-time payment. Token payment increases nominal capital to $12K / $24K.'),
  },
];

const observations: PrimaryResearchObservation[] = [
  { id: 'acetrader-model', field: 'terms', value: 'Evaluation is simulated. Trade Funds may be simulated or real at AceTrader discretion; capital remains firm-owned.', status: 'reported', sourceUrl: TERMS, checkedAt: CHECKED_AT },
  { id: 'acetrader-mll', field: 'rulebook', value: 'MLL is a trailing end-of-day high-water-mark floor, enforced intraday using realized and unrealized PnL.', status: 'reported', sourceUrl: DOCS, checkedAt: CHECKED_AT },
  { id: 'acetrader-payout-current', field: 'payoutPolicy', value: 'Current pricing advertises 0 winning days and a $0 safety net; the older FAQ still publishes previous thresholds.', status: 'reported', sourceUrl: PRICING, checkedAt: CHECKED_AT },
  { id: 'acetrader-transparency', field: 'payoutPolicy', value: 'Company transparency page reports $94,524.50 across 73 payouts and exposes transaction rows.', status: 'reported', sourceUrl: TRANSPARENCY, checkedAt: CHECKED_AT },
  { id: 'acetrader-reward', field: 'tokenRewards', value: 'Community Reward is a monthly draw for nominal Instant Fund allocations; $1 spent equals one ticket.', status: 'reported', sourceUrl: REWARDS, checkedAt: CHECKED_AT },
];

const contentFact = (id: string, label: string, value: string, note?: string): FirmContentFact => ({
  id, label, value, status: 'reported', ...(note ? { note } : {}),
});

export const ACETRADER_PAGE_PROFILE: FirmNormalizedProfileV2 = {
  version: 2,
  contentStage: 'editorial',
  methodology: 'primary-sources-only',
  researchStandard: 'model-first-v1',
  researchMode: 'agent-assisted',
  id: 'firm-acetrader',
  slug: 'acetrader',
  name: 'AceTrader',
  checkedAt: CHECKED_AT,
  modelTypes: ['evaluation', 'instant-funding', 'competition'],
  offerNames: ['Evaluation', 'Instant Fund', 'AceTrade Arena'],
  editorialCopy: {
    'promo.code': '',
    'decision.title': 'Two routes to a firm-controlled Trade Fund.',
    'decision.description': 'AceTrader pairs a low-cost recurring Evaluation with one-time Instant Fund access. Paper Trading is simulated; a Trade Fund may be simulated or real at AceTrader’s discretion, while capital ownership and account control remain with the firm.',
    'decision.highlight': 'The headline entry price is low, but the trailing MLL and payout-source conflict deserve more attention than the fee.',
    'process.title': 'Choose evaluation or direct access',
    'process.description': 'Both paths converge on the same Trade Fund risk and payout framework.',
    'process.1.title': 'Choose the access route',
    'process.1.description': 'Subscribe to Evaluation every 30 days or buy Instant Fund once.',
    'process.2.title': 'Meet the applicable rules',
    'process.2.description': 'Evaluation adds a plan-specific target and 50% best-day consistency; Instant Fund skips qualification.',
    'process.3.title': 'Receive Trade Fund access',
    'process.3.description': 'Complete KYC and trade within the trailing MLL and official market allowlist.',
    'process.4.title': 'Build an eligible payout balance',
    'process.4.description': 'Closed profit, withdrawable balance and any applicable safety net determine the request amount.',
    'programs.title': 'Subscription evaluation or one-time Instant Fund.',
    'programs.description': 'Starter uses a 10% MLL; Standard and Pro use 6%. Exact current evaluation targets are not fully published, so they remain unstated here.',
    'programs.note': 'Fees are non-refundable. $MEME or $HYPE payment raises Standard / Pro capital to $12K / $24K and the profit split to 90%.',
    'payouts.title': 'base profit split goes to the trader.',
    'payouts.description': 'Current pricing advertises zero winning days and no minimum safety net. The GitBook FAQ still contains older 3–5-day and safety-net rules, so the source conflict remains visible.',
    'payouts.minimum': '$20 Starter · $50 Lite',
    'payouts.processing': 'Company average: 2.3 days',
    'payouts.rule.1': 'Payouts settle in USDC on Arbitrum to an EVM wallet.',
    'payouts.rule.2': 'The formula is capped by closed PnL and the withdrawable balance.',
    'payouts.rule.3': 'MLL or unlisted-asset breach can suspend pending payouts.',
    'trading.title': 'Hyperliquid infrastructure with a strict market allowlist.',
    'trading.description': 'Paper Trading is simulated. Trade Fund transactions may be simulated or real through firm-controlled infrastructure. Accounts use isolated margin and one-way mode; leverage and several permission rules are not fully published.',
    'consider.eyebrow': 'Risk and evidence',
    'consider.title': 'Four details that materially change the offer.',
    'consider.1.title': 'MLL trails end-of-day highs',
    'consider.1.description': 'The floor advances after new end-of-day wallet-balance highs, never moves down and caps at starting balance; intraday equity can breach it.',
    'consider.2.title': 'Pricing and FAQ disagree',
    'consider.2.description': 'Pricing shows 0 winning days and $0 safety net, while the older payout FAQ still documents 3–5 days and plan-based reserves.',
    'consider.3.title': 'The allowlist is a hard rule',
    'consider.3.description': 'Trading an unlisted coin is a breach that closes access and can suspend outstanding payouts.',
    'consider.4.title': 'Transparency is useful but company-published',
    'consider.4.description': 'The page exposes payout transactions and reports $94,524.50 across 73 payouts, but it is not a proof-of-reserves or solvency audit.',
    'rewards.title': 'Every purchase becomes a monthly draw entry.',
    'rewards.description': 'AceTrader converts spend into tickets for a monthly Community Reward draw. The advertised pool is access to nominal Instant Fund capital, not a cash prize or token allocation.',
    'sources.unknowns': 'legal entity and incorporation jurisdiction, current plan-specific evaluation targets and minimum days, leverage bands, public trading-fee table, news/weekend/copy-trading permissions, automation policy and independently audited capital reserves.',
  },
  operatingModel: {
    classification: contentFact('acetrader-model', 'Operating model', 'Evaluation subscription · Instant Fund · firm-controlled Trade Fund'),
    summary: contentFact('acetrader-summary', 'How it works', 'Evaluation qualifies traders in simulation. Instant Fund skips that phase. AceTrader then assigns a revocable mandate over a simulated or real Trade Fund that it owns and controls.'),
    lifecycle: [contentFact('acetrader-lifecycle', 'Trader lifecycle', 'Purchase → evaluation or direct access → KYC → Trade Fund → eligible USDC payout')],
    accountEnvironment: contentFact('acetrader-environment', 'Account environment', 'Simulated evaluation · simulated or real Trade Fund at firm discretion'),
    traderCompensation: contentFact('acetrader-compensation', 'Trader compensation', '80% base · 90% with $MEME / $HYPE payment'),
  },
  comparison: {
    modelTypes: ['evaluation', 'instant-funding', 'competition'],
    capital: { status: 'varies', min: 200, max: 24_000, unit: 'USD', notes: '$24K applies to Pro when paying with $MEME or $HYPE.' },
    entryCost: { status: 'varies', min: 9, max: 999, unit: 'USD', notes: 'Evaluation is recurring every 30 days; Instant Fund is one-time.' },
    profitSplit: { status: 'varies', min: 80, max: 90, unit: 'percent', notes: '90% requires payment with $MEME or $HYPE.' },
    maxDrawdown: { status: 'varies', min: 6, max: 10, unit: 'percent', notes: 'Trailing MLL: 10% Lite/Starter, 6% Standard/Pro.' },
    payoutSchedules: { status: 'known', values: ['on-demand'], notes: 'Subject to payout criteria and source-version conflict.' },
    executionModels: { status: 'varies', values: ['simulated', 'firm-controlled real execution'], notes: 'Trade Fund mode is assigned by AceTrader.' },
  },
  sections: [
    { id: 'overview', tabLabel: 'Brief', title: 'How AceTrader works', description: 'The operating model before individual constraints.', blocks: [
      { id: 'notebooklm-1', type: 'text', eyebrow: 'Decision brief', title: 'Evaluation or direct access to a firm-controlled mandate.', paragraphs: ['AceTrader separates qualification from capital access: Evaluation is a recurring simulation, while Instant Fund skips qualification. The resulting Trade Fund can be simulated or real, but remains owned and controlled by AceTrader.'], status: 'reported' },
      { id: 'notebooklm-2', type: 'fact-grid', columns: 4, presentation: 'steps', items: [
        contentFact('acetrader-step-1', '01', 'Choose Evaluation or Instant'),
        contentFact('acetrader-step-2', '02', 'Meet the applicable rules'),
        contentFact('acetrader-step-3', '03', 'Complete KYC'),
        contentFact('acetrader-step-4', '04', 'Build eligible payout balance'),
      ] },
    ] },
    { id: 'offers', tabLabel: 'Plans', title: 'Programs and pricing', description: 'Two access routes across four capital tiers.', blocks: [{ id: 'offer-records', type: 'record-list', presentation: 'records', items: programs.map((program) => ({ id: program.id, title: program.name })) }] },
    { id: 'payouts', tabLabel: 'Payouts', title: 'How payouts work', description: 'Profit split, settlement and unresolved source conflict.', blocks: [{ id: 'payout-facts', type: 'fact-grid', columns: 3, presentation: 'metrics', items: [
      contentFact('acetrader-split', 'Base split', '80%'), contentFact('acetrader-rail', 'Settlement', 'Arbitrum USDC'), contentFact('acetrader-minimum', 'Published minimum', '$20 Starter · $50 Lite'),
    ] }] },
    { id: 'trading', tabLabel: 'Trading', title: 'Trading environment', description: 'Execution, account mode and market allowlist.', blocks: [{ id: 'trading-facts', type: 'fact-grid', columns: 3, presentation: 'details', items: [
      contentFact('acetrader-venue', 'Infrastructure', 'Hyperliquid · proprietary frontend'), contentFact('acetrader-mode', 'Account mode', 'Isolated margin · one-way'), contentFact('acetrader-assets', 'Published allowlist', '33 crypto · 25 HIP-3 synthetics'),
    ] }] },
    { id: 'risk-model', tabLabel: 'Risk & proof', title: 'MLL, source conflicts and transparency', description: 'Decision-critical details beyond headline pricing.', blocks: [{ id: 'risk-facts', type: 'fact-grid', columns: 4, items: [
      contentFact('acetrader-risk-1', 'MLL', 'Trailing EOD high-water mark'), contentFact('acetrader-risk-2', 'Consistency', 'Best day ≤ 50% of realized profit'), contentFact('acetrader-risk-3', 'Company-reported payouts', '$94,524.50 · 73 payouts'), contentFact('acetrader-risk-4', 'Community reward', 'Monthly nominal Trade Fund draw'),
    ] }] },
    { id: 'rewards', tabLabel: 'Rewards', title: 'Community Reward', description: 'Monthly draw mechanics and advertised nominal pool.', blocks: [{ id: 'reward-facts', type: 'fact-grid', columns: 4, items: [
      contentFact('acetrader-reward-entry', 'Entry', '$1 spent = 1 ticket'),
      contentFact('acetrader-reward-cycle', 'Draw', 'Monthly'),
      contentFact('acetrader-reward-pool', 'Advertised maximum', '$330K in Instant Funds'),
      contentFact('acetrader-reward-form', 'Reward form', 'Trade Fund allocation · not cash'),
    ] }] },
    { id: 'sources', tabLabel: 'Sources', title: 'Sources and unresolved questions', description: 'Official source trail and remaining unknowns.', blocks: [{ id: 'source-claims', type: 'record-list', presentation: 'sources', items: [
      { id: 'acetrader-site', title: 'Official website', links: [{ label: 'Open source', url: WEBSITE }] },
      { id: 'acetrader-pricing', title: 'Pricing and current payout criteria', links: [{ label: 'Open source', url: PRICING }] },
      { id: 'acetrader-docs', title: 'Official documentation', links: [{ label: 'Open source', url: DOCS }] },
      { id: 'acetrader-transparency', title: 'Payout transparency', links: [{ label: 'Open source', url: TRANSPARENCY }] },
      { id: 'acetrader-terms', title: 'Terms of Use', links: [{ label: 'Open source', url: TERMS }] },
    ] }] },
  ],
  sourcesInspected: [
    { category: 'website', url: WEBSITE, checkedAt: CHECKED_AT, outcome: 'accessed' },
    { category: 'pricing-checkout', url: PRICING, checkedAt: CHECKED_AT, outcome: 'accessed' },
    { category: 'faq', url: DOCS_EXPORT, checkedAt: CHECKED_AT, outcome: 'accessed', notes: 'Official full-text GitBook export.' },
    { category: 'payout-policy', url: TRANSPARENCY, checkedAt: CHECKED_AT, outcome: 'accessed' },
    { category: 'token-rewards', url: REWARDS, checkedAt: CHECKED_AT, outcome: 'accessed' },
    { category: 'terms', url: TERMS, checkedAt: CHECKED_AT, outcome: 'accessed' },
    { category: 'x-account', url: X, checkedAt: CHECKED_AT, outcome: 'accessed' },
  ],
  sourceDiscrepancies: [{
    id: 'acetrader-payout-criteria-conflict', field: 'payoutPolicy', label: 'Winning days and safety net', kind: 'official-source-mismatch', status: 'resolved', resolutionBasis: 'specific-policy-preferred',
    canonical: { value: '0 winning days and $0 safety net', sourceUrl: PRICING, checkedAt: CHECKED_AT, sourceRole: 'canonical' },
    alternates: [{ value: '3–5 winning days and MLL-based safety net', sourceUrl: DOCS, checkedAt: CHECKED_AT, sourceRole: 'alternate' }],
    checkedAt: CHECKED_AT, notes: 'The current pricing page is treated as the active offer while the older FAQ remains visible as an unresolved operational risk.',
  }],
};

export const ACETRADER_NORMALIZED_PROFILE: FirmNormalizedProfile = {
  version: 1,
  methodology: 'primary-sources-only',
  id: 'firm-acetrader',
  slug: 'acetrader',
  name: 'AceTrader',
  checkedAt: CHECKED_AT,
  identity: {
    officialWebsite: reported(WEBSITE, WEBSITE),
    xHandle: reported('@AceTrader', X),
    logo: reported('/firm-logos/acetrader/logo.png', WEBSITE),
    tagline: reported('Our Fund. Your Edge.', WEBSITE),
    description: reported('AceTrader offers subscription evaluation and one-time Instant Fund access to firm-controlled Trade Funds.', WEBSITE),
  },
  summary: {
    profitSplit: reported('80% base · 90% with $MEME / $HYPE', PRICING),
    maxDrawdown: reported('10% Lite/Starter · 6% Standard/Pro · trailing EOD HWM', PRICING),
    dailyDrawdown: nd('No separate daily-loss limit was established.'),
    profitTarget: nd('Current plan-specific evaluation targets are not fully published.'),
    minCapital: reported(200, PRICING),
    maxCapital: reported(24_000, PRICING, 'Token-payment Pro tier; standard USD plan is $20K.'),
    cryptoLeverage: nd('Current leverage bands were not published in the captured official sources.'),
    payoutFrequency: reported('on-demand', PRICING),
  },
  challengePrograms: reported(programs, PRICING),
  payoutPolicy: {
    schedule: reported('on-demand', PRICING),
    profitSplitPercent: reported(80, PRICING, '90% with $MEME or $HYPE payment.'),
    minimumAmount: reported(20, PRICING, 'Starter minimum. Lite is $50; other tier mapping was not clear in captured text.'),
    currencies: reported(['USDC'], DOCS),
    processingTimeHours: reported(55.2, TRANSPARENCY, 'Company reports a 2.3-day average processing time.'),
    positionsMustBeClosed: reported(false, DOCS, 'The formula supports active positions by capping payout at the withdrawable balance.'),
    partialWithdrawalsAllowed: reported(true, DOCS),
    payoutResetsBalance: reported(false, DOCS, 'A safety net may remain; current pricing advertises $0 while older FAQ documents a reserve.'),
    notes: reported('Arbitrum USDC payout to an EVM wallet. Current pricing and older FAQ conflict on winning days and safety net.', PRICING),
  },
  tradingPolicy: {
    platforms: reported(['AceTrader web platform', 'Hyperliquid'], DOCS),
    markets: reported(['Crypto perpetuals', 'HIP-3 synthetic stocks', 'Indices', 'Commodities'], DOCS),
    leverage: nd('Current leverage bands were not published.'),
    consistencyRule: reported('applies', DOCS, 'Evaluation best-day profit must not exceed 50% of total realized profit.'),
    profitDayDefinition: reported('A winning day uses at least $100 in closed PnL in the older payout FAQ; current pricing advertises zero required winning days.', DOCS),
    newsTrading: nd('No current public news-trading rule was established.'),
    weekendHolding: nd('No current public weekend-holding rule was established.'),
    automatedTrading: nd('The captured docs contain an automation heading but no usable policy.'),
    copyTrading: nd('No current public copy-trading rule was established.'),
    mandatoryStopLoss: nd('No universal mandatory-stop requirement was established.'),
    tradingFees: nd('No complete public trading-fee table was established.'),
  },
  executionPolicy: {
    model: reported('hybrid', TERMS),
    venue: reported('Hyperliquid and AceTrader proprietary infrastructure', DOCS),
    onchainSettlement: reported(true, DOCS, 'Payouts settle in Arbitrum USDC; company transparency page exposes transaction hashes.'),
    notes: reported('Evaluation is simulated. Trade Fund transactions may be simulated or real, as assigned by AceTrader; any real funds remain firm-owned.', TERMS),
  },
  compliancePolicy: {
    legalEntity: nd('The captured Terms do not identify the contracting legal entity.', TERMS),
    registrationJurisdiction: nd('The captured Terms do not state incorporation jurisdiction.', TERMS),
    regulatoryStatus: reported('Not a wallet provider, exchange, broker, financial institution or creditor.', TERMS),
    kycRequiredAt: reported('funded-activation', TERMS),
    restrictedJurisdictions: reported(['United States', 'China', 'Ontario', 'Afghanistan', 'Belarus', 'Central African Republic', 'DR Congo', 'Cote d’Ivoire', 'Crimea', 'Cuba', 'El Salvador', 'Iran', 'Iraq', 'Libya', 'Myanmar', 'North Korea', 'Syria', 'Venezuela', 'Yemen', 'Zimbabwe'], TERMS, 'Abbreviated display list; Terms also apply broader sanctions and legality tests.'),
    maximumAggregateFundedBalance: reported(24_000, PRICING, 'Highest single published nominal tier with $MEME/$HYPE payment; aggregate account policy not separately established.'),
    simulatedAccounts: reported(true, TERMS, 'Evaluation is always simulated; Trade Fund may be simulated or real.'),
  },
  tokenRewards: {
    hasToken: reported(false, WEBSITE),
    tokenTicker: nd('No AceTrader token is documented.', WEBSITE),
    tokenSupply: nd('No token supply is documented.', WEBSITE),
    hasPoints: reported(false, WEBSITE),
    pointsProgramName: nd('No points program is documented.', WEBSITE),
    hasAirdrop: reported(false, WEBSITE),
    airdropStatus: reported('unconfirmed', WEBSITE),
    description: reported('Community Reward is a monthly draw for nominal Instant Fund allocations; the referral program pays monthly USDC rebates.', REWARDS),
  },
  company: {
    yearEstablished: nd('Founding year was not established by the captured official sources.', WEBSITE),
    headquarters: nd('Headquarters was not established by the captured official sources.', TERMS),
  },
  sourceDiscrepancies: ACETRADER_PAGE_PROFILE.sourceDiscrepancies,
  claims: observations,
  ndFields: [
    'summary.dailyDrawdown', 'summary.profitTarget', 'summary.cryptoLeverage',
    'tradingPolicy.leverage', 'tradingPolicy.newsTrading', 'tradingPolicy.weekendHolding',
    'tradingPolicy.automatedTrading', 'tradingPolicy.copyTrading', 'tradingPolicy.mandatoryStopLoss',
    'tradingPolicy.tradingFees', 'compliancePolicy.legalEntity', 'compliancePolicy.registrationJurisdiction',
    'company.yearEstablished', 'company.headquarters',
  ],
  modularProfile: ACETRADER_PAGE_PROFILE,
};
