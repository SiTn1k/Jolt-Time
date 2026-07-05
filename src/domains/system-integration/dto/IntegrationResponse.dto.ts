/**
 * IntegrationResponse DTOs
 *
 * Data transfer objects for integration response operations.
 */

import type { SystemStatistics } from '../types/SystemStatistics';
import type { IntegrationStatus } from '../types/IntegrationStatus';
import type { SystemModuleSummaryDto } from './SystemModule.dto';
import type { IntegrationSnapshotResponseDto } from './IntegrationSnapshot.dto';

/**
 * Integration status response DTO.
 */
export interface IntegrationStatusResponseDto {
  /** Overall integration status */
  status: IntegrationStatus;

  /** Number of registered modules */
  registeredModulesCount: number;

  /** Number of healthy modules */
  healthyModulesCount: number;

  /** Number of failed modules */
  failedModulesCount: number;

  /** Timestamp of last update */
  lastUpdated: string;
}

/**
 * Integration statistics response DTO.
 */
export interface IntegrationStatisticsResponseDto extends SystemStatistics {}

/**
 * Integration overview response DTO.
 */
export interface IntegrationOverviewResponseDto {
  /** Overall integration status */
  status: IntegrationStatus;

  /** System statistics */
  statistics: SystemStatistics;

  /** Latest snapshot if available */
  latestSnapshot?: IntegrationSnapshotResponseDto;

  /** Summary of registered modules */
  moduleSummary: SystemModuleSummaryDto[];

  /** Timestamp of last update */
  lastUpdated: string;
}

/**
 * Integration health check response DTO.
 */
export interface IntegrationHealthResponseDto {
  /** Whether the system is healthy */
  isHealthy: boolean;

  /** Overall integration status */
  status: IntegrationStatus;

  /** Module status summary */
  modules: SystemModuleSummaryDto[];

  /** Health percentage */
  healthPercentage: number;

  /** Error message if unhealthy */
  errorMessage?: string;

  /** Timestamp of health check */
  checkedAt: string;
}
