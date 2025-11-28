import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/site-config';
import CalculatorContent from './CalculatorContent';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Valuation Calculator | CounterX',
    description: 'Descubra quanto vale o seu SaaS em poucos minutos com nossa calculadora inteligente baseada em múltiplos de mercado e 326+ transações reais.',
    url: `${SITE_CONFIG.url}/calculator`,
    keywords: ['valuation calculator', 'SaaS calculator', 'MRR calculator', 'ARR calculator', 'business valuation tool'],
  });
}

export default function CalculatorPage() {
  return <CalculatorContent />;
}
