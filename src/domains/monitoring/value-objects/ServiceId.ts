/**
 * ServiceId Value Object
 *
 * Immutable value object representing a unique service identifier.
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
 * ServiceId value object.
 * Immutable identifier for monitored services.
 */
export class ServiceId {
  private readonly _value: UUID;

  /**
   * Creates a new ServiceId.
   * @param value UUID string value
   */
  constructor(value: UUID) {
    if (!isValidUUID(value)) {
      throw new Error('Invalid service ID: must be a valid UUID');
    }
    this._value = value;
  }

  /**
   * Creates a new random ServiceId.
   */
  public static create(): ServiceId {
    return new ServiceId(crypto.randomUUID() as UUID);
  }

  /**
   * Reconstructs ServiceId from a known value.
   * @param value The UUID value
   */
  public static reconstruct(value: string): ServiceId {
    return new ServiceId(value as UUID);
  }

  /**
   * Gets the string value of the ID.
   */
  get value(): UUID {
    return this._value;
  }

  /**
   * Checks equality with another ServiceId.
   */
  equals(other: ServiceId): boolean {
    return this._value === other._value;
  }

  /**
   * String representation.
   */
  toString(): string {
    return this._value;
  }
}
