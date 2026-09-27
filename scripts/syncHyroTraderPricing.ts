import { readFile, writeFile } from 'node:fs/promises';
import { homedir, tmpdir } from 'node:os';
import { join } from 'node:path';
import { updateHyroTraderRuleFacts } from '../src/lib/data/hyroTraderRules';
import { HYROTRADER_NORMALIZED_PROFILE, HYROTRADER_PAGE_PROFILE } from '../src/lib/data/standardizedFirmProfiles';
import { hyroPricingFact, updateHyroTraderPrograms, withHyroTraderPricing } from '../src/lib/data/hyroTraderPricing';
import { trustpilotRatingsForSlug } from '../src/lib/data/trustpilotRatings';
import type { FirmDatabaseRecord } from '../src/types/database';

const PROJECT_ID = 'prop-24596';
const DOCUMENT_ID = 'firm-hyrotrader';
const RESOURCE = `projects/${PROJECT_ID}/databases/(default)/documents`;
const DOCUMENT_URL = `https://firestore.googleapis.com/v1/${RESOURCE}/firmRegistry/${DOCUMENT_ID}`;
const COLLECTION_URL = `https://firestore.googleapis.com/v1/${RESOURCE}/firmRegistry`;

type FirestoreValue = Record<string, any>;

function encode(value: unknown): FirestoreValue {
  if (value === null) return { nullValue: null };
  if (typeof value === 'string') return { stringValue: value };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (typeof value === 'number') return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(encode) } };
  if (typeof value === 'object') {
    return { mapValue: { fields: Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined).map(([key, item]) => [key, encode(item)])) } };
  }
  throw new Error(`Unsupported Firestore value type: ${typeof value}`);
}

function decode(value: FirestoreValue): any {
  if ('nullValue' in value) return null;
  if ('stringValue' in value) return value.stringValue;
  if ('booleanValue' in value) return value.booleanValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return value.doubleValue;
  if ('timestampValue' in value) return value.timestampValue;
  if ('arrayValue' in value) return (value.arrayValue?.values ?? []).map(decode);
  if ('mapValue' in value) return Object.fromEntries(Object.entries(value.mapValue?.fields ?? {}).map(([key, item]) => [key, decode(item as FirestoreValue)]));
  throw new Error('Firestore returned an unsupported value.');
}

function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable((value as Record<string, unknown>)[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

async function main() {
  const credentialPath = join(homedir(), '.config', 'configstore', 'firebase-tools.json');
  const firebaseCredential = JSON.parse(await readFile(credentialPath, 'utf8'));
  const accessToken = firebaseCredential?.tokens?.access_token as string | undefined;
  const expiresAt = Number(firebaseCredential?.tokens?.expires_at ?? 0);
  if (!accessToken || expiresAt <= Date.now()) throw new Error('Firebase CLI access token is unavailable or expired. Run `firebase projects:list` and retry.');

  const headers = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
  const response = await fetch(DOCUMENT_URL, { headers });
  if (!response.ok) throw new Error(`Could not read ${DOCUMENT_ID}: HTTP ${response.status}.`);
  const remoteDocument = await response.json();
  const before = Object.fromEntries(Object.entries(remoteDocument.fields ?? {}).map(([key, item]) => [key, decode(item as FirestoreValue)])) as unknown as FirmDatabaseRecord;
  if (!remoteDocument.updateTime || before.id !== DOCUMENT_ID || before.slug !== 'hyrotrader' || HYROTRADER_NORMALIZED_PROFILE.challengePrograms.status === 'ND') {
    throw new Error('Expected HyroTrader record and local normalized programs are missing.');
  }

  const timestamp = new Date().toISOString();
  const pageProfile = withHyroTraderPricing(HYROTRADER_PAGE_PROFILE);
  const normalizedProfileV2 = pageProfile;
  const trustpilotRating = trustpilotRatingsForSlug('hyrotrader');
  const nextNormalizedProfile = updateHyroTraderRuleFacts({
    ...HYROTRADER_NORMALIZED_PROFILE,
    challengePrograms: hyroPricingFact(updateHyroTraderPrograms(HYROTRADER_NORMALIZED_PROFILE.challengePrograms.value)),
    modularProfile: pageProfile,
    ...(trustpilotRating ? { externalRatings: trustpilotRating } : {}),
  });
  const update = JSON.parse(JSON.stringify({
    normalizedProfile: nextNormalizedProfile,
    normalizedProfileV2,
    pageProfileV2: pageProfile,
    draftPageProfileV2: pageProfile,
    ...(trustpilotRating ? { externalRatings: trustpilotRating } : {}),
    draftUpdatedAt: timestamp,
    publishedAt: timestamp,
    updatedAt: timestamp,
  }));

  console.log(JSON.stringify({
    project: PROJECT_ID,
    document: `${COLLECTION_URL}/${DOCUMENT_ID}`,
    replacingProfileSnapshots: ['normalizedProfile', 'normalizedProfileV2', 'pageProfileV2', 'draftPageProfileV2'],
    preservingOtherDocumentFields: true,
    publicTransparency: Boolean(update.pageProfileV2.publicTransparency),
    companyEntities: update.pageProfileV2.publicTransparency?.companyAndTeam.entities.map((entity: { name: string }) => entity.name),
    payoutCopyKeys: Object.keys(update.pageProfileV2.editorialCopy ?? {}).filter((field) => field.startsWith('payouts.')),
    trustpilotRatings: update.externalRatings?.length ?? 0,
  }, null, 2));

  if (!process.argv.includes('--write')) {
    console.log('Dry run only; no database writes. Add --write to replace the HyroTrader profile snapshots.');
    return;
  }

  const backupPath = join(tmpdir(), `hyrotrader-before-sync-${Date.now()}.json`);
  await writeFile(backupPath, JSON.stringify(before, null, 2));
  const query = new URLSearchParams();
  for (const field of Object.keys(update)) query.append('updateMask.fieldPaths', field);
  query.set('currentDocument.updateTime', remoteDocument.updateTime);
  const writeResponse = await fetch(`${DOCUMENT_URL}?${query}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ fields: Object.fromEntries(Object.entries(update).map(([key, value]) => [key, encode(value)])) }),
  });
  if (!writeResponse.ok) throw new Error(`Firestore update failed: HTTP ${writeResponse.status}: ${(await writeResponse.text()).slice(0, 500)}`);

  const verificationResponse = await fetch(DOCUMENT_URL, { headers });
  if (!verificationResponse.ok) throw new Error(`Firestore verification read failed: HTTP ${verificationResponse.status}.`);
  const afterDocument = await verificationResponse.json();
  const after = Object.fromEntries(Object.entries(afterDocument.fields ?? {}).map(([key, item]) => [key, decode(item as FirestoreValue)]));
  if (!isDeepEqual(after, { ...before, ...update })) throw new Error('Stored HyroTrader record differs from the prepared replacement.');
  console.log(`Verified one-document update in ${PROJECT_ID}; other firm records and document fields were untouched. Backup: ${backupPath}`);
}

function isDeepEqual(left: unknown, right: unknown): boolean {
  return stable(left) === stable(right);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
