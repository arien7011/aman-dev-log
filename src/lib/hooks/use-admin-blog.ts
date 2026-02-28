'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { blogKeys } from '@/lib/queryKeys';
import type { BlogPostInput, AdminBlogPost, BlogPost, PaginatedResponse } from '@/types';

// ----------------------------------------------------------------
// Helper: read the admin-token cookie value so Axios can pass it
// in the Cookie header (the httpOnly cookie is sent automatically
// by the browser; this just ensures our Axios client also carries it).
// ----------------------------------------------------------------
function getAdminHeaders(): Record<string, string> {
  // The cookie is sent automatically with same-origin requests.
  // No extra header needed — verifyAdminRequest() reads req.cookies.
  return {};
}

// ----------------------------------------------------------------
// Types for mutation status feedback (mirrors newsletter-form pattern)
// ----------------------------------------------------------------
type MutationStatus = 'idle' | 'loading' | 'success' | 'error';

// ----------------------------------------------------------------
// useAdminPosts — fetch ALL posts (draft + published) for admin view
// ----------------------------------------------------------------
export function useAdminPosts(filters?: { status?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: blogKeys.admin.list(filters as Record<string, unknown>),
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean } & PaginatedResponse<BlogPost>>(
        '/blog/admin',
        { params: filters, headers: getAdminHeaders() }
      );
      return data;
    },
    staleTime: 60 * 1000, // 1 minute for admin
  });
}

// ----------------------------------------------------------------
// useCreatePost
// ----------------------------------------------------------------
export function useCreatePost() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<MutationStatus>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const mutation = useMutation({
    mutationFn: async (input: BlogPostInput) => {
      const { data } = await apiClient.post<{ success: boolean; data: AdminBlogPost }>(
        '/blog',
        input,
        { headers: getAdminHeaders() }
      );
      return data.data;
    },
    onMutate: () => {
      setStatus('loading');
      setFeedbackMessage('');
    },
    onSuccess: (data) => {
      setStatus('success');
      setFeedbackMessage(`Post "${data.title}" saved successfully.`);
      queryClient.invalidateQueries({ queryKey: blogKeys.admin.all });
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
    },
    onError: (err: Error) => {
      setStatus('error');
      setFeedbackMessage(err?.message ?? 'Failed to save post. Please try again.');
      console.error('[useCreatePost]', err);
    },
  });

  return { ...mutation, status, feedbackMessage };
}

// ----------------------------------------------------------------
// useUpdatePost
// ----------------------------------------------------------------
export function useUpdatePost() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<MutationStatus>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const mutation = useMutation({
    mutationFn: async ({ slug, input }: { slug: string; input: Partial<BlogPostInput> }) => {
      const { data } = await apiClient.put<{ success: boolean; data: AdminBlogPost }>(
        `/blog/${slug}`,
        input,
        { headers: getAdminHeaders() }
      );
      return data.data;
    },
    onMutate: () => {
      setStatus('loading');
      setFeedbackMessage('');
    },
    onSuccess: (data) => {
      setStatus('success');
      setFeedbackMessage(`Post "${data.title}" updated successfully.`);
      queryClient.invalidateQueries({ queryKey: blogKeys.admin.all });
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
      queryClient.invalidateQueries({ queryKey: blogKeys.detail(data.slug) });
    },
    onError: (err: Error) => {
      setStatus('error');
      setFeedbackMessage(err?.message ?? 'Failed to update post. Please try again.');
      console.error('[useUpdatePost]', err);
    },
  });

  return { ...mutation, status, feedbackMessage };
}

// ----------------------------------------------------------------
// useDeletePost
// ----------------------------------------------------------------
export function useDeletePost() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<MutationStatus>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const mutation = useMutation({
    mutationFn: async (slug: string) => {
      await apiClient.delete(`/blog/${slug}`, { headers: getAdminHeaders() });
      return slug;
    },
    onMutate: () => {
      setStatus('loading');
      setFeedbackMessage('');
    },
    onSuccess: (slug) => {
      setStatus('success');
      setFeedbackMessage('Post deleted successfully.');
      queryClient.invalidateQueries({ queryKey: blogKeys.admin.all });
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
      queryClient.invalidateQueries({ queryKey: blogKeys.detail(slug) });
    },
    onError: (err: Error) => {
      setStatus('error');
      setFeedbackMessage(err?.message ?? 'Failed to delete post. Please try again.');
      console.error('[useDeletePost]', err);
    },
  });

  return { ...mutation, status, feedbackMessage };
}
