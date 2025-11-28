import type { Metadata } from 'next';
import Link from 'next/link';
import { MarketingPageLayout } from '@/app/(marketing)/_components/MarketingPageLayout';
import { buildMetadata } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/site-config';
import { Check, TrendingUp, Shield, Users, ArrowRight, DollarSign } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Sell Your SaaS Business to Serious Buyers | CounterX',
    description: 'Sell your SaaS business with automated valuation, verified buyer network, and secure deal room. Get the best price from 2,400+ qualified investors and operators.',
    url: `${SITE_CONFIG.url}/sell-saas`,
    keywords: ['sell SaaS business', 'exit SaaS', 'SaaS marketplace', 'sell micro SaaS', 'SaaS valuation', 'SaaS M&A'],
  });
}

export default function SellSaaSPage() {
  return (
    <MarketingPageLayout
      title="Sell Your SaaS Business to Serious Buyers"
      description="Get the best price for your SaaS with automated valuation, verified buyer network, and secure deal room. Join founders who closed deals in 34 days on average."
      showHero={true}
    >
      {/* Hero CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Link
              href="/wizard"
              className="inline-flex items-center gap-2 rounded-full bg-[#0044CC] text-white px-8 py-4 text-lg font-semibold hover:bg-[#0033AA] transition-all hover:scale-105"
            >
              List Your SaaS Business
              <ArrowRight className="h-5 w-5" />
            </Link>
            <p className="text-slate-600">Average time to sale: 34 days • 2,400+ verified buyers • Automated valuation</p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-slate-900">The Challenge of Selling Your SaaS</h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-700">
                Selling a SaaS business is complex and time-consuming. Many founders struggle with 
                valuation, don&apos;t know how to present their metrics effectively, and waste months 
                dealing with unqualified buyers. Traditional brokers charge high fees and may not 
                understand the SaaS model.
              </p>
              <p className="text-lg text-slate-700">
                Without proper data organization and market comparables, you might undervalue your 
                business or struggle to justify your asking price. The process can drag on for months 
                with no guarantee of closing a deal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-slate-900">How CounterX Helps You Sell</h2>
              <p className="text-xl text-slate-600">
                We make selling your SaaS business straightforward, transparent, and profitable.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4 p-6 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-6 w-6 text-[#0044CC]" />
                  <h3 className="text-xl font-semibold text-slate-900">Automated Valuation</h3>
                </div>
                <p className="text-slate-700">
                  Get an accurate valuation based on real market comparables. Our model analyzes 
                  your MRR, growth, churn, and sector to recommend fair multiples and pricing ranges.
                </p>
              </div>

              <div className="space-y-4 p-6 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-[#0044CC]" />
                  <h3 className="text-xl font-semibold text-slate-900">Verified Buyer Network</h3>
                </div>
                <p className="text-slate-700">
                  Access 2,400+ pre-verified buyers including funds, aggregators, and operators. 
                  All buyers are KYC-verified and have proof of funds before accessing your data.
                </p>
              </div>

              <div className="space-y-4 p-6 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-[#0044CC]" />
                  <h3 className="text-xl font-semibold text-slate-900">Secure Deal Room</h3>
                </div>
                <p className="text-slate-700">
                  Share sensitive data safely with encrypted uploads, automatic blur, and access 
                  logs. Control who sees what information and when.
                </p>
              </div>

              <div className="space-y-4 p-6 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-[#0044CC]" />
                  <h3 className="text-xl font-semibold text-slate-900">Professional Presentation</h3>
                </div>
                <p className="text-slate-700">
                  We help you organize your metrics, create exportable reports, and present your 
                  business in the best light. Standardized format that buyers trust.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-3xl font-bold text-slate-900 text-center">How It Works</h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#0044CC] text-white flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-slate-900">List Your Asset</h3>
                  <p className="text-slate-700">
                    Complete our guided intake process to organize your metrics (MRR, churn, CAC, LTV, 
                    tech stack). Takes minutes, not hours. No complex spreadsheets required.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#0044CC] text-white flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-slate-900">Get Automated Valuation</h3>
                  <p className="text-slate-700">
                    Our intelligent engine analyzes your data and generates a professional dossier 
                    with valuation recommendations based on real market comparables.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#0044CC] text-white flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-slate-900">Connect with Buyers</h3>
                  <p className="text-slate-700">
                    Qualified buyers can access your listing and request the data room. Negotiate 
                    through our platform with digital NDAs and transparent communication.
                  </p>
                </div>
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
                <h3 className="text-xl font-semibold text-slate-900">What&apos;s the cost to list my SaaS?</h3>
                <p className="text-slate-700">
                  Listing is free. We only charge a success fee when you close a deal through CounterX. 
                  The fee is tiered based on transaction size, ensuring it&apos;s fair for businesses of all sizes.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-900">How long does it take to sell?</h3>
                <p className="text-slate-700">
                  The average time from listing to closing is 34 days, but it depends on your data 
                  quality, pricing, and response speed. Well-prepared listings with complete metrics 
                  typically move faster.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-900">What if my SaaS doesn&apos;t have recurring revenue yet?</h3>
                <p className="text-slate-700">
                  We also list early-stage assets. We consider GMV, active users, leads, and traction 
                  proof. You&apos;ll receive guidance on what needs to evolve before opening negotiations.
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
            <h2 className="text-3xl font-bold">Ready to Sell Your SaaS Business?</h2>
            <p className="text-xl text-blue-100">
              Get started with automated valuation and access to 2,400+ verified buyers.
            </p>
            <Link
              href="/wizard"
              className="inline-flex items-center gap-2 rounded-full bg-white text-[#0044CC] px-8 py-4 text-lg font-semibold hover:bg-slate-100 transition-all"
            >
              List Your SaaS Now
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </MarketingPageLayout>
  );
}

