/**
 * Rate Limiter
 *
 * Rate limiting implementation for external service calls.
 * Prevents exceeding rate limits imposed by external services.
 *
 * IMPORTANT: Rate Limiter is a TRAFFIC MANAGEMENT pattern. It ONLY:
 * - Tracks request counts
 * - Enforces rate limits
 * - Manages burst limits
 * - Implements cooldown periods
 *
 * Rate Limiter MUST NEVER:
 * - Modify business logic
 * - Grant rewards
 * - Modify balances
 * - Execute game logic
 */

/**
 * Rate limiter result.
 */
export interface RateLimitResult {
  /** Whether the request is allowed */
  allowed: boolean;
  /** Remaining requests in current window */
  remaining: number;
  /** Total limit in current window */
  limit: number;
  /** Time until the window resets in milliseconds */
  resetInMs: number;
  /** Time until cooldown ends in milliseconds (if in cooldown) */
  cooldownRemainingMs?: number;
}

/**
 * Rate limiter statistics.
 */
export interface RateLimiterStats {
  /** Provider name */
  providerName: string;
  /** Current request count in window */
  currentCount: number;
  /** Limit per window */
  limitPerWindow: number;
  /** Window size in milliseconds */
  windowSizeMs: number;
  /** Current burst count */
  burstCount: number;
  /** Burst limit */
  burstLimit: number;
  /** Whether in cooldown */
  isInCooldown: boolean;
  /** Cooldown ends at timestamp */
  cooldownEndsAt: Date | null;
  /** Total requests allowed */
  totalAllowed: number;
  /** Total requests rejected */
  totalRejected: number;
}

/**
 * Rate limiter configuration.
 */
export interface RateLimiterConfig {
  /** Requests per minute */
  requestsPerMinute?: number;
  /** Burst limit (requests per second) */
  burstLimit?: number;
  /** Cooldown period in milliseconds after limit exceeded */
  cooldownMs?: number;
  /** Window size in milliseconds */
  windowSizeMs?: number;
  /** Whether to use sliding window */
  useSlidingWindow?: boolean;
}

/**
 * Rate limiter entry for tracking.
 */
interface RateLimitEntry {
  count: number;
  windowStart: number;
  burstCount: number;
  lastRequestTime: number;
  cooldownUntil: number | null;
}

/**
 * Default rate limiter configuration.
 */
export const DEFAULT_RATE_LIMITER_CONFIG: Required<RateLimiterConfig> = {
  requestsPerMinute: 60,
  burstLimit: 10,
  cooldownMs: 60000,
  windowSizeMs: 60000,
  useSlidingWindow: false,
};

/**
 * Rate Limiter implementation.
 * Implements rate limiting with sliding window and burst control.
 */
export class RateLimiter {
  private readonly providerName: string;
  private readonly config: Required<RateLimiterConfig>;
  private entry: RateLimitEntry;
  private totalAllowed = 0;
  private totalRejected = 0;

  /**
   * Creates a new Rate Limiter.
   */
  constructor(providerName: string, config?: RateLimiterConfig) {
    this.providerName = providerName;
    this.config = { ...DEFAULT_RATE_LIMITER_CONFIG, ...config };
    this.entry = this.createEmptyEntry();
  }

  /**
   * Creates an empty entry for tracking.
   */
  private createEmptyEntry(): RateLimitEntry {
    return {
      count: 0,
      windowStart: Date.now(),
      burstCount: 0,
      lastRequestTime: 0,
      cooldownUntil: null,
    };
  }

