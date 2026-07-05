/**
 * Error Handling Service
 *
 * Central service for capturing, classifying, and responding to errors.
 * This is the ONLY centralized error management system.
 *
 * IMPORTANT: Error Handling Service NEVER modifies gameplay.
 * It ONLY captures, classifies, logs, reports, and returns standardized responses.
 */

import type { IErrorRepository } from '../interfaces/IErrorRepository';
import { SystemError } from '../entities/SystemError';
import { ErrorContext } from '../entities/ErrorContext';
import { ErrorId } from '../value-objects/ErrorId';
import { ContextId } from '../value-objects/ContextId';
import { ErrorSeverity, ErrorStatus, ErrorCategoryType } from '../types';
import { createLogger } from '../../../core/logging/logger.service';
import type { ILogger } from '../../../shared/types';
import type { ErrorResponseDto, ValidationErrorResponseDto } from '../dto/ErrorResponse.dto';
import type { ErrorMetadata } from '../types/ErrorMetadata';
import type { ErrorStatistics } from '../types/ErrorStatistics';
import { createEmptyErrorStatistics } from '../types/ErrorStatistics';
import { createSystemErrorCreatedEvent } from '../events/SystemErrorCreated.event';
import { createCriticalErrorDetectedEvent } from '../events/CriticalErrorDetected.event';
import type { SystemErrorCreatedEvent } from '../events/SystemErrorCreated.event';
import type { CriticalErrorDetectedEvent } from '../events/CriticalErrorDetected.event';
import type { PaginationParams } from '../../../shared/types/base.types';
import type { PaginatedResult } from '../../../shared/types/base.types';
import type { IMonitoringService } from '../../../domains/monitoring/services/MonitoringService';
import { MetricUnit } from '../../../domains/monitoring/types/MetricUnit';
import { AuditService } from '../../../domains/audit/services/AuditService';
import { AuditActorType } from '../../../domains/audit/types/AuditActorType';
import type { AuditAction } from '../../../domains/audit/types/AuditAction';
import { AuditResult as AuditResultEnum } from '../../../domains/audit/types/AuditResult';
import { ApplicationError, isApplicationError } from '../../../shared/errors/application.error';
import { ValidationError, isValidationError } from '../../../shared/errors/validation.error';
import { BusinessError, isBusinessError } from '../../../shared/errors/business.error';
import { RepositoryError } from '../../../shared/errors/repository.error';

/**
 * Error Classification types
 */
export enum ErrorClassification {
  BusinessError = 'business_error',
  ValidationError = 'validation_error',
  RepositoryError = 'repository_error',
  ExternalProviderError = 'external_provider_error',
  ConfigurationError = 'configuration_error',
  InternalError = 'internal_error',
  CriticalError = 'critical_error',
}

/**
 * HTTP Status codes for error responses
 */
export const HTTP_STATUS_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Error handling service interface
 */
export interface IErrorHandlingService {
  // Error Capture
  captureError(params: {
    error: Error;
    errorCode?: string;
    category?: ErrorCategoryType;
    severity?: ErrorSeverity;
    context?: ErrorContext;
    metadata?: ErrorMetadata;
  }): Promise<SystemError>;

  // Error Context
  createContext(params: {
    service: string;
    operation: string;
    requestId?: string;
    actorId?: string;
    metadata?: Record<string, unknown>;
  }): Promise<ErrorContext>;

  // Error Classification
  classifyError(error: Error): ErrorClassification;

  // Error Response
  buildErrorResponse(error: SystemError): ErrorResponseDto;
  buildValidationErrorResponse(error: ValidationError): ValidationErrorResponseDto;
  buildHTTPErrorResponse(error: Error, statusCode: number): ErrorResponseDto;

  // System Summary
  getSystemSummary(): Promise<ErrorStatistics>;

  // Error Queries
  listErrors(params: PaginationParams, filters?: Parameters<IErrorRepository['listErrors']>[1]): Promise<PaginatedResult<SystemError>>;
  getErrorById(errorId: string): Promise<SystemError | null>;
}

/**
 * Error Handling Service implementation
 */
export class ErrorHandlingService implements IErrorHandlingService {
  private readonly repository: IErrorRepository;
  private readonly logger: ILogger;
  private monitoringService?: IMonitoringService;
  private auditService?: AuditService;
  private recentEvents: Array<SystemErrorCreatedEvent | CriticalErrorDetectedEvent> = [];
  private readonly maxEventHistory = 100;

