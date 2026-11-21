/**
 * Google Apps Script Web App Client for NAM HÂN LOGISTICS.
 * Provides secure communication, SSRF prevention, Google 302 redirect handling,
 * and robust error diagnostics.
 */

import type { ContactSubmissionData } from './google-client.ts';

const REQUEST_TIMEOUT_MS = 25000; // 25s timeout for Google Apps Script cold starts

export interface AppsScriptTestResult {
  ok: boolean;
  code?: string;
  message: string;
  sheetTitle?: string;
  spreadsheetId?: string;
  targetTab?: string;
}

export interface AppsScriptSubmitResult {
  success: boolean;
  ok?: boolean;
  code?: string;
  requestId?: string;
  message: string;
  duplicate?: boolean;
}

/**
 * Validates and normalizes Google Apps Script Web App URL.
 * Protects against SSRF and automatically normalizes multi-account URLs (/u/0/, /a/domain/)
 * into universal canonical public Web App URLs.
 */
export function validateAppsScriptUrl(urlString: string): { valid: boolean; canonicalUrl?: string; error?: string } {
  if (!urlString || typeof urlString !== 'string') {
    return { valid: false, error: 'URL ứng dụng web không được để trống.' };
  }

  // Strip leading/trailing whitespace, quotes and backticks commonly included when copying
  const clean = urlString.trim().replace(/^["'`]+|["'`]+$/g, '');
  let parsed: URL;
  try {
    parsed = new URL(clean);
  } catch {
    return { valid: false, error: 'Định dạng URL không hợp lệ. Vui lòng nhập đúng đường link bắt đầu bằng https://.' };
  }

  // 1. Must be HTTPS
  if (parsed.protocol !== 'https:') {
    return { valid: false, error: 'URL phải sử dụng giao thức bảo mật HTTPS.' };
  }

  // 2. Strict Host Whitelist
  const host = parsed.hostname.toLowerCase();
  const allowedHosts = ['script.google.com', 'script.googleusercontent.com'];
  if (!allowedHosts.includes(host)) {
    if (host.includes('docs.google.com')) {
      return {
        valid: false,
        error: `Bạn đang dán link bảng tính Google Sheets (${host}). Vui lòng nhập link "URL ứng dụng web" (bắt đầu bằng script.google.com và kết thúc bằng /exec).`
      };
    }
    return {
      valid: false,
      error: `Tên miền '${host}' không thuộc hệ thống Google Apps Script được phép (chỉ chấp nhận script.google.com).`
    };
  }

  // 3. Path pattern check: must end with /exec
  const rawPath = parsed.pathname.replace(/\/+$/, ''); // Strip trailing slashes
  if (!/\/exec$/i.test(rawPath)) {
    return {
      valid: false,
      error: 'Đường dẫn URL chưa đúng chuẩn Web App. URL phải kết thúc bằng "/exec" (ví dụ: https://script.google.com/macros/s/.../exec).'
    };
  }

  // Extract deployment ID: handles standard /macros/s/<id>/exec, multi-account /macros/u/0/s/<id>/exec,
  // and domain-prefixed /a/<domain>/macros/s/<id>/exec
  const match = rawPath.match(/\/s\/([a-zA-Z0-9_\-\.]+)\/exec/i);
  if (!match || !match[1]) {
    return {
      valid: false,
      error: 'Không tìm thấy Mã triển khai (Deployment ID) hợp lệ trong đường dẫn URL.'
    };
  }

  const deploymentId = match[1];
  if (deploymentId.length < 15) {
    return {
      valid: false,
      error: 'Mã triển khai trong URL quá ngắn hoặc không đúng chuẩn.'
    };
  }

  // 4. No embedded credentials
  if (parsed.username || parsed.password) {
    return { valid: false, error: 'URL không được chứa tên đăng nhập hoặc mật khẩu.' };
  }

  // Return canonical URL without account index or domain prefix for universal public access
  return {
    valid: true,
    canonicalUrl: `https://script.google.com/macros/s/${deploymentId}/exec`
  };
}

/**
 * Helper to execute POST requests to Google Apps Script Web App.
 * Handles Google 302 redirects, timeouts, and HTML-instead-of-JSON error detection.
 */
async function callAppsScript(
  webAppUrl: string,
  payload: Record<string, any>
): Promise<any> {
  const urlCheck = validateAppsScriptUrl(webAppUrl);
  if (!urlCheck.valid) {
    throw new Error(urlCheck.error || 'URL không hợp lệ');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    // Note: Google Apps Script Web Apps reply to POST with HTTP 302 redirecting to script.googleusercontent.com
    // Node.js native fetch follows redirects seamlessly when redirect: 'follow'.
    const targetUrl = (urlCheck.canonicalUrl || webAppUrl).trim();
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain, */*'
      },
      body: JSON.stringify(payload),
      redirect: 'follow',
      signal: controller.signal
    });

    const textBody = await response.text();

    // Check if Google returned an HTML page (indicates deployment authorization issue or script syntax error)
    if (textBody.trim().startsWith('<!DOCTYPE') || textBody.trim().startsWith('<html')) {
      if (textBody.includes('accounts.google.com') || textBody.includes('Sign in')) {
        throw new Error(
          'Google yêu cầu đăng nhập. Khi Triển khai (Deploy) Web App, mục "Ai có quyền truy cập" (Who has access) BẮT BUỘC phải chọn "Bất kỳ ai" (Anyone).'
        );
      }
      if (textBody.includes('Script function not found') || textBody.includes('Script error')) {
        throw new Error(
          'Lỗi thực thi trong Google Apps Script: Kịch bản chưa có hàm doPost hoặc chưa lưu phiên bản mới nhất.'
        );
      }
      throw new Error(
        'Google Apps Script trả về trang web HTML thay vì phản hồi JSON. Vui lòng kiểm tra quyền "Bất kỳ ai" (Anyone) khi Deploy.'
      );
    }

    let json: any;
    try {
      json = JSON.parse(textBody);
    } catch {
      throw new Error(`Google Apps Script trả về dữ liệu không đúng chuẩn JSON: ${textBody.slice(0, 150)}`);
    }

    return json;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error(`Quá thời gian kết nối tới Google Apps Script (${REQUEST_TIMEOUT_MS / 1000}s). Vui lòng thử lại.`);
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Tests connection with Google Apps Script Web App without inserting customer rows.
 */
export async function testAppsScriptConnection(
  webAppUrl: string,
  apiKey: string
): Promise<AppsScriptTestResult> {
  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length < 8) {
    return {
      ok: false,
      code: 'INVALID_KEY',
      message: 'Khóa kết nối (API Key) không được để trống và phải có ít nhất 8 ký tự.'
    };
  }

  try {
    const res = await callAppsScript(webAppUrl, {
      action: 'ping',
      connectionKey: apiKey.trim()
    });

    if (res && res.ok && res.code === 'PONG') {
      return {
        ok: true,
        code: 'PONG',
        message: res.message || 'Kết nối thành công tới Google Apps Script!',
        sheetTitle: res.sheetTitle,
        spreadsheetId: res.spreadsheetId,
        targetTab: res.targetTab
      };
    }

    return {
      ok: false,
      code: res.code || 'TEST_FAILED',
      message: res.message || 'Kiểm tra kết nối thất bại.'
    };
  } catch (err: any) {
    return {
      ok: false,
      code: 'CONNECTION_ERROR',
      message: err.message || 'Không thể kết nối tới Google Apps Script.'
    };
  }
}

/**
 * Sends a contact form submission to Google Apps Script.
 */
export async function submitToAppsScript(
  webAppUrl: string,
  apiKey: string,
  submission: ContactSubmissionData
): Promise<AppsScriptSubmitResult> {
  const payload = {
    action: 'submit',
    connectionKey: apiKey.trim(),
    requestId: submission.requestId,
    customerType: submission.customerType,
    clientName: submission.clientName,
    contactPhone: submission.contactPhone,
    pickupLocation: submission.pickupLocation,
    deliveryLocation: submission.deliveryLocation,
    cargoDescription: submission.cargoDescription,
    cargoWeight: submission.cargoWeight || '',
    notes: submission.notes || '',
    sourceUrl: submission.sourceUrl || '/lien-he/'
  };

  const res = await callAppsScript(webAppUrl, payload);

  if (res && (res.ok || res.success || res.status === 'ok' || res.status === 'success')) {
    return {
      success: true,
      ok: true,
      code: res.code || 'SUCCESS',
      requestId: res.requestId || submission.requestId,
      message: res.message || 'Ghi nhận yêu cầu thành công!',
      duplicate: res.code === 'DUPLICATE_ACCEPTED'
    };
  }

  return {
    success: false,
    ok: false,
    code: res?.code || 'SUBMIT_FAILED',
    message: res?.message || 'Không thể ghi nhận yêu cầu vào Google Sheets.'
  };
}

