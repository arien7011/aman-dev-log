/**
 * Seed script — populates MongoDB with the 6 mock blog posts.
 *
 * Usage:
 *   npx tsx src/scripts/seed.ts
 *
 * Requires MONGODB_URI in your environment (or .env.local).
 */

import 'dotenv/config';
import mongoose from 'mongoose';

// ----------------------------------------------------------------
// Inline mini-versions of the Blog model so we don't need to
// compile the full Next.js project before running this script.
// ----------------------------------------------------------------
const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    coverImage: { type: String, default: '' },
    author: { type: String, default: 'Aman Sharma' },
    status: { type: String, enum: ['draft', 'published'], default: 'published' },
    tags: [{ type: String }],
    category: { type: String, default: 'general' },
    readingTime: { type: Number, default: 5 },
    featured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const BlogModel =
  mongoose.models?.Blog ?? mongoose.model('Blog', BlogSchema);

// ----------------------------------------------------------------
// Seed data (mirrors mock posts in src/lib/api/blog.ts)
// ----------------------------------------------------------------
const seeds = [
  {
    title: 'Building Scalable React Applications: Lessons from 3+ Years of Experience',
    slug: 'building-scalable-react-applications',
    content: '<h2>Introduction</h2><p>After working on multiple large-scale React applications, I\'ve learned that scalability isn\'t just about handling more users—it\'s about maintaining code quality, developer productivity, and application performance as your codebase grows.</p><h2>Key Architectural Decisions</h2><p>Here are the most impactful decisions I\'ve made across various projects...</p>',
    excerpt: "Learn the key architectural patterns and best practices I've discovered while building enterprise-scale React applications that can handle 200k+ visitors.",
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=630&fit=crop',
    category: 'react',
    tags: ['react', 'typescript', 'best-practices'],
    readingTime: 8,
    featured: true,
    views: 1520,
    likes: 45,
    status: 'published',
  },
  {
    title: 'Mastering TypeScript for React Developers: A Comprehensive Guide',
    slug: 'mastering-typescript-for-react-developers',
    content: '<h2>Why TypeScript?</h2><p>TypeScript has become an essential tool for building large-scale React applications. It provides type safety, better IDE support, and catches errors at compile time.</p>',
    excerpt: 'Deep dive into TypeScript patterns that will make your React code more robust, maintainable, and enjoyable to work with.',
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&h=630&fit=crop',
    category: 'typescript',
    tags: ['typescript', 'react', 'best-practices'],
    readingTime: 12,
    featured: false,
    views: 980,
    likes: 32,
    status: 'published',
  },
  {
    title: 'Optimizing Web Performance: A Deep Dive into Core Web Vitals',
    slug: 'optimizing-web-performance-core-web-vitals',
    content: '<h2>Understanding Core Web Vitals</h2><p>Core Web Vitals are a set of metrics that measure real-world user experience for loading performance, interactivity, and visual stability.</p>',
    excerpt: 'Practical strategies to improve your Lighthouse scores and deliver faster, more responsive web applications.',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop',
    category: 'performance',
    tags: ['performance', 'best-practices', 'javascript'],
    readingTime: 10,
    featured: true,
    views: 1250,
    likes: 38,
    status: 'published',
  },
  {
    title: 'Next.js App Router Migration: Complete Guide from Pages to App Directory',
    slug: 'next-js-app-router-migration-guide',
    content: '<h2>Why Migrate?</h2><p>The App Router brings significant improvements including React Server Components, streaming, and better data fetching patterns.</p>',
    excerpt: 'Step-by-step guide to migrating your Next.js application from the Pages Router to the new App Router architecture.',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop',
    category: 'nextjs',
    tags: ['nextjs', 'react', 'best-practices'],
    readingTime: 15,
    featured: false,
    views: 890,
    likes: 28,
    status: 'published',
  },
  {
    title: 'Career Growth as a Frontend Engineer: From Junior to Senior in 4 Years',
    slug: 'career-growth-frontend-engineer',
    content: '<h2>My Journey</h2><p>Four years ago, I started my career as a fresh graduate with basic knowledge of HTML, CSS, and JavaScript. Today, I lead frontend development for enterprise applications.</p>',
    excerpt: 'Reflecting on my journey from a fresh graduate to a senior frontend engineer, and the lessons learned along the way.',
    coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=630&fit=crop',
    category: 'career',
    tags: ['best-practices', 'javascript'],
    readingTime: 7,
    featured: false,
    views: 2100,
    likes: 65,
    status: 'published',
  },
  {
    title: 'Lessons Learned: Migrating a Large-Scale App from Angular to React',
    slug: 'angular-to-react-migration-lessons',
    content: '<h2>The Challenge</h2><p>Migrating a multi-domain cannabis dispensary platform from Angular 12 to React 18 while maintaining production stability was no small feat.</p>',
    excerpt: 'Real-world insights from leading a major migration project, including challenges faced and strategies that worked.',
    coverImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=630&fit=crop',
    category: 'react',
    tags: ['react', 'best-practices', 'javascript'],
    readingTime: 11,
    featured: false,
    views: 780,
    likes: 24,
    status: 'published',
  },
];

// ----------------------------------------------------------------
async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌  MONGODB_URI is not set. Add it to .env.local or your environment.');
    process.exit(1);
  }

  console.log('🔌 Connecting to MongoDB…');
  await mongoose.connect(uri);
  console.log('✅ Connected.');

  let inserted = 0;
  let skipped = 0;

  for (const post of seeds) {
    const exists = await BlogModel.exists({ slug: post.slug });
    if (exists) {
      console.log(`  ⏭  Skipped (already exists): ${post.slug}`);
      skipped++;
      continue;
    }
    await BlogModel.create(post);
    console.log(`  ✅ Inserted: ${post.slug}`);
    inserted++;
  }

  console.log(`\n🌱 Seed complete — inserted: ${inserted}, skipped: ${skipped}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('💥 Seed failed:', err);
  process.exit(1);
});
