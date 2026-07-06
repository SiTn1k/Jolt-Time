/**
 * QA Snapshot Created Event
 *
 * Domain event emitted when a QA snapshot is created.
 */

import type { SnapshotId } from '../value-objects/SnapshotId';
import type { HealthStatus } from '../types/HealthStatus';

/**
 * Event data for QA snapshot creation.
 */
export interface QASnapshotCreatedEventData {
  /** Snapshot ID */
  snapshotId: string;

  /** Backend version at snapshot time */
  backendVersion: string;

  /** Number of modules at snapshot time */
  moduleCount: number;

  /** Health status at snapshot time */
  healthStatus: HealthStatus;

  /** Creation timestamp */
  createdAt: Date;
}

/**
 * Domain event for QA snapshot creation.
 */
export interface QASnapshotCreatedEvent {
  /** Event type identifier */
  readonly eventType: 'QASnapshotCreated';

  /** Event data */
  readonly data: QASnapshotCreatedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a QASnapshotCreatedEvent.
 */
export function createQASnapshotCreatedEvent(params: {
  snapshotId: SnapshotId;
  backendVersion: string;
  moduleCount: number;
  healthStatus: HealthStatus;
}): QASnapshotCreatedEvent {
  return {
    eventType: 'QASnapshotCreated',
    version: 1,
    data: {
      snapshotId: params.snapshotId.value,
      backendVersion: params.backendVersion,
      moduleCount: params.moduleCount,
      healthStatus: params.healthStatus,
      createdAt: new Date(),
    },
  };
}
