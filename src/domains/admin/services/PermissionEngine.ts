/**
 * Permission Engine
 *
 * Core RBAC (Role-Based Access Control) engine for admin permissions.
 * Handles permission validation, priority checks, and inherited permissions.
 */

import type { AdminAccount } from '../entities/AdminAccount';
import type { AdminRole } from '../entities/AdminRole';
import type { AdminId } from '../value-objects/AdminId';
import type { AdminRoleId } from '../value-objects/AdminRoleId';
import { AdminRoleType, ADMIN_ROLE_PRIORITY } from '../types/AdminRoleType';
import type { AdminPermissionType } from '../types/AdminPermissionType';
import type { ILogger } from '../../../shared/types';
import { getLogger } from '../../../core/logging/logger.service';

/**
 * Permission check result.
 */
export interface PermissionCheckResult {
  /** Whether the permission check passed */
  allowed: boolean;

  /** Reason for denial (if not allowed) */
  reason?: string;

  /** The permission that was checked */
  permission?: AdminPermissionType;

  /** The admin ID that was checked */
  adminId?: string;
}

/**
 * Role assignment validation result.
 */
export interface RoleAssignmentResult {
  /** Whether the assignment is allowed */
  allowed: boolean;

  /** Reason for denial (if not allowed) */
  reason?: string;

  /** Validation errors */
  errors: string[];
}

/**
 * Permission validation result.
 */
export interface PermissionValidationResult {
  /** Whether the validation passed */
  valid: boolean;

  /** Validation errors */
  errors: string[];
}

/**
 * Permission Engine
 *
 * Central engine for all permission-related operations.
 * Implements RBAC with priority hierarchy and permission inheritance.
 */
export class PermissionEngine {
  private readonly logger: ILogger;

  /**
   * Creates a new PermissionEngine instance.
   */
  constructor() {
    this.logger = getLogger().child({ module: 'PermissionEngine' });
  }

  // #region Permission Checking
  // ================================================================================

  /**
   * Checks if an admin has a specific permission through their role.
   * @param admin The admin account to check
   * @param role The admin's role
   * @param permission The permission to check
   * @returns Permission check result
   */
  checkPermission(
    admin: AdminAccount,
    role: AdminRole,
    permission: AdminPermissionType
  ): PermissionCheckResult {
    // Check if admin is active
    if (!admin.isActive()) {
      return {
        allowed: false,
        reason: 'Admin account is not active',
        permission,
        adminId: admin.id.value,
      };
    }

    // Check if role has the permission
    if (!role.hasPermission(permission)) {
      this.logger.debug('Permission denied', {
        adminId: admin.id.value,
        permission,
        rolePermissions: Array.from(role.permissions),
      });

      return {
        allowed: false,
        reason: `Role ${role.name} does not have permission: ${permission}`,
        permission,
        adminId: admin.id.value,
      };
    }

    return {
      allowed: true,
      permission,
      adminId: admin.id.value,
    };
  }

  /**
   * Checks if an admin has all specified permissions.
   * @param admin The admin account to check
   * @param role The admin's role
   * @param permissions Array of permissions to check
   * @returns True if admin has all permissions
   */
  checkAllPermissions(
    admin: AdminAccount,
    role: AdminRole,
    permissions: AdminPermissionType[]
  ): boolean {
    return permissions.every((permission) =>
      this.checkPermission(admin, role, permission).allowed
    );
  }

  /**
   * Checks if an admin has any of the specified permissions.
   * @param admin The admin account to check
   * @param role The admin's role
   * @param permissions Array of permissions to check
   * @returns True if admin has any of the permissions
   */
  checkAnyPermission(
    admin: AdminAccount,
    role: AdminRole,
    permissions: AdminPermissionType[]
  ): boolean {
    return permissions.some((permission) =>
      this.checkPermission(admin, role, permission).allowed
    );
  }

  /**
   * Gets all effective permissions for an admin (including inherited).
   * @param role The admin's role
   * @returns Set of all effective permissions
   */
  getEffectivePermissions(role: AdminRole): Set<AdminPermissionType> {
    // For now, just return the role's direct permissions
    // In a more complex system, this could include inherited permissions from parent roles
    return new Set(role.permissions);
  }

