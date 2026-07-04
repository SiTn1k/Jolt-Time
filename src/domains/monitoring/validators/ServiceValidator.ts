/**
 * ServiceValidator
 *
 * Validates service status data according to monitoring rules.
 */

import { ServiceStatusType, SERVICE_STATUS_CONSTRAINTS } from '../types/ServiceStatusType';

/**
 * Result of service validation.
 */
export interface ServiceValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validator for service status.
 */
export class ServiceValidator {
  /**
   * Validates a service name.
   * @param serviceName The service name to validate
   * @returns Validation result with any error message
   */
  public static validateServiceName(serviceName: string | null | undefined): ServiceValidationResult {
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

    if (serviceName.length > SERVICE_STATUS_CONSTRAINTS.MAX_SERVICE_NAME_LENGTH) {
      return {
        isValid: false,
        error: `Service name must be at most ${SERVICE_STATUS_CONSTRAINTS.MAX_SERVICE_NAME_LENGTH} characters`,
      };
    }

    // Service name should be alphanumeric with underscores and hyphens
    const serviceNamePattern = /^[a-zA-Z][a-zA-Z0-9_-]*$/;
    if (!serviceNamePattern.test(serviceName)) {
      return {
        isValid: false,
        error: 'Service name must start with a letter and contain only letters, numbers, underscores, and hyphens',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a service status type.
   * @param status The service status to validate
   * @returns Validation result with any error message
   */
  public static validateStatus(status: string | null | undefined): ServiceValidationResult {
    if (status === null || status === undefined) {
      return {
        isValid: false,
        error: 'Service status is required',
      };
    }

    const validStatuses = Object.values(ServiceStatusType);
    if (!validStatuses.includes(status as ServiceStatusType)) {
      return {
        isValid: false,
        error: `Invalid service status. Must be one of: ${validStatuses.join(', ')}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a service version.
   * @param version The service version to validate
   * @returns Validation result with any error message
   */
  public static validateVersion(version: string | null | undefined): ServiceValidationResult {
    if (version === null || version === undefined) {
      return { isValid: true }; // Optional field
    }

    if (version.length > SERVICE_STATUS_CONSTRAINTS.MAX_VERSION_LENGTH) {
      return {
        isValid: false,
        error: `Service version must be at most ${SERVICE_STATUS_CONSTRAINTS.MAX_VERSION_LENGTH} characters`,
      };
    }

    // Version should follow semver-like pattern
    const versionPattern = /^[0-9]+\.[0-9]+(\.[0-9]+)?(-[a-zA-Z0-9]+)?$/;
    if (!versionPattern.test(version)) {
      return {
        isValid: false,
        error: 'Service version should follow semantic versioning (e.g., 1.0.0, 1.0.0-beta)',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates all service status fields together.
   * @param params Service status fields to validate
   * @returns Validation result with any error message
   */
  public static validateServiceStatus(params: {
    serviceName?: string;
    status?: string;
    version?: string;
  }): ServiceValidationResult {
    const serviceNameResult = this.validateServiceName(params.serviceName);
    if (!serviceNameResult.isValid) return serviceNameResult;

    const statusResult = this.validateStatus(params.status);
    if (!statusResult.isValid) return statusResult;

    const versionResult = this.validateVersion(params.version);
    if (!versionResult.isValid) return versionResult;

    return { isValid: true };
  }

  /**
   * Validates a service status and throws if invalid.
   * @param params Service status fields to validate
   * @throws Error with validation details if invalid
   */
  public static validateServiceStatusOrThrow(params: {
    serviceName?: string;
    status?: string;
    version?: string;
  }): void {
    const result = this.validateServiceStatus(params);
    if (!result.isValid) {
      throw new Error(`Service status validation failed: ${result.error}`);
    }
  }

  /**
   * Validates heartbeat interval.
   * @param intervalSeconds The interval in seconds
   * @returns Validation result with any error message
   */
  public static validateHeartbeatInterval(intervalSeconds: number | null | undefined): ServiceValidationResult {
    if (intervalSeconds === null || intervalSeconds === undefined) {
      return {
        isValid: false,
        error: 'Heartbeat interval is required',
      };
    }

    if (!Number.isFinite(intervalSeconds) || intervalSeconds <= 0) {
      return {
        isValid: false,
        error: 'Heartbeat interval must be a positive number',
      };
    }

    return { isValid: true };
  }
}