  /**
   * Creates a new ErrorHandlingService instance.
   */
  constructor(
    repository: IErrorRepository,
    monitoringService?: IMonitoringService,
    auditService?: AuditService,
    logger?: ILogger
  ) {
    this.repository = repository;
    this.monitoringService = monitoringService;
    this.auditService = auditService;
    this.logger = logger ?? createLogger('ErrorHandlingService');
  }

  /**
   * Sets the monitoring service for critical error notifications.
   */
  setMonitoringService(monitoringService: IMonitoringService): void {
    this.monitoringService = monitoringService;
  }

  /**
   * Sets the audit service for critical error logging.
   */
  setAuditService(auditService: AuditService): void {
    this.auditService = auditService;
  }

  // ============ Error Capture ============

  /**
   * Captures an error and stores it in the repository.
   * This is the main entry point for error handling.
   */
  async captureError(params: {
    error: Error;
    errorCode?: string;
    category?: ErrorCategoryType;
    severity?: ErrorSeverity;
    context?: ErrorContext;
    metadata?: ErrorMetadata;
  }): Promise<SystemError> {
    const {
      error,
      errorCode = 'UNKNOWN_ERROR',
      category = ErrorCategoryType.System,
      severity = ErrorSeverity.Error,
      context,
      metadata = {},
    } = params;

    // Classify the error to determine appropriate handling
    const classification = this.classifyError(error);

    // Determine final severity based on classification
    const finalSeverity = this.determineSeverity(error, severity, classification);

    // Build metadata
    const errorMetadata: ErrorMetadata = {
      ...metadata,
      sourceModule: metadata.sourceModule || error.stack?.split('\n')[1]?.trim() || 'unknown',
      classification,
      originalErrorType: error.constructor.name,
      ...(error instanceof Error && error.message && { originalMessage: error.message }),
    };

    try {
      // Create the system error entity
      const systemError = SystemError.create({
        errorId: ErrorId.generate(),
        errorCode,
        category: this.mapClassificationToCategory(classification),
        severity: finalSeverity,
        message: this.sanitizeMessage(error.message),
        stackTrace: error.stack,
        metadata: errorMetadata,
        contextId: context?.contextId.value,
      });

      // Store the error
      const stored = await this.repository.createError(systemError);

      // Emit domain events
      this.emitErrorEvents(stored);

      // Handle critical errors
      if (finalSeverity === ErrorSeverity.Critical || finalSeverity === ErrorSeverity.Fatal) {
        await this.handleCriticalError(stored, error);
      }

      this.logger.info('Error captured', {
        errorId: stored.errorId.value,
        errorCode,
        classification,
        severity: finalSeverity,
      });

      return stored;
    } catch (captureError) {
      // Failure handling: Never create recursive exceptions
      // If error repository fails, log and continue
      this.logger.error('Failed to capture error - logging only', captureError as Error, {
        originalError: error.message,
        errorCode,
      });
      throw error; // Re-throw the original error
    }
  }

  // ============ Error Context ============

  /**
   * Creates a new error context for tracking request context.
   */
  async createContext(params: {
    service: string;
    operation: string;
    requestId?: string;
    actorId?: string;
    metadata?: Record<string, unknown>;
  }): Promise<ErrorContext> {
    try {
      const context = ErrorContext.create({
        contextId: ContextId.generate(),
        service: params.service,
        operation: params.operation,
        requestId: params.requestId,
        actorId: params.actorId,
        metadata: params.metadata,
      });

      return await this.repository.createContext(context);
    } catch (error) {
      this.logger.error('Failed to create error context - continuing', error as Error);
      // Return a transient context that wasn't stored
      return ErrorContext.create({
        contextId: ContextId.generate(),
        service: params.service,
        operation: params.operation,
        requestId: params.requestId,
        actorId: params.actorId,
        metadata: params.metadata,
      });
    }
  }

  // ============ Error Classification ============

