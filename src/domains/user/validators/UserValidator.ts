/**
 * User Validator
 *
 * Comprehensive validation for user-related operations.
 */

import type { CreateUserDto } from '../dto/CreateUser.dto';
import type { UpdateUserDto } from '../dto/UpdateUser.dto';
import { UsernameValidator } from './UsernameValidator';
import { LanguageValidator } from './LanguageValidator';
import { UserStatus } from '../types/UserStatus';

/**
 * Validation error details.
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validation result for user validation.
 */
export interface UserValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Comprehensive validator for user operations.
 */
export class UserValidator {
  /**
   * Validates a CreateUserDto.
   * @param dto The DTO to validate
   * @returns Validation result with any errors
   */
  public static validateCreate(dto: CreateUserDto): UserValidationResult {
    const errors: ValidationError[] = [];

    // Telegram ID validation
    if (dto.telegramId === undefined || dto.telegramId === null) {
      errors.push({ field: 'telegramId', message: 'Telegram ID is required' });
    } else if (typeof dto.telegramId !== 'number' || !Number.isInteger(dto.telegramId)) {
      errors.push({ field: 'telegramId', message: 'Telegram ID must be an integer' });
    } else if (dto.telegramId <= 0) {
      errors.push({ field: 'telegramId', message: 'Telegram ID must be greater than zero' });
    }

    // First name validation
    if (!dto.firstName || dto.firstName.trim().length === 0) {
      errors.push({ field: 'firstName', message: 'First name is required' });
    } else if (dto.firstName.length > 255) {
      errors.push({ field: 'firstName', message: 'First name must be at most 255 characters' });
    }

    // Last name validation
    if (dto.lastName !== undefined && dto.lastName.length > 255) {
      errors.push({ field: 'lastName', message: 'Last name must be at most 255 characters' });
    }

    // Username validation
    if (dto.username !== undefined) {
      const usernameResult = UsernameValidator.validate(dto.username);
      if (!usernameResult.isValid) {
        errors.push({ field: 'username', message: usernameResult.error || 'Invalid username' });
      }
    }

    // Language code validation
    if (dto.languageCode !== undefined) {
      const langResult = LanguageValidator.validate(dto.languageCode);
      if (!langResult.isValid) {
        errors.push({ field: 'languageCode', message: langResult.error || 'Invalid language code' });
      }
    }

    // Photo URL validation
    if (dto.photoUrl !== undefined && dto.photoUrl !== null && dto.photoUrl.trim().length > 0) {
      try {
        new URL(dto.photoUrl);
      } catch {
        errors.push({ field: 'photoUrl', message: 'Invalid URL format' });
      }
      if (dto.photoUrl.length > 2048) {
        errors.push({ field: 'photoUrl', message: 'Photo URL must be at most 2048 characters' });
      }
    }

    // Status validation
    if (dto.status !== undefined) {
      const validStatuses = Object.values(UserStatus);
      if (!validStatuses.includes(dto.status)) {
        errors.push({
          field: 'status',
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        });
      }
    }

    // Registration source validation
    if (dto.registrationSource !== undefined) {
      const validSources = ['telegram_mini_app', 'telegram_bot', 'web', 'imported', 'system'];
      if (!validSources.includes(dto.registrationSource)) {
        errors.push({
          field: 'registrationSource',
          message: `Invalid registration source. Must be one of: ${validSources.join(', ')}`,
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates an UpdateUserDto.
   * @param dto The DTO to validate
   * @returns Validation result with any errors
   */
  public static validateUpdate(dto: UpdateUserDto): UserValidationResult {
    const errors: ValidationError[] = [];

    // First name validation
    if (dto.firstName !== undefined) {
      if (dto.firstName.trim().length === 0) {
        errors.push({ field: 'firstName', message: 'First name cannot be empty' });
      } else if (dto.firstName.length > 255) {
        errors.push({ field: 'firstName', message: 'First name must be at most 255 characters' });
      }
    }

    // Last name validation
    if (dto.lastName !== undefined && dto.lastName !== null && dto.lastName.length > 255) {
      errors.push({ field: 'lastName', message: 'Last name must be at most 255 characters' });
    }

    // Username validation
    if (dto.username !== undefined) {
      const usernameResult = UsernameValidator.validate(dto.username);
      if (!usernameResult.isValid) {
        errors.push({ field: 'username', message: usernameResult.error || 'Invalid username' });
      }
    }

    // Language code validation
    if (dto.languageCode !== undefined) {
      const langResult = LanguageValidator.validate(dto.languageCode);
      if (!langResult.isValid) {
        errors.push({ field: 'languageCode', message: langResult.error || 'Invalid language code' });
      }
    }

    // Photo URL validation
    if (dto.photoUrl !== undefined && dto.photoUrl !== null && dto.photoUrl.trim().length > 0) {
      try {
        new URL(dto.photoUrl);
      } catch {
        errors.push({ field: 'photoUrl', message: 'Invalid URL format' });
      }
      if (dto.photoUrl.length > 2048) {
        errors.push({ field: 'photoUrl', message: 'Photo URL must be at most 2048 characters' });
      }
    }

    // Status validation
    if (dto.status !== undefined) {
      const validStatuses = Object.values(UserStatus);
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
   * Validates a CreateUserDto and throws if invalid.
   * @param dto The DTO to validate
   * @throws Error with validation details if invalid
   */
  public static validateCreateOrThrow(dto: CreateUserDto): void {
    const result = this.validateCreate(dto);
    if (!result.isValid) {
      const messages = result.errors.map((e) => `${e.field}: ${e.message}`).join('; ');
      throw new Error(`User validation failed: ${messages}`);
    }
  }

  /**
   * Validates an UpdateUserDto and throws if invalid.
   * @param dto The DTO to validate
   * @throws Error with validation details if invalid
   */
  public static validateUpdateOrThrow(dto: UpdateUserDto): void {
    const result = this.validateUpdate(dto);
    if (!result.isValid) {
      const messages = result.errors.map((e) => `${e.field}: ${e.message}`).join('; ');
      throw new Error(`User validation failed: ${messages}`);
    }
  }
}