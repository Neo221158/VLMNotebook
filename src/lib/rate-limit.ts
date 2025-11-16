/**
 * Hybrid rate limiter with Redis support
 *
 * This implementation automatically uses Redis (via Upstash) when credentials
 * are available, otherwise falls back to in-memory storage.
 *
 * Production (with Redis):
 * - Works across multiple servers
 * - Persists across server restarts
 * - Higher throughput and accuracy
 *
 * Development (in-memory fallback):
 * - No external dependencies
 * - Suitable for single-server deployments
 * - Easy local development
 *
 * To enable Redis:
 * 1. Sign up at https://upstash.com/
 * 2. Create a Redis database
 * 3. Add to .env:
 *    UPSTASH_REDIS_REST_URL=your-redis-url
 *    UPSTASH_REDIS_REST_TOKEN=your-redis-token
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { logger } from "@/lib/logger";

interface RateLimitConfig {
  /**
   * Maximum number of requests allowed within the time window
   */
  limit: number;
  /**
   * Time window in milliseconds
   */
  windowMs: number;
}

interface RateLimitResult {
  /**
   * Whether the request is allowed
   */
  allowed: boolean;
  /**
   * Number of requests remaining in the current window
   */
  remaining: number;
  /**
   * Unix timestamp when the rate limit will reset
   */
  resetAt: number;
}

interface RequestRecord {
  count: number;
  resetAt: number;
}

// Check if Redis is configured
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const USE_REDIS = Boolean(REDIS_URL && REDIS_TOKEN);

// Log rate limiter mode
if (USE_REDIS) {
  logger.info("Rate limiter: Using Redis (Upstash) for distributed rate limiting");
} else {
  logger.warn(
    "Rate limiter: Using in-memory storage (not suitable for production with multiple servers). " +
    "Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to enable Redis."
  );
}

// Initialize Redis client if credentials are available
let redis: Redis | null = null;
const redisRateLimiters: Map<string, Ratelimit> = new Map();

if (USE_REDIS) {
  try {
    redis = new Redis({
      url: REDIS_URL!,
      token: REDIS_TOKEN!,
    });
  } catch (error) {
    logger.error("Failed to initialize Redis client, falling back to in-memory:", error);
  }
}

// In-memory store for rate limiting (fallback)
const inMemoryStore = new Map<string, RequestRecord>();

// Cleanup old entries every 60 seconds to prevent memory leaks (in-memory only)
if (!USE_REDIS) {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of inMemoryStore.entries()) {
      if (record.resetAt < now) {
        inMemoryStore.delete(key);
      }
    }
  }, 60000);
}

/**
 * Get or create a Redis rate limiter for a specific configuration
 */
function getRedisRateLimiter(config: RateLimitConfig): Ratelimit | null {
  if (!redis) return null;

  const key = `${config.limit}-${config.windowMs}`;

  if (redisRateLimiters.has(key)) {
    return redisRateLimiters.get(key)!;
  }

  // Create new rate limiter with sliding window algorithm
  const rateLimiter = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(
      config.limit,
      `${config.windowMs} ms`
    ),
    analytics: true,
    prefix: "ratelimit",
  });

  redisRateLimiters.set(key, rateLimiter);
  return rateLimiter;
}

/**
 * In-memory rate limit implementation (fallback)
 */
function rateLimitInMemory(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const record = inMemoryStore.get(identifier);

  // No existing record or record has expired
  if (!record || record.resetAt < now) {
    const resetAt = now + config.windowMs;
    inMemoryStore.set(identifier, { count: 1, resetAt });
    return {
      allowed: true,
      remaining: config.limit - 1,
      resetAt,
    };
  }

  // Increment counter for existing record
  record.count++;

  // Check if limit exceeded
  if (record.count > config.limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: record.resetAt,
    };
  }

  // Update store
  inMemoryStore.set(identifier, record);

  return {
    allowed: true,
    remaining: config.limit - record.count,
    resetAt: record.resetAt,
  };
}

