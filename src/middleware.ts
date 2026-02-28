import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/auth/admin';

export function middleware(request: NextRequest) {
  // Protect all routes under /admin
  if (!verifyAdminRequest(request)) {
    return new NextResponse(
      '<html><body><h1>403 — Forbidden</h1><p>You do not have access to this area.</p></body></html>',
      {
        status: 403,
        headers: { 'Content-Type': 'text/html' },
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
