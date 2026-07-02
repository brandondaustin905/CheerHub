import type { Metadata, Viewport } from 'next';
import { Bebas_Neue, Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable:  '--font-inter',
  subsets:   ['latin'],
  display:   'swap',
});

const bebasNeue = Bebas_Neue({
  variable: '--font-bebas',
  weight:   '400',
  subsets:  ['latin'],
  display:  'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-mono',
  weight:   ['400', '500'],
  subsets:  ['latin'],
  display:  'swap',
});

const APP_TITLE       = 'Cheer Hub — Canadian All-Star Live Scores';
const APP_DESCRIPTION = 'Follow live scores at Canadian All-Star cheerleading competitions. Community-reported, updated in real time. Track your favourite teams across all divisions.';

export const metadata: Metadata = {
  title: {
    default:  APP_TITLE,
    template: '%s | Cheer Hub',
  },
  description: APP_DESCRIPTION,
  keywords: [
    'Canadian cheer', 'all-star cheerleading', 'live scores', 'Canadian Cheer',
    'cheer competition', 'cheerleading scores', 'Canadian All-Star', 'cheer hub',
    'cheer canada', 'cheer nationals', 'Ontario cheer', 'cheerleading results',
  ],
  openGraph: {
    type:        'website',
    locale:      'en_CA',
    siteName:    'Cheer Hub',
    title:       APP_TITLE,
    description: APP_DESCRIPTION,
  },
  twitter: {
    card:        'summary',
    title:       APP_TITLE,
    description: 'Live scores at Canadian All-Star cheer competitions — updated in real time.',
  },
  appleWebApp: {
    capable:         true,
    title:           'Cheer Hub',
    statusBarStyle:  'black-translucent',
  },
  manifest: '/manifest.json',
  robots: {
    index:  true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width:               'device-width',
  initialScale:        1,
  maximumScale:        1,
  themeColor:          '#10151F',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-CA"
      className={`${inter.variable} ${bebasNeue.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full" style={{ background: '#10151F' }}>
        {children}
      </body>
    </html>
  );
}
