/**
 * IAchievementProgressRepository Interface
 *
 * Interface defining the contract for AchievementProgress persistence.
 * All AchievementProgressRepository implementations must adhere to this interface.
 */

import type { AchievementProgressId } from '../entities/AchievementProgressId';
import type { AchievementProgress } from '../entities/AchievementProgress';
import type { AchievementStatus } from '../types/AchievementStatus';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';

/**
 * Filter parameters for querying achievement progress.
 */
export interface AchievementProgressFilterParams {
  /** Filter by player profile ID */
  playerProfileId?: string;
  /** Filter by achievement ID */
  achievementId?: string;
  /** Filter by status */
  status?: AchievementStatus;
  /** Filter by claimable (completed but not claimed) */
  isClaimable?: boolean;
}

/**
 * AchievementProgress repository interface.
 * Defines all data access operations for AchievementProgress entities.
 */
export interface IAchievementProgressRepository {
  /**
   * Creates new achievement progress.
   * @param progress The progress to create
   * @returns The created progress
   */
  create(progress: AchievementProgress): Promise<AchievementProgress>;

  /**
   * Finds progress by its ID.
   * @param id The progress ID to find
   * @returns The progress if found, null otherwise
   */
  findById(id: AchievementProgressId): Promise<AchievementProgress | null>;

  /**
   * Finds all progress for a player.
   * @param playerProfileId The player profile ID
   * @returns Array of progress entries
   */
  findByPlayerId(playerProfileId: string): Promise<AchievementProgress[]>;

  /**
   * Finds progress for a specific achievement and player.
   * @param playerProfileId The player profile ID
   * @param achievementId The achievement ID
   * @returns The progress if found, null otherwise
   */
  findByPlayerAndAchievement(
    playerProfileId: string,
    achievementId: string
  ): Promise<AchievementProgress | null>;

  /**
   * Updates existing progress.
   * @param progress The progress to update
   * @returns The updated progress
   */
  update(progress: AchievementProgress): Promise<AchievementProgress>;

  /**
   * Deletes progress.
   * @param id The progress ID to delete
   */
  delete(id: AchievementProgressId): Promise<void>;

  /**
   * Lists progress with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of progress entries
   */
  list(
    params: PaginationParams,
    filters?: AchievementProgressFilterParams
  ): Promise<PaginatedResult<AchievementProgress>>;

  /**
   * Finds all claimable progress for a player.
   * @param playerProfileId The player profile ID
   * @returns Array of claimable progress entries
   */
  findClaimable(playerProfileId: string): Promise<AchievementProgress[]>;

  /**
   * Counts total progress entries with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching progress entries
   */
  count(filters?: AchievementProgressFilterParams): Promise<number>;
}
