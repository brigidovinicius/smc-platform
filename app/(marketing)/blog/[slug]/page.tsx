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
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
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
      images: [
        {
          url: (post as any).image ? `${SITE_CONFIG.url}${(post as any).image}` : `${SITE_CONFIG.url}${SITE_CONFIG.ogImage}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: (post as any).image ? [`${SITE_CONFIG.url}${(post as any).image}`] : [`${SITE_CONFIG.url}${SITE_CONFIG.ogImage}`],
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
  const postUrl = `${SITE_CONFIG.url}/blog/${params.slug}`;
  const postImage = (post as any).image ? `${SITE_CONFIG.url}${(post as any).image}` : `${SITE_CONFIG.url}${SITE_CONFIG.ogImage}`;

  // Structured data for blog post
  const blogPostSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: postImage,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author || 'CounterX Team',
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/counterx-primary.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    articleSection: post.category,
    keywords: post.tags?.join(', ') || '',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostSchema) }}
      />
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
    </>
  );
}
