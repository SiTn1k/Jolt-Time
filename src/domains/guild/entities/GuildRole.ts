/**
 * GuildRole Entity
 *
 * Domain entity representing a guild role definition.
 * Roles define permissions within a guild.
 */

import type { IGuildRole } from '../interfaces/IGuildRole';
import { GuildRoleId } from './GuildRoleId';
import type { GuildRoleType } from '../types/GuildRoleType';
import type { GuildPermission } from '../types/GuildPermission';

/**
 * GuildRole entity props for constructor.
 */
export interface GuildRoleProps {
  roleId: GuildRoleId;
  name: string;
  permissions: GuildPermission[];
  priority: number;
  metadata: Record<string, unknown>;
}

/**
 * Database record representation of GuildRole.
 */
export interface GuildRoleRecord {
  roleId: string;
  name: string;
  permissions: GuildPermission[];
  priority: number;
  metadata: Record<string, unknown>;
}

/**
 * JSON serialization representation of GuildRole.
 */
export interface GuildRoleJSON {
  roleId: string;
  name: string;
  roleType: GuildRoleType;
  permissions: GuildPermission[];
  priority: number;
  metadata: Record<string, unknown>;
}

/**
 * GuildRole entity class.
 * Immutable domain entity representing a guild role.
 */
export class GuildRole implements IGuildRole {
  public readonly roleId: GuildRoleId;
  public readonly name: string;
  public readonly permissions: GuildPermission[];
  public readonly priority: number;
  public readonly metadata: Record<string, unknown>;

  /**
   * Creates a new GuildRole instance.
   */
  constructor(props: GuildRoleProps) {
    this.roleId = props.roleId;
    this.name = props.name;
    this.permissions = props.permissions;
    this.priority = props.priority;
    this.metadata = props.metadata;
  }

  /**
   * Gets the role type from metadata.
   */
  public get roleType(): GuildRoleType {
    return (this.metadata.roleType as GuildRoleType) ?? 'member';
  }

  /**
   * Creates a new GuildRole entity from a role type.
   */
  public static fromRoleType(roleType: GuildRoleType): GuildRole {
    const roleConfigs: Record<GuildRoleType, { name: string; permissions: GuildPermission[]; priority: number }> = {
      leader: {
        name: 'Guild Leader',
        permissions: [
          'guild:edit_name',
          'guild:edit_description',
          'guild:edit_icon',
          'guild:kick_member',
          'guild:promote_officer',
          'guild:demote_officer',
          'guild:transfer_leadership',
          'guild:invite_member',
          'guild:accept_application',
          'guild:create_mission',
          'guild:start_war',
          'guild:manage_war',
          'guild:view_statistics',
          'guild:participate_mission',
          'guild:donate',
          'guild:chat',
        ],
        priority: 1,
      },
      officer: {
        name: 'Guild Officer',
        permissions: [
          'guild:kick_member',
          'guild:invite_member',
          'guild:accept_application',
          'guild:create_mission',
          'guild:manage_war',
          'guild:view_statistics',
          'guild:participate_mission',
          'guild:donate',
          'guild:chat',
        ],
        priority: 2,
      },
      member: {
        name: 'Guild Member',
        permissions: [
          'guild:view_statistics',
          'guild:participate_mission',
          'guild:donate',
          'guild:chat',
        ],
        priority: 3,
      },
    };

    const config = roleConfigs[roleType];

    return new GuildRole({
      roleId: GuildRoleId.create(),
      name: config.name,
      permissions: config.permissions,
      priority: config.priority,
      metadata: { roleType },
    });
  }

  /**
   * Reconstructs a GuildRole from stored data.
   */
  public static fromStorage(record: GuildRoleRecord): GuildRole {
    return new GuildRole({
      roleId: GuildRoleId.reconstruct(record.roleId),
      name: record.name,
      permissions: record.permissions,
      priority: record.priority,
      metadata: record.metadata,
    });
  }

  /**
   * Checks if this role has a specific permission.
   */
  public hasPermission(permission: GuildPermission): boolean {
    return this.permissions.includes(permission);
  }

  /**
   * Creates a copy with updated fields.
   */
  public copyWith(params: Partial<Omit<GuildRoleProps, 'roleId'>>): GuildRole {
    return new GuildRole({
      roleId: this.roleId,
      name: params.name ?? this.name,
      permissions: params.permissions ?? this.permissions,
      priority: params.priority ?? this.priority,
      metadata: params.metadata ?? this.metadata,
    });
  }

  /**
   * Serializes the GuildRole to a plain object.
   */
  public toJSON(): GuildRoleJSON {
    return {
      roleId: String(this.roleId),
      name: this.name,
      roleType: this.roleType,
      permissions: this.permissions,
      priority: this.priority,
      metadata: this.metadata,
    };
  }

  /**
   * Converts to database record format.
   */
  public toRecord(): GuildRoleRecord {
    return {
      roleId: String(this.roleId),
      name: this.name,
      permissions: this.permissions,
      priority: this.priority,
      metadata: this.metadata,
    };
  }
}
