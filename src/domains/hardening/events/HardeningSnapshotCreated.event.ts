/**
 * HardeningSnapshotCreated Event
 *
 * Domain event emitted when a hardening snapshot is created.
 */

/**
 * Event data for snapshot creation.
 */
export interface HardeningSnapshotCreatedEventData {
  /** Snapshot ID */
  snapshotId: string;
  /** System version at snapshot time */
  systemVersion: string;
  /** Number of modules at snapshot time */
  moduleCount: number;
  /** Health status at snapshot time */
  healthStatus: string;
  /** Creation timestamp */
  occurredAt: Date;
}

/**
 * Domain event for snapshot creation.
 */
export interface HardeningSnapshotCreatedEvent {
  /** Event type identifier */
  readonly eventType: 'HardeningSnapshotCreated';
  /** Event data */
  readonly data: HardeningSnapshotCreatedEventData;
  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a HardeningSnapshotCreatedEvent.
 */
export function createHardeningSnapshotCreatedEvent(params: {
  snapshotId: string;
  systemVersion: string;
  moduleCount: number;
  healthStatus: string;
}): HardeningSnapshotCreatedEvent {
  return {
    eventType: 'HardeningSnapshotCreated',
    version: 1,
    data: {
      snapshotId: params.snapshotId,
      systemVersion: params.systemVersion,
      moduleCount: params.moduleCount,
      healthStatus: params.healthStatus,
      occurredAt: new Date(),
    },
  };
}
