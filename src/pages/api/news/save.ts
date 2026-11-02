import type { APIRoute } from 'astro';
import { isAuthenticatedAdmin } from '../../../lib/server/admin-auth.ts';
import { saveAnnouncement, getAnnouncementById } from '../../../lib/server/news-storage.ts';
import { sanitizeHtmlContent, generateVietnameseSlug } from '../../../lib/server/html-sanitizer.ts';
import { generateRandomToken } from '../../../lib/server/crypto.ts';
import type { Announcement } from '../../../lib/server/news-types.ts';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const isAdmin = await isAuthenticatedAdmin(request);
  if (!isAdmin) {
    return new Response(
      JSON.stringify({ success: false, error: 'UNAUTHORIZED', message: 'Yêu cầu quyền quản trị viên.' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return new Response(
        JSON.stringify({ success: false, error: 'Dữ liệu yêu cầu không hợp lệ.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const title = typeof body.title === 'string' ? body.title.trim() : '';
    if (!title) {
      return new Response(
        JSON.stringify({ success: false, error: 'Vui lòng nhập tiêu đề thông báo.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    if (title.length > 250) {
      return new Response(
        JSON.stringify({ success: false, error: 'Tiêu đề không được vượt quá 250 ký tự.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let slug = typeof body.slug === 'string' ? body.slug.trim() : '';
    if (!slug) {
      slug = generateVietnameseSlug(title);
    } else {
      slug = generateVietnameseSlug(slug);
    }

    if (!slug) {
      slug = `thong-bao-${Date.now()}`;
    }

    const summary = typeof body.summary === 'string' ? body.summary.trim() : '';
    if (!summary) {
      return new Response(
        JSON.stringify({ success: false, error: 'Vui lòng nhập mô tả ngắn gọn cho thông báo.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    if (summary.length > 500) {
      return new Response(
        JSON.stringify({ success: false, error: 'Mô tả ngắn không được vượt quá 500 ký tự.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const rawContent = typeof body.content === 'string' ? body.content : '';
    const cleanContent = sanitizeHtmlContent(rawContent);

    const isPinned = Boolean(body.isPinned);
    const status = body.status === 'published' ? 'published' : 'draft';

    const existingId = typeof body.id === 'string' && body.id ? body.id : '';
    const id = existingId || `nhl-${Date.now()}-${generateRandomToken(4).toLowerCase()}`;

    const existing = existingId ? await getAnnouncementById(existingId) : null;
    const createdAt = existing ? existing.createdAt : new Date().toISOString();

    const expectedVersion = typeof body.expectedVersion === 'number' ? body.expectedVersion : undefined;

    const announcement: Announcement = {
      id,
      slug,
      title,
      summary,
      content: cleanContent,
      coverImage: body.coverImage && typeof body.coverImage === 'object' ? {
        url: String(body.coverImage.url || ''),
        alt: String(body.coverImage.alt || title),
        caption: body.coverImage.caption ? String(body.coverImage.caption) : undefined
      } : undefined,
      attachments: Array.isArray(body.attachments) ? body.attachments : [],
      isPinned,
      status,
      createdAt,
      publishedAt: status === 'published' ? (existing?.publishedAt || new Date().toISOString()) : existing?.publishedAt,
      updatedAt: new Date().toISOString(),
      version: existing ? existing.version : 1
    };

    const saved = await saveAnnouncement(announcement, expectedVersion);

    return new Response(
      JSON.stringify({
        success: true,
        message: status === 'published' ? 'Đã đăng thông báo thành công!' : 'Đã lưu bản nháp thành công!',
        announcement: saved
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    if (err.code === 'DUPLICATE_SLUG') {
      return new Response(
        JSON.stringify({ success: false, error: err.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    if (err.code === 'CONCURRENCY_CONFLICT') {
      return new Response(
        JSON.stringify({ success: false, error: err.message }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }
    console.error('[News Save Error]:', err);
    return new Response(
      JSON.stringify({ success: false, error: 'Lỗi hệ thống khi lưu thông báo.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

