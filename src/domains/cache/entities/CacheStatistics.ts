/**
 * CacheStatistics Entity
 *
 * Domain entity representing cache statistics.
 * Tracks cache performance metrics like hits, misses, and memory usage.
 *
 * CacheStatistics Entity Responsibilities:
 * - Store statistics metadata (ID)
 * - Track cache hits and misses
 * - Track evictions
 * - Track memory usage
 * - Record entry count
 *
 * CacheStatistics Entity is NOT:
 * - A cache engine
 * - A cache accessor
 * - A gameplay modifier
 * - A state changer
 */

import type { ICacheStatistics } from '../interfaces/ICacheStatistics';
import { StatisticsId } from '../value-objects/StatisticsId';
import type { CacheStatisticsMetadata } from '../types/CacheMetadata';
import { createEmptyCacheMetrics, calculateHitRate } from '../types/CacheMetrics';

/**
 * CacheStatistics entity props for constructor.
 */
export interface CacheStatisticsProps {
  statisticsId: StatisticsId;
  hits: number;
  misses: number;
  evictions: number;
  entries: number;
  memoryUsage: number;
  updatedAt: Date;
  metadata: CacheStatisticsMetadata;
}

/**
 * Database record representation of CacheStatistics.
 */
export interface CacheStatisticsRecord {
  statistics_id: string;
  hits: number;
  misses: number;
  evictions: number;
  entries: number;
  memory_usage: number;
  updated_at: string;
  metadata: CacheStatisticsMetadata;
}

/**
 * JSON serialization representation of CacheStatistics.
 */
export interface CacheStatisticsJSON {
  statisticsId: string;
  hits: number;
  misses: number;
  evictions: number;
  entries: number;
  memoryUsage: number;
  updatedAt: string;
  metadata: CacheStatisticsMetadata;
}

/**
 * CacheStatistics entity class.
 * Immutable domain entity representing cache statistics.
 */
export class CacheStatistics implements ICacheStatistics {
  public readonly statisticsId: StatisticsId;
  public readonly hits: number;
  public readonly misses: number;
  public readonly evictions: number;
  public readonly entries: number;
  public readonly memoryUsage: number;
  public readonly updatedAt: Date;
  public readonly metadata: CacheStatisticsMetadata;

  /**
   * Creates a new CacheStatistics instance.
   */
  constructor(props: CacheStatisticsProps) {
    this.statisticsId = props.statisticsId;
    this.hits = props.hits;
    this.misses = props.misses;
    this.evictions = props.evictions;
    this.entries = props.entries;
    this.memoryUsage = props.memoryUsage;
    this.updatedAt = props.updatedAt;
    this.metadata = props.metadata;
  }

  /**
   * Creates a new CacheStatistics entity.
   * Factory method for new statistics creation.
   */
  public static create(params?: {
    statisticsId?: StatisticsId;
    hits?: number;
    misses?: number;
    evictions?: number;
    entries?: number;
    memoryUsage?: number;
    updatedAt?: Date;
    metadata?: CacheStatisticsMetadata;
  }): CacheStatistics {
    const emptyMetrics = createEmptyCacheMetrics();

    return new CacheStatistics({
      statisticsId: params?.statisticsId ?? StatisticsId.generate(),
      hits: params?.hits ?? emptyMetrics.hits,
      misses: params?.misses ?? emptyMetrics.misses,
      evictions: params?.evictions ?? emptyMetrics.evictions,
      entries: params?.entries ?? emptyMetrics.entries,
      memoryUsage: params?.memoryUsage ?? emptyMetrics.memoryUsage,
      updatedAt: params?.updatedAt ?? new Date(),
      metadata: params?.metadata ?? {
        timeWindow: undefined,
        periodStart: undefined,
        periodEnd: undefined,
        customFields: {},
      },
    });
  }

  /**
   * Reconstructs a CacheStatistics from stored data.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: CacheStatisticsRecord): CacheStatistics {
    return new CacheStatistics({
      statisticsId: StatisticsId.reconstruct(record.statistics_id),
      hits: record.hits,
      misses: record.misses,
      evictions: record.evictions,
      entries: record.entries,
      memoryUsage: record.memory_usage,
      updatedAt: new Date(record.updated_at),
      metadata: record.metadata,
    });
  }

  /**
   * Gets the hit rate metrics.
   */
  public get hitRate() {
    return calculateHitRate(this.hits, this.misses);
  }

  /**
   * Gets the total number of requests (hits + misses).
   */
  public get totalRequests(): number {
    return this.hits + this.misses;
  }

  /**
   * Gets the hit rate as a percentage (0-100).
   */
  public get hitRatePercent(): number {
    return this.hitRate.hitRatePercent;
  }

  /**
   * Checks if this statistics has any data.
   */
  public get hasData(): boolean {
    return this.totalRequests > 0 || this.entries > 0;
  }

  /**
   * Creates a copy with updated fields.
   */
  public copyWith(params: Partial<Omit<CacheStatisticsProps, 'statisticsId'>>): CacheStatistics {
    return new CacheStatistics({
      statisticsId: this.statisticsId,
      hits: params.hits ?? this.hits,
      misses: params.misses ?? this.misses,
      evictions: params.evictions ?? this.evictions,
      entries: params.entries ?? this.entries,
      memoryUsage: params.memoryUsage ?? this.memoryUsage,
      updatedAt: params.updatedAt ?? new Date(),
      metadata: params.metadata ?? this.metadata,
    });
  }

  /**
   * Creates a copy with a hit incremented.
   */
  public recordHit(): CacheStatistics {
    return this.copyWith({ hits: this.hits + 1, updatedAt: new Date() });
  }

  /**
   * Creates a copy with a miss incremented.
   */
  public recordMiss(): CacheStatistics {
    return this.copyWith({ misses: this.misses + 1, updatedAt: new Date() });
  }

  /**
   * Creates a copy with an eviction incremented.
   */
  public recordEviction(): CacheStatistics {
    return this.copyWith({ evictions: this.evictions + 1, updatedAt: new Date() });
  }

  /**
   * Creates a copy with entries count updated.
   */
  public updateEntries(count: number): CacheStatistics {
    return this.copyWith({ entries: count, updatedAt: new Date() });
  }

  /**
   * Creates a copy with memory usage updated.
   */
  public updateMemoryUsage(usage: number): CacheStatistics {
    return this.copyWith({ memoryUsage: usage, updatedAt: new Date() });
  }

  /**
   * Resets all statistics to zero.
   */
  public reset(): CacheStatistics {
    return this.copyWith({
      hits: 0,
      misses: 0,
      evictions: 0,
      entries: 0,
      memoryUsage: 0,
      updatedAt: new Date(),
    });
  }

  /**
   * Serializes the CacheStatistics to a plain object.
   */
  public toJSON(): CacheStatisticsJSON {
    return {
      statisticsId: this.statisticsId.value,
      hits: this.hits,
      misses: this.misses,
      evictions: this.evictions,
      entries: this.entries,
      memoryUsage: this.memoryUsage,
      updatedAt: this.updatedAt.toISOString(),
      metadata: this.metadata,
    };
  }

  /**
   * Converts to database record format.
   */
  public toRecord(): CacheStatisticsRecord {
    return {
      statistics_id: this.statisticsId.value,
      hits: this.hits,
      misses: this.misses,
      evictions: this.evictions,
      entries: this.entries,
      memory_usage: this.memoryUsage,
      updated_at: this.updatedAt.toISOString(),
      metadata: this.metadata,
    };
  }
}
