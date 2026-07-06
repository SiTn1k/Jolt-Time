/**
 * IProductionSnapshot Interface
 *
 * Interface for ProductionSnapshot domain entity.
 */

import type { SnapshotId } from '../value-objects/SnapshotId';
import type { SnapshotMetadata, SystemHealth } from '../types/ProductionMetadata';

/**
 * ProductionSnapshot entity interface.
 */
export interface IProductionSnapshot {
  /** Unique snapshot identifier */
  readonly snapshotId: SnapshotId;
  /** Creation timestamp */
  readonly createdAt: Date;
  /** Backend version string */
  readonly backendVersion: string;
  /** Database version string */
  readonly databaseVersion: string;
  /** System health information */
  readonly systemHealth: SystemHealth;
  /** Additional metadata */
  readonly metadata: SnapshotMetadata;

  /** Whether the system is healthy */
  readonly isHealthy: boolean;
  /** Whether the system is degraded */
  readonly isDegraded: boolean;

  /**
   * Checks if the snapshot is from a specific environment.
   */
  isFromEnvironment(environment: string): boolean;

  /**
   * Creates a copy with updated fields.
   */
  copyWith(params: Partial<{
    backendVersion: string;
    databaseVersion: string;
    systemHealth: SystemHealth;
    metadata: SnapshotMetadata;
  }>): IProductionSnapshot;
}
