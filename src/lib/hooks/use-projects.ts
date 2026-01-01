"use client";

import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "@/lib/api";
import type { ProjectFilters } from "@/types";

export function useProjects(filters?: ProjectFilters) {
  return useQuery({
    queryKey: ["projects", filters],
    queryFn: () => projectsApi.getProjects(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: ["project", slug],
    queryFn: () => projectsApi.getProject(slug),
    staleTime: 5 * 60 * 1000,
    enabled: !!slug,
  });
}

export function useFeaturedProjects(limit: number = 3) {
  return useQuery({
    queryKey: ["featured-projects", limit],
    queryFn: () => projectsApi.getFeaturedProjects(limit),
    staleTime: 5 * 60 * 1000,
  });
}

export function useProjectTechnologies() {
  return useQuery({
    queryKey: ["project-technologies"],
    queryFn: () => projectsApi.getTechnologies(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useProjectsByTechnology(technology: string) {
  return useQuery({
    queryKey: ["projects-by-tech", technology],
    queryFn: () => projectsApi.getProjectsByTechnology(technology),
    staleTime: 5 * 60 * 1000,
    enabled: !!technology,
  });
}
