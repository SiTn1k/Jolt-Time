/**
 * Response Validator
 *
 * Validation specific to integration responses.
 */

import type { RequestStatus } from '../types/RequestStatus';

/**
 * Validation result for response validation.
 */
export interface ResponseValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validator for integration responses.
 */
export class ResponseValidator {
  /**
   * Validates a response payload.
   * @param payload The payload to validate
   * @param maxSizeKB Maximum payload size in KB
   * @returns Validation result
   */
  public static validatePayload(payload: Record<string, unknown>, maxSizeKB: number = 5000): ResponseValidationResult {
    const errors: string[] = [];

    if (!payload || typeof payload !== 'object') {
      errors.push('Payload must be an object');
      return { isValid: false, errors };
    }

    // Size check (approximate)
    const payloadString = JSON.stringify(payload);
    const sizeKB = new Blob([payloadString]).size / 1024;

    if (sizeKB > maxSizeKB) {
      errors.push(`Payload size (${sizeKB.toFixed(2)}KB) exceeds maximum allowed (${maxSizeKB}KB)`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates a response status code.
   * @param statusCode The status code to validate
   * @returns Validation result
   */
  public static validateStatusCode(statusCode: number): ResponseValidationResult {
    const errors: string[] = [];

    if (!Number.isInteger(statusCode)) {
      errors.push('Status code must be an integer');
    } else if (statusCode < 100 || statusCode > 599) {
      errors.push('Status code must be a valid HTTP status code (100-599)');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates a response status.
   * @param status The status to validate
   * @returns Validation result
   */
  public static validateStatus(status: RequestStatus): ResponseValidationResult {
    const errors: string[] = [];

    const validStatuses: RequestStatus[] = ['pending', 'processing', 'completed', 'failed', 'timeout', 'cancelled'];
    if (!validStatuses.includes(status)) {
      errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates response metadata fields.
   * @param metadata The metadata to validate
   * @returns Validation result
   */
  public static validateMetadata(metadata: Record<string, unknown>): ResponseValidationResult {
    const errors: string[] = [];

    if (!metadata || typeof metadata !== 'object') {
      errors.push('Metadata must be an object');
      return { isValid: false, errors };
    }

    // Processing time validation
    if (metadata.processingTimeMs !== undefined) {
      const processingTimeMs = metadata.processingTimeMs as number;
      if (typeof processingTimeMs !== 'number' || processingTimeMs < 0) {
        errors.push('Processing time must be a non-negative number');
      }
    }

    // Response size validation
    if (metadata.responseSize !== undefined) {
      const responseSize = metadata.responseSize as number;
      if (typeof responseSize !== 'number' || responseSize < 0) {
        errors.push('Response size must be a non-negative number');
      }
    }

    // Rate limit remaining validation
    if (metadata.rateLimitRemaining !== undefined) {
      const rateLimitRemaining = metadata.rateLimitRemaining as number;
      if (typeof rateLimitRemaining !== 'number' || rateLimitRemaining < 0) {
        errors.push('Rate limit remaining must be a non-negative number');
      }
    }

    // Retry count validation
    if (metadata.retryCount !== undefined) {
      const retryCount = metadata.retryCount as number;
      if (typeof retryCount !== 'number' || retryCount < 0 || !Number.isInteger(retryCount)) {
        errors.push('Retry count must be a non-negative integer');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates that response code and status are consistent.
   * @param statusCode The HTTP status code
   * @param status The response status
   * @returns Validation result
   */
  public static validateConsistency(statusCode: number, status: RequestStatus): ResponseValidationResult {
    const errors: string[] = [];

    // Completed status should have 2xx codes
    if (status === 'completed' && (statusCode < 200 || statusCode >= 300)) {
      errors.push('Completed status should have 2xx response code');
    }

    // Failed status should have 4xx or 5xx codes
    if (status === 'failed' && statusCode < 400) {
      errors.push('Failed status should have 4xx or 5xx response code');
    }

    // Timeout typically has no response code
    if (status === 'timeout' && statusCode >= 200 && statusCode < 300) {
      errors.push('Timeout status typically has no successful response code');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
