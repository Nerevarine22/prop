'use client';

import { useEffect, useSyncExternalStore } from 'react';

export type ComparisonSelectionItem = {
  id: string;
  name: string;
  slug: string;
  logo?: string;
};

type ComparisonSelectionState = {
  hydrated: boolean;
  items: ComparisonSelectionItem[];
};

const STORAGE_KEY = 'prophub:comparison-selection';
const MAX_SELECTED_FIRMS = 3;
const listeners = new Set<() => void>();
const serverState: ComparisonSelectionState = { hydrated: false, items: [] };
let state: ComparisonSelectionState = serverState;

function emitChange() {
  listeners.forEach((listener) => listener());
}

function isSelectionItem(value: unknown): value is ComparisonSelectionItem {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<ComparisonSelectionItem>;
  return typeof item.id === 'string' && typeof item.name === 'string' && typeof item.slug === 'string';
}

function normalize(items: ComparisonSelectionItem[]) {
  return [...new Map(items.filter(isSelectionItem).map((item) => [item.id, item])).values()].slice(-MAX_SELECTED_FIRMS);
}

function readStoredSelection(): ComparisonSelectionItem[] {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(parsed) ? normalize(parsed) : [];
  } catch {
    return [];
  }
}

function setItems(items: ComparisonSelectionItem[]) {
  const nextItems = normalize(items);
  state = { hydrated: true, items: nextItems };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
  } catch {
    // Comparison still works for the current page if storage is unavailable.
  }
  emitChange();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

function getServerSnapshot() {
  return serverState;
}

export function useComparisonSelection() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (!state.hydrated) {
      state = { hydrated: true, items: readStoredSelection() };
      emitChange();
    }

    const syncAcrossTabs = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      state = { hydrated: true, items: readStoredSelection() };
      emitChange();
    };
    window.addEventListener('storage', syncAcrossTabs);
    return () => window.removeEventListener('storage', syncAcrossTabs);
  }, []);

  return {
    ...snapshot,
    selectedIds: snapshot.items.map((item) => item.id),
    add: (item: ComparisonSelectionItem) => setItems([...state.items, item]),
    remove: (id: string) => setItems(state.items.filter((item) => item.id !== id)),
    toggle: (item: ComparisonSelectionItem) => {
      if (state.items.some((selected) => selected.id === item.id)) {
        setItems(state.items.filter((selected) => selected.id !== item.id));
      } else {
        setItems([...state.items, item]);
      }
    },
    replace: (items: ComparisonSelectionItem[]) => setItems(items),
  };
}

