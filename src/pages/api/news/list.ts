import type { APIRoute } from 'astro';
import { listAnnouncements } from '../../../lib/server/news-storage.ts';
import { isAuthenticatedAdmin } from '../../../lib/server/admin-auth.ts';

export const prerender = false;

export const GET: APIRoute = async ({ request, url }) => {
  const isAdmin = await isAuthenticatedAdmin(request);
  const statusParam = url.searchParams.get('status') as any;
  const searchParam = url.searchParams.get('search') || '';
  const includeDeleted = url.searchParams.get('includeDeleted') === 'true';

  // If not admin, strictly allow only published announcements and no deleted
  if (!isAdmin) {
    const list = await listAnnouncements({
      status: 'published',
      search: searchParam,
      includeDeleted: false
    });
    return new Response(JSON.stringify({ success: true, list }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60'
      }
    });
  }

  // Admin access: can view drafts, deleted, etc.
  const list = await listAnnouncements({
    status: statusParam || 'all',
    search: searchParam,
    includeDeleted
  });

  return new Response(JSON.stringify({ success: true, list }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'private, no-cache'
    }
  });
};

