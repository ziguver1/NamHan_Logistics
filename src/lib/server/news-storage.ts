/**
 * Persistent Storage Layer for Announcements & Media Files.
 * Uses Netlify Blobs in Production, with safe local filesystem storage for local development.
 * Strict compliance: Will NOT silently fallback to local storage in production.
 */

import fs from 'node:fs';
import path from 'node:path';
import type {
  Announcement,
  AnnouncementSummary,
  AnnouncementStatus,
  AttachmentFile,
  NewsDatasetBackup
} from './news-types.ts';

const STORE_NAME = 'namhan_news';
const INDEX_KEY = 'announcements_index';

const LOCAL_DATA_DIR = path.resolve(process.cwd(), '.data', 'news');
const LOCAL_MEDIA_DIR = path.resolve(process.cwd(), '.data', 'media');

const isProductionEnv = Boolean(process.env.NETLIFY || (import.meta as any).env?.NETLIFY);

async function getNetlifyBlobStore() {
  try {
    const { getStore } = await import('@netlify/blobs');
    return getStore(STORE_NAME);
  } catch (err) {
    if (isProductionEnv) {
      throw new Error(`[NewsStorage] Netlify Blobs unavailable in production: ${err instanceof Error ? err.message : String(err)}`);
    }
    return null;
  }
}

/**
 * Initializes local storage directories if running in dev.
 */
function ensureLocalDirs() {
  if (!fs.existsSync(LOCAL_DATA_DIR)) {
    fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(LOCAL_MEDIA_DIR)) {
    fs.mkdirSync(LOCAL_MEDIA_DIR, { recursive: true });
  }
}

