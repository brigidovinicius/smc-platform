import { notFound } from 'next/navigation';
import BlogCard from '@/components/blog/BlogCard';
import BlogAuthorCard from '@/components/blog/BlogAuthorCard';
import { getAuthorBySlug, getPostsByAuthor } from '@/lib/blog';

interface Params {
  params: { author: string };
}

export const revalidate = 3600;

export default function AuthorPage({ params }: Params) {
  const author = getAuthorBySlug(params.author);
  if (!author) {
    notFound();
  }
  const posts = getPostsByAuthor(params.author);
  return (
    <main className="px-4 py-16 md:px-12 lg:px-24 space-y-10">
      <BlogAuthorCard slug={author.slug} name={author.name} role={author.role} bio={author.bio} />
      <section className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <BlogCard key={post.slug} slug={post.slug} title={post.title} excerpt={post.excerpt} date={post.date} category={post.category} />
        ))}
      </section>
    </main>
  );
}
