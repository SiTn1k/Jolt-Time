/**
 * IJobDefinition Interface
 *
 * Interface defining the contract for JobDefinition entities.
 */

import type { DefinitionId } from '../value-objects/DefinitionId';
import type { SchedulerDefinitionMetadata } from '../types/SchedulerMetadata';

/**
 * Interface for JobDefinition domain entity.
 */
export interface IJobDefinition {
  /** Unique definition identifier */
  readonly definitionId: DefinitionId;
  /** Definition name */
  readonly name: string;
  /** Definition description */
  readonly description: string;
  /** Handler name */
  readonly handler: string;
  /** Maximum retry attempts */
  readonly retryLimit: number;
  /** Timeout in milliseconds */
  readonly timeout: number;
  /** Definition metadata */
  readonly metadata: SchedulerDefinitionMetadata;

  /** Checks if definition supports retries */
  supportsRetries: boolean;
}
