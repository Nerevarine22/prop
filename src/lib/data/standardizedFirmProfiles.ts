import { FIRM_NORMALIZED_PROFILES_BY_SLUG } from './firmNormalizedProfiles';
import type { FirmNormalizedProfile, FirmNormalizedProfileV2, FirmResearchSourceInspection, FirmContentFact, NormalizedFact } from '@/types/database';

const CHECKED_AT = '2026-09-05T00:00:00.000Z';

type PageConfig = {
  slug: 'foxify' | 'hypernova' | 'o2';
  name: string;
  offers: string[];
  sources: Array<{ category: FirmResearchSourceInspection['category']; url: string; label: string }>;
  copy: Record<string, string>;
  modelTypes: FirmNormalizedProfileV2['modelTypes'];
  comparison: FirmNormalizedProfileV2['comparison'];
  reward?: { label: string; metrics: Array<[string, string]> };
};

const contentFact = (id: string, label: string, value: string): FirmContentFact => ({ id, label, value, status: 'reported' });
const observed = <T,>(value: T, sourceUrl: string, notes?: string): NormalizedFact<T> => ({
  status: 'reported', value, evidence: [{ sourceUrl, checkedAt: CHECKED_AT, ...(notes ? { notes } : {}) }],
});

function page(config: PageConfig): FirmNormalizedProfileV2 {
  const base = FIRM_NORMALIZED_PROFILES_BY_SLUG[config.slug];
  const rewardSection = config.reward ? [{
    id: 'rewards',
    tabLabel: 'Rewards',
    title: config.reward.label,
    blocks: [{
      id: 'reward-facts',
      type: 'fact-grid' as const,
      columns: 4 as const,
      items: config.reward.metrics.map(([label, value], index) => contentFact(`${config.slug}-reward-${index + 1}`, label, value)),
    }],
  }] : [];

  return {
    version: 2,
    contentStage: 'editorial',
    methodology: 'primary-sources-only',
    researchStandard: 'model-first-v1',
    researchMode: 'agent-assisted',
    id: base.id,
    slug: config.slug,
    name: config.name,
    checkedAt: CHECKED_AT,
    modelTypes: config.modelTypes,
    offerNames: config.offers,
    editorialCopy: config.copy,
    operatingModel: {
      classification: contentFact(`${config.slug}-model`, 'Operating model', config.copy['model.classification']),
      summary: contentFact(`${config.slug}-summary`, 'How it works', config.copy['decision.description']),
      lifecycle: [contentFact(`${config.slug}-lifecycle`, 'Trader lifecycle', config.copy['model.lifecycle'])],
      accountEnvironment: contentFact(`${config.slug}-environment`, 'Account environment', config.copy['model.environment']),
      traderCompensation: contentFact(`${config.slug}-compensation`, 'Trader compensation', config.copy['model.compensation']),
    },
    comparison: config.comparison,
    sections: [
      { id: 'overview', tabLabel: 'Brief', title: `How ${config.name} works`, blocks: [{ id: 'notebooklm-1', type: 'text', title: config.copy['decision.title'], paragraphs: [config.copy['decision.description']], status: 'reported' }, { id: 'notebooklm-2', type: 'fact-grid', columns: 4, presentation: 'steps', items: [1, 2, 3, 4].map((n) => contentFact(`${config.slug}-step-${n}`, `0${n}`, config.copy[`process.${n}.title`])) }] },
      { id: 'offers', tabLabel: config.slug === 'o2' ? 'Accounts' : 'Programs', title: 'Programs and pricing', blocks: [{ id: 'offer-records', type: 'record-list', presentation: 'records', items: config.offers.map((title, index) => ({ id: `${config.slug}-offer-${index}`, title })) }] },
      { id: 'payouts', tabLabel: 'Payouts', title: 'How payouts work', blocks: [{ id: 'payout-facts', type: 'fact-grid', columns: 3, items: [contentFact(`${config.slug}-payout-split`, 'Trader share', config.copy['model.compensation']), contentFact(`${config.slug}-payout-min`, 'Minimum', config.copy['payouts.minimum']), contentFact(`${config.slug}-payout-rail`, 'Settlement', config.copy['payouts.rail'])] }] },
      { id: 'trading', tabLabel: 'Trading', title: 'Trading environment', blocks: [{ id: 'trading-facts', type: 'fact-grid', columns: 3, items: [contentFact(`${config.slug}-venue`, 'Venue', config.copy['model.environment']), contentFact(`${config.slug}-markets`, 'Markets', config.copy['trading.markets']), contentFact(`${config.slug}-leverage`, 'Leverage', config.copy['trading.leverage'])] }] },
      { id: 'risk-model', tabLabel: 'Risk & proof', title: 'Risk and evidence', blocks: [{ id: 'risk-facts', type: 'fact-grid', columns: 4, items: [1, 2, 3, 4].map((n) => contentFact(`${config.slug}-risk-${n}`, config.copy[`consider.${n}.title`], config.copy[`consider.${n}.description`])) }] },
      ...rewardSection,
      { id: 'sources', tabLabel: 'Sources', title: 'Sources and unresolved questions', blocks: [{ id: 'source-claims', type: 'record-list', presentation: 'sources', items: config.sources.map((source, index) => ({ id: `${config.slug}-source-${index}`, title: source.label, links: [{ label: 'Open source', url: source.url }] })) }] },
    ],
    sourcesInspected: config.sources.map((source) => ({ category: source.category, url: source.url, checkedAt: CHECKED_AT, outcome: 'accessed' })),
    sourceDiscrepancies: base.sourceDiscrepancies,
  };
}

