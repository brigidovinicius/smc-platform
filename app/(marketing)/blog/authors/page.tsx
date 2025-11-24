import type { Metadata } from 'next';
import { MarketingPageLayout } from '@/app/(marketing)/_components/MarketingPageLayout';
import BlogAuthorCard from '@/components/blog/BlogAuthorCard';
import { getAllAuthors } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Authors | CounterX Blog',
  description: 'Meet the authors of CounterX blog',
};

export const revalidate = 3600;

export default function AuthorsPage() {
  const authors = getAllAuthors();
  return (
    <MarketingPageLayout
      title="Blog Authors"
      description="Meet the authors writing about valuation and digital assets"
      showHero={true}
    >
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {authors.map((author) => (
              <BlogAuthorCard
                key={author.slug}
                slug={author.slug}
                name={author.name}
                role={author.role}
                bio={author.bio}
              />
            ))}
          </div>
        </div>
      </section>
    </MarketingPageLayout>
  );
}
