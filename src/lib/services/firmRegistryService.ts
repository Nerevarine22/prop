import { collection, doc, getDocs, writeBatch } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase/config';
import { FIRM_DATABASE_SEED } from '@/lib/data/firmDatabaseSeed';
import type { FirmDatabaseRecord } from '@/types/database';

export const FIRM_REGISTRY_COLLECTION = 'firmRegistry';

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
      batch.set(reference, { schemaVersion: record.schemaVersion, id: record.id, slug: record.slug, name: record.name }, { merge: true });
    } else {
      batch.set(reference, removeUndefined(record));
    }
  }
  await batch.commit();
  return FIRM_DATABASE_SEED.length;
}
