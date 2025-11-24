import Head from 'next/head';
import Link from 'next/link';
import { getAllOffers, getOfferBySlug } from '@/lib/offers';

const SITE_URL = 'https://smc-platform.vercel.app';

const metricsList = [
  { key: 'mrr', label: 'MRR' },
  { key: 'churn', label: 'Churn' },
  { key: 'cac', label: 'CAC' },
  { key: 'ltv', label: 'LTV' }
];

const OfferDetailsPage = ({ offer }) => {
  if (!offer) {
    return (
      <main className="min-h-screen bg-[#050711] flex items-center justify-center text-white">
        <p>Offer not found.</p>
      </main>
    );
  }

  const canonical = `${SITE_URL}/offers/${offer.slug}`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    url: canonical,
    priceCurrency: 'USD',
    itemOffered: {
      '@type': 'Product',
      name: offer.title,
      category: offer.classification,
      description: offer.summary
    },
    priceSpecification: {
      '@type': 'PriceSpecification',
      priceCurrency: 'USD',
      minPrice: offer.investmentRange?.min ?? undefined,
      maxPrice: offer.investmentRange?.max ?? undefined
    },
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'MRR', value: offer.metrics?.mrr },
      { '@type': 'PropertyValue', name: 'Churn', value: offer.metrics?.churn },
      { '@type': 'PropertyValue', name: 'CAC', value: offer.metrics?.cac },
      { '@type': 'PropertyValue', name: 'LTV', value: offer.metrics?.ltv }
    ]
  };

  return (
    <main className="min-h-screen bg-[#050711] py-16 px-4 text-white">
      <Head>
        <title>{`${offer.title} | SaaS Opportunity - SMC Platform`}</title>
        <meta name="description" content={offer.summary} />
        <meta
          name="keywords"
          content={`buy SaaS, digital assets, ${offer.niche}, ${offer.classification}, SaaS multiples`}
        />
        <meta property="og:title" content={`${offer.title} | SMC Platform`} />
        <meta property="og:description" content={offer.summary} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={canonical} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </Head>
      <div className="max-w-4xl mx-auto space-y-8">
        <nav className="text-sm text-blue-300 flex items-center gap-2" aria-label="breadcrumb">
          <Link href="/">Home</Link>
          <span>›</span>
          <Link href="/feed">Opportunities</Link>
          <span>›</span>
          <span className="text-slate-300">{offer.title}</span>
        </nav>

        <header className="space-y-4">
          <p className="uppercase tracking-[0.4em] text-xs text-blue-200">{offer.classification}</p>
          <h1 className="text-4xl font-bold">{offer.title}</h1>
          <p className="text-slate-300">{offer.summary}</p>
          <div className="flex flex-wrap gap-3 text-xs text-slate-400">
            <span>{offer.niche}</span>
            <span>•</span>
            <span>{offer.valuationMultiple}</span>
            <span>•</span>
            <span>{offer.revenueRange}</span>
          </div>
        </header>

        <section className="grid md:grid-cols-2 gap-4 bg-[#0b1230] border border-white/5 rounded-3xl p-6">
          <div>
            <p className="text-slate-400 text-xs uppercase mb-1">Estimated investment</p>
            <h2 className="text-2xl font-semibold text-white">
              {offer.investmentRange
                ? `$${(offer.investmentRange.min / 1000).toFixed(0)}k – $${(offer.investmentRange.max / 1000).toFixed(0)}k`
                : 'Custom'}
            </h2>
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase mb-1">Current MRR</p>
            <h2 className="text-2xl font-semibold text-white">{offer.metrics?.mrr}</h2>
          </div>
          {metricsList.map(({ key, label }) => (
            <div key={key}>
              <p className="text-slate-400 text-xs uppercase mb-1">{label}</p>
              <p>{offer.metrics?.[key]}</p>
            </div>
          ))}
        </section>

        <section className="space-y-4 bg-[#0b1230] border border-white/5 rounded-3xl p-6">
          <h2 className="text-xl font-semibold">Highlights</h2>
          <div className="flex flex-wrap gap-2">
            {offer.badges?.map((badge) => (
              <span key={badge} className="px-3 py-1 rounded-full text-xs bg-white/5 text-slate-200">
                {badge}
              </span>
            ))}
          </div>
        </section>

        <section className="bg-[#0b1230] border border-white/5 rounded-3xl p-6 space-y-4">
          <h2 className="text-xl font-semibold">Next steps</h2>
          <p className="text-slate-300">
            This area is exclusive for logged-in members. By proceeding, you&apos;ll receive the complete memorandum, financial data, and
            technical checkpoints for due diligence.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link href="/profile" className="button primary">
              Talk to an advisor
            </Link>
            <Link href="/wizard" className="button secondary">
              I want to list my asset
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export async function getStaticPaths() {
  const offers = getAllOffers();
  return {
    paths: offers.map((offer) => ({ params: { slug: offer.slug } })),
    fallback: 'blocking'
  };
}

export async function getStaticProps({ params }) {
  const offer = getOfferBySlug(params.slug) || null;

  if (!offer) {
    return {
      notFound: true
    };
  }

  return {
    props: { offer },
    revalidate: 60 * 30
  };
}

export default OfferDetailsPage;
