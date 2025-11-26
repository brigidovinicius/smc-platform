import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Valuation Calculator | CounterX',
  description: 'Discover how much your SaaS is worth in minutes with our intelligent calculator based on market multiples.',
  metadataBase: new URL(SITE_CONFIG.url),
  alternates: {
    canonical: `${SITE_CONFIG.url}/calculator`,
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
    title: 'Valuation Calculator | CounterX',
    description: 'Calculate your SaaS valuation based on MRR, growth, and market multiples.',
    type: 'website',
    url: `${SITE_CONFIG.url}/calculator`,
    siteName: SITE_CONFIG.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Valuation Calculator | CounterX',
    description: 'Calculate your SaaS valuation in minutes.',
    creator: SITE_CONFIG.twitter.handle,
  },
};

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

