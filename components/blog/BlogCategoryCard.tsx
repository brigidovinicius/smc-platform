import Link from 'next/link';

interface BlogCategoryCardProps {
  category: string;
  count?: number;
}

const BlogCategoryCard = ({ category, count }: BlogCategoryCardProps) => (
  <article className="bg-card border border-border rounded-3xl p-5 flex flex-col gap-2">
    <h3 className="text-lg font-semibold text-foreground capitalize">
      <Link href={`/blog/categories/${category}`} className="hover:text-primary transition-colors">{category}</Link>
    </h3>
    {typeof count === 'number' && <p className="text-muted-foreground text-sm">{count} artigos</p>}
  </article>
);

export default BlogCategoryCard;
