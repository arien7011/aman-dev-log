# Plan: Full-Stack Admin Blog Editor

**What this builds:** A complete MongoDB-backed blog creation system with a TipTap rich-text editor, Cloudinary image uploads, admin access via a secret-token cookie, and public blog pages wired to the real database. All existing mock data will be replaced by real API calls, with a seed script to pre-populate the database from the mock posts.

**Additional packages required beyond the spec's list** (approved): `mongoose`, `isomorphic-dompurify`, `@tiptap/extension-underline`, `@tailwindcss/typography`.

Note: `multer` from the spec is **skipped** — it's incompatible with Next.js App Router. Native `Request.formData()` handles image uploads instead.

---

## Phase 1 — Infrastructure & Packages

1. Install packages:
   ```bash
   npm install mongoose isomorphic-dompurify @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-placeholder @tiptap/extension-underline slugify cloudinary
   npm install @tailwindcss/typography --save-dev
   ```
   Note: `multer` + `@types/multer` are dropped.

2. Create `.env.local` and `.env.example` with:
   - `MONGODB_URI`
   - `ADMIN_SECRET` (the hidden token)
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `NEXT_REVALIDATION_SECRET`

3. Update `next.config.ts` — add `res.cloudinary.com` to `images.remotePatterns`.

4. Update `postcss.config.mjs` — add `@tailwindcss/typography` plugin (also fixes the existing broken `prose` class in `post-content.tsx`).

---

## Phase 2 — Database & Models

5. Create `src/lib/db/mongoose.ts` — singleton connection using `global._mongooseConn` pattern (Next.js hot-reload safe). Reads `process.env.MONGODB_URI`.

6. Create `src/models/Blog.ts` — Mongoose schema with all required fields:
   - `title`, `slug` (unique), `content`, `excerpt`, `coverImage`
   - `author` (string — no User model needed for personal blog)
   - `status: 'draft' | 'published'`
   - `tags: string[]`
   - `readingTime` (auto-calculated)
   - `createdAt`, `updatedAt`

   Pre-save hooks:
   - Auto-generates `slug` from `title` via `slugify` with timestamp suffix for collision handling.
   - Calculates `readingTime` from `calculateReadingTime()` already in `src/lib/utils/reading-time.ts`.

7. Create `src/scripts/seed.ts` — seeds the 6 mock posts from `src/lib/api/blog.ts` into MongoDB. Run once with `npx tsx src/scripts/seed.ts`.

---

## Phase 3 — Auth (Secret-Token Cookie)

8. Create `src/lib/auth/admin.ts`:
   - `signAdminCookie(secret)`: `crypto.createHmac('sha256', secret).update('admin').digest('hex')` — deterministic HMAC from the secret. No JWT library needed.
   - `verifyAdminRequest(request: NextRequest)`: reads `admin-token` cookie, validates it matches the HMAC. Returns `boolean`.

9. Create `src/middleware.ts` — matches `/admin/:path*`. Calls `verifyAdminRequest()`. If invalid → returns `new NextResponse('Forbidden', { status: 403 })`. Does NOT redirect (admin URL is meant to be unknown to the public).

---

## Phase 4 — API Routes

10. Create `src/app/api/auth/admin/route.ts` (GET):
    - Validates `?token=` query param against `ADMIN_SECRET`
    - Sets `admin-token` httpOnly cookie (7-day expiry)
    - Redirects to `/admin/blog/manage`
    - This is the one-time "magic link" you visit to gain access.

11. Create `src/app/api/blog/route.ts`:
    - `GET` (public) — queries `{ status: 'published' }` with pagination. Params: `page`, `limit`, `category` (tag match), `search`, `sortBy`. Returns `PaginatedResponse<BlogPost>` matching existing type shape.
    - `POST` (admin-only, `verifyAdminRequest` guard) — receives `{ title, excerpt, coverImage, tags, status, content }`, creates Blog document, returns new post.

12. Create `src/app/api/blog/[slug]/route.ts`:
    - `GET` (public) — finds by `slug`, returns post or 404.
    - `PUT` (admin-only) — updates post, recalculates `readingTime` and `slug` if title changed.
    - `DELETE` (admin-only) — deletes by slug, returns `{ success: true }`.

13. Create `src/app/api/blog/admin/route.ts` (GET, admin-only):
    - Returns ALL posts regardless of status (for the manage page).
    - Supports `page`, `limit`, `status` filter.

