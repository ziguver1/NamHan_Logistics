import type { APIRoute } from 'astro';
import { getConfig, saveConfig, hasSeenRequestId, markRequestIdSeen } from '../../../lib/server/storage.ts';
import { getFreshAccessToken, appendContactSubmission, type ContactSubmissionData } from '../../../lib/server/google-client.ts';

export const prerender = false;

// Max allowable request size: 50 KB
const MAX_BODY_BYTES = 50 * 1024;

export const POST: APIRoute = async ({ request }) => {
  try {
    // 1. Check content-length header
    const contentLength = parseInt(request.headers.get('content-length') || '0', 10);
    if (contentLength > MAX_BODY_BYTES) {
      return new Response(
        JSON.stringify({ success: false, error: 'Dung lượng yêu cầu vượt quá giới hạn cho phép.' }),
        { status: 413, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Parse payload
    const contentType = request.headers.get('content-type') || '';
    let payload: Record<string, any> = {};

    if (contentType.includes('application/json')) {
      payload = await request.json().catch(() => ({}));
    } else {
      const formData = await request.formData().catch(() => null);
      if (formData) {
        for (const [key, value] of formData.entries()) {
          payload[key] = typeof value === 'string' ? value : '';
        }
      }
    }

    // 3. Honeypot check (Anti-spam)
    if (payload.company_tax_id_bypass || payload.website_honeypot) {
      return new Response(
        JSON.stringify({ success: false, error: 'Phát hiện yêu cầu không hợp lệ.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 4. Validate and sanitize inputs
    const customerType = payload.customerType === 'individual' ? 'individual' : 'business';
    const clientName = typeof payload.clientName === 'string' ? payload.clientName.trim() : '';
    const pickupLocation = typeof payload.pickupLocation === 'string' ? payload.pickupLocation.trim() : '';
    const deliveryLocation = typeof payload.deliveryLocation === 'string' ? payload.deliveryLocation.trim() : '';
    const cargoDescription = typeof payload.cargoDescription === 'string' ? payload.cargoDescription.trim() : '';
    const cargoWeight = typeof payload.cargoWeight === 'string' ? payload.cargoWeight.trim() : '';
    const contactPhone = typeof payload.contactPhone === 'string' ? payload.contactPhone.trim() : '';
    const sourceUrl = typeof payload.sourceUrl === 'string' ? payload.sourceUrl.trim() : '/lien-he/';

    // Generate or sanitize requestId
    let requestId = typeof payload.requestId === 'string' ? payload.requestId.trim() : '';
    if (!requestId || requestId.length > 50) {
      requestId = `NHL-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    }

    // Validation rules
    const errors: Record<string, string> = {};

    if (!clientName) {
      errors.clientName = 'Vui lòng nhập tên công ty hoặc họ tên.';
    } else if (clientName.length > 150) {
      errors.clientName = 'Tên công ty / họ tên không được vượt quá 150 ký tự.';
    }

    if (!pickupLocation) {
      errors.pickupLocation = 'Vui lòng nhập địa điểm lấy hàng.';
    } else if (pickupLocation.length > 200) {
      errors.pickupLocation = 'Địa điểm lấy hàng không được vượt quá 200 ký tự.';
    }

    if (!deliveryLocation) {
      errors.deliveryLocation = 'Vui lòng nhập địa điểm giao hàng.';
    } else if (deliveryLocation.length > 200) {
      errors.deliveryLocation = 'Địa điểm giao hàng không được vượt quá 200 ký tự.';
    }

    if (!cargoDescription) {
      errors.cargoDescription = 'Vui lòng mô tả loại hàng hóa cần vận chuyển.';
    } else if (cargoDescription.length > 1500) {
      errors.cargoDescription = 'Mô tả hàng hóa không được vượt quá 1500 ký tự.';
    }

    if (cargoWeight && cargoWeight.length > 200) {
      errors.cargoWeight = 'Khối lượng / số lượng không được vượt quá 200 ký tự.';
    }

    // Phone validation: 9-25 chars, contains mostly digits with standard symbols
    const phoneDigits = contactPhone.replace(/\D/g, '');
    if (!contactPhone || phoneDigits.length < 9 || phoneDigits.length > 15) {
      errors.contactPhone = 'Vui lòng nhập số điện thoại hoặc Zalo hợp lệ (từ 9 đến 15 chữ số).';
    }

    if (Object.keys(errors).length > 0) {
      return new Response(
        JSON.stringify({ success: false, errors, message: 'Dữ liệu nhập chưa hợp lệ, vui lòng kiểm tra lại.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 5. Idempotency check: prevent duplicate submissions
    const isDuplicate = await hasSeenRequestId(requestId);
    if (isDuplicate) {
      return new Response(
        JSON.stringify({
          success: true,
          duplicate: true,
          requestId,
          message: 'Yêu cầu của bạn đã được ghi nhận thành công trước đó.'
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 6. Check Google Sheets connection
    const config = await getConfig();
    const activeConn = config.activeConnection;

    if (!activeConn || activeConn.status !== 'active') {
      console.warn('[Contact Submit] No active Google Sheets connection. Status:', activeConn?.status);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'SYSTEM_NOT_CONNECTED',
          message: 'Hệ thống tiếp nhận tự động đang bảo trì hoặc chưa kết nối Google Sheets. Quý khách vui lòng liên hệ Hotline trực tiếp để được phục vụ ngay.'
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 7. Get fresh access token
    let accessToken: string;
    try {
      accessToken = await getFreshAccessToken(activeConn.encryptedRefreshToken);
    } catch (err: any) {
      console.error('[Contact Submit] Error refreshing Google token:', err);
      if (err.code === 'NEEDS_REAUTH') {
        activeConn.status = 'needs_reauth';
        activeConn.lastError = 'Refresh token expired or revoked. Re-authorization required in admin.';
        await saveConfig(config);
      }
      return new Response(
        JSON.stringify({
          success: false,
          error: 'AUTH_FAILED',
          message: 'Hệ thống kết nối Google Sheets cần cấp quyền lại. Vui lòng liên hệ Hotline trực tiếp để được tư vấn ngay.'
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 8. Format Vietnam timestamp (UTC+7)
    const nowUtc = new Date();
    const vnTime = new Date(nowUtc.getTime() + 7 * 60 * 60 * 1000);
    const pad = (n: number) => n.toString().padStart(2, '0');
    const createdAtVn = `${pad(vnTime.getUTCDate())}/${pad(vnTime.getUTCMonth() + 1)}/${vnTime.getUTCFullYear()} ${pad(vnTime.getUTCHours())}:${pad(vnTime.getUTCMinutes())}:${pad(vnTime.getUTCSeconds())}`;

    // 9. Append to Google Sheet
    const submissionData: ContactSubmissionData = {
      requestId,
      createdAt: createdAtVn,
      customerType,
      clientName,
      contactPhone,
      pickupLocation,
      deliveryLocation,
      cargoDescription,
      cargoWeight,
      sourceUrl
    };

    await appendContactSubmission(activeConn.spreadsheetId, accessToken, submissionData);

    // 10. Record requestId to prevent duplicate submits
    await markRequestIdSeen(requestId);

    return new Response(
      JSON.stringify({
        success: true,
        requestId,
        message: 'Gửi yêu cầu vận chuyển thành công! Đội ngũ Nam Hân Logistics sẽ liên hệ lại với quý khách trong thời gian sớm nhất.'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('[Contact Submit System Error]:', err);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'INTERNAL_ERROR',
        message: 'Đã xảy ra lỗi khi ghi nhận yêu cầu. Quý khách vui lòng thử lại hoặc gọi Hotline để được hỗ trợ kịp thời.'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
