'use client';

import { useState, useMemo } from 'react';

/* ── Colour palette ─────────────────────────────────────── */
const C = {
  ink:        '#10151F',
  court:      '#1B2A48',
  courtLight: '#243A63',
  gold:       '#F2B705',
  coral:      '#FF4D5E',
  magenta:    '#FF2E8B',
  mist:       '#92A2C2',
  chalk:      '#F5F3EC',
  green:      '#3FCB8C',
};

/* ── Province metadata ──────────────────────────────────── */
const PROVINCES: { code: string; name: string; color: string }[] = [
  { code: 'ALL', name: 'All Provinces', color: C.gold },
  { code: 'ON',  name: 'Ontario',                   color: C.coral   },
  { code: 'QC',  name: 'Quebec',                    color: C.magenta },
  { code: 'AB',  name: 'Alberta',                   color: '#E67E22' },
  { code: 'BC',  name: 'British Columbia',           color: C.green   },
  { code: 'SK',  name: 'Saskatchewan',              color: '#4A9EFF' },
  { code: 'MB',  name: 'Manitoba',                  color: '#9B59B6' },
  { code: 'NB',  name: 'New Brunswick',             color: C.green   },
  { code: 'NS',  name: 'Nova Scotia',               color: C.coral   },
  { code: 'PE',  name: 'Prince Edward Island',      color: C.magenta },
  { code: 'NL',  name: 'Newfoundland & Labrador',   color: '#4A9EFF' },
];

/* ── Gym data ───────────────────────────────────────────── */
interface Gym {
  name:    string;
  province: string;
  city:    string;
  website: string;
  contact: string;
}

