/**
 * HandlerId Value Object
 *
 * Immutable value object representing a handler identifier.
 * Encapsulates validation and comparison logic.
 */

const HANDLER_ID_MAX_LENGTH = 64;
const HANDLER_ID_PATTERN = /^[a-zA-Z][a-zA-Z0-9_]*$/;

/**
 * HandlerId value object class.
 * Immutable - once created, cannot be modified.
 */
export class HandlerId {
  private readonly _value: string;

  /**
   * Private constructor enforces use of static factory method.
   */
  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates a HandlerId from a string value.
   * Validates the format: alphanumeric with underscores, starting with a letter.
   */
  public static create(value: string): HandlerId {
    if (!value || value.trim().length === 0) {
      throw new Error('HandlerId cannot be empty');
    }
    if (value.length > HANDLER_ID_MAX_LENGTH) {
      throw new Error(`HandlerId exceeds maximum length of ${HANDLER_ID_MAX_LENGTH}`);
    }
    if (!HANDLER_ID_PATTERN.test(value)) {
      throw new Error(`Invalid HandlerId format: ${value}. Must start with a letter and contain only alphanumeric characters and underscores.`);
    }
    return new HandlerId(value);
  }

  /**
   * Reconstructs a HandlerId from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   */
  public static reconstruct(value: string): HandlerId {
    return new HandlerId(value);
  }

  /**
   * Generates a new unique HandlerId.
   */
  public static generate(): HandlerId {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 10);
    return new HandlerId(`handler_${timestamp}_${random}`);
  }

  /**
   * Gets the underlying string value.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another HandlerId.
   */
  public equals(other: HandlerId): boolean {
    if (!(other instanceof HandlerId)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Returns the string representation of the HandlerId.
   */
  public toString(): string {
    return this._value;
  }
}