import type { Metadata } from 'next';
import Link from 'next/link';
import { MarketingPageLayout } from '@/app/(marketing)/_components/MarketingPageLayout';
import { buildMetadata } from '@/lib/seo';
import { SITE_CONFIG } from '@/lib/site-config';
import { Check, Globe, TrendingUp, Shield, ArrowRight, DollarSign } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Sell Your Website Safely with CounterX',
    description: 'Sell your website or blog with verified traffic data, automated valuation, and secure transactions. Get the best price from qualified buyers.',
    url: `${SITE_CONFIG.url}/sell-website`,
    keywords: ['sell website', 'sell blog', 'website marketplace', 'exit website', 'sell online business', 'website valuation'],
  });
}

export default function SellWebsitePage() {
  return (
    <MarketingPageLayout
      title="Sell Your Website Safely"
      description="Get the best price for your website with verified traffic data, automated valuation, and secure deal room. Trusted by website owners worldwide."
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
              List Your Website
              <ArrowRight className="h-5 w-5" />
            </Link>
            <p className="text-slate-600">Free to list • Automated valuation • Verified buyers • Secure transactions</p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-slate-900">The Challenge of Selling Your Website</h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-700">
                Selling a website can be stressful and risky. Many owners struggle with valuation, 
                don&apos;t know how to present their traffic and revenue data, and worry about scams. 
                Traditional marketplaces may not verify buyers, leading to wasted time and potential fraud.
              </p>
              <p className="text-lg text-slate-700">
                Without proper verification and secure processes, you might undervalue your site, 
                deal with unqualified buyers, or risk losing your asset during transfer. The process 
                can be overwhelming without the right support.
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
              <h2 className="text-3xl font-bold text-slate-900">How CounterX Protects Sellers</h2>
              <p className="text-xl text-slate-600">
                We make selling your website safe, straightforward, and profitable.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4 p-6 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-6 w-6 text-[#0044CC]" />
                  <h3 className="text-xl font-semibold text-slate-900">Fair Valuation</h3>
                </div>
                <p className="text-slate-700">
                  Get an accurate valuation based on traffic trends, revenue stability, niche, and 
                  market comparables. Know what your website is worth before listing.
                </p>
              </div>

              <div className="space-y-4 p-6 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-[#0044CC]" />
                  <h3 className="text-xl font-semibold text-slate-900">Verified Buyers</h3>
                </div>
                <p className="text-slate-700">
                  All buyers are KYC-verified and have proof of funds before accessing your data. 
                  No time wasted on unqualified inquiries.
                </p>
              </div>

              <div className="space-y-4 p-6 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Globe className="h-6 w-6 text-[#0044CC]" />
                  <h3 className="text-xl font-semibold text-slate-900">Secure Transfer</h3>
                </div>
                <p className="text-slate-700">
                  We facilitate safe asset transfers with escrow protection, legal support, and 
                  technical assistance. Your payment is secure until transfer is complete.
                </p>
              </div>

              <div className="space-y-4 p-6 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-[#0044CC]" />
                  <h3 className="text-xl font-semibold text-slate-900">Professional Presentation</h3>
                </div>
                <p className="text-slate-700">
                  We help you organize traffic data, revenue proof, and content audits into a 
                  professional listing that buyers trust and understand.
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
                  <h3 className="text-xl font-semibold text-slate-900">List Your Website</h3>
                  <p className="text-slate-700">
                    Complete our guided process to share traffic data, revenue proof, and site details. 
                    We verify all information and create a professional listing.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#0044CC] text-white flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-slate-900">Get Valuation & Exposure</h3>
                  <p className="text-slate-700">
                    Receive an automated valuation and get your listing in front of 2,400+ verified 
                    buyers. Qualified inquiries only.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#0044CC] text-white flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-slate-900">Close Securely</h3>
                  <p className="text-slate-700">
                    Negotiate through our platform, use escrow for payment protection, and complete 
                    the transfer with our support. Safe and straightforward.
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
                <h3 className="text-xl font-semibold text-slate-900">What information do I need to list?</h3>
                <p className="text-slate-700">
                  You&apos;ll need Google Analytics access, revenue proof (bank statements or payment 
                  processor screenshots), traffic data, and basic site information. We guide you through 
                  everything.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-900">How long does it take to sell?</h3>
                <p className="text-slate-700">
                  The average time is 34 days, but it depends on your site&apos;s metrics, pricing, and 
                  how quickly you respond to inquiries. Well-prepared listings with verified data move faster.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-900">Is my data safe?</h3>
                <p className="text-slate-700">
                  Yes. We use encrypted data rooms, access logs, and only share sensitive information 
                  with verified buyers who have signed NDAs. You control who sees what.
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
            <h2 className="text-3xl font-bold">Ready to Sell Your Website?</h2>
            <p className="text-xl text-blue-100">
              List for free and get access to 2,400+ verified buyers with secure transactions.
            </p>
            <Link
              href="/wizard"
              className="inline-flex items-center gap-2 rounded-full bg-white text-[#0044CC] px-8 py-4 text-lg font-semibold hover:bg-slate-100 transition-all"
            >
              List Your Website Now
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </MarketingPageLayout>
  );
}

