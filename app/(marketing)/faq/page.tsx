import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/site-config';
import FAQContent from './FAQContent';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Frequently Asked Questions | CounterX',
    description: 'Get answers about CounterX, how our platform works, automated valuation, verified buyers, secure deal rooms, and digital asset transactions.',
    url: `${SITE_CONFIG.url}/faq`,
    keywords: ['FAQ', 'help', 'support', 'questions', 'answers', 'how it works', 'counterx help'],
  });
}

export default function FAQPage() {
  return <FAQContent />;
}
