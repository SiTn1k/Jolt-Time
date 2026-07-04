/**
 * BackupCreated Event
 *
 * Event emitted when a new backup snapshot is created.
 */

import type { SnapshotId } from '../value-objects/SnapshotId';
import type { BackupType } from '../types/BackupType';
import type { BackupStatus } from '../types/BackupStatus';

/**
 * BackupCreated event class.
 * Emitted when a new backup snapshot is created.
 */
export class BackupCreated {
  public readonly eventType = 'BackupCreated';
  public readonly snapshotId: string;
  public readonly backupType: BackupType;
  public readonly status: BackupStatus;
  public readonly storageLocation: string;
  public readonly timestamp: Date;

  /**
   * Creates a new BackupCreated event.
   */
  constructor(params: {
    snapshotId: SnapshotId;
    backupType: BackupType;
    status: BackupStatus;
    storageLocation: string;
    timestamp?: Date;
  }) {
    this.snapshotId = params.snapshotId.value;
    this.backupType = params.backupType;
    this.status = params.status;
    this.storageLocation = params.storageLocation;
    this.timestamp = params.timestamp ?? new Date();
  }

  /**
   * Serializes the event to a plain object.
   */
  public toJSON(): BackupCreatedJSON {
    return {
      eventType: this.eventType,
      snapshotId: this.snapshotId,
      backupType: this.backupType,
      status: this.status,
      storageLocation: this.storageLocation,
      timestamp: this.timestamp.toISOString(),
    };
  }
}

/**
 * JSON representation of BackupCreated event.
 */
export interface BackupCreatedJSON {
  eventType: string;
  snapshotId: string;
  backupType: BackupType;
  status: BackupStatus;
  storageLocation: string;
  timestamp: string;
}
