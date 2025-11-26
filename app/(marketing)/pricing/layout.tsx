import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Plans & Pricing | CounterX',
  description: 'Choose the ideal plan for your digital M&A needs. Free starter plan, Professional at $299/month, and Enterprise custom solutions.',
  metadataBase: new URL(SITE_CONFIG.url),
  alternates: {
    canonical: `${SITE_CONFIG.url}/pricing`,
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
    title: 'Plans & Pricing | CounterX',
    description: 'Choose the ideal plan for your digital M&A needs. Free starter, Professional, and Enterprise plans available.',
    type: 'website',
    url: `${SITE_CONFIG.url}/pricing`,
    siteName: SITE_CONFIG.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Plans & Pricing | CounterX',
    description: 'Choose the ideal plan for your digital M&A needs.',
    creator: SITE_CONFIG.twitter.handle,
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

