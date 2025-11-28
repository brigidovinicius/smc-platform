import type { Metadata } from 'next';
import Link from 'next/link';
import { MarketingPageLayout } from '@/app/(marketing)/_components/MarketingPageLayout';
import { buildMetadata } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/site-config';
import { Calculator, TrendingUp, BarChart, ArrowRight, Users } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Marketplace Business Valuation | CounterX',
    description: 'Learn how to value marketplace businesses and get automated valuation. Understand GMV multiples, take rates, and marketplace-specific metrics.',
    url: `${SITE_CONFIG.url}/valuation-marketplace`,
    keywords: ['marketplace valuation', 'marketplace calculator', 'GMV multiple', 'marketplace worth', 'two-sided marketplace'],
  });
}

export default function ValuationMarketplacePage() {
  return (
    <MarketingPageLayout
      title="Marketplace Business Valuation Guide"
      description="Understand how marketplace businesses are valued and get an instant valuation estimate using our automated calculator."
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
              Use Marketplace Valuation Calculator
              <ArrowRight className="h-5 w-5" />
            </Link>
            <p className="text-slate-600">Based on real marketplace transactions • GMV analysis • Take rate optimization</p>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-slate-900">Understanding Marketplace Valuation</h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-700">
                Valuing a marketplace business requires different metrics than traditional SaaS. Marketplaces 
                generate revenue through transaction fees (take rates), so valuation focuses on Gross 
                Merchandise Volume (GMV), take rate percentage, network effects, and supply/demand balance.
              </p>
              <p className="text-lg text-slate-700">
                Our valuation model analyzes GMV trends, take rate efficiency, marketplace health scores, 
                and compares to similar platforms. We consider both revenue multiples and GMV multiples 
                depending on the marketplace stage.
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
                These metrics determine your marketplace business value.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4 p-6 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-[#0044CC]" />
                  <h3 className="text-xl font-semibold text-slate-900">Gross Merchandise Volume (GMV)</h3>
                </div>
                <p className="text-slate-700">
                  Total transaction value flowing through your marketplace. Higher GMV with growth 
                  indicates strong network effects and market demand.
                </p>
              </div>

              <div className="space-y-4 p-6 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <BarChart className="h-6 w-6 text-[#0044CC]" />
                  <h3 className="text-xl font-semibold text-slate-900">Take Rate</h3>
                </div>
                <p className="text-slate-700">
                  The percentage of GMV you capture as revenue. Higher take rates (15-30%) with 
                  competitive positioning increase valuation significantly.
                </p>
              </div>

              <div className="space-y-4 p-6 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-[#0044CC]" />
                  <h3 className="text-xl font-semibold text-slate-900">Network Effects</h3>
                </div>
                <p className="text-slate-700">
                  Strong supply and demand balance creates network effects that increase marketplace 
                  value. More users on both sides = higher valuation.
                </p>
              </div>

              <div className="space-y-4 p-6 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Calculator className="h-6 w-6 text-[#0044CC]" />
                  <h3 className="text-xl font-semibold text-slate-900">Revenue Growth</h3>
                </div>
                <p className="text-slate-700">
                  Consistent month-over-month revenue growth from both GMV expansion and take rate 
                  optimization commands premium multiples.
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
                  Multiply annual revenue by a multiple (typically 2-5x for marketplaces). The multiple 
                  depends on growth rate, take rate efficiency, and marketplace maturity.
                </p>
              </div>

              <div className="space-y-4 p-6 bg-white rounded-2xl">
                <h3 className="text-xl font-semibold text-slate-900">2. GMV Multiple Method</h3>
                <p className="text-slate-700">
                  For early-stage marketplaces, valuation may be based on GMV multiples (0.1x-0.5x GMV). 
                  This reflects potential future revenue as the marketplace scales.
                </p>
              </div>

              <div className="space-y-4 p-6 bg-white rounded-2xl">
                <h3 className="text-xl font-semibold text-slate-900">3. Network Value Analysis</h3>
                <p className="text-slate-700">
                  We assess the strength of network effects by analyzing supply/demand ratios, user 
                  retention, and cross-side network benefits. Strong networks command premium valuations.
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
                <h3 className="text-xl font-semibold text-slate-900">What&apos;s a typical marketplace multiple?</h3>
                <p className="text-slate-700">
                  Mature marketplaces typically sell for 2-5x annual revenue. Early-stage marketplaces 
                  might be valued at 0.1x-0.5x GMV. The multiple depends on growth, take rate, and network 
                  effects strength.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-900">How does take rate affect valuation?</h3>
                <p className="text-slate-700">
                  Higher take rates (15-30%) with competitive positioning significantly increase valuation. 
                  However, take rates must be sustainable and not drive away supply or demand. Balance is key.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-900">What if my marketplace isn&apos;t profitable?</h3>
                <p className="text-slate-700">
                  Early-stage marketplaces are often valued on GMV and growth potential rather than 
                  profitability. Strong network effects, growing GMV, and clear path to profitability 
                  can still command good valuations.
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
            <h2 className="text-3xl font-bold">Get Your Marketplace Valuation</h2>
            <p className="text-xl text-blue-100">
              Use our automated calculator based on real marketplace transaction data.
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

