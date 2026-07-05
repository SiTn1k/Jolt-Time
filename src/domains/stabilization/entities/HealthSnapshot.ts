/**
 * HealthSnapshot Entity
 *
 * Domain entity representing a system health snapshot.
 * This entity ONLY stores health data - it never modifies gameplay.
 *
 * HealthSnapshot Entity Responsibilities:
 * - Store system health metrics
 * - Track memory, CPU, database, cache, and API status
 * - Record timestamp of snapshot
 *
 * HealthSnapshot Entity is NOT:
 * - A gameplay modifier
 * - A reward distributor
 * - A state changer
 */

import type { IHealthSnapshot } from '../interfaces/IHealthSnapshot';
import { HealthSnapshotId } from '../value-objects/HealthSnapshotId';
import { HealthStatus } from '../types/HealthStatus';
import { StabilizationMetadata, INITIAL_STABILIZATION_METADATA } from '../types/StabilizationMetadata';

/**
 * HealthSnapshot entity class.
 * Immutable domain entity representing a system health snapshot.
 */
export class HealthSnapshot implements IHealthSnapshot {
  /** Unique snapshot identifier */
  public readonly snapshotId: HealthSnapshotId;

  /** Timestamp when the snapshot was created */
  public readonly createdAt: Date;

  /** Memory health status */
  public readonly memory: HealthStatus;

  /** CPU health status */
  public readonly cpu: HealthStatus;

  /** Database health status */
  public readonly database: HealthStatus;

  /** Cache health status */
  public readonly cache: HealthStatus;

  /** API health status */
  public readonly api: HealthStatus;

  /** Additional metadata */
  public readonly metadata: StabilizationMetadata;

  /**
   * Creates a new HealthSnapshot instance.
   * @param props HealthSnapshot properties
   */
  constructor(props: HealthSnapshotProps) {
    this.snapshotId = props.snapshotId;
    this.createdAt = props.createdAt;
    this.memory = props.memory;
    this.cpu = props.cpu;
    this.database = props.database;
    this.cache = props.cache;
    this.api = props.api;
    this.metadata = props.metadata ?? { ...INITIAL_STABILIZATION_METADATA };
  }

  /**
   * Creates a new HealthSnapshot for storing.
   * Factory method for new snapshot creation.
   */
  public static create(params: {
    snapshotId?: HealthSnapshotId;
    memory: HealthStatus;
    cpu: HealthStatus;
    database: HealthStatus;
    cache: HealthStatus;
    api: HealthStatus;
    metadata?: StabilizationMetadata;
  }): HealthSnapshot {
    return new HealthSnapshot({
      snapshotId: params.snapshotId ?? HealthSnapshotId.generate(),
      createdAt: new Date(),
      memory: params.memory,
      cpu: params.cpu,
      database: params.database,
      cache: params.cache,
      api: params.api,
      metadata: params.metadata ?? { ...INITIAL_STABILIZATION_METADATA },
    });
  }

  /**
   * Creates a HealthSnapshot from a database record.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: HealthSnapshotRecord): HealthSnapshot {
    return new HealthSnapshot({
      snapshotId: HealthSnapshotId.reconstruct(record.snapshot_id),
      createdAt: new Date(record.created_at),
      memory: record.memory as HealthStatus,
      cpu: record.cpu as HealthStatus,
      database: record.database as HealthStatus,
      cache: record.cache as HealthStatus,
      api: record.api as HealthStatus,
      metadata: record.metadata ?? { ...INITIAL_STABILIZATION_METADATA },
    });
  }

  /**
   * Serializes the HealthSnapshot to a plain object.
   */
  public toJSON(): HealthSnapshotJSON {
    return {
      snapshotId: this.snapshotId.value,
      createdAt: this.createdAt.toISOString(),
      memory: this.memory,
      cpu: this.cpu,
      database: this.database,
      cache: this.cache,
      api: this.api,
      metadata: this.metadata,
    };
  }

  /**
   * Gets the overall health status (worst of all components).
   */
  public get overallStatus(): HealthStatus {
    const statuses = [this.memory, this.cpu, this.database, this.cache, this.api];
    
    if (statuses.includes(HealthStatus.FAILED)) {
      return HealthStatus.FAILED;
    }
    if (statuses.includes(HealthStatus.WARNING)) {
      return HealthStatus.WARNING;
    }
    if (statuses.includes(HealthStatus.UNKNOWN)) {
      return HealthStatus.UNKNOWN;
    }
    return HealthStatus.HEALTHY;
  }
}

/**
 * HealthSnapshot properties interface for constructor.
 */
export interface HealthSnapshotProps {
  snapshotId: HealthSnapshotId;
  createdAt: Date;
  memory: HealthStatus;
  cpu: HealthStatus;
  database: HealthStatus;
  cache: HealthStatus;
  api: HealthStatus;
  metadata?: StabilizationMetadata;
}

/**
 * Database record representation of HealthSnapshot.
 */
export interface HealthSnapshotRecord {
  snapshot_id: string;
  created_at: string;
  memory: string;
  cpu: string;
  database: string;
  cache: string;
  api: string;
  metadata?: StabilizationMetadata;
}

/**
 * JSON serialization representation of HealthSnapshot.
 */
export interface HealthSnapshotJSON {
  snapshotId: string;
  createdAt: string;
  memory: HealthStatus;
  cpu: HealthStatus;
  database: HealthStatus;
  cache: HealthStatus;
  api: HealthStatus;
  metadata: StabilizationMetadata;
}
