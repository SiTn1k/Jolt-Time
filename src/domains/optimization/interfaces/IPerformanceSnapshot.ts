/**
 * PerformanceSnapshot Interface
 *
 * Interface defining the contract for PerformanceSnapshot entities.
 */

import type { SnapshotId } from '../value-objects/SnapshotId';
import type { OptimizationMetadata } from '../types/OptimizationMetadata';

/**
 * PerformanceSnapshot interface.
 * Defines the contract for performance snapshot entities.
 */
export interface IPerformanceSnapshot {
  /** Unique snapshot identifier */
  readonly snapshotId: SnapshotId;

  /** Timestamp when snapshot was created */
  readonly createdAt: Date;

  /** Execution time in milliseconds */
  readonly executionTime: number;

  /** Memory usage in bytes */
  readonly memoryUsage: number;

  /** Cache hit rate percentage (0-100) */
  readonly cacheHitRate: number;

  /** Number of database queries */
  readonly databaseQueries: number;

  /** Snapshot metadata */
  readonly metadata: OptimizationMetadata;
}
