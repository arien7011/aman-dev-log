import { PostCard } from './post-card';
import type { BlogPost } from '@/types';

interface PostGridProps {
  posts: BlogPost[];
  showFeatured?: boolean;
}

export function PostGrid({ posts, showFeatured = false }: PostGridProps) {
  if (posts.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-600 dark:text-gray-400">No posts found.</p>
      </div>
    );
  }

  // If showFeatured, make the first post featured
  const featuredPost = showFeatured ? posts[0] : null;
  const regularPosts = showFeatured ? posts.slice(1) : posts;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {featuredPost && (
        <PostCard post={featuredPost} featured />
      )}
      {regularPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
