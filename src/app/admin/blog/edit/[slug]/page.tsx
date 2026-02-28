import { notFound } from 'next/navigation';
import type { BlogPost, AdminBlogPost } from '@/types';
import { EditBlogPostClient } from './edit-client';

type EditablePost = BlogPost & { status: 'draft' | 'published' };

interface EditPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditBlogPostPage({ params }: EditPageProps) {
  const { slug } = await params;
  const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

  let post: EditablePost | null = null;
  try {
    const res = await fetch(`${base}/blog/${slug}`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      post = json.data as EditablePost;
    }
  } catch {
    // fall through to notFound()
  }

  if (!post) notFound();

  return <EditBlogPostClient post={post} />;
}

export async function generateMetadata({ params }: EditPageProps) {
  const { slug } = await params;
  return { title: `Edit: ${slug} | Admin` };
}
