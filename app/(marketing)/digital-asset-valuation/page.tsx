import type { Metadata } from 'next';
import Link from 'next/link';
import { MarketingPageLayout } from '@/app/(marketing)/_components/MarketingPageLayout';
import { buildMetadata } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/site-config';
import { Calculator, TrendingUp, BarChart, ArrowRight, Globe } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Digital Asset Valuation Platform | CounterX',
    description: 'Get accurate valuations for SaaS, websites, marketplaces, and digital assets. Automated analysis based on real market data and 326+ transactions.',
    url: `${SITE_CONFIG.url}/digital-asset-valuation`,
    keywords: ['digital asset valuation', 'online business valuation', 'website worth', 'SaaS valuation', 'digital asset calculator'],
  });
}

export default function DigitalAssetValuationPage() {
  return (
    <MarketingPageLayout
      title="Digital Asset Valuation Platform"
      description="Get accurate, data-driven valuations for any digital asset. Our automated platform analyzes SaaS, websites, marketplaces, and more using real market comparables."
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
              Get Your Asset Valued
              <ArrowRight className="h-5 w-5" />
            </Link>
            <p className="text-slate-600">326+ transactions analyzed • Multiple asset types • Real market data</p>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-slate-900">Why Digital Asset Valuation Matters</h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-700">
                Digital assets—SaaS businesses, websites, marketplaces, apps, and content platforms—require 
                specialized valuation methods. Unlike traditional businesses, their value comes from recurring 
                revenue, traffic, user base, and intellectual property rather than physical assets.
              </p>
              <p className="text-lg text-slate-700">
                Accurate valuation is crucial whether you&apos;re buying, selling, or planning an exit. 
                Our platform uses proprietary algorithms and real transaction data to provide fair, 
                market-based valuations for any digital asset type.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Asset Types Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-slate-900">We Value All Digital Asset Types</h2>
              <p className="text-xl text-slate-600">
                Our platform supports multiple asset categories with specialized valuation models.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4 p-6 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-[#0044CC]" />
                  <h3 className="text-xl font-semibold text-slate-900">SaaS Businesses</h3>
                </div>
                <p className="text-slate-700">
                  Valued based on MRR, ARR, churn, CAC, LTV, and growth rate. We analyze 3-6x ARR 
                  multiples with growth adjustments.
                </p>
              </div>

              <div className="space-y-4 p-6 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Globe className="h-6 w-6 text-[#0044CC]" />
                  <h3 className="text-xl font-semibold text-slate-900">Websites & Blogs</h3>
                </div>
                <p className="text-slate-700">
                  Valued based on traffic, revenue, niche, content quality, and monetization methods. 
                  Typically 20-40x monthly profit.
                </p>
              </div>

              <div className="space-y-4 p-6 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <BarChart className="h-6 w-6 text-[#0044CC]" />
                  <h3 className="text-xl font-semibold text-slate-900">Marketplaces</h3>
                </div>
                <p className="text-slate-700">
                  Valued based on GMV, take rate, network effects, and supply/demand balance. 
                  Typically 2-5x revenue or 0.1x-0.5x GMV.
                </p>
              </div>

              <div className="space-y-4 p-6 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Calculator className="h-6 w-6 text-[#0044CC]" />
                  <h3 className="text-xl font-semibold text-slate-900">Mobile Apps & APIs</h3>
                </div>
                <p className="text-slate-700">
                  Valued based on user base, revenue model, retention, and growth. Similar to SaaS 
                  but with app-specific metrics.
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
            <h2 className="text-3xl font-bold text-slate-900 text-center">How Our Valuation Works</h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#0044CC] text-white flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-slate-900">Input Your Metrics</h3>
                  <p className="text-slate-700">
                    Enter your asset&apos;s key metrics: revenue, traffic, growth, churn, and other 
                    relevant data. Our guided process makes it simple.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#0044CC] text-white flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-slate-900">Automated Analysis</h3>
                  <p className="text-slate-700">
                    Our algorithms analyze your data against 326+ real transactions, market comparables, 
                    and proprietary models to generate accurate valuation ranges.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#0044CC] text-white flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-slate-900">Get Detailed Report</h3>
                  <p className="text-slate-700">
                    Receive a comprehensive valuation report with justification, market comparables, 
                    and recommendations for improving your asset value.
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
                <h3 className="text-xl font-semibold text-slate-900">How accurate are the valuations?</h3>
                <p className="text-slate-700">
                  Our valuations are based on 326+ real transactions and proprietary algorithms. While 
                  they provide accurate starting points, final sale prices depend on negotiation, market 
                  conditions, and buyer-specific factors.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-900">What if my asset doesn&apos;t fit a standard category?</h3>
                <p className="text-slate-700">
                  Our platform supports custom asset types. Contact us and we&apos;ll create a valuation 
                  model tailored to your specific business model and metrics.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-900">Is the valuation free?</h3>
                <p className="text-slate-700">
                  Basic automated valuations are free. For detailed reports with market comparables and 
                  recommendations, premium options are available. Listing your asset on CounterX includes 
                  a full valuation report.
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
            <h2 className="text-3xl font-bold">Get Your Digital Asset Valued Today</h2>
            <p className="text-xl text-blue-100">
              Use our automated platform based on real market data and 326+ transactions.
            </p>
            <Link
              href="/calculator"
              className="inline-flex items-center gap-2 rounded-full bg-white text-[#0044CC] px-8 py-4 text-lg font-semibold hover:bg-slate-100 transition-all"
            >
              Start Valuation
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </MarketingPageLayout>
  );
}

