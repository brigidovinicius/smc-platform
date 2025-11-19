import BlogCategoryCard from '@/components/blog/BlogCategoryCard';
import { getAllCategories } from '@/lib/blog';

export const revalidate = 3600;

export default function CategoriesPage() {
  const categories = getAllCategories();
  return (
    <main className="px-4 py-16 md:px-12 lg:px-24 space-y-10">
      <header className="space-y-4 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-blue-200">Categorias</p>
        <h1 className="text-4xl font-bold text-white">Explore por temas</h1>
      </header>
      <section className="grid gap-6 md:grid-cols-3">
        {categories.map((category) => (
          <BlogCategoryCard key={category.category} category={category.category} count={category.count} />
        ))}
      </section>
    </main>
  );
}
