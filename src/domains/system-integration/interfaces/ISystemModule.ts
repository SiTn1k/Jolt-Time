/**
 * ISystemModule Interface
 *
 * Contract for SystemModule domain entity.
 * Defines the public API for system module operations.
 */

import type { ModuleId } from '../value-objects/ModuleId';
import type { ModuleStatus } from '../types/ModuleStatus';
import type { DependencyStatus } from '../types/DependencyStatus';
import type { IntegrationMetadata } from '../types/IntegrationMetadata';
import type { ModuleDependency } from '../entities/SystemModule';

/**
 * System module interface.
 * Defines the contract for system module operations.
 */
export interface ISystemModule {
  /** Unique module identifier */
  readonly moduleId: ModuleId;

  /** Module display name */
  readonly moduleName: string;

  /** Module version */
  readonly moduleVersion: string;

  /** Current module status */
  readonly status: ModuleStatus;

  /** Module dependencies */
  readonly dependencies: ModuleDependency[];

  /** Module metadata */
  readonly metadata: IntegrationMetadata;

  /** Timestamp when module was created */
  readonly createdAt: Date;

  /** Timestamp when module was last updated */
  readonly updatedAt: Date;

  /**
   * Checks if this module is active.
   */
  isActive(): boolean;

  /**
   * Checks if this module has an error status.
   */
  hasError(): boolean;

  /**
   * Checks if this module is degraded.
   */
  isDegraded(): boolean;

  /**
   * Checks if all required dependencies are satisfied.
   */
  hasSatisfiedDependencies(): boolean;

  /**
   * Creates a copy with updated fields.
   */
  copyWith(params: Partial<{
    moduleName: string;
    moduleVersion: string;
    status: ModuleStatus;
    dependencies: ModuleDependency[];
    metadata: IntegrationMetadata;
  }>): ISystemModule;
}
