import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Cookie Policy | CounterX',
  description: 'Information about session cookies, analytics, and preferences used on CounterX platform.',
  metadataBase: new URL(SITE_CONFIG.url),
  alternates: {
    canonical: `${SITE_CONFIG.url}/legal/cookies`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Cookie Policy | CounterX',
    description: 'CounterX cookie policy and usage information.',
    type: 'website',
    url: `${SITE_CONFIG.url}/legal/cookies`,
    siteName: SITE_CONFIG.name,
  },
  twitter: {
    card: 'summary',
    title: 'Cookie Policy | CounterX',
    description: 'CounterX cookie policy.',
    creator: SITE_CONFIG.twitter.handle,
  },
};

export default function CookiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

