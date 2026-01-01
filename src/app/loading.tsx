import { Skeleton } from '@/components/ui';

export default function Loading() {
  return (
    <div className="container py-12">
      {/* Header skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-6 w-96" />
      </div>
      
      {/* Content skeleton */}
      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-64 w-full rounded-xl" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
      
      {/* Grid skeleton */}
      <div className="mt-12">
        <Skeleton className="h-8 w-36 mb-6" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-800">
              <Skeleton className="aspect-video" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
