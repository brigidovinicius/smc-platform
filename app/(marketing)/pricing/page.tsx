'use client';

import type { Metadata } from 'next';
import { MarketingPageLayout } from '@/app/(marketing)/_components/MarketingPageLayout';
import { GridBackground } from '@/components/marketing';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/site-config';

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'For those getting started',
    features: [
      'Marketplace access',
      'Public listings view',
      'Valuation calculator',
      'Email support'
    ],
    cta: 'Get started free',
    href: '/auth/register',
    popular: false
  },
  {
    name: 'Professional',
    price: '$299',
    period: '/month',
    description: 'For operators and investors',
    features: [
      'Everything in Starter',
      'Deal room access',
      'Complete due diligence',
      'Verified buyer network',
      'Priority support',
      'Exportable reports'
    ],
    cta: 'Subscribe now',
    href: '/auth/register?plan=professional',
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For funds and aggregators',
    features: [
      'Everything in Professional',
      'Integration API',
      'White-label available',
      'Dedicated 24/7 support',
      'Custom solutions',
      'Guaranteed SLA'
    ],
    cta: 'Talk to sales',
    href: '/suporte',
    popular: false
  }
];

export default function PricingPage() {
  return (
    <MarketingPageLayout
      title="Plans & Pricing"
      description="Choose the ideal plan for your digital M&A needs"
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
                    Most Popular
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
