/**
 * Guild Role Validator
 *
 * Validates guild role data according to game rules.
 */

import type { GuildRoleType } from '../types/GuildRoleType';
import type { GuildPermission } from '../types/GuildPermission';

const VALID_PERMISSIONS: GuildPermission[] = [
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
];

/**
 * Result of guild role validation.
 */
export interface GuildRoleValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validator for guild role data.
 */
export class GuildRoleValidator {
  /**
   * Validates a role ID format.
   */
  public static isValidRoleId(roleId: string | null | undefined): boolean {
    if (!roleId || roleId.trim().length === 0) {
      return false;
    }
    // UUID format
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return UUID_REGEX.test(roleId);
  }

  /**
   * Validates a role name.
   */
  public static isValidName(name: string | null | undefined): boolean {
    if (!name || name.trim().length === 0) {
      return false;
    }
    return name.length >= 1 && name.length <= 50;
  }

  /**
   * Validates a role type.
   */
  public static isValidRoleType(roleType: string | null | undefined): boolean {
    return roleType === 'leader' || roleType === 'officer' || roleType === 'member';
  }

  /**
   * Validates a permission.
   */
  public static isValidPermission(permission: string | null | undefined): boolean {
    if (!permission) {
      return false;
    }
    return VALID_PERMISSIONS.includes(permission as GuildPermission);
  }

  /**
   * Validates a permissions array.
   */
  public static isValidPermissions(permissions: unknown): boolean {
    if (!Array.isArray(permissions)) {
      return false;
    }
    return permissions.every((p) => this.isValidPermission(p));
  }

  /**
   * Validates role priority.
   */
  public static isValidPriority(priority: number | null | undefined): boolean {
    if (priority === null || priority === undefined) {
      return false;
    }
    return Number.isInteger(priority) && priority >= 1 && priority <= 10;
  }

  /**
   * Validates a complete guild role.
   */
  public static validate(data: {
    roleId?: string;
    name?: string;
    roleType?: GuildRoleType;
    permissions?: GuildPermission[];
    priority?: number;
  }): GuildRoleValidationResult {
    const errors: string[] = [];

    if (data.roleId !== undefined) {
      if (!data.roleId || data.roleId.trim().length === 0) {
        errors.push('Role ID is required');
      } else if (!this.isValidRoleId(data.roleId)) {
        errors.push('Role ID must be a valid UUID');
      }
    }

    if (data.name !== undefined) {
      if (!this.isValidName(data.name)) {
        errors.push('Role name is required and must be 1-50 characters');
      }
    }

    if (data.roleType !== undefined) {
      if (!this.isValidRoleType(data.roleType)) {
        errors.push('Role type must be leader, officer, or member');
      }
    }

    if (data.permissions !== undefined) {
      if (!this.isValidPermissions(data.permissions)) {
        errors.push('Permissions must be a valid array of permission strings');
      }
    }

    if (data.priority !== undefined) {
      if (!this.isValidPriority(data.priority)) {
        errors.push('Priority must be an integer between 1 and 10');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates guild role data and throws if invalid.
   */
  public static validateOrThrow(data: {
    roleId?: string;
    name?: string;
    roleType?: GuildRoleType;
    permissions?: GuildPermission[];
    priority?: number;
  }): void {
    const result = this.validate(data);
    if (!result.isValid) {
      throw new Error(`Guild role validation failed: ${result.errors.join('; ')}`);
    }
  }
}