  /**
   * Classifies an error into one of the predefined categories.
   */
  classifyError(error: Error): ErrorClassification {
    // Check validation first since ValidationError may extend ApplicationError
    if (isValidationError(error)) {
      return ErrorClassification.ValidationError;
    }

    // RepositoryError extends ApplicationError, so check before ApplicationError
    if (error instanceof RepositoryError) {
      return ErrorClassification.RepositoryError;
    }

    // BusinessError extends ApplicationError, so check BusinessError before ApplicationError
    if (isBusinessError(error)) {
      return ErrorClassification.BusinessError;
    }

    if (isApplicationError(error)) {
      return ErrorClassification.BusinessError;
    }

    // External provider errors (network, API timeouts, etc.)
    if (
      error.message.includes('fetch') ||
      error.message.includes('network') ||
      error.message.includes('timeout') ||
      error.message.includes('ECONNREFUSED')
    ) {
      return ErrorClassification.ExternalProviderError;
    }

    // Configuration errors
    if (
      error.message.includes('configuration') ||
      error.message.includes('config') ||
      error.message.includes('environment')
    ) {
      return ErrorClassification.ConfigurationError;
    }

    // Unknown errors default to internal
    return ErrorClassification.InternalError;
  }

  /**
   * Determines the final severity of an error.
   */
  private determineSeverity(
    error: Error,
    requestedSeverity: ErrorSeverity,
    classification: ErrorClassification
  ): ErrorSeverity {
    // Validation errors are always at most Warning
    if (classification === ErrorClassification.ValidationError) {
      return ErrorSeverity.Warning;
    }

    // Business errors are at most Error
    if (classification === ErrorClassification.BusinessError) {
      return ErrorSeverity.Error;
    }

    // Repository errors are at least Warning
    if (classification === ErrorClassification.RepositoryError) {
      return ErrorSeverity.Error;
    }

    // External provider errors are at most Warning
    if (classification === ErrorClassification.ExternalProviderError) {
      return ErrorSeverity.Warning;
    }

    // Critical errors always result in Critical or Fatal severity
    if (classification === ErrorClassification.CriticalError) {
      return ErrorSeverity.Critical;
    }

    return requestedSeverity;
  }

  /**
   * Maps error classification to error category type.
   */
  private mapClassificationToCategory(classification: ErrorClassification): ErrorCategoryType {
    switch (classification) {
      case ErrorClassification.BusinessError:
        return ErrorCategoryType.Service;
      case ErrorClassification.ValidationError:
        return ErrorCategoryType.Validation;
      case ErrorClassification.RepositoryError:
        return ErrorCategoryType.Repository;
      case ErrorClassification.ExternalProviderError:
        return ErrorCategoryType.ExternalService;
      case ErrorClassification.ConfigurationError:
        return ErrorCategoryType.Configuration;
      case ErrorClassification.CriticalError:
        return ErrorCategoryType.System;
      case ErrorClassification.InternalError:
      default:
        return ErrorCategoryType.System;
    }
  }

  /**
   * Sanitizes an error message to prevent information leakage.
   */
  private sanitizeMessage(message: string): string {
    // Remove potential sensitive data patterns
    const sensitivePatterns = [
      /Bearer\s+[^\s]+/gi,
      /password[=:]\s*[^\s]+/gi,
      /token[=:]\s*[^\s]+/gi,
      /api[_-]?key[=:]\s*[^\s]+/gi,
      /[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,}/g, // emails
      /[0-9]{4,}/g, // long numbers
    ];

    let sanitized = message;
    for (const pattern of sensitivePatterns) {
      sanitized = sanitized.replace(pattern, '[REDACTED]');
    }

    // Truncate if too long
    if (sanitized.length > 2048) {
      sanitized = sanitized.substring(0, 2045) + '...';
    }

    return sanitized;
  }

  // ============ Error Response Building ============

  /**
   * Builds a standardized error response from a SystemError.
   */
  buildErrorResponse(error: SystemError): ErrorResponseDto {
    return {
      errorId: error.errorId.value,
      errorCode: error.errorCode,
      category: error.category,
      severity: error.severity,
      message: error.message,
      timestamp: error.createdAt.toISOString(),
      metadata: error.metadata,
    };
  }

