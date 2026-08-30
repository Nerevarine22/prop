import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { cert, getApps, initializeApp, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { FIRM_DATABASE_SEED } from '../src/lib/data/firmDatabaseSeed';
import type { FirmDatabaseRecord, FirmNormalizedProfileV2 } from '../src/types/database';

type ServiceAccountFile = {
  project_id: string;
  client_email: string;
  private_key: string;
};

function argument(name: string): string | undefined {
  return process.argv.find((value) => value.startsWith(`--${name}=`))?.slice(name.length + 3);
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b));
    return `{${entries.map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item)}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

async function main() {
  const slug = argument('slug');
  if (!slug) throw new Error('Use --slug=<firm-slug>.');

  const sourcePath = resolve(process.cwd(), argument('file') ?? `research/reviewed/${slug}.json`);
  const profile = JSON.parse(await readFile(sourcePath, 'utf8')) as FirmNormalizedProfileV2;
  const seed = FIRM_DATABASE_SEED.find((record) => record.slug === slug);
  if (!seed) throw new Error(`No canonical identity seed exists for ${slug}.`);
  if (profile.id !== seed.id || profile.slug !== seed.slug || profile.name !== seed.name) {
    throw new Error('Reviewed profile identity does not match the canonical firm identity.');
  }
  if (profile.version !== 2 || profile.researchStandard !== 'model-first-v1' || !profile.sections.length) {
    throw new Error('Reviewed profile is not a publishable model-first V2 record.');
  }

  const record: FirmDatabaseRecord = {
    ...seed,
    normalizedProfileV2: profile,
    researchStatus: 'researched',
    publicationStatus: 'published',
    publishedAt: profile.checkedAt,
    updatedAt: profile.checkedAt,
  };

  if (!process.argv.includes('--write')) {
    process.stdout.write(`Reviewed firm import dry run complete.\nFirm: ${slug}\nSections: ${profile.sections.length}\nNo Firestore writes performed.\n`);
    return;
  }

  const keyPath = resolve(process.cwd(), 'serviceAccountKey.json');
  const key = JSON.parse(await readFile(keyPath, 'utf8')) as ServiceAccountFile;
  if (key.project_id !== 'prop-24596') throw new Error(`Refusing unexpected Firebase project: ${key.project_id}.`);
  const serviceAccount: ServiceAccount = { projectId: key.project_id, clientEmail: key.client_email, privateKey: key.private_key };
  const app = getApps()[0] ?? initializeApp({ credential: cert(serviceAccount) });
  const database = getFirestore(app);
  database.settings({ ignoreUndefinedProperties: true });

  const reference = database.collection('firmRegistry').doc(record.id);
  await reference.set(JSON.parse(JSON.stringify(record)) as FirmDatabaseRecord);

  const stored = (await reference.get()).data() as FirmDatabaseRecord | undefined;
  if (!stored || stableStringify(stored.normalizedProfileV2) !== stableStringify(profile)) {
    throw new Error('Stored reviewed profile does not match the source JSON.');
  }
  process.stdout.write(`Reviewed firm imported and verified.\nProject: ${key.project_id}\nDocument: firmRegistry/${record.id}\nSections: ${profile.sections.length}\n`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown reviewed profile import error';
  process.stderr.write(`Reviewed firm import failed: ${message}\n`);
  process.exitCode = 1;
});
