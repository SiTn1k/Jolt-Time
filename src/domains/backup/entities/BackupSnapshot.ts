/**
 * BackupSnapshot Entity
 *
 * Domain entity representing a backup snapshot.
 * A snapshot is a point-in-time capture of data.
 *
 * BackupSnapshot Entity Responsibilities:
 * - Store snapshot metadata (ID, name, type, status)
 * - Track storage information (size, checksum, location)
 * - Record creation timestamp
 *
 * BackupSnapshot Entity is NOT:
 * - A backup executor
 * - A data restorer
 * - A gameplay modifier
 * - A state changer
 */

import type { IBackupSnapshot } from '../interfaces/IBackupSnapshot';
import { SnapshotId } from '../value-objects/SnapshotId';
import type { BackupType } from '../types/BackupType';
import type { BackupStatus } from '../types/BackupStatus';
import type { SnapshotMetadata } from '../types/BackupMetadata';

/**
 * BackupSnapshot entity props for constructor.
 */
export interface BackupSnapshotProps {
  snapshotId: SnapshotId;
  snapshotName: string;
  backupType: BackupType;
  status: BackupStatus;
  size: number;
  checksum: string | null;
  storageLocation: string;
  createdAt: Date;
  metadata: SnapshotMetadata;
}

/**
 * Database record representation of BackupSnapshot.
 */
export interface BackupSnapshotRecord {
  snapshot_id: string;
  snapshot_name: string;
  backup_type: string;
  status: string;
  size: number;
  checksum: string | null;
  storage_location: string;
  created_at: string;
  metadata: SnapshotMetadata;
}

/**
 * JSON serialization representation of BackupSnapshot.
 */
export interface BackupSnapshotJSON {
  snapshotId: string;
  snapshotName: string;
  backupType: BackupType;
  status: BackupStatus;
  size: number;
  checksum: string | null;
  storageLocation: string;
  createdAt: string;
  metadata: SnapshotMetadata;
}

/**
 * BackupSnapshot entity class.
 * Immutable domain entity representing a backup snapshot.
 */
export class BackupSnapshot implements IBackupSnapshot {
  public readonly snapshotId: SnapshotId;
  public readonly snapshotName: string;
  public readonly backupType: BackupType;
  public readonly status: BackupStatus;
  public readonly size: number;
  public readonly checksum: string | null;
  public readonly storageLocation: string;
  public readonly createdAt: Date;
  public readonly metadata: SnapshotMetadata;

  /**
   * Creates a new BackupSnapshot instance.
   */
  constructor(props: BackupSnapshotProps) {
    this.snapshotId = props.snapshotId;
    this.snapshotName = props.snapshotName;
    this.backupType = props.backupType;
    this.status = props.status;
    this.size = props.size;
    this.checksum = props.checksum;
    this.storageLocation = props.storageLocation;
    this.createdAt = props.createdAt;
    this.metadata = props.metadata;
  }

  /**
   * Creates a new BackupSnapshot entity.
   * Factory method for new snapshot creation.
   */
  public static create(params: {
    snapshotId?: SnapshotId;
    snapshotName: string;
    backupType: BackupType;
    status?: BackupStatus;
    size?: number;
    checksum?: string | null;
    storageLocation: string;
    metadata?: SnapshotMetadata;
  }): BackupSnapshot {
    return new BackupSnapshot({
      snapshotId: params.snapshotId ?? SnapshotId.generate(),
      snapshotName: params.snapshotName,
      backupType: params.backupType,
      status: params.status ?? 'pending',
      size: params.size ?? 0,
      checksum: params.checksum ?? null,
      storageLocation: params.storageLocation,
      createdAt: new Date(),
      metadata: params.metadata ?? {
        name: params.snapshotName,
        description: '',
        tags: [],
        sourceVersion: '',
        createdBy: 'system',
        parentSnapshotId: null,
        tableCount: 0,
        recordCount: 0,
        compressionRatio: null,
        encryptionAlgorithm: null,
      },
    });
  }

  /**
   * Reconstructs a BackupSnapshot from stored data.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: BackupSnapshotRecord): BackupSnapshot {
    return new BackupSnapshot({
      snapshotId: SnapshotId.reconstruct(record.snapshot_id),
      snapshotName: record.snapshot_name,
      backupType: record.backup_type as BackupType,
      status: record.status as BackupStatus,
      size: record.size,
      checksum: record.checksum,
      storageLocation: record.storage_location,
      createdAt: new Date(record.created_at),
      metadata: record.metadata,
    });
  }

  /**
   * Checks if this snapshot is in a terminal state.
   */
  public get isTerminal(): boolean {
    return this.status === 'completed' || this.status === 'failed' || this.status === 'cancelled';
  }

  /**
   * Checks if this snapshot is verified.
   */
  public get isVerified(): boolean {
    return this.status === 'verified';
  }

  /**
   * Checks if this snapshot can be restored.
   */
  public get canRestore(): boolean {
    return this.status === 'completed' || this.status === 'verified';
  }

  /**
   * Creates a copy with updated fields.
   */
  public copyWith(params: Partial<Omit<BackupSnapshotProps, 'snapshotId' | 'createdAt'>>): BackupSnapshot {
    return new BackupSnapshot({
      snapshotId: this.snapshotId,
      snapshotName: params.snapshotName ?? this.snapshotName,
      backupType: params.backupType ?? this.backupType,
      status: params.status ?? this.status,
      size: params.size ?? this.size,
      checksum: params.checksum ?? this.checksum,
      storageLocation: params.storageLocation ?? this.storageLocation,
      createdAt: this.createdAt,
      metadata: params.metadata ?? this.metadata,
    });
  }

  /**
   * Serializes the BackupSnapshot to a plain object.
   */
  public toJSON(): BackupSnapshotJSON {
    return {
      snapshotId: this.snapshotId.value,
      snapshotName: this.snapshotName,
      backupType: this.backupType,
      status: this.status,
      size: this.size,
      checksum: this.checksum,
      storageLocation: this.storageLocation,
      createdAt: this.createdAt.toISOString(),
      metadata: this.metadata,
    };
  }

  /**
   * Converts to database record format.
   */
  public toRecord(): BackupSnapshotRecord {
    return {
      snapshot_id: this.snapshotId.value,
      snapshot_name: this.snapshotName,
      backup_type: this.backupType,
      status: this.status,
      size: this.size,
      checksum: this.checksum,
      storage_location: this.storageLocation,
      created_at: this.createdAt.toISOString(),
      metadata: this.metadata,
    };
  }
}
