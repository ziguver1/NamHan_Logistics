import type { APIRoute } from 'astro';
import { isAuthenticatedAdmin } from '../../../lib/server/admin-auth.ts';
import { saveMediaFile } from '../../../lib/server/news-storage.ts';
import { generateRandomToken } from '../../../lib/server/crypto.ts';

export const prerender = false;

// Max allowed sizes
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_MIME_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'application/pdf': 'pdf'
};

/**
 * Validates magic bytes to ensure file content is not spoofed.
 */
function validateMagicBytes(buf: Buffer, mimeType: string): boolean {
  if (buf.length < 8) return false;

  // PNG: 89 50 4E 47
  if (mimeType === 'image/png') {
    return buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
  }

  // JPEG: FF D8 FF
  if (mimeType === 'image/jpeg') {
    return buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
  }

  // WebP: RIFF ... WEBP
  if (mimeType === 'image/webp') {
    const isRiff = buf.subarray(0, 4).toString('ascii') === 'RIFF';
    const isWebp = buf.subarray(8, 12).toString('ascii') === 'WEBP';
    return isRiff && isWebp;
  }

  // PDF: %PDF (25 50 44 46)
  if (mimeType === 'application/pdf') {
    return buf.subarray(0, 4).toString('ascii') === '%PDF';
  }

  return false;
}

export const POST: APIRoute = async ({ request }) => {
  const isAdmin = await isAuthenticatedAdmin(request);
  if (!isAdmin) {
    return new Response(
      JSON.stringify({ success: false, error: 'UNAUTHORIZED' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const formData = await request.formData().catch(() => null);
    if (!formData) {
      return new Response(
        JSON.stringify({ success: false, error: 'Không tìm thấy dữ liệu tệp tải lên.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const file = formData.get('file') as File | null;
    if (!file || typeof file.arrayBuffer !== 'function') {
      return new Response(
        JSON.stringify({ success: false, error: 'Vui lòng chọn một tệp hợp lệ.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const mimeType = file.type.toLowerCase();
    const ext = ALLOWED_MIME_TYPES[mimeType];

    if (!ext) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Loại tệp không được hỗ trợ. Chỉ chấp nhận ảnh (JPEG, PNG, WebP) hoặc tài liệu PDF. Không hỗ trợ SVG hoặc HTML.'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Size limit check
    const maxLimit = mimeType === 'application/pdf' ? MAX_PDF_SIZE : MAX_IMAGE_SIZE;
    if (file.size > maxLimit) {
      const limitMb = maxLimit / (1024 * 1024);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Dung lượng tệp (${(file.size / (1024 * 1024)).toFixed(1)} MB) vượt quá giới hạn tối đa ${limitMb} MB.`
        }),
        { status: 413, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Read buffer & check magic bytes
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!validateMagicBytes(buffer, mimeType)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Nội dung tệp không hợp lệ hoặc đã bị thay đổi phần mở rộng. Thao tác bị từ chối vì lý do bảo mật.'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Clean original filename
    const originalName = file.name
      ? file.name.replace(/[^\w\s.-]/gi, '').trim().slice(0, 100)
      : `file.${ext}`;

    // Generate secure unpredictable file ID
    const fileId = `${Date.now()}_${generateRandomToken(8)}.${ext}`;

    const attachment = await saveMediaFile(fileId, buffer, {
      originalName,
      mimeType
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Tải lên tệp thành công!',
        file: attachment
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('[Upload Error]:', err);
    return new Response(
      JSON.stringify({ success: false, error: 'Lỗi máy chủ khi lưu tệp tải lên.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

