/**
 * ReleaseSnapshotCreated Event
 *
 * Domain event emitted when a release snapshot is created.
 */

/**
 * Event data for snapshot creation.
 */
export interface ReleaseSnapshotCreatedEventData {
  /** Snapshot ID */
  snapshotId: string;
  /** Backend version */
  backendVersion: string;
  /** Database version */
  databaseVersion: string;
  /** Git commit hash */
  gitCommit: string;
  /** Creation timestamp */
  occurredAt: Date;
}

/**
 * Domain event for snapshot creation.
 */
export interface ReleaseSnapshotCreatedEvent {
  /** Event type identifier */
  readonly eventType: 'ReleaseSnapshotCreated';
  /** Event data */
  readonly data: ReleaseSnapshotCreatedEventData;
  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a ReleaseSnapshotCreatedEvent.
 */
export function createReleaseSnapshotCreatedEvent(params: {
  snapshotId: string;
  backendVersion: string;
  databaseVersion: string;
  gitCommit: string;
}): ReleaseSnapshotCreatedEvent {
  return {
    eventType: 'ReleaseSnapshotCreated',
    version: 1,
    data: {
      snapshotId: params.snapshotId,
      backendVersion: params.backendVersion,
      databaseVersion: params.databaseVersion,
      gitCommit: params.gitCommit,
      occurredAt: new Date(),
    },
  };
}
