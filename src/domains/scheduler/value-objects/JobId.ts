/**
 * JobId Value Object
 *
 * Unique identifier for a scheduled job.
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
 * JobId value object representing a unique job identifier.
 */
export class JobId {
  private readonly _value: string;

  /**
   * Creates a new JobId instance.
   * @param value The UUID string value
   */
  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('JobId cannot be empty');
    }
    this._value = value;
  }

  /**
   * Creates a new random JobId.
   */
  public static create(): JobId {
    const uuid = generateUUID();
    return new JobId(uuid);
  }

  /**
   * Reconstructs a JobId from a string value.
   */
  public static reconstruct(value: string): JobId {
    return new JobId(value);
  }

  /**
   * Validates if a string is a valid UUID for JobId.
   */
  public static isValid(value: string | null | undefined): boolean {
    if (!value || value.trim().length === 0) {
      return false;
    }
    return UUID_REGEX.test(value);
  }

  /**
   * Gets the string value of the JobId.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another JobId.
   */
  public equals(other: JobId): boolean {
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
