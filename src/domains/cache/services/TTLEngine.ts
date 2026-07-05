/**
 * TTL Engine
 *
 * Manages Time-To-Live (expiration) for cache entries.
 * Supports:
 * - Absolute TTL
 * - Sliding TTL
 * - Manual Expiration
 * - Expiration Check
 * - Expiration Statistics
 *
 * IMPORTANT: Cache is a METADATA management layer. It ONLY stores cache entries,
 * regions, and statistics. Cache MUST NEVER modify gameplay, grant rewards,
 * modify balances, modify inventory, or execute business logic.
 */

import type { CacheEntry } from '../entities/CacheEntry';

/**
 * TTL type.
 */
export type TTLType = 'absolute' | 'sliding' | 'manual' | 'none';

/**
 * TTL configuration.
 */
export interface TTLConfig {
  type: TTLType;
  ttlSeconds: number | null;
  createdAt: Date;
  expiresAt: Date | null;
  lastAccessedAt: Date;
}

/**
 * TTL statistics.
 */
export interface TTLStatistics {
  totalEntries: number;
  expiredEntries: number;
  expiringSoonEntries: number;
  averageRemainingTTL: number;
  checkCount: number;
  expirationCount: number;
}

/**
 * TTL Engine.
 * Handles TTL calculations and expiration for cache entries.
 */
export class TTLEngine {
  private _checkCount = 0;
  private _expirationCount = 0;
  private readonly _slidingWindowSeconds: number;

  constructor(slidingWindowSeconds: number = 60) {
    this._slidingWindowSeconds = slidingWindowSeconds;
  }

  /**
   * Create TTL configuration for absolute TTL.
   */
  public createAbsoluteTTL(ttlSeconds: number, createdAt?: Date): TTLConfig {
    const now = createdAt ?? new Date();
    return {
      type: 'absolute',
      ttlSeconds,
      createdAt: now,
      expiresAt: new Date(now.getTime() + ttlSeconds * 1000),
      lastAccessedAt: now,
    };
  }

  /**
   * Create TTL configuration for sliding TTL.
   */
  public createSlidingTTL(ttlSeconds: number, lastAccessedAt?: Date): TTLConfig {
    const now = lastAccessedAt ?? new Date();
    return {
      type: 'sliding',
      ttlSeconds,
      createdAt: now,
      expiresAt: new Date(now.getTime() + ttlSeconds * 1000),
      lastAccessedAt: now,
    };
  }

  /**
   * Create TTL configuration for manual expiration.
   */
  public createManualTTL(expiresAt: Date): TTLConfig {
    const now = new Date();
    return {
      type: 'manual',
      ttlSeconds: null,
      createdAt: now,
      expiresAt,
      lastAccessedAt: now,
    };
  }

  /**
   * Create TTL configuration for no expiration.
   */
  public createNoTTL(): TTLConfig {
    const now = new Date();
    return {
      type: 'none',
      ttlSeconds: null,
      createdAt: now,
      expiresAt: null,
      lastAccessedAt: now,
    };
  }

  /**
   * Check if a cache entry is expired.
   */
  public isExpired(entry: CacheEntry | TTLConfig): boolean {
    this._checkCount++;

    const expiresAt = entry.expiresAt;
    if (!expiresAt) {
      return false;
    }

    const isExpired = new Date() > expiresAt;
    if (isExpired) {
      this._expirationCount++;
    }

    return isExpired;
  }

  /**
   * Check if entry is expiring soon (within sliding window).
   */
  public isExpiringSoon(entry: CacheEntry | TTLConfig, windowSeconds?: number): boolean {
    const window = windowSeconds ?? this._slidingWindowSeconds;
    const expiresAt = entry.expiresAt;

    if (!expiresAt) {
      return false;
    }

    const threshold = new Date(Date.now() + window * 1000);
    return expiresAt <= threshold && expiresAt > new Date();
  }

  /**
   * Get remaining TTL in seconds.
   */
  public getRemainingTTL(entry: CacheEntry | TTLConfig): number | null {
    const expiresAt = entry.expiresAt;

    if (!expiresAt) {
      return null;
    }

    const remaining = expiresAt.getTime() - Date.now();
    return remaining > 0 ? Math.floor(remaining / 1000) : 0;
  }

  /**
   * Get elapsed time since creation in seconds.
   */
  public getElapsedTime(entry: CacheEntry | TTLConfig): number {
    const createdAt = entry.createdAt;
    return Math.floor((Date.now() - createdAt.getTime()) / 1000);
  }

  /**
   * Refresh TTL (update last accessed time and recalculate expiration for sliding TTL).
   */
  public refresh(entry: CacheEntry, ttlSeconds?: number): TTLConfig {
    const now = new Date();
    const metadata = entry.metadata as { customFields?: { ttlType?: string; ttlSeconds?: number } } | undefined;

    if (metadata?.customFields?.ttlType === 'sliding') {
      const slidingSeconds = ttlSeconds ?? metadata.customFields.ttlSeconds ?? 3600;
      return this.createSlidingTTL(slidingSeconds, now);
    }

    if (metadata?.customFields?.ttlType === 'absolute') {
      const createdAt = entry.createdAt;
      const absoluteSeconds = ttlSeconds ?? metadata.customFields.ttlSeconds ?? 3600;
      return {
        type: 'absolute',
        ttlSeconds: absoluteSeconds,
        createdAt,
        expiresAt: new Date(createdAt.getTime() + absoluteSeconds * 1000),
        lastAccessedAt: now,
      };
    }

    return {
      type: 'none',
      ttlSeconds: null,
      createdAt: entry.createdAt,
      expiresAt: entry.expiresAt,
      lastAccessedAt: now,
    };
  }

