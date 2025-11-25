'use client';

import { useState, useMemo } from 'react';
import BlogFilters from './BlogFilters';
import BlogList from './BlogList';
import { BlogPost } from '@/lib/blog';

interface BlogPageClientProps {
  posts: BlogPost[];
  categories: string[];
}

export default function BlogPageClient({ posts, categories }: BlogPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    let filtered = [...posts];

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags?.some((tag) => tag.toLowerCase().includes(query)) ||
          post.category?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [posts, searchQuery, selectedCategory]);

  return (
    <>
      <BlogFilters
        categories={categories}
        totalPosts={filteredPosts.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-8 sm:mt-12">
        <BlogList posts={filteredPosts} />
      </div>
    </>
  );
}

