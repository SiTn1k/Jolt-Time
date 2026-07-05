/**
 * ResponseValidator
 *
 * Validator for API response operations.
 * Validates response status codes, payloads, and timing.
 */

import type { ApiResponse, ResponsePayload, StatusCode } from '../entities/ApiResponse';
import type { ResponseMetadata } from '../types/GatewayMetadata';

/**
 * Validation result type.
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * ResponseValidator class.
 * Provides validation methods for API response operations.
 */
export class ResponseValidator {
  /**
   * Validates HTTP status code.
   */
  public validateStatusCode(statusCode: number): ValidationResult {
    const errors: string[] = [];

    if (!Number.isInteger(statusCode)) {
      errors.push('Status code must be an integer');
    }

    if (statusCode < 100 || statusCode > 599) {
      errors.push('Status code must be between 100 and 599');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates response time.
   */
  public validateResponseTime(responseTime: number): ValidationResult {
    const errors: string[] = [];

    if (typeof responseTime !== 'number') {
      errors.push('Response time must be a number');
    }

    if (responseTime < 0) {
      errors.push('Response time cannot be negative');
    }

    // 5 minute max
    if (responseTime > 300000) {
      errors.push('Response time exceeds maximum of 300000ms (5 minutes)');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates response payload size.
   */
  public validatePayload(payload: ResponsePayload): ValidationResult {
    const errors: string[] = [];

    if (payload === undefined || payload === null) {
      return { isValid: true, errors: [] };
    }

    // Check payload size by JSON serialization
    try {
      const jsonString = JSON.stringify(payload);
      if (jsonString.length > 10 * 1024 * 1024) {
        // 10MB limit
        errors.push('Response payload exceeds maximum size of 10MB');
      }
    } catch {
      errors.push('Response payload must be serializable to JSON');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates response creation parameters.
   */
  public validateCreateResponse(params: {
    requestId: string;
    statusCode: number;
    responseTime: number;
    payload?: ResponsePayload;
    metadata?: ResponseMetadata;
  }): ValidationResult {
    const errors: string[] = [];

    if (!params.requestId) {
      errors.push('Request ID is required');
    }

    const statusCodeValidation = this.validateStatusCode(params.statusCode);
    errors.push(...statusCodeValidation.errors);

    const responseTimeValidation = this.validateResponseTime(params.responseTime);
    errors.push(...responseTimeValidation.errors);

    if (params.payload !== undefined) {
      const payloadValidation = this.validatePayload(params.payload);
      errors.push(...payloadValidation.errors);
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates an API response entity.
   */
  public validateResponse(response: ApiResponse): ValidationResult {
    const errors: string[] = [];

    if (!response.responseId) {
      errors.push('Response ID is required');
    }

    if (!response.requestId) {
      errors.push('Request ID is required');
    }

    const statusCodeValidation = this.validateStatusCode(response.statusCode);
    errors.push(...statusCodeValidation.errors);

    const responseTimeValidation = this.validateResponseTime(response.responseTime);
    errors.push(...responseTimeValidation.errors);

    const payloadValidation = this.validatePayload(response.payload);
    errors.push(...payloadValidation.errors);

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates response metadata.
   */
  public validateMetadata(metadata: ResponseMetadata): ValidationResult {
    const errors: string[] = [];

    if (metadata.contentLength !== undefined) {
      if (typeof metadata.contentLength !== 'number' || metadata.contentLength < 0) {
        errors.push('Content length must be a non-negative number');
      }
    }

    if (metadata.contentType !== undefined && typeof metadata.contentType !== 'string') {
      errors.push('Content type must be a string');
    }

    if (metadata.cacheControl !== undefined && typeof metadata.cacheControl !== 'string') {
      errors.push('Cache-Control must be a string');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Checks if a status code is a success (2xx).
   */
  public isSuccessStatus(statusCode: number): boolean {
    return statusCode >= 200 && statusCode < 300;
  }

  /**
   * Checks if a status code is a redirect (3xx).
   */
  public isRedirectStatus(statusCode: number): boolean {
    return statusCode >= 300 && statusCode < 400;
  }

  /**
   * Checks if a status code is a client error (4xx).
   */
  public isClientErrorStatus(statusCode: number): boolean {
    return statusCode >= 400 && statusCode < 500;
  }

  /**
   * Checks if a status code is a server error (5xx).
   */
  public isServerErrorStatus(statusCode: number): boolean {
    return statusCode >= 500 && statusCode < 600;
  }
}
