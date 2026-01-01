import { Metadata } from 'next';
import { Suspense } from 'react';
import { BlogPageClient } from './page-client';
import { Skeleton } from '@/components/ui';
import { generateSEOMetadata } from '@/lib/utils';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Blog',
  description: 'Technical articles, tutorials, and insights on web development, React, Angular, TypeScript, and software engineering.',
  keywords: ['blog', 'web development', 'react', 'angular', 'typescript', 'tutorials'],
});

function BlogSkeleton() {
  return (
    <div className="container py-12">
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-6 w-96" />
      </div>
      <div className="mt-8 flex gap-4">
        <Skeleton className="h-10 w-full max-w-md" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={<BlogSkeleton />}>
      <BlogPageClient />
    </Suspense>
  );
}
