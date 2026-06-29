/**
 * Configuration Validation Service
 *
 * Comprehensive validation for configuration entries, feature flags, and groups.
 * Provides validation for missing keys, invalid types, invalid values, duplicate keys, and circular references.
 */

import type { ConfigurationEntry } from '../entities/ConfigurationEntry';
import type { FeatureFlag } from '../entities/FeatureFlag';
import type { ConfigurationGroup } from '../entities/ConfigurationGroup';
import { ConfigurationValidator } from '../validators/ConfigurationValidator';
import { FeatureFlagValidator } from '../validators/FeatureFlagValidator';
import { GroupValidator } from '../validators/GroupValidator';
import { ConfigurationType } from '../types/ConfigurationType';
import { createLogger } from '../../../core/logging/logger.service';

const logger = createLogger('ConfigurationValidationService');

/**
 * Validation error types.
 */
export enum ValidationErrorType {
  /** Missing required key */
  MISSING_KEY = 'missing_key',
  /** Invalid value type */
  INVALID_TYPE = 'invalid_type',
  /** Invalid value */
  INVALID_VALUE = 'invalid_value',
  /** Duplicate key */
  DUPLICATE_KEY = 'duplicate_key',
  /** Circular reference detected */
  CIRCULAR_REFERENCE = 'circular_reference',
  /** Configuration not found */
  NOT_FOUND = 'not_found',
  /** Validation failed */
  VALIDATION_FAILED = 'validation_failed',
}

/**
 * Validation error details.
 */
export interface ValidationError {
  /** Error type */
  type: ValidationErrorType;
  /** Error message */
  message: string;
  /** Affected key */
  key?: string;
  /** Additional details */
  details?: Record<string, unknown>;
}

/**
 * Batch validation result.
 */
export interface BatchValidationResult {
  /** Whether all validations passed */
  isValid: boolean;
  /** List of validation errors */
  errors: ValidationError[];
  /** Number of valid items */
  validCount: number;
  /** Number of invalid items */
  invalidCount: number;
}

/**
 * Configuration validation service.
 * Provides comprehensive validation for configuration entries, feature flags, and groups.
 */
export class ConfigurationValidationService {
  /**
   * Creates a new ConfigurationValidationService instance.
   */
  constructor() {
    logger.debug('ConfigurationValidationService initialized');
  }

