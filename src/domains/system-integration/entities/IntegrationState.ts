/**
 * IntegrationState Entity
 *
 * Domain entity representing the integration state of a module.
 * Stores the current state and metadata for a registered module.
 *
 * IntegrationState Entity Responsibilities:
 * - Store state identity (ID, module reference)
 * - Track current status
 * - Store state metadata
 * - Track last update timestamp
 *
 * IntegrationState is NOT:
 * - A state machine
 * - A state transition handler
 * - Any gameplay logic
 * - Any reward mechanism
 * - Any balance/inventory modifier
 *
 * System Integration Foundation ONLY stores integration state records.
 * All state transitions and runtime logic belongs to P-194.2.
 */

import type { IIntegrationState } from '../interfaces/IIntegrationState';
import { StateId } from '../value-objects/StateId';
import { ModuleId } from '../value-objects/ModuleId';
import type { IntegrationStatus } from '../types/IntegrationStatus';
import type { IntegrationMetadata } from '../types/IntegrationMetadata';

/**
 * IntegrationState entity props for constructor.
 */
export interface IntegrationStateProps {
  /** Unique state identifier */
  stateId: StateId;

  /** Reference to module ID */
  moduleId: ModuleId;

  /** Current integration status */
  status: IntegrationStatus;

  /** Last updated timestamp */
  lastUpdated: Date;

  /** State metadata */
  metadata: IntegrationMetadata;
}

/**
 * Database record representation of IntegrationState.
 */
export interface IntegrationStateRecord {
  state_id: string;
  module_id: string;
  status: IntegrationStatus;
  last_updated: string;
  metadata: IntegrationMetadata;
  created_at: string;
  updated_at: string;
}

/**
 * JSON serialization representation of IntegrationState.
 */
export interface IntegrationStateJSON {
  stateId: string;
  moduleId: string;
  status: IntegrationStatus;
  lastUpdated: string;
  metadata: IntegrationMetadata;
  createdAt: string;
  updatedAt: string;
}

/**
 * IntegrationState entity class.
 * Immutable domain entity representing an integration state.
 */
export class IntegrationState implements IIntegrationState {
  /** Unique state identifier */
  public readonly stateId: StateId;

  /** Reference to module ID */
  public readonly moduleId: ModuleId;

  /** Current integration status */
  public readonly status: IntegrationStatus;

  /** Last updated timestamp */
  public readonly lastUpdated: Date;

  /** State metadata */
  public readonly metadata: IntegrationMetadata;

  /** Timestamp when state was created */
  public readonly createdAt: Date;

  /** Timestamp when state was last updated */
  public readonly updatedAt: Date;

  /**
   * Creates a new IntegrationState instance.
   */
  constructor(props: IntegrationStateProps & { createdAt?: Date; updatedAt?: Date }) {
    this.stateId = props.stateId;
    this.moduleId = props.moduleId;
    this.status = props.status;
    this.lastUpdated = props.lastUpdated;
    this.metadata = props.metadata;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  /**
   * Creates a new IntegrationState entity.
   * Factory method for new state creation.
   */
  public static create(params: {
    stateId?: StateId;
    moduleId: ModuleId;
    status?: IntegrationStatus;
    lastUpdated?: Date;
    metadata?: IntegrationMetadata;
  }): IntegrationState {
    const now = new Date();

    return new IntegrationState({
      stateId: params.stateId ?? StateId.generate(),
      moduleId: params.moduleId,
      status: params.status ?? 'unknown',
      lastUpdated: params.lastUpdated ?? now,
      metadata: params.metadata ?? {},
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Reconstructs an IntegrationState from stored data.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: IntegrationStateRecord & { created_at?: string; updated_at?: string }): IntegrationState {
    return new IntegrationState({
      stateId: StateId.reconstruct(record.state_id),
      moduleId: ModuleId.reconstruct(record.module_id),
      status: record.status,
      lastUpdated: new Date(record.last_updated),
      metadata: record.metadata,
      createdAt: record.created_at ? new Date(record.created_at) : new Date(),
      updatedAt: record.updated_at ? new Date(record.updated_at) : new Date(),
    });
  }

  /**
   * Checks if the integration status is healthy.
   */
  public isHealthy(): boolean {
    return this.status === 'healthy';
  }

  /**
   * Checks if the integration status indicates failure.
   */
  public hasFailed(): boolean {
    return this.status === 'critical_failure' || this.status === 'partial_failure';
  }

  /**
   * Creates a copy with updated fields.
   */
  public copyWith(params: Partial<Omit<IntegrationStateProps, 'stateId' | 'createdAt'>>): IntegrationState {
    return new IntegrationState({
      stateId: this.stateId,
      moduleId: params.moduleId ?? this.moduleId,
      status: params.status ?? this.status,
      lastUpdated: params.lastUpdated ?? new Date(),
      metadata: params.metadata ?? this.metadata,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }

  /**
   * Serializes the IntegrationState to a plain object.
   */
  public toJSON(): IntegrationStateJSON {
    return {
      stateId: this.stateId.value,
      moduleId: this.moduleId.value,
      status: this.status,
      lastUpdated: this.lastUpdated.toISOString(),
      metadata: this.metadata,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  /**
   * Converts to database record format.
   */
  public toRecord(): IntegrationStateRecord {
    return {
      state_id: this.stateId.value,
      module_id: this.moduleId.value,
      status: this.status,
      last_updated: this.lastUpdated.toISOString(),
      metadata: this.metadata,
      created_at: this.createdAt.toISOString(),
      updated_at: this.updatedAt.toISOString(),
    };
  }
}
