/**
 * EnvironmentId Value Object
 *
 * Immutable value object representing an environment identifier.
 * Encapsulates UUID validation and comparison logic.
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * EnvironmentId value object class.
 * Immutable - once created, cannot be modified.
 */
export class EnvironmentId {
  private readonly _value: string;

  /**
   * Private constructor enforces use of static factory method.
   */
  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates an EnvironmentId from a string value.
   */
  public static create(value: string): EnvironmentId {
    if (!value || value.trim().length === 0) {
      throw new Error('EnvironmentId cannot be empty');
    }
    if (!UUID_REGEX.test(value)) {
      throw new Error(`Invalid UUID format: ${value}`);
    }
    return new EnvironmentId(value);
  }

  /**
   * Reconstructs an EnvironmentId from a value that was already validated.
   */
  public static reconstruct(value: string): EnvironmentId {
    return new EnvironmentId(value);
  }

  /**
   * Generates a new random EnvironmentId.
   */
  public static generate(): EnvironmentId {
    const hex = '0123456789abcdef';
    const uuid = [
      hex.slice(0, 8) + '-' + hex.slice(0, 4) + '-4' + hex.slice(0, 3) + '-',
      hex[Math.floor(Math.random() * 4) + 8] + hex.slice(0, 3) + '-',
      hex.slice(0, 12),
    ].join('');
    return new EnvironmentId(uuid);
  }

  /**
   * Gets the underlying UUID value.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another EnvironmentId.
   */
  public equals(other: EnvironmentId): boolean {
    if (!(other instanceof EnvironmentId)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Returns the string representation of the EnvironmentId.
   */
  public toString(): string {
    return this._value;
  }
}