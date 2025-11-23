'use client';

import Link from 'next/link';
import { MarketingPageLayout } from '../_components/MarketingPageLayout';
import { GridBackground } from '@/components/marketing';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, ShoppingBag, Calculator, HelpCircle, Upload, Headphones } from 'lucide-react';

const resources = [
  {
    title: 'Blog',
    description: 'Artigos editoriais sobre valuation, aquisição de SaaS e operações de M&A digital.',
    href: '/blog',
    icon: BookOpen,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'Marketplace',
    description: 'Prévia das oportunidades públicas com filtros por ticket, nicho e múltiplo.',
    href: '/marketplace',
    icon: ShoppingBag,
    color: 'from-purple-500 to-pink-500'
  },
  {
    title: 'Calculadora de Valuation',
    description: 'Projete o valor do seu SaaS rapidamente com parâmetros de MRR e crescimento.',
    href: '/calculator',
    icon: Calculator,
    color: 'from-indigo-500 to-purple-500'
  },
  {
    title: 'FAQ',
    description: 'Perguntas frequentes sobre como comprar, vender e avaliar ativos digitais.',
    href: '/faq',
    icon: HelpCircle,
    color: 'from-green-500 to-emerald-500'
  },
  {
    title: 'Vender ativo',
    description: 'Cadastre seu SaaS, marketplace ou newsletter para captação de compradores qualificados.',
    href: '/wizard',
    icon: Upload,
    color: 'from-orange-500 to-red-500'
  },
  {
    title: 'Suporte',
    description: 'Fale com o time SMC sobre due diligence, onboarding e questões da plataforma.',
    href: '/suporte',
    icon: Headphones,
    color: 'from-slate-500 to-slate-700'
  }
];

export default function ResourcesPage() {
  return (
    <MarketingPageLayout
      title="Recursos"
      description="Explore todas as ferramentas e conteúdos disponíveis na plataforma SMC"
      showHero={true}
    >
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <GridBackground />
        </div>
        <div className="container relative z-10">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <motion.div
                  key={resource.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Link
                    href={resource.href}
                    className="group block h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-lg transition-all hover:shadow-xl hover:border-indigo-300"
                  >
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${resource.color} text-white mb-4 shadow-lg`}>
                      <Icon size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {resource.title}
                    </h2>
                    <p className="text-slate-600 mb-4 leading-relaxed">{resource.description}</p>
                    <div className="flex items-center gap-2 text-indigo-600 font-medium text-sm">
                      <span>Acessar</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </MarketingPageLayout>
  );
}
