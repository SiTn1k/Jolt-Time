/**
 * IHardeningSnapshot Interface
 *
 * Interface for HardeningSnapshot entity.
 */

import type { SnapshotId } from '../value-objects/SnapshotId';
import type { SnapshotMetadata } from '../types/HardeningMetadata';

/**
 * Interface for HardeningSnapshot entity.
 * Defines the contract for hardening snapshot operations.
 */
export interface IHardeningSnapshot {
  /** Unique identifier for the snapshot */
  readonly snapshotId: SnapshotId;
  /** When the snapshot was created */
  readonly createdAt: Date;
  /** System version at time of snapshot */
  readonly systemVersion: string;
  /** Number of modules at time of snapshot */
  readonly moduleCount: number;
  /** Health status at time of snapshot */
  readonly healthStatus: string;
  /** Additional metadata */
  readonly metadata: SnapshotMetadata;

  /** Checks if the health status is healthy */
  isHealthy: boolean;
  /** Gets the age of the snapshot in milliseconds */
  age: number;
}
