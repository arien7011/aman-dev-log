import {
  BlogPost,
  BlogFilters,
  PaginatedResponse,
  Category,
  Tag,
  Author,
} from "@/types";
import { authorConfig } from "@/config/site";

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ??
  (typeof window === 'undefined' ? 'http://localhost:3000/api' : '/api');

async function apiFetch<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T | null> {
  try {
    const url = new URL(`${API_BASE}${path}`, 'http://localhost');
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
      });
    }
    const res = await fetch(url.toString(), { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json as T;
  } catch {
    return null;
  }
}

// Mock data for blog posts
const mockCategories: Category[] = [
  {
    id: "1",
    name: "React",
    slug: "react",
    description: "React.js tutorials and best practices",
  },
  {
    id: "2",
    name: "TypeScript",
    slug: "typescript",
    description: "TypeScript tips and advanced patterns",
  },
  {
    id: "3",
    name: "Performance",
    slug: "performance",
    description: "Web performance optimization",
  },
  {
    id: "4",
    name: "Career",
    slug: "career",
    description: "Career advice and insights",
  },
  {
    id: "5",
    name: "Next.js",
    slug: "nextjs",
    description: "Next.js framework tutorials",
  },
];

const mockTags: Tag[] = [
  { id: "1", name: "JavaScript", slug: "javascript" },
  { id: "2", name: "React", slug: "react" },
  { id: "3", name: "TypeScript", slug: "typescript" },
  { id: "4", name: "Next.js", slug: "nextjs" },
  { id: "5", name: "CSS", slug: "css" },
  { id: "6", name: "Performance", slug: "performance" },
  { id: "7", name: "Testing", slug: "testing" },
  { id: "8", name: "Best Practices", slug: "best-practices" },
];

const mockAuthor: Author = {
  id: "1",
  name: authorConfig.name,
  avatar: authorConfig.avatar,
  bio: authorConfig.bio,
  email: authorConfig.email,
  social: authorConfig.social,
};

