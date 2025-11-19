import Link from 'next/link';

interface BlogCategoryCardProps {
  category: string;
  count?: number;
}

const BlogCategoryCard = ({ category, count }: BlogCategoryCardProps) => (
  <article className="bg-[#060c1a] border border-white/5 rounded-3xl p-5 flex flex-col gap-2">
    <h3 className="text-lg font-semibold text-white capitalize">
      <Link href={`/blog/categories/${category}`}>{category}</Link>
    </h3>
    {typeof count === 'number' && <p className="text-slate-400 text-sm">{count} artigos</p>}
  </article>
);

export default BlogCategoryCard;
