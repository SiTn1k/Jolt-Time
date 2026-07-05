/**
 * Snapshot Validator
 *
 * Validates performance snapshot data.
 */

/**
 * Constraints for snapshot validation.
 */
export const SNAPSHOT_CONSTRAINTS = {
  MAX_EXECUTION_TIME: Number.MAX_SAFE_INTEGER,
  MAX_MEMORY_USAGE: Number.MAX_SAFE_INTEGER,
  MIN_CACHE_HIT_RATE: 0,
  MAX_CACHE_HIT_RATE: 100,
  MIN_DATABASE_QUERIES: 0,
  MAX_DATABASE_QUERIES: Number.MAX_SAFE_INTEGER,
} as const;

/**
 * Result of snapshot validation.
 */
export interface SnapshotValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validator for performance snapshots.
 */
export class SnapshotValidator {
  /**
   * Validates an execution time.
   * @param executionTime The execution time to validate
   * @returns Validation result with any error message
   */
  public static validateExecutionTime(executionTime: number | null | undefined): SnapshotValidationResult {
    if (executionTime === null || executionTime === undefined) {
      return {
        isValid: false,
        error: 'Execution time is required',
      };
    }

    if (!Number.isFinite(executionTime)) {
      return {
        isValid: false,
        error: 'Execution time must be a finite number',
      };
    }

    if (executionTime < 0) {
      return {
        isValid: false,
        error: 'Execution time cannot be negative',
      };
    }

    if (executionTime > SNAPSHOT_CONSTRAINTS.MAX_EXECUTION_TIME) {
      return {
        isValid: false,
        error: 'Execution time exceeds maximum allowed value',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a memory usage value.
   * @param memoryUsage The memory usage to validate
   * @returns Validation result with any error message
   */
  public static validateMemoryUsage(memoryUsage: number | null | undefined): SnapshotValidationResult {
    if (memoryUsage === null || memoryUsage === undefined) {
      return {
        isValid: false,
        error: 'Memory usage is required',
      };
    }

    if (!Number.isFinite(memoryUsage)) {
      return {
        isValid: false,
        error: 'Memory usage must be a finite number',
      };
    }

    if (memoryUsage < 0) {
      return {
        isValid: false,
        error: 'Memory usage cannot be negative',
      };
    }

    if (memoryUsage > SNAPSHOT_CONSTRAINTS.MAX_MEMORY_USAGE) {
      return {
        isValid: false,
        error: 'Memory usage exceeds maximum allowed value',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a cache hit rate.
   * @param cacheHitRate The cache hit rate to validate
   * @returns Validation result with any error message
   */
  public static validateCacheHitRate(cacheHitRate: number | null | undefined): SnapshotValidationResult {
    if (cacheHitRate === null || cacheHitRate === undefined) {
      return {
        isValid: false,
        error: 'Cache hit rate is required',
      };
    }

    if (!Number.isFinite(cacheHitRate)) {
      return {
        isValid: false,
        error: 'Cache hit rate must be a finite number',
      };
    }

    if (cacheHitRate < SNAPSHOT_CONSTRAINTS.MIN_CACHE_HIT_RATE) {
      return {
        isValid: false,
        error: `Cache hit rate cannot be less than ${SNAPSHOT_CONSTRAINTS.MIN_CACHE_HIT_RATE}`,
      };
    }

    if (cacheHitRate > SNAPSHOT_CONSTRAINTS.MAX_CACHE_HIT_RATE) {
      return {
        isValid: false,
        error: `Cache hit rate cannot be greater than ${SNAPSHOT_CONSTRAINTS.MAX_CACHE_HIT_RATE}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a database queries count.
   * @param databaseQueries The database queries count to validate
   * @returns Validation result with any error message
   */
  public static validateDatabaseQueries(databaseQueries: number | null | undefined): SnapshotValidationResult {
    if (databaseQueries === null || databaseQueries === undefined) {
      return {
        isValid: false,
        error: 'Database queries count is required',
      };
    }

    if (!Number.isFinite(databaseQueries)) {
      return {
        isValid: false,
        error: 'Database queries count must be a finite number',
      };
    }

    if (!Number.isInteger(databaseQueries)) {
      return {
        isValid: false,
        error: 'Database queries count must be an integer',
      };
    }

    if (databaseQueries < SNAPSHOT_CONSTRAINTS.MIN_DATABASE_QUERIES) {
      return {
        isValid: false,
        error: `Database queries count cannot be less than ${SNAPSHOT_CONSTRAINTS.MIN_DATABASE_QUERIES}`,
      };
    }

    if (databaseQueries > SNAPSHOT_CONSTRAINTS.MAX_DATABASE_QUERIES) {
      return {
        isValid: false,
        error: 'Database queries count exceeds maximum allowed value',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates all snapshot fields together.
   * @param params Snapshot fields to validate
   * @returns Validation result with any error message
   */
  public static validateSnapshot(params: {
    executionTime?: number;
    memoryUsage?: number;
    cacheHitRate?: number;
    databaseQueries?: number;
  }): SnapshotValidationResult {
    const execResult = this.validateExecutionTime(params.executionTime);
    if (!execResult.isValid) return execResult;

    const memoryResult = this.validateMemoryUsage(params.memoryUsage);
    if (!memoryResult.isValid) return memoryResult;

    const cacheResult = this.validateCacheHitRate(params.cacheHitRate);
    if (!cacheResult.isValid) return cacheResult;

    const dbResult = this.validateDatabaseQueries(params.databaseQueries);
    if (!dbResult.isValid) return dbResult;

    return { isValid: true };
  }

  /**
   * Validates a snapshot and throws if invalid.
   * @param params Snapshot fields to validate
   * @throws Error with validation details if invalid
   */
  public static validateSnapshotOrThrow(params: {
    executionTime?: number;
    memoryUsage?: number;
    cacheHitRate?: number;
    databaseQueries?: number;
  }): void {
    const result = this.validateSnapshot(params);
    if (!result.isValid) {
      throw new Error(`Snapshot validation failed: ${result.error}`);
    }
  }
}
