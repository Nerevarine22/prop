import { FIRM_NORMALIZED_PROFILES_BY_SLUG } from './firmNormalizedProfiles';
import type {
  FirmContentFact,
  FirmNormalizedProfile,
  FirmNormalizedProfileV2,
  NormalizedChallengeProgram,
  NormalizedChallengeStage,
  NormalizedChallengeTier,
  NormalizedFact,
} from '@/types/database';

const CHECKED_AT = '2026-09-03T00:00:00.000Z';

const BREAKOUT_SITE = 'https://www.breakoutprop.com/';
const BREAKOUT_PRICING = 'https://www.breakoutprop.com/pricing/';
const BREAKOUT_RULES = 'https://www.breakoutprop.com/program-rules/';
const BREAKOUT_PAYOUT = 'https://intercom.help/breakoutprop/en/articles/11647224-when-can-i-request-a-payout-from-my-funded-account';
const BREAKOUT_TERMS = 'https://www.breakoutprop.com/terms-of-use/';

const CHAIN_SITE = 'https://www.chainfunded.io/';
const CHAIN_FAQ = 'https://www.chainfunded.io/FAQ';
const CHAIN_TERMS = 'https://www.chainfunded.io/terms-and-conditions.md';
const CHAIN_REWARDS = 'https://www.chainfunded.io/cfg-rewards';

function evidence(sourceUrl: string, notes?: string) {
  return [{ sourceUrl, checkedAt: CHECKED_AT, ...(notes ? { notes } : {}) }];
}

function reported<T>(value: T, sourceUrl: string, notes?: string): NormalizedFact<T> {
  return { status: 'reported', value, evidence: evidence(sourceUrl, notes) };
}

function nd<T>(notes: string, sourceUrl: string): NormalizedFact<T> {
  return { status: 'ND', value: 'ND', evidence: evidence(sourceUrl), notes };
}

function fact(id: string, label: string, value: string, note?: string): FirmContentFact {
  return { id, label, value, status: 'reported', ...(note ? { note } : {}) };
}

function stage(name: string, target: number, sourceUrl: string, minimumDays = 0): NormalizedChallengeStage {
  return {
    name,
    profitTargetPercent: reported(target, sourceUrl),
    minimumTradingDays: reported(minimumDays, sourceUrl),
    durationDays: nd('No maximum completion deadline is stated.', sourceUrl),
    funded: reported(false, sourceUrl),
  };
}

function tier(accountSize: number, fee: number, sourceUrl: string): NormalizedChallengeTier {
  return {
    accountSize: reported(accountSize, sourceUrl),
    fee: reported(fee, sourceUrl),
    originalFee: nd('No stable comparison price is used.', sourceUrl),
    currency: reported('USD', sourceUrl),
    available: reported(true, sourceUrl),
  };
}

function breakoutProgram(
  id: string,
  name: string,
  target: number,
  drawdown: number,
  tiers: NormalizedChallengeTier[],
): NormalizedChallengeProgram {
  return {
    id,
    name,
    kind: reported('evaluation', BREAKOUT_RULES),
    stages: reported([stage('Evaluation', target, BREAKOUT_RULES)], BREAKOUT_RULES),
    tiers: reported(tiers, BREAKOUT_PRICING),
    dailyLossPercent: reported(3, BREAKOUT_RULES),
    maxDrawdownPercent: reported(drawdown, BREAKOUT_RULES),
    maxDrawdownType: reported('static', BREAKOUT_RULES),
    fundedProfitSplitPercent: reported(80, BREAKOUT_PRICING, 'A permanent 90% split is available only as a checkout add-on.'),
    feeRefundable: reported(false, BREAKOUT_PRICING, 'Evaluation fees are non-refundable after trading begins; active evaluations are refunded if KYC is rejected.'),
    noTimeLimit: reported(true, BREAKOUT_RULES),
    notes: reported('No minimum trading days. The account can pass as soon as the target is reached without breaching an equity limit.', BREAKOUT_RULES),
  };
}

