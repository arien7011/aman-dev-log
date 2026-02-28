// ----------------------------------------------------------------
// Centralized React Query key factory.
// Using a factory pattern keeps cache invalidation predictable.
// ----------------------------------------------------------------

export const blogKeys = {
  /** All blog-related queries */
  all: ['blogs'] as const,

  /** Public paginated listings */
  list: (filters?: Record<string, unknown>) =>
    ['blogs', 'list', filters] as const,

  /** Single post detail */
  detail: (slug: string) => ['blogs', slug] as const,

  /** Admin-specific queries */
  admin: {
    all: ['blogs', 'admin'] as const,
    list: (filters?: Record<string, unknown>) =>
      ['blogs', 'admin', 'list', filters] as const,
  },
} as const;
