import type { Metadata } from 'next';
import Link from 'next/link';
import { MarketingPageLayout } from '@/app/(marketing)/_components/MarketingPageLayout';
import { buildMetadata } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/site-config';
import { Calculator, TrendingUp, BarChart, ArrowRight } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'SaaS Valuation Guide and Calculator | CounterX',
    description: 'Learn how to value SaaS businesses and use our automated valuation calculator. Understand MRR multiples, ARR calculations, and market comparables.',
    url: `${SITE_CONFIG.url}/valuation-saas`,
    keywords: ['SaaS valuation', 'SaaS calculator', 'MRR multiple', 'ARR valuation', 'SaaS multiples', 'SaaS worth'],
  });
}

export default function ValuationSaaSPage() {
  return (
    <MarketingPageLayout
      title="SaaS Valuation Guide and Calculator"
      description="Understand how SaaS businesses are valued and get an instant valuation estimate using our automated calculator based on real market data."
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
              Use Valuation Calculator
              <ArrowRight className="h-5 w-5" />
            </Link>
            <p className="text-slate-600">Based on 326+ real transactions • Market comparables • Automated analysis</p>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-slate-900">Understanding SaaS Valuation</h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-700">
                Valuing a SaaS business is more complex than traditional companies. Unlike businesses 
                with physical assets, SaaS value comes from recurring revenue, growth potential, customer 
                retention, and market position. Understanding these factors is crucial for both buyers and sellers.
              </p>
              <p className="text-lg text-slate-700">
                Our valuation methodology combines multiple approaches: revenue multiples, growth-adjusted 
                multiples, churn analysis, and market comparables. We analyze over 326 real transactions 
                to provide accurate, data-driven valuations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Factors Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-slate-900">Key Valuation Factors</h2>
              <p className="text-xl text-slate-600">
                These metrics significantly impact your SaaS business value.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4 p-6 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-[#0044CC]" />
                  <h3 className="text-xl font-semibold text-slate-900">Monthly Recurring Revenue (MRR)</h3>
                </div>
                <p className="text-slate-700">
                  MRR is the foundation of SaaS valuation. Higher MRR with consistent growth commands 
                  higher multiples. Businesses with $10K+ MRR typically see 3-6x ARR multiples.
                </p>
              </div>

              <div className="space-y-4 p-6 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <BarChart className="h-6 w-6 text-[#0044CC]" />
                  <h3 className="text-xl font-semibold text-slate-900">Churn Rate</h3>
                </div>
                <p className="text-slate-700">
                  Low churn (under 5% monthly) indicates strong product-market fit and customer satisfaction. 
                  High churn significantly reduces valuation as it signals retention problems.
                </p>
              </div>

              <div className="space-y-4 p-6 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Calculator className="h-6 w-6 text-[#0044CC]" />
                  <h3 className="text-xl font-semibold text-slate-900">CAC and LTV Ratio</h3>
                </div>
                <p className="text-slate-700">
                  A healthy LTV:CAC ratio (3:1 or higher) shows efficient customer acquisition and strong 
                  unit economics. This directly impacts valuation multiples.
                </p>
              </div>

              <div className="space-y-4 p-6 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-[#0044CC]" />
                  <h3 className="text-xl font-semibold text-slate-900">Growth Rate</h3>
                </div>
                <p className="text-slate-700">
                  Consistent month-over-month growth (10%+) significantly increases valuation. Buyers 
                  pay premiums for businesses with proven growth trajectories.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valuation Methods Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-3xl font-bold text-slate-900 text-center">Valuation Methods</h2>
            <div className="space-y-8">
              <div className="space-y-4 p-6 bg-white rounded-2xl">
                <h3 className="text-xl font-semibold text-slate-900">1. Revenue Multiple Method</h3>
                <p className="text-slate-700">
                  The most common approach: multiply Annual Recurring Revenue (ARR) by a multiple 
                  (typically 3-6x for SaaS). The multiple varies based on growth, churn, profitability, 
                  and market conditions.
                </p>
              </div>

              <div className="space-y-4 p-6 bg-white rounded-2xl">
                <h3 className="text-xl font-semibold text-slate-900">2. Growth-Adjusted Multiple</h3>
                <p className="text-slate-700">
                  Faster-growing businesses command higher multiples. A SaaS growing 20% MoM might 
                  see 5-7x ARR, while slower growth (5% MoM) might be 2-4x ARR.
                </p>
              </div>

              <div className="space-y-4 p-6 bg-white rounded-2xl">
                <h3 className="text-xl font-semibold text-slate-900">3. Market Comparables</h3>
                <p className="text-slate-700">
                  We compare your business to similar SaaS companies that recently sold. Factors 
                  include niche, MRR range, growth rate, and business model (B2B vs B2C).
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
                <h3 className="text-xl font-semibold text-slate-900">What&apos;s a typical SaaS multiple?</h3>
                <p className="text-slate-700">
                  Most SaaS businesses sell for 3-6x ARR, but this varies widely. High-growth, 
                  low-churn businesses can command 7-10x, while slower-growth businesses might be 2-4x. 
                  Micro-SaaS ($1K-$10K MRR) often trades at 2-4x ARR.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-900">How accurate is the automated valuation?</h3>
                <p className="text-slate-700">
                  Our calculator uses real transaction data from 326+ deals and proprietary algorithms. 
                  While it provides a solid starting point, final valuations depend on negotiation, 
                  market conditions, and buyer-specific factors.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-900">What if my SaaS isn&apos;t profitable yet?</h3>
                <p className="text-slate-700">
                  Early-stage SaaS businesses are still valuable if they show strong growth, low churn, 
                  and clear path to profitability. Buyers often focus on MRR growth and product-market 
                  fit over current profitability.
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
            <h2 className="text-3xl font-bold">Get Your SaaS Valuation Now</h2>
            <p className="text-xl text-blue-100">
              Use our automated calculator based on real market data and 326+ transactions.
            </p>
            <Link
              href="/calculator"
              className="inline-flex items-center gap-2 rounded-full bg-white text-[#0044CC] px-8 py-4 text-lg font-semibold hover:bg-slate-100 transition-all"
            >
              Calculate Valuation
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </MarketingPageLayout>
  );
}

