import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent, Badge } from '@/components/ui';
import { formatDate, formatReadingTime } from '@/lib/utils';
import type { BlogPost } from '@/types';

interface PostCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function PostCard({ post, featured = false }: PostCardProps) {
  return (
    <Card
      className={`group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
        featured ? 'md:col-span-2 md:grid md:grid-cols-2' : ''
      }`}
    >
      {/* Cover Image */}
      <Link
        href={`/blog/${post.slug}`}
        className={`relative block overflow-hidden ${
          featured ? 'aspect-[16/10] md:aspect-auto' : 'aspect-[16/9]'
        }`}
      >
        <Image
          src={post.coverImage || '/images/placeholder-blog.jpg'}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes={featured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'}
        />
        {post.featured && (
          <div className="absolute left-4 top-4">
            <Badge variant="default" className="bg-teal-600 text-white">
              Featured
            </Badge>
          </div>
        )}
      </Link>

      {/* Content */}
      <CardContent className={`flex flex-col ${featured ? 'justify-center' : ''} p-6`}>
        {/* Category */}
        <Link
          href={`/blog/category/${post.category.slug}`}
          className="mb-2 inline-block"
        >
          <Badge variant="secondary" className="hover:bg-teal-100 dark:hover:bg-teal-900/30">
            {post.category.name}
          </Badge>
        </Link>

        {/* Title */}
        <Link href={`/blog/${post.slug}`}>
          <h3
            className={`font-bold text-gray-900 transition-colors group-hover:text-teal-600 dark:text-white dark:group-hover:text-teal-400 ${
              featured ? 'text-2xl md:text-3xl' : 'text-xl'
            }`}
          >
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p
          className={`mt-3 text-gray-600 dark:text-gray-400 ${
            featured ? 'line-clamp-3' : 'line-clamp-2'
          }`}
        >
          {post.excerpt}
        </p>

        {/* Meta */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center">
            <Calendar className="mr-1.5 h-4 w-4" />
            {formatDate(post.publishedAt)}
          </span>
          <span className="flex items-center">
            <Clock className="mr-1.5 h-4 w-4" />
            {formatReadingTime(post.readingTime)}
          </span>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <Link key={tag.id} href={`/blog?tag=${tag.slug}`}>
                <span className="text-xs text-gray-500 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400">
                  #{tag.name}
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* Read More */}
        <Link
          href={`/blog/${post.slug}`}
          className="mt-4 inline-flex items-center text-sm font-medium text-teal-600 transition-colors hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
        >
          Read more
          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </CardContent>
    </Card>
  );
}
