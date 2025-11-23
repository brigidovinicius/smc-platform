import type { Metadata } from 'next';
import BlogHero from '@/components/blog/BlogHero';
import BlogCard from '@/components/blog/BlogCard';
import { Breadcrumbs } from '@/components/blog/Breadcrumbs';
import { getAllPosts } from '@/lib/blog';
import { SITE_CONFIG } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Blog | SMC Platform',
  description: 'Insights sobre valuation, ativos digitais, guias e benchmarks do mercado secundário.',
  openGraph: {
    title: 'Blog | SMC Platform',
    description: 'Insights sobre valuation e ativos digitais',
    type: 'website',
  },
};

export const revalidate = 3600;

export default function BlogPage() {
  const posts = getAllPosts();
  return (
    <main className="px-4 py-16 md:px-12 lg:px-24 space-y-10">
      <Breadcrumbs items={[{ label: 'Blog' }]} />
      <BlogHero
        title="Insights sobre valuation e ativos digitais"
        description="Guias, benchmarks e histórias de compra e venda no mercado secundário."
      />
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.length > 0 ? (
          posts.map((post) => (
            <BlogCard
              key={post.slug}
              slug={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              date={post.date}
              category={post.category}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">Nenhum post encontrado.</p>
          </div>
        )}
      </section>
    </main>
  );
}
