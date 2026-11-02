/**
 * Google OAuth 2.0 and Google Sheets API v4 Integration.
 * Implements server-side authorization code flow, spreadsheet creation,
 * formula injection prevention, and safe appending.
 */

import { decryptData } from './crypto.ts';
import { getAdminSecret } from './admin-auth.ts';

const GOOGLE_AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_ENDPOINT = 'https://www.googleapis.com/oauth2/v2/userinfo';
const GOOGLE_SHEETS_ENDPOINT = 'https://sheets.googleapis.com/v4/spreadsheets';

const SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/userinfo.email'
];

export interface ContactSubmissionData {
  requestId: string;
  createdAt: string;
  customerType: string;
  clientName: string;
  contactPhone: string;
  pickupLocation: string;
  deliveryLocation: string;
  cargoDescription: string;
  cargoWeight?: string;
  sourceUrl?: string;
}

export function getGoogleClientId(): string {
  return process.env.GOOGLE_CLIENT_ID || '';
}

export function getGoogleClientSecret(): string {
  return process.env.GOOGLE_CLIENT_SECRET || '';
}

export function getGoogleRedirectUri(origin?: string): string {
  if (process.env.GOOGLE_REDIRECT_URI) {
    return process.env.GOOGLE_REDIRECT_URI;
  }
  // Fallback to origin if provided (e.g. from incoming request URL)
  if (origin) {
    return `${origin}/api/auth/google/callback`;
  }
  return 'http://localhost:4321/api/auth/google/callback';
}

export function isGoogleConfigured(): boolean {
  return Boolean(getGoogleClientId() && getGoogleClientSecret());
}

/**
 * Builds the Google OAuth consent authorization URL.
 */
export function buildGoogleAuthUrl(state: string, redirectUriOverride?: string): string {
  const clientId = getGoogleClientId();
  const redirectUri = redirectUriOverride || getGoogleRedirectUri();

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: SCOPES.join(' '),
    access_type: 'offline', // Requests refresh_token
    prompt: 'consent', // Forces consent screen to ensure refresh_token is returned
    include_granted_scopes: 'true',
    state
  });

  return `${GOOGLE_AUTH_ENDPOINT}?${params.toString()}`;
}

/**
 * Exchanges the authorization code for tokens and fetches user email.
 */
export async function exchangeCodeForTokens(
  code: string,
  redirectUriOverride?: string
): Promise<{ refreshToken: string; accessToken: string; email: string }> {
  const clientId = getGoogleClientId();
  const clientSecret = getGoogleClientSecret();
  const redirectUri = redirectUriOverride || getGoogleRedirectUri();

  const tokenRes = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    })
  });

  if (!tokenRes.ok) {
    const errorText = await tokenRes.text();
    throw new Error(`Google token exchange failed (${tokenRes.status}): ${errorText}`);
  }

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;
  const refreshToken = tokenData.refresh_token;

  if (!refreshToken) {
    throw new Error('Google did not return a refresh token. Make sure prompt=consent and access_type=offline are configured.');
  }

  // Fetch account email for dashboard display
  let email = 'unknown@google.com';
  try {
    const userRes = await fetch(GOOGLE_USERINFO_ENDPOINT, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (userRes.ok) {
      const userData = await userRes.json();
      if (userData.email) email = userData.email;
    }
  } catch (err) {
    console.warn('[Google] Could not retrieve user email:', err);
  }

  return { refreshToken, accessToken, email };
}

/**
 * Uses a refresh token to obtain a fresh access token.
 */
export async function getFreshAccessToken(encryptedRefreshToken: string): Promise<string> {
  const secret = getAdminSecret();
  const refreshToken = await decryptData(encryptedRefreshToken, secret);
  const clientId = getGoogleClientId();
  const clientSecret = getGoogleClientSecret();

  const tokenRes = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    })
  });

  if (!tokenRes.ok) {
    const errorData = await tokenRes.json().catch(() => ({}));
    if (errorData.error === 'invalid_grant') {
      const err = new Error('REFRESH_TOKEN_EXPIRED');
      (err as any).code = 'NEEDS_REAUTH';
      throw err;
    }
    throw new Error(`Google token refresh failed (${tokenRes.status}): ${JSON.stringify(errorData)}`);
  }

  const data = await tokenRes.json();
  return data.access_token;
}

