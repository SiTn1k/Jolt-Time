/**
 * ResponseId Value Object
 *
 * Immutable value object representing an API response identifier.
 * Encapsulates response ID validation and comparison logic.
 */

const RESPONSE_ID_MIN_LENGTH = 1;
const RESPONSE_ID_MAX_LENGTH = 128;

/**
 * ResponseId value object class.
 * Immutable - once created, cannot be modified.
 */
export class ResponseId {
  private readonly _value: string;

  /**
   * Private constructor enforces use of static factory method.
   */
  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates a ResponseId from a string value.
   */
  public static create(value: string): ResponseId {
    if (!value || value.trim().length < RESPONSE_ID_MIN_LENGTH) {
      throw new Error('ResponseId cannot be empty');
    }

    const trimmedValue = value.trim();

    if (trimmedValue.length > RESPONSE_ID_MAX_LENGTH) {
      throw new Error(`ResponseId exceeds maximum length of ${RESPONSE_ID_MAX_LENGTH}`);
    }

    return new ResponseId(trimmedValue);
  }

  /**
   * Reconstructs a ResponseId from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   */
  public static reconstruct(value: string): ResponseId {
    return new ResponseId(value);
  }

  /**
   * Generates a new unique ResponseId.
   */
  public static generate(): ResponseId {
    const uuid = crypto.randomUUID();
    return new ResponseId(uuid);
  }

  /**
   * Gets the response ID value.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another ResponseId.
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
