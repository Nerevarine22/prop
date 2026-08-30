import { collection, doc, getDocs, setDoc, writeBatch } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase/config';
import { FIRM_DATABASE_SEED } from '@/lib/data/firmDatabaseSeed';
import { FIRM_DATABASE_SCHEMA_VERSION, type FirmDatabaseRecord, type FirmNormalizedProfile, type FirmNormalizedProfileV2, type NormalizedFact } from '@/types/database';

export const FIRM_REGISTRY_COLLECTION = 'firmRegistry';

export type FirmRegistryMetadataInput = Pick<
  FirmDatabaseRecord,
  'name' | 'slug' | 'researchStatus' | 'publicationStatus' | 'links'
> & {
  brandAssets?: FirmDatabaseRecord['brandAssets'];
};

export type CreateFirmRegistryInput = {
  name: string;
  slug: string;
  officialWebsite?: string;
  xHandle?: string;
  logoPath?: string;
};

function nd<T>(notes = 'Not researched yet.'): NormalizedFact<T> {
  return { status: 'ND', value: 'ND', evidence: [], notes };
}

function starterPageProfile(id: string, slug: string, name: string, checkedAt: string): FirmNormalizedProfileV2 {
  return {
    version: 2,
    contentStage: 'editorial',
    methodology: 'primary-sources-only',
    researchStandard: 'model-first-v1',
    researchMode: 'manual',
    id, slug, name, checkedAt,
    modelTypes: ['other'],
    offerNames: [],
    comparison: {
      modelTypes: ['other'],
      capital: { status: 'ND', unit: 'USD' },
      entryCost: { status: 'ND', unit: 'USD' },
      profitSplit: { status: 'ND', unit: 'percent' },
      maxDrawdown: { status: 'ND', unit: 'percent' },
      payoutSchedules: { status: 'ND', values: [] },
      executionModels: { status: 'ND', values: [] },
    },
    sections: [
      { id: 'overview', tabLabel: 'Brief', title: `${name} brief`, description: 'Explain the firm model before the detailed rules.', blocks: [{ id: 'brief-introduction', type: 'text', eyebrow: 'Firm brief', title: `How ${name} works`, paragraphs: ['Add the reviewed description and operating model here.'], status: 'pending' }, { id: 'brief-process', type: 'fact-grid', columns: 4, presentation: 'steps', items: [{ id: 'step-1', label: '01', value: 'Choose a program', status: 'pending' }, { id: 'step-2', label: '02', value: 'Meet the objective', status: 'pending' }, { id: 'step-3', label: '03', value: 'Activate funding', status: 'pending' }, { id: 'step-4', label: '04', value: 'Request a payout', status: 'pending' }] }] },
      { id: 'offers', tabLabel: 'Challenges', title: 'Programs and pricing', description: 'Add each challenge as a separate structured record.', blocks: [{ id: 'offer-records', type: 'record-list', presentation: 'records', items: [{ id: 'program-1', eyebrow: 'Evaluation', title: 'First program', description: 'Add the reviewed program mechanics.', facts: [{ id: 'program-stages', label: 'Stages', value: 'Add profit targets', status: 'pending' }, { id: 'program-pricing', label: 'Pricing tiers', value: 'Add account sizes and fees', status: 'pending' }] }] }] },
      { id: 'payouts', tabLabel: 'Payouts', title: 'How payouts work', description: 'Document payout access, timing and conditions.', blocks: [{ id: 'payout-summary', type: 'text', eyebrow: 'Payout policy', title: 'Trader compensation', paragraphs: ['Add the profit split, payout schedule and the mechanics that affect the account.'], status: 'pending' }, { id: 'payout-facts', type: 'fact-grid', columns: 3, presentation: 'metrics', items: [{ id: 'payout-split', label: 'Profit split', value: 'Add value', status: 'pending' }, { id: 'payout-timing', label: 'Processing', value: 'Add timing', status: 'pending' }, { id: 'payout-currency', label: 'Currency', value: 'Add currency', status: 'pending' }] }] },
      { id: 'trading', tabLabel: 'Trading', title: 'Trading environment', description: 'Document where and under which rules trading happens.', blocks: [{ id: 'trading-summary', type: 'text', eyebrow: 'Execution', title: 'Where traders execute', paragraphs: ['Add the chain, terminal, platform, assets and execution model.'], status: 'pending' }, { id: 'trading-facts', type: 'fact-grid', columns: 3, presentation: 'details', items: [{ id: 'trading-platform', label: 'Platform', value: 'Add platform', status: 'pending' }, { id: 'trading-assets', label: 'Assets', value: 'Add markets', status: 'pending' }, { id: 'trading-rules', label: 'Rules', value: 'Add permissions and limits', status: 'pending' }] }] },
    ],
    sourceDiscrepancies: [],
  };
}

