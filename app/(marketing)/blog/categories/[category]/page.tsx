import { notFound } from 'next/navigation';
import BlogCard from '@/components/blog/BlogCard';
import { getPostsByCategory } from '@/lib/blog';

interface Params {
  params: { category: string };
}

export const revalidate = 3600;

export default function CategoryPage({ params }: Params) {
  const posts = getPostsByCategory(params.category);
  if (!posts.length) {
    notFound();
  }
  return (
    <main className="px-4 py-16 md:px-12 lg:px-24 space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.4em] text-blue-200">Categoria</p>
        <h1 className="text-4xl font-bold text-white capitalize">{params.category}</h1>
      </header>
      <section className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <BlogCard key={post.slug} slug={post.slug} title={post.title} excerpt={post.excerpt} date={post.date} category={post.category} />
        ))}
      </section>
    </main>
  );
}
