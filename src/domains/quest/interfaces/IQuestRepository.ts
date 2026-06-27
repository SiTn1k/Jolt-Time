/**
 * IQuestRepository Interface
 *
 * Interface defining the contract for Quest persistence.
 * All QuestRepository implementations must adhere to this interface.
 */

import type { QuestId } from '../value-objects/QuestId';
import type { Quest } from '../entities/Quest';
import type { QuestSlug } from '../value-objects/QuestSlug';
import type { QuestCategory } from '../types/QuestCategory';
import type { QuestDifficulty } from '../types/QuestDifficulty';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';

/**
 * Filter parameters for querying quests.
 */
export interface QuestFilterParams {
  /** Filter by category */
  category?: QuestCategory;
  /** Filter by difficulty */
  difficulty?: QuestDifficulty;
  /** Filter by active status */
  isActive?: boolean;
  /** Filter by required level */
  requiredLevel?: number;
  /** Filter by slug pattern */
  slugPattern?: string;
}

/**
 * Quest repository interface.
 * Defines all data access operations for Quest entities.
 */
export interface IQuestRepository {
  /**
   * Creates a new quest.
   * @param quest The quest to create
   * @returns The created quest
   */
  create(quest: Quest): Promise<Quest>;

  /**
   * Finds a quest by its ID.
   * @param id The quest ID to find
   * @returns The quest if found, null otherwise
   */
  findById(id: QuestId): Promise<Quest | null>;

  /**
   * Finds a quest by its slug.
   * @param slug The quest slug to find
   * @returns The quest if found, null otherwise
   */
  findBySlug(slug: QuestSlug): Promise<Quest | null>;

  /**
   * Checks if a quest exists by ID.
   * @param id The quest ID to check
   * @returns true if quest exists
   */
  exists(id: QuestId): Promise<boolean>;

  /**
   * Updates an existing quest.
   * @param quest The quest to update
   * @returns The updated quest
   */
  update(quest: Quest): Promise<Quest>;

  /**
   * Deletes a quest.
   * @param id The quest ID to delete
   */
  delete(id: QuestId): Promise<void>;

  /**
   * Lists quests with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of quests
   */
  list(
    params: PaginationParams,
    filters?: QuestFilterParams
  ): Promise<PaginatedResult<Quest>>;

  /**
   * Finds all active quests.
   * @param category Optional category filter
   * @returns Array of active quests
   */
  findActive(category?: QuestCategory): Promise<Quest[]>;

  /**
   * Counts total quests with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching quests
   */
  count(filters?: QuestFilterParams): Promise<number>;
}
