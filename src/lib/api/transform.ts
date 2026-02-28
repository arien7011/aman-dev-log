import type { IBlog } from '@/models/Blog';
import { authorConfig } from '@/config/site';
import type { BlogPost } from '@/types';

/**
 * Transform a MongoDB IBlog document into the BlogPost shape expected
 * by all existing components and hooks.
 *
 * The existing BlogPost type uses nested Author / Tag[] / Category objects
 * while the DB stores flat strings for simplicity (personal blog, single author).
 */
export function blogDocToPost(doc: IBlog & { _id: unknown; createdAt: Date; updatedAt: Date }): BlogPost {
  return {
    id: (doc._id as { toString(): string }).toString(),
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt,
    content: doc.content,
    coverImage: doc.coverImage || '/images/placeholder.jpg',
    publishedAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
    author: {
      id: authorConfig.id,
      name: doc.author ?? authorConfig.name,
      avatar: authorConfig.avatar,
      bio: authorConfig.bio,
      email: authorConfig.email,
      social: authorConfig.social,
    },
    // Convert plain string tags into Tag shape
    tags: doc.tags.map((name, i) => ({
      id: String(i + 1),
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
    })),
    // Convert plain string category into Category shape
    category: {
      id: doc.category,
      name: doc.category.charAt(0).toUpperCase() + doc.category.slice(1),
      slug: doc.category,
    },
    readingTime: doc.readingTime,
    featured: doc.featured,
    views: doc.views,
    likes: doc.likes,
  };
}
