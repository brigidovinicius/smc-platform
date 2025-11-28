import type { Metadata } from 'next';
import Link from 'next/link';
import { MarketingPageLayout } from '@/app/(marketing)/_components/MarketingPageLayout';
import { buildMetadata } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/site-config';
import { Check, TrendingUp, Shield, Users, ArrowRight } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Buy SaaS Businesses with Audited Data | CounterX',
    description: 'Discover verified SaaS businesses for sale with complete financial data, automated valuation, and AI-powered due diligence. Join 2,400+ verified buyers on CounterX.',
    url: `${SITE_CONFIG.url}/buy-saas-business`,
    keywords: ['buy SaaS business', 'SaaS marketplace', 'acquire SaaS', 'SaaS for sale', 'buy micro SaaS', 'SaaS acquisition'],
  });
}

export default function BuySaaSPage() {
  return (
    <MarketingPageLayout
      title="Buy SaaS Businesses with Confidence"
      description="Access verified SaaS opportunities with complete financial transparency, automated valuation, and qualified seller network."
      showHero={true}
    >
      {/* Hero CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Link
              href="/feed"
              className="inline-flex items-center gap-2 rounded-full bg-[#0044CC] text-white px-8 py-4 text-lg font-semibold hover:bg-[#0033AA] transition-all hover:scale-105"
            >
              Browse SaaS Opportunities
              <ArrowRight className="h-5 w-5" />
            </Link>
            <p className="text-slate-600">Over 2,400 verified buyers • 326+ assets evaluated • $180M+ listed volume</p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-slate-900">The Challenge of Buying SaaS Businesses</h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-700">
                Finding the right SaaS business to acquire is challenging. Traditional marketplaces lack transparency, 
                financial data is often incomplete or unverified, and due diligence can take months. Many buyers waste 
                time on opportunities that don&apos;t meet their criteria or discover critical issues too late in the process.
              </p>
              <p className="text-lg text-slate-700">
                Without standardized metrics and automated valuation, it&apos;s difficult to compare opportunities and 
                make informed decisions. Sellers may not understand their business value, leading to unrealistic pricing 
                or missing key information that affects the deal.
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
              <h2 className="text-3xl font-bold text-slate-900">How CounterX Solves This</h2>
              <p className="text-xl text-slate-600">
                CounterX provides a transparent, data-driven marketplace for buying SaaS businesses with confidence.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4 p-6 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-[#0044CC]" />
                  <h3 className="text-xl font-semibold text-slate-900">Verified Financial Data</h3>
                </div>
                <p className="text-slate-700">
                  Every listing includes audited MRR, churn, CAC, LTV, and growth metrics. No guesswork, 
                  no surprises—just complete transparency from day one.
                </p>
              </div>

              <div className="space-y-4 p-6 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-[#0044CC]" />
                  <h3 className="text-xl font-semibold text-slate-900">Automated Valuation</h3>
                </div>
                <p className="text-slate-700">
                  Our proprietary model analyzes market comparables, growth trends, and sector risks to 
                  provide accurate valuation ranges. Know what a business is worth before you negotiate.
                </p>
              </div>

              <div className="space-y-4 p-6 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-[#0044CC]" />
                  <h3 className="text-xl font-semibold text-slate-900">Qualified Sellers</h3>
                </div>
                <p className="text-slate-700">
                  All sellers go through a verification process. We ensure they have complete data, 
                  understand their business metrics, and are serious about closing a deal.
                </p>
              </div>

              <div className="space-y-4 p-6 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Check className="h-6 w-6 text-[#0044CC]" />
                  <h3 className="text-xl font-semibold text-slate-900">AI-Powered Due Diligence</h3>
                </div>
                <p className="text-slate-700">
                  Intelligent checklists flag anomalies in revenue, cohorts, and dependencies. Get a 
                  complete metrics history and identify potential issues early in the process.
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
                  <h3 className="text-xl font-semibold text-slate-900">Browse Opportunities</h3>
                  <p className="text-slate-700">
                    Explore verified SaaS listings with complete financial data, automated valuations, 
                    and detailed business descriptions. Filter by MRR, growth rate, niche, and more.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#0044CC] text-white flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-slate-900">Review Due Diligence</h3>
                  <p className="text-slate-700">
                    Access complete metrics history, AI-powered anomaly detection, and standardized 
                    reports. Understand the business health before making an offer.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#0044CC] text-white flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-slate-900">Negotiate & Close</h3>
                  <p className="text-slate-700">
                    Connect with verified sellers through our secure deal room. Use digital NDAs, 
                    encrypted document sharing, and transparent negotiation tools to close faster.
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
                <h3 className="text-xl font-semibold text-slate-900">What types of SaaS businesses are available?</h3>
                <p className="text-slate-700">
                  CounterX features B2B and B2C SaaS businesses across various niches, from micro-SaaS 
                  ($1K-$10K MRR) to larger operations. We also list marketplaces, APIs, and digital 
                  content platforms.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-900">How accurate are the automated valuations?</h3>
                <p className="text-slate-700">
                  Our valuation model uses real market comparables, recent transaction data, and 
                  proprietary algorithms. While valuations are advisory, they provide a solid starting 
                  point for negotiations based on MRR, growth, churn, and sector benchmarks.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-900">What information do I get before making an offer?</h3>
                <p className="text-slate-700">
                  All listings include complete financial metrics (MRR, churn, CAC, LTV), growth 
                  trends, tech stack information, and business descriptions. After signing an NDA, 
                  you can access the full data room with P&L statements, contracts, and operational 
                  details.
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
            <h2 className="text-3xl font-bold">Ready to Find Your Next SaaS Acquisition?</h2>
            <p className="text-xl text-blue-100">
              Join 2,400+ verified buyers and explore opportunities with complete transparency.
            </p>
            <Link
              href="/feed"
              className="inline-flex items-center gap-2 rounded-full bg-white text-[#0044CC] px-8 py-4 text-lg font-semibold hover:bg-slate-100 transition-all"
            >
              Browse SaaS Listings
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </MarketingPageLayout>
  );
}

