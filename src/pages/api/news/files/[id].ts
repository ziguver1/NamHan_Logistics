import type { APIRoute } from 'astro';
import { getMediaFile, listAnnouncements, getAnnouncementById } from '../../../../lib/server/news-storage.ts';
import { isAuthenticatedAdmin } from '../../../../lib/server/admin-auth.ts';

export const prerender = false;

export const GET: APIRoute = async ({ params, request }) => {
  const fileId = params.id;
  if (!fileId) {
    return new Response('File not found', { status: 404 });
  }

  const file = await getMediaFile(fileId);
  if (!file) {
    return new Response('File not found', { status: 404 });
  }

  // Check if file is associated with any published announcement
  const publishedList = await listAnnouncements({ status: 'published', includeDeleted: false });
  let isPublished = false;

  for (const item of publishedList) {
    const full = await getAnnouncementById(item.id);
    if (!full) continue;

    // Check cover image
    if (full.coverImage?.url.includes(fileId)) {
      isPublished = true;
      break;
    }
    // Check attachments
    if (full.attachments?.some((att) => att.id === fileId || att.url.includes(fileId))) {
      isPublished = true;
      break;
    }
    // Check in-body content
    if (full.content.includes(fileId)) {
      isPublished = true;
      break;
    }
  }

  // If file is not in any published announcement, require admin authentication
  if (!isPublished) {
    const isAdmin = await isAuthenticatedAdmin(request);
    if (!isAdmin) {
      return new Response('File not found or access denied', { status: 404 });
    }
  }

  const disposition = file.mimeType === 'application/pdf'
    ? `inline; filename="${encodeURIComponent(file.originalName)}"`
    : 'inline';

  return new Response(new Uint8Array(file.buffer), {
    status: 200,
    headers: {
      'Content-Type': file.mimeType,
      'Content-Length': file.sizeBytes.toString(),
      'Content-Disposition': disposition,
      'Cache-Control': isPublished
        ? 'public, max-age=86400, stale-while-revalidate=604800'
        : 'private, no-store'
    }
  });
};