  /**
   * Validates a configuration entry.
   * @param entry The configuration entry to validate
   * @returns Validation result
   */
  public validateEntry(entry: ConfigurationEntry): BatchValidationResult {
    const errors: ValidationError[] = [];

    // Validate key
    const keyResult = ConfigurationValidator.validateKey(entry.key.value);
    if (!keyResult.isValid) {
      errors.push({
        type: ValidationErrorType.VALIDATION_FAILED,
        message: keyResult.error || 'Invalid key',
        key: entry.key.value,
      });
    }

    // Validate value
    const valueResult = ConfigurationValidator.validateValue(entry.value, entry.valueType);
    if (!valueResult.isValid) {
      errors.push({
        type: ValidationErrorType.INVALID_VALUE,
        message: valueResult.error || 'Invalid value',
        key: entry.key.value,
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      validCount: errors.length === 0 ? 1 : 0,
      invalidCount: errors.length > 0 ? 1 : 0,
    };
  }

  /**
   * Validates a feature flag.
   * @param flag The feature flag to validate
   * @returns Validation result
   */
  public validateFeatureFlag(flag: FeatureFlag): BatchValidationResult {
    const errors: ValidationError[] = [];

    // Validate key
    const keyResult = FeatureFlagValidator.validateKey(flag.key);
    if (!keyResult.isValid) {
      errors.push({
        type: ValidationErrorType.VALIDATION_FAILED,
        message: keyResult.error || 'Invalid key',
        key: flag.key,
      });
    }

    // Validate rollout
    const rolloutResult = FeatureFlagValidator.validateRollout(flag.rollout);
    if (!rolloutResult.isValid) {
      errors.push({
        type: ValidationErrorType.INVALID_VALUE,
        message: rolloutResult.error || 'Invalid rollout',
        key: flag.key,
      });
    }

    // Validate description
    const descResult = FeatureFlagValidator.validateDescription(flag.description);
    if (!descResult.isValid) {
      errors.push({
        type: ValidationErrorType.INVALID_VALUE,
        message: descResult.error || 'Invalid description',
        key: flag.key,
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      validCount: errors.length === 0 ? 1 : 0,
      invalidCount: errors.length > 0 ? 1 : 0,
    };
  }

  /**
   * Validates a configuration group.
   * @param group The configuration group to validate
   * @returns Validation result
   */
  public validateGroup(group: ConfigurationGroup): BatchValidationResult {
    const errors: ValidationError[] = [];

    // Validate name
    const nameResult = GroupValidator.validateName(group.name);
    if (!nameResult.isValid) {
      errors.push({
        type: ValidationErrorType.VALIDATION_FAILED,
        message: nameResult.error || 'Invalid name',
        key: group.name,
      });
    }

    // Validate description
    const descResult = GroupValidator.validateDescription(group.description);
    if (!descResult.isValid) {
      errors.push({
        type: ValidationErrorType.INVALID_VALUE,
        message: descResult.error || 'Invalid description',
        key: group.name,
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      validCount: errors.length === 0 ? 1 : 0,
      invalidCount: errors.length > 0 ? 1 : 0,
    };
  }

  /**
   * Validates multiple configuration entries.
   * @param entries Array of configuration entries
   * @returns Batch validation result
   */
  public validateEntries(entries: ConfigurationEntry[]): BatchValidationResult {
    const allErrors: ValidationError[] = [];
    let validCount = 0;
    let invalidCount = 0;

    for (const entry of entries) {
      const result = this.validateEntry(entry);
      allErrors.push(...result.errors);
      validCount += result.validCount;
      invalidCount += result.invalidCount;
    }

    // Check for duplicate keys
    const keyMap = new Map<string, number>();
    for (const entry of entries) {
      const key = entry.key.value;
      const count = keyMap.get(key) ?? 0;
      keyMap.set(key, count + 1);
    }

    for (const [key, count] of keyMap) {
      if (count > 1) {
        allErrors.push({
          type: ValidationErrorType.DUPLICATE_KEY,
          message: `Duplicate configuration key: ${key}`,
          key,
          details: { count },
        });
        // Decrement validCount for each duplicate entry beyond the first
        validCount -= (count - 1);
      }
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      validCount,
      invalidCount,
    };
  }

  /**
   * Validates multiple feature flags.
   * @param flags Array of feature flags
   * @returns Batch validation result
   */
  public validateFeatureFlags(flags: FeatureFlag[]): BatchValidationResult {
    const allErrors: ValidationError[] = [];
    let validCount = 0;
    let invalidCount = 0;

    for (const flag of flags) {
      const result = this.validateFeatureFlag(flag);
      allErrors.push(...result.errors);
      validCount += result.validCount;
      invalidCount += result.invalidCount;
    }

    // Check for duplicate keys
    const keyMap = new Map<string, number>();
    for (const flag of flags) {
      const count = keyMap.get(flag.key) ?? 0;
      keyMap.set(flag.key, count + 1);
    }

    for (const [key, count] of keyMap) {
      if (count > 1) {
        allErrors.push({
          type: ValidationErrorType.DUPLICATE_KEY,
          message: `Duplicate feature flag key: ${key}`,
          key,
          details: { count },
        });
        invalidCount++;
        validCount--;
      }
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      validCount,
      invalidCount,
    };
  }

  /**
   * Checks for circular references in configuration keys.
   * A circular reference occurs when a key references itself or creates a loop.
   * @param entries Array of configuration entries
   * @returns Validation result with circular reference errors
   */
  public checkCircularReferences(entries: ConfigurationEntry[]): BatchValidationResult {
    const errors: ValidationError[] = [];
    const keySet = new Set(entries.map((e) => e.key.value));
    const validCount = entries.length;
    const invalidCount = 0;

    // Check for self-references in JSON values
    for (const entry of entries) {
      if (entry.valueType === ConfigurationType.JSON && typeof entry.value === 'object') {
        const refs = this.extractReferences(entry.value);
        for (const ref of refs) {
          if (ref === entry.key.value) {
            errors.push({
              type: ValidationErrorType.CIRCULAR_REFERENCE,
              message: `Self-reference detected in key: ${entry.key.value}`,
              key: entry.key.value,
              details: { reference: ref },
            });
          }
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      validCount,
      invalidCount,
    };
  }

  /**
   * Validates that all required keys are present.
   * @param entries Array of configuration entries
   * @param requiredKeys Array of required key patterns
   * @returns Validation result
   */
  public validateRequiredKeys(
    entries: ConfigurationEntry[],
    requiredKeys: string[]
  ): BatchValidationResult {
    const errors: ValidationError[] = [];
    const existingKeys = new Set(entries.map((e) => e.key.value));
    let validCount = entries.length;
    let invalidCount = 0;

    for (const required of requiredKeys) {
      if (!existingKeys.has(required)) {
        errors.push({
          type: ValidationErrorType.MISSING_KEY,
          message: `Missing required configuration key: ${required}`,
          key: required,
        });
        invalidCount++;
        validCount--;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      validCount,
      invalidCount,
    };
  }

  /**
   * Validates configuration entry types.
   * @param entries Array of configuration entries
   * @returns Validation result
   */
  public validateEntryTypes(entries: ConfigurationEntry[]): BatchValidationResult {
    const errors: ValidationError[] = [];
    let validCount = 0;
    let invalidCount = 0;

    for (const entry of entries) {
      const result = ConfigurationValidator.validateValue(entry.value, entry.valueType);
      if (!result.isValid) {
        errors.push({
          type: ValidationErrorType.INVALID_TYPE,
          message: result.error || 'Invalid type',
          key: entry.key.value,
        });
        invalidCount++;
      } else {
        validCount++;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      validCount,
      invalidCount,
    };
  }

  /**
   * Comprehensive validation of all configuration data.
   * @param entries Array of configuration entries
   * @param flags Array of feature flags
   * @param groups Array of configuration groups
   * @returns Combined validation result
   */
  public validateAll(
    entries: ConfigurationEntry[],
    flags: FeatureFlag[],
    groups: ConfigurationGroup[]
  ): BatchValidationResult {
    const allErrors: ValidationError[] = [];

    // Validate entries
    const entriesResult = this.validateEntries(entries);
    allErrors.push(...entriesResult.errors);

    // Check circular references
    const circularResult = this.checkCircularReferences(entries);
    allErrors.push(...circularResult.errors);

    // Validate feature flags
    const flagsResult = this.validateFeatureFlags(flags);
    allErrors.push(...flagsResult.errors);

    // Validate groups
    for (const group of groups) {
      const groupResult = this.validateGroup(group);
      allErrors.push(...groupResult.errors);
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      validCount: entriesResult.validCount + flagsResult.validCount + groups.length,
      invalidCount: entriesResult.invalidCount + flagsResult.invalidCount,
    };
  }

  /**
   * Extracts configuration key references from a JSON object.
   */
  private extractReferences(obj: unknown, currentPath: string[] = []): string[] {
    const refs: string[] = [];

    if (typeof obj !== 'object' || obj === null) {
      return refs;
    }

    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        refs.push(...this.extractReferences(obj[i], [...currentPath, String(i)]));
      }
    } else {
      for (const [key, value] of Object.entries(obj)) {
        if (key === '$ref' && typeof value === 'string') {
          refs.push(value);
        } else if (typeof value === 'object') {
          refs.push(...this.extractReferences(value, [...currentPath, key]));
        }
      }
    }

    return refs;
  }
}
