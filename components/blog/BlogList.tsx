'use client';

import BlogCard from './BlogCard';
import { BlogPost } from '@/lib/blog';

interface BlogListProps {
  posts: BlogPost[];
}

export default function BlogList({ posts }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-muted-foreground mb-2">No posts found with the applied filters.</p>
        <p className="text-sm text-muted-foreground">
          Try adjusting your search or selecting another category.
        </p>
      </div>
    );
  }

  return (
    <>
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
    </>
  );
}

