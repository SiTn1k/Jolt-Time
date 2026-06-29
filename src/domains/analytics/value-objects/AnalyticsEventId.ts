/**
 * AnalyticsEventId Value Object
 *
 * Immutable value object representing an analytics event identifier.
 * Encapsulates UUID validation and comparison logic.
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * AnalyticsEventId value object class.
 * Immutable - once created, cannot be modified.
 */
export class AnalyticsEventId {
  private readonly _value: string;

  /**
   * Private constructor enforces use of static factory method.
   * @param value The UUID string value
   */
  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates an AnalyticsEventId from a string value.
   * Validates that the value is a non-empty, valid UUID format.
   * @param value The UUID string
   * @returns A new AnalyticsEventId instance
   * @throws Error if validation fails
   */
  public static create(value: string): AnalyticsEventId {
    if (!value || value.trim().length === 0) {
      throw new Error('AnalyticsEventId cannot be empty');
    }
    if (!UUID_REGEX.test(value)) {
      throw new Error(`Invalid UUID format: ${value}`);
    }
    return new AnalyticsEventId(value);
  }

  /**
   * Reconstructs an AnalyticsEventId from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   * @param value The UUID string
   * @returns A new AnalyticsEventId instance
   */
  public static reconstruct(value: string): AnalyticsEventId {
    return new AnalyticsEventId(value);
  }

  /**
   * Generates a new random AnalyticsEventId.
   * @returns A new AnalyticsEventId instance
   */
  public static generate(): AnalyticsEventId {
    const hex = '0123456789abcdef';
    const uuid = [
      hex.slice(0, 8) + '-' + hex.slice(0, 4) + '-4' + hex.slice(0, 3) + '-',
      hex[Math.floor(Math.random() * 4) + 8] + hex.slice(0, 3) + '-',
      hex.slice(0, 12),
    ].join('');
    return new AnalyticsEventId(uuid);
  }

  /**
   * Gets the underlying UUID value.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another AnalyticsEventId.
   * @param other The other AnalyticsEventId to compare
   * @returns true if values are equal
   */
  public equals(other: AnalyticsEventId): boolean {
    if (!(other instanceof AnalyticsEventId)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Returns the string representation of the AnalyticsEventId.
   */
  public toString(): string {
    return this._value;
  }
}
