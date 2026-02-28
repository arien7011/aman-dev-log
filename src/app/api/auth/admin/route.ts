import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { signAdminCookie, COOKIE_NAME } from '@/lib/auth/admin';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json(
      { success: false, message: 'Missing token' },
      { status: 400 }
    );
  }

  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    return NextResponse.json(
      { success: false, message: 'Server misconfiguration' },
      { status: 500 }
    );
  }

  // Compare the provided token directly against the secret
  if (token !== secret) {
    return NextResponse.json(
      { success: false, message: 'Invalid token' },
      { status: 401 }
    );
  }

  // Set httpOnly admin cookie valid for 7 days
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, signAdminCookie(secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });

  // Redirect to the admin management page
  return NextResponse.redirect(new URL('/admin/blog/manage', request.url));
}
