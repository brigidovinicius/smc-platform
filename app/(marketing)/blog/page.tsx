import type { Metadata } from 'next';
import { MarketingPageLayout } from '@/app/(marketing)/_components/MarketingPageLayout';
import BlogPageClient from '@/components/blog/BlogPageClient';
import { getAllPosts, getAllCategories } from '@/lib/blog';
import { SITE_CONFIG } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Blog | CounterX',
  description: 'Insights on valuation, digital assets, guides, and secondary market benchmarks.',
  metadataBase: new URL(SITE_CONFIG.url),
  alternates: {
    canonical: `${SITE_CONFIG.url}/blog`,
  },
  openGraph: {
    title: 'Blog | CounterX',
    description: 'Insights on valuation and digital assets',
    type: 'website',
    url: `${SITE_CONFIG.url}/blog`,
    siteName: SITE_CONFIG.name,
  },
  twitter: {
    card: 'summary_large_image',
    creator: SITE_CONFIG.twitter.handle,
  },
};

export const revalidate = 3600;

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getAllCategories();

  return (
    <MarketingPageLayout
      title="CounterX Blog"
      description="Insights on valuation, digital assets, guides, and secondary market benchmarks."
      showHero={true}
    >
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <BlogPageClient posts={posts} categories={categories} />
        </div>
      </section>
    </MarketingPageLayout>
  );
}
