/**
 * Guild Role DTO
 *
 * Data transfer object for guild role information.
 */

import type { GuildRoleType } from '../types/GuildRoleType';
import type { GuildPermission } from '../types/GuildPermission';

/**
 * Input for creating/updating a guild role.
 */
export interface GuildRoleDto {
  /** Role ID */
  roleId: string;
  /** Role name */
  name: string;
  /** Role type */
  roleType: GuildRoleType;
  /** Permissions */
  permissions: GuildPermission[];
  /** Priority (lower = higher rank) */
  priority: number;
}

/**
 * Role creation DTO.
 */
export interface CreateGuildRoleDto {
  /** Role name */
  name: string;
  /** Role type */
  roleType: GuildRoleType;
  /** Custom permissions (optional, defaults to role type defaults) */
  permissions?: GuildPermission[];
}
