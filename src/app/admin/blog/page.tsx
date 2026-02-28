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
import { useCreatePost } from '@/lib/hooks/use-admin-blog';
import { cn } from '@/lib/utils';

// ----------------------------------------------------------------
// Zod schema for sidebar form fields
// ----------------------------------------------------------------
const blogPostSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(150, 'Title must be at most 150 characters'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters').max(300, 'Excerpt must be at most 300 characters'),
  coverImage: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(['draft', 'published']),
});

type BlogPostFormData = z.infer<typeof blogPostSchema>;

export default function NewBlogPostPage() {
  const router = useRouter();
  const { mutateAsync, status: mutationStatus, feedbackMessage } = useCreatePost();

  // TipTap content — managed outside RHF since TipTap is uncontrolled
  const [content, setContent] = useState('');

  // Tags state
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // Cover image preview
  const [coverPreview, setCoverPreview] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: { status: 'draft', category: 'general' },
  });

  const statusValue = watch('status');

  // ----------------------------------------------------------------
  // Tags
  // ----------------------------------------------------------------
  const addTag = (raw: string) => {
    const tag = raw.trim().toLowerCase();
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags((prev) => [...prev, tag]);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag));

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  // ----------------------------------------------------------------
  // Cover image upload
  // ----------------------------------------------------------------
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const { data } = await apiClient.post<{ success: boolean; url: string }>(
        '/blog/upload-image',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (data.success && data.url) {
        setValue('coverImage', data.url, { shouldValidate: true });
        setCoverPreview(data.url);
      }
    } catch (err) {
      console.error('Cover image upload failed:', err);
    } finally {
      setImageUploading(false);
      if (coverInputRef.current) coverInputRef.current.value = '';
    }
  };

  // ----------------------------------------------------------------
  // Form submit
  // ----------------------------------------------------------------
  const onSubmit = async (formData: BlogPostFormData, submitStatus: 'draft' | 'published') => {
    await mutateAsync({
      title: formData.title,
      content,
      excerpt: formData.excerpt,
      coverImage: formData.coverImage ?? '',
      tags,
      category: formData.category ?? 'general',
      status: submitStatus,
    });

    if (submitStatus === 'published') {
      router.push('/admin/blog/manage');
    }
  };

  const isLoading = mutationStatus === 'loading';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Top bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 dark:border-gray-800 dark:bg-gray-900">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">New Post</h1>
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
          <Button
            variant="outline"
            size="sm"
            disabled={isLoading}
            onClick={handleSubmit((data) => onSubmit(data, 'draft'))}
          >
            {isLoading && statusValue === 'draft' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Save Draft
          </Button>
          <Button
            size="sm"
            disabled={isLoading}
            onClick={handleSubmit((data) => onSubmit(data, 'published'))}
          >
            {isLoading && statusValue === 'published' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Publish
          </Button>
        </div>
      </div>

      {/* Editor layout */}
      <div className="container mx-auto grid max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[1fr_320px]">
        {/* Left: Title + Editor */}
        <div className="space-y-4">
          {/* Title */}
          <div>
            <Input
              {...register('title')}
              placeholder="Post title…"
              className={cn(
                'h-auto border-0 border-b border-gray-200 bg-transparent px-0 py-3 text-3xl font-bold shadow-none focus:ring-0 dark:border-gray-700',
                errors.title && 'border-red-400'
              )}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* TipTap */}
          <RichTextEditor value={content} onChange={setContent} />
        </div>

        {/* Right: Sidebar form */}
        <div className="space-y-5">
          {/* Status */}
          <Card className="p-4">
            <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Status</p>
            <Select
              defaultValue="draft"
              onValueChange={(val) =>
                setValue('status', val as 'draft' | 'published', { shouldValidate: true })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </Card>

          {/* Cover Image */}
          <Card className="p-4">
            <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Cover Image</p>
            {coverPreview ? (
              <div className="relative">
                <Image
                  src={coverPreview}
                  alt="Cover preview"
                  width={320}
                  height={180}
                  className="w-full rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => { setCoverPreview(''); setValue('coverImage', ''); }}
                  className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                  aria-label="Remove cover image"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                disabled={imageUploading}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-8 text-gray-400 transition-colors hover:border-teal-400 hover:text-teal-500 disabled:opacity-50 dark:border-gray-600"
              >
                {imageUploading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <Upload className="h-6 w-6" />
                )}
                <span className="text-xs">{imageUploading ? 'Uploading…' : 'Click to upload'}</span>
              </button>
            )}
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverUpload}
              aria-hidden
            />
          </Card>

          {/* Excerpt */}
          <Card className="p-4">
            <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Excerpt</p>
            <Textarea
              {...register('excerpt')}
              placeholder="A short summary of the post (max 300 characters)…"
              rows={4}
              className={errors.excerpt ? 'border-red-400' : ''}
            />
            {errors.excerpt && (
              <p className="mt-1 text-xs text-red-500">{errors.excerpt.message}</p>
            )}
          </Card>

          {/* Category */}
          <Card className="p-4">
            <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Category</p>
            <Input
              {...register('category')}
              placeholder="e.g. react, typescript, career"
            />
          </Card>

          {/* Tags */}
          <Card className="p-4">
            <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Tags <span className="text-gray-400">(max 5)</span>
            </p>
            {tags.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1 pr-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-0.5 rounded-full hover:text-red-500"
                      aria-label={`Remove tag ${tag}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              onBlur={() => tagInput.trim() && addTag(tagInput)}
              placeholder="Type a tag and press Enter"
              disabled={tags.length >= 5}
            />
            <p className="mt-1 text-xs text-gray-400">Separate tags with Enter or comma</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
