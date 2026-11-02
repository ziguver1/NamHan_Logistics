import type { APIRoute } from 'astro';
import { isAuthenticatedAdmin, getAdminSecret } from '../../../../lib/server/admin-auth.ts';
import { getConfig, saveConfig } from '../../../../lib/server/storage.ts';
import { testAppsScriptConnection, validateAppsScriptUrl } from '../../../../lib/server/apps-script-client.ts';
import { encryptData } from '../../../../lib/server/crypto.ts';

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
    const sheetUrl = typeof body.sheetUrl === 'string' ? body.sheetUrl.trim() : '';
    const activateImmediately = body.activateImmediately !== false; // Default true

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
        JSON.stringify({ success: false, error: 'Vui lòng nhập Khóa kết nối (API Key).' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Step 1: Mandatory pre-flight test connection before saving
    const testResult = await testAppsScriptConnection(webAppUrl, apiKey);
    if (!testResult.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Không thể lưu cấu hình vì kết nối thử nghiệm thất bại: ${testResult.message}`
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Step 2: Encrypt API Key securely with admin secret
    const secret = getAdminSecret();
    const encryptedApiKey = await encryptData(apiKey, secret);

    // Step 3: Update configuration
    const config = await getConfig();
    const connectedAt = new Date().toISOString();

    config.appsScriptConnection = {
      webAppUrl,
      encryptedApiKey,
      sheetTitle: testResult.sheetTitle || 'Khách hàng Nam Hân',
      sheetUrl: sheetUrl || (testResult.spreadsheetId ? `https://docs.google.com/spreadsheets/d/${testResult.spreadsheetId}/edit` : ''),
      connectedAt,
      lastTestedAt: connectedAt,
      status: 'active'
    };

    if (activateImmediately) {
      config.activeMethod = 'apps_script';
    }

    await saveConfig(config);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Lưu cấu hình Google Apps Script thành công! Các lượt gửi form liên hệ mới sẽ được tự động ghi vào Google Sheets.',
        connection: {
          webAppUrl,
          sheetTitle: config.appsScriptConnection.sheetTitle,
          sheetUrl: config.appsScriptConnection.sheetUrl,
          connectedAt,
          status: 'active',
          activeMethod: config.activeMethod
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('[Admin AppsScript Save Error]:', err);
    return new Response(
      JSON.stringify({ success: false, error: err.message || 'Lỗi lưu cấu hình.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

