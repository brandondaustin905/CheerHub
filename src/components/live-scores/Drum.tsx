'use client';

import { useEffect, useRef, useCallback } from 'react';
import { COLORS } from '@/lib/cheerhub/constants';

interface DrumProps {
  values: number[];
  value: number;
  onChange: (v: number) => void;
  itemHeight?: number;
  visibleCount?: number;
  disabled?: boolean;
  renderLabel?: (v: number) => string;
  width?: number;
  textSize?: string;
}

export default function Drum({
  values,
  value,
  onChange,
  itemHeight = 40,
  visibleCount = 5,
  disabled = false,
  renderLabel,
  width = 64,
  textSize = 'text-3xl',
}: DrumProps) {
  const containerRef  = useRef<HTMLDivElement>(null);
  const scrollTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const programmatic  = useRef(false);
  const lastReported  = useRef(value);

  const padCount   = Math.floor(visibleCount / 2);
  const n          = values.length;
  const loopValues = [...values, ...values, ...values];
  const label      = renderLabel ?? ((v: number) => String(v).padStart(2, '0'));

  // Set initial scroll position on mount (client-only).
  useEffect(() => {
    const idx = values.indexOf(value);
    if (containerRef.current && idx >= 0) {
      programmatic.current = true;
      containerRef.current.scrollTop = (n + idx) * itemHeight;
      setTimeout(() => { programmatic.current = false; }, 60);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScroll = useCallback(() => {
    if (programmatic.current || disabled) return;
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => {
      const el = containerRef.current;
      if (!el) return;
      const rawIdx = Math.round(el.scrollTop / itemHeight);
      const real   = ((rawIdx % n) + n) % n;
      programmatic.current = true;
      el.scrollTo({ top: (n + real) * itemHeight, behavior: 'smooth' });
      setTimeout(() => { programmatic.current = false; }, 250);
      const newVal = values[real];
      if (newVal !== lastReported.current) {
        lastReported.current = newVal;
        navigator.vibrate?.(8);
        onChange(newVal);
      }
    }, 110);
  }, [values, onChange, itemHeight, n, disabled]);

  return (
    <div
      className="relative"
      style={{ height: itemHeight * visibleCount, width, opacity: disabled ? 0.4 : 1 }}
    >
      {/* Selection highlight */}
      <div
        className="absolute left-0 right-0 border-t-2 border-b-2 pointer-events-none z-10 rounded"
        style={{
          top:          itemHeight * padCount,
          height:       itemHeight,
          borderColor:  COLORS.gold,
        }}
      />
      {/* Fade overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: `linear-gradient(to bottom, ${COLORS.court} 5%, transparent 30%, transparent 70%, ${COLORS.court} 95%)`,
        }}
      />
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="overflow-y-scroll h-full chl-no-scrollbar"
        style={{
          scrollSnapType:  'y mandatory',
          pointerEvents:   disabled ? 'none' : 'auto',
        }}
      >
        <div style={{ height: itemHeight * padCount }} />
        {loopValues.map((v, i) => (
          <div
            key={i}
            className={`flex items-center justify-center chl-display ${textSize}`}
            style={{
              height:          itemHeight,
              scrollSnapAlign: 'center',
              color:           v === value ? COLORS.gold : COLORS.mist,
            }}
          >
            {label(v)}
          </div>
        ))}
        <div style={{ height: itemHeight * padCount }} />
      </div>
    </div>
  );
}
