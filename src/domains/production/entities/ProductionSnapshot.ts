/**
 * ProductionSnapshot Entity
 *
 * Domain entity representing a production system snapshot.
 */

import type { IProductionSnapshot } from '../interfaces/IProductionSnapshot';
import { SnapshotId } from '../value-objects/SnapshotId';
import type { SnapshotMetadata } from '../types/ProductionMetadata';
import type { SystemHealth } from '../types/ProductionMetadata';

/**
 * ProductionSnapshot entity props for constructor.
 */
export interface ProductionSnapshotProps {
  snapshotId: SnapshotId;
  createdAt: Date;
  backendVersion: string;
  databaseVersion: string;
  systemHealth: SystemHealth;
  metadata: SnapshotMetadata;
}

/**
 * Database record representation of ProductionSnapshot.
 */
export interface ProductionSnapshotRecord {
  snapshotId: string;
  createdAt: string;
  backendVersion: string;
  databaseVersion: string;
  systemHealth: SystemHealth;
  metadata: SnapshotMetadata;
}

/**
 * JSON serialization representation of ProductionSnapshot.
 */
export interface ProductionSnapshotJSON {
  snapshotId: string;
  createdAt: string;
  backendVersion: string;
  databaseVersion: string;
  systemHealth: SystemHealth;
  metadata: SnapshotMetadata;
}

/**
 * ProductionSnapshot entity class.
 * Immutable domain entity representing a production system snapshot.
 */
export class ProductionSnapshot implements IProductionSnapshot {
  public readonly snapshotId: SnapshotId;
  public readonly createdAt: Date;
  public readonly backendVersion: string;
  public readonly databaseVersion: string;
  public readonly systemHealth: SystemHealth;
  public readonly metadata: SnapshotMetadata;

  /**
   * Creates a new ProductionSnapshot instance.
   */
  constructor(props: ProductionSnapshotProps) {
    this.snapshotId = props.snapshotId;
    this.createdAt = props.createdAt;
    this.backendVersion = props.backendVersion;
    this.databaseVersion = props.databaseVersion;
    this.systemHealth = props.systemHealth;
    this.metadata = props.metadata;
  }

  /**
   * Creates a new ProductionSnapshot entity.
   */
  public static create(params: {
    snapshotId?: SnapshotId;
    backendVersion: string;
    databaseVersion: string;
    systemHealth?: SystemHealth;
    metadata?: SnapshotMetadata;
  }): ProductionSnapshot {
    return new ProductionSnapshot({
      snapshotId: params.snapshotId ?? SnapshotId.create(),
      createdAt: new Date(),
      backendVersion: params.backendVersion,
      databaseVersion: params.databaseVersion,
      systemHealth: params.systemHealth ?? { status: 'healthy' },
      metadata: params.metadata ?? { environment: 'production' },
    });
  }

  /**
   * Reconstructs a ProductionSnapshot from stored data.
   */
  public static fromStorage(record: ProductionSnapshotRecord): ProductionSnapshot {
    return new ProductionSnapshot({
      snapshotId: SnapshotId.reconstruct(record.snapshotId),
      createdAt: new Date(record.createdAt),
      backendVersion: record.backendVersion,
      databaseVersion: record.databaseVersion,
      systemHealth: record.systemHealth,
      metadata: record.metadata,
    });
  }

  /**
   * Checks if the snapshot is from a specific environment.
   */
  public isFromEnvironment(environment: string): boolean {
    return this.metadata.environment === environment;
  }

  /**
   * Checks if the system is healthy based on the snapshot.
   */
  public get isHealthy(): boolean {
    return this.systemHealth.status === 'healthy';
  }

  /**
   * Checks if the system is degraded based on the snapshot.
   */
  public get isDegraded(): boolean {
    return this.systemHealth.status === 'degraded';
  }

  /**
   * Creates a copy with updated fields.
   */
  public copyWith(params: Partial<Omit<ProductionSnapshotProps, 'snapshotId' | 'createdAt'>>): ProductionSnapshot {
    return new ProductionSnapshot({
      snapshotId: this.snapshotId,
      createdAt: this.createdAt,
      backendVersion: params.backendVersion ?? this.backendVersion,
      databaseVersion: params.databaseVersion ?? this.databaseVersion,
      systemHealth: params.systemHealth ?? this.systemHealth,
      metadata: params.metadata ?? this.metadata,
    });
  }

  /**
   * Serializes the ProductionSnapshot to a plain object.
   */
  public toJSON(): ProductionSnapshotJSON {
    return {
      snapshotId: this.snapshotId.value,
      createdAt: this.createdAt.toISOString(),
      backendVersion: this.backendVersion,
      databaseVersion: this.databaseVersion,
      systemHealth: this.systemHealth,
      metadata: this.metadata,
    };
  }

  /**
   * Converts to database record format.
   */
  public toRecord(): ProductionSnapshotRecord {
    return {
      snapshotId: this.snapshotId.value,
      createdAt: this.createdAt.toISOString(),
      backendVersion: this.backendVersion,
      databaseVersion: this.databaseVersion,
      systemHealth: this.systemHealth,
      metadata: this.metadata,
    };
  }
}
