/**
 * Feature Flag Engine
 *
 * Evaluates feature flags with support for boolean flags, percentage rollout,
 * user-based evaluation, and environment evaluation.
 */

import type { FeatureFlag } from '../entities/FeatureFlag';
import { createLogger } from '../../../core/logging/logger.service';

const logger = createLogger('FeatureFlagEngine');

/**
 * User context for feature flag evaluation.
 */
export interface FeatureFlagUserContext {
  /** User ID */
  userId: string;
  /** User attributes for targeting */
  attributes?: Record<string, unknown>;
  /** Target user IDs for user-based evaluation */
  targetUserIds?: string[];
}

/**
 * Environment context for feature flag evaluation.
 */
export interface FeatureFlagEnvironmentContext {
  /** Environment name (development, staging, production) */
  environment: string;
  /** Additional environment attributes */
  attributes?: Record<string, unknown>;
}

/**
 * Feature flag evaluation result.
 */
export interface FeatureFlagEvaluationResult {
  /** Whether the flag is enabled */
  enabled: boolean;
  /** The evaluated value */
  value: boolean;
  /** Reason for the evaluation */
  reason: FeatureFlagEvaluationReason;
  /** The flag that was evaluated */
  flag: FeatureFlag;
}

/**
 * Reasons for feature flag evaluation.
 */
export enum FeatureFlagEvaluationReason {
  /** Flag is globally disabled */
  FLAG_DISABLED = 'flag_disabled',
  /** Flag rollout percentage excludes user */
  ROLLOUT_PERCENTAGE = 'rollout_percentage',
  /** Flag is in target user list */
  TARGET_USER = 'target_user',
  /** Flag is not active (rollout is 0) */
  NOT_ACTIVE = 'not_active',
  /** Fallback value used */
  FALLBACK = 'fallback',
  /** Flag not found */
  FLAG_NOT_FOUND = 'flag_not_found',
}

/**
 * Options for feature flag evaluation.
 */
export interface FeatureFlagEvaluationOptions {
  /** Default value if flag not found */
  defaultValue?: boolean;
  /** Enable percentage rollout */
  enablePercentageRollout?: boolean;
  /** Enable user-based evaluation */
  enableUserBased?: boolean;
  /** Enable environment evaluation */
  enableEnvironment?: boolean;
}

/**
 * Default evaluation options.
 */
export const DEFAULT_EVALUATION_OPTIONS: Required<FeatureFlagEvaluationOptions> = {
  defaultValue: false,
  enablePercentageRollout: true,
  enableUserBased: true,
  enableEnvironment: true,
};

/**
 * Default rollout environments.
 */
export const DEFAULT_ENVIRONMENTS = ['development', 'staging', 'production'];

/**
 * Feature flag evaluation engine.
 * Supports boolean flags, percentage rollout, user-based evaluation, and environment evaluation.
 */
export class FeatureFlagEngine {
  private readonly options: Required<FeatureFlagEvaluationOptions>;
  private readonly environments: string[];

  /**
   * Creates a new FeatureFlagEngine instance.
   */
  constructor(
    options: FeatureFlagEvaluationOptions = {},
    environments: string[] = DEFAULT_ENVIRONMENTS
  ) {
    this.options = { ...DEFAULT_EVALUATION_OPTIONS, ...options };
    this.environments = environments;
    logger.debug('FeatureFlagEngine initialized', { options: this.options, environments: this.environments });
  }

  /**
   * Evaluates a feature flag for a user.
   * @param flag The feature flag to evaluate
   * @param userContext User context for evaluation
   * @param environmentContext Environment context for evaluation
   * @returns Evaluation result
   */
  public evaluate(
    flag: FeatureFlag,
    userContext?: FeatureFlagUserContext,
    environmentContext?: FeatureFlagEnvironmentContext
  ): FeatureFlagEvaluationResult {
    logger.debug('Evaluating feature flag', { key: flag.key, userId: userContext?.userId });

    // Check if flag is globally disabled
    if (!flag.enabled) {
      const result: FeatureFlagEvaluationResult = {
        enabled: false,
        value: false,
        reason: FeatureFlagEvaluationReason.FLAG_DISABLED,
        flag,
      };
      logger.debug('Flag evaluation result', { key: flag.key, ...result });
      return result;
    }

    // Check target users first (bypasses rollout check - explicit allowlist)
    if (this.options.enableUserBased && userContext?.targetUserIds?.length) {
      if (userContext.targetUserIds.includes(userContext.userId)) {
        const result: FeatureFlagEvaluationResult = {
          enabled: true,
          value: true,
          reason: FeatureFlagEvaluationReason.TARGET_USER,
          flag,
        };
        logger.debug('Flag evaluation result - target user', { key: flag.key });
        return result;
      }
    }

    // Check if flag is active (enabled and rollout > 0)
    if (!flag.isActive()) {
      const result: FeatureFlagEvaluationResult = {
        enabled: false,
        value: false,
        reason: FeatureFlagEvaluationReason.NOT_ACTIVE,
        flag,
      };
      logger.debug('Flag evaluation result', { key: flag.key, ...result });
      return result;
    }

    // Check environment
    if (this.options.enableEnvironment && environmentContext) {
      const envResult = this.evaluateEnvironment(flag, environmentContext);
      if (!envResult) {
        const result: FeatureFlagEvaluationResult = {
          enabled: false,
          value: false,
          reason: FeatureFlagEvaluationReason.FLAG_DISABLED,
          flag,
        };
        logger.debug('Flag evaluation result - environment disabled', { key: flag.key });
        return result;
      }
    }

    // Check percentage rollout
    if (this.options.enablePercentageRollout && userContext) {
      const percentageResult = this.evaluatePercentage(flag, userContext);
      const result: FeatureFlagEvaluationResult = {
        enabled: flag.enabled,
        value: percentageResult,
        reason: percentageResult
          ? FeatureFlagEvaluationReason.ROLLOUT_PERCENTAGE
          : FeatureFlagEvaluationReason.FALLBACK,
        flag,
      };
      logger.debug('Flag evaluation result', { key: flag.key, value: percentageResult });
      return result;
    }

    // Default: return flag's enabled state
    const result: FeatureFlagEvaluationResult = {
      enabled: flag.enabled,
      value: flag.enabled,
      reason: FeatureFlagEvaluationReason.FLAG_DISABLED,
      flag,
    };
    logger.debug('Flag evaluation result - default', { key: flag.key, value: flag.enabled });
    return result;
  }

