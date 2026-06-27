/**
 * Base Mapper
 *
 * Base mapper for converting between database and domain types.
 */

/**
 * Mapper interface for converting between database and domain types.
 */
export interface IMapper<TDb, TDomain> {
  /**
   * Convert database type to domain type.
   */
  toDomain(db: TDb): TDomain;

  /**
   * Convert domain type to database type.
   */
  toDatabase(domain: TDomain): TDb;

  /**
   * Convert database type to domain type, returning null for invalid input.
   */
  toDomainSafe(db: TDb | null | undefined): TDomain | null;
}

/**
 * Base mapper class providing common conversion utilities.
 */
export abstract class BaseMapper<TDb, TDomain> implements IMapper<TDb, TDomain> {
  /**
   * Convert database type to domain type.
   */
  abstract toDomain(db: TDb): TDomain;

  /**
   * Convert domain type to database type.
   */
  abstract toDatabase(domain: TDomain): TDb;

  /**
   * Convert database type to domain type safely.
   */
  toDomainSafe(db: TDb | null | undefined): TDomain | null {
    if (db === null || db === undefined) {
      return null;
    }
    try {
      return this.toDomain(db);
    } catch {
      return null;
    }
  }

  /**
   * Convert array of database types to domain types.
   */
  toDomainArray(dbs: TDb[]): TDomain[] {
    return dbs.map((db) => this.toDomain(db));
  }

  /**
   * Convert array of database types to domain types safely.
   */
  toDomainArraySafe(dbs: (TDb | null | undefined)[]): TDomain[] {
    return dbs.map((db) => this.toDomainSafe(db)).filter((d): d is TDomain => d !== null);
  }

  /**
   * Convert date string to Date object.
   */
  protected parseDate(value: string | Date | null | undefined): Date | null {
    if (!value) return null;
    if (value instanceof Date) return value;
    try {
      return new Date(value);
    } catch {
      return null;
    }
  }

  /**
   * Convert Date object to ISO string.
   */
  protected formatDate(date: Date | null | undefined): string | null {
    if (!date) return null;
    return date.toISOString();
  }

  /**
   * Convert nullable value safely.
   */
  protected mapNullable<TInput, TOutput>(
    value: TInput | null | undefined,
    mapper: (input: TInput) => TOutput
  ): TOutput | null {
    if (value === null || value === undefined) {
      return null;
    }
    try {
      return mapper(value);
    } catch {
      return null;
    }
  }

  /**
   * Convert array of values safely.
   */
  protected mapArray<TInput, TOutput>(
    values: (TInput | null | undefined)[],
    mapper: (input: TInput) => TOutput
  ): TOutput[] {
    return values
      .map((v) => (v !== null && v !== undefined ? mapper(v) : null))
      .filter((v): v is TOutput => v !== null);
  }
}

/**
 * Mapper utilities for common conversions.
 */
export const MapperUtils = {
  /**
   * Convert snake_case to camelCase.
   */
  snakeToCamel(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  },

  /**
   * Convert camelCase to snake_case.
   */
  camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  },

  /**
   * Convert snake_case object keys to camelCase.
   */
  keysToCamel<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[MapperUtils.snakeToCamel(key)] = value;
    }
    return result as Record<string, unknown>;
  },

  /**
   * Convert camelCase object keys to snake_case.
   */
  keysToSnake<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[MapperUtils.camelToSnake(key)] = value;
    }
    return result as Record<string, unknown>;
  },

  /**
   * Parse date string to Date.
   */
  parseDate(value: string | Date | null | undefined): Date | null {
    if (!value) return null;
    if (value instanceof Date) return value;
    try {
      return new Date(value);
    } catch {
      return null;
    }
  },

  /**
   * Format Date to ISO string.
   */
  formatDate(date: Date | null | undefined): string | null {
    if (!date) return null;
    return date.toISOString();
  },

  /**
   * Parse boolean from various representations.
   */
  parseBoolean(value: unknown): boolean {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      return ['true', '1', 'yes', 'on'].includes(value.toLowerCase());
    }
    if (typeof value === 'number') return value !== 0;
    return false;
  },

  /**
   * Parse integer safely.
   */
  parseInteger(value: unknown, defaultValue = 0): number {
    if (typeof value === 'number' && Number.isInteger(value)) return value;
    if (typeof value === 'string') {
      const parsed = parseInt(value, 10);
      return Number.isNaN(parsed) ? defaultValue : parsed;
    }
    return defaultValue;
  },

  /**
   * Parse float safely.
   */
  parseFloat(value: unknown, defaultValue = 0): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return Number.isNaN(parsed) ? defaultValue : parsed;
    }
    return defaultValue;
  },
};