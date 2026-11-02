import type { APIRoute } from 'astro';
import { isAuthenticatedAdmin } from '../../../../lib/server/admin-auth.ts';
import { testAppsScriptConnection, validateAppsScriptUrl } from '../../../../lib/server/apps-script-client.ts';

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
    const webAppUrl = typeof body.webAppUrl === 'string' ? body.webAppUrl.trim() : '';
    const apiKey = typeof body.apiKey === 'string' ? body.apiKey.trim() : '';

    if (!webAppUrl) {
      return new Response(
        JSON.stringify({ success: false, error: 'Vui lòng nhập URL ứng dụng web Google Apps Script.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const urlValidation = validateAppsScriptUrl(webAppUrl);
    if (!urlValidation.valid) {
      return new Response(
        JSON.stringify({ success: false, error: urlValidation.error }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Vui lòng nhập Khóa kết nối (API Key) được sinh từ bảng tính.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await testAppsScriptConnection(webAppUrl, apiKey);

    if (result.ok) {
      return new Response(
        JSON.stringify({
          success: true,
          message: result.message || 'Kết nối thành công tới Google Apps Script!',
          sheetTitle: result.sheetTitle,
          spreadsheetId: result.spreadsheetId,
          targetTab: result.targetTab
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: result.message || 'Kiểm tra kết nối thất bại.'
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('[Admin AppsScript Test Error]:', err);
    return new Response(
      JSON.stringify({ success: false, error: err.message || 'Lỗi kiểm tra kết nối.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

