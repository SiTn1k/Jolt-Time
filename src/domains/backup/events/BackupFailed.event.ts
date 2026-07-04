/**
 * BackupFailed Event
 *
 * Event emitted when a backup snapshot fails.
 */

import type { SnapshotId } from '../value-objects/SnapshotId';
import type { BackupType } from '../types/BackupType';

/**
 * BackupFailed event class.
 * Emitted when a backup snapshot fails.
 */
export class BackupFailed {
  public readonly eventType = 'BackupFailed';
  public readonly snapshotId: string;
  public readonly backupType: BackupType;
  public readonly error: string;
  public readonly timestamp: Date;

  /**
   * Creates a new BackupFailed event.
   */
  constructor(params: {
    snapshotId: SnapshotId;
    backupType: BackupType;
    error: string;
    timestamp?: Date;
  }) {
    this.snapshotId = params.snapshotId.value;
    this.backupType = params.backupType;
    this.error = params.error;
    this.timestamp = params.timestamp ?? new Date();
  }

  /**
   * Serializes the event to a plain object.
   */
  public toJSON(): BackupFailedJSON {
    return {
      eventType: this.eventType,
      snapshotId: this.snapshotId,
      backupType: this.backupType,
      error: this.error,
      timestamp: this.timestamp.toISOString(),
    };
  }
}

/**
 * JSON representation of BackupFailed event.
 */
export interface BackupFailedJSON {
  eventType: string;
  snapshotId: string;
  backupType: BackupType;
  error: string;
  timestamp: string;
}