  /**
   * Checks if a request is allowed.
   */
  check(): RateLimitResult {
    const now = Date.now();

    // Check cooldown
    if (this.entry.cooldownUntil && now < this.entry.cooldownUntil) {
      this.totalRejected++;
      return {
        allowed: false,
        remaining: 0,
        limit: this.config.requestsPerMinute,
        resetInMs: this.config.windowSizeMs,
        cooldownRemainingMs: this.entry.cooldownUntil - now,
      };
    }

    // Clear cooldown
    if (this.entry.cooldownUntil && now >= this.entry.cooldownUntil) {
      this.entry.cooldownUntil = null;
      this.entry.count = 0;
      this.entry.windowStart = now;
    }

    // Check and update window
    this.ensureWindowUpdated(now);

    // Check rate limit
    if (this.entry.count >= this.config.requestsPerMinute) {
      this.totalRejected++;
      this.entry.cooldownUntil = now + this.config.cooldownMs;
      return {
        allowed: false,
        remaining: 0,
        limit: this.config.requestsPerMinute,
        resetInMs: this.getResetTimeMs(now),
        cooldownRemainingMs: this.config.cooldownMs,
      };
    }

    // Check burst limit
    if (this.entry.burstCount >= this.config.burstLimit) {
      const burstResetMs = this.getBurstResetTimeMs(now);
      if (burstResetMs > 0) {
        this.totalRejected++;
        return {
          allowed: false,
          remaining: 0,
          limit: this.config.requestsPerMinute,
          resetInMs: this.getResetTimeMs(now),
        };
      }
    }

    // Allow request
    this.entry.count++;
    this.entry.burstCount++;
    this.entry.lastRequestTime = now;
    this.totalAllowed++;

    return {
      allowed: true,
      remaining: Math.max(0, this.config.requestsPerMinute - this.entry.count),
      limit: this.config.requestsPerMinute,
      resetInMs: this.getResetTimeMs(now),
    };
  }

  /**
   * Attempts to acquire a slot for a request.
   * Returns true if allowed, false otherwise.
   */
  tryAcquire(): boolean {
    return this.check().allowed;
  }

  /**
   * Gets rate limiter statistics.
   */
  getStats(): RateLimiterStats {
    const now = Date.now();
    this.ensureWindowUpdated(now);

    return {
      providerName: this.providerName,
      currentCount: this.entry.count,
      limitPerWindow: this.config.requestsPerMinute,
      windowSizeMs: this.config.windowSizeMs,
      burstCount: this.entry.burstCount,
      burstLimit: this.config.burstLimit,
      isInCooldown: this.entry.cooldownUntil !== null && now < this.entry.cooldownUntil,
      cooldownEndsAt: this.entry.cooldownUntil ? new Date(this.entry.cooldownUntil) : null,
      totalAllowed: this.totalAllowed,
      totalRejected: this.totalRejected,
    };
  }

  /**
   * Updates rate limiter configuration.
   */
  updateConfig(config: Partial<RateLimiterConfig>): void {
    this.config.requestsPerMinute = config.requestsPerMinute ?? this.config.requestsPerMinute;
    this.config.burstLimit = config.burstLimit ?? this.config.burstLimit;
    this.config.cooldownMs = config.cooldownMs ?? this.config.cooldownMs;
    this.config.windowSizeMs = config.windowSizeMs ?? this.config.windowSizeMs;
    this.config.useSlidingWindow = config.useSlidingWindow ?? this.config.useSlidingWindow;
  }

  /**
   * Resets the rate limiter.
   */
  reset(): void {
    this.entry = this.createEmptyEntry();
    this.totalAllowed = 0;
    this.totalRejected = 0;
  }

  /**
   * Gets remaining requests until limit.
   */
  getRemaining(): number {
    const now = Date.now();
    this.ensureWindowUpdated(now);
    return Math.max(0, this.config.requestsPerMinute - this.entry.count);
  }

  /**
   * Gets time until window resets.
   */
  getResetTimeMs(now: number): number {
    const windowEnd = this.entry.windowStart + this.config.windowSizeMs;
    return Math.max(0, windowEnd - now);
  }

  /**
   * Gets time until burst counter resets.
   */
  private getBurstResetTimeMs(now: number): number {
    const burstWindowMs = 1000; // Burst window is 1 second
    const burstEnd = this.entry.lastRequestTime + burstWindowMs;
    return Math.max(0, burstEnd - now);
  }

