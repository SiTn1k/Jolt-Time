/**
 * Achievement Condition DTO
 *
 * Data transfer objects for achievement conditions.
 */

import type { ConditionType } from '../types/ConditionType';
import type { ConditionMetadata } from '../types/AchievementMetadata';

/**
 * Input for creating a new achievement condition.
 */
export interface CreateConditionDto {
  /** Achievement ID */
  achievementId: string;
  /** Condition type */
  conditionType: ConditionType;
  /** Target identifier if applicable */
  target?: string | null;
  /** Required value to complete */
  requiredValue: number;
  /** Additional metadata */
  metadata?: ConditionMetadata;
  /** Order within achievement */
  order?: number;
}

/**
 * Response DTO for an achievement condition.
 */
export interface ConditionResponseDto {
  conditionId: string;
  achievementId: string;
  conditionType: ConditionType;
  target: string | null;
  requiredValue: number;
  metadata: ConditionMetadata;
  order: number;
}
