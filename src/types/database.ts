import type { PropFirm } from './firm';

export const FIRM_DATABASE_SCHEMA_VERSION = 1 as const;

export type FirmResearchStatus = 'stub' | 'researched' | 'verified';
export type FirmPublicationStatus = 'draft' | 'published' | 'archived';

export type PrimaryResearchField =
  | 'officialWebsite'
  | 'rulebook'
  | 'faq'
  | 'pricingCheckout'
  | 'terms'
  | 'payoutPolicy'
  | 'tokenRewards';

export type PrimaryResearchStatus = 'verified' | 'reported' | 'conflict' | 'ND';

export interface PrimaryResearchObservation {
  id: string;
  field: PrimaryResearchField;
  value: string;
  status: PrimaryResearchStatus;
  sourceUrl: string;
  checkedAt: string;
  notes?: string;
}

export interface PrimaryResearch {
  methodology: 'primary-sources-only' | string;
  checkedAt: string;
  observations: PrimaryResearchObservation[];
}

export interface FirmLinks {
  officialWebsite?: string;
  x?: {
    handle: string;
    url: string;
  };
}

export interface FirmBrandAssets {
  logoPath: string;
  sourceUrl: string;
  status: 'reported' | 'verified';
  checkedAt: string;
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
  primaryResearch?: PrimaryResearch;
  profile?: PropFirm;
  createdAt: string;
  updatedAt: string;
}

export function hasResearchProfile(record: FirmDatabaseRecord): record is FirmDatabaseRecord & { profile: PropFirm } {
  return record.researchStatus !== 'stub' && Boolean(record.profile);
}

export function hasPrimaryResearch(record: FirmDatabaseRecord): record is FirmDatabaseRecord & { primaryResearch: PrimaryResearch } {
  return Boolean(record.primaryResearch?.observations.length);
}
