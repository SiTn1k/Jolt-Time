/**
 * IQuestProgress Interface
 *
 * Interface for QuestProgress domain entity.
 */

import type { QuestStatus } from '../types/QuestStatus';
import type { ProgressValue } from '../value-objects/ProgressValue';

/**
 * QuestProgress entity interface.
 */
export interface IQuestProgress {
  /** Unique progress identifier */
  readonly progressId: string;
  /** Player profile ID */
  readonly playerProfileId: string;
  /** Quest ID */
  readonly questId: string;
  /** Current status */
  readonly status: QuestStatus;
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
   * Checks if the quest is claimable.
   */
  isClaimable: boolean;

  /**
   * Checks if the quest has been claimed.
   */
  isClaimed: boolean;
}

/**
 * QuestProgress entity with proper type for progressId.
 */
export interface IQuestProgressEntity {
  /** Unique progress identifier */
  readonly progressId: string;
  /** Player profile ID */
  readonly playerProfileId: string;
  /** Quest ID */
  readonly questId: string;
  /** Current status */
  readonly status: QuestStatus;
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
