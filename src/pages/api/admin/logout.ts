import type { APIRoute } from 'astro';
import { createAdminLogoutCookie } from '../../../lib/server/admin-auth.ts';

export const prerender = false;

export const POST: APIRoute = async () => {
  return new Response(
    JSON.stringify({ success: true, message: 'Đã đăng xuất.' }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': createAdminLogoutCookie()
      }
    }
  );
};

export const GET: APIRoute = async () => {
  const cookie = createAdminLogoutCookie();
  return new Response(null, {
    status: 302,
    headers: {
      Location: '/admin/google-sheets',
      'Set-Cookie': cookie
    }
  });
};
