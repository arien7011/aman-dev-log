"use client";

import { useQuery } from "@tanstack/react-query";
import { blogApi } from "@/lib/api";
import type { BlogFilters } from "@/types";

export function useBlogPosts(filters?: BlogFilters) {
  return useQuery({
    queryKey: ["blog-posts", filters],
    queryFn: () => blogApi.getPosts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ["blog-post", slug],
    queryFn: () => blogApi.getPost(slug),
    staleTime: 5 * 60 * 1000,
    enabled: !!slug,
  });
}

export function useFeaturedPosts(limit: number = 3) {
  return useQuery({
    queryKey: ["featured-posts", limit],
    queryFn: () => blogApi.getFeaturedPosts(limit),
    staleTime: 5 * 60 * 1000,
  });
}

export function useRecentPosts(limit: number = 5) {
  return useQuery({
    queryKey: ["recent-posts", limit],
    queryFn: () => blogApi.getRecentPosts(limit),
    staleTime: 5 * 60 * 1000,
  });
}

export function useRelatedPosts(postId: string, limit: number = 3) {
  return useQuery({
    queryKey: ["related-posts", postId, limit],
    queryFn: () => blogApi.getRelatedPosts(postId, limit),
    staleTime: 5 * 60 * 1000,
    enabled: !!postId,
  });
}

export function useBlogCategories() {
  return useQuery({
    queryKey: ["blog-categories"],
    queryFn: () => blogApi.getCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useBlogTags() {
  return useQuery({
    queryKey: ["blog-tags"],
    queryFn: () => blogApi.getTags(),
    staleTime: 30 * 60 * 1000,
  });
}

export function useSearchPosts(query: string) {
  return useQuery({
    queryKey: ["search-posts", query],
    queryFn: () => blogApi.searchPosts(query),
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: query.length >= 2,
  });
}