const GYMS: Gym[] = [
  // Ontario
  { name: 'Alpha Cheer & Tumbling',           province: 'ON', city: 'Ontario',        website: '',                              contact: '' },
  { name: 'Beach Cheer Athletics',            province: 'ON', city: 'Ontario',        website: '',                              contact: '' },
  { name: 'Black Widow Cheer Gym',            province: 'ON', city: 'Ontario',        website: '',                              contact: '' },
  { name: 'Champion Cheer Academy',           province: 'ON', city: 'Ontario',        website: '',                              contact: '' },
  { name: 'Cheer Fuzion All-Stars (CFA)',     province: 'ON', city: 'Ontario',        website: '',                              contact: '' },
  { name: 'CheerForce AllStars',              province: 'ON', city: 'Ontario',        website: '',                              contact: '' },
  { name: 'CheerPride All-Stars',             province: 'ON', city: 'Ontario',        website: '',                              contact: '' },
  { name: 'Cheer Sport Sharks – Ancaster',    province: 'ON', city: 'Ancaster',       website: 'https://cheersportsharks.com',  contact: '' },
  { name: 'Cheer Sport Sharks – Kitchener',   province: 'ON', city: 'Kitchener',      website: 'https://cheersportsharks.com',  contact: '' },
  { name: 'Cheer Sport Sharks – Milton',      province: 'ON', city: 'Milton',         website: 'https://cheersportsharks.com',  contact: '' },
  { name: 'Cheer Sport Sharks – Ottawa',      province: 'ON', city: 'Ottawa',         website: 'https://cheersportsharks.com',  contact: '' },
  { name: 'Cheer Sport Sharks – Toronto',     province: 'ON', city: 'Toronto',        website: 'https://cheersportsharks.com',  contact: '' },
  { name: 'Cheer Strike Royals',              province: 'ON', city: 'Ontario',        website: '',                              contact: '' },
  { name: 'Cheer Strong Inc',                 province: 'ON', city: 'Ontario',        website: '',                              contact: '' },
  { name: 'Kingston Elite Cheerleading',      province: 'ON', city: 'Kingston',       website: '',                              contact: '' },
  { name: 'NorthStar Cheer',                  province: 'ON', city: 'Ontario',        website: '',                              contact: '' },
  { name: 'PCT Cheer & Tumble',               province: 'ON', city: 'Ontario',        website: '',                              contact: '' },
  { name: 'Scorpions Niagara',                province: 'ON', city: 'Niagara Region', website: '',                              contact: '' },
  { name: 'Solar Cheerleading Club',          province: 'ON', city: 'Ontario',        website: '',                              contact: '' },
  { name: 'Supreme Cheerleading',             province: 'ON', city: 'Ontario',        website: '',                              contact: '' },
  { name: 'Tigers Athletics',                 province: 'ON', city: 'Ontario',        website: '',                              contact: '' },
  // Quebec
  { name: 'Centre Coyotes',                   province: 'QC', city: 'Quebec',         website: '',                              contact: '' },
  { name: 'Cheer Sport Sharks – Laval',       province: 'QC', city: 'Laval',          website: 'https://cheersportsharks.com',  contact: '' },
  { name: 'Cheer Sport Sharks – Québec City', province: 'QC', city: 'Québec City',    website: 'https://cheersportsharks.com',  contact: '' },
  { name: 'Club Gymini (G-Force)',             province: 'QC', city: 'Quebec',         website: '',                              contact: '' },
  { name: 'Flyers Cheerleading',              province: 'QC', city: 'Quebec',         website: '',                              contact: '' },
  { name: 'Spirit Cheer 07',                  province: 'QC', city: 'Quebec',         website: '',                              contact: '' },
  { name: 'Zodiak Elite',                     province: 'QC', city: 'Quebec',         website: '',                              contact: '' },
  // Alberta
  { name: 'Alberta Cheer Empire',             province: 'AB', city: 'Alberta',        website: '',                              contact: '' },
  { name: 'Calgary Stars All-Star Cheer',     province: 'AB', city: 'Calgary',        website: '',                              contact: '' },
  { name: 'Cheer Sport Sharks – Edmonton',    province: 'AB', city: 'Edmonton',       website: 'https://cheersportsharks.com',  contact: '' },
  { name: 'Gymniks All-Stars',                province: 'AB', city: 'Alberta',        website: '',                              contact: '' },
  { name: 'Peak Elite Cheerleading',          province: 'AB', city: 'Alberta',        website: '',                              contact: '' },
  { name: 'Perfect Storm Athletics – Edmonton', province: 'AB', city: 'Edmonton',     website: '',                              contact: '' },
  { name: 'Perfect Storm – Sherwood Park',    province: 'AB', city: 'Sherwood Park',  website: '',                              contact: '' },
  { name: 'Premier Academy – Bonnyville',     province: 'AB', city: 'Bonnyville',     website: '',                              contact: '' },
  { name: 'Premier Academy – Fort McMurray',  province: 'AB', city: 'Fort McMurray',  website: '',                              contact: '' },
  { name: 'Premier Academy – Red Deer',       province: 'AB', city: 'Red Deer',       website: '',                              contact: '' },
  // British Columbia
  { name: 'Cheer Sport Sharks – Vancouver',   province: 'BC', city: 'Vancouver',      website: 'https://cheersportsharks.com',  contact: '' },
  { name: 'Freeze Athletics',                 province: 'BC', city: 'British Columbia', website: '',                            contact: '' },
  { name: 'Kelowna Cheer Athletics (KCA)',    province: 'BC', city: 'Kelowna',        website: '',                              contact: '' },
  { name: 'Okanagan Firestorm Cheer',         province: 'BC', city: 'Okanagan',       website: '',                              contact: '' },
  { name: 'Vancouver All Stars (G Force Gym)', province: 'BC', city: 'Vancouver',     website: '',                              contact: '' },
  // Saskatchewan
  { name: 'Aerial Cheer Athletics',           province: 'SK', city: 'Saskatchewan',   website: '',                              contact: '' },
  { name: 'Airbourne Cheer Athletics',        province: 'SK', city: 'Saskatchewan',   website: '',                              contact: '' },
  { name: 'Biggar Cheerleading',              province: 'SK', city: 'Biggar',         website: '',                              contact: '' },
  { name: 'Boss Athletics',                   province: 'SK', city: 'Saskatchewan',   website: '',                              contact: '' },
  { name: 'Bravo Dance Company',              province: 'SK', city: 'Saskatchewan',   website: '',                              contact: '' },
  { name: 'Channel Performance',              province: 'SK', city: 'Saskatchewan',   website: '',                              contact: '' },
  { name: 'Gridders Cheerleading',            province: 'SK', city: 'Saskatchewan',   website: '',                              contact: '' },
  { name: 'Infinity Athletics',               province: 'SK', city: 'Saskatchewan',   website: '',                              contact: '' },
  { name: 'Prairie Fire Cheerleading',        province: 'SK', city: 'Saskatchewan',   website: '',                              contact: '' },
  { name: 'Prince Albert Cheer Explosion',    province: 'SK', city: 'Prince Albert',  website: '',                              contact: '' },
  { name: 'Rebels Cheerleading Athletics',    province: 'SK', city: 'Saskatchewan',   website: '',                              contact: '' },
  { name: 'Warman Ultimate Cheerleading',     province: 'SK', city: 'Warman',         website: '',                              contact: '' },
  { name: 'Western Cheer',                    province: 'SK', city: 'Saskatchewan',   website: '',                              contact: '' },
  // Manitoba
  { name: 'Central Cheer',                    province: 'MB', city: 'Winnipeg',       website: '',                              contact: '' },
  { name: 'Phoenix Cheer Athletics',          province: 'MB', city: 'Manitoba',       website: '',                              contact: '' },
  { name: 'Vision Cheer Company',             province: 'MB', city: 'Manitoba',       website: '',                              contact: '' },
  // New Brunswick
  { name: 'Olympia Allstar Cheerleading',     province: 'NB', city: 'Moncton',        website: '',                              contact: '' },
  { name: 'Sky Athletics Cheerleading',       province: 'NB', city: 'Saint John',     website: '',                              contact: '' },
  // Nova Scotia
  { name: 'Empire Athletics South Shore',     province: 'NS', city: 'South Shore',    website: '',                              contact: '' },
  { name: 'Extreme Athletics',                province: 'NS', city: 'Dartmouth',      website: '',                              contact: '' },
  { name: 'Halifax Cheer Elite',              province: 'NS', city: 'Halifax',        website: '',                              contact: '' },
  { name: 'Integrity Cheer Empire',           province: 'NS', city: 'Windsor & Kentville', website: '',                         contact: '' },
  { name: 'Legacy Cheer Atlantic',            province: 'NS', city: 'Dartmouth',      website: '',                              contact: '' },
  { name: 'Premier Cheer All-Stars',          province: 'NS', city: 'Sydney',         website: '',                              contact: '' },
  // Prince Edward Island
  { name: 'Passion Elite Cheer',              province: 'PE', city: 'Charlottetown',  website: '',                              contact: '' },
  // Newfoundland & Labrador
  { name: 'Cheer Sport Sharks – NL',          province: 'NL', city: 'Mount Pearl',    website: 'https://cheersportsharks.com',  contact: '' },
];

