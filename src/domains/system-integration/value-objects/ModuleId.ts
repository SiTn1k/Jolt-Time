/**
 * ModuleId Value Object
 *
 * Immutable value object representing a system module identifier.
 * Encapsulates UUID validation and comparison logic.
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * ModuleId value object class.
 * Immutable - once created, cannot be modified.
 */
export class ModuleId {
  private readonly _value: string;

  /**
   * Private constructor enforces use of static factory method.
   * @param value The UUID string value
   */
  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates a ModuleId from a string value.
   * Validates that the value is a non-empty, valid UUID format.
   * @param value The UUID string
   * @returns A new ModuleId instance
   * @throws Error if validation fails
   */
  public static create(value: string): ModuleId {
    if (!value || value.trim().length === 0) {
      throw new Error('ModuleId cannot be empty');
    }
    if (!UUID_REGEX.test(value)) {
      throw new Error(`Invalid UUID format: ${value}`);
    }
    return new ModuleId(value);
  }

  /**
   * Reconstructs a ModuleId from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   * @param value The UUID string
   * @returns A new ModuleId instance
   */
  public static reconstruct(value: string): ModuleId {
    return new ModuleId(value);
  }

  /**
   * Generates a new random ModuleId.
   * @returns A new ModuleId instance with a randomly generated UUID
   */
  public static generate(): ModuleId {
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
    return new ModuleId(uuid);
  }

  /**
   * Gets the underlying UUID value.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another ModuleId.
   * @param other The other ModuleId to compare
   * @returns true if values are equal
   */
  public equals(other: ModuleId): boolean {
    if (!(other instanceof ModuleId)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Returns the string representation of the ModuleId.
   */
  public toString(): string {
    return this._value;
  }
}
