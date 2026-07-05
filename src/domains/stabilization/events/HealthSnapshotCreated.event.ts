/**
 * Health Snapshot Created Event
 *
 * Domain event emitted when a health snapshot is created.
 */

import type { HealthSnapshotId } from '../value-objects/HealthSnapshotId';
import type { HealthStatus } from '../types/HealthStatus';

/**
 * Event data for health snapshot creation.
 */
export interface HealthSnapshotCreatedEventData {
  /** Snapshot ID */
  snapshotId: string;

  /** Memory health status */
  memory: HealthStatus;

  /** CPU health status */
  cpu: HealthStatus;

  /** Database health status */
  database: HealthStatus;

  /** Cache health status */
  cache: HealthStatus;

  /** API health status */
  api: HealthStatus;

  /** Overall health status */
  overallStatus: HealthStatus;

  /** Timestamp when created */
  createdAt: Date;
}

/**
 * Domain event for health snapshot creation.
 */
export interface HealthSnapshotCreatedEvent {
  /** Event type identifier */
  readonly eventType: 'HealthSnapshotCreated';

  /** Event data */
  readonly data: HealthSnapshotCreatedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a HealthSnapshotCreatedEvent.
 */
export function createHealthSnapshotCreatedEvent(params: {
  snapshotId: HealthSnapshotId;
  memory: HealthStatus;
  cpu: HealthStatus;
  database: HealthStatus;
  cache: HealthStatus;
  api: HealthStatus;
  overallStatus: HealthStatus;
}): HealthSnapshotCreatedEvent {
  return {
    eventType: 'HealthSnapshotCreated',
    version: 1,
    data: {
      snapshotId: params.snapshotId.value,
      memory: params.memory,
      cpu: params.cpu,
      database: params.database,
      cache: params.cache,
      api: params.api,
      overallStatus: params.overallStatus,
      createdAt: new Date(),
    },
  };
}