const breakoutPrograms: NormalizedChallengeProgram[] = [
  breakoutProgram('breakout-classic', '1-Step Classic', 10, 6, [tier(5_000, 85, BREAKOUT_PRICING), tier(100_000, 800, BREAKOUT_PRICING)]),
  breakoutProgram('breakout-pro', '1-Step Pro', 12, 5, [tier(5_000, 65, BREAKOUT_PRICING), tier(100_000, 545, BREAKOUT_PRICING)]),
  breakoutProgram('breakout-turbo', '1-Step Turbo', 9, 3, [tier(5_000, 40, BREAKOUT_PRICING), tier(100_000, 330, BREAKOUT_PRICING)]),
];

const chainPrograms: NormalizedChallengeProgram[] = [{
  id: 'chainfunded-two-phase',
  name: 'Two-Phase Evaluation',
  kind: reported('evaluation', CHAIN_FAQ),
  stages: reported([stage('Phase 1', 10, CHAIN_FAQ, 4), stage('Phase 2', 5, CHAIN_FAQ, 4)], CHAIN_FAQ),
  tiers: reported([{
    accountSize: reported(1_000, CHAIN_FAQ),
    fee: reported(20, CHAIN_FAQ),
    originalFee: nd('No comparison price is documented.', CHAIN_FAQ),
    currency: reported('USDC', CHAIN_FAQ),
    available: reported(true, CHAIN_FAQ),
  }], CHAIN_FAQ, 'The published range extends to $200K, but the complete current tier-price matrix was not captured.'),
  dailyLossPercent: reported(5, CHAIN_FAQ),
  maxDrawdownPercent: reported(10, CHAIN_FAQ),
  maxDrawdownType: nd('The official material did not clearly state balance/equity basis or static/trailing behavior.', CHAIN_FAQ),
  fundedProfitSplitPercent: reported(80, CHAIN_FAQ),
  feeRefundable: nd('Refund conditions were not established.', CHAIN_TERMS),
  noTimeLimit: nd('No reliable current completion deadline was established.', CHAIN_FAQ),
  notes: reported('Rules are described as fixed in the smart contract when the challenge is registered.', CHAIN_FAQ),
}];

