import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/site-config';

export const metadata: Metadata = buildMetadata({
  title: 'SaaS Valuation Calculator | CounterX',
  description: 'Calculate your SaaS business value using MRR multiples, growth rates, and market comparables. Get instant valuation estimates based on real transaction data.',
  url: `${SITE_CONFIG.url}/calculator`,
  keywords: ['SaaS calculator', 'valuation calculator', 'MRR calculator', 'SaaS valuation', 'ARR multiple calculator'],
});

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
