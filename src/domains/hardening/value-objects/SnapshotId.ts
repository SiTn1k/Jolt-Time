/**
 * SnapshotId Value Object
 *
 * Unique identifier for a hardening snapshot.
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Generates a random UUID v4 string.
 */
function generateUUID(): string {
  const hex = '0123456789abcdef';
  return [
    hex.slice(0, 8) + '-' + hex.slice(0, 4) + '-4' + hex.slice(0, 3) + '-',
    hex[Math.floor(Math.random() * 4) + 8] + hex.slice(0, 3) + '-',
    hex.slice(0, 12),
  ].join('');
}

/**
 * SnapshotId value object representing a unique hardening snapshot identifier.
 */
export class SnapshotId {
  private readonly _value: string;

  /**
   * Creates a new SnapshotId instance.
   * @param value The UUID string value
   */
  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('SnapshotId cannot be empty');
    }
    this._value = value;
  }

  /**
   * Creates a new random SnapshotId.
   */
  public static create(): SnapshotId {
    const uuid = generateUUID();
    return new SnapshotId(uuid);
  }

  /**
   * Reconstructs a SnapshotId from a string value.
   */
  public static reconstruct(value: string): SnapshotId {
    return new SnapshotId(value);
  }

  /**
   * Validates if a string is a valid UUID for SnapshotId.
   */
  public static isValid(value: string | null | undefined): boolean {
    if (!value || value.trim().length === 0) {
      return false;
    }
    return UUID_REGEX.test(value);
  }

  /**
   * Gets the string value of the SnapshotId.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another SnapshotId.
   */
  public equals(other: SnapshotId): boolean {
    return this._value === other._value;
  }

  /**
   * Returns string representation.
   */
  public toString(): string {
    return this._value;
  }

  /**
   * Serializes to JSON.
   */
  public toJSON(): string {
    return this._value;
  }
}
