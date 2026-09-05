import { FIRM_NORMALIZED_PROFILES_BY_SLUG } from './firmNormalizedProfiles';
import type { FirmNormalizedProfile, FirmNormalizedProfileV2, FirmResearchSourceInspection, FirmContentFact, NormalizedFact } from '@/types/database';

const CHECKED_AT = '2026-09-05T00:00:00.000Z';

type PageConfig = {
  slug: 'foxify' | 'hypernova' | 'o2' | 'solana-funded' | 'vanta-trading' | 'klein-funding' | 'upscale-trade' | 'size' | 'polyquid' | 'funded-hive' | 'cf-trader';
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

export const SOLANA_FUNDED_PAGE_PROFILE = page({
  slug: 'solana-funded', name: 'Solana Funded', modelTypes: ['evaluation'], offers: ['1-Step Standard', '1-Step Elite', '2-Step Standard', '2-Step Elite'],
  sources: [
    { category: 'website', url: 'https://solanafunded.com/', label: 'Official website' },
    { category: 'rulebook', url: 'https://docs.solanafunded.com/', label: 'Account rules' },
    { category: 'terms', url: 'https://solanafunded.com/terms-of-service', label: 'Terms of Service' },
  ],
  copy: {
    'promo.code': '', 'decision.title': 'High-target evaluations with Solana payout rails.',
    'decision.description': 'Solana Funded sells one- and two-step simulated evaluations. The documented targets are unusually high, while the account rules define scheduled SOL or USDC payouts and optional upgrades for a 90% split or seven-day cycle.',
    'decision.highlight': 'The homepage markets real capital and on-demand payouts, but the Terms and account rules define simulated accounts and scheduled default withdrawals.',
    'process.title': 'Choose a path, meet the target, unlock payouts', 'process.description': 'Program choice changes the target, position requirement and drawdown allowance.',
    'process.1.title': 'Choose Standard or Elite', 'process.1.description': 'One-step and two-step paths use different targets and position constraints.',
    'process.2.title': 'Complete the evaluation', 'process.2.description': 'Documented targets range from 20% to 50% by phase and path.',
    'process.3.title': 'Enter a simulated funded account', 'process.3.description': 'Terms explicitly say the account is virtual rather than custody of company capital.',
    'process.4.title': 'Request SOL or USDC', 'process.4.description': 'Default timing is 21 days, then every 14 days; an add-on changes the cycle.',
    'programs.title': 'Four paths with very different target geometry.', 'programs.description': 'Standard and Elite change targets, position counts and drawdown; exact pricing is checkout-dependent.',
    'programs.note': 'The current ledger has one verified $2.5K checkout snapshot; other tier prices should not be inferred from it.',
    'payouts.title': 'is the standard trader share.', 'payouts.description': 'Account rules set an 80% default, with a paid 90% upgrade and a separate weekly-cycle option.',
    'payouts.minimum': 'Not clearly stated', 'payouts.processing': '21d first · 14d after', 'payouts.rail': 'SOL or USDC · Solana',
    'payouts.rule.1': 'The seven-day cycle is a paid checkout option.', 'payouts.rule.2': 'The 90% split is also an optional upgrade.', 'payouts.rule.3': 'Homepage on-demand wording conflicts with the detailed account rules.',
    'trading.title': 'Simulation in the Terms; Solana for settlement.', 'trading.description': 'Official marketing uses on-chain language, but the controlling Terms say platform trades are simulated. Settlement can still occur in SOL or USDC.',
    'trading.markets': 'Solana ecosystem tokens', 'trading.leverage': 'Not reliably normalized',
    'consider.eyebrow': 'Risk and evidence', 'consider.title': 'The biggest risk is the gap between marketing and controlling terms.',
    'consider.1.title': 'Capital language conflicts', 'consider.1.description': 'Homepage claims company capital and real execution; Terms define virtual accounts and simulated activity.',
    'consider.2.title': 'Payout cadence conflicts', 'consider.2.description': 'Homepage says on-demand while account rules specify 21-day and 14-day default windows.',
    'consider.3.title': 'Targets are unusually high', 'consider.3.description': 'Documented one-step targets reach 45–50%, materially changing expected difficulty.',
    'consider.4.title': 'Add-ons change comparison', 'consider.4.description': 'Split and payout speed cannot be compared fairly without recording checkout upgrades.',
    'rewards.title': 'SF Points are loyalty credits, not a liquid token.', 'rewards.description': 'Points can unlock discounts, retries and challenges; creator campaigns separately pay SOL or USDC bounties.',
    'sources.unknowns': 'complete current tier pricing, leverage table, precise market allowlist, payout minimum, restricted jurisdictions and independent execution proof.',
    'model.classification': 'Simulated multi-path evaluation', 'model.lifecycle': 'Fee → evaluation path → virtual funded account → scheduled SOL/USDC payout', 'model.environment': 'Simulated platform · Solana settlement', 'model.compensation': '80% standard · 90% add-on',
  },
  comparison: { modelTypes: ['evaluation'], capital: { status: 'varies', min: 2_500, max: 100_000, unit: 'USD' }, entryCost: { status: 'varies', min: 61.6, unit: 'USD', notes: 'Observed discounted $2.5K checkout; full matrix varies.' }, profitSplit: { status: 'varies', min: 80, max: 90, unit: 'percent' }, maxDrawdown: { status: 'varies', min: 20, max: 25, unit: 'percent', notes: 'Documented one-step paths; two-step value not normalized.' }, payoutSchedules: { status: 'known', values: ['bi-weekly', 'weekly add-on'] }, executionModels: { status: 'known', values: ['simulated'] } },
  reward: { label: 'SF Points and creator bounties', metrics: [['SF Points', 'Live loyalty score'], ['Redemption', 'Discounts and retries'], ['Creator rewards', 'SOL / USDC'], ['Liquid token', 'Not documented']] },
});

export const VANTA_TRADING_PAGE_PROFILE = page({
  slug: 'vanta-trading', name: 'Vanta Trading', modelTypes: ['evaluation'], offers: ['One-Step'],
  sources: [
    { category: 'website', url: 'https://www.vantatrading.io/', label: 'Official website' },
    { category: 'rulebook', url: 'https://www.vantatrading.io/rules', label: 'Protocol rules' },
    { category: 'terms', url: 'https://www.vantatrading.io/terms-of-service', label: 'Terms of Service' },
  ],
  copy: {
    'promo.code': '', 'decision.title': 'A simple one-step challenge feeding a separate scaled-trader network.',
    'decision.description': 'Vanta uses a simulated one-step evaluation with a formal 10% target and two 5% loss limits. Passing is marketed as immediate access to a scaled account with weekly 100% rewards, while the Terms preserve discretion over invitation and compensation.',
    'decision.highlight': 'The rulebook is unusually generous on payout economics; the Terms materially qualify that promise.',
    'process.title': 'Pass once, then enter a separate network', 'process.description': 'The challenge and the post-pass contractor relationship are legally distinct.',
    'process.1.title': 'Buy one challenge', 'process.1.description': 'Account sizes run from $1K to $100K with one evaluation phase.',
    'process.2.title': 'Reach the formal 10%', 'process.2.description': 'No time limit or minimum days; two 5% risk limits apply.',
    'process.3.title': 'Complete KYC and ICA', 'process.3.description': 'Scaled-network access requires a separate invitation and contractor agreement.',
    'process.4.title': 'Receive weekly rewards', 'process.4.description': 'Rules state seven-day payouts and 100% trader share with no minimum.',
    'programs.title': 'One challenge structure across six account sizes.', 'programs.description': 'The formal 10% target is canonical; the homepage Kickstarter card still shows 8%.',
    'programs.note': 'Current promotional prices differ from older normalized tier values and should be stored as dated snapshots.',
    'payouts.title': 'is the rulebook trader share.', 'payouts.description': 'Rules promise weekly rewards with no minimum; Terms make network invitation and payout descriptions informational.',
    'payouts.minimum': '$0 stated', 'payouts.processing': 'Every 7 days', 'payouts.rail': 'On-chain reward',
    'payouts.rule.1': 'Passing alone does not create a legal right to network admission.', 'payouts.rule.2': 'KYC and a separate ICA apply after evaluation.', 'payouts.rule.3': 'Rulebook certainty and Terms discretion must remain visible together.',
    'trading.title': 'A simulated challenge built around Hyperliquid market access.', 'trading.description': 'The evaluation is expressly simulated. Public material focuses on open protocol rules and scaled-network economics rather than a conventional broker account.',
    'trading.markets': 'Hyperliquid markets', 'trading.leverage': 'Tier/rule dependent',
    'consider.eyebrow': 'Risk and evidence', 'consider.title': 'Strong rulebook claims sit behind a discretionary legal gateway.',
    'consider.1.title': 'Target mismatch', 'consider.1.description': 'Rules and FAQ say 10%; the live Kickstarter card has shown 8%.',
    'consider.2.title': 'Invitation is not guaranteed', 'consider.2.description': 'Terms say passing does not guarantee entry to the separate Network Trader Program.',
    'consider.3.title': '100% is conditional', 'consider.3.description': 'The economic claim applies to eligible scaled-account rewards, not every challenge result.',
    'consider.4.title': 'Short operating history', 'consider.4.description': 'Protocol transparency does not replace a longer independent payout record.',
    'rewards.title': 'A finite 2X pool adds temporary upside.', 'rewards.description': 'The 2X programme doubles eligible rewards while its $200K pool remains; a separate quarterly bonus is also documented.',
    'sources.unknowns': 'current full leverage table, execution routing, independent payout reconciliation, restricted-country list and remaining 2X pool balance.',
    'model.classification': 'One-step simulated evaluation · scaled network', 'model.lifecycle': 'Fee → simulated challenge → discretionary network invitation → weekly reward', 'model.environment': 'Hyperliquid-oriented simulated account', 'model.compensation': '100% stated in protocol rules',
  },
  comparison: { modelTypes: ['evaluation'], capital: { status: 'varies', min: 1_000, max: 100_000, unit: 'USD' }, entryCost: { status: 'varies', min: 9, max: 599, unit: 'USD', notes: 'List and promotional prices differ.' }, profitSplit: { status: 'known', min: 100, max: 100, unit: 'percent', notes: 'Protocol rules; Terms preserve discretion.' }, maxDrawdown: { status: 'known', min: 5, max: 5, unit: 'percent' }, payoutSchedules: { status: 'known', values: ['weekly'] }, executionModels: { status: 'known', values: ['simulated'] } },
  reward: { label: '2X pool and quarterly performance bonus', metrics: [['Core share', '100% stated'], ['2X pool', '$200K finite'], ['Cycle', '7 days'], ['Token / points', 'Not documented']] },
});

export const KLEIN_FUNDING_PAGE_PROFILE = page({
  slug: 'klein-funding', name: 'Klein Funding', modelTypes: ['evaluation', 'instant-funding'], offers: ['Bybit One-Step', 'Bybit Two-Step', 'Cleo Standard/Flex', 'Instant Pro'],
  sources: [
    { category: 'website', url: 'https://kleinfunding.com/', label: 'Official website' },
    { category: 'rulebook', url: 'https://kleinfunding.com/pricing', label: 'Live configurator and rules' },
    { category: 'terms', url: 'https://kleinfunding.com/terms-of-use', label: 'Terms of Use' },
  ],
  copy: {
    'promo.code': '', 'decision.title': 'A configurable catalogue split across Bybit, Cleo and Instant Pro.',
    'decision.description': 'Klein Funding is not one fixed challenge. Platform, phase count, target, drawdown, stability rule, leverage and profit share change with the selected configuration, so each checkout combination is effectively a separate product.',
    'decision.highlight': 'The useful comparison unit is the exact configuration—not the Klein brand average.',
    'process.title': 'Configure first; compare second', 'process.description': 'Platform choice changes both trading conditions and payout economics.',
    'process.1.title': 'Choose a platform', 'process.1.description': 'Bybit supports higher leverage; Cleo uses a tighter, lower-leverage rule set.',
    'process.2.title': 'Choose evaluation or Instant Pro', 'process.2.description': 'One-step, two-step and instant paths have different eligibility logic.',
    'process.3.title': 'Set risk and split', 'process.3.description': 'Targets, drawdown and trader share vary inside the configurator.',
    'process.4.title': 'Request a reward', 'process.4.description': 'Most configurations are on-demand; Instant Pro adds profitable-day and minimum-profit gates.',
    'programs.title': 'Four product families with configuration-dependent rules.', 'programs.description': 'Bybit offers 6–10% target/drawdown choices, Cleo 9–14% targets with 3–8% drawdown, and Instant Pro starts at $1,250.',
    'programs.note': 'Displayed prices are live option snapshots; they should always carry a checked date.',
    'payouts.title': 'varies by the selected configuration.', 'payouts.description': 'The live pricing matrix shows 60–90% for Bybit/Cleo and 70–90% for Instant Pro; broader marketing says up to 100%.',
    'payouts.minimum': 'Plan dependent', 'payouts.processing': '4–12h stated · 48h guarantee', 'payouts.rail': 'Bank · Wise · crypto',
    'payouts.rule.1': 'Instant Pro requires three 0.5% profitable days.', 'payouts.rule.2': 'Instant Pro also requires at least 4% total profit.', 'payouts.rule.3': 'Pricing is canonical over broader “up to 100%” marketing.',
    'trading.title': 'Platform choice rewrites the trading rulebook.', 'trading.description': 'Bybit configurations advertise up to 1:100 leverage and stability rules; Cleo caps leverage near 1:5 and uses different risk bands.',
    'trading.markets': 'Crypto and platform-supported instruments', 'trading.leverage': 'Bybit up to 1:100 · Cleo up to 1:5',
    'consider.eyebrow': 'Risk and evidence', 'consider.title': 'Flexibility creates comparison and disclosure risk.',
    'consider.1.title': 'No universal split', 'consider.1.description': 'A single headline percentage hides a 60–90% or 70–90% configured range.',
    'consider.2.title': 'Stability varies by platform', 'consider.2.description': 'Bybit applies 30%/45% stability while Cleo is marketed without it.',
    'consider.3.title': 'Terms allow intervention', 'consider.3.description': 'Review, suspension, payout rejection and profit adjustment are expressly reserved.',
    'consider.4.title': 'Live pricing changes', 'consider.4.description': 'Checkout selections and discounts require dated snapshots for honest comparison.',
    'sources.unknowns': 'complete current option matrix, precise Instant Pro risk limits, restricted-country list, payout minimums and independent payout verification.',
    'model.classification': 'Configurable evaluation + instant funding', 'model.lifecycle': 'Configure product → simulated trading → funded stage → on-demand or gated payout', 'model.environment': 'Bybit or Cleo simulated accounts', 'model.compensation': '60–90% evaluation · 70–90% Instant Pro',
  },
  comparison: { modelTypes: ['evaluation', 'instant-funding'], capital: { status: 'varies', min: 1_250, max: 100_000, unit: 'USD' }, entryCost: { status: 'varies', min: 52.25, unit: 'USD', notes: 'Live option-dependent configurator.' }, profitSplit: { status: 'varies', min: 60, max: 90, unit: 'percent' }, maxDrawdown: { status: 'varies', min: 3, max: 10, unit: 'percent' }, payoutSchedules: { status: 'known', values: ['on-demand', 'conditional'] }, executionModels: { status: 'known', values: ['simulated'] } },
});

export const UPSCALE_TRADE_PAGE_PROFILE = page({
  slug: 'upscale-trade', name: 'Upscale Trade', modelTypes: ['evaluation', 'instant-funding'], offers: ['Basic', 'Accelerated', 'Turbo'],
  sources: [
    { category: 'website', url: 'https://upscale.trade/', label: 'Official website' },
    { category: 'rulebook', url: 'https://docs.upscale.trade/how-to-join-upscale/participation_requirements', label: 'Challenge and trading rules' },
    { category: 'payout-policy', url: 'https://docs.upscale.trade/how-upscale-works/withdrawal_rules', label: 'Withdrawal rules' },
    { category: 'terms', url: 'https://app.upscale.trade/terms-of-use-upscale.pdf', label: 'Terms of Use' },
  ],
  copy: {
    'promo.code': '', 'decision.title': 'Three routes to simulated funded status, including a direct Turbo path.',
    'decision.description': 'Upscale combines a two-stage Basic evaluation, one-stage Accelerated evaluation and Turbo instant-funded format. All use notional simulated accounts, while payouts settle in USDT and are subject to time, profit-day and size-based limits.',
    'decision.highlight': 'Turbo removes the evaluation but adds a trailing 6% drawdown and a 30% profit-concentration rule.',
    'process.title': 'Select speed, prove consistency, enter payout cycles', 'process.description': 'Each format changes the path to funded status, not the legal nature of the account.',
    'process.1.title': 'Choose Basic, Accelerated or Turbo', 'process.1.description': 'Two phases, one phase or immediate funded access.',
    'process.2.title': 'Meet target and profit days', 'process.2.description': 'Basic and Accelerated have targets; all payout paths require profit-day discipline.',
    'process.3.title': 'Trade the funded iteration', 'process.3.description': 'The account remains simulated with category-specific fees and funding.',
    'process.4.title': 'Request USDT after 14 days', 'process.4.description': 'Five profit days, no breach, free margin and a valid wallet are required.',
    'programs.title': 'Two evaluation paths plus a no-stage Turbo account.', 'programs.description': 'Basic uses 5% then 8%; Accelerated uses 10%; Turbo has no target and a 6% trailing maximum drawdown.',
    'programs.note': 'New $200K Basic accounts use an 8% maximum drawdown in stage two and funded status.',
    'payouts.title': 'is the standard trader share.', 'payouts.description': 'Withdrawals open after a 14-day period and five profit days, with size-based caps and a new balance iteration after payment.',
    'payouts.minimum': '$1', 'payouts.processing': 'Within 48h stated', 'payouts.rail': 'USDT · TON / Base / BSC',
    'payouts.rule.1': 'One request is allowed per payment period.', 'payouts.rule.2': 'The payout baseline resets to the post-withdrawal balance.', 'payouts.rule.3': 'Turbo and API accounts must satisfy the 30% rule.',
    'trading.title': 'Multi-asset simulated trading with explicit carrying costs.', 'trading.description': 'The TradingView-style web terminal and Telegram app cover crypto and real-world assets. Fees, spreads and fixed funding are part of the simulated P&L.',
    'trading.markets': 'Crypto · forex · metals · indices · stocks · WTI', 'trading.leverage': 'Asset and account dependent',
    'consider.eyebrow': 'Risk and evidence', 'consider.title': 'Payout eligibility is more complex than the headline cycle.',
    'consider.1.title': 'Profit-day definition changed', 'consider.1.description': 'Current rules include unrealized P&L; an older FAQ described realized closed-trade profit only.',
    'consider.2.title': 'Payout changes the baseline', 'consider.2.description': 'Each withdrawal creates a new trading iteration and recalculates the drawdown level.',
    'consider.3.title': 'Marketing and Terms differ on KYC', 'consider.3.description': 'Public pages have claimed no KYC while Terms preserve identity checks before withdrawal.',
    'consider.4.title': 'Non-market profits can be reviewed', 'consider.4.description': 'Rules allow rejection of gains attributed to bad quotes, failures, bugs or abnormal execution.',
    'rewards.title': 'Tournaments and demo discounts support the core funnel.', 'rewards.description': 'Upscale runs prize tournaments, a free demo path with a one-time discount and tiered referrals; no proprietary token is documented.',
    'sources.unknowns': 'full current price matrix, exact leverage table by asset, current KYC implementation, independent reserve proof and aggregate payout reconciliation.',
    'model.classification': 'Simulated evaluation + instant funding', 'model.lifecycle': 'Fee → evaluation or Turbo → funded iteration → 14-day USDT payout cycle', 'model.environment': 'TradingView web terminal · Telegram mini app', 'model.compensation': '80% standard · 90% upgrade',
  },
  comparison: { modelTypes: ['evaluation', 'instant-funding'], capital: { status: 'varies', min: 5_000, max: 400_000, unit: 'USD', notes: '$200K per challenge; $400K aggregate cap.' }, entryCost: { status: 'varies', min: 59, max: 1_599, unit: 'USD' }, profitSplit: { status: 'varies', min: 80, max: 90, unit: 'percent' }, maxDrawdown: { status: 'varies', min: 6, max: 10, unit: 'percent' }, payoutSchedules: { status: 'known', values: ['bi-weekly'] }, executionModels: { status: 'known', values: ['simulated'] } },
  reward: { label: 'Tournaments, demo discount and referrals', metrics: [['Demo', 'Free'], ['Demo reward', '20% discount'], ['Tournaments', 'Prize accounts'], ['Token / airdrop', 'Not documented']] },
});

export const SIZE_PAGE_PROFILE = page({
  slug: 'size', name: 'Size', modelTypes: ['competition'], offers: ['Alpha', 'Bronze', 'Silver', 'Gold', 'Diamond', 'Ruby'],
  sources: [
    { category: 'website', url: 'https://www.size.club/', label: 'Official website' },
    { category: 'rulebook', url: 'https://www.size.club/docs/how-size-works/product-tiers-keys-and-lives', label: 'Keys, Trials and Lives' },
    { category: 'payout-policy', url: 'https://www.size.club/docs/after-you-win/profit-split-and-payouts', label: 'Payout rules' },
    { category: 'terms', url: 'https://www.size.club/legal/terms-of-service.pdf', label: 'Terms of Service' },
  ],
  copy: {
    'promo.code': '', 'decision.title': 'A 15-minute competition, not a conventional evaluation.',
    'decision.description': 'Size sells Keys that enter short live-market Trials. Winning a Trial awards a simulated funded Life whose capital, drawdown and trader share depend on the tier—from the $1 Alpha entry to the $1,499 Ruby competition.',
    'decision.highlight': 'The trader competes for first place before receiving a funded Life; paying a Key does not itself start a normal multi-day challenge.',
    'process.title': 'Buy a Key, win a Trial, manage a Life', 'process.description': 'The competitive selection step is the defining mechanic.',
    'process.1.title': 'Choose a tier', 'process.1.description': 'Tier sets Key price, Life size, risk limits and profit share.',
    'process.2.title': 'Enter a 15-minute Trial', 'process.2.description': 'Trading uses live markets and leaderboard placement.',
    'process.3.title': 'Finish first', 'process.3.description': 'The winner receives the simulated funded Life for that tier.',
    'process.4.title': 'Withdraw USDC', 'process.4.description': 'Eligible profit settles on demand through the Size wallet.',
    'programs.title': 'Six competition tiers from $100 to $200K Lives.', 'programs.description': 'Key prices scale sharply with notional Life size; higher tiers tighten daily and total drawdown.',
    'programs.note': 'Product docs list Bronze at $9 while the Terms schedule has listed it as free.',
    'payouts.title': 'depends on the winning tier.', 'payouts.description': 'Payouts are on demand, partial withdrawals are allowed and settlement uses USDC through the Size wallet.',
    'payouts.minimum': '$5', 'payouts.processing': 'On demand', 'payouts.rail': 'USDC · HyperEVM wallet',
    'payouts.rule.1': 'Trader shares range from 60% to 85%; Alpha is 80%.', 'payouts.rule.2': 'Size states no internal payout fee; external withdrawal costs $1.', 'payouts.rule.3': 'The account remains a simulated funded Life.',
    'trading.title': 'Short live-market competitions lead to simulated funded accounts.', 'trading.description': 'Trials use live-market conditions, while the Terms classify the service as simulated skill-based entertainment and non-custodial.',
    'trading.markets': 'Crypto markets', 'trading.leverage': 'Tier dependent',
    'consider.eyebrow': 'Risk and evidence', 'consider.title': 'Competition odds matter as much as the published risk limits.',
    'consider.1.title': 'Winner-takes-selection', 'consider.1.description': 'A trader can perform positively and still fail to win the Trial leaderboard.',
    'consider.2.title': 'Bronze price conflict', 'consider.2.description': 'Product documentation says $9 while the Terms schedule has said free.',
    'consider.3.title': 'Simulation is explicit', 'consider.3.description': 'A Life is not custody of a real funded brokerage balance.',
    'consider.4.title': 'Tier economics vary', 'consider.4.description': 'Key price, drawdown and trader share must be compared together.',
    'rewards.title': 'XP tracks long-term activity across the Size ecosystem.', 'rewards.description': 'Permanent XP comes from wins, payouts, referrals, purchases, practice and missions; Preseason standings award funded-Life prizes.',
    'sources.unknowns': 'win probability by Trial tier, current participant counts, leverage table, complete asset list, independent payout audit and current Bronze price reconciliation.',
    'model.classification': 'Live-market competition → simulated funded Life', 'model.lifecycle': 'Key → 15-minute Trial → first place → funded Life → USDC payout', 'model.environment': 'Size competition terminal · HyperEVM wallet', 'model.compensation': '60–85% by tier · Alpha 80%',
  },
  comparison: { modelTypes: ['competition'], capital: { status: 'varies', min: 100, max: 200_000, unit: 'USD' }, entryCost: { status: 'varies', min: 1, max: 1_499, unit: 'USD' }, profitSplit: { status: 'varies', min: 60, max: 85, unit: 'percent' }, maxDrawdown: { status: 'varies', min: 8, max: 10, unit: 'percent' }, payoutSchedules: { status: 'known', values: ['on-demand'] }, executionModels: { status: 'known', values: ['competition', 'simulated funded'] } },
  reward: { label: 'XP progression and Preseason prizes', metrics: [['XP', 'Permanent score'], ['Earned from', 'Wins + activity'], ['Preseason', 'Funded-Life prizes'], ['Liquid token', 'Not documented']] },
});

export const POLYQUID_PAGE_PROFILE = page({
  slug: 'polyquid', name: 'Polyquid', modelTypes: ['evaluation'], offers: ['Waitlist'],
  sources: [{ category: 'website', url: 'https://www.polyquid.xyz/', label: 'Official waitlist' }],
  copy: {
    'promo.code': '', 'decision.title': 'A concept-stage cross-market prop product with no public rulebook.',
    'decision.description': 'Polyquid currently presents a waitlist around one challenge spanning Hyperliquid and Polymarket. Pricing, targets, risk limits, payouts, legal terms and operational mechanics are not publicly documented in the inspected first-party material.',
    'decision.highlight': 'This is a watchlist profile, not a product review: there is not enough official data for an informed purchase decision.',
    'process.title': 'What is public—and what is not', 'process.description': 'Only the product direction is visible today.',
    'process.1.title': 'Join the waitlist', 'process.1.description': 'The live site provides waitlist, Discord and X actions.',
    'process.2.title': 'One challenge is promised', 'process.2.description': 'No target, fee or drawdown framework is published.',
    'process.3.title': 'Two market venues are named', 'process.3.description': 'Hyperliquid and Polymarket appear in positioning copy.',
    'process.4.title': 'Recheck at launch', 'process.4.description': 'Rules, Terms and payout mechanics need a fresh review before comparison.',
    'programs.title': 'No purchasable programme is documented.', 'programs.description': 'The waitlist statement is not enough to construct a pricing or risk card.',
    'programs.note': 'All values remain ND rather than inferred from competing firms.',
    'payouts.title': 'is not documented.', 'payouts.description': 'No split, minimum, cadence, eligibility condition, currency or processing time is published.',
    'payouts.minimum': 'ND', 'payouts.processing': 'ND', 'payouts.rail': 'ND',
    'payouts.rule.1': 'No payout policy is linked.', 'payouts.rule.2': 'No legal entitlement language is published.', 'payouts.rule.3': 'No settlement proof is available.',
    'trading.title': 'Hyperliquid and Polymarket are positioning, not yet a rulebook.', 'trading.description': 'The site names both venues but does not explain execution, simulation, market coverage, leverage or prohibited strategies.',
    'trading.markets': 'Hyperliquid + Polymarket · marketing only', 'trading.leverage': 'ND',
    'consider.eyebrow': 'Launch readiness', 'consider.title': 'Nearly every decision-grade field is unresolved.',
    'consider.1.title': 'No rules', 'consider.1.description': 'Targets, phases, drawdown and time limits are absent.',
    'consider.2.title': 'No pricing', 'consider.2.description': 'There is no checkout or public fee schedule.',
    'consider.3.title': 'No Terms', 'consider.3.description': 'Operator, jurisdiction and account legal model are not disclosed.',
    'consider.4.title': 'No payout policy', 'consider.4.description': 'Split, cadence and settlement rails cannot be verified.',
    'sources.unknowns': 'pricing, rules, account model, execution, payouts, legal entity, restricted jurisdictions, rewards and launch timing.',
    'model.classification': 'Pre-launch / waitlist concept', 'model.lifecycle': 'Waitlist → undocumented future challenge', 'model.environment': 'Hyperliquid + Polymarket positioning', 'model.compensation': 'Not documented',
  },
  comparison: { modelTypes: ['evaluation'], capital: { status: 'ND', unit: 'USD' }, entryCost: { status: 'ND', unit: 'USD' }, profitSplit: { status: 'ND', unit: 'percent' }, maxDrawdown: { status: 'ND', unit: 'percent' }, payoutSchedules: { status: 'ND', values: [] }, executionModels: { status: 'ND', values: [] } },
});

export const FUNDED_HIVE_PAGE_PROFILE = page({
  slug: 'funded-hive', name: 'Funded Hive', modelTypes: ['evaluation', 'instant-funding'], offers: ['Pay After You Pass 1-Step', 'Classic 2-Step', 'Pay From Profits', 'InstantGrowth'],
  sources: [
    { category: 'website', url: 'https://fundedhive.com/funding-models', label: 'Funding models' },
    { category: 'faq', url: 'https://fundedhive.com/faq', label: 'Official FAQ' },
    { category: 'terms', url: 'https://fundedhive.com/downloads/terms-and-conditions.pdf', label: 'Terms and product annexes' },
    { category: 'payout-policy', url: 'https://fundedhive.com/transparency', label: 'On-chain transparency page' },
  ],
  copy: {
    'promo.code': '', 'decision.title': 'Multiple fee models feeding an automated A-Book payout system.',
    'decision.description': 'Funded Hive combines classic, pay-after-pass, pay-from-profits and instant products. Evaluations are simulated; funded accounts begin in A-Book routing, and only verified positive A-Book PnL is eligible for automated USDC payouts.',
    'decision.highlight': 'The payout system is genuinely more inspectable, but eligibility depends on routing and product-specific annexes—not only headline profit.',
    'process.title': 'Choose the fee model, pass, qualify A-Book profit', 'process.description': 'The product family changes when and how the funded fee is paid.',
    'process.1.title': 'Choose a funding model', 'process.1.description': 'Classic, pay-after-pass, pay-from-profits and instant paths differ materially.',
    'process.2.title': 'Complete simulated rules', 'process.2.description': 'Targets and risk limits depend on the product and risk category.',
    'process.3.title': 'Enter funded routing', 'process.3.description': 'AADS begins with A-Book execution and can change routing by predefined thresholds.',
    'process.4.title': 'Claim USDC on-chain', 'process.4.description': 'The contract pays eligible verified A-Book profit subject to daily caps.',
    'programs.title': 'Four product families and a progression of risk categories.', 'programs.description': 'Entry timing, funded fee, split and leverage can change across NewBee, WorkerBee and QueenBee conditions.',
    'programs.note': 'The full Terms and the exact product annex—not a marketing card—must control each configuration.',
    'payouts.title': 'is automated only after A-Book eligibility.', 'payouts.description': 'The contract pays USDC without a manual finance queue, but verification, routing, gas and daily security caps still apply.',
    'payouts.minimum': '$50', 'payouts.processing': '≈60 seconds stated', 'payouts.rail': 'USDC · ERC-20 contract',
    'payouts.rule.1': 'All positions must be closed.', 'payouts.rule.2': 'Classic/PFP daily cap is $1,000 per connected address.', 'payouts.rule.3': 'Only verified positive A-Book PnL is withdrawable.',
    'trading.title': 'cTrader in evaluation; hybrid AADS routing after funding.', 'trading.description': 'The model distinguishes simulated evaluation, A-Book market routing and B-Book states. News trading and limited automation are allowed; copy trading, hedging and exploitative HFT are prohibited.',
    'trading.markets': 'FX and supported cTrader instruments', 'trading.leverage': '1:50–1:200 by risk tier',
    'consider.eyebrow': 'Risk and evidence', 'consider.title': 'On-chain proof improves traceability but does not erase eligibility complexity.',
    'consider.1.title': 'A-Book profit gate', 'consider.1.description': 'A displayed funded profit is not automatically withdrawable unless verified as positive A-Book PnL.',
    'consider.2.title': 'Product annexes matter', 'consider.2.description': 'Daily caps, funded fees, routing and risk categories vary across products.',
    'consider.3.title': 'Marketing is absolute', 'consider.3.description': '“No room for disputes” copy is broader than the suspension, verification and reversal rights in Terms.',
    'consider.4.title': 'Public hashes are useful', 'consider.4.description': 'Transaction rows and certificates offer better payout traceability than screenshots alone.',
    'rewards.title': 'Hive Coin is embedded in refunds and repeat purchases.', 'rewards.description': 'Some products can issue a 200% fee refund in Hive Coin, which can fund part of another challenge; payout certificates may also be minted.',
    'sources.unknowns': 'independent smart-contract audit, complete live price matrix, current routing thresholds, reserve liabilities and jurisdiction-by-jurisdiction availability.',
    'model.classification': 'Simulated evaluation → hybrid AADS funded routing', 'model.lifecycle': 'Access fee → challenge → funded fee/risk class → A-Book PnL → USDC contract payout', 'model.environment': 'cTrader · AADS · ERC-20 smart contract', 'model.compensation': 'Product/risk-tier dependent',
  },
  comparison: { modelTypes: ['evaluation', 'instant-funding'], capital: { status: 'varies', min: 5_000, max: 200_000, unit: 'USD' }, entryCost: { status: 'varies', min: 9, max: 399, unit: 'USD', notes: 'Access and funded fees vary by product.' }, profitSplit: { status: 'varies', min: 60, max: 99, unit: 'percent' }, maxDrawdown: { status: 'varies', min: 10, max: 10, unit: 'percent' }, payoutSchedules: { status: 'known', values: ['conditional', 'on-chain'] }, executionModels: { status: 'known', values: ['simulated', 'A-book', 'B-book'] } },
  reward: { label: 'Hive Coin refunds and payout certificates', metrics: [['Hive Coin', 'Utility credit'], ['Fee refund', 'Up to 200% stated'], ['Repeat purchase', 'Up to 50% covered'], ['Payout proof', 'Hash / NFT certificate']] },
});

export const CF_TRADER_PAGE_PROFILE = page({
  slug: 'cf-trader', name: 'Crypto Fund Trader', modelTypes: ['evaluation', 'instant-funding'], offers: ['2-Phase', '1-Phase', 'Instant'],
  sources: [
    { category: 'website', url: 'https://cryptofundtrader.com/', label: 'Official website' },
    { category: 'faq', url: 'https://cryptofundtrader.com/faq/', label: 'Rules and payout FAQ' },
    { category: 'terms', url: 'https://cryptofundtrader.com/terms-and-conditions/', label: 'Terms and fee schedules' },
    { category: 'token-rewards', url: 'https://cryptofundtrader.com/competitive-ranking/', label: 'Competitive Ranking' },
  ],
  copy: {
    'promo.code': '', 'decision.title': 'Conventional simulated challenges with crypto-focused instruments.',
    'decision.description': 'Crypto Fund Trader offers two-phase, one-phase and instant simulated accounts from $2.5K to $200K. The main trade-off is between fixed two-phase risk, trailing one-phase drawdown and the higher entry cost of Instant.',
    'decision.highlight': 'Payout eligibility is measured in traded days, not simply calendar time, and the one-phase drawdown trails balance highs.',
    'process.title': 'Choose the drawdown model, trade enough days, complete KYC', 'process.description': 'Account type changes evaluation stages and loss mechanics.',
    'process.1.title': 'Choose 2-Phase, 1-Phase or Instant', 'process.1.description': 'Each path uses different targets, drawdown and account-size ranges.',
    'process.2.title': 'Respect strategy restrictions', 'process.2.description': 'HFT, tick scalping, latency arbitrage and gambling-style trading are prohibited.',
    'process.3.title': 'Complete traded-day eligibility', 'process.3.description': 'Standard payouts use 15 traded days or a monthly window; weekly is an add-on.',
    'process.4.title': 'Verify and withdraw', 'process.4.description': 'KYC, contract acceptance and closed trades are required before payment.',
    'programs.title': 'Fixed, trailing and instant paths in one catalogue.', 'programs.description': 'Two-phase uses 8% then 5% with 10% fixed loss; one-phase uses a 10% target and 6% trailing loss.',
    'programs.note': 'Instant is limited to smaller documented sizes than the evaluation products.',
    'payouts.title': 'follows traded-day eligibility.', 'payouts.description': 'Standard access comes after 15 traded days or every 30 calendar days; a paid weekly option uses seven traded days.',
    'payouts.minimum': 'Not normalized', 'payouts.processing': '≈8h avg · up to 48 business hours', 'payouts.rail': 'Bank · USDT · BTC · ETH',
    'payouts.rule.1': 'All trades must be closed.', 'payouts.rule.2': 'KYC and a signed contract are required.', 'payouts.rule.3': 'The Terms frame payment as a performance-based scholarship reward.',
    'trading.title': 'Simulated multi-asset trading with anti-exploit restrictions.', 'trading.description': 'The firm states it does not add artificial spread or slippage; automated and high-frequency techniques remain restricted by the FAQ.',
    'trading.markets': 'Crypto plus supported multi-asset instruments', 'trading.leverage': 'Account and asset dependent',
    'consider.eyebrow': 'Risk and evidence', 'consider.title': 'The evaluation rules are clear; payout economics need finer normalization.',
    'consider.1.title': 'Trailing one-phase risk', 'consider.1.description': 'The 6% one-phase drawdown follows balance highs and is not equivalent to 10% fixed loss.',
    'consider.2.title': 'Traded days delay access', 'consider.2.description': 'A calendar month alone does not replace the documented minimum traded-day route.',
    'consider.3.title': 'Broad prohibited-strategy language', 'consider.3.description': 'Gambling-style trading and exploit categories can require contextual enforcement.',
    'consider.4.title': 'No single split stored', 'consider.4.description': 'Current research should capture profit share by product before direct comparison.',
    'rewards.title': 'Competitive Ranking turns activity into seasonal ELO.', 'rewards.description': 'Successful trades, passed phases and reward requests contribute to rankings with cash, evaluation and subscription prizes.',
    'sources.unknowns': 'current profit split by product, complete live price grid, leverage table, payout minimum, restricted countries and independent payout ledger.',
    'model.classification': 'Simulated evaluation + instant funding', 'model.lifecycle': 'Fee → simulated account → funded stage → KYC/contract → scholarship reward', 'model.environment': 'Crypto Fund Trader simulated platforms', 'model.compensation': 'Product dependent · not fully normalized',
  },
  comparison: { modelTypes: ['evaluation', 'instant-funding'], capital: { status: 'varies', min: 2_500, max: 200_000, unit: 'USD' }, entryCost: { status: 'varies', min: 40, max: 1_250, unit: 'USD' }, profitSplit: { status: 'ND', unit: 'percent' }, maxDrawdown: { status: 'varies', min: 6, max: 10, unit: 'percent' }, payoutSchedules: { status: 'known', values: ['monthly', 'weekly add-on'] }, executionModels: { status: 'known', values: ['simulated'] } },
  reward: { label: 'Seasonal ELO and competition prizes', metrics: [['Ranking', 'ELO'], ['Earned from', 'Trading milestones'], ['Prizes', 'Cash + evaluations'], ['Token / airdrop', 'Not documented']] },
});

const foxifyBase = FIRM_NORMALIZED_PROFILES_BY_SLUG.foxify;
const o2Base = FIRM_NORMALIZED_PROFILES_BY_SLUG.o2;
const solanaBase = FIRM_NORMALIZED_PROFILES_BY_SLUG['solana-funded'];
const vantaBase = FIRM_NORMALIZED_PROFILES_BY_SLUG['vanta-trading'];
const kleinBase = FIRM_NORMALIZED_PROFILES_BY_SLUG['klein-funding'];
const upscaleBase = FIRM_NORMALIZED_PROFILES_BY_SLUG['upscale-trade'];
const sizeBase = FIRM_NORMALIZED_PROFILES_BY_SLUG.size;
const polyquidBase = FIRM_NORMALIZED_PROFILES_BY_SLUG.polyquid;
const fundedHiveBase = FIRM_NORMALIZED_PROFILES_BY_SLUG['funded-hive'];
const cfTraderBase = FIRM_NORMALIZED_PROFILES_BY_SLUG['cf-trader'];
const vantaPricingUrl = 'https://www.vantatrading.io/pricing';
const vantaTier = (accountSize: number, fee: number, originalFee = fee) => ({
  accountSize: observed(accountSize, vantaPricingUrl),
  fee: observed(fee, vantaPricingUrl),
  originalFee: observed(originalFee, vantaPricingUrl),
  currency: observed<'USD'>('USD', vantaPricingUrl),
  available: observed(true, vantaPricingUrl),
});

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
export const SOLANA_FUNDED_NORMALIZED_PROFILE: FirmNormalizedProfile = {
  ...solanaBase,
  checkedAt: CHECKED_AT,
  tradingPolicy: {
    ...solanaBase.tradingPolicy,
    platforms: observed(['Solana Funded platform'], 'https://docs.solanafunded.com/'),
    markets: observed(['Solana ecosystem tokens'], 'https://docs.solanafunded.com/'),
  },
  executionPolicy: { ...solanaBase.executionPolicy, venue: observed('Simulated platform · Solana settlement', 'https://solanafunded.com/terms-of-service') },
  modularProfile: SOLANA_FUNDED_PAGE_PROFILE,
};
export const VANTA_TRADING_NORMALIZED_PROFILE: FirmNormalizedProfile = {
  ...vantaBase,
  checkedAt: CHECKED_AT,
  challengePrograms: observed((vantaBase.challengePrograms.status === 'ND' ? [] : vantaBase.challengePrograms.value).map((program) => ({
    ...program,
    tiers: observed([
      vantaTier(1_000, 9),
      vantaTier(5_000, 24, 59),
      vantaTier(10_000, 39, 99),
      vantaTier(25_000, 84, 199),
      vantaTier(50_000, 159, 349),
      vantaTier(100_000, 299, 599),
    ], vantaPricingUrl),
  })), vantaPricingUrl),
  tradingPolicy: {
    ...vantaBase.tradingPolicy,
    platforms: observed(['Vanta trading platform'], 'https://www.vantatrading.io/rules'),
    markets: observed(['Hyperliquid markets'], 'https://www.vantatrading.io/rules'),
  },
  executionPolicy: { ...vantaBase.executionPolicy, venue: observed('Hyperliquid market data · simulated account', 'https://www.vantatrading.io/terms-of-service') },
  modularProfile: VANTA_TRADING_PAGE_PROFILE,
};
export const KLEIN_FUNDING_NORMALIZED_PROFILE: FirmNormalizedProfile = {
  ...kleinBase,
  checkedAt: CHECKED_AT,
  tradingPolicy: { ...kleinBase.tradingPolicy, platforms: observed(['Bybit', 'Cleo'], 'https://kleinfunding.com/pricing') },
  executionPolicy: { ...kleinBase.executionPolicy, venue: observed('Bybit or Cleo simulated account', 'https://kleinfunding.com/terms-of-use') },
  modularProfile: KLEIN_FUNDING_PAGE_PROFILE,
};
export const UPSCALE_TRADE_NORMALIZED_PROFILE: FirmNormalizedProfile = {
  ...upscaleBase,
  checkedAt: CHECKED_AT,
  tradingPolicy: {
    ...upscaleBase.tradingPolicy,
    platforms: observed(['Upscale web terminal', 'Telegram mini app'], 'https://docs.upscale.trade/introduction/goals_and_benefits'),
    markets: observed(['Crypto', 'Forex', 'Metals', 'Indices', 'Stocks', 'WTI'], 'https://docs.upscale.trade/introduction/goals_and_benefits'),
  },
  executionPolicy: { ...upscaleBase.executionPolicy, venue: observed('Upscale web terminal · Telegram mini app', 'https://docs.upscale.trade/introduction/goals_and_benefits') },
  modularProfile: UPSCALE_TRADE_PAGE_PROFILE,
};
export const SIZE_NORMALIZED_PROFILE: FirmNormalizedProfile = {
  ...sizeBase,
  checkedAt: CHECKED_AT,
  tradingPolicy: { ...sizeBase.tradingPolicy, platforms: observed(['Size competition terminal'], 'https://www.size.club/docs/how-size-works/product-tiers-keys-and-lives'), markets: observed(['Crypto markets'], 'https://www.size.club/docs/how-size-works/product-tiers-keys-and-lives') },
  executionPolicy: { ...sizeBase.executionPolicy, venue: observed('Size terminal · HyperEVM payout wallet', 'https://www.size.club/docs/after-you-win/profit-split-and-payouts') },
  modularProfile: SIZE_PAGE_PROFILE,
};
export const POLYQUID_NORMALIZED_PROFILE: FirmNormalizedProfile = { ...polyquidBase, checkedAt: CHECKED_AT, modularProfile: POLYQUID_PAGE_PROFILE };
export const FUNDED_HIVE_NORMALIZED_PROFILE: FirmNormalizedProfile = {
  ...fundedHiveBase,
  checkedAt: CHECKED_AT,
  tradingPolicy: {
    ...fundedHiveBase.tradingPolicy,
    platforms: observed(['cTrader'], 'https://fundedhive.com/funding-models'),
    markets: observed(['Forex', 'Supported cTrader instruments'], 'https://fundedhive.com/funding-models'),
    leverage: observed(['FX 1:50–1:200 by risk tier'], 'https://fundedhive.com/funding-models'),
    newsTrading: observed('allowed', 'https://fundedhive.com/funding-models'),
    automatedTrading: observed('restricted', 'https://fundedhive.com/faq'),
    copyTrading: observed('restricted', 'https://fundedhive.com/funding-models', 'Official rules prohibit copy trading.'),
  },
  executionPolicy: { ...fundedHiveBase.executionPolicy, venue: observed('cTrader · Automated A-Book Dealing System', 'https://fundedhive.com/faq'), onchainSettlement: observed(true, 'https://fundedhive.com/faq') },
  modularProfile: FUNDED_HIVE_PAGE_PROFILE,
};
export const CF_TRADER_NORMALIZED_PROFILE: FirmNormalizedProfile = {
  ...cfTraderBase,
  checkedAt: CHECKED_AT,
  tradingPolicy: { ...cfTraderBase.tradingPolicy, platforms: observed(['Crypto Fund Trader platforms'], 'https://cryptofundtrader.com/faq/'), markets: observed(['Crypto', 'Forex', 'Indices', 'Commodities'], 'https://cryptofundtrader.com/faq/') },
  executionPolicy: { ...cfTraderBase.executionPolicy, venue: observed('Simulated multi-asset trading platforms', 'https://cryptofundtrader.com/terms-and-conditions/') },
  modularProfile: CF_TRADER_PAGE_PROFILE,
};
