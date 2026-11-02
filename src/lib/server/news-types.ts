/**
 * Data contracts and types for Official Company Announcements (Bảng tin).
 * NAM HÂN LOGISTICS official notices, operational updates, and bulletins.
 */

export type AnnouncementStatus = 'draft' | 'published' | 'archived' | 'deleted';

export interface AttachmentFile {
  id: string;
  filename: string; // Stored safe filename
  originalName: string; // User-provided label
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string; // ISO
  url: string; // Public or authenticated route e.g. /api/news/files/{id}
}

export interface CoverImage {
  id?: string;
  url: string;
  alt: string;
  caption?: string;
}

export interface Announcement {
  id: string; // Stable UUID
  slug: string; // Unique URL-friendly slug
  title: string;
  summary: string;
  content: string; // Sanitized HTML content
  coverImage?: CoverImage;
  attachments?: AttachmentFile[];
  isPinned: boolean;
  status: AnnouncementStatus;
  createdAt: string; // ISO
  publishedAt?: string; // ISO (when first or last published)
  updatedAt: string; // ISO
  version: number; // Concurrency conflict protection (optimistic locking)
}

export interface AnnouncementSummary {
  id: string;
  slug: string;
  title: string;
  summary: string;
  coverImage?: CoverImage;
  isPinned: boolean;
  status: AnnouncementStatus;
  createdAt: string;
  publishedAt?: string;
  updatedAt: string;
  version: number;
  attachmentCount?: number;
}

export interface NewsDatasetBackup {
  exportDate: string;
  version: string;
  announcements: Announcement[];
}

