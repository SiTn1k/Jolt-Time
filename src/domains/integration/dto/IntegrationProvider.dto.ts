/**
 * IntegrationProvider DTOs
 *
 * Data transfer objects for integration provider operations.
 */

import type { IntegrationType } from '../types/IntegrationType';
import type { IntegrationStatus } from '../types/IntegrationStatus';
import type { ProviderConfiguration } from '../types/ProviderConfiguration';
import type { IntegrationProviderMetadata } from '../types/IntegrationMetadata';

/**
 * Create integration provider request DTO.
 */
export interface CreateIntegrationProviderDto {
  /** Provider display name */
  providerName: string;

  /** Type of integration */
  providerType: IntegrationType;

  /** Initial status (default: pending) */
  status?: IntegrationStatus;

  /** Provider version */
  version?: string;

  /** Provider configuration */
  configuration?: ProviderConfiguration;

  /** Provider metadata */
  metadata?: Partial<IntegrationProviderMetadata>;
}

/**
 * Update integration provider request DTO.
 */
export interface UpdateIntegrationProviderDto {
  /** Provider display name */
  providerName?: string;

  /** Provider status */
  status?: IntegrationStatus;

  /** Provider version */
  version?: string;

  /** Provider configuration */
  configuration?: ProviderConfiguration;

  /** Provider metadata */
  metadata?: Partial<IntegrationProviderMetadata>;
}

/**
 * Integration provider response DTO.
 */
export interface IntegrationProviderResponseDto {
  /** Unique internal identifier */
  providerId: string;

  /** Provider display name */
  providerName: string;

  /** Type of integration */
  providerType: IntegrationType;

  /** Current provider status */
  status: IntegrationStatus;

  /** Provider version */
  version: string;

  /** Provider configuration */
  configuration: ProviderConfiguration;

  /** Provider metadata */
  metadata: IntegrationProviderMetadata;

  /** Timestamp when provider was created */
  createdAt: string;

  /** Timestamp when provider was last updated */
  updatedAt: string;
}

/**
 * Integration provider summary DTO (minimal data).
 */
export interface IntegrationProviderSummaryDto {
  /** Unique internal identifier */
  providerId: string;

  /** Provider display name */
  providerName: string;

  /** Type of integration */
  providerType: IntegrationType;

  /** Current provider status */
  status: IntegrationStatus;
}

/**
 * Integration provider list response with pagination.
 */
export interface IntegrationProviderListResponseDto {
  /** List of integration providers */
  providers: IntegrationProviderResponseDto[];

  /** Total count */
  total: number;

  /** Current page */
  page: number;

  /** Page size */
  pageSize: number;

  /** Total pages */
  totalPages: number;
}
