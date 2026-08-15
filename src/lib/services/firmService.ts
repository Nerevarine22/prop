import { db, isFirebaseConfigured } from '@/lib/firebase/config';
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import type { PropFirm } from '@/types/firm';
import { FIRM_DATABASE_SCHEMA_VERSION, hasResearchProfile, type FirmDatabaseRecord } from '@/types/database';
import { FIRM_DATABASE_SEED } from '@/lib/data/firmDatabaseSeed';
import { FIRM_REGISTRY_COLLECTION, getFirmRegistry } from './firmRegistryService';

let localFirmsStore: PropFirm[] = FIRM_DATABASE_SEED.filter(hasResearchProfile).map((record) => record.profile);

function normalizeFirm(firm: PropFirm): PropFirm {
  return {
    ...firm,
    dataStatus: firm.dataStatus || 'mock',
    lastReviewedAt: firm.lastReviewedAt || '1970-01-01T00:00:00.000Z',
    sources: firm.sources || [],
    verification: firm.verification || {
      status: 'mock',
      method: 'demo-seed',
      checkedAt: '1970-01-01T00:00:00.000Z',
      sourceIds: [],
      confidence: 'low',
    },
    changeHistory: firm.changeHistory || [],
  };
}

export async function getFirms(): Promise<PropFirm[]> {
  try {
    const records = await getFirmRegistry();
    return records.filter(hasResearchProfile).map((record) => normalizeFirm(record.profile));
  } catch (error) {
    console.warn('Firm registry fetch failed, using the local research fallback:', error);
    return localFirmsStore;
  }
}

export async function saveFirm(firmData: Omit<PropFirm, 'id'> & { id?: string }): Promise<PropFirm> {
  const firmId = firmData.id || `firm-${Date.now()}`;
  const fullFirm: PropFirm = { ...firmData, id: firmId } as PropFirm;

  if (!isFirebaseConfigured) {
    const existingIndex = localFirmsStore.findIndex(f => f.id === firmId);
    if (existingIndex >= 0) {
      localFirmsStore[existingIndex] = fullFirm;
    } else {
      localFirmsStore.unshift(fullFirm);
    }
    return fullFirm;
  }

  try {
    const docRef = doc(db, FIRM_REGISTRY_COLLECTION, firmId);
    const current = await getDoc(docRef);
    const currentRecord = current.data() as Partial<FirmDatabaseRecord> | undefined;
    const now = new Date().toISOString();
    const record: FirmDatabaseRecord = {
      schemaVersion: FIRM_DATABASE_SCHEMA_VERSION,
      id: firmId,
      slug: fullFirm.slug,
      name: fullFirm.name,
      links: {
        ...(currentRecord?.links || {}),
        ...(fullFirm.website ? { officialWebsite: fullFirm.website } : {}),
      },
      researchStatus: currentRecord?.researchStatus === 'verified' ? 'verified' : 'researched',
      publicationStatus: currentRecord?.publicationStatus || 'draft',
      profile: fullFirm,
      createdAt: currentRecord?.createdAt || now,
      updatedAt: now,
    };
    await setDoc(docRef, record, { merge: true });
    
    // Update local store as well
    const index = localFirmsStore.findIndex(f => f.id === firmId);
    if (index >= 0) {
      localFirmsStore[index] = fullFirm;
    } else {
      localFirmsStore.unshift(fullFirm);
    }
    return fullFirm;
  } catch (error) {
    console.error('Error saving firm to Firestore:', error);
    throw error;
  }
}

export async function deleteFirm(firmId: string): Promise<void> {
  localFirmsStore = localFirmsStore.filter(f => f.id !== firmId);

  if (!isFirebaseConfigured) {
    return;
  }

  try {
    const docRef = doc(db, FIRM_REGISTRY_COLLECTION, firmId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting firm from Firestore:', error);
    throw error;
  }
}
