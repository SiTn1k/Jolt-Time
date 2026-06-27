/**
 * Rate Limiter
 *
 * Token bucket rate limiting for authentication endpoints.
 */

import { AuthErrors } from '../errors';

/**
 * Rate limit result.
 */
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  retryAfterSeconds?: number;
  error?: ReturnType<typeof AuthErrors.rateLimited>;
}

/**
 * Rate limiter configuration.
 */
export interface RateLimiterConfig {
  maxRequests?: number;
  windowSeconds?: number;
  blockDurationSeconds?: number;
}

/**
 * Token bucket entry for a key.
 */
interface BucketEntry {
  tokens: number;
  lastRefill: number;
  blockedUntil: number | null;
}

/**
 * Token bucket rate limiter.
 */
export class RateLimiter {
  private readonly maxRequests: number;
  private readonly windowMs: number;
  private readonly blockDurationMs: number;
  private readonly buckets = new Map<string, BucketEntry>();

  constructor(config: RateLimiterConfig = {}) {
    this.maxRequests = config.maxRequests ?? 10; // 10 requests
    this.windowMs = (config.windowSeconds ?? 60) * 1000; // per minute
    this.blockDurationMs = (config.blockDurationSeconds ?? 300) * 1000; // 5 minute block
  }

  /**
   * Check if a request is allowed under rate limiting.
   *
   * @param key - The rate limit key (e.g., IP address, user ID)
   * @returns Rate limit result
   */
  check(key: string): RateLimitResult {
    const now = Date.now();
    let bucket = this.buckets.get(key);

    // Initialize bucket if it doesn't exist
    if (!bucket) {
      bucket = {
        tokens: this.maxRequests,
        lastRefill: now,
        blockedUntil: null,
      };
      this.buckets.set(key, bucket);
    }

    // Check if blocked
    if (bucket.blockedUntil !== null && now < bucket.blockedUntil) {
      const retryAfterSeconds = Math.ceil((bucket.blockedUntil - now) / 1000);
      return {
        allowed: false,
        remaining: 0,
        resetAt: new Date(bucket.blockedUntil),
        retryAfterSeconds,
        error: AuthErrors.rateLimited(retryAfterSeconds),
      };
    }

    // Refill tokens based on time elapsed
    const timePassed = now - bucket.lastRefill;
    const tokensToAdd = Math.floor((timePassed / this.windowMs) * this.maxRequests);

    if (tokensToAdd > 0) {
      bucket.tokens = Math.min(this.maxRequests, bucket.tokens + tokensToAdd);
      bucket.lastRefill = now;
    }

    // Clear block if it has expired
    if (bucket.blockedUntil !== null && now >= bucket.blockedUntil) {
      bucket.blockedUntil = null;
    }

    // Check if we have tokens available
    if (bucket.tokens <= 0) {
      const resetAt = new Date(bucket.lastRefill + this.windowMs);
      const retryAfterSeconds = Math.ceil((resetAt.getTime() - now) / 1000);
      return {
        allowed: false,
        remaining: 0,
        resetAt,
        retryAfterSeconds,
        error: AuthErrors.rateLimited(retryAfterSeconds),
      };
    }

    // Consume a token
    bucket.tokens--;

    return {
      allowed: true,
      remaining: bucket.tokens,
      resetAt: new Date(bucket.lastRefill + this.windowMs),
    };
  }

  /**
   * Record a failed attempt (for dynamic rate limiting).
   */
  recordFailure(key: string): void {
    const bucket = this.buckets.get(key);
    if (bucket) {
      // Reduce tokens faster on failures
      bucket.tokens = Math.max(0, bucket.tokens - 2);
    }
  }

  /**
   * Record a successful attempt.
   */
  recordSuccess(key: string): void {
    const bucket = this.buckets.get(key);
    if (bucket && bucket.tokens < this.maxRequests) {
      // Slowly restore tokens on success
      bucket.tokens = Math.min(this.maxRequests, bucket.tokens + 0.5);
    }
  }

  /**
   * Block a key for a specified duration.
   */
  block(key: string, durationSeconds?: number): void {
    const bucket = this.buckets.get(key);
    if (bucket) {
      const duration = durationSeconds ? durationSeconds * 1000 : this.blockDurationMs;
      bucket.blockedUntil = Date.now() + duration;
      bucket.tokens = 0;
    }
  }

  /**
   * Unblock a key.
   */
  unblock(key: string): boolean {
    const bucket = this.buckets.get(key);
    if (bucket) {
      bucket.blockedUntil = null;
      return true;
    }
    return false;
  }

  /**
   * Reset rate limit for a key.
   */
  reset(key: string): boolean {
    return this.buckets.delete(key);
  }

  /**
   * Clear all rate limits.
   */
  clear(): void {
    this.buckets.clear();
  }

  /**
   * Get current status for a key.
   */
  getStatus(key: string): { blocked: boolean; tokensRemaining: number; blockedUntil: number | null } | null {
    const bucket = this.buckets.get(key);
    if (!bucket) {
      return null;
    }
    return {
      blocked: bucket.blockedUntil !== null && Date.now() < bucket.blockedUntil,
      tokensRemaining: bucket.tokens,
      blockedUntil: bucket.blockedUntil,
    };
  }
}

/**
 * Global rate limiter for authentication endpoints.
 */
let globalAuthRateLimiter: RateLimiter | null = null;

/**
 * Get the global auth rate limiter.
 */
export function getAuthRateLimiter(config?: RateLimiterConfig): RateLimiter {
  if (!globalAuthRateLimiter) {
    globalAuthRateLimiter = new RateLimiter(config);
  }
  return globalAuthRateLimiter;
}

/**
 * Reset the global rate limiter (for testing).
 */
export function resetAuthRateLimiter(): void {
  globalAuthRateLimiter = null;
}