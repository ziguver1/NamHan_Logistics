import type { APIRoute } from 'astro';
import { isAuthenticatedAdmin, generateOAuthState } from '../../../../lib/server/admin-auth.ts';
import { isGoogleConfigured, buildGoogleAuthUrl } from '../../../../lib/server/google-client.ts';

export const prerender = false;

export const GET: APIRoute = async ({ request, url, redirect }) => {
  const isAdmin = await isAuthenticatedAdmin(request);
  if (!isAdmin) {
    return redirect('/admin/google-sheets?error=unauthorized');
  }

  if (!isGoogleConfigured()) {
    return redirect('/admin/google-sheets?error=not_configured');
  }

  const state = await generateOAuthState();
  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
  const origin = forwardedHost ? `${forwardedProto}://${forwardedHost}` : url.origin;
  const redirectUri = `${origin}/api/auth/google/callback`;
  const authUrl = buildGoogleAuthUrl(state, redirectUri);

  return redirect(authUrl);
};