export const FOXIFY_PAGE_PROFILE = page({
  slug: 'foxify', name: 'Foxify Trade', modelTypes: ['collateralized', 'progression'], offers: ['Entry', 'Pro'],
  sources: [
    { category: 'website', url: 'https://www.foxify.trade/', label: 'Official website' },
    { category: 'rulebook', url: 'https://docs.foxify.trade/', label: 'FUNDED documentation' },
    { category: 'faq', url: 'https://docs.foxify.trade/faq-challenge-funding', label: 'Challenge FAQ' },
  ],
  copy: {
    'promo.code': '',
    'decision.title': 'Collateral unlocks real-market funding without an evaluation phase.',
    'decision.description': 'Foxify FUNDED is a collateralized progression product rather than a classic evaluation. The trader deposits USDC, receives a larger live A-book allocation, earns points plus P&L toward promotion, and receives an on-chain share of realized profit.',
    'decision.highlight': 'There is no evaluation or KYC, but deposited collateral is genuinely at risk and inactivity can begin consuming it.',
    'process.title': 'From collateral to a larger funded tier',
    'process.description': 'Promotion combines activity points with a minimum P&L threshold.',
    'process.1.title': 'Choose a supported DEX', 'process.1.description': 'Kodiak, What Exchange and PERPTools are live; Hyperliquid is marked coming soon.',
    'process.2.title': 'Deposit collateral', 'process.2.description': 'Entry starts with $100 for $500; Pro uses $500 for $2,500.',
    'process.3.title': 'Earn 100 points + 15%', 'process.3.description': 'Activity and P&L move the account toward the next funding level.',
    'process.4.title': 'Cash out and scale', 'process.4.description': 'The smart contract pays 80% in USDC and advances the account.',
    'programs.title': 'Two live tracks, with Elite still marked coming soon.',
    'programs.description': 'Entry and Pro currently scale to $10K. Documentation also markets a future Elite path to $20K.',
    'programs.note': 'The docs conflict on “no minimum trading time” versus a one-day minimum in the quick-reference section.',
    'payouts.title': 'of eligible profit goes to the trader.', 'payouts.description': 'Payout is unlocked by the points and profit targets, then executed on-chain without a manual review queue.',
    'payouts.minimum': 'Target-based', 'payouts.processing': 'Claimed: instant', 'payouts.rail': 'USDC · supported chain',
    'payouts.rule.1': '100 points and at least 15% P&L are required.', 'payouts.rule.2': 'Standard manual accounts retain 80%; automated beta retains 70%.', 'payouts.rule.3': 'Collateral absorbs losses first and can be fully lost.',
    'trading.title': 'A-book execution across integrated perpetual venues.', 'trading.description': 'Foxify claims every FUNDED trade reaches real DEX orderbooks. Available markets and chains vary by platform, with gas and dynamic funding costs outside a single universal fee.',
    'trading.markets': '125+ crypto, forex, stocks, metals, commodities, indices', 'trading.leverage': 'Up to 100x · platform dependent',
    'consider.eyebrow': 'Risk and evidence', 'consider.title': 'Collateral and smart-contract risk replace evaluation risk.',
    'consider.1.title': 'Your deposit is first-loss capital', 'consider.1.description': 'A breach deducts losses from deposited collateral before the funded vault covers the remainder.',
    'consider.2.title': 'Inactivity can consume collateral', 'consider.2.description': 'A dynamic borrow fee begins after a UI-defined idle period and can exhaust the remaining deposit.',
    'consider.3.title': 'Official timing rules conflict', 'consider.3.description': 'The same docs say both no minimum trading time and one minimum trading day.',
    'consider.4.title': 'On-chain claims need contract-level review', 'consider.4.description': 'Public execution claims are stronger than a typical B-book model, but contract, oracle and smart-contract risks remain.',
    'rewards.title': 'FOX and trading NFTs add a second incentive layer.', 'rewards.description': 'FOX fee buybacks and staked Silver/Gold NFT funding bonuses are documented separately from the core funded account.',
    'sources.unknowns': 'dedicated legal Terms, operator jurisdiction, live inactivity threshold, dynamic borrow fee, complete smart-contract audit scope and current Elite launch date.',
    'model.classification': 'Collateralized A-book funding · progression', 'model.lifecycle': 'USDC collateral → live funded account → points + P&L → payout → larger tier', 'model.environment': 'Kodiak · What Exchange · PERPTools', 'model.compensation': '80% manual · 70% automated beta',
  },
  comparison: { modelTypes: ['collateralized', 'progression'], capital: { status: 'varies', min: 500, max: 10_000, unit: 'USD', notes: '$20K Elite is coming soon.' }, entryCost: { status: 'varies', min: 100, max: 500, unit: 'USDC' }, profitSplit: { status: 'varies', min: 70, max: 80, unit: 'percent' }, maxDrawdown: { status: 'varies', min: 10, max: 20, unit: 'percent' }, payoutSchedules: { status: 'known', values: ['conditional'] }, executionModels: { status: 'known', values: ['A-book on-chain'] } },
  reward: { label: 'FOX token and NFT funding boosts', metrics: [['FOX', 'Fee buyback + staking'], ['Silver NFT', '+10% funding'], ['Gold NFT', '+25% funding'], ['Settlement', 'On-chain USDC']] },
});

