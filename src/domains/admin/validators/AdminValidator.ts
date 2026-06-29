/**
 * Admin Validator
 *
 * Comprehensive validation for admin-related operations.
 */

import type { CreateAdminAccountDto } from '../dto/AdminAccount.dto';
import type { UpdateAdminAccountDto } from '../dto/AdminAccount.dto';
import { AdminStatus } from '../types/AdminStatus';
import { AdminRoleType, ADMIN_ROLE_PRIORITY } from '../types/AdminRoleType';

/**
 * Validation error details.
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validation result for admin validation.
 */
export interface AdminValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Comprehensive validator for admin account operations.
 */
export class AdminValidator {
  /**
   * Validates a CreateAdminAccountDto.
   * @param dto The DTO to validate
   * @returns Validation result with any errors
   */
  public static validateCreate(dto: CreateAdminAccountDto): AdminValidationResult {
    const errors: ValidationError[] = [];

    // Telegram ID validation
    if (dto.telegramId === undefined || dto.telegramId === null) {
      errors.push({ field: 'telegramId', message: 'Telegram ID is required' });
    } else if (typeof dto.telegramId !== 'number' || !Number.isInteger(dto.telegramId)) {
      errors.push({ field: 'telegramId', message: 'Telegram ID must be an integer' });
    } else if (dto.telegramId <= 0) {
      errors.push({ field: 'telegramId', message: 'Telegram ID must be greater than zero' });
    }

    // Display name validation
    if (!dto.displayName || dto.displayName.trim().length === 0) {
      errors.push({ field: 'displayName', message: 'Display name is required' });
    } else if (dto.displayName.length > 255) {
      errors.push({ field: 'displayName', message: 'Display name must be at most 255 characters' });
    }

    // Username validation (optional)
    if (dto.username !== undefined && dto.username !== null) {
      if (typeof dto.username !== 'string') {
        errors.push({ field: 'username', message: 'Username must be a string' });
      } else if (dto.username.length > 255) {
        errors.push({ field: 'username', message: 'Username must be at most 255 characters' });
      }
    }

    // Role ID validation
    if (!dto.roleId || dto.roleId.trim().length === 0) {
      errors.push({ field: 'roleId', message: 'Role ID is required' });
    }

    // Role type validation
    if (dto.roleType !== undefined) {
      const validRoleTypes = Object.values(AdminRoleType);
      if (!validRoleTypes.includes(dto.roleType)) {
        errors.push({
          field: 'roleType',
          message: `Invalid role type. Must be one of: ${validRoleTypes.join(', ')}`,
        });
      }
    }

    // Status validation (optional)
    if (dto.status !== undefined) {
      const validStatuses = Object.values(AdminStatus);
      if (!validStatuses.includes(dto.status)) {
        errors.push({
          field: 'status',
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates an UpdateAdminAccountDto.
   * @param dto The DTO to validate
   * @returns Validation result with any errors
   */
  public static validateUpdate(dto: UpdateAdminAccountDto): AdminValidationResult {
    const errors: ValidationError[] = [];

    // Display name validation (optional)
    if (dto.displayName !== undefined) {
      if (dto.displayName.trim().length === 0) {
        errors.push({ field: 'displayName', message: 'Display name cannot be empty' });
      } else if (dto.displayName.length > 255) {
        errors.push({ field: 'displayName', message: 'Display name must be at most 255 characters' });
      }
    }

    // Role ID validation (optional)
    if (dto.roleId !== undefined && dto.roleId.trim().length === 0) {
      errors.push({ field: 'roleId', message: 'Role ID cannot be empty' });
    }

    // Role type validation (optional)
    if (dto.roleType !== undefined) {
      const validRoleTypes = Object.values(AdminRoleType);
      if (!validRoleTypes.includes(dto.roleType)) {
        errors.push({
          field: 'roleType',
          message: `Invalid role type. Must be one of: ${validRoleTypes.join(', ')}`,
        });
      }
    }

    // Status validation (optional)
    if (dto.status !== undefined) {
      const validStatuses = Object.values(AdminStatus);
      if (!validStatuses.includes(dto.status)) {
        errors.push({
          field: 'status',
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates a CreateAdminAccountDto and throws if invalid.
   * @param dto The DTO to validate
   * @throws Error with validation details if invalid
   */
  public static validateCreateOrThrow(dto: CreateAdminAccountDto): void {
    const result = this.validateCreate(dto);
    if (!result.isValid) {
      const messages = result.errors.map((e) => `${e.field}: ${e.message}`).join('; ');
      throw new Error(`Admin validation failed: ${messages}`);
    }
  }

  /**
   * Validates an UpdateAdminAccountDto and throws if invalid.
   * @param dto The DTO to validate
   * @throws Error with validation details if invalid
   */
  public static validateUpdateOrThrow(dto: UpdateAdminAccountDto): void {
    const result = this.validateUpdate(dto);
    if (!result.isValid) {
      const messages = result.errors.map((e) => `${e.field}: ${e.message}`).join('; ');
      throw new Error(`Admin validation failed: ${messages}`);
    }
  }

  /**
   * Validates that a role transition is allowed.
   * @param fromStatus Current status
   * @param toStatus Target status
   * @returns Validation result
   */
  public static validateStatusTransition(
    fromStatus: AdminStatus,
    toStatus: AdminStatus
  ): AdminValidationResult {
    const errors: ValidationError[] = [];

    // Define allowed transitions
    const allowedTransitions: Record<AdminStatus, AdminStatus[]> = {
      [AdminStatus.PENDING]: [AdminStatus.ACTIVE, AdminStatus.INACTIVE, AdminStatus.SUSPENDED],
      [AdminStatus.ACTIVE]: [AdminStatus.INACTIVE, AdminStatus.SUSPENDED],
      [AdminStatus.INACTIVE]: [AdminStatus.ACTIVE, AdminStatus.SUSPENDED],
      [AdminStatus.SUSPENDED]: [AdminStatus.ACTIVE, AdminStatus.INACTIVE],
    };

    const allowed = allowedTransitions[fromStatus] || [];
    if (!allowed.includes(toStatus)) {
      errors.push({
        field: 'status',
        message: `Cannot transition from ${fromStatus} to ${toStatus}`,
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates that an admin can be assigned to a role based on hierarchy.
   * @param adminRoleType The admin's current role type
   * @param targetRoleType The role type to assign
   * @returns Validation result
   */
  public static validateRoleAssignment(
    adminRoleType: AdminRoleType,
    targetRoleType: AdminRoleType
  ): AdminValidationResult {
    const errors: ValidationError[] = [];

    const adminPriority = ADMIN_ROLE_PRIORITY[adminRoleType];
    const targetPriority = ADMIN_ROLE_PRIORITY[targetRoleType];

    // Admin can only assign roles with lower or equal priority
    if (adminPriority <= targetPriority) {
      errors.push({
        field: 'roleType',
        message: `Admin with role ${adminRoleType} cannot assign role ${targetRoleType} (insufficient priority)`,
      });
    }

    // Owner role can only be assigned by Owner
    if (targetRoleType === AdminRoleType.OWNER && adminRoleType !== AdminRoleType.OWNER) {
      errors.push({
        field: 'roleType',
        message: 'Only Owner can assign Owner role',
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}