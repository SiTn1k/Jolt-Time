/**
 * Failure Handler
 *
 * Handles failures from external service integrations.
 * Ensures the game continues even when external services fail.
 *
 * IMPORTANT: Failure Handler is a RESILIENCE pattern. It ONLY:
 * - Handles integration failures
 * - Logs errors appropriately
 * - Publishes failure events
 * - Returns structured error responses
 *
 * Failure Handler MUST NEVER:
 * - Modify gameplay
 * - Grant rewards
 * - Modify balances
 * - Modify inventory
 * - Execute business logic
 */

import { createLogger } from '../../../core/logging/logger.service';
import type { ILogger } from '../../../shared/types/interfaces';
import type { IEventPublisher } from '../../../core/events/interfaces/IEventPublisher';

/**
 * Failure categories.
 */
export type FailureCategory = 
  | 'provider_unavailable'
  | 'timeout'
  | 'rate_limited'
  | 'authentication_failed'
  | 'invalid_request'
  | 'server_error'
  | 'network_error'
  | 'unknown';

/**
 * Failure severity levels.
 */
export type FailureSeverity = 'low' | 'medium' | 'high' | 'critical';

/**
 * Structured failure response.
 */
export interface FailureResponse {
  /** Whether the operation failed */
  success: false;
  /** Error code */
  code: string;
  /** Human-readable error message */
  message: string;
  /** Failure category */
  category: FailureCategory;
  /** Severity level */
  severity: FailureSeverity;
  /** Whether the operation can be retried */
  retryable: boolean;
  /** Original error message (if available) */
  originalError?: string;
  /** Timestamp of failure */
  timestamp: Date;
  /** Provider ID if applicable */
  providerId?: string;
  /** Request ID if applicable */
  requestId?: string;
}

/**
 * Integration failure event data.
 */
export interface IntegrationFailedEventData {
  /** Error code */
  code: string;
  /** Error message */
  message: string;
  /** Failure category */
  category: FailureCategory;
  /** Severity level */
  severity: FailureSeverity;
  /** Provider ID */
  providerId?: string;
  /** Provider name */
  providerName?: string;
  /** Request ID */
  requestId?: string;
  /** Whether it was retryable */
  retryable: boolean;
  /** Timestamp */
  occurredAt: Date;
  /** Original error */
  originalError?: string;
  /** Additional context */
  context?: Record<string, unknown>;
}

/**
 * Integration failure event.
 */
export interface IntegrationFailedEvent {
  eventType: 'IntegrationFailed';
  version: 1;
  data: IntegrationFailedEventData;
}

/**
 * Failure handler configuration.
 */
export interface FailureHandlerConfig {
  /** Whether to publish failure events */
  publishEvents?: boolean;
  /** Whether to log failures */
  logFailures?: boolean;
  /** Minimum severity to publish events */
  minSeverityForEvent?: FailureSeverity;
  /** Maximum retries before giving up */
  maxRetriesBeforeCritical?: number;
}

/**
 * Default failure handler configuration.
 */
const DEFAULT_FAILURE_HANDLER_CONFIG: Required<FailureHandlerConfig> = {
  publishEvents: true,
  logFailures: true,
  minSeverityForEvent: 'medium',
  maxRetriesBeforeCritical: 3,
};

/**
 * Severity ordering for comparison.
 */
const SEVERITY_ORDER: Record<FailureSeverity, number> = {
  low: 0,
  medium: 1,
  high: 2,
  critical: 3,
};

/**
 * Failure Handler.
 * Handles integration failures and ensures graceful degradation.
 */
export class FailureHandler {
  private readonly logger: ILogger;
  private readonly eventPublisher: IEventPublisher | null;
  private readonly config: Required<FailureHandlerConfig>;
  private readonly failureCounts: Map<string, number> = new Map();

  /**
   * Creates a new Failure Handler.
   */
  constructor(eventPublisher?: IEventPublisher, config?: FailureHandlerConfig) {
    this.logger = createLogger('FailureHandler');
    this.eventPublisher = eventPublisher || null;
    this.config = { ...DEFAULT_FAILURE_HANDLER_CONFIG, ...config };
  }

