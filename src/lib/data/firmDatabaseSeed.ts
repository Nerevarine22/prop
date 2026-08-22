import { MOCK_PROP_FIRMS } from './firms';
import { PRIMARY_RESEARCH_BY_SLUG } from './firmPrimaryResearch';
import { FIRM_NORMALIZED_PROFILES_BY_SLUG } from './firmNormalizedProfiles';
import { getFirmModularProfile } from './firmModularProfiles';
import { FIRM_DATABASE_SCHEMA_VERSION, type FirmBrandAssets, type FirmDatabaseRecord, type FirmLinks } from '@/types/database';

const SEED_CREATED_AT = '2026-08-15T00:00:00.000Z';
const proprProfile = MOCK_PROP_FIRMS.find((firm) => firm.slug === 'propr');

if (!proprProfile) {
  throw new Error('The Propr research profile is required to build the firm database seed.');
}

type StubSeed = {
  id: string;
  slug: string;
  name: string;
  website?: string;
  xHandle: string;
};

const STUB_FIRMS: StubSeed[] = [
  { id: 'firm-foxify', slug: 'foxify', name: 'Foxify Trade', website: 'https://foxify.trade', xHandle: 'foxifytrade' },
  { id: 'firm-chainfunded', slug: 'chainfunded', name: 'ChainFunded', website: 'https://www.chainfunded.io', xHandle: 'chainfunded' },
  { id: 'firm-solanafunded', slug: 'solana-funded', name: 'Solana Funded', website: 'https://solanafunded.com', xHandle: 'solanafunded' },
  { id: 'firm-hypernova', slug: 'hypernova', name: 'Hypernova', website: 'https://hypernova.xyz', xHandle: 'HypernovaX' },
  { id: 'firm-polyquid', slug: 'polyquid', name: 'Polyquid', website: 'https://www.polyquid.xyz', xHandle: 'polyquid' },
  { id: 'firm-alphagrid', slug: 'alphagrid', name: 'AlphaGrid', website: 'https://alphagrid.capital', xHandle: 'AlphaGridProp' },
  { id: 'firm-hyperpnl', slug: 'hyperpnl', name: 'HyperPNL', website: 'https://hyperpnl.com', xHandle: 'HyperPNL' },
  { id: 'firm-dizso', slug: 'dizso', name: 'Dizso Funded', website: 'https://dizso.com', xHandle: 'dizsofunded' },
  { id: 'firm-hyrotrader', slug: 'hyrotrader', name: 'HyroTrader', website: 'https://hyrotrader.com', xHandle: 'hyrotrader_com' },
  { id: 'firm-o2', slug: 'o2', name: 'O2', website: 'https://o2.app', xHandle: 'o2dotapp' },
  { id: 'firm-carrot-funding', slug: 'carrot-funding', name: 'Carrot Funding', website: 'https://carrotfunding.io', xHandle: 'carrotfunding' },
  { id: 'firm-doji-funded', slug: 'doji-funded', name: 'Doji Funded', website: 'https://app.dojifunded.com', xHandle: 'Dojifunded' },
  { id: 'firm-hyper-stack', slug: 'hyper-stack', name: 'Hyper Stack', website: 'https://www.hyperstack.trade', xHandle: 'hyper_stack' },
  { id: 'firm-vanta-trading', slug: 'vanta-trading', name: 'Vanta Trading', website: 'https://www.vantatrading.io', xHandle: 'VantaTrading' },
  { id: 'firm-size', slug: 'size', name: 'Size', website: 'https://www.size.club', xHandle: 'sizedotclub' },
  { id: 'firm-breakout', slug: 'breakout', name: 'Breakout', website: 'https://www.breakoutprop.com', xHandle: 'breakoutprop' },
  { id: 'firm-funded-hive', slug: 'funded-hive', name: 'Funded Hive', website: 'https://fundedhive.com', xHandle: 'FundedHive' },
  { id: 'firm-klein-funding', slug: 'klein-funding', name: 'Klein Funding', website: 'https://kleinfunding.com', xHandle: 'KleinFunding' },
  { id: 'firm-cf-trader', slug: 'cf-trader', name: 'Crypto Fund Trader', website: 'https://cryptofundtrader.com', xHandle: 'CFTradercom' },
  { id: 'firm-upscale-trade', slug: 'upscale-trade', name: 'Upscale Trade', website: 'https://upscale.trade', xHandle: 'UpscaleTrade' },
];

function links(website: string | undefined, xHandle: string): FirmLinks {
  return {
    ...(website ? { officialWebsite: website } : {}),
    x: { handle: `@${xHandle}`, url: `https://x.com/${xHandle}` },
  };
}

function brandAssets(slug: string, xHandle: string): FirmBrandAssets {
  return {
    logoPath: `/firm-logos/${slug}/logo.png`,
    sourceUrl: `https://x.com/${xHandle}`,
    status: 'verified',
    checkedAt: PRIMARY_RESEARCH_BY_SLUG[slug].checkedAt,
  };
}

export const FIRM_DATABASE_SEED: FirmDatabaseRecord[] = [
  {
    schemaVersion: FIRM_DATABASE_SCHEMA_VERSION,
    id: proprProfile.id,
    slug: proprProfile.slug,
    name: proprProfile.name,
    links: links(proprProfile.website, 'ProprXYZ'),
    researchStatus: 'researched',
    publicationStatus: 'published',
    primaryResearch: PRIMARY_RESEARCH_BY_SLUG[proprProfile.slug],
    normalizedProfile: FIRM_NORMALIZED_PROFILES_BY_SLUG[proprProfile.slug],
    normalizedProfileV2: getFirmModularProfile(FIRM_NORMALIZED_PROFILES_BY_SLUG[proprProfile.slug]),
    profile: proprProfile,
    createdAt: SEED_CREATED_AT,
    updatedAt: proprProfile.lastReviewedAt,
  },
  ...STUB_FIRMS.map((firm): FirmDatabaseRecord => {
    const normalizedProfile = FIRM_NORMALIZED_PROFILES_BY_SLUG[firm.slug];
    const normalizedProfileV2 = getFirmModularProfile(normalizedProfile);
    return {
      schemaVersion: FIRM_DATABASE_SCHEMA_VERSION,
      id: firm.id,
      slug: firm.slug,
      name: firm.name,
      links: links(firm.website, firm.xHandle),
      brandAssets: brandAssets(firm.slug, firm.xHandle),
      researchStatus: 'researched',
      publicationStatus: 'draft',
      primaryResearch: PRIMARY_RESEARCH_BY_SLUG[firm.slug],
      normalizedProfile,
      ...(normalizedProfileV2 ? { normalizedProfileV2 } : {}),
      createdAt: SEED_CREATED_AT,
      updatedAt: PRIMARY_RESEARCH_BY_SLUG[firm.slug]?.checkedAt ?? SEED_CREATED_AT,
    };
  }),
];
