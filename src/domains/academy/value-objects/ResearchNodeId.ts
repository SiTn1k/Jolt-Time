/**
 * ResearchNodeId Value Object
 *
 * Immutable value object representing a research node identifier.
 * Encapsulates UUID validation and comparison logic.
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * ResearchNodeId value object class.
 * Immutable - once created, cannot be modified.
 */
export class ResearchNodeId {
  private readonly _value: string;

  /**
   * Private constructor enforces use of static factory method.
   * @param value The UUID string value
   */
  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates a ResearchNodeId from a string value.
   * Validates that the value is a non-empty, valid UUID format.
   * @param value The UUID string
   * @returns A new ResearchNodeId instance
   * @throws Error if validation fails
   */
  public static create(value: string): ResearchNodeId {
    if (!value || value.trim().length === 0) {
      throw new Error('ResearchNodeId cannot be empty');
    }
    if (!UUID_REGEX.test(value)) {
      throw new Error(`Invalid UUID format: ${value}`);
    }
    return new ResearchNodeId(value);
  }

  /**
   * Reconstructs a ResearchNodeId from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   * @param value The UUID string
   * @returns A new ResearchNodeId instance
   */
  public static reconstruct(value: string): ResearchNodeId {
    return new ResearchNodeId(value);
  }

  /**
   * Generates a new random ResearchNodeId.
   * @returns A new ResearchNodeId instance
   */
  public static generate(): ResearchNodeId {
    const hex = '0123456789abcdef';
    const uuid = [
      hex.slice(0, 8) + '-' + hex.slice(0, 4) + '-4' + hex.slice(0, 3) + '-',
      hex[Math.floor(Math.random() * 4) + 8] + hex.slice(0, 3) + '-',
      hex.slice(0, 12),
    ].join('');
    return new ResearchNodeId(uuid);
  }

  /**
   * Gets the underlying UUID value.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another ResearchNodeId.
   * @param other The other ResearchNodeId to compare
   * @returns true if values are equal
   */
  public equals(other: ResearchNodeId): boolean {
    if (!(other instanceof ResearchNodeId)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Returns the string representation of the ResearchNodeId.
   */
  public toString(): string {
    return this._value;
  }
}