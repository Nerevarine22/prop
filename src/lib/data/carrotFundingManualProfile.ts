import type {
  FirmContentFact,
  FirmNormalizedProfileV2,
  FirmResearchSourceInspection,
  FirmSourceDiscrepancy,
  NormalizedEvidence,
  PrimaryResearchValueStatus,
} from '@/types/database';

const CHECKED_AT = '2026-08-22T00:00:00.000Z';

const URLS = {
  website: 'https://www.carrotfunding.io/',
  x: 'https://x.com/carrotfunding',
  rulebook: 'https://www.carrotfunding.io/rulebook/',
  faq: 'https://www.carrotfunding.io/faq/',
  transparency: 'https://carrotfunding.gitbook.io/carrotfunding.io-docs/introduction/transparency-and-on-chain-proofs',
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
  'carrot-model-classification',
  'Operating model',
  'DeFi-native evaluation prop platform',
  'A trader buys an NFT-backed challenge, completes one or two evaluation phases, and then reaches a funded account.',
  [URLS.website, URLS.rulebook],
);

const modelSummary = fact(
  'carrot-model-summary',
  'How the model works',
  'Paid evaluation with hybrid funded-stage execution',
  'Carrot Funding presents the challenge and payout flow as on-chain-verifiable. The rulebook says funded trades may be routed either to Hyperliquid or to the firm\'s internal risk pool.',
  [URLS.website, URLS.rulebook],
);

const lifecycleFacts = [
  fact(
    'carrot-lifecycle-purchase',
    '1 · Buy a challenge',
    'Choose a 1-Phase or 2-Phase account and mint an access NFT.',
    'The one-time challenge fee becomes non-refundable after account activation.',
    [URLS.rulebook],
  ),
  fact(
    'carrot-lifecycle-evaluation',
    '2 · Complete the evaluation',
    'Reach the relevant profit target while equity remains above the daily and maximum-loss limits.',
    'There is no time limit or minimum trading-day requirement in the current rulebook.',
    [URLS.rulebook],
  ),
  fact(
    'carrot-lifecycle-funded',
    '3 · Trade a funded account',
    'The profit target is removed while the account-specific risk limits remain active.',
    'A trader may hold up to $200,000 in aggregate active funded balance.',
    [URLS.rulebook],
  ),
  fact(
    'carrot-lifecycle-payout',
    '4 · Request a payout',
    'Close all positions and orders, then request the full eligible balance from the dashboard.',
    'The published policy is on-demand USDC on Arbitrum, with an 80% trader share and processing within 24 hours.',
    [URLS.rulebook],
  ),
];

const sourcesInspected: FirmResearchSourceInspection[] = [
  {
    category: 'website',
    url: URLS.website,
    checkedAt: CHECKED_AT,
    outcome: 'accessed',
    notes: 'Current challenge cards, positioning, market-access claim and payout presentation were checked against the translated manual report.',
  },
  {
    category: 'x-account',
    url: URLS.x,
    checkedAt: CHECKED_AT,
    outcome: 'accessed',
    notes: 'Official social identity already recorded for the firm registry.',
  },
  {
    category: 'rulebook',
    url: URLS.rulebook,
    checkedAt: CHECKED_AT,
    outcome: 'accessed',
    notes: 'Canonical source for challenge tiers, risk calculations, payouts, markets, funded limits and the hybrid execution model.',
  },
  {
    category: 'faq',
    url: URLS.faq,
    checkedAt: CHECKED_AT,
    outcome: 'accessed',
    notes: 'Used to cross-check payout, trading-permission and Best Day / Consistency wording.',
  },
  {
    category: 'other',
    url: URLS.transparency,
    checkedAt: CHECKED_AT,
    outcome: 'accessed',
    notes: 'Official infrastructure record for wallets, smart contracts and on-chain proof claims.',
  },
];

const sourceDiscrepancies: FirmSourceDiscrepancy[] = [
  {
    id: 'carrot-two-phase-max-loss',
    field: 'rulebook',
    label: '2-Phase maximum loss',
    kind: 'page-vs-rulebook',
    status: 'resolved',
    resolutionBasis: 'rulebook-preferred',
    canonical: {
      value: '10% of starting balance; the loss limit trails the high-water mark upward until it reaches the starting balance.',
      sourceRole: 'canonical',
      sourceUrl: URLS.rulebook,
      checkedAt: CHECKED_AT,
    },
    alternates: [{
      value: 'One homepage walkthrough says the 2-Phase maximum loss must remain below 8%, while the same example shows a $10,000 limit on a $100,000 account.',
      sourceRole: 'alternate',
      sourceUrl: URLS.website,
      checkedAt: CHECKED_AT,
    }],
    checkedAt: CHECKED_AT,
    notes: 'The detailed rulebook, challenge cards and numerical example agree on 10%; the isolated 8% sentence is retained as an interface-copy discrepancy.',
  },
  {
    id: 'carrot-consistency-label',
    field: 'rulebook',
    label: 'Consistency Score / Best Day Rule scope',
    kind: 'official-source-mismatch',
    status: 'resolved',
    resolutionBasis: 'rulebook-preferred',
    canonical: {
      value: 'The current rulebook and FAQ apply a 50% Best Day / Consistency threshold to the 1-Phase challenge only; 2-Phase has no Best Day Rule.',
      sourceRole: 'canonical',
      sourceUrl: URLS.rulebook,
      checkedAt: CHECKED_AT,
    },
    alternates: [{
      value: 'The homepage challenge cards label the 2-Phase offer with “Consistency Score”.',
      sourceRole: 'alternate',
      sourceUrl: URLS.website,
      checkedAt: CHECKED_AT,
    }],
    checkedAt: CHECKED_AT,
    notes: 'The translated report repeats the 2-Phase wording, but the dedicated current rulebook and FAQ are treated as canonical for the published profile.',
  },
];

export const CARROT_FUNDING_MANUAL_PROFILE: FirmNormalizedProfileV2 = {
  version: 2,
  methodology: 'primary-sources-only',
  researchStandard: 'model-first-v1',
  researchMode: 'manual',
  id: 'firm-carrot-funding',
  slug: 'carrot-funding',
  name: 'Carrot Funding',
  checkedAt: CHECKED_AT,
  modelTypes: ['evaluation'],
  offerNames: ['1-Phase Challenge', '2-Phase Challenge'],
  operatingModel: {
    classification: modelClassification,
    summary: modelSummary,
    lifecycle: lifecycleFacts,
    accountEnvironment: fact(
      'carrot-account-environment',
      'Account environment',
      'Carrot terminal connected to Hyperliquid markets',
      'The platform advertises 175+ crypto, forex, commodity, stock and index instruments; the exact live list can change with the venue.',
      [URLS.website, URLS.rulebook],
    ),
    traderPayment: fact(
      'carrot-trader-payment',
      'Trader payment',
      'One-time non-refundable challenge fee',
      'No subscription, inactivity, data, platform or withdrawal fee is documented in the current rulebook.',
      [URLS.rulebook, URLS.faq],
    ),
    fundingMechanism: fact(
      'carrot-funding-mechanism',
      'Funding mechanism',
      'On-chain vault plus firm-managed hybrid routing',
      'Carrot Funding says 50% of evaluation revenue flows to an on-chain vault. Funded orders may be A-booked to Hyperliquid or B-booked internally at the firm\'s discretion.',
      [URLS.rulebook, URLS.transparency],
    ),
    traderCompensation: fact(
      'carrot-trader-compensation',
      'Trader compensation',
      '80% of eligible funded-account profit',
      'The remaining 20% is retained by Carrot Funding under the published payout policy.',
      [URLS.rulebook],
    ),
  },
  comparison: {
    modelTypes: ['evaluation'],
    capital: {
      status: 'varies',
      displayValue: '$5K–$100K',
      min: 5_000,
      max: 100_000,
      unit: 'USD',
      notes: 'Both current challenge families publish five account sizes. Aggregate active funded balance is capped at $200,000.',
      evidence: [evidence(URLS.rulebook)],
    },
    entryCost: {
      status: 'varies',
      displayValue: '$65–$799',
      min: 65,
      max: 799,
      unit: 'USD',
      notes: 'The range covers all current 1-Phase and 2-Phase tiers.',
      evidence: [evidence(URLS.rulebook), evidence(URLS.website)],
    },
    profitSplit: {
      status: 'known',
      displayValue: '80%',
      min: 80,
      max: 80,
      unit: 'percent',
      notes: 'Published trader share after reaching the funded stage and becoming payout-eligible.',
      evidence: [evidence(URLS.rulebook)],
    },
    maxDrawdown: {
      status: 'varies',
      displayValue: '8%–10% trailing',
      min: 8,
      max: 10,
      unit: 'percent',
      notes: '1-Phase uses 8%; 2-Phase uses 10%. The loss limit trails the high-water mark upward and stops at the starting balance.',
      evidence: [evidence(URLS.rulebook)],
    },
    payoutSchedules: {
      status: 'known',
      displayValue: 'On-demand',
      values: ['On-demand', 'Within 24 hours', 'USDC on Arbitrum'],
      notes: 'Minimum 100 USDC; full eligible amount only after all positions and pending orders are closed.',
      evidence: [evidence(URLS.rulebook), evidence(URLS.faq)],
    },
    executionModels: {
      status: 'varies',
      displayValue: 'Hybrid routing',
      values: ['A-book · Hyperliquid', 'B-book · internal risk pool'],
      notes: 'The firm selects the execution route trade by trade; the published trader P&L treatment is stated to be identical.',
      evidence: [evidence(URLS.rulebook)],
    },
  },
  sections: [
    {
      id: 'overview',
      tabLabel: 'Overview',
      title: 'Project and operating overview',
      description: 'What Carrot Funding says it is, how a trader moves through the product and where on-chain verification enters the model.',
      blocks: [
        {
          id: 'carrot-about',
          type: 'text',
          eyebrow: 'Project overview',
          title: 'A challenge product built around visible infrastructure',
          paragraphs: [
            'Carrot Funding presents itself as a DeFi-native trader funding firm. A trader pays for a one- or two-phase evaluation, trades from the Carrot terminal, and receives a funded account after meeting the relevant objectives without breaching the risk limits.',
            'The company says its capital flows, challenge records and payouts are designed to be inspectable on-chain. Its “real capital” and aligned-incentive positioning should be read as the firm’s stated operating model, not as an independent guarantee of execution or returns.',
          ],
          status: 'reported',
          evidence: [evidence(URLS.website), evidence(URLS.rulebook), evidence(URLS.transparency)],
        },
        {
          id: 'carrot-overview-facts',
          type: 'fact-grid',
          columns: 2,
          presentation: 'details',
          items: [
            modelClassification,
            modelSummary,
            fact('carrot-offers', 'Current challenge families', '1-Phase and 2-Phase', 'Each family has five account-size tiers from $5,000 to $100,000.', [URLS.rulebook]),
            fact('carrot-proof-object', 'Challenge record', 'Access NFT with performance metadata', 'The rulebook describes each purchased challenge as an NFT-backed record of phase and performance data.', [URLS.rulebook]),
            fact('carrot-market-access', 'Market access', '175+ advertised instruments', 'The website groups these as crypto, forex, commodities, stocks and indices; the exact live set is venue-dependent.', [URLS.website, URLS.rulebook]),
            fact('carrot-funded-cap', 'Aggregate funded limit', '$200,000', 'Multiple funded accounts are allowed up to this combined active balance.', [URLS.rulebook]),
          ],
        },
        {
          id: 'carrot-lifecycle',
          type: 'fact-grid',
          columns: 2,
          presentation: 'steps',
          items: lifecycleFacts,
        },
      ],
    },
    {
      id: 'challenges',
      tabLabel: 'Challenges & pricing',
      title: 'All current challenge tiers',
      description: 'Every account size and one-time fee from the translated report, checked against the current official rulebook.',
      blocks: [
        {
          id: 'carrot-challenge-programs',
          type: 'record-list',
          presentation: 'records',
          items: [
            {
              id: 'carrot-one-phase',
              eyebrow: 'Single-stage evaluation',
              title: '1-Phase Challenge',
              description: 'Reach one 8% target, then move to a funded account while retaining the same core risk framework.',
              facts: [
                fact('carrot-one-phase-prices', 'Account size · fee', '$5K · $75 | $10K · $129 | $20K · $249 | $50K · $499 | $100K · $799', 'Five currently documented tiers.', [URLS.rulebook, URLS.website]),
                fact('carrot-one-phase-target', 'Profit target', '8%', 'Only realized profit from closed positions counts toward the target.', [URLS.rulebook]),
                fact('carrot-one-phase-loss', 'Daily / maximum loss', '4% / 8%', 'Daily loss recalculates at 00:00 UTC; the maximum-loss limit follows the high-water-mark mechanism.', [URLS.rulebook]),
                fact('carrot-one-phase-best-day', 'Best Day Score', '50 or higher', 'No single day should represent more than 50% of total profit. Falling below the score does not fail the account; trading continues until the ratio improves.', [URLS.rulebook, URLS.faq]),
                fact('carrot-one-phase-time', 'Time requirements', 'No time limit or minimum days', 'The phase may be completed at the trader\'s own pace.', [URLS.rulebook, URLS.faq]),
              ],
            },
            {
              id: 'carrot-two-phase',
              eyebrow: 'Two-stage evaluation',
              title: '2-Phase Challenge',
              description: 'Pass Evaluation and Verification before receiving a funded account.',
              facts: [
                fact('carrot-two-phase-prices', 'Account size · fee', '$5K · $65 | $10K · $119 | $20K · $239 | $50K · $449 | $100K · $699', 'The $50K tier corrects an obvious “$5,0000” typo in the supplied report and matches the official rulebook.', [URLS.rulebook, URLS.website]),
                fact('carrot-two-phase-targets', 'Profit targets', 'Phase 1 · 5% | Phase 2 · 8%', 'Only realized profit from closed positions counts toward progression.', [URLS.rulebook, URLS.faq]),
                fact('carrot-two-phase-loss', 'Daily / maximum loss', '5% / 10%', 'The detailed rulebook is canonical despite one conflicting 8% sentence on the homepage.', [URLS.rulebook, URLS.website], 'conflict'),
                fact('carrot-two-phase-special', 'Best Day requirement', 'None in the current rulebook', 'Homepage cards still display “Consistency Score”; that terminology conflict remains visible below.', [URLS.rulebook, URLS.faq, URLS.website], 'conflict'),
                fact('carrot-two-phase-time', 'Time requirements', 'No time limit or minimum days', 'Both evaluation phases may be completed at the trader\'s own pace.', [URLS.rulebook, URLS.faq]),
              ],
            },
          ],
        },
        {
          id: 'carrot-fee-note',
          type: 'notice',
          tone: 'neutral',
          text: 'Challenge fees are one-time and become non-refundable after account activation. The current rulebook lists no recurring subscription, inactivity, data, platform or withdrawal fee.',
          status: 'reported',
          evidence: [evidence(URLS.rulebook), evidence(URLS.faq)],
        },
      ],
    },
    {
      id: 'risk-rules',
      tabLabel: 'Risk rules',
      title: 'Drawdown, consistency and breach mechanics',
      description: 'The values are simple; the calculation methods and official-source differences are the parts that need close reading.',
      blocks: [
        {
          id: 'carrot-risk-facts',
          type: 'fact-grid',
          columns: 2,
          presentation: 'details',
          items: [
            fact('carrot-risk-daily', 'Daily loss calculation', '4% (1-Phase) · 5% (2-Phase)', 'The threshold is recalculated at 00:00:00 UTC from account equity and applies to realized plus unrealized loss.', [URLS.rulebook, URLS.faq]),
            fact('carrot-risk-maximum', 'Maximum loss calculation', '8% (1-Phase) · 10% (2-Phase)', 'The amount is based on starting balance; its equity limit trails the highest recorded balance upward and stops at the starting balance.', [URLS.rulebook]),
            fact('carrot-risk-breach', 'Breach trigger', 'Equity touches or falls below either limit', 'Open positions and orders are closed, account access is revoked and a funded account loses payout eligibility.', [URLS.rulebook]),
            fact('carrot-risk-profit', 'Profit target measurement', 'Closed trades only', 'Open-position profit does not count when determining whether a phase has passed.', [URLS.rulebook, URLS.faq]),
            fact('carrot-risk-best-day', '1-Phase Best Day Score', '(Total profit − best day profit) ÷ total profit × 100', 'A score of 50 or higher is required to pass or request a payout on the 1-Phase path.', [URLS.rulebook, URLS.faq]),
            fact('carrot-risk-freedom', 'General trading freedom', 'No time, inactivity, minimum-day or mandatory stop-loss rule', 'Grid trading, swing trading, scalping, news trading and weekend holding are documented as allowed, subject to abuse restrictions.', [URLS.rulebook, URLS.faq]),
          ],
        },
        {
          id: 'carrot-consistency-conflict',
          type: 'notice',
          tone: 'warning',
          text: 'Consistency wording conflict: the homepage places “Consistency Score” on 2-Phase cards, while the current rulebook and FAQ define the 50% Best Day / Consistency threshold for 1-Phase only. The rulebook and FAQ are used for the profile; the homepage wording remains recorded as an alternate.',
          status: 'conflict',
          evidence: [evidence(URLS.website), evidence(URLS.rulebook), evidence(URLS.faq)],
        },
        {
          id: 'carrot-max-loss-conflict',
          type: 'notice',
          tone: 'warning',
          text: '2-Phase maximum-loss copy conflict: one homepage sentence says “below 8%”, but its own $100K example shows a $10K limit and the detailed rulebook consistently states 10%. The profile therefore uses 10%.',
          status: 'conflict',
          evidence: [evidence(URLS.website), evidence(URLS.rulebook)],
        },
      ],
    },
    {
      id: 'execution',
      tabLabel: 'Execution & markets',
      title: 'Trading venue, routing and permissions',
      description: 'Carrot Funding combines a single trader-facing terminal with firm-controlled hybrid execution during the funded stage.',
      blocks: [
        {
          id: 'carrot-execution-records',
          type: 'record-list',
          items: [
            {
              id: 'carrot-a-book',
              eyebrow: 'Funded-stage route',
              title: 'A-book · Hyperliquid',
              description: 'The order is routed through the firm vault to Hyperliquid, filled against the live order book and settled on-chain.',
              facts: [
                fact('carrot-a-book-proof', 'Verification', 'Explorer-visible execution', 'The rulebook describes entries, exits and fills as independently inspectable when this route is selected.', [URLS.rulebook, URLS.transparency]),
                fact('carrot-a-book-risk', 'Market risk', 'Assumed by the firm', 'The trader does not choose this route.', [URLS.rulebook]),
              ],
            },
            {
              id: 'carrot-b-book',
              eyebrow: 'Funded-stage route',
              title: 'B-book · Internal risk pool',
              description: 'The order is recorded internally with a hypothetical fill and no on-chain trade settlement.',
              facts: [
                fact('carrot-b-book-outcome', 'Published trader outcome', 'Same P&L treatment', 'Carrot Funding states that the trader result is identical regardless of the chosen route.', [URLS.rulebook]),
                fact('carrot-b-book-control', 'Routing decision', 'Firm discretion, trade by trade', 'Funded traders cannot select A-book or B-book routing.', [URLS.rulebook]),
              ],
            },
          ],
        },
        {
          id: 'carrot-market-facts',
          type: 'fact-grid',
          columns: 2,
          presentation: 'details',
          items: [
            fact('carrot-venue', 'Trader-facing venue', 'Carrot terminal powered by Hyperliquid markets', 'No separate MetaTrader or cTrader login is documented in this research pass.', [URLS.website, URLS.rulebook]),
            fact('carrot-assets', 'Advertised coverage', '175+ instruments', 'Crypto, forex, commodities, stocks and indices are listed; the exact pairs can change.', [URLS.website, URLS.rulebook]),
            fact('carrot-leverage', 'Leverage', 'Up to 5× per position', 'A market may impose a lower maximum than the platform ceiling.', [URLS.rulebook]),
            fact('carrot-fees', 'Trading costs', 'Standard Hyperliquid maker/taker fees', 'The rulebook says Carrot adds no markup; trading fees affect P&L and risk limits.', [URLS.rulebook]),
            fact('carrot-news-weekend', 'News / weekend trading', 'Allowed', 'The current rulebook records no news-trading or weekend-holding restriction.', [URLS.rulebook, URLS.faq]),
            fact('carrot-automation', 'Automation', 'Restricted when it creates an unfair advantage', 'HFT, mass order entry, exploitation, coordinated trading, hedge abuse, copy trading and third-party account use are prohibited.', [URLS.rulebook, URLS.faq]),
          ],
        },
      ],
    },
    {
      id: 'payouts',
      tabLabel: 'Payouts',
      title: 'Payout economics and request flow',
      description: 'The current public policy is concrete about amount, network, timing and required account state.',
      blocks: [
        {
          id: 'carrot-payout-facts',
          type: 'fact-grid',
          columns: 2,
          presentation: 'details',
          items: [
            fact('carrot-payout-split', 'Profit split', '80% trader · 20% Carrot Funding', 'Applies to eligible profit on a funded account.', [URLS.rulebook]),
            fact('carrot-payout-cadence', 'Request frequency', 'On-demand once eligible', 'Multiple payouts may be requested after profit is rebuilt.', [URLS.rulebook, URLS.faq]),
            fact('carrot-payout-minimum', 'Minimum request', '100 USDC', 'The rulebook requires a full eligible-balance request rather than a partial withdrawal.', [URLS.rulebook, URLS.faq]),
            fact('carrot-payout-network', 'Asset and network', 'USDC on Arbitrum', 'The verified wallet address must be checked carefully before submission.', [URLS.rulebook]),
            fact('carrot-payout-time', 'Published processing time', 'Within 24 hours', 'Trading is disabled while the payout is being processed.', [URLS.rulebook, URLS.website]),
            fact('carrot-payout-account-state', 'Before submission', 'Close all positions and pending orders', 'After completion, trading resumes and the risk objectives reset to their original limits.', [URLS.rulebook, URLS.faq]),
            fact('carrot-payout-kyc', 'KYC timing', 'Needs primary-source confirmation', 'The supplied manual report says KYC is required before the first funded payout, but the currently accessible public rulebook and FAQ do not document that timing.', [URLS.rulebook, URLS.faq], 'ND'),
          ],
        },
      ],
    },
    {
      id: 'transparency',
      tabLabel: 'On-chain proof',
      title: 'What the platform says can be verified',
      description: 'These are first-party infrastructure claims. They make the model inspectable, but they are not presented here as an independent guarantee.',
      blocks: [
        {
          id: 'carrot-transparency-facts',
          type: 'fact-grid',
          columns: 2,
          presentation: 'details',
          items: [
            fact('carrot-proof-payouts', 'Payout evidence', 'Arbitrum transaction records', 'The website publishes transaction hashes for example settled payouts.', [URLS.website, URLS.rulebook]),
            fact('carrot-proof-vault', 'Capital-reserve claim', '50% of evaluation revenue flows to an on-chain vault', 'The platform presents the vault NAV, reserves and hedging activity as visible.', [URLS.rulebook, URLS.transparency]),
            fact('carrot-proof-evaluation', 'Evaluation verification', 'Oasis ROFL proofs', 'The rulebook says daily loss, drawdown, target and payout-eligibility calculations use verifiable off-chain compute with on-chain proofs.', [URLS.rulebook]),
            fact('carrot-proof-nft', 'Portable performance record', 'Carrot FBI challenge NFT', 'The NFT is described as storing account size, phase, progress and leverage metadata.', [URLS.rulebook]),
            fact('carrot-proof-contracts', 'Published infrastructure', 'Contracts and operational wallets', 'The transparency documentation lists the NFT, vault, scoped-permission and operational addresses.', [URLS.transparency]),
            fact('carrot-proof-routing', 'Execution visibility', 'A-book or B-book label in dashboard', 'The rulebook says every funded trader is shown the selected execution classification.', [URLS.rulebook]),
          ],
        },
      ],
    },
    {
      id: 'sources',
      tabLabel: 'Sources & differences',
      title: 'Primary sources and preserved differences',
      description: 'The Ukrainian DOCX supplied by the project owner was translated into this profile; official pages remain the public evidence layer.',
      blocks: [
        {
          id: 'carrot-source-records',
          type: 'record-list',
          presentation: 'sources',
          items: sourcesInspected.map((source, index) => ({
            id: `carrot-source-${index + 1}`,
            eyebrow: `Primary source · ${source.category.replaceAll('-', ' ')}`,
            title: source.url,
            description: source.notes,
            meta: [source.checkedAt],
            links: [{ label: 'Open source', url: source.url }],
          })),
        },
        {
          id: 'carrot-differences-summary',
          type: 'notice',
          tone: 'warning',
          text: 'Two official-source differences remain visible: the isolated 8% homepage sentence versus the canonical 10% 2-Phase maximum loss, and the homepage 2-Phase “Consistency Score” label versus the rulebook / FAQ 1-Phase Best Day rule.',
          status: 'conflict',
          evidence: [evidence(URLS.website), evidence(URLS.rulebook), evidence(URLS.faq)],
        },
        {
          id: 'carrot-kyc-research-gap',
          type: 'notice',
          tone: 'neutral',
          text: 'KYC before the first payout appears in the supplied manual report but was not found in the currently accessible public rulebook or FAQ. It remains a research gap instead of being published as a confirmed policy.',
          status: 'ND',
          evidence: [evidence(URLS.rulebook), evidence(URLS.faq)],
        },
      ],
    },
  ],
  sourcesInspected,
  sourceDiscrepancies,
};
