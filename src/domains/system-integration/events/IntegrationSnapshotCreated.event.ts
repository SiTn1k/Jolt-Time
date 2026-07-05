/**
 * IntegrationSnapshotCreated Event
 *
 * Domain event emitted when a new integration snapshot is created.
 */

import type { SnapshotId } from '../value-objects/SnapshotId';
import type { IntegrationStatus } from '../types/IntegrationStatus';

/**
 * Event data for snapshot creation.
 */
export interface IntegrationSnapshotCreatedEventData {
  /** Snapshot ID */
  snapshotId: string;

  /** Number of registered modules */
  registeredModulesCount: number;

  /** Number of healthy modules */
  healthyModulesCount: number;

  /** Number of failed modules */
  failedModulesCount: number;

  /** Overall integration status */
  status: IntegrationStatus;

  /** Health percentage */
  healthPercentage: number;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for snapshot creation.
 */
export interface IntegrationSnapshotCreatedEvent {
  /** Event type identifier */
  readonly eventType: 'IntegrationSnapshotCreated';

  /** Event data */
  readonly data: IntegrationSnapshotCreatedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates an IntegrationSnapshotCreatedEvent.
 */
export function createIntegrationSnapshotCreatedEvent(params: {
  snapshotId: SnapshotId;
  registeredModulesCount: number;
  healthyModulesCount: number;
  failedModulesCount: number;
  status: IntegrationStatus;
  healthPercentage: number;
}): IntegrationSnapshotCreatedEvent {
  return {
    eventType: 'IntegrationSnapshotCreated',
    version: 1,
    data: {
      snapshotId: params.snapshotId.value,
      registeredModulesCount: params.registeredModulesCount,
      healthyModulesCount: params.healthyModulesCount,
      failedModulesCount: params.failedModulesCount,
      status: params.status,
      healthPercentage: params.healthPercentage,
      occurredAt: new Date(),
    },
  };
}
