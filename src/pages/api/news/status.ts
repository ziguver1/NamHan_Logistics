import type { APIRoute } from 'astro';
import { isAuthenticatedAdmin } from '../../../lib/server/admin-auth.ts';
import {
  getAnnouncementById,
  saveAnnouncement,
  softDeleteAnnouncement,
  restoreAnnouncement,
  hardDeleteAnnouncement
} from '../../../lib/server/news-storage.ts';

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
    const body = await request.json().catch(() => null);
    const id = body?.id;
    const action = body?.action;

    if (!id || typeof id !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: 'Thiếu ID thông báo.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'trash') {
      await softDeleteAnnouncement(id);
      return new Response(
        JSON.stringify({ success: true, message: 'Đã chuyển thông báo vào thùng rác.' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'restore') {
      await restoreAnnouncement(id);
      return new Response(
        JSON.stringify({ success: true, message: 'Đã khôi phục thông báo về bản nháp.' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'delete') {
      await hardDeleteAnnouncement(id);
      return new Response(
        JSON.stringify({ success: true, message: 'Đã xóa vĩnh viễn thông báo.' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const article = await getAnnouncementById(id);
    if (!article) {
      return new Response(
        JSON.stringify({ success: false, error: 'Không tìm thấy thông báo.' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'publish') {
      article.status = 'published';
      if (!article.publishedAt) {
        article.publishedAt = new Date().toISOString();
      }
      await saveAnnouncement(article, article.version);
      return new Response(
        JSON.stringify({ success: true, message: 'Đã xuất bản thông báo thành công!' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'unpublish') {
      article.status = 'draft';
      await saveAnnouncement(article, article.version);
      return new Response(
        JSON.stringify({ success: true, message: 'Đã gỡ đăng thông báo (chuyển về bản nháp).' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'toggle-pin') {
      article.isPinned = !article.isPinned;
      await saveAnnouncement(article, article.version);
      return new Response(
        JSON.stringify({
          success: true,
          message: article.isPinned ? 'Đã ghim thông báo lên đầu.' : 'Đã bỏ ghim thông báo.',
          isPinned: article.isPinned
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Hành động không hợp lệ.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('[News Status Action Error]:', err);
    return new Response(
      JSON.stringify({ success: false, error: err.message || 'Lỗi xử lý trạng thái.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