function starterNormalizedProfile(id: string, slug: string, name: string, checkedAt: string, input: CreateFirmRegistryInput, modularProfile: FirmNormalizedProfileV2): FirmNormalizedProfile {
  const xHandle = input.xHandle?.trim().replace(/^@/, '');
  const website = input.officialWebsite?.trim();
  const logoPath = input.logoPath?.trim();
  const known = <T>(value: T, sourceUrl: string): NormalizedFact<T> => ({ status: 'reported', value, evidence: [{ sourceUrl, checkedAt }] });
  return {
    version: 1, methodology: 'primary-sources-only', id, slug, name, checkedAt,
    identity: {
      officialWebsite: website ? known(website, website) : nd(),
      xHandle: xHandle ? known(`@${xHandle}`, `https://x.com/${xHandle}`) : nd(),
      logo: logoPath ? known(logoPath, website ?? `https://x.com/${xHandle ?? ''}`) : nd(),
      tagline: nd(), description: nd(),
    },
    summary: { profitSplit: nd(), maxDrawdown: nd(), dailyDrawdown: nd(), profitTarget: nd(), minCapital: nd(), maxCapital: nd(), cryptoLeverage: nd(), payoutFrequency: nd() },
    challengePrograms: nd(),
    payoutPolicy: { schedule: nd(), profitSplitPercent: nd(), minimumAmount: nd(), currencies: nd(), processingTimeHours: nd(), positionsMustBeClosed: nd(), partialWithdrawalsAllowed: nd(), payoutResetsBalance: nd(), notes: nd() },
    tradingPolicy: { platforms: nd(), markets: nd(), leverage: nd(), consistencyRule: nd(), profitDayDefinition: nd(), newsTrading: nd(), weekendHolding: nd(), automatedTrading: nd(), copyTrading: nd(), mandatoryStopLoss: nd(), tradingFees: nd() },
    executionPolicy: { model: nd(), venue: nd(), onchainSettlement: nd(), notes: nd() },
    compliancePolicy: { legalEntity: nd(), registrationJurisdiction: nd(), regulatoryStatus: nd(), kycRequiredAt: nd(), restrictedJurisdictions: nd(), maximumAggregateFundedBalance: nd(), simulatedAccounts: nd() },
    tokenRewards: { hasToken: nd(), tokenTicker: nd(), tokenSupply: nd(), hasPoints: nd(), pointsProgramName: nd(), hasAirdrop: nd(), airdropStatus: nd(), description: nd() },
    company: { yearEstablished: nd(), headquarters: nd() },
    sourceDiscrepancies: [], claims: [], ndFields: [], modularProfile,
  };
}

function normalizeRecord(id: string, value: Partial<FirmDatabaseRecord>): FirmDatabaseRecord {
  const seedFallback = FIRM_DATABASE_SEED.find((record) => record.id === id);
  if (!seedFallback) {
    if (!value.slug || !value.name || !value.links || !value.researchStatus || !value.publicationStatus || !value.createdAt || !value.updatedAt || value.schemaVersion !== 1) {
      throw new Error(`Invalid firm database record: ${id}`);
    }
    return { ...value, id } as FirmDatabaseRecord;
  }

  return {
    ...seedFallback,
    ...value,
    id,
    links: { ...seedFallback.links, ...value.links },
  };
}

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

