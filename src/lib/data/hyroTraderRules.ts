import type { FirmContentBlock, FirmNormalizedProfile, FirmNormalizedProfileV2, NormalizedFact } from '@/types/database';

const checkedAt = '2026-09-20T00:00:00.000Z';
const base = 'https://www.hyrotrader.com/';
const rules = `${base}trading-rules/`;
const terms = `${base}terms-and-conditions/`;
const faq = (path: string) => `${base}faq/${path}/`;
export const hyroRuleFact = <T,>(value: T, sourceUrl = rules): NormalizedFact<T> => ({ status: 'reported', value, evidence: [{ sourceUrl, checkedAt }] });
const entries = [
  ['daily', 'Daily drawdown: Standard vs Swing', 'Standard follows the highest intraday equity, including unrealized profit. Swing uses equity at the start of the day. The allowance is 4% of initial balance for One-Step and 5% for Two-Step. These same daily limits continue in funded accounts. Open P&L and fees count; the daily reference resets in UTC. Reaching the loss floor is a breach.', faq('rules/how-is-the-5-daily-drawdown-calculated')],
  ['example', 'A $5,000 account example', 'One-Step allows $200 daily; Two-Step allows $250. If Standard equity peaks at $5,200, the floors become $5,000 / $4,950. If a Swing day starts at $4,900, the floors are $4,700 / $4,650. These are daily floors, not the overall maximum-loss limit.', faq('rules/how-is-the-5-daily-drawdown-calculated')],
  ['overall', 'Overall maximum loss is a separate limit', 'The overall maximum loss remains 6% for One-Step and 10% for Two-Step in funded accounts. Equity includes open losses. The reviewed table does not clearly establish whether the overall reference is fixed or trailing; do not apply the daily Swing formula to this limit.', rules],
  ['days', 'Targets and qualifying trading days', 'One-Step: 10% target and at least 5 trading days. Two-Step: 10% then 5%, with at least 5 days in each phase. There is no evaluation deadline. A qualifying trade requires notional size of at least 5% of initial balance and absolute P&L of at least 1% of its value; the closing day counts. The FAQ also requires opening a position on each counted day.', faq('evaluation-process/minimum-trading-days')],
  ['consistency', 'Evaluation only: 40% profit distribution', 'During both evaluation phases, a single day may contribute at most 40% of total net profit. The excess portion is excluded from eligible evaluation profit. Funded accounts have no 40% profit-distribution rule.', faq('trading-restrictions/i-have-one-trading-day-that-exceeds-the-profit-distribution-rule-what-happens-now')],
  ['funded', 'Funded only: margin and exposure caps', 'Total margin used by open positions is capped at 25% of initial balance; total open-position notional is capped at twice initial balance. These caps apply only once funded. Exceeding either may result in penalties or funded-account cancellation. Daily and overall loss limits continue from the challenge.', faq('rules/are-there-any-other-rules-for-a-funded-account')],
  ['trade', 'Per-position loss and stop losses', 'The realized loss on a single position must not exceed 3% of initial balance. This applies in evaluation and funded accounts; position value may be larger if the loss stays within the limit. Trading fees count toward PnL and the 3% limit. Multiple trades on the same coin may be grouped as one position. A stop-loss order itself is not mandatory; funded breaches are manually reviewed.', faq('rules/what-is-the-maximum-loss-per-trade-rule')],
  ['costs', 'Trading fees and perpetual funding', 'Bybit/Tealstreet USDT perpetual fees are 0.0200% maker and 0.0550% taker. CLEO fees are 0.0200% maker and 0.0500% taker. Trading fees affect PnL and count toward the 3% per-position loss limit. Perpetual funding is separate from maker/taker fees and can affect account equity.', faq('cleo-platform/what-are-cleos-fees')],
  ['strategy', 'Platform-specific hedging rules', 'Hedging between different accounts is prohibited. Hedging is allowed within one Bybit account, but CLEO does not support it. Martingale is prohibited. Combined leveraged exposure to low-cap coins is limited to 5% of initial capital. Manual risk review can affect eligible profit and payouts.', faq('rules/what-are-the-risk-management-conditions-at-hyrotrader')],
  ['news', 'News, copying and overnight positions', 'News trading is conditional: a strategy based solely on news is prohibited, but existing positions need not be closed for news. Copying other traders is prohibited. Funded positions may remain open overnight and over weekends.', faq('trading-restrictions/is-news-trading-allowed')],
  ['inactivity', 'Inactivity: two different published rules', 'The trading FAQ disables a challenge after more than 30 days without a closed trade. Terms §20.4 separately allow platform-account closure after 90 days without login or simulated trading, with 14 days’ notice. Do not treat that platform provision as extending the challenge’s 30-day window.', faq('rules/do-you-have-an-inactivity-rule')],
  ['swing', 'Choose Swing before activation', 'The upgrade is available only when setting up a new challenge and cannot be added to an already active challenge. It changes the daily loss reference, not account capital or the overall loss percentage.', faq('swing-daily-drawdown-upgrade/can-i-upgrade-an-already-active-challenge-to-swing')],
  ['evidence', 'Where official descriptions differ', 'The detailed calculation FAQ uses equity; the short Standard/Swing comparison uses balance. We use the detailed equity calculation. For Two-Step maximum loss, the formal table says 10%, while a blog gives 6%. The table takes precedence here. Confirm the rules attached to your account before trading.', faq('rules/what-is-the-difference-between-standard-trailing-and-swing-fixed-daily-drawdown')],
] as const;
const extraSources = [terms, faq('rules/d'), faq('rules/do-i-have-to-close-my-positions-overnight'), faq('trading-restrictions/is-copy-trading-allowed'), faq('evaluation-process/how-many-days-do-i-have-to-complete-the-challenge'), faq('trading-restrictions/what-are-prohibited-trading-actions'), faq('swing-daily-drawdown-upgrade/what-is-the-cost-to-upgrade-a-challenge-to-swing'), faq('tealstreet-terminal/what-are-bybits-fees-via-the-tealstreet-terminal'), faq('cleo-platform/what-are-cleos-fees'), `${base}blog/prop-firm-pass-rates/`];

