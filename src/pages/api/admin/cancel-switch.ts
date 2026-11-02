import type { APIRoute } from 'astro';
import { isAuthenticatedAdmin } from '../../../lib/server/admin-auth.ts';
import { getConfig, saveConfig } from '../../../lib/server/storage.ts';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const isAdmin = await isAuthenticatedAdmin(request);
  if (!isAdmin) {
    return new Response(
      JSON.stringify({ success: false, error: 'UNAUTHORIZED' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const config = await getConfig();
  if (config.pendingConnection) {
    delete config.pendingConnection;
    await saveConfig(config);
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: 'Đã hủy bỏ liên kết tài khoản mới. Kết nối hiện tại vẫn tiếp tục hoạt động bình thường.'
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