export const BREAKOUT_PAGE_PROFILE: FirmNormalizedProfileV2 = {
  version: 2,
  contentStage: 'editorial',
  methodology: 'primary-sources-only',
  researchStandard: 'model-first-v1',
  researchMode: 'agent-assisted',
  id: 'firm-breakout',
  slug: 'breakout',
  name: 'Breakout',
  checkedAt: CHECKED_AT,
  modelTypes: ['evaluation'],
  offerNames: ['1-Step Classic', '1-Step Pro', '1-Step Turbo'],
  editorialCopy: {
    'promo.code': '',
    'decision.title': 'Three one-step evaluations, one simulated risk engine.',
    'decision.description': 'Breakout sells one-time crypto evaluation accounts. Passing opens a Breakout Account eligible for performance payouts, but the trader never owns the account or market positions; Payward Oceanic may simulate or route trade ideas at its discretion.',
    'decision.highlight': 'Classic buys the widest loss buffer; Turbo buys the lowest fee. Pro sits between them but asks for the highest target.',
    'process.title': 'From evaluation to performance split',
    'process.description': 'The path is short, but funded access still depends on identity checks and a separate agreement.',
    'process.1.title': 'Choose the risk envelope',
    'process.1.description': 'Classic, Pro and Turbo trade fee against profit target and static drawdown room.',
    'process.2.title': 'Reach the target',
    'process.2.description': 'There are no minimum trading days or completion deadline; equity limits remain active continuously.',
    'process.3.title': 'Complete funded onboarding',
    'process.3.description': 'Pass KYC, provide proof of residence and sign the Funded Trader Agreement.',
    'process.4.title': 'Request eligible profit',
    'process.4.description': 'Close positions and request at least $50 after the split for USDC ERC-20 settlement.',
    'programs.title': 'Pay for the loss buffer your strategy actually needs.',
    'programs.description': 'All current products are one-step, use a 3% daily equity-loss limit and have no minimum trading days. Static drawdown is the main differentiator.',
    'programs.note': 'Current July 2026 rules list only Classic, Pro and Turbo. The previously documented 2-Step offer is not shown as an active program.',
    'payouts.title': 'base profit split goes to the trader.',
    'payouts.description': 'Payouts are marketed as on-demand, but the detailed procedure still requires POL review before wallet submission and payment.',
    'payouts.minimum': '$50 after split',
    'payouts.processing': 'No fixed SLA',
    'payouts.rule.1': 'All positions must be closed before the request.',
    'payouts.rule.2': 'USDC is paid on Ethereum (ERC-20).',
    'payouts.rule.3': 'Marketing “no approval delay” conflicts with the documented POL approval step.',
    'trading.title': 'Crypto-first execution with live-market constraints.',
    'trading.description': 'Accounts use simulated capital in an environment intended to reflect live liquidity. Breakout may apply latency and obtains data/liquidity from third-party providers; funded trade ideas may remain internal or be routed by POL.',
    'consider.eyebrow': 'Risk and evidence',
    'consider.title': 'Four details that change how the offer should be read.',
    'consider.1.title': 'Daily loss resets from balance',
    'consider.1.description': 'At 00:30 UTC the next limit is set 3% below balance, then enforced in real time against equity including open PnL.',
    'consider.2.title': 'Payout wording is inconsistent',
    'consider.2.description': 'Pricing says no approval delay, while the funded-account procedure documents POL approval before payment details are submitted.',
    'consider.3.title': 'Copy trading is broadly prohibited',
    'consider.3.description': 'Third-party ideas, signals, cross-account hedging and strategies difficult to replicate live can trigger breach and forfeiture.',
    'consider.4.title': 'Funded does not mean account ownership',
    'consider.4.description': 'POL decides whether a trade idea is an internal book entry or a market-facing trade; the trader has no ownership interest in either.',
    'sources.unknowns': 'a complete live fee matrix for every account size, a binding payout-processing SLA, independent payout/reserve verification and the exact funded routing decision for any individual trade.',
  },
  operatingModel: {
    classification: fact('breakout-model', 'Operating model', 'One-step retail evaluation · discretionary funded routing'),
    summary: fact('breakout-summary', 'How it works', 'Buy a simulated evaluation, pass its equity constraints, complete KYC and receive a revocable Breakout Account eligible for a performance split.'),
    lifecycle: [fact('breakout-lifecycle', 'Trader lifecycle', 'Purchase → simulated evaluation → KYC/agreement → Breakout Account → USDC payout')],
    accountEnvironment: fact('breakout-environment', 'Account environment', 'Simulated capital · live-liquidity constraints'),
    traderCompensation: fact('breakout-compensation', 'Trader compensation', '80% base · 90% checkout add-on'),
  },
  comparison: {
    modelTypes: ['evaluation'],
    capital: { status: 'varies', min: 5_000, max: 200_000, unit: 'USD', notes: 'Classic caps at $100K; Pro and Turbo extend to $200K.' },
    entryCost: { status: 'varies', min: 40, max: 800, unit: 'USD', notes: 'Captured current examples across $5K and $100K tiers.' },
    profitSplit: { status: 'varies', min: 80, max: 90, unit: 'percent', notes: '90% requires checkout add-on.' },
    maxDrawdown: { status: 'varies', min: 3, max: 6, unit: 'percent', notes: 'Static from starting balance.' },
    payoutSchedules: { status: 'known', values: ['on-demand'] },
    executionModels: { status: 'varies', values: ['simulated', 'firm-routed'], notes: 'POL chooses whether funded ideas are internal or market-facing.' },
  },
  sections: [
    { id: 'overview', tabLabel: 'Brief', title: 'How Breakout works', blocks: [{ id: 'notebooklm-1', type: 'text', title: 'One step to a firm-controlled account.', paragraphs: ['Three one-step evaluations share the same daily-loss rule but differ in target, price and static drawdown.'], status: 'reported' }] },
    { id: 'offers', tabLabel: 'Challenges', title: 'Programs and pricing', blocks: [{ id: 'offer-records', type: 'record-list', presentation: 'records', items: breakoutPrograms.map((program) => ({ id: program.id, title: program.name })) }] },
    { id: 'payouts', tabLabel: 'Payouts', title: 'How payouts work', blocks: [{ id: 'payout-facts', type: 'fact-grid', columns: 3, items: [fact('breakout-split', 'Base split', '80%'), fact('breakout-minimum', 'Minimum', '$50 after split'), fact('breakout-rail', 'Rail', 'USDC · Ethereum')] }] },
    { id: 'trading', tabLabel: 'Trading', title: 'Trading environment', blocks: [{ id: 'trading-facts', type: 'fact-grid', columns: 3, items: [fact('breakout-platform', 'Platform', 'Breakout Terminal · DXtrade'), fact('breakout-markets', 'Markets', '63 published instruments'), fact('breakout-leverage', 'Leverage', 'BTC 10x · selected 5x/3x · others 2x')] }] },
    { id: 'risk-model', tabLabel: 'Risk & proof', title: 'Risk and evidence', blocks: [{ id: 'risk-facts', type: 'fact-grid', columns: 4, items: [fact('breakout-risk-dd', 'Maximum drawdown', '3–6% static'), fact('breakout-risk-daily', 'Daily loss', '3% · 00:30 UTC reset'), fact('breakout-risk-fees', 'Trading fee', '0.04% per side'), fact('breakout-risk-swap', 'Swap', '0.033% per day')] }] },
    { id: 'sources', tabLabel: 'Sources', title: 'Sources and unresolved questions', blocks: [{ id: 'source-claims', type: 'record-list', presentation: 'sources', items: [
      { id: 'breakout-site', title: 'Official website', links: [{ label: 'Open source', url: BREAKOUT_SITE }] },
      { id: 'breakout-pricing', title: 'Current pricing', links: [{ label: 'Open source', url: BREAKOUT_PRICING }] },
      { id: 'breakout-rules', title: 'Program Rules · updated 29 Jul 2026', links: [{ label: 'Open source', url: BREAKOUT_RULES }] },
      { id: 'breakout-payout', title: 'Funded payout procedure', links: [{ label: 'Open source', url: BREAKOUT_PAYOUT }] },
    ] }] },
  ],
  sourcesInspected: [
    { category: 'website', url: BREAKOUT_SITE, checkedAt: CHECKED_AT, outcome: 'accessed' },
    { category: 'pricing-checkout', url: BREAKOUT_PRICING, checkedAt: CHECKED_AT, outcome: 'accessed' },
    { category: 'rulebook', url: BREAKOUT_RULES, checkedAt: CHECKED_AT, outcome: 'accessed' },
    { category: 'payout-policy', url: BREAKOUT_PAYOUT, checkedAt: CHECKED_AT, outcome: 'accessed' },
    { category: 'terms', url: BREAKOUT_TERMS, checkedAt: CHECKED_AT, outcome: 'accessed' },
  ],
  sourceDiscrepancies: [{
    id: 'breakout-payout-approval-conflict', field: 'payoutPolicy', label: 'Payout approval', kind: 'official-source-mismatch', status: 'resolved', resolutionBasis: 'specific-policy-preferred',
    canonical: { value: 'POL approval precedes wallet submission and payment', sourceUrl: BREAKOUT_PAYOUT, checkedAt: CHECKED_AT, sourceRole: 'canonical' },
    alternates: [{ value: 'No approval delays', sourceUrl: BREAKOUT_PRICING, checkedAt: CHECKED_AT, sourceRole: 'alternate' }],
    checkedAt: CHECKED_AT,
    notes: 'The dedicated payout procedure is treated as canonical; the conflicting marketing claim remains visible as an evidence risk.',
  }],
};

