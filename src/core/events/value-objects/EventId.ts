/**
 * EventId Value Object
 *
 * Immutable value object representing a unique event identifier.
 * Encapsulates UUID validation and comparison logic.
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * EventId value object class.
 * Immutable - once created, cannot be modified.
 */
export class EventId {
  private readonly _value: string;

  /**
   * Private constructor enforces use of static factory method.
   */
  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates an EventId from a string value.
   * Validates that the value is a non-empty, valid UUID format.
   */
  public static create(value: string): EventId {
    if (!value || value.trim().length === 0) {
      throw new Error('EventId cannot be empty');
    }
    if (!UUID_REGEX.test(value)) {
      throw new Error(`Invalid UUID format: ${value}`);
    }
    return new EventId(value);
  }

  /**
   * Reconstructs an EventId from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   */
  public static reconstruct(value: string): EventId {
    return new EventId(value);
  }

  /**
   * Generates a new random EventId.
   */
  public static generate(): EventId {
    const hex = '0123456789abcdef';
    const uuid = [
      hex.slice(0, 8) + '-' + hex.slice(0, 4) + '-4' + hex.slice(0, 3) + '-',
      hex[Math.floor(Math.random() * 4) + 8] + hex.slice(0, 3) + '-',
      hex.slice(0, 12),
    ].join('');
    return new EventId(uuid);
  }

  /**
   * Gets the underlying UUID value.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another EventId.
   */
  public equals(other: EventId): boolean {
    if (!(other instanceof EventId)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Returns the string representation of the EventId.
   */
  public toString(): string {
    return this._value;
  }
}