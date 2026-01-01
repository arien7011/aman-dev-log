import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PostGrid } from '@/components/blog';
import { Pagination } from '@/components/shared';
import { blogApi } from '@/lib/api/blog';
import { generateSEOMetadata } from '@/lib/utils';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const categories = await blogApi.getCategories();
  const categoryData = categories.find((c) => c.slug === category);
  
  if (!categoryData) {
    return {
      title: 'Category Not Found',
    };
  }
  
  return generateSEOMetadata({
    title: `${categoryData.name} Articles`,
    description: categoryData.description || `Browse all articles in the ${categoryData.name} category.`,
    keywords: [categoryData.name.toLowerCase(), 'blog', 'articles', 'tutorials'],
  });
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category } = await params;
  const { page } = await searchParams;
  
  const categories = await blogApi.getCategories();
  const categoryData = categories.find((c) => c.slug === category);
  
  if (!categoryData) {
    notFound();
  }
  
  const currentPage = Number(page) || 1;
  const postsData = await blogApi.getPosts({
    category,
    page: currentPage,
    limit: 9,
  });
  
  return (
    <div className="container py-12">
      {/* Back Link */}
      <Link
        href="/blog"
        className="mb-6 inline-flex items-center text-sm text-gray-600 transition-colors hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to all posts
      </Link>
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          {categoryData.name}
        </h1>
        {categoryData.description && (
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            {categoryData.description}
          </p>
        )}
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
          {postsData.pagination.total} article{postsData.pagination.total !== 1 ? 's' : ''}
        </p>
      </div>
      
      {/* Posts Grid */}
      <PostGrid posts={postsData.data} />
      
      {/* Pagination */}
      {postsData.pagination.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={postsData.pagination.totalPages}
          onPageChange={(newPage) => {
            // This will be handled by client-side navigation
            window.location.href = `/blog/category/${category}?page=${newPage}`;
          }}
          className="mt-12"
        />
      )}
    </div>
  );
}
