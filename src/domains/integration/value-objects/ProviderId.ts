/**
 * ProviderId Value Object
 *
 * Immutable value object representing an integration provider identifier.
 * Encapsulates UUID validation and comparison logic.
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * ProviderId value object class.
 * Immutable - once created, cannot be modified.
 */
export class ProviderId {
  private readonly _value: string;

  /**
   * Private constructor enforces use of static factory method.
   * @param value The UUID string value
   */
  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates a ProviderId from a string value.
   * Validates that the value is a non-empty, valid UUID format.
   * @param value The UUID string
   * @returns A new ProviderId instance
   * @throws Error if validation fails
   */
  public static create(value: string): ProviderId {
    if (!value || value.trim().length === 0) {
      throw new Error('ProviderId cannot be empty');
    }
    if (!UUID_REGEX.test(value)) {
      throw new Error(`Invalid UUID format: ${value}`);
    }
    return new ProviderId(value);
  }

  /**
   * Reconstructs a ProviderId from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   * @param value The UUID string
   * @returns A new ProviderId instance
   */
  public static reconstruct(value: string): ProviderId {
    return new ProviderId(value);
  }

  /**
   * Generates a new random ProviderId.
   * @returns A new ProviderId instance with a randomly generated UUID
   */
  public static generate(): ProviderId {
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
    return new ProviderId(uuid);
  }

  /**
   * Gets the underlying UUID value.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another ProviderId.
   * @param other The other ProviderId to compare
   * @returns true if values are equal
   */
  public equals(other: ProviderId): boolean {
    if (!(other instanceof ProviderId)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Returns the string representation of the ProviderId.
   */
  public toString(): string {
    return this._value;
  }
}
