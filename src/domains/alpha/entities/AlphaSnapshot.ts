/**
 * AlphaSnapshot Entity
 *
 * Domain entity representing an alpha testing snapshot.
 */

import type { IAlphaSnapshot } from '../interfaces/IAlphaSnapshot';
import { SnapshotId } from '../value-objects/SnapshotId';
import type { SnapshotMetadata } from '../types/AlphaMetadata';

/**
 * AlphaSnapshot entity props for constructor.
 */
export interface AlphaSnapshotProps {
  snapshotId: SnapshotId;
  createdAt: Date;
  backendVersion: string;
  databaseVersion: string;
  moduleCount: number;
  metadata: SnapshotMetadata;
}

/**
 * Database record representation of AlphaSnapshot.
 */
export interface AlphaSnapshotRecord {
  snapshotId: string;
  createdAt: string;
  backendVersion: string;
  databaseVersion: string;
  moduleCount: number;
  metadata: SnapshotMetadata;
}

/**
 * JSON serialization representation of AlphaSnapshot.
 */
export interface AlphaSnapshotJSON {
  snapshotId: string;
  createdAt: string;
  backendVersion: string;
  databaseVersion: string;
  moduleCount: number;
  metadata: SnapshotMetadata;
}

/**
 * AlphaSnapshot entity class.
 * Immutable domain entity representing an alpha testing snapshot.
 */
export class AlphaSnapshot implements IAlphaSnapshot {
  public readonly snapshotId: SnapshotId;
  public readonly createdAt: Date;
  public readonly backendVersion: string;
  public readonly databaseVersion: string;
  public readonly moduleCount: number;
  public readonly metadata: SnapshotMetadata;

  /**
   * Creates a new AlphaSnapshot instance.
   */
  constructor(props: AlphaSnapshotProps) {
    this.snapshotId = props.snapshotId;
    this.createdAt = props.createdAt;
    this.backendVersion = props.backendVersion;
    this.databaseVersion = props.databaseVersion;
    this.moduleCount = props.moduleCount;
    this.metadata = props.metadata;
  }

  /**
   * Creates a new AlphaSnapshot entity.
   */
  public static create(params: {
    snapshotId?: SnapshotId;
    backendVersion: string;
    databaseVersion: string;
    moduleCount: number;
    metadata?: SnapshotMetadata;
  }): AlphaSnapshot {
    return new AlphaSnapshot({
      snapshotId: params.snapshotId ?? SnapshotId.create(),
      createdAt: new Date(),
      backendVersion: params.backendVersion,
      databaseVersion: params.databaseVersion,
      moduleCount: params.moduleCount,
      metadata: params.metadata ?? { environment: 'development' },
    });
  }

  /**
   * Reconstructs an AlphaSnapshot from stored data.
   */
  public static fromStorage(record: AlphaSnapshotRecord): AlphaSnapshot {
    return new AlphaSnapshot({
      snapshotId: SnapshotId.reconstruct(record.snapshotId),
      createdAt: new Date(record.createdAt),
      backendVersion: record.backendVersion,
      databaseVersion: record.databaseVersion,
      moduleCount: record.moduleCount,
      metadata: record.metadata,
    });
  }

  /**
   * Checks if the snapshot is from a specific environment.
   */
  public isFromEnvironment(environment: string): boolean {
    return this.metadata.environment === environment;
  }

  /**
   * Creates a copy with updated fields.
   */
  public copyWith(params: Partial<Omit<AlphaSnapshotProps, 'snapshotId' | 'createdAt'>>): AlphaSnapshot {
    return new AlphaSnapshot({
      snapshotId: this.snapshotId,
      createdAt: this.createdAt,
      backendVersion: params.backendVersion ?? this.backendVersion,
      databaseVersion: params.databaseVersion ?? this.databaseVersion,
      moduleCount: params.moduleCount ?? this.moduleCount,
      metadata: params.metadata ?? this.metadata,
    });
  }

  /**
   * Serializes the AlphaSnapshot to a plain object.
   */
  public toJSON(): AlphaSnapshotJSON {
    return {
      snapshotId: this.snapshotId.value,
      createdAt: this.createdAt.toISOString(),
      backendVersion: this.backendVersion,
      databaseVersion: this.databaseVersion,
      moduleCount: this.moduleCount,
      metadata: this.metadata,
    };
  }

  /**
   * Converts to database record format.
   */
  public toRecord(): AlphaSnapshotRecord {
    return {
      snapshotId: this.snapshotId.value,
      createdAt: this.createdAt.toISOString(),
      backendVersion: this.backendVersion,
      databaseVersion: this.databaseVersion,
      moduleCount: this.moduleCount,
      metadata: this.metadata,
    };
  }
}
