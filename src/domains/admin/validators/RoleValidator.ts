/**
 * Role Validator
 *
 * Validation for admin role operations.
 */

import type { CreateAdminRoleDto } from '../dto/AdminRole.dto';
import type { UpdateAdminRoleDto } from '../dto/AdminRole.dto';
import type { AdminValidationResult, ValidationError } from './AdminValidator';
import { AdminValidator } from './AdminValidator';
import { AdminRoleType, ADMIN_ROLE_PRIORITY } from '../types/AdminRoleType';
import { AdminPermissionType } from '../types/AdminPermissionType';

/**
 * Role-specific validation result.
 */
export interface RoleValidationResult extends AdminValidationResult {}

/**
 * Validator for admin role operations.
 */
export class RoleValidator {
  /**
   * Validates a CreateAdminRoleDto.
   * @param dto The DTO to validate
   * @returns Validation result with any errors
   */
  public static validateCreate(dto: CreateAdminRoleDto): RoleValidationResult {
    const errors: ValidationError[] = [];

    // Name validation
    if (!dto.name || dto.name.trim().length === 0) {
      errors.push({ field: 'name', message: 'Role name is required' });
    } else if (dto.name.length > 100) {
      errors.push({ field: 'name', message: 'Role name must be at most 100 characters' });
    }

    // Type validation (optional for custom roles)
    if (dto.type !== undefined) {
      const validTypes = Object.values(AdminRoleType);
      if (!validTypes.includes(dto.type)) {
        errors.push({
          field: 'type',
          message: `Invalid role type. Must be one of: ${validTypes.join(', ')}`,
        });
      }
    }

    // Priority validation
    if (dto.priority === undefined || dto.priority === null) {
      errors.push({ field: 'priority', message: 'Priority is required' });
    } else if (typeof dto.priority !== 'number' || dto.priority < 0) {
      errors.push({ field: 'priority', message: 'Priority must be a non-negative number' });
    } else if (dto.priority > 100) {
      errors.push({ field: 'priority', message: 'Priority must be at most 100' });
    }

    // Permissions validation
    if (!dto.permissions || !Array.isArray(dto.permissions)) {
      errors.push({ field: 'permissions', message: 'Permissions array is required' });
    } else if (dto.permissions.length === 0) {
      errors.push({ field: 'permissions', message: 'At least one permission is required' });
    } else {
      const validPermissions = Object.values(AdminPermissionType);
      for (let i = 0; i < dto.permissions.length; i++) {
        if (!validPermissions.includes(dto.permissions[i])) {
          errors.push({
            field: `permissions[${i}]`,
            message: `Invalid permission: ${dto.permissions[i]}`,
          });
        }
      }

      // Check for duplicate permissions
      const uniquePermissions = new Set(dto.permissions);
      if (uniquePermissions.size !== dto.permissions.length) {
        errors.push({ field: 'permissions', message: 'Duplicate permissions are not allowed' });
      }
    }

    // Metadata validation
    if (dto.metadata?.description && dto.metadata.description.length > 500) {
      errors.push({ field: 'metadata.description', message: 'Description must be at most 500 characters' });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates an UpdateAdminRoleDto.
   * @param dto The DTO to validate
   * @returns Validation result with any errors
   */
  public static validateUpdate(dto: UpdateAdminRoleDto): RoleValidationResult {
    const errors: ValidationError[] = [];

    // Name validation (optional)
    if (dto.name !== undefined) {
      if (dto.name.trim().length === 0) {
        errors.push({ field: 'name', message: 'Role name cannot be empty' });
      } else if (dto.name.length > 100) {
        errors.push({ field: 'name', message: 'Role name must be at most 100 characters' });
      }
    }

    // Priority validation (optional)
    if (dto.priority !== undefined) {
      if (typeof dto.priority !== 'number' || dto.priority < 0) {
        errors.push({ field: 'priority', message: 'Priority must be a non-negative number' });
      } else if (dto.priority > 100) {
        errors.push({ field: 'priority', message: 'Priority must be at most 100' });
      }
    }

    // Permissions validation (optional)
    if (dto.permissions !== undefined) {
      if (!Array.isArray(dto.permissions)) {
        errors.push({ field: 'permissions', message: 'Permissions must be an array' });
      } else if (dto.permissions.length === 0) {
        errors.push({ field: 'permissions', message: 'At least one permission is required' });
      } else {
        const validPermissions = Object.values(AdminPermissionType);
        for (let i = 0; i < dto.permissions.length; i++) {
          if (!validPermissions.includes(dto.permissions[i])) {
            errors.push({
              field: `permissions[${i}]`,
              message: `Invalid permission: ${dto.permissions[i]}`,
            });
          }
        }

        // Check for duplicate permissions
        const uniquePermissions = new Set(dto.permissions);
        if (uniquePermissions.size !== dto.permissions.length) {
          errors.push({ field: 'permissions', message: 'Duplicate permissions are not allowed' });
        }
      }
    }

    // Metadata validation
    if (dto.metadata?.description && dto.metadata.description.length > 500) {
      errors.push({ field: 'metadata.description', message: 'Description must be at most 500 characters' });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates a CreateAdminRoleDto and throws if invalid.
   * @param dto The DTO to validate
   * @throws Error with validation details if invalid
   */
  public static validateCreateOrThrow(dto: CreateAdminRoleDto): void {
    const result = this.validateCreate(dto);
    if (!result.isValid) {
      const messages = result.errors.map((e) => `${e.field}: ${e.message}`).join('; ');
      throw new Error(`Role validation failed: ${messages}`);
    }
  }

  /**
   * Validates an UpdateAdminRoleDto and throws if invalid.
   * @param dto The DTO to validate
   * @throws Error with validation details if invalid
   */
  public static validateUpdateOrThrow(dto: UpdateAdminRoleDto): void {
    const result = this.validateUpdate(dto);
    if (!result.isValid) {
      const messages = result.errors.map((e) => `${e.field}: ${e.message}`).join('; ');
      throw new Error(`Role validation failed: ${messages}`);
    }
  }

  /**
   * Validates that a role can be deleted based on system role rules.
   * @param roleType The role type to validate
   * @param isSystemRole Whether the role is a system role
   * @returns Validation result
   */
  public static validateRoleDeletion(
    roleType: AdminRoleType,
    isSystemRole: boolean
  ): RoleValidationResult {
    const errors: ValidationError[] = [];

    if (isSystemRole) {
      errors.push({
        field: 'role',
        message: 'System roles cannot be deleted',
      });
    }

    if (roleType === AdminRoleType.OWNER) {
      errors.push({
        field: 'role',
        message: 'Owner role cannot be deleted',
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates priority hierarchy when updating a role.
   * @param currentPriority Current role priority
   * @param newPriority New priority to set
   * @returns Validation result
   */
  public static validatePriorityChange(
    currentPriority: number,
    newPriority: number
  ): RoleValidationResult {
    const errors: ValidationError[] = [];

    if (newPriority === currentPriority) {
      errors.push({
        field: 'priority',
        message: 'New priority is the same as current priority',
      });
    }

    if (newPriority < 1 || newPriority > 100) {
      errors.push({
        field: 'priority',
        message: 'Priority must be between 1 and 100',
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}