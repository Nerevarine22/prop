import { db, isFirebaseConfigured } from '@/lib/firebase/config';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { PropFirm } from '@/types/firm';
import { MOCK_PROP_FIRMS } from '@/lib/data/firms';

const COLLECTION_NAME = 'firms';

// In-memory store fallback for development
let localFirmsStore: PropFirm[] = [...MOCK_PROP_FIRMS];

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
  if (!isFirebaseConfigured) {
    return localFirmsStore;
  }

  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    if (querySnapshot.empty) {
      return localFirmsStore;
    }
    return querySnapshot.docs.map((snapshot) => normalizeFirm({ id: snapshot.id, ...snapshot.data() } as PropFirm));
  } catch (error) {
    console.warn('Firestore fetch failed, using local mock data fallback:', error);
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
    const docRef = doc(db, COLLECTION_NAME, firmId);
    await setDoc(docRef, fullFirm, { merge: true });
    
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
    const docRef = doc(db, COLLECTION_NAME, firmId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting firm from Firestore:', error);
    throw error;
  }
}
