import type {
  FirmContentFact,
  FirmNormalizedProfileV2,
  FirmResearchSourceInspection,
  NormalizedEvidence,
  PrimaryResearchValueStatus,
} from '@/types/database';

const CHECKED_AT = '2026-08-18T00:00:00.000Z';

const URLS = {
  website: 'https://hyperpnl.com',
  x: 'https://x.com/HyperPNL',
  docs: 'https://hyperpnl.gitbook.io/docs',
  evaluationRules: 'https://hyperpnl.gitbook.io/docs/challenges-101/evaluation-rules',
  manualResearch: 'https://docs.google.com/document/d/1TMWqHFYzRyzh5cgNoBMV9HwPwxLMgj0rC45EfZBd7tI/edit?usp=sharing',
} as const;

function evidence(sourceUrl: string, notes?: string): NormalizedEvidence {
  return { sourceUrl, checkedAt: CHECKED_AT, ...(notes ? { notes } : {}) };
}

function fact(
  id: string,
  label: string,
  value: string,
  note: string,
  sourceUrls: string[],
  status: PrimaryResearchValueStatus = 'reported',
): FirmContentFact {
  return {
    id,
    label,
    value,
    note,
    status,
    evidence: sourceUrls.map((sourceUrl) => evidence(sourceUrl)),
  };
}

const modelClassification = fact(
  'hyperpnl-model-classification',
  'Operating model',
  'On-chain two-phase evaluation prop platform',
  'Traders progress through Evaluation and Verification before reaching a Funded account.',
  [URLS.website, URLS.evaluationRules],
);

const modelSummary = fact(
  'hyperpnl-model-summary',
  'How the model works',
  'HyperPNL combines challenge rules with direct market execution through Hyperliquid L1 and an Ostium integration.',
  'Rule evaluation, phase completion and payout flows are described as automated rather than manager-approved workflows.',
  [URLS.website, URLS.docs],
);

const lifecycleFacts = [
  fact(
    'hyperpnl-lifecycle-evaluation',
    '1 · Evaluation',
    'Reach a 10% target without breaching 9% static or 5% daily drawdown.',
    'At least two profitable days of +0.5% are required; no completion deadline is recorded.',
    [URLS.evaluationRules],
  ),
  fact(
    'hyperpnl-lifecycle-verification',
    '2 · Verification',
    'Reach a 5% target under the same 9% static and 5% daily limits.',
    'At least three profitable days of +0.5% are required; no completion deadline is recorded.',
    [URLS.evaluationRules],
  ),
  fact(
    'hyperpnl-lifecycle-funded',
    '3 · Funded',
    'Trade without a profit target and retain up to 90% of eligible profit.',
    'The recorded Funded rules keep the 9% static and 5% daily drawdown limits.',
    [URLS.evaluationRules, URLS.website],
  ),
];

const sourcesInspected: FirmResearchSourceInspection[] = [
  { category: 'website', url: URLS.website, checkedAt: CHECKED_AT, outcome: 'accessed', notes: 'Official product and operating-model source recorded in the manual research file.' },
  { category: 'x-account', url: URLS.x, checkedAt: CHECKED_AT, outcome: 'accessed', notes: 'Official social identity recorded in the manual research file.' },
  { category: 'rulebook', url: URLS.evaluationRules, checkedAt: CHECKED_AT, outcome: 'accessed', notes: 'Canonical source recorded for evaluation phases, drawdown and profitable-day rules.' },
  { category: 'other', url: URLS.docs, checkedAt: CHECKED_AT, outcome: 'accessed', notes: 'Official documentation root recorded for execution, API and payout context.' },
  { category: 'other', url: URLS.manualResearch, checkedAt: CHECKED_AT, outcome: 'accessed', notes: 'Human-authored research artifact used for this draft import; it is not treated as primary evidence by itself.' },
];

