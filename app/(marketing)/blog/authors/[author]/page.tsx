import type { Metadata } from 'next';
import { MarketingPageLayout } from '@/app/(marketing)/_components/MarketingPageLayout';
import BlogAuthorCard from '@/components/blog/BlogAuthorCard';
import BlogCard from '@/components/blog/BlogCard';
import { getAllAuthors, getAuthorBySlug, getPostsByAuthor } from '@/lib/blog';
import { notFound } from 'next/navigation';

interface Params {
  params: { author: string };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const author = getAuthorBySlug(params.author);
  if (!author) {
    return { title: 'Author not found' };
  }
  return {
    title: `${author.name} | Blog SMC`,
    description: author.bio || `Posts written by ${author.name}`,
  };
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const authors = getAllAuthors();
  return authors.map((author) => ({
    author: author.slug,
  }));
}

export default function AuthorPage({ params }: Params) {
  const author = getAuthorBySlug(params.author);
  if (!author) {
    notFound();
  }
  const posts = getPostsByAuthor(params.author);

  return (
    <MarketingPageLayout
      title={`Author: ${author.name}`}
      description={author.bio || `Explore all posts written by ${author.name}`}
      showHero={true}
    >
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <BlogAuthorCard
              slug={author.slug}
              name={author.name}
              role={author.role}
              bio={author.bio}
            />
          </div>
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
