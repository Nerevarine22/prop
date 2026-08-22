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

async function main() {
  const profiles = FIRM_DATABASE_SEED.map((record) => ({ id: record.id, profile: record.normalizedProfileV2 }))
    .filter((entry): entry is { id: string; profile: NonNullable<typeof entry.profile> } => Boolean(entry.profile));

  if (profiles.length !== FIRM_DATABASE_SEED.length) {
    throw new Error(`V2 generation is incomplete: ${profiles.length}/${FIRM_DATABASE_SEED.length} profiles.`);
  }

  for (const { id, profile } of profiles) {
    if (!profile.sections.length || !profile.comparison || !profile.modelTypes.length) {
      throw new Error(`Invalid modular profile: ${id}.`);
    }
  }

  const shouldWrite = process.argv.includes('--write');
  if (!shouldWrite) {
    process.stdout.write(`Modular profile dry run complete.\nProfiles: ${profiles.length}\nNo Firestore writes performed. Add --write to migrate.\n`);
    return;
  }

  const keyPath = resolve(process.cwd(), 'serviceAccountKey.json');
  const key = JSON.parse(await readFile(keyPath, 'utf8')) as ServiceAccountFile;
  const serviceAccount: ServiceAccount = {
    projectId: key.project_id,
    clientEmail: key.client_email,
    privateKey: key.private_key,
  };
  const app = getApps()[0] ?? initializeApp({ credential: cert(serviceAccount) });
  const database = getFirestore(app);
  database.settings({ ignoreUndefinedProperties: true });

  const batch = database.batch();
  for (const { id, profile } of profiles) {
    batch.set(database.collection('firmRegistry').doc(id), { normalizedProfileV2: profile }, { merge: true });
  }
  await batch.commit();

  const snapshot = await database.collection('firmRegistry').get();
  const migrated = snapshot.docs.filter((document) => {
    const profile = document.data().normalizedProfileV2;
    return profile?.version === 2 && Array.isArray(profile.sections) && profile.sections.length > 0;
  });
  if (migrated.length !== profiles.length) {
    throw new Error(`Firestore verification failed: ${migrated.length}/${profiles.length} V2 profiles found.`);
  }
  process.stdout.write(`Firestore modular migration complete.\nProfiles: ${migrated.length}\n`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown modular migration error';
  process.stderr.write(`Modular migration failed: ${message}\n`);
  process.exitCode = 1;
});
