/**
 * CacheEntry Entity
 *
 * Domain entity representing a cache entry.
 * A cache entry stores a key-value pair with metadata and expiration.
 *
 * CacheEntry Entity Responsibilities:
 * - Store cache key and value
 * - Track creation and expiration
 * - Store version for cache invalidation
 * - Record metadata
 *
 * CacheEntry Entity is NOT:
 * - A cache engine
 * - A cache accessor
 * - A gameplay modifier
 * - A state changer
 */

import type { ICacheEntry } from '../interfaces/ICacheEntry';
import { CacheKey } from '../value-objects/CacheKey';
import type { CacheType } from '../types/CacheType';
import type { CacheStatus } from '../types/CacheStatus';
import type { CacheEntryMetadata } from '../types/CacheMetadata';

/**
 * CacheEntry entity props for constructor.
 */
export interface CacheEntryProps {
  cacheKey: CacheKey;
  cacheValue: unknown;
  cacheType: CacheType;
  status: CacheStatus;
  createdAt: Date;
  expiresAt: Date | null;
  version: number;
  metadata: CacheEntryMetadata;
}

/**
 * Database record representation of CacheEntry.
 */
export interface CacheEntryRecord {
  cache_key: string;
  cache_value: unknown;
  cache_type: string;
  status: string;
  created_at: string;
  expires_at: string | null;
  version: number;
  metadata: CacheEntryMetadata;
}

/**
 * JSON serialization representation of CacheEntry.
 */
export interface CacheEntryJSON {
  cacheKey: string;
  cacheValue: unknown;
  cacheType: CacheType;
  status: CacheStatus;
  createdAt: string;
  expiresAt: string | null;
  version: number;
  metadata: CacheEntryMetadata;
}

/**
 * CacheEntry entity class.
 * Immutable domain entity representing a cache entry.
 */
export class CacheEntry implements ICacheEntry {
  public readonly cacheKey: CacheKey;
  public readonly cacheValue: unknown;
  public readonly cacheType: CacheType;
  public readonly status: CacheStatus;
  public readonly createdAt: Date;
  public readonly expiresAt: Date | null;
  public readonly version: number;
  public readonly metadata: CacheEntryMetadata;

  /**
   * Creates a new CacheEntry instance.
   */
  constructor(props: CacheEntryProps) {
    this.cacheKey = props.cacheKey;
    this.cacheValue = props.cacheValue;
    this.cacheType = props.cacheType;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.expiresAt = props.expiresAt;
    this.version = props.version;
    this.metadata = props.metadata;
  }

  /**
   * Creates a new CacheEntry entity.
   * Factory method for new cache entry creation.
   */
  public static create(params: {
    cacheKey: CacheKey | string;
    cacheValue: unknown;
    cacheType: CacheType;
    status?: CacheStatus;
    createdAt?: Date;
    expiresAt?: Date | null;
    version?: number;
    metadata?: CacheEntryMetadata;
  }): CacheEntry {
    const key = typeof params.cacheKey === 'string' ? CacheKey.create(params.cacheKey) : params.cacheKey;

    return new CacheEntry({
      cacheKey: key,
      cacheValue: params.cacheValue,
      cacheType: params.cacheType,
      status: params.status ?? 'active',
      createdAt: params.createdAt ?? new Date(),
      expiresAt: params.expiresAt ?? null,
      version: params.version ?? 1,
      metadata: params.metadata ?? {
        description: '',
        tags: [],
        source: undefined,
        createdBy: undefined,
        lastAccessedAt: undefined,
        accessCount: 0,
        customFields: {},
      },
    });
  }

  /**
   * Reconstructs a CacheEntry from stored data.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: CacheEntryRecord): CacheEntry {
    return new CacheEntry({
      cacheKey: CacheKey.reconstruct(record.cache_key),
      cacheValue: record.cache_value,
      cacheType: record.cache_type as CacheType,
      status: record.status as CacheStatus,
      createdAt: new Date(record.created_at),
      expiresAt: record.expires_at ? new Date(record.expires_at) : null,
      version: record.version,
      metadata: record.metadata,
    });
  }

  /**
   * Checks if this entry is active.
   */
  public get isActive(): boolean {
    return this.status === 'active';
  }

  /**
   * Checks if this entry is expired.
   */
  public get isExpired(): boolean {
    if (this.expiresAt === null) {
      return false;
    }
    return new Date() > this.expiresAt;
  }

  /**
   * Checks if this entry can be used (active and not expired).
   */
  public get canUse(): boolean {
    return this.isActive && !this.isExpired;
  }

  /**
   * Checks if this entry has a TTL set.
   */
  public get hasTtl(): boolean {
    return this.expiresAt !== null;
  }

  /**
   * Creates a copy with updated fields.
   */
  public copyWith(params: Partial<Omit<CacheEntryProps, 'cacheKey' | 'createdAt'>>): CacheEntry {
    return new CacheEntry({
      cacheKey: this.cacheKey,
      cacheValue: params.cacheValue ?? this.cacheValue,
      cacheType: params.cacheType ?? this.cacheType,
      status: params.status ?? this.status,
      createdAt: this.createdAt,
      expiresAt: params.expiresAt !== undefined ? params.expiresAt : this.expiresAt,
      version: params.version ?? this.version,
      metadata: params.metadata ?? this.metadata,
    });
  }

  /**
   * Creates a copy marked as expired.
   */
  public markExpired(): CacheEntry {
    return this.copyWith({ status: 'expired' });
  }

  /**
   * Creates a copy marked as invalidated.
   */
  public markInvalidated(): CacheEntry {
    return this.copyWith({ status: 'invalidated' });
  }

  /**
   * Creates a copy marked as evicted.
   */
  public markEvicted(): CacheEntry {
    return this.copyWith({ status: 'evicted' });
  }

  /**
   * Increments the version and returns a new entry.
   */
  public incrementVersion(): CacheEntry {
    return this.copyWith({ version: this.version + 1 });
  }

  /**
   * Serializes the CacheEntry to a plain object.
   */
  public toJSON(): CacheEntryJSON {
    return {
      cacheKey: this.cacheKey.value,
      cacheValue: this.cacheValue,
      cacheType: this.cacheType,
      status: this.status,
      createdAt: this.createdAt.toISOString(),
      expiresAt: this.expiresAt?.toISOString() ?? null,
      version: this.version,
      metadata: this.metadata,
    };
  }

  /**
   * Converts to database record format.
   */
  public toRecord(): CacheEntryRecord {
    return {
      cache_key: this.cacheKey.value,
      cache_value: this.cacheValue,
      cache_type: this.cacheType,
      status: this.status,
      created_at: this.createdAt.toISOString(),
      expires_at: this.expiresAt?.toISOString() ?? null,
      version: this.version,
      metadata: this.metadata,
    };
  }
}
