'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { COLORS } from '@/lib/cheerhub/constants';

interface FAQ { q: string; a: string }
interface Section { id: string; title: string; emoji: string; items: FAQ[] }

const SECTIONS: Section[] = [
  {
    id: 'comp-day',
    title: 'Competition Day',
    emoji: '📅',
    items: [
      { q: 'What time should we arrive?', a: 'Plan to arrive at least 90 minutes before your team\'s scheduled warm-up time. Check-in, athlete check (hair, uniform, makeup), and warm-up all happen before you perform — it goes fast.' },
      { q: 'What do I bring?', a: 'Extra bows (at least 2 spares), bobby pins, hairspray, safety pins, medical tape, snacks and water for your athlete, cash for the concession, a portable charger, and a light blanket — arenas get cold. A GoPro or phone mount for the stands helps capture the performance.' },
      { q: 'Can I watch warm-ups?', a: 'Usually no. Warm-up floors are restricted to coaches and athletes only. You\'ll typically be able to watch from the stands once the main competition floor opens.' },
      { q: 'How long is a routine?', a: 'All-Star routines are exactly 2 minutes 30 seconds. The music stops, the judges write — it\'s fast, so enjoy every second.' },
      { q: 'When are awards?', a: 'Awards are usually held at the end of each session or at the end of the day. Check the schedule posted at registration. Results are NOT official until announced — scores posted mid-event are preliminary.' },
      { q: 'What should my athlete eat before competing?', a: 'A light meal 2–3 hours before — something familiar they\'ve eaten before. Avoid heavy or greasy food. A banana, peanut butter toast, or rice are popular choices. Keep snacks and water on hand all day.' },
    ],
  },
  {
    id: 'scoring',
    title: 'Understanding Scores & Results',
    emoji: '🏆',
    items: [
      { q: 'How does judging work?', a: 'Judges score Building (stunts, pyramids, basket tosses), Tumbling & Jumps, Choreography, and Performance. Each section has a maximum point value. Deductions are subtracted for safety violations, out-of-bounds tumbling, or illegal skills. The highest total wins.' },
      { q: 'What are deductions?', a: 'Points are subtracted for things like: illegal skills for the level, out-of-bounds tumbling, dropped stunts (execution), or safety violations. A single deduction can be anywhere from 0.5 to 5 points depending on severity.' },
      { q: 'What does NT mean?', a: 'NT stands for National Team. These divisions follow the same level rules but only registered Cheer Canada National Team athletes may compete. NT teams are eligible for World Championship bids.' },
      { q: 'What is a World bid?', a: 'A bid is an invitation to compete at The Cheerleading Worlds in Orlando, Florida — the biggest event in the sport. Bids are awarded at select competitions throughout the season to top-ranking teams.' },
      { q: 'Why don\'t the scores match what I saw on the app?', a: 'Cheer Hub shows community-reported scores — judges in the stands entering what they estimate based on the performance. Official scores come from the certified judging panel and are released at awards. Always defer to official results.' },
      { q: 'What is a "Finals qualifier"?', a: 'Many competitions have a Preliminary round and a Finals round. Teams must achieve a qualifying score in Prelims to advance to Finals. Finals scores start fresh — Prelims scores don\'t carry over.' },
    ],
  },
  {
    id: 'glossary',
    title: 'Cheer Glossary',
    emoji: '📖',
    items: [
      { q: 'Flyer', a: 'The athlete who is lifted, tossed, or held in the air during stunts and pyramids. Requires extreme body awareness, strength, and trust.' },
      { q: 'Base', a: 'Athletes who lift and support the flyer. The main base holds the flyer\'s foot or ankle during stunts.' },
      { q: 'Back Spot', a: 'The athlete who stands behind the stunt and supports the flyer\'s waist or ankles during the lift. Critical for safety.' },
      { q: 'Front Spot', a: 'Optional fourth person who supports the flyer from the front, typically holding the ankles for added stability.' },
      { q: 'Lib / Liberty', a: 'A stunt where the flyer stands on one foot with the other leg pulled up. One of the most common stunt positions.' },
      { q: 'Needle', a: 'An advanced stunt where the flyer\'s standing leg is held vertical while the other extends straight down — requires extreme flexibility.' },
      { q: 'Tick-Tock', a: 'A transition where the flyer switches from one foot to the other while in the air. Often incorporated into stunt sequences.' },
      { q: 'Basket Toss', a: 'A toss where two bases interlock hands (forming a basket) and throw the flyer into the air. The flyer performs a skill (twist, toe touch, etc.) before being caught.' },
      { q: 'Pyramid', a: 'A structure where multiple stunt groups are connected — flyers or bases from one stunt touch or connect to another. Creates visually impressive multi-level formations.' },
      { q: 'Back Handspring', a: 'A backward tumbling skill — jump back onto hands, then snap feet over. Often abbreviated BHS. Required or common at Levels 2–3.' },
      { q: 'Back Tuck', a: 'A backward somersault with the body tucked. First major aerial tumbling skill — common at Level 3.' },
      { q: 'Layout', a: 'A backward somersault with the body fully extended (straight, not tucked). More difficult than a tuck. Common at Level 4–5.' },
      { q: 'Full', a: 'A layout with a 360° twist. Often called a "full twist." Standard at Level 5+.' },
      { q: 'Double Full', a: 'A layout with 720° of twist (two full rotations). Elite skill seen at Level 6–7.' },
      { q: 'Running Pass', a: 'A tumbling sequence performed after taking a running start, e.g., round-off back handspring full.' },
      { q: 'Standing Tumbling', a: 'Tumbling performed from a standing position with no running start — harder to generate power.' },
      { q: 'Inversion', a: 'Any skill where the flyer\'s head goes below their hips while in the air. Inversions are level-restricted and carry higher risk.' },
      { q: 'Scratch', a: 'When a team withdraws from a competition after registering. Teams may scratch due to injury, illness, or insufficient athletes.' },
    ],
  },
  {
    id: 'levels',
    title: 'Level Guide for Parents',
    emoji: '📈',
    items: [
      { q: 'What is the difference between levels?', a: 'Each level (1–7) unlocks more difficult and risky skills. Level 1 is the most beginner-friendly with basic stunts and no aerial tumbling. Level 7 is the most elite — reserved for the most skilled athletes in Canada.' },
      { q: 'How does a team move up a level?', a: 'The coaching staff determines when a team is ready to move up — it\'s based on the team\'s overall skill set, not any single athlete. Teams must be able to safely and consistently perform the skills required at the new level.' },
      { q: 'My child is a Level 3 athlete — what does that mean?', a: 'It means the team they compete on is registered in a Level 3 division. Individual athletes don\'t have personal levels — the level belongs to the team. Your child may work on skills above or below their team\'s level in practice.' },
      { q: 'What is the difference between Novice and Level 1?', a: 'Novice is designed for brand-new athletes with no prior competition experience. The skill requirements are relaxed and judging focuses on fundamentals. Level 1 has stricter skill requirements and is for teams with some competition experience.' },
      { q: 'What is Level 4.2?', a: 'Level 4.2 is a transitional division that bridges Level 4 and Level 5. Teams in this division use advanced Level 4 skills but aren\'t quite ready for the jump to Level 5 skill requirements.' },
    ],
  },
  {
    id: 'season',
    title: 'The Canadian Cheer Season',
    emoji: '🗓',
    items: [
      { q: 'When does the season start?', a: 'Most Canadian All-Star teams begin practices in August or September. The competition season typically runs from November through April/May, ending at Canadian Nationals.' },
      { q: 'What is Canadian Nationals?', a: 'The Canadian All-Star Nationals (hosted by Canadian Cheer) is the biggest domestic event of the year — typically held in Mississauga, ON in April. Thousands of athletes from across Canada compete over multiple days.' },
      { q: 'What are "Canadian Cheer" events vs independent events?', a: 'Canadian Cheer is the main event series in Canada — they run 15+ events per season including Regionals, Provincials, Finals, and Nationals. Independent events (like Spirit Sports, New Era, or regional associations) run alongside the Canadian Cheer series.' },
      { q: 'What happens if my athlete gets injured mid-season?', a: 'Talk to your gym director immediately. Teams can sometimes compete with fewer athletes (substitutions may be allowed), or they may scratch from specific events. Athlete safety always comes first — never pressure a hurt athlete to compete.' },
      { q: 'How much does the season cost?', a: 'Costs vary by gym and team level. Expect tuition ($150–$400/month), competition fees ($100–$300 per event), uniform costs ($200–$600 every few years), travel, shoes, and accessories. Ask your gym for a full cost breakdown before committing.' },
    ],
  },
];

