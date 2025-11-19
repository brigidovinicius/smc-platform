import Link from 'next/link';

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category?: string;
}

const BlogCard = ({ slug, title, excerpt, date, category }: BlogCardProps) => (
  <article className="bg-[#050b1a] border border-white/5 rounded-3xl p-6 space-y-3">
    <p className="text-xs uppercase tracking-[0.3em] text-blue-300">{category}</p>
    <h3 className="text-2xl font-semibold text-white">
      <Link href={`/blog/${slug}`}>{title}</Link>
    </h3>
    <p className="text-slate-300 text-sm">{excerpt}</p>
    <p className="text-xs text-slate-500">{new Date(date).toLocaleDateString('pt-BR')}</p>
  </article>
);

export default BlogCard;
