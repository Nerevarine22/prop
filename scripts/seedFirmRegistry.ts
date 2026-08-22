import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { cert, getApps, initializeApp, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { FIRM_DATABASE_SEED } from '../src/lib/data/firmDatabaseSeed';

type ServiceAccountFile = {
  project_id: string;
  client_email: string;
  private_key: string;
};

function removeUndefined<T>(value: T): T {
  if (Array.isArray(value)) return value.map((item) => removeUndefined(item)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, item]) => item !== undefined)
        .map(([key, item]) => [key, removeUndefined(item)]),
    ) as T;
  }
  return value;
}

async function main() {
  const keyPath = resolve(process.cwd(), 'serviceAccountKey.json');
  const key = JSON.parse(await readFile(keyPath, 'utf8')) as ServiceAccountFile;

  if (!key.project_id || !key.client_email || !key.private_key) {
    throw new Error('serviceAccountKey.json is missing required service-account fields.');
  }

  const serviceAccount: ServiceAccount = {
    projectId: key.project_id,
    clientEmail: key.client_email,
    privateKey: key.private_key,
  };

  const app = getApps()[0] ?? initializeApp({ credential: cert(serviceAccount) });
  const database = getFirestore(app);
  database.settings({ ignoreUndefinedProperties: true });

  const existingSnapshot = await database.collection('firmRegistry').get();
  const existingIds = new Set(existingSnapshot.docs.map((document) => document.id));
  const batch = database.batch();
  for (const record of FIRM_DATABASE_SEED) {
    const reference = database.collection('firmRegistry').doc(record.id);
    if (existingIds.has(record.id)) {
      batch.set(reference, { schemaVersion: record.schemaVersion, id: record.id, slug: record.slug, name: record.name }, { merge: true });
    } else {
      batch.set(reference, removeUndefined(record));
    }
  }
  await batch.commit();

  const snapshot = await database.collection('firmRegistry').get();
  const propr = snapshot.docs.find((document) => document.id === 'firm-propr');
  const stubCount = snapshot.docs.filter((document) => document.data().researchStatus === 'stub').length;

  if (snapshot.size < FIRM_DATABASE_SEED.length) {
    throw new Error(`Verification failed: expected at least ${FIRM_DATABASE_SEED.length} records, found ${snapshot.size}.`);
  }
  if (!propr?.data().profile?.challengePrograms?.length) {
    throw new Error('Verification failed: the Propr research profile is incomplete.');
  }

  process.stdout.write(`Firestore seed complete.\nCollection: firmRegistry\nRecords: ${snapshot.size}\nStubs: ${stubCount}\nPropr programs: ${propr.data().profile.challengePrograms.length}\n`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown seed error';
  process.stderr.write(`Firestore seed failed: ${message}\n`);
  process.exitCode = 1;
});
