/**
 * CacheInvalidated Event
 *
 * Event emitted when a cache entry is invalidated.
 */

import type { CacheKey } from '../value-objects/CacheKey';
import type { CacheType } from '../types/CacheType';

/**
 * CacheInvalidated event class.
 * Emitted when a cache entry is invalidated.
 */
export class CacheInvalidated {
  public readonly eventType = 'CacheInvalidated';
  public readonly cacheKey: string;
  public readonly cacheType: CacheType;
  public readonly invalidatedBy: string | null;
  public readonly timestamp: Date;

  /**
   * Creates a new CacheInvalidated event.
   */
  constructor(params: {
    cacheKey: CacheKey;
    cacheType: CacheType;
    invalidatedBy?: string | null;
    timestamp?: Date;
  }) {
    this.cacheKey = params.cacheKey.value;
    this.cacheType = params.cacheType;
    this.invalidatedBy = params.invalidatedBy ?? null;
    this.timestamp = params.timestamp ?? new Date();
  }

  /**
   * Serializes the event to a plain object.
   */
  public toJSON(): CacheInvalidatedJSON {
    return {
      eventType: this.eventType,
      cacheKey: this.cacheKey,
      cacheType: this.cacheType,
      invalidatedBy: this.invalidatedBy,
      timestamp: this.timestamp.toISOString(),
    };
  }
}

/**
 * JSON representation of CacheInvalidated event.
 */
export interface CacheInvalidatedJSON {
  eventType: string;
  cacheKey: string;
  cacheType: CacheType;
  invalidatedBy: string | null;
  timestamp: string;
}
