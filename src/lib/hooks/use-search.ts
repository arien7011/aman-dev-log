"use client";

import { useState, useCallback, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebouncedCallback } from "./use-debounce";

interface UseSearchOptions {
  debounceMs?: number;
  minLength?: number;
}

export function useSearch(options: UseSearchOptions = {}) {
  const { debounceMs = 300, minLength = 2 } = options;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get initial value from URL
  const initialQuery = useMemo(
    () => searchParams.get("search") || "",
    [searchParams]
  );
  const [query, setQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);

  // Update URL with search query
  const updateSearchParams = useCallback(
    (newQuery: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (newQuery && newQuery.length >= minLength) {
        params.set("search", newQuery);
      } else {
        params.delete("search");
      }

      // Reset page when searching
      params.delete("page");

      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams, minLength]
  );

  // Debounced search
  const debouncedSearch = useDebouncedCallback((value: string) => {
    setIsSearching(false);
    updateSearchParams(value);
  }, debounceMs);

  // Handle search input change
  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);
      setIsSearching(true);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery("");
    setIsSearching(false);
    updateSearchParams("");
  }, [updateSearchParams]);

  return {
    query,
    isSearching,
    handleSearch,
    clearSearch,
    minLength,
  };
}
