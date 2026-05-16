import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import Blog from '@/models/Blog';
import { verifyAdminRequest } from '@/lib/auth/admin';
import { blogDocToPost } from '@/lib/api/transform';
import type { PaginatedResponse, BlogPost } from '@/types';

// ----------------------------------------------------------------
// GET /api/blog/admin — admin only, returns ALL posts (draft + published)
// Used exclusively by the admin manage page.
// ----------------------------------------------------------------
export async function GET(request: NextRequest) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
  }

  try {
    await connectDB();

    const { searchParams } = request.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10)));
    const statusFilter = searchParams.get('status');

    const filter: Record<string, unknown> = {};
    if (statusFilter && ['draft', 'published'].includes(statusFilter)) {
      filter.status = statusFilter;
    }

    const total = await Blog.countDocuments(filter);
    const docs = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<(import('@/models/Blog').IBlog & { _id: unknown; createdAt: Date; updatedAt: Date })[]>();

    const posts: BlogPost[] = docs.map(blogDocToPost);

    const response: PaginatedResponse<BlogPost> = {
      data: posts,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };

    return NextResponse.json({ success: true, ...response });
  } catch (err) {
    console.error('[GET /api/blog/admin]', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