export const HYPERNOVA_PAGE_PROFILE = page({
  slug: 'hypernova', name: 'Hypernova', modelTypes: ['evaluation'], offers: ['Tight Risk', 'Low Risk', 'Medium Risk', 'High Risk'],
  sources: [
    { category: 'website', url: 'https://hypernova.xyz/', label: 'Official website' },
    { category: 'rulebook', url: 'https://hypernova.xyz/rulebook', label: 'Rulebook v1.1' },
    { category: 'terms', url: 'https://hypernova.xyz/docs/terms-of-use', label: 'Terms of Use' },
  ],
  copy: {
    'promo.code': '', 'decision.title': 'One-step evaluations priced by risk allowance.',
    'decision.description': 'Hypernova offers simulated one-step assessments across Tight, Low, Medium and restricted High Risk tiers. Each tier changes the daily loss and static drawdown envelope while keeping an 80% funded profit share.',
    'decision.highlight': 'The cheapest tier is also the least forgiving: Tight pairs a 9% target with only 3% static drawdown.',
    'process.title': 'Choose risk, pass once, request on-chain', 'process.description': 'The offer is structurally simple; the risk envelope is the real product.',
    'process.1.title': 'Choose a risk tier', 'process.1.description': 'Tight, Low, Medium and restricted High trade price against drawdown room.',
    'process.2.title': 'Reach 9% or 10%', 'process.2.description': 'Complete the one-step simulated assessment without crossing equity limits.',
    'process.3.title': 'Enter the funded stage', 'process.3.description': 'The funded programme remains a performance-based service, not a brokerage account.',
    'process.4.title': 'Request USDC', 'process.4.description': 'Eligible profit is marketed as available on-demand with on-chain settlement.',
    'programs.title': 'Four risk envelopes instead of multiple evaluation phases.', 'programs.description': 'Daily loss ranges from 3% to 5%; static maximum drawdown ranges from 3% to 8%.',
    'programs.note': 'High Risk is restricted. The homepage and rulebook disagree on the $25K Low Risk fee ($275 vs $280).',
    'payouts.title': 'of net funded profit goes to the trader.', 'payouts.description': 'The rulebook reports on-demand USDC settlement with no waiting period or stated minimum.',
    'payouts.minimum': 'None stated', 'payouts.processing': 'Conflicting: 6.2s / <0.02s', 'payouts.rail': 'USDC · on-chain',
    'payouts.rule.1': 'The account must be in profit.', 'payouts.rule.2': 'No payout calendar or waiting period is stated.', 'payouts.rule.3': 'Official sources publish conflicting average processing times.',
    'trading.title': 'A simulated assessment with on-chain payout rails.', 'trading.description': 'The public materials are much clearer on assessment risk than on order routing, execution venue and trading permissions.',
    'trading.markets': 'Crypto markets · full list not normalized', 'trading.leverage': 'Not reliably established',
    'consider.eyebrow': 'Risk and evidence', 'consider.title': 'Fast settlement claims are not the same as complete transparency.',
    'consider.1.title': 'Price source conflict', 'consider.1.description': 'The homepage shows $275 for $25K Low Risk while rulebook v1.1 shows $280.',
    'consider.2.title': 'Payout-speed conflict', 'consider.2.description': 'The homepage reports 6.2 seconds; the rulebook reports an average below 0.02 seconds.',
    'consider.3.title': 'Simulation is explicit', 'consider.3.description': 'Terms define a performance payout programme rather than a brokerage, custody or investment account.',
    'consider.4.title': 'Execution detail remains thin', 'consider.4.description': 'Venue, leverage, fees and several strategy permissions need stronger official documentation.',
    'sources.unknowns': 'underlying venue and liquidity providers, leverage bands, full fee schedule, news/weekend/copy/automation rules, independent reserve audit and reconciliation of payout-speed statistics.',
    'model.classification': 'One-step simulated evaluation', 'model.lifecycle': 'Fee → one-step assessment → funded programme → on-demand USDC payout', 'model.environment': 'Simulated trading · venue not documented', 'model.compensation': '80%',
  },
  comparison: { modelTypes: ['evaluation'], capital: { status: 'varies', min: 5_000, max: 200_000, unit: 'USD' }, entryCost: { status: 'varies', min: 25, max: 1_850, unit: 'USD' }, profitSplit: { status: 'known', min: 80, max: 80, unit: 'percent' }, maxDrawdown: { status: 'varies', min: 3, max: 8, unit: 'percent' }, payoutSchedules: { status: 'known', values: ['on-demand'] }, executionModels: { status: 'known', values: ['simulated'] } },
});

