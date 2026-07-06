/**
 * AlphaSnapshotCreated Event
 *
 * Domain event emitted when a new alpha snapshot is created.
 */

/**
 * Event data for snapshot creation.
 */
export interface AlphaSnapshotCreatedEventData {
  /** Snapshot ID */
  snapshotId: string;
  /** Backend version */
  backendVersion: string;
  /** Database version */
  databaseVersion: string;
  /** Number of modules */
  moduleCount: number;
  /** Creation timestamp */
  occurredAt: Date;
}

/**
 * Domain event for snapshot creation.
 */
export interface AlphaSnapshotCreatedEvent {
  /** Event type identifier */
  readonly eventType: 'AlphaSnapshotCreated';
  /** Event data */
  readonly data: AlphaSnapshotCreatedEventData;
  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates an AlphaSnapshotCreatedEvent.
 */
export function createAlphaSnapshotCreatedEvent(params: {
  snapshotId: string;
  backendVersion: string;
  databaseVersion: string;
  moduleCount: number;
}): AlphaSnapshotCreatedEvent {
  return {
    eventType: 'AlphaSnapshotCreated',
    version: 1,
    data: {
      snapshotId: params.snapshotId,
      backendVersion: params.backendVersion,
      databaseVersion: params.databaseVersion,
      moduleCount: params.moduleCount,
      occurredAt: new Date(),
    },
  };
}