  /**
   * Ensures the current window is updated.
   */
  private ensureWindowUpdated(now: number): void {
    const windowEnd = this.entry.windowStart + this.config.windowSizeMs;

    if (now >= windowEnd) {
      // Window expired, start new one
      this.entry.windowStart = now;
      this.entry.count = 0;
      this.entry.burstCount = 0;
    } else if (this.config.useSlidingWindow) {
      // For sliding window, we could implement more complex logic
      // For now, simplified to fixed window
    }
  }

  /**
   * Gets the provider name.
   */
  getProviderName(): string {
    return this.providerName;
  }
}

/**
 * Rate Limiter Registry.
 * Manages multiple rate limiters.
 */
export class RateLimiterRegistry {
  private readonly limiters: Map<string, RateLimiter> = new Map();

  /**
   * Gets or creates a rate limiter for a provider.
   */
  getOrCreate(providerName: string, config?: RateLimiterConfig): RateLimiter {
    let limiter = this.limiters.get(providerName);
    if (!limiter) {
      limiter = new RateLimiter(providerName, config);
      this.limiters.set(providerName, limiter);
    }
    return limiter;
  }

  /**
   * Gets a rate limiter by provider name.
   */
  get(providerName: string): RateLimiter | undefined {
    return this.limiters.get(providerName);
  }

  /**
   * Removes a rate limiter.
   */
  remove(providerName: string): void {
    this.limiters.delete(providerName);
  }

  /**
   * Gets all rate limiter statistics.
   */
  getAllStats(): RateLimiterStats[] {
    const stats: RateLimiterStats[] = [];
    for (const limiter of this.limiters.values()) {
      stats.push(limiter.getStats());
    }
    return stats;
  }

  /**
   * Resets all rate limiters.
   */
  resetAll(): void {
    for (const limiter of this.limiters.values()) {
      limiter.reset();
    }
  }

  /**
   * Checks if a request is allowed for a provider.
   */
  check(providerName: string, config?: RateLimiterConfig): RateLimitResult {
    const limiter = this.getOrCreate(providerName, config);
    return limiter.check();
  }

  /**
   * Gets the count of managed limiters.
   */
  size(): number {
    return this.limiters.size;
  }
}

/**
 * Global rate limiter registry instance.
 */
let globalRegistry: RateLimiterRegistry | null = null;

/**
 * Gets the global rate limiter registry.
 */
export function getRateLimiterRegistry(): RateLimiterRegistry {
  if (!globalRegistry) {
    globalRegistry = new RateLimiterRegistry();
  }
  return globalRegistry;
}

/**
 * Creates a rate limiter with predefined configurations for common use cases.
 */
export class RateLimiterFactory {
  /**
   * Creates a rate limiter for standard API.
   */
  static createStandard(providerName: string): RateLimiter {
    return new RateLimiter(providerName, {
      requestsPerMinute: 60,
      burstLimit: 10,
      cooldownMs: 60000,
    });
  }

  /**
   * Creates a rate limiter for premium API.
   */
  static createPremium(providerName: string): RateLimiter {
    return new RateLimiter(providerName, {
      requestsPerMinute: 300,
      burstLimit: 50,
      cooldownMs: 30000,
    });
  }

  /**
   * Creates a rate limiter for enterprise API.
   */
  static createEnterprise(providerName: string): RateLimiter {
    return new RateLimiter(providerName, {
      requestsPerMinute: 1000,
      burstLimit: 100,
      cooldownMs: 10000,
    });
  }

  /**
   * Creates a rate limiter for strict rate limiting.
   */
  static createStrict(providerName: string): RateLimiter {
    return new RateLimiter(providerName, {
      requestsPerMinute: 10,
      burstLimit: 2,
      cooldownMs: 120000,
    });
  }

  /**
   * Creates a rate limiter with custom configuration.
   */
  static create(providerName: string, config: RateLimiterConfig): RateLimiter {
    return new RateLimiter(providerName, config);
  }
}
