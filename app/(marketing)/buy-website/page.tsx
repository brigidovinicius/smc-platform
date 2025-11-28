import type { Metadata } from 'next';
import Link from 'next/link';
import { MarketingPageLayout } from '@/app/(marketing)/_components/MarketingPageLayout';
import { buildMetadata } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/site-config';
import { Check, Globe, TrendingUp, Shield, ArrowRight } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Buy Profitable Websites and Digital Assets | CounterX',
    description: 'Discover verified websites, blogs, and digital assets for sale with complete traffic data, revenue verification, and automated valuation. Join 2,400+ buyers.',
    url: `${SITE_CONFIG.url}/buy-website`,
    keywords: ['buy website', 'website marketplace', 'buy blog', 'digital assets for sale', 'website acquisition', 'buy online business'],
  });
}

export default function BuyWebsitePage() {
  return (
    <MarketingPageLayout
      title="Buy Profitable Websites and Digital Assets"
      description="Access verified websites, blogs, and digital properties with complete traffic data, revenue verification, and transparent pricing."
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
              Browse Website Listings
              <ArrowRight className="h-5 w-5" />
            </Link>
            <p className="text-slate-600">Verified traffic data • Revenue proof • Automated valuation • Secure transactions</p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-slate-900">The Challenge of Buying Websites</h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-700">
                Finding profitable websites to buy is risky. Many listings lack verified traffic data, 
                revenue claims are unsubstantiated, and due diligence is time-consuming. You might discover 
                that traffic is fake, revenue is declining, or the site has technical issues only after 
                you&apos;ve invested time and money.
              </p>
              <p className="text-lg text-slate-700">
                Without proper verification and standardized metrics, comparing opportunities is difficult. 
                Sellers may inflate numbers or hide problems, making it hard to make informed decisions.
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
              <h2 className="text-3xl font-bold text-slate-900">How CounterX Protects Buyers</h2>
              <p className="text-xl text-slate-600">
                We verify every listing to ensure you get accurate data and fair deals.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4 p-6 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Globe className="h-6 w-6 text-[#0044CC]" />
                  <h3 className="text-xl font-semibold text-slate-900">Verified Traffic Data</h3>
                </div>
                <p className="text-slate-700">
                  All listings include verified monthly visitors, traffic sources, and engagement metrics. 
                  We check for fake traffic and ensure data integrity.
                </p>
              </div>

              <div className="space-y-4 p-6 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-[#0044CC]" />
                  <h3 className="text-xl font-semibold text-slate-900">Revenue Verification</h3>
                </div>
                <p className="text-slate-700">
                  Monthly revenue and profit are verified through bank statements, payment processor 
                  screenshots, and financial reports. No inflated numbers.
                </p>
              </div>

              <div className="space-y-4 p-6 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-[#0044CC]" />
                  <h3 className="text-xl font-semibold text-slate-900">Automated Valuation</h3>
                </div>
                <p className="text-slate-700">
                  Our model analyzes traffic trends, revenue stability, niche, and market comparables 
                  to provide accurate valuation ranges. Know what a site is worth.
                </p>
              </div>

              <div className="space-y-4 p-6 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Check className="h-6 w-6 text-[#0044CC]" />
                  <h3 className="text-xl font-semibold text-slate-900">Secure Transfer Process</h3>
                </div>
                <p className="text-slate-700">
                  We work with escrow partners and legal advisors to ensure safe asset transfers. 
                  Payments are protected until ownership is confirmed.
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
                  <h3 className="text-xl font-semibold text-slate-900">Browse Verified Listings</h3>
                  <p className="text-slate-700">
                    Explore websites with verified traffic, revenue, and performance data. Filter by 
                    niche, monthly revenue, traffic volume, and more to find the right opportunity.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#0044CC] text-white flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-slate-900">Review Complete Data</h3>
                  <p className="text-slate-700">
                    Access traffic analytics, revenue breakdowns, content audits, and technical assessments. 
                    Get a complete picture of the asset before making an offer.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#0044CC] text-white flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-slate-900">Secure Purchase</h3>
                  <p className="text-slate-700">
                    Negotiate through our platform, sign digital NDAs, and complete the transfer with 
                    escrow protection. We handle the legal and technical aspects.
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
                <h3 className="text-xl font-semibold text-slate-900">What types of websites are available?</h3>
                <p className="text-slate-700">
                  We list blogs, content sites, e-commerce stores, affiliate sites, and other digital 
                  properties. All listings include verified traffic and revenue data.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-900">How do you verify traffic and revenue?</h3>
                <p className="text-slate-700">
                  We require Google Analytics access, payment processor screenshots, bank statements, 
                  and other proof. Our team reviews all data for accuracy and flags any anomalies.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-900">What happens after I buy a website?</h3>
                <p className="text-slate-700">
                  We facilitate the transfer process including domain transfer, hosting migration, 
                  content handover, and payment processing through escrow. You get full support throughout.
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
            <h2 className="text-3xl font-bold">Ready to Buy a Profitable Website?</h2>
            <p className="text-xl text-blue-100">
              Browse verified listings with complete data and secure transactions.
            </p>
            <Link
              href="/feed"
              className="inline-flex items-center gap-2 rounded-full bg-white text-[#0044CC] px-8 py-4 text-lg font-semibold hover:bg-slate-100 transition-all"
            >
              Browse Website Listings
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </MarketingPageLayout>
  );
}

