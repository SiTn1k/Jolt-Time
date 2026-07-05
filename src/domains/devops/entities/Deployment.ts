/**
 * Deployment Entity
 *
 * Domain entity representing a deployment.
 * DevOps never deploys automatically - only stores deployment metadata.
 */

import type { IDeployment } from '../interfaces/IDeployment';
import { DeploymentId } from '../value-objects/DeploymentId';
import { DeploymentStatus } from '../types/DeploymentStatus';
import type { DeploymentMetadata } from '../types/DeploymentMetadata';

/**
 * Deployment entity class.
 * Immutable domain entity representing a deployment.
 */
export class Deployment implements IDeployment {
  /** Unique deployment identifier */
  public readonly deploymentId: DeploymentId;

  /** Deployment version identifier */
  public readonly version: string;

  /** Environment ID for this deployment */
  public readonly environmentId: string;

  /** Current deployment status */
  public readonly status: DeploymentStatus;

  /** Timestamp when deployment started */
  public readonly startedAt: Date;

  /** Timestamp when deployment completed */
  public readonly completedAt: Date | null;

  /** Extended metadata */
  public readonly metadata: DeploymentMetadata;

  /** Timestamp when deployment was created */
  public readonly createdAt: Date;

  /** Timestamp when deployment was last updated */
  public readonly updatedAt: Date;

  /**
   * Creates a new Deployment instance.
   */
  constructor(props: DeploymentProps) {
    this.deploymentId = props.deploymentId;
    this.version = props.version;
    this.environmentId = props.environmentId;
    this.status = props.status;
    this.startedAt = props.startedAt;
    this.completedAt = props.completedAt;
    this.metadata = props.metadata;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Creates a new Deployment.
   * Factory method for new deployment creation.
   */
  public static create(params: {
    deploymentId: DeploymentId;
    version: string;
    environmentId: string;
    metadata?: DeploymentMetadata;
  }): Deployment {
    const now = new Date();

    return new Deployment({
      deploymentId: params.deploymentId,
      version: params.version,
      environmentId: params.environmentId,
      status: DeploymentStatus.PENDING,
      startedAt: now,
      completedAt: null,
      metadata: params.metadata ?? {},
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Reconstructs a Deployment from stored data.
   * Factory method for reconstructing from persistence.
   */
  public static fromStorage(record: DeploymentRecord): Deployment {
    return new Deployment({
      deploymentId: DeploymentId.reconstruct(record.deploymentId),
      version: record.version,
      environmentId: record.environmentId,
      status: record.status,
      startedAt: new Date(record.startedAt),
      completedAt: record.completedAt ? new Date(record.completedAt) : null,
      metadata: record.metadata ?? {},
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
    });
  }

  /**
   * Creates a copy with updated fields.
   */
  public copyWith(params: Partial<DeploymentProps>): Deployment {
    return new Deployment({
      deploymentId: params.deploymentId ?? this.deploymentId,
      version: params.version ?? this.version,
      environmentId: params.environmentId ?? this.environmentId,
      status: params.status ?? this.status,
      startedAt: params.startedAt ?? this.startedAt,
      completedAt: params.completedAt ?? this.completedAt,
      metadata: params.metadata ?? this.metadata,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }

  /**
   * Serializes the Deployment to a plain object.
   */
  public toJSON(): DeploymentJSON {
    return {
      deploymentId: this.deploymentId.value,
      version: this.version,
      environmentId: this.environmentId,
      status: this.status,
      startedAt: this.startedAt.toISOString(),
      completedAt: this.completedAt?.toISOString() ?? null,
      metadata: this.metadata,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}

/**
 * Deployment properties interface for constructor.
 */
export interface DeploymentProps {
  deploymentId: DeploymentId;
  version: string;
  environmentId: string;
  status: DeploymentStatus;
  startedAt: Date;
  completedAt: Date | null;
  metadata: DeploymentMetadata;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Database record representation of Deployment.
 */
export interface DeploymentRecord {
  deploymentId: string;
  version: string;
  environmentId: string;
  status: DeploymentStatus;
  startedAt: string;
  completedAt: string | null;
  metadata: DeploymentMetadata;
  createdAt: string;
  updatedAt: string;
}

/**
 * JSON serialization representation of Deployment.
 */
export interface DeploymentJSON {
  deploymentId: string;
  version: string;
  environmentId: string;
  status: DeploymentStatus;
  startedAt: string;
  completedAt: string | null;
  metadata: DeploymentMetadata;
  createdAt: string;
  updatedAt: string;
}