/**
 * Admin Role DTO
 *
 * Data transfer objects for admin role operations.
 */

import type { AdminRoleType } from '../types/AdminRoleType';
import type { AdminPermissionType } from '../types/AdminPermissionType';
import type { AdminRoleMetadata } from '../types/AdminMetadata';

/**
 * Create admin role request DTO.
 */
export interface CreateAdminRoleDto {
  /** Role name */
  name: string;

  /** Role type (optional for custom roles) */
  type?: AdminRoleType;

  /** Priority level */
  priority: number;

  /** Set of permissions */
  permissions: AdminPermissionType[];

  /** Additional metadata */
  metadata?: Partial<AdminRoleMetadata>;
}

/**
 * Update admin role request DTO.
 */
export interface UpdateAdminRoleDto {
  /** Role name */
  name?: string;

  /** Priority level */
  priority?: number;

  /** Set of permissions */
  permissions?: AdminPermissionType[];

  /** Additional metadata */
  metadata?: Partial<AdminRoleMetadata>;
}

/**
 * Admin role response DTO.
 */
export interface AdminRoleResponseDto {
  /** Unique internal identifier */
  id: string;

  /** Role name */
  name: string;

  /** Role type */
  type: AdminRoleType;

  /** Priority level */
  priority: number;

  /** Set of permissions */
  permissions: AdminPermissionType[];

  /** Additional metadata */
  metadata: AdminRoleMetadata;
}

/**
 * Admin role summary DTO (minimal data).
 */
export interface AdminRoleSummaryDto {
  /** Unique internal identifier */
  id: string;

  /** Role name */
  name: string;

  /** Role type */
  type: AdminRoleType;

  /** Priority level */
  priority: number;
}

/**
 * Admin role list response with pagination.
 */
export interface AdminRoleListResponseDto {
  /** List of admin roles */
  roles: AdminRoleResponseDto[];

  /** Total count */
  total: number;

  /** Current page */
  page: number;

  /** Page size */
  pageSize: number;

  /** Total pages */
  totalPages: number;
}