14. Create `src/app/api/blog/upload-image/route.ts` (POST, admin-only):
    - Reads image from `await request.formData()`
    - Converts to Buffer
    - Uploads to Cloudinary via `cloudinary.v2.uploader.upload_stream`
    - Returns `{ url: secure_url }`

---

## Phase 5 — Types & Query Keys

15. Update `src/types/index.ts` — add (keep all existing types untouched):
    - `AdminBlogPost` (extends `BlogPost` with `status: 'draft' | 'published'`)
    - `BlogPostInput` (form/API payload type for create/update)

16. Create `src/lib/queryKeys.ts`:
    ```ts
    export const blogKeys = {
      all: ['blogs'] as const,
      list: (filters?: unknown) => ['blogs', 'list', filters] as const,
      detail: (slug: string) => ['blogs', slug] as const,
      admin: {
        all: ['blogs', 'admin'] as const,
        list: (filters?: unknown) => ['blogs', 'admin', 'list', filters] as const,
      },
    };
    ```

17. Create `src/lib/hooks/use-admin-blog.ts` — three `useMutation` hooks:
    - `useCreatePost` — POST `/api/blog`
    - `useUpdatePost` — PUT `/api/blog/[slug]`
    - `useDeletePost` — DELETE `/api/blog/[slug]`

    All use `apiClient` (Axios), read `admin-token` cookie from `document.cookie` and pass as header.
    All call `queryClient.invalidateQueries({ queryKey: blogKeys.admin.all })` on success.
    Inline success/error feedback uses the same `status`-state pattern as `newsletter-form.tsx`.

---

## Phase 6 — TipTap Editor Component

18. Create `src/components/blog/editor/editor-toolbar.tsx` — `'use client'`. Toolbar buttons using existing `<Button variant="ghost" size="icon">` wrapped in `<Tooltip>/<TooltipProvider>`. Buttons: H1, H2, H3, Bold, Italic, Underline, Strike, BulletList, OrderedList, Blockquote, CodeBlock, Image upload, Undo, Redo. Active state: `editor.isActive('bold')` etc → `bg-gray-100 dark:bg-gray-800` class.

19. Create `src/components/blog/editor/rich-text-editor.tsx` — `'use client'`.
    - Props: `{ value: string, onChange: (html: string) => void, onImageUpload?: () => void }`
    - Extensions: `StarterKit`, `Image.configure({ inline: false })`, `Placeholder.configure({ placeholder: 'Start writing your post...' })`, `Underline`
    - `onUpdate` → calls `onChange(editor.getHTML())`
    - Renders `<EditorToolbar>` + `<EditorContent>` inside a `<Card>` with `min-h-[400px]`
    - Prose styles: `className="prose prose-gray dark:prose-invert max-w-none"` on the editor content wrapper.

20. Create `src/components/blog/editor/index.ts` — barrel export.

---

## Phase 7 — Select Component (Missing)

21. Create `src/components/ui/select.tsx` — wrap `@radix-ui/react-select` (installed but no component file exists). Needed for the status dropdown in the editor. Export: `Select`, `SelectTrigger`, `SelectContent`, `SelectItem`, `SelectValue`, `SelectGroup`, `SelectLabel`.

22. Update `src/components/ui/index.ts` — add `export * from './select'`.

---

## Phase 8 — Admin Pages

23. Create `src/app/admin/layout.tsx` — **Server Component**:
    - Reads `cookies()` from `next/headers`, validates `admin-token` cookie.
    - Redirects to `/` on failure.
    - Renders minimal admin shell: dark sidebar with nav links (New Post → `/admin/blog`, Manage Posts → `/admin/blog/manage`) + main `{children}`.
    - Does NOT include public `<Header>` / `<Footer>`.

24. Create `src/app/admin/blog/page.tsx` — **New Post editor page** (`'use client'`).
    - Layout: two-column grid `lg:grid-cols-[1fr_320px]`
    - **Left**: large title `<Input>` styled as a heading + `<RichTextEditor>` below.
    - **Right sidebar**: RHF `<form>` with `blogPostSchema`:
      ```ts
      const blogPostSchema = z.object({
        title: z.string().min(5).max(150),
        excerpt: z.string().min(10).max(300),
        coverImage: z.string().url().optional(),
        tags: z.array(z.string()).max(5),
        status: z.enum(['draft', 'published']),
      });
      ```
      Fields: excerpt `<Textarea>`, cover image uploader (click → hidden `<input type="file">`, onChange uploads to `/api/blog/upload-image`, shows preview via `next/image`), tags input (comma-separated → split on blur → render as `<Badge>` chips with `×`), `<Select>` for status.
    - Two action buttons: `Save Draft` (`variant="outline"`) and `Publish` (`variant="default"`).
    - TipTap content kept in separate `useState` (not RHF — TipTap is uncontrolled). On submit: merge RHF data + TipTap HTML → call `useCreatePost` mutation.

