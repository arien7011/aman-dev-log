'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, Plus, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button, Badge, Card, Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui';
import { useAdminPosts, useDeletePost } from '@/lib/hooks/use-admin-blog';
import { formatDate, formatReadingTime } from '@/lib/utils';
import type { BlogPost } from '@/types';
import Link from 'next/link';

export function ManageBlogPageClient() {
  const router = useRouter();
  const { data, isLoading, isError } = useAdminPosts();
  const { mutateAsync: deletePost, status: deleteStatus, feedbackMessage: deleteMessage } = useDeletePost();

  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const posts = data?.data ?? [];

  // ----------------------------------------------------------------
  // Delete handlers
  // ----------------------------------------------------------------
  const openDeleteDialog = (post: BlogPost) => {
    setPostToDelete(post);
    setIsDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;
    await deletePost(postToDelete.slug);
    setIsDialogOpen(false);
    setPostToDelete(null);
  };

  // ----------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Manage Posts</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{posts.length} post{posts.length !== 1 ? 's' : ''}</p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/blog">
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>

      {/* Feedback banner */}
      {deleteStatus === 'success' && (
        <div className="mx-6 mt-4 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
          <CheckCircle className="h-4 w-4" />
          {deleteMessage}
        </div>
      )}
      {deleteStatus === 'error' && (
        <div className="mx-6 mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          <AlertCircle className="h-4 w-4" />
          {deleteMessage}
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
          </div>
        )}

        {isError && (
          <Card className="p-8 text-center">
            <p className="text-red-500">Failed to load posts. Make sure your MongoDB URI is configured.</p>
          </Card>
        )}

        {!isLoading && !isError && posts.length === 0 && (
          <Card className="flex flex-col items-center justify-center gap-4 py-16">
            <p className="text-gray-500">No posts yet.</p>
            <Button asChild variant="outline">
              <Link href="/admin/blog">Create your first post</Link>
            </Button>
          </Card>
        )}

        {!isLoading && posts.length > 0 && (
          <div className="space-y-3">
            {posts.map((post) => (
              <Card key={post.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Post info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate font-medium text-gray-900 dark:text-white">
                      {post.title}
                    </span>
                    <Badge
                      variant={(post as unknown as { status: string }).status === 'published' ? 'default' : 'secondary'}
                      size="sm"
                    >
                      {(post as unknown as { status: string }).status ?? 'draft'}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(post.publishedAt)} · {formatReadingTime(post.readingTime)}
                    {post.tags.length > 0 && (
                      <> · {post.tags.slice(0, 3).map((t) => t.name).join(', ')}</>
                    )}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/admin/blog/edit/${post.slug}`)}
                  >
                    <Pencil className="mr-1.5 h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => openDeleteDialog(post)}
                  >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{' '}
              <strong>&ldquo;{postToDelete?.title}&rdquo;</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteStatus === 'loading'}
            >
              {deleteStatus === 'loading' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
