/**
 * Configuration Response DTO
 *
 * General response DTOs for configuration operations.
 */

import type { ConfigurationEntryResponseDto } from './ConfigurationEntry.dto';
import type { ConfigurationGroupResponseDto } from './ConfigurationGroup.dto';
import type { FeatureFlagResponseDto } from './FeatureFlag.dto';
import type { ConfigurationStatistics } from '../types/ConfigurationStatistics';

/**
 * Paginated configuration entries response.
 */
export interface ConfigurationEntriesResponseDto {
  /** List of configuration entries */
  items: ConfigurationEntryResponseDto[];

  /** Total count */
  total: number;

  /** Current page */
  page: number;

  /** Page size */
  pageSize: number;

  /** Total pages */
  totalPages: number;

  /** Has next page */
  hasNextPage: boolean;

  /** Has previous page */
  hasPreviousPage: boolean;
}

/**
 * Paginated configuration groups response.
 */
export interface ConfigurationGroupsResponseDto {
  /** List of configuration groups */
  items: ConfigurationGroupResponseDto[];

  /** Total count */
  total: number;

  /** Current page */
  page: number;

  /** Page size */
  pageSize: number;

  /** Total pages */
  totalPages: number;

  /** Has next page */
  hasNextPage: boolean;

  /** Has previous page */
  hasPreviousPage: boolean;
}

/**
 * Paginated feature flags response.
 */
export interface FeatureFlagsResponseDto {
  /** List of feature flags */
  items: FeatureFlagResponseDto[];

  /** Total count */
  total: number;

  /** Current page */
  page: number;

  /** Page size */
  pageSize: number;

  /** Total pages */
  totalPages: number;

  /** Has next page */
  hasNextPage: boolean;

  /** Has previous page */
  hasPreviousPage: boolean;
}

/**
 * Configuration statistics response.
 */
export interface ConfigurationStatisticsResponseDto {
  /** Statistics data */
  statistics: ConfigurationStatistics;
}

/**
 * Batch configuration lookup response.
 */
export interface ConfigurationBulkResponseDto {
  /** Map of key to configuration entry */
  entries: Record<string, ConfigurationEntryResponseDto>;

  /** Keys that were not found */
  notFound: string[];
}
