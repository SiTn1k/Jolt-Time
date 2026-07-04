/**
 * RequestId Value Object
 *
 * Immutable value object representing an integration request identifier.
 * Encapsulates UUID validation and comparison logic.
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * RequestId value object class.
 * Immutable - once created, cannot be modified.
 */
export class RequestId {
  private readonly _value: string;

  /**
   * Private constructor enforces use of static factory method.
   * @param value The UUID string value
   */
  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates a RequestId from a string value.
   * Validates that the value is a non-empty, valid UUID format.
   * @param value The UUID string
   * @returns A new RequestId instance
   * @throws Error if validation fails
   */
  public static create(value: string): RequestId {
    if (!value || value.trim().length === 0) {
      throw new Error('RequestId cannot be empty');
    }
    if (!UUID_REGEX.test(value)) {
      throw new Error(`Invalid UUID format: ${value}`);
    }
    return new RequestId(value);
  }

  /**
   * Reconstructs a RequestId from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   * @param value The UUID string
   * @returns A new RequestId instance
   */
  public static reconstruct(value: string): RequestId {
    return new RequestId(value);
  }

  /**
   * Generates a new random RequestId.
   * @returns A new RequestId instance with a randomly generated UUID
   */
  public static generate(): RequestId {
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
    return new RequestId(uuid);
  }

  /**
   * Gets the underlying UUID value.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another RequestId.
   * @param other The other RequestId to compare
   * @returns true if values are equal
   */
  public equals(other: RequestId): boolean {
    if (!(other instanceof RequestId)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Returns the string representation of the RequestId.
   */
  public toString(): string {
    return this._value;
  }
}
