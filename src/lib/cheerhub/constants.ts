import type { Criterion, GroupMeta } from './types';

export const COLORS = {
  ink:        '#10151F',
  court:      '#1B2A48',
  courtLight: '#243A63',
  gold:       '#F2B705',
  coral:      '#FF4D5E',
  magenta:    '#FF2E8B',
  mist:       '#92A2C2',
  chalk:      '#F5F3EC',
  greenOk:    '#3FCB8C',
} as const;

export const EDITOR_PASSCODE =
  process.env.NEXT_PUBLIC_EDITOR_PASSCODE ?? 'CHEERHUB2026';

/* ----------------------------------------------------------------
   14 scored line items, 100 pts total.
   Cheer Canada elite judging framework.
   ---------------------------------------------------------------- */
export const CRITERIA: Criterion[] = [
  // BUILDING /50
  { key: 'stuntDiff',    group: 'building', label: 'Stunt Difficulty',        max: 10, sub: 'Risk vs Reward · Skill Variety · Inversions · Elite Skills · Distribution' },
  { key: 'stuntExec',    group: 'building', label: 'Stunt Execution',         max: 10, sub: 'Control · Stability · Body Positions · Completion · Safety' },
  { key: 'pyramidDiff',  group: 'building', label: 'Pyramid Difficulty',      max: 10, sub: 'Inversions · Innovation · Risk vs Reward · Elite Skill Variety' },
  { key: 'pyramidExec',  group: 'building', label: 'Pyramid Execution',       max: 10, sub: 'Precision · Synchronization · Team Uniformity · Balance' },
  { key: 'tosses',       group: 'building', label: 'Basket Tosses',           max: 10, sub: 'Difficulty · Innovation · Control · Safety · Execution' },
  // TUMBLING & JUMPS /25
  { key: 'tumbleDiff',   group: 'tumbling', label: 'Tumbling Difficulty',     max: 8,  sub: 'Running Tumbling · Elite Skill Variety · Risk vs Reward · Distribution' },
  { key: 'tumbleExec',   group: 'tumbling', label: 'Tumbling Execution',      max: 8,  sub: 'Technique · Body Positions · Control · Safety · Recovery' },
  { key: 'standTumble',  group: 'tumbling', label: 'Standing Tumbling',       max: 5,  sub: 'Difficulty · Execution · Balance · Completion of Skills' },
  { key: 'jumps',        group: 'tumbling', label: 'Jump Performance',        max: 4,  sub: 'Technique · Flexibility · Timing · Synchronization · Precision' },
  // CHOREOGRAPHY /15
  { key: 'routineComp',  group: 'choreo',   label: 'Routine Composition',     max: 5,  sub: 'Flow · Transitions · Use of Space · Timing · Musical Interpretation' },
  { key: 'creativity',   group: 'choreo',   label: 'Creativity & Innovation', max: 5,  sub: 'Originality · Visual Effect · Wow Factor · Theme Execution' },
  { key: 'musicalInterp',group: 'choreo',   label: 'Musical Interpretation',  max: 5,  sub: 'Timing · Motion Technique · Energy · Synchronization' },
  // PERFORMANCE /10
  { key: 'impression',   group: 'overall',  label: 'Overall Impression',      max: 5,  sub: 'Total Package · Crowd Appeal · Confidence · Energy · Showmanship' },
  { key: 'showmanship',  group: 'overall',  label: 'Entertainment',           max: 5,  sub: 'Performance Quality · Facial Expressions · Stage Presence · Audience Connection' },
];

export const GROUP_META: Record<string, GroupMeta> = {
  building: { label: 'Building',         max: 50 },
  tumbling: { label: 'Tumbling & Jumps', max: 25 },
  choreo:   { label: 'Choreography',     max: 15 },
  overall:  { label: 'Performance',      max: 10 },
};

export const GROUP_ORDER = ['building', 'tumbling', 'choreo', 'overall'] as const;

// 0–10 in 0.25 steps (41 steps: indices 0–40)
export const DEDUCTION_STEPS: number[] = Array.from({ length: 41 }, (_, i) => i);

