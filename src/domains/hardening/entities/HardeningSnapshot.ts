/**
 * HardeningSnapshot Entity
 *
 * Domain entity representing a hardening snapshot.
 */

import type { IHardeningSnapshot } from '../interfaces/IHardeningSnapshot';
import { SnapshotId } from '../value-objects/SnapshotId';
import type { SnapshotMetadata } from '../types/HardeningMetadata';

/**
 * HardeningSnapshot entity props for constructor.
 */
export interface HardeningSnapshotProps {
  snapshotId: SnapshotId;
  createdAt: Date;
  systemVersion: string;
  moduleCount: number;
  healthStatus: string;
  metadata: SnapshotMetadata;
}

/**
 * Database record representation of HardeningSnapshot.
 */
export interface HardeningSnapshotRecord {
  snapshotId: string;
  createdAt: string;
  systemVersion: string;
  moduleCount: number;
  healthStatus: string;
  metadata: SnapshotMetadata;
}

/**
 * JSON serialization representation of HardeningSnapshot.
 */
export interface HardeningSnapshotJSON {
  snapshotId: string;
  createdAt: string;
  systemVersion: string;
  moduleCount: number;
  healthStatus: string;
  metadata: SnapshotMetadata;
}

/**
 * HardeningSnapshot entity class.
 * Immutable domain entity representing a hardening snapshot.
 */
export class HardeningSnapshot implements IHardeningSnapshot {
  public readonly snapshotId: SnapshotId;
  public readonly createdAt: Date;
  public readonly systemVersion: string;
  public readonly moduleCount: number;
  public readonly healthStatus: string;
  public readonly metadata: SnapshotMetadata;

  /**
   * Creates a new HardeningSnapshot instance.
   */
  constructor(props: HardeningSnapshotProps) {
    this.snapshotId = props.snapshotId;
    this.createdAt = props.createdAt;
    this.systemVersion = props.systemVersion;
    this.moduleCount = props.moduleCount;
    this.healthStatus = props.healthStatus;
    this.metadata = props.metadata;
  }

  /**
   * Creates a new HardeningSnapshot entity.
   */
  public static create(params: {
    snapshotId?: SnapshotId;
    systemVersion: string;
    moduleCount: number;
    healthStatus: string;
    metadata?: SnapshotMetadata;
  }): HardeningSnapshot {
    return new HardeningSnapshot({
      snapshotId: params.snapshotId ?? SnapshotId.create(),
      createdAt: new Date(),
      systemVersion: params.systemVersion,
      moduleCount: params.moduleCount,
      healthStatus: params.healthStatus,
      metadata: params.metadata ?? { environment: 'production' },
    });
  }

  /**
   * Reconstructs a HardeningSnapshot from stored data.
   */
  public static fromStorage(record: HardeningSnapshotRecord): HardeningSnapshot {
    return new HardeningSnapshot({
      snapshotId: SnapshotId.reconstruct(record.snapshotId),
      createdAt: new Date(record.createdAt),
      systemVersion: record.systemVersion,
      moduleCount: record.moduleCount,
      healthStatus: record.healthStatus,
      metadata: record.metadata,
    });
  }

  /**
   * Checks if the health status is healthy.
   */
  public get isHealthy(): boolean {
    return this.healthStatus === 'healthy';
  }

  /**
   * Gets the age of the snapshot in milliseconds.
   */
  public get age(): number {
    return Date.now() - this.createdAt.getTime();
  }

  /**
   * Serializes the HardeningSnapshot to a plain object.
   */
  public toJSON(): HardeningSnapshotJSON {
    return {
      snapshotId: this.snapshotId.value,
      createdAt: this.createdAt.toISOString(),
      systemVersion: this.systemVersion,
      moduleCount: this.moduleCount,
      healthStatus: this.healthStatus,
      metadata: this.metadata,
    };
  }

  /**
   * Converts to database record format.
   */
  public toRecord(): HardeningSnapshotRecord {
    return {
      snapshotId: this.snapshotId.value,
      createdAt: this.createdAt.toISOString(),
      systemVersion: this.systemVersion,
      moduleCount: this.moduleCount,
      healthStatus: this.healthStatus,
      metadata: this.metadata,
    };
  }
}
