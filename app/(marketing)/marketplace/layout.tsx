import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/site-config';

export const metadata: Metadata = buildMetadata({
  title: 'Digital Assets Marketplace | CounterX',
  description: 'Browse verified SaaS businesses, websites, and digital assets for sale. Complete financial data, automated valuation, and secure transactions.',
  url: `${SITE_CONFIG.url}/marketplace`,
  keywords: ['digital assets marketplace', 'buy SaaS', 'buy website', 'SaaS for sale', 'digital assets for sale', 'marketplace'],
});

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
