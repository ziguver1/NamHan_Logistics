import type { APIRoute } from 'astro';
import { getAdminPassword, createAdminSessionCookie } from '../../../lib/server/admin-auth.ts';

export const prerender = false;

export const POST: APIRoute = async ({ request, url }) => {
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

    const isMatch =
      Boolean(cleanInput) &&
      (cleanInput === expectedPassword ||
        unquotedInput === unquotedExpected ||
        cleanInput === unquotedExpected ||
        unquotedInput === expectedPassword);

    if (!isMatch) {
      return new Response(
        JSON.stringify({ success: false, error: 'Mật khẩu quản trị không chính xác.' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const isSecure = url.protocol === 'https:';
    const cookie = await createAdminSessionCookie(isSecure);

    return new Response(
      JSON.stringify({ success: true, message: 'Đăng nhập thành công.' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': cookie
        }
      }
    );
  } catch (err) {
    console.error('[Admin Login Error]:', err);
    return new Response(
      JSON.stringify({ success: false, error: 'Lỗi máy chủ nội bộ khi xử lý đăng nhập.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