  /**
   * Builds a validation error response from a ValidationError.
   */
  buildValidationErrorResponse(error: ValidationError): ValidationErrorResponseDto {
    return {
      errorCode: 'VALIDATION_ERROR',
      message: error.message,
      validationErrors: error.errors.map((e) => ({
        field: e.field || 'unknown',
        message: e.message,
        code: e.code || 'INVALID',
      })),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Builds an HTTP error response from any error.
   */
  buildHTTPErrorResponse(error: Error, statusCode: number): ErrorResponseDto {
    const classification = this.classifyError(error);

    return {
      errorCode: this.getErrorCodeForClassification(classification),
      category: this.mapClassificationToCategory(classification),
      severity: this.mapStatusCodeToSeverity(statusCode),
      message: this.sanitizeMessage(error.message),
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      userAction: this.getUserActionForClassification(classification),
    };
  }

  /**
   * Gets the HTTP status code for an error.
   */
  getHTTPStatusCode(error: Error): number {
    if (isValidationError(error)) {
      return HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY;
    }

    const errorName = error.name?.toLowerCase() || '';
    const errorMessage = error.message?.toLowerCase() || '';

    if (errorName === 'unauthorizederror' || errorMessage.includes('unauthorized')) {
      return HTTP_STATUS_CODES.UNAUTHORIZED;
    }

    if (errorName === 'forbiddenerror' || errorMessage.includes('forbidden')) {
      return HTTP_STATUS_CODES.FORBIDDEN;
    }

    if (errorName === 'notfounderror' || errorMessage.includes('not found') || errorMessage.includes('not_found')) {
      return HTTP_STATUS_CODES.NOT_FOUND;
    }

    if (errorName === 'conflicterror' || errorMessage.includes('conflict')) {
      return HTTP_STATUS_CODES.CONFLICT;
    }

    if (errorMessage.includes('rate limit') || errorMessage.includes('too many') || errorMessage.includes('ratelimit') || errorMessage.includes('rate_limit')) {
      return HTTP_STATUS_CODES.TOO_MANY_REQUESTS;
    }

    if (error instanceof RepositoryError) {
      return HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    }

    return HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
  }

  /**
   * Maps status code to severity.
   */
  private mapStatusCodeToSeverity(statusCode: number): ErrorSeverity {
    if (statusCode >= 500) {
      return ErrorSeverity.Error;
    }
    if (statusCode >= 400) {
      return ErrorSeverity.Warning;
    }
    return ErrorSeverity.Info;
  }

  /**
   * Gets error code for classification.
   */
  private getErrorCodeForClassification(classification: ErrorClassification): string {
    switch (classification) {
      case ErrorClassification.BusinessError:
        return 'BUSINESS_ERROR';
      case ErrorClassification.ValidationError:
        return 'VALIDATION_ERROR';
      case ErrorClassification.RepositoryError:
        return 'REPOSITORY_ERROR';
      case ErrorClassification.ExternalProviderError:
        return 'EXTERNAL_PROVIDER_ERROR';
      case ErrorClassification.ConfigurationError:
        return 'CONFIGURATION_ERROR';
      case ErrorClassification.CriticalError:
        return 'CRITICAL_ERROR';
      case ErrorClassification.InternalError:
      default:
        return 'INTERNAL_ERROR';
    }
  }

  /**
   * Gets user action hint for classification.
   */
  private getUserActionForClassification(classification: ErrorClassification): string {
    switch (classification) {
      case ErrorClassification.ValidationError:
        return 'Please check your input and try again.';
      case ErrorClassification.BusinessError:
        return 'Please try a different action or contact support.';
      case ErrorClassification.ExternalProviderError:
        return 'Please try again later.';
      case ErrorClassification.InternalError:
        return 'An unexpected error occurred. Please try again.';
      default:
        return 'Please contact support if the problem persists.';
    }
  }

  // ============ System Summary ============

  /**
   * Gets system error statistics summary.
   */
  async getSystemSummary(): Promise<ErrorStatistics> {
    try {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const result = await this.repository.listErrors(
        { page: 1, pageSize: 1000 },
        {
          createdAfter: thirtyDaysAgo,
        }
      );

      const bySeverity: Record<string, number> = {};
      const byCategory: Record<string, number> = {};
      const byStatus: Record<string, number> = {};

      let criticalCount = 0;
      let fatalCount = 0;
      let resolvedCount = 0;

      for (const error of result.items) {
        bySeverity[error.severity] = (bySeverity[error.severity] || 0) + 1;
        byCategory[error.category] = (byCategory[error.category] || 0) + 1;
        byStatus[error.status] = (byStatus[error.status] || 0) + 1;

        if (error.severity === ErrorSeverity.Critical) criticalCount++;
        if (error.severity === ErrorSeverity.Fatal) fatalCount++;
        if (error.status === ErrorStatus.Resolved) resolvedCount++;
      }

      // Calculate average resolution time
      let totalResolutionTime = 0;
      let resolvedErrors = 0;
      for (const error of result.items) {
        if (error.resolvedAt) {
          totalResolutionTime += error.resolvedAt.getTime() - error.createdAt.getTime();
          resolvedErrors++;
        }
      }
      const avgResolutionTimeMs = resolvedErrors > 0 ? totalResolutionTime / resolvedErrors : 0;

      return {
        totalCount: result.total,
        bySeverity,
        byCategory,
        byStatus,
        criticalCount,
        fatalCount,
        resolvedCount,
        avgResolutionTimeMs,
        periodStart: thirtyDaysAgo,
        periodEnd: now,
      };
    } catch (error) {
      this.logger.error('Failed to get system summary', error as Error);
      return createEmptyErrorStatistics(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        new Date()
      );
    }
  }

  // ============ Error Queries ============

  /**
   * Lists errors with pagination.
   */
  async listErrors(
    params: PaginationParams,
    filters?: Parameters<IErrorRepository['listErrors']>[1]
  ): Promise<PaginatedResult<SystemError>> {
    return this.repository.listErrors(params, filters);
  }

  /**
   * Gets an error by ID.
   */
  async getErrorById(errorId: string): Promise<SystemError | null> {
    try {
      return await this.repository.findErrorById(ErrorId.create(errorId));
    } catch (error) {
      this.logger.error('Failed to get error by ID', error as Error, { errorId });
      return null;
    }
  }

  // ============ Event Handling ============

  /**
   * Emits domain events for an error.
   */
  private emitErrorEvents(error: SystemError): void {
    // Create SystemErrorCreated event
    const createdEvent = createSystemErrorCreatedEvent({
      errorId: error.errorId,
      errorCode: error.errorCode,
      category: error.category,
      severity: error.severity,
      message: error.message,
      contextId: error.contextId,
    });

    this.addEvent(createdEvent);

    // If critical/fatal, also emit CriticalErrorDetected event
    if (error.severity === ErrorSeverity.Critical || error.severity === ErrorSeverity.Fatal) {
      const criticalEvent = createCriticalErrorDetectedEvent({
        errorId: error.errorId,
        errorCode: error.errorCode,
        category: error.category,
        severity: error.severity,
        message: error.message,
        contextId: error.contextId,
        stackTrace: error.stackTrace,
      });

      this.addEvent(criticalEvent);
    }
  }

  /**
   * Adds an event to the history.
   */
  private addEvent(event: SystemErrorCreatedEvent | CriticalErrorDetectedEvent): void {
    this.recentEvents.push(event);
    if (this.recentEvents.length > this.maxEventHistory) {
      this.recentEvents.shift();
    }
  }

  /**
   * Gets recent error events.
   */
  getRecentEvents(count = 10): Array<SystemErrorCreatedEvent | CriticalErrorDetectedEvent> {
    return this.recentEvents.slice(-count);
  }

  // ============ Critical Error Handling ============

  /**
   * Handles critical errors by notifying monitoring and creating audit events.
   */
  private async handleCriticalError(error: SystemError, originalError: Error): Promise<void> {
    try {
      // Notify monitoring service (do not await - fire and forget)
      if (this.monitoringService) {
        this.monitoringService.recordMetric({
          metricName: 'critical_error_count',
          metricValue: 1,
          unit: MetricUnit.COUNT_PER_SECOND,
          metadata: {
            errorId: error.errorId.value,
            errorCode: error.errorCode,
            category: error.category,
          } as Record<string, unknown>,
        }).catch((err) => {
          this.logger.warn('Failed to notify monitoring of critical error', { error: err as Error });
        });
      }

      // Create audit event for critical errors
      if (this.auditService) {
        this.auditService.createRecord({
          actorId: 'system',
          actorType: AuditActorType.SYSTEM,
          action: 'system.error_detected' as AuditAction,
          targetType: 'SystemError',
          targetId: error.errorId.value,
          result: AuditResultEnum.FAILURE,
          metadata: {
            errorCode: error.errorCode,
            category: error.category,
            severity: error.severity,
            message: error.message,
          } as Record<string, unknown>,
        }).catch((err) => {
          this.logger.warn('Failed to create audit event for critical error', { error: err as Error });
        });
      }
    } catch (handlerError) {
      // Never let error handling itself fail
      this.logger.error('Critical error handler failed', handlerError as Error);
    }
  }
}

/**
 * Creates an ErrorHandlingService instance.
 */
export function createErrorHandlingService(
  repository: IErrorRepository,
  monitoringService?: IMonitoringService,
  auditService?: AuditService
): ErrorHandlingService {
  return new ErrorHandlingService(repository, monitoringService, auditService);
}
