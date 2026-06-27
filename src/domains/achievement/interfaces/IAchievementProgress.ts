/**
 * IAchievementProgress Interface
 *
 * Interface for AchievementProgress domain entity.
 */

import type { AchievementStatus } from '../types/AchievementStatus';
import type { ProgressValue } from '../value-objects/ProgressValue';

/**
 * AchievementProgress entity interface.
 */
export interface IAchievementProgress {
  /** Unique progress identifier */
  readonly progressId: string;
  /** Player profile ID */
  readonly playerProfileId: string;
  /** Achievement ID */
  readonly achievementId: string;
  /** Current status */
  readonly status: AchievementStatus;
  /** Current progress value */
  readonly currentValue: number;
  /** Completion timestamp */
  readonly completedAt: Date | null;
  /** Claim timestamp */
  readonly claimedAt: Date | null;
  /** Additional metadata */
  readonly metadata: Record<string, string | number | boolean>;
  /** Start timestamp */
  readonly startedAt: Date;
  /** Last update timestamp */
  readonly updatedAt: Date;

  /**
   * Gets the progress as a value object.
   */
  progress: ProgressValue;

  /**
   * Checks if progress is complete for a target.
   */
  isCompleteForTarget(target: number): boolean;

  /**
   * Gets completion percentage for a target.
   */
  getCompletionPercentage(target: number): number;

  /**
   * Checks if the achievement is claimable.
   */
  isClaimable: boolean;

  /**
   * Checks if the achievement has been claimed.
   */
  isClaimed: boolean;
}

/**
 * AchievementProgress entity with proper type for progressId.
 */
export interface IAchievementProgressEntity {
  /** Unique progress identifier */
  readonly progressId: string;
  /** Player profile ID */
  readonly playerProfileId: string;
  /** Achievement ID */
  readonly achievementId: string;
  /** Current status */
  readonly status: AchievementStatus;
  /** Current progress value */
  readonly currentValue: number;
  /** Completion timestamp */
  readonly completedAt: Date | null;
  /** Claim timestamp */
  readonly claimedAt: Date | null;
  /** Additional metadata */
  readonly metadata: Record<string, string | number | boolean>;
  /** Start timestamp */
  readonly startedAt: Date;
  /** Last update timestamp */
  readonly updatedAt: Date;
}
