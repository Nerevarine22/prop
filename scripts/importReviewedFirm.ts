import { readFile, readdir } from 'node:fs/promises';
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

async function readReviewedProfile(sourcePath: string): Promise<{ profile: FirmNormalizedProfileV2; record: FirmDatabaseRecord }> {
  const profile = JSON.parse(await readFile(sourcePath, 'utf8')) as FirmNormalizedProfileV2;
  const seed = FIRM_DATABASE_SEED.find((record) => record.slug === profile.slug);
  if (!seed) throw new Error(`No canonical identity seed exists for ${profile.slug}.`);
  if (profile.id !== seed.id || profile.slug !== seed.slug || profile.name !== seed.name) {
    throw new Error(`Reviewed profile identity does not match the canonical firm identity: ${sourcePath}.`);
  }
  if (profile.version !== 2 || profile.researchStandard !== 'model-first-v1' || !profile.sections.length) {
    throw new Error(`Reviewed profile is not a publishable model-first V2 record: ${sourcePath}.`);
  }

  const record: FirmDatabaseRecord = {
    ...seed,
    normalizedProfileV2: profile,
    researchStatus: 'researched',
    publicationStatus: 'published',
    publishedAt: profile.checkedAt,
    updatedAt: profile.checkedAt,
  };
  return { profile, record };
}

async function main() {
  const importAll = process.argv.includes('--all');
  const slug = argument('slug');
  if (!importAll && !slug) throw new Error('Use --slug=<firm-slug> or --all.');

  const reviewedDirectory = resolve(process.cwd(), 'research/reviewed');
  const sourcePaths = importAll
    ? (await readdir(reviewedDirectory))
      .filter((fileName) => fileName.endsWith('.json'))
      .sort()
      .map((fileName) => resolve(reviewedDirectory, fileName))
    : [resolve(process.cwd(), argument('file') ?? `research/reviewed/${slug}.json`)];
  const imports = await Promise.all(sourcePaths.map(readReviewedProfile));
  if (importAll) {
    const importedSlugs = new Set(imports.map((item) => item.profile.slug));
    for (const seed of FIRM_DATABASE_SEED) {
      if (!seed.normalizedProfileV2 || importedSlugs.has(seed.slug)) continue;
      imports.push({
        profile: seed.normalizedProfileV2,
        record: {
          ...seed,
          publicationStatus: 'published',
          publishedAt: seed.normalizedProfileV2.checkedAt,
          updatedAt: seed.normalizedProfileV2.checkedAt,
        },
      });
    }
    imports.sort((a, b) => a.profile.slug.localeCompare(b.profile.slug));
  }

  if (!process.argv.includes('--write')) {
    process.stdout.write(`Reviewed firm import dry run complete.\nFirms: ${imports.length}\nSections: ${imports.reduce((total, item) => total + item.profile.sections.length, 0)}\nNo Firestore writes performed.\n`);
    return;
  }

  const keyPath = resolve(process.cwd(), 'serviceAccountKey.json');
  const key = JSON.parse(await readFile(keyPath, 'utf8')) as ServiceAccountFile;
  if (key.project_id !== 'prop-24596') throw new Error(`Refusing unexpected Firebase project: ${key.project_id}.`);
  const serviceAccount: ServiceAccount = { projectId: key.project_id, clientEmail: key.client_email, privateKey: key.private_key };
  const app = getApps()[0] ?? initializeApp({ credential: cert(serviceAccount) });
  const database = getFirestore(app);
  database.settings({ ignoreUndefinedProperties: true });

  const batch = database.batch();
  for (const item of imports) {
    const reference = database.collection('firmRegistry').doc(item.record.id);
    batch.set(reference, JSON.parse(JSON.stringify(item.record)) as FirmDatabaseRecord, { merge: true });
  }
  await batch.commit();

  for (const item of imports) {
    const reference = database.collection('firmRegistry').doc(item.record.id);
    const stored = (await reference.get()).data() as FirmDatabaseRecord | undefined;
    const normalizedSource = JSON.parse(JSON.stringify(item.profile)) as FirmNormalizedProfileV2;
    if (!stored || stableStringify(stored.normalizedProfileV2) !== stableStringify(normalizedSource)) {
      throw new Error(`Stored reviewed profile does not match the source JSON: ${item.profile.slug}.`);
    }
  }
  process.stdout.write(`Reviewed firms imported and verified.\nProject: ${key.project_id}\nFirms: ${imports.length}\nSections: ${imports.reduce((total, item) => total + item.profile.sections.length, 0)}\n`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown reviewed profile import error';
  process.stderr.write(`Reviewed firm import failed: ${message}\n`);
  process.exitCode = 1;
});
