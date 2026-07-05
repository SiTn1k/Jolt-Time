/**
 * RouteValidator
 *
 * Validator for API route operations.
 * Validates route paths, methods, and configuration.
 */

import type { ApiRoute } from '../entities/ApiRoute';
import type { HttpMethod } from '../types/HttpMethod';
import type { ApiVersion } from '../types/ApiVersion';
import type { RouteStatus } from '../types/RouteStatus';
import type { GatewayMetadata } from '../types/GatewayMetadata';

/**
 * Validation result type.
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * RouteValidator class.
 * Provides validation methods for API route operations.
 */
export class RouteValidator {
  /**
   * Validates a route path.
   */
  public validatePath(path: string): ValidationResult {
    const errors: string[] = [];

    if (!path || path.trim().length === 0) {
      errors.push('Route path cannot be empty');
    }

    if (!path.startsWith('/')) {
      errors.push('Route path must start with /');
    }

    if (path.length > 512) {
      errors.push('Route path exceeds maximum length of 512 characters');
    }

    // Check for invalid characters
    const invalidChars = /[<>{}|^`\\]/;
    if (invalidChars.test(path)) {
      errors.push('Route path contains invalid characters');
    }

    // Check for double slashes
    if (path.includes('//')) {
      errors.push('Route path cannot contain double slashes');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates HTTP method.
   */
  public validateMethod(method: string): ValidationResult {
    const errors: string[] = [];
    const validMethods: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];

    if (!method) {
      errors.push('HTTP method is required');
    }

    if (!validMethods.includes(method as HttpMethod)) {
      errors.push(`Invalid HTTP method. Valid methods are: ${validMethods.join(', ')}`);
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates API version.
   */
  public validateVersion(version: string): ValidationResult {
    const errors: string[] = [];
    const validVersions: ApiVersion[] = ['v1', 'v2', 'v3'];

    if (!version) {
      errors.push('API version is required');
    }

    if (!validVersions.includes(version as ApiVersion)) {
      errors.push(`Invalid API version. Valid versions are: ${validVersions.join(', ')}`);
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates route status.
   */
  public validateStatus(status: string): ValidationResult {
    const errors: string[] = [];
    const validStatuses: RouteStatus[] = ['active', 'disabled', 'deprecated', 'maintenance'];

    if (!status) {
      errors.push('Route status is required');
    }

    if (!validStatuses.includes(status as RouteStatus)) {
      errors.push(`Invalid route status. Valid statuses are: ${validStatuses.join(', ')}`);
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates route creation parameters.
   */
  public validateCreateRoute(params: {
    path: string;
    method: string;
    version?: string;
    enabled?: boolean;
    description?: string;
    metadata?: GatewayMetadata;
  }): ValidationResult {
    const errors: string[] = [];

    // Validate path
    const pathValidation = this.validatePath(params.path);
    errors.push(...pathValidation.errors);

    // Validate method
    const methodValidation = this.validateMethod(params.method);
    errors.push(...methodValidation.errors);

    // Validate version if provided
    if (params.version) {
      const versionValidation = this.validateVersion(params.version);
      errors.push(...versionValidation.errors);
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates route update parameters.
   */
  public validateUpdateRoute(params: {
    path?: string;
    method?: string;
    version?: string;
    enabled?: boolean;
    description?: string;
    metadata?: GatewayMetadata;
  }): ValidationResult {
    const errors: string[] = [];

    // Validate path if provided
    if (params.path !== undefined) {
      const pathValidation = this.validatePath(params.path);
      errors.push(...pathValidation.errors);
    }

    // Validate method if provided
    if (params.method !== undefined) {
      const methodValidation = this.validateMethod(params.method);
      errors.push(...methodValidation.errors);
    }

    // Validate version if provided
    if (params.version !== undefined) {
      const versionValidation = this.validateVersion(params.version);
      errors.push(...versionValidation.errors);
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates an API route entity.
   */
  public validateRoute(route: ApiRoute): ValidationResult {
    const errors: string[] = [];

    if (!route.path) {
      errors.push('Route path is required');
    }

    const pathValidation = this.validatePath(route.path);
    errors.push(...pathValidation.errors);

    const methodValidation = this.validateMethod(route.method);
    errors.push(...methodValidation.errors);

    const versionValidation = this.validateVersion(route.version);
    errors.push(...versionValidation.errors);

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates route metadata.
   */
  public validateMetadata(metadata: GatewayMetadata): ValidationResult {
    const errors: string[] = [];

    if (metadata.tags !== undefined && !Array.isArray(metadata.tags)) {
      errors.push('Tags must be an array');
    }

    if (metadata.rateLimit !== undefined && metadata.rateLimit < 0) {
      errors.push('Rate limit cannot be negative');
    }

    if (metadata.timeout !== undefined && metadata.timeout < 0) {
      errors.push('Timeout cannot be negative');
    }

    return { isValid: errors.length === 0, errors };
  }
}
