/**
 * IIntegrationState Interface
 *
 * Contract for IntegrationState domain entity.
 * Defines the public API for integration state operations.
 */

import type { StateId } from '../value-objects/StateId';
import type { ModuleId } from '../value-objects/ModuleId';
import type { IntegrationStatus } from '../types/IntegrationStatus';
import type { IntegrationMetadata } from '../types/IntegrationMetadata';

/**
 * Integration state interface.
 * Defines the contract for integration state operations.
 */
export interface IIntegrationState {
  /** Unique state identifier */
  readonly stateId: StateId;

  /** Reference to module ID */
  readonly moduleId: ModuleId;

  /** Current integration status */
  readonly status: IntegrationStatus;

  /** Last updated timestamp */
  readonly lastUpdated: Date;

  /** State metadata */
  readonly metadata: IntegrationMetadata;

  /** Timestamp when state was created */
  readonly createdAt: Date;

  /** Timestamp when state was last updated */
  readonly updatedAt: Date;

  /**
   * Checks if the integration status is healthy.
   */
  isHealthy(): boolean;

  /**
   * Checks if the integration status indicates failure.
   */
  hasFailed(): boolean;

  /**
   * Creates a copy with updated fields.
   */
  copyWith(params: Partial<{
    moduleId: ModuleId;
    status: IntegrationStatus;
    lastUpdated: Date;
    metadata: IntegrationMetadata;
  }>): IIntegrationState;
}
