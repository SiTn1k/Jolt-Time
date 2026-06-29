/**
 * Permission Validator
 *
 * Validation for admin permission operations.
 */

import type { CreateAdminPermissionDto } from '../dto/AdminPermission.dto';
import type { UpdateAdminPermissionDto } from '../dto/AdminPermission.dto';
import type { AdminValidationResult, ValidationError } from './AdminValidator';
import { AdminPermissionType, AdminModule } from '../types/AdminPermissionType';

/**
 * Permission-specific validation result.
 */
export interface PermissionValidationResult extends AdminValidationResult {}

/**
 * Validator for admin permission operations.
 */
export class PermissionValidator {
  /**
   * Validates a CreateAdminPermissionDto.
   * @param dto The DTO to validate
   * @returns Validation result with any errors
   */
  public static validateCreate(dto: CreateAdminPermissionDto): PermissionValidationResult {
    const errors: ValidationError[] = [];

    // Permission key validation
    if (!dto.permissionKey) {
      errors.push({ field: 'permissionKey', message: 'Permission key is required' });
    } else {
      const validPermissions = Object.values(AdminPermissionType);
      if (!validPermissions.includes(dto.permissionKey)) {
        errors.push({
          field: 'permissionKey',
          message: `Invalid permission key. Must be one of: ${validPermissions.join(', ')}`,
        });
      }
    }

    // Description validation
    if (!dto.description || dto.description.trim().length === 0) {
      errors.push({ field: 'description', message: 'Description is required' });
    } else if (dto.description.length > 500) {
      errors.push({ field: 'description', message: 'Description must be at most 500 characters' });
    }

    // Module validation
    if (!dto.module) {
      errors.push({ field: 'module', message: 'Module is required' });
    } else {
      const validModules = Object.values(AdminModule);
      if (!validModules.includes(dto.module)) {
        errors.push({
          field: 'module',
          message: `Invalid module. Must be one of: ${validModules.join(', ')}`,
        });
      }
    }

    // Metadata validation
    if (dto.metadata?.category && dto.metadata.category.length > 100) {
      errors.push({ field: 'metadata.category', message: 'Category must be at most 100 characters' });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates an UpdateAdminPermissionDto.
   * @param dto The DTO to validate
   * @returns Validation result with any errors
   */
  public static validateUpdate(dto: UpdateAdminPermissionDto): PermissionValidationResult {
    const errors: ValidationError[] = [];

    // Description validation (optional)
    if (dto.description !== undefined) {
      if (dto.description.trim().length === 0) {
        errors.push({ field: 'description', message: 'Description cannot be empty' });
      } else if (dto.description.length > 500) {
        errors.push({ field: 'description', message: 'Description must be at most 500 characters' });
      }
    }

    // Module validation (optional)
    if (dto.module !== undefined) {
      const validModules = Object.values(AdminModule);
      if (!validModules.includes(dto.module)) {
        errors.push({
          field: 'module',
          message: `Invalid module. Must be one of: ${validModules.join(', ')}`,
        });
      }
    }

    // Metadata validation
    if (dto.metadata?.category && dto.metadata.category.length > 100) {
      errors.push({ field: 'metadata.category', message: 'Category must be at most 100 characters' });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates a CreateAdminPermissionDto and throws if invalid.
   * @param dto The DTO to validate
   * @throws Error with validation details if invalid
   */
  public static validateCreateOrThrow(dto: CreateAdminPermissionDto): void {
    const result = this.validateCreate(dto);
    if (!result.isValid) {
      const messages = result.errors.map((e) => `${e.field}: ${e.message}`).join('; ');
      throw new Error(`Permission validation failed: ${messages}`);
    }
  }

  /**
   * Validates an UpdateAdminPermissionDto and throws if invalid.
   * @param dto The DTO to validate
   * @throws Error with validation details if invalid
   */
  public static validateUpdateOrThrow(dto: UpdateAdminPermissionDto): void {
    const result = this.validateUpdate(dto);
    if (!result.isValid) {
      const messages = result.errors.map((e) => `${e.field}: ${e.message}`).join('; ');
      throw new Error(`Permission validation failed: ${messages}`);
    }
  }

  /**
   * Validates that a permission key follows the naming convention.
   * Format: module:resource:action
   * @param permissionKey The permission key to validate
   * @returns Validation result
   */
  public static validatePermissionKeyFormat(permissionKey: string): PermissionValidationResult {
    const errors: ValidationError[] = [];

    const keyPattern = /^[a-z_]+:[a-z_]+:[a-z_]+$/;
    if (!keyPattern.test(permissionKey)) {
      errors.push({
        field: 'permissionKey',
        message: 'Permission key must follow format "module:resource:action" (e.g., admin:account:read)',
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates that a permission is not dangerous for the given role type.
   * @param permissionKey The permission to check
   * @param roleType The role type to validate against
   * @returns Validation result
   */
  public static validatePermissionForRole(
    permissionKey: AdminPermissionType,
    roleType: string
  ): PermissionValidationResult {
    const errors: ValidationError[] = [];

    // Define dangerous permissions and their allowed roles
    const dangerousPermissions: Record<string, string[]> = {
      [AdminPermissionType.ADMIN_DELETE]: ['owner', 'administrator'],
      [AdminPermissionType.ADMIN_CREATE]: ['owner', 'administrator'],
      [AdminPermissionType.ROLE_DELETE]: ['owner', 'administrator'],
      [AdminPermissionType.ROLE_CREATE]: ['owner', 'administrator'],
      [AdminPermissionType.ROLE_ASSIGN]: ['owner', 'administrator'],
      [AdminPermissionType.PERMISSION_DELETE]: ['owner', 'administrator'],
      [AdminPermissionType.PERMISSION_CREATE]: ['owner'],
      [AdminPermissionType.CONFIG_UPDATE]: ['owner', 'developer'],
      [AdminPermissionType.BAN_DELETE]: ['owner', 'administrator'],
    };

    const allowedRoles = dangerousPermissions[permissionKey];
    if (allowedRoles && !allowedRoles.includes(roleType.toLowerCase())) {
      errors.push({
        field: 'permission',
        message: `Permission ${permissionKey} cannot be assigned to role ${roleType}`,
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}