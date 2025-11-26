import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Resources | CounterX',
  description: 'Explore all tools and content available on the CounterX platform: blog, marketplace, valuation calculator, FAQ, and support.',
  metadataBase: new URL(SITE_CONFIG.url),
  alternates: {
    canonical: `${SITE_CONFIG.url}/recursos`,
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
    title: 'Resources | CounterX',
    description: 'Explore all tools and content available on the CounterX platform.',
    type: 'website',
    url: `${SITE_CONFIG.url}/recursos`,
    siteName: SITE_CONFIG.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resources | CounterX',
    description: 'Explore CounterX platform resources.',
    creator: SITE_CONFIG.twitter.handle,
  },
};

export default function RecursosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

