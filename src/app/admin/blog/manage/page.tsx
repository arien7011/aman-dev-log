import { Suspense } from 'react';
import { ManageBlogPageClient } from './page-client';
import { Skeleton } from '@/components/ui';

function ManageSkeleton() {
  return (
    <div className="space-y-3 p-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-20 w-full rounded-lg" />
      ))}
    </div>
  );
}

export default function ManageBlogPage() {
  return (
    <Suspense fallback={<ManageSkeleton />}>
      <ManageBlogPageClient />
    </Suspense>
  );
}
