import { Metadata } from 'next';
import { Suspense } from 'react';
import { ProjectsPageClient } from './page-client';
import { Skeleton } from '@/components/ui';
import { generateSEOMetadata } from '@/lib/utils';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Projects',
  description: 'Explore my portfolio of web development projects, including enterprise applications, e-commerce platforms, and more.',
  keywords: ['projects', 'portfolio', 'web development', 'react', 'angular', 'full stack'],
});

function ProjectsSkeleton() {
  return (
    <div className="container py-12">
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-6 w-96" />
      </div>
      <div className="mt-8 flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24" />
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-800">
            <Skeleton className="aspect-[16/10]" />
            <div className="p-6 space-y-3">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-7 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<ProjectsSkeleton />}>
      <ProjectsPageClient />
    </Suspense>
  );
}
