/**
 * Request Validator
 *
 * Validation specific to integration requests.
 */

/**
 * Validation result for request validation.
 */
export interface RequestValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validator for integration requests.
 */
export class RequestValidator {
  /**
   * Validates a request payload.
   * @param payload The payload to validate
   * @param maxSizeKB Maximum payload size in KB
   * @returns Validation result
   */
  public static validatePayload(payload: Record<string, unknown>, maxSizeKB: number = 1000): RequestValidationResult {
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
   * Validates a request type string.
   * @param requestType The request type to validate
   * @returns Validation result
   */
  public static validateRequestType(requestType: string): RequestValidationResult {
    const errors: string[] = [];

    if (!requestType || requestType.trim().length === 0) {
      errors.push('Request type is required');
    }

    if (requestType.length > 100) {
      errors.push('Request type must be at most 100 characters');
    }

    // Check for valid characters
    const validTypeRegex = /^[a-zA-Z0-9_-]+$/;
    if (requestType && !validTypeRegex.test(requestType)) {
      errors.push('Request type can only contain letters, numbers, hyphens, and underscores');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates request metadata fields.
   * @param metadata The metadata to validate
   * @returns Validation result
   */
  public static validateMetadata(metadata: Record<string, unknown>): RequestValidationResult {
    const errors: string[] = [];

    if (!metadata || typeof metadata !== 'object') {
      errors.push('Metadata must be an object');
      return { isValid: false, errors };
    }

    // Priority validation
    if (metadata.priority !== undefined) {
      const priority = metadata.priority as number;
      if (typeof priority !== 'number' || priority < 1 || priority > 10) {
        errors.push('Priority must be a number between 1 and 10');
      }
    }

    // Correlation ID validation
    if (metadata.correlationId !== undefined) {
      const correlationId = metadata.correlationId as string;
      if (typeof correlationId !== 'string') {
        errors.push('Correlation ID must be a string');
      } else if (correlationId.length > 100) {
        errors.push('Correlation ID must be at most 100 characters');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
