'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Lock, Unlock, Plus, X, MoreVertical, Edit3, Trash2,
  Share2, Calendar, MapPin, ChevronLeft, ChevronDown,
  Users, AlertTriangle, Eye, Download, Upload,
  Trophy, Layers, BookOpen,
} from 'lucide-react';

import Drum from './Drum';
import DivisionsTab from './DivisionsTab';
import LearnTab from './LearnTab';
import {
  COLORS, CRITERIA, GROUP_ORDER,
  DEDUCTION_STEPS, CANADIAN_DIVISIONS, EDITOR_PASSCODE,
} from '@/lib/cheerhub/constants';
import {
  loadCompetitions, saveCompetitions,
  loadEntries, saveEntries,
  loadLocks, saveLocks,
  loadWatched, saveWatched,
  exportSnapshot, importSnapshot,
  maybeSeeed,
} from '@/lib/cheerhub/storage';
import {
  uid, formatScore, todayISO, formatDateRange, suggestStatus,
  normalizeEntry, getDeductionTotal,
  getTotal, computePlacements,
} from '@/lib/cheerhub/utils';
import type {
  Entry, Competition, Deduction, ToastState, ScoreModalState,
} from '@/lib/cheerhub/types';

// Unique session ID — used for advisory edit locks.
const SESSION_ID = uid();

/* ================================================================
   UI atoms
   ================================================================ */

function Toast({ toast, onDismiss }: { toast: ToastState | null; onDismiss: () => void }) {
  if (!toast) return null;
  return (
    <button
      onClick={onDismiss}
      className="fixed bottom-6 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:max-w-sm px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg z-50 text-left"
      style={{ background: toast.type === 'error' ? COLORS.coral : COLORS.greenOk, color: COLORS.ink }}
    >
      {toast.message}
    </button>
  );
}

