/**
 * BackupCompleted Event
 *
 * Event emitted when a backup snapshot completes successfully.
 */

import type { SnapshotId } from '../value-objects/SnapshotId';
import type { BackupType } from '../types/BackupType';

/**
 * BackupCompleted event class.
 * Emitted when a backup snapshot completes successfully.
 */
export class BackupCompleted {
  public readonly eventType = 'BackupCompleted';
  public readonly snapshotId: string;
  public readonly backupType: BackupType;
  public readonly size: number;
  public readonly checksum: string;
  public readonly durationMs: number;
  public readonly timestamp: Date;

  /**
   * Creates a new BackupCompleted event.
   */
  constructor(params: {
    snapshotId: SnapshotId;
    backupType: BackupType;
    size: number;
    checksum: string;
    durationMs: number;
    timestamp?: Date;
  }) {
    this.snapshotId = params.snapshotId.value;
    this.backupType = params.backupType;
    this.size = params.size;
    this.checksum = params.checksum;
    this.durationMs = params.durationMs;
    this.timestamp = params.timestamp ?? new Date();
  }

  /**
   * Serializes the event to a plain object.
   */
  public toJSON(): BackupCompletedJSON {
    return {
      eventType: this.eventType,
      snapshotId: this.snapshotId,
      backupType: this.backupType,
      size: this.size,
      checksum: this.checksum,
      durationMs: this.durationMs,
      timestamp: this.timestamp.toISOString(),
    };
  }
}

/**
 * JSON representation of BackupCompleted event.
 */
export interface BackupCompletedJSON {
  eventType: string;
  snapshotId: string;
  backupType: BackupType;
  size: number;
  checksum: string;
  durationMs: number;
  timestamp: string;
}
