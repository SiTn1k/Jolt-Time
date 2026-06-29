/**
 * Admin Repository Interface
 *
 * Contract for Admin data access operations.
 * This interface defines all allowed operations on Admin storage.
 *
 * Responsibilities:
 * - Define data access contract for Admin entities
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

import type { AdminAccount } from '../entities/AdminAccount';
import type { AdminRole } from '../entities/AdminRole';
import type { AdminPermission } from '../entities/AdminPermission';
import type { AdminId } from '../value-objects/AdminId';
import type { AdminRoleId } from '../value-objects/AdminRoleId';
import type { PermissionId } from '../value-objects/PermissionId';
import type { TelegramId } from '../../user/value-objects/TelegramId';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import type { RepositoryError } from '../../../shared/errors/repository.error';
import type { AdminStatus } from '../types/AdminStatus';
import type { AdminRoleType } from '../types/AdminRoleType';

/**
 * Filter parameters for listing admin accounts.
 */
export interface AdminFilterParams {
  /** Filter by admin status */
  status?: AdminStatus;
  /** Filter by role type */
  roleType?: AdminRoleType;
  /** Filter by department */
  department?: string;
  /** Filter admins seen after this date */
  createdAfter?: Date;
  /** Filter admins seen before this date */
  createdBefore?: Date;
}

/**
 * Filter parameters for listing admin roles.
 */
export interface AdminRoleFilterParams {
  /** Filter by role type */
  type?: AdminRoleType;
  /** Filter by priority >= value */
  minPriority?: number;
  /** Filter by priority <= value */
  maxPriority?: number;
}

/**
 * Filter parameters for listing admin permissions.
 */
export interface AdminPermissionFilterParams {
  /** Filter by module */
  module?: string;
}

/**
 * Admin repository interface.
 * Defines the contract for all Admin persistence operations.
 */
export interface IAdminRepository {
  // ============ Admin Account Operations ============

  /**
   * Creates a new admin account.
   * @param account The admin account entity to create
   * @returns The created admin account with generated ID
   * @throws RepositoryError if creation fails
   */
  createAdmin(account: AdminAccount): Promise<AdminAccount>;

  /**
   * Finds an admin account by their internal ID.
   * @param id The admin ID to find
   * @returns The admin account if found, null otherwise
   * @throws RepositoryError if query fails
   */
  findAdminById(id: AdminId): Promise<AdminAccount | null>;

  /**
   * Finds an admin account by their Telegram ID.
   * @param telegramId The Telegram ID to find
   * @returns The admin account if found, null otherwise
   * @throws RepositoryError if query fails
   */
  findAdminByTelegramId(telegramId: TelegramId): Promise<AdminAccount | null>;

  /**
   * Checks if an admin account exists by their internal ID.
   * @param id The admin ID to check
   * @returns True if admin exists, false otherwise
   * @throws RepositoryError if query fails
   */
  adminExists(id: AdminId): Promise<boolean>;

  /**
   * Updates an existing admin account.
   * @param account The admin account entity with updated data
   * @returns The updated admin account
   * @throws RepositoryError if update fails
   */
  updateAdmin(account: AdminAccount): Promise<AdminAccount>;

  /**
   * Updates the last login timestamp for an admin.
   * @param id The admin ID
   * @returns The updated admin account
   * @throws RepositoryError if update fails
   */
  updateLastLogin(id: AdminId): Promise<AdminAccount>;

  /**
   * Soft deletes an admin account (sets status to DELETED equivalent).
   * @param id The admin ID to delete
   * @throws RepositoryError if deletion fails
   */
  softDeleteAdmin(id: AdminId): Promise<void>;

  /**
   * Lists admin accounts with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of admin accounts
   * @throws RepositoryError if query fails
   */
  listAdmins(
    params: PaginationParams,
    filters?: AdminFilterParams
  ): Promise<PaginatedResult<AdminAccount>>;

  /**
   * Counts total admin accounts with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching admin accounts
   * @throws RepositoryError if count fails
   */
  countAdmins(filters?: AdminFilterParams): Promise<number>;

  // ============ Admin Role Operations ============

  /**
   * Creates a new admin role.
   * @param role The admin role entity to create
   * @returns The created admin role with generated ID
   * @throws RepositoryError if creation fails
   */
  createRole(role: AdminRole): Promise<AdminRole>;

  /**
   * Finds an admin role by their internal ID.
   * @param id The role ID to find
   * @returns The admin role if found, null otherwise
   * @throws RepositoryError if query fails
   */
  findRoleById(id: AdminRoleId): Promise<AdminRole | null>;

  /**
   * Finds an admin role by role type.
   * @param type The role type to find
   * @returns The admin role if found, null otherwise
   * @throws RepositoryError if query fails
   */
  findRoleByType(type: AdminRoleType): Promise<AdminRole | null>;

  /**
   * Updates an existing admin role.
   * @param role The admin role entity with updated data
   * @returns The updated admin role
   * @throws RepositoryError if update fails
   */
  updateRole(role: AdminRole): Promise<AdminRole>;

  /**
   * Deletes an admin role.
   * @param id The role ID to delete
   * @throws RepositoryError if deletion fails
   */
  deleteRole(id: AdminRoleId): Promise<void>;

  /**
   * Lists admin roles with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of admin roles
   * @throws RepositoryError if query fails
   */
  listRoles(
    params: PaginationParams,
    filters?: AdminRoleFilterParams
  ): Promise<PaginatedResult<AdminRole>>;

  /**
   * Gets all system roles.
   * @returns All system admin roles
   * @throws RepositoryError if query fails
   */
  getSystemRoles(): Promise<AdminRole[]>;

  // ============ Admin Permission Operations ============

  /**
   * Creates a new admin permission.
   * @param permission The admin permission entity to create
   * @returns The created admin permission with generated ID
   * @throws RepositoryError if creation fails
   */
  createPermission(permission: AdminPermission): Promise<AdminPermission>;

  /**
   * Finds an admin permission by their internal ID.
   * @param id The permission ID to find
   * @returns The admin permission if found, null otherwise
   * @throws RepositoryError if query fails
   */
  findPermissionById(id: PermissionId): Promise<AdminPermission | null>;

  /**
   * Finds an admin permission by permission key.
   * @param key The permission key to find
   * @returns The admin permission if found, null otherwise
   * @throws RepositoryError if query fails
   */
  findPermissionByKey(key: string): Promise<AdminPermission | null>;

  /**
   * Updates an existing admin permission.
   * @param permission The admin permission entity with updated data
   * @returns The updated admin permission
   * @throws RepositoryError if update fails
   */
  updatePermission(permission: AdminPermission): Promise<AdminPermission>;

  /**
   * Deletes an admin permission.
   * @param id The permission ID to delete
   * @throws RepositoryError if deletion fails
   */
  deletePermission(id: PermissionId): Promise<void>;

  /**
   * Lists admin permissions with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of admin permissions
   * @throws RepositoryError if query fails
   */
  listPermissions(
    params: PaginationParams,
    filters?: AdminPermissionFilterParams
  ): Promise<PaginatedResult<AdminPermission>>;

  /**
   * Gets all system permissions.
   * @returns All system admin permissions
   * @throws RepositoryError if query fails
   */
  getSystemPermissions(): Promise<AdminPermission[]>;
}