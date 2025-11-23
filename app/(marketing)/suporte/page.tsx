'use client';

import Link from 'next/link';
import { MarketingPageLayout } from '../_components/MarketingPageLayout';
import { GridBackground } from '@/components/marketing';
import { motion } from 'framer-motion';
import { Mail, FileText, BookOpen, HelpCircle } from 'lucide-react';

export default function SupportPage() {
  return (
    <MarketingPageLayout
      title="Suporte"
      description="Estamos aqui para ajudar você em cada etapa do processo de M&A digital"
      showHero={true}
    >
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <GridBackground />
        </div>
        <div className="container relative z-10">
          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500 text-white mb-4">
                <Mail size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Canais oficiais</h2>
              <p className="text-slate-600 mb-6">Entraremos em contato em até 1 dia útil.</p>
              <ul className="space-y-3">
                <li>
                  <a
                    href="mailto:support@saasmarketcap.com"
                    className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors flex items-center gap-2"
                  >
                    <Mail size={16} />
                    support@saasmarketcap.com
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:legal@saasmarketcap.com"
                    className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors flex items-center gap-2"
                  >
                    <Mail size={16} />
                    legal@saasmarketcap.com
                  </a>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500 text-white mb-4">
                <BookOpen size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Autoatendimento</h2>
              <p className="text-slate-600 mb-6">Documentação e respostas rápidas.</p>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/faq"
                    className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors flex items-center gap-2"
                  >
                    <HelpCircle size={16} />
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal"
                    className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors flex items-center gap-2"
                  >
                    <FileText size={16} />
                    Central legal
                  </Link>
                </li>
                <li>
                  <Link
                    href="/recursos"
                    className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors flex items-center gap-2"
                  >
                    <BookOpen size={16} />
                    Recursos
                  </Link>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>
    </MarketingPageLayout>
  );
}
