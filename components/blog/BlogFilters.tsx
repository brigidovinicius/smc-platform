'use client';

import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, X, Filter } from 'lucide-react';

interface BlogFiltersProps {
  categories: string[];
  totalPosts: number;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  selectedCategory?: string | null;
  onCategoryChange?: (category: string | null) => void;
}

export default function BlogFilters({
  categories,
  totalPosts,
  searchQuery = '',
  onSearchChange,
  selectedCategory = null,
  onCategoryChange,
}: BlogFiltersProps) {
  const clearFilters = () => {
    onSearchChange?.('');
    onCategoryChange?.(null);
  };

  const hasActiveFilters = searchQuery || selectedCategory;

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="pl-10 sm:pl-12 pr-4 py-4 sm:py-6 text-sm sm:text-base bg-background border-input"
        />
      </div>

      {/* Categories Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2 flex-shrink-0">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs sm:text-sm font-medium text-foreground">Categories:</span>
        </div>
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 sm:pb-0 -mx-2 px-2 sm:mx-0 sm:px-0">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => onCategoryChange?.(null)}
            className="text-sm"
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => onCategoryChange?.(category)}
              className="text-sm capitalize"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {searchQuery && (
            <Badge variant="secondary" className="gap-2">
              Search: &ldquo;{searchQuery}&rdquo;
              <button
                onClick={() => onSearchChange?.('')}
                className="ml-1 hover:text-destructive"
                aria-label="Remove search filter"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedCategory && (
            <Badge variant="secondary" className="gap-2 capitalize">
              Category: {selectedCategory}
              <button
                onClick={() => onCategoryChange?.(null)}
                className="ml-1 hover:text-destructive"
                aria-label="Remove category filter"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {totalPosts === 1 ? '1 post found' : `${totalPosts} posts found`}
      </div>
    </div>
  );
}

