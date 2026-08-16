import { PRIMARY_RESEARCH_BY_SLUG } from './firmPrimaryResearch.ts';
import type {
  FirmSourceDiscrepancy,
  SourceDiscrepancyKind,
  SourceResolutionBasis,
} from '@/types/database';

interface DiscrepancyInput {
  slug: string;
  id: string;
  label: string;
  canonicalId: string;
  alternateIds: string[];
  kind: SourceDiscrepancyKind;
  resolutionBasis: SourceResolutionBasis;
  notes: string;
}

const INPUTS: DiscrepancyInput[] = [
  { slug: 'foxify', id: 'minimum-trading-days', label: 'Minimum trading days', canonicalId: 'foxify-rulebook-3', alternateIds: ['foxify-rulebook-4'], kind: 'page-vs-rulebook', resolutionBasis: 'rulebook-preferred', notes: 'The consolidated documentation is used as the canonical rule source; the dedicated FAQ is retained as an alternate.' },
  { slug: 'foxify', id: 'maximum-current-funding', label: 'Current maximum funding', canonicalId: 'foxify-pricingCheckout-7', alternateIds: ['foxify-pricingCheckout-6'], kind: 'page-vs-rulebook', resolutionBasis: 'rulebook-preferred', notes: 'Documentation distinguishes currently available $10K tracks from the $20K Elite track marked coming soon.' },
  { slug: 'solana-funded', id: 'account-environment', label: 'Simulated versus real trading environment', canonicalId: 'solana-funded-terms-6', alternateIds: ['solana-funded-terms-5'], kind: 'official-source-mismatch', resolutionBasis: 'terms-preferred', notes: 'The explicit Terms disclosure is canonical; homepage capital and execution marketing is retained as an alternate.' },
  { slug: 'solana-funded', id: 'payout-cycle', label: 'Standard payout split and cycle', canonicalId: 'solana-funded-payoutPolicy-7', alternateIds: ['solana-funded-payoutPolicy-8'], kind: 'page-vs-rulebook', resolutionBasis: 'rulebook-preferred', notes: 'Dedicated account rules define the standard 80% split and 21/14-day cycle; homepage wording describes the upgraded offer.' },
  { slug: 'hypernova', id: 'low-risk-fee', label: '$25K Low Risk fee', canonicalId: 'hypernova-pricingCheckout-5', alternateIds: ['hypernova-pricingCheckout-4'], kind: 'page-vs-rulebook', resolutionBasis: 'rulebook-preferred', notes: 'Rulebook v1.1 price $280 is canonical; the homepage $275 card is retained as an alternate.' },
  { slug: 'hypernova', id: 'payout-speed', label: 'Average payout processing speed', canonicalId: 'hypernova-payoutPolicy-9', alternateIds: ['hypernova-payoutPolicy-8'], kind: 'page-vs-rulebook', resolutionBasis: 'rulebook-preferred', notes: 'The rulebook statement is canonical; the homepage live statistic remains dated evidence.' },
  { slug: 'hyperpnl', id: 'challenge-structure', label: 'Challenge structure and risk limits', canonicalId: 'hyperpnl-rulebook-3', alternateIds: ['hyperpnl-rulebook-2'], kind: 'page-vs-rulebook', resolutionBasis: 'rulebook-preferred', notes: 'GitBook evaluation rules are canonical; the active homepage 1-Step product remains an alternate until the documentation is updated.' },
  { slug: 'hyrotrader', id: 'standard-profit-split', label: 'Standard funded profit split', canonicalId: 'hyrotrader-payoutPolicy-6', alternateIds: ['hyrotrader-payoutPolicy-7'], kind: 'official-source-mismatch', resolutionBasis: 'specific-policy-preferred', notes: 'The dedicated payout FAQ is canonical for standard withdrawals; the product-category marketing range remains an alternate.' },
  { slug: 'hyrotrader', id: 'complimentary-profit-split', label: 'Complimentary-account profit split', canonicalId: 'hyrotrader-tokenRewards-9', alternateIds: ['hyrotrader-tokenRewards-10'], kind: 'official-source-mismatch', resolutionBasis: 'specific-policy-preferred', notes: 'The dedicated complimentary-accounts FAQ is used for this account category; the Terms value remains visible as an alternate.' },
  { slug: 'carrot-funding', id: 'two-phase-max-loss', label: '2-Phase maximum loss', canonicalId: 'carrot-funding-rulebook-2', alternateIds: ['carrot-funding-rulebook-3'], kind: 'page-vs-rulebook', resolutionBasis: 'rulebook-preferred', notes: 'The formal rulebook 10% maximum loss is canonical; the homepage “below 8%” wording is retained as an alternate.' },
  { slug: 'carrot-funding', id: 'payout-frequency', label: 'Payout request frequency', canonicalId: 'carrot-funding-payoutPolicy-7', alternateIds: ['carrot-funding-payoutPolicy-8'], kind: 'page-vs-rulebook', resolutionBasis: 'rulebook-preferred', notes: 'The formal rulebook on-demand policy is canonical under the selected methodology; the Terms weekly qualification remains visible.' },
  { slug: 'carrot-funding', id: 'points-formula', label: 'Season 1 points formula', canonicalId: 'carrot-funding-tokenRewards-9', alternateIds: ['carrot-funding-tokenRewards-10'], kind: 'official-source-mismatch', resolutionBasis: 'specific-policy-preferred', notes: 'The dedicated current Season 1 page is canonical; the general FAQ formula remains an alternate.' },
  { slug: 'hyper-stack', id: 'scaled-account-entitlement', label: 'Scaled-account invitation and rewards', canonicalId: 'hyper-stack-payoutPolicy-8', alternateIds: ['hyper-stack-payoutPolicy-7'], kind: 'official-source-mismatch', resolutionBasis: 'terms-preferred', notes: 'Terms are canonical because no formal rulebook resolves the entitlement language; marketing remains an alternate.' },
  { slug: 'vanta-trading', id: 'profit-target', label: 'One-step profit target', canonicalId: 'vanta-trading-rulebook-2', alternateIds: ['vanta-trading-rulebook-3'], kind: 'page-vs-rulebook', resolutionBasis: 'rulebook-preferred', notes: 'The rulebook and FAQ 10% target is canonical; the homepage 8% Kickstarter card remains an alternate.' },
  { slug: 'vanta-trading', id: 'scaled-account-payouts', label: 'Scaled-account activation and payouts', canonicalId: 'vanta-trading-payoutPolicy-7', alternateIds: ['vanta-trading-payoutPolicy-8'], kind: 'page-vs-rulebook', resolutionBasis: 'rulebook-preferred', notes: 'The formal rules are canonical under the selected methodology; the Terms disclaimer remains visible.' },
  { slug: 'size', id: 'bronze-key-fee', label: 'Bronze Key fee', canonicalId: 'size-pricingCheckout-4', alternateIds: ['size-pricingCheckout-5'], kind: 'official-source-mismatch', resolutionBasis: 'specific-policy-preferred', notes: 'The dedicated current product-tier documentation price $9 is canonical; the Terms schedule “Free” remains an alternate.' },
  { slug: 'breakout', id: 'daily-loss-and-leverage', label: 'Daily loss and leverage limits', canonicalId: 'breakout-rulebook-2', alternateIds: ['breakout-rulebook-3'], kind: 'page-vs-rulebook', resolutionBasis: 'rulebook-preferred', notes: 'Formal Program Rules are canonical; simplified homepage values remain an alternate.' },
  { slug: 'breakout', id: 'payout-approval', label: 'Payout approval requirement', canonicalId: 'breakout-payoutPolicy-8', alternateIds: ['breakout-payoutPolicy-7'], kind: 'official-source-mismatch', resolutionBasis: 'specific-policy-preferred', notes: 'The dedicated funded-trader payout procedure is canonical; marketing “no approval delay” language remains an alternate.' },
  { slug: 'funded-hive', id: 'payout-review', label: 'Payout review, delay and reversal conditions', canonicalId: 'funded-hive-payoutPolicy-8', alternateIds: ['funded-hive-payoutPolicy-7'], kind: 'official-source-mismatch', resolutionBasis: 'terms-preferred', notes: 'Terms are canonical because no formal rulebook resolves the marketing claim.' },
  { slug: 'klein-funding', id: 'profit-split-range', label: 'Configured profit-split range', canonicalId: 'klein-funding-payoutPolicy-6', alternateIds: ['klein-funding-payoutPolicy-7'], kind: 'official-source-mismatch', resolutionBasis: 'specific-policy-preferred', notes: 'The pricing matrix is canonical for purchasable configurations; the broader How It Works range remains an alternate.' },
  { slug: 'upscale-trade', id: 'profit-day-definition', label: 'Profitable-day definition', canonicalId: 'upscale-trade-rulebook-3', alternateIds: ['upscale-trade-rulebook-4'], kind: 'page-vs-rulebook', resolutionBasis: 'rulebook-preferred', notes: 'Current participation rules including unrealized PnL are canonical; the FAQ realized-only definition remains an alternate.' },
  { slug: 'upscale-trade', id: 'restricted-jurisdictions', label: 'Geographic eligibility', canonicalId: 'upscale-trade-terms-8', alternateIds: ['upscale-trade-terms-7'], kind: 'official-source-mismatch', resolutionBasis: 'terms-preferred', notes: 'Terms restrictions are canonical because no rulebook value was found; the worldwide FAQ claim remains an alternate.' },
  { slug: 'upscale-trade', id: 'withdrawal-kyc', label: 'KYC before withdrawal', canonicalId: 'upscale-trade-payoutPolicy-11', alternateIds: ['upscale-trade-payoutPolicy-10'], kind: 'official-source-mismatch', resolutionBasis: 'terms-preferred', notes: 'Terms passport and live-selfie requirements are canonical; the no-KYC FAQ claim remains an alternate.' },
];

