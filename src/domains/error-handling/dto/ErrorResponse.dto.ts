/**
 * Error Response DTO
 *
 * Data Transfer Object for API error responses.
 */

import type { ErrorSeverity } from '../types/ErrorSeverity';
import type { ErrorCategoryType } from '../types/ErrorCategoryType';

/**
 * DTO for API error response.
 */
export interface ErrorResponseDto {
  /** Error ID for tracking */
  errorId?: string;

  /** Error code */
  errorCode: string;

  /** Error category */
  category: ErrorCategoryType;

  /** Error severity */
  severity: ErrorSeverity;

  /** User-friendly error message */
  message: string;

  /** Detailed error information (for debugging, not shown to users) */
  details?: string;

  /** Timestamp when error occurred */
  timestamp: string;

  /** Request ID for tracing */
  requestId?: string;

  /** Additional metadata */
  metadata?: Record<string, unknown>;

  /** Suggested user action */
  userAction?: string;

  /** Support contact information */
  supportContact?: string;
}

/**
 * DTO for validation error response.
 */
export interface ValidationErrorResponseDto {
  /** Error code */
  errorCode: string;

  /** Error message */
  message: string;

  /** Validation errors */
  validationErrors: Array<{
    field: string;
    message: string;
    code: string;
  }>;

  /** Timestamp */
  timestamp: string;
}

/**
 * DTO for error list response.
 */
export interface ErrorListResponseDto {
  /** List of errors */
  errors: ErrorResponseDto[];

  /** Total count */
  total: number;

  /** Page number */
  page: number;

  /** Page size */
  pageSize: number;

  /** Total pages */
  totalPages: number;
}
