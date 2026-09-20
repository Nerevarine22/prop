import { withHyroTraderRules } from './hyroTraderRules';
import type { FirmContentBlock, FirmNormalizedProfileV2, NormalizedChallengeProgram, NormalizedFact } from '@/types/database';

export const HYROTRADER_PRICING_CHECKED_AT = '2026-09-20T00:00:00.000Z';
export const HYROTRADER_PRICING_SOURCE = 'https://www.hyrotrader.com/';
export const HYROTRADER_SWING_SOURCE = 'https://www.hyrotrader.com/faq/rules/how-is-the-5-daily-drawdown-calculated/';
export const HYROTRADER_TRIAL_SOURCE = 'https://www.hyrotrader.com/free-trial/';
const sizes = [5_000, 10_000, 25_000, 50_000, 100_000, 200_000];
const prices = [
  { name: 'One-Step', fees: [69, 129, 299, 499, 749, 1299], swing: [39, 59, 119, 169, 229, 419] },
  { name: 'Two-Step', fees: [59, 119, 249, 379, 579, 969], swing: [29, 49, 89, 119, 179, 299] },
];
const money = (value: number) => `$${value.toLocaleString('en-US')}`;
export const hyroPricingFact = <T,>(value: T): NormalizedFact<T> => ({
  status: 'reported', value,
  evidence: [{ sourceUrl: HYROTRADER_PRICING_SOURCE, checkedAt: HYROTRADER_PRICING_CHECKED_AT, notes: 'Company-reported homepage pricing; each size and challenge type checked in the interactive calculator.' }],
});

export function updateHyroTraderPrograms(programs: NormalizedChallengeProgram[]): NormalizedChallengeProgram[] {
  return programs.map((program) => {
    const price = prices.find((item) => item.name === program.name);
    if (!price) throw new Error(`Unexpected HyroTrader program: ${program.name}`);
    return {
      ...program,
      tiers: hyroPricingFact(sizes.map((accountSize, index) => ({
        accountSize: hyroPricingFact(accountSize), fee: hyroPricingFact(price.fees[index]),
        swingUpgradeFee: hyroPricingFact(price.swing[index]),
        originalFee: { status: 'ND' as const, value: 'ND' as const, evidence: [], notes: 'No separate discounted/original price is shown.' },
        currency: hyroPricingFact('USD' as const), available: hyroPricingFact(true),
      }))),
    };
  });
}

export function withHyroTraderPricing(profile: FirmNormalizedProfileV2): FirmNormalizedProfileV2 {
  const tables: FirmContentBlock[] = prices.map((price) => ({
    id: `hyrotrader-pricing-${price.name.toLowerCase()}`, type: 'table', title: price.name,
    description: 'Capital is denominated in USDT; fees and optional Swing upgrades are quoted in USD.',
    columns: [{ key: 'capital', label: 'Capital (USDT)' }, { key: 'base', label: 'Base fee' }, { key: 'upgrade', label: 'Swing add-on' }, { key: 'total', label: 'With Swing' }, { key: 'increase', label: 'Increase' }],
    rows: sizes.map((size, index) => ({
      id: `${price.name.toLowerCase()}-${size}`,
      cells: { capital: size.toLocaleString('en-US'), base: money(price.fees[index]), upgrade: `+${money(price.swing[index])}`, total: money(price.fees[index] + price.swing[index]), increase: `+${(price.swing[index] / price.fees[index] * 100).toFixed(1)}%` },
    })),
  }));
  return withHyroTraderRules({
    ...profile,
    editorialCopy: {
      ...profile.editorialCopy,
      'hero.title': 'Crypto Prop Firm That Pays Up to 90%',
      'hero.description': 'Get funded with up to $200,000 to trade USDT perpetuals on your own Bybit account or terminal. Withdraw your profits in USDT or USDC.',
      'hero.attribution': 'How HyroTrader describes itself',
      'trial.title': 'Free Trial Account',
      'trial.description': 'Run the funded account challenge free in demo mode: practice on up to $200K of simulated capital with real market data before paying for the real evaluation. No credit card required.',
      'trial.note': 'Demo only: no payouts or automatic qualification for funding. One active free trial per trader.',
      'trial.url': HYROTRADER_TRIAL_SOURCE,
      'programs.note': 'Swing is optional; percentage increases are calculated as add-on ÷ base fee, rounded to one decimal. Prices may change; confirm the final quote before purchase.',
      'programs.swing': 'Swing drawdown upgrade changes the daily loss reference from the intraday peak to the start-of-day equity. It does not increase your account capital. Check the applicable rules before choosing.',
      'programs.source': HYROTRADER_PRICING_SOURCE,
      'programs.swingSource': HYROTRADER_SWING_SOURCE,
    },
    comparison: { ...profile.comparison, entryCost: { status: 'varies', min: 59, max: 1299, unit: 'USD', notes: 'Base evaluation fees; optional Swing upgrade costs extra.' } },
    sections: profile.sections.map((section) => section.id === 'offers' ? { ...section, blocks: [...section.blocks.filter((block) => !block.id.startsWith('hyrotrader-pricing-')), ...tables] } : section),
    sourcesInspected: [...(profile.sourcesInspected ?? []).filter((source) => ![HYROTRADER_PRICING_SOURCE, HYROTRADER_SWING_SOURCE, HYROTRADER_TRIAL_SOURCE].includes(source.url)),
      { category: 'website', url: HYROTRADER_PRICING_SOURCE, checkedAt: HYROTRADER_PRICING_CHECKED_AT, outcome: 'accessed' },
      { category: 'rulebook', url: HYROTRADER_SWING_SOURCE, checkedAt: HYROTRADER_PRICING_CHECKED_AT, outcome: 'accessed' },
      { category: 'faq', url: HYROTRADER_TRIAL_SOURCE, checkedAt: HYROTRADER_PRICING_CHECKED_AT, outcome: 'accessed' }],
  });
}
