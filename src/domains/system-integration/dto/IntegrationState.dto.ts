/**
 * IntegrationState DTOs
 *
 * Data transfer objects for integration state operations.
 */

import type { IntegrationStatus } from '../types/IntegrationStatus';
import type { IntegrationMetadata } from '../types/IntegrationMetadata';

/**
 * Create integration state request DTO.
 */
export interface CreateIntegrationStateDto {
  /** Module ID reference */
  moduleId: string;

  /** Initial status (default: unknown) */
  status?: IntegrationStatus;

  /** State metadata */
  metadata?: Partial<IntegrationMetadata>;
}

/**
 * Update integration state request DTO.
 */
export interface UpdateIntegrationStateDto {
  /** Integration status */
  status?: IntegrationStatus;

  /** State metadata */
  metadata?: Partial<IntegrationMetadata>;
}

/**
 * Integration state response DTO.
 */
export interface IntegrationStateResponseDto {
  /** Unique state identifier */
  stateId: string;

  /** Module ID reference */
  moduleId: string;

  /** Current integration status */
  status: IntegrationStatus;

  /** Last updated timestamp */
  lastUpdated: string;

  /** State metadata */
  metadata: IntegrationMetadata;

  /** Timestamp when state was created */
  createdAt: string;

  /** Timestamp when state was last updated */
  updatedAt: string;
}

/**
 * Integration state list response with pagination.
 */
export interface IntegrationStateListResponseDto {
  /** List of integration states */
  states: IntegrationStateResponseDto[];

  /** Total count */
  total: number;

  /** Current page */
  page: number;

  /** Page size */
  pageSize: number;

  /** Total pages */
  totalPages: number;
}
