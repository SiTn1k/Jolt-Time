/**
 * CacheExpired Event
 *
 * Event emitted when a cache entry expires.
 */

import type { CacheKey } from '../value-objects/CacheKey';
import type { CacheType } from '../types/CacheType';

/**
 * CacheExpired event class.
 * Emitted when a cache entry expires.
 */
export class CacheExpired {
  public readonly eventType = 'CacheExpired';
  public readonly cacheKey: string;
  public readonly cacheType: CacheType;
  public readonly expiredAt: Date;
  public readonly timestamp: Date;

  /**
   * Creates a new CacheExpired event.
   */
  constructor(params: {
    cacheKey: CacheKey;
    cacheType: CacheType;
    expiredAt: Date;
    timestamp?: Date;
  }) {
    this.cacheKey = params.cacheKey.value;
    this.cacheType = params.cacheType;
    this.expiredAt = params.expiredAt;
    this.timestamp = params.timestamp ?? new Date();
  }

  /**
   * Serializes the event to a plain object.
   */
  public toJSON(): CacheExpiredJSON {
    return {
      eventType: this.eventType,
      cacheKey: this.cacheKey,
      cacheType: this.cacheType,
      expiredAt: this.expiredAt.toISOString(),
      timestamp: this.timestamp.toISOString(),
    };
  }
}

/**
 * JSON representation of CacheExpired event.
 */
export interface CacheExpiredJSON {
  eventType: string;
  cacheKey: string;
  cacheType: CacheType;
  expiredAt: string;
  timestamp: string;
}
