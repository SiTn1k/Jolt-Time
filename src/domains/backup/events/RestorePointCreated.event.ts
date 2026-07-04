/**
 * RestorePointCreated Event
 *
 * Event emitted when a new restore point is created.
 */

import type { RestorePointId } from '../value-objects/RestorePointId';
import type { SnapshotId } from '../value-objects/SnapshotId';

/**
 * RestorePointCreated event class.
 * Emitted when a new restore point is created.
 */
export class RestorePointCreated {
  public readonly eventType = 'RestorePointCreated';
  public readonly restorePointId: string;
  public readonly snapshotId: string;
  public readonly description: string;
  public readonly timestamp: Date;

  /**
   * Creates a new RestorePointCreated event.
   */
  constructor(params: {
    restorePointId: RestorePointId;
    snapshotId: SnapshotId;
    description: string;
    timestamp?: Date;
  }) {
    this.restorePointId = params.restorePointId.value;
    this.snapshotId = params.snapshotId.value;
    this.description = params.description;
    this.timestamp = params.timestamp ?? new Date();
  }

  /**
   * Serializes the event to a plain object.
   */
  public toJSON(): RestorePointCreatedJSON {
    return {
      eventType: this.eventType,
      restorePointId: this.restorePointId,
      snapshotId: this.snapshotId,
      description: this.description,
      timestamp: this.timestamp.toISOString(),
    };
  }
}

/**
 * JSON representation of RestorePointCreated event.
 */
export interface RestorePointCreatedJSON {
  eventType: string;
  restorePointId: string;
  snapshotId: string;
  description: string;
  timestamp: string;
}