export const HYPERPNL_MANUAL_PROFILE: FirmNormalizedProfileV2 = {
  version: 2,
  methodology: 'primary-sources-only',
  researchStandard: 'model-first-v1',
  researchMode: 'manual',
  id: 'firm-hyperpnl',
  slug: 'hyperpnl',
  name: 'HyperPNL',
  checkedAt: CHECKED_AT,
  modelTypes: ['evaluation'],
  offerNames: ['Evaluation → Verification → Funded'],
  operatingModel: {
    classification: modelClassification,
    summary: modelSummary,
    lifecycle: lifecycleFacts,
    fundingMechanism: fact(
      'hyperpnl-funding-mechanism',
      'Payout funding',
      'Public on-chain payout reserves',
      'The research describes USDC payouts as being sent from visible on-chain reserves.',
      [URLS.website, URLS.docs],
    ),
    traderCompensation: fact(
      'hyperpnl-trader-compensation',
      'Trader compensation',
      'Up to 90% of eligible profit',
      'The exact payout cadence, minimum and eligibility workflow were not included in this research pass.',
      [URLS.website, URLS.docs],
    ),
  },
  comparison: {
    modelTypes: ['evaluation'],
    capital: {
      status: 'varies',
      displayValue: 'Up to $200K',
      max: 200_000,
      unit: 'USD',
      notes: 'The manual research records accounts up to $200,000 but does not yet include the complete tier matrix.',
      evidence: [evidence(URLS.evaluationRules), evidence(URLS.manualResearch)],
    },
    entryCost: {
      status: 'ND',
      displayValue: 'Not researched yet',
      unit: 'USD',
      notes: 'Exact current prices were not included in this manual research pass.',
      evidence: [evidence(URLS.manualResearch)],
    },
    profitSplit: {
      status: 'varies',
      displayValue: 'Up to 90%',
      max: 90,
      unit: 'percent',
      notes: 'Maximum Funded-stage trader share recorded in the manual research.',
      evidence: [evidence(URLS.website), evidence(URLS.docs)],
    },
    maxDrawdown: {
      status: 'known',
      displayValue: '9% static',
      min: 9,
      max: 9,
      unit: 'percent',
      notes: 'Static from the initial account size across the recorded stages.',
      evidence: [evidence(URLS.evaluationRules)],
    },
    payoutSchedules: {
      status: 'ND',
      displayValue: 'Not researched yet',
      values: [],
      notes: 'The file describes automated USDC payouts but does not record the request cadence.',
      evidence: [evidence(URLS.manualResearch), evidence(URLS.docs)],
    },
    executionModels: {
      status: 'varies',
      values: ['Hyperliquid L1 order book', 'Ostium market integration', 'Delegated Agent Keys'],
      notes: 'Execution venue and trading hours vary by asset family.',
      evidence: [evidence(URLS.website), evidence(URLS.docs)],
    },
  },
  sections: [
    {
      id: 'overview',
      tabLabel: 'Overview',
      title: 'Project and operating overview',
      description: 'What HyperPNL is, how orders are executed and how a trader reaches the Funded stage.',
      blocks: [
        {
          id: 'hyperpnl-about',
          type: 'text',
          eyebrow: 'Project overview',
          title: 'Challenge rules connected to on-chain market execution',
          paragraphs: [
            'HyperPNL is an on-chain prop platform built around Hyperliquid L1, with an Ostium integration for additional traditional-market exposure. Its stated product idea is to reduce discretionary evaluation and payout handling through automated rule enforcement.',
            'Orders are described as reaching the underlying venue rather than a virtual dealer or B-book server. Traders connect through delegated Agent Keys so the main wallet private key is not shared with the platform.',
          ],
          status: 'reported',
          evidence: [evidence(URLS.website), evidence(URLS.docs)],
        },
        {
          id: 'hyperpnl-overview-facts',
          type: 'fact-grid',
          columns: 2,
          presentation: 'details',
          items: [
            modelClassification,
            fact('hyperpnl-core-path', 'Progression path', 'Evaluation → Verification → Funded', 'Each stage keeps a distinct target or compensation purpose.', [URLS.evaluationRules]),
            fact('hyperpnl-core-execution', 'Primary execution', 'Hyperliquid L1 order book', 'The research describes direct order-book execution without a virtual dealer layer.', [URLS.website, URLS.docs]),
            fact('hyperpnl-core-secondary', 'Additional markets', 'Ostium Protocol integration', 'Traditional asset groups follow their underlying market hours.', [URLS.website, URLS.docs]),
            fact('hyperpnl-core-auth', 'Authentication', 'Delegated Agent Keys', 'A session key can trade without exposing the main wallet private key.', [URLS.docs]),
            fact('hyperpnl-core-capital', 'Recorded account ceiling', 'Up to $200,000', 'The full account-size and price matrix remains for the next research pass.', [URLS.evaluationRules, URLS.manualResearch]),
          ],
        },
      ],
    },
    {
      id: 'evaluation',
      tabLabel: 'Evaluation path',
      title: 'Evaluation, Verification and Funded rules',
      description: 'Only the stages and values present in the manual research file are shown.',
      blocks: [{
        id: 'hyperpnl-evaluation-tracks',
        type: 'record-list',
        presentation: 'tracks',
        items: [
          {
            id: 'hyperpnl-evaluation-stage',
            eyebrow: 'Phase 1',
            title: 'Evaluation',
            description: 'First performance stage with a higher target and two required profitable days.',
            facts: [
              fact('hyperpnl-evaluation-target', 'Profit target', '10%', 'The phase completes when account equity reaches the target.', [URLS.evaluationRules]),
              fact('hyperpnl-evaluation-max-dd', 'Maximum drawdown', '9% static', 'Calculated from the initial account size and does not trail profits.', [URLS.evaluationRules]),
              fact('hyperpnl-evaluation-daily-dd', 'Daily drawdown', '5% of reset equity', 'The daily reference is established at 00:00 UTC.', [URLS.evaluationRules]),
              fact('hyperpnl-evaluation-days', 'Profitable days', '2 days at +0.5% or more', 'The threshold is measured against the initial account size.', [URLS.evaluationRules]),
              fact('hyperpnl-evaluation-deadline', 'Time limit', 'No deadline', 'The research records no maximum number of days for completion.', [URLS.evaluationRules]),
              fact('hyperpnl-evaluation-completion', 'Completion', 'Automatic pass', 'Open orders are described as closing automatically when the target is reached.', [URLS.evaluationRules]),
            ],
          },
          {
            id: 'hyperpnl-verification-stage',
            eyebrow: 'Phase 2',
            title: 'Verification',
            description: 'Second performance stage with a lower target and one additional profitable day.',
            facts: [
              fact('hyperpnl-verification-target', 'Profit target', '5%', 'The phase completes when account equity reaches the target.', [URLS.evaluationRules]),
              fact('hyperpnl-verification-max-dd', 'Maximum drawdown', '9% static', 'The same initial-balance floor remains in place.', [URLS.evaluationRules]),
              fact('hyperpnl-verification-daily-dd', 'Daily drawdown', '5% of reset equity', 'The daily reference is established at 00:00 UTC.', [URLS.evaluationRules]),
              fact('hyperpnl-verification-days', 'Profitable days', '3 days at +0.5% or more', 'A qualifying day must satisfy the recorded daily-profit threshold.', [URLS.evaluationRules]),
              fact('hyperpnl-verification-deadline', 'Time limit', 'No deadline', 'The research records no maximum number of days for completion.', [URLS.evaluationRules]),
              fact('hyperpnl-verification-completion', 'Completion', 'Automatic pass', 'Manual manager review is not part of the recorded completion flow.', [URLS.evaluationRules]),
            ],
          },
          {
            id: 'hyperpnl-funded-stage',
            eyebrow: 'Final stage',
            title: 'Funded account',
            description: 'Ongoing trading stage with profit sharing rather than another target.',
            facts: [
              fact('hyperpnl-funded-target', 'Profit target', 'None', 'The trader continues trading for eligible profit rather than another pass target.', [URLS.evaluationRules]),
              fact('hyperpnl-funded-max-dd', 'Maximum drawdown', '9% static', 'The recorded Funded limit remains fixed from the initial account size.', [URLS.evaluationRules]),
              fact('hyperpnl-funded-daily-dd', 'Daily drawdown', '5%', 'The same daily risk percentage is recorded for the Funded account.', [URLS.evaluationRules]),
              fact('hyperpnl-funded-days', 'Profitable days', 'Not required', 'No minimum profitable-day count is recorded for this stage.', [URLS.evaluationRules]),
              fact('hyperpnl-funded-deadline', 'Time limit', 'No deadline', 'No maximum funded-account duration is recorded.', [URLS.evaluationRules]),
              fact('hyperpnl-funded-share', 'Trader share', 'Up to 90%', 'The exact payout conditions remain for the next research pass.', [URLS.website, URLS.docs]),
            ],
          },
        ],
      }],
    },
    {
      id: 'risk',
      tabLabel: 'Risk rules',
      title: 'How drawdown and profitable days work',
      description: 'The practical calculation details matter more than the headline percentages.',
      blocks: [
        {
          id: 'hyperpnl-risk-facts',
          type: 'fact-grid',
          columns: 2,
          presentation: 'details',
          items: [
            fact('hyperpnl-risk-static', 'Static maximum drawdown', '9% from initial capital', 'The loss floor does not move upward when the account makes profit.', [URLS.evaluationRules]),
            fact('hyperpnl-risk-static-example', '$100K example', 'The breach floor remains $91,000', 'Even after equity reaches $120,000, the recorded floor stays fixed.', [URLS.evaluationRules]),
            fact('hyperpnl-risk-daily', 'Daily drawdown', '5% from equity at 00:00 UTC', 'Balance and unrealized PnL form the reset reference.', [URLS.evaluationRules]),
            fact('hyperpnl-risk-intraday', 'Intraday behavior', 'The daily floor stays fixed until the next reset', 'It is recalculated only at the next 00:00 UTC boundary.', [URLS.evaluationRules]),
            fact('hyperpnl-risk-profit-day', 'Profitable-day threshold', '+0.5% of initial capital', 'A $10,000 account therefore needs at least $50 for a qualifying day.', [URLS.evaluationRules]),
            fact('hyperpnl-risk-floating', 'Unrealized profit nuance', 'Crossing the threshold during the day can qualify it', 'Profit left open before the reset is not backdated into the preceding day.', [URLS.evaluationRules]),
          ],
        },
        {
          id: 'hyperpnl-auto-pass-note',
          type: 'notice',
          tone: 'neutral',
          text: 'Auto-pass is recorded as an automated backend action: once equity reaches the phase target, open orders close and the account advances without a manual manager review.',
          status: 'reported',
          evidence: [evidence(URLS.evaluationRules)],
        },
      ],
    },
    {
      id: 'execution',
      tabLabel: 'Markets & execution',
      title: 'Execution venues and trading sessions',
      description: 'Hyperliquid and Ostium assets follow different market schedules.',
      blocks: [
        {
          id: 'hyperpnl-market-records',
          type: 'record-list',
          items: [
            {
              id: 'hyperpnl-hyperliquid-markets',
              eyebrow: 'Primary venue',
              title: 'Hyperliquid L1',
              description: 'Crypto assets and selected non-crypto instruments are recorded as continuously available, including weekends.',
              facts: [
                fact('hyperpnl-hl-execution', 'Order execution', 'Direct order book', 'Orders are described as reaching Hyperliquid without a virtual dealer layer.', [URLS.website, URLS.docs]),
                fact('hyperpnl-hl-hours', 'Trading hours', '24/7', 'The research records continuous availability for the Hyperliquid asset set.', [URLS.website, URLS.docs]),
              ],
            },
            {
              id: 'hyperpnl-ostium-markets',
              eyebrow: 'Additional venue',
              title: 'Ostium integration',
              description: 'Traditional-market exposure follows the session of the underlying world market.',
              facts: [
                fact('hyperpnl-ostium-assets', 'Recorded asset groups', 'Commodities, indices and forex', 'The research includes CME commodities and US, European and Asian indices.', [URLS.website, URLS.docs]),
                fact('hyperpnl-ostium-hours', 'Trading hours', 'Underlying market hours', 'Weekend availability does not apply to this traditional-market group.', [URLS.website, URLS.docs]),
              ],
            },
          ],
        },
        {
          id: 'hyperpnl-execution-facts',
          type: 'fact-grid',
          columns: 2,
          presentation: 'details',
          items: [
            fact('hyperpnl-execution-auth', 'Wallet access', 'Delegated Agent Keys', 'The main-wallet private key is not handed to the platform.', [URLS.docs]),
            fact('hyperpnl-execution-routing', 'Routing model', 'Venue-native execution', 'The research explicitly contrasts this with virtual dealer and B-book servers.', [URLS.website, URLS.docs]),
          ],
        },
      ],
    },
    {
      id: 'automation',
      tabLabel: 'Bots & permissions',
      title: 'API access and trading permissions',
      description: 'Automation is supported, while behavior intended to exploit account or execution boundaries is restricted.',
      blocks: [{
        id: 'hyperpnl-permission-records',
        type: 'record-list',
        items: [
          {
            id: 'hyperpnl-permitted-trading',
            eyebrow: 'Permitted',
            title: 'Automation and event trading',
            description: 'The research records broad strategy freedom rather than a narrow manual-only workflow.',
            facts: [
              fact('hyperpnl-api-access', 'API access', 'Hyperliquid SDKs and CCXT', 'Python, TypeScript, Rust and Go SDKs are listed.', [URLS.docs]),
              fact('hyperpnl-bots', 'Algorithmic trading', 'Allowed', 'Grid, trend-following and scalping strategies are included as examples.', [URLS.docs]),
              fact('hyperpnl-news', 'News trading', 'Allowed', 'No news-event restriction is recorded in this research pass.', [URLS.docs]),
              fact('hyperpnl-holding', 'Overnight and weekend holding', 'Allowed for Hyperliquid assets', 'Ostium instruments still follow their underlying market sessions.', [URLS.docs]),
            ],
          },
          {
            id: 'hyperpnl-prohibited-trading',
            eyebrow: 'Restricted',
            title: 'Account and latency abuse',
            description: 'The restrictions focus on exploiting platform boundaries rather than normal strategy selection.',
            facts: [
              fact('hyperpnl-multiaccount', 'Multi-account abuse', 'Prohibited', 'The research distinguishes abuse from ordinary use of one account.', [URLS.docs]),
              fact('hyperpnl-copy', 'Cross-user copy trading', 'Prohibited', 'Copying between different users is specifically recorded as restricted.', [URLS.docs]),
              fact('hyperpnl-latency', 'Latency arbitrage', 'Prohibited', 'Execution-delay exploitation is not allowed.', [URLS.docs]),
              fact('hyperpnl-consistency', 'Lot consistency rule', 'None recorded', 'No rule requiring consistent lot size is documented in the research file.', [URLS.docs]),
              fact('hyperpnl-per-trade-risk', 'Per-trade risk cap', 'None recorded', 'The file does not document a separate risk percentage per individual trade.', [URLS.docs]),
            ],
          },
        ],
      }],
    },
    {
      id: 'payouts',
      tabLabel: 'Payouts',
      title: 'Payout economics and reserves',
      description: 'The current research establishes the mechanism and maximum share, not the complete request policy.',
      blocks: [
        {
          id: 'hyperpnl-payout-facts',
          type: 'fact-grid',
          columns: 2,
          presentation: 'details',
          items: [
            fact('hyperpnl-payout-asset', 'Payout asset', 'USDC', 'Payouts are described as on-chain stablecoin transfers.', [URLS.website, URLS.docs]),
            fact('hyperpnl-payout-share', 'Trader share', 'Up to 90%', 'The exact tier and eligibility conditions remain for later research.', [URLS.website, URLS.docs]),
            fact('hyperpnl-payout-reserve', 'Funding source', 'Public on-chain payout reserves', 'The reserve model is intended to make available payout liquidity inspectable.', [URLS.website, URLS.docs]),
            fact('hyperpnl-payout-approval', 'Approval flow', 'Described as automated', 'The research records no long bank-transfer or manual-manager approval step.', [URLS.website, URLS.docs]),
          ],
        },
        {
          id: 'hyperpnl-payout-gaps',
          type: 'notice',
          tone: 'neutral',
          text: 'Payout cadence, minimum request, eligibility timing, fee refund and exact reserve contract addresses were not included in this research pass and will be added later.',
          status: 'reported',
          evidence: [evidence(URLS.manualResearch)],
        },
      ],
    },
    {
      id: 'sources',
      tabLabel: 'Sources',
      title: 'Research sources and revision context',
      description: 'Primary links remain separate from the human-authored research artifact used for this draft.',
      blocks: [{
        id: 'hyperpnl-source-records',
        type: 'record-list',
        presentation: 'sources',
        items: sourcesInspected.map((source, index) => ({
          id: `hyperpnl-source-${index + 1}`,
          eyebrow: source.url === URLS.manualResearch ? 'Manual research artifact' : `Primary source · ${source.category.replaceAll('-', ' ')}`,
          title: source.url,
          description: source.notes,
          meta: [source.checkedAt],
          links: [{ label: 'Open source', url: source.url }],
        })),
      }],
    },
  ],
  sourcesInspected,
  sourceDiscrepancies: [],
};
