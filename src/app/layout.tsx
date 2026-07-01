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

export const metadata: Metadata = {
  title:       'Cheer Hub',
  description: 'Canadian All-Star cheerleading community — live scores, news, and more.',
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
      lang="en"
      className={`${inter.variable} ${bebasNeue.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full" style={{ background: '#10151F' }}>
        {children}
      </body>
    </html>
  );
}
