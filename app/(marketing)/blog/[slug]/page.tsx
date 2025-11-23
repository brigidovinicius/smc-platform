import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPostBySlug, getAllPosts } from '@/lib/blog';
import BlogPost from '@/components/blog/BlogPost';
import { Breadcrumbs } from '@/components/blog/Breadcrumbs';
import { SITE_CONFIG } from '@/lib/site-config';

interface Params {
  params: { slug: string };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug
  }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Post não encontrado',
    };
  }

  return {
    title: `${post.title} | Blog SMC`,
    description: post.excerpt,
    authors: post.author ? [{ name: post.author }] : undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: post.author ? [post.author] : undefined,
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  };
}

export const revalidate = 3600;

export default function BlogPostPage({ params }: Params) {
  const post = getPostBySlug(params.slug);
  if (!post) {
    notFound();
  }

  return (
    <main className="px-4 py-16 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto space-y-8">
        <Breadcrumbs
          items={[
            { label: 'Blog', href: '/blog' },
            { label: post.title }
          ]}
        />
        <BlogPost 
          title={post.title} 
          date={post.date} 
          author={post.author} 
          content={post.content}
          category={post.category}
          tags={post.tags}
        />
      </div>
    </main>
  );
}