function ModalShell({
  title, onClose, children, wide,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4"
      style={{ overscrollBehavior: 'none' }}
    >
      <div
        className={`w-full ${wide ? 'sm:max-w-lg' : 'sm:max-w-sm'} rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto`}
        style={{ background: COLORS.court, overscrollBehavior: 'contain' }}
        onTouchMove={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: COLORS.courtLight }}
        >
          <h2 className="chl-display text-xl" style={{ color: COLORS.chalk }}>{title}</h2>
          <button onClick={onClose} className="p-1" style={{ color: COLORS.mist }}>
            <X size={20} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function PrimaryButton({
  children, onClick, disabled, danger,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-3 rounded-xl font-semibold transition disabled:opacity-40"
      style={{ background: danger ? COLORS.coral : COLORS.gold, color: COLORS.ink }}
    >
      {children}
    </button>
  );
}

function TextField({
  label, ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block mb-4">
      <span className="block text-xs uppercase tracking-wide mb-1.5" style={{ color: COLORS.mist }}>
        {label}
      </span>
      <input
        {...props}
        className="w-full px-3 py-2.5 rounded-lg outline-none"
        style={{ background: COLORS.ink, color: COLORS.chalk, border: `1px solid ${COLORS.courtLight}` }}
      />
    </label>
  );
}

/* ================================================================
   Deduction editor
   ================================================================ */

function deductionLabel(i: number): string {
  return (i * 0.25).toFixed(2);
}

function DeductionEditor({
  deductions, onAdd, onRemove,
}: {
  deductions: Deduction[];
  onAdd: (amount: number, reason: string) => void;
  onRemove: (id: string) => void;
}) {
  const [stepIdx, setStepIdx] = useState(4); // default 1.00
  const [reason, setReason]   = useState('');
  const total  = deductions.reduce((s, d) => s + d.amount, 0);
  const amount = stepIdx * 0.25;

  return (
    <div className="p-2.5 rounded-xl" style={{ background: COLORS.ink, border: `1px solid ${COLORS.courtLight}` }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase tracking-wide font-semibold" style={{ color: COLORS.mist }}>
          Deduction
        </span>
        {total > 0 && (
          <span className="chl-mono text-xs" style={{ color: COLORS.coral }}>
            -{formatScore(total)} applied
          </span>
        )}
      </div>

      {deductions.length > 0 && (
        <div className="space-y-1 mb-2" style={{ maxHeight: 80, overflowY: 'auto' }}>
          {deductions.map((d) => (
            <div
              key={d.id}
              className="flex items-center gap-2 px-2 py-1 rounded-lg"
              style={{ background: COLORS.courtLight }}
            >
              <span className="chl-mono text-xs shrink-0" style={{ color: COLORS.coral }}>
                -{formatScore(d.amount)}
              </span>
              <span className="text-[11px] flex-1 truncate" style={{ color: COLORS.chalk }}>
                {d.reason || 'Deduction'}
              </span>
              <button onClick={() => onRemove(d.id)} style={{ color: COLORS.mist }}>
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1 shrink-0">
          <span className="chl-display text-sm" style={{ color: COLORS.coral }}>-</span>
          <Drum
            values={DEDUCTION_STEPS}
            value={stepIdx}
            onChange={setStepIdx}
            renderLabel={deductionLabel}
            width={48}
            itemHeight={20}
            visibleCount={3}
            textSize="text-xs"
          />
        </div>
        <div className="flex-1 min-w-0">
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder='e.g. "OOB tumbling pass"'
            className="w-full px-2 py-1.5 rounded-lg text-[11px] outline-none mb-1.5"
            style={{ background: COLORS.courtLight, color: COLORS.chalk }}
          />
          <button
            onClick={() => { onAdd(amount, reason.trim() || 'Deduction'); setReason(''); }}
            disabled={amount === 0}
            className="w-full py-1.5 rounded-lg text-xs font-semibold disabled:opacity-40"
            style={{ background: COLORS.coral, color: COLORS.ink }}
          >
            Apply -{amount.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   Team score modal
   ================================================================ */

interface TeamScoreModalProps {
  mode: 'new' | 'edit';
  division: string;
  entry?: Entry;
  compId: string;
  onSubmit: (data: { teamName: string; division: string; criteria: Record<string, number | null>; deductions: Deduction[] }) => void;
  onDelete?: () => void;
  onClose: () => void;
}

function TeamScoreModal({ mode, division, entry, compId, onSubmit, onDelete, onClose }: TeamScoreModalProps) {
  const [teamName, setTeamName] = useState(entry?.teamName ?? '');

  const initScore = (() => {
    const c = entry?.criteria ?? {};
    if ((c.total as number | null) != null) return c.total as number;
    if (GROUP_ORDER.some((k) => ((c[k] as number | null) ?? 0) > 0)) {
      return GROUP_ORDER.reduce((s, k) => s + (((c[k] as number | null) ?? 0)), 0);
    }
    return CRITERIA.reduce((s, cr) => s + (c[cr.key] ?? 0), 0);
  })();
  const [scoreWhole, setScoreWhole] = useState(Math.floor(initScore));
  const [scoreDec,   setScoreDec]   = useState(Math.round((initScore % 1) * 100));

  const [deductions,     setDeductions]     = useState<Deduction[]>(entry?.deductions ?? []);
  const [otherEditing,   setOtherEditing]   = useState(false);
  const [confirmDelete,  setConfirmDelete]  = useState(false);

  const dedTotal   = getDeductionTotal(deductions);
  const drumVal    = scoreWhole + scoreDec / 100;
  const finalTotal = Math.max(0, Math.round((drumVal - dedTotal) * 100) / 100);
  const wholeVals  = Array.from({ length: 151 }, (_, i) => i);
  const decVals    = Array.from({ length: 100 }, (_, i) => i);

  // Advisory lock — prevents two editors from simultaneously writing the same entry.
  useEffect(() => {
    if (mode !== 'edit' || !entry) return;
    let alive = true;

    async function touchLock() {
      try {
        const locks = await loadLocks(compId);
        const existing = locks[entry!.id];
        if (alive) {
          setOtherEditing(
            !!(existing && existing.sid !== SESSION_ID && Date.now() - existing.at < 15_000),
          );
        }
        locks[entry!.id] = { sid: SESSION_ID, at: Date.now() };
        await saveLocks(compId, locks);
      } catch { /* best-effort */ }
    }

    touchLock();
    const interval = setInterval(touchLock, 8_000);

    return () => {
      alive = false;
      clearInterval(interval);
      loadLocks(compId).then((locks) => {
        if (locks[entry!.id]?.sid === SESSION_ID) {
          delete locks[entry!.id];
          saveLocks(compId, locks).catch(() => {});
        }
      }).catch(() => {});
    };
  }, [mode, entry, compId]);

  function handleSubmit() {
    onSubmit({ teamName: teamName.trim(), division, criteria: { total: drumVal }, deductions });
  }

  return (
    <ModalShell title={mode === 'edit' ? `Edit — ${entry!.teamName}` : 'Add score'} onClose={onClose} wide>
      {otherEditing && (
        <div
          className="flex items-center gap-2 mb-3 p-2.5 rounded-lg"
          style={{ background: 'rgba(255,77,94,0.12)', border: `1px solid ${COLORS.coral}` }}
        >
          <Eye size={14} style={{ color: COLORS.coral }} className="shrink-0" />
          <p className="text-xs" style={{ color: COLORS.coral }}>
            Someone else has this open — drums locked to prevent double-entry.
          </p>
        </div>
      )}

      {/* Score drum */}
      <div className="flex items-center justify-center gap-2 mb-1">
        <Drum
          key="score-whole"
          values={wholeVals}
          value={scoreWhole}
          onChange={setScoreWhole}
          disabled={otherEditing}
          width={80}
        />
        <span className="chl-display text-3xl pb-1" style={{ color: COLORS.chalk }}>.</span>
        <Drum
          key="score-dec"
          values={decVals}
          value={scoreDec}
          onChange={setScoreDec}
          disabled={otherEditing}
        />
      </div>

      {/* Deduction editor */}
      <DeductionEditor
        deductions={deductions}
        onAdd={(amount, reason) => setDeductions([...deductions, { id: uid(), amount, reason }])}
        onRemove={(id) => setDeductions(deductions.filter((d) => d.id !== id))}
      />

      {/* Team name — at the bottom so no scrolling required to start scoring */}
      {mode === 'new' && (
        <div
          className="mb-4 p-3 rounded-xl"
          style={{
            background: COLORS.ink,
            border: `2px solid ${teamName.trim() ? COLORS.greenOk : COLORS.gold}`,
          }}
        >
          <span
            className="block text-xs uppercase tracking-wide mb-1.5"
            style={{ color: teamName.trim() ? COLORS.greenOk : COLORS.gold }}
          >
            Last step · Team / gym name (required)
          </span>
          <input
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="e.g. Aubree's All-Stars Senior 5"
            className="w-full px-3 py-2.5 rounded-lg outline-none"
            style={{ background: COLORS.court, color: COLORS.chalk, border: `1px solid ${COLORS.courtLight}` }}
          />
        </div>
      )}

      <PrimaryButton disabled={mode === 'new' && !teamName.trim()} onClick={handleSubmit}>
        {mode === 'edit' ? 'Save score' : 'Add team & score'}
      </PrimaryButton>
      {mode === 'new' && !teamName.trim() && (
        <p className="text-center text-xs mt-2" style={{ color: COLORS.coral }}>
          Enter a team / gym name above to enable saving.
        </p>
      )}

      {mode === 'edit' && onDelete && (
        confirmDelete ? (
          <div className="mt-3 p-3 rounded-xl" style={{ background: COLORS.ink, border: `1px solid ${COLORS.coral}` }}>
            <p className="text-sm mb-2" style={{ color: COLORS.chalk }}>Delete this entry? Cannot be undone.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 py-2 rounded-lg text-sm"
                style={{ background: COLORS.courtLight, color: COLORS.chalk }}
              >
                Cancel
              </button>
              <button
                onClick={onDelete}
                className="flex-1 py-2 rounded-lg text-sm font-semibold"
                style={{ background: COLORS.coral, color: COLORS.ink }}
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="w-full mt-3 py-2.5 text-sm font-medium"
            style={{ color: COLORS.coral }}
          >
            Delete entry
          </button>
        )
      )}
    </ModalShell>
  );
}

/* ================================================================
   Data backup / restore panel
   ================================================================ */

function DataPanel({ onClose, showToast }: { onClose: () => void; showToast: (msg: string, type?: 'ok' | 'error') => void }) {
  const [exportJson, setExportJson] = useState('');
  const [importText, setImportText] = useState('');
  const [busy, setBusy]             = useState(false);

  function handleExport() {
    setBusy(true);
    try {
      const snapshot = exportSnapshot();
      setExportJson(JSON.stringify(snapshot, null, 2));
      showToast('Data exported — copy the text below');
    } catch (err) {
      showToast(`Export failed: ${(err as Error).message}`, 'error');
    }
    setBusy(false);
  }

  function handleImport() {
    setBusy(true);
    try {
      const data = JSON.parse(importText);
      importSnapshot(data);
      showToast('Data restored — your competitions are back');
      setImportText('');
    } catch (err) {
      showToast(`Import failed: ${(err as Error).message}`, 'error');
    }
    setBusy(false);
  }

  return (
    <ModalShell title="Backup & restore" onClose={onClose}>
      <p className="text-sm mb-4" style={{ color: COLORS.mist }}>
        Export your data before clearing browser storage, or to share it between devices.
      </p>

      <button
        onClick={handleExport}
        disabled={busy}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold mb-3 disabled:opacity-40"
        style={{ background: COLORS.courtLight, color: COLORS.chalk }}
      >
        <Download size={16} /> Export all data
      </button>

      {exportJson && (
        <div className="mb-4">
          <span className="block text-xs uppercase tracking-wide mb-1.5" style={{ color: COLORS.mist }}>
            Copy this JSON to keep a backup
          </span>
          <textarea
            readOnly
            value={exportJson}
            rows={5}
            onFocus={(e) => e.target.select()}
            className="w-full px-3 py-2 rounded-lg text-xs outline-none chl-mono"
            style={{
              background: COLORS.ink, color: COLORS.greenOk,
              border: `1px solid ${COLORS.courtLight}`, resize: 'none',
            }}
          />
        </div>
      )}

      <div className="border-t pt-4 mt-2" style={{ borderColor: COLORS.courtLight }}>
        <span className="block text-xs uppercase tracking-wide mb-1.5" style={{ color: COLORS.mist }}>
          Paste exported data to restore
        </span>
        <textarea
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          placeholder="Paste your backup JSON here…"
          rows={4}
          className="w-full px-3 py-2 rounded-lg text-xs outline-none chl-mono mb-3"
          style={{
            background: COLORS.ink, color: COLORS.chalk,
            border: `1px solid ${COLORS.courtLight}`, resize: 'none',
          }}
        />
        <button
          onClick={handleImport}
          disabled={busy || !importText.trim()}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold disabled:opacity-40"
          style={{ background: COLORS.gold, color: COLORS.ink }}
        >
          <Upload size={16} /> Restore data
        </button>
      </div>
    </ModalShell>
  );
}

/* ================================================================
   Per-entry context menu
   ================================================================ */

type EntryAction = 'edit' | 'share' | 'watch' | 'discrepancy' | 'delete';

function EntryMenu({
  canEdit, onAction, onClose,
}: {
  canEdit: boolean;
  onAction: (a: EntryAction) => void;
  onClose: () => void;
}) {
  function item(action: EntryAction, Icon: React.ElementType, label: string, danger = false) {
    return (
      <button
        onClick={() => { onAction(action); onClose(); }}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left"
        style={{ color: danger ? COLORS.coral : COLORS.chalk }}
      >
        <Icon size={15} /> {label}
      </button>
    );
  }

  return (
    <div
      className="absolute right-0 top-9 z-30 w-52 rounded-xl shadow-xl overflow-hidden"
      style={{ background: COLORS.courtLight }}
    >
      {canEdit && item('edit', Edit3, 'Edit score')}
      {item('share', Share2, 'Share result')}
      {item('discrepancy', AlertTriangle, 'Flag discrepancy')}
      {canEdit && (
        <>
          <div className="mx-3 border-t" style={{ borderColor: COLORS.court }} />
          {item('delete', Trash2, 'Delete entry', true)}
        </>
      )}
    </div>
  );
}

/* ================================================================
   Team row
   ================================================================ */

const MAX_SCORE = 150;

function TeamRow({
  entry, placement, canEdit, onAction,
}: {
  entry: Entry;
  placement: number;
  canEdit: boolean;
  onAction: (a: EntryAction) => void;
}) {
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [confirmDel,  setConfirmDel]  = useState(false);
  const [flashing,    setFlashing]    = useState(false);
  const prevFlash = useRef(entry.flashAt);

  useEffect(() => {
    if (entry.flashAt && entry.flashAt !== prevFlash.current) {
      prevFlash.current = entry.flashAt;
      setFlashing(true);
      setTimeout(() => setFlashing(false), 1_600);
    }
  }, [entry.flashAt]);

  const medalColor = placement === 1 ? COLORS.gold
    : placement === 2 ? '#C9D3E0'
    : placement === 3 ? '#D98E5C'
    : COLORS.mist;

  const medalBg = placement === 1 ? 'rgba(242,183,5,0.15)'
    : placement === 2 ? 'rgba(201,211,224,0.10)'
    : placement === 3 ? 'rgba(217,142,92,0.10)'
    : 'transparent';

  const total    = getTotal(entry);
  const dedTotal = getDeductionTotal(entry.deductions);
  const isSimple = (entry.criteria?.total as number | null) != null;
  const hasGroupScores = !isSimple && GROUP_ORDER.some((k) => ((entry.criteria?.[k] as number | null) ?? 0) > 0);
  const filled      = isSimple ? 1
    : hasGroupScores ? GROUP_ORDER.filter((k) => ((entry.criteria?.[k] as number | null) ?? 0) > 0).length
    : CRITERIA.filter((c) => (entry.criteria?.[c.key] ?? 0) > 0).length;
  const filledOf    = isSimple ? 1 : hasGroupScores ? GROUP_ORDER.length : CRITERIA.length;
  const filledLabel = isSimple ? 'score' : hasGroupScores ? 'groups' : 'criteria';
  const pct      = Math.min(100, (total / MAX_SCORE) * 100);

  return (
    <div
      className="relative rounded-xl mb-2"
      style={{ background: COLORS.court }}
    >
      {/* Score fill bar + flash — clipped to card corners without clipping the menu */}
      <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
        <div
          className="absolute left-0 top-0 bottom-0 transition-all duration-700"
          style={{ width: `${pct}%`, background: 'rgba(242,183,5,0.055)' }}
        />
        {flashing && <div className="absolute inset-0 chl-flash" />}
      </div>

      <div className="relative flex items-center gap-3 px-4 py-3">
        {/* Placement circle */}
        <div
          className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center"
          style={{ background: medalBg, border: `1.5px solid ${medalColor}` }}
        >
          <span className="chl-display text-base leading-none" style={{ color: medalColor }}>
            {placement}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold truncate" style={{ color: COLORS.chalk }}>{entry.teamName}</span>
            {entry.conflictFlag && <AlertTriangle size={12} style={{ color: COLORS.gold }} />}
          </div>
          <div className="flex items-center gap-2 text-xs mt-0.5" style={{ color: COLORS.mist }}>
            <span>{filled}/{filledOf} {filledLabel}</span>
            {dedTotal > 0 && (
              <span style={{ color: COLORS.coral }}>-{formatScore(dedTotal)} ded.</span>
            )}
          </div>
          {entry.deductions.length > 0 && (
            <div className="mt-1 space-y-0.5">
              {entry.deductions.map((d) => (
                <div key={d.id} className="flex items-center gap-1.5 text-[11px]" style={{ color: COLORS.mist }}>
                  <span className="shrink-0" style={{ color: COLORS.coral }}>
                    -{formatScore(d.amount)}
                  </span>
                  <span className="truncate">{d.reason}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Score */}
        <div className="shrink-0 text-right">
          <div
            className="chl-mono text-xl leading-none"
            style={{ color: placement <= 3 ? medalColor : COLORS.chalk }}
          >
            {formatScore(total)}
          </div>
          <div className="text-[10px] mt-0.5" style={{ color: COLORS.mist }}>/150 pts</div>
        </div>

        <div className="relative shrink-0 flex items-center gap-1">
          {canEdit && (
            <button
              onClick={() => setConfirmDel((v) => !v)}
              className="p-1"
              style={{ color: confirmDel ? COLORS.coral : COLORS.mist }}
            >
              <Trash2 size={16} />
            </button>
          )}
          <button onClick={() => setMenuOpen((v) => !v)} className="p-1" style={{ color: COLORS.mist }}>
            <MoreVertical size={18} />
          </button>
          {menuOpen && (
            <EntryMenu canEdit={canEdit} onAction={onAction} onClose={() => setMenuOpen(false)} />
          )}
        </div>
      </div>

      {confirmDel && (
        <div
          className="flex items-center gap-2 px-4 py-2.5 border-t"
          style={{ borderColor: COLORS.courtLight }}
        >
          <span className="flex-1 text-xs" style={{ color: COLORS.mist }}>Delete {entry.teamName}?</span>
          <button
            onClick={() => setConfirmDel(false)}
            className="px-3 py-1.5 rounded-lg text-xs"
            style={{ background: COLORS.courtLight, color: COLORS.chalk }}
          >
            Cancel
          </button>
          <button
            onClick={() => onAction('delete')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{ background: COLORS.coral, color: COLORS.ink }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

/* ================================================================
   Division checklist (competition form)
   ================================================================ */

function DivisionChecklist({
  selected, onToggle,
}: {
  selected: string[];
  onToggle: (div: string) => void;
}) {
  return (
    <div
      className="rounded-xl overflow-y-auto"
      style={{ maxHeight: 224, border: `1px solid ${COLORS.courtLight}` }}
    >
      {Object.entries(CANADIAN_DIVISIONS).map(([group, divs]) => (
        <div key={group}>
          <div
            className="px-3 py-2 text-[10px] uppercase tracking-widest sticky top-0 z-10"
            style={{ background: COLORS.ink, color: COLORS.mist }}
          >
            {group}
          </div>
          {divs.map((div) => {
            const on = selected.includes(div);
            return (
              <button
                key={div}
                onClick={() => onToggle(div)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left"
                style={{ background: on ? COLORS.court : 'transparent' }}
              >
                <div
                  className="w-4 h-4 rounded shrink-0 flex items-center justify-center"
                  style={{ background: on ? COLORS.gold : COLORS.courtLight }}
                >
                  {on && <span style={{ color: COLORS.ink, fontSize: 10, lineHeight: 1 }}>✓</span>}
                </div>
                <span style={{ color: on ? COLORS.gold : COLORS.chalk }}>{div}</span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* ================================================================
   Competition form modal
   ================================================================ */

interface CompetitionFormModalProps {
  initial?: Competition;
  onSave: (data: Omit<Competition, 'id' | 'createdAt'>) => void;
  onClose: () => void;
  onDelete?: () => void;
}

function CompetitionFormModal({ initial, onSave, onClose, onDelete }: CompetitionFormModalProps) {
  const [name,      setName]      = useState(initial?.name ?? '');
  const [venue,     setVenue]     = useState(initial?.venue ?? '');
  const [city,      setCity]      = useState(initial?.city ?? '');
  const [startDate, setStartDate] = useState(initial?.startDate ?? todayISO());
  const [endDate,   setEndDate]   = useState(initial?.endDate ?? '');
  const [divisions, setDivisions] = useState<string[]>(initial?.divisions ?? []);
  const [customDiv, setCustomDiv] = useState('');
  const [status,    setStatus]    = useState(initial?.status ?? suggestStatus(startDate, endDate));
  const [showList,  setShowList]  = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function toggleDivision(div: string) {
    setDivisions((prev) => prev.includes(div) ? prev.filter((d) => d !== div) : [...prev, div]);
  }

  function addCustom() {
    const v = customDiv.trim();
    if (v && !divisions.includes(v)) setDivisions((prev) => [...prev, v]);
    setCustomDiv('');
  }

  return (
    <ModalShell title={initial ? 'Edit competition' : 'New competition'} onClose={onClose} wide>
      <TextField label="Event name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Wild West Regionals" />
      <div className="grid grid-cols-2 gap-3">
        <TextField label="Venue / facility" value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="e.g. Scotiabank Arena" />
        <TextField label="City / province" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Toronto, ON" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <TextField label="Start date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <TextField label="End date (opt.)" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>

      {/* Divisions */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase tracking-wide" style={{ color: COLORS.mist }}>Divisions</span>
          <button onClick={() => setShowList((v) => !v)} className="text-xs flex items-center gap-1" style={{ color: COLORS.gold }}>
            {showList ? 'Done' : 'Pick from list'}
            <ChevronDown size={12} style={{ transform: showList ? 'rotate(180deg)' : 'none' }} />
          </button>
        </div>
        {divisions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {divisions.map((d) => (
              <span key={d} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs" style={{ background: COLORS.gold, color: COLORS.ink }}>
                {d}
                <button onClick={() => toggleDivision(d)}><X size={10} /></button>
              </span>
            ))}
          </div>
        )}
        {showList && <DivisionChecklist selected={divisions} onToggle={toggleDivision} />}
        <div className="flex gap-2 mt-2">
          <input
            value={customDiv}
            onChange={(e) => setCustomDiv(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustom(); } }}
            placeholder="Custom division — press Enter"
            className="flex-1 px-3 py-2 rounded-lg outline-none text-sm"
            style={{ background: COLORS.ink, color: COLORS.chalk, border: `1px solid ${COLORS.courtLight}` }}
          />
        </div>
        {divisions.length === 0 && (
          <p className="text-xs mt-1" style={{ color: COLORS.mist }}>
            Leave empty for a single "General" leaderboard.
          </p>
        )}
      </div>

      {/* Status */}
      <div className="mb-5">
        <span className="block text-xs uppercase tracking-wide mb-1.5" style={{ color: COLORS.mist }}>Status</span>
        <div className="flex gap-2">
          {(['upcoming', 'live', 'completed'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className="flex-1 py-2 rounded-lg text-sm font-medium capitalize"
              style={{
                background: status === s ? COLORS.gold : COLORS.ink,
                color:      status === s ? COLORS.ink  : COLORS.mist,
                border:     `1px solid ${COLORS.courtLight}`,
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <PrimaryButton
        disabled={!name.trim()}
        onClick={() => onSave({ name: name.trim(), venue: venue.trim(), city: city.trim(), startDate, endDate: endDate || startDate, divisions, status })}
      >
        {initial ? 'Save changes' : 'Create competition'}
      </PrimaryButton>

      {initial && onDelete && (
        confirmDelete ? (
          <div className="mt-3 p-3 rounded-xl" style={{ background: COLORS.ink, border: `1px solid ${COLORS.coral}` }}>
            <p className="text-sm mb-2" style={{ color: COLORS.chalk }}>
              Delete this competition and all its scores? Cannot be undone.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDelete(false)} className="flex-1 py-2 rounded-lg text-sm" style={{ background: COLORS.courtLight, color: COLORS.chalk }}>
                Cancel
              </button>
              <button onClick={onDelete} className="flex-1 py-2 rounded-lg text-sm font-semibold" style={{ background: COLORS.coral, color: COLORS.ink }}>
                Delete
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setConfirmDelete(true)} className="w-full mt-3 py-2.5 text-sm font-medium" style={{ color: COLORS.coral }}>
            Delete competition
          </button>
        )
      )}
    </ModalShell>
  );
}

/* ================================================================
   Passcode modal
   ================================================================ */

function PasscodeModal({ onUnlock, onClose }: { onUnlock: () => void; onClose: () => void }) {
  const [code,  setCode]  = useState('');
  const [error, setError] = useState(false);

  function tryUnlock() {
    code === EDITOR_PASSCODE ? onUnlock() : setError(true);
  }

  return (
    <ModalShell title="Unlock editing" onClose={onClose}>
      <p className="text-sm mb-4" style={{ color: COLORS.mist }}>
        Enter the passcode shared with premium Cheer Hub members.
      </p>
      <TextField
        label="Passcode"
        type="password"
        value={code}
        onChange={(e) => { setCode(e.target.value); setError(false); }}
        onKeyDown={(e) => e.key === 'Enter' && tryUnlock()}
      />
      {error && <p className="text-sm mb-3" style={{ color: COLORS.coral }}>That passcode did not match — try again.</p>}
      <PrimaryButton onClick={tryUnlock}>Unlock</PrimaryButton>
    </ModalShell>
  );
}

/* ================================================================
   Division section
   ================================================================ */

function DivisionSection({
  name, entries, canEdit, onAddScore, onEntryAction, showLabel = true,
}: {
  name: string;
  entries: Entry[];
  canEdit: boolean;
  onAddScore: () => void;
  onEntryAction: (e: Entry, a: EntryAction) => void;
  showLabel?: boolean;
}) {
  const { order, placements } = computePlacements(entries);
  return (
    <div className="mb-6">
      {/* Header — suppressed when a tab bar already shows the division name */}
      {showLabel && (
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <h3 className="chl-display text-lg" style={{ color: COLORS.gold }}>{name}</h3>
            <span className="text-xs flex items-center gap-1" style={{ color: COLORS.mist }}>
              <Users size={12} /> {entries.length}
            </span>
          </div>
          {canEdit && (
            <button
              onClick={onAddScore}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background: COLORS.gold, color: COLORS.ink }}
            >
              <Plus size={13} /> Add Score
            </button>
          )}
        </div>
      )}

      {order.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-14 rounded-2xl"
          style={{ background: COLORS.court, border: `1px dashed ${COLORS.courtLight}` }}
        >
          <Users size={28} style={{ color: COLORS.courtLight }} />
          <p className="text-sm mt-3 font-medium" style={{ color: COLORS.mist }}>
            No teams scored yet
          </p>
          {canEdit && (
            <button
              onClick={onAddScore}
              className="mt-4 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold"
              style={{ background: COLORS.gold, color: COLORS.ink }}
            >
              <Plus size={13} /> Add first score
            </button>
          )}
        </div>
      ) : (
        order.map((entry) => (
          <TeamRow
            key={entry.id}
            entry={entry}
            placement={placements[entry.id]}
            canEdit={canEdit}
            onAction={(action) => onEntryAction(entry, action)}
          />
        ))
      )}
    </div>
  );
}

/* ================================================================
   Competition detail screen
   ================================================================ */

function CompetitionDetail({
  comp, canEdit, onBack, onEditComp, showToast,
}: {
  comp: Competition;
  canEdit: boolean;
  onBack: () => void;
  onEditComp: (c: Competition) => void;
  showToast: (msg: string, type?: 'ok' | 'error') => void;
}) {
  const [entries,      setEntries]      = useState<Entry[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [scoreModal,   setScoreModal]   = useState<ScoreModalState | null>(null);
  const [selectedDiv,  setSelectedDiv]  = useState('');
  const prevEntriesRef                  = useRef<Entry[]>([]);

  const refresh = useCallback(async () => {
    try {
      const fresh = (await loadEntries(comp.id)).map(normalizeEntry);

      // Notify watched teams on score change.
      if (prevEntriesRef.current.length > 0) {
        const watched = await loadWatched();
        watched
          .filter((w) => w.compId === comp.id)
          .forEach((w) => {
            const prev = prevEntriesRef.current.find((e) => e.id === w.entryId);
            const curr = fresh.find((e) => e.id === w.entryId);
            if (prev && curr && getTotal(prev) !== getTotal(curr)) {
              showToast(`Score update: ${w.teamName} — now ${formatScore(getTotal(curr))}`);
            }
          });
      }

      prevEntriesRef.current = fresh;
      setEntries(fresh);
    } catch { /* keep current list */ }
    finally { setLoading(false); }
  }, [comp.id, showToast]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 5_000);
    return () => clearInterval(interval);
  }, [refresh]);

  const divisions  = comp.divisions?.length ? comp.divisions : ['General'];
  const activeDiv  = divisions.includes(selectedDiv) ? selectedDiv : divisions[0];

  // Sync tab selection when divisions change.
  useEffect(() => {
    if (!divisions.includes(selectedDiv)) setSelectedDiv(divisions[0]);
  }, [divisions, selectedDiv]);

  async function persist(nextEntries: Entry[]) {
    setEntries(nextEntries);
    try {
      await saveEntries(comp.id, nextEntries);
    } catch (err) {
      showToast(`Could not save: ${(err as Error)?.message ?? 'check your connection.'}`, 'error');
      refresh();
    }
  }

  async function handleScoreSubmit({
    teamName, division, criteria, deductions,
  }: { teamName: string; division: string; criteria: Record<string, number | null>; deductions: Deduction[] }) {
    const latest = (await loadEntries(comp.id)).map(normalizeEntry);

    if (scoreModal?.mode === 'new') {
      const newEntry: Entry = {
        id: uid(), teamName, division,
        criteria: criteria as Record<string, number | null>,
        deductions, conflictFlag: false,
        updatedAt: Date.now(), flashAt: Date.now(),
      };
      await persist([...latest, newEntry]);
      showToast(`${teamName} added — ${formatScore(getTotal(newEntry))}`);
    } else if (scoreModal?.entry) {
      const idx = latest.findIndex((e) => e.id === scoreModal.entry!.id);
      if (idx === -1) {
        showToast('That entry was deleted by someone else.', 'error');
        setScoreModal(null);
        return;
      }
      const prevEntry  = latest[idx];
      const oldTotal   = getTotal(prevEntry);
      const updated: Entry = {
        ...prevEntry,
        criteria: criteria as Record<string, number | null>,
        deductions,
        updatedAt: Date.now(),
        flashAt: Date.now(),
      };
      const newTotal  = getTotal(updated);
      const bigChange = Math.abs(newTotal - oldTotal) > 5;
      updated.conflictFlag = bigChange;
      await persist(latest.map((e, i) => (i === idx ? updated : e)));
      showToast(
        bigChange
          ? `Large change (${newTotal > oldTotal ? '+' : ''}${(newTotal - oldTotal).toFixed(2)}) — double-check`
          : `${teamName} updated — ${formatScore(newTotal)}`,
        bigChange ? 'error' : 'ok',
      );
    }
    setScoreModal(null);
  }

  async function handleEntryAction(entry: Entry, action: EntryAction) {
    if (action === 'edit') {
      setScoreModal({ mode: 'edit', division: entry.division, entry });
      return;
    }
    if (action === 'delete') {
      await persist(entries.filter((e) => e.id !== entry.id));
      showToast('Entry deleted');
      return;
    }
    if (action === 'share') {
      const total = getTotal(entry);
      const divEntries = entries.filter((e) => (e.division || 'General') === (entry.division || 'General'));
      const place      = computePlacements(divEntries).placements[entry.id];
      const placeStr   = place === 1 ? '1st 🥇' : place === 2 ? '2nd 🥈' : place === 3 ? '3rd 🥉' : `${place}th`;
      const text = `${entry.teamName} is currently in ${placeStr} place with a ${formatScore(total)} at ${comp.name}! 🎀\n\nTrack live on Cheer Hub — community-reported, updated in real time.\n(Not official results)`;
      if (navigator.share) {
        try { await navigator.share({ title: 'Cheer Hub Live Scores', text }); } catch { /* cancelled */ }
      } else {
        try { await navigator.clipboard.writeText(text); showToast('Copied to clipboard'); } catch { /* no permission */ }
      }
      return;
    }
    if (action === 'watch') {
      try {
        const watched = await loadWatched();
        const exists  = watched.find((w) => w.entryId === entry.id && w.compId === comp.id);
        const next    = exists
          ? watched.filter((w) => !(w.entryId === entry.id && w.compId === comp.id))
          : [...watched, { compId: comp.id, entryId: entry.id, teamName: entry.teamName }];
        await saveWatched(next);
        showToast(exists ? `${entry.teamName} removed from watch list` : `Watching ${entry.teamName}`);
      } catch { showToast('Watch list update failed.', 'error'); }
      return;
    }
    if (action === 'discrepancy') {
      showToast('Discrepancy reported — thanks for keeping scores accurate');
    }
  }

  const isLive     = comp.status === 'live';
  const totalTeams = entries.length;
  const divCount   = divisions.length;

  return (
    <div className="chl-root min-h-screen pb-28" style={{ background: COLORS.ink }}>

      {/* ── Hero header ───────────────────────────────────────── */}
      <div style={{ background: `linear-gradient(180deg, ${COLORS.court} 0%, ${COLORS.ink} 100%)` }}>
        <div className="max-w-2xl mx-auto px-4 pt-5 pb-0">

          {/* Nav row */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-sm"
              style={{ color: COLORS.mist }}
            >
              <ChevronLeft size={16} /> All competitions
            </button>
            {canEdit && (
              <button
                onClick={() => onEditComp(comp)}
                className="p-2 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                <Edit3 size={15} style={{ color: COLORS.mist }} />
              </button>
            )}
          </div>

          {/* Status + title */}
          {isLive && (
            <div className="flex items-center gap-1.5 mb-2">
              <span
                className="w-2 h-2 rounded-full chl-pulse"
                style={{ background: COLORS.coral }}
              />
              <span className="text-xs font-bold tracking-widest" style={{ color: COLORS.coral }}>
                LIVE
              </span>
            </div>
          )}
          <h1 className="chl-display text-3xl leading-tight" style={{ color: COLORS.chalk }}>
            {comp.name}
          </h1>
          <div className="flex flex-wrap gap-3 mt-2 text-sm" style={{ color: COLORS.mist }}>
            <span className="flex items-center gap-1">
              <Calendar size={13} /> {formatDateRange(comp.startDate, comp.endDate)}
            </span>
            {(comp.venue || comp.city) && (
              <span className="flex items-center gap-1">
                <MapPin size={13} /> {[comp.venue, comp.city].filter(Boolean).join(', ')}
              </span>
            )}
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-2 mt-5 mb-5">
            {[
              { value: totalTeams, label: 'Teams' },
              { value: divCount,   label: divCount === 1 ? 'Division' : 'Divisions' },
              { value: isLive ? 'Live' : comp.status === 'upcoming' ? 'Soon' : 'Final', label: 'Status' },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="text-center py-2.5 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.045)' }}
              >
                <div className="chl-display text-2xl leading-none" style={{ color: COLORS.gold }}>
                  {value}
                </div>
                <div className="text-[10px] uppercase tracking-wide mt-1" style={{ color: COLORS.mist }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Division tabs ──────────────────────────────────── */}
        {divisions.length > 1 && (
          <div
            className="border-b overflow-x-auto chl-no-scrollbar"
            style={{ borderColor: COLORS.courtLight }}
          >
            <div className="max-w-2xl mx-auto px-4 flex gap-0 min-w-max">
              {divisions.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDiv(d)}
                  className="px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors"
                  style={{
                    color:       d === activeDiv ? COLORS.gold : COLORS.mist,
                    borderColor: d === activeDiv ? COLORS.gold : 'transparent',
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Disclaimer ────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-4 mt-4">
        <div
          className="flex items-center gap-2 p-3 rounded-xl mb-4"
          style={{ background: COLORS.court, border: `1px solid ${COLORS.courtLight}` }}
        >
          <AlertTriangle size={14} style={{ color: COLORS.gold }} className="shrink-0" />
          <p className="text-xs" style={{ color: COLORS.mist }}>
            Community-reported — educated estimates, not official results.
          </p>
        </div>

        {/* ── Action bar (shown when tabs hide the division label) ── */}
        {divisions.length > 1 && !loading && (
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs flex items-center gap-1.5" style={{ color: COLORS.mist }}>
              <Users size={12} />
              {entries.filter((e) => (e.division || 'General') === activeDiv).length} team
              {entries.filter((e) => (e.division || 'General') === activeDiv).length !== 1 ? 's' : ''}
            </span>
            {canEdit && (
              <button
                onClick={() => setScoreModal({ mode: 'new', division: activeDiv })}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: COLORS.gold, color: COLORS.ink }}
              >
                <Plus size={13} /> Add Score
              </button>
            )}
          </div>
        )}

        {/* ── Leaderboard ───────────────────────────────────── */}
        {loading ? (
          <p style={{ color: COLORS.mist }}>Loading…</p>
        ) : (
          <DivisionSection
            name={activeDiv}
            entries={entries.filter((e) => (e.division || 'General') === activeDiv)}
            canEdit={canEdit}
            onAddScore={() => setScoreModal({ mode: 'new', division: activeDiv })}
            onEntryAction={handleEntryAction}
            showLabel={divisions.length === 1}
          />
        )}
      </div>

      {scoreModal && (
        <TeamScoreModal
          mode={scoreModal.mode}
          division={scoreModal.division}
          entry={scoreModal.entry}
          compId={comp.id}
          onSubmit={handleScoreSubmit}
          onDelete={scoreModal.entry ? async () => {
            await handleEntryAction(scoreModal.entry!, 'delete');
            setScoreModal(null);
          } : undefined}
          onClose={() => setScoreModal(null)}
        />
      )}
    </div>
  );
}

/* ================================================================
   Competition card
   ================================================================ */

const STATUS_STYLES: Record<string, { label: string; color: string; pulse: boolean }> = {
  live:      { label: 'LIVE',      color: COLORS.coral, pulse: true  },
  upcoming:  { label: 'UPCOMING',  color: COLORS.gold,  pulse: false },
  completed: { label: 'COMPLETED', color: COLORS.mist,  pulse: false },
};

function CompetitionCard({
  comp, onOpen, canEdit, onDelete,
}: {
  comp: Competition;
  onOpen: () => void;
  canEdit?: boolean;
  onDelete?: () => void;
}) {
  const [confirmDel, setConfirmDel] = useState(false);
  const s      = STATUS_STYLES[comp.status];
  const isLive = comp.status === 'live';

  return (
    <div
      className="rounded-2xl overflow-hidden mb-3"
      style={{
        background: COLORS.court,
        border:     `1px solid ${isLive ? 'rgba(255,77,94,0.35)' : COLORS.courtLight}`,
        boxShadow:  isLive ? '0 0 24px rgba(255,77,94,0.12)' : 'none',
      }}
    >
      {/* Top accent bar */}
      <div style={{ height: 3, background: s.color, opacity: isLive ? 1 : 0.5 }} />

      <button
        onClick={onOpen}
        className="w-full text-left transition-transform active:scale-[0.99]"
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-2">
                <span
                  className={`inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full ${isLive ? 'chl-pulse' : ''}`}
                  style={{
                    background: isLive ? 'rgba(255,77,94,0.12)' : 'rgba(146,162,194,0.1)',
                    color:      s.color,
                    border:     `1px solid ${isLive ? 'rgba(255,77,94,0.3)' : 'rgba(146,162,194,0.2)'}`,
                  }}
                >
                  {isLive && <span className="w-1.5 h-1.5 rounded-full" style={{ background: COLORS.coral }} />}
                  {s.label}
                </span>
              </div>

              <h3 className="font-bold text-base leading-snug mb-2 truncate" style={{ color: COLORS.chalk }}>
                {comp.name}
              </h3>

              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs" style={{ color: COLORS.mist }}>
                <span className="flex items-center gap-1">
                  <Calendar size={11} /> {formatDateRange(comp.startDate, comp.endDate)}
                </span>
                {(comp.venue || comp.city) && (
                  <span className="flex items-center gap-1">
                    <MapPin size={11} /> {[comp.venue, comp.city].filter(Boolean).join(', ')}
                  </span>
                )}
              </div>
            </div>

            <div className="shrink-0 flex flex-col items-end gap-2 pt-0.5">
              <ChevronDown size={16} className="-rotate-90" style={{ color: COLORS.mist }} />
              {comp.divisions.length > 0 && (
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{ background: COLORS.courtLight, color: COLORS.mist }}
                >
                  {comp.divisions.length} div{comp.divisions.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>
      </button>

      {canEdit && (
        confirmDel ? (
          <div
            className="flex items-center gap-2 px-4 py-2.5 border-t"
            style={{ borderColor: COLORS.courtLight }}
          >
            <span className="flex-1 text-xs" style={{ color: COLORS.mist }}>Delete {comp.name}?</span>
            <button
              onClick={() => setConfirmDel(false)}
              className="px-3 py-1.5 rounded-lg text-xs"
              style={{ background: COLORS.courtLight, color: COLORS.chalk }}
            >
              Cancel
            </button>
            <button
              onClick={onDelete}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={{ background: COLORS.coral, color: COLORS.ink }}
            >
              Delete
            </button>
          </div>
        ) : (
          <div className="flex justify-end px-4 pb-3">
            <button
              onClick={() => setConfirmDel(true)}
              className="flex items-center gap-1 text-xs py-1 px-2 rounded-lg"
              style={{ color: COLORS.mist }}
            >
              <Trash2 size={13} /> Delete
            </button>
          </div>
        )
      )}
    </div>
  );
}

/* ================================================================
   Root component
   ================================================================ */

export default function CheerHubLiveScores() {
  const [tab,             setTab]             = useState<'scores' | 'divisions' | 'learn'>('scores');
  const [competitions,    setCompetitions]    = useState<Competition[]>([]);
  const [loading,         setLoading]         = useState(true);
  const [openCompId,      setOpenCompId]      = useState<string | null>(null);
  const [editorUnlocked,  setEditorUnlocked]  = useState(false);
  const [showPasscode,    setShowPasscode]    = useState(false);
  const [formOpen,        setFormOpen]        = useState(false);
  const [editingComp,     setEditingComp]     = useState<Competition | undefined>(undefined);
  const [dataPanel,       setDataPanel]       = useState(false);
  const [toast,           setToast]           = useState<ToastState | null>(null);

  const showToast = useCallback((message: string, type: 'ok' | 'error' = 'ok') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), type === 'error' ? 8_000 : 2_600);
  }, []);

  const refresh = useCallback(async () => {
    try { setCompetitions(await loadCompetitions()); }
    catch { /* keep current list */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    maybeSeeed();
    refresh();
    const interval = setInterval(refresh, 5_000);
    return () => clearInterval(interval);
  }, [refresh]);

  async function persistCompetitions(next: Competition[]) {
    setCompetitions(next);
    try { await saveCompetitions(next); }
    catch (err) {
      showToast(`Could not save: ${(err as Error)?.message ?? 'check your connection.'}`, 'error');
      refresh();
    }
  }

  async function handleSaveComp(data: Omit<Competition, 'id' | 'createdAt'>) {
    if (editingComp) {
      await persistCompetitions(competitions.map((c) => c.id === editingComp.id ? { ...c, ...data } : c));
      showToast('Competition updated');
    } else {
      await persistCompetitions([{ id: uid(), createdAt: Date.now(), ...data }, ...competitions]);
      showToast('Competition created');
    }
    setFormOpen(false);
    setEditingComp(undefined);
  }

  async function handleDeleteComp() {
    if (!editingComp) return;
    await persistCompetitions(competitions.filter((c) => c.id !== editingComp.id));
    setFormOpen(false);
    setEditingComp(undefined);
    setOpenCompId(null);
    showToast('Competition deleted');
  }

  const openComp = competitions.find((c) => c.id === openCompId);
  const grouped: Record<string, Competition[]> = { live: [], upcoming: [], completed: [] };
  competitions.forEach((c) => grouped[c.status]?.push(c));

  if (openComp) {
    return (
      <>
        <CompetitionDetail
          comp={openComp}
          canEdit={editorUnlocked}
          onBack={() => setOpenCompId(null)}
          onEditComp={(c) => { setEditingComp(c); setFormOpen(true); }}
          showToast={showToast}
        />
        {formOpen && (
          <CompetitionFormModal
            initial={editingComp}
            onSave={handleSaveComp}
            onClose={() => { setFormOpen(false); setEditingComp(undefined); }}
            onDelete={handleDeleteComp}
          />
        )}
        <Toast toast={toast} onDismiss={() => setToast(null)} />
      </>
    );
  }

  const liveCount = grouped.live.length;

  // Bottom nav definition
  const NAV = [
    { id: 'scores'    as const, label: 'Scores',    Icon: Trophy    },
    { id: 'divisions' as const, label: 'Divisions', Icon: Layers    },
    { id: 'learn'     as const, label: 'Learn',     Icon: BookOpen  },
  ];

  const BottomNav = (
    <div
      className="fixed bottom-0 left-0 right-0 z-30 flex"
      style={{ background: COLORS.court, borderTop: `1px solid ${COLORS.courtLight}` }}
    >
      {NAV.map(({ id, label, Icon }) => {
        const active = tab === id;
        return (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5"
            style={{ color: active ? COLORS.gold : COLORS.mist }}
          >
            <Icon size={20} />
            <span className="text-[10px] font-medium tracking-wide">{label}</span>
            {active && (
              <span className="absolute bottom-0 w-8 h-0.5 rounded-t" style={{ background: COLORS.gold }} />
            )}
          </button>
        );
      })}
    </div>
  );

  // Non-scores tabs rendered directly
  if (tab === 'divisions') {
    return (
      <div className="chl-root min-h-screen relative" style={{ background: COLORS.ink }}>
        <DivisionsTab />
        {BottomNav}
        <Toast toast={toast} onDismiss={() => setToast(null)} />
      </div>
    );
  }
  if (tab === 'learn') {
    return (
      <div className="chl-root min-h-screen relative" style={{ background: COLORS.ink }}>
        <LearnTab />
        {BottomNav}
        <Toast toast={toast} onDismiss={() => setToast(null)} />
      </div>
    );
  }

  return (
    <div className="chl-root min-h-screen relative" style={{ background: COLORS.ink }}>

      {/* ── Hero header ─────────────────────────────────────── */}
      <div style={{ background: `linear-gradient(180deg, ${COLORS.court} 0%, ${COLORS.ink} 140px)` }}>
        <div className="max-w-2xl mx-auto px-4 pt-7 pb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              {liveCount > 0 && (
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="w-2 h-2 rounded-full chl-pulse" style={{ background: COLORS.coral }} />
                  <span className="text-xs font-bold tracking-widest chl-pulse" style={{ color: COLORS.coral }}>
                    {liveCount} LIVE NOW
                  </span>
                </div>
              )}
              <h1 className="chl-display text-5xl leading-none" style={{ color: COLORS.chalk }}>
                LIVE SCORES
              </h1>
              <p className="text-xs mt-1.5" style={{ color: COLORS.mist }}>
                Cheer Hub · Canadian All-Star
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 pt-1">
              {editorUnlocked && (
                <button
                  onClick={() => setDataPanel(true)}
                  className="p-2.5 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.07)' }}
                  title="Backup & restore data"
                >
                  <Download size={16} style={{ color: COLORS.mist }} />
                </button>
              )}
              <button
                onClick={() => editorUnlocked ? setEditorUnlocked(false) : setShowPasscode(true)}
                className="p-2.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.07)' }}
                aria-label={editorUnlocked ? 'Lock editing' : 'Unlock editing'}
              >
                {editorUnlocked
                  ? <Unlock size={18} style={{ color: COLORS.gold }} />
                  : <Lock size={18} style={{ color: COLORS.mist }} />}
              </button>
            </div>
          </div>

          {/* Stat pills */}
          {competitions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              <span
                className="text-xs px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.06)', color: COLORS.mist }}
              >
                {competitions.length} competition{competitions.length !== 1 ? 's' : ''}
              </span>
              {liveCount > 0 && (
                <span
                  className="text-xs px-3 py-1.5 rounded-full"
                  style={{
                    background: 'rgba(255,77,94,0.12)',
                    color:      COLORS.coral,
                    border:     '1px solid rgba(255,77,94,0.25)',
                  }}
                >
                  {liveCount} live now
                </span>
              )}
              {grouped.upcoming.length > 0 && (
                <span
                  className="text-xs px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(242,183,5,0.08)', color: COLORS.gold }}
                >
                  {grouped.upcoming.length} upcoming
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Editor backup reminder ───────────────────────────── */}
      {editorUnlocked && (
        <div className="max-w-2xl mx-auto px-4 mb-2">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: COLORS.court, border: `1px solid ${COLORS.courtLight}` }}
          >
            <Download size={12} style={{ color: COLORS.mist }} />
            <p className="text-xs" style={{ color: COLORS.mist }}>
              Export your data before clearing browser storage — use the backup icon above.
            </p>
          </div>
        </div>
      )}

      {/* ── Competitions list ────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-4 pb-28">
        {loading ? (
          <p className="pt-4" style={{ color: COLORS.mist }}>Loading…</p>
        ) : competitions.length === 0 ? (
          <div className="text-center py-20">
            <p className="chl-display text-2xl mb-2" style={{ color: COLORS.chalk }}>
              No competitions yet
            </p>
            <p className="text-sm" style={{ color: COLORS.mist }}>
              {editorUnlocked
                ? 'Tap + to add the first one.'
                : 'Unlock editing to add a competition.'}
            </p>
          </div>
        ) : (
          (['live', 'upcoming', 'completed'] as const).map((status) =>
            grouped[status].length === 0 ? null : (
              <div key={status} className="mb-6">
                <h2
                  className="text-[10px] uppercase tracking-widest mb-3 px-1"
                  style={{ color: COLORS.mist }}
                >
                  {status}
                </h2>
                {/* 2-column grid on sm+ screens */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 sm:gap-3">
                  {grouped[status].map((c) => (
                    <CompetitionCard
                      key={c.id}
                      comp={c}
                      onOpen={() => setOpenCompId(c.id)}
                      canEdit={editorUnlocked}
                      onDelete={async () => {
                        await persistCompetitions(competitions.filter((x) => x.id !== c.id));
                        showToast('Competition deleted');
                      }}
                    />
                  ))}
                </div>
              </div>
            ),
          )
        )}
      </div>

      {editorUnlocked && (
        <button
          onClick={() => { setEditingComp(undefined); setFormOpen(true); }}
          className="fixed bottom-20 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-xl"
          style={{ background: COLORS.gold, color: COLORS.ink }}
          aria-label="Add competition"
        >
          <Plus size={26} />
        </button>
      )}

      {showPasscode && (
        <PasscodeModal
          onUnlock={() => { setEditorUnlocked(true); setShowPasscode(false); showToast('Editing unlocked'); }}
          onClose={() => setShowPasscode(false)}
        />
      )}
      {formOpen && (
        <CompetitionFormModal
          initial={editingComp}
          onSave={handleSaveComp}
          onClose={() => { setFormOpen(false); setEditingComp(undefined); }}
          onDelete={handleDeleteComp}
        />
      )}
      {dataPanel && <DataPanel onClose={() => setDataPanel(false)} showToast={showToast} />}
      {BottomNav}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