export const CANADIAN_GYMS: string[] = [
  // Ontario
  'Cheer Sport Sharks Kitchener',
  'Cheer Sport Sharks Toronto',
  'Cheer Sport Sharks Ottawa',
  'Cheer Sport Sharks Ancaster',
  'CheerForce Wolfpack',
  'Alpha Cheer',
  'Wolfpack Allstars',
  'Prodigy Athletics',
  'ACE Athletics',
  'Beach Cheer Athletics',
  'CheerPride All-Stars',
  'Chrome Athletics',
  'CheerStrike Royals',
  'Cheer Strong Inc.',
  'Gems Athletics',
  'Perfect Storm Athletics',
  'Legacy Athletics',
  'Niagara Royalty',
  'Royalty Cheer Athletics',
  'Empire Athletics',
  'Storm Athletics',
  'Kingston Elite Cheerleading',
  'Icon Allstars',
  'TNT Athletics',
  'Prestige Allstars',
  'Eclipse Athletics',
  'Adrenaline Allstars',
  'Apex Athletics',
  'Force Athletics',
  'Revolution Athletics',
  'Elite Force Athletics',
  'Altitude Athletics',
  'Inspire Athletics',
  'Spirit Athletics',
  'North Star Athletics',
  // Quebec
  'Smoke Cheer Athletics',
  'Scandalous Athletics',
  'Alliance Cheer Elite',
  'Exo Cheer',
  'Envol Athletics',
  'Zodiak Elite',
  // Alberta
  'Peak Elite Cheerleading',
  'Calgary Stars',
  'CheerForce Calgary',
  'Rage Athletics Calgary',
  'Envy Athletics',
  // BC
  'Cheer Sport Sharks Vancouver',
  'Vancouver AllStars',
  'Pacific Cheer Athletics',
  // Atlantic Canada
  'Olympia Allstar Cheerleading',
  'East Coast Allstars',
  'Pride Allstars',
  'Fury Athletics',
  'Maritime Cheer Academy',
];

export const CANADIAN_DIVISIONS: Record<string, string[]> = {
  'U8': [
    'U8 Novice', 'U8 Prep',
    'U8 Level 1', 'U8 Level 2', 'U8 Level 3',
  ],
  'U12': [
    'U12 Novice', 'U12 Prep',
    'U12 Level 1', 'U12 Level 2', 'U12 Level 3', 'U12 Level 4',
    'U12 NT 2', 'U12 NT 3', 'U12 NT 4',
  ],
  'U16': [
    'U16 Novice', 'U16 Prep',
    'U16 Level 1', 'U16 Level 2', 'U16 Level 3', 'U16 Level 4', 'U16 Level 5', 'U16 Level 6',
    'U16 NT 2', 'U16 NT 3', 'U16 NT 4', 'U16 NT 5', 'U16 NT 6',
  ],
  'U18': [
    'U18 Novice', 'U18 Prep',
    'U18 Level 1', 'U18 Level 2', 'U18 Level 3', 'U18 Level 4', 'U18 Level 4.2',
    'U18 Level 5', 'U18 Level 6', 'U18 Level 7',
    'U18 NT 2', 'U18 NT 3', 'U18 NT 4', 'U18 NT 5', 'U18 NT 6', 'U18 NT 7',
  ],
  'U18 AG / Coed': [
    'U18 AG Level 5', 'U18 AG Level 6', 'U18 AG Level 7',
    'U18 AG NT 5', 'U18 AG NT 6', 'U18 AG NT 7',
    'U18 Coed Level 5', 'U18 Coed Level 6', 'U18 Coed Level 7',
    'U18 Coed NT 5', 'U18 Coed NT 6', 'U18 Coed NT 7',
  ],
  'Open': [
    'Open Novice', 'Open Prep',
    'Open Level 1', 'Open Level 2', 'Open Level 3', 'Open Level 4', 'Open Level 4.2',
    'Open Level 5', 'Open Level 6', 'Open Level 7',
    'Open NT 2', 'Open NT 3', 'Open NT 4', 'Open NT 5', 'Open NT 6', 'Open NT 7',
  ],
  'Open AG / Masters': [
    'Open AG Level 5', 'Open AG Level 6', 'Open AG Level 7', "Master's",
  ],
};