export const CHAINFUNDED_PAGE_PROFILE: FirmNormalizedProfileV2 = {
  version: 2,
  contentStage: 'editorial',
  methodology: 'primary-sources-only',
  researchStandard: 'model-first-v1',
  researchMode: 'agent-assisted',
  id: 'firm-chainfunded',
  slug: 'chainfunded',
  name: 'ChainFunded',
  checkedAt: CHECKED_AT,
  modelTypes: ['evaluation'],
  offerNames: ['Two-Phase Evaluation'],
  editorialCopy: {
    'promo.code': '',
    'decision.title': 'A two-phase evaluation built around an LP pool and smart-contract settlement.',
    'decision.description': 'ChainFunded presents a wallet-native prop protocol: traders pay a one-time USDC fee, complete two evaluation phases, then submit signed performance proof for an 80% USDC payout from protocol liquidity.',
    'decision.highlight': 'The on-chain architecture is the product differentiator; incomplete execution details and the current maintenance state are the main evidence limits.',
    'process.title': 'From wallet registration to USDC settlement',
    'process.description': 'The published model replaces a manual payout queue with challenge state and performance verification.',
    'process.1.title': 'Register the challenge',
    'process.1.description': 'Connect a wallet and pay the one-time USDC entry fee; rules are fixed at registration.',
    'process.2.title': 'Complete both phases',
    'process.2.description': 'Reach 10% then 5%, with four minimum trading days in each phase.',
    'process.3.title': 'Access protocol liquidity',
    'process.3.description': 'Passing grants funded status linked to the LP-pool architecture.',
    'process.4.title': 'Submit performance proof',
    'process.4.description': 'The smart contract verifies the signed proof and transfers the eligible USDC share.',
    'programs.title': 'One evaluation model; the complete live price ladder remains unclear.',
    'programs.description': 'The published account range is $1K–$200K. The captured entry point is 20 USDC for $1K, while higher-tier pricing was not fully disclosed.',
    'programs.note': 'Daily-loss reset time and drawdown calculation basis remain undocumented in the captured official material.',
    'payouts.title': 'of eligible performance goes to the trader.',
    'payouts.description': 'The firm describes settlement as smart-contract verified and paid from the LP pool in seconds. This is a protocol claim, not an independent solvency audit.',
    'payouts.minimum': 'Not stated',
    'payouts.processing': 'Claimed: seconds',
    'payouts.rule.1': 'Trader submits signed performance proof.',
    'payouts.rule.2': 'Settlement currency is USDC on Ethereum.',
    'payouts.rule.3': 'Gas, slippage and failed-proof handling are not fully documented.',
    'trading.title': 'Protocol mechanics are clearer than execution mechanics.',
    'trading.description': 'ChainFunded documents wallet registration, fixed challenge parameters and USDC settlement, but the underlying execution venue, price feed, leverage and many strategy permissions remain unspecified.',
    'consider.eyebrow': 'Risk and evidence',
    'consider.title': 'The architecture is distinctive; the missing operational detail still matters.',
    'consider.1.title': 'The website is currently in maintenance',
    'consider.1.description': 'On 3 September 2026 the official pages returned a scheduled-maintenance notice, so the prior captured documents remain the evidence base.',
    'consider.2.title': 'Drawdown basis is not explicit',
    'consider.2.description': 'A 5% daily loss and 10% maximum drawdown are published, but balance/equity basis and reset timezone were not established.',
    'consider.3.title': 'Execution venue is not documented',
    'consider.3.description': 'The protocol explains settlement, not the broker, market maker, data provider, leverage bands or complete trading-cost schedule.',
    'consider.4.title': 'On-chain does not equal audited',
    'consider.4.description': 'Smart-contract claims improve verifiability only when contracts, liquidity and transactions can be independently inspected and audited.',
    'rewards.title': 'CFG governance and CFND liquidity rewards form a separate protocol layer.',
    'rewards.description': 'CFG is described as a fixed-supply governance token. Seasonal rewards target registered challenge accounts and CFND liquidity providers; current campaign terms should be rechecked after maintenance.',
    'sources.unknowns': 'current maintenance outcome, complete challenge pricing, drawdown basis and reset timezone, execution venue, leverage, fees, news/weekend/copy/automation rules, payout minimum and independent smart-contract or reserve audit.',
  },
  operatingModel: {
    classification: fact('chain-model', 'Operating model', 'Two-phase evaluation · LP-pool liquidity · smart-contract payout'),
    summary: fact('chain-summary', 'How it works', 'A wallet registers a fixed-rule challenge, completes two phases and submits signed performance proof for contract-mediated USDC settlement.'),
    lifecycle: [fact('chain-lifecycle', 'Trader lifecycle', 'USDC fee → two-phase evaluation → funded status → signed proof → USDC settlement')],
    accountEnvironment: fact('chain-environment', 'Account environment', 'Wallet-native protocol · execution venue not documented'),
    traderCompensation: fact('chain-compensation', 'Trader compensation', '80% of eligible performance'),
  },
  comparison: {
    modelTypes: ['evaluation'],
    capital: { status: 'varies', min: 1_000, max: 200_000, unit: 'USD' },
    entryCost: { status: 'varies', min: 20, unit: 'USDC', notes: 'Higher-tier prices are not fully captured.' },
    profitSplit: { status: 'known', min: 80, max: 80, unit: 'percent' },
    maxDrawdown: { status: 'known', min: 10, max: 10, unit: 'percent', notes: 'Calculation basis remains ND.' },
    payoutSchedules: { status: 'known', values: ['conditional'], notes: 'Triggered by valid signed performance proof.' },
    executionModels: { status: 'ND', values: [], notes: 'Settlement architecture is described; trade execution venue is not.' },
  },
  sections: [
    { id: 'overview', tabLabel: 'Brief', title: 'How ChainFunded works', blocks: [{ id: 'notebooklm-1', type: 'text', title: 'A protocol-shaped evaluation firm.', paragraphs: ['ChainFunded moves challenge state, liquidity participation and payout settlement into a wallet-based protocol model.'], status: 'reported' }] },
    { id: 'offers', tabLabel: 'Challenge', title: 'Programs and pricing', blocks: [{ id: 'offer-records', type: 'record-list', presentation: 'records', items: [{ id: 'chainfunded-two-phase', title: 'Two-Phase Evaluation' }] }] },
    { id: 'payouts', tabLabel: 'Payouts', title: 'How payouts work', blocks: [{ id: 'payout-facts', type: 'fact-grid', columns: 3, items: [fact('chain-split', 'Trader share', '80%'), fact('chain-speed', 'Claimed speed', 'Seconds'), fact('chain-rail', 'Settlement', 'Ethereum USDC')] }] },
    { id: 'trading', tabLabel: 'Trading', title: 'Trading environment', blocks: [{ id: 'trading-facts', type: 'fact-grid', columns: 3, items: [fact('chain-venue', 'Execution venue', 'Not documented'), fact('chain-leverage', 'Leverage', 'Not documented'), fact('chain-rules', 'Rule enforcement', 'Fixed at registration')] }] },
    { id: 'risk-model', tabLabel: 'Risk & proof', title: 'Risk and evidence', blocks: [{ id: 'risk-facts', type: 'fact-grid', columns: 4, items: [fact('chain-risk-target', 'Targets', '10% → 5%'), fact('chain-risk-daily', 'Daily loss', '5%'), fact('chain-risk-dd', 'Maximum drawdown', '10%'), fact('chain-risk-days', 'Minimum days', '4 + 4')] }] },
    { id: 'rewards', tabLabel: 'Rewards', title: 'CFG and CFND', blocks: [{ id: 'reward-facts', type: 'fact-grid', columns: 4, items: [fact('chain-cfg', 'CFG', 'Governance token'), fact('chain-supply', 'CFG supply', '100,000,000 fixed'), fact('chain-cfnd', 'CFND', 'Staked liquidity representation'), fact('chain-season', 'Rewards', 'Seasonal budgets')] }] },
    { id: 'sources', tabLabel: 'Sources', title: 'Sources and unresolved questions', blocks: [{ id: 'source-claims', type: 'record-list', presentation: 'sources', items: [
      { id: 'chain-site', title: 'Official website · currently maintenance', links: [{ label: 'Open source', url: CHAIN_SITE }] },
      { id: 'chain-faq', title: 'Official FAQ · previously captured', links: [{ label: 'Open source', url: CHAIN_FAQ }] },
      { id: 'chain-terms', title: 'Terms · previously captured', links: [{ label: 'Open source', url: CHAIN_TERMS }] },
      { id: 'chain-rewards', title: 'CFG rewards · previously captured', links: [{ label: 'Open source', url: CHAIN_REWARDS }] },
    ] }] },
  ],
  sourcesInspected: [
    { category: 'website', url: CHAIN_SITE, checkedAt: CHECKED_AT, outcome: 'accessed', notes: 'Scheduled-maintenance page returned.' },
    { category: 'faq', url: CHAIN_FAQ, checkedAt: CHECKED_AT, outcome: 'accessed', notes: 'Current URL returned maintenance; facts derive from the prior official capture.' },
    { category: 'terms', url: CHAIN_TERMS, checkedAt: CHECKED_AT, outcome: 'accessed', notes: 'Current URL returned maintenance; terms were previously captured.' },
    { category: 'token-rewards', url: CHAIN_REWARDS, checkedAt: CHECKED_AT, outcome: 'accessed', notes: 'Current URL returned maintenance; rewards page was previously captured.' },
  ],
  sourceDiscrepancies: [],
};

