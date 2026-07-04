/**
 * ResponseId Value Object
 *
 * Immutable value object representing an integration response identifier.
 * Encapsulates UUID validation and comparison logic.
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * ResponseId value object class.
 * Immutable - once created, cannot be modified.
 */
export class ResponseId {
  private readonly _value: string;

  /**
   * Private constructor enforces use of static factory method.
   * @param value The UUID string value
   */
  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates a ResponseId from a string value.
   * Validates that the value is a non-empty, valid UUID format.
   * @param value The UUID string
   * @returns A new ResponseId instance
   * @throws Error if validation fails
   */
  public static create(value: string): ResponseId {
    if (!value || value.trim().length === 0) {
      throw new Error('ResponseId cannot be empty');
    }
    if (!UUID_REGEX.test(value)) {
      throw new Error(`Invalid UUID format: ${value}`);
    }
    return new ResponseId(value);
  }

  /**
   * Reconstructs a ResponseId from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   * @param value The UUID string
   * @returns A new ResponseId instance
   */
  public static reconstruct(value: string): ResponseId {
    return new ResponseId(value);
  }

  /**
   * Generates a new random ResponseId.
   * @returns A new ResponseId instance with a randomly generated UUID
   */
  public static generate(): ResponseId {
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
    return new ResponseId(uuid);
  }

  /**
   * Gets the underlying UUID value.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another ResponseId.
   * @param other The other ResponseId to compare
   * @returns true if values are equal
   */
  public equals(other: ResponseId): boolean {
    if (!(other instanceof ResponseId)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Returns the string representation of the ResponseId.
   */
  public toString(): string {
    return this._value;
  }
}
