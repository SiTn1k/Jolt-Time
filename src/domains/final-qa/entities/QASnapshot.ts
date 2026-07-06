/**
 * QASnapshot Entity
 *
 * Domain entity representing a quality assurance snapshot.
 * This entity ONLY stores QA snapshot data - it never modifies gameplay.
 *
 * QASnapshot Entity Responsibilities:
 * - Store immutable QA snapshot data
 * - Track backend version at snapshot time
 * - Record module count and health status
 *
 * QASnapshot Entity is NOT:
 * - A gameplay modifier
 * - A reward distributor
 * - A state changer
 */

import type { IQASnapshot } from '../interfaces/IQASnapshot';
import { SnapshotId } from '../value-objects/SnapshotId';
import { HealthStatus } from '../types/HealthStatus';
import { QAMetadata, INITIAL_QA_METADATA } from '../types/QAMetadata';

/**
 * QASnapshot entity class.
 * Immutable domain entity representing a QA snapshot.
 */
export class QASnapshot implements IQASnapshot {
  /** Unique QA snapshot identifier */
  public readonly snapshotId: SnapshotId;

  /** Timestamp when the snapshot was created */
  public readonly createdAt: Date;

  /** Backend version at snapshot time */
  public readonly backendVersion: string;

  /** Number of modules at snapshot time */
  public readonly moduleCount: number;

  /** Health status at snapshot time */
  public readonly healthStatus: HealthStatus;

  /** Additional metadata */
  public readonly metadata: QAMetadata;

  /**
   * Creates a new QASnapshot instance.
   * @param props QASnapshot properties
   */
  constructor(props: QASnapshotProps) {
    this.snapshotId = props.snapshotId;
    this.createdAt = props.createdAt;
    this.backendVersion = props.backendVersion;
    this.moduleCount = props.moduleCount;
    this.healthStatus = props.healthStatus;
    this.metadata = props.metadata ?? { ...INITIAL_QA_METADATA };
  }

  /**
   * Creates a new QASnapshot for storing.
   * Factory method for new snapshot creation.
   */
  public static create(params: {
    snapshotId?: SnapshotId;
    backendVersion: string;
    moduleCount: number;
    healthStatus: HealthStatus;
    metadata?: QAMetadata;
  }): QASnapshot {
    return new QASnapshot({
      snapshotId: params.snapshotId ?? SnapshotId.generate(),
      createdAt: new Date(),
      backendVersion: params.backendVersion,
      moduleCount: params.moduleCount,
      healthStatus: params.healthStatus,
      metadata: params.metadata ?? { ...INITIAL_QA_METADATA },
    });
  }

  /**
   * Creates a QASnapshot from a database record.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: QASnapshotRecord): QASnapshot {
    return new QASnapshot({
      snapshotId: SnapshotId.reconstruct(record.snapshot_id),
      createdAt: new Date(record.created_at),
      backendVersion: record.backend_version,
      moduleCount: record.module_count,
      healthStatus: record.health_status as HealthStatus,
      metadata: record.metadata ?? { ...INITIAL_QA_METADATA },
    });
  }

  /**
   * Serializes the QASnapshot to a plain object.
   */
  public toJSON(): QASnapshotJSON {
    return {
      snapshotId: this.snapshotId.value,
      createdAt: this.createdAt.toISOString(),
      backendVersion: this.backendVersion,
      moduleCount: this.moduleCount,
      healthStatus: this.healthStatus,
      metadata: this.metadata,
    };
  }

  /**
   * Converts to database record format.
   */
  public toRecord(): QASnapshotRecord {
    return {
      snapshot_id: this.snapshotId.value,
      created_at: this.createdAt.toISOString(),
      backend_version: this.backendVersion,
      module_count: this.moduleCount,
      health_status: this.healthStatus,
      metadata: this.metadata,
    };
  }
}

/**
 * QASnapshot properties interface for constructor.
 */
export interface QASnapshotProps {
  snapshotId: SnapshotId;
  createdAt: Date;
  backendVersion: string;
  moduleCount: number;
  healthStatus: HealthStatus;
  metadata?: QAMetadata;
}

/**
 * Database record representation of QASnapshot.
 */
export interface QASnapshotRecord {
  snapshot_id: string;
  created_at: string;
  backend_version: string;
  module_count: number;
  health_status: string;
  metadata?: QAMetadata;
}

/**
 * JSON serialization representation of QASnapshot.
 */
export interface QASnapshotJSON {
  snapshotId: string;
  createdAt: string;
  backendVersion: string;
  moduleCount: number;
  healthStatus: HealthStatus;
  metadata: QAMetadata;
}
