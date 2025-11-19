import BlogHero from '@/components/blog/BlogHero';
import BlogCard from '@/components/blog/BlogCard';
import { getAllPosts } from '@/lib/blog';

export const revalidate = 3600;

export default function BlogPage() {
  const posts = getAllPosts();
  return (
    <main className="px-4 py-16 md:px-12 lg:px-24 space-y-10">
      <BlogHero
        title="Insights sobre valuation e ativos digitais"
        description="Guias, benchmarks e histórias de compra e venda no mercado secundário."
      />
      <section className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <BlogCard key={post.slug} slug={post.slug} title={post.title} excerpt={post.excerpt} date={post.date} category={post.category} />
        ))}
      </section>
    </main>
  );
}
