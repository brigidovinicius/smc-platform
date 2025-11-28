import type { Metadata } from 'next';
import Link from 'next/link';
import { MarketingPageLayout } from '@/app/(marketing)/_components/MarketingPageLayout';
import { buildMetadata } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/site-config';
import { Calculator, TrendingUp, BarChart, ArrowRight, DollarSign } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'MRR Multiple Calculator for SaaS | CounterX',
    description: 'Calculate your SaaS business value using MRR multiples. Understand how growth, churn, and market factors affect your valuation multiple.',
    url: `${SITE_CONFIG.url}/mrr-multiple-calculator`,
    keywords: ['MRR multiple', 'SaaS calculator', 'ARR multiple', 'SaaS valuation', 'MRR worth', 'SaaS multiple calculator'],
  });
}

export default function MRRMultipleCalculatorPage() {
  return (
    <MarketingPageLayout
      title="MRR Multiple Calculator for SaaS"
      description="Calculate your SaaS business value using industry-standard MRR multiples. Understand how growth, churn, and profitability affect your valuation."
      showHero={true}
    >
      {/* Hero CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Link
              href="/calculator"
              className="inline-flex items-center gap-2 rounded-full bg-[#0044CC] text-white px-8 py-4 text-lg font-semibold hover:bg-[#0033AA] transition-all hover:scale-105"
            >
              Use MRR Multiple Calculator
              <ArrowRight className="h-5 w-5" />
            </Link>
            <p className="text-slate-600">Based on 326+ real SaaS transactions • Growth-adjusted multiples • Market comparables</p>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-slate-900">Understanding MRR Multiples</h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-700">
                MRR (Monthly Recurring Revenue) multiples are the standard way to value SaaS businesses. 
                The multiple represents how many months (or years) of revenue a buyer is willing to pay. 
                For example, a 4x ARR multiple means a buyer pays 4 years of annual revenue.
              </p>
              <p className="text-lg text-slate-700">
                Multiples vary widely based on growth rate, churn, profitability, market size, and 
                competitive position. Our calculator uses real transaction data to provide accurate, 
                growth-adjusted multiples for your specific SaaS business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Factors Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-slate-900">What Affects Your MRR Multiple?</h2>
              <p className="text-xl text-slate-600">
                These factors significantly impact the multiple buyers are willing to pay.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4 p-6 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-[#0044CC]" />
                  <h3 className="text-xl font-semibold text-slate-900">Growth Rate</h3>
                </div>
                <p className="text-slate-700">
                  Faster growth = higher multiples. SaaS growing 20%+ MoM can command 5-7x ARR, 
                  while slower growth (5% MoM) might be 2-4x ARR.
                </p>
              </div>

              <div className="space-y-4 p-6 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <BarChart className="h-6 w-6 text-[#0044CC]" />
                  <h3 className="text-xl font-semibold text-slate-900">Churn Rate</h3>
                </div>
                <p className="text-slate-700">
                  Low churn (under 5% monthly) increases multiples. High churn (10%+) significantly 
                  reduces valuation as it signals retention problems.
                </p>
              </div>

              <div className="space-y-4 p-6 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-6 w-6 text-[#0044CC]" />
                  <h3 className="text-xl font-semibold text-slate-900">Profitability</h3>
                </div>
                <p className="text-slate-700">
                  Profitable SaaS businesses command higher multiples. Positive unit economics 
                  (LTV:CAC ratio 3:1+) shows sustainable growth.
                </p>
              </div>

              <div className="space-y-4 p-6 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Calculator className="h-6 w-6 text-[#0044CC]" />
                  <h3 className="text-xl font-semibold text-slate-900">Market Size & Niche</h3>
                </div>
                <p className="text-slate-700">
                  Larger addressable markets and defensible niches command premium multiples. 
                  B2B SaaS typically trades higher than B2C.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Typical Multiples Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-3xl font-bold text-slate-900 text-center">Typical MRR Multiples by Stage</h2>
            <div className="space-y-8">
              <div className="space-y-4 p-6 bg-white rounded-2xl">
                <h3 className="text-xl font-semibold text-slate-900">Micro-SaaS ($1K-$10K MRR)</h3>
                <p className="text-slate-700">
                  Typically 2-4x ARR. Lower multiples due to smaller scale, but still valuable if 
                  showing consistent growth and low churn.
                </p>
              </div>

              <div className="space-y-4 p-6 bg-white rounded-2xl">
                <h3 className="text-xl font-semibold text-slate-900">Small SaaS ($10K-$50K MRR)</h3>
                <p className="text-slate-700">
                  Typically 3-5x ARR. More established businesses with proven metrics command 
                  higher multiples, especially with strong growth.
                </p>
              </div>

              <div className="space-y-4 p-6 bg-white rounded-2xl">
                <h3 className="text-xl font-semibold text-slate-900">Mid-Market SaaS ($50K-$200K MRR)</h3>
                <p className="text-slate-700">
                  Typically 4-6x ARR. Well-established businesses with strong metrics, growth, 
                  and market position can command premium multiples.
                </p>
              </div>

              <div className="space-y-4 p-6 bg-white rounded-2xl">
                <h3 className="text-xl font-semibold text-slate-900">Enterprise SaaS ($200K+ MRR)</h3>
                <p className="text-slate-700">
                  Typically 5-8x ARR or higher. Large-scale businesses with proven track records, 
                  strong unit economics, and market leadership command the highest multiples.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-slate-900 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-900">What&apos;s the difference between MRR and ARR multiples?</h3>
                <p className="text-slate-700">
                  ARR (Annual Recurring Revenue) = MRR × 12. Multiples are typically expressed as 
                  ARR multiples (e.g., 4x ARR). To convert: if your MRR is $10K, your ARR is $120K, 
                  and at 4x ARR, your valuation would be $480K.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-900">How do I improve my MRR multiple?</h3>
                <p className="text-slate-700">
                  Focus on: reducing churn, increasing growth rate, improving profitability, expanding 
                  into larger markets, and building defensible moats. Strong unit economics and consistent 
                  growth are the biggest drivers.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-900">Are multiples the same for all SaaS types?</h3>
                <p className="text-slate-700">
                  No. B2B SaaS typically commands higher multiples than B2C. Enterprise SaaS trades higher 
                  than SMB-focused. Niche-specific factors and competitive positioning also affect multiples.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#0044CC] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold">Calculate Your SaaS MRR Multiple</h2>
            <p className="text-xl text-blue-100">
              Get an accurate valuation based on real market data and 326+ SaaS transactions.
            </p>
            <Link
              href="/calculator"
              className="inline-flex items-center gap-2 rounded-full bg-white text-[#0044CC] px-8 py-4 text-lg font-semibold hover:bg-slate-100 transition-all"
            >
              Calculate Now
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </MarketingPageLayout>
  );
}

