/**
 * RouteId Value Object
 *
 * Immutable value object representing an API route identifier.
 * Encapsulates route ID validation and comparison logic.
 */

const ROUTE_ID_MIN_LENGTH = 1;
const ROUTE_ID_MAX_LENGTH = 128;

/**
 * RouteId value object class.
 * Immutable - once created, cannot be modified.
 */
export class RouteId {
  private readonly _value: string;

  /**
   * Private constructor enforces use of static factory method.
   */
  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates a RouteId from a string value.
   */
  public static create(value: string): RouteId {
    if (!value || value.trim().length < ROUTE_ID_MIN_LENGTH) {
      throw new Error('RouteId cannot be empty');
    }

    const trimmedValue = value.trim();

    if (trimmedValue.length > ROUTE_ID_MAX_LENGTH) {
      throw new Error(`RouteId exceeds maximum length of ${ROUTE_ID_MAX_LENGTH}`);
    }

    return new RouteId(trimmedValue);
  }

  /**
   * Reconstructs a RouteId from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   */
  public static reconstruct(value: string): RouteId {
    return new RouteId(value);
  }

  /**
   * Generates a new unique RouteId.
   */
  public static generate(): RouteId {
    const uuid = crypto.randomUUID();
    return new RouteId(uuid);
  }

  /**
   * Gets the route ID value.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another RouteId.
   */
  public equals(other: RouteId): boolean {
    if (!(other instanceof RouteId)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Returns the string representation of the RouteId.
   */
  public toString(): string {
    return this._value;
  }
}
