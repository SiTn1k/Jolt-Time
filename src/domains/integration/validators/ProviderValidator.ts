/**
 * Provider Validator
 *
 * Validation specific to integration providers.
 */

import type { ProviderConfiguration } from '../types/ProviderConfiguration';

/**
 * Validation result for provider validation.
 */
export interface ProviderValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validator for integration provider configurations and data.
 */
export class ProviderValidator {
  /**
   * Validates a provider configuration object.
   * @param config The configuration to validate
   * @returns Validation result
   */
  public static validateConfiguration(config: ProviderConfiguration): ProviderValidationResult {
    const errors: string[] = [];

    // Endpoint URL validation (if provided)
    if (config.endpoint) {
      try {
        new URL(config.endpoint);
      } catch {
        errors.push('Endpoint must be a valid URL');
      }
    }

    // OAuth2 validation
    if (config.authType === 'oauth2') {
      if (!config.clientId) {
        errors.push('OAuth2 requires clientId');
      }
      if (config.redirectUri) {
        try {
          new URL(config.redirectUri);
        } catch {
          errors.push('Redirect URI must be a valid URL');
        }
      }
    }

    // Webhook URL validation
    if (config.webhookConfig?.url) {
      try {
        new URL(config.webhookConfig.url);
      } catch {
        errors.push('Webhook URL must be valid');
      }
    }

    // Timeout validation
    if (config.timeout !== undefined) {
      if (typeof config.timeout !== 'number' || config.timeout <= 0) {
        errors.push('Timeout must be a positive number (milliseconds)');
      }
    }

    // Retry config validation
    if (config.retryConfig) {
      if (config.retryConfig.maxRetries < 0) {
        errors.push('Max retries must be non-negative');
      }
      if (config.retryConfig.retryDelay < 0) {
        errors.push('Retry delay must be non-negative');
      }
    }

    // Rate limit validation
    if (config.rateLimit) {
      if (config.rateLimit.requestsPerMinute <= 0) {
        errors.push('Rate limit requests per minute must be positive');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates that a provider name is well-formed.
   * @param name The provider name to validate
   * @returns Validation result
   */
  public static validateName(name: string): ProviderValidationResult {
    const errors: string[] = [];

    if (!name || name.trim().length === 0) {
      errors.push('Provider name is required');
    }

    if (name.length > 255) {
      errors.push('Provider name must be at most 255 characters');
    }

    // Check for valid characters (alphanumeric, spaces, hyphens, underscores)
    const validNameRegex = /^[a-zA-Z0-9\s\-_]+$/;
    if (name && !validNameRegex.test(name)) {
      errors.push('Provider name can only contain letters, numbers, spaces, hyphens, and underscores');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates that a provider type is supported.
   * @param type The provider type to validate
   * @param supportedTypes List of supported types
   * @returns Validation result
   */
  public static validateType(type: string, supportedTypes: string[]): ProviderValidationResult {
    const errors: string[] = [];

    if (!type) {
      errors.push('Provider type is required');
    } else if (!supportedTypes.includes(type)) {
      errors.push(`Provider type must be one of: ${supportedTypes.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
