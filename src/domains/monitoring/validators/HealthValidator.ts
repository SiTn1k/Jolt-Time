/**
 * HealthValidator
 *
 * Validates health check data according to monitoring rules.
 */

import { HealthStatus, HEALTH_STATUS_CONSTRAINTS } from '../types/HealthStatus';

/**
 * Result of health check validation.
 */
export interface HealthValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validator for health checks.
 */
export class HealthValidator {
  /**
   * Validates a service name.
   * @param serviceName The service name to validate
   * @returns Validation result with any error message
   */
  public static validateServiceName(serviceName: string | null | undefined): HealthValidationResult {
    if (serviceName === null || serviceName === undefined) {
      return {
        isValid: false,
        error: 'Service name is required',
      };
    }

    if (serviceName.trim().length === 0) {
      return {
        isValid: false,
        error: 'Service name cannot be empty',
      };
    }

    if (serviceName.length > HEALTH_STATUS_CONSTRAINTS.MAX_DETAILS_LENGTH) {
      return {
        isValid: false,
        error: `Service name must be at most ${HEALTH_STATUS_CONSTRAINTS.MAX_DETAILS_LENGTH} characters`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a health status.
   * @param status The health status to validate
   * @returns Validation result with any error message
   */
  public static validateStatus(status: string | null | undefined): HealthValidationResult {
    if (status === null || status === undefined) {
      return {
        isValid: false,
        error: 'Health status is required',
      };
    }

    const validStatuses = Object.values(HealthStatus);
    if (!validStatuses.includes(status as HealthStatus)) {
      return {
        isValid: false,
        error: `Invalid health status. Must be one of: ${validStatuses.join(', ')}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a response time.
   * @param responseTime The response time to validate
   * @returns Validation result with any error message
   */
  public static validateResponseTime(responseTime: number | null | undefined): HealthValidationResult {
    if (responseTime === null || responseTime === undefined) {
      return {
        isValid: false,
        error: 'Response time is required',
      };
    }

    if (!Number.isFinite(responseTime)) {
      return {
        isValid: false,
        error: 'Response time must be a finite number',
      };
    }

    if (responseTime < 0) {
      return {
        isValid: false,
        error: 'Response time cannot be negative',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates health check details.
   * @param details The details to validate
   * @returns Validation result with any error message
   */
  public static validateDetails(details: string | null | undefined): HealthValidationResult {
    if (details === null || details === undefined) {
      return { isValid: true }; // Optional field
    }

    if (details.length > HEALTH_STATUS_CONSTRAINTS.MAX_DETAILS_LENGTH) {
      return {
        isValid: false,
        error: `Details must be at most ${HEALTH_STATUS_CONSTRAINTS.MAX_DETAILS_LENGTH} characters`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates all health check fields together.
   * @param params Health check fields to validate
   * @returns Validation result with any error message
   */
  public static validateHealthCheck(params: {
    serviceName?: string;
    status?: string;
    responseTime?: number;
    details?: string;
  }): HealthValidationResult {
    const serviceNameResult = this.validateServiceName(params.serviceName);
    if (!serviceNameResult.isValid) return serviceNameResult;

    const statusResult = this.validateStatus(params.status);
    if (!statusResult.isValid) return statusResult;

    const responseTimeResult = this.validateResponseTime(params.responseTime);
    if (!responseTimeResult.isValid) return responseTimeResult;

    const detailsResult = this.validateDetails(params.details);
    if (!detailsResult.isValid) return detailsResult;

    return { isValid: true };
  }

  /**
   * Validates a health check and throws if invalid.
   * @param params Health check fields to validate
   * @throws Error with validation details if invalid
   */
  public static validateHealthCheckOrThrow(params: {
    serviceName?: string;
    status?: string;
    responseTime?: number;
    details?: string;
  }): void {
    const result = this.validateHealthCheck(params);
    if (!result.isValid) {
      throw new Error(`Health check validation failed: ${result.error}`);
    }
  }
}
