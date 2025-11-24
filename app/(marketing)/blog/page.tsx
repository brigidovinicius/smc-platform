import type { Metadata } from 'next';
import { MarketingPageLayout } from '../_components/MarketingPageLayout';
import BlogPageClient from '@/components/blog/BlogPageClient';
import { getAllPosts, getAllCategories } from '@/lib/blog';
import { SITE_CONFIG } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Blog | SMC Platform',
  description: 'Insights on valuation, digital assets, guides, and secondary market benchmarks.',
  openGraph: {
    title: 'Blog | SMC Platform',
    description: 'Insights on valuation and digital assets',
    type: 'website',
  },
};

export const revalidate = 3600;

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getAllCategories();

  return (
    <MarketingPageLayout
      title="SMC Blog"
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
