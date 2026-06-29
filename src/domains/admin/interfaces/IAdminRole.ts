/**
 * AdminRole Interface
 *
 * Interface defining the contract for AdminRole entity.
 * All AdminRole implementations must adhere to this interface.
 */

import type { AdminRoleId } from '../value-objects/AdminRoleId';
import type { AdminRoleType } from '../types/AdminRoleType';
import type { AdminPermissionType } from '../types/AdminPermissionType';
import type { AdminRoleMetadata } from '../types/AdminMetadata';

/**
 * AdminRole entity interface.
 * Represents a role that defines permissions for admin accounts.
 */
export interface IAdminRole {
  /** Unique internal identifier */
  readonly id: AdminRoleId;

  /** Role name */
  readonly name: string;

  /** Role type for system roles */
  readonly type: AdminRoleType;

  /** Priority level (higher = more authority) */
  readonly priority: number;

  /** Set of permissions granted by this role */
  readonly permissions: Set<AdminPermissionType>;

  /** Additional metadata */
  readonly metadata: AdminRoleMetadata;
}