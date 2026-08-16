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
  kind: NormalizedFact<'evaluation' | 'instant-funding' | 'collateralized' | 'competition'>;
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
  normalizedProfile?: FirmNormalizedProfile;
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