/**
 * Creates the "Khách hàng Nam Hân" spreadsheet with formatted headers.
 */
export async function createNamHanSpreadsheet(accessToken: string): Promise<{
  id: string;
  url: string;
  title: string;
}> {
  const title = 'Khách hàng Nam Hân';
  const headers = [
    'Mã yêu cầu',
    'Thời gian',
    'Loại khách hàng',
    'Tên công ty / Họ tên',
    'Số điện thoại / Zalo',
    'Điểm đi',
    'Điểm đến',
    'Mô tả hàng hóa',
    'Khối lượng / Số lượng',
    'Nguồn form'
  ];

  const payload = {
    properties: {
      title
    },
    sheets: [
      {
        properties: {
          title: 'Yêu cầu vận chuyển',
          gridProperties: {
            frozenRowCount: 1
          }
        },
        data: [
          {
            startRow: 0,
            startColumn: 0,
            rowData: [
              {
                values: headers.map((h) => ({
                  userEnteredValue: { stringValue: h },
                  userEnteredFormat: {
                    textFormat: { bold: true },
                    backgroundColor: { red: 0.94, green: 0.96, blue: 0.98 }
                  }
                }))
              }
            ]
          }
        ]
      }
    ]
  };

  const createRes = await fetch(GOOGLE_SHEETS_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`Failed to create Google Spreadsheet (${createRes.status}): ${errText}`);
  }

  const result = await createRes.json();
  const id = result.spreadsheetId;
  const url = result.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${id}/edit`;

  return { id, url, title };
}

/**
 * Sanitizes input values to prevent Formula/CSV injection in spreadsheets.
 * Ensures phone numbers preserve leading zeroes.
 */
export function sanitizeCellValue(val: unknown, isPhone = false): string {
  if (val === null || val === undefined) return '';
  let str = String(val).trim();

  if (isPhone) {
    // Preserve leading zero by prepending single quote
    const cleanedPhone = str.replace(/[^\d+ \-().]/g, '');
    return `'${cleanedPhone}`;
  }

  // Check for formula injection indicators (=, +, -, @, tab, cr)
  if (/^[=+\-@\t\r]/.test(str)) {
    return `'${str}`;
  }

  return str;
}

/**
 * Appends a contact submission row into the Google Sheet.
 */
export async function appendContactSubmission(
  spreadsheetId: string,
  accessToken: string,
  data: ContactSubmissionData
): Promise<{ updatedRows: number }> {
  const rowValues = [
    sanitizeCellValue(data.requestId),
    sanitizeCellValue(data.createdAt),
    sanitizeCellValue(data.customerType === 'business' ? 'Doanh nghiệp' : 'Cá nhân'),
    sanitizeCellValue(data.clientName),
    sanitizeCellValue(data.contactPhone, true),
    sanitizeCellValue(data.pickupLocation),
    sanitizeCellValue(data.deliveryLocation),
    sanitizeCellValue(data.cargoDescription),
    sanitizeCellValue(data.cargoWeight || ''),
    sanitizeCellValue(data.sourceUrl || '/lien-he/')
  ];

  const appendUrl = `${GOOGLE_SHEETS_ENDPOINT}/${encodeURIComponent(spreadsheetId)}/values/A1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const appendRes = await fetch(appendUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      range: 'A1',
      majorDimension: 'ROWS',
      values: [rowValues]
    })
  });

  if (!appendRes.ok) {
    const errorText = await appendRes.text();
    throw new Error(`Google Sheets append failed (${appendRes.status}): ${errorText}`);
  }

  const result = await appendRes.json();
  const updatedRows = result.updates?.updatedRows || 1;

  return { updatedRows };
}