export function withHyroTraderRules(profile: FirmNormalizedProfileV2): FirmNormalizedProfileV2 {
  const blocks: FirmContentBlock[] = entries.map(([id, title, paragraph, sourceUrl]) => ({ id: `hyrotrader-rule-${id}`, type: 'text', title, paragraphs: [paragraph], status: 'reported', evidence: [{ sourceUrl, checkedAt }] }));
  const presentationBlocks: FirmContentBlock[] = [
    {
      id: 'hyrotrader-risk-metrics', type: 'fact-grid', columns: 3, presentation: 'metrics', items: [
        { id: 'open-margin', label: 'Open margin', value: '25%', note: 'Maximum share of initial balance used as open margin across all positions.' },
        { id: 'total-exposure', label: 'Total exposure', value: '2×', note: 'Maximum combined notional value of open positions relative to initial balance.' },
        { id: 'per-position-loss', label: 'Per-position loss', value: '3%', note: 'Realized-loss threshold per position, including fees. Applies in evaluation and funded; same-coin trades may be grouped as one position. Funded breaches can trigger manual review.' },
      ],
    },
    {
      id: 'hyrotrader-operating-rules', type: 'fact-grid', columns: 2, presentation: 'details', items: [
        { id: 'stop-loss', label: 'Stop loss', value: 'Not mandatory' },
        { id: 'copy-trading', label: 'Copy trading', value: 'Not allowed' },
        { id: 'hedging', label: 'Hedging', value: 'Bybit: one account · CLEO: unsupported' },
        { id: 'overnight-weekends', label: 'Overnight & weekends', value: 'Allowed' },
        { id: 'markets', label: 'Markets', value: '700+ Bybit · 500+ CLEO' },
        { id: 'funded-drawdown', label: 'Funded daily / max loss', value: 'One-Step 4% / 6% · Two-Step 5% / 10%' },
        { id: 'news-trading', label: 'News trading', value: 'Conditional' },
        { id: 'leverage', label: 'Leverage', value: 'Up to 1:100' },
        { id: 'profit-distribution', label: '40% profit distribution', value: 'Evaluation only' },
      ],
    },
    {
      id: 'hyrotrader-fees', type: 'table', title: 'Bybit / Tealstreet and CLEO',
      description: 'Trading fees · USDT perpetuals',
      facts: [{ id: 'fee-note', label: 'Fee note', value: 'Trading fees count toward PnL and the 3% per-position loss limit. Perpetual funding is separate from maker/taker fees.' }],
      columns: [{ key: 'platform', label: 'Platform' }, { key: 'maker', label: 'Maker' }, { key: 'taker', label: 'Taker' }],
      rows: [
        { id: 'bybit', cells: { platform: 'Bybit USDT', maker: '0.0200%|2 bp', taker: '0.0550%|5.5 bp' } },
        { id: 'cleo', cells: { platform: 'CLEO', maker: '0.0200%|2 bp', taker: '0.0500%|5 bp' } },
      ],
    },
    {
      id: 'hyrotrader-platform-requirements', type: 'fact-grid', columns: 2, presentation: 'details', items: [
        { id: 'bybit-route', label: 'Bybit / Tealstreet', value: 'A Bybit account is required for this route. KYC applies to live-account trading; demo challenges do not require KYC.' },
        { id: 'cleo-route', label: 'CLEO', value: 'Available without a Bybit account.' },
      ],
    },
  ];
  const fundedRuleIds = new Set(['hyrotrader-rule-daily', 'hyrotrader-rule-overall', 'hyrotrader-rule-consistency', 'hyrotrader-rule-funded', 'hyrotrader-rule-trade', 'hyrotrader-rule-costs', 'hyrotrader-rule-strategy', 'hyrotrader-rule-news', 'hyrotrader-rule-inactivity']);
  const challengeBlocks = blocks.filter((block) => !fundedRuleIds.has(block.id));
  const fundedBlocks = blocks.filter((block) => fundedRuleIds.has(block.id));
  const urls = [...new Set([...entries.map((entry) => entry[3]), ...extraSources])];
  const updated: FirmNormalizedProfileV2 = { ...profile,
    editorialCopy: { ...profile.editorialCopy,
      'hero.attribution': 'How HyroTrader describes itself',
      'decision.title': 'Crypto evaluations with distinct daily and overall loss limits.',
      'decision.description': 'One-Step uses 4% daily / 6% maximum loss; Two-Step uses 5% daily / 10% maximum loss. Standard follows intraday peak equity; optional Swing uses start-of-day equity.',
      'decision.highlight': 'Exchange connectivity is marketed by the firm. Terms §3.2 describe all phases as simulated; funded rewards depend on a separate agreement.',
      'process.2.title': 'Complete qualifying trading days', 'process.2.description': 'At least 5 days for One-Step; 5 + 5 for Two-Step. The 40% best-day rule applies during evaluation only.',
      'process.3.title': 'Enter the funded phase', 'process.3.description': 'Subject to approval and a separate funded agreement. Terms describe simulated trading and performance-based rewards.',
      'programs.description': 'One-Step: 10% target, 4% daily loss and 6% maximum loss. Two-Step: 10% then 5% targets, 5% daily loss and 10% maximum loss.',
      'programs.swing': 'Standard follows intraday peak equity; Swing uses start-of-day equity. The dollar allowance remains 4% / 5% of initial capital. Choose Swing before activating a new challenge; it cannot be added to an active one.',
      'trading.title': 'Funded account risk controls',
      'trading.description': 'Funded accounts keep challenge drawdown limits: One-Step 4% daily / 6% maximum; Two-Step 5% / 10%. The funded stage adds 25% margin and 2× total-position limits.',
      'consider.title': 'Read the rules by phase and account type.',
      'consider.1.title': 'Daily and overall limits differ', 'consider.1.description': 'Swing changes the daily reference only. Two-Step maximum loss is 10% in the formal rules table.',
      'consider.2.title': 'Marketing vs Terms', 'consider.2.description': 'Exchange-focused marketing does not establish live execution. Terms updated 7 Aug 2026 describe all phases as simulated.',
      'consider.3.title': '40% rule: evaluation only', 'consider.3.description': 'Funded accounts have no 40% profit-distribution limit, though funded margin and exposure caps apply.',
      'sources.unknowns': 'Overall maximum-loss reference mechanics, exact leverage by market, current $HYRO launch and contract, restricted-country matrix and independently reconciled payout statistics.',
      'model.classification': 'Simulated evaluation and funded phase (Terms)', 'model.lifecycle': 'Challenge → evaluation → separate funded agreement → eligible stablecoin rewards',
    },
    comparison: { ...profile.comparison, maxDrawdown: { status: 'varies', min: 6, max: 10, unit: 'percent', notes: 'One-Step 6%; Two-Step 10%.', evidence: [{ sourceUrl: rules, checkedAt }] }, executionModels: { status: 'known', values: ['simulated'], notes: 'Terms §3.2 includes the funded phase.' } },
    sections: profile.sections.map((section) => {
      const presentationBlockIds = new Set(['hyrotrader-risk-metrics', 'hyrotrader-operating-rules', 'hyrotrader-fees', 'hyrotrader-platform-requirements']);
      const retained = section.blocks.filter((block) => !block.id.startsWith('hyrotrader-rule-') && !presentationBlockIds.has(block.id));
      if (section.id === 'offers') return { ...section, blocks: [...retained, ...challengeBlocks] };
      if (section.id === 'trading') return { ...section, blocks: [...retained, ...fundedBlocks, ...presentationBlocks] };
      return section;
    }),
    sourcesInspected: [...(profile.sourcesInspected ?? []).filter((source) => !urls.includes(source.url)), ...urls.map((url) => ({ category: 'rulebook' as const, url, checkedAt, outcome: 'accessed' as const }))],
  };
  if (!updated.operatingModel) return updated;
  return { ...updated, operatingModel: { ...updated.operatingModel,
    classification: { ...updated.operatingModel.classification, value: updated.editorialCopy!['model.classification'] },
    summary: { ...updated.operatingModel.summary, value: updated.editorialCopy!['decision.description'] },
    lifecycle: updated.operatingModel.lifecycle.map((item, index) => index === 0 ? { ...item, value: updated.editorialCopy!['model.lifecycle'] } : item),
  } };
}

