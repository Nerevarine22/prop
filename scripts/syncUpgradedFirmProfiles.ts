import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { cert, getApps, initializeApp, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import {
  BREAKOUT_NORMALIZED_PROFILE,
  BREAKOUT_PAGE_PROFILE,
  CHAINFUNDED_NORMALIZED_PROFILE,
  CHAINFUNDED_PAGE_PROFILE,
} from '../src/lib/data/upgradedFirmProfiles';
import {
  FOXIFY_NORMALIZED_PROFILE,
  FOXIFY_PAGE_PROFILE,
  HYPERNOVA_NORMALIZED_PROFILE,
  HYPERNOVA_PAGE_PROFILE,
  O2_NORMALIZED_PROFILE,
  O2_PAGE_PROFILE,
  SOLANA_FUNDED_NORMALIZED_PROFILE,
  SOLANA_FUNDED_PAGE_PROFILE,
  VANTA_TRADING_NORMALIZED_PROFILE,
  VANTA_TRADING_PAGE_PROFILE,
  KLEIN_FUNDING_NORMALIZED_PROFILE,
  KLEIN_FUNDING_PAGE_PROFILE,
  UPSCALE_TRADE_NORMALIZED_PROFILE,
  UPSCALE_TRADE_PAGE_PROFILE,
  SIZE_NORMALIZED_PROFILE,
  SIZE_PAGE_PROFILE,
  POLYQUID_NORMALIZED_PROFILE,
  POLYQUID_PAGE_PROFILE,
  FUNDED_HIVE_NORMALIZED_PROFILE,
  FUNDED_HIVE_PAGE_PROFILE,
  CF_TRADER_NORMALIZED_PROFILE,
  CF_TRADER_PAGE_PROFILE,
} from '../src/lib/data/standardizedFirmProfiles';
import { PRIMARY_RESEARCH_BY_SLUG } from '../src/lib/data/firmPrimaryResearch';
import type { FirmDatabaseRecord, FirmNormalizedProfile, FirmNormalizedProfileV2 } from '../src/types/database';

type ServiceAccountFile = { project_id: string; client_email: string; private_key: string };

const profiles: Array<{ normalized: FirmNormalizedProfile; page: FirmNormalizedProfileV2; website: string; xHandle: string }> = [
  { normalized: BREAKOUT_NORMALIZED_PROFILE, page: BREAKOUT_PAGE_PROFILE, website: 'https://www.breakoutprop.com/', xHandle: 'breakoutprop' },
  { normalized: CHAINFUNDED_NORMALIZED_PROFILE, page: CHAINFUNDED_PAGE_PROFILE, website: 'https://www.chainfunded.io/', xHandle: 'chainfunded' },
  { normalized: FOXIFY_NORMALIZED_PROFILE, page: FOXIFY_PAGE_PROFILE, website: 'https://www.foxify.trade/', xHandle: 'foxifytrade' },
  { normalized: HYPERNOVA_NORMALIZED_PROFILE, page: HYPERNOVA_PAGE_PROFILE, website: 'https://hypernova.xyz/', xHandle: 'HypernovaX' },
  { normalized: O2_NORMALIZED_PROFILE, page: O2_PAGE_PROFILE, website: 'https://www.o2.app/', xHandle: 'o2dotapp' },
  { normalized: SOLANA_FUNDED_NORMALIZED_PROFILE, page: SOLANA_FUNDED_PAGE_PROFILE, website: 'https://solanafunded.com/', xHandle: 'solanafunded' },
  { normalized: VANTA_TRADING_NORMALIZED_PROFILE, page: VANTA_TRADING_PAGE_PROFILE, website: 'https://www.vantatrading.io/', xHandle: 'VantaTrading' },
  { normalized: KLEIN_FUNDING_NORMALIZED_PROFILE, page: KLEIN_FUNDING_PAGE_PROFILE, website: 'https://kleinfunding.com/', xHandle: 'KleinFunding' },
  { normalized: UPSCALE_TRADE_NORMALIZED_PROFILE, page: UPSCALE_TRADE_PAGE_PROFILE, website: 'https://upscale.trade/', xHandle: 'UpscaleTrade' },
  { normalized: SIZE_NORMALIZED_PROFILE, page: SIZE_PAGE_PROFILE, website: 'https://www.size.club/', xHandle: 'sizedotclub' },
  { normalized: POLYQUID_NORMALIZED_PROFILE, page: POLYQUID_PAGE_PROFILE, website: 'https://www.polyquid.xyz/', xHandle: 'polyquid' },
  { normalized: FUNDED_HIVE_NORMALIZED_PROFILE, page: FUNDED_HIVE_PAGE_PROFILE, website: 'https://fundedhive.com/', xHandle: 'FundedHive' },
  { normalized: CF_TRADER_NORMALIZED_PROFILE, page: CF_TRADER_PAGE_PROFILE, website: 'https://cryptofundtrader.com/', xHandle: 'CFTradercom' },
];

async function main() {
  const write = process.argv.includes('--write');
  if (!write) {
    process.stdout.write(`Upgraded profile sync dry run complete.\nFirms: ${profiles.map(({ normalized }) => normalized.name).join(', ')}\nAdd --write to update Firestore.\n`);
    return;
  }

  const key = JSON.parse(await readFile(resolve(process.cwd(), 'serviceAccountKey.json'), 'utf8')) as ServiceAccountFile;
  if (key.project_id !== 'prop-24596') throw new Error(`Refusing unexpected Firebase project: ${key.project_id}.`);
  const serviceAccount: ServiceAccount = { projectId: key.project_id, clientEmail: key.client_email, privateKey: key.private_key };
  const app = getApps()[0] ?? initializeApp({ credential: cert(serviceAccount) });
  const database = getFirestore(app);
  database.settings({ ignoreUndefinedProperties: true });

  for (const { normalized, page, website, xHandle } of profiles) {
    const reference = database.collection('firmRegistry').doc(normalized.id);
    const existing = await reference.get();
    const timestamp = new Date().toISOString();
    const update: Partial<FirmDatabaseRecord> = {
      schemaVersion: 1,
      id: normalized.id,
      slug: normalized.slug,
      name: normalized.name,
      links: { officialWebsite: website, x: { handle: `@${xHandle}`, url: `https://x.com/${xHandle}` } },
      brandAssets: { logoPath: `/firm-logos/${normalized.slug}/logo.png`, sourceUrl: website, status: 'reported', checkedAt: normalized.checkedAt },
      researchStatus: 'researched',
      publicationStatus: 'published',
      primaryResearch: PRIMARY_RESEARCH_BY_SLUG[normalized.slug],
      normalizedProfile: normalized,
      normalizedProfileV2: page,
      pageProfileV2: page,
      draftPageProfileV2: page,
      draftUpdatedAt: timestamp,
      publishedAt: timestamp,
      updatedAt: timestamp,
      ...(!existing.exists ? { createdAt: timestamp } : {}),
    };
    await reference.set(JSON.parse(JSON.stringify(update)) as Partial<FirmDatabaseRecord>, { merge: true });
    const stored = (await reference.get()).data() as FirmDatabaseRecord | undefined;
    if (!stored?.pageProfileV2 || stored.pageProfileV2.slug !== normalized.slug) throw new Error(`Verification failed for ${normalized.slug}.`);
    process.stdout.write(`Synced ${normalized.name}: ${page.sections.length} sections.\n`);
  }
}

main().catch((error: unknown) => {
  process.stderr.write(`Profile sync failed: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
