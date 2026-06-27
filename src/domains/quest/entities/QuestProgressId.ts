/**
 * QuestProgressId Value Object
 *
 * Unique identifier for quest progress.
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
 * QuestProgressId value object representing a unique progress identifier.
 */
export class QuestProgressId {
  private readonly _value: string;

  /**
   * Creates a new QuestProgressId instance.
   * @param value The UUID string value
   */
  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('QuestProgressId cannot be empty');
    }
    this._value = value;
  }

  /**
   * Creates a new random QuestProgressId.
   */
  public static create(): QuestProgressId {
    const uuid = generateUUID();
    return new QuestProgressId(uuid);
  }

  /**
   * Reconstructs a QuestProgressId from a string value.
   * @param value The string value to reconstruct
   */
  public static reconstruct(value: string): QuestProgressId {
    return new QuestProgressId(value);
  }

  /**
   * Validates if a string is a valid UUID for QuestProgressId.
   */
  public static isValid(value: string | null | undefined): boolean {
    if (!value || value.trim().length === 0) {
      return false;
    }
    return UUID_REGEX.test(value);
  }

  /**
   * Gets the string value of the QuestProgressId.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another QuestProgressId.
   */
  public equals(other: QuestProgressId): boolean {
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