export function updateHyroTraderRuleFacts(profile: FirmNormalizedProfile): FirmNormalizedProfile {
  return { ...profile,
    summary: { ...profile.summary, maxDrawdown: hyroRuleFact('6% One-Step; 10% Two-Step'), dailyDrawdown: hyroRuleFact('4% One-Step; 5% Two-Step') },
    challengePrograms: profile.challengePrograms.status === 'ND' ? profile.challengePrograms : hyroRuleFact(profile.challengePrograms.value.map((program) => ({ ...program,
      dailyLossPercent: hyroRuleFact(program.name === 'One-Step' ? 4 : 5), maxDrawdownPercent: hyroRuleFact(program.name === 'One-Step' ? 6 : 10),
      maxDrawdownType: { status: 'ND' as const, value: 'ND' as const, evidence: [{ sourceUrl: rules, checkedAt }], notes: 'Overall reference not explicit; daily Standard/Swing mechanics are documented separately.' },
      stages: program.stages.status === 'ND' ? program.stages : hyroRuleFact(program.stages.value.map((stage) => ({ ...stage, minimumTradingDays: hyroRuleFact(5, faq('evaluation-process/minimum-trading-days')) }))),
      noTimeLimit: hyroRuleFact(true), notes: hyroRuleFact('Daily Standard follows peak equity; optional Swing uses start-of-day equity. Evaluation-only 40% best-day rule. See dated rule details.'),
    }))),
    tradingPolicy: { ...profile.tradingPolicy, mandatoryStopLoss: hyroRuleFact(false, faq('rules/d')), consistencyRule: hyroRuleFact('applies', faq('rules/are-there-any-other-rules-for-a-funded-account')), newsTrading: hyroRuleFact('conditional', faq('trading-restrictions/is-news-trading-allowed')), copyTrading: hyroRuleFact('restricted', faq('trading-restrictions/is-copy-trading-allowed')), weekendHolding: hyroRuleFact('allowed', faq('rules/do-i-have-to-close-my-positions-overnight')), profitDayDefinition: hyroRuleFact(entries[3][2], entries[3][3]) },
    executionPolicy: { ...profile.executionPolicy, model: hyroRuleFact('simulated', terms), venue: hyroRuleFact('Simulated trading with live market data (Terms §3.2)', terms), notes: hyroRuleFact('Marketing advertises Bybit/terminal access; Terms describe all phases as simulated. Funded rewards are governed by a separate agreement.', terms) },
    compliancePolicy: { ...profile.compliancePolicy, simulatedAccounts: hyroRuleFact(true, terms), legalEntity: hyroRuleFact('Provider: HYRO TECHNOLOGIES FZ-LLC; funded entity: HYROTRADER TECHNOLOGIES LTD', terms), registrationJurisdiction: hyroRuleFact('Provider: UAE (RAKEZ); funded entity: British Virgin Islands', terms) },
  };
}
