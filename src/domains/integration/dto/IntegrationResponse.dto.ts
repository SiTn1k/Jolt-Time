/**
 * IntegrationResponse DTOs
 *
 * Data transfer objects for integration response operations.
 */

import type { RequestStatus } from '../types/RequestStatus';
import type { IntegrationResponseMetadata } from '../types/IntegrationMetadata';

/**
 * Create integration response request DTO.
 */
export interface CreateIntegrationResponseDto {
  /** Request ID this response is for */
  requestId: string;

  /** Response status */
  status?: RequestStatus;

  /** HTTP status code or similar response code */
  responseCode?: number;

  /** Response payload (JSON-serializable) */
  payload?: Record<string, unknown>;

  /** Response metadata */
  metadata?: Partial<IntegrationResponseMetadata>;
}

/**
 * Integration response response DTO.
 */
export interface IntegrationResponseResponseDto {
  /** Unique internal identifier */
  responseId: string;

  /** Request ID this response is for */
  requestId: string;

  /** Response status */
  status: RequestStatus;

  /** HTTP status code */
  responseCode: number;

  /** Response payload */
  payload: Record<string, unknown>;

  /** Timestamp when response was received */
  receivedAt: string;

  /** Response metadata */
  metadata: IntegrationResponseMetadata;
}

/**
 * Integration response summary DTO (minimal data).
 */
export interface IntegrationResponseSummaryDto {
  /** Unique internal identifier */
  responseId: string;

  /** Request ID this response is for */
  requestId: string;

  /** Response status */
  status: RequestStatus;

  /** HTTP status code */
  responseCode: number;

  /** Timestamp when response was received */
  receivedAt: string;
}

/**
 * Integration response list response with pagination.
 */
export interface IntegrationResponseListResponseDto {
  /** List of integration responses */
  responses: IntegrationResponseResponseDto[];

  /** Total count */
  total: number;

  /** Current page */
  page: number;

  /** Page size */
  pageSize: number;

  /** Total pages */
  totalPages: number;
}

/**
 * Integration response wrapper DTO for request-response pairing.
 */
export interface IntegrationResponseWrapperDto {
  /** The integration request summary */
  request: {
    /** Request ID */
    requestId: string;
    /** Provider ID */
    providerId: string;
    /** Request type */
    requestType: string;
    /** Request payload */
    payload: Record<string, unknown>;
    /** Creation timestamp */
    createdAt: string;
    /** Request metadata */
    metadata: import('../types/IntegrationMetadata').IntegrationRequestMetadata;
  };

  /** The associated response (if available) */
  response: IntegrationResponseResponseDto | null;

  /** Processing duration in milliseconds */
  processingTimeMs?: number;
}
