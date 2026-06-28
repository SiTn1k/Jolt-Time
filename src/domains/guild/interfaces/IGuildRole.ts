/**
 * IGuildRole Interface
 *
 * Interface for GuildRole domain entity.
 */

import type { GuildRoleId } from '../entities/GuildRoleId';
import type { GuildRoleType } from '../types/GuildRoleType';
import type { GuildPermission } from '../types/GuildPermission';

/**
 * Guild role entity interface.
 */
export interface IGuildRole {
  /** Unique role identifier */
  readonly roleId: GuildRoleId;
  /** Role name */
  readonly name: string;
  /** Role type (derived from metadata) */
  readonly roleType: GuildRoleType;
  /** Permissions */
  readonly permissions: GuildPermission[];
  /** Priority (lower = higher rank) */
  readonly priority: number;
  /** Additional metadata */
  readonly metadata: Record<string, unknown>;

  /**
   * Checks if this role has a specific permission.
   */
  hasPermission(permission: GuildPermission): boolean;
}