const mockPosts: BlogPost[] = [
  {
    id: "1",
    slug: "building-scalable-react-applications",
    title:
      "Building Scalable React Applications: Lessons from 3+ Years of Experience",
    excerpt:
      "Learn the key architectural patterns and best practices I've discovered while building enterprise-scale React applications that can handle 200k+ visitors.",
    content: `<h2>Introduction</h2><p>After working on multiple large-scale React applications, I've learned that scalability isn't just about handling more users—it's about maintaining code quality, developer productivity, and application performance as your codebase grows.</p><h2>Key Architectural Decisions</h2><p>Here are the most impactful decisions I've made across various projects...</p><h3>1. Component Architecture</h3><p>Organizing components into a clear hierarchy with proper separation of concerns is crucial. I follow a pattern of smart/container components and presentational components.</p><h3>2. State Management Strategy</h3><p>Using Redux Toolkit and React Query in combination has proven to be highly effective for managing both client and server state.</p><h3>3. Performance Optimization</h3><p>Code splitting, lazy loading, and proper memoization are essential for maintaining fast load times.</p><h2>Conclusion</h2><p>Building scalable React applications requires thoughtful architecture from the start. These patterns have helped me deliver applications that serve hundreds of thousands of users efficiently.</p>`,
    coverImage:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=630&fit=crop",
    publishedAt: "2024-12-28T10:00:00Z",
    updatedAt: "2024-12-28T10:00:00Z",
    author: mockAuthor,
    tags: [mockTags[1], mockTags[2], mockTags[7]],
    category: mockCategories[0],
    readingTime: 8,
    featured: true,
    views: 1520,
    likes: 45,
  },
  {
    id: "2",
    slug: "mastering-typescript-for-react-developers",
    title: "Mastering TypeScript for React Developers: A Comprehensive Guide",
    excerpt:
      "Deep dive into TypeScript patterns that will make your React code more robust, maintainable, and enjoyable to work with.",
    content: `<h2>Why TypeScript?</h2><p>TypeScript has become an essential tool for building large-scale React applications. It provides type safety, better IDE support, and catches errors at compile time.</p><h2>Essential Patterns</h2><p>Here are the TypeScript patterns every React developer should know...</p><h3>Generic Components</h3><p>Learn how to create flexible, reusable components using TypeScript generics.</p><h3>Discriminated Unions</h3><p>Use discriminated unions to model complex state and props with type safety.</p><h2>Advanced Types</h2><p>Master utility types like Pick, Omit, Partial, and Required to manipulate types effectively.</p>`,
    coverImage:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&h=630&fit=crop",
    publishedAt: "2024-12-25T10:00:00Z",
    updatedAt: "2024-12-25T10:00:00Z",
    author: mockAuthor,
    tags: [mockTags[2], mockTags[1], mockTags[7]],
    category: mockCategories[1],
    readingTime: 12,
    featured: false,
    views: 980,
    likes: 32,
  },
  {
    id: "3",
    slug: "optimizing-web-performance-core-web-vitals",
    title: "Optimizing Web Performance: A Deep Dive into Core Web Vitals",
    excerpt:
      "Practical strategies to improve your Lighthouse scores and deliver faster, more responsive web applications.",
    content: `<h2>Understanding Core Web Vitals</h2><p>Core Web Vitals are a set of metrics that measure real-world user experience for loading performance, interactivity, and visual stability.</p><h2>LCP Optimization</h2><p>Largest Contentful Paint measures loading performance. Here's how to optimize it...</p><h2>FID Optimization</h2><p>First Input Delay measures interactivity. Reduce JavaScript execution time to improve FID.</p><h2>CLS Optimization</h2><p>Cumulative Layout Shift measures visual stability. Always define image dimensions and avoid inserting content above existing content.</p>`,
    coverImage:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop",
    publishedAt: "2024-12-20T10:00:00Z",
    updatedAt: "2024-12-20T10:00:00Z",
    author: mockAuthor,
    tags: [mockTags[5], mockTags[7], mockTags[0]],
    category: mockCategories[2],
    readingTime: 10,
    featured: true,
    views: 1250,
    likes: 38,
  },
  {
    id: "4",
    slug: "next-js-app-router-migration-guide",
    title:
      "Next.js App Router Migration: Complete Guide from Pages to App Directory",
    excerpt:
      "Step-by-step guide to migrating your Next.js application from the Pages Router to the new App Router architecture.",
    content: `<h2>Why Migrate?</h2><p>The App Router brings significant improvements including React Server Components, streaming, and better data fetching patterns.</p><h2>Migration Steps</h2><p>Here's a systematic approach to migrating your application...</p><h3>Step 1: Update Next.js</h3><p>Start by updating to Next.js 13+ and enabling the app directory in next.config.js.</p><h3>Step 2: Create App Directory</h3><p>Create the app directory structure alongside your existing pages directory.</p><h3>Step 3: Migrate Routes</h3><p>Gradually migrate routes from pages to app, converting to the new file conventions.</p>`,
    coverImage:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop",
    publishedAt: "2024-12-15T10:00:00Z",
    updatedAt: "2024-12-15T10:00:00Z",
    author: mockAuthor,
    tags: [mockTags[3], mockTags[1], mockTags[7]],
    category: mockCategories[4],
    readingTime: 15,
    featured: false,
    views: 890,
    likes: 28,
  },
  {
    id: "5",
    slug: "career-growth-frontend-engineer",
    title:
      "Career Growth as a Frontend Engineer: From Junior to Senior in 4 Years",
    excerpt:
      "Reflecting on my journey from a fresh graduate to a senior frontend engineer, and the lessons learned along the way.",
    content: `<h2>My Journey</h2><p>Four years ago, I started my career as a fresh graduate with basic knowledge of HTML, CSS, and JavaScript. Today, I lead frontend development for enterprise applications.</p><h2>Key Milestones</h2><p>Here are the pivotal moments that accelerated my growth...</p><h3>Year 1: Foundation</h3><p>Focus on mastering fundamentals and understanding how the web works.</p><h3>Year 2: Specialization</h3><p>Deep dive into React and start contributing to architectural decisions.</p><h3>Year 3-4: Leadership</h3><p>Take ownership of projects, mentor juniors, and drive technical initiatives.</p>`,
    coverImage:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=630&fit=crop",
    publishedAt: "2024-12-10T10:00:00Z",
    updatedAt: "2024-12-10T10:00:00Z",
    author: mockAuthor,
    tags: [mockTags[7], mockTags[0]],
    category: mockCategories[3],
    readingTime: 7,
    featured: false,
    views: 2100,
    likes: 65,
  },
  {
    id: "6",
    slug: "angular-to-react-migration-lessons",
    title: "Lessons Learned: Migrating a Large-Scale App from Angular to React",
    excerpt:
      "Real-world insights from leading a major migration project, including challenges faced and strategies that worked.",
    content: `<h2>The Challenge</h2><p>Migrating a multi-domain cannabis dispensary platform from Angular 12 to React 18 while maintaining production stability was no small feat.</p><h2>Strategy</h2><p>We adopted a strangler fig pattern, gradually replacing Angular components with React...</p><h2>Key Learnings</h2><p>The most important lessons from this migration included proper planning, team training, and maintaining backwards compatibility throughout the process.</p>`,
    coverImage:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=630&fit=crop",
    publishedAt: "2024-12-05T10:00:00Z",
    updatedAt: "2024-12-05T10:00:00Z",
    author: mockAuthor,
    tags: [mockTags[1], mockTags[7], mockTags[0]],
    category: mockCategories[0],
    readingTime: 11,
    featured: false,
    views: 780,
    likes: 24,
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function getMockPaginatedPosts(filters?: BlogFilters): PaginatedResponse<BlogPost> {
  let filteredPosts = [...mockPosts];

  if (filters?.category) {
    filteredPosts = filteredPosts.filter(
      (post) => post.category.slug === filters.category
    );
  }

  if (filters?.tag) {
    filteredPosts = filteredPosts.filter((post) =>
      post.tags.some((tag) => tag.slug === filters.tag)
    );
  }

  if (filters?.search) {
    const query = filters.search.toLowerCase();
    filteredPosts = filteredPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some((tag) => tag.name.toLowerCase().includes(query))
    );
  }

  if (filters?.sortBy === 'oldest') {
    filteredPosts.sort(
      (a, b) =>
        new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
    );
  } else if (filters?.sortBy === 'popular') {
    filteredPosts.sort((a, b) => (b.views || 0) - (a.views || 0));
  } else {
    filteredPosts.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  const page = filters?.page || 1;
  const limit = filters?.limit || 10;
  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    data: filteredPosts.slice(start, end),
    pagination: {
      page,
      limit,
      total: filteredPosts.length,
      totalPages: Math.ceil(filteredPosts.length / limit),
    },
  };
}

export function getMockPostBySlug(slug: string): BlogPost | null {
  return mockPosts.find((post) => post.slug === slug) || null;
}

export const blogApi = {
  // Get all posts with optional filters — real API with mock fallback
  async getPosts(filters?: BlogFilters): Promise<PaginatedResponse<BlogPost>> {
    const params: Record<string, string | number | undefined> = {
      page: filters?.page,
      limit: filters?.limit,
      category: filters?.category,
      search: filters?.search,
      sortBy: filters?.sortBy,
      tag: filters?.tag,
    };

    const result = await apiFetch<PaginatedResponse<BlogPost>>('/blog', params);
    if (result) return result;

    // ---- mock fallback (dev / API unreachable) ----
    await delay(300);

    return getMockPaginatedPosts(filters);
  },

  // Get a single post by slug — real API with mock fallback
  async getPost(slug: string): Promise<BlogPost | null> {
    const result = await apiFetch<{ data: BlogPost }>(`/blog/${slug}`);
    if (result?.data) return result.data;

    // ---- mock fallback ----
    await delay(200);
    return getMockPostBySlug(slug);
  },

  // Get featured posts
  async getFeaturedPosts(limit: number = 3): Promise<BlogPost[]> {
    await delay(200);
    return mockPosts.filter((post) => post.featured).slice(0, limit);
  },

  // Get recent posts
  async getRecentPosts(limit: number = 5): Promise<BlogPost[]> {
    await delay(200);
    return [...mockPosts]
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )
      .slice(0, limit);
  },

  // Get related posts
  async getRelatedPosts(
    postId: string,
    limit: number = 3
  ): Promise<BlogPost[]> {
    await delay(200);
    const currentPost = mockPosts.find((post) => post.id === postId);
    if (!currentPost) return [];

    // Find posts with similar category or tags
    return mockPosts
      .filter((post) => post.id !== postId)
      .filter(
        (post) =>
          post.category.id === currentPost.category.id ||
          post.tags.some((tag) =>
            currentPost.tags.some((ct) => ct.id === tag.id)
          )
      )
      .slice(0, limit);
  },

  // Get all categories
  async getCategories(): Promise<Category[]> {
    await delay(100);
    return mockCategories;
  },

  // Get all tags
  async getTags(): Promise<Tag[]> {
    await delay(100);
    return mockTags;
  },

  // Search posts
  async searchPosts(query: string): Promise<BlogPost[]> {
    await delay(300);
    const lowerQuery = query.toLowerCase();
    return mockPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowerQuery) ||
        post.excerpt.toLowerCase().includes(lowerQuery) ||
        post.tags.some((tag) => tag.name.toLowerCase().includes(lowerQuery))
    );
  },

  // Get all published slugs for generateStaticParams
  async getPublishedSlugs(): Promise<string[]> {
    const result = await apiFetch<PaginatedResponse<BlogPost>>('/blog', { limit: 200 });
    if (result?.data?.length) return result.data.map((p) => p.slug);
    return mockPosts.map((p) => p.slug);
  },
};
