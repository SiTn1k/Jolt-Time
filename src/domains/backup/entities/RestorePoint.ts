/**
 * RestorePoint Entity
 *
 * Domain entity representing a restore point.
 * A restore point links a snapshot to a specific point-in-time for restoration.
 *
 * RestorePoint Entity Responsibilities:
 * - Store restore point metadata (ID, snapshot reference)
 * - Track creation timestamp and description
 * - Link to associated backup metadata
 *
 * RestorePoint Entity is NOT:
 * - A restorer
 * - A gameplay modifier
 * - A state changer
 * - An automatic restoration trigger
 */

import type { IRestorePoint } from '../interfaces/IRestorePoint';
import { RestorePointId } from '../value-objects/RestorePointId';
import { SnapshotId } from '../value-objects/SnapshotId';
import type { RestoreMetadata } from '../types/BackupMetadata';

/**
 * RestorePoint entity props for constructor.
 */
export interface RestorePointProps {
  restorePointId: RestorePointId;
  snapshotId: SnapshotId;
  createdAt: Date;
  description: string;
  metadata: RestoreMetadata;
}

/**
 * Database record representation of RestorePoint.
 */
export interface RestorePointRecord {
  restore_point_id: string;
  snapshot_id: string;
  created_at: string;
  description: string;
  metadata: RestoreMetadata;
}

/**
 * JSON serialization representation of RestorePoint.
 */
export interface RestorePointJSON {
  restorePointId: string;
  snapshotId: string;
  createdAt: string;
  description: string;
  metadata: RestoreMetadata;
}

/**
 * RestorePoint entity class.
 * Immutable domain entity representing a restore point.
 */
export class RestorePoint implements IRestorePoint {
  public readonly restorePointId: RestorePointId;
  public readonly snapshotId: SnapshotId;
  public readonly createdAt: Date;
  public readonly description: string;
  public readonly metadata: RestoreMetadata;

  /**
   * Creates a new RestorePoint instance.
   */
  constructor(props: RestorePointProps) {
    this.restorePointId = props.restorePointId;
    this.snapshotId = props.snapshotId;
    this.createdAt = props.createdAt;
    this.description = props.description;
    this.metadata = props.metadata;
  }

  /**
   * Creates a new RestorePoint entity.
   * Factory method for new restore point creation.
   */
  public static create(params: {
    restorePointId?: RestorePointId;
    snapshotId: SnapshotId;
    description?: string;
    metadata?: RestoreMetadata;
  }): RestorePoint {
    return new RestorePoint({
      restorePointId: params.restorePointId ?? RestorePointId.generate(),
      snapshotId: params.snapshotId,
      createdAt: new Date(),
      description: params.description ?? '',
      metadata: params.metadata ?? {
        originalBackupType: '',
        originalSnapshotId: '',
        tablesRestored: [],
        recordsRestored: 0,
        dryRun: false,
        rollbackAvailable: false,
        initiatedBy: 'system',
      },
    });
  }

  /**
   * Reconstructs a RestorePoint from stored data.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: RestorePointRecord): RestorePoint {
    return new RestorePoint({
      restorePointId: RestorePointId.reconstruct(record.restore_point_id),
      snapshotId: SnapshotId.reconstruct(record.snapshot_id),
      createdAt: new Date(record.created_at),
      description: record.description,
      metadata: record.metadata,
    });
  }

  /**
   * Checks if rollback is available for this restore point.
   */
  public get hasRollback(): boolean {
    return this.metadata.rollbackAvailable;
  }

  /**
   * Checks if this restore point was a dry run.
   */
  public get wasDryRun(): boolean {
    return this.metadata.dryRun;
  }

  /**
   * Creates a copy with updated fields.
   */
  public copyWith(params: Partial<Omit<RestorePointProps, 'restorePointId' | 'snapshotId' | 'createdAt'>>): RestorePoint {
    return new RestorePoint({
      restorePointId: this.restorePointId,
      snapshotId: this.snapshotId,
      createdAt: this.createdAt,
      description: params.description ?? this.description,
      metadata: params.metadata ?? this.metadata,
    });
  }

  /**
   * Serializes the RestorePoint to a plain object.
   */
  public toJSON(): RestorePointJSON {
    return {
      restorePointId: this.restorePointId.value,
      snapshotId: this.snapshotId.value,
      createdAt: this.createdAt.toISOString(),
      description: this.description,
      metadata: this.metadata,
    };
  }

  /**
   * Converts to database record format.
   */
  public toRecord(): RestorePointRecord {
    return {
      restore_point_id: this.restorePointId.value,
      snapshot_id: this.snapshotId.value,
      created_at: this.createdAt.toISOString(),
      description: this.description,
      metadata: this.metadata,
    };
  }
}
