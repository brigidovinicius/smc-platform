'use client';

import { MarketingPageLayout } from '@/app/(marketing)/_components/MarketingPageLayout';
import { GridBackground } from '@/components/marketing';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqItems = [
  {
    question: 'How does automated valuation work?',
    answer: 'Our methodology uses market multiples based on recurring revenue (MRR/ARR), churn rate, CAC, LTV, growth, and sector risks. The algorithm cross-references your data with recent secondary market transactions to recommend a fair valuation range.'
  },
  {
    question: 'Is it safe to connect my metrics?',
    answer: 'Yes, we use end-to-end encryption and read-only access to your Stripe, Paddle, or other payment platform accounts. You maintain full control over which data to share and with whom.'
  },
  {
    question: 'How long does it take to close a sale?',
    answer: 'The current average is 34 days, from listing publication to closing. Time varies based on ticket size, data quality presented, and response speed between involved parties.'
  },
  {
    question: 'Is there a commission on the sale?',
    answer: 'We work with a tiered success fee based on transaction size. There&apos;s no cost to list assets; you only pay when you close a deal within the CounterX platform.'
  },
  {
    question: 'Can I negotiate in confidence?',
    answer: 'Yes. You control who accesses the data room, enable automatic blur on sensitive documents, and can sign a digital NDA before revealing critical information about revenue and operations.'
  },
  {
    question: 'What types of assets can I list?',
    answer: 'We accept B2B/B2C SaaS, mobile apps, marketplaces, paid newsletters, APIs, and digital content platforms. We constantly expand our filters as the market evolves.'
  },
  {
    question: 'How does payment work after closing?',
    answer: 'We work with escrow instruments and legal partners to custody the value until asset transfers are confirmed. The process is secure and auditable.'
  },
  {
    question: 'Does CounterX provide legal or accounting support?',
    answer: 'We have specialized partners and ready-made templates for purchase and sale contracts, corporate reorganization, and IP transfer. We provide guidance, but recommend specific legal consultation for each transaction.'
  },
  {
    question: 'Can I list multiple assets at the same time?',
    answer: 'Yes. Each asset receives an independent dossier with its own indicators. We operate with limits only to ensure inventory quality and buyer experience.'
  },
  {
    question: 'How are buyers verified?',
    answer: 'We apply KYC, request proof of funds, and transaction history. We only grant full data access after a confidentiality agreement and platform terms acceptance.'
  }
];

function FAQItem({ item, index }: { item: typeof faqItems[0]; index: number }) {
  const [isOpen, setIsOpen] = useState(index === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
      >
        <h3 className="text-lg font-semibold text-slate-900 pr-8">{item.question}</h3>
        <ChevronDown
          className={`h-5 w-5 text-slate-400 flex-shrink-0 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-6 pb-6"
        >
          <p className="text-slate-600 leading-relaxed">{item.answer}</p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function FAQContent() {
  return (
    <MarketingPageLayout
      title="Frequently Asked Questions"
      description="Get answers about CounterX and how our platform works"
      showHero={true}
    >
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <GridBackground />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto space-y-4">
            {faqItems.map((item, index) => (
              <FAQItem key={item.question} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>
    </MarketingPageLayout>
  );
}
