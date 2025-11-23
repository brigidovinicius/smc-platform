import type { Metadata } from 'next';
import { MarketingPageLayout } from '../../_components/MarketingPageLayout';
import BlogCategoryCard from '@/components/blog/BlogCategoryCard';
import { getCategoriesWithCount } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Categorias | Blog SMC',
  description: 'Explore posts do blog organizados por categorias',
};

export const revalidate = 3600;

export default function CategoriesPage() {
  const categories = getCategoriesWithCount();
  return (
    <MarketingPageLayout
      title="Categorias do Blog"
      description="Explore posts organizados por temas e categorias"
      showHero={true}
    >
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <BlogCategoryCard
                key={cat.category}
                category={cat.category}
                count={cat.count}
              />
            ))}
          </div>
        </div>
      </section>
    </MarketingPageLayout>
  );
}
