import type { PropFirm } from './firm';

export const FIRM_DATABASE_SCHEMA_VERSION = 1 as const;

export type FirmResearchStatus = 'stub' | 'researched' | 'verified';
export type FirmPublicationStatus = 'draft' | 'published' | 'archived';

export interface FirmLinks {
  officialWebsite?: string;
  x?: {
    handle: string;
    url: string;
  };
}

export type PrimaryResearchField =
  | 'officialWebsite'
  | 'rulebook'
  | 'faq'
  | 'pricingCheckout'
  | 'terms'
  | 'payoutPolicy'
  | 'tokenRewards';

export type PrimaryResearchValueStatus = 'reported' | 'verified' | 'conflict' | 'ND';
export type PrimaryResearchStatus = PrimaryResearchValueStatus;

/**
 * One atomic field-level observation from a first-party source.
 *
 * `ND` means the requested value was not documented on the inspected official
 * source. It is intentionally stored as a value instead of being omitted so a
 * missing page can never be mistaken for an unfinished review.
 */
export interface PrimaryResearchObservation {
  id: string;
  field: PrimaryResearchField;
  value: string;
  status: PrimaryResearchValueStatus;
  sourceUrl: string;
  checkedAt: string;
  notes?: string;
}

export interface FirmPrimaryResearch {
  methodology: 'primary-sources-only';
  checkedAt: string;
  observations: PrimaryResearchObservation[];
}

export type PrimaryResearch = FirmPrimaryResearch;

export interface FirmBrandAssets {
  logoPath: string;
  sourceUrl: string;
  status: 'reported' | 'verified';
  checkedAt: string;
}

export type NormalizedND = 'ND';

export interface NormalizedEvidence {
  sourceUrl: string;
  checkedAt: string;
  notes?: string;
}

export type SourceDiscrepancyKind = 'page-vs-rulebook' | 'official-source-mismatch';
export type SourceResolutionBasis = 'rulebook-preferred' | 'specific-policy-preferred' | 'terms-preferred';

export interface SourceDiscrepancyCandidate extends NormalizedEvidence {
  value: string;
  sourceRole: 'canonical' | 'alternate';
  observationId?: string;
}

export interface FirmSourceDiscrepancy {
  id: string;
  field: PrimaryResearchField;
  label: string;
  kind: SourceDiscrepancyKind;
  status: 'resolved';
  resolutionBasis: SourceResolutionBasis;
  canonical: SourceDiscrepancyCandidate;
  alternates: SourceDiscrepancyCandidate[];
  checkedAt: string;
  notes: string;
}

export type NormalizedFact<T> =
  | { status: 'reported' | 'verified'; value: T; evidence: NormalizedEvidence[] }
  | { status: 'ND'; value: NormalizedND; evidence: NormalizedEvidence[]; notes: string };

export interface NormalizedChallengeStage {
  name: string;
  profitTargetPercent: NormalizedFact<number>;
  minimumTradingDays: NormalizedFact<number>;
  durationDays: NormalizedFact<number>;
  funded: NormalizedFact<boolean>;
}

export interface NormalizedChallengeTier {
  accountSize: NormalizedFact<number>;
  fee: NormalizedFact<number>;
  originalFee: NormalizedFact<number>;
  currency: NormalizedFact<'USD' | 'USDC' | 'USDT' | 'SOL'>;
  available: NormalizedFact<boolean>;
}

export interface NormalizedChallengeProgram {
  id: string;
  name: string;
  kind: NormalizedFact<'evaluation' | 'instant-funding' | 'collateralized' | 'competition' | 'progression'>;
  stages: NormalizedFact<NormalizedChallengeStage[]>;
  tiers: NormalizedFact<NormalizedChallengeTier[]>;
  dailyLossPercent: NormalizedFact<number>;
  maxDrawdownPercent: NormalizedFact<number>;
  maxDrawdownType: NormalizedFact<'static' | 'trailing-high-water-mark' | 'trailing-daily' | 'dynamic' | 'none'>;
  fundedProfitSplitPercent: NormalizedFact<number>;
  feeRefundable: NormalizedFact<boolean>;
  noTimeLimit: NormalizedFact<boolean>;
  notes: NormalizedFact<string>;
}

export interface FirmExternalRatingDistributionBucket {
  stars: 1 | 2 | 3 | 4 | 5;
  sharePercent: number;
  approximate?: boolean;
}

export interface FirmExternalRating {
  source: 'trustpilot';
  sourceName: 'Trustpilot';
  url: string;
  score: number;
  scale: 5;
  label: 'Excellent' | 'Great' | 'Average' | 'Poor' | 'Bad';
  reviewCount: number;
  reviewCountLabel: string;
  reviewCountApproximate?: boolean;
  checkedAt: string;
  captureMethod: 'user-supplied-snapshot';
  distribution?: FirmExternalRatingDistributionBucket[];
  distributionBasis?: 'visual-estimate';
}

