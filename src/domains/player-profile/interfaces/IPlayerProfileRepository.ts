/**
 * Player Profile Repository Interface
 *
 * Interface defining the contract for PlayerProfile persistence.
 * All PlayerProfile repository implementations must adhere to this interface.
 */

import type { PlayerProfileId } from '../value-objects/PlayerProfileId';
import type { PlayerProfile } from '../entities/PlayerProfile';
import type { PlayerProfileStatus } from '../types/PlayerProfileStatus';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';

/**
 * Filter parameters for querying player profiles.
 */
export interface PlayerProfileFilterParams {
  /** Filter by profile status */
  status?: PlayerProfileStatus;

  /** Filter by minimum level */
  minLevel?: number;

  /** Filter by maximum level */
  maxLevel?: number;

  /** Filter by minimum prestige */
  minPrestige?: number;

  /** Filter by maximum prestige */
  maxPrestige?: number;

  /** Filter by tutorial completion */
  tutorialCompleted?: boolean;

  /** Filter by creation date after */
  createdAfter?: Date;

  /** Filter by creation date before */
  createdBefore?: Date;
}

/**
 * PlayerProfile repository interface.
 * Defines all data access operations for PlayerProfile entities.
 */
export interface IPlayerProfileRepository {
  /**
   * Creates a new player profile.
   * @param profile The profile to create
   * @returns The created profile
   */
  create(profile: PlayerProfile): Promise<PlayerProfile>;

  /**
   * Finds a profile by its internal ID.
   * @param id The profile ID to find
   * @returns The profile if found, null otherwise
   */
  findById(id: PlayerProfileId): Promise<PlayerProfile | null>;

  /**
   * Finds a profile by user ID.
   * @param userId The user ID to find profile for
   * @returns The profile if found, null otherwise
   */
  findByUserId(userId: string): Promise<PlayerProfile | null>;

  /**
   * Finds a profile by nickname.
   * @param nickname The nickname to search for
   * @returns The profile if found, null otherwise
   */
  findByNickname(nickname: string): Promise<PlayerProfile | null>;

  /**
   * Checks if a profile exists by ID.
   * @param id The profile ID to check
   * @returns true if profile exists
   */
  exists(id: PlayerProfileId): Promise<boolean>;

  /**
   * Checks if a nickname is already taken.
   * @param nickname The nickname to check
   * @returns true if nickname is taken
   */
  nicknameExists(nickname: string): Promise<boolean>;

  /**
   * Updates an existing profile.
   * @param profile The profile to update
   * @returns The updated profile
   */
  update(profile: PlayerProfile): Promise<PlayerProfile>;

  /**
   * Soft deletes a profile.
   * @param id The profile ID to delete
   */
  delete(id: PlayerProfileId): Promise<void>;

  /**
   * Lists profiles with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of profiles
   */
  list(
    params: PaginationParams,
    filters?: PlayerProfileFilterParams
  ): Promise<PaginatedResult<PlayerProfile>>;

  /**
   * Counts total profiles with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching profiles
   */
  count(filters?: PlayerProfileFilterParams): Promise<number>;
}