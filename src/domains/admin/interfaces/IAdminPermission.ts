/**
 * AdminPermission Interface
 *
 * Interface defining the contract for AdminPermission entity.
 * All AdminPermission implementations must adhere to this interface.
 */

import type { PermissionId } from '../value-objects/PermissionId';
import type { AdminPermissionType } from '../types/AdminPermissionType';
import type { AdminModule } from '../types/AdminPermissionType';
import type { AdminPermissionMetadata } from '../types/AdminMetadata';

/**
 * AdminPermission entity interface.
 * Represents a granular permission in the admin system.
 */
export interface IAdminPermission {
  /** Unique internal identifier */
  readonly id: PermissionId;

  /** Permission key (e.g., 'admin:account:read') */
  readonly permissionKey: AdminPermissionType;

  /** Human-readable description */
  readonly description: string;

  /** Module this permission belongs to */
  readonly module: AdminModule;

  /** Additional metadata */
  readonly metadata: AdminPermissionMetadata;
}