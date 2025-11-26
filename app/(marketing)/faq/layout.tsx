import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | CounterX',
  description: 'Get answers about CounterX and how our platform works. Learn about automated valuation, due diligence, and digital asset transactions.',
  metadataBase: new URL(SITE_CONFIG.url),
  alternates: {
    canonical: `${SITE_CONFIG.url}/faq`,
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
    title: 'FAQ | CounterX',
    description: 'Frequently asked questions about CounterX platform, valuation, and digital asset transactions.',
    type: 'website',
    url: `${SITE_CONFIG.url}/faq`,
    siteName: SITE_CONFIG.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQ | CounterX',
    description: 'Get answers about CounterX platform.',
    creator: SITE_CONFIG.twitter.handle,
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

