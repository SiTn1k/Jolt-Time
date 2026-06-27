/**
 * QuestSlug Value Object
 *
 * URL-friendly identifier for a quest.
 */

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * QuestSlug value object representing a URL-friendly quest identifier.
 */
export class QuestSlug {
  private readonly _value: string;

  /**
   * Creates a new QuestSlug instance.
   * @param value The slug string value
   */
  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('QuestSlug cannot be empty');
    }
    const normalized = value.toLowerCase().trim();
    if (!SLUG_REGEX.test(normalized)) {
      throw new Error('QuestSlug must be a valid slug format (lowercase, alphanumeric with hyphens)');
    }
    this._value = normalized;
  }

  /**
   * Creates a QuestSlug from a string, normalizing it.
   * @param value The string value to create slug from
   */
  public static create(value: string): QuestSlug {
    const normalized = value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return new QuestSlug(normalized);
  }

  /**
   * Reconstructs a QuestSlug from a string value.
   * @param value The string value to reconstruct
   */
  public static reconstruct(value: string): QuestSlug {
    return new QuestSlug(value);
  }

  /**
   * Validates if a string is a valid slug format.
   */
  public static isValid(value: string | null | undefined): boolean {
    if (!value || value.trim().length === 0) {
      return false;
    }
    return SLUG_REGEX.test(value.toLowerCase());
  }

  /**
   * Gets the string value of the QuestSlug.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another QuestSlug.
   */
  public equals(other: QuestSlug): boolean {
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
