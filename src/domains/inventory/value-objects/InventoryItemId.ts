/**
 * InventoryItemId Value Object
 *
 * Immutable value object representing an internal inventory item identifier.
 * Encapsulates UUID validation and comparison logic.
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * InventoryItemId value object class.
 * Immutable - once created, cannot be modified.
 */
export class InventoryItemId {
  private readonly _value: string;

  /**
   * Private constructor enforces use of static factory method.
   * @param value The UUID string value
   */
  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates an InventoryItemId from a string value.
   * Validates that the value is a non-empty, valid UUID format.
   * @param value The UUID string
   * @returns A new InventoryItemId instance
   * @throws Error if validation fails
   */
  public static create(value: string): InventoryItemId {
    if (!value || value.trim().length === 0) {
      throw new Error('InventoryItemId cannot be empty');
    }
    if (!UUID_REGEX.test(value)) {
      throw new Error(`Invalid UUID format: ${value}`);
    }
    return new InventoryItemId(value);
  }

  /**
   * Reconstructs an InventoryItemId from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   * @param value The UUID string
   * @returns A new InventoryItemId instance
   */
  public static reconstruct(value: string): InventoryItemId {
    return new InventoryItemId(value);
  }

  /**
   * Generates a new random InventoryItemId.
   * @returns A new InventoryItemId instance
   */
  public static generate(): InventoryItemId {
    const hex = '0123456789abcdef';
    const uuid = [
      hex.slice(0, 8) + '-' + hex.slice(0, 4) + '-4' + hex.slice(0, 3) + '-',
      hex[Math.floor(Math.random() * 4) + 8] + hex.slice(0, 3) + '-',
      hex.slice(0, 12),
    ].join('');
    return new InventoryItemId(uuid);
  }

  /**
   * Gets the underlying UUID value.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another InventoryItemId.
   * @param other The other InventoryItemId to compare
   * @returns true if values are equal
   */
  public equals(other: InventoryItemId): boolean {
    if (!(other instanceof InventoryItemId)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Returns the string representation of the InventoryItemId.
   */
  public toString(): string {
    return this._value;
  }
}