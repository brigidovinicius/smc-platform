import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MarketingPageLayout } from '@/app/(marketing)/_components/MarketingPageLayout';
import BlogCard from '@/components/blog/BlogCard';
import { getPostsByCategory } from '@/lib/blog';

interface Params {
  params: { category: string };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  return {
    title: `${params.category.charAt(0).toUpperCase() + params.category.slice(1)} | CounterX Blog`,
    description: `Posts about ${params.category} on CounterX blog`,
  };
}

export const revalidate = 3600;

export default function CategoryPage({ params }: Params) {
  const posts = getPostsByCategory(params.category);
  if (!posts.length) {
    notFound();
  }

  const categoryName = params.category.charAt(0).toUpperCase() + params.category.slice(1);

  return (
    <MarketingPageLayout
      title={`Category: ${categoryName}`}
      description={`Explore all posts about ${categoryName.toLowerCase()}`}
      showHero={true}
    >
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <p className="text-sm text-muted-foreground mb-2">
              {posts.length} {posts.length === 1 ? 'post found' : 'posts found'}
            </p>
          </div>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard
                key={post.slug}
                slug={post.slug}
                title={post.title}
                excerpt={post.excerpt}
                date={post.date}
                category={post.category}
              />
            ))}
          </div>
        </div>
      </section>
    </MarketingPageLayout>
  );
}