const baseBreakout = FIRM_NORMALIZED_PROFILES_BY_SLUG.breakout;
const baseChainFunded = FIRM_NORMALIZED_PROFILES_BY_SLUG.chainfunded;

export const BREAKOUT_NORMALIZED_PROFILE: FirmNormalizedProfile = {
  ...baseBreakout,
  checkedAt: CHECKED_AT,
  identity: {
    ...baseBreakout.identity,
    logo: reported('/firm-logos/breakout/logo.png', BREAKOUT_SITE),
    tagline: reported('Trade crypto without depositing your own money.', BREAKOUT_SITE),
    description: reported('One-time crypto evaluations leading to a firm-controlled Breakout Account eligible for performance payouts.', BREAKOUT_SITE),
  },
  summary: {
    ...baseBreakout.summary,
    maxDrawdown: reported('Classic 6% · Pro 5% · Turbo 3% · static', BREAKOUT_RULES),
    dailyDrawdown: reported('3% from 00:30 UTC balance · enforced on equity', BREAKOUT_RULES),
    profitTarget: reported('Classic 10% · Pro 12% · Turbo 9%', BREAKOUT_RULES),
    minCapital: reported(5_000, BREAKOUT_PRICING),
    maxCapital: reported(200_000, BREAKOUT_PRICING, 'Classic is capped at $100K.'),
    cryptoLeverage: reported('BTC 10x · selected assets 5x/3x · others 2x', BREAKOUT_RULES),
  },
  challengePrograms: reported(breakoutPrograms, BREAKOUT_RULES),
  tradingPolicy: {
    ...baseBreakout.tradingPolicy,
    platforms: reported(['Breakout Terminal', 'DXtrade'], BREAKOUT_RULES),
    markets: reported(['Crypto perpetuals', 'SP500', 'XYZ100'], BREAKOUT_PRICING, '63 markets are advertised.'),
    leverage: reported(['BTC 10x', 'selected assets 5x', 'selected assets 3x', 'other instruments 2x'], BREAKOUT_RULES),
    consistencyRule: reported('none', BREAKOUT_PRICING),
    newsTrading: reported('allowed', BREAKOUT_RULES),
    weekendHolding: reported('allowed', BREAKOUT_RULES),
    automatedTrading: nd('No general automation/API permission was established.', BREAKOUT_RULES),
    copyTrading: reported('restricted', BREAKOUT_RULES, 'Third-party trade ideas, signals and coordinated/cross-account execution are prohibited.'),
    mandatoryStopLoss: nd('No universal mandatory stop-loss rule was established.', BREAKOUT_RULES),
    tradingFees: reported('0.04% per side; 0.033% daily swap on open positions', BREAKOUT_RULES),
  },
  executionPolicy: {
    model: reported('hybrid', BREAKOUT_PRICING),
    venue: reported('Breakout Terminal / DXtrade; POL may internalize or route funded trade ideas', BREAKOUT_PRICING),
    onchainSettlement: reported(true, BREAKOUT_PRICING, 'Payout settlement uses Ethereum USDC; trade execution is not necessarily on-chain.'),
    notes: reported('Evaluation capital is simulated. POL decides whether funded trade ideas are internal administrative entries or market-facing transactions.', BREAKOUT_PRICING),
  },
  modularProfile: BREAKOUT_PAGE_PROFILE,
};

