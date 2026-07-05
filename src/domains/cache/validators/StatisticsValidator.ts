/**
 * StatisticsValidator
 *
 * Validator for cache statistics operations.
 * Validates statistics creation, updates, and queries.
 */

import type { CacheStatistics } from '../entities/CacheStatistics';
import type { CacheStatisticsMetadata } from '../types/CacheMetadata';

/**
 * Validation result type.
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * StatisticsValidator class.
 * Provides validation methods for statistics operations.
 */
export class StatisticsValidator {
  /**
   * Validates a statistics ID.
   */
  public validateStatisticsId(id: string): ValidationResult {
    const errors: string[] = [];
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!id || id.trim().length === 0) {
      errors.push('Statistics ID cannot be empty');
    } else if (!uuidRegex.test(id)) {
      errors.push('Statistics ID must be a valid UUID');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates statistics creation parameters.
   */
  public validateCreateStatistics(params: {
    hits?: number;
    misses?: number;
    evictions?: number;
    entries?: number;
    memoryUsage?: number;
  }): ValidationResult {
    const errors: string[] = [];

    if (params.hits !== undefined && params.hits < 0) {
      errors.push('Hits cannot be negative');
    }

    if (params.misses !== undefined && params.misses < 0) {
      errors.push('Misses cannot be negative');
    }

    if (params.evictions !== undefined && params.evictions < 0) {
      errors.push('Evictions cannot be negative');
    }

    if (params.entries !== undefined && params.entries < 0) {
      errors.push('Entries cannot be negative');
    }

    if (params.memoryUsage !== undefined && params.memoryUsage < 0) {
      errors.push('Memory usage cannot be negative');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates statistics update parameters.
   */
  public validateUpdateStatistics(params: {
    hits?: number;
    misses?: number;
    evictions?: number;
    entries?: number;
    memoryUsage?: number;
  }): ValidationResult {
    const errors: string[] = [];

    if (params.hits !== undefined && params.hits < 0) {
      errors.push('Hits cannot be negative');
    }

    if (params.misses !== undefined && params.misses < 0) {
      errors.push('Misses cannot be negative');
    }

    if (params.evictions !== undefined && params.evictions < 0) {
      errors.push('Evictions cannot be negative');
    }

    if (params.entries !== undefined && params.entries < 0) {
      errors.push('Entries cannot be negative');
    }

    if (params.memoryUsage !== undefined && params.memoryUsage < 0) {
      errors.push('Memory usage cannot be negative');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates a statistics entity.
   */
  public validateStatistics(statistics: CacheStatistics): ValidationResult {
    const errors: string[] = [];

    if (!statistics.statisticsId) {
      errors.push('Statistics ID is required');
    }

    if (statistics.hits < 0) {
      errors.push('Hits cannot be negative');
    }

    if (statistics.misses < 0) {
      errors.push('Misses cannot be negative');
    }

    if (statistics.evictions < 0) {
      errors.push('Evictions cannot be negative');
    }

    if (statistics.entries < 0) {
      errors.push('Entries cannot be negative');
    }

    if (statistics.memoryUsage < 0) {
      errors.push('Memory usage cannot be negative');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates statistics metadata.
   */
  public validateStatisticsMetadata(metadata: CacheStatisticsMetadata): ValidationResult {
    const errors: string[] = [];

    if (metadata.periodStart !== undefined && metadata.periodEnd !== undefined) {
      const start = new Date(metadata.periodStart);
      const end = new Date(metadata.periodEnd);
      if (start > end) {
        errors.push('Period start must be before period end');
      }
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
