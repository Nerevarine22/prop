import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { cert, getApps, initializeApp, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

type ServiceAccountFile = {
  project_id: string;
  client_email: string;
  private_key: string;
};

async function main() {
  const key = JSON.parse(
    await readFile(resolve(process.cwd(), 'serviceAccountKey.json'), 'utf8'),
  ) as ServiceAccountFile;
  const serviceAccount: ServiceAccount = {
    projectId: key.project_id,
    clientEmail: key.client_email,
    privateKey: key.private_key,
  };
  const app = getApps()[0] ?? initializeApp({ credential: cert(serviceAccount) });
  const snapshot = await getFirestore(app).collection('firmRegistry').get();
  const rows = snapshot.docs
    .map((document) => {
      const data = document.data();
      return {
        id: document.id,
        slug: String(data.slug ?? ''),
        name: String(data.name ?? ''),
        researchStatus: String(data.researchStatus ?? ''),
        publicationStatus: String(data.publicationStatus ?? ''),
        hasModelFirstProfile: data.normalizedProfileV2?.researchStandard === 'model-first-v1',
        researchMode: data.normalizedProfileV2?.researchMode ?? null,
        sections: Array.isArray(data.normalizedProfileV2?.sections)
          ? data.normalizedProfileV2.sections.length
          : 0,
        website: data.links?.officialWebsite ?? null,
        x: data.links?.x?.url ?? null,
      };
    })
    .sort((left, right) => left.name.localeCompare(right.name));

  process.stdout.write(`${JSON.stringify(rows, null, 2)}\n`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown registry audit error';
  process.stderr.write(`Firm registry audit failed: ${message}\n`);
  process.exitCode = 1;
});
