/**
 * ReleaseSnapshot Entity
 *
 * Domain entity representing a release snapshot.
 */

import type { IReleaseSnapshot } from '../interfaces/IReleaseSnapshot';
import { SnapshotId } from '../value-objects/SnapshotId';
import type { SnapshotMetadata } from '../types/ReleaseMetadata';

/**
 * ReleaseSnapshot entity props for constructor.
 */
export interface ReleaseSnapshotProps {
  snapshotId: SnapshotId;
  createdAt: Date;
  backendVersion: string;
  databaseVersion: string;
  gitCommit: string;
  metadata: SnapshotMetadata;
}

/**
 * Database record representation of ReleaseSnapshot.
 */
export interface ReleaseSnapshotRecord {
  snapshotId: string;
  createdAt: string;
  backendVersion: string;
  databaseVersion: string;
  gitCommit: string;
  metadata: SnapshotMetadata;
}

/**
 * JSON serialization representation of ReleaseSnapshot.
 */
export interface ReleaseSnapshotJSON {
  snapshotId: string;
  createdAt: string;
  backendVersion: string;
  databaseVersion: string;
  gitCommit: string;
  metadata: SnapshotMetadata;
}

/**
 * ReleaseSnapshot entity class.
 * Immutable domain entity representing a release snapshot.
 */
export class ReleaseSnapshot implements IReleaseSnapshot {
  public readonly snapshotId: SnapshotId;
  public readonly createdAt: Date;
  public readonly backendVersion: string;
  public readonly databaseVersion: string;
  public readonly gitCommit: string;
  public readonly metadata: SnapshotMetadata;

  /**
   * Creates a new ReleaseSnapshot instance.
   */
  constructor(props: ReleaseSnapshotProps) {
    this.snapshotId = props.snapshotId;
    this.createdAt = props.createdAt;
    this.backendVersion = props.backendVersion;
    this.databaseVersion = props.databaseVersion;
    this.gitCommit = props.gitCommit;
    this.metadata = props.metadata;
  }

  /**
   * Creates a new ReleaseSnapshot entity.
   */
  public static create(params: {
    snapshotId?: SnapshotId;
    backendVersion: string;
    databaseVersion: string;
    gitCommit: string;
    metadata?: SnapshotMetadata;
  }): ReleaseSnapshot {
    return new ReleaseSnapshot({
      snapshotId: params.snapshotId ?? SnapshotId.create(),
      createdAt: new Date(),
      backendVersion: params.backendVersion,
      databaseVersion: params.databaseVersion,
      gitCommit: params.gitCommit,
      metadata: params.metadata ?? { environment: 'production' },
    });
  }

  /**
   * Reconstructs a ReleaseSnapshot from stored data.
   */
  public static fromStorage(record: ReleaseSnapshotRecord): ReleaseSnapshot {
    return new ReleaseSnapshot({
      snapshotId: SnapshotId.reconstruct(record.snapshotId),
      createdAt: new Date(record.createdAt),
      backendVersion: record.backendVersion,
      databaseVersion: record.databaseVersion,
      gitCommit: record.gitCommit,
      metadata: record.metadata,
    });
  }

  /**
   * Gets the short git commit hash (first 7 characters).
   */
  public get shortCommit(): string {
    return this.gitCommit.slice(0, 7);
  }

  /**
   * Checks if this snapshot matches a given git commit.
   */
  public matchesCommit(commit: string): boolean {
    return this.gitCommit === commit || this.shortCommit === commit.slice(0, 7);
  }

  /**
   * Serializes the ReleaseSnapshot to a plain object.
   */
  public toJSON(): ReleaseSnapshotJSON {
    return {
      snapshotId: this.snapshotId.value,
      createdAt: this.createdAt.toISOString(),
      backendVersion: this.backendVersion,
      databaseVersion: this.databaseVersion,
      gitCommit: this.gitCommit,
      metadata: this.metadata,
    };
  }

  /**
   * Converts to database record format.
   */
  public toRecord(): ReleaseSnapshotRecord {
    return {
      snapshotId: this.snapshotId.value,
      createdAt: this.createdAt.toISOString(),
      backendVersion: this.backendVersion,
      databaseVersion: this.databaseVersion,
      gitCommit: this.gitCommit,
      metadata: this.metadata,
    };
  }
}
