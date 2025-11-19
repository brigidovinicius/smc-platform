import { notFound } from 'next/navigation';
import BlogPost from '@/components/blog/BlogPost';
import { getPostBySlug } from '@/lib/blog';

interface Params {
  params: { slug: string };
}

export const revalidate = 3600;

export default function BlogPostPage({ params }: Params) {
  const post = getPostBySlug(params.slug);
  if (!post) {
    notFound();
  }

  return (
    <main className="px-4 py-16 md:px-12 lg:px-24">
      <BlogPost title={post.title} date={post.date} author={post.author} content={post.content} />
    </main>
  );
}
