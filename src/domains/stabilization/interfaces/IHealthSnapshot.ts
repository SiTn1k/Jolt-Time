/**
 * Health Snapshot Interface
 *
 * Interface defining the contract for HealthSnapshot entities.
 */

import type { HealthSnapshotId } from '../value-objects/HealthSnapshotId';
import type { HealthStatus } from '../types/HealthStatus';
import type { StabilizationMetadata } from '../types/StabilizationMetadata';

/**
 * Health snapshot entity interface.
 * Defines the contract for health snapshot entities.
 */
export interface IHealthSnapshot {
  /** Unique snapshot identifier */
  readonly snapshotId: HealthSnapshotId;

  /** Timestamp when the snapshot was created */
  readonly createdAt: Date;

  /** Memory health status */
  readonly memory: HealthStatus;

  /** CPU health status */
  readonly cpu: HealthStatus;

  /** Database health status */
  readonly database: HealthStatus;

  /** Cache health status */
  readonly cache: HealthStatus;

  /** API health status */
  readonly api: HealthStatus;

  /** Additional metadata */
  readonly metadata: StabilizationMetadata;
}
