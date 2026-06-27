/**
 * ArtifactSlug Value Object
 *
 * Immutable value object representing an artifact URL-friendly identifier.
 * Encapsulates slug validation and formatting rules.
 */

/**
 * Slug validation constraints.
 */
export const ARTIFACT_SLUG_CONSTRAINTS = {
  MIN_LENGTH: 3,
  MAX_LENGTH: 128,
  ALLOWED_PATTERN: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
} as const;

/**
 * ArtifactSlug value object class.
 * Immutable - once created, cannot be modified.
 */
export class ArtifactSlug {
  private readonly _value: string;

  /**
   * Private constructor enforces use of static factory method.
   * @param value The slug string value
   */
  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates an ArtifactSlug from a string value.
   * Validates length and URL-safe slug format.
   * @param value The slug string
   * @returns A new ArtifactSlug instance
   * @throws Error if validation fails
   */
  public static create(value: string | null | undefined): ArtifactSlug {
    if (value === null || value === undefined) {
      throw new Error('ArtifactSlug cannot be null or undefined');
    }

    const trimmed = value.trim().toLowerCase();

    if (trimmed.length < ARTIFACT_SLUG_CONSTRAINTS.MIN_LENGTH) {
      throw new Error(
        `ArtifactSlug must be at least ${ARTIFACT_SLUG_CONSTRAINTS.MIN_LENGTH} characters`
      );
    }

    if (trimmed.length > ARTIFACT_SLUG_CONSTRAINTS.MAX_LENGTH) {
      throw new Error(
        `ArtifactSlug must be at most ${ARTIFACT_SLUG_CONSTRAINTS.MAX_LENGTH} characters`
      );
    }

    if (!ARTIFACT_SLUG_CONSTRAINTS.ALLOWED_PATTERN.test(trimmed)) {
      throw new Error(
        'ArtifactSlug can only contain lowercase letters, numbers, and hyphens'
      );
    }

    return new ArtifactSlug(trimmed);
  }

  /**
   * Reconstructs an ArtifactSlug from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   * @param value The slug string
   * @returns A new ArtifactSlug instance
   */
  public static reconstruct(value: string): ArtifactSlug {
    return new ArtifactSlug(value);
  }

  /**
   * Creates an ArtifactSlug without validation.
   * Use with caution - only for trusted input.
   * @param value The slug string
   * @returns A new ArtifactSlug instance
   */
  public static createUnchecked(value: string): ArtifactSlug {
    return new ArtifactSlug(value.toLowerCase().trim());
  }

  /**
   * Generates a URL-friendly slug from a title.
   * @param title The title to convert
   * @returns A slug string
   */
  public static fromTitle(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, ARTIFACT_SLUG_CONSTRAINTS.MAX_LENGTH);
  }

  /**
   * Gets the underlying slug value.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Gets the slug length.
   */
  public get length(): number {
    return this._value.length;
  }

  /**
   * Checks if this slug is a prefix of another slug.
   * @param other The other slug to compare
   * @returns true if this slug is a prefix
   */
  public isPrefixOf(other: ArtifactSlug): boolean {
    return other._value.startsWith(this._value);
  }

  /**
   * Checks equality with another ArtifactSlug.
   * @param other The other ArtifactSlug to compare
   * @returns true if values are equal
   */
  public equals(other: ArtifactSlug): boolean {
    if (!(other instanceof ArtifactSlug)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Returns the string representation of the ArtifactSlug.
   */
  public toString(): string {
    return this._value;
  }
}