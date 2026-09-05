import { FIRM_NORMALIZED_PROFILES_BY_SLUG } from './firmNormalizedProfiles';
import { attachFirmModularProfile } from './firmModularProfiles';
import { SIZEPROP_NORMALIZED_PROFILE } from './sizePropProfile';
import { FUNDEX_NORMALIZED_PROFILE } from './fundexProfile';
import { ACETRADER_NORMALIZED_PROFILE } from './aceTraderProfile';
import { BREAKOUT_NORMALIZED_PROFILE, CHAINFUNDED_NORMALIZED_PROFILE } from './upgradedFirmProfiles';
import {
  FOXIFY_NORMALIZED_PROFILE,
  FUNDED_HIVE_NORMALIZED_PROFILE,
  ALPHAGRID_NORMALIZED_PROFILE,
  CARROT_FUNDING_NORMALIZED_PROFILE,
  DIZSO_NORMALIZED_PROFILE,
  DOJI_FUNDED_NORMALIZED_PROFILE,
  HYPERNOVA_NORMALIZED_PROFILE,
  HYPERPNL_NORMALIZED_PROFILE,
  HYROTRADER_NORMALIZED_PROFILE,
  HYPER_STACK_NORMALIZED_PROFILE,
  KLEIN_FUNDING_NORMALIZED_PROFILE,
  O2_NORMALIZED_PROFILE,
  POLYQUID_NORMALIZED_PROFILE,
  SIZE_NORMALIZED_PROFILE,
  SOLANA_FUNDED_NORMALIZED_PROFILE,
  UPSCALE_TRADE_NORMALIZED_PROFILE,
  VANTA_TRADING_NORMALIZED_PROFILE,
  CF_TRADER_NORMALIZED_PROFILE,
} from './standardizedFirmProfiles';
import type {
  FirmNormalizedProfile,
  NormalizedChallengeProgram,
  NormalizedFact,
  PrimaryResearchValueStatus,
} from '@/types/database';

const UPGRADED_SLUGS = new Set(['breakout', 'chainfunded', 'foxify', 'hypernova', 'o2', 'solana-funded', 'vanta-trading', 'klein-funding', 'upscale-trade', 'size', 'polyquid', 'funded-hive', 'cf-trader', 'alphagrid', 'hyperpnl', 'hyrotrader', 'carrot-funding', 'dizso', 'doji-funded', 'hyper-stack']);

export const PUBLIC_FIRM_PROFILES = [
  ...Object.values(FIRM_NORMALIZED_PROFILES_BY_SLUG).filter((profile) => !UPGRADED_SLUGS.has(profile.slug)),
  SIZEPROP_NORMALIZED_PROFILE,
  FUNDEX_NORMALIZED_PROFILE,
  ACETRADER_NORMALIZED_PROFILE,
  BREAKOUT_NORMALIZED_PROFILE,
  CHAINFUNDED_NORMALIZED_PROFILE,
  FOXIFY_NORMALIZED_PROFILE,
  HYPERNOVA_NORMALIZED_PROFILE,
  O2_NORMALIZED_PROFILE,
  SOLANA_FUNDED_NORMALIZED_PROFILE,
  VANTA_TRADING_NORMALIZED_PROFILE,
  KLEIN_FUNDING_NORMALIZED_PROFILE,
  UPSCALE_TRADE_NORMALIZED_PROFILE,
  SIZE_NORMALIZED_PROFILE,
  POLYQUID_NORMALIZED_PROFILE,
  FUNDED_HIVE_NORMALIZED_PROFILE,
  CF_TRADER_NORMALIZED_PROFILE,
  ALPHAGRID_NORMALIZED_PROFILE,
  HYPERPNL_NORMALIZED_PROFILE,
  HYROTRADER_NORMALIZED_PROFILE,
  CARROT_FUNDING_NORMALIZED_PROFILE,
  DIZSO_NORMALIZED_PROFILE,
  DOJI_FUNDED_NORMALIZED_PROFILE,
  HYPER_STACK_NORMALIZED_PROFILE,
].map((profile) => (
  attachFirmModularProfile(profile)
)).sort((a, b) => {
  if (a.slug === 'propr') return -1;
  if (b.slug === 'propr') return 1;
  return a.name.localeCompare(b.name);
});

export function getPublicFirmProfile(slug: string): FirmNormalizedProfile | undefined {
  return PUBLIC_FIRM_PROFILES.find((profile) => profile.slug === slug);
}

export function factValue<T>(fact: NormalizedFact<T>): T | undefined {
  return fact.status === 'reported' || fact.status === 'verified' ? fact.value : undefined;
}

export function factText<T>(
  fact: NormalizedFact<T>,
  formatter: (value: T) => string = (value) => String(value),
): string {
  if (fact.status === 'ND') return 'ND';
  return formatter(fact.value);
}

export function factStatus(fact: NormalizedFact<unknown>): PrimaryResearchValueStatus {
  return fact.status;
}

export function factBooleanText(fact: NormalizedFact<boolean>, trueLabel = 'Yes', falseLabel = 'No'): string {
  const value = factValue(fact);
  return value === undefined ? factText(fact) : value ? trueLabel : falseLabel;
}

export function factArrayText<T>(fact: NormalizedFact<T[]>, formatter: (value: T) => string = String): string {
  const value = factValue(fact);
  return value ? value.map(formatter).join(', ') : factText(fact);
}

export function formatCapital(value: number | undefined): string {
  if (value === undefined) return 'ND';
  if (value >= 1_000_000) return `$${value / 1_000_000}M`;
  if (value >= 1_000) return `$${Number((value / 1_000).toFixed(1))}K`;
  return `$${value.toLocaleString('en-US')}`;
}

export function profilePrograms(profile: FirmNormalizedProfile): NormalizedChallengeProgram[] {
  return factValue(profile.challengePrograms) ?? [];
}

export function firstKnownFee(profile: FirmNormalizedProfile): number | undefined {
  for (const program of profilePrograms(profile)) {
    for (const tier of factValue(program.tiers) ?? []) {
      const fee = factValue(tier.fee);
      if (fee !== undefined) return fee;
    }
  }
  return undefined;
}

export function profileLogo(profile: FirmNormalizedProfile): string {
  const documentedLogo = factValue(profile.identity.logo);
  if (documentedLogo) return documentedLogo;

  const xHandle = factValue(profile.identity.xHandle)?.replace(/^@/, '');
  return xHandle ? `https://unavatar.io/x/${encodeURIComponent(xHandle)}` : '';
}

export function profileWebsite(profile: FirmNormalizedProfile): string | undefined {
  return factValue(profile.identity.officialWebsite);
}

export function profileHasRewards(profile: FirmNormalizedProfile): boolean {
  return [profile.tokenRewards.hasToken, profile.tokenRewards.hasPoints, profile.tokenRewards.hasAirdrop]
    .some((fact) => factValue(fact) === true);
}

export function profileRewardLabels(profile: FirmNormalizedProfile): string[] {
  const labels: string[] = [];
  if (factValue(profile.tokenRewards.hasToken)) labels.push('Token');
  if (factValue(profile.tokenRewards.hasPoints)) labels.push('Points');
  if (factValue(profile.tokenRewards.hasAirdrop)) labels.push('Airdrop');
  return labels;
}

export function profileSourceCount(profile: FirmNormalizedProfile): number {
  return new Set(profile.claims.map((claim) => claim.sourceUrl)).size;
}

export function shortDate(value: string): string {
  return new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));
}
