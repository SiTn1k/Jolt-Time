/**
 * Performance Snapshot Created Event
 *
 * Domain event emitted when a performance snapshot is created.
 */

import type { SnapshotId } from '../value-objects/SnapshotId';

/**
 * Event data for snapshot creation.
 */
export interface PerformanceSnapshotCreatedEventData {
  /** Snapshot ID */
  snapshotId: string;

  /** Execution time in milliseconds */
  executionTime: number;

  /** Memory usage in bytes */
  memoryUsage: number;

  /** Cache hit rate percentage */
  cacheHitRate: number;

  /** Number of database queries */
  databaseQueries: number;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for snapshot creation.
 */
export interface PerformanceSnapshotCreatedEvent {
  /** Event type identifier */
  readonly eventType: 'PerformanceSnapshotCreated';

  /** Event data */
  readonly data: PerformanceSnapshotCreatedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a PerformanceSnapshotCreatedEvent.
 */
export function createPerformanceSnapshotCreatedEvent(params: {
  snapshotId: SnapshotId;
  executionTime: number;
  memoryUsage: number;
  cacheHitRate: number;
  databaseQueries: number;
}): PerformanceSnapshotCreatedEvent {
  return {
    eventType: 'PerformanceSnapshotCreated',
    version: 1,
    data: {
      snapshotId: params.snapshotId.value,
      executionTime: params.executionTime,
      memoryUsage: params.memoryUsage,
      cacheHitRate: params.cacheHitRate,
      databaseQueries: params.databaseQueries,
      occurredAt: new Date(),
    },
  };
}
