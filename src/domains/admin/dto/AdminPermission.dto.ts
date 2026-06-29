/**
 * Admin Permission DTO
 *
 * Data transfer objects for admin permission operations.
 */

import type { AdminPermissionType } from '../types/AdminPermissionType';
import type { AdminModule } from '../types/AdminPermissionType';
import type { AdminPermissionMetadata } from '../types/AdminMetadata';

/**
 * Create admin permission request DTO.
 */
export interface CreateAdminPermissionDto {
  /** Permission key */
  permissionKey: AdminPermissionType;

  /** Human-readable description */
  description: string;

  /** Module this permission belongs to */
  module: AdminModule;

  /** Additional metadata */
  metadata?: Partial<AdminPermissionMetadata>;
}

/**
 * Update admin permission request DTO.
 */
export interface UpdateAdminPermissionDto {
  /** Human-readable description */
  description?: string;

  /** Module this permission belongs to */
  module?: AdminModule;

  /** Additional metadata */
  metadata?: Partial<AdminPermissionMetadata>;
}

/**
 * Admin permission response DTO.
 */
export interface AdminPermissionResponseDto {
  /** Unique internal identifier */
  id: string;

  /** Permission key */
  permissionKey: AdminPermissionType;

  /** Human-readable description */
  description: string;

  /** Module this permission belongs to */
  module: AdminModule;

  /** Additional metadata */
  metadata: AdminPermissionMetadata;
}

/**
 * Admin permission summary DTO (minimal data).
 */
export interface AdminPermissionSummaryDto {
  /** Unique internal identifier */
  id: string;

  /** Permission key */
  permissionKey: AdminPermissionType;

  /** Human-readable description */
  description: string;

  /** Module this permission belongs to */
  module: AdminModule;
}

/**
 * Admin permission list response with pagination.
 */
export interface AdminPermissionListResponseDto {
  /** List of admin permissions */
  permissions: AdminPermissionResponseDto[];

  /** Total count */
  total: number;

  /** Current page */
  page: number;

  /** Page size */
  pageSize: number;

  /** Total pages */
  totalPages: number;
}