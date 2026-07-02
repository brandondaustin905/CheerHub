import type { Competition } from './types';

// 2026-2027 Canadian All-Star cheer season.
// Dates based on confirmed announcements and historical week-of-year patterns.
// Version notes:
//   v1 — initial seed
//   v2 — venue corrections (International Centre, Niagara Falls CC, EY Centre)
//   v3 — date corrections + Rogers Centre Ottawa for Spirit Sports Clash
export const SEEDED_COMPETITIONS: Competition[] = [
  // ── FALL 2026 ──────────────────────────────────────────────────
  {
    id: 'seed-cheer-for-cure-2026',
    name: 'Cheer for the Cure',
    venue: 'International Centre',
    city: 'Mississauga, ON',
    startDate: '2026-11-27',
    endDate: '2026-11-29',
    divisions: [],
    status: 'upcoming',
    createdAt: 0,
    accentColor: '#FF2E8B',
  },

  // ── JANUARY 2027 ───────────────────────────────────────────────
  // Big East Blast & Showdown are back-to-back Sat/Sun at EY Centre.
  // Tidal Blast runs the same Saturday — Atlantic teams, different region.
  {
    id: 'seed-big-east-blast-2027',
    name: 'Big East Blast',
    venue: 'EY Centre',
    city: 'Ottawa, ON',
    startDate: '2027-01-23',
    endDate: '2027-01-23',
    divisions: [],
    status: 'upcoming',
    createdAt: 0,
    accentColor: '#3FCB8C',
  },
  {
    id: 'seed-tidal-blast-2027',
    name: 'Tidal Blast',
    venue: 'Moncton Coliseum',
    city: 'Moncton, NB',
    startDate: '2027-01-23',
    endDate: '2027-01-23',
    divisions: [],
    status: 'upcoming',
    createdAt: 0,
    accentColor: '#4A9EFF',
  },
  {
    id: 'seed-big-east-showdown-2027',
    name: 'Big East Showdown',
    venue: 'EY Centre',
    city: 'Ottawa, ON',
    startDate: '2027-01-24',
    endDate: '2027-01-24',
    divisions: [],
    status: 'upcoming',
    createdAt: 0,
    accentColor: '#3FCB8C',
  },

  // Cheer Fest — last weekend of January, Abbotsford BC.
  // 2026 was Jan 31–Feb 1 (Sat–Sun); 2027 equivalent = Jan 30–31.
  {
    id: 'seed-cheer-fest-2027',
    name: 'Canadian Cheer Fest',
    venue: 'Abbotsford Centre',
    city: 'Abbotsford, BC',
    startDate: '2027-01-30',
    endDate: '2027-01-31',
    divisions: [],
    status: 'upcoming',
    createdAt: 0,
    accentColor: '#9B59B6',
  },

  // ── FEBRUARY 2027 ──────────────────────────────────────────────
  {
    id: 'seed-cheer-evo-ontario-2027',
    name: 'Cheer Evolution Ontario Championships',
    venue: 'The Aud',
    city: 'Kitchener, ON',
    startDate: '2027-02-12',
    endDate: '2027-02-14',
    divisions: [],
    status: 'upcoming',
    createdAt: 0,
    accentColor: '#E67E22',
  },

  // These three events all fall on the same February weekend —
  // regional events serving different parts of the country.
  {
    id: 'seed-spirit-sports-clash-2027',
    name: 'Spirit Sports Canadian Clash',
    venue: 'Rogers Centre Ottawa',
    city: 'Ottawa, ON',
    startDate: '2027-02-20',
    endDate: '2027-02-21',
    divisions: [],
    status: 'upcoming',
    createdAt: 0,
    accentColor: '#4A9EFF',
  },
  {
    id: 'seed-battle-border-2027',
    name: 'Battle at the Border',
    venue: 'Niagara Falls Convention Centre',
    city: 'Niagara Falls, ON',
    startDate: '2027-02-20',
    endDate: '2027-02-21',
    divisions: [],
    status: 'upcoming',
    createdAt: 0,
    accentColor: '#FF4D5E',
  },
  {
    id: 'seed-quebec-champs-2027',
    name: 'Quebec Championships',
    venue: 'Centre des Congrès',
    city: 'Québec City, QC',
    startDate: '2027-02-20',
    endDate: '2027-02-21',
    divisions: [],
    status: 'upcoming',
    createdAt: 0,
    accentColor: '#4A9EFF',
  },

  // ── MARCH 2027 ─────────────────────────────────────────────────
  {
    id: 'seed-atlantic-showdown-2027',
    name: 'Atlantic Showdown',
    venue: 'Moncton Coliseum',
    city: 'Moncton, NB',
    startDate: '2027-02-28',
    endDate: '2027-03-01',
    divisions: [],
    status: 'upcoming',
    createdAt: 0,
    accentColor: '#4A9EFF',
  },
  {
    id: 'seed-ontario-provs-2027',
    name: 'Ontario Cheer Provincial Championship',
    venue: 'CAA Centre',
    city: 'Brampton, ON',
    startDate: '2027-03-05',
    endDate: '2027-03-07',
    divisions: [],
    status: 'upcoming',
    createdAt: 0,
    accentColor: '#FF4D5E',
  },

  // ── APRIL 2027 — Nationals Weekend at International Centre ──────
  {
    id: 'seed-worlds-faceoff-2027',
    name: 'Canadian Worlds Face-Off',
    venue: 'International Centre',
    city: 'Mississauga, ON',
    startDate: '2027-04-09',
    endDate: '2027-04-09',
    divisions: [],
    status: 'upcoming',
    createdAt: 0,
    accentColor: '#F2B705',
  },
  {
    id: 'seed-canadian-finals-2027',
    name: 'Canadian Cheer Finals',
    venue: 'International Centre',
    city: 'Mississauga, ON',
    startDate: '2027-04-10',
    endDate: '2027-04-11',
    divisions: [],
    status: 'upcoming',
    createdAt: 0,
    accentColor: '#F2B705',
  },
  {
    id: 'seed-allstar-nationals-2027',
    name: 'Canadian All-Star Nationals',
    venue: 'International Centre',
    city: 'Mississauga, ON',
    startDate: '2027-04-09',
    endDate: '2027-04-12',
    divisions: [],
    status: 'upcoming',
    createdAt: 0,
    accentColor: '#F2B705',
  },

  // ── MAY 2027 ───────────────────────────────────────────────────
  {
    id: 'seed-school-nationals-2027',
    name: 'Canadian School Nationals',
    venue: 'EY Centre',
    city: 'Ottawa, ON',
    startDate: '2027-05-08',
    endDate: '2027-05-09',
    divisions: [],
    status: 'upcoming',
    createdAt: 0,
    accentColor: '#3FCB8C',
  },
];

export const SEED_VERSION_KEY = 'cheerhub:seeded:v3';
