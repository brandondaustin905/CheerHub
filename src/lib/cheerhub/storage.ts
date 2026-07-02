import type { Competition, Entry, Lock, WatchItem } from './types';
import { SEEDED_COMPETITIONS, SEED_VERSION_KEY } from './seeds';

// All keys in one place so they're easy to audit / migrate.
export const STORAGE_KEYS = {
  competitions: 'cheerhub:competitions',
  entries:      (id: string) => `cheerhub:entries:${id}`,
  locks:        (id: string) => `cheerhub:locks:${id}`,
  watched:      'cheerhub:watched',
} as const;

function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeWrite(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    // localStorage can throw when storage quota is exceeded.
    console.error('cheerhub: storage write failed', key, err);
    throw err;
  }
}

// Seed pre-populated competitions on first install (once per seed version).
// On re-seeds (version bump) we UPDATE factual fields on existing seeded
// competitions so venue/date corrections reach users who already have data.
// User-set fields (status, divisions, bannerUrl) are preserved.
export function maybeSeeed(): void {
  try {
    if (localStorage.getItem(SEED_VERSION_KEY)) return;
    const existing = safeRead<Competition[]>(STORAGE_KEYS.competitions, []);
    const seedMap  = new Map(SEEDED_COMPETITIONS.map((s) => [s.id, s]));

    // Keep user-created competitions; update factual data for seeded ones.
    const userCreated = existing.filter((c) => !seedMap.has(c.id));
    const seeded = SEEDED_COMPETITIONS.map((seed) => {
      const prev = existing.find((c) => c.id === seed.id);
      if (!prev) return seed;
      return {
        ...prev,
        name:        seed.name,
        venue:       seed.venue,
        city:        seed.city,
        startDate:   seed.startDate,
        endDate:     seed.endDate,
        accentColor: seed.accentColor,
      };
    });

    safeWrite(STORAGE_KEYS.competitions, [...userCreated, ...seeded]);
    localStorage.setItem(SEED_VERSION_KEY, '1');
  } catch { /* best-effort */ }
}

// Competitions

export async function loadCompetitions(): Promise<Competition[]> {
  return safeRead<Competition[]>(STORAGE_KEYS.competitions, []);
}

export async function saveCompetitions(list: Competition[]): Promise<void> {
  safeWrite(STORAGE_KEYS.competitions, list);
}

// Entries

export async function loadEntries(compId: string): Promise<Entry[]> {
  return safeRead<Entry[]>(STORAGE_KEYS.entries(compId), []);
}

export async function saveEntries(compId: string, entries: Entry[]): Promise<void> {
  safeWrite(STORAGE_KEYS.entries(compId), entries);
}

// Optimistic locks (advisory, best-effort)

export async function loadLocks(compId: string): Promise<Record<string, Lock>> {
  return safeRead<Record<string, Lock>>(STORAGE_KEYS.locks(compId), {});
}

export async function saveLocks(compId: string, locks: Record<string, Lock>): Promise<void> {
  safeWrite(STORAGE_KEYS.locks(compId), locks);
}

// Watch list

export async function loadWatched(): Promise<WatchItem[]> {
  return safeRead<WatchItem[]>(STORAGE_KEYS.watched, []);
}

export async function saveWatched(watched: WatchItem[]): Promise<void> {
  safeWrite(STORAGE_KEYS.watched, watched);
}

// Backup / restore

export function exportSnapshot(): { competitions: Competition[]; entries: Record<string, Entry[]> } {
  const competitions = safeRead<Competition[]>(STORAGE_KEYS.competitions, []);
  const entries: Record<string, Entry[]> = {};
  for (const comp of competitions) {
    entries[comp.id] = safeRead<Entry[]>(STORAGE_KEYS.entries(comp.id), []);
  }
  return { competitions, entries };
}

export function importSnapshot(data: {
  competitions?: Competition[];
  entries?: Record<string, Entry[]>;
}): void {
  if (!data?.competitions) throw new Error('Invalid backup — missing competitions array.');
  safeWrite(STORAGE_KEYS.competitions, data.competitions);
  for (const [compId, ents] of Object.entries(data.entries ?? {})) {
    safeWrite(STORAGE_KEYS.entries(compId), ents);
  }
}
