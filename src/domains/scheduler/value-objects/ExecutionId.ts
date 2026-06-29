/**
 * ExecutionId Value Object
 *
 * Unique identifier for a job execution.
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
 * ExecutionId value object representing a unique execution identifier.
 */
export class ExecutionId {
  private readonly _value: string;

  /**
   * Creates a new ExecutionId instance.
   * @param value The UUID string value
   */
  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('ExecutionId cannot be empty');
    }
    this._value = value;
  }

  /**
   * Creates a new random ExecutionId.
   */
  public static create(): ExecutionId {
    const uuid = generateUUID();
    return new ExecutionId(uuid);
  }

  /**
   * Reconstructs an ExecutionId from a string value.
   */
  public static reconstruct(value: string): ExecutionId {
    return new ExecutionId(value);
  }

  /**
   * Validates if a string is a valid UUID for ExecutionId.
   */
  public static isValid(value: string | null | undefined): boolean {
    if (!value || value.trim().length === 0) {
      return false;
    }
    return UUID_REGEX.test(value);
  }

  /**
   * Gets the string value of the ExecutionId.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another ExecutionId.
   */
  public equals(other: ExecutionId): boolean {
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
