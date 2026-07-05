/**
 * IIntegrationSnapshot Interface
 *
 * Contract for IntegrationSnapshot domain entity.
 * Defines the public API for integration snapshot operations.
 */

import type { SnapshotId } from '../value-objects/SnapshotId';
import type { IntegrationMetadata } from '../types/IntegrationMetadata';

/**
 * Integration snapshot interface.
 * Defines the contract for integration snapshot operations.
 */
export interface IIntegrationSnapshot {
  /** Unique snapshot identifier */
  readonly snapshotId: SnapshotId;

  /** Snapshot creation timestamp */
  readonly createdAt: Date;

  /** List of registered module IDs */
  readonly registeredModules: string[];

  /** List of healthy module IDs */
  readonly healthyModules: string[];

  /** List of failed module IDs */
  readonly failedModules: string[];

  /** Snapshot metadata */
  readonly metadata: IntegrationMetadata;

  /** Timestamp when snapshot was created */
  readonly updatedAt: Date;

  /** Total count of registered modules */
  readonly registeredCount: number;

  /** Total count of healthy modules */
  readonly healthyCount: number;

  /** Total count of failed modules */
  readonly failedCount: number;

  /** Calculates the health percentage */
  readonly healthPercentage: number;

  /**
   * Checks if the system is fully healthy.
   */
  isFullyHealthy(): boolean;

  /**
   * Checks if the system has any failures.
   */
  hasFailures(): boolean;

  /**
   * Creates a copy with updated fields.
   */
  copyWith(params: Partial<{
    registeredModules: string[];
    healthyModules: string[];
    failedModules: string[];
    metadata: IntegrationMetadata;
  }>): IIntegrationSnapshot;
}
