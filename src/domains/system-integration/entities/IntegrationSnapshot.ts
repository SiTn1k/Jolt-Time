/**
 * IntegrationSnapshot Entity
 *
 * Domain entity representing a point-in-time snapshot of the system integration.
 * Captures the state of all modules at a specific moment.
 *
 * IntegrationSnapshot Entity Responsibilities:
 * - Store snapshot identity
 * - Track registered modules count
 * - Track healthy modules count
 * - Track failed modules count
 * - Store snapshot metadata
 * - Store creation timestamp
 *
 * IntegrationSnapshot is NOT:
 * - A health checker
 * - A snapshot generator
 * - Any auto-recovery mechanism
 * - Any gameplay logic
 * - Any reward mechanism
 *
 * System Integration Foundation ONLY stores integration snapshots.
 * Snapshot creation and health checking belongs to P-194.2.
 */

import type { IIntegrationSnapshot } from '../interfaces/IIntegrationSnapshot';
import { SnapshotId } from '../value-objects/SnapshotId';
import type { IntegrationMetadata } from '../types/IntegrationMetadata';

/**
 * Module status summary within a snapshot.
 */
export interface ModuleStatusSummary {
  /** Module ID */
  moduleId: string;

  /** Module name */
  moduleName: string;

  /** Current status */
  status: string;
}

/**
 * IntegrationSnapshot entity props for constructor.
 */
export interface IntegrationSnapshotProps {
  /** Unique snapshot identifier */
  snapshotId: SnapshotId;

  /** Snapshot creation timestamp */
  createdAt: Date;

  /** List of registered module IDs */
  registeredModules: string[];

  /** List of healthy module IDs */
  healthyModules: string[];

  /** List of failed module IDs */
  failedModules: string[];

  /** Snapshot metadata */
  metadata: IntegrationMetadata;
}

/**
 * Database record representation of IntegrationSnapshot.
 */
export interface IntegrationSnapshotRecord {
  snapshot_id: string;
  created_at: string;
  registered_modules: string[];
  healthy_modules: string[];
  failed_modules: string[];
  metadata: IntegrationMetadata;
}

/**
 * JSON serialization representation of IntegrationSnapshot.
 */
export interface IntegrationSnapshotJSON {
  snapshotId: string;
  createdAt: string;
  registeredModules: string[];
  healthyModules: string[];
  failedModules: string[];
  metadata: IntegrationMetadata;
}

/**
 * IntegrationSnapshot entity class.
 * Immutable domain entity representing an integration snapshot.
 */
export class IntegrationSnapshot implements IIntegrationSnapshot {
  /** Unique snapshot identifier */
  public readonly snapshotId: SnapshotId;

  /** Snapshot creation timestamp */
  public readonly createdAt: Date;

  /** List of registered module IDs */
  public readonly registeredModules: string[];

  /** List of healthy module IDs */
  public readonly healthyModules: string[];

  /** List of failed module IDs */
  public readonly failedModules: string[];

  /** Snapshot metadata */
  public readonly metadata: IntegrationMetadata;

  /** Timestamp when snapshot was created */
  public readonly updatedAt: Date;

  /**
   * Creates a new IntegrationSnapshot instance.
   */
  constructor(props: IntegrationSnapshotProps & { updatedAt?: Date }) {
    this.snapshotId = props.snapshotId;
    this.createdAt = props.createdAt;
    this.registeredModules = props.registeredModules;
    this.healthyModules = props.healthyModules;
    this.failedModules = props.failedModules;
    this.metadata = props.metadata;
    this.updatedAt = props.updatedAt ?? props.createdAt;
  }

  /**
   * Creates a new IntegrationSnapshot entity.
   * Factory method for new snapshot creation.
   */
  public static create(params: {
    snapshotId?: SnapshotId;
    createdAt?: Date;
    registeredModules?: string[];
    healthyModules?: string[];
    failedModules?: string[];
    metadata?: IntegrationMetadata;
  }): IntegrationSnapshot {
    const now = new Date();

    return new IntegrationSnapshot({
      snapshotId: params.snapshotId ?? SnapshotId.generate(),
      createdAt: params.createdAt ?? now,
      registeredModules: params.registeredModules ?? [],
      healthyModules: params.healthyModules ?? [],
      failedModules: params.failedModules ?? [],
      metadata: params.metadata ?? {},
      updatedAt: now,
    });
  }

  /**
   * Reconstructs an IntegrationSnapshot from stored data.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: IntegrationSnapshotRecord & { created_at?: string; updated_at?: string }): IntegrationSnapshot {
    return new IntegrationSnapshot({
      snapshotId: SnapshotId.reconstruct(record.snapshot_id),
      createdAt: record.created_at ? new Date(record.created_at) : new Date(),
      registeredModules: record.registered_modules,
      healthyModules: record.healthy_modules,
      failedModules: record.failed_modules,
      metadata: record.metadata,
      updatedAt: record.updated_at ? new Date(record.updated_at) : new Date(),
    });
  }

  /**
   * Gets the total count of registered modules.
   */
  public get registeredCount(): number {
    return this.registeredModules.length;
  }

  /**
   * Gets the total count of healthy modules.
   */
  public get healthyCount(): number {
    return this.healthyModules.length;
  }

  /**
   * Gets the total count of failed modules.
   */
  public get failedCount(): number {
    return this.failedModules.length;
  }

  /**
   * Calculates the health percentage.
   */
  public get healthPercentage(): number {
    if (this.registeredModules.length === 0) {
      return 100;
    }
    return (this.healthyModules.length / this.registeredModules.length) * 100;
  }

  /**
   * Checks if the system is fully healthy.
   */
  public isFullyHealthy(): boolean {
    return (
      this.registeredModules.length > 0 &&
      this.registeredModules.length === this.healthyModules.length
    );
  }

  /**
   * Checks if the system has any failures.
   */
  public hasFailures(): boolean {
    return this.failedModules.length > 0;
  }

  /**
   * Creates a copy with updated fields.
   */
  public copyWith(params: Partial<Omit<IntegrationSnapshotProps, 'snapshotId' | 'createdAt'>>): IntegrationSnapshot {
    return new IntegrationSnapshot({
      snapshotId: this.snapshotId,
      createdAt: this.createdAt,
      registeredModules: params.registeredModules ?? this.registeredModules,
      healthyModules: params.healthyModules ?? this.healthyModules,
      failedModules: params.failedModules ?? this.failedModules,
      metadata: params.metadata ?? this.metadata,
      updatedAt: new Date(),
    });
  }

  /**
   * Serializes the IntegrationSnapshot to a plain object.
   */
  public toJSON(): IntegrationSnapshotJSON {
    return {
      snapshotId: this.snapshotId.value,
      createdAt: this.createdAt.toISOString(),
      registeredModules: this.registeredModules,
      healthyModules: this.healthyModules,
      failedModules: this.failedModules,
      metadata: this.metadata,
    };
  }

  /**
   * Converts to database record format.
   */
  public toRecord(): IntegrationSnapshotRecord {
    return {
      snapshot_id: this.snapshotId.value,
      created_at: this.createdAt.toISOString(),
      registered_modules: this.registeredModules,
      healthy_modules: this.healthyModules,
      failed_modules: this.failedModules,
      metadata: this.metadata,
    };
  }
}
