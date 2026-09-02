import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { cert, getApps, initializeApp, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { SIZEPROP_NORMALIZED_PROFILE, SIZEPROP_PAGE_PROFILE } from '../src/lib/data/sizePropProfile';
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

function firstDifference(actual: unknown, expected: unknown, path = 'record'): string | undefined {
  if (Object.is(actual, expected)) return undefined;
  if (Array.isArray(actual) || Array.isArray(expected)) {
    if (!Array.isArray(actual) || !Array.isArray(expected)) return `${path}: array/type mismatch`;
    if (actual.length !== expected.length) return `${path}: array length ${actual.length} !== ${expected.length}`;
    for (let index = 0; index < actual.length; index += 1) {
      const difference = firstDifference(actual[index], expected[index], `${path}[${index}]`);
      if (difference) return difference;
    }
    return undefined;
  }
  if (actual && expected && typeof actual === 'object' && typeof expected === 'object') {
    const actualRecord = actual as Record<string, unknown>;
    const expectedRecord = expected as Record<string, unknown>;
    const keys = [...new Set([...Object.keys(actualRecord), ...Object.keys(expectedRecord)])].sort();
    for (const key of keys) {
      if (!(key in actualRecord)) return `${path}.${key}: missing from stored value`;
      if (!(key in expectedRecord)) return `${path}.${key}: unexpected stored field`;
      const difference = firstDifference(actualRecord[key], expectedRecord[key], `${path}.${key}`);
      if (difference) return difference;
    }
    return undefined;
  }
  return `${path}: ${JSON.stringify(actual)} !== ${JSON.stringify(expected)}`;
}

async function main() {
  const write = process.argv.includes('--write');
  if (!write) {
    process.stdout.write(`SizeProp sync dry run complete.\nPrograms: 3\nSections: ${SIZEPROP_PAGE_PROFILE.sections.length}\nAdd --write to update Firestore.\n`);
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

  const reference = database.collection('firmRegistry').doc(SIZEPROP_NORMALIZED_PROFILE.id);
  const existing = await reference.get();
  const timestamp = new Date().toISOString();
  const update: Partial<FirmDatabaseRecord> = {
    schemaVersion: 1,
    id: SIZEPROP_NORMALIZED_PROFILE.id,
    slug: SIZEPROP_NORMALIZED_PROFILE.slug,
    name: SIZEPROP_NORMALIZED_PROFILE.name,
    links: {
      officialWebsite: 'https://www.sizeprop.com/',
      x: { handle: '@SizeProp', url: 'https://x.com/SizeProp' },
    },
    brandAssets: {
      logoPath: '/firm-logos/sizeprop/logo.png',
      sourceUrl: 'https://www.sizeprop.com/',
      status: 'reported',
      checkedAt: SIZEPROP_NORMALIZED_PROFILE.checkedAt,
    },
    researchStatus: 'researched',
    publicationStatus: 'published',
    primaryResearch: {
      methodology: 'primary-sources-only',
      checkedAt: SIZEPROP_NORMALIZED_PROFILE.checkedAt,
      observations: SIZEPROP_NORMALIZED_PROFILE.claims,
    },
    normalizedProfile: SIZEPROP_NORMALIZED_PROFILE,
    normalizedProfileV2: SIZEPROP_PAGE_PROFILE,
    pageProfileV2: SIZEPROP_PAGE_PROFILE,
    draftPageProfileV2: SIZEPROP_PAGE_PROFILE,
    draftUpdatedAt: timestamp,
    publishedAt: timestamp,
    updatedAt: timestamp,
    ...(!existing.exists ? { createdAt: timestamp } : {}),
  };

  const serializedUpdate = JSON.parse(JSON.stringify(update)) as Partial<FirmDatabaseRecord>;
  if (existing.exists) await reference.update(serializedUpdate);
  else await reference.set(serializedUpdate);
  const stored = (await reference.get()).data() as FirmDatabaseRecord | undefined;
  if (!stored) throw new Error('SizeProp record was not found after writing.');
  if (stableStringify(stored.normalizedProfile) !== stableStringify(SIZEPROP_NORMALIZED_PROFILE)) {
    throw new Error(`Stored SizeProp normalized profile does not match the checked-in source. ${firstDifference(stored.normalizedProfile, SIZEPROP_NORMALIZED_PROFILE)}`);
  }
  if (stableStringify(stored.pageProfileV2) !== stableStringify(SIZEPROP_PAGE_PROFILE)) {
    throw new Error(`Stored SizeProp page profile does not match the checked-in source. ${firstDifference(stored.pageProfileV2, SIZEPROP_PAGE_PROFILE)}`);
  }

  process.stdout.write(`SizeProp profile synced and verified.\nProject: ${key.project_id}\nDocument: ${SIZEPROP_NORMALIZED_PROFILE.id}\nSections: ${SIZEPROP_PAGE_PROFILE.sections.length}\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`SizeProp sync failed: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
