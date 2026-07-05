/**
 * Environment Entity
 *
 * Domain entity representing a deployment environment.
 */

import type { IEnvironment } from '../interfaces/IEnvironment';
import { EnvironmentId } from '../value-objects/EnvironmentId';
import type { EnvironmentType } from '../types/EnvironmentType';

/**
 * Environment configuration interface.
 */
export interface EnvironmentConfiguration {
  /** Environment base URL */
  baseUrl?: string;

  /** Environment region */
  region?: string;

  /** Auto-scaling enabled */
  autoScaling?: boolean;

  /** Monitoring enabled */
  monitoringEnabled?: boolean;

  /** Backup enabled */
  backupEnabled?: boolean;

  /** Custom configuration values */
  customConfig?: Record<string, unknown>;
}

/**
 * Environment entity class.
 * Immutable domain entity representing a deployment environment.
 */
export class Environment implements IEnvironment {
  /** Unique environment identifier */
  public readonly environmentId: EnvironmentId;

  /** Environment name */
  public readonly name: string;

  /** Environment type */
  public readonly type: EnvironmentType;

  /** Environment status (active/inactive) */
  public readonly status: 'active' | 'inactive';

  /** Environment configuration */
  public readonly configuration: EnvironmentConfiguration;

  /** Extended metadata */
  public readonly metadata: EnvironmentMetadata;

  /** Timestamp when environment was created */
  public readonly createdAt: Date;

  /** Timestamp when environment was last updated */
  public readonly updatedAt: Date;

  /**
   * Creates a new Environment instance.
   */
  constructor(props: EnvironmentProps) {
    this.environmentId = props.environmentId;
    this.name = props.name;
    this.type = props.type;
    this.status = props.status;
    this.configuration = props.configuration;
    this.metadata = props.metadata;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Creates a new Environment.
   * Factory method for new environment creation.
   */
  public static create(params: {
    environmentId: EnvironmentId;
    name: string;
    type: EnvironmentType;
    configuration?: EnvironmentConfiguration;
    metadata?: EnvironmentMetadata;
  }): Environment {
    const now = new Date();

    return new Environment({
      environmentId: params.environmentId,
      name: params.name,
      type: params.type,
      status: 'active',
      configuration: params.configuration ?? {},
      metadata: params.metadata ?? {},
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Reconstructs an Environment from stored data.
   * Factory method for reconstructing from persistence.
   */
  public static fromStorage(record: EnvironmentRecord): Environment {
    return new Environment({
      environmentId: EnvironmentId.reconstruct(record.environmentId),
      name: record.name,
      type: record.type,
      status: record.status,
      configuration: record.configuration ?? {},
      metadata: record.metadata ?? {},
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
    });
  }

  /**
   * Creates a copy with updated fields.
   */
  public copyWith(params: Partial<EnvironmentProps>): Environment {
    return new Environment({
      environmentId: params.environmentId ?? this.environmentId,
      name: params.name ?? this.name,
      type: params.type ?? this.type,
      status: params.status ?? this.status,
      configuration: params.configuration ?? this.configuration,
      metadata: params.metadata ?? this.metadata,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }

  /**
   * Serializes the Environment to a plain object.
   */
  public toJSON(): EnvironmentJSON {
    return {
      environmentId: this.environmentId.value,
      name: this.name,
      type: this.type,
      status: this.status,
      configuration: this.configuration,
      metadata: this.metadata,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}

/**
 * Environment properties interface for constructor.
 */
export interface EnvironmentProps {
  environmentId: EnvironmentId;
  name: string;
  type: EnvironmentType;
  status: 'active' | 'inactive';
  configuration: EnvironmentConfiguration;
  metadata: EnvironmentMetadata;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Environment metadata interface.
 */
export interface EnvironmentMetadata {
  /** Owner team or person */
  owner?: string;

  /** Cost center */
  costCenter?: string;

  /** Tags for organization */
  tags?: string[];

  /** Custom metadata */
  customFields?: Record<string, unknown>;
}

/**
 * Database record representation of Environment.
 */
export interface EnvironmentRecord {
  environmentId: string;
  name: string;
  type: EnvironmentType;
  status: 'active' | 'inactive';
  configuration: EnvironmentConfiguration;
  metadata: EnvironmentMetadata;
  createdAt: string;
  updatedAt: string;
}

/**
 * JSON serialization representation of Environment.
 */
export interface EnvironmentJSON {
  environmentId: string;
  name: string;
  type: EnvironmentType;
  status: 'active' | 'inactive';
  configuration: EnvironmentConfiguration;
  metadata: EnvironmentMetadata;
  createdAt: string;
  updatedAt: string;
}