function provinceColor(code: string): string {
  return PROVINCES.find((p) => p.code === code)?.color ?? C.mist;
}

function provinceName(code: string): string {
  return PROVINCES.find((p) => p.code === code)?.name ?? code;
}

/* ── Gym card ────────────────────────────────────────────── */
function GymCard({ gym }: { gym: Gym }) {
  const [open, setOpen] = useState(false);
  const accent = provinceColor(gym.province);

  return (
    <div
      onClick={() => setOpen((o) => !o)}
      style={{
        background:    open ? C.courtLight : C.court,
        border:        `1px solid ${open ? accent : '#243A63'}`,
        borderRadius:  12,
        padding:       open ? '20px 20px 16px' : '16px 20px',
        cursor:        'pointer',
        transition:    'all 0.18s ease',
        userSelect:    'none',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        {/* Province badge */}
        <span style={{
          flexShrink:     0,
          fontSize:       10,
          fontWeight:     700,
          letterSpacing:  '0.08em',
          color:          accent,
          background:     `${accent}22`,
          borderRadius:   6,
          padding:        '3px 7px',
          marginTop:      2,
          fontFamily:     'var(--font-ibm-mono, monospace)',
        }}>
          {gym.province}
        </span>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            margin:       0,
            fontSize:     15,
            fontWeight:   600,
            color:        C.chalk,
            lineHeight:   1.3,
          }}>
            {gym.name}
          </p>
          <p style={{
            margin:       '3px 0 0',
            fontSize:     12,
            color:        C.mist,
          }}>
            {gym.city}
          </p>
        </div>

        {/* Chevron */}
        <span style={{
          color:      C.mist,
          fontSize:   14,
          transform:  open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.18s ease',
          flexShrink: 0,
          marginTop:  2,
        }}>
          ▾
        </span>
      </div>

      {/* Expanded detail */}
      {open && (
        <div
          style={{
            marginTop:   14,
            paddingTop:  14,
            borderTop:   `1px solid ${C.courtLight}`,
            display:     'flex',
            flexDirection: 'column',
            gap:         10,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <DetailRow label="Province" value={provinceName(gym.province)} />
          <DetailRow label="City"     value={gym.city || '—'} />
          <DetailRow label="Contact"  value={gym.contact || 'Contact gym directly'} />

          {/* Website */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: C.mist, width: 72, flexShrink: 0, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Website</span>
            {gym.website ? (
              <a
                href={gym.website}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize:       13,
                  fontWeight:     600,
                  color:          C.gold,
                  textDecoration: 'none',
                  padding:        '5px 14px',
                  background:     `${C.gold}18`,
                  border:         `1px solid ${C.gold}55`,
                  borderRadius:   8,
                  display:        'inline-flex',
                  alignItems:     'center',
                  gap:            6,
                }}
              >
                Visit Website ↗
              </a>
            ) : (
              <span style={{ fontSize: 13, color: C.mist }}>Search on social media</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{
        fontSize:       11,
        color:          C.mist,
        width:          72,
        flexShrink:     0,
        letterSpacing:  '0.04em',
        textTransform:  'uppercase',
      }}>
        {label}
      </span>
      <span style={{ fontSize: 13, color: C.chalk }}>{value}</span>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────── */
export default function GymDirectoryPage() {
  const [query,    setQuery]    = useState('');
  const [province, setProvince] = useState('ALL');

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return GYMS.filter((g) => {
      const matchProvince = province === 'ALL' || g.province === province;
      const matchQuery    = !q ||
        g.name.toLowerCase().includes(q) ||
        g.city.toLowerCase().includes(q) ||
        g.province.toLowerCase().includes(q) ||
        provinceName(g.province).toLowerCase().includes(q);
      return matchProvince && matchQuery;
    });
  }, [query, province]);

  /* Group by province for "All" view */
  const grouped = useMemo(() => {
    if (province !== 'ALL') return null;
    const map: Record<string, Gym[]> = {};
    for (const g of filtered) {
      if (!map[g.province]) map[g.province] = [];
      map[g.province].push(g);
    }
    const order = PROVINCES.filter((p) => p.code !== 'ALL').map((p) => p.code);
    return order.filter((c) => map[c]).map((c) => ({ code: c, gyms: map[c] }));
  }, [filtered, province]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { ALL: GYMS.length };
    for (const g of GYMS) map[g.province] = (map[g.province] ?? 0) + 1;
    return map;
  }, []);

  return (
    <div style={{
      minHeight:  '100dvh',
      background: C.ink,
      color:      C.chalk,
      fontFamily: 'var(--font-inter, system-ui, sans-serif)',
    }}>
      {/* ── Header ── */}
      <div style={{
        background:   `linear-gradient(160deg, ${C.court} 0%, ${C.ink} 100%)`,
        padding:      '40px 24px 32px',
        textAlign:    'center',
        borderBottom: `1px solid ${C.courtLight}`,
      }}>
        <p style={{
          margin:         0,
          fontSize:       11,
          letterSpacing:  '0.18em',
          color:          C.gold,
          fontWeight:     700,
          textTransform:  'uppercase',
          fontFamily:     'var(--font-ibm-mono, monospace)',
          marginBottom:   10,
        }}>
          The Cheer Hub
        </p>
        <h1 style={{
          margin:       0,
          fontSize:     'clamp(28px, 6vw, 44px)',
          fontWeight:   800,
          letterSpacing: '-0.02em',
          lineHeight:   1.1,
          fontFamily:   'var(--font-bebas, sans-serif)',
        }}>
          Canadian All-Star Gym Directory
        </h1>
        <p style={{
          margin:    '10px 0 0',
          fontSize:  14,
          color:     C.mist,
          maxWidth:  480,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          {GYMS.length} verified all-star cheerleading gyms across Canada · 2026–2027 season
        </p>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '24px 16px 80px' }}>

        {/* ── Search ── */}
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <span style={{
            position:  'absolute',
            left:      14,
            top:       '50%',
            transform: 'translateY(-50%)',
            color:     C.mist,
            fontSize:  16,
            pointerEvents: 'none',
          }}>
            🔍
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search gyms, cities, provinces…"
            style={{
              width:        '100%',
              boxSizing:    'border-box',
              padding:      '13px 16px 13px 42px',
              background:   C.court,
              border:       `1px solid ${C.courtLight}`,
              borderRadius: 12,
              color:        C.chalk,
              fontSize:     15,
              outline:      'none',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                position:   'absolute',
                right:      12,
                top:        '50%',
                transform:  'translateY(-50%)',
                background: 'none',
                border:     'none',
                color:      C.mist,
                cursor:     'pointer',
                fontSize:   18,
                lineHeight: 1,
                padding:    4,
              }}
            >
              ×
            </button>
          )}
        </div>

        {/* ── Province filter ── */}
        <div style={{
          display:         'flex',
          gap:             8,
          overflowX:       'auto',
          paddingBottom:   8,
          marginBottom:    24,
          scrollbarWidth:  'none',
        }}>
          {PROVINCES.map((p) => {
            const active = province === p.code;
            return (
              <button
                key={p.code}
                onClick={() => setProvince(p.code)}
                style={{
                  flexShrink:     0,
                  padding:        '7px 14px',
                  borderRadius:   20,
                  border:         `1px solid ${active ? p.color : C.courtLight}`,
                  background:     active ? `${p.color}22` : 'transparent',
                  color:          active ? p.color : C.mist,
                  fontSize:       12,
                  fontWeight:     active ? 700 : 400,
                  cursor:         'pointer',
                  whiteSpace:     'nowrap',
                  transition:     'all 0.15s ease',
                  letterSpacing:  '0.02em',
                }}
              >
                {p.code === 'ALL' ? 'All' : p.code}
                <span style={{ marginLeft: 5, opacity: 0.7, fontSize: 11 }}>
                  {counts[p.code] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Results count ── */}
        {query && (
          <p style={{ fontSize: 13, color: C.mist, marginBottom: 16 }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
          </p>
        )}

        {/* ── Gym list ── */}
        {province !== 'ALL' || query ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.length === 0 ? (
              <p style={{ color: C.mist, textAlign: 'center', paddingTop: 40 }}>No gyms found.</p>
            ) : (
              filtered.map((g) => <GymCard key={g.name} gym={g} />)
            )}
          </div>
        ) : (
          /* Grouped by province */
          grouped?.map(({ code, gyms: gs }) => (
            <div key={code} style={{ marginBottom: 32 }}>
              <div style={{
                display:       'flex',
                alignItems:    'center',
                gap:           10,
                marginBottom:  12,
              }}>
                <div style={{
                  height:     2,
                  width:      20,
                  background: provinceColor(code),
                  borderRadius: 1,
                }} />
                <h2 style={{
                  margin:         0,
                  fontSize:       12,
                  fontWeight:     700,
                  letterSpacing:  '0.12em',
                  textTransform:  'uppercase',
                  color:          provinceColor(code),
                  fontFamily:     'var(--font-ibm-mono, monospace)',
                }}>
                  {provinceName(code)}
                </h2>
                <span style={{
                  fontSize:   11,
                  color:      C.mist,
                  marginLeft: 2,
                }}>
                  {gs.length} gym{gs.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {gs.map((g) => <GymCard key={g.name} gym={g} />)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Footer ── */}
      <div style={{
        textAlign:    'center',
        padding:      '20px 24px 40px',
        borderTop:    `1px solid ${C.courtLight}`,
        color:        C.mist,
        fontSize:     12,
      }}>
        <p style={{ margin: 0 }}>
          Data sourced from the Cheer Hub Canadian All-Star Gym Directory · Updated 2026–2027
        </p>
        <p style={{ margin: '6px 0 0' }}>
          <a
            href="/live-scores"
            style={{ color: C.gold, textDecoration: 'none', fontWeight: 600 }}
          >
            ← Back to Live Scores
          </a>
        </p>
      </div>
    </div>
  );
}
