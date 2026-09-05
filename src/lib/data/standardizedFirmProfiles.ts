import { FIRM_NORMALIZED_PROFILES_BY_SLUG } from './firmNormalizedProfiles';
import type { FirmNormalizedProfile, FirmNormalizedProfileV2, FirmResearchSourceInspection, FirmContentFact, NormalizedFact } from '@/types/database';

const CHECKED_AT = '2026-09-05T00:00:00.000Z';

type PageConfig = {
  slug: 'foxify' | 'hypernova' | 'o2' | 'solana-funded' | 'vanta-trading' | 'klein-funding' | 'upscale-trade';
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

const foxifyBase = FIRM_NORMALIZED_PROFILES_BY_SLUG.foxify;
const o2Base = FIRM_NORMALIZED_PROFILES_BY_SLUG.o2;
const solanaBase = FIRM_NORMALIZED_PROFILES_BY_SLUG['solana-funded'];
const vantaBase = FIRM_NORMALIZED_PROFILES_BY_SLUG['vanta-trading'];
const kleinBase = FIRM_NORMALIZED_PROFILES_BY_SLUG['klein-funding'];
const upscaleBase = FIRM_NORMALIZED_PROFILES_BY_SLUG['upscale-trade'];
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
