/**
 * IAchievementCondition Interface
 *
 * Interface for AchievementCondition domain entity.
 */

import type { ConditionId } from '../value-objects/ConditionId';
import type { AchievementId } from '../value-objects/AchievementId';
import type { ConditionType } from '../types/ConditionType';
import type { ConditionMetadata } from '../types/AchievementMetadata';

/**
 * AchievementCondition entity interface.
 */
export interface IAchievementCondition {
  /** Unique condition identifier */
  readonly conditionId: ConditionId;
  /** Parent achievement ID */
  readonly achievementId: AchievementId;
  /** Condition type */
  readonly conditionType: ConditionType;
  /** Target identifier if applicable */
  readonly target: string | null;
  /** Required value to complete */
  readonly requiredValue: number;
  /** Additional metadata */
  readonly metadata: ConditionMetadata;
  /** Order within achievement */
  readonly order: number;

  /**
   * Checks if the condition requires a specific target.
   */
  hasTarget: boolean;

  /**
   * Checks if the condition is count-based.
   */
  isCountBased: boolean;

  /**
   * Checks if the condition is time-based.
   */
  isTimeBased: boolean;
}
