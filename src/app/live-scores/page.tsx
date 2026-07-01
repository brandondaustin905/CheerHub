import type { Metadata } from 'next';
import CheerHubLiveScores from '@/components/live-scores/CheerHubLiveScores';

export const metadata: Metadata = {
  title: 'Live Scores — Cheer Hub',
  description: 'Real-time Canadian All-Star cheerleading competition scores, community-reported.',
};

export default function LiveScoresPage() {
  return <CheerHubLiveScores />;
}
