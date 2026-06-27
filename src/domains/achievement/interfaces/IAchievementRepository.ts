/**
 * IAchievementRepository Interface
 *
 * Interface defining the contract for Achievement persistence.
 * All AchievementRepository implementations must adhere to this interface.
 */

import type { AchievementId } from '../value-objects/AchievementId';
import type { Achievement } from '../entities/Achievement';
import type { AchievementSlug } from '../value-objects/AchievementSlug';
import type { AchievementCategory } from '../types/AchievementCategory';
import type { AchievementRarity } from '../types/AchievementRarity';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';

/**
 * Filter parameters for querying achievements.
 */
export interface AchievementFilterParams {
  /** Filter by category */
  category?: AchievementCategory;
  /** Filter by rarity */
  rarity?: AchievementRarity;
  /** Filter by active status */
  isActive?: boolean;
  /** Filter by hidden status */
  isHidden?: boolean;
  /** Filter by slug pattern */
  slugPattern?: string;
}

/**
 * Achievement repository interface.
 * Defines all data access operations for Achievement entities.
 */
export interface IAchievementRepository {
  /**
   * Creates a new achievement.
   * @param achievement The achievement to create
   * @returns The created achievement
   */
  create(achievement: Achievement): Promise<Achievement>;

  /**
   * Finds an achievement by its ID.
   * @param id The achievement ID to find
   * @returns The achievement if found, null otherwise
   */
  findById(id: AchievementId): Promise<Achievement | null>;

  /**
   * Finds an achievement by its slug.
   * @param slug The achievement slug to find
   * @returns The achievement if found, null otherwise
   */
  findBySlug(slug: AchievementSlug): Promise<Achievement | null>;

  /**
   * Checks if an achievement exists by ID.
   * @param id The achievement ID to check
   * @returns true if achievement exists
   */
  exists(id: AchievementId): Promise<boolean>;

  /**
   * Updates an existing achievement.
   * @param achievement The achievement to update
   * @returns The updated achievement
   */
  update(achievement: Achievement): Promise<Achievement>;

  /**
   * Deletes an achievement.
   * @param id The achievement ID to delete
   */
  delete(id: AchievementId): Promise<void>;

  /**
   * Lists achievements with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of achievements
   */
  list(
    params: PaginationParams,
    filters?: AchievementFilterParams
  ): Promise<PaginatedResult<Achievement>>;

  /**
   * Finds all active achievements.
   * @param category Optional category filter
   * @returns Array of active achievements
   */
  findActive(category?: AchievementCategory): Promise<Achievement[]>;

  /**
   * Counts total achievements with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching achievements
   */
  count(filters?: AchievementFilterParams): Promise<number>;
}