export const O2_PAGE_PROFILE = page({
  slug: 'o2', name: 'O2', modelTypes: ['collateralized', 'instant-funding'], offers: ['Turbo Starter', 'Turbo Standard', 'Turbo Pro'],
  sources: [
    { category: 'website', url: 'https://www.o2.app/', label: 'Official website' },
    { category: 'rulebook', url: 'https://trade.o2.app/turbo', label: 'Turbo product and FAQ' },
    { category: 'terms', url: 'https://trade.o2.app/terms-of-use', label: 'Terms of Use' },
  ],
  copy: {
    'promo.code': '', 'decision.title': 'Instant on-chain capital with refundable margin and no evaluation.',
    'decision.description': 'O2 Turbo is a time-bounded, collateralized trading account. The trader pays a non-refundable premium plus margin that caps downside, trades real on-chain liquidity and keeps 100% of realized profit.',
    'decision.highlight': 'The economic trade is premium plus first-loss margin in exchange for immediate capital and no profit split.',
    'process.title': 'Configure, fund, trade, withdraw', 'process.description': 'Turbo replaces an evaluation with an explicit premium-and-margin structure.',
    'process.1.title': 'Configure the account', 'process.1.description': 'Choose Starter, Standard or Pro, Focused/Broad markets and a 6h–1mo duration.',
    'process.2.title': 'Pay premium + margin', 'process.2.description': 'Premium is the fee; margin is refundable net of losses and liquidation charges.',
    'process.3.title': 'Trade on-chain', 'process.3.description': 'There is no target, minimum trading-day count or simulated evaluation phase.',
    'process.4.title': 'Move realized gains', 'process.4.description': 'Profit can move to the main account at any time in USDC.',
    'programs.title': 'A configurable account, not a fixed challenge ladder.', 'programs.description': 'Capital, premium, refundable margin, market profile and duration change together in the live configurator.',
    'programs.note': 'Exact prices are selection-dependent; presenting a static universal price would be misleading.',
    'payouts.title': 'of realized profit stays with the trader.', 'payouts.description': 'There is no minimum, waiting period, withdrawal fee or manual payout review in the published Turbo mechanics.',
    'payouts.minimum': '$0', 'payouts.processing': 'Anytime', 'payouts.rail': 'USDC · on-chain',
    'payouts.rule.1': 'Realized gains can move to the main account anytime.', 'payouts.rule.2': 'Ending the account returns remaining margin net of losses.', 'payouts.rule.3': 'Liquidation can deduct 1% from leftover margin.',
    'trading.title': 'Real execution and liquidity, bounded by purchased time and margin.', 'trading.description': 'Turbo is wallet-based and on-chain. The public product exposes spot-style execution and configurable market profiles rather than a simulated prop terminal.',
    'trading.markets': 'Focused or Broad profile', 'trading.leverage': 'Configuration-dependent',
    'consider.eyebrow': 'Risk and evidence', 'consider.title': 'No evaluation does not mean no cost or liquidation risk.',
    'consider.1.title': 'Premium is non-refundable', 'consider.1.description': 'The premium buys access for the selected duration and is not returned when the account ends.',
    'consider.2.title': 'Margin is first-loss capital', 'consider.2.description': 'Losses reduce refundable margin; liquidation can consume it and add the documented residual charge.',
    'consider.3.title': 'The clock matters', 'consider.3.description': 'Accounts run for 6 hours, 1 day, 1 week or 1 month, so duration is part of effective pricing.',
    'consider.4.title': 'Live configuration resists static comparison', 'consider.4.description': 'A fair comparison must store capital, premium, margin, profile and duration as one offer snapshot.',
    'rewards.title': 'Legend Score and competitions sit outside Turbo economics.', 'rewards.description': 'O2 publishes a lifetime Legend Score, USDC competitions and tiered Turbo referrals; no proprietary token or confirmed airdrop is documented.',
    'sources.unknowns': 'a stable exported price matrix, aggregate account cap, exact leverage by configuration, complete restricted-country display and independent protocol-risk audit.',
    'model.classification': 'Collateralized instant funding · real on-chain execution', 'model.lifecycle': 'Configure → premium + refundable margin → timed account → profit withdrawal / margin return', 'model.environment': 'O2 on-chain trading application', 'model.compensation': '100%',
  },
  comparison: { modelTypes: ['collateralized', 'instant-funding'], capital: { status: 'varies', unit: 'USD', notes: 'Live configurator; homepage currently highlights $10K.' }, entryCost: { status: 'varies', unit: 'USD', notes: 'Non-refundable premium plus refundable margin.' }, profitSplit: { status: 'known', min: 100, max: 100, unit: 'percent' }, maxDrawdown: { status: 'varies', unit: 'USD', notes: 'Loss is capped by selected margin.' }, payoutSchedules: { status: 'known', values: ['on-demand'] }, executionModels: { status: 'known', values: ['on-chain real execution'] } },
  reward: { label: 'Legend Score, competitions and referrals', metrics: [['Legend Score', 'Lifetime'], ['Competitions', 'USDC'], ['Referrals', 'Tiered premium share'], ['Token / airdrop', 'Not documented']] },
});

