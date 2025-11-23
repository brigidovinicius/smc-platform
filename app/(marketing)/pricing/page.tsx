'use client';

import { MarketingPageLayout } from '../_components/MarketingPageLayout';
import { GridBackground } from '@/components/marketing';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: 'Grátis',
    description: 'Para quem está começando',
    features: [
      'Acesso ao marketplace',
      'Visualização de ofertas públicas',
      'Calculadora de valuation',
      'Suporte por email'
    ],
    cta: 'Começar grátis',
    href: '/auth/register',
    popular: false
  },
  {
    name: 'Professional',
    price: 'R$ 299',
    period: '/mês',
    description: 'Para operadores e investidores',
    features: [
      'Tudo do Starter',
      'Acesso a deal rooms',
      'Due diligence completa',
      'Base de compradores verificados',
      'Suporte prioritário',
      'Relatórios exportáveis'
    ],
    cta: 'Assinar agora',
    href: '/auth/register?plan=professional',
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Sob consulta',
    description: 'Para funds e agregadores',
    features: [
      'Tudo do Professional',
      'API de integração',
      'White-label disponível',
      'Suporte dedicado 24/7',
      'Customizações sob medida',
      'SLA garantido'
    ],
    cta: 'Falar com vendas',
    href: '/suporte',
    popular: false
  }
];

export default function PricingPage() {
  return (
    <MarketingPageLayout
      title="Planos e Preços"
      description="Escolha o plano ideal para suas necessidades de M&A digital"
      showHero={true}
    >
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <GridBackground />
        </div>
        <div className="container relative z-10">
          <div className="grid gap-8 md:grid-cols-3 mt-12">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-3xl p-8 ${
                  plan.popular
                    ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-500 shadow-xl scale-105'
                    : 'bg-white border border-slate-200 shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-indigo-500 text-white text-xs font-semibold">
                    Mais Popular
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                    {plan.period && <span className="text-slate-600">{plan.period}</span>}
                  </div>
                  <p className="text-slate-600">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`block w-full text-center rounded-full px-6 py-3 font-medium transition-all ${
                    plan.popular
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </MarketingPageLayout>
  );
}
