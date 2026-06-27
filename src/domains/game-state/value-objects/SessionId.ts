/**
 * SessionId Value Object
 *
 * Immutable value object representing a game session identifier.
 * Encapsulates session ID validation and comparison logic.
 */

const SESSION_ID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * SessionId value object class.
 * Immutable - once created, cannot be modified.
 */
export class SessionId {
  private readonly _value: string;

  /**
   * Private constructor enforces use of static factory method.
   * @param value The UUID string value
   */
  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates a SessionId from a string value.
   * Validates that the value is a non-empty, valid UUID format.
   * @param value The UUID string
   * @returns A new SessionId instance
   * @throws Error if validation fails
   */
  public static create(value: string): SessionId {
    if (!value || value.trim().length === 0) {
      throw new Error('SessionId cannot be empty');
    }
    if (!SESSION_ID_REGEX.test(value)) {
      throw new Error(`Invalid UUID format: ${value}`);
    }
    return new SessionId(value);
  }

  /**
   * Reconstructs a SessionId from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   * @param value The UUID string
   * @returns A new SessionId instance
   */
  public static reconstruct(value: string): SessionId {
    return new SessionId(value);
  }

  /**
   * Generates a new random SessionId.
   * @returns A new SessionId instance
   */
  public static generate(): SessionId {
    const hex = '0123456789abcdef';
    const uuid = [
      hex.slice(0, 8) + '-' + hex.slice(0, 4) + '-4' + hex.slice(0, 3) + '-',
      hex[Math.floor(Math.random() * 4) + 8] + hex.slice(0, 3) + '-',
      hex.slice(0, 12),
    ].join('');
    return new SessionId(uuid);
  }

  /**
   * Creates an empty/placeholder SessionId.
   * Used when no active session exists.
   * @returns A new SessionId instance with null UUID
   */
  public static empty(): SessionId {
    return new SessionId('00000000-0000-4000-8000-000000000000');
  }

  /**
   * Checks if this is an empty/placeholder session ID.
   */
  public get isEmpty(): boolean {
    return this._value === '00000000-0000-4000-8000-000000000000';
  }

  /**
   * Gets the underlying UUID value.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another SessionId.
   * @param other The other SessionId to compare
   * @returns true if values are equal
   */
  public equals(other: SessionId): boolean {
    if (!(other instanceof SessionId)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Returns the string representation of the SessionId.
   */
  public toString(): string {
    return this._value;
  }
}