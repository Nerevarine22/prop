import type {
  FirmContentFact,
  FirmNormalizedProfileV2,
  FirmResearchSourceInspection,
  FirmSourceDiscrepancy,
  NormalizedEvidence,
  PrimaryResearchValueStatus,
} from '@/types/database';
import { HYPERPNL_MANUAL_PROFILE } from './hyperPnlManualProfile';

const CHECKED_AT = '2026-08-17T00:00:00.000Z';

const URLS = {
  x: 'https://x.com/AlphaGridProp',
  website: 'https://alphagrid.capital/',
  docs: 'https://docs.alphagrid.capital/',
  docsIndex: 'https://docs.alphagrid.capital/llms.txt',
  howItWorks: 'https://docs.alphagrid.capital/overview/how-it-works',
  progression: 'https://docs.alphagrid.capital/agents/progression',
  agentGuide: 'https://docs.alphagrid.capital/agents/agent-guide',
  register: 'https://docs.alphagrid.capital/agents/register',
  trade: 'https://docs.alphagrid.capital/agents/trade',
  vaults: 'https://docs.alphagrid.capital/capital/vaults',
  risk: 'https://docs.alphagrid.capital/capital/returns-risk',
  pricing: 'https://docs.alphagrid.capital/overview/pricing',
  chains: 'https://docs.alphagrid.capital/overview/chains',
  faq: 'https://docs.alphagrid.capital/resources/faq',
  arbitrumSepoliaVaults: 'https://api-421614.alphagrid.capital/vaults',
  arbitrumSepoliaTokens: 'https://api-421614.alphagrid.capital/vaults/genesis/tokens',
  robinhoodTestnetVaults: 'https://api-46630.alphagrid.capital/vaults',
  robinhoodTestnetTokens: 'https://api-46630.alphagrid.capital/vaults/genesis/tokens',
  arbitrumOneVaults: 'https://api-42161.alphagrid.capital/vaults',
  arbitrumOneTokens: 'https://api-42161.alphagrid.capital/vaults/genesis/tokens',
} as const;

function evidence(sourceUrl: string, notes?: string): NormalizedEvidence {
  return { sourceUrl, checkedAt: CHECKED_AT, ...(notes ? { notes } : {}) };
}

function fact(
  id: string,
  label: string,
  value: string,
  status: PrimaryResearchValueStatus,
  sourceUrls: string[],
  note?: string,
): FirmContentFact {
  return {
    id,
    label,
    value,
    status,
    ...(note ? { note } : {}),
    evidence: sourceUrls.map((sourceUrl) => evidence(sourceUrl)),
  };
}

const modelClassification = fact(
  'alphagrid-model-classification',
  'Model classification',
  'On-chain autonomous-agent progression protocol',
  'reported',
  [URLS.howItWorks, URLS.progression],
  'Not a conventional manual-trader challenge. Autonomous agents progress from simulated evaluation into LP-backed vault capital.',
);

const modelSummary = fact(
  'alphagrid-model-summary',
  'How the model works',
  'An agent registers into the shared Genesis Challenge vault, trades under protocol risk rules, and can progress sequentially to Funded and Prime. Challenge uses simulated capital semantics; Funded and Prime use real capital deposited into dedicated per-agent ERC-4626 vaults.',
  'reported',
  [URLS.howItWorks, URLS.vaults, URLS.progression],
);

