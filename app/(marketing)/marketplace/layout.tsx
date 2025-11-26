import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Marketplace | CounterX',
  description: 'Browse digital assets available for purchase. Filter by business type, price range, and metrics.',
  metadataBase: new URL(SITE_CONFIG.url),
  alternates: {
    canonical: `${SITE_CONFIG.url}/marketplace`,
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
    title: 'Marketplace | CounterX',
    description: 'Browse digital assets available for purchase on CounterX marketplace.',
    type: 'website',
    url: `${SITE_CONFIG.url}/marketplace`,
    siteName: SITE_CONFIG.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marketplace | CounterX',
    description: 'Browse digital assets for purchase.',
    creator: SITE_CONFIG.twitter.handle,
  },
};

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

