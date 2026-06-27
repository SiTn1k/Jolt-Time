/**
 * User Repository Interface
 *
 * Contract for User data access operations.
 * This interface defines all allowed operations on User storage.
 *
 * Responsibilities:
 * - Define data access contract for User entity
 * - Return strongly typed domain objects
 * - Support pagination for list operations
 * - Handle soft delete semantics
 *
 * This interface does NOT:
 * - Contain any implementation
 * - Contain SQL queries
 * - Contain Supabase types
 * - Contain infrastructure code
 */

import type { User } from '../entities/User';
import type { UserId } from '../value-objects/UserId';
import type { TelegramId } from '../value-objects/TelegramId';
import type { Username } from '../value-objects/Username';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import type { RepositoryError } from '../../../shared/errors/repository.error';

/**
 * Filter parameters for listing users.
 */
export interface UserFilterParams {
  /** Filter by user status */
  status?: string;
  /** Filter by premium status */
  isPremium?: boolean;
  /** Filter by language code */
  languageCode?: string;
  /** Filter users seen after this date */
  seenAfter?: Date;
  /** Filter users seen before this date */
  seenBefore?: Date;
}

/**
 * User repository interface.
 * Defines the contract for all User persistence operations.
 */
export interface IUserRepository {
  /**
   * Creates a new user.
   * @param user The user entity to create
   * @returns The created user with generated ID
   * @throws RepositoryError if creation fails
   */
  create(user: User): Promise<User>;

  /**
   * Finds a user by their internal ID.
   * @param id The user ID to find
   * @returns The user if found, null otherwise
   * @throws RepositoryError if query fails
   */
  findById(id: UserId): Promise<User | null>;

  /**
   * Finds a user by their Telegram ID.
   * @param telegramId The Telegram ID to find
   * @returns The user if found, null otherwise
   * @throws RepositoryError if query fails
   */
  findByTelegramId(telegramId: TelegramId): Promise<User | null>;

  /**
   * Finds a user by their Telegram username.
   * @param username The username to find
   * @returns The user if found, null otherwise
   * @throws RepositoryError if query fails
   */
  findByUsername(username: Username): Promise<User | null>;

  /**
   * Checks if a user exists by their internal ID.
   * @param id The user ID to check
   * @returns True if user exists, false otherwise
   * @throws RepositoryError if query fails
   */
  exists(id: UserId): Promise<boolean>;

  /**
   * Updates an existing user.
   * @param user The user entity with updated data
   * @returns The updated user
   * @throws RepositoryError if update fails
   */
  update(user: User): Promise<User>;

  /**
   * Updates the last seen timestamp for a user.
   * @param id The user ID
   * @returns The updated user
   * @throws RepositoryError if update fails
   */
  updateLastSeen(id: UserId): Promise<User>;

  /**
   * Soft deletes a user (sets status to DELETED).
   * @param id The user ID to delete
   * @throws RepositoryError if deletion fails
   */
  softDelete(id: UserId): Promise<void>;

  /**
   * Restores a soft-deleted user.
   * @param id The user ID to restore
   * @returns The restored user
   * @throws RepositoryError if restoration fails
   */
  restore(id: UserId): Promise<User>;

  /**
   * Lists users with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of users
   * @throws RepositoryError if query fails
   */
  list(
    params: PaginationParams,
    filters?: UserFilterParams
  ): Promise<PaginatedResult<User>>;

  /**
   * Counts total users with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching users
   * @throws RepositoryError if count fails
   */
  count(filters?: UserFilterParams): Promise<number>;
}