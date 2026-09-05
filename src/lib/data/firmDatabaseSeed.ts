import { MOCK_PROP_FIRMS } from './firms';
import { PRIMARY_RESEARCH_BY_SLUG } from './firmPrimaryResearch';
import { FIRM_NORMALIZED_PROFILES_BY_SLUG } from './firmNormalizedProfiles';
import { getFirmModularProfile } from './firmModularProfiles';
import { trustpilotRatingsForSlug } from './trustpilotRatings';
import { SIZEPROP_NORMALIZED_PROFILE, SIZEPROP_PAGE_PROFILE } from './sizePropProfile';
import { FUNDEX_NORMALIZED_PROFILE, FUNDEX_PAGE_PROFILE } from './fundexProfile';
import { ACETRADER_NORMALIZED_PROFILE, ACETRADER_PAGE_PROFILE } from './aceTraderProfile';
import {
  BREAKOUT_NORMALIZED_PROFILE,
  BREAKOUT_PAGE_PROFILE,
  CHAINFUNDED_NORMALIZED_PROFILE,
  CHAINFUNDED_PAGE_PROFILE,
} from './upgradedFirmProfiles';
import {
  ALPHAGRID_NORMALIZED_PROFILE,
  ALPHAGRID_PAGE_PROFILE,
  CARROT_FUNDING_NORMALIZED_PROFILE,
  CARROT_FUNDING_PAGE_PROFILE,
  DIZSO_NORMALIZED_PROFILE,
  DIZSO_PAGE_PROFILE,
  DOJI_FUNDED_NORMALIZED_PROFILE,
  DOJI_FUNDED_PAGE_PROFILE,
  FOXIFY_NORMALIZED_PROFILE,
  FOXIFY_PAGE_PROFILE,
  FUNDED_HIVE_NORMALIZED_PROFILE,
  FUNDED_HIVE_PAGE_PROFILE,
  HYPERNOVA_NORMALIZED_PROFILE,
  HYPERNOVA_PAGE_PROFILE,
  HYPERPNL_NORMALIZED_PROFILE,
  HYPERPNL_PAGE_PROFILE,
  HYPER_STACK_NORMALIZED_PROFILE,
  HYPER_STACK_PAGE_PROFILE,
  HYROTRADER_NORMALIZED_PROFILE,
  HYROTRADER_PAGE_PROFILE,
  KLEIN_FUNDING_NORMALIZED_PROFILE,
  KLEIN_FUNDING_PAGE_PROFILE,
  O2_NORMALIZED_PROFILE,
  O2_PAGE_PROFILE,
  POLYQUID_NORMALIZED_PROFILE,
  POLYQUID_PAGE_PROFILE,
  SIZE_NORMALIZED_PROFILE,
  SIZE_PAGE_PROFILE,
  SOLANA_FUNDED_NORMALIZED_PROFILE,
  SOLANA_FUNDED_PAGE_PROFILE,
  UPSCALE_TRADE_NORMALIZED_PROFILE,
  UPSCALE_TRADE_PAGE_PROFILE,
  VANTA_TRADING_NORMALIZED_PROFILE,
  VANTA_TRADING_PAGE_PROFILE,
  CF_TRADER_NORMALIZED_PROFILE,
  CF_TRADER_PAGE_PROFILE,
} from './standardizedFirmProfiles';
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

