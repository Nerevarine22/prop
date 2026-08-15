import 'server-only';

import { cache } from 'react';
import { connection } from 'next/server';
import { getFirmRegistry } from '@/lib/services/firmRegistryService';
import { hasPrimaryResearch, hasResearchProfile, type FirmDatabaseRecord, type PrimaryResearchField, type PrimaryResearchObservation } from '@/types/database';
import type { PropFirm } from '@/types/firm';
import type { FirmDirectoryMetric, PublicFirmDirectoryItem } from '@/types/publicFirm';

function toPublishedProfile(record: Awaited<ReturnType<typeof getFirmRegistry>>[number]): PropFirm | null {
  if (record.publicationStatus !== 'published' || !hasResearchProfile(record)) return null;

  return {
    ...record.profile,
    id: record.id,
    slug: record.slug,
    name: record.name,
    logo: record.brandAssets?.logoPath || record.profile.logo,
    website: record.profile.website || record.links.officialWebsite,
  };
}

function observationFor(record: FirmDatabaseRecord, field: PrimaryResearchField): PrimaryResearchObservation[] {
  return record.primaryResearch?.observations.filter((observation) => observation.field === field) ?? [];
}

function observationMetric(record: FirmDatabaseRecord, field: PrimaryResearchField, label: string): FirmDirectoryMetric {
  const observations = observationFor(record, field);
  const hasConflict = observations.some((observation) => observation.status === 'conflict');
  const hasEvidence = observations.some((observation) => observation.status === 'verified' || observation.status === 'reported');
  const isNotDocumented = observations.length > 0 && observations.every((observation) => observation.status === 'ND');

  if (hasConflict) return { label, value: 'Conflict', note: 'Open the sources' };
  if (hasEvidence) return { label, value: 'Reported', note: 'Primary-source note' };
  if (isNotDocumented) return { label, value: 'Not found', note: 'Needs research' };
  return { label, value: 'Pending', note: 'Not reviewed' };
}

function trimSummary(value: string, maxLength = 150): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trimEnd()}…`;
}

function toDirectoryItem(record: FirmDatabaseRecord): PublicFirmDirectoryItem {
  if (hasResearchProfile(record)) {
    const firm = toPublishedProfile(record) ?? record.profile;
    const [drawdownValue, ...drawdownNoteParts] = firm.maxDrawdown.trim().split(/\s+/);

    return {
      id: record.id,
      slug: record.slug,
      name: record.name,
      logo: record.brandAssets?.logoPath || firm.logo,
      tagline: firm.tagline,
      statusLabel: 'Full profile',
      tags: firm.rewardTags ?? [],
      metrics: [
        { label: 'From', value: `$${firm.accountTiers[0]?.price ?? '—'}`, note: firm.evaluationSteps[0] ?? 'Not stated' },
        { label: 'Drawdown', value: drawdownValue || '—', note: drawdownNoteParts.join(' ') || 'Maximum' },
        { label: 'Split', value: firm.profitSplit.replace('Up to ', ''), note: 'Up to' },
        { label: 'Capital', value: firm.maxCapital >= 1_000_000 ? `$${firm.maxCapital / 1_000_000}M` : `$${Math.round(firm.maxCapital / 1000)}K`, note: 'Maximum' },
      ],
      searchText: `${firm.name} ${firm.tagline} ${firm.platforms.join(' ')} ${firm.rewardTags?.join(' ') ?? ''}`.toLowerCase(),
      evaluationSteps: firm.evaluationSteps,
      weekendHoldingAllowed: firm.weekendHoldingAllowed,
      hasRewards: Boolean(firm.rewardTags?.length),
      comparable: record.publicationStatus === 'published',
    };
  }

  const observations = record.primaryResearch?.observations ?? [];
  const ruleSummary = observations.find((observation) => observation.field === 'rulebook' && observation.status !== 'ND')?.value;
  const conflictCount = observations.filter((observation) => observation.status === 'conflict').length;
  const documentedCount = observations.filter((observation) => observation.status !== 'ND').length;

  return {
    id: record.id,
    slug: record.slug,
    name: record.name,
    logo: record.brandAssets?.logoPath,
    tagline: trimSummary(ruleSummary || 'Primary-source research has started. Core product data is not documented yet.'),
    statusLabel: 'Research notes',
    tags: [
      `${documentedCount} findings`,
      ...(conflictCount ? [`${conflictCount} conflict${conflictCount === 1 ? '' : 's'}`] : []),
    ],
    metrics: [
      observationMetric(record, 'rulebook', 'Rules'),
      observationMetric(record, 'pricingCheckout', 'Pricing'),
      observationMetric(record, 'payoutPolicy', 'Payouts'),
      { label: 'Evidence', value: String(observations.length), note: 'Research notes' },
    ],
    searchText: `${record.name} ${record.slug} ${observations.map((observation) => observation.value).join(' ')}`.toLowerCase(),
    evaluationSteps: [],
    hasRewards: observations.some((observation) => observation.field === 'tokenRewards' && observation.status !== 'ND'),
    comparable: false,
  };
}

export const getPublicFirmRecords = cache(async (): Promise<FirmDatabaseRecord[]> => {
  await connection();
  const records = await getFirmRegistry();

  return records
    .filter((record) => record.publicationStatus === 'published' && (hasResearchProfile(record) || hasPrimaryResearch(record)))
    .sort((a, b) => Number(hasResearchProfile(b)) - Number(hasResearchProfile(a)) || a.name.localeCompare(b.name));
});

export const getPublicFirmDirectoryItems = cache(async (): Promise<PublicFirmDirectoryItem[]> => {
  const records = await getPublicFirmRecords();
  return records.map(toDirectoryItem);
});

export const getPublishedFirmProfiles = cache(async (): Promise<PropFirm[]> => {
  const records = await getPublicFirmRecords();

  return records
    .map(toPublishedProfile)
    .filter((profile): profile is PropFirm => Boolean(profile))
    .sort((a, b) => Number(b.featured) - Number(a.featured) || b.trustScore - a.trustScore || a.name.localeCompare(b.name));
});

export const getPublishedFirmBySlug = cache(async (slug: string): Promise<PropFirm | undefined> => {
  const profiles = await getPublishedFirmProfiles();
  return profiles.find((profile) => profile.slug === slug);
});

export const getPublicFirmRecordBySlug = cache(async (slug: string): Promise<FirmDatabaseRecord | undefined> => {
  const records = await getPublicFirmRecords();
  return records.find((record) => record.slug === slug);
});