  // ================================================================================
  // #endregion

  // #region Role Priority Validation
  // ================================================================================

  /**
   * Checks if a role can manage another role based on priority.
   * @param managerRole The role of the admin performing the action
   * @param targetRole The role being targeted
   * @returns True if manager can manage target
   */
  canManageRole(managerRole: AdminRole, targetRole: AdminRole): boolean {
    return managerRole.hasHigherOrEqualPriority(targetRole);
  }

  /**
   * Checks if a role type can manage another role type based on priority.
   * @param managerType The role type of the admin performing the action
   * @param targetType The role type being targeted
   * @returns True if manager can manage target
   */
  canManageRoleType(managerType: AdminRoleType, targetType: AdminRoleType): boolean {
    return ADMIN_ROLE_PRIORITY[managerType] >= ADMIN_ROLE_PRIORITY[targetType];
  }

  /**
   * Gets the priority level for a role type.
   */
  getRolePriority(roleType: AdminRoleType): number {
    return ADMIN_ROLE_PRIORITY[roleType];
  }

  /**
   * Compares two role priorities.
   * @returns Negative if roleA < roleB, 0 if equal, positive if roleA > roleB
   */
  compareRolePriority(roleA: AdminRoleType, roleB: AdminRoleType): number {
    return ADMIN_ROLE_PRIORITY[roleA] - ADMIN_ROLE_PRIORITY[roleB];
  }

  // ================================================================================
  // #endregion

  // #region Role Assignment Validation
  // ================================================================================

  /**
   * Validates a role assignment operation.
   * @param performer The admin performing the assignment
   * @param targetAdmin The admin being assigned a role
   * @param newRole The role being assigned
   * @returns Role assignment result
   */
  validateRoleAssignment(
    performer: AdminAccount,
    targetAdmin: AdminAccount,
    newRole: AdminRole
  ): RoleAssignmentResult {
    const errors: string[] = [];

    // Self-assignment check
    if (performer.id.value === targetAdmin.id.value) {
      errors.push('Cannot change your own role');
    }

    // Owner protection - only owner can assign owner role
    if (newRole.type === AdminRoleType.OWNER) {
      if (performer.roleType !== AdminRoleType.OWNER) {
        errors.push('Only Owner can assign Owner role');
      }
    }

    // Priority check - can only assign roles with lower or equal priority
    if (!this.canManageRoleType(performer.roleType, newRole.type)) {
      errors.push(
        `Role ${performer.roleType} cannot assign role ${newRole.type} (insufficient priority)`
      );
    }

    // Target owner protection - only owner can modify owner
    if (targetAdmin.roleType === AdminRoleType.OWNER && performer.roleType !== AdminRoleType.OWNER) {
      errors.push('Only Owner can modify another Owner');
    }

    return {
      allowed: errors.length === 0,
      errors,
      reason: errors.length > 0 ? errors.join('; ') : undefined,
    };
  }

  /**
   * Validates role removal.
   * @param performer The admin performing the removal
   * @param targetAdmin The admin losing their role
   * @returns Role removal result
   */
  validateRoleRemoval(
    performer: AdminAccount,
    targetAdmin: AdminAccount
  ): RoleAssignmentResult {
    const errors: string[] = [];

    // Self-removal check
    if (performer.id.value === targetAdmin.id.value) {
      errors.push('Cannot remove your own role');
    }

    // Owner protection
    if (targetAdmin.roleType === AdminRoleType.OWNER && performer.roleType !== AdminRoleType.OWNER) {
      errors.push('Only Owner can modify another Owner');
    }

    return {
      allowed: errors.length === 0,
      errors,
      reason: errors.length > 0 ? errors.join('; ') : undefined,
    };
  }

  // ================================================================================
  // #endregion

  // #region Permission Validation
  // ================================================================================

