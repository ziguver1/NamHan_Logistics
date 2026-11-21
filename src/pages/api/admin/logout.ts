import type { APIRoute } from 'astro';
import { createAdminLogoutCookie } from '../../../lib/server/admin-auth.ts';

export const prerender = false;

export const POST: APIRoute = async ({ request, url }) => {
  const host = request.headers.get('x-forwarded-host') || url.host || '';
  const proto = request.headers.get('x-forwarded-proto') || (url.protocol.replace(':', ''));
  const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
  const isSecure = (proto === 'https' || Boolean(process.env.VERCEL || process.env.NETLIFY)) && !isLocalhost;

  return new Response(
    JSON.stringify({ success: true, message: 'Đã đăng xuất.' }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': createAdminLogoutCookie(isSecure)
      }
    }
  );
};

export const GET: APIRoute = async ({ request, url }) => {
  const host = request.headers.get('x-forwarded-host') || url.host || '';
  const proto = request.headers.get('x-forwarded-proto') || (url.protocol.replace(':', ''));
  const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
  const isSecure = (proto === 'https' || Boolean(process.env.VERCEL || process.env.NETLIFY)) && !isLocalhost;

  const cookie = createAdminLogoutCookie(isSecure);
  return new Response(null, {
    status: 302,
    headers: {
      Location: '/admin/google-sheets',
      'Set-Cookie': cookie
    }
  });
};
