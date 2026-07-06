/**
 * IReleaseSnapshot Interface
 *
 * Interface for ReleaseSnapshot domain entity.
 */

import type { SnapshotId } from '../value-objects/SnapshotId';
import type { SnapshotMetadata } from '../types/ReleaseMetadata';

/**
 * ReleaseSnapshot entity interface.
 */
export interface IReleaseSnapshot {
  /** Unique snapshot identifier */
  readonly snapshotId: SnapshotId;
  /** Creation timestamp */
  readonly createdAt: Date;
  /** Backend version string */
  readonly backendVersion: string;
  /** Database version string */
  readonly databaseVersion: string;
  /** Full git commit hash */
  readonly gitCommit: string;
  /** Additional metadata */
  readonly metadata: SnapshotMetadata;

  /**
   * Gets the short git commit hash (first 7 characters).
   */
  shortCommit: string;
}
