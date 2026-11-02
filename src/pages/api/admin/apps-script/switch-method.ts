import type { APIRoute } from 'astro';
import { isAuthenticatedAdmin } from '../../../../lib/server/admin-auth.ts';
import { getConfig, saveConfig } from '../../../../lib/server/storage.ts';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const isAdmin = await isAuthenticatedAdmin(request);
  if (!isAdmin) {
    return new Response(
      JSON.stringify({ success: false, error: 'UNAUTHORIZED' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const method = body.method;

    if (method !== 'apps_script' && method !== 'oauth') {
      return new Response(
        JSON.stringify({ success: false, error: 'Phương thức không hợp lệ. Chỉ chấp nhận apps_script hoặc oauth.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const config = await getConfig();

    if (method === 'apps_script') {
      if (!config.appsScriptConnection || config.appsScriptConnection.status !== 'active') {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Chưa cấu hình phương thức Google Apps Script. Vui lòng nhập URL và Khóa kết nối trước.'
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      config.activeMethod = 'apps_script';
    } else if (method === 'oauth') {
      if (!config.activeConnection || config.activeConnection.status !== 'active') {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Chưa cấu hình phương thức Google OAuth hoặc tài khoản chưa cấp quyền.'
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      config.activeMethod = 'oauth';
    }

    await saveConfig(config);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Đã kích hoạt phương thức tiếp nhận: ${method === 'apps_script' ? 'Google Apps Script Web App' : 'Google OAuth 2.0'}`,
        activeMethod: config.activeMethod
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || 'Lỗi chuyển đổi phương thức.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

