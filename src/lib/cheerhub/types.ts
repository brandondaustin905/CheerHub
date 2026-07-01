export type CriteriaMap = Record<string, number | null>;

export interface Deduction {
  id: string;
  amount: number;
  reason: string;
}

export interface Entry {
  id: string;
  teamName: string;
  division: string;
  criteria: CriteriaMap;
  deductions: Deduction[];
  conflictFlag: boolean;
  updatedAt: number;
  flashAt: number;
}

export interface Competition {
  id: string;
  name: string;
  venue: string;
  city: string;
  startDate: string;
  endDate: string;
  divisions: string[];
  status: CompetitionStatus;
  createdAt: number;
}

export type CompetitionStatus = 'upcoming' | 'live' | 'completed';

export interface WatchItem {
  compId: string;
  entryId: string;
  teamName: string;
}

export interface Lock {
  sid: string;
  at: number;
}

export interface ToastState {
  message: string;
  type: 'ok' | 'error';
}

export interface ScoreModalState {
  mode: 'new' | 'edit';
  division: string;
  entry?: Entry;
}

export interface Criterion {
  key: string;
  group: string;
  label: string;
  sub: string;
  max: number;
}

export interface GroupMeta {
  label: string;
  max: number;
}
