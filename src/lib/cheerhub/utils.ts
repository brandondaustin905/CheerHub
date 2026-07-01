import { CRITERIA } from './constants';
import type { CriteriaMap, Deduction, Entry } from './types';

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function formatScore(n: number): string {
  return Number(n).toFixed(2);
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function formatDateRange(start: string, end?: string): string {
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const s = new Date(start + 'T00:00:00').toLocaleDateString('en-CA', opts);
  if (!end || end === start) return s;
  return `${s} – ${new Date(end + 'T00:00:00').toLocaleDateString('en-CA', opts)}`;
}

export function suggestStatus(start: string, end?: string): 'upcoming' | 'live' | 'completed' {
  const today = todayISO();
  if (today < start) return 'upcoming';
  if (today > (end || start)) return 'completed';
  return 'live';
}

export function emptyCriteria(): CriteriaMap {
  return Object.fromEntries(CRITERIA.map((c) => [c.key, null]));
}

export function normalizeEntry(e: Partial<Entry> & { id: string; teamName: string }): Entry {
  let out = { ...e } as Entry;

  if (!out.criteria || typeof out.criteria !== 'object' || Array.isArray(out.criteria)) {
    out = { ...out, criteria: emptyCriteria() };
  }
  if (!Array.isArray(out.deductions)) {
    const amount = typeof (out.deductions as unknown) === 'number' ? (out.deductions as unknown as number) : 0;
    out = {
      ...out,
      deductions: amount > 0 ? [{ id: uid(), amount, reason: 'Imported deduction' }] : [],
    };
  }
  if (typeof out.flashAt !== 'number') out = { ...out, flashAt: 0 };
  if (typeof out.conflictFlag !== 'boolean') out = { ...out, conflictFlag: false };
  if (!out.division) out = { ...out, division: 'General' };

  return out;
}

export function getDeductionTotal(deductions: Deduction[]): number {
  return deductions.reduce((s, d) => s + d.amount, 0);
}

export function getGroupTotal(criteria: CriteriaMap, group: string): number {
  return CRITERIA.filter((c) => c.group === group).reduce(
    (s, c) => s + (criteria?.[c.key] ?? 0),
    0,
  );
}

export function getTotal(entry: Pick<Entry, 'criteria' | 'deductions'>): number {
  const raw = CRITERIA.reduce((s, c) => s + (entry.criteria?.[c.key] ?? 0), 0);
  return Math.max(0, Math.round((raw - getDeductionTotal(entry.deductions)) * 100) / 100);
}

export function computePlacements(
  entries: Entry[],
  scoreFn: (e: Entry) => number = (e) => getTotal(e),
): { order: Entry[]; placements: Record<string, number> } {
  const ws = entries.map((e) => ({ entry: e, score: scoreFn(e) }));
  const sorted = [...ws].sort((a, b) => b.score - a.score);
  const placements: Record<string, number> = {};
  let i = 0;
  while (i < sorted.length) {
    let j = i;
    while (j < sorted.length && sorted[j].score === sorted[i].score) j++;
    for (let k = i; k < j; k++) placements[sorted[k].entry.id] = i + 1;
    i = j;
  }
  return { order: sorted.map((s) => s.entry), placements };
}
