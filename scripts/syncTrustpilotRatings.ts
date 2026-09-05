import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { cert, getApps, initializeApp, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { FIRM_DATABASE_SEED } from '../src/lib/data/firmDatabaseSeed';

const EXPECTED_PROJECT_ID = 'prop-24596';

type ServiceAccountFile = {
  project_id: string;
  client_email: string;
  private_key: string;
};

async function main() {
  const records = FIRM_DATABASE_SEED
    .filter((record) => record.externalRatings?.some((rating) => rating.source === 'trustpilot'))
    .map((record) => ({ id: record.id, slug: record.slug, externalRatings: record.externalRatings }));

  if (records.length !== 12) {
    throw new Error(`Expected 12 Trustpilot snapshots, found ${records.length}.`);
  }

  const shouldWrite = process.argv.includes('--write');
  if (!shouldWrite) {
    process.stdout.write(`Trustpilot rating dry run complete.\nProfiles: ${records.length}\n${records.map((record) => record.slug).join(', ')}\nNo Firestore writes performed. Add --write to sync.\n`);
    return;
  }

  const keyPath = resolve(process.cwd(), 'serviceAccountKey.json');
  const key = JSON.parse(await readFile(keyPath, 'utf8')) as ServiceAccountFile;
  if (key.project_id !== EXPECTED_PROJECT_ID) {
    throw new Error(`Refusing to write to unexpected Firebase project: ${key.project_id}.`);
  }

  const serviceAccount: ServiceAccount = {
    projectId: key.project_id,
    clientEmail: key.client_email,
    privateKey: key.private_key,
  };
  const app = getApps()[0] ?? initializeApp({ credential: cert(serviceAccount) });
  const database = getFirestore(app);
  database.settings({ ignoreUndefinedProperties: true });

  const batch = database.batch();
  for (const record of records) {
    batch.set(database.collection('firmRegistry').doc(record.id), { externalRatings: record.externalRatings }, { merge: true });
  }
  await batch.commit();

  const snapshots = await Promise.all(records.map((record) => database.collection('firmRegistry').doc(record.id).get()));
  const verified = snapshots.filter((snapshot) => {
    const ratings = snapshot.data()?.externalRatings;
    return Array.isArray(ratings) && ratings.some((rating) => rating.source === 'trustpilot');
  });
  if (verified.length !== records.length) {
    throw new Error(`Firestore verification failed: ${verified.length}/${records.length} ratings found.`);
  }

  process.stdout.write(`Firestore Trustpilot sync complete.\nProfiles: ${verified.length}\n`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown Trustpilot sync error';
  process.stderr.write(`Trustpilot sync failed: ${message}\n`);
  process.exitCode = 1;
});
