/**
 * Policy Validator
 *
 * Validates security policy data according to domain rules.
 */

import { PolicyType, POLICY_TYPE_CONSTRAINTS } from '../types/PolicyType';

/**
 * Result of policy validation.
 */
export interface PolicyValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validator for security policies.
 */
export class PolicyValidator {
  /**
   * Validates a policy name.
   * @param policyName The policy name to validate
   * @returns Validation result with any error message
   */
  public static validatePolicyName(policyName: string | null | undefined): PolicyValidationResult {
    if (policyName === null || policyName === undefined) {
      return {
        isValid: false,
        error: 'Policy name is required',
      };
    }

    if (policyName.trim().length === 0) {
      return {
        isValid: false,
        error: 'Policy name cannot be empty',
      };
    }

    if (policyName.length > 128) {
      return {
        isValid: false,
        error: 'Policy name must be at most 128 characters',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a policy type.
   * @param policyType The policy type to validate
   * @returns Validation result with any error message
   */
  public static validatePolicyType(policyType: string | null | undefined): PolicyValidationResult {
    if (policyType === null || policyType === undefined) {
      return {
        isValid: false,
        error: 'Policy type is required',
      };
    }

    const validTypes = POLICY_TYPE_CONSTRAINTS.VALID_POLICY_TYPES;
    if (!validTypes.includes(policyType as PolicyType)) {
      return {
        isValid: false,
        error: `Invalid policy type. Must be one of: ${validTypes.join(', ')}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a policy configuration.
   * @param configuration The configuration to validate
   * @returns Validation result with any error message
   */
  public static validateConfiguration(configuration: Record<string, unknown> | null | undefined): PolicyValidationResult {
    if (configuration === null || configuration === undefined) {
      return { isValid: true };
    }

    if (typeof configuration !== 'object') {
      return {
        isValid: false,
        error: 'Configuration must be an object',
      };
    }

    const jsonSize = JSON.stringify(configuration).length;
    if (jsonSize > 65536) {
      return {
        isValid: false,
        error: 'Configuration JSON must be at most 64KB',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a policy metadata.
   * @param metadata The metadata to validate
   * @returns Validation result with any error message
   */
  public static validateMetadata(metadata: Record<string, unknown> | null | undefined): PolicyValidationResult {
    if (metadata === null || metadata === undefined) {
      return { isValid: true };
    }

    if (typeof metadata !== 'object') {
      return {
        isValid: false,
        error: 'Metadata must be an object',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates all policy fields together.
   * @param params Policy fields to validate
   * @returns Validation result with any error message
   */
  public static validatePolicy(params: {
    policyName?: string;
    policyType?: string;
    enabled?: boolean;
    configuration?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
  }): PolicyValidationResult {
    const policyNameResult = this.validatePolicyName(params.policyName);
    if (!policyNameResult.isValid) return policyNameResult;

    const policyTypeResult = this.validatePolicyType(params.policyType);
    if (!policyTypeResult.isValid) return policyTypeResult;

    const configurationResult = this.validateConfiguration(params.configuration);
    if (!configurationResult.isValid) return configurationResult;

    const metadataResult = this.validateMetadata(params.metadata);
    if (!metadataResult.isValid) return metadataResult;

    return { isValid: true };
  }

  /**
   * Validates a policy and throws if invalid.
   * @param params Policy fields to validate
   * @throws Error with validation details if invalid
   */
  public static validatePolicyOrThrow(params: {
    policyName?: string;
    policyType?: string;
    enabled?: boolean;
    configuration?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
  }): void {
    const result = this.validatePolicy(params);
    if (!result.isValid) {
      throw new Error(`Policy validation failed: ${result.error}`);
    }
  }

  /**
   * Validates a policy update.
   * @param params Policy fields to validate
   * @returns Validation result with any error message
   */
  public static validatePolicyUpdate(params: {
    policyName?: string;
    enabled?: boolean;
    configuration?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
  }): PolicyValidationResult {
    if (params.policyName !== undefined) {
      const policyNameResult = this.validatePolicyName(params.policyName);
      if (!policyNameResult.isValid) return policyNameResult;
    }

    if (params.configuration !== undefined) {
      const configurationResult = this.validateConfiguration(params.configuration);
      if (!configurationResult.isValid) return configurationResult;
    }

    if (params.metadata !== undefined) {
      const metadataResult = this.validateMetadata(params.metadata);
      if (!metadataResult.isValid) return metadataResult;
    }

    return { isValid: true };
  }
}
