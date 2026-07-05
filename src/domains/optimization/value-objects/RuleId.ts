/**
 * RuleId Value Object
 *
 * Immutable value object representing an optimization rule identifier.
 * Encapsulates UUID validation and comparison logic.
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * RuleId value object class.
 * Immutable - once created, cannot be modified.
 */
export class RuleId {
  private readonly _value: string;

  /**
   * Private constructor enforces use of static factory method.
   * @param value The UUID string value
   */
  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates a RuleId from a string value.
   * Validates that the value is a non-empty, valid UUID format.
   * @param value The UUID string
   * @returns A new RuleId instance
   * @throws Error if validation fails
   */
  public static create(value: string): RuleId {
    if (!value || value.trim().length === 0) {
      throw new Error('RuleId cannot be empty');
    }
    if (!UUID_REGEX.test(value)) {
      throw new Error(`Invalid UUID format: ${value}`);
    }
    return new RuleId(value);
  }

  /**
   * Reconstructs a RuleId from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   * @param value The UUID string
   * @returns A new RuleId instance
   */
  public static reconstruct(value: string): RuleId {
    return new RuleId(value);
  }

  /**
   * Generates a new random RuleId.
   * @returns A new RuleId instance
   */
  public static generate(): RuleId {
    const hex = '0123456789abcdef';
    const uuid = [
      hex.slice(0, 8) + '-' + hex.slice(0, 4) + '-4' + hex.slice(0, 3) + '-',
      hex[Math.floor(Math.random() * 4) + 8] + hex.slice(0, 3) + '-',
      hex.slice(0, 12),
    ].join('');
    return new RuleId(uuid);
  }

  /**
   * Gets the underlying UUID value.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another RuleId.
   * @param other The other RuleId to compare
   * @returns true if values are equal
   */
  public equals(other: RuleId): boolean {
    if (!(other instanceof RuleId)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Returns the string representation of the RuleId.
   */
  public toString(): string {
    return this._value;
  }
}