export async function getFirmRegistry(): Promise<FirmDatabaseRecord[]> {
  if (!isFirebaseConfigured) return FIRM_DATABASE_SEED;

  const snapshot = await getDocs(collection(db, FIRM_REGISTRY_COLLECTION));
  if (snapshot.empty) return FIRM_DATABASE_SEED;

  return snapshot.docs
    .map((item) => normalizeRecord(item.id, item.data() as Partial<FirmDatabaseRecord>))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function createFirmRegistry(input: CreateFirmRegistryInput): Promise<FirmDatabaseRecord> {
  if (!isFirebaseConfigured) throw new Error('Firebase is not configured.');

  const name = input.name.trim();
  const slug = input.slug.trim().toLowerCase();
  if (!name) throw new Error('Firm name is required.');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('Slug may contain lowercase letters, numbers and single hyphens only.');
  for (const url of [input.officialWebsite, input.logoPath]) {
    if (url && !/^(https?:\/\/|\/)/i.test(url)) throw new Error(`Invalid URL or asset path: ${url}`);
  }

  const snapshot = await getDocs(collection(db, FIRM_REGISTRY_COLLECTION));
  if (snapshot.docs.some((item) => item.id === `firm-${slug}` || item.data().slug === slug)) {
    throw new Error('A firm with this slug already exists.');
  }

  const timestamp = new Date().toISOString();
  const id = `firm-${slug}`;
  const pageProfile = starterPageProfile(id, slug, name, timestamp);
  const normalizedProfile = starterNormalizedProfile(id, slug, name, timestamp, input, pageProfile);
  const xHandle = input.xHandle?.trim().replace(/^@/, '');
  const officialWebsite = input.officialWebsite?.trim();
  const logoPath = input.logoPath?.trim();
  const sourceUrl = officialWebsite ?? (xHandle ? `https://x.com/${xHandle}` : undefined);
  const record: FirmDatabaseRecord = {
    schemaVersion: FIRM_DATABASE_SCHEMA_VERSION,
    id, slug, name,
    links: {
      ...(officialWebsite ? { officialWebsite } : {}),
      ...(xHandle ? { x: { handle: `@${xHandle}`, url: `https://x.com/${xHandle}` } } : {}),
    },
    ...(logoPath && sourceUrl ? { brandAssets: { logoPath, sourceUrl, status: 'reported' as const, checkedAt: timestamp } } : {}),
    researchStatus: 'stub',
    publicationStatus: 'draft',
    normalizedProfile,
    normalizedProfileV2: pageProfile,
    draftPageProfileV2: pageProfile,
    draftUpdatedAt: timestamp,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await setDoc(doc(db, FIRM_REGISTRY_COLLECTION, id), removeUndefined(record));
  return record;
}

export async function updateFirmRegistryMetadata(
  id: string,
  input: FirmRegistryMetadataInput,
): Promise<void> {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured.');
  }

  const slug = input.slug.trim().toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error('Slug may contain lowercase letters, numbers and single hyphens only.');
  }
  if (!input.name.trim()) throw new Error('Firm name is required.');

  for (const url of [input.links.officialWebsite, input.links.x?.url, input.brandAssets?.sourceUrl]) {
    if (url && !/^https?:\/\//i.test(url)) throw new Error(`Invalid external URL: ${url}`);
  }

  await setDoc(doc(db, FIRM_REGISTRY_COLLECTION, id), removeUndefined({
    name: input.name.trim(),
    slug,
    researchStatus: input.researchStatus,
    publicationStatus: input.publicationStatus,
    links: input.links,
    brandAssets: input.brandAssets,
    updatedAt: new Date().toISOString(),
  }), { merge: true });
}

export async function saveFirmRegistryDraft(
  id: string,
  profile: FirmDatabaseRecord['normalizedProfileV2'],
): Promise<string> {
  if (!isFirebaseConfigured) throw new Error('Firebase is not configured.');
  if (!profile?.sections.length) throw new Error('A draft needs at least one section.');
  const timestamp = new Date().toISOString();
  await setDoc(doc(db, FIRM_REGISTRY_COLLECTION, id), removeUndefined({
    draftPageProfileV2: profile,
    draftUpdatedAt: timestamp,
    updatedAt: timestamp,
  }), { merge: true });
  return timestamp;
}

export async function publishFirmRegistryProfile(
  id: string,
  profile: FirmDatabaseRecord['normalizedProfileV2'],
): Promise<string> {
  if (!isFirebaseConfigured) throw new Error('Firebase is not configured.');
  if (!profile?.sections.length) throw new Error('A published profile needs at least one section.');
  const timestamp = new Date().toISOString();
  await setDoc(doc(db, FIRM_REGISTRY_COLLECTION, id), removeUndefined({
    pageProfileV2: profile,
    draftPageProfileV2: profile,
    draftUpdatedAt: timestamp,
    publishedAt: timestamp,
    publicationStatus: 'published',
    updatedAt: timestamp,
  }), { merge: true });
  return timestamp;
}

/**
 * Idempotent seed: merge keeps future research fields while ensuring every
 * canonical identity exists. Call only from an authenticated admin session.
 */
export async function seedFirmRegistry(): Promise<number> {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Add the NEXT_PUBLIC_FIREBASE_* environment variables first.');
  }

  const existingSnapshot = await getDocs(collection(db, FIRM_REGISTRY_COLLECTION));
  const existingIds = new Set(existingSnapshot.docs.map((item) => item.id));
  const batch = writeBatch(db);
  for (const record of FIRM_DATABASE_SEED) {
    const reference = doc(db, FIRM_REGISTRY_COLLECTION, record.id);
    if (existingIds.has(record.id)) {
      batch.set(reference, removeUndefined({
        schemaVersion: record.schemaVersion,
        id: record.id,
        slug: record.slug,
        name: record.name,
        links: record.links,
        brandAssets: record.brandAssets,
      }), { merge: true });
    } else {
      batch.set(reference, removeUndefined(record));
    }
  }
  await batch.commit();
  return FIRM_DATABASE_SEED.length;
}