  /**
   * Extend TTL by specified seconds.
   */
  public extend(entry: CacheEntry, additionalSeconds: number): Date | null {
    if (!entry.expiresAt) {
      return null;
    }

    return new Date(entry.expiresAt.getTime() + additionalSeconds * 1000);
  }

  /**
   * Calculate expiration date from TTL seconds.
   */
  public calculateExpiration(ttlSeconds: number, fromDate?: Date): Date {
    const base = fromDate ?? new Date();
    return new Date(base.getTime() + ttlSeconds * 1000);
  }

  /**
   * Calculate TTL seconds from expiration date.
   */
  public calculateTTLFromExpiration(expiresAt: Date, fromDate?: Date): number {
    const base = fromDate ?? new Date();
    const remaining = expiresAt.getTime() - base.getTime();
    return Math.max(0, Math.floor(remaining / 1000));
  }

  /**
   * Get TTL type from entry metadata.
   */
  public getTTLType(entry: CacheEntry): TTLType {
    const metadata = entry.metadata as { customFields?: { ttlType?: string; ttlSeconds?: number } } | undefined;
    
    if (metadata?.customFields?.ttlType) {
      return metadata.customFields.ttlType as TTLType;
    }

    if (!entry.expiresAt) {
      return 'none';
    }

    const ttlSeconds = metadata?.customFields?.ttlSeconds ?? 0;
    if (entry.createdAt.getTime() + ttlSeconds * 1000 === entry.expiresAt.getTime()) {
      return 'absolute';
    }

    return 'sliding';
  }

  /**
   * Check multiple entries for expiration.
   */
  public checkExpiration(entries: CacheEntry[]): {
    expired: CacheEntry[];
    valid: CacheEntry[];
    expiringSoon: CacheEntry[];
  } {
    const expired: CacheEntry[] = [];
    const valid: CacheEntry[] = [];
    const expiringSoon: CacheEntry[] = [];

    for (const entry of entries) {
      if (this.isExpired(entry)) {
        expired.push(entry);
      } else if (this.isExpiringSoon(entry)) {
        expiringSoon.push(entry);
      } else {
        valid.push(entry);
      }
    }

    return { expired, valid, expiringSoon };
  }

  /**
   * Get statistics about TTL.
   */
  public getStatistics(entries: CacheEntry[]): TTLStatistics {
    let expiredCount = 0;
    let expiringSoonCount = 0;
    let totalRemainingTTL = 0;
    let entriesWithTTL = 0;

    for (const entry of entries) {
      if (this.isExpired(entry)) {
        expiredCount++;
      } else {
        const remaining = this.getRemainingTTL(entry);
        if (remaining !== null) {
          totalRemainingTTL += remaining;
          entriesWithTTL++;
        }

        if (this.isExpiringSoon(entry)) {
          expiringSoonCount++;
        }
      }
    }

    return {
      totalEntries: entries.length,
      expiredEntries: expiredCount,
      expiringSoonEntries: expiringSoonCount,
      averageRemainingTTL: entriesWithTTL > 0 ? totalRemainingTTL / entriesWithTTL : 0,
      checkCount: this._checkCount,
      expirationCount: this._expirationCount,
    };
  }

  /**
   * Reset statistics.
   */
  public resetStatistics(): void {
    this._checkCount = 0;
    this._expirationCount = 0;
  }

  /**
   * Parse TTL from various formats.
   */
  public parseTTL(input: number | string | null | undefined): number | null {
    if (input === null || input === undefined) {
      return null;
    }

    if (typeof input === 'number') {
      return input > 0 ? input : null;
    }

    // Parse string formats like "1h", "30m", "60s"
    const match = input.match(/^(\d+)([smhd])$/);
    if (match) {
      const value = parseInt(match[1], 10);
      const unit = match[2];

      switch (unit) {
        case 's': return value;
        case 'm': return value * 60;
        case 'h': return value * 3600;
        case 'd': return value * 86400;
      }
    }

    const parsed = parseInt(input, 10);
    return !isNaN(parsed) && parsed > 0 ? parsed : null;
  }

  /**
   * Format TTL for display.
   */
  public formatTTL(ttlSeconds: number): string {
    if (ttlSeconds < 60) {
      return `${ttlSeconds}s`;
    }

    if (ttlSeconds < 3600) {
      const minutes = Math.floor(ttlSeconds / 60);
      const seconds = ttlSeconds % 60;
      return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
    }

    const hours = Math.floor(ttlSeconds / 3600);
    const minutes = Math.floor((ttlSeconds % 3600) / 60);
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
}
