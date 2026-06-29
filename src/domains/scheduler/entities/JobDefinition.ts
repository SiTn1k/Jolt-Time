/**
 * JobDefinition Entity
 *
 * Domain entity representing a job definition.
 * Definitions describe the handler and configuration for a type of job.
 */

import type { IJobDefinition } from '../interfaces/IJobDefinition';
import { DefinitionId } from '../value-objects/DefinitionId';
import type { SchedulerDefinitionMetadata } from '../types/SchedulerMetadata';

/**
 * JobDefinition entity props for constructor.
 */
export interface JobDefinitionProps {
  definitionId: DefinitionId;
  name: string;
  description: string;
  handler: string;
  retryLimit: number;
  timeout: number;
  metadata: SchedulerDefinitionMetadata;
}

/**
 * Database record representation of JobDefinition.
 */
export interface JobDefinitionRecord {
  definition_id: string;
  name: string;
  description: string;
  handler: string;
  retry_limit: number;
  timeout: number;
  metadata: SchedulerDefinitionMetadata;
}

/**
 * JSON serialization representation of JobDefinition.
 */
export interface JobDefinitionJSON {
  definitionId: string;
  name: string;
  description: string;
  handler: string;
  retryLimit: number;
  timeout: number;
  metadata: SchedulerDefinitionMetadata;
}

/**
 * JobDefinition entity class.
 * Immutable domain entity representing a job definition.
 */
export class JobDefinition implements IJobDefinition {
  public readonly definitionId: DefinitionId;
  public readonly name: string;
  public readonly description: string;
  public readonly handler: string;
  public readonly retryLimit: number;
  public readonly timeout: number;
  public readonly metadata: SchedulerDefinitionMetadata;

  /**
   * Creates a new JobDefinition instance.
   */
  constructor(props: JobDefinitionProps) {
    this.definitionId = props.definitionId;
    this.name = props.name;
    this.description = props.description;
    this.handler = props.handler;
    this.retryLimit = props.retryLimit;
    this.timeout = props.timeout;
    this.metadata = props.metadata;
  }

  /**
   * Creates a new JobDefinition entity.
   */
  public static create(params: {
    definitionId?: DefinitionId;
    name: string;
    description: string;
    handler: string;
    retryLimit?: number;
    timeout?: number;
    metadata?: SchedulerDefinitionMetadata;
  }): JobDefinition {
    return new JobDefinition({
      definitionId: params.definitionId ?? DefinitionId.create(),
      name: params.name,
      description: params.description,
      handler: params.handler,
      retryLimit: params.retryLimit ?? 3,
      timeout: params.timeout ?? 60000,
      metadata: params.metadata ?? {
        name: params.name,
        description: params.description,
        handler: params.handler,
        defaultTimeoutMs: params.timeout ?? 60000,
      },
    });
  }

  /**
   * Reconstructs a JobDefinition from stored data.
   */
  public static fromStorage(record: JobDefinitionRecord): JobDefinition {
    return new JobDefinition({
      definitionId: DefinitionId.reconstruct(record.definition_id),
      name: record.name,
      description: record.description,
      handler: record.handler,
      retryLimit: record.retry_limit,
      timeout: record.timeout,
      metadata: record.metadata,
    });
  }

  /**
   * Checks if this definition supports retries.
   */
  public get supportsRetries(): boolean {
    return this.retryLimit > 0;
  }

  /**
   * Checks if a given timeout is within the definition's limits.
   */
  public isTimeoutValid(timeoutMs: number): boolean {
    return timeoutMs > 0 && timeoutMs <= this.timeout * 2;
  }

  /**
   * Creates a copy with updated fields.
   */
  public copyWith(params: Partial<Omit<JobDefinitionProps, 'definitionId'>>): JobDefinition {
    return new JobDefinition({
      definitionId: this.definitionId,
      name: params.name ?? this.name,
      description: params.description ?? this.description,
      handler: params.handler ?? this.handler,
      retryLimit: params.retryLimit ?? this.retryLimit,
      timeout: params.timeout ?? this.timeout,
      metadata: params.metadata ?? this.metadata,
    });
  }

  /**
   * Serializes the JobDefinition to a plain object.
   */
  public toJSON(): JobDefinitionJSON {
    return {
      definitionId: this.definitionId.value,
      name: this.name,
      description: this.description,
      handler: this.handler,
      retryLimit: this.retryLimit,
      timeout: this.timeout,
      metadata: this.metadata,
    };
  }

  /**
   * Converts to database record format.
   */
  public toRecord(): JobDefinitionRecord {
    return {
      definition_id: this.definitionId.value,
      name: this.name,
      description: this.description,
      handler: this.handler,
      retry_limit: this.retryLimit,
      timeout: this.timeout,
      metadata: this.metadata,
    };
  }
}
