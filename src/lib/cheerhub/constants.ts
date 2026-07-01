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
   20 scored line items, 150 pts total.
   Based on Cheer Canada / IASF elite judging framework.
   ---------------------------------------------------------------- */
export const CRITERIA: Criterion[] = [
  // BUILDING /60
  { key: 'stuntDiff',    group: 'building', label: 'Stunt Difficulty',       max: 10, sub: 'Risk vs Reward · Elite Skill Variety · Inversions · Partner Stunts · Skill Distribution' },
  { key: 'stuntExec',    group: 'building', label: 'Stunt Execution',        max: 10, sub: 'Control · Stability · Body Positions · Completion of Skills · Recovery from Mistakes · Safety' },
  { key: 'pyramidDiff',  group: 'building', label: 'Pyramid Difficulty',     max: 10, sub: 'Inversions · Innovation · Risk vs Reward · Elite Skill Variety · Partner Stunts' },
  { key: 'pyramidExec',  group: 'building', label: 'Pyramid Execution',      max: 10, sub: 'Precision · Synchronization · Team Uniformity · Balance · Skill Distribution' },
  { key: 'tossDiff',     group: 'building', label: 'Basket Toss Difficulty', max: 10, sub: 'Difficulty · Innovation · Risk vs Reward · Basket Toss Execution' },
  { key: 'tossExec',     group: 'building', label: 'Basket Toss Execution',  max: 10, sub: 'Safety · Control · Stability · Completion of Skills · Endurance' },
  // TUMBLING & JUMPS /30
  { key: 'tumbleDiff',   group: 'tumbling', label: 'Tumbling Difficulty',    max: 8,  sub: 'Standing Tumbling · Running Tumbling · Elite Skill Variety · Risk vs Reward' },
  { key: 'tumbleExec',   group: 'tumbling', label: 'Tumbling Execution',     max: 8,  sub: 'Technique · Body Positions · Control · Recovery from Mistakes · Safety' },
  { key: 'jumpTech',     group: 'tumbling', label: 'Jump Technique',         max: 7,  sub: 'Flexibility · Timing · Body Positions · Synchronization · Precision' },
  { key: 'standTumble',  group: 'tumbling', label: 'Standing Tumbling',      max: 4,  sub: 'Difficulty · Balance · Completion of Skills' },
  { key: 'runTumble',    group: 'tumbling', label: 'Running Tumbling',       max: 3,  sub: 'Difficulty · Endurance · Completion of Skills' },
  // CHOREOGRAPHY & DANCE /30
  { key: 'choreo',       group: 'choreo',   label: 'Choreography',           max: 6,  sub: 'Creativity · Innovation · Routine Composition · Visual Effect' },
  { key: 'routineComp',  group: 'choreo',   label: 'Routine Composition',    max: 6,  sub: 'Flow of Routine · Transitions · Timing · Musical Interpretation' },
  { key: 'dance',        group: 'choreo',   label: 'Dance Performance',      max: 6,  sub: 'Motion Technique · Energy · Musical Interpretation · Timing' },
  { key: 'transitions',  group: 'choreo',   label: 'Transitions & Flow',     max: 6,  sub: 'Flow of Routine · Visual Effect · Team Uniformity · Creativity' },
  { key: 'musicalInterp',group: 'choreo',   label: 'Musical Interpretation', max: 6,  sub: 'Timing · Motion Technique · Energy · Synchronization' },
  // OVERALL PERFORMANCE /30
  { key: 'impression',   group: 'overall',  label: 'Overall Impression',     max: 8,  sub: 'Overall Performance · Showmanship · Crowd Appeal · Confidence · Energy' },
  { key: 'showmanship',  group: 'overall',  label: 'Showmanship & Energy',   max: 8,  sub: 'Energy · Confidence · Crowd Appeal · Visual Effect · Endurance' },
  { key: 'uniformity',   group: 'overall',  label: 'Team Uniformity',        max: 7,  sub: 'Synchronization · Precision · Timing · Balance · Team Participation' },
  { key: 'creativity',   group: 'overall',  label: 'Creativity & Visual',    max: 7,  sub: 'Creativity · Innovation · Visual Effect · Risk vs Reward' },
];

export const GROUP_META: Record<string, GroupMeta> = {
  building: { label: 'Building',             max: 60 },
  tumbling: { label: 'Tumbling & Jumps',     max: 30 },
  choreo:   { label: 'Choreography & Dance', max: 30 },
  overall:  { label: 'Overall Performance',  max: 30 },
};

export const GROUP_ORDER = ['building', 'tumbling', 'choreo', 'overall'] as const;

// 0–10 in 0.25 steps (41 steps: indices 0–40)
export const DEDUCTION_STEPS: number[] = Array.from({ length: 41 }, (_, i) => i);

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