// Initial baseline seed data (3 official notices matching design)
const INITIAL_SEEDS: Announcement[] = [
  {
    id: 'nhl-seed-001',
    slug: 'toi-uu-hoa-hanh-trinh-van-tai-hang-hoa-lien-tinh-bac-nam',
    title: 'Tối ưu hóa hành trình vận tải hàng hóa liên tỉnh Bắc — Nam mùa cao điểm cuối năm',
    summary: 'Phân tích các giải pháp điều phối xe thông minh giúp doanh nghiệp giảm chi phí lưu kho và đảm bảo tiến độ giao nhận trong thời gian cao điểm.',
    content: '<p>Bước vào quý IV hàng năm, lưu lượng vận chuyển hàng hóa giữa hai đầu cầu kinh tế Hà Nội — TP. Hồ Chí Minh luôn tăng từ 35% đến 50%. Để đáp ứng nhu cầu tăng trưởng mạnh mẽ của các doanh nghiệp đối tác, Nam Hân Logistics đã chủ động kích hoạt phương án điều phối tập trung trên toàn tuyến Quốc lộ 1A và Cao tốc Bắc — Nam.</p><h2>1. Tăng cường năng lực đầu kéo và sơ-mi rơ-moóc</h2><p>Đội xe của Nam Hân được bổ sung các dòng xe tải thùng kín và xe container tải trọng lớn, thực hiện bảo dưỡng định kỳ toàn diện trước khi xuất bến. Mỗi xe đều trang bị hệ thống định vị GPS trực tuyến và cảm biến hành trình 24/7.</p><h2>2. Rút ngắn thời gian luân chuyển hàng hóa</h2><p>Nhờ quy trình xếp dỡ cơ giới hóa tại hai bãi xe trung tâm (Hà Nội & Bình Dương) kết hợp trạm dừng kỹ thuật Bỉm Sơn, thời gian toàn trình tuyến Hà Nội — TP.HCM duy trì ổn định ở mức 48 – 60 giờ.</p><p>Nam Hân Logistics cam kết giữ vững cam kết về cước phí cạnh tranh, đảm bảo không tăng giá đột biến trong các đợt cao điểm lễ tết.</p>',
    coverImage: {
      url: '/images/home/news-thumb-1.webp',
      alt: 'Xe tải Nam Hân Logistics vận chuyển trên tuyến Bắc Nam'
    },
    isPinned: true,
    status: 'published',
    createdAt: '2026-10-20T08:00:00.000Z',
    publishedAt: '2026-10-20T08:00:00.000Z',
    updatedAt: '2026-10-20T08:00:00.000Z',
    version: 1
  },
  {
    id: 'nhl-seed-002',
    slug: 'nam-han-logistics-mo-rong-nang-luc-bai-xe-trung-chuyen-tai-khu-vuc-mien-trung',
    title: 'Nam Hân Logistics mở rộng năng lực bãi xe trung chuyển tại khu vực miền Trung',
    summary: 'Nâng cao khả năng tiếp nhận, sang tải và bốc dỡ cơ giới, rút ngắn thời gian trung chuyển giữa hai miền Nam — Bắc xuống dưới 32 giờ.',
    content: '<p>Nhằm củng cố năng lực mạng lưới logistics đa điểm, Nam Hân Logistics chính thức mở rộng trạm dừng và bãi đỗ kỹ thuật tại khu vực Miền Trung. Đây là mắt xích then chốt kết nối hai trung tâm kho bãi chính tại miền Bắc và miền Nam.</p><h2>Năng lực tiếp nhận mở rộng</h2><ul><li>Diện tích bãi xe rộng rãi, phục vụ sang tải đồng thời cho 15 xe tải lớn.</li><li>Trang bị xe nâng cơ giới hiện đại phục vụ bốc xếp hàng nặng, máy móc công nghiệp.</li><li>Đội ngũ kỹ thuật trực 24/7 kiểm tra an toàn kỹ thuật lốp, phanh và thùng hàng.</li></ul><p>Việc đưa trạm trung chuyển đi vào vận hành giúp rút ngắn tối đa thời gian chờ đợi trên hành trình Bắc — Nam, tăng độ tin cậy trong các hợp đồng dịch vụ dài hạn.</p>',
    coverImage: {
      url: '/images/home/news-thumb-2.webp',
      alt: 'Bãi xe và kho trung chuyển của Nam Hân Logistics'
    },
    isPinned: false,
    status: 'published',
    createdAt: '2026-10-15T09:30:00.000Z',
    publishedAt: '2026-10-15T09:30:00.000Z',
    updatedAt: '2026-10-15T09:30:00.000Z',
    version: 1
  },
  {
    id: 'nhl-seed-003',
    slug: 'quy-trinh-kiem-soat-an-toan-va-bao-hiem-hang-hoa-100-trong-van-tai-duong-dai',
    title: 'Quy trình kiểm soát an toàn và bảo hiểm hàng hóa 100% trong vận tải đường dài',
    summary: 'Tìm hiểu tiêu chuẩn đóng gói, niêm phong kẹp chì và hệ thống giám sát hành trình GPS trực tuyến 24/7 bảo vệ trọn vẹn tài sản của khách hàng.',
    content: '<p>Trong vận tải đường bộ liên tỉnh, bảo đảm an toàn nguyên vẹn cho hàng hóa là nguyên tắc sống còn. Nam Hân Logistics áp dụng quy trình kiểm soát nghiêm ngặt 4 bước trước khi xe lăn bánh.</p><h2>Quy chuẩn 4 bước chuẩn hóa</h2><ol><li><strong>Kiểm đếm và phân loại:</strong> Hàng hóa được phân loại theo tính chất chịu lực, kích thước và yêu cầu bảo quản.</li><li><strong>Chằng buộc chuyên dụng:</strong> Sử dụng dây cáp, đệm lót chuyên dụng chống xô lệch, va đập trong quá trình vận hành trên cao tốc và đèo dốc.</li><li><strong>Niêm phong kẹp chì (Seal):</strong> Đối với hàng nguyên chuyến FTL và hàng giá trị cao, mã niêm phong được bàn giao bằng biên bản đối soát hai đầu.</li><li><strong>Bảo hiểm trách nhiệm hàng hóa:</strong> 100% chuyến xe vận chuyển đều kèm gói bảo hiểm theo giá trị khai báo.</li></ol>',
    coverImage: {
      url: '/images/home/news-thumb-3.webp',
      alt: 'Quy trình chằng buộc và niêm phong hàng hóa Nam Hân Logistics'
    },
    isPinned: false,
    status: 'published',
    createdAt: '2026-10-10T14:15:00.000Z',
    publishedAt: '2026-10-10T14:15:00.000Z',
    updatedAt: '2026-10-10T14:15:00.000Z',
    version: 1
  }
];

/**
 * Reads the announcements index summary list.
 */
