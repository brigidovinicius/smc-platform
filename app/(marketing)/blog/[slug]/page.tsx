import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPostBySlug, getAllPosts, getRelatedPosts } from '@/lib/blog';
import { MarketingPageLayout } from '@/app/(marketing)/_components/MarketingPageLayout';
import BlogPost from '@/components/blog/BlogPost';
import RelatedPosts from '@/components/blog/RelatedPosts';
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
      title: 'Post not found',
    };
  }

  const postUrl = `${SITE_CONFIG.url}/blog/${params.slug}`;

  return {
    title: `${post.title} | CounterX Blog`,
    description: post.excerpt,
    authors: post.author ? [{ name: post.author }] : undefined,
    metadataBase: new URL(SITE_CONFIG.url),
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: postUrl,
      publishedTime: post.date,
      authors: post.author ? [post.author] : undefined,
      tags: post.tags,
      siteName: SITE_CONFIG.name,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      creator: SITE_CONFIG.twitter.handle,
    },
  };
}

export const revalidate = 3600;

export default function BlogPostPage({ params }: Params) {
  const post = getPostBySlug(params.slug);
  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post.slug, post.category, 3);

  return (
    <MarketingPageLayout showHero={false}>
      <section className="py-16 bg-white min-h-screen">
        <div className="container mx-auto px-4">
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
            
            {relatedPosts.length > 0 && (
              <RelatedPosts posts={relatedPosts} />
            )}
          </div>
        </div>
      </section>
    </MarketingPageLayout>
  );
}
