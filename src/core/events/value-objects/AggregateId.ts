/**
 * AggregateId Value Object
 *
 * Immutable value object representing an aggregate root identifier.
 * Encapsulates UUID validation and comparison logic.
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * AggregateId value object class.
 * Immutable - once created, cannot be modified.
 */
export class AggregateId {
  private readonly _value: string;

  /**
   * Private constructor enforces use of static factory method.
   */
  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates an AggregateId from a string value.
   * Validates that the value is a non-empty, valid UUID format.
   */
  public static create(value: string): AggregateId {
    if (!value || value.trim().length === 0) {
      throw new Error('AggregateId cannot be empty');
    }
    if (!UUID_REGEX.test(value)) {
      throw new Error(`Invalid UUID format: ${value}`);
    }
    return new AggregateId(value);
  }

  /**
   * Reconstructs an AggregateId from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   */
  public static reconstruct(value: string): AggregateId {
    return new AggregateId(value);
  }

  /**
   * Generates a new random AggregateId.
   */
  public static generate(): AggregateId {
    const hex = '0123456789abcdef';
    const uuid = [
      hex.slice(0, 8) + '-' + hex.slice(0, 4) + '-4' + hex.slice(0, 3) + '-',
      hex[Math.floor(Math.random() * 4) + 8] + hex.slice(0, 3) + '-',
      hex.slice(0, 12),
    ].join('');
    return new AggregateId(uuid);
  }

  /**
   * Gets the underlying UUID value.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another AggregateId.
   */
  public equals(other: AggregateId): boolean {
    if (!(other instanceof AggregateId)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Returns the string representation of the AggregateId.
   */
  public toString(): string {
    return this._value;
  }
}