export async function getAnnouncementsIndex(): Promise<AnnouncementSummary[]> {
  const store = await getNetlifyBlobStore();

  if (store) {
    try {
      const data = await store.get(INDEX_KEY, { type: 'json' });
      if (Array.isArray(data)) {
        return data as AnnouncementSummary[];
      }
      // If store is empty, initialize with seeds
      await seedInitialData(store);
      const seeded = await store.get(INDEX_KEY, { type: 'json' });
      return Array.isArray(seeded) ? (seeded as AnnouncementSummary[]) : [];
    } catch (err) {
      if (isProductionEnv) {
        throw new Error(`[NewsStorage] Error reading index from Netlify Blobs: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  }

  // Local development file fallback
  ensureLocalDirs();
  const localIndexFile = path.join(LOCAL_DATA_DIR, 'index.json');
  try {
    if (fs.existsSync(localIndexFile)) {
      const raw = fs.readFileSync(localIndexFile, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('[NewsStorage] Error reading local index:', err);
  }

  // Seed locally
  await seedInitialDataLocal();
  try {
    if (fs.existsSync(localIndexFile)) {
      return JSON.parse(fs.readFileSync(localIndexFile, 'utf-8'));
    }
  } catch {}

  return INITIAL_SEEDS.map(toSummary);
}

/**
 * Saves the announcements index list.
 */
async function saveAnnouncementsIndex(summaries: AnnouncementSummary[]): Promise<void> {
  const store = await getNetlifyBlobStore();

  if (store) {
    try {
      await store.setJSON(INDEX_KEY, summaries);
      return;
    } catch (err) {
      if (isProductionEnv) {
        throw new Error(`[NewsStorage] Failed to save index to Netlify Blobs: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  }

  // Local save
  ensureLocalDirs();
  const localIndexFile = path.join(LOCAL_DATA_DIR, 'index.json');
  fs.writeFileSync(localIndexFile, JSON.stringify(summaries, null, 2), 'utf-8');
}

/**
 * Gets a full announcement by ID.
 */
export async function getAnnouncementById(id: string): Promise<Announcement | null> {
  if (!id) return null;
  const store = await getNetlifyBlobStore();

  if (store) {
    try {
      const data = await store.get(`article:${id}`, { type: 'json' });
      return (data as Announcement) || null;
    } catch (err) {
      if (isProductionEnv) {
        throw new Error(`[NewsStorage] Failed to read article ${id} from Blobs: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  }

  ensureLocalDirs();
  const filePath = path.join(LOCAL_DATA_DIR, `${id}.json`);
  if (fs.existsSync(filePath)) {
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Gets a full announcement by its slug.
 */
export async function getAnnouncementBySlug(slug: string): Promise<Announcement | null> {
  if (!slug) return null;
  const index = await getAnnouncementsIndex();
  const summary = index.find((item) => item.slug === slug);
  if (!summary) return null;
  return getAnnouncementById(summary.id);
}

/**
 * Lists announcements for public view or admin dashboard with filtering and sorting.
 */
export async function listAnnouncements(options?: {
  status?: AnnouncementStatus | 'all';
  search?: string;
  includeDeleted?: boolean;
}): Promise<AnnouncementSummary[]> {
  const all = await getAnnouncementsIndex();
  let filtered = all;

  // Status filtering
  if (options?.status && options.status !== 'all') {
    filtered = filtered.filter((a) => a.status === options.status);
  } else if (!options?.includeDeleted) {
    // By default exclude soft-deleted items unless explicitly requested
    filtered = filtered.filter((a) => a.status !== 'deleted');
  }

  // Keyword search
  if (options?.search) {
    const q = options.search.toLowerCase().trim();
    filtered = filtered.filter(
      (a) => a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q)
    );
  }

  // Sort: pinned first, then publishedAt (or updatedAt) descending
  filtered.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    const timeA = new Date(a.publishedAt || a.updatedAt).getTime();
    const timeB = new Date(b.publishedAt || b.updatedAt).getTime();
    return timeB - timeA;
  });

  return filtered;
}

/**
 * Saves (creates or updates) an announcement with optimistic concurrency locking.
 */
export async function saveAnnouncement(
  article: Announcement,
  expectedVersion?: number
): Promise<Announcement> {
  if (!article.id) {
    article.id = `nhl-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  }
  if (!article.createdAt) {
    article.createdAt = new Date().toISOString();
  }

  const index = await getAnnouncementsIndex();

  // 1. Slug uniqueness check (excluding self and deleted items)
  const duplicateSlug = index.find(
    (item) => item.slug === article.slug && item.id !== article.id && item.status !== 'deleted'
  );
  if (duplicateSlug) {
    const err = new Error(`Đường dẫn slug "${article.slug}" đã tồn tại trên một thông báo khác.`);
    (err as any).code = 'DUPLICATE_SLUG';
    throw err;
  }

  // 2. Concurrency check (optimistic locking)
  const existing = await getAnnouncementById(article.id);
  if (existing) {
    if (expectedVersion !== undefined && existing.version !== expectedVersion) {
      const err = new Error('Thông báo đã được chỉnh sửa ở một phiên làm việc khác. Vui lòng tải lại trước khi lưu.');
      (err as any).code = 'CONCURRENCY_CONFLICT';
      throw err;
    }
    article.version = (existing.version || 1) + 1;
  } else {
    article.version = 1;
  }

  // 3. Update timestamps
  article.updatedAt = new Date().toISOString();
  if (article.status === 'published' && !article.publishedAt) {
    article.publishedAt = article.updatedAt;
  }

  // 4. Save article payload
  const store = await getNetlifyBlobStore();
  if (store) {
    try {
      await store.setJSON(`article:${article.id}`, article);
    } catch (err) {
      if (isProductionEnv) {
        throw new Error(`[NewsStorage] Failed to save article ${article.id} to Blobs: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  }

  ensureLocalDirs();
  const filePath = path.join(LOCAL_DATA_DIR, `${article.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(article, null, 2), 'utf-8');

  // 5. Update index
  const summary = toSummary(article);
  const existingIdx = index.findIndex((item) => item.id === article.id);
  if (existingIdx >= 0) {
    index[existingIdx] = summary;
  } else {
    index.unshift(summary);
  }
  await saveAnnouncementsIndex(index);

  return article;
}

/**
 * Soft deletes an announcement (moves to Trash).
 */
export async function softDeleteAnnouncement(id: string): Promise<boolean> {
  const article = await getAnnouncementById(id);
  if (!article) return false;

  article.status = 'deleted';
  article.updatedAt = new Date().toISOString();
  await saveAnnouncement(article, article.version);
  return true;
}

/**
 * Restores a soft-deleted announcement back to Draft.
 */
export async function restoreAnnouncement(id: string): Promise<boolean> {
  const article = await getAnnouncementById(id);
  if (!article || article.status !== 'deleted') return false;

  article.status = 'draft';
  article.updatedAt = new Date().toISOString();
  await saveAnnouncement(article, article.version);
  return true;
}

/**
 * Permanently removes an announcement.
 */
export async function hardDeleteAnnouncement(id: string): Promise<boolean> {
  const store = await getNetlifyBlobStore();

  if (store) {
    try {
      await store.delete(`article:${id}`);
    } catch {}
  }

  ensureLocalDirs();
  const filePath = path.join(LOCAL_DATA_DIR, `${id}.json`);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch {}
  }

  // Remove from index
  const index = await getAnnouncementsIndex();
  const newIndex = index.filter((item) => item.id !== id);
  await saveAnnouncementsIndex(newIndex);

  return true;
}

/**
 * Media File Operations (Storage for uploaded images and PDFs).
 */
export interface StoredMediaFile {
  id: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
  buffer: Buffer;
}

export async function saveMediaFile(
  fileId: string,
  buffer: Buffer,
  meta: { originalName: string; mimeType: string }
): Promise<AttachmentFile> {
  const store = await getNetlifyBlobStore();
  const uploadedAt = new Date().toISOString();
  const sizeBytes = buffer.length;

  if (store) {
    try {
      // Store metadata
      await store.setJSON(`media_meta:${fileId}`, {
        originalName: meta.originalName,
        mimeType: meta.mimeType,
        sizeBytes,
        uploadedAt
      });
      // Store binary buffer as isolated ArrayBuffer
      const arrayBuffer = buffer.buffer.slice(
        buffer.byteOffset,
        buffer.byteOffset + buffer.byteLength
      ) as ArrayBuffer;
      await store.set(`media_bin:${fileId}`, arrayBuffer);
    } catch (err) {
      if (isProductionEnv) {
        throw new Error(`[NewsStorage] Failed to store media file ${fileId} in Blobs: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  }

  // Local filesystem save
  ensureLocalDirs();
  const metaPath = path.join(LOCAL_MEDIA_DIR, `${fileId}.meta.json`);
  const binPath = path.join(LOCAL_MEDIA_DIR, `${fileId}.bin`);
  fs.writeFileSync(metaPath, JSON.stringify({ ...meta, sizeBytes, uploadedAt }, null, 2));
  fs.writeFileSync(binPath, buffer);

  return {
    id: fileId,
    filename: fileId,
    originalName: meta.originalName,
    mimeType: meta.mimeType,
    sizeBytes,
    uploadedAt,
    url: `/api/news/files/${fileId}`
  };
}

export async function getMediaFile(fileId: string): Promise<StoredMediaFile | null> {
  if (!fileId) return null;
  const store = await getNetlifyBlobStore();

  if (store) {
    try {
      const meta = (await store.get(`media_meta:${fileId}`, { type: 'json' })) as any;
      const bin = await store.get(`media_bin:${fileId}`, { type: 'blob' });
      if (meta && bin) {
        const arrayBuf = await bin.arrayBuffer();
        return {
          id: fileId,
          originalName: meta.originalName,
          mimeType: meta.mimeType,
          sizeBytes: meta.sizeBytes,
          uploadedAt: meta.uploadedAt,
          buffer: Buffer.from(arrayBuf)
        };
      }
    } catch (err) {
      if (isProductionEnv) {
        throw new Error(`[NewsStorage] Failed to get media file ${fileId} from Blobs: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  }

  ensureLocalDirs();
  const metaPath = path.join(LOCAL_MEDIA_DIR, `${fileId}.meta.json`);
  const binPath = path.join(LOCAL_MEDIA_DIR, `${fileId}.bin`);

  if (fs.existsSync(metaPath) && fs.existsSync(binPath)) {
    try {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
      const buffer = fs.readFileSync(binPath);
      return {
        id: fileId,
        originalName: meta.originalName,
        mimeType: meta.mimeType,
        sizeBytes: meta.sizeBytes,
        uploadedAt: meta.uploadedAt,
        buffer
      };
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Backup and Export all news data into a single JSON bundle.
 */
export async function exportNewsBackup(): Promise<NewsDatasetBackup> {
  const index = await getAnnouncementsIndex();
  const announcements: Announcement[] = [];

  for (const item of index) {
    const full = await getAnnouncementById(item.id);
    if (full) {
      announcements.push(full);
    }
  }

  return {
    exportDate: new Date().toISOString(),
    version: '1.0.0',
    announcements
  };
}

/**
 * Restores news data from a JSON backup.
 */
export async function importNewsBackup(backup: NewsDatasetBackup): Promise<{ importedCount: number }> {
  if (!backup || !Array.isArray(backup.announcements)) {
    throw new Error('Dữ liệu sao lưu không đúng định dạng chuẩn.');
  }

  let count = 0;
  for (const item of backup.announcements) {
    if (item.id && item.title && item.slug) {
      await saveAnnouncement(item);
      count++;
    }
  }

  return { importedCount: count };
}

// Helper: Maps full announcement to summary
function toSummary(a: Announcement): AnnouncementSummary {
  return {
    id: a.id,
    slug: a.slug,
    title: a.title,
    summary: a.summary,
    coverImage: a.coverImage,
    isPinned: Boolean(a.isPinned),
    status: a.status,
    createdAt: a.createdAt,
    publishedAt: a.publishedAt,
    updatedAt: a.updatedAt,
    version: a.version || 1,
    attachmentCount: a.attachments?.length || 0
  };
}

async function seedInitialData(store: any): Promise<void> {
  for (const seed of INITIAL_SEEDS) {
    await store.setJSON(`article:${seed.id}`, seed);
  }
  await store.setJSON(INDEX_KEY, INITIAL_SEEDS.map(toSummary));
}

async function seedInitialDataLocal(): Promise<void> {
  ensureLocalDirs();
  for (const seed of INITIAL_SEEDS) {
    const fPath = path.join(LOCAL_DATA_DIR, `${seed.id}.json`);
    if (!fs.existsSync(fPath)) {
      fs.writeFileSync(fPath, JSON.stringify(seed, null, 2), 'utf-8');
    }
  }
  const idxPath = path.join(LOCAL_DATA_DIR, 'index.json');
  if (!fs.existsSync(idxPath)) {
    fs.writeFileSync(idxPath, JSON.stringify(INITIAL_SEEDS.map(toSummary), null, 2), 'utf-8');
  }
}
