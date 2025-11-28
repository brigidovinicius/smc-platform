import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/site-config';
import PricingContent from './PricingContent';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Pricing Plans | CounterX',
    description: 'Choose the ideal plan for your digital M&A needs. Free Starter plan, Professional at $299/month, and Enterprise custom solutions.',
    url: `${SITE_CONFIG.url}/pricing`,
    keywords: ['pricing', 'plans', 'subscription', 'SaaS marketplace pricing', 'deal room pricing'],
  });
}

export default function PricingPage() {
  return <PricingContent />;
}