const FIRM_DATABASE_SEED_BASE: FirmDatabaseRecord[] = [
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
  {
    schemaVersion: FIRM_DATABASE_SCHEMA_VERSION,
    id: SIZEPROP_NORMALIZED_PROFILE.id,
    slug: SIZEPROP_NORMALIZED_PROFILE.slug,
    name: SIZEPROP_NORMALIZED_PROFILE.name,
    links: links('https://www.sizeprop.com/', 'SizeProp'),
    brandAssets: {
      logoPath: '/firm-logos/sizeprop/logo.png',
      sourceUrl: 'https://www.sizeprop.com/',
      status: 'reported',
      checkedAt: SIZEPROP_NORMALIZED_PROFILE.checkedAt,
    },
    researchStatus: 'researched',
    publicationStatus: 'published',
    normalizedProfile: SIZEPROP_NORMALIZED_PROFILE,
    normalizedProfileV2: SIZEPROP_PAGE_PROFILE,
    pageProfileV2: SIZEPROP_PAGE_PROFILE,
    draftPageProfileV2: SIZEPROP_PAGE_PROFILE,
    draftUpdatedAt: SIZEPROP_NORMALIZED_PROFILE.checkedAt,
    publishedAt: SIZEPROP_NORMALIZED_PROFILE.checkedAt,
    createdAt: SIZEPROP_NORMALIZED_PROFILE.checkedAt,
    updatedAt: SIZEPROP_NORMALIZED_PROFILE.checkedAt,
  },
  {
    schemaVersion: FIRM_DATABASE_SCHEMA_VERSION,
    id: FUNDEX_NORMALIZED_PROFILE.id,
    slug: FUNDEX_NORMALIZED_PROFILE.slug,
    name: FUNDEX_NORMALIZED_PROFILE.name,
    links: links('https://fundex.gg/', 'Fundex'),
    brandAssets: {
      logoPath: '/firm-logos/fundex/logo.png',
      sourceUrl: 'https://fundex.gg/',
      status: 'reported',
      checkedAt: FUNDEX_NORMALIZED_PROFILE.checkedAt,
    },
    researchStatus: 'researched',
    publicationStatus: 'published',
    normalizedProfile: FUNDEX_NORMALIZED_PROFILE,
    normalizedProfileV2: FUNDEX_PAGE_PROFILE,
    pageProfileV2: FUNDEX_PAGE_PROFILE,
    draftPageProfileV2: FUNDEX_PAGE_PROFILE,
    draftUpdatedAt: FUNDEX_NORMALIZED_PROFILE.checkedAt,
    publishedAt: FUNDEX_NORMALIZED_PROFILE.checkedAt,
    createdAt: FUNDEX_NORMALIZED_PROFILE.checkedAt,
    updatedAt: FUNDEX_NORMALIZED_PROFILE.checkedAt,
  },
  {
    schemaVersion: FIRM_DATABASE_SCHEMA_VERSION,
    id: ACETRADER_NORMALIZED_PROFILE.id,
    slug: ACETRADER_NORMALIZED_PROFILE.slug,
    name: ACETRADER_NORMALIZED_PROFILE.name,
    links: links('https://acetrader.com/', 'AceTrader'),
    brandAssets: {
      logoPath: '/firm-logos/acetrader/logo.png',
      sourceUrl: 'https://acetrader.com/',
      status: 'reported',
      checkedAt: ACETRADER_NORMALIZED_PROFILE.checkedAt,
    },
    researchStatus: 'researched',
    publicationStatus: 'published',
    normalizedProfile: ACETRADER_NORMALIZED_PROFILE,
    normalizedProfileV2: ACETRADER_PAGE_PROFILE,
    pageProfileV2: ACETRADER_PAGE_PROFILE,
    draftPageProfileV2: ACETRADER_PAGE_PROFILE,
    draftUpdatedAt: ACETRADER_NORMALIZED_PROFILE.checkedAt,
    publishedAt: ACETRADER_NORMALIZED_PROFILE.checkedAt,
    createdAt: ACETRADER_NORMALIZED_PROFILE.checkedAt,
    updatedAt: ACETRADER_NORMALIZED_PROFILE.checkedAt,
  },
  ...[
    { profile: BREAKOUT_NORMALIZED_PROFILE, page: BREAKOUT_PAGE_PROFILE, website: 'https://www.breakoutprop.com/', xHandle: 'breakoutprop' },
    { profile: CHAINFUNDED_NORMALIZED_PROFILE, page: CHAINFUNDED_PAGE_PROFILE, website: 'https://www.chainfunded.io/', xHandle: 'chainfunded' },
    { profile: FOXIFY_NORMALIZED_PROFILE, page: FOXIFY_PAGE_PROFILE, website: 'https://www.foxify.trade/', xHandle: 'foxifytrade' },
    { profile: HYPERNOVA_NORMALIZED_PROFILE, page: HYPERNOVA_PAGE_PROFILE, website: 'https://hypernova.xyz/', xHandle: 'HypernovaX' },
    { profile: O2_NORMALIZED_PROFILE, page: O2_PAGE_PROFILE, website: 'https://www.o2.app/', xHandle: 'o2dotapp' },
    { profile: SOLANA_FUNDED_NORMALIZED_PROFILE, page: SOLANA_FUNDED_PAGE_PROFILE, website: 'https://solanafunded.com/', xHandle: 'solanafunded' },
    { profile: VANTA_TRADING_NORMALIZED_PROFILE, page: VANTA_TRADING_PAGE_PROFILE, website: 'https://www.vantatrading.io/', xHandle: 'VantaTrading' },
    { profile: KLEIN_FUNDING_NORMALIZED_PROFILE, page: KLEIN_FUNDING_PAGE_PROFILE, website: 'https://kleinfunding.com/', xHandle: 'KleinFunding' },
    { profile: UPSCALE_TRADE_NORMALIZED_PROFILE, page: UPSCALE_TRADE_PAGE_PROFILE, website: 'https://upscale.trade/', xHandle: 'UpscaleTrade' },
    { profile: SIZE_NORMALIZED_PROFILE, page: SIZE_PAGE_PROFILE, website: 'https://www.size.club/', xHandle: 'sizedotclub' },
    { profile: POLYQUID_NORMALIZED_PROFILE, page: POLYQUID_PAGE_PROFILE, website: 'https://www.polyquid.xyz/', xHandle: 'polyquid' },
    { profile: FUNDED_HIVE_NORMALIZED_PROFILE, page: FUNDED_HIVE_PAGE_PROFILE, website: 'https://fundedhive.com/', xHandle: 'FundedHive' },
    { profile: CF_TRADER_NORMALIZED_PROFILE, page: CF_TRADER_PAGE_PROFILE, website: 'https://cryptofundtrader.com/', xHandle: 'CFTradercom' },
    { profile: ALPHAGRID_NORMALIZED_PROFILE, page: ALPHAGRID_PAGE_PROFILE, website: 'https://alphagrid.capital/', xHandle: 'AlphaGridProp' },
    { profile: HYPERPNL_NORMALIZED_PROFILE, page: HYPERPNL_PAGE_PROFILE, website: 'https://hyperpnl.com/', xHandle: 'HyperPNL' },
    { profile: HYROTRADER_NORMALIZED_PROFILE, page: HYROTRADER_PAGE_PROFILE, website: 'https://www.hyrotrader.com/', xHandle: 'hyrotrader_com' },
    { profile: CARROT_FUNDING_NORMALIZED_PROFILE, page: CARROT_FUNDING_PAGE_PROFILE, website: 'https://carrotfunding.io/', xHandle: 'carrotfunding' },
    { profile: DIZSO_NORMALIZED_PROFILE, page: DIZSO_PAGE_PROFILE, website: 'https://dizso.com/', xHandle: 'dizsofunded' },
    { profile: DOJI_FUNDED_NORMALIZED_PROFILE, page: DOJI_FUNDED_PAGE_PROFILE, website: 'https://app.dojifunded.com/', xHandle: 'Dojifunded' },
    { profile: HYPER_STACK_NORMALIZED_PROFILE, page: HYPER_STACK_PAGE_PROFILE, website: 'https://www.hyperstack.trade/', xHandle: 'hyper_stack' },
  ].map(({ profile, page, website, xHandle }): FirmDatabaseRecord => ({
    schemaVersion: FIRM_DATABASE_SCHEMA_VERSION,
    id: profile.id,
    slug: profile.slug,
    name: profile.name,
    links: links(website, xHandle),
    brandAssets: {
      logoPath: `/firm-logos/${profile.slug}/logo.png`,
      sourceUrl: website,
      status: 'reported',
      checkedAt: profile.checkedAt,
    },
    researchStatus: 'researched',
    publicationStatus: 'published',
    primaryResearch: PRIMARY_RESEARCH_BY_SLUG[profile.slug],
    normalizedProfile: profile,
    normalizedProfileV2: page,
    pageProfileV2: page,
    draftPageProfileV2: page,
    draftUpdatedAt: profile.checkedAt,
    publishedAt: profile.checkedAt,
    createdAt: profile.checkedAt,
    updatedAt: profile.checkedAt,
  })),
  ...STUB_FIRMS.filter((firm) => !['breakout', 'chainfunded', 'foxify', 'hypernova', 'o2', 'solana-funded', 'vanta-trading', 'klein-funding', 'upscale-trade', 'size', 'polyquid', 'funded-hive', 'cf-trader', 'alphagrid', 'hyperpnl', 'hyrotrader', 'carrot-funding', 'dizso', 'doji-funded', 'hyper-stack'].includes(firm.slug)).map((firm): FirmDatabaseRecord => {
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

export const FIRM_DATABASE_SEED: FirmDatabaseRecord[] = FIRM_DATABASE_SEED_BASE.map((record) => ({
  ...record,
  ...(trustpilotRatingsForSlug(record.slug) ? { externalRatings: trustpilotRatingsForSlug(record.slug) } : {}),
}));
