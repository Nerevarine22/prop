import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { FIRM_NORMALIZED_PROFILES_BY_SLUG } from '../src/lib/data/firmNormalizedProfiles.ts';

const REQUIRED_PROJECT_ID = 'prop-24596';
const projectFlagIndex = process.argv.indexOf('--project');
const projectId = projectFlagIndex >= 0 ? process.argv[projectFlagIndex + 1] : undefined;
const dryRun = process.argv.includes('--dry-run');
const verifyOnly = process.argv.includes('--verify-only');

if (projectId !== REQUIRED_PROJECT_ID) {
  throw new Error(`Refusing to run. Pass --project ${REQUIRED_PROJECT_ID}.`);
}

const documentIdsBySlug = {
  propr: 'firm-propr', foxify: 'firm-foxify', chainfunded: 'firm-chainfunded',
  'solana-funded': 'firm-solanafunded', hypernova: 'firm-hypernova', polyquid: 'firm-polyquid',
  alphagrid: 'firm-alphagrid', hyperpnl: 'firm-hyperpnl', dizso: 'firm-dizso',
  hyrotrader: 'firm-hyrotrader', o2: 'firm-o2', 'carrot-funding': 'firm-carrot-funding',
  'doji-funded': 'firm-doji-funded', 'hyper-stack': 'firm-hyper-stack',
  'vanta-trading': 'firm-vanta-trading', size: 'firm-size', breakout: 'firm-breakout',
  'funded-hive': 'firm-funded-hive', 'klein-funding': 'firm-klein-funding',
  'cf-trader': 'firm-cf-trader', 'upscale-trade': 'firm-upscale-trade',
};

const slugs = Object.keys(documentIdsBySlug);
if (slugs.length !== 21 || Object.keys(FIRM_NORMALIZED_PROFILES_BY_SLUG).length !== 21) {
  throw new Error('Refusing incomplete normalization: exactly 21 profiles are required.');
}

const missingProfiles = slugs.filter((slug) => !FIRM_NORMALIZED_PROFILES_BY_SLUG[slug]);
if (missingProfiles.length) throw new Error(`Missing normalized profiles: ${missingProfiles.join(', ')}.`);

const firebaseCredentialPath = path.join(os.homedir(), '.config', 'configstore', 'firebase-tools.json');
const firebaseCredential = JSON.parse(fs.readFileSync(firebaseCredentialPath, 'utf8'));
const accessToken = firebaseCredential?.tokens?.access_token;
const expiresAt = Number(firebaseCredential?.tokens?.expires_at ?? 0);

if (!accessToken || expiresAt <= Date.now()) {
  throw new Error('Firebase CLI access token is unavailable or expired. Run `firebase projects:list` and retry.');
}

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

const resourceRoot = `projects/${projectId}/databases/(default)`;
const apiRoot = `https://firestore.googleapis.com/v1/${resourceRoot}`;
const collectionUrl = `${apiRoot}/documents/firmRegistry?pageSize=100`;
const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
const registryResponse = await fetch(collectionUrl, { headers });
if (!registryResponse.ok) throw new Error(`Could not read firmRegistry: HTTP ${registryResponse.status}.`);

const registryPayload = await registryResponse.json();
const documentsById = new Map(
  (registryPayload.documents ?? []).map((document) => [document.name.split('/').at(-1), document]),
);
const missingDocuments = slugs
  .map((slug) => documentIdsBySlug[slug])
  .filter((documentId) => !documentsById.has(documentId));
if (missingDocuments.length) {
  throw new Error(`Refusing partial creation; firmRegistry is missing: ${missingDocuments.join(', ')}.`);
}

const writes = slugs.map((slug) => {
  const documentId = documentIdsBySlug[slug];
  const current = documentsById.get(documentId);
  const profile = FIRM_NORMALIZED_PROFILES_BY_SLUG[slug];
  return {
    update: {
      name: `${resourceRoot}/documents/firmRegistry/${documentId}`,
      fields: {
        normalizedProfile: firestoreValue(profile),
        researchStatus: firestoreValue('researched'),
        updatedAt: firestoreValue(profile.checkedAt),
      },
    },
    updateMask: { fieldPaths: ['normalizedProfile', 'researchStatus', 'updatedAt'] },
    currentDocument: { updateTime: current.updateTime },
  };
});

if (dryRun) {
  console.log(JSON.stringify({ projectId, collection: 'firmRegistry', existingRecords: documentsById.size, writesPlanned: writes.length, fieldMask: writes[0].updateMask.fieldPaths }, null, 2));
  process.exit(0);
}

if (!verifyOnly) {
  const commitResponse = await fetch(`${apiRoot}/documents:commit`, {
    method: 'POST', headers, body: JSON.stringify({ writes }),
  });
  if (!commitResponse.ok) {
    const body = await commitResponse.text();
    throw new Error(`Atomic commit failed: HTTP ${commitResponse.status}: ${body.slice(0, 500)}`);
  }
}

const verificationResponse = await fetch(collectionUrl, { headers });
if (!verificationResponse.ok) throw new Error(`Verification read failed: HTTP ${verificationResponse.status}.`);
const verificationPayload = await verificationResponse.json();
const verifiedById = new Map(
  (verificationPayload.documents ?? []).map((document) => [document.name.split('/').at(-1), document]),
);

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    if (Object.keys(value).length === 1 && 'arrayValue' in value) {
      return `{"arrayValue":{"values":${stableStringify(value.arrayValue?.values ?? [])}}}`;
    }
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

const failures = slugs.filter((slug) => {
  const document = verifiedById.get(documentIdsBySlug[slug]);
  const before = documentsById.get(documentIdsBySlug[slug]);
  const fields = document?.fields ?? {};
  const normalized = fields.normalizedProfile?.mapValue?.fields ?? {};
  return normalized.version?.integerValue !== '1'
    || normalized.slug?.stringValue !== slug
    || fields.researchStatus?.stringValue !== 'researched'
    || !normalized.ndFields?.arrayValue
    || !fields.primaryResearch?.mapValue
    || stableStringify(fields.normalizedProfile) !== stableStringify(firestoreValue(FIRM_NORMALIZED_PROFILES_BY_SLUG[slug]))
    || stableStringify(fields.publicationStatus) !== stableStringify(before?.fields?.publicationStatus)
    || stableStringify(fields.profile) !== stableStringify(before?.fields?.profile);
});
if (failures.length) throw new Error(`Remote verification failed for: ${failures.join(', ')}.`);

console.log(JSON.stringify({ projectId, collection: 'firmRegistry', normalizedProfiles: slugs.length, verified: slugs.length, mode: verifyOnly ? 'verify-only' : 'commit' }, null, 2));
