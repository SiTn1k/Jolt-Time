/**
 * System Error DTO
 *
 * Data Transfer Object for system error data.
 */

import type { ErrorSeverity } from '../types/ErrorSeverity';
import type { ErrorStatus } from '../types/ErrorStatus';
import type { ErrorCategoryType } from '../types/ErrorCategoryType';
import type { ErrorMetadata } from '../types/ErrorMetadata';

/**
 * DTO for creating a new system error.
 */
export interface CreateSystemErrorDto {
  /** Error code identifier */
  errorCode: string;

  /** Error category */
  category: ErrorCategoryType;

  /** Error severity level */
  severity: ErrorSeverity;

  /** Error message */
  message: string;

  /** Stack trace if available */
  stackTrace?: string;

  /** Error metadata */
  metadata?: ErrorMetadata;

  /** Context ID */
  contextId?: string;
}

/**
 * DTO for updating system error status.
 */
export interface UpdateSystemErrorStatusDto {
  /** New status */
  status: ErrorStatus;

  /** Resolved at timestamp (if status is resolved) */
  resolvedAt?: Date;
}

/**
 * DTO for system error response.
 */
export interface SystemErrorResponseDto {
  /** Error ID */
  errorId: string;

  /** Error code */
  errorCode: string;

  /** Error category */
  category: ErrorCategoryType;

  /** Error severity */
  severity: ErrorSeverity;

  /** Error message */
  message: string;

  /** Stack trace */
  stackTrace?: string;

  /** Creation timestamp */
  createdAt: string;

  /** Error metadata */
  metadata: ErrorMetadata;

  /** Error status */
  status: ErrorStatus;

  /** Resolved at timestamp */
  resolvedAt?: string;

  /** Context ID */
  contextId?: string;
}
