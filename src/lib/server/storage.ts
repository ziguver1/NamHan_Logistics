/**
 * Persistent storage layer for Google Sheets connection metadata.
 * Uses Upstash Redis in production (Vercel), with Netlify Blobs support and resilient local file fallback for local development.
 */

import fs from 'node:fs';
import path from 'node:path';
import { getUpstashRedis } from './redis-client.ts';

export interface SheetsConnection {
  spreadsheetId: string;
  spreadsheetUrl: string;
  sheetTitle: string;
  accountEmail: string;
  connectedAt: string;
  encryptedRefreshToken: string;
  status: 'active' | 'needs_reauth' | 'disconnected';
  lastError?: string;
}

export interface AppsScriptConnection {
  webAppUrl: string;
  encryptedApiKey: string;
  sheetUrl?: string;
  sheetTitle?: string;
  connectedAt: string;
  lastTestedAt?: string;
  status: 'active' | 'inactive';
  lastError?: string;
}

export interface AppConfig {
  activeMethod?: 'oauth' | 'apps_script'; // Which integration method actually receives submissions
  activeConnection?: SheetsConnection;    // Google OAuth connection
  pendingConnection?: SheetsConnection;   // Pending OAuth account switch
  appsScriptConnection?: AppsScriptConnection; // Google Apps Script Web App connection
  recentSubmissions?: Record<string, number>; // requestId -> timestamp (ms)
}

const STORAGE_KEY = 'connection_state';
const REDIS_CONFIG_KEY = 'namhan:config:state';

function getStorageDir(): string {
  if (process.env.VERCEL || process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join('/tmp', 'namhan_config_data');
  }
  return path.resolve(process.cwd(), '.data');
}

function getStorageFile(): string {
  return path.join(getStorageDir(), 'connection_state.json');
}

// Memory cache for quick reads
let inMemoryCache: AppConfig | null = null;

async function getNetlifyBlobStore() {
  try {
    const { getStore } = await import('@netlify/blobs');
    const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
    const token = process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
    if (siteID && token) {
      return getStore({ name: 'namhan_config', siteID, token });
    }
    return getStore('namhan_config');
  } catch {
    return null;
  }
}

/**
 * Reads the persistent configuration.
 */
export async function getConfig(): Promise<AppConfig> {
  // 1. Try Upstash Redis if available
  const redis = getUpstashRedis();
  if (redis) {
    try {
      const data = await redis.get<AppConfig>(REDIS_CONFIG_KEY);
      if (data && typeof data === 'object') {
        inMemoryCache = data;
        return inMemoryCache;
      }
    } catch (err) {
      console.warn('[Storage] Upstash Redis read error:', err);
    }
  }

  // 2. Try Netlify Blobs if available
  const blobStore = await getNetlifyBlobStore();
  if (blobStore) {
    try {
      const data = await blobStore.get(STORAGE_KEY, { type: 'json' });
      if (data && typeof data === 'object') {
        inMemoryCache = data as AppConfig;
        return inMemoryCache;
      }
    } catch {
      // Netlify Blobs not configured (e.g. running locally without Netlify CLI)
    }
  }

  // 3. Try Local File fallback
  try {
    const dataFile = getStorageFile();
    if (fs.existsSync(dataFile)) {
      const content = fs.readFileSync(dataFile, 'utf-8');
      inMemoryCache = JSON.parse(content) as AppConfig;
      return inMemoryCache;
    }
  } catch (err) {
    console.warn('[Storage] Error reading local data file:', err);
  }

  // 4. Fallback to in-memory cache or default empty config
  return inMemoryCache || {};
}

/**
 * Saves the persistent configuration.
 */
export async function saveConfig(config: AppConfig): Promise<void> {
  inMemoryCache = config;
  let savedToCloud = false;

  // 1. Try Upstash Redis
  const redis = getUpstashRedis();
  if (redis) {
    try {
      await redis.set(REDIS_CONFIG_KEY, config);
      savedToCloud = true;
    } catch (err) {
      console.warn('[Storage] Upstash Redis write error:', err);
    }
  }

  // 2. Try Netlify Blobs
  const blobStore = await getNetlifyBlobStore();
  if (blobStore) {
    try {
      await blobStore.setJSON(STORAGE_KEY, config);
      savedToCloud = true;
    } catch {
      // Ignored for local fallback
    }
  }

  // 3. Always persist to local file in dev or as secondary copy
  try {
    const dir = getStorageDir();
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(getStorageFile(), JSON.stringify(config, null, 2), 'utf-8');
  } catch (err) {
    if (!savedToCloud) {
      console.warn('[Storage] Could not write to local data file:', err);
    }
  }
}

/**
 * Checks if a requestId was submitted in the last 24 hours (Idempotency).
 */
export async function hasSeenRequestId(requestId: string): Promise<boolean> {
  if (!requestId) return false;

  // 1. Try Upstash Redis if available
  const redis = getUpstashRedis();
  if (redis) {
    try {
      const seen = await redis.get<number>(`namhan:req:${requestId}`);
      if (seen) return true;
    } catch {}
  }

  const config = await getConfig();
  const recent = config.recentSubmissions || {};
  const recordTime = recent[requestId];
  if (!recordTime) return false;

  // 24 hours TTL
  const isRecent = Date.now() - recordTime < 24 * 60 * 60 * 1000;
  return isRecent;
}

/**
 * Records a requestId to prevent duplicate submissions.
 */
export async function markRequestIdSeen(requestId: string): Promise<void> {
  if (!requestId) return;

  // 1. Upstash Redis with 24 hours TTL
  const redis = getUpstashRedis();
  if (redis) {
    try {
      await redis.set(`namhan:req:${requestId}`, Date.now(), { ex: 86400 });
    } catch {}
  }

  const config = await getConfig();
  const recent = config.recentSubmissions || {};

  // Clean entries older than 24 hours
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  const cleaned: Record<string, number> = {};
  for (const [key, time] of Object.entries(recent)) {
    if (time > cutoff) {
      cleaned[key] = time;
    }
  }

  cleaned[requestId] = Date.now();
  config.recentSubmissions = cleaned;
  await saveConfig(config);
}

