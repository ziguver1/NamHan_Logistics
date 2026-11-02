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
  if (!config.pendingConnection) {
    return new Response(
      JSON.stringify({ success: false, error: 'Không có tài khoản mới nào đang chờ xác nhận.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Promote pendingConnection to activeConnection
  config.activeConnection = {
    ...config.pendingConnection,
    status: 'active'
  };
  delete config.pendingConnection;

  await saveConfig(config);

  return new Response(
    JSON.stringify({
      success: true,
      message: 'Đã chuyển thành công sang tài khoản Google mới. Các yêu cầu form mới sẽ được ghi vào bảng tính này.',
      activeConnection: {
        spreadsheetId: config.activeConnection.spreadsheetId,
        spreadsheetUrl: config.activeConnection.spreadsheetUrl,
        sheetTitle: config.activeConnection.sheetTitle,
        accountEmail: config.activeConnection.accountEmail,
        connectedAt: config.activeConnection.connectedAt,
        status: config.activeConnection.status
      }
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
