import type { APIRoute } from 'astro';
import crypto from 'node:crypto';
import { getAdminPassword, createAdminSessionCookie } from '../../../lib/server/admin-auth.ts';

export const prerender = false;

// -----------------------------------------------------------------------------
// Rate Limiting & Brute-Force Defense for Admin Login
// -----------------------------------------------------------------------------
interface AttemptRecord {
  count: number;
  lastAttempt: number;
  lockedUntil?: number;
}

// In-memory tracking for failed login attempts
const failedAttempts = new Map<string, AttemptRecord>();
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout

function getClientIp(request: Request): string {
  const headers = request.headers;
  // Netlify client IP header
  const nfIp = headers.get('x-nf-client-connection-ip');
  if (nfIp) return nfIp.trim();

  // Standard proxies
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) return (forwarded.split(',')[0] || '').trim();

  const realIp = headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  return 'unknown-client';
}

/**
 * Constant-time string comparison to protect against side-channel timing attacks.
 */
function timingSafeEqualStrings(a: string, b: string): boolean {
  if (!a || !b) return false;
  const hashA = crypto.createHash('sha256').update(a).digest();
  const hashB = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

export const POST: APIRoute = async ({ request, url }) => {
  const ip = getClientIp(request);
  const now = Date.now();
  const record = failedAttempts.get(ip);

  // 1. Check if the IP is currently locked out
  if (record?.lockedUntil && record.lockedUntil > now) {
    const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    const remainingMinutes = Math.ceil(remainingSeconds / 60);
    return new Response(
      JSON.stringify({
        success: false,
        error: `Phát hiện nhiều lần đăng nhập sai. Để bảo vệ an toàn, hệ thống tạm khóa đăng nhập từ địa chỉ của bạn trong ${remainingMinutes} phút nữa.`
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(remainingSeconds),
          'Cache-Control': 'no-store'
        }
      }
    );
  }

  try {
    let password = '';
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const body = await request.json().catch(() => ({}));
      password = body.password || '';
    } else {
      const formData = await request.formData().catch(() => null);
      password = (formData?.get('password') as string) || '';
    }

    const expectedPassword = getAdminPassword();
    const cleanInput = typeof password === 'string' ? password.trim() : '';
    const unquotedInput = cleanInput.replace(/^["']|["']$/g, '').trim();
    const unquotedExpected = expectedPassword.replace(/^["']|["']$/g, '').trim();

    // Constant-time check across sanitized variants
    const isMatch =
      Boolean(cleanInput) &&
      (timingSafeEqualStrings(cleanInput, expectedPassword) ||
        timingSafeEqualStrings(unquotedInput, unquotedExpected) ||
        timingSafeEqualStrings(cleanInput, unquotedExpected) ||
        timingSafeEqualStrings(unquotedInput, expectedPassword));

    if (!isMatch) {
      // Artificial delay to mitigate high-speed dictionary/brute-force attacks
      await new Promise((r) => setTimeout(r, 600));

      const prevCount = record?.count || 0;
      const newCount = prevCount + 1;

      if (newCount >= MAX_FAILED_ATTEMPTS) {
        failedAttempts.set(ip, {
          count: newCount,
          lastAttempt: now,
          lockedUntil: now + LOCKOUT_DURATION_MS
        });
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Bạn đã nhập sai mật khẩu 5 lần. Hệ thống tạm khóa đăng nhập trong 15 phút để bảo vệ an toàn.'
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': '900',
              'Cache-Control': 'no-store'
            }
          }
        );
      }

      failedAttempts.set(ip, { count: newCount, lastAttempt: now });
      const remainingAttempts = MAX_FAILED_ATTEMPTS - newCount;

      return new Response(
        JSON.stringify({
          success: false,
          error: `Mật khẩu quản trị không chính xác. Bạn còn ${remainingAttempts} lần thử trước khi bị khóa tạm thời.`
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
          }
        }
      );
    }

    // Login successful: reset failed attempts
    failedAttempts.delete(ip);

    // Determine secure cookie flag (always secure on https or Netlify production)
    const isSecure =
      url.protocol === 'https:' ||
      request.headers.get('x-forwarded-proto') === 'https' ||
      Boolean(process.env.NETLIFY);

    const cookie = await createAdminSessionCookie(isSecure);

    return new Response(
      JSON.stringify({ success: true, message: 'Đăng nhập thành công.' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': cookie,
          'Cache-Control': 'no-store, private'
        }
      }
    );
  } catch (err) {
    console.error('[Admin Login Error]:', err);
    return new Response(
      JSON.stringify({ success: false, error: 'Lỗi máy chủ nội bộ khi xử lý đăng nhập.' }),
      { status: 500, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } }
    );
  }
};
