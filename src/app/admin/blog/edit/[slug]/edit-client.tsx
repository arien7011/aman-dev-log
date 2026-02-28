'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { X, Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import {
  Button, Input, Textarea, Badge, Card,
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from '@/components/ui';
import { RichTextEditor } from '@/components/blog';
import { apiClient } from '@/lib/api/client';
import { useUpdatePost } from '@/lib/hooks/use-admin-blog';
import { cn } from '@/lib/utils';
import type { BlogPost } from '@/types';

const blogPostSchema = z.object({
  title: z.string().min(5).max(150),
  excerpt: z.string().min(10).max(300),
  coverImage: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(['draft', 'published']),
});

type BlogPostFormData = z.infer<typeof blogPostSchema>;

interface EditBlogPostClientProps {
  post: BlogPost & { status: 'draft' | 'published' };
}

export function EditBlogPostClient({ post }: EditBlogPostClientProps) {
  const router = useRouter();
  const { mutateAsync, status: mutationStatus, feedbackMessage } = useUpdatePost();

  const [content, setContent] = useState(post.content);
  const [tags, setTags] = useState<string[]>(post.tags.map((t) => t.name));
  const [tagInput, setTagInput] = useState('');
  const [coverPreview, setCoverPreview] = useState(post.coverImage);
  const [imageUploading, setImageUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: post.title,
      excerpt: post.excerpt,
      coverImage: post.coverImage,
      category: post.category.slug,
      status: post.status,
    },
  });

  const statusValue = watch('status');

  const addTag = (raw: string) => {
    const tag = raw.trim().toLowerCase();
    if (tag && !tags.includes(tag) && tags.length < 5) setTags((p) => [...p, tag]);
    setTagInput('');
  };

  const removeTag = (tag: string) => setTags((p) => p.filter((t) => t !== tag));

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(tagInput); }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await apiClient.post<{ success: boolean; url: string }>(
        '/blog/upload-image', formData, { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      if (data.success && data.url) { setValue('coverImage', data.url); setCoverPreview(data.url); }
    } catch (err) {
      console.error('Cover upload failed:', err);
    } finally {
      setImageUploading(false);
      if (coverInputRef.current) coverInputRef.current.value = '';
    }
  };

  const onSubmit = async (formData: BlogPostFormData, submitStatus: 'draft' | 'published') => {
    await mutateAsync({
      slug: post.slug,
      input: {
        title: formData.title,
        content,
        excerpt: formData.excerpt,
        coverImage: formData.coverImage ?? '',
        tags,
        category: formData.category ?? 'general',
        status: submitStatus,
      },
    });

    if (submitStatus === 'published') router.push('/admin/blog/manage');
  };

  const isLoading = mutationStatus === 'loading';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 dark:border-gray-800 dark:bg-gray-900">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Post</h1>
        <div className="flex items-center gap-2">
          {mutationStatus === 'success' && (
            <span className="flex items-center gap-1.5 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" /> {feedbackMessage}
            </span>
          )}
          {mutationStatus === 'error' && (
            <span className="flex items-center gap-1.5 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" /> {feedbackMessage}
            </span>
          )}
          <Button variant="outline" size="sm" disabled={isLoading}
            onClick={handleSubmit((data) => onSubmit(data, 'draft'))}>
            {isLoading && statusValue === 'draft' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Draft
          </Button>
          <Button size="sm" disabled={isLoading}
            onClick={handleSubmit((data) => onSubmit(data, 'published'))}>
            {isLoading && statusValue === 'published' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Publish
          </Button>
        </div>
      </div>

      <div className="container mx-auto grid max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div>
            <Input {...register('title')} placeholder="Post title…"
              className={cn('h-auto border-0 border-b border-gray-200 bg-transparent px-0 py-3 text-3xl font-bold shadow-none focus:ring-0 dark:border-gray-700', errors.title && 'border-red-400')} />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
          </div>
          <RichTextEditor value={content} onChange={setContent} />
        </div>

        <div className="space-y-5">
          <Card className="p-4">
            <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Status</p>
            <Select defaultValue={post.status}
              onValueChange={(val) => setValue('status', val as 'draft' | 'published')}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </Card>

          <Card className="p-4">
            <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Cover Image</p>
            {coverPreview ? (
              <div className="relative">
                <Image src={coverPreview} alt="Cover" width={320} height={180} className="w-full rounded-lg object-cover" />
                <button type="button" onClick={() => { setCoverPreview(''); setValue('coverImage', ''); }}
                  className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80" aria-label="Remove cover">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => coverInputRef.current?.click()} disabled={imageUploading}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-8 text-gray-400 hover:border-teal-400 hover:text-teal-500 disabled:opacity-50">
                {imageUploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Upload className="h-6 w-6" />}
                <span className="text-xs">{imageUploading ? 'Uploading…' : 'Click to upload'}</span>
              </button>
            )}
            <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} aria-hidden />
          </Card>

          <Card className="p-4">
            <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Excerpt</p>
            <Textarea {...register('excerpt')} placeholder="Short summary (max 300 chars)…" rows={4}
              className={errors.excerpt ? 'border-red-400' : ''} />
            {errors.excerpt && <p className="mt-1 text-xs text-red-500">{errors.excerpt.message}</p>}
          </Card>

          <Card className="p-4">
            <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Category</p>
            <Input {...register('category')} placeholder="e.g. react, typescript" />
          </Card>

          <Card className="p-4">
            <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Tags <span className="text-gray-400">(max 5)</span></p>
            {tags.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1 pr-1">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="ml-0.5 rounded-full hover:text-red-500" aria-label={`Remove ${tag}`}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown}
              onBlur={() => tagInput.trim() && addTag(tagInput)} placeholder="Type and press Enter" disabled={tags.length >= 5} />
          </Card>
        </div>
      </div>
    </div>
  );
}
