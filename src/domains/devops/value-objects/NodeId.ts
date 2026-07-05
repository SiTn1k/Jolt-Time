/**
 * NodeId Value Object
 *
 * Immutable value object representing an infrastructure node identifier.
 * Encapsulates UUID validation and comparison logic.
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * NodeId value object class.
 * Immutable - once created, cannot be modified.
 */
export class NodeId {
  private readonly _value: string;

  /**
   * Private constructor enforces use of static factory method.
   */
  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates a NodeId from a string value.
   */
  public static create(value: string): NodeId {
    if (!value || value.trim().length === 0) {
      throw new Error('NodeId cannot be empty');
    }
    if (!UUID_REGEX.test(value)) {
      throw new Error(`Invalid UUID format: ${value}`);
    }
    return new NodeId(value);
  }

  /**
   * Reconstructs a NodeId from a value that was already validated.
   */
  public static reconstruct(value: string): NodeId {
    return new NodeId(value);
  }

  /**
   * Generates a new random NodeId.
   */
  public static generate(): NodeId {
    const hex = '0123456789abcdef';
    const uuid = [
      hex.slice(0, 8) + '-' + hex.slice(0, 4) + '-4' + hex.slice(0, 3) + '-',
      hex[Math.floor(Math.random() * 4) + 8] + hex.slice(0, 3) + '-',
      hex.slice(0, 12),
    ].join('');
    return new NodeId(uuid);
  }

  /**
   * Gets the underlying UUID value.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another NodeId.
   */
  public equals(other: NodeId): boolean {
    if (!(other instanceof NodeId)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Returns the string representation of the NodeId.
   */
  public toString(): string {
    return this._value;
  }
}