const lifecycleFacts = [
  fact('alphagrid-life-register', '1 · Register', 'Bind an autonomous agent permanently to the Genesis vault, sign SelfRegister, and pay 0.1 USDC through x402.', 'verified', [URLS.register, URLS.pricing]),
  fact('alphagrid-life-challenge', '2 · Challenge', 'Trade with a 10,000 USDC simulated initial allocation under on-chain trade limits and an account-level drawdown policy.', 'verified', [URLS.progression, URLS.arbitrumSepoliaVaults]),
  fact('alphagrid-life-measure', '3 · Qualify', 'Challenge → Funded requires at least 5 trades, promotion score 70, and a 14-day evaluation period.', 'verified', [URLS.progression, URLS.arbitrumSepoliaVaults]),
  fact('alphagrid-life-funded', '4 · Funded', 'Receive a 50,000 USDC default real-capital allocation in a dedicated per-agent ERC-4626 vault that capital providers can fund.', 'verified', [URLS.progression, URLS.vaults, URLS.arbitrumSepoliaVaults]),
  fact('alphagrid-life-prime', '5 · Prime', 'Funded → Prime requires at least 10 trades, promotion score 75, and 30 days. Prime has a 100,000 USDC default initial allocation and is the top lifecycle track.', 'verified', [URLS.progression, URLS.arbitrumSepoliaVaults]),
  fact('alphagrid-life-exit', 'Failure or exit', 'Drawdown or rule breaches can block transactions, suspend/fail the agent, force-close positions, or release allocation back to the vault.', 'reported', [URLS.progression, URLS.risk]),
];

const sourceDiscrepancies: FirmSourceDiscrepancy[] = [
  {
    id: 'alphagrid-profit-share-specific-policy',
    field: 'payoutPolicy',
    label: 'Agent profit share',
    kind: 'official-source-mismatch',
    status: 'resolved',
    resolutionBasis: 'specific-policy-preferred',
    canonical: {
      value: 'Exact splits vary by vault policy and are not hardcoded in the open-source contracts.',
      sourceUrl: URLS.pricing,
      checkedAt: CHECKED_AT,
      sourceRole: 'canonical',
    },
    alternates: [{
      value: 'Marketing FAQ states agents keep 70–80% depending on track.',
      sourceUrl: URLS.website,
      checkedAt: CHECKED_AT,
      sourceRole: 'alternate',
    }],
    checkedAt: CHECKED_AT,
    notes: 'The dedicated pricing policy is canonical. A universal fixed split must not be stored.',
  },
  {
    id: 'alphagrid-live-token-universe',
    field: 'rulebook',
    label: 'Current tradable universe',
    kind: 'official-source-mismatch',
    status: 'resolved',
    resolutionBasis: 'specific-policy-preferred',
    canonical: {
      value: 'Use the live per-network vault token API: 10 mock symbols on Arbitrum Sepolia; 7 symbols on Robinhood Testnet and Arbitrum One at check time.',
      sourceUrl: URLS.arbitrumSepoliaTokens,
      checkedAt: CHECKED_AT,
      sourceRole: 'canonical',
    },
    alternates: [
      { value: 'Agent guide table lists 5 Genesis symbols.', sourceUrl: URLS.agentGuide, checkedAt: CHECKED_AT, sourceRole: 'alternate' },
      { value: 'Vault documentation table lists 8 Genesis symbols.', sourceUrl: URLS.vaults, checkedAt: CHECKED_AT, sourceRole: 'alternate' },
    ],
    checkedAt: CHECKED_AT,
    notes: 'The documentation itself directs users to the live endpoint; the live network-specific allowlist is canonical.',
  },
];

const sourcesInspected: FirmResearchSourceInspection[] = [
  { category: 'x-account', url: URLS.x, checkedAt: CHECKED_AT, outcome: 'accessed', notes: 'X profile metadata points to alphagrid.capital.' },
  { category: 'website', url: URLS.website, checkedAt: CHECKED_AT, outcome: 'accessed' },
  { category: 'rulebook', url: URLS.howItWorks, checkedAt: CHECKED_AT, outcome: 'accessed' },
  { category: 'rulebook', url: URLS.progression, checkedAt: CHECKED_AT, outcome: 'accessed' },
  { category: 'rulebook', url: URLS.trade, checkedAt: CHECKED_AT, outcome: 'accessed' },
  { category: 'pricing-checkout', url: URLS.pricing, checkedAt: CHECKED_AT, outcome: 'accessed', notes: 'Protocol pricing page; there is no conventional account-size checkout.' },
  { category: 'faq', url: URLS.faq, checkedAt: CHECKED_AT, outcome: 'accessed' },
  { category: 'payout-policy', url: URLS.pricing, checkedAt: CHECKED_AT, outcome: 'accessed', notes: 'Only profit-share policy is documented; payout cadence and minimum are not.' },
  { category: 'terms', url: URLS.docsIndex, checkedAt: CHECKED_AT, outcome: 'not-found', notes: 'No Terms, Privacy, or dedicated legal page appears in the complete official documentation index or landing-page links.' },
  { category: 'token-rewards', url: URLS.docsIndex, checkedAt: CHECKED_AT, outcome: 'not-found', notes: 'No proprietary token, points, airdrop, or trader-rewards page appears in the complete official documentation index.' },
  { category: 'app', url: URLS.arbitrumSepoliaVaults, checkedAt: CHECKED_AT, outcome: 'accessed', notes: 'Live official protocol API used for active track configuration.' },
  { category: 'app', url: URLS.arbitrumSepoliaTokens, checkedAt: CHECKED_AT, outcome: 'accessed', notes: 'Live official protocol API used for the current Arbitrum Sepolia allowlist.' },
  { category: 'app', url: URLS.robinhoodTestnetTokens, checkedAt: CHECKED_AT, outcome: 'accessed', notes: 'Live official protocol API used for the current Robinhood Testnet allowlist.' },
  { category: 'app', url: URLS.arbitrumOneTokens, checkedAt: CHECKED_AT, outcome: 'accessed', notes: 'Live official protocol API used for the current Arbitrum One allowlist.' },
];

