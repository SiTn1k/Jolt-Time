/**
 * HealthCheckId Value Object
 *
 * Immutable value object representing a unique health check identifier.
 */

import { UUID } from '../../../shared/types/base.types';

/**
 * UUID validation regex (simplified v4).
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Validates a UUID string.
 */
function isValidUUID(value: string): boolean {
  return UUID_REGEX.test(value);
}

/**
 * HealthCheckId value object.
 * Immutable identifier for health check records.
 */
export class HealthCheckId {
  private readonly _value: UUID;

  /**
   * Creates a new HealthCheckId.
   * @param value UUID string value
   */
  constructor(value: UUID) {
    if (!isValidUUID(value)) {
      throw new Error('Invalid health check ID: must be a valid UUID');
    }
    this._value = value;
  }

  /**
   * Creates a new random HealthCheckId.
   */
  public static create(): HealthCheckId {
    return new HealthCheckId(crypto.randomUUID() as UUID);
  }

  /**
   * Reconstructs HealthCheckId from a known value.
   * @param value The UUID value
   */
  public static reconstruct(value: string): HealthCheckId {
    return new HealthCheckId(value as UUID);
  }

  /**
   * Gets the string value of the ID.
   */
  get value(): UUID {
    return this._value;
  }

  /**
   * Checks equality with another HealthCheckId.
   */
  equals(other: HealthCheckId): boolean {
    return this._value === other._value;
  }

  /**
   * String representation.
   */
  toString(): string {
    return this._value;
  }
}
