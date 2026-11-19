/**
 * Upstash Redis Client Module
 * Provides unified, edge-compatible Redis connection using REST API
 * Supports both standalone Upstash Redis (UPSTASH_REDIS_REST_URL/TOKEN)
 * and Vercel KV integration (KV_REST_API_URL/TOKEN).
 */
import { Redis } from '@upstash/redis';

let redisInstance: Redis | null = null;

export function getUpstashRedis(): Redis | null {
  if (redisInstance) return redisInstance;

  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (url && token) {
    try {
      redisInstance = new Redis({ url, token });
      return redisInstance;
    } catch (err) {
      console.warn('[Upstash Redis] Connection error:', err);
      return null;
    }
  }

  return null;
}

export function isUpstashConfigured(): boolean {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return Boolean(url && token);
}
