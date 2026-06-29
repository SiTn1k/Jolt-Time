/**
 * Feature Flag Validator
 *
 * Validates feature flag data.
 */

/**
 * Result of feature flag validation.
 */
export interface FeatureFlagValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validator for feature flags.
 */
export class FeatureFlagValidator {
  /**
   * Validates a feature flag key.
   * @param key The key to validate
   * @returns Validation result with any error message
   */
  public static validateKey(key: string | null | undefined): FeatureFlagValidationResult {
    if (key === null || key === undefined) {
      return {
        isValid: false,
        error: 'Feature flag key is required',
      };
    }

    const trimmed = key.trim();

    if (trimmed.length === 0) {
      return {
        isValid: false,
        error: 'Feature flag key cannot be empty',
      };
    }

    if (trimmed.length > 64) {
      return {
        isValid: false,
        error: 'Feature flag key exceeds maximum length of 64',
      };
    }

    const keyPattern = /^[a-zA-Z][a-zA-Z0-9_]*$/;
    if (!keyPattern.test(trimmed)) {
      return {
        isValid: false,
        error: 'Feature flag key must start with a letter and contain only letters, numbers, and underscores',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a rollout percentage.
   * @param rollout The rollout percentage to validate
   * @returns Validation result with any error message
   */
  public static validateRollout(rollout: number | null | undefined): FeatureFlagValidationResult {
    if (rollout === null || rollout === undefined) {
      return { isValid: true };
    }

    if (typeof rollout !== 'number') {
      return {
        isValid: false,
        error: 'Rollout must be a number',
      };
    }

    if (rollout < 0 || rollout > 100) {
      return {
        isValid: false,
        error: 'Rollout must be between 0 and 100',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a feature flag description.
   * @param description The description to validate
   * @returns Validation result with any error message
   */
  public static validateDescription(description: string | null | undefined): FeatureFlagValidationResult {
    if (description === null || description === undefined) {
      return { isValid: true };
    }

    if (description.length > 500) {
      return {
        isValid: false,
        error: 'Feature flag description exceeds maximum length of 500',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a feature flag enabled state.
   * @param enabled The enabled state to validate
   * @returns Validation result with any error message
   */
  public static validateEnabled(enabled: boolean | null | undefined): FeatureFlagValidationResult {
    if (enabled === null || enabled === undefined) {
      return { isValid: true };
    }

    if (typeof enabled !== 'boolean') {
      return {
        isValid: false,
        error: 'Enabled must be a boolean',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a complete feature flag.
   * @param key The feature flag key
   * @param rollout The rollout percentage
   * @param enabled The enabled state
   * @param description The description (optional)
   * @returns Validation result with any error message
   */
  public static validate(
    key: string | null | undefined,
    rollout?: number | null | undefined,
    enabled?: boolean | null | undefined,
    description?: string | null | undefined
  ): FeatureFlagValidationResult {
    const keyResult = this.validateKey(key);
    if (!keyResult.isValid) {
      return keyResult;
    }

    const rolloutResult = this.validateRollout(rollout);
    if (!rolloutResult.isValid) {
      return rolloutResult;
    }

    const enabledResult = this.validateEnabled(enabled);
    if (!enabledResult.isValid) {
      return enabledResult;
    }

    const descResult = this.validateDescription(description);
    if (!descResult.isValid) {
      return descResult;
    }

    return { isValid: true };
  }

  /**
   * Validates a feature flag key and throws if invalid.
   * @param key The key to validate
   * @throws Error with validation details if invalid
   */
  public static validateKeyOrThrow(key: string | null | undefined): void {
    const result = this.validateKey(key);
    if (!result.isValid) {
      throw new Error(`Feature flag key validation failed: ${result.error}`);
    }
  }

  /**
   * Validates a rollout percentage and throws if invalid.
   * @param rollout The rollout to validate
   * @throws Error with validation details if invalid
   */
  public static validateRolloutOrThrow(rollout: number | null | undefined): void {
    const result = this.validateRollout(rollout);
    if (!result.isValid) {
      throw new Error(`Feature flag rollout validation failed: ${result.error}`);
    }
  }

  /**
   * Sanitizes a feature flag key by trimming.
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
