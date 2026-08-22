import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { PRIMARY_RESEARCH_BY_SLUG } from '../src/lib/data/firmPrimaryResearch.ts';

const REQUIRED_PROJECT_ID = 'prop-24596';
const projectFlagIndex = process.argv.indexOf('--project');
const projectId = projectFlagIndex >= 0 ? process.argv[projectFlagIndex + 1] : undefined;
const slugsFlagIndex = process.argv.indexOf('--slugs');
const requestedSlugs = slugsFlagIndex >= 0
  ? process.argv[slugsFlagIndex + 1]?.split(',').map((slug) => slug.trim()).filter(Boolean)
  : [];
const dryRun = process.argv.includes('--dry-run');

if (projectId !== REQUIRED_PROJECT_ID) {
  throw new Error(`Refusing to run. Pass --project ${REQUIRED_PROJECT_ID}.`);
}

if (!requestedSlugs.length) {
  throw new Error('Refusing to run without an explicit comma-separated --slugs list.');
}

const firebaseCredentialPath = path.join(os.homedir(), '.config', 'configstore', 'firebase-tools.json');
const firebaseCredential = JSON.parse(fs.readFileSync(firebaseCredentialPath, 'utf8'));
const accessToken = firebaseCredential?.tokens?.access_token;
const expiresAt = Number(firebaseCredential?.tokens?.expires_at ?? 0);

if (!accessToken || expiresAt <= Date.now()) {
  throw new Error('Firebase CLI access token is unavailable or expired. Run `firebase projects:list` and retry.');
}

const documentIdsBySlug = {
  propr: 'firm-propr',
  foxify: 'firm-foxify',
  chainfunded: 'firm-chainfunded',
  'solana-funded': 'firm-solanafunded',
  hypernova: 'firm-hypernova',
  polyquid: 'firm-polyquid',
  alphagrid: 'firm-alphagrid',
  hyperpnl: 'firm-hyperpnl',
  dizso: 'firm-dizso',
  hyrotrader: 'firm-hyrotrader',
  o2: 'firm-o2',
  'carrot-funding': 'firm-carrot-funding',
  'doji-funded': 'firm-doji-funded',
  'hyper-stack': 'firm-hyper-stack',
  'vanta-trading': 'firm-vanta-trading',
  size: 'firm-size',
  breakout: 'firm-breakout',
  'funded-hive': 'firm-funded-hive',
  'klein-funding': 'firm-klein-funding',
  'cf-trader': 'firm-cf-trader',
  'upscale-trade': 'firm-upscale-trade',
};

const unknownSlugs = requestedSlugs.filter((slug) => !documentIdsBySlug[slug]);
if (unknownSlugs.length) {
  throw new Error(`Unknown research slugs: ${unknownSlugs.join(', ')}`);
}

const duplicateSlugs = requestedSlugs.filter((slug, index) => requestedSlugs.indexOf(slug) !== index);
if (duplicateSlugs.length) {
  throw new Error(`Duplicate research slugs: ${[...new Set(duplicateSlugs)].join(', ')}`);
}

const targetEntries = requestedSlugs.map((slug) => [slug, PRIMARY_RESEARCH_BY_SLUG[slug]]);
const missingResearch = targetEntries.filter(([, primaryResearch]) => !primaryResearch).map(([slug]) => slug);
if (missingResearch.length) {
  throw new Error(`Missing local primary research: ${missingResearch.join(', ')}`);
}

const linkPatchesBySlug = {
  chainfunded: {
    officialWebsite: 'https://www.chainfunded.io',
    x: { handle: 'chainfunded', url: 'https://x.com/chainfunded' },
  },
  polyquid: {
    officialWebsite: 'https://www.polyquid.xyz',
    x: { handle: 'polyquid', url: 'https://x.com/polyquid' },
  },
};

function firestoreValue(value) {
  if (value === null) return { nullValue: null };
  if (typeof value === 'string') return { stringValue: value };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (typeof value === 'number') {
    return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  }
  if (Array.isArray(value)) return { arrayValue: { values: value.map(firestoreValue) } };
  if (typeof value === 'object') {
    return {
      mapValue: {
        fields: Object.fromEntries(
          Object.entries(value)
            .filter(([, item]) => item !== undefined)
            .map(([key, item]) => [key, firestoreValue(item)]),
        ),
      },
    };
  }
  throw new Error(`Unsupported Firestore value type: ${typeof value}`);
}

