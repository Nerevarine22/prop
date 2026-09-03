import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { cert, getApps, initializeApp, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { FUNDEX_NORMALIZED_PROFILE, FUNDEX_PAGE_PROFILE } from '../src/lib/data/fundexProfile';
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
    process.stdout.write(`Fundex sync dry run complete.\nPrograms: 1\nSections: ${FUNDEX_PAGE_PROFILE.sections.length}\nAdd --write to update Firestore.\n`);
    return;
  }

  const key = JSON.parse(await readFile(resolve(process.cwd(), 'serviceAccountKey.json'), 'utf8')) as ServiceAccountFile;
  if (key.project_id !== 'prop-24596') throw new Error(`Refusing unexpected Firebase project: ${key.project_id}.`);

  const serviceAccount: ServiceAccount = {
    projectId: key.project_id,
    clientEmail: key.client_email,
    privateKey: key.private_key,
  };
  const app = getApps()[0] ?? initializeApp({ credential: cert(serviceAccount) });
  const database = getFirestore(app);
  database.settings({ ignoreUndefinedProperties: true });

  const reference = database.collection('firmRegistry').doc(FUNDEX_NORMALIZED_PROFILE.id);
  const existing = await reference.get();
  const timestamp = new Date().toISOString();
  const update: Partial<FirmDatabaseRecord> = {
    schemaVersion: 1,
    id: FUNDEX_NORMALIZED_PROFILE.id,
    slug: FUNDEX_NORMALIZED_PROFILE.slug,
    name: FUNDEX_NORMALIZED_PROFILE.name,
    links: {
      officialWebsite: 'https://fundex.gg/',
      x: { handle: '@Fundex', url: 'https://x.com/Fundex' },
    },
    brandAssets: {
      logoPath: '/firm-logos/fundex/logo.png',
      sourceUrl: 'https://fundex.gg/',
      status: 'reported',
      checkedAt: FUNDEX_NORMALIZED_PROFILE.checkedAt,
    },
    researchStatus: 'researched',
    publicationStatus: 'published',
    primaryResearch: {
      methodology: 'primary-sources-only',
      checkedAt: FUNDEX_NORMALIZED_PROFILE.checkedAt,
      observations: FUNDEX_NORMALIZED_PROFILE.claims,
    },
    normalizedProfile: FUNDEX_NORMALIZED_PROFILE,
    normalizedProfileV2: FUNDEX_PAGE_PROFILE,
    pageProfileV2: FUNDEX_PAGE_PROFILE,
    draftPageProfileV2: FUNDEX_PAGE_PROFILE,
    draftUpdatedAt: timestamp,
    publishedAt: timestamp,
    updatedAt: timestamp,
    ...(!existing.exists ? { createdAt: timestamp } : {}),
  };

  const serializedUpdate = JSON.parse(JSON.stringify(update)) as Partial<FirmDatabaseRecord>;
  if (existing.exists) await reference.update(serializedUpdate);
  else await reference.set(serializedUpdate);
  const stored = (await reference.get()).data() as FirmDatabaseRecord | undefined;
  if (!stored) throw new Error('Fundex record was not found after writing.');
  if (stableStringify(stored.normalizedProfile) !== stableStringify(FUNDEX_NORMALIZED_PROFILE)) {
    throw new Error('Stored Fundex normalized profile does not match the checked-in source.');
  }
  if (stableStringify(stored.pageProfileV2) !== stableStringify(FUNDEX_PAGE_PROFILE)) {
    throw new Error('Stored Fundex page profile does not match the checked-in source.');
  }

  process.stdout.write(`Fundex profile synced and verified.\nProject: ${key.project_id}\nDocument: ${FUNDEX_NORMALIZED_PROFILE.id}\nSections: ${FUNDEX_PAGE_PROFILE.sections.length}\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`Fundex sync failed: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
