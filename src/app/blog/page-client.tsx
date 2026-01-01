'use client';

import { useState, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { PostGrid } from '@/components/blog';
import { SearchBar, FilterBar, Pagination } from '@/components/shared';
import { Skeleton } from '@/components/ui';
import { useBlogPosts, useBlogCategories } from '@/lib/hooks';
import { useDebouncedCallback } from '@/lib/hooks/use-debounce';

export function BlogPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const currentPage = Number(searchParams.get('page')) || 1;
  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = (searchParams.get('sort') as 'newest' | 'oldest' | 'popular') || 'newest';
  
  const [searchValue, setSearchValue] = useState(currentSearch);
  
  // Fetch data
  const { data: postsData, isLoading: postsLoading } = useBlogPosts({
    page: currentPage,
    limit: 9,
    category: currentCategory || undefined,
    search: currentSearch || undefined,
    sortBy: currentSort,
  });
  
  const { data: categories } = useBlogCategories();
  
  // Update URL params
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      
      // Reset page when filters change
      if (!updates.page) {
        params.delete('page');
      }
      
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );
  
  // Debounced search
  const debouncedSearch = useDebouncedCallback((value: string) => {
    updateParams({ search: value || null });
  }, 300);
  
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    debouncedSearch(value);
  };
  
  const handleCategoryChange = (category: string) => {
    updateParams({ category: category || null });
  };
  
  const handleSortChange = (sort: string) => {
    updateParams({ sort: sort || null });
  };
  
  const handlePageChange = (page: number) => {
    updateParams({ page: page > 1 ? String(page) : null });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Build filter options
  const categoryFilters = [
    { label: 'All', value: '' },
    ...(categories?.map((cat) => ({ label: cat.name, value: cat.slug })) || []),
  ];
  
  const sortOptions = [
    { label: 'Newest', value: 'newest' },
    { label: 'Oldest', value: 'oldest' },
    { label: 'Popular', value: 'popular' },
  ];
  
  return (
    <div className="container py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Blog</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Technical articles, tutorials, and insights on web development
        </p>
      </div>
      
      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SearchBar
            placeholder="Search articles..."
            value={searchValue}
            onChange={handleSearchChange}
            className="w-full sm:max-w-md"
          />
          <div className="flex gap-2">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  currentSort === option.value
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        
        <FilterBar
          filters={categoryFilters}
          activeFilter={currentCategory}
          onFilterChange={handleCategoryChange}
        />
      </div>
      
      {/* Posts Grid */}
      {postsLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-800">
              <Skeleton className="aspect-[16/9]" />
              <div className="p-5 space-y-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <PostGrid posts={postsData?.data || []} />
          
          {/* Pagination */}
          {postsData && postsData.pagination.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={postsData.pagination.totalPages}
              onPageChange={handlePageChange}
              className="mt-12"
            />
          )}
          
          {/* No results */}
          {postsData?.data.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                No posts found matching your criteria.
              </p>
              <button
                onClick={() => {
                  setSearchValue('');
                  updateParams({ search: null, category: null });
                }}
                className="mt-4 text-teal-600 hover:underline dark:text-teal-400"
              >
                Clear filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
