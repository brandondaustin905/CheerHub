'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { COLORS } from '@/lib/cheerhub/constants';

interface Level {
  name: string;
  badge: string;
  age: string;
  skills: string;
  note?: string;
}

interface AgeGroup {
  id: string;
  label: string;
  ageRange: string;
  color: string;
  description: string;
  levels: Level[];
}

const AGE_GROUPS: AgeGroup[] = [
  {
    id: 'u8',
    label: 'U8',
    ageRange: 'Ages 5–8',
    color: '#3FCB8C',
    description: 'The youngest competitors. Focus is on fun, fundamentals, and building a love for the sport. Routines are age-appropriate with strict safety rules.',
    levels: [
      { name: 'Novice', badge: 'NOV', age: '5–8', skills: 'Basic jumps, simple formations, beginner stunts (no extensions)', note: 'Entry level — no experience required' },
      { name: 'Prep', badge: 'PREP', age: '5–8', skills: 'Extended stunts at prep level, basic basket tosses, beginner tumbling' },
      { name: 'Level 1', badge: 'L1', age: '5–8', skills: 'Level 1 stunts, cartwheel tumbling, basic pyramids' },
      { name: 'Level 2', badge: 'L2', age: '5–8', skills: 'Extended stunts, round-off tumbling, more complex pyramids' },
      { name: 'Level 3', badge: 'L3', age: '5–8', skills: 'Inverted stunts begin, back walkovers, more advanced pyramids' },
    ],
  },
  {
    id: 'u12',
    label: 'U12',
    ageRange: 'Ages 5–12',
    color: '#4A9EFF',
    description: 'Where technique becomes the focus. Athletes start developing power and precision. Multiple levels allow teams to compete at the right challenge.',
    levels: [
      { name: 'Novice', badge: 'NOV', age: '5–12', skills: 'Basic jumps, beginner stunts, simple choreography', note: 'Entry level' },
      { name: 'Prep', badge: 'PREP', age: '5–12', skills: 'Prep-level stunts, simple basket tosses, beginner tumbling' },
      { name: 'Level 1', badge: 'L1', age: '5–12', skills: 'Extended stunts, cartwheel/round-off, basic pyramids' },
      { name: 'Level 2', badge: 'L2', age: '5–12', skills: 'Extended stunts with twists, round-off back handspring' },
      { name: 'Level 3', badge: 'L3', age: '5–12', skills: 'Inversions, back tucks, more complex pyramid connections' },
      { name: 'Level 4', badge: 'L4', age: '5–12', skills: 'Advanced inversions, layouts, intricate pyramids' },
      { name: 'NT 2–4', badge: 'NT', age: '5–12', skills: 'National Team levels — highest difficulty, World bid eligible', note: 'Elite / Worlds pathway' },
    ],
  },
  {
    id: 'u16',
    label: 'U16',
    ageRange: 'Ages 5–16',
    color: COLORS.gold,
    description: 'Skill demand rises significantly. Tumbling passes get harder, stunts more creative. This is where most competitive gyms have their flagship teams.',
    levels: [
      { name: 'Novice', badge: 'NOV', age: '5–16', skills: 'Fundamentals focus, beginner stunts', note: 'Entry level' },
      { name: 'Prep', badge: 'PREP', age: '5–16', skills: 'Prep-level stunts, beginner basket tosses' },
      { name: 'Level 1', badge: 'L1', age: '5–16', skills: 'Extended stunts, cartwheel/round-off tumbling' },
      { name: 'Level 2', badge: 'L2', age: '5–16', skills: 'Extended stunts with twists, round-off back handspring' },
      { name: 'Level 3', badge: 'L3', age: '5–16', skills: 'Inversions, back tucks, single-leg variations' },
      { name: 'Level 4', badge: 'L4', age: '5–16', skills: 'Advanced inversions, layouts, intricate pyramids, full twists' },
      { name: 'Level 5', badge: 'L5', age: '5–16', skills: 'Elite stunts, double-down basket tosses, full-twisting layouts' },
      { name: 'Level 6', badge: 'L6', age: '5–16', skills: 'Top elite — high-risk inversions, complex pyramids, elite tumbling' },
      { name: 'NT 2–6', badge: 'NT', age: '5–16', skills: 'National Team — World bid eligible, highest difficulty per level', note: 'Worlds pathway' },
    ],
  },
  {
    id: 'u18',
    label: 'U18',
    ageRange: 'Ages 5–18',
    color: COLORS.coral,
    description: 'The most competitive junior age group. Levels 5–7 and NT divisions are where many of the best Canadian teams compete for World bids.',
    levels: [
      { name: 'Novice', badge: 'NOV', age: '5–18', skills: 'Fundamentals, beginner stunts', note: 'Entry level' },
      { name: 'Prep', badge: 'PREP', age: '5–18', skills: 'Prep stunts, beginner basket tosses' },
      { name: 'Level 1–4', badge: 'L1–4', age: '5–18', skills: 'Progressive skill difficulty from cartwheel to advanced inversions' },
      { name: 'Level 4.2', badge: 'L4.2', age: '5–18', skills: 'Transition level between L4 and L5 — elite L4 skills' },
      { name: 'Level 5', badge: 'L5', age: '5–18', skills: 'Double-down basket tosses, full-twisting layouts, elite pyramids' },
      { name: 'Level 6', badge: 'L6', age: '5–18', skills: 'High-risk skills, complex multi-person pyramids, elite tumbling' },
      { name: 'Level 7', badge: 'L7', age: '5–18', skills: 'Highest difficulty — elite inversions, double twists, World-level skills' },
      { name: 'AG Level 5–7', badge: 'AG', age: '5–18', skills: 'All-Girl version of L5–7 — no male athletes' },
      { name: 'Coed Level 5–7', badge: 'CO', age: '5–18', skills: 'Mixed gender — additional stunt difficulty allowed' },
      { name: 'NT 2–7', badge: 'NT', age: '5–18', skills: 'National Team — World bid eligible, top teams in Canada', note: 'Worlds pathway' },
    ],
  },
  {
    id: 'open',
    label: 'Open',
    ageRange: 'Ages 14+',
    color: COLORS.magenta,
    description: 'No upper age limit. This is where senior athletes compete, including many adults. Open Level 5–7 and NT are the pinnacle of Canadian All-Star cheerleading.',
    levels: [
      { name: 'Novice', badge: 'NOV', age: '14+', skills: 'Beginner teams new to competition', note: 'Entry level' },
      { name: 'Prep', badge: 'PREP', age: '14+', skills: 'Prep-level stunts, beginner tosses' },
      { name: 'Level 1–4', badge: 'L1–4', age: '14+', skills: 'Progressive skill difficulty' },
      { name: 'Level 4.2', badge: 'L4.2', age: '14+', skills: 'Elite L4 transition level' },
      { name: 'Level 5', badge: 'L5', age: '14+', skills: 'Double-down tosses, fulls, elite pyramids' },
      { name: 'Level 6', badge: 'L6', age: '14+', skills: 'High-risk elite skills across all sections' },
      { name: 'Level 7', badge: 'L7', age: '14+', skills: 'Absolute top difficulty — the best teams in Canada compete here' },
      { name: 'AG Level 5–7', badge: 'AG', age: '14+', skills: 'All-Girl Open — dedicated female-only division' },
      { name: "Master's", badge: 'MAS', age: '18+', skills: 'Veterans and adult athletes — focuses on performance and artistry' },
      { name: 'NT 2–7', badge: 'NT', age: '14+', skills: 'National Team — World bid eligible, represents Canada internationally', note: 'Worlds pathway' },
    ],
  },
];

