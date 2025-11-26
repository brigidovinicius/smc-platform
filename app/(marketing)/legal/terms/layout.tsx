import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Terms of Use | CounterX',
  description: 'Rules for platform use, registration, confidentiality, and liability limitations on CounterX.',
  metadataBase: new URL(SITE_CONFIG.url),
  alternates: {
    canonical: `${SITE_CONFIG.url}/legal/terms`,
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
    title: 'Terms of Use | CounterX',
    description: 'CounterX platform terms of use and service rules.',
    type: 'website',
    url: `${SITE_CONFIG.url}/legal/terms`,
    siteName: SITE_CONFIG.name,
  },
  twitter: {
    card: 'summary',
    title: 'Terms of Use | CounterX',
    description: 'CounterX terms of use.',
    creator: SITE_CONFIG.twitter.handle,
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

