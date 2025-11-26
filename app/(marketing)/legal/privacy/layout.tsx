import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Privacy Policy | CounterX',
  description: 'How we collect, store, and use your personal data within the CounterX Platform. Your privacy is important to us.',
  metadataBase: new URL(SITE_CONFIG.url),
  alternates: {
    canonical: `${SITE_CONFIG.url}/legal/privacy`,
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
    title: 'Privacy Policy | CounterX',
    description: 'CounterX privacy policy and data handling practices.',
    type: 'website',
    url: `${SITE_CONFIG.url}/legal/privacy`,
    siteName: SITE_CONFIG.name,
  },
  twitter: {
    card: 'summary',
    title: 'Privacy Policy | CounterX',
    description: 'CounterX privacy policy.',
    creator: SITE_CONFIG.twitter.handle,
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

