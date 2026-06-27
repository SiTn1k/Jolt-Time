/**
 * Business Error
 *
 * Error class for business logic rule violations.
 */

import { ApplicationError } from './application.error';
import { ErrorCategory, ErrorSeverity } from '../constants';
import { BusinessErrorCodes } from '../types';

/**
 * Business error for game/business rule violations.
 */
export class BusinessError extends ApplicationError {
  public readonly field?: string;

  constructor(params: {
    message: string;
    code?: string;
    field?: string;
    details?: Record<string, unknown>;
    context?: Record<string, unknown>;
    cause?: Error;
    recoverable?: boolean;
  }) {
    super({
      message: params.message,
      code: params.code || BusinessErrorCodes.OPERATION_NOT_ALLOWED,
      category: ErrorCategory.BUSINESS,
      severity: ErrorSeverity.MEDIUM,
      details: params.details,
      recoverable: params.recoverable ?? true,
      context: params.context,
      cause: params.cause,
    });
    this.name = 'BusinessError';
    this.field = params.field;
  }

  /**
   * Create insufficient balance error.
   */
  static insufficientBalance(
    required: number,
    available: number,
    currency: string
  ): BusinessError {
    return new BusinessError({
      message: `Insufficient ${currency}. Required: ${required}, Available: ${available}`,
      code: BusinessErrorCodes.INSUFFICIENT_BALANCE,
      details: { required, available, currency },
    });
  }

  /**
   * Create not found error.
   */
  static notFound(resource: string, id: string): BusinessError {
    return new BusinessError({
      message: `${resource} not found: ${id}`,
      code: BusinessErrorCodes.NOT_FOUND,
      details: { resource, id },
    });
  }

  /**
   * Create already exists error.
   */
  static alreadyExists(resource: string, identifier: string): BusinessError {
    return new BusinessError({
      message: `${resource} already exists: ${identifier}`,
      code: BusinessErrorCodes.ALREADY_EXISTS,
      details: { resource, identifier },
    });
  }

  /**
   * Create already claimed error.
   */
  static alreadyClaimed(resource: string): BusinessError {
    return new BusinessError({
      message: `${resource} has already been claimed`,
      code: BusinessErrorCodes.ALREADY_CLAIMED,
      details: { resource },
    });
  }

  /**
   * Create not eligible error.
   */
  static notEligible(reason: string): BusinessError {
    return new BusinessError({
      message: `Not eligible: ${reason}`,
      code: BusinessErrorCodes.NOT_ELIGIBLE,
      details: { reason },
    });
  }

  /**
   * Create cooldown active error.
   */
  static cooldownActive(action: string, retryAfterMs: number): BusinessError {
    return new BusinessError({
      message: `Cooldown active for ${action}. Retry after ${Math.ceil(retryAfterMs / 1000)}s`,
      code: BusinessErrorCodes.COOLDOWN_ACTIVE,
      details: { action, retryAfterMs },
      recoverable: true,
    });
  }

  /**
   * Create max limit reached error.
   */
  static maxLimitReached(resource: string, limit: number): BusinessError {
    return new BusinessError({
      message: `Maximum ${resource} limit reached: ${limit}`,
      code: BusinessErrorCodes.MAX_LIMIT_REACHED,
      details: { resource, limit },
    });
  }

  /**
   * Create requirement not met error.
   */
  static requirementNotMet(requirement: string, current: unknown, required: unknown): BusinessError {
    return new BusinessError({
      message: `Requirement not met: ${requirement}. Current: ${current}, Required: ${required}`,
      code: BusinessErrorCodes.REQUIREMENT_NOT_MET,
      details: { requirement, current, required },
    });
  }

  /**
   * Create operation not allowed error.
   */
  static operationNotAllowed(action: string, reason: string): BusinessError {
    return new BusinessError({
      message: `${action} is not allowed: ${reason}`,
      code: BusinessErrorCodes.OPERATION_NOT_ALLOWED,
      details: { action, reason },
      recoverable: false,
    });
  }
}

/**
 * Check if value is a BusinessError.
 */
export function isBusinessError(value: unknown): value is BusinessError {
  return value instanceof BusinessError;
}