const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
const registryResponse = await fetch(`${baseUrl}/firmRegistry?pageSize=100`, { headers });

if (!registryResponse.ok) {
  throw new Error(`Could not read firmRegistry: HTTP ${registryResponse.status}.`);
}

const registryPayload = await registryResponse.json();
const existingIds = new Set(
  (registryPayload.documents ?? []).map((document) => document.name.split('/').at(-1)),
);
const targetIds = requestedSlugs.map((slug) => documentIdsBySlug[slug]);
const missingIds = targetIds.filter((id) => !existingIds.has(id));

if (missingIds.length) {
  throw new Error(`Refusing partial creation; firmRegistry is missing: ${missingIds.join(', ')}`);
}

if (dryRun) {
  console.log(JSON.stringify({ projectId, existingRecords: existingIds.size, slugs: requestedSlugs, updatesPlanned: targetIds.length }, null, 2));
  process.exit(0);
}

for (const [slug, primaryResearch] of targetEntries) {
  const documentId = documentIdsBySlug[slug];
  if (!documentId) throw new Error(`No document id mapping for ${slug}.`);

  const query = new URLSearchParams();
  query.append('updateMask.fieldPaths', 'primaryResearch');
  query.append('updateMask.fieldPaths', 'updatedAt');
  const linkPatch = linkPatchesBySlug[slug];
  if (linkPatch) {
    query.append('updateMask.fieldPaths', 'links.officialWebsite');
    query.append('updateMask.fieldPaths', 'links.x.handle');
    query.append('updateMask.fieldPaths', 'links.x.url');
  }
  const response = await fetch(`${baseUrl}/firmRegistry/${documentId}?${query}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      fields: {
        primaryResearch: firestoreValue(primaryResearch),
        updatedAt: firestoreValue(primaryResearch.checkedAt),
        ...(linkPatch ? { links: firestoreValue(linkPatch) } : {}),
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Could not update ${documentId}: HTTP ${response.status}.`);
  }
}

const verificationResponse = await fetch(`${baseUrl}/firmRegistry?pageSize=100`, { headers });
if (!verificationResponse.ok) throw new Error(`Verification read failed: HTTP ${verificationResponse.status}.`);

const verificationPayload = await verificationResponse.json();
const documentsById = new Map(
  (verificationPayload.documents ?? []).map((document) => [document.name.split('/').at(-1), document]),
);
const updatedDocuments = targetEntries.filter(([slug, primaryResearch]) => {
  const document = documentsById.get(documentIdsBySlug[slug]);
  return document?.fields?.primaryResearch?.mapValue?.fields?.checkedAt?.stringValue === primaryResearch.checkedAt;
});

if (updatedDocuments.length !== targetIds.length) {
  throw new Error(`Verification failed: expected ${targetIds.length}, found ${updatedDocuments.length}.`);
}

const chainFundedDocument = requestedSlugs.includes('chainfunded')
  ? documentsById.get(documentIdsBySlug.chainfunded)
  : undefined;
if (
  chainFundedDocument
  && chainFundedDocument.fields?.links?.mapValue?.fields?.x?.mapValue?.fields?.handle?.stringValue !== 'chainfunded'
) {
  throw new Error('Verification failed: ChainFunded canonical X handle was not updated.');
}

const polyquidDocument = requestedSlugs.includes('polyquid')
  ? documentsById.get(documentIdsBySlug.polyquid)
  : undefined;
if (
  polyquidDocument
  && polyquidDocument.fields?.links?.mapValue?.fields?.officialWebsite?.stringValue !== 'https://www.polyquid.xyz'
) {
  throw new Error('Verification failed: Polyquid canonical website was not updated.');
}

console.log(JSON.stringify({ projectId, collection: 'firmRegistry', slugs: requestedSlugs, updated: updatedDocuments.length }, null, 2));
