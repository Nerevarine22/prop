import { MOCK_PROP_FIRMS } from './firms';
import { FIRM_DATABASE_SCHEMA_VERSION, type FirmDatabaseRecord, type FirmLinks } from '@/types/database';

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
  { id: 'firm-chainfunded', slug: 'chainfunded', name: 'ChainFunded', website: 'https://chainfunded.io', xHandle: 'Chainfunded_io' },
  { id: 'firm-solanafunded', slug: 'solana-funded', name: 'Solana Funded', website: 'https://solanafunded.com', xHandle: 'solanafunded' },
  { id: 'firm-hypernova', slug: 'hypernova', name: 'Hypernova', website: 'https://hypernova.xyz', xHandle: 'HypernovaX' },
  { id: 'firm-polyquid', slug: 'polyquid', name: 'Polyquid', website: 'https://polyquid.xyz', xHandle: 'Polyquid' },
  { id: 'firm-alphagrid', slug: 'alphagrid', name: 'AlphaGrid', website: 'https://alphagrid.fun', xHandle: 'AlphaGridProp' },
  { id: 'firm-hyperpnl', slug: 'hyperpnl', name: 'HyperPNL', website: 'https://hyperpnl.com', xHandle: 'HyperPNL' },
  { id: 'firm-dizso', slug: 'dizso', name: 'Dizso Funded', website: 'https://dizso.com', xHandle: 'dizsofunded' },
  { id: 'firm-hyrotrader', slug: 'hyrotrader', name: 'HyroTrader', website: 'https://hyrotrader.com', xHandle: 'hyrotrader_com' },
  { id: 'firm-o2', slug: 'o2', name: 'O2', xHandle: 'o2dotapp' },
  { id: 'firm-carrot-funding', slug: 'carrot-funding', name: 'Carrot Funding', xHandle: 'carrotfunding' },
  { id: 'firm-doji-funded', slug: 'doji-funded', name: 'Doji Funded', xHandle: 'Dojifunded' },
  { id: 'firm-hyper-stack', slug: 'hyper-stack', name: 'Hyper Stack', xHandle: 'hyper_stack' },
  { id: 'firm-vanta-trading', slug: 'vanta-trading', name: 'Vanta Trading', xHandle: 'VantaTrading' },
  { id: 'firm-size', slug: 'size', name: 'Size', xHandle: 'sizedotclub' },
  { id: 'firm-breakout', slug: 'breakout', name: 'Breakout', xHandle: 'breakoutprop' },
  { id: 'firm-funded-hive', slug: 'funded-hive', name: 'Funded Hive', xHandle: 'FundedHive' },
  { id: 'firm-klein-funding', slug: 'klein-funding', name: 'Klein Funding', xHandle: 'KleinFunding' },
  { id: 'firm-cf-trader', slug: 'cf-trader', name: 'CFTrader', xHandle: 'CFTradercom' },
  { id: 'firm-upscale-trade', slug: 'upscale-trade', name: 'Upscale Trade', xHandle: 'UpscaleTrade' },
];

function links(website: string | undefined, xHandle: string): FirmLinks {
  return {
    ...(website ? { officialWebsite: website } : {}),
    x: { handle: `@${xHandle}`, url: `https://x.com/${xHandle}` },
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
    profile: proprProfile,
    createdAt: SEED_CREATED_AT,
    updatedAt: proprProfile.lastReviewedAt,
  },
  ...STUB_FIRMS.map((firm): FirmDatabaseRecord => ({
    schemaVersion: FIRM_DATABASE_SCHEMA_VERSION,
    id: firm.id,
    slug: firm.slug,
    name: firm.name,
    links: links(firm.website, firm.xHandle),
    researchStatus: 'stub',
    publicationStatus: 'draft',
    createdAt: SEED_CREATED_AT,
    updatedAt: SEED_CREATED_AT,
  })),
];
