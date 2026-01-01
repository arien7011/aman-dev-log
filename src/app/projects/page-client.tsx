'use client';

import { useState } from 'react';
import { ProjectGrid } from '@/components/projects';
import { FilterBar } from '@/components/shared';
import { Skeleton } from '@/components/ui';
import { useProjects } from '@/lib/hooks';
import { projectCategories } from '@/config/navigation';

export function ProjectsPageClient() {
  const [categoryFilter, setCategoryFilter] = useState('');
  
  const { data: projects, isLoading } = useProjects({
    category: categoryFilter || undefined,
  });
  
  const filterOptions = projectCategories.map((cat) => ({
    label: cat.name,
    value: cat.value,
  }));
  
  return (
    <div className="container py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Projects</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          A showcase of my professional work and personal projects
        </p>
      </div>
      
      {/* Filters */}
      <FilterBar
        filters={filterOptions}
        activeFilter={categoryFilter}
        onFilterChange={setCategoryFilter}
        className="mb-8"
      />
      
      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-800">
              <Skeleton className="aspect-16/10" />
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
      ) : (
        <ProjectGrid projects={projects || []} showFeatured={!categoryFilter} />
      )}
      
      {/* No results */}
      {!isLoading && projects?.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            No projects found in this category.
          </p>
          <button
            onClick={() => setCategoryFilter('')}
            className="mt-4 text-teal-600 hover:underline dark:text-teal-400"
          >
            View all projects
          </button>
        </div>
      )}
    </div>
  );
}
