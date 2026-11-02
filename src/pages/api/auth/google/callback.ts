import type { APIRoute } from 'astro';
import { isAuthenticatedAdmin, verifyOAuthState, getAdminSecret } from '../../../../lib/server/admin-auth.ts';
import { exchangeCodeForTokens, createNamHanSpreadsheet } from '../../../../lib/server/google-client.ts';
import { encryptData } from '../../../../lib/server/crypto.ts';
import { getConfig, saveConfig } from '../../../../lib/server/storage.ts';

export const prerender = false;

export const GET: APIRoute = async ({ request, url, redirect }) => {
  const isAdmin = await isAuthenticatedAdmin(request);
  if (!isAdmin) {
    return redirect('/admin/google-sheets?error=unauthorized');
  }

  const errorParam = url.searchParams.get('error');
  if (errorParam) {
    console.warn('[Google OAuth Callback Error]:', errorParam);
    return redirect(`/admin/google-sheets?error=${encodeURIComponent(errorParam)}`);
  }

  const state = url.searchParams.get('state');
  const code = url.searchParams.get('code');

  if (!state || !code) {
    return redirect('/admin/google-sheets?error=missing_parameters');
  }

  // Verify CSRF state token
  const isStateValid = await verifyOAuthState(state);
  if (!isStateValid) {
    return redirect('/admin/google-sheets?error=invalid_state');
  }

  try {
    const origin = url.origin;
    const redirectUri = `${origin}/api/auth/google/callback`;

    // 1. Exchange code for tokens
    const { refreshToken, accessToken, email } = await exchangeCodeForTokens(code, redirectUri);

    // 2. Create the "Khách hàng Nam Hân" spreadsheet in user's Drive
    const sheet = await createNamHanSpreadsheet(accessToken);

    // 3. Encrypt the refresh token
    const secret = getAdminSecret();
    const encryptedRefreshToken = await encryptData(refreshToken, secret);

    // 4. Update configuration
    const config = await getConfig();

    const connectionData = {
      spreadsheetId: sheet.id,
      spreadsheetUrl: sheet.url,
      sheetTitle: sheet.title,
      accountEmail: email,
      connectedAt: new Date().toISOString(),
      encryptedRefreshToken,
      status: 'active' as const
    };

    if (config.activeConnection) {
      // Staged switch: keep current active connection intact until admin explicitly confirms
      config.pendingConnection = connectionData;
      await saveConfig(config);
      return redirect('/admin/google-sheets?notice=account_pending_confirm');
    } else {
      // First-time connection
      config.activeConnection = connectionData;
      await saveConfig(config);
      return redirect('/admin/google-sheets?success=connected');
    }
  } catch (err: any) {
    console.error('[Google OAuth Exchange Error]:', err);
    const msg = err.message || 'Lỗi không xác định khi kết nối với Google.';
    return redirect(`/admin/google-sheets?error=${encodeURIComponent(msg)}`);
  }
};
