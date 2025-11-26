import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Support | CounterX',
  description: 'Contact CounterX support team. Email support, FAQ, and help with due diligence, onboarding, and platform questions.',
  metadataBase: new URL(SITE_CONFIG.url),
  alternates: {
    canonical: `${SITE_CONFIG.url}/suporte`,
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
    title: 'Support | CounterX',
    description: 'Contact CounterX support team for help with platform questions.',
    type: 'website',
    url: `${SITE_CONFIG.url}/suporte`,
    siteName: SITE_CONFIG.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Support | CounterX',
    description: 'Get support from CounterX team.',
    creator: SITE_CONFIG.twitter.handle,
  },
};

export default function SuporteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

