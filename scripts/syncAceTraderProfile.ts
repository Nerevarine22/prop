import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { cert, getApps, initializeApp, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { ACETRADER_NORMALIZED_PROFILE, ACETRADER_PAGE_PROFILE } from '../src/lib/data/aceTraderProfile';
import type { FirmDatabaseRecord } from '../src/types/database';

type ServiceAccountFile = { project_id: string; client_email: string; private_key: string };

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b));
    return `{${entries.map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item)}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

async function main() {
  const write = process.argv.includes('--write');
  if (!write) {
    process.stdout.write(`AceTrader sync dry run complete.\nPrograms: 4\nSections: ${ACETRADER_PAGE_PROFILE.sections.length}\nAdd --write to update Firestore.\n`);
    return;
  }

  const key = JSON.parse(await readFile(resolve(process.cwd(), 'serviceAccountKey.json'), 'utf8')) as ServiceAccountFile;
  if (key.project_id !== 'prop-24596') throw new Error(`Refusing unexpected Firebase project: ${key.project_id}.`);

  const serviceAccount: ServiceAccount = { projectId: key.project_id, clientEmail: key.client_email, privateKey: key.private_key };
  const app = getApps()[0] ?? initializeApp({ credential: cert(serviceAccount) });
  const database = getFirestore(app);
  database.settings({ ignoreUndefinedProperties: true });

  const reference = database.collection('firmRegistry').doc(ACETRADER_NORMALIZED_PROFILE.id);
  const existing = await reference.get();
  const timestamp = new Date().toISOString();
  const update: Partial<FirmDatabaseRecord> = {
    schemaVersion: 1,
    id: ACETRADER_NORMALIZED_PROFILE.id,
    slug: ACETRADER_NORMALIZED_PROFILE.slug,
    name: ACETRADER_NORMALIZED_PROFILE.name,
    links: {
      officialWebsite: 'https://acetrader.com/',
      x: { handle: '@AceTrader', url: 'https://x.com/AceTrader' },
    },
    brandAssets: {
      logoPath: '/firm-logos/acetrader/logo.png',
      sourceUrl: 'https://acetrader.com/',
      status: 'reported',
      checkedAt: ACETRADER_NORMALIZED_PROFILE.checkedAt,
    },
    researchStatus: 'researched',
    publicationStatus: 'published',
    primaryResearch: {
      methodology: 'primary-sources-only',
      checkedAt: ACETRADER_NORMALIZED_PROFILE.checkedAt,
      observations: ACETRADER_NORMALIZED_PROFILE.claims,
    },
    normalizedProfile: ACETRADER_NORMALIZED_PROFILE,
    normalizedProfileV2: ACETRADER_PAGE_PROFILE,
    pageProfileV2: ACETRADER_PAGE_PROFILE,
    draftPageProfileV2: ACETRADER_PAGE_PROFILE,
    draftUpdatedAt: timestamp,
    publishedAt: timestamp,
    updatedAt: timestamp,
    ...(!existing.exists ? { createdAt: timestamp } : {}),
  };

  const serializedUpdate = JSON.parse(JSON.stringify(update)) as Partial<FirmDatabaseRecord>;
  if (existing.exists) await reference.update(serializedUpdate);
  else await reference.set(serializedUpdate);

  const stored = (await reference.get()).data() as FirmDatabaseRecord | undefined;
  if (!stored) throw new Error('AceTrader record was not found after writing.');
  if (stableStringify(stored.normalizedProfile) !== stableStringify(ACETRADER_NORMALIZED_PROFILE)) {
    throw new Error('Stored AceTrader normalized profile does not match the checked-in source.');
  }
  if (stableStringify(stored.pageProfileV2) !== stableStringify(ACETRADER_PAGE_PROFILE)) {
    throw new Error('Stored AceTrader page profile does not match the checked-in source.');
  }

  process.stdout.write(`AceTrader profile synced and verified.\nProject: ${key.project_id}\nDocument: ${ACETRADER_NORMALIZED_PROFILE.id}\nSections: ${ACETRADER_PAGE_PROFILE.sections.length}\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`AceTrader sync failed: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
