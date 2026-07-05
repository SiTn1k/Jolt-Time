/**
 * RegionValidator
 *
 * Validator for cache region operations.
 * Validates region creation, updates, and queries.
 */

import type { CacheRegion } from '../entities/CacheRegion';
import type { CacheRegionType } from '../types/CacheRegionType';
import type { CacheRegionMetadata } from '../types/CacheMetadata';

/**
 * Validation result type.
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * RegionValidator class.
 * Provides validation methods for region operations.
 */
export class RegionValidator {
  /**
   * Validates a region ID.
   */
  public validateRegionId(id: string): ValidationResult {
    const errors: string[] = [];
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!id || id.trim().length === 0) {
      errors.push('Region ID cannot be empty');
    } else if (!uuidRegex.test(id)) {
      errors.push('Region ID must be a valid UUID');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates region creation parameters.
   */
  public validateCreateRegion(params: {
    regionName: string;
    regionType: CacheRegionType;
    description?: string;
    enabled?: boolean;
  }): ValidationResult {
    const errors: string[] = [];

    if (!params.regionName || params.regionName.trim().length === 0) {
      errors.push('Region name is required');
    } else if (params.regionName.length > 64) {
      errors.push('Region name must be 64 characters or less');
    }

    const validTypes: CacheRegionType[] = ['system', 'session', 'player', 'guild', 'global'];
    if (!validTypes.includes(params.regionType)) {
      errors.push(`Invalid region type. Valid types are: ${validTypes.join(', ')}`);
    }

    if (params.description !== undefined && params.description.length > 255) {
      errors.push('Description must be 255 characters or less');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates region update parameters.
   */
  public validateUpdateRegion(params: {
    regionName?: string;
    description?: string;
    enabled?: boolean;
  }): ValidationResult {
    const errors: string[] = [];

    if (params.regionName !== undefined) {
      if (!params.regionName || params.regionName.trim().length === 0) {
        errors.push('Region name cannot be empty');
      } else if (params.regionName.length > 64) {
        errors.push('Region name must be 64 characters or less');
      }
    }

    if (params.description !== undefined && params.description.length > 255) {
      errors.push('Description must be 255 characters or less');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates a region entity.
   */
  public validateRegion(region: CacheRegion): ValidationResult {
    const errors: string[] = [];

    if (!region.regionId) {
      errors.push('Region ID is required');
    }

    if (!region.regionName || region.regionName.trim().length === 0) {
      errors.push('Region name is required');
    }

    const validTypes: CacheRegionType[] = ['system', 'session', 'player', 'guild', 'global'];
    if (!validTypes.includes(region.regionType)) {
      errors.push('Valid region type is required');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates region metadata.
   */
  public validateRegionMetadata(metadata: CacheRegionMetadata): ValidationResult {
    const errors: string[] = [];

    if (metadata.maxEntries !== undefined && metadata.maxEntries < 0) {
      errors.push('Max entries cannot be negative');
    }

    if (metadata.defaultTtlSeconds !== undefined && metadata.defaultTtlSeconds < 0) {
      errors.push('Default TTL cannot be negative');
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
