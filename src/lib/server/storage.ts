/**
 * Persistent storage layer for Google Sheets connection metadata.
 * Uses Netlify Blobs in production, with resilient local file fallback for local development.
 */

import fs from 'node:fs';
import path from 'node:path';

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
const LOCAL_DATA_DIR = path.resolve(process.cwd(), '.data');
const LOCAL_DATA_FILE = path.join(LOCAL_DATA_DIR, 'connection_state.json');

// Memory cache for quick reads
let inMemoryCache: AppConfig | null = null;

async function getNetlifyBlobStore() {
  try {
    const { getStore } = await import('@netlify/blobs');
    return getStore('namhan_config');
  } catch {
    return null;
  }
}

/**
 * Reads the persistent configuration.
 */
export async function getConfig(): Promise<AppConfig> {
  // 1. Try Netlify Blobs if available
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

  // 2. Try Local File fallback
  try {
    if (fs.existsSync(LOCAL_DATA_FILE)) {
      const content = fs.readFileSync(LOCAL_DATA_FILE, 'utf-8');
      inMemoryCache = JSON.parse(content) as AppConfig;
      return inMemoryCache;
    }
  } catch (err) {
    console.warn('[Storage] Error reading local data file:', err);
  }

  // 3. Fallback to in-memory cache or default empty config
  return inMemoryCache || {};
}

/**
 * Saves the persistent configuration.
 */
export async function saveConfig(config: AppConfig): Promise<void> {
  inMemoryCache = config;

  // 1. Try Netlify Blobs
  const blobStore = await getNetlifyBlobStore();
  let savedToBlob = false;
  if (blobStore) {
    try {
      await blobStore.setJSON(STORAGE_KEY, config);
      savedToBlob = true;
    } catch {
      // Ignored for local fallback
    }
  }

  // 2. Always persist to local file in dev or as secondary copy
  try {
    if (!fs.existsSync(LOCAL_DATA_DIR)) {
      fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(LOCAL_DATA_FILE, JSON.stringify(config, null, 2), 'utf-8');
  } catch (err) {
    if (!savedToBlob) {
      console.warn('[Storage] Could not write to local data file:', err);
    }
  }
}

/**
 * Checks if a requestId was submitted in the last 24 hours (Idempotency).
 */
export async function hasSeenRequestId(requestId: string): Promise<boolean> {
  if (!requestId) return false;
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