function buildDiscrepancy(input: DiscrepancyInput): FirmSourceDiscrepancy {
  const ledger = PRIMARY_RESEARCH_BY_SLUG[input.slug];
  const canonical = ledger.observations.find((observation) => observation.id === input.canonicalId);
  const alternates = input.alternateIds.map((id) => ledger.observations.find((observation) => observation.id === id));
  if (!canonical || alternates.some((observation) => !observation)) {
    throw new Error(`Missing discrepancy evidence for ${input.slug}.${input.id}.`);
  }

  return {
    id: `${input.slug}-${input.id}`,
    field: canonical.field,
    label: input.label,
    kind: input.kind,
    status: 'resolved',
    resolutionBasis: input.resolutionBasis,
    canonical: {
      value: canonical.value,
      observationId: canonical.id,
      sourceUrl: canonical.sourceUrl,
      checkedAt: canonical.checkedAt,
      sourceRole: 'canonical',
      ...(canonical.notes ? { notes: canonical.notes } : {}),
    },
    alternates: alternates.map((observation) => ({
      value: observation!.value,
      observationId: observation!.id,
      sourceUrl: observation!.sourceUrl,
      checkedAt: observation!.checkedAt,
      sourceRole: 'alternate',
      ...(observation!.notes ? { notes: observation!.notes } : {}),
    })),
    checkedAt: canonical.checkedAt,
    notes: input.notes,
  };
}

