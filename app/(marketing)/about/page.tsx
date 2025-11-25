'use client';

import { MarketingPageLayout } from '@/app/(marketing)/_components/MarketingPageLayout';
import { GridBackground } from '@/components/marketing';
import { motion } from 'framer-motion';
import { Target, Zap, Shield, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';


const values: Array<{
  icon: LucideIcon;
  title: string;
  description: string;
}> = [
  {
    icon: Target,
    title: 'Mission',
    description: 'Democratize access to professional M&A tools for micro-SaaS and digital assets, making transactions transparent, secure, and data-driven.'
  },
  {
    icon: Zap,
    title: 'Innovation',
    description: 'We combine proprietary valuation models, AI-powered due diligence, and automated workflows to reduce friction in digital asset transactions.'
  },
  {
    icon: Shield,
    title: 'Trust',
    description: 'Every transaction is backed by verified data, encrypted deal rooms, and legal partnerships to ensure security and compliance.'
  },
  {
    icon: Users,
    title: 'Community',
    description: 'We serve founders, investors, flippers, and operators who believe in the power of transparent, metrics-driven deal-making.'
  }
];

const story = {
  title: 'Why CounterX exists',
  paragraphs: [
    'After seeing dozens of deals stall due to lack of data and standards, we built an infrastructure focused on metrics and governance.',
    'The result is clarity for sellers and conviction for buyers. CounterX combines proprietary methodology inspired by AngelList, Pitch.com, and leading operators with assisted onboarding and AI automations.',
    'Our reports educate founders on what needs to evolve to capture higher multiples, while our buyer network ensures qualified, pre-verified investors with operational agreements and SLAs.'
  ]
};

export default function AboutPage() {
  return (
    <MarketingPageLayout
      title="About CounterX"
      description="The modern platform for digital asset M&A, built by founders for founders"
      showHero={true}
    >
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <GridBackground />
        </div>
        <div className="container relative z-10 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto space-y-16">
            {/* Story Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">{story.title}</h2>
              {story.paragraphs.map((para, index) => (
                <p key={index} className="text-lg text-slate-700 leading-relaxed">
                  {para}
                </p>
              ))}
            </motion.div>

            {/* Values Grid */}
            <div className="grid gap-8 md:grid-cols-2">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#0044CC] text-white mb-4">
                      <Icon size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{value.description}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl bg-gradient-to-br from-[#050611] to-[#0B0D18] p-8 sm:p-12 text-white"
            >
              <h3 className="text-2xl sm:text-3xl font-bold mb-8 text-center">CounterX by the numbers</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold mb-2">326+</div>
                  <div className="text-sm text-slate-400">Assets evaluated</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold mb-2">$180M</div>
                  <div className="text-sm text-slate-400">Listed volume</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold mb-2">2,400+</div>
                  <div className="text-sm text-slate-400">Verified buyers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold mb-2">34</div>
                  <div className="text-sm text-slate-400">Days avg. to sale</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </MarketingPageLayout>
  );
}

