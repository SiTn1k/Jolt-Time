/**
 * Configuration Validator
 *
 * Validates configuration entry data.
 */

import { ConfigurationType } from '../types/ConfigurationType';
import type { ConfigurationMetadata } from '../types/ConfigurationMetadata';

/**
 * Result of configuration validation.
 */
export interface ConfigurationValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validator for configuration entries.
 */
export class ConfigurationValidator {
  /**
   * Validates a configuration key.
   * @param key The key to validate
   * @returns Validation result with any error message
   */
  public static validateKey(key: string | null | undefined): ConfigurationValidationResult {
    if (key === null || key === undefined) {
      return {
        isValid: false,
        error: 'Configuration key is required',
      };
    }

    const trimmed = key.trim();

    if (trimmed.length === 0) {
      return {
        isValid: false,
        error: 'Configuration key cannot be empty',
      };
    }

    if (trimmed.length > 255) {
      return {
        isValid: false,
        error: 'Configuration key exceeds maximum length of 255',
      };
    }

    const keyPattern = /^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)*$/;
    if (!keyPattern.test(trimmed)) {
      return {
        isValid: false,
        error: 'Configuration key must start with a letter and contain only letters, numbers, dots, and underscores',
      };
    }

    const segments = trimmed.split('.');
    for (const segment of segments) {
      if (segment.length > 64) {
        return {
          isValid: false,
          error: `Configuration key segment "${segment}" exceeds maximum length of 64`,
        };
      }
    }

    return { isValid: true };
  }

  /**
   * Validates a configuration value against its type.
   * @param value The value to validate
   * @param valueType The expected type
   * @returns Validation result with any error message
   */
  public static validateValue(value: unknown, valueType: ConfigurationType): ConfigurationValidationResult {
    switch (valueType) {
      case ConfigurationType.STRING:
        if (typeof value !== 'string') {
          return {
            isValid: false,
            error: 'Value must be a string',
          };
        }
        break;

      case ConfigurationType.NUMBER:
        if (typeof value !== 'number') {
          return {
            isValid: false,
            error: 'Value must be a number',
          };
        }
        if (!Number.isFinite(value)) {
          return {
            isValid: false,
            error: 'Value must be a finite number',
          };
        }
        break;

      case ConfigurationType.BOOLEAN:
        if (typeof value !== 'boolean') {
          return {
            isValid: false,
            error: 'Value must be a boolean',
          };
        }
        break;

      case ConfigurationType.JSON:
        if (typeof value !== 'object' || value === null || Array.isArray(value)) {
          return {
            isValid: false,
            error: 'Value must be a JSON object',
          };
        }
        break;

      case ConfigurationType.ARRAY:
        if (!Array.isArray(value)) {
          return {
            isValid: false,
            error: 'Value must be an array',
          };
        }
        break;

      case ConfigurationType.DURATION:
        if (typeof value !== 'number') {
          return {
            isValid: false,
            error: 'Value must be a number (milliseconds)',
          };
        }
        if (value < 0) {
          return {
            isValid: false,
            error: 'Duration cannot be negative',
          };
        }
        break;

      case ConfigurationType.PERCENTAGE:
        if (typeof value !== 'number') {
          return {
            isValid: false,
            error: 'Value must be a number',
          };
        }
        if (value < 0 || value > 100) {
          return {
            isValid: false,
            error: 'Percentage must be between 0 and 100',
          };
        }
        break;
    }

    return { isValid: true };
  }

  /**
   * Validates a configuration entry.
   * @param key The configuration key
   * @param value The configuration value
   * @param valueType The value type
   * @returns Validation result with any error message
   */
  public static validate(key: string | null | undefined, value: unknown, valueType: ConfigurationType): ConfigurationValidationResult {
    const keyResult = this.validateKey(key);
    if (!keyResult.isValid) {
      return keyResult;
    }

    const valueResult = this.validateValue(value, valueType);
    if (!valueResult.isValid) {
      return valueResult;
    }

    return { isValid: true };
  }

  /**
   * Validates a configuration key and throws if invalid.
   * @param key The key to validate
   * @throws Error with validation details if invalid
   */
  public static validateKeyOrThrow(key: string | null | undefined): void {
    const result = this.validateKey(key);
    if (!result.isValid) {
      throw new Error(`Configuration key validation failed: ${result.error}`);
    }
  }

  /**
   * Validates a configuration value and throws if invalid.
   * @param value The value to validate
   * @param valueType The expected type
   * @throws Error with validation details if invalid
   */
  public static validateValueOrThrow(value: unknown, valueType: ConfigurationType): void {
    const result = this.validateValue(value, valueType);
    if (!result.isValid) {
      throw new Error(`Configuration value validation failed: ${result.error}`);
    }
  }

  /**
   * Sanitizes a configuration key by trimming.
   * @param key The key to sanitize
   * @returns Sanitized key or null if invalid
   */
  public static sanitizeKey(key: string | null | undefined): string | null {
    if (key === null || key === undefined) {
      return null;
    }
    const trimmed = key.trim();
    if (trimmed.length === 0) {
      return null;
    }
    return trimmed;
  }
}
