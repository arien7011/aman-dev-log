import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import Blog from '@/models/Blog';
import { verifyAdminRequest } from '@/lib/auth/admin';
import { blogDocToPost } from '@/lib/api/transform';

interface RouteContext {
  params: Promise<{ slug: string }>;
}

// ----------------------------------------------------------------
// GET /api/blog/[slug] — public, fetch single post by slug
// ----------------------------------------------------------------
export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();

    const { slug } = await params;
    const doc = await Blog.findOne({ slug }).lean<
      import('@/models/Blog').IBlog & { _id: unknown; createdAt: Date; updatedAt: Date }
    >();

    if (!doc) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }

    // Increment views (fire-and-forget, no await)
    Blog.updateOne({ slug }, { $inc: { views: 1 } }).exec();

    return NextResponse.json({ success: true, data: blogDocToPost(doc) });
  } catch (err) {
    console.error('[GET /api/blog/[slug]]', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ----------------------------------------------------------------
// PUT /api/blog/[slug] — admin only, update a post
// ----------------------------------------------------------------
export async function PUT(request: NextRequest, { params }: RouteContext) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
  }

  try {
    await connectDB();

    const { slug } = await params;
    const body = await request.json() as Record<string, unknown>;

    // Prevent direct slug overwrite — it is recalculated in the pre-save hook
    delete body.slug;

    const doc = await Blog.findOneAndUpdate(
      { slug },
      { $set: body },
      { new: true, runValidators: true }
    ).lean<
      import('@/models/Blog').IBlog & { _id: unknown; createdAt: Date; updatedAt: Date }
    >();

    if (!doc) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: blogDocToPost(doc) });
  } catch (err) {
    console.error('[PUT /api/blog/[slug]]', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ----------------------------------------------------------------
// DELETE /api/blog/[slug] — admin only
// ----------------------------------------------------------------
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
  }

  try {
    await connectDB();

    const { slug } = await params;
    const doc = await Blog.findOneAndDelete({ slug });

    if (!doc) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    console.error('[DELETE /api/blog/[slug]]', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
