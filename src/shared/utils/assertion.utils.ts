/**
 * Assertion Utilities
 *
 * Safe assertion helpers for type narrowing and validation.
 */

/**
 * Assert that a value is not null or undefined.
 */
export function assertIsDefined<T>(
  value: T | null | undefined,
  message = 'Value is not defined'
): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(message);
  }
}

/**
 * Assert that a condition is true.
 */
export function assertIsTrue(
  condition: boolean,
  message = 'Assertion failed'
): asserts condition is true {
  if (!condition) {
    throw new Error(message);
  }
}

/**
 * Assert that a value is of a specific type.
 */
export function assertIsType<T>(
  value: unknown,
  guard: (value: unknown) => value is T,
  message = 'Type assertion failed'
): asserts value is T {
  if (!guard(value)) {
    throw new Error(message);
  }
}

/**
 * Assert that a string is not empty.
 */
export function assertIsNonEmptyString(
  value: unknown,
  message = 'Expected non-empty string'
): asserts value is string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(message);
  }
}

/**
 * Assert that a number is positive.
 */
export function assertIsPositive(
  value: number,
  message = 'Expected positive number'
): asserts value is number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    throw new Error(message);
  }
}

/**
 * Assert that a number is within a range.
 */
export function assertIsInRange(
  value: number,
  min: number,
  max: number,
  message?: string
): asserts value is number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) {
    throw new Error(message || `Expected number between ${min} and ${max}, got ${value}`);
  }
}

/**
 * Assert that an array is not empty.
 */
export function assertIsNonEmptyArray<T>(
  value: unknown,
  message = 'Expected non-empty array'
): asserts value is T[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(message);
  }
}

/**
 * Type guard for unknown to string.
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Type guard for unknown to number.
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

/**
 * Type guard for unknown to boolean.
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Type guard for unknown to object.
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Type guard for unknown to array.
 */
export function isArray<T>(value: unknown, guard?: (item: unknown) => item is T): value is T[] {
  if (!Array.isArray(value)) return false;
  if (guard) return value.every(guard);
  return true;
}

/**
 * Type guard for unknown to date.
 */
export function isDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

/**
 * Type guard for unknown to string array.
 */
export function isStringArray(value: unknown): value is string[] {
  return isArray<string>(value, isString);
}

/**
 * Type guard for unknown to number array.
 */
export function isNumberArray(value: unknown): value is number[] {
  return isArray<number>(value, isNumber);
}
