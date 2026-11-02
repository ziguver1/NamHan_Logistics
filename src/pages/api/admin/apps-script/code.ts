import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';
import { isAuthenticatedAdmin } from '../../../../lib/server/admin-auth.ts';

export const prerender = false;

const CODE_GS_PATH = path.resolve('./integrations/google-apps-script/Code.gs');
const MANIFEST_PATH = path.resolve('./integrations/google-apps-script/appsscript.json');

export const GET: APIRoute = async ({ request }) => {
  const isAdmin = await isAuthenticatedAdmin(request);
  if (!isAdmin) {
    return new Response(
      JSON.stringify({ success: false, error: 'UNAUTHORIZED' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const [code, manifest] = await Promise.all([
      fs.readFile(CODE_GS_PATH, 'utf8').catch(() => ''),
      fs.readFile(MANIFEST_PATH, 'utf8').catch(() => '')
    ]);

    return new Response(
      JSON.stringify({ success: true, code, manifest }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || 'Lỗi đọc mã nguồn.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
  const isAdmin = await isAuthenticatedAdmin(request);
  if (!isAdmin) {
    return new Response(
      JSON.stringify({ success: false, error: 'UNAUTHORIZED' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const code = typeof body.code === 'string' ? body.code : null;
    const manifest = typeof body.manifest === 'string' ? body.manifest : null;

    if (code === null && manifest === null) {
      return new Response(
        JSON.stringify({ success: false, error: 'Không có dữ liệu mã để lưu.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (code !== null) {
      await fs.writeFile(CODE_GS_PATH, code, 'utf8');
    }

    if (manifest !== null) {
      await fs.writeFile(MANIFEST_PATH, manifest, 'utf8');
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Lưu mã nguồn Google Apps Script thành công! Bạn có thể bấm "Sao chép mã" để dán sang Google Sheet.'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || 'Lỗi lưu mã nguồn.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

