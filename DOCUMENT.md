# DOCUMENT.md — Aman Dev Blog: Technical Reference Guide

> This document is the official technical onboarding and reference guide for the `amandevlog` project. It is derived entirely from the actual codebase and intentionally contains no invented or assumed content.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Prerequisites](#2-prerequisites)
3. [Getting Started](#3-getting-started)
4. [Project Structure](#4-project-structure)
5. [Architecture & Design Patterns](#5-architecture--design-patterns)
6. [Component Documentation](#6-component-documentation)
7. [API Layer](#7-api-layer)
8. [State Management](#8-state-management)
9. [Styling Guide](#9-styling-guide)
10. [Form & Validation Patterns](#10-form--validation-patterns)
11. [Environment Configuration](#11-environment-configuration)
12. [Linting & Code Quality](#12-linting--code-quality)
13. [Deployment](#13-deployment)
14. [Gotchas & Known Considerations](#14-gotchas--known-considerations)

---

## 1. Project Overview

**Project name:** `amandevlog` (Aman Dev Blog)  
**Live URL:** `https://amandevlog.com`  
**Version:** `0.1.0`

This is the personal portfolio and developer blog of **Aman Mishra**, a Frontend Engineer with 3.9+ years of experience building scalable web applications with React, Angular, and TypeScript.

### What the application does

The site serves as a professional presence combining four content areas:

| Section | Purpose |
|---|---|
| **Home** | Hero introduction, recent blog posts, featured projects, newsletter sign-up |
| **Blog** | Technical articles with category/tag filtering, search, and pagination |
| **Projects** | Portfolio showcase with technology filtering and detailed project pages |
| **About** | Professional timeline — experience, education, certifications, and skills |
| **Contact** | Contact form with Zod-validated inputs and service offerings |

### Target users

- Potential employers and collaborators visiting the portfolio
- Developers reading technical blog content on React, TypeScript, Next.js, and performance

---

## 2. Prerequisites

### Node.js

The project uses React 19 and Next.js 16. The minimum supported Node.js version is **Node.js 18.18.0** (required by Next.js 16 / `eslint-config-next 16.1.1`). Node.js 20 LTS or higher is recommended.

```bash
node --version  # should be >= 18.18.0
```

### Package manager

The project uses **npm**. A `package-lock.json` is present at the root — use npm to maintain lockfile consistency.

```bash
npm --version
```

### Environment variables

No `.env` file is committed to the repository. The only environment variable consumed by the codebase is:

| Variable | Description | Required |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL for the Axios API client. Falls back to `"/api"` when absent. | Optional |

Because all data is currently served from in-memory mock arrays (see [Section 7](#7-api-layer)), the application runs fully without any environment variables set.

---

## 3. Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd aman-dev-blog
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The Next.js development server with Turbopack starts on **http://localhost:3000**.

---

### Available scripts

All scripts are defined in `package.json`:

| Script | Command | Description |
|---|---|---|
| `dev` | `next dev` | Starts the Next.js development server with Turbopack enabled by default in Next.js 16. |
| `build` | `next build` | Compiles and optimizes the production build. Runs type-checking and linting as part of the build. |
| `start` | `next start` | Starts the production HTTP server. Requires a successful `build` run first. |
| `lint` | `eslint` | Runs ESLint across all `.ts`, `.tsx`, `.js`, and `.mjs` files using the project's flat config. |

---

## 4. Project Structure

```
aman-dev-blog/
├── eslint.config.mjs          # ESLint flat config (Next.js core-web-vitals + TypeScript rules)
├── next.config.ts             # Next.js configuration (image remote patterns)
├── package.json               # Dependencies and npm scripts
├── package-lock.json          # npm lockfile
├── postcss.config.mjs         # PostCSS config — loads @tailwindcss/postcss plugin
├── tsconfig.json              # TypeScript configuration (strict mode, path alias @/→src/)
│
└── src/
    ├── app/                   # Next.js App Router root
    │   ├── globals.css        # Global CSS — Tailwind v4 import, @theme tokens, CSS variables
    │   ├── layout.tsx         # Root layout — fonts, metadata, Header, Footer, providers
    │   ├── page.tsx           # Home page (Server Component)
    │   ├── error.tsx          # Global error boundary (Client Component)
    │   ├── not-found.tsx      # Global 404 page (Server Component)
    │   ├── loading.tsx        # Global loading UI
    │   ├── robots.ts          # Next.js robots.txt generator
    │   ├── sitemap.ts         # Next.js XML sitemap generator
    │   │
    │   ├── about/
    │   │   └── page.tsx       # About page — experience, education, skills (Server Component)
    │   │
    │   ├── blog/
    │   │   ├── page.tsx       # Blog listing shell — injects SEO metadata, wraps client in Suspense
    │   │   ├── page-client.tsx # Blog listing client — search, filters, pagination (Client Component)
    │   │   ├── [slug]/
    │   │   │   └── page.tsx   # Individual blog post page — dynamic metadata, JSON-LD schema
    │   │   └── category/
    │   │       └── [category]/
    │   │           └── page.tsx # Category-filtered blog listing
    │   │
    │   ├── contact/
    │   │   ├── page.tsx       # Contact page shell (Server Component)
    │   │   └── page-client.tsx # Contact form + info (Client Component)
    │   │
    │   └── projects/
    │       ├── page.tsx       # Projects listing shell
    │       ├── page-client.tsx # Projects grid + filters (Client Component)
    │       └── [slug]/
    │           └── page.tsx   # Individual project detail page
    │
    ├── components/
    │   ├── blog/              # Blog-specific components
    │   │   ├── index.ts       # Barrel re-exports
    │   │   ├── post-card.tsx  # Blog post card (listing view)
    │   │   ├── post-content.tsx # Renders HTML post content via dangerouslySetInnerHTML
    │   │   ├── post-grid.tsx  # Responsive grid wrapper for PostCards
    │   │   ├── post-header.tsx # Post title, author, date, tags
    │   │   ├── reading-progress.tsx # Fixed top reading progress bar (scroll-driven)
    │   │   └── related-posts.tsx    # Related posts section at end of post
    │   │
    │   ├── layout/            # Site-wide structural components
    │   │   ├── index.ts
    │   │   ├── header.tsx     # Sticky header — nav links, theme toggle, mobile menu
    │   │   └── footer.tsx     # Site footer — brand, quick links, resources
    │   │
    │   ├── projects/          # Project-specific components
    │   │   ├── index.ts
    │   │   ├── project-card.tsx   # Project card (listing view)
    │   │   ├── project-detail.tsx # Full project detail layout
    │   │   └── project-grid.tsx   # Responsive grid wrapper for ProjectCards
    │   │
    │   ├── providers/         # React context providers
    │   │   ├── index.ts
    │   │   ├── query-provider.tsx  # TanStack React Query client and DevTools
    │   │   └── theme-provider.tsx  # Custom dark/light/system theme provider
    │   │
    │   ├── shared/            # Cross-feature reusable components
    │   │   ├── index.ts
    │   │   ├── filter-bar.tsx      # Button-group filter UI
    │   │   ├── newsletter-form.tsx # Email subscription form
    │   │   ├── pagination.tsx      # Page-number pagination with ellipsis
    │   │   ├── search-bar.tsx      # Controlled/uncontrolled search input
    │   │   └── social-share.tsx    # Twitter, LinkedIn, Facebook, copy-link share buttons
    │   │
    │   └── ui/                # Low-level design-system primitives
    │       ├── index.ts
    │       ├── avatar.tsx
    │       ├── badge.tsx          # CVA-based pill badge
    │       ├── button.tsx         # CVA-based button with Radix Slot support
    │       ├── card.tsx           # Card + CardHeader/Title/Description/Content/Footer
    │       ├── dialog.tsx         # Radix Dialog wrapper
    │       ├── dropdown-menu.tsx  # Radix DropdownMenu wrapper
    │       ├── input.tsx          # Styled HTML <input>
    │       ├── skeleton.tsx       # Animated loading skeleton
    │       ├── tabs.tsx           # Radix Tabs wrapper
    │       ├── textarea.tsx       # Styled HTML <textarea>
    │       └── tooltip.tsx        # Radix Tooltip wrapper
    │
    ├── config/
    │   ├── site.ts            # siteConfig, authorConfig, socialLinks, mainNavItems, footerNavItems
    │   └── navigation.ts      # navigationConfig (with nested children), blogCategories
    │
    ├── lib/
    │   ├── api/
    │   │   ├── index.ts       # Barrel: apiClient, blogApi, projectsApi
    │   │   ├── client.ts      # Configured Axios instance with request/response interceptors
    │   │   ├── blog.ts        # All blog API functions + in-memory mock data
    │   │   └── projects.ts    # All project API functions + in-memory mock data
    │   │
    │   ├── hooks/
    │   │   ├── index.ts       # Barrel re-exports
    │   │   ├── use-blog-posts.ts  # React Query hooks for blog data
    │   │   ├── use-projects.ts    # React Query hooks for project data
    │   │   ├── use-search.ts      # URL-synced search state with debouncing
    │   │   └── use-debounce.ts    # Generic debounced callback hook
    │   │
    │   └── utils/
    │       ├── index.ts       # Barrel re-exports
    │       ├── cn.ts          # cn() — clsx + tailwind-merge class merger
    │       ├── date.ts        # formatDate, formatRelativeTime, formatDateRange
    │       ├── reading-time.ts # calculateReadingTime, formatReadingTime, getReadingTime
    │       └── seo.ts         # generateSEOMetadata, generateWebsiteSchema, generatePersonSchema, generateArticleSchema
    │
    └── types/
        └── index.ts           # All shared TypeScript interfaces and types
```

### App Router conventions used

| File | Convention | Purpose |
|---|---|---|
| `layout.tsx` | Root layout segment | Wraps every page with `<html>`, fonts, providers, header, footer |
| `page.tsx` | Page component | Defines the UI for a route segment |
| `loading.tsx` | Loading UI | Automatic Suspense boundary for route transitions |
| `error.tsx` | Error boundary | Catches runtime errors with a recover/retry UI |
| `not-found.tsx` | Not found UI | Rendered when `notFound()` is called or route does not match |
| `robots.ts` | Metadata route | Generates `/robots.txt` |
| `sitemap.ts` | Metadata route | Generates `/sitemap.xml` |

There are **no `route.ts` API route handlers** in this project. All data fetching is handled through in-memory mock functions.

---

## 5. Architecture & Design Patterns

### Overall approach

The project uses a **feature-adjacent folder structure** with a shared component library. Pages own their data-fetching concerns (either as Server Components or via React Query hooks in Client Components). There is a clear separation between:

- **Data layer** — `src/lib/api/` (Axios client + mock functions)
- **State layer** — `src/lib/hooks/` (React Query hooks wrap all API calls)
- **UI layer** — `src/components/` (decomposed into `ui/`, `shared/`, feature-specific)
- **Configuration** — `src/config/` (site metadata, navigation, author info)
- **Types** — `src/types/index.ts` (single source of truth for all shared interfaces)

### Server vs. Client Components

- Pages that only need data at render time are **Server Components** (e.g., `app/page.tsx`, `app/about/page.tsx`, `app/blog/[slug]/page.tsx`). They call API functions directly with `await`.
- Pages that require interactivity (search, filters, pagination) are split: a thin Server Component shell handles metadata and Suspense, while a `page-client.tsx` **Client Component** handles the interactive state.

### Component composition with Radix UI

Radix UI primitives (`Dialog`, `DropdownMenu`, `Tooltip`, `Tabs`, `Switch`, `Select`, `NavigationMenu`, `Slot`) are wrapped in thin component files under `src/components/ui/`. This keeps the Radix API surface controlled and styled consistently. The `Slot` primitive from `@radix-ui/react-slot` is used in `Button` to support the `asChild` prop pattern, enabling any element (e.g., `<Link>`) to receive button styling.

```tsx
// asChild usage — renders an <a> with button styles, not a <button>
<Button asChild>
  <Link href="/blog">Read My Blog</Link>
</Button>
```

### Styling pattern

Styling follows a three-layer approach:

1. **Tailwind CSS v4 utility classes** — applied inline on JSX elements.
2. **CVA (class-variance-authority)** — defines typed variant maps for components that have multiple visual states (e.g., `Button`, `Badge`).
3. **`cn()` helper** — merges conditional class strings and resolves Tailwind conflicts at the call-site.

### Form pattern

All forms use **React Hook Form** with a **Zod schema** passed to `zodResolver`. This keeps validation logic co-located with the schema definition and out of the component render cycle.

### Data fetching pattern

- **Server Components** call the API functions from `src/lib/api/` directly (no React Query required).
- **Client Components** use custom React Query hooks from `src/lib/hooks/`. Each hook wraps a `useQuery` call, sets a `staleTime`, and optionally guards execution with `enabled`.

### Custom hooks

| Hook | Location | Purpose | Returns |
|---|---|---|---|
| `useBlogPosts(filters?)` | `lib/hooks/use-blog-posts.ts` | Fetches paginated blog posts with optional filters | `UseQueryResult<PaginatedResponse<BlogPost>>` |
| `useBlogPost(slug)` | `lib/hooks/use-blog-posts.ts` | Fetches a single blog post by slug | `UseQueryResult<BlogPost \| null>` |
| `useFeaturedPosts(limit?)` | `lib/hooks/use-blog-posts.ts` | Fetches featured posts (default: 3) | `UseQueryResult<BlogPost[]>` |
| `useRecentPosts(limit?)` | `lib/hooks/use-blog-posts.ts` | Fetches most recent posts (default: 5) | `UseQueryResult<BlogPost[]>` |
| `useRelatedPosts(postId, limit?)` | `lib/hooks/use-blog-posts.ts` | Fetches related posts for a given post | `UseQueryResult<BlogPost[]>` |
| `useBlogCategories()` | `lib/hooks/use-blog-posts.ts` | Fetches all blog categories | `UseQueryResult<Category[]>` |
| `useBlogTags()` | `lib/hooks/use-blog-posts.ts` | Fetches all blog tags | `UseQueryResult<Tag[]>` |
| `useSearchPosts(query)` | `lib/hooks/use-blog-posts.ts` | Searches posts — only fires when `query.length >= 2` | `UseQueryResult<BlogPost[]>` |
| `useProjects(filters?)` | `lib/hooks/use-projects.ts` | Fetches projects with optional filters | `UseQueryResult<Project[]>` |
| `useProject(slug)` | `lib/hooks/use-projects.ts` | Fetches a single project by slug | `UseQueryResult<Project \| null>` |
| `useFeaturedProjects(limit?)` | `lib/hooks/use-projects.ts` | Fetches featured projects (default: 3) | `UseQueryResult<Project[]>` |
| `useProjectTechnologies()` | `lib/hooks/use-projects.ts` | Fetches all unique technology strings | `UseQueryResult<string[]>` |
| `useProjectsByTechnology(tech)` | `lib/hooks/use-projects.ts` | Fetches projects filtered by technology | `UseQueryResult<Project[]>` |
| `useSearch(options?)` | `lib/hooks/use-search.ts` | URL-synchronized search state with debouncing | `{ query, isSearching, handleSearch, clearSearch }` |
| `useDebouncedCallback(fn, delay)` | `lib/hooks/use-debounce.ts` | Returns a debounced version of any callback | `(...args) => void` |

---

## 6. Component Documentation

### UI primitives (`src/components/ui/`)

---

#### `Button`

**Purpose:** The primary interactive element. Supports six visual variants and five sizes. Uses the Radix `Slot` primitive for the `asChild` pattern.

**Props:**

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `variant` | `"default" \| "destructive" \| "outline" \| "secondary" \| "ghost" \| "link"` | No | `"default"` | Visual style |
| `size` | `"default" \| "sm" \| "lg" \| "xl" \| "icon"` | No | `"default"` | Size preset |
| `asChild` | `boolean` | No | `false` | When `true`, merges props onto the child element instead of rendering a `<button>` |
| `...rest` | `React.ButtonHTMLAttributes<HTMLButtonElement>` | No | — | All standard button attributes |

**Usage:**

```tsx
import { Button } from '@/components/ui';

// Standard button
<Button variant="outline" size="lg" onClick={handleClick}>
  Click me
</Button>

// Rendered as a Next.js Link
<Button asChild>
  <Link href="/about">About Me</Link>
</Button>

// Icon-only button
<Button variant="ghost" size="icon" aria-label="Toggle theme">
  <Moon className="h-5 w-5" />
</Button>
```

---

#### `Badge`

**Purpose:** Inline label/tag for status, categories, and metadata. Six variants, three sizes.

**Props:**

| Prop | Type | Required | Default |
|---|---|---|---|
| `variant` | `"default" \| "secondary" \| "success" \| "warning" \| "error" \| "outline"` | No | `"default"` |
| `size` | `"default" \| "sm" \| "lg"` | No | `"default"` |
| `...rest` | `React.HTMLAttributes<HTMLDivElement>` | No | — |

**Usage:**

```tsx
<Badge variant="secondary">TypeScript</Badge>
<Badge variant="success" size="sm">Live</Badge>
```

---

#### `Card` / `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` / `CardFooter`

**Purpose:** Composable card container components. All accept standard `div` / `h3` / `p` HTML attributes plus an optional `className` for overrides.

**Usage:**

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui';

<Card>
  <CardHeader>
    <CardTitle>Post Title</CardTitle>
    <CardDescription>A short summary of the content.</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Main content goes here.</p>
  </CardContent>
</Card>
```

---

#### `Input`

**Purpose:** Styled `<input>` element. Forwards all native input props.

**Props:** `React.InputHTMLAttributes<HTMLInputElement>` plus optional `className`.

**Usage:**

```tsx
<Input type="email" placeholder="Enter your email" />
```

---

#### `Skeleton`

**Purpose:** Animated pulse placeholder for loading states.

**Props:** `React.HTMLAttributes<HTMLDivElement>` plus `className` for sizing.

**Usage:**

```tsx
<Skeleton className="h-10 w-48" />   // heading placeholder
<Skeleton className="aspect-[16/9]" /> // image placeholder
```

---

### Blog components (`src/components/blog/`)

---

#### `PostCard`

**Purpose:** Renders a blog post as a card in listing/grid views. Supports a `featured` layout variant that spans two columns and shows a larger image.

**Props:**

| Prop | Type | Required | Default |
|---|---|---|---|
| `post` | `BlogPost` | Yes | — |
| `featured` | `boolean` | No | `false` |

**Usage:**

```tsx
<PostCard post={post} />
<PostCard post={featuredPost} featured />
```

---

#### `PostContent`

**Purpose:** Renders the HTML body of a blog post with Tailwind Typography (prose) styling. Uses `dangerouslySetInnerHTML` — content must be trusted/sanitized before passing.

**Props:**

| Prop | Type | Required |
|---|---|---|
| `content` | `string` (HTML) | Yes |

---

#### `PostHeader`

**Purpose:** Displays post title, category badge, author info, publication date, and tags at the top of a blog post page.

**Props:**

| Prop | Type | Required |
|---|---|---|
| `post` | `BlogPost` | Yes |

---

#### `ReadingProgress`

**Purpose:** Fixed horizontal progress bar at the top of the viewport that tracks scroll depth. No props. Self-contained with its own scroll event listener.

---

#### `RelatedPosts`

**Purpose:** Displays a row of related post cards at the bottom of a blog post page.

**Props:**

| Prop | Type | Required |
|---|---|---|
| `posts` | `BlogPost[]` | Yes |

---

### Project components (`src/components/projects/`)

---

#### `ProjectCard`

**Purpose:** Renders a project as a card. Mirrors `PostCard` in structure and supports the same `featured` two-column layout. Shows year, category, technologies, and optional live/GitHub links.

**Props:**

| Prop | Type | Required | Default |
|---|---|---|---|
| `project` | `Project` | Yes | — |
| `featured` | `boolean` | No | `false` |

---

### Shared components (`src/components/shared/`)

---

#### `FilterBar`

**Purpose:** Renders a row of toggle buttons for category/tag filtering. Active filter is highlighted with the primary teal style.

**Props:**

| Prop | Type | Required |
|---|---|---|
| `filters` | `{ label: string; value: string }[]` | Yes |
| `activeFilter` | `string` | Yes |
| `onFilterChange` | `(value: string) => void` | Yes |
| `className` | `string` | No |

---

#### `SearchBar`

**Purpose:** Controlled-or-uncontrolled search input with a clear button. Supports both controlled (`value` + `onChange`) and internal state modes.

**Props:**

| Prop | Type | Required | Default |
|---|---|---|---|
| `placeholder` | `string` | No | `"Search..."` |
| `value` | `string` | No | — |
| `onChange` | `(value: string) => void` | No | — |
| `onSearch` | `(value: string) => void` | No | — |
| `className` | `string` | No | — |

---

#### `NewsletterForm`

**Purpose:** Email subscription form with loading, success, and error states. Submission is currently simulated (see [Section 14](#14-gotchas--known-considerations)).

**Props:**

| Prop | Type | Required | Default |
|---|---|---|---|
| `className` | `string` | No | — |
| `variant` | `"default" \| "inline"` | No | `"default"` |

---

#### `Pagination`

**Purpose:** Page-number navigation with smart ellipsis for large page counts. Renders nothing when `totalPages <= 1`.

**Props:**

| Prop | Type | Required |
|---|---|---|
| `currentPage` | `number` | Yes |
| `totalPages` | `number` | Yes |
| `onPageChange` | `(page: number) => void` | Yes |
| `className` | `string` | No |

---

#### `SocialShare`

**Purpose:** Share buttons for Twitter, LinkedIn, Facebook, and clipboard copy. Uses Radix Tooltip to label each button.

**Props:**

| Prop | Type | Required |
|---|---|---|
| `url` | `string` | Yes |
| `title` | `string` | Yes |
| `description` | `string` | No |

---

### Providers (`src/components/providers/`)

---

#### `QueryProvider`

**Purpose:** Wraps the app in `QueryClientProvider` with a configured `QueryClient` instance. Also mounts `ReactQueryDevtools` (collapsed by default).

**Props:**

| Prop | Type | Required |
|---|---|---|
| `children` | `ReactNode` | Yes |

---

#### `ThemeProvider`

**Purpose:** Custom dark/light/system theme context. Persists theme to `localStorage` under the key `amandevlog-theme`. Uses `useSyncExternalStore` for hydration-safe initial render. Exposes `useTheme()` hook.

**Props:**

| Prop | Type | Required | Default |
|---|---|---|---|
| `children` | `ReactNode` | Yes | — |
| `defaultTheme` | `"light" \| "dark" \| "system"` | No | `"system"` |
| `storageKey` | `string` | No | `"amandevlog-theme"` |

**`useTheme()` returns:**

| Key | Type | Description |
|---|---|---|
| `theme` | `"light" \| "dark" \| "system"` | Currently selected preference |
| `resolvedTheme` | `"light" \| "dark"` | Actual applied theme after resolving `"system"` |
| `setTheme` | `(theme: Theme) => void` | Sets theme explicitly |
| `toggleTheme` | `() => void` | Cycles between `"light"` and `"dark"` |

---

### Layout components (`src/components/layout/`)

---

#### `Header`

**Purpose:** Sticky site header. Renders brand logo, desktop navigation links (from `mainNavItems`), GitHub/LinkedIn icon links, a theme toggle button, and a mobile hamburger menu.

Actively highlights the current route using `usePathname()`. No props.

---

#### `Footer`

**Purpose:** Site footer with brand blurb, social links, quick navigation links (from `footerNavItems.main`), and resource links (from `footerNavItems.resources`). No props.

---

## 7. API Layer

### No API route handlers

There are **no `route.ts` files** in this project. The Next.js API route layer is not implemented. All data is served from **in-memory mock arrays** defined in `src/lib/api/blog.ts` and `src/lib/api/projects.ts`.

### Axios client (`src/lib/api/client.ts`)

An Axios instance is configured and exported as `apiClient`. It is ready for future use against a real backend.

**Configuration:**

| Setting | Value |
|---|---|
| `baseURL` | `process.env.NEXT_PUBLIC_API_URL \|\| "/api"` |
| `timeout` | `10000` ms |
| `Content-Type` | `application/json` |

**Request interceptor:** Reads `auth_token` from `localStorage` (client-side only) and attaches it as a `Bearer` token in `Authorization` header. Logs request method + URL in development.

**Response interceptor:** Logs response URL + status in development. Handles HTTP errors by status code:

- `401` — logs "Unauthorized access"
- `403` — logs "Forbidden"
- `404` — logs "Resource not found"
- `500` — logs "Server error"

### Blog API (`src/lib/api/blog.ts`)

All functions currently operate on in-memory mock data, not over HTTP.

| Function | Description | Parameters | Returns |
|---|---|---|---|
| `blogApi.getPosts(filters?)` | Returns paginated posts, supports filtering by category/tag/search and sorting | `BlogFilters` | `Promise<PaginatedResponse<BlogPost>>` |
| `blogApi.getPost(slug)` | Finds a single post by slug | `string` | `Promise<BlogPost \| null>` |
| `blogApi.getFeaturedPosts(limit?)` | Returns featured posts | `number` (default 3) | `Promise<BlogPost[]>` |
| `blogApi.getRecentPosts(limit?)` | Returns most recently published posts | `number` (default 5) | `Promise<BlogPost[]>` |
| `blogApi.getRelatedPosts(postId, limit?)` | Returns posts in the same category, excluding the source post | `string, number` | `Promise<BlogPost[]>` |
| `blogApi.getCategories()` | Returns all categories | — | `Promise<Category[]>` |
| `blogApi.getTags()` | Returns all tags | — | `Promise<Tag[]>` |
| `blogApi.searchPosts(query)` | Full-text search on title + excerpt + content | `string` | `Promise<BlogPost[]>` |

### Projects API (`src/lib/api/projects.ts`)

| Function | Description | Parameters | Returns |
|---|---|---|---|
| `projectsApi.getProjects(filters?)` | Returns all projects, optionally filtered | `ProjectFilters` | `Promise<Project[]>` |
| `projectsApi.getProject(slug)` | Finds a single project by slug | `string` | `Promise<Project \| null>` |
| `projectsApi.getFeaturedProjects(limit?)` | Returns featured projects | `number` (default 3) | `Promise<Project[]>` |
| `projectsApi.getTechnologies()` | Returns unique technology strings across all projects | — | `Promise<string[]>` |
| `projectsApi.getProjectsByTechnology(tech)` | Returns projects using a given technology | `string` | `Promise<Project[]>` |

### React Query wiring

React Query hooks in `src/lib/hooks/` wrap every API function. Query keys follow a consistent pattern:

| Data | Query Key |
|---|---|
| Blog posts (with filters) | `["blog-posts", filters]` |
| Single blog post | `["blog-post", slug]` |
| Featured posts | `["featured-posts", limit]` |
| Recent posts | `["recent-posts", limit]` |
| Related posts | `["related-posts", postId, limit]` |
| Blog categories | `["blog-categories"]` |
| Blog tags | `["blog-tags"]` |
| Search results | `["search-posts", query]` |
| Projects (with filters) | `["projects", filters]` |
| Single project | `["project", slug]` |
| Featured projects | `["featured-projects", limit]` |
| Technologies list | `["project-technologies"]` |
| Projects by technology | `["projects-by-tech", technology]` |

Individual `staleTime` overrides per hook (all others use the 5-minute global default):

| Hook | `staleTime` |
|---|---|
| `useBlogCategories`, `useBlogTags`, `useProjectTechnologies` | 30 minutes |
| `useSearchPosts` | 1 minute |

---

## 8. State Management

### Philosophy

There is **no global client-side state library** (no Redux, Zustand, or similar). State is managed at two levels:

1. **Server state** — owned by TanStack React Query (cached, deduplicated, stale-time controlled).
2. **Local UI state** — `useState` and `useReducer` inside individual components (e.g., mobile menu open/close, form submission status, search input value).

### React Query client configuration

The `QueryClient` is instantiated inside `QueryProvider` with `useState` to ensure a single stable instance per browser session. Global defaults:

```ts
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,        // 5 minutes — data is considered fresh
      gcTime: 10 * 60 * 1000,           // 10 minutes — inactive queries are garbage collected
      retry: 1,                          // one automatic retry on failure
      refetchOnWindowFocus: false,       // no automatic refetch when tab is focused
    },
  },
})
```

### Theme state

Theme (`"light" | "dark" | "system"`) is managed by the custom `ThemeProvider` context. It persists to `localStorage` and reads the OS preference via `window.matchMedia` when set to `"system"`. Accessed anywhere via the `useTheme()` hook.

### URL as state

The `useSearch` hook treats the URL's `?search=` query parameter as the source of truth for the current search query. It syncs `useState` with the URL using `useRouter().push()` and `useSearchParams()`, debouncing writes to the URL by 300 ms.

---

## 9. Styling Guide

### Tailwind CSS v4 setup

Tailwind v4 uses a PostCSS-first setup. There is **no `tailwind.config.js`** file. Configuration is done entirely in CSS and via the PostCSS plugin.

**`postcss.config.mjs`:**

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

**`globals.css`** begins with:

```css
@import "tailwindcss";
```

This replaces the v3 `@tailwind base; @tailwind components; @tailwind utilities;` directives.

### `@theme` design tokens

Custom design tokens are defined in a `@theme {}` block in `globals.css`. These become available as Tailwind utilities.

```css
@theme {
  /* Typography */
  --font-sans: 'Inter', ui-sans-serif, ...;
  --font-serif: 'Merriweather', ui-serif, ...;
  --font-mono: 'JetBrains Mono', ui-monospace, ...;

  /* Brand color palette (teal-based) */
  --color-brand-50:  #f0fdfa;
  --color-brand-100: #ccfbf1;
  --color-brand-200: #99f6e4;
  --color-brand-300: #5eead4;
  --color-brand-400: #2dd4bf;
  --color-brand-500: #14b8a6;
  --color-brand-600: #0d9488;   /* primary action color */
  --color-brand-700: #0f766e;
  --color-brand-800: #115e59;
  --color-brand-900: #134e4a;
  --color-brand-950: #042f2e;
}
```

### CSS custom properties (`:root` / `.dark`)

HSL-based semantic variables are defined for light and dark mode. They are used indirectly through Tailwind utilities rather than referenced manually in component code:

| Variable | Light | Dark |
|---|---|---|
| `--background` | `0 0% 100%` (white) | `222.2 84% 4.9%` (near-black) |
| `--foreground` | `222.2 84% 4.9%` | `210 40% 98%` |
| `--primary` | `166 72% 28%` (teal) | `166 72% 50%` |
| `--ring` | `166 72% 28%` | `166 72% 50%` |
| `--radius` | `0.75rem` | — |

### `cn()` utility

**Location:** `src/lib/utils/cn.ts`

```ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

`clsx` handles conditional and array class expressions. `twMerge` resolves Tailwind class conflicts (e.g., `p-4 p-6` → `p-6`). Use `cn()` whenever class names are dynamic or merged from multiple sources.

```tsx
// Example from PostCard
<Card className={cn(
  'group overflow-hidden transition-all duration-300',
  isActive && 'ring-2 ring-teal-500'
)} />
```

### CVA (class-variance-authority) pattern

CVA is used to define **typed variant maps** on components. The pattern:

1. Call `cva(baseClasses, { variants: { ... }, defaultVariants: { ... } })` to create a variant function.
2. The component accepts typed `variant` and `size` props.
3. Call the variant function, spread into `cn()` with any runtime overrides.

```tsx
// Excerpt from button.tsx
const buttonVariants = cva(
  'inline-flex items-center justify-center ... transition-all duration-200',
  {
    variants: {
      variant: {
        default:     'bg-teal-600 text-white ...',
        destructive: 'bg-red-500 text-white ...',
        outline:     'border-2 border-teal-600 ...',
        secondary:   'bg-gray-100 text-gray-900 ...',
        ghost:       'text-gray-700 hover:bg-gray-100 ...',
        link:        'text-teal-600 underline-offset-4 ...',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm:      'h-8 rounded-md px-3 text-xs',
        lg:      'h-12 rounded-lg px-8 text-base',
        xl:      'h-14 rounded-xl px-10 text-lg',
        icon:    'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

// In the component
<Comp className={cn(buttonVariants({ variant, size, className }))} />
```

### Font loading

Two Google Fonts are loaded via `next/font/google` in `src/app/layout.tsx` and injected as CSS variables:

| Font | Variable | Usage |
|---|---|---|
| Inter | `--font-sans` | Body / UI text |
| Merriweather | `--font-serif` | Long-form reading content |

---

## 10. Form & Validation Patterns

### Standard pattern

All forms use the same three-part setup:

1. **Zod schema** — defines the shape and validation rules.
2. **`zodResolver`** — bridges Zod into React Hook Form.
3. **`useForm`** — provides `register`, `handleSubmit`, `formState`, and `reset`.

### Contact form example

**Location:** `src/app/contact/page-client.tsx`

**Schema:**

```ts
import { z } from 'zod';

const contactSchema = z.object({
  name:    z.string().min(2, 'Name must be at least 2 characters'),
  email:   z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;
```

**Hook setup:**

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting },
  reset,
} = useForm<ContactFormData>({
  resolver: zodResolver(contactSchema),
});
```

**Submission handler:**

```tsx
const onSubmit = async (data: ContactFormData) => {
  // Simulated async submission
  await new Promise((resolve) => setTimeout(resolve, 1500));
  setIsSubmitted(true);
  reset();
  setTimeout(() => setIsSubmitted(false), 5000);
};
```

**Field registration and error display:**

```tsx
<Input {...register('name')} placeholder="Your name" />
{errors.name && (
  <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
)}
```

---

## 11. Environment Configuration

No `.env` file is present in the repository. The application runs without any environment variables configured because all backend calls use mock data.

| Variable | Description | Required | Example |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL for the Axios HTTP client. When omitted, defaults to `"/api"` (relative to the host). Set this when connecting to a real backend. | Optional | `https://api.amandevlog.com` |

To configure, create a `.env.local` file at the project root:

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://api.amandevlog.com
```

---

## 12. Linting & Code Quality

### ESLint configuration

**File:** `eslint.config.mjs`  
**Format:** ESLint flat config (ESLint v9 style)

```js
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,   // Next.js recommended rules + Core Web Vitals enforcement
  ...nextTs,       // TypeScript-aware rules via @typescript-eslint
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
```

The two rule sets applied:

| Rule set | What it enforces |
|---|---|
| `eslint-config-next/core-web-vitals` | Next.js best practices: `@next/next/no-html-link-for-pages`, image/font rules, and Core Web Vitals-impacting patterns |
| `eslint-config-next/typescript` | TypeScript-specific rules via `@typescript-eslint/eslint-plugin` |

### TypeScript configuration

**File:** `tsconfig.json`

| Setting | Value | Effect |
|---|---|---|
| `strict` | `true` | Enables all strict type-checking flags (no implicit `any`, strict null checks, etc.) |
| `target` | `"ES2017"` | Compiles to modern JS — async/await, object spread, etc. |
| `moduleResolution` | `"bundler"` | Resolves modules as a bundler would (supports package.json `exports`) |
| `paths` | `"@/*": ["./src/*"]` | Enables `@/` absolute imports throughout the project |
| `noEmit` | `true` | TypeScript is used for type-checking only; Next.js handles transpilation |
| `incremental` | `true` | Speeds up subsequent type checks via `.tsbuildinfo` cache |

---

## 13. Deployment

### Recommended platform: Vercel

No deployment configuration files (`vercel.json`, `Dockerfile`, `.github/workflows/`) are present in the repository. The natural deployment target for a Next.js 16 application is **Vercel**, which provides zero-configuration deployment.

**Steps:**

1. Push the repository to GitHub/GitLab/Bitbucket.
2. Import the project on [vercel.com](https://vercel.com).
3. Set environment variables in the Vercel dashboard (see [Section 11](#11-environment-configuration)).
4. Vercel auto-detects Next.js and runs `next build` on every push to the main branch.

### Self-hosted Node.js server

```bash
npm run build     # Compile production build
npm run start     # Start production server on port 3000
```

Set `PORT` environment variable to change the listening port:

```bash
PORT=8080 npm run start
```

### Build-time environment variable requirements

Only `NEXT_PUBLIC_API_URL` is consumed by the build. Because it has the `NEXT_PUBLIC_` prefix, it is inlined at build time. **If connecting to a real backend, this variable must be set before running `next build`.**

---

## 14. Gotchas & Known Considerations

### All data is mock — no real backend

`blogApi` and `projectsApi` operate entirely on hardcoded in-memory arrays. No HTTP requests are made for blog or project data. The Axios `apiClient` instance is configured but not called by any current API function. Replacing mock data with real API calls requires updating `blog.ts` and `projects.ts` to use `apiClient.get(...)`.

### Newsletter and contact forms do not submit

Both `NewsletterForm` and the contact form in `ContactPageClient` simulate submission with `setTimeout`. There is no server-side handler, email service, or database write. These must be wired to a real endpoint before going to production.

### Tailwind CSS v4 breaking changes from v3

This project uses Tailwind v4, which differs significantly from v3:

- **No `tailwind.config.js`** — all configuration is in CSS via `@theme {}` and `@import "tailwindcss"`.
- The gradient utility syntax changed: `bg-gradient-to-br` from v3 becomes `bg-linear-to-br` in v4 (as seen in `app/page.tsx`).
- The `@tailwindcss/postcss` package is required instead of `tailwindcss` being a PostCSS plugin directly.
- Do not attempt to migrate a Tailwind v3 config file into this project without consulting the [Tailwind v4 migration guide](https://tailwindcss.com/docs/upgrade-guide).

### Zod v4 API differences from v3

This project uses Zod `^4.3.2`. Zod v4 has breaking changes from v3:

- `.email()` no longer accepts a string message directly in all contexts — the schema in `page-client.tsx` correctly uses `.email('...')` which is supported, but be aware of other method signature changes if adding new schemas.
- `.nullish()`, `.optional()`, and `.nullable()` have slightly adjusted unwrapping behaviour in some edge cases.
- Refer to the [Zod v4 changelog](https://github.com/colinhacks/zod/releases) before adding complex schemas.

### React 19 compatibility

`react` and `react-dom` are pinned to `19.2.3`. React 19 introduces breaking changes:

- `forwardRef` is now unnecessary for most cases — components accept `ref` as a plain prop. The existing `forwardRef` usage in `Button`, `Card`, `Input`, and other UI primitives remains valid and will not break, but can be simplified over time.
- The `use()` hook (RSC-focused) is available but not currently used in this project.
- Some third-party libraries that haven't updated peer dependencies may emit compatibility warnings.

### `useSyncExternalStore` for theme hydration

The `ThemeProvider` uses `useSyncExternalStore` with a no-op subscription to obtain a hydration-safe `isMounted` flag. This prevents a flash of the wrong theme colour on SSR/hydration by deferring theme class application to the client. This is a deliberate pattern — do not replace it with `useEffect` + `useState` for mounting detection, as that approach can cause a hydration mismatch warning in React 19.

### `next/font` CSS variables require manual font-family mapping

The `Inter` and `Merriweather` fonts are loaded and exposed as `--font-sans` and `--font-serif` CSS variables. These are consumed by the `@theme {}` block in `globals.css`. If you add a new Google Font, you must:

1. Add the `next/font/google` import in `layout.tsx` with the correct `variable` option.
2. Reference the variable in `globals.css` inside `@theme {}`.

### `next.config.ts` restricts external image domains

`next/image` only allows images from:

```
https://images.unsplash.com
https://unsplash.com
```

Any external image URL from another domain will throw a runtime error in production. Add new hostnames to the `remotePatterns` array in `next.config.ts` as needed.

### `PostContent` uses `dangerouslySetInnerHTML`

Blog post content is stored and rendered as raw HTML. If this content ever comes from user input or an external CMS, it **must be sanitised** (e.g., via DOMPurify) before being passed to `PostContent` to prevent XSS vulnerabilities.
