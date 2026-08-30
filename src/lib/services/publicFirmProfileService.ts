import { cache } from 'react';
import { PUBLIC_FIRM_PROFILES } from '@/lib/data/publicFirmProfiles';
import { attachFirmModularProfile } from '@/lib/data/firmModularProfiles';
import { getFirmRegistry } from '@/lib/services/firmRegistryService';
import type { FirmNormalizedProfile } from '@/types/database';

function sortProfiles(profiles: FirmNormalizedProfile[]): FirmNormalizedProfile[] {
  return profiles.sort((a, b) => {
    if (a.slug === 'propr') return -1;
    if (b.slug === 'propr') return 1;
    return a.name.localeCompare(b.name);
  });
}

function isCurrentNormalizedProfile(profile: FirmNormalizedProfile | undefined): profile is FirmNormalizedProfile {
  return Boolean(
    profile
    && Array.isArray(profile.sourceDiscrepancies)
    && profile.tradingPolicy?.profitDayDefinition,
  );
}

function withRegistryBrand(
  profile: FirmNormalizedProfile,
  logoPath: string | undefined,
  sourceUrl: string | undefined,
  checkedAt: string | undefined,
): FirmNormalizedProfile {
  if (!logoPath || !sourceUrl || !checkedAt) return profile;
  return {
    ...profile,
    identity: {
      ...profile.identity,
      logo: {
        status: 'verified',
        value: logoPath,
        evidence: [{ sourceUrl, checkedAt }],
      },
    },
  };
}

/**
 * Public read path: Firestore is canonical. The checked-in research snapshot is
 * used only when Firebase is unavailable during local development or a build.
 */
export const getPublicFirmProfiles = cache(async (): Promise<FirmNormalizedProfile[]> => {
  try {
    const records = await getFirmRegistry();
    const storedProfiles = records
      .map((record) => record.normalizedProfile && attachFirmModularProfile(
        withRegistryBrand(
          record.normalizedProfile,
          record.brandAssets?.logoPath,
          record.brandAssets?.sourceUrl,
          record.brandAssets?.checkedAt,
        ),
        record.pageProfileV2 ?? record.normalizedProfileV2,
      ))
      .filter(isCurrentNormalizedProfile);

    if (storedProfiles.length) {
      const storedBySlug = new Map(storedProfiles.map((profile) => [profile.slug, profile]));
      const mergedProfiles = PUBLIC_FIRM_PROFILES.map((profile) => storedBySlug.get(profile.slug) ?? profile);
      const newStoredProfiles = storedProfiles.filter((profile) => !PUBLIC_FIRM_PROFILES.some((fallback) => fallback.slug === profile.slug));
      return sortProfiles([...mergedProfiles, ...newStoredProfiles]);
    }
  } catch {
    // Fail open to the validated snapshot so public pages remain available.
  }

  return PUBLIC_FIRM_PROFILES;
});

export const getPublicFirmProfile = cache(async (slug: string): Promise<FirmNormalizedProfile | undefined> => {
  const profiles = await getPublicFirmProfiles();
  return profiles.find((profile) => profile.slug === slug);
});