export interface FirmNormalizedProfile {
  version: 1;
  methodology: 'primary-sources-only';
  id: string;
  slug: string;
  name: string;
  checkedAt: string;
  identity: {
    officialWebsite: NormalizedFact<string>;
    xHandle: NormalizedFact<string>;
    logo: NormalizedFact<string>;
    tagline: NormalizedFact<string>;
    description: NormalizedFact<string>;
  };
  summary: {
    profitSplit: NormalizedFact<string>;
    maxDrawdown: NormalizedFact<string>;
    dailyDrawdown: NormalizedFact<string>;
    profitTarget: NormalizedFact<string>;
    minCapital: NormalizedFact<number>;
    maxCapital: NormalizedFact<number>;
    cryptoLeverage: NormalizedFact<string>;
    payoutFrequency: NormalizedFact<string>;
  };
  challengePrograms: NormalizedFact<NormalizedChallengeProgram[]>;
  payoutPolicy: {
    schedule: NormalizedFact<'on-demand' | 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'conditional'>;
    profitSplitPercent: NormalizedFact<number>;
    minimumAmount: NormalizedFact<number>;
    currencies: NormalizedFact<Array<'USD' | 'USDC' | 'USDT' | 'BTC' | 'ETH' | 'SOL'>>;
    processingTimeHours: NormalizedFact<number>;
    positionsMustBeClosed: NormalizedFact<boolean>;
    partialWithdrawalsAllowed: NormalizedFact<boolean>;
    payoutResetsBalance: NormalizedFact<boolean>;
    notes: NormalizedFact<string>;
  };
  tradingPolicy: {
    platforms: NormalizedFact<string[]>;
    markets: NormalizedFact<string[]>;
    leverage: NormalizedFact<string[]>;
    consistencyRule: NormalizedFact<'none' | 'applies'>;
    profitDayDefinition: NormalizedFact<string>;
    newsTrading: NormalizedFact<'allowed' | 'restricted' | 'conditional'>;
    weekendHolding: NormalizedFact<'allowed' | 'restricted' | 'conditional'>;
    automatedTrading: NormalizedFact<'allowed' | 'restricted' | 'conditional'>;
    copyTrading: NormalizedFact<'allowed' | 'restricted' | 'conditional'>;
    mandatoryStopLoss: NormalizedFact<boolean>;
    tradingFees: NormalizedFact<string>;
  };
  executionPolicy: {
    model: NormalizedFact<'a-book' | 'b-book' | 'hybrid' | 'simulated'>;
    venue: NormalizedFact<string>;
    onchainSettlement: NormalizedFact<boolean>;
    notes: NormalizedFact<string>;
  };
  compliancePolicy: {
    legalEntity: NormalizedFact<string>;
    registrationJurisdiction: NormalizedFact<string>;
    regulatoryStatus: NormalizedFact<string>;
    kycRequiredAt: NormalizedFact<'registration' | 'purchase' | 'funded-activation' | 'payout' | 'not-required'>;
    restrictedJurisdictions: NormalizedFact<string[]>;
    maximumAggregateFundedBalance: NormalizedFact<number>;
    simulatedAccounts: NormalizedFact<boolean>;
  };
  tokenRewards: {
    hasToken: NormalizedFact<boolean>;
    tokenTicker: NormalizedFact<string>;
    tokenSupply: NormalizedFact<number>;
    hasPoints: NormalizedFact<boolean>;
    pointsProgramName: NormalizedFact<string>;
    hasAirdrop: NormalizedFact<boolean>;
    airdropStatus: NormalizedFact<'confirmed' | 'unconfirmed' | 'active' | 'potential'>;
    description: NormalizedFact<string>;
  };
  company: {
    yearEstablished: NormalizedFact<number>;
    headquarters: NormalizedFact<string>;
  };
  sourceDiscrepancies: FirmSourceDiscrepancy[];
  claims: PrimaryResearchObservation[];
  ndFields: string[];
  /** Third-party display data attached by the public read layer; excluded from primary-source methodology. */
  externalRatings?: FirmExternalRating[];
  modularProfile?: FirmNormalizedProfileV2;
}

export type FirmModelType =
  | 'evaluation'
  | 'instant-funding'
  | 'collateralized'
  | 'competition'
  | 'progression'
  | 'other';

export type FirmContentStatus = PrimaryResearchValueStatus | 'N/A' | 'pending';

export interface FirmContentLink {
  label: string;
  url: string;
}

export interface FirmContentFact {
  id: string;
  label: string;
  value: string;
  status?: FirmContentStatus;
  note?: string;
  evidence?: NormalizedEvidence[];
  /** @deprecated Read compatibility for the first generated V2 migration. */
  sourceUrls?: string[];
}

export interface FirmOperatingModelDefinition {
  classification: FirmContentFact;
  summary: FirmContentFact;
  lifecycle: FirmContentFact[];
  accountEnvironment?: FirmContentFact;
  traderPayment?: FirmContentFact;
  fundingMechanism?: FirmContentFact;
  traderCompensation?: FirmContentFact;
}

