import BlogAuthorCard from '@/components/blog/BlogAuthorCard';
import { getAllAuthors } from '@/lib/blog';

export const revalidate = 3600;

export default function AuthorsPage() {
  const authors = getAllAuthors();
  return (
    <main className="px-4 py-16 md:px-12 lg:px-24 space-y-10">
      <header className="space-y-4 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-blue-200">Autores</p>
        <h1 className="text-4xl font-bold text-white">Quem escreve no SMC</h1>
      </header>
      <section className="grid gap-6 md:grid-cols-2">
        {authors.map((author) => (
          <BlogAuthorCard key={author.slug} slug={author.slug} name={author.name} role={author.role} bio={author.bio} />
        ))}
      </section>
    </main>
  );
}
