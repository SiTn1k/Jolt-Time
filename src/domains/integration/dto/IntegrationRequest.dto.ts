/**
 * IntegrationRequest DTOs
 *
 * Data transfer objects for integration request operations.
 */

import type { IntegrationRequestMetadata } from '../types/IntegrationMetadata';

/**
 * Create integration request request DTO.
 */
export interface CreateIntegrationRequestDto {
  /** Provider ID this request is for */
  providerId: string;

  /** Type of request */
  requestType: string;

  /** Request payload (JSON-serializable) */
  payload?: Record<string, unknown>;

  /** Request metadata */
  metadata?: Partial<IntegrationRequestMetadata>;
}

/**
 * Integration request response DTO.
 */
export interface IntegrationRequestResponseDto {
  /** Unique internal identifier */
  requestId: string;

  /** Provider ID this request is for */
  providerId: string;

  /** Type of request */
  requestType: string;

  /** Request payload */
  payload: Record<string, unknown>;

  /** Timestamp when request was created */
  createdAt: string;

  /** Request metadata */
  metadata: IntegrationRequestMetadata;
}

/**
 * Integration request summary DTO (minimal data).
 */
export interface IntegrationRequestSummaryDto {
  /** Unique internal identifier */
  requestId: string;

  /** Provider ID this request is for */
  providerId: string;

  /** Type of request */
  requestType: string;

  /** Timestamp when request was created */
  createdAt: string;
}

/**
 * Integration request list response with pagination.
 */
export interface IntegrationRequestListResponseDto {
  /** List of integration requests */
  requests: IntegrationRequestResponseDto[];

  /** Total count */
  total: number;

  /** Current page */
  page: number;

  /** Page size */
  pageSize: number;

  /** Total pages */
  totalPages: number;
}
