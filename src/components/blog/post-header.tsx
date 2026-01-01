import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { Badge, Avatar, AvatarImage, AvatarFallback } from '@/components/ui';
import { formatDate, formatReadingTime } from '@/lib/utils';
import type { BlogPost } from '@/types';

interface PostHeaderProps {
  post: BlogPost;
}

export function PostHeader({ post }: PostHeaderProps) {
  return (
    <header className="relative">
      {/* Back Button */}
      <Link
        href="/blog"
        className="mb-6 inline-flex items-center text-sm text-gray-600 transition-colors hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to all posts
      </Link>

      {/* Category */}
      <Link href={`/blog/category/${post.category.slug}`} className="inline-block">
        <Badge variant="default" className="mb-4">
          {post.category.name}
        </Badge>
      </Link>

      {/* Title */}
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
        {post.title}
      </h1>

      {/* Excerpt */}
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 md:text-xl">
        {post.excerpt}
      </p>

      {/* Meta Info */}
      <div className="mt-6 flex flex-wrap items-center gap-6">
        {/* Author */}
        <Link
          href="/about"
          className="flex items-center space-x-3 transition-opacity hover:opacity-80"
        >
          <Avatar>
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback>
              {post.author.name.split(' ').map((n) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {post.author.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Author</p>
          </div>
        </Link>

        {/* Date & Reading Time */}
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center">
            <Calendar className="mr-1.5 h-4 w-4" />
            {formatDate(post.publishedAt)}
          </span>
          <span className="flex items-center">
            <Clock className="mr-1.5 h-4 w-4" />
            {formatReadingTime(post.readingTime)}
          </span>
        </div>
      </div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link key={tag.id} href={`/blog?tag=${tag.slug}`}>
              <Badge
                variant="outline"
                className="transition-colors hover:bg-teal-50 dark:hover:bg-teal-950"
              >
                #{tag.name}
              </Badge>
            </Link>
          ))}
        </div>
      )}

      {/* Cover Image */}
      {post.coverImage && (
        <div className="relative mt-8 aspect-video overflow-hidden rounded-xl">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
        </div>
      )}
    </header>
  );
}