25. Create `src/app/admin/blog/edit/[slug]/page.tsx` — **Edit Post page**.
    - Server Component fetches post via `/api/blog/[slug]`, passes as props to client editor.
    - Same layout as new post, pre-populated with existing data.
    - Uses `useUpdatePost` mutation on submit.

26. Create `src/app/admin/blog/manage/page-client.tsx` — `'use client'`.
    - `useQuery` with `blogKeys.admin.list()` → fetch from `/api/blog/admin`.
    - Responsive card/table rows: title, `<Badge>` for status (`default` = published, `secondary` = draft), formatted date, reading time.
    - Per-row actions: `Edit` (router.push) + `Delete` (opens `<Dialog>` confirmation).
    - Delete dialog uses existing `Dialog` + `DialogContent` + `DialogFooter`.
    - On confirm: calls `useDeletePost` mutation.

27. Create `src/app/admin/blog/manage/page.tsx` — Server Component wrapper with `<Suspense>` + skeleton.

---

## Phase 9 — Public Blog Pages Update

28. Update `src/lib/api/blog.ts`:
    - Replace mock functions with real `apiClient` HTTP calls.
    - `getPosts(filters)` → `apiClient.get('/blog', { params: filters })`
    - `getPost(slug)` → `apiClient.get('/blog/${slug}')`
    - Retain the same function signatures so all hooks (`use-blog-posts.ts`) and server components work without change.

29. Update `src/app/blog/page-client.tsx` — no structural change needed; already uses `useBlogPosts` hook → will automatically use real API.

30. Update `src/app/blog/[slug]/page.tsx`:
    - Add `export const revalidate = 60` (ISR — new posts appear within 60s).
    - Add `generateStaticParams` fetching all published slugs.
    - Switch from mock `blogApi.getPost()` to direct `fetch(\`${process.env.NEXT_PUBLIC_API_URL}/blog/${slug}\`)` server-side.
    - Sanitize TipTap HTML through `isomorphic-dompurify` before `dangerouslySetInnerHTML`.

---

## Phase 10 — Wiring & Cleanup

31. Update `src/app/sitemap.ts` — switch blog post URLs to come from real API endpoint.

32. `src/app/robots.ts` — already disallows `/admin/` and `/api/`, no change needed.

---

## Verification Checklist

- [ ] `npm run dev` → visit `http://localhost:3000/api/auth/admin?token=YOUR_ADMIN_SECRET` → cookie set → redirected to `/admin/blog/manage`
- [ ] Create a new post → save draft → check manage table → publish → verify on `/blog`
- [ ] Upload a cover image → verify Cloudinary URL returned and embedded
- [ ] Visit `/blog/[slug]` of new post → verify ISR serves it within 60s of publish
- [ ] Visit `/admin/blog/manage` without cookie → verify 403
- [ ] Run `npx tsx src/scripts/seed.ts` → verify 6 mock posts appear on `/blog`
- [ ] Dark mode works on all admin pages (Tailwind `dark:` classes throughout)

---

## Key Decisions

| Decision | Rationale |
|---|---|
| **Auth: HMAC cookie via secret-token URL** | No login form to brute-force. httpOnly cookie prevents XSS. Node.js built-in `crypto` — no JWT library needed. |
| **multer dropped** | Incompatible with Next.js App Router. `Request.formData()` is the idiomatic approach. |
| **No User Mongoose model** | Personal blog with single admin. Author stored as plain string from `siteConfig.author.name`. |
| **Mock data replaced** | `blogApi` functions rewritten to call real API. Seed script migrates 6 mock posts into MongoDB on first run. |
| **Select component created** | `@radix-ui/react-select` is installed but no component wrapper exists — must be created for the status dropdown. |
| **`@tailwindcss/typography` added** | Required to fix already-broken `prose` class in `post-content.tsx` AND style TipTap editor output. |
