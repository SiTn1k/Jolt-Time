/**
 * Error Types
 *
 * Error-related type definitions for standardized error handling.
 */

import type { ErrorCategory, ErrorSeverity } from '../constants';

/**
 * Application error with full context.
 */
export interface JoltError {
  id: string;
  code: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  message: string;
  details?: Record<string, unknown>;
  recoverable: boolean;
  timestamp: Date;
  context?: ErrorContext;
  stack?: string;
}

/**
 * Additional context for error tracking.
 */
export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  userAgent?: string;
  url?: string;
  method?: string;
  previousErrors?: string[];
}

/**
 * Application warning.
 */
export interface JoltWarning {
  id: string;
  code: string;
  message: string;
  severity: WarningSeverity;
  data?: Record<string, unknown>;
}

/**
 * Warning severity levels.
 */
export type WarningSeverity = 'low' | 'medium' | 'high';

/**
 * Validation result type.
 */
export interface ValidationResult<T = unknown> {
  valid: boolean;
  errors?: ValidationErrorItem[];
  warnings?: JoltWarning[];
  data?: T;
}

/**
 * Validation error item.
 */
export interface ValidationErrorItem {
  field: string;
  code: string;
  message: string;
  value?: unknown;
}

/**
 * Service operation result type.
 */
export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: JoltError;
}

/**
 * Repository operation result type.
 */
export interface RepositoryResult<T> {
  success: boolean;
  data?: T;
  error?: RepositoryErrorData;
}

/**
 * Repository error details.
 */
export interface RepositoryErrorData {
  code: string;
  message: string;
  table?: string;
  constraint?: string;
  details?: Record<string, unknown>;
}

/**
 * Database error codes.
 */
export const DatabaseErrorCodes = {
  CONNECTION_FAILED: 'DB_CONNECTION_FAILED',
  QUERY_FAILED: 'DB_QUERY_FAILED',
  CONSTRAINT_VIOLATION: 'DB_CONSTRAINT_VIOLATION',
  TIMEOUT: 'DB_TIMEOUT',
  UNIQUE_VIOLATION: 'DB_UNIQUE_VIOLATION',
  FOREIGN_KEY_VIOLATION: 'DB_FOREIGN_KEY_VIOLATION',
  NOT_NULL_VIOLATION: 'DB_NOT_NULL_VIOLATION',
  CHECK_VIOLATION: 'DB_CHECK_VIOLATION',
} as const;

/**
 * Validation error codes.
 */
export const ValidationErrorCodes = {
  REQUIRED_FIELD: 'VALIDATION_REQUIRED_FIELD',
  INVALID_TYPE: 'VALIDATION_INVALID_TYPE',
  INVALID_FORMAT: 'VALIDATION_INVALID_FORMAT',
  OUT_OF_RANGE: 'VALIDATION_OUT_OF_RANGE',
  TOO_SHORT: 'VALIDATION_TOO_SHORT',
  TOO_LONG: 'VALIDATION_TOO_LONG',
  INVALID_ENUM: 'VALIDATION_INVALID_ENUM',
  DUPLICATE_ENTRY: 'VALIDATION_DUPLICATE_ENTRY',
} as const;

/**
 * Business error codes.
 */
export const BusinessErrorCodes = {
  INSUFFICIENT_BALANCE: 'BUSINESS_INSUFFICIENT_BALANCE',
  NOT_FOUND: 'BUSINESS_NOT_FOUND',
  ALREADY_EXISTS: 'BUSINESS_ALREADY_EXISTS',
  ALREADY_CLAIMED: 'BUSINESS_ALREADY_CLAIMED',
  NOT_ELIGIBLE: 'BUSINESS_NOT_ELIGIBLE',
  COOLDOWN_ACTIVE: 'BUSINESS_COOLDOWN_ACTIVE',
  MAX_LIMIT_REACHED: 'BUSINESS_MAX_LIMIT_REACHED',
  REQUIREMENT_NOT_MET: 'BUSINESS_REQUIREMENT_NOT_MET',
  OPERATION_NOT_ALLOWED: 'BUSINESS_OPERATION_NOT_ALLOWED',
} as const;

/**
 * API error codes.
 */
export const ApiErrorCodes = {
  UNAUTHORIZED: 'API_UNAUTHORIZED',
  FORBIDDEN: 'API_FORBIDDEN',
  NOT_FOUND: 'API_NOT_FOUND',
  RATE_LIMITED: 'API_RATE_LIMITED',
  TIMEOUT: 'API_TIMEOUT',
  SERVER_ERROR: 'API_SERVER_ERROR',
  BAD_REQUEST: 'API_BAD_REQUEST',
  INVALID_RESPONSE: 'API_INVALID_RESPONSE',
} as const;

/**
 * Telegram error codes.
 */
export const TelegramErrorCodes = {
  API_ERROR: 'TELEGRAM_API_ERROR',
  AUTH_FAILED: 'TELEGRAM_AUTH_FAILED',
  USER_BLOCKED: 'TELEGRAM_USER_BLOCKED',
  CHAT_NOT_FOUND: 'TELEGRAM_CHAT_NOT_FOUND',
  MESSAGE_NOT_SENT: 'TELEGRAM_MESSAGE_NOT_SENT',
  INVALID_DEEP_LINK: 'TELEGRAM_INVALID_DEEP_LINK',
} as const;
