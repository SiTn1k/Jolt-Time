/**
 * ArtifactTitle Value Object
 *
 * Immutable value object representing an artifact's display name.
 * Encapsulates validation rules and title formatting.
 */

/**
 * Title validation constraints.
 */
export const ARTIFACT_TITLE_CONSTRAINTS = {
  MIN_LENGTH: 2,
  MAX_LENGTH: 256,
} as const;

/**
 * ArtifactTitle value object class.
 * Immutable - once created, cannot be modified.
 */
export class ArtifactTitle {
  private readonly _value: string;

  /**
   * Private constructor enforces use of static factory method.
   * @param value The title string value
   */
  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates an ArtifactTitle from a string value.
   * Validates length and character restrictions.
   * @param value The title string
   * @returns A new ArtifactTitle instance
   * @throws Error if validation fails
   */
  public static create(value: string | null | undefined): ArtifactTitle {
    if (value === null || value === undefined) {
      throw new Error('ArtifactTitle cannot be null or undefined');
    }

    const trimmed = value.trim();

    if (trimmed.length < ARTIFACT_TITLE_CONSTRAINTS.MIN_LENGTH) {
      throw new Error(
        `ArtifactTitle must be at least ${ARTIFACT_TITLE_CONSTRAINTS.MIN_LENGTH} characters`
      );
    }

    if (trimmed.length > ARTIFACT_TITLE_CONSTRAINTS.MAX_LENGTH) {
      throw new Error(
        `ArtifactTitle must be at most ${ARTIFACT_TITLE_CONSTRAINTS.MAX_LENGTH} characters`
      );
    }

    return new ArtifactTitle(trimmed);
  }

  /**
   * Reconstructs an ArtifactTitle from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   * @param value The title string
   * @returns A new ArtifactTitle instance
   */
  public static reconstruct(value: string): ArtifactTitle {
    return new ArtifactTitle(value);
  }

  /**
   * Creates an ArtifactTitle without validation.
   * Use with caution - only for trusted input.
   * @param value The title string
   * @returns A new ArtifactTitle instance
   */
  public static createUnchecked(value: string): ArtifactTitle {
    return new ArtifactTitle(value.trim());
  }

  /**
   * Gets the underlying title value.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Gets the title length.
   */
  public get length(): number {
    return this._value.length;
  }

  /**
   * Gets the title word count.
   */
  public get wordCount(): number {
    return this._value.split(/\s+/).filter(Boolean).length;
  }

  /**
   * Checks if the title starts with an article.
   */
  public get hasLeadingArticle(): boolean {
    return /^(the|a|an)\s+/i.test(this._value);
  }

  /**
   * Gets the title without leading article.
   */
  public withoutLeadingArticle(): string {
    return this._value.replace(/^(the|a|an)\s+/i, '');
  }

  /**
   * Checks equality with another ArtifactTitle.
   * @param other The other ArtifactTitle to compare
   * @returns true if values are equal
   */
  public equals(other: ArtifactTitle): boolean {
    if (!(other instanceof ArtifactTitle)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Returns the string representation of the ArtifactTitle.
   */
  public toString(): string {
    return this._value;
  }
}