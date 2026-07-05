/**
 * SystemModule DTOs
 *
 * Data transfer objects for system module operations.
 */

import type { ModuleStatus } from '../types/ModuleStatus';
import type { DependencyStatus } from '../types/DependencyStatus';
import type { IntegrationMetadata } from '../types/IntegrationMetadata';

/**
 * Module dependency DTO.
 */
export interface ModuleDependencyDto {
  /** Module ID of the dependency */
  moduleId: string;

  /** Name of the dependency */
  moduleName: string;

  /** Status of the dependency */
  status: DependencyStatus;

  /** Whether the dependency is optional */
  isOptional: boolean;
}

/**
 * Create system module request DTO.
 */
export interface CreateSystemModuleDto {
  /** Module display name */
  moduleName: string;

  /** Module version */
  moduleVersion?: string;

  /** Initial status (default: registered) */
  status?: ModuleStatus;

  /** Module dependencies */
  dependencies?: ModuleDependencyDto[];

  /** Module metadata */
  metadata?: Partial<IntegrationMetadata>;
}

/**
 * Update system module request DTO.
 */
export interface UpdateSystemModuleDto {
  /** Module display name */
  moduleName?: string;

  /** Module version */
  moduleVersion?: string;

  /** Module status */
  status?: ModuleStatus;

  /** Module dependencies */
  dependencies?: ModuleDependencyDto[];

  /** Module metadata */
  metadata?: Partial<IntegrationMetadata>;
}

/**
 * System module response DTO.
 */
export interface SystemModuleResponseDto {
  /** Unique module identifier */
  moduleId: string;

  /** Module display name */
  moduleName: string;

  /** Module version */
  moduleVersion: string;

  /** Current module status */
  status: ModuleStatus;

  /** Module dependencies */
  dependencies: ModuleDependencyDto[];

  /** Module metadata */
  metadata: IntegrationMetadata;

  /** Timestamp when module was created */
  createdAt: string;

  /** Timestamp when module was last updated */
  updatedAt: string;
}

/**
 * System module summary DTO (minimal data).
 */
export interface SystemModuleSummaryDto {
  /** Unique module identifier */
  moduleId: string;

  /** Module display name */
  moduleName: string;

  /** Current module status */
  status: ModuleStatus;
}

/**
 * System module list response with pagination.
 */
export interface SystemModuleListResponseDto {
  /** List of system modules */
  modules: SystemModuleResponseDto[];

  /** Total count */
  total: number;

  /** Current page */
  page: number;

  /** Page size */
  pageSize: number;

  /** Total pages */
  totalPages: number;
}
