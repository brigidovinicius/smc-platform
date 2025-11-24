import Link from 'next/link';

interface BlogCategoryCardProps {
  category: string;
  count?: number;
}

const BlogCategoryCard = ({ category, count }: BlogCategoryCardProps) => (
  <article 
    className="bg-card border border-border rounded-3xl p-5 flex flex-col gap-2"
    aria-label={`Category: ${category}${typeof count === 'number' ? `, ${count} articles` : ''}`}
  >
    <h3 className="text-lg font-semibold text-foreground capitalize">
      <Link 
        href={`/blog/categories/${category}`} 
        className="hover:text-primary transition-colors"
        aria-label={`View posts in category ${category}`}
      >
        {category}
      </Link>
    </h3>
    {typeof count === 'number' && (
      <p className="text-muted-foreground text-sm" aria-label={`Total of ${count} articles in this category`}>
        {count} articles
      </p>
    )}
  </article>
);

export default BlogCategoryCard;