  /**
   * Validates a permission key format.
   * @param permissionKey The permission key to validate
   * @returns Validation result
   */
  validatePermissionKey(permissionKey: string): PermissionValidationResult {
    const errors: string[] = [];

    if (!permissionKey || permissionKey.trim().length === 0) {
      errors.push('Permission key is required');
      return { valid: false, errors };
    }

    // Format: resource:action or resource:subresource:action
    const parts = permissionKey.split(':');
    if (parts.length < 2) {
      errors.push('Permission key must be in format: resource:action');
    }

    if (parts.length > 3) {
      errors.push('Permission key must be at most 3 parts (resource:subresource:action)');
    }

    for (const part of parts) {
      if (part.length === 0) {
        errors.push('Permission key parts cannot be empty');
      }
      if (!/^[a-z_]+$/.test(part)) {
        errors.push('Permission key parts must contain only lowercase letters and underscores');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates permission set for a role (no duplicates, valid keys).
   * @param permissions Array of permission keys
   * @returns Validation result
   */
  validatePermissionSet(permissions: AdminPermissionType[]): PermissionValidationResult {
    const errors: string[] = [];

    if (!permissions || !Array.isArray(permissions)) {
      errors.push('Permissions must be an array');
      return { valid: false, errors };
    }

    if (permissions.length === 0) {
      errors.push('At least one permission is required');
    }

    // Check for duplicates
    const uniquePermissions = new Set(permissions);
    if (uniquePermissions.size !== permissions.length) {
      errors.push('Duplicate permissions are not allowed');
    }

    // Validate each permission key
    for (const permission of permissions) {
      const keyValidation = this.validatePermissionKey(permission);
      if (!keyValidation.valid) {
        errors.push(...keyValidation.errors.map((e) => `${permission}: ${e}`));
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Checks if adding a permission would create a duplicate.
   * @param currentPermissions Current permission set
   * @param newPermission Permission to add
   * @returns True if adding would create duplicate
   */
  wouldCreateDuplicate(
    currentPermissions: Set<AdminPermissionType>,
    newPermission: AdminPermissionType
  ): boolean {
    return currentPermissions.has(newPermission);
  }

  /**
   * Merges two permission sets without duplicates.
   * @param base Base permission set
   * @param additional Permissions to add
   * @returns Merged permission set
   */
  mergePermissions(
    base: Set<AdminPermissionType>,
    additional: AdminPermissionType[]
  ): Set<AdminPermissionType> {
    const merged = new Set(base);
    for (const permission of additional) {
      merged.add(permission);
    }
    return merged;
  }

  /**
   * Removes permissions from a set.
   * @param base Base permission set
   * @param toRemove Permissions to remove
   * @returns New permission set
   */
  removePermissions(
    base: Set<AdminPermissionType>,
    toRemove: AdminPermissionType[]
  ): Set<AdminPermissionType> {
    const result = new Set(base);
    for (const permission of toRemove) {
      result.delete(permission);
    }
    return result;
  }

  // ================================================================================
  // #endregion

  // #region Security Rules
  // ================================================================================

  /**
   * Checks if an admin account is protected from modification.
   * @param admin The admin account to check
   * @returns True if admin is protected
   */
  isProtectedAdmin(admin: AdminAccount): boolean {
    // Owner is always protected
    return admin.roleType === AdminRoleType.OWNER;
  }

  /**
   * Checks if a role is protected from deletion.
   * @param role The role to check
   * @returns True if role is protected
   */
  isProtectedRole(role: AdminRole): boolean {
    // System roles and owner role are protected
    return role.metadata.isSystemRole || role.type === AdminRoleType.OWNER;
  }

  /**
   * Validates that an admin can be disabled.
   * @param performer The admin performing the action
   * @param target The admin being disabled
   * @returns Validation result
   */
  validateDisableAdmin(
    performer: AdminAccount,
    target: AdminAccount
  ): RoleAssignmentResult {
    const errors: string[] = [];

    // Self-disable protection
    if (performer.id.value === target.id.value) {
      errors.push('Cannot disable yourself');
    }

    // Owner protection
    if (target.roleType === AdminRoleType.OWNER && performer.roleType !== AdminRoleType.OWNER) {
      errors.push('Only Owner can disable another Owner');
    }

    // Priority check
    if (!this.canManageRoleType(performer.roleType, target.roleType)) {
      errors.push('Insufficient priority to disable this admin');
    }

    return {
      allowed: errors.length === 0,
      errors,
      reason: errors.length > 0 ? errors.join('; ') : undefined,
    };
  }

  /**
   * Validates that an admin can be deleted.
   * @param performer The admin performing the action
   * @param target The admin being deleted
   * @returns Validation result
   */
  validateDeleteAdmin(
    performer: AdminAccount,
    target: AdminAccount
  ): RoleAssignmentResult {
    const errors: string[] = [];

    // Self-delete protection
    if (performer.id.value === target.id.value) {
      errors.push('Cannot delete yourself');
    }

    // Owner protection
    if (target.roleType === AdminRoleType.OWNER && performer.roleType !== AdminRoleType.OWNER) {
      errors.push('Only Owner can delete another Owner');
    }

    // Priority check
    if (!this.canManageRoleType(performer.roleType, target.roleType)) {
      errors.push('Insufficient priority to delete this admin');
    }

    return {
      allowed: errors.length === 0,
      errors,
      reason: errors.length > 0 ? errors.join('; ') : undefined,
    };
  }

  // ================================================================================
  // #endregion

  // #region Permission Analysis
  // ================================================================================

  /**
   * Gets missing permissions for an admin to perform an action.
   * @param admin The admin to check
   * @param role The admin's role
   * @param requiredPermissions Permissions required for the action
   * @returns Array of missing permissions
   */
  getMissingPermissions(
    admin: AdminAccount,
    role: AdminRole,
    requiredPermissions: AdminPermissionType[]
  ): AdminPermissionType[] {
    return requiredPermissions.filter(
      (permission) => !this.checkPermission(admin, role, permission).allowed
    );
  }

  /**
   * Checks if an admin has all permissions for a specific module.
   * @param admin The admin to check
   * @param role The admin's role
   * @param moduleName The module name (e.g., 'admin_account')
   * @returns True if admin has all module permissions
   */
  hasModulePermissions(
    admin: AdminAccount,
    role: AdminRole,
    moduleName: string
  ): boolean {
    const modulePermissions = this.getModulePermissions(moduleName);
    return this.checkAllPermissions(admin, role, modulePermissions);
  }

  /**
   * Gets all permissions for a specific module.
   * @param moduleName The module name
   * @returns Array of permissions for the module
   */
  getModulePermissions(moduleName: string): AdminPermissionType[] {
    const modulePrefix = `admin:${moduleName.replace('_', ':')}:`;
    // This would typically come from a configuration
    // For now, return empty array as we don't have module-permission mapping
    return [];
  }

  /**
   * Gets a summary of an admin's permission coverage.
   * @param admin The admin to analyze
   * @param role The admin's role
   * @returns Permission summary
   */
  getPermissionSummary(
    admin: AdminAccount,
    role: AdminRole
  ): {
    totalPermissions: number;
    permissionCategories: Record<string, number>;
    isOwner: boolean;
    isAdministrator: boolean;
  } {
    const permissions = Array.from(role.permissions);

    // Count permissions by category (first part of permission key)
    const categories: Record<string, number> = {};
    for (const permission of permissions) {
      const category = permission.split(':')[1] || 'unknown';
      categories[category] = (categories[category] || 0) + 1;
    }

    return {
      totalPermissions: permissions.length,
      permissionCategories: categories,
      isOwner: role.type === AdminRoleType.OWNER,
      isAdministrator: role.type === AdminRoleType.ADMINISTRATOR,
    };
  }

  // ================================================================================
  // #endregion
}

/**
 * Default permission engine instance.
 */
let permissionEngineInstance: PermissionEngine | null = null;

/**
 * Gets the default permission engine instance.
 */
export function getPermissionEngine(): PermissionEngine {
  if (!permissionEngineInstance) {
    permissionEngineInstance = new PermissionEngine();
  }
  return permissionEngineInstance;
}