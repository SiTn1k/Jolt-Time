/**
 * QuestId Value Object
 *
 * Unique identifier for a quest.
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
 * QuestId value object representing a unique quest identifier.
 */
export class QuestId {
  private readonly _value: string;

  /**
   * Creates a new QuestId instance.
   * @param value The UUID string value
   */
  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('QuestId cannot be empty');
    }
    this._value = value;
  }

  /**
   * Creates a new random QuestId.
   */
  public static create(): QuestId {
    const uuid = generateUUID();
    return new QuestId(uuid);
  }

  /**
   * Reconstructs a QuestId from a string value.
   * @param value The string value to reconstruct
   */
  public static reconstruct(value: string): QuestId {
    return new QuestId(value);
  }

  /**
   * Validates if a string is a valid UUID for QuestId.
   */
  public static isValid(value: string | null | undefined): boolean {
    if (!value || value.trim().length === 0) {
      return false;
    }
    return UUID_REGEX.test(value);
  }

  /**
   * Gets the string value of the QuestId.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another QuestId.
   */
  public equals(other: QuestId): boolean {
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
