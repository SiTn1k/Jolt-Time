/**
 * Context Validator
 *
 * Validates error context data according to game rules.
 * Error Handling Foundation ONLY stores contexts - it never modifies gameplay.
 */

/**
 * Result of context validation.
 */
export interface ContextValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validator for error contexts.
 */
export class ContextValidator {
  /**
   * Validates a service name.
   * @param service The service name to validate
   * @returns Validation result with any error message
   */
  public static validateService(service: string | null | undefined): ContextValidationResult {
    if (service === null || service === undefined) {
      return {
        isValid: false,
        error: 'Service name is required',
      };
    }

    if (typeof service !== 'string') {
      return {
        isValid: false,
        error: 'Service name must be a string',
      };
    }

    if (service.trim().length === 0) {
      return {
        isValid: false,
        error: 'Service name cannot be empty',
      };
    }

    if (service.length > 64) {
      return {
        isValid: false,
        error: 'Service name must be at most 64 characters',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates an operation name.
   * @param operation The operation name to validate
   * @returns Validation result with any error message
   */
  public static validateOperation(operation: string | null | undefined): ContextValidationResult {
    if (operation === null || operation === undefined) {
      return {
        isValid: false,
        error: 'Operation name is required',
      };
    }

    if (typeof operation !== 'string') {
      return {
        isValid: false,
        error: 'Operation name must be a string',
      };
    }

    if (operation.trim().length === 0) {
      return {
        isValid: false,
        error: 'Operation name cannot be empty',
      };
    }

    if (operation.length > 128) {
      return {
        isValid: false,
        error: 'Operation name must be at most 128 characters',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a request ID.
   * @param requestId The request ID to validate
   * @returns Validation result with any error message
   */
  public static validateRequestId(requestId: string | null | undefined): ContextValidationResult {
    if (requestId === null || requestId === undefined) {
      return { isValid: true }; // Optional field
    }

    if (typeof requestId !== 'string') {
      return {
        isValid: false,
        error: 'Request ID must be a string',
      };
    }

    if (requestId.trim().length === 0) {
      return {
        isValid: false,
        error: 'Request ID cannot be empty',
      };
    }

    if (requestId.length > 64) {
      return {
        isValid: false,
        error: 'Request ID must be at most 64 characters',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates an actor ID.
   * @param actorId The actor ID to validate
   * @returns Validation result with any error message
   */
  public static validateActorId(actorId: string | null | undefined): ContextValidationResult {
    if (actorId === null || actorId === undefined) {
      return { isValid: true }; // Optional field
    }

    if (typeof actorId !== 'string') {
      return {
        isValid: false,
        error: 'Actor ID must be a string',
      };
    }

    if (actorId.trim().length === 0) {
      return {
        isValid: false,
        error: 'Actor ID cannot be empty',
      };
    }

    if (actorId.length > 64) {
      return {
        isValid: false,
        error: 'Actor ID must be at most 64 characters',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates context metadata.
   * @param metadata The metadata to validate
   * @returns Validation result with any error message
   */
  public static validateMetadata(metadata: Record<string, unknown> | null | undefined): ContextValidationResult {
    if (metadata === null || metadata === undefined) {
      return { isValid: true }; // Optional field
    }

    if (typeof metadata !== 'object') {
      return {
        isValid: false,
        error: 'Metadata must be an object',
      };
    }

    const metadataSize = JSON.stringify(metadata).length;
    if (metadataSize > 10000) {
      return {
        isValid: false,
        error: 'Metadata size exceeds maximum of 10000 bytes',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates all context fields together.
   * @param params Context fields to validate
   * @returns Validation result with any error message
   */
  public static validateContext(params: {
    service?: string;
    operation?: string;
    requestId?: string;
    actorId?: string;
    metadata?: Record<string, unknown>;
  }): ContextValidationResult {
    const serviceResult = this.validateService(params.service);
    if (!serviceResult.isValid) return serviceResult;

    const operationResult = this.validateOperation(params.operation);
    if (!operationResult.isValid) return operationResult;

    const requestIdResult = this.validateRequestId(params.requestId);
    if (!requestIdResult.isValid) return requestIdResult;

    const actorIdResult = this.validateActorId(params.actorId);
    if (!actorIdResult.isValid) return actorIdResult;

    const metadataResult = this.validateMetadata(params.metadata);
    if (!metadataResult.isValid) return metadataResult;

    return { isValid: true };
  }

  /**
   * Validates a context and throws if invalid.
   * @param params Context fields to validate
   * @throws Error with validation details if invalid
   */
  public static validateContextOrThrow(params: {
    service?: string;
    operation?: string;
    requestId?: string;
    actorId?: string;
    metadata?: Record<string, unknown>;
  }): void {
    const result = this.validateContext(params);
    if (!result.isValid) {
      throw new Error(`Error context validation failed: ${result.error}`);
    }
  }
}
