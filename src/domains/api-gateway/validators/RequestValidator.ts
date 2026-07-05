/**
 * RequestValidator
 *
 * Validator for API request operations.
 * Validates request paths, headers, and configuration.
 */

import type { ApiRequest, HttpHeaders, QueryParams, RequestBody } from '../entities/ApiRequest';
import type { HttpMethod } from '../types/HttpMethod';
import type { RequestMetadata } from '../types/GatewayMetadata';

/**
 * Validation result type.
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * RequestValidator class.
 * Provides validation methods for API request operations.
 */
export class RequestValidator {
  /**
   * Validates request path.
   */
  public validatePath(path: string): ValidationResult {
    const errors: string[] = [];

    if (!path || path.trim().length === 0) {
      errors.push('Request path cannot be empty');
    }

    if (!path.startsWith('/')) {
      errors.push('Request path must start with /');
    }

    if (path.length > 2048) {
      errors.push('Request path exceeds maximum length of 2048 characters');
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
   * Validates HTTP headers.
   */
  public validateHeaders(headers: HttpHeaders): ValidationResult {
    const errors: string[] = [];

    if (headers === undefined || headers === null) {
      return { isValid: true, errors: [] };
    }

    if (typeof headers !== 'object') {
      errors.push('Headers must be an object');
      return { isValid: false, errors };
    }

    for (const [key, value] of Object.entries(headers)) {
      if (typeof key !== 'string') {
        errors.push('Header keys must be strings');
      }

      if (value !== undefined && value !== null) {
        if (typeof value !== 'string' && !Array.isArray(value)) {
          errors.push(`Header "${key}" must be a string or array`);
        }
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates query parameters.
   */
  public validateQuery(query: QueryParams): ValidationResult {
    const errors: string[] = [];

    if (query === undefined || query === null) {
      return { isValid: true, errors: [] };
    }

    if (typeof query !== 'object') {
      errors.push('Query must be an object');
      return { isValid: false, errors };
    }

    for (const [key, value] of Object.entries(query)) {
      if (typeof key !== 'string') {
        errors.push('Query keys must be strings');
      }

      if (value !== undefined && value !== null) {
        if (typeof value !== 'string' && !Array.isArray(value)) {
          errors.push(`Query parameter "${key}" must be a string or array`);
        }
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates request body size.
   */
  public validateBody(body: RequestBody): ValidationResult {
    const errors: string[] = [];

    if (body === undefined || body === null) {
      return { isValid: true, errors: [] };
    }

    // Check body size by JSON serialization
    try {
      const jsonString = JSON.stringify(body);
      if (jsonString.length > 10 * 1024 * 1024) {
        // 10MB limit
        errors.push('Request body exceeds maximum size of 10MB');
      }
    } catch {
      errors.push('Request body must be serializable to JSON');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates request creation parameters.
   */
  public validateCreateRequest(params: {
    routeId: string;
    method: string;
    path: string;
    headers?: HttpHeaders;
    query?: QueryParams;
    body?: RequestBody;
    metadata?: RequestMetadata;
  }): ValidationResult {
    const errors: string[] = [];

    if (!params.routeId) {
      errors.push('Route ID is required');
    }

    const methodValidation = this.validateMethod(params.method);
    errors.push(...methodValidation.errors);

    const pathValidation = this.validatePath(params.path);
    errors.push(...pathValidation.errors);

    if (params.headers) {
      const headersValidation = this.validateHeaders(params.headers);
      errors.push(...headersValidation.errors);
    }

    if (params.query) {
      const queryValidation = this.validateQuery(params.query);
      errors.push(...queryValidation.errors);
    }

    if (params.body !== undefined) {
      const bodyValidation = this.validateBody(params.body);
      errors.push(...bodyValidation.errors);
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates an API request entity.
   */
  public validateRequest(request: ApiRequest): ValidationResult {
    const errors: string[] = [];

    if (!request.requestId) {
      errors.push('Request ID is required');
    }

    if (!request.routeId) {
      errors.push('Route ID is required');
    }

    const methodValidation = this.validateMethod(request.method);
    errors.push(...methodValidation.errors);

    const pathValidation = this.validatePath(request.path);
    errors.push(...pathValidation.errors);

    const headersValidation = this.validateHeaders(request.headers);
    errors.push(...headersValidation.errors);

    const queryValidation = this.validateQuery(request.query);
    errors.push(...queryValidation.errors);

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates request metadata.
   */
  public validateMetadata(metadata: RequestMetadata): ValidationResult {
    const errors: string[] = [];

    if (metadata.source !== undefined) {
      const validSources = ['web', 'mobile', 'bot', 'api'];
      if (!validSources.includes(metadata.source)) {
        errors.push(`Invalid source. Valid sources are: ${validSources.join(', ')}`);
      }
    }

    if (metadata.sessionId !== undefined && typeof metadata.sessionId !== 'string') {
      errors.push('Session ID must be a string');
    }

    return { isValid: errors.length === 0, errors };
  }
}
