import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Legal Center | CounterX',
  description: 'Review the policies governing marketplace use, data handling, and cookies on CounterX platform.',
  metadataBase: new URL(SITE_CONFIG.url),
  alternates: {
    canonical: `${SITE_CONFIG.url}/legal`,
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
    title: 'Legal Center | CounterX',
    description: 'Review CounterX legal policies and terms.',
    type: 'website',
    url: `${SITE_CONFIG.url}/legal`,
    siteName: SITE_CONFIG.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Legal Center | CounterX',
    description: 'Review CounterX legal policies.',
    creator: SITE_CONFIG.twitter.handle,
  },
};

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

