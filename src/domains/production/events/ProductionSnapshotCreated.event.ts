/**
 * ProductionSnapshotCreated Event
 *
 * Domain event emitted when a new production snapshot is created.
 */

/**
 * Event data for snapshot creation.
 */
export interface ProductionSnapshotCreatedEventData {
  /** Snapshot ID */
  snapshotId: string;
  /** Backend version */
  backendVersion: string;
  /** Database version */
  databaseVersion: string;
  /** System health status */
  healthStatus: string;
  /** Creation timestamp */
  occurredAt: Date;
}

/**
 * Domain event for snapshot creation.
 */
export interface ProductionSnapshotCreatedEvent {
  /** Event type identifier */
  readonly eventType: 'ProductionSnapshotCreated';
  /** Event data */
  readonly data: ProductionSnapshotCreatedEventData;
  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a ProductionSnapshotCreatedEvent.
 */
export function createProductionSnapshotCreatedEvent(params: {
  snapshotId: string;
  backendVersion: string;
  databaseVersion: string;
  healthStatus: string;
}): ProductionSnapshotCreatedEvent {
  return {
    eventType: 'ProductionSnapshotCreated',
    version: 1,
    data: {
      snapshotId: params.snapshotId,
      backendVersion: params.backendVersion,
      databaseVersion: params.databaseVersion,
      healthStatus: params.healthStatus,
      occurredAt: new Date(),
    },
  };
}
