import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PostHeader, PostContent, ReadingProgress, RelatedPosts } from '@/components/blog';
import { SocialShare, NewsletterForm } from '@/components/shared';
import { blogApi } from '@/lib/api/blog';
import { generateSEOMetadata, generateArticleSchema } from '@/lib/utils';
import { siteConfig } from '@/config/site';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await blogApi.getPost(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }
  
  return generateSEOMetadata({
    title: post.title,
    description: post.excerpt,
    ogImage: post.coverImage,
    type: 'article',
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    authors: [post.author.name],
    tags: post.tags.map((tag) => tag.name),
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await blogApi.getPost(slug);
  
  if (!post) {
    notFound();
  }
  
  const relatedPosts = await blogApi.getRelatedPosts(post.id, 3);
  const postUrl = `${siteConfig.url}/blog/${post.slug}`;
  
  const articleSchema = generateArticleSchema({
    title: post.title,
    description: post.excerpt,
    image: post.coverImage,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    author: post.author.name,
    url: postUrl,
  });
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      
      <ReadingProgress />
      
      <article className="container max-w-4xl py-12">
        <PostHeader post={post} />
        
        <div className="mt-12">
          <PostContent content={post.content} />
        </div>
        
        {/* Share & Tags */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-8 dark:border-gray-800">
          <SocialShare
            url={postUrl}
            title={post.title}
            description={post.excerpt}
          />
        </div>
        
        {/* Newsletter CTA */}
        <div className="mt-12 rounded-xl bg-gray-50 p-8 dark:bg-gray-900">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Enjoyed this article?
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Subscribe to get notified when I publish new articles about web development and software engineering.
          </p>
          <div className="mt-4">
            <NewsletterForm variant="inline" />
          </div>
        </div>
        
        {/* Related Posts */}
        <RelatedPosts posts={relatedPosts} currentPostId={post.id} />
      </article>
    </>
  );
}