export const CHAINFUNDED_NORMALIZED_PROFILE: FirmNormalizedProfile = {
  ...baseChainFunded,
  checkedAt: CHECKED_AT,
  identity: {
    ...baseChainFunded.identity,
    logo: reported('/firm-logos/chainfunded/logo.png', CHAIN_SITE),
    tagline: reported('On-chain prop trading evaluation platform', CHAIN_SITE),
    description: reported('Wallet-native two-phase evaluation with LP-pool liquidity and contract-mediated USDC settlement.', CHAIN_SITE),
  },
  challengePrograms: reported(chainPrograms, CHAIN_FAQ, 'Facts come from the prior official capture; current URLs returned scheduled maintenance on 3 Sep 2026.'),
  payoutPolicy: {
    ...baseChainFunded.payoutPolicy,
    processingTimeHours: nd('The site says settlement takes seconds but does not publish a bounded SLA suitable for numeric conversion.', CHAIN_FAQ),
    minimumAmount: nd('No minimum payout was established.', CHAIN_FAQ),
    positionsMustBeClosed: nd('Position-close requirements were not established.', CHAIN_FAQ),
    partialWithdrawalsAllowed: nd('Partial-withdrawal behavior was not established.', CHAIN_FAQ),
    payoutResetsBalance: nd('Post-payout balance behavior was not established.', CHAIN_FAQ),
  },
  tradingPolicy: {
    ...baseChainFunded.tradingPolicy,
    platforms: reported(['ChainFunded terminal'], CHAIN_FAQ),
    markets: nd('The current asset universe was not reliably captured.', CHAIN_FAQ),
    leverage: nd('Leverage bands were not published in the captured source set.', CHAIN_FAQ),
    consistencyRule: nd('No consistency rule was established.', CHAIN_FAQ),
    profitDayDefinition: nd('No profit-day definition was established.', CHAIN_FAQ),
    newsTrading: nd('News-trading permission was not established.', CHAIN_FAQ),
    weekendHolding: nd('Weekend-holding permission was not established.', CHAIN_FAQ),
    automatedTrading: nd('Automation/API permission was not established.', CHAIN_FAQ),
    copyTrading: nd('Copy-trading permission was not established.', CHAIN_FAQ),
    mandatoryStopLoss: nd('A universal stop-loss requirement was not established.', CHAIN_FAQ),
    tradingFees: nd('A complete trading-fee and gas schedule was not established.', CHAIN_FAQ),
  },
  modularProfile: CHAINFUNDED_PAGE_PROFILE,
};
