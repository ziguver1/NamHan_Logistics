/**
 * Admin authentication and session management.
 * Protects administrative configuration routes and Google OAuth workflows.
 */

import { signSession, verifySession, generateRandomToken } from './crypto.ts';

const COOKIE_NAME = 'nhl_admin_session';
const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

export function getAdminSecret(): string {
  const secret = process.env.ADMIN_SECRET;
  if (secret && secret.length >= 16) {
    return secret;
  }
  // Resilient fallback for local dev
  return process.env.GOOGLE_CLIENT_SECRET || 'namhan-logistics-admin-secret-dev-key-2026';
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || 'namhan@2026';
}

/**
 * Checks if the request contains a valid admin session cookie.
 */
export async function isAuthenticatedAdmin(request: Request): Promise<boolean> {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = parseCookies(cookieHeader);
  const sessionToken = cookies[COOKIE_NAME];

  if (!sessionToken) return false;

  const secret = getAdminSecret();
  const payload = await verifySession(sessionToken, secret);
  if (!payload) return false;

  try {
    const data = JSON.parse(payload);
    if (data.role === 'admin' && data.exp && data.exp > Date.now()) {
      return true;
    }
  } catch {
    return false;
  }

  return false;
}

/**
 * Creates an HTTP-only Set-Cookie header string for an authenticated admin session.
 */
export async function createAdminSessionCookie(isSecure = false): Promise<string> {
  const secret = getAdminSecret();
  const payload = JSON.stringify({
    role: 'admin',
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
    nonce: generateRandomToken(8)
  });

  const signedToken = await signSession(payload, secret);
  const secureFlag = isSecure ? 'Secure;' : '';

  return `${COOKIE_NAME}=${signedToken}; Path=/; Max-Age=${SESSION_MAX_AGE_SECONDS}; HttpOnly; SameSite=Lax; ${secureFlag}`.trim();
}

/**
 * Creates an expired Set-Cookie header to log out the admin.
 */
export function createAdminLogoutCookie(): string {
  return `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax;`;
}

/**
 * Generates a signed CSRF state token for OAuth flows.
 */
export async function generateOAuthState(): Promise<string> {
  const secret = getAdminSecret();
  const payload = JSON.stringify({
    timestamp: Date.now(),
    nonce: generateRandomToken(12)
  });

  return signSession(payload, secret);
}

/**
 * Validates the OAuth CSRF state token (expires after 15 minutes).
 */
export async function verifyOAuthState(state: string): Promise<boolean> {
  if (!state) return false;
  const secret = getAdminSecret();
  const payload = await verifySession(state, secret);
  if (!payload) return false;

  try {
    const data = JSON.parse(payload);
    // 15 minutes expiry
    if (Date.now() - data.timestamp < 15 * 60 * 1000) {
      return true;
    }
  } catch {
    return false;
  }

  return false;
}

function parseCookies(header: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!header) return result;

  const pairs = header.split(';');
  for (const pair of pairs) {
    const [name, ...rest] = pair.trim().split('=');
    if (name) {
      result[name] = decodeURIComponent(rest.join('='));
    }
  }

  return result;
}