/**
 * Redis-based rate limit implementation
 */
async function rateLimitRedis(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const rateLimiter = getRedisRateLimiter(config);

  if (!rateLimiter) {
    // Fallback to in-memory if Redis is not available
    return rateLimitInMemory(identifier, config);
  }

  try {
    const result = await rateLimiter.limit(identifier);

    return {
      allowed: result.success,
      remaining: result.remaining,
      resetAt: result.reset,
    };
  } catch (error) {
    logger.error("Redis rate limit error, falling back to in-memory:", error);
    return rateLimitInMemory(identifier, config);
  }
}

/**
 * Check if a request should be rate limited
 *
 * Automatically uses Redis when available, otherwise falls back to in-memory storage.
 *
 * @param identifier - Unique identifier for the rate limit (e.g., userId, IP address)
 * @param config - Rate limit configuration
 * @returns Rate limit result (synchronous for in-memory, can handle async Redis)
 *
 * @example
 * // Synchronous (in-memory)
 * const result = rateLimit('user-123', { limit: 10, windowMs: 60000 });
 *
 * // Or with async Redis (still works synchronously in-memory if Redis not configured)
 * const result = rateLimit('user-123', RateLimitPresets.chatMessage);
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  // Use in-memory for synchronous operation
  // Note: Redis version is available as rateLimitAsync for routes that can handle async
  return rateLimitInMemory(identifier, config);
}

/**
 * Async rate limit check (uses Redis when available)
 *
 * Use this in API routes for better performance and accuracy with Redis.
 *
 * @param identifier - Unique identifier for the rate limit
 * @param config - Rate limit configuration
 * @returns Promise<RateLimitResult>
 *
 * @example
 * const result = await rateLimitAsync('user-123', RateLimitPresets.chatMessage);
 * if (!result.allowed) {
 *   return createRateLimitResponse(RateLimitPresets.chatMessage, result);
 * }
 */
export async function rateLimitAsync(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  if (USE_REDIS) {
    return rateLimitRedis(identifier, config);
  }
  return rateLimitInMemory(identifier, config);
}

/**
 * Predefined rate limit configurations for common use cases
 */
export const RateLimitPresets = {
  /**
   * File upload: 10 uploads per 10 minutes
   */
  fileUpload: { limit: 10, windowMs: 10 * 60 * 1000 } as RateLimitConfig,

  /**
   * Chat messages: 30 messages per minute
   */
  chatMessage: { limit: 30, windowMs: 60 * 1000 } as RateLimitConfig,

  /**
   * Conversation creation: 5 per minute
   */
  conversationCreate: { limit: 5, windowMs: 60 * 1000 } as RateLimitConfig,

  /**
   * API requests: 100 per minute
   */
  apiRequest: { limit: 100, windowMs: 60 * 1000 } as RateLimitConfig,
} as const;

/**
 * Create rate limit response headers
 *
 * @param config - Rate limit configuration
 * @param result - Rate limit result
 * @returns Headers object
 */
export function createRateLimitHeaders(
  config: RateLimitConfig,
  result: RateLimitResult
): HeadersInit {
  return {
    "X-RateLimit-Limit": String(config.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.floor(result.resetAt / 1000)), // Unix timestamp in seconds
  };
}

/**
 * Create a rate-limited response
 *
 * @param config - Rate limit configuration
 * @param result - Rate limit result
 * @returns Response object with 429 status
 */
export function createRateLimitResponse(
  config: RateLimitConfig,
  result: RateLimitResult
): Response {
  const retryAfter = Math.ceil((result.resetAt - Date.now()) / 1000);

  return new Response(
    JSON.stringify({
      error: "Too Many Requests",
      message: "You have exceeded the rate limit. Please try again later.",
      retryAfter: retryAfter > 0 ? retryAfter : 1,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfter > 0 ? retryAfter : 1),
        ...createRateLimitHeaders(config, result),
      },
    }
  );
}

// Export types
export type { RateLimitConfig, RateLimitResult };