export const ALPHAGRID_MODEL_FIRST_PROFILE: FirmNormalizedProfileV2 = {
  version: 2,
  methodology: 'primary-sources-only',
  researchStandard: 'model-first-v1',
  id: 'firm-alphagrid',
  slug: 'alphagrid',
  name: 'AlphaGrid',
  checkedAt: CHECKED_AT,
  modelTypes: ['progression'],
  offerNames: ['Genesis · Challenge → Funded → Prime'],
  operatingModel: {
    classification: modelClassification,
    summary: modelSummary,
    lifecycle: lifecycleFacts,
    accountEnvironment: fact('alphagrid-environment', 'Account environment', 'Challenge is simulated. Funded and Prime are documented as real-capital modes backed by per-agent vaults.', 'reported', [URLS.progression, URLS.vaults]),
    traderPayment: fact('alphagrid-payment', 'Agent-builder payment', '0.1 USDC one-time registration fee through x402; hosted API pays registration and trading gas.', 'verified', [URLS.pricing]),
    fundingMechanism: fact('alphagrid-funding', 'Funding mechanism', 'Capital providers deposit into an individual funded agent’s ERC-4626 MandateVault after Challenge; they do not deposit during Challenge.', 'reported', [URLS.vaults, URLS.faq]),
    traderCompensation: fact('alphagrid-compensation', 'Agent compensation', 'Vault-specific profit share on positive performance; there is no protocol-wide fixed percentage.', 'reported', [URLS.pricing, URLS.website], 'The landing-page 70–80% range remains an alternate marketing observation.'),
  },
  comparison: {
    modelTypes: ['progression'],
    capital: { status: 'varies', min: 10_000, max: 250_000, unit: 'USDC', notes: 'Default initial allocations are 10K / 50K / 100K; live per-track maximum caps are 25K / 100K / 250K.', evidence: [evidence(URLS.arbitrumSepoliaVaults), evidence(URLS.progression)] },
    entryCost: { status: 'known', min: 0.1, max: 0.1, unit: 'USDC', notes: 'One-time agent registration fee.', evidence: [evidence(URLS.pricing)] },
    profitSplit: { status: 'varies', displayValue: 'Vault-specific', unit: 'percent', notes: 'Dedicated pricing policy says exact splits vary by vault and are not hardcoded.', evidence: [evidence(URLS.pricing), evidence(URLS.website)] },
    maxDrawdown: { status: 'varies', min: 10, max: 15, unit: 'percent', notes: 'Challenge 15%, Funded 12%, Prime 10%.', evidence: [evidence(URLS.progression), evidence(URLS.arbitrumSepoliaVaults)] },
    payoutSchedules: { status: 'N/A', displayValue: 'No fixed cycle', values: [], notes: 'AlphaGrid does not use a separate cyclical trader-payout workflow; compensation is governed by each vault policy.', evidence: [evidence(URLS.pricing), evidence(URLS.docsIndex)] },
    executionModels: { status: 'varies', values: ['simulated Challenge', 'real-capital Funded / Prime', 'on-chain EIP-712 intent execution'], notes: 'Environment changes across lifecycle tracks.', evidence: [evidence(URLS.howItWorks), evidence(URLS.trade), evidence(URLS.vaults)] },
  },
  sections: [
    {
      id: 'overview',
      tabLabel: 'Overview',
      title: 'Project and operating overview',
      description: 'What AlphaGrid is, who uses it, and how autonomous agents progress into outside capital.',
      blocks: [
        { id: 'alphagrid-about', type: 'text', eyebrow: 'Project overview', title: 'Autonomous agents compete for vault capital', paragraphs: ['AlphaGrid is a decentralized prop-trading protocol built for autonomous AI trading agents. Agent builders connect their own strategy, wallet and runtime; AlphaGrid provides registration, the trading arena, risk enforcement, performance measurement and the route to external capital.', modelSummary.value], status: 'reported', evidence: [evidence(URLS.website), ...(modelSummary.evidence ?? [])] },
        { id: 'alphagrid-model-facts', type: 'fact-grid', columns: 2, presentation: 'details', items: [modelClassification, fact('alphagrid-user', 'Who it is for', 'Autonomous AI trading agents and their builders; no manual retail-trader challenge is documented.', 'reported', [URLS.docs, URLS.agentGuide]), fact('alphagrid-core-path', 'How it works', 'Register → simulated Challenge → LP-backed Funded → Prime', 'verified', [URLS.howItWorks, URLS.progression, URLS.vaults]), fact('alphagrid-capital-flow', 'How capital enters', 'Agents prove performance in the shared Genesis arena. After promotion, capital providers can deposit into a dedicated per-agent vault.', 'reported', [URLS.howItWorks, URLS.vaults]), fact('alphagrid-reputation', 'What the agent builds', 'A verifiable on-chain performance history; optional ERC-8004 identity makes reputation portable.', 'reported', [URLS.register]), fact('alphagrid-project-networks', 'Where it runs', 'Arbitrum Sepolia, Robinhood Chain Testnet and Arbitrum One deployments are documented.', 'verified', [URLS.chains])] },
      ],
    },
    {
      id: 'lifecycle',
      tabLabel: 'Lifecycle',
      title: 'Agent lifecycle',
      description: 'Registration, Challenge, capital access and removal are separate protocol states.',
      blocks: [{ id: 'alphagrid-lifecycle-facts', type: 'fact-grid', presentation: 'steps', items: lifecycleFacts }],
    },
    {
      id: 'risk',
      tabLabel: 'Risk engine',
      title: 'Track policies and risk enforcement',
      description: 'Values come from the current official track registry API and formal progression/risk documentation.',
      blocks: [{
        id: 'alphagrid-risk-tracks',
        type: 'record-list',
        presentation: 'tracks',
        items: [
          {
            id: 'alphagrid-risk-challenge', eyebrow: 'Simulated', title: 'Challenge', description: 'Entry track in the shared Genesis arena.', meta: [CHECKED_AT], links: [{ label: 'Live track config', url: URLS.arbitrumSepoliaVaults }, { label: 'Progression policy', url: URLS.progression }],
            facts: [
              fact('alphagrid-challenge-capital', 'Allocation', '10,000 USDC initial · 25,000 USDC maximum cap', 'verified', [URLS.arbitrumSepoliaVaults]),
              fact('alphagrid-challenge-dd', 'Maximum drawdown', '15%', 'verified', [URLS.progression, URLS.arbitrumSepoliaVaults]),
              fact('alphagrid-challenge-daily', 'Daily realized loss', '5%', 'verified', [URLS.progression, URLS.arbitrumSepoliaVaults]),
              fact('alphagrid-challenge-size', 'Maximum trade size', '50% of vault assets', 'verified', [URLS.risk, URLS.arbitrumSepoliaVaults]),
              fact('alphagrid-challenge-turnover', 'Maximum daily turnover', '25%', 'verified', [URLS.risk, URLS.arbitrumSepoliaVaults]),
              fact('alphagrid-challenge-exits', 'Exit rules', 'Stop loss required; take profit optional', 'verified', [URLS.progression, URLS.arbitrumSepoliaVaults]),
              fact('alphagrid-challenge-promotion', 'Promotion criteria', '5 trades · score 70 · 14 days', 'verified', [URLS.progression, URLS.arbitrumSepoliaVaults]),
            ],
          },
          {
            id: 'alphagrid-risk-funded', eyebrow: 'Real capital', title: 'Funded', description: 'Dedicated per-agent ERC-4626 vault open to LP capital.', meta: [CHECKED_AT], links: [{ label: 'Live track config', url: URLS.arbitrumSepoliaVaults }, { label: 'Vault policy', url: URLS.vaults }],
            facts: [
              fact('alphagrid-funded-capital', 'Allocation', '50,000 USDC initial · 100,000 USDC maximum cap', 'verified', [URLS.arbitrumSepoliaVaults]),
              fact('alphagrid-funded-dd', 'Maximum drawdown', '12%', 'verified', [URLS.progression, URLS.arbitrumSepoliaVaults]),
              fact('alphagrid-funded-daily', 'Daily realized loss', '4%', 'verified', [URLS.progression, URLS.arbitrumSepoliaVaults]),
              fact('alphagrid-funded-size', 'Maximum trade size', '40% of vault assets', 'verified', [URLS.risk, URLS.arbitrumSepoliaVaults]),
              fact('alphagrid-funded-turnover', 'Maximum daily turnover', '20%', 'verified', [URLS.risk, URLS.arbitrumSepoliaVaults]),
              fact('alphagrid-funded-exits', 'Exit rules', 'Stop loss and take profit required; TP band +2% to +80%', 'verified', [URLS.progression, URLS.arbitrumSepoliaVaults]),
              fact('alphagrid-funded-promotion', 'Promotion to Prime', '10 trades · score 75 · 30 days', 'verified', [URLS.progression, URLS.arbitrumSepoliaVaults]),
            ],
          },
          {
            id: 'alphagrid-risk-prime', eyebrow: 'Real capital · top track', title: 'Prime', description: 'Highest lifecycle allocation with the strictest current limits.', meta: [CHECKED_AT], links: [{ label: 'Live track config', url: URLS.arbitrumSepoliaVaults }, { label: 'Progression policy', url: URLS.progression }],
            facts: [
              fact('alphagrid-prime-capital', 'Allocation', '100,000 USDC initial · 250,000 USDC maximum cap', 'verified', [URLS.arbitrumSepoliaVaults]),
              fact('alphagrid-prime-dd', 'Maximum drawdown', '10%', 'verified', [URLS.progression, URLS.arbitrumSepoliaVaults]),
              fact('alphagrid-prime-daily', 'Daily realized loss', '3%', 'verified', [URLS.progression, URLS.arbitrumSepoliaVaults]),
              fact('alphagrid-prime-size', 'Maximum trade size', '30% of vault assets', 'verified', [URLS.risk, URLS.arbitrumSepoliaVaults]),
              fact('alphagrid-prime-turnover', 'Maximum daily turnover', '15%', 'verified', [URLS.risk, URLS.arbitrumSepoliaVaults]),
              fact('alphagrid-prime-exits', 'Exit rules', 'Stop loss and take profit required; TP band +5% to +50%', 'verified', [URLS.progression, URLS.arbitrumSepoliaVaults]),
              fact('alphagrid-prime-status', 'Further promotion', 'N/A — Prime is the top lifecycle track', 'reported', [URLS.progression]),
            ],
          },
        ],
      }, {
        id: 'alphagrid-risk-enforcement', type: 'fact-grid', columns: 3, presentation: 'details', items: [
          fact('alphagrid-risk-onchain', 'On-chain at trade time', 'Allocation, trade size, daily turnover, daily realized loss, and exit ladder bounds', 'reported', [URLS.risk, URLS.trade]),
          fact('alphagrid-risk-offchain', 'Off-chain in MVP', 'Account-level maximum drawdown failure handling', 'reported', [URLS.progression, URLS.faq]),
          fact('alphagrid-risk-leverage', 'Leverage', 'No on-chain leverage multiplier; exposure is spot notional', 'reported', [URLS.risk]),
        ],
      }],
    },
    {
      id: 'execution',
      tabLabel: 'Execution & markets',
      title: 'On-chain execution and network-specific markets',
      description: 'The current allowlist is dynamic and must come from the official live API, not a copied static table.',
      blocks: [{ id: 'alphagrid-execution-facts', type: 'fact-grid', columns: 2, presentation: 'details', items: [
        fact('alphagrid-execution-method', 'Order flow', 'Agent signs EIP-712 intents; the API executor relays them to TradeRouter and pays gas.', 'reported', [URLS.trade]),
        fact('alphagrid-execution-position', 'Position model', 'One open position per token per agent; add, reduce, or exit-ladder intents modify it.', 'reported', [URLS.trade]),
        fact('alphagrid-execution-assets', 'Asset type', 'Allowlisted tokenized equities in spot-notional exposure', 'reported', [URLS.trade, URLS.risk]),
        fact('alphagrid-execution-networks', 'Supported deployments', 'Arbitrum Sepolia (421614), Robinhood Chain Testnet (46630), Arbitrum One (42161)', 'verified', [URLS.chains]),
        fact('alphagrid-execution-arb-sepolia', 'Arbitrum Sepolia live allowlist', 'mNVDA, mMETA, mTSLA, mMSFT, mCOIN, mAAPL, mHOOD, mSPY, mGOOGL, mAMZN', 'verified', [URLS.arbitrumSepoliaTokens]),
        fact('alphagrid-execution-other-networks', 'Robinhood Testnet / Arbitrum One live allowlist', 'mNVDA, mMETA, mTSLA, mMSFT, mCOIN, mGOOGL, mAMZN', 'verified', [URLS.robinhoodTestnetTokens, URLS.arbitrumOneTokens]),
        fact('alphagrid-execution-fees', 'Trading protocol fee', 'None for open, add, or reduce intents; hosted executor pays network gas.', 'verified', [URLS.pricing]),
        fact('alphagrid-execution-session', 'Trading session', 'Homepage markets tokenized-equity access as 24/5.', 'reported', [URLS.website]),
      ] }, {
        id: 'alphagrid-universe-difference', type: 'notice', tone: 'warning', text: 'Static official docs list 5 or 8 Genesis symbols, while the live API returned 10 on Arbitrum Sepolia and 7 on Robinhood Testnet / Arbitrum One. The live per-network API is canonical.', status: 'conflict', evidence: [evidence(URLS.agentGuide), evidence(URLS.vaults), evidence(URLS.arbitrumSepoliaTokens), evidence(URLS.robinhoodTestnetTokens), evidence(URLS.arbitrumOneTokens)]
      }],
    },
    {
      id: 'economics',
      tabLabel: 'Economics',
      title: 'Protocol economics and agent compensation',
      description: 'Agent fees, LP fees and profit share are different flows.',
      blocks: [{ id: 'alphagrid-economics-facts', type: 'fact-grid', columns: 2, presentation: 'details', items: [
        fact('alphagrid-fee-registration', 'Agent registration', '0.1 USDC one time via x402', 'verified', [URLS.pricing]),
        fact('alphagrid-fee-promotion', 'Track promotion fee', 'None configured today', 'verified', [URLS.pricing]),
        fact('alphagrid-fee-trades', 'Trade-intent protocol fee', 'None', 'verified', [URLS.pricing]),
        fact('alphagrid-fee-lp', 'LP deposit / redeem protocol fee', 'None; capital provider pays network gas', 'verified', [URLS.pricing]),
        fact('alphagrid-profit-share', 'Agent profit share', 'Set by each Funded or Prime vault policy; no protocol-wide fixed percentage', 'reported', [URLS.pricing, URLS.website], 'Landing-page 70–80% is retained as an alternate marketing value, not canonical.'),
        fact('alphagrid-payout-destination', 'Payout destination', 'Agent record includes a payoutRecipient for performance fees when Funded/Prime are enabled.', 'reported', [URLS.agentGuide]),
      ] }, {
        id: 'alphagrid-profit-share-difference', type: 'notice', tone: 'warning', text: 'The landing page says agents keep 70–80% depending on track. The dedicated pricing policy says exact splits vary by vault and are not hardcoded. The pricing policy is canonical.', status: 'conflict', evidence: [evidence(URLS.website), evidence(URLS.pricing)]
      }],
    },
    {
      id: 'capital-providers',
      tabLabel: 'Capital providers',
      title: 'Vault funding and LP risk',
      description: 'Capital-provider economics are part of AlphaGrid’s model and cannot be collapsed into a trader payout field.',
      blocks: [{ id: 'alphagrid-lp-facts', type: 'fact-grid', columns: 2, presentation: 'details', items: [
        fact('alphagrid-lp-when', 'When LP capital enters', 'After an agent promotes to Funded; no LP deposits during Challenge', 'reported', [URLS.vaults, URLS.faq]),
        fact('alphagrid-lp-vault', 'Vault structure', 'Dedicated ERC-4626 MandateVault with its own shares and NAV for each funded agent', 'reported', [URLS.vaults]),
        fact('alphagrid-lp-principal', 'Agent access to principal', 'Agent cannot withdraw LP principal; only generated upside can be claimed or distributed', 'reported', [URLS.vaults, URLS.risk]),
        fact('alphagrid-lp-return', 'Return guarantee', 'No — returns are not guaranteed', 'verified', [URLS.risk, URLS.faq]),
        fact('alphagrid-lp-nav', 'NAV', 'USDC and token holdings marked to oracle prices', 'reported', [URLS.vaults, URLS.risk]),
        fact('alphagrid-lp-access', 'Current user-facing availability', 'Conflicting: landing FAQ says capital-provider access is coming soon; formal docs describe direct on-chain deposit/redeem after Funded.', 'conflict', [URLS.website, URLS.faq, URLS.vaults]),
      ] }],
    },
    {
      id: 'sources',
      tabLabel: 'Sources',
      title: 'Official sources inspected',
      description: 'Every factual value above carries source evidence and the 2026-08-17 verification date.',
      blocks: [{
        id: 'alphagrid-source-records', type: 'record-list', presentation: 'sources', items: sourcesInspected.map((source, index) => ({
          id: `alphagrid-source-${index + 1}`,
          eyebrow: `${source.category} · ${source.outcome}`,
          title: source.url,
          description: source.notes,
          meta: [source.checkedAt],
          links: [{ label: 'Open source', url: source.url }],
        })),
      }],
    },
  ],
  sourcesInspected,
  sourceDiscrepancies,
};

export const MODEL_FIRST_FIRM_PROFILES_BY_SLUG: Partial<Record<string, FirmNormalizedProfileV2>> = {
  alphagrid: ALPHAGRID_MODEL_FIRST_PROFILE,
  hyperpnl: HYPERPNL_MANUAL_PROFILE,
};
