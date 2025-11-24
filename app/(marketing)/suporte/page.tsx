'use client';

import Link from 'next/link';
import { MarketingPageLayout } from '@/app/(marketing)/_components/MarketingPageLayout';
import { GridBackground } from '@/components/marketing';
import { motion } from 'framer-motion';
import { Mail, FileText, BookOpen, HelpCircle } from 'lucide-react';

export default function SupportPage() {
  return (
    <MarketingPageLayout
      title="Support"
      description="We&apos;re here to help you at every step of the digital M&A process"
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
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Official channels</h2>
              <p className="text-slate-600 mb-6">We&apos;ll get back to you within 1 business day.</p>
              <ul className="space-y-3">
                <li>
                  <a
                    href="mailto:support@counterx.io"
                    className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors flex items-center gap-2"
                  >
                    <Mail size={16} />
                    support@counterx.io
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:legal@counterx.io"
                    className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors flex items-center gap-2"
                  >
                    <Mail size={16} />
                    legal@counterx.io
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
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Self-service</h2>
              <p className="text-slate-600 mb-6">Documentation and quick answers.</p>
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
                    Legal center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/recursos"
                    className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors flex items-center gap-2"
                  >
                    <BookOpen size={16} />
                    Resources
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
