import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { cert, getApps, initializeApp, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { buildStarterFirmRecord, type CreateFirmRegistryInput } from '../src/lib/services/firmRegistryService';

type ServiceAccountFile = { project_id: string; client_email: string; private_key: string };

function argument(name: string): string | undefined {
  return process.argv.find((value) => value.startsWith(`--${name}=`))?.slice(name.length + 3);
}

async function main() {
  const name = argument('name');
  const slug = argument('slug');
  if (!name || !slug) throw new Error('Use --name=<firm-name> and --slug=<firm-slug>.');

  const input: CreateFirmRegistryInput = {
    name,
    slug,
    officialWebsite: argument('website'),
    xHandle: argument('x'),
    logoPath: argument('logo'),
    sourceUrls: argument('sources')?.split(',').map((url) => url.trim()).filter(Boolean),
  };
  const record = buildStarterFirmRecord(input);
  const publish = process.argv.includes('--publish');
  const write = process.argv.includes('--write');
  const nextRecord = publish ? {
    ...record,
    publicationStatus: 'published' as const,
    pageProfileV2: record.draftPageProfileV2,
    publishedAt: record.updatedAt,
  } : record;

  if (!write) {
    process.stdout.write(`${JSON.stringify(nextRecord, null, 2)}\nStarter firm dry run complete. Add --write to create the Firestore record.\n`);
    return;
  }

  const key = JSON.parse(await readFile(resolve(process.cwd(), 'serviceAccountKey.json'), 'utf8')) as ServiceAccountFile;
  const serviceAccount: ServiceAccount = { projectId: key.project_id, clientEmail: key.client_email, privateKey: key.private_key };
  const app = getApps()[0] ?? initializeApp({ credential: cert(serviceAccount) });
  const database = getFirestore(app);
  database.settings({ ignoreUndefinedProperties: true });
  const reference = database.collection('firmRegistry').doc(nextRecord.id);
  const existing = await reference.get();
  if (existing.exists && !process.argv.includes('--update-existing')) throw new Error(`Firm record already exists: ${nextRecord.id}`);
  if (existing.exists) {
    const current = existing.data() ?? {};
    const draftProfile = current.draftPageProfileV2 ?? nextRecord.draftPageProfileV2;
    const updatedProfile = {
      ...draftProfile,
      id: nextRecord.id,
      slug: nextRecord.slug,
      name: nextRecord.name,
      checkedAt: nextRecord.updatedAt,
      sourcesInspected: nextRecord.normalizedProfileV2?.sourcesInspected ?? [],
    };
    const normalizedProfile = {
      ...(current.normalizedProfile ?? nextRecord.normalizedProfile),
      id: nextRecord.id,
      slug: nextRecord.slug,
      name: nextRecord.name,
      checkedAt: nextRecord.updatedAt,
      identity: nextRecord.normalizedProfile?.identity,
      modularProfile: updatedProfile,
    };
    await reference.set({
      name: nextRecord.name,
      slug: nextRecord.slug,
      links: nextRecord.links,
      brandAssets: nextRecord.brandAssets,
      normalizedProfile,
      normalizedProfileV2: updatedProfile,
      draftPageProfileV2: updatedProfile,
      draftUpdatedAt: nextRecord.updatedAt,
      ...(publish ? { publicationStatus: 'published', pageProfileV2: updatedProfile, publishedAt: nextRecord.updatedAt } : {}),
      updatedAt: nextRecord.updatedAt,
    }, { merge: true });
  } else {
    await reference.set(nextRecord);
  }
  const verified = await reference.get();
  if (!verified.exists || verified.data()?.slug !== nextRecord.slug) throw new Error('Firestore verification failed.');
  process.stdout.write(`Starter firm created.\nID: ${nextRecord.id}\nSlug: ${nextRecord.slug}\nPublished: ${publish}\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`Starter firm creation failed: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
