'use client';

import { MarketingPageLayout } from '../_components/MarketingPageLayout';
import ValuationCalculator from '@/components/calculator/ValuationCalculator';

export default function CalculatorPage() {
  return (
    <MarketingPageLayout
      title="Calculadora de Valuation"
      description="Descubra quanto vale o seu SaaS em poucos minutos com nossa calculadora inteligente baseada em múltiplos de mercado"
      showHero={true}
    >
      <section className="py-16 bg-background relative overflow-hidden">
        <div className="container relative z-10">
          <ValuationCalculator />
        </div>
      </section>
    </MarketingPageLayout>
  );
}
