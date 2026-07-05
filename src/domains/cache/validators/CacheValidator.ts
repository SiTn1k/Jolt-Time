/**
 * CacheValidator
 *
 * Validator for cache entry operations.
 * Validates cache key, value, and entry operations.
 */

import type { CacheEntry } from '../entities/CacheEntry';
import type { CacheType } from '../types/CacheType';
import type { CacheStatus } from '../types/CacheStatus';
import type { CacheEntryMetadata } from '../types/CacheMetadata';

/**
 * Validation result type.
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * CacheValidator class.
 * Provides validation methods for cache entry operations.
 */
export class CacheValidator {
  /**
   * Validates a cache key.
   */
  public validateCacheKey(key: string): ValidationResult {
    const errors: string[] = [];

    if (!key || key.trim().length === 0) {
      errors.push('Cache key cannot be empty');
    }

    if (key.length > 512) {
      errors.push('Cache key exceeds maximum length of 512 characters');
    }

    // Check for reserved prefixes
    const reservedPrefixes = ['__system__', '__admin__', '__internal__'];
    for (const prefix of reservedPrefixes) {
      if (key.startsWith(prefix)) {
        errors.push(`Cache key cannot start with reserved prefix: ${prefix}`);
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates cache entry creation parameters.
   */
  public validateCreateEntry(params: {
    cacheKey: string;
    cacheValue: unknown;
    cacheType: CacheType;
    expiresAt?: string | null;
  }): ValidationResult {
    const errors: string[] = [];

    // Validate cache key
    const keyValidation = this.validateCacheKey(params.cacheKey);
    errors.push(...keyValidation.errors);

    // Validate cache type
    const validTypes: CacheType[] = ['memory', 'configuration', 'player', 'museum', 'quest', 'guild', 'analytics', 'temporary'];
    if (!validTypes.includes(params.cacheType)) {
      errors.push(`Invalid cache type. Valid types are: ${validTypes.join(', ')}`);
    }

    // Validate cache value is not undefined
    if (params.cacheValue === undefined) {
      errors.push('Cache value cannot be undefined');
    }

    // Validate expiresAt if provided
    if (params.expiresAt !== undefined && params.expiresAt !== null) {
      const date = new Date(params.expiresAt);
      if (isNaN(date.getTime())) {
        errors.push('Invalid expiresAt date format');
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates cache entry update parameters.
   */
  public validateUpdateEntry(params: {
    cacheValue?: unknown;
    status?: CacheStatus;
    expiresAt?: string | null;
  }): ValidationResult {
    const errors: string[] = [];

    // Validate status if provided
    if (params.status !== undefined) {
      const validStatuses: CacheStatus[] = ['active', 'expired', 'invalidated', 'evicted'];
      if (!validStatuses.includes(params.status)) {
        errors.push(`Invalid status. Valid statuses are: ${validStatuses.join(', ')}`);
      }
    }

    // Validate cache value if provided
    if (params.cacheValue !== undefined && params.cacheValue === undefined) {
      errors.push('Cache value cannot be undefined');
    }

    // Validate expiresAt if provided
    if (params.expiresAt !== undefined && params.expiresAt !== null) {
      const date = new Date(params.expiresAt);
      if (isNaN(date.getTime())) {
        errors.push('Invalid expiresAt date format');
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates a cache entry entity.
   */
  public validateEntry(entry: CacheEntry): ValidationResult {
    const errors: string[] = [];

    if (!entry.cacheKey) {
      errors.push('Cache key is required');
    }

    const validTypes: CacheType[] = ['memory', 'configuration', 'player', 'museum', 'quest', 'guild', 'analytics', 'temporary'];
    if (!validTypes.includes(entry.cacheType)) {
      errors.push('Valid cache type is required');
    }

    const validStatuses: CacheStatus[] = ['active', 'expired', 'invalidated', 'evicted'];
    if (!validStatuses.includes(entry.status)) {
      errors.push('Valid cache status is required');
    }

    if (entry.expiresAt !== null) {
      const now = new Date();
      if (entry.expiresAt < now) {
        errors.push('Expiration date cannot be in the past');
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates cache entry metadata.
   */
  public validateEntryMetadata(metadata: CacheEntryMetadata): ValidationResult {
    const errors: string[] = [];

    if (metadata.tags !== undefined && !Array.isArray(metadata.tags)) {
      errors.push('Tags must be an array');
    }

    if (metadata.accessCount !== undefined && metadata.accessCount < 0) {
      errors.push('Access count cannot be negative');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates pagination parameters.
   */
  public validatePagination(params: { page?: number; pageSize?: number }): ValidationResult {
    const errors: string[] = [];

    if (params.page !== undefined) {
      if (params.page < 1) {
        errors.push('Page must be at least 1');
      }
    }

    if (params.pageSize !== undefined) {
      if (params.pageSize < 1) {
        errors.push('Page size must be at least 1');
      }
      if (params.pageSize > 100) {
        errors.push('Page size must be 100 or less');
      }
    }

    return { isValid: errors.length === 0, errors };
  }
}
