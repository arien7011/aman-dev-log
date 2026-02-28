import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import Blog from '@/models/Blog';
import { verifyAdminRequest } from '@/lib/auth/admin';
import { blogDocToPost } from '@/lib/api/transform';
import { authorConfig } from '@/config/site';
import type { PaginatedResponse, BlogPost } from '@/types';

// ----------------------------------------------------------------
// GET /api/blog — public, returns published posts with pagination
// ----------------------------------------------------------------
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = request.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '9', 10)));
    const category = searchParams.get('category') ?? '';
    const search = searchParams.get('search') ?? '';
    const sortBy = (searchParams.get('sortBy') ?? 'newest') as 'newest' | 'oldest' | 'popular';

    // Build filter
    const filter: Record<string, unknown> = { status: 'published' };
    if (category) filter.category = category.toLowerCase();
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort
    const sortMap: Record<string, Record<string, 1 | -1>> = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      popular: { views: -1 },
    };
    const sort = sortMap[sortBy] ?? sortMap.newest;

    const total = await Blog.countDocuments(filter);
    const docs = await Blog.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<(typeof Blog extends import('mongoose').Model<infer T> ? T : never)[]>();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const posts: BlogPost[] = (docs as any[]).map(blogDocToPost);

    const response: PaginatedResponse<BlogPost> = {
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    return NextResponse.json({ success: true, ...response });
  } catch (err) {
    console.error('[GET /api/blog]', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ----------------------------------------------------------------
// POST /api/blog — admin only, create a new blog post
// ----------------------------------------------------------------
export async function POST(request: NextRequest) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
  }

  try {
    await connectDB();

    const body = await request.json() as {
      title?: string;
      content?: string;
      excerpt?: string;
      coverImage?: string;
      tags?: string[];
      category?: string;
      status?: 'draft' | 'published';
      featured?: boolean;
    };

    const { title, content = '', excerpt, coverImage = '', tags = [], category = 'general', status = 'draft', featured = false } = body;

    if (!title || !excerpt) {
      return NextResponse.json(
        { success: false, message: 'title and excerpt are required' },
        { status: 400 }
      );
    }

    const blog = new Blog({
      title,
      content,
      excerpt,
      coverImage,
      tags,
      category,
      status,
      featured,
      author: authorConfig.name,
    });

    await blog.save();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return NextResponse.json(
      { success: true, data: blogDocToPost(blog as any) },
      { status: 201 }
    );
  } catch (err) {
    console.error('[POST /api/blog]', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
