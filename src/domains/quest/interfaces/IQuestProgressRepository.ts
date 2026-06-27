/**
 * IQuestProgressRepository Interface
 *
 * Interface defining the contract for QuestProgress persistence.
 * All QuestProgressRepository implementations must adhere to this interface.
 */

import type { QuestProgressId } from '../entities/QuestProgressId';
import type { QuestProgress } from '../entities/QuestProgress';
import type { QuestStatus } from '../types/QuestStatus';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';

/**
 * Filter parameters for querying quest progress.
 */
export interface QuestProgressFilterParams {
  /** Filter by player profile ID */
  playerProfileId?: string;
  /** Filter by quest ID */
  questId?: string;
  /** Filter by status */
  status?: QuestStatus;
  /** Filter by started after date */
  startedAfter?: Date;
  /** Filter by started before date */
  startedBefore?: Date;
}

/**
 * QuestProgress repository interface.
 * Defines all data access operations for QuestProgress entities.
 */
export interface IQuestProgressRepository {
  /**
   * Creates a new quest progress record.
   * @param progress The progress to create
   * @returns The created progress
   */
  create(progress: QuestProgress): Promise<QuestProgress>;

  /**
   * Finds a progress record by its ID.
   * @param id The progress ID to find
   * @returns The progress if found, null otherwise
   */
  findById(id: QuestProgressId): Promise<QuestProgress | null>;

  /**
   * Finds progress records for a player.
   * @param playerProfileId The player profile ID
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of progress records
   */
  findByPlayer(
    playerProfileId: string,
    params: PaginationParams,
    filters?: QuestProgressFilterParams
  ): Promise<PaginatedResult<QuestProgress>>;

  /**
   * Finds a specific player's progress for a quest.
   * @param playerProfileId The player profile ID
   * @param questId The quest ID
   * @returns The progress if found, null otherwise
   */
  findByPlayerAndQuest(
    playerProfileId: string,
    questId: string
  ): Promise<QuestProgress | null>;

  /**
   * Finds all progress records for a quest.
   * @param questId The quest ID
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of progress records
   */
  findByQuest(
    questId: string,
    params: PaginationParams,
    filters?: QuestProgressFilterParams
  ): Promise<PaginatedResult<QuestProgress>>;

  /**
   * Checks if progress exists for a player and quest.
   * @param playerProfileId The player profile ID
   * @param questId The quest ID
   * @returns true if progress exists
   */
  exists(playerProfileId: string, questId: string): Promise<boolean>;

  /**
   * Updates an existing progress record.
   * @param progress The progress to update
   * @returns The updated progress
   */
  update(progress: QuestProgress): Promise<QuestProgress>;

  /**
   * Updates progress status only.
   * @param progressId The progress ID to update
   * @param status The new status
   * @returns The updated progress
   */
  updateStatus(progressId: QuestProgressId, status: QuestStatus): Promise<QuestProgress>;

  /**
   * Increments progress value.
   * @param progressId The progress ID to update
   * @param increment The amount to increment
   * @param target The target value (for completion detection)
   * @returns The updated progress
   */
  incrementProgress(
    progressId: QuestProgressId,
    increment: number,
    target: number
  ): Promise<QuestProgress>;

  /**
   * Resets progress for a quest (used for daily/weekly reset).
   * @param playerProfileId The player profile ID
   * @param questId The quest ID to reset
   * @returns The reset progress
   */
  resetProgress(
    playerProfileId: string,
    questId: string
  ): Promise<QuestProgress>;

  /**
   * Deletes a progress record.
   * @param id The progress ID to delete
   */
  delete(id: QuestProgressId): Promise<void>;

  /**
   * Lists all claimable progress for a player.
   * @param playerProfileId The player profile ID
   * @returns Array of claimable progress records
   */
  findClaimableByPlayer(playerProfileId: string): Promise<QuestProgress[]>;

  /**
   * Counts total progress records with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching progress records
   */
  count(filters?: QuestProgressFilterParams): Promise<number>;
}