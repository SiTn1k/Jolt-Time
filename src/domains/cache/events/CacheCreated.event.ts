/**
 * CacheCreated Event
 *
 * Event emitted when a new cache entry is created.
 */

import type { CacheKey } from '../value-objects/CacheKey';
import type { CacheType } from '../types/CacheType';
import type { CacheStatus } from '../types/CacheStatus';

/**
 * CacheCreated event class.
 * Emitted when a new cache entry is created.
 */
export class CacheCreated {
  public readonly eventType = 'CacheCreated';
  public readonly cacheKey: string;
  public readonly cacheType: CacheType;
  public readonly status: CacheStatus;
  public readonly version: number;
  public readonly expiresAt: string | null;
  public readonly timestamp: Date;

  /**
   * Creates a new CacheCreated event.
   */
  constructor(params: {
    cacheKey: CacheKey;
    cacheType: CacheType;
    status: CacheStatus;
    version: number;
    expiresAt: Date | null;
    timestamp?: Date;
  }) {
    this.cacheKey = params.cacheKey.value;
    this.cacheType = params.cacheType;
    this.status = params.status;
    this.version = params.version;
    this.expiresAt = params.expiresAt?.toISOString() ?? null;
    this.timestamp = params.timestamp ?? new Date();
  }

  /**
   * Serializes the event to a plain object.
   */
  public toJSON(): CacheCreatedJSON {
    return {
      eventType: this.eventType,
      cacheKey: this.cacheKey,
      cacheType: this.cacheType,
      status: this.status,
      version: this.version,
      expiresAt: this.expiresAt,
      timestamp: this.timestamp.toISOString(),
    };
  }
}

/**
 * JSON representation of CacheCreated event.
 */
export interface CacheCreatedJSON {
  eventType: string;
  cacheKey: string;
  cacheType: CacheType;
  status: CacheStatus;
  version: number;
  expiresAt: string | null;
  timestamp: string;
}
