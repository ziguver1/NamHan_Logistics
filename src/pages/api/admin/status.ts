import type { APIRoute } from 'astro';
import { isAuthenticatedAdmin } from '../../../lib/server/admin-auth.ts';
import { getConfig } from '../../../lib/server/storage.ts';
import { isGoogleConfigured } from '../../../lib/server/google-client.ts';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const isAdmin = await isAuthenticatedAdmin(request);
  if (!isAdmin) {
    return new Response(
      JSON.stringify({ success: false, error: 'UNAUTHORIZED' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const config = await getConfig();
  const configured = isGoogleConfigured();

  // Return connection details without sensitive tokens
  const sanitizeConnection = (conn?: typeof config.activeConnection) => {
    if (!conn) return null;
    return {
      spreadsheetId: conn.spreadsheetId,
      spreadsheetUrl: conn.spreadsheetUrl,
      sheetTitle: conn.sheetTitle,
      accountEmail: conn.accountEmail,
      connectedAt: conn.connectedAt,
      status: conn.status,
      lastError: conn.lastError
    };
  };

  return new Response(
    JSON.stringify({
      success: true,
      configured,
      activeConnection: sanitizeConnection(config.activeConnection),
      pendingConnection: sanitizeConnection(config.pendingConnection)
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