  /**
   * Handles a failure from an integration operation.
   */
  handle(params: {
    /** Error code */
    code: string;
    /** Error message */
    message: string;
    /** Original error */
    error?: Error;
    /** Provider ID */
    providerId?: string;
    /** Provider name */
    providerName?: string;
    /** Request ID */
    requestId?: string;
    /** HTTP status code (if applicable) */
    statusCode?: number;
    /** Additional context */
    context?: Record<string, unknown>;
  }): FailureResponse {
    const { category, severity, retryable } = this.analyzeFailure(params.error, params.statusCode);
    
    // Build response
    const response: FailureResponse = {
      success: false,
      code: params.code,
      message: params.message,
      category,
      severity,
      retryable,
      originalError: params.error?.message,
      timestamp: new Date(),
      providerId: params.providerId,
      requestId: params.requestId,
    };

    // Log failure
    if (this.config.logFailures) {
      this.logFailure(response, params.context);
    }

    // Publish event if severity warrants
    if (this.shouldPublishEvent(severity)) {
      this.publishFailureEvent(response, params);
    }

    // Track failure count for provider
    if (params.providerId) {
      this.trackFailure(params.providerId);
    }

    return response;
  }

  /**
   * Analyzes failure to determine category, severity, and retryability.
   */
  private analyzeFailure(
    error?: Error,
    statusCode?: number
  ): { category: FailureCategory; severity: FailureSeverity; retryable: boolean } {
    if (!error && !statusCode) {
      return {
        category: 'unknown',
        severity: 'medium',
        retryable: true,
      };
    }

    // Analyze by error type or status code
    if (statusCode) {
      return this.analyzeByStatusCode(statusCode);
    }

    if (error) {
      return this.analyzeByError(error);
    }

    return {
      category: 'unknown',
      severity: 'medium',
      retryable: true,
    };
  }

  /**
   * Analyzes failure by HTTP status code.
   */
  private analyzeByStatusCode(statusCode: number): { category: FailureCategory; severity: FailureSeverity; retryable: boolean } {
    switch (statusCode) {
      case 408: // Request Timeout
        return { category: 'timeout', severity: 'medium', retryable: true };
      
      case 429: // Too Many Requests
        return { category: 'rate_limited', severity: 'high', retryable: true };
      
      case 401: // Unauthorized
      case 403: // Forbidden
        return { category: 'authentication_failed', severity: 'high', retryable: false };
      
      case 400: // Bad Request
        return { category: 'invalid_request', severity: 'medium', retryable: false };
      
      case 404: // Not Found
        return { category: 'invalid_request', severity: 'low', retryable: false };
      
      case 500: // Internal Server Error
        return { category: 'server_error', severity: 'high', retryable: true };
      
      case 502: // Bad Gateway
      case 503: // Service Unavailable
      case 504: // Gateway Timeout
        return { category: 'provider_unavailable', severity: 'critical', retryable: true };
      
      default:
        if (statusCode >= 500) {
          return { category: 'server_error', severity: 'high', retryable: true };
        }
        if (statusCode >= 400) {
          return { category: 'invalid_request', severity: 'medium', retryable: false };
        }
        return { category: 'unknown', severity: 'low', retryable: false };
    }
  }

  /**
   * Analyzes failure by error type.
   */
  private analyzeByError(error: Error): { category: FailureCategory; severity: FailureSeverity; retryable: boolean } {
    const message = error.message.toLowerCase();

    // Timeout errors
    if (error.name === 'TimeoutError' || error.name === 'AbortError' || message.includes('timeout')) {
      return { category: 'timeout', severity: 'medium', retryable: true };
    }

    // Network errors
    if (message.includes('network') || message.includes('econnrefused') || message.includes('enotfound') || message.includes('socket')) {
      return { category: 'network_error', severity: 'high', retryable: true };
    }

    // Rate limit errors
    if (message.includes('rate limit') || message.includes('429') || message.includes('too many')) {
      return { category: 'rate_limited', severity: 'high', retryable: true };
    }

    // Authentication errors
    if (message.includes('unauthorized') || message.includes('auth') || message.includes('token')) {
      return { category: 'authentication_failed', severity: 'high', retryable: false };
    }

    // Invalid request
    if (message.includes('invalid') || message.includes('bad request') || message.includes('400')) {
      return { category: 'invalid_request', severity: 'medium', retryable: false };
    }

    // Provider unavailable
    if (message.includes('unavailable') || message.includes('500') || message.includes('503') || message.includes('502')) {
      return { category: 'provider_unavailable', severity: 'critical', retryable: true };
    }

    return { category: 'unknown', severity: 'medium', retryable: true };
  }

