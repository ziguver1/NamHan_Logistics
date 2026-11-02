import type { APIRoute } from 'astro';
import { isAuthenticatedAdmin } from '../../../lib/server/admin-auth.ts';
import { exportNewsBackup, importNewsBackup } from '../../../lib/server/news-storage.ts';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const isAdmin = await isAuthenticatedAdmin(request);
  if (!isAdmin) {
    return new Response(JSON.stringify({ success: false, error: 'UNAUTHORIZED' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const backupData = await exportNewsBackup();
  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = `namhan-news-backup-${dateStr}.json`;

  return new Response(JSON.stringify(backupData, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${filename}"`
    }
  });
};

export const POST: APIRoute = async ({ request }) => {
  const isAdmin = await isAuthenticatedAdmin(request);
  if (!isAdmin) {
    return new Response(JSON.stringify({ success: false, error: 'UNAUTHORIZED' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await request.json().catch(() => null);
    if (!body || !Array.isArray(body.announcements)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Tệp sao lưu không đúng định dạng chuẩn.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const res = await importNewsBackup(body);
    return new Response(
      JSON.stringify({
        success: true,
        message: `Đã khôi phục thành công ${res.importedCount} thông báo!`
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || 'Lỗi khôi phục sao lưu.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

