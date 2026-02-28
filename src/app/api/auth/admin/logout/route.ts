import { NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/lib/auth/admin';

export async function GET() {
  const response = NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'));
  response.cookies.delete(COOKIE_NAME);
  return response;
}
