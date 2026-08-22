import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { cert, getApps, initializeApp, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { MODEL_FIRST_FIRM_PROFILES_BY_SLUG } from '../src/lib/data/modelFirstFirmProfiles';
import type { FirmContentFact, FirmNormalizedProfileV2, NormalizedEvidence } from '../src/types/database';

type ServiceAccountFile = {
  project_id: string;
  client_email: string;
  private_key: string;
};

const CONTENT_STATUSES = new Set(['reported', 'verified', 'conflict', 'ND', 'N/A', 'pending']);
const COMPARISON_STATUSES = new Set(['known', 'varies', 'ND', 'N/A']);

function assertEvidence(label: string, evidence: NormalizedEvidence[] | undefined) {
  if (!evidence?.length) throw new Error(`${label}: evidence is missing.`);
  for (const item of evidence) {
    if (!/^https?:\/\//.test(item.sourceUrl) || !item.checkedAt) {
      throw new Error(`${label}: invalid source URL or checkedAt.`);
    }
  }
}

function assertFact(fact: FirmContentFact, context: string) {
  if (!fact.id || !fact.label || !fact.value || !fact.status) {
    throw new Error(`${context}: fact id, label, value, or status is missing.`);
  }
  if (!CONTENT_STATUSES.has(fact.status)) throw new Error(`${context}.${fact.id}: invalid status ${fact.status}.`);
  assertEvidence(`${context}.${fact.id}`, fact.evidence);
}

function validateProfile(profile: FirmNormalizedProfileV2) {
  if (profile.version !== 2 || profile.methodology !== 'primary-sources-only') throw new Error('Invalid model-first profile version or methodology.');
  if (profile.researchStandard !== 'model-first-v1') throw new Error('The selected profile is not model-first-v1.');
  if (profile.researchMode !== 'manual' && profile.researchMode !== 'agent-assisted') throw new Error('Invalid or missing researchMode.');
  if (!profile.id || !profile.slug || !profile.name || !profile.checkedAt || !profile.modelTypes.length) throw new Error('Required profile identity fields are missing.');
  if (!profile.operatingModel || !profile.sourcesInspected?.length) throw new Error('Operating model or source inspection ledger is missing.');

  assertFact(profile.operatingModel.classification, 'operatingModel');
  assertFact(profile.operatingModel.summary, 'operatingModel');
  profile.operatingModel.lifecycle.forEach((item) => assertFact(item, 'operatingModel.lifecycle'));
  for (const item of [profile.operatingModel.accountEnvironment, profile.operatingModel.traderPayment, profile.operatingModel.fundingMechanism, profile.operatingModel.traderCompensation]) {
    if (item) assertFact(item, 'operatingModel');
  }

  for (const [key, value] of Object.entries(profile.comparison)) {
    if (key === 'modelTypes') continue;
    if (!COMPARISON_STATUSES.has(value.status)) throw new Error(`comparison.${key}: invalid status ${value.status}.`);
    assertEvidence(`comparison.${key}`, value.evidence);
  }

  const sectionIds = new Set<string>();
  for (const section of profile.sections) {
    if (!section.id || !section.tabLabel || !section.title || sectionIds.has(section.id)) throw new Error(`Invalid or duplicate section ${section.id}.`);
    sectionIds.add(section.id);
    if (!section.blocks.length) throw new Error(`Section ${section.id} has no blocks.`);
    const blockIds = new Set<string>();
    for (const block of section.blocks) {
      if (!block.id || blockIds.has(block.id)) throw new Error(`Invalid or duplicate block ${section.id}.${block.id}.`);
      blockIds.add(block.id);
      if (block.type === 'text' || block.type === 'notice') {
        if (!block.status) throw new Error(`${section.id}.${block.id}: status is missing.`);
        if (!CONTENT_STATUSES.has(block.status)) throw new Error(`${section.id}.${block.id}: invalid status ${block.status}.`);
        assertEvidence(`${section.id}.${block.id}`, block.evidence);
      } else if (block.type === 'fact-grid') {
        block.items.forEach((item) => assertFact(item, `${section.id}.${block.id}`));
      } else if (block.type === 'record-list') {
        for (const record of block.items) {
          record.facts?.forEach((item) => assertFact(item, `${section.id}.${record.id}`));
          if (!record.facts?.length && !record.links?.length) {
            throw new Error(`${section.id}.${record.id}: a source-only record must have a link.`);
          }
        }
      } else {
        throw new Error(`${section.id}.${block.id}: model-first migration does not allow unsourced table cells.`);
      }
    }
  }

  for (const source of profile.sourcesInspected) {
    if (!/^https?:\/\//.test(source.url) || !source.checkedAt) throw new Error('Invalid sourcesInspected entry.');
  }
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
  const slugArgument = process.argv.find((value) => value.startsWith('--slug='));
  const fileArgument = process.argv.find((value) => value.startsWith('--file='));
  const filePath = fileArgument ? resolve(process.cwd(), fileArgument.slice('--file='.length)) : undefined;
  const fileProfile = filePath
    ? JSON.parse(await readFile(filePath, 'utf8')) as FirmNormalizedProfileV2
    : undefined;
  const slug = slugArgument?.slice('--slug='.length) || fileProfile?.slug || 'alphagrid';
  const profile = fileProfile ?? MODEL_FIRST_FIRM_PROFILES_BY_SLUG[slug];
  if (!profile) throw new Error(`No reviewed model-first profile exists for ${slug}.`);
  if (profile.slug !== slug) throw new Error(`Profile slug ${profile.slug} does not match requested slug ${slug}.`);
  validateProfile(profile);
  const firestoreProfile = JSON.parse(JSON.stringify(profile)) as FirmNormalizedProfileV2;

  const shouldWrite = process.argv.includes('--write');
  if (!shouldWrite) {
    process.stdout.write(`Model-first dry run complete.\nFirm: ${slug}\nSource: ${filePath ?? 'checked-in TypeScript profile'}\nSections: ${profile.sections.length}\nSources inspected: ${profile.sourcesInspected?.length ?? 0}\nNo Firestore writes performed.\n`);
    return;
  }

  const keyPath = resolve(process.cwd(), 'serviceAccountKey.json');
  const key = JSON.parse(await readFile(keyPath, 'utf8')) as ServiceAccountFile;
  const serviceAccount: ServiceAccount = { projectId: key.project_id, clientEmail: key.client_email, privateKey: key.private_key };
  const app = getApps()[0] ?? initializeApp({ credential: cert(serviceAccount) });
  const database = getFirestore(app);
  database.settings({ ignoreUndefinedProperties: true });

  const reference = database.collection('firmRegistry').doc(profile.id);
  const beforeSnapshot = await reference.get();
  if (!beforeSnapshot.exists) throw new Error(`Refusing to create a new production document: ${profile.id}.`);
  const before = beforeSnapshot.data() ?? {};
  const protectedBefore = { ...before, normalizedProfileV2: undefined, updatedAt: undefined };

  await reference.update({ normalizedProfileV2: firestoreProfile, updatedAt: profile.checkedAt });

  const afterSnapshot = await reference.get();
  const after = afterSnapshot.data() ?? {};
  const protectedAfter = { ...after, normalizedProfileV2: undefined, updatedAt: undefined };
  if (stableStringify(protectedBefore) !== stableStringify(protectedAfter)) {
    throw new Error('Protected Firestore fields changed unexpectedly.');
  }
  if (stableStringify(after.normalizedProfileV2) !== stableStringify(firestoreProfile)) {
    throw new Error('Stored model-first profile does not match the reviewed source profile.');
  }
  process.stdout.write(`Model-first Firestore write verified.\nFirm: ${slug}\nUpdated fields: normalizedProfileV2, updatedAt\n`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown model-first migration error';
  process.stderr.write(`Model-first migration failed: ${message}\n`);
  process.exitCode = 1;
});