  /**
   * Determines if an event should be published based on severity.
   */
  private shouldPublishEvent(severity: FailureSeverity): boolean {
    if (!this.config.publishEvents) {
      return false;
    }

    const minSeverityLevel = SEVERITY_ORDER[this.config.minSeverityForEvent];
    const currentSeverityLevel = SEVERITY_ORDER[severity];

    return currentSeverityLevel >= minSeverityLevel;
  }

  /**
   * Logs a failure.
   */
  private logFailure(response: FailureResponse, context?: Record<string, unknown>): void {
    const logContext = {
      code: response.code,
      category: response.category,
      severity: response.severity,
      retryable: response.retryable,
      providerId: response.providerId,
      requestId: response.requestId,
      ...context,
    };

    switch (response.severity) {
      case 'critical':
        this.logger.error(`[CRITICAL] Integration failure: ${response.message}`, undefined, logContext);
        break;
      case 'high':
        this.logger.error(`Integration failure: ${response.message}`, undefined, logContext);
        break;
      case 'medium':
        this.logger.warn(`Integration failure: ${response.message}`, logContext);
        break;
      case 'low':
        this.logger.info(`Integration failure: ${response.message}`, logContext);
        break;
    }
  }

  /**
   * Publishes a failure event.
   */
  private async publishFailureEvent(
    response: FailureResponse,
    params: {
      code: string;
      message: string;
      error?: Error;
      providerId?: string;
      providerName?: string;
      requestId?: string;
      context?: Record<string, unknown>;
    }
  ): Promise<void> {
    if (!this.eventPublisher) {
      return;
    }

    try {
      const event: IntegrationFailedEvent = {
        eventType: 'IntegrationFailed',
        version: 1,
        data: {
          code: params.code,
          message: params.message,
          category: response.category,
          severity: response.severity,
          providerId: params.providerId,
          providerName: params.providerName,
          requestId: params.requestId,
          retryable: response.retryable,
          occurredAt: response.timestamp,
          originalError: params.error?.message,
          context: params.context,
        },
      };

      await this.eventPublisher.publish(event);
    } catch (err) {
      this.logger.warn('Failed to publish IntegrationFailed event', { error: err });
    }
  }

  /**
   * Tracks failure count for a provider.
   */
  private trackFailure(providerId: string): void {
    const count = (this.failureCounts.get(providerId) || 0) + 1;
    this.failureCounts.set(providerId, count);

    // Reset if count exceeds threshold
    if (count > this.config.maxRetriesBeforeCritical * 10) {
      this.failureCounts.set(providerId, 0);
    }
  }

  /**
   * Gets failure count for a provider.
   */
  getFailureCount(providerId: string): number {
    return this.failureCounts.get(providerId) || 0;
  }

  /**
   * Resets failure count for a provider.
   */
  resetFailureCount(providerId: string): void {
    this.failureCounts.delete(providerId);
  }

  /**
   * Creates a structured success response wrapper.
   */
  createSuccessResponse<T>(data: T): { success: true; data: T } {
    return { success: true, data };
  }

  /**
   * Creates a failure response.
   */
  createFailureResponse(params: {
    code: string;
    message: string;
    providerId?: string;
    requestId?: string;
    error?: Error;
    statusCode?: number;
    context?: Record<string, unknown>;
  }): FailureResponse {
    return this.handle(params);
  }
}

/**
 * Global failure handler instance.
 */
let globalHandler: FailureHandler | null = null;

/**
 * Gets the global failure handler.
 */
export function getFailureHandler(): FailureHandler {
  if (!globalHandler) {
    globalHandler = new FailureHandler();
  }
  return globalHandler;
}

/**
 * Creates a failure handler.
 */
export function createFailureHandler(
  eventPublisher?: IEventPublisher,
  config?: FailureHandlerConfig
): FailureHandler {
  return new FailureHandler(eventPublisher, config);
}