function AccordionItem({ item }: { item: FAQ }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${COLORS.courtLight}` }}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start justify-between gap-3 py-3.5 text-left"
      >
        <span className="text-sm font-medium leading-snug" style={{ color: COLORS.chalk }}>{item.q}</span>
        <ChevronDown
          size={16}
          className="shrink-0 mt-0.5"
          style={{ color: COLORS.mist, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
        />
      </button>
      {open && (
        <p className="text-sm pb-4 leading-relaxed" style={{ color: COLORS.mist }}>
          {item.a}
        </p>
      )}
    </div>
  );
}

export default function LearnTab() {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const section = SECTIONS.find((s) => s.id === activeSection)!;

  return (
    <div className="pb-28">
      {/* Header */}
      <div style={{ background: `linear-gradient(180deg, ${COLORS.court} 0%, ${COLORS.ink} 100%)` }}>
        <div className="max-w-2xl mx-auto px-4 pt-6 pb-4">
          <h2 className="chl-display text-3xl mb-1" style={{ color: COLORS.chalk }}>Parent Hub</h2>
          <p className="text-sm" style={{ color: COLORS.mist }}>Everything cheer parents need to know.</p>
        </div>

        {/* Section tabs — horizontal scroll */}
        <div className="overflow-x-auto chl-no-scrollbar">
          <div className="flex gap-2 px-4 pb-4 min-w-max">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all"
                style={{
                  background: s.id === activeSection ? COLORS.gold : COLORS.courtLight,
                  color:      s.id === activeSection ? COLORS.ink  : COLORS.mist,
                }}
              >
                <span>{s.emoji}</span> {s.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ list */}
      <div className="max-w-2xl mx-auto px-4 pt-4">
        <div
          className="rounded-2xl px-4"
          style={{ background: COLORS.court, border: `1px solid ${COLORS.courtLight}` }}
        >
          {section.items.map((item) => (
            <AccordionItem key={item.q} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
