/**
 * AuditActorId Value Object
 *
 * Immutable value object representing an audit actor identifier.
 * Encapsulates ID validation and comparison logic.
 */

/**
 * AuditActorId value object class.
 * Immutable - once created, cannot be modified.
 */
export class AuditActorId {
  private readonly _value: string;

  /**
   * Private constructor enforces use of static factory method.
   * @param value The string value
   */
  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates an AuditActorId from a string value.
   * Validates that the value is a non-empty string.
   * @param value The string value
   * @returns A new AuditActorId instance
   * @throws Error if validation fails
   */
  public static create(value: string): AuditActorId {
    if (!value || value.trim().length === 0) {
      throw new Error('AuditActorId cannot be empty');
    }
    return new AuditActorId(value.trim());
  }

  /**
   * Reconstructs an AuditActorId from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   * @param value The string value
   * @returns A new AuditActorId instance
   */
  public static reconstruct(value: string): AuditActorId {
    return new AuditActorId(value);
  }

  /**
   * Gets the underlying string value.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another AuditActorId.
   * @param other The other AuditActorId to compare
   * @returns true if values are equal
   */
  public equals(other: AuditActorId): boolean {
    if (!(other instanceof AuditActorId)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Returns the string representation of the AuditActorId.
   */
  public toString(): string {
    return this._value;
  }
}
