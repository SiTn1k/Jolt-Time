/**
 * PerformanceSnapshot Entity
 *
 * Domain entity representing a point-in-time performance snapshot.
 * This entity ONLY stores snapshot data - it never modifies gameplay.
 *
 * PerformanceSnapshot Entity Responsibilities:
 * - Store snapshot measurements
 * - Track snapshot timing
 * - Provide immutable snapshot record
 *
 * PerformanceSnapshot Entity is NOT:
 * - A snapshot calculator
 * - A threshold monitor
 * - An alert generator
 */

import type { IPerformanceSnapshot } from '../interfaces/IPerformanceSnapshot';
import { SnapshotId } from '../value-objects/SnapshotId';
import { OptimizationMetadata, INITIAL_OPTIMIZATION_METADATA } from '../types/OptimizationMetadata';

/**
 * PerformanceSnapshot entity class.
 * Immutable domain entity representing a performance snapshot.
 */
export class PerformanceSnapshot implements IPerformanceSnapshot {
  /** Unique snapshot identifier */
  public readonly snapshotId: SnapshotId;

  /** Timestamp when snapshot was created */
  public readonly createdAt: Date;

  /** Execution time in milliseconds */
  public readonly executionTime: number;

  /** Memory usage in bytes */
  public readonly memoryUsage: number;

  /** Cache hit rate percentage (0-100) */
  public readonly cacheHitRate: number;

  /** Number of database queries */
  public readonly databaseQueries: number;

  /** Snapshot metadata */
  public readonly metadata: OptimizationMetadata;

  /**
   * Creates a new PerformanceSnapshot instance.
   * @param props PerformanceSnapshot properties
   */
  constructor(props: PerformanceSnapshotProps) {
    this.snapshotId = props.snapshotId;
    this.createdAt = props.createdAt;
    this.executionTime = props.executionTime;
    this.memoryUsage = props.memoryUsage;
    this.cacheHitRate = props.cacheHitRate;
    this.databaseQueries = props.databaseQueries;
    this.metadata = props.metadata ?? { ...INITIAL_OPTIMIZATION_METADATA };
  }

  /**
   * Creates a new PerformanceSnapshot for recording.
   * Factory method for new snapshot creation.
   */
  public static create(params: {
    snapshotId: SnapshotId;
    executionTime: number;
    memoryUsage: number;
    cacheHitRate: number;
    databaseQueries: number;
    metadata?: OptimizationMetadata;
  }): PerformanceSnapshot {
    return new PerformanceSnapshot({
      snapshotId: params.snapshotId,
      createdAt: new Date(),
      executionTime: params.executionTime,
      memoryUsage: params.memoryUsage,
      cacheHitRate: params.cacheHitRate,
      databaseQueries: params.databaseQueries,
      metadata: params.metadata ?? { ...INITIAL_OPTIMIZATION_METADATA },
    });
  }

  /**
   * Creates a PerformanceSnapshot from a database record.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: PerformanceSnapshotRecord): PerformanceSnapshot {
    return new PerformanceSnapshot({
      snapshotId: SnapshotId.reconstruct(record.snapshot_id),
      createdAt: new Date(record.created_at),
      executionTime: record.execution_time,
      memoryUsage: record.memory_usage,
      cacheHitRate: record.cache_hit_rate,
      databaseQueries: record.database_queries,
      metadata: record.metadata ?? { ...INITIAL_OPTIMIZATION_METADATA },
    });
  }

  /**
   * Serializes the PerformanceSnapshot to a plain object.
   */
  public toJSON(): PerformanceSnapshotJSON {
    return {
      snapshotId: this.snapshotId.value,
      createdAt: this.createdAt.toISOString(),
      executionTime: this.executionTime,
      memoryUsage: this.memoryUsage,
      cacheHitRate: this.cacheHitRate,
      databaseQueries: this.databaseQueries,
      metadata: this.metadata,
    };
  }
}

/**
 * PerformanceSnapshot properties interface for constructor.
 */
export interface PerformanceSnapshotProps {
  snapshotId: SnapshotId;
  createdAt: Date;
  executionTime: number;
  memoryUsage: number;
  cacheHitRate: number;
  databaseQueries: number;
  metadata?: OptimizationMetadata;
}

/**
 * Database record representation of PerformanceSnapshot.
 */
export interface PerformanceSnapshotRecord {
  snapshot_id: string;
  created_at: string;
  execution_time: number;
  memory_usage: number;
  cache_hit_rate: number;
  database_queries: number;
  metadata?: OptimizationMetadata;
}

/**
 * JSON serialization representation of PerformanceSnapshot.
 */
export interface PerformanceSnapshotJSON {
  snapshotId: string;
  createdAt: string;
  executionTime: number;
  memoryUsage: number;
  cacheHitRate: number;
  databaseQueries: number;
  metadata: OptimizationMetadata;
}
