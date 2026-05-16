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
// No JWT library is needed — we use the Web Crypto API so the same code
// works in Node.js, App Router, and the Edge runtime.
// ----------------------------------------------------------------

const COOKIE_NAME = 'admin-token';
const encoder = new TextEncoder();

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function hexToBytes(hex: string): Uint8Array | null {
  if (hex.length % 2 !== 0) {
    return null;
  }

  const bytes = new Uint8Array(hex.length / 2);

  for (let index = 0; index < hex.length; index += 2) {
    const value = Number.parseInt(hex.slice(index, index + 2), 16);
    if (Number.isNaN(value)) {
      return null;
    }
    bytes[index / 2] = value;
  }

  return bytes;
}

function timingSafeEqualHex(left: string, right: string): boolean {
  const leftBytes = hexToBytes(left);
  const rightBytes = hexToBytes(right);

  if (!leftBytes || !rightBytes || leftBytes.length !== rightBytes.length) {
    return false;
  }

  let difference = 0;

  for (let index = 0; index < leftBytes.length; index += 1) {
    difference |= leftBytes[index] ^ rightBytes[index];
  }

  return difference === 0;
}

/**
 * Derive a deterministic HMAC from the admin secret.
 * The cookie value equals this HMAC — never the raw secret.
 */
export async function signAdminCookie(secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode('admin'));
  return bytesToHex(new Uint8Array(signature));
}

/**
 * Verify that the incoming request carries a valid admin cookie.
 * Works with NextRequest (middleware + App Router route handlers).
 */
export async function verifyAdminRequest(request: NextRequest): Promise<boolean> {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;

  const cookieValue = request.cookies.get(COOKIE_NAME)?.value;
  if (!cookieValue) return false;

  const expected = await signAdminCookie(secret);
  return timingSafeEqualHex(cookieValue, expected);
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

  const expected = await signAdminCookie(secret);
  return timingSafeEqualHex(cookieValue, expected);
}

export { COOKIE_NAME };
