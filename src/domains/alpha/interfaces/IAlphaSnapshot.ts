/**
 * IAlphaSnapshot Interface
 *
 * Interface for AlphaSnapshot domain entity.
 */

import type { SnapshotId } from '../value-objects/SnapshotId';
import type { SnapshotMetadata } from '../types/AlphaMetadata';

/**
 * AlphaSnapshot entity interface.
 */
export interface IAlphaSnapshot {
  /** Unique snapshot identifier */
  readonly snapshotId: SnapshotId;
  /** Creation timestamp */
  readonly createdAt: Date;
  /** Backend version string */
  readonly backendVersion: string;
  /** Database version string */
  readonly databaseVersion: string;
  /** Number of modules in this snapshot */
  readonly moduleCount: number;
  /** Additional metadata */
  readonly metadata: SnapshotMetadata;

  /**
   * Checks if the snapshot is from a specific environment.
   */
  isFromEnvironment(environment: string): boolean;
}