const foxifyBase = FIRM_NORMALIZED_PROFILES_BY_SLUG.foxify;
const o2Base = FIRM_NORMALIZED_PROFILES_BY_SLUG.o2;

export const FOXIFY_NORMALIZED_PROFILE: FirmNormalizedProfile = {
  ...foxifyBase,
  checkedAt: CHECKED_AT,
  tradingPolicy: {
    ...foxifyBase.tradingPolicy,
    platforms: observed(['Kodiak Finance', 'What Exchange', 'PERPTools'], 'https://docs.foxify.trade/'),
    markets: observed(['Crypto perpetuals', 'Forex', 'Stocks', 'Metals', 'Commodities', 'Indices'], 'https://docs.foxify.trade/'),
    leverage: observed(['Up to 100x; platform and asset dependent'], 'https://docs.foxify.trade/'),
    consistencyRule: observed('none', 'https://docs.foxify.trade/'),
    newsTrading: observed('allowed', 'https://docs.foxify.trade/'),
    weekendHolding: observed('allowed', 'https://docs.foxify.trade/'),
    automatedTrading: observed('allowed', 'https://docs.foxify.trade/'),
    copyTrading: observed('allowed', 'https://docs.foxify.trade/'),
    mandatoryStopLoss: observed(false, 'https://docs.foxify.trade/'),
    tradingFees: observed('0.075% on FOXIFY/Kodiak/What Exchange; 0.09% on PERPTools', 'https://docs.foxify.trade/'),
  },
  modularProfile: FOXIFY_PAGE_PROFILE,
};
export const HYPERNOVA_NORMALIZED_PROFILE: FirmNormalizedProfile = { ...FIRM_NORMALIZED_PROFILES_BY_SLUG.hypernova, checkedAt: CHECKED_AT, modularProfile: HYPERNOVA_PAGE_PROFILE };
export const O2_NORMALIZED_PROFILE: FirmNormalizedProfile = {
  ...o2Base,
  checkedAt: CHECKED_AT,
  tradingPolicy: {
    ...o2Base.tradingPolicy,
    platforms: observed(['O2 trading application'], 'https://trade.o2.app/turbo'),
    markets: observed(['Focused profile', 'Broad profile'], 'https://trade.o2.app/turbo'),
    consistencyRule: observed('none', 'https://trade.o2.app/turbo'),
    profitDayDefinition: observed('not-applicable', 'https://trade.o2.app/turbo'),
    mandatoryStopLoss: observed(false, 'https://trade.o2.app/turbo'),
  },
  executionPolicy: {
    ...o2Base.executionPolicy,
    model: observed('a-book', 'https://trade.o2.app/turbo', 'The product describes real on-chain execution and liquidity.'),
    venue: observed('O2 on-chain trading application', 'https://trade.o2.app/turbo'),
  },
  modularProfile: O2_PAGE_PROFILE,
};
