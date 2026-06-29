/**
 * Definition Validator
 *
 * Validates job definition data according to scheduler rules.
 */

import { DefinitionId } from '../value-objects/DefinitionId';
import type { SchedulerDefinitionMetadata } from '../types/SchedulerMetadata';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Handler name regex - alphanumeric with dots and underscores.
 */
const HANDLER_REGEX = /^[a-zA-Z][a-zA-Z0-9._]*$/;

/**
 * Result of definition validation.
 */
export interface DefinitionValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validator for job definition data.
 */
export class DefinitionValidator {
  /**
   * Validates a definition ID format.
   */
  public static isValidDefinitionId(definitionId: string | null | undefined): boolean {
    if (!definitionId || definitionId.trim().length === 0) {
      return false;
    }
    return UUID_REGEX.test(definitionId);
  }

  /**
   * Validates a definition name.
   */
  public static isValidName(name: string | null | undefined): boolean {
    if (!name || name.trim().length === 0) {
      return false;
    }
    return name.length >= 1 && name.length <= 200;
  }

  /**
   * Validates a description.
   */
  public static isValidDescription(description: string | null | undefined): boolean {
    if (!description || description.trim().length === 0) {
      return false;
    }
    return description.length >= 1 && description.length <= 1000;
  }

  /**
   * Validates a handler name.
   */
  public static isValidHandler(handler: string | null | undefined): boolean {
    if (!handler || handler.trim().length === 0) {
      return false;
    }
    return HANDLER_REGEX.test(handler) && handler.length <= 200;
  }

  /**
   * Validates a retry limit.
   */
  public static isValidRetryLimit(retryLimit: number | null | undefined): boolean {
    if (retryLimit === null || retryLimit === undefined) {
      return true; // Optional
    }
    return retryLimit >= 0 && retryLimit <= 100;
  }

  /**
   * Validates a timeout value in milliseconds.
   */
  public static isValidTimeout(timeout: number | null | undefined): boolean {
    if (timeout === null || timeout === undefined) {
      return true; // Optional
    }
    return timeout >= 1000 && timeout <= 86400000; // 1 second to 24 hours
  }

  /**
   * Validates complete job definition data.
   */
  public static validateDefinition(data: {
    definitionId?: string;
    name?: string;
    description?: string;
    handler?: string;
    retryLimit?: number;
    timeout?: number;
  }): DefinitionValidationResult {
    const errors: string[] = [];

    if (data.definitionId !== undefined) {
      if (!data.definitionId || data.definitionId.trim().length === 0) {
        errors.push('Definition ID is required');
      } else if (!UUID_REGEX.test(data.definitionId)) {
        errors.push('Definition ID must be a valid UUID');
      }
    }

    if (data.name !== undefined) {
      if (!data.name || data.name.trim().length === 0) {
        errors.push('Name is required');
      } else if (data.name.length < 1 || data.name.length > 200) {
        errors.push('Name must be between 1 and 200 characters');
      }
    }

    if (data.description !== undefined) {
      if (!data.description || data.description.trim().length === 0) {
        errors.push('Description is required');
      } else if (data.description.length < 1 || data.description.length > 1000) {
        errors.push('Description must be between 1 and 1000 characters');
      }
    }

    if (data.handler !== undefined) {
      if (!data.handler || data.handler.trim().length === 0) {
        errors.push('Handler is required');
      } else if (!HANDLER_REGEX.test(data.handler)) {
        errors.push('Handler must start with a letter and contain only alphanumeric characters, dots, and underscores');
      } else if (data.handler.length > 200) {
        errors.push('Handler cannot exceed 200 characters');
      }
    }

    if (data.retryLimit !== undefined && data.retryLimit !== null) {
      if (data.retryLimit < 0 || data.retryLimit > 100) {
        errors.push('Retry limit must be between 0 and 100');
      }
    }

    if (data.timeout !== undefined && data.timeout !== null) {
      if (data.timeout < 1000 || data.timeout > 86400000) {
        errors.push('Timeout must be between 1000ms and 86400000ms (24 hours)');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates definition data and throws if invalid.
   */
  public static validateDefinitionOrThrow(data: {
    definitionId?: string;
    name?: string;
    description?: string;
    handler?: string;
    retryLimit?: number;
    timeout?: number;
  }): void {
    const result = this.validateDefinition(data);
    if (!result.isValid) {
      throw new Error(`Definition validation failed: ${result.errors.join('; ')}`);
    }
  }
}