  /**
   * Evaluates a feature flag by key from a collection.
   * @param key The flag key
   * @param flags Map of flags by key
   * @param userContext User context for evaluation
   * @param environmentContext Environment context for evaluation
   * @returns Evaluation result with fallback for missing flags
   */
  public evaluateByKey(
    key: string,
    flags: Map<string, FeatureFlag>,
    userContext?: FeatureFlagUserContext,
    environmentContext?: FeatureFlagEnvironmentContext
  ): FeatureFlagEvaluationResult {
    const flag = flags.get(key);

    if (!flag) {
      logger.debug('Feature flag not found', { key });
      return {
        enabled: this.options.defaultValue,
        value: this.options.defaultValue,
        reason: FeatureFlagEvaluationReason.FLAG_NOT_FOUND,
        flag: this.createFallbackFlag(key),
      };
    }

    return this.evaluate(flag, userContext, environmentContext);
  }

  /**
   * Evaluates multiple feature flags for a user.
   * @param keys Array of flag keys
   * @param flags Map of flags by key
   * @param userContext User context for evaluation
   * @param environmentContext Environment context for evaluation
   * @returns Map of evaluation results by key
   */
  public evaluateMany(
    keys: string[],
    flags: Map<string, FeatureFlag>,
    userContext?: FeatureFlagUserContext,
    environmentContext?: FeatureFlagEnvironmentContext
  ): Map<string, FeatureFlagEvaluationResult> {
    const results = new Map<string, FeatureFlagEvaluationResult>();

    for (const key of keys) {
      results.set(key, this.evaluateByKey(key, flags, userContext, environmentContext));
    }

    return results;
  }

  /**
   * Gets all enabled flags for a user.
   * @param flags Map of flags by key
   * @param userContext User context for evaluation
   * @param environmentContext Environment context for evaluation
   * @returns Array of enabled flag keys
   */
  public getEnabledFlags(
    flags: Map<string, FeatureFlag>,
    userContext?: FeatureFlagUserContext,
    environmentContext?: FeatureFlagEnvironmentContext
  ): string[] {
    const enabledFlags: string[] = [];

    for (const [key, flag] of flags) {
      const result = this.evaluate(flag, userContext, environmentContext);
      if (result.value) {
        enabledFlags.push(key);
      }
    }

    return enabledFlags;
  }

  /**
   * Checks if a feature is enabled for a user.
   * @param key The flag key
   * @param flags Map of flags by key
   * @param userContext User context for evaluation
   * @param environmentContext Environment context for evaluation
   * @returns true if feature is enabled
   */
  public isEnabled(
    key: string,
    flags: Map<string, FeatureFlag>,
    userContext?: FeatureFlagUserContext,
    environmentContext?: FeatureFlagEnvironmentContext
  ): boolean {
    const result = this.evaluateByKey(key, flags, userContext, environmentContext);
    return result.value;
  }

  /**
   * Evaluates percentage rollout for a user.
   * Uses consistent hashing based on user ID to ensure same user always gets same result.
   */
  private evaluatePercentage(flag: FeatureFlag, userContext: FeatureFlagUserContext): boolean {
    const hash = this.hashUserId(userContext.userId, flag.key);
    const percentage = hash % 100;
    return percentage < flag.rollout;
  }

  /**
   * Generates a consistent hash for user ID and flag key.
   * Uses a simple hash function for consistent percentage distribution.
   */
  private hashUserId(userId: string, flagKey: string): number {
    const combined = `${flagKey}:${userId}`;
    let hash = 0;

    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    return Math.abs(hash);
  }

  /**
   * Evaluates environment restrictions.
   * Returns true if environment is allowed.
   */
  private evaluateEnvironment(flag: FeatureFlag, context: FeatureFlagEnvironmentContext): boolean {
    const flagEnv = flag.metadata.environment;

    if (!flagEnv) {
      return true; // No environment restriction
    }

    return flagEnv === context.environment;
  }

  /**
   * Creates a fallback flag for missing flags.
   */
  private createFallbackFlag(key: string): FeatureFlag {
    return {
      flagId: { value: 'fallback' },
      key,
      enabled: this.options.defaultValue,
      rollout: 0,
      description: 'Fallback flag',
      metadata: {},
      isActive: () => false,
      shouldShowForPercentage: () => false,
      toJSON: () => ({ flagId: 'fallback', key, enabled: false, rollout: 0, description: '', metadata: {} }),
      copyWith: () => { throw new Error('Cannot copy fallback flag'); },
    } as unknown as FeatureFlag;
  }
}