export const SOURCE_DISCREPANCIES_BY_SLUG: Record<string, FirmSourceDiscrepancy[]> = Object.fromEntries(
  Object.keys(PRIMARY_RESEARCH_BY_SLUG).map((slug) => [
    slug,
    INPUTS.filter((input) => input.slug === slug).map(buildDiscrepancy),
  ]),
);

const hyperPnlRestrictionEvidence = PRIMARY_RESEARCH_BY_SLUG.hyperpnl.observations.find(
  (observation) => observation.id === 'hyperpnl-rulebook-4',
);
if (!hyperPnlRestrictionEvidence) throw new Error('Missing HyperPNL restriction discrepancy evidence.');
SOURCE_DISCREPANCIES_BY_SLUG.hyperpnl.push({
  id: 'hyperpnl-trading-restrictions',
  field: 'rulebook',
  label: 'Multiple-account and copy-trading restrictions',
  kind: 'page-vs-rulebook',
  status: 'resolved',
  resolutionBasis: 'rulebook-preferred',
  canonical: {
    value: 'Official evaluation rules prohibit multiple accounts and copy trading.',
    observationId: hyperPnlRestrictionEvidence.id,
    sourceUrl: hyperPnlRestrictionEvidence.sourceUrl,
    checkedAt: hyperPnlRestrictionEvidence.checkedAt,
    sourceRole: 'canonical',
  },
  alternates: [{
    value: 'Homepage says there are no trading restrictions.',
    sourceUrl: 'https://hyperpnl.com/',
    checkedAt: hyperPnlRestrictionEvidence.checkedAt,
    sourceRole: 'alternate',
  }],
  checkedAt: hyperPnlRestrictionEvidence.checkedAt,
  notes: 'The detailed evaluation rules are canonical; the broad homepage statement remains an alternate.',
});

if (Object.values(SOURCE_DISCREPANCIES_BY_SLUG).flat().length !== 24) {
  throw new Error('Expected 24 grouped source discrepancies.');
}