function LevelBadge({ badge, color }: { badge: string; color: string }) {
  return (
    <span
      className="inline-block text-[9px] font-bold px-1.5 py-0.5 rounded min-w-[30px] text-center"
      style={{ background: `${color}22`, color, border: `1px solid ${color}55` }}
    >
      {badge}
    </span>
  );
}

function AgeGroupCard({ group }: { group: AgeGroup }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-2xl mb-3 overflow-hidden"
      style={{ background: COLORS.court, border: `1px solid ${COLORS.courtLight}` }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `${group.color}22` }}
          >
            <span className="font-black text-sm" style={{ color: group.color }}>{group.label}</span>
          </div>
          <div className="text-left">
            <div className="font-bold" style={{ color: COLORS.chalk }}>{group.label} Division</div>
            <div className="text-xs" style={{ color: COLORS.mist }}>{group.ageRange} · {group.levels.length} levels</div>
          </div>
        </div>
        <ChevronDown
          size={18}
          style={{ color: COLORS.mist, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
        />
      </button>

      {open && (
        <div className="px-5 pb-5">
          <p className="text-sm mb-4" style={{ color: COLORS.mist }}>{group.description}</p>
          <div className="space-y-2">
            {group.levels.map((level) => (
              <div
                key={level.name}
                className="flex gap-3 p-3 rounded-xl"
                style={{ background: COLORS.ink }}
              >
                <div className="shrink-0 pt-0.5">
                  <LevelBadge badge={level.badge} color={group.color} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm" style={{ color: COLORS.chalk }}>{level.name}</span>
                    {level.note && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: `${group.color}22`, color: group.color }}>
                        {level.note}
                      </span>
                    )}
                  </div>
                  <p className="text-xs mt-0.5 leading-relaxed" style={{ color: COLORS.mist }}>{level.skills}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DivisionsTab() {
  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-28">
      <h2 className="chl-display text-3xl mb-1" style={{ color: COLORS.chalk }}>Divisions</h2>
      <p className="text-sm mb-6" style={{ color: COLORS.mist }}>
        Canadian All-Star cheerleading is divided by age group and skill level. Tap a division to see all levels.
      </p>

      {AGE_GROUPS.map((group) => (
        <AgeGroupCard key={group.id} group={group} />
      ))}

      <div
        className="mt-4 p-4 rounded-2xl"
        style={{ background: COLORS.court, border: `1px solid ${COLORS.courtLight}` }}
      >
        <p className="text-xs font-semibold mb-1" style={{ color: COLORS.gold }}>NT — National Team</p>
        <p className="text-xs leading-relaxed" style={{ color: COLORS.mist }}>
          NT divisions follow the same level rules but are restricted to teams registered through Cheer Canada's
          National Team Program. These teams are eligible for World Championship bids and represent Canada internationally.
        </p>
      </div>
    </div>
  );
}