export interface FirmResearchSourceInspection {
  category: 'x-account' | 'website' | 'rulebook' | 'faq' | 'pricing-checkout' | 'terms' | 'payout-policy' | 'token-rewards' | 'app' | 'other';
  url: string;
  checkedAt: string;
  outcome: 'accessed' | 'blocked' | 'not-found';
  notes?: string;
}

export interface FirmContentRecord {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  facts?: FirmContentFact[];
  meta?: string[];
  links?: FirmContentLink[];
}

export interface FirmContentTableColumn {
  key: string;
  label: string;
}

export interface FirmContentTableRow {
  id: string;
  cells: Record<string, string>;
}

export type FirmContentBlock =
  | {
      id: string;
      type: 'text';
      eyebrow?: string;
      title?: string;
      paragraphs: string[];
      meta?: string;
      status?: FirmContentStatus;
      evidence?: NormalizedEvidence[];
    }
  | {
      id: string;
      type: 'fact-grid';
      columns?: 2 | 3 | 4;
      presentation?: 'metrics' | 'details' | 'steps';
      items: FirmContentFact[];
    }
  | {
      id: string;
      type: 'record-list';
      presentation?: 'records' | 'tracks' | 'sources';
      items: FirmContentRecord[];
    }
  | {
      id: string;
      type: 'table';
      title?: string;
      description?: string;
      columns: FirmContentTableColumn[];
      rows: FirmContentTableRow[];
    }
  | {
      id: string;
      type: 'notice';
      tone: 'neutral' | 'positive' | 'warning';
      text: string;
      status?: FirmContentStatus;
      evidence?: NormalizedEvidence[];
    };

export interface FirmProfileSection {
  id: string;
  tabLabel: string;
  title: string;
  description?: string;
  blocks: FirmContentBlock[];
}

export interface ComparisonRangeProjection {
  status: 'known' | 'varies' | 'ND' | 'N/A';
  displayValue?: string;
  min?: number;
  max?: number;
  unit: 'USD' | 'USDC' | 'percent';
  notes?: string;
  evidence?: NormalizedEvidence[];
}

export interface ComparisonListProjection {
  status: 'known' | 'varies' | 'ND' | 'N/A';
  displayValue?: string;
  values: string[];
  notes?: string;
  evidence?: NormalizedEvidence[];
}

export interface FirmComparisonProjection {
  modelTypes: FirmModelType[];
  capital: ComparisonRangeProjection;
  entryCost: ComparisonRangeProjection;
  profitSplit: ComparisonRangeProjection;
  maxDrawdown: ComparisonRangeProjection;
  payoutSchedules: ComparisonListProjection;
  executionModels: ComparisonListProjection;
}

export interface FirmNormalizedProfileV2 {
  version: 2;
  contentStage?: 'research' | 'editorial';
  editorialCopy?: Record<string, string>;
  methodology: 'primary-sources-only';
  researchStandard?: 'model-first-v1';
  researchMode?: 'manual' | 'agent-assisted';
  id: string;
  slug: string;
  name: string;
  checkedAt: string;
  modelTypes: FirmModelType[];
  offerNames: string[];
  operatingModel?: FirmOperatingModelDefinition;
  sections: FirmProfileSection[];
  sourcesInspected?: FirmResearchSourceInspection[];
  comparison: FirmComparisonProjection;
  sourceDiscrepancies: FirmSourceDiscrepancy[];
}

/**
 * Canonical Firestore record stored in `firmRegistry/{id}`.
 *
 * Identity and links are always available. `profile` is intentionally absent
 * for stubs so an unknown value can never be mistaken for a researched zero.
 */
export interface FirmDatabaseRecord {
  schemaVersion: typeof FIRM_DATABASE_SCHEMA_VERSION;
  id: string;
  slug: string;
  name: string;
  links: FirmLinks;
  brandAssets?: FirmBrandAssets;
  researchStatus: FirmResearchStatus;
  publicationStatus: FirmPublicationStatus;
  primaryResearch?: FirmPrimaryResearch;
  externalRatings?: FirmExternalRating[];
  normalizedProfile?: FirmNormalizedProfile;
  normalizedProfileV2?: FirmNormalizedProfileV2;
  draftProfileV2?: FirmNormalizedProfileV2;
  pageProfileV2?: FirmNormalizedProfileV2;
  draftPageProfileV2?: FirmNormalizedProfileV2;
  draftUpdatedAt?: string;
  publishedAt?: string;
  profile?: PropFirm;
  createdAt: string;
  updatedAt: string;
}

export function hasResearchProfile(record: FirmDatabaseRecord): record is FirmDatabaseRecord & { profile: PropFirm } {
  return record.researchStatus !== 'stub' && Boolean(record.profile);
}

export function hasNormalizedProfile(
  record: FirmDatabaseRecord,
): record is FirmDatabaseRecord & { normalizedProfile: FirmNormalizedProfile } {
  return Boolean(record.normalizedProfile);
}

export function hasPrimaryResearch(
  record: FirmDatabaseRecord,
): record is FirmDatabaseRecord & { primaryResearch: FirmPrimaryResearch } {
  return Boolean(record.primaryResearch?.observations.length);
}
