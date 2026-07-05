/**
 * RequestId Value Object
 *
 * Immutable value object representing an API request identifier.
 * Encapsulates request ID validation and comparison logic.
 */

const REQUEST_ID_MIN_LENGTH = 1;
const REQUEST_ID_MAX_LENGTH = 128;

/**
 * RequestId value object class.
 * Immutable - once created, cannot be modified.
 */
export class RequestId {
  private readonly _value: string;

  /**
   * Private constructor enforces use of static factory method.
   */
  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates a RequestId from a string value.
   */
  public static create(value: string): RequestId {
    if (!value || value.trim().length < REQUEST_ID_MIN_LENGTH) {
      throw new Error('RequestId cannot be empty');
    }

    const trimmedValue = value.trim();

    if (trimmedValue.length > REQUEST_ID_MAX_LENGTH) {
      throw new Error(`RequestId exceeds maximum length of ${REQUEST_ID_MAX_LENGTH}`);
    }

    return new RequestId(trimmedValue);
  }

  /**
   * Reconstructs a RequestId from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   */
  public static reconstruct(value: string): RequestId {
    return new RequestId(value);
  }

  /**
   * Generates a new unique RequestId.
   */
  public static generate(): RequestId {
    const uuid = crypto.randomUUID();
    return new RequestId(uuid);
  }

  /**
   * Gets the request ID value.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another RequestId.
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
