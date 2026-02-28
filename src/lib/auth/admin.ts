import crypto from 'crypto';
import { NextRequest } from 'next/server';

// ----------------------------------------------------------------
// Admin auth — secret-token HMAC cookie strategy.
//
// How it works:
//   1. Admin visits /api/auth/admin?token=ADMIN_SECRET once.
//   2. The route validates the token, sets an httpOnly "admin-token"
//      cookie whose value is signAdminCookie(ADMIN_SECRET).
//   3. Every protected route/middleware calls verifyAdminRequest()
//      which re-derives the expected HMAC and compares.
//
// No JWT library is needed — we use Node's built-in crypto module.
// ----------------------------------------------------------------

const COOKIE_NAME = 'admin-token';

/**
 * Derive a deterministic HMAC from the admin secret.
 * The cookie value equals this HMAC — never the raw secret.
 */
export function signAdminCookie(secret: string): string {
  return crypto.createHmac('sha256', secret).update('admin').digest('hex');
}

/**
 * Verify that the incoming request carries a valid admin cookie.
 * Works with NextRequest (middleware + App Router route handlers).
 */
export function verifyAdminRequest(request: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;

  const cookieValue = request.cookies.get(COOKIE_NAME)?.value;
  if (!cookieValue) return false;

  const expected = signAdminCookie(secret);

  // Constant-time comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(cookieValue, 'hex'),
      Buffer.from(expected, 'hex')
    );
  } catch {
    return false;
  }
}

/**
 * Verify using the cookies() API from next/headers (Server Components & layouts).
 * Returns true if the admin cookie is valid.
 */
export async function verifyAdminCookie(
  cookieValue: string | undefined
): Promise<boolean> {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || !cookieValue) return false;

  const expected = signAdminCookie(secret);
  try {
    return crypto.timingSafeEqual(
      Buffer.from(cookieValue, 'hex'),
      Buffer.from(expected, 'hex')
    );
  } catch {
    return false;
  }
}

export { COOKIE_NAME };
