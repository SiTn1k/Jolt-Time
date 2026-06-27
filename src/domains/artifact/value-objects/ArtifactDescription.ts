/**
 * ArtifactDescription Value Object
 *
 * Immutable value object representing an artifact's historical description.
 * Encapsulates validation rules and description formatting.
 */

/**
 * Description validation constraints.
 */
export const ARTIFACT_DESCRIPTION_CONSTRAINTS = {
  MIN_LENGTH: 10,
  MAX_LENGTH: 4096,
} as const;

/**
 * ArtifactDescription value object class.
 * Immutable - once created, cannot be modified.
 */
export class ArtifactDescription {
  private readonly _value: string;

  /**
   * Private constructor enforces use of static factory method.
   * @param value The description string value
   */
  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates an ArtifactDescription from a string value.
   * Validates length and content.
   * @param value The description string
   * @returns A new ArtifactDescription instance
   * @throws Error if validation fails
   */
  public static create(value: string | null | undefined): ArtifactDescription {
    if (value === null || value === undefined) {
      throw new Error('ArtifactDescription cannot be null or undefined');
    }

    const trimmed = value.trim();

    if (trimmed.length < ARTIFACT_DESCRIPTION_CONSTRAINTS.MIN_LENGTH) {
      throw new Error(
        `ArtifactDescription must be at least ${ARTIFACT_DESCRIPTION_CONSTRAINTS.MIN_LENGTH} characters`
      );
    }

    if (trimmed.length > ARTIFACT_DESCRIPTION_CONSTRAINTS.MAX_LENGTH) {
      throw new Error(
        `ArtifactDescription must be at most ${ARTIFACT_DESCRIPTION_CONSTRAINTS.MAX_LENGTH} characters`
      );
    }

    return new ArtifactDescription(trimmed);
  }

  /**
   * Reconstructs an ArtifactDescription from a value that was already validated.
   * Use this only when the value is guaranteed to be valid.
   * @param value The description string
   * @returns A new ArtifactDescription instance
   */
  public static reconstruct(value: string): ArtifactDescription {
    return new ArtifactDescription(value);
  }

  /**
   * Creates an ArtifactDescription without validation.
   * Use with caution - only for trusted input.
   * @param value The description string
   * @returns A new ArtifactDescription instance
   */
  public static createUnchecked(value: string): ArtifactDescription {
    return new ArtifactDescription(value.trim());
  }

  /**
   * Gets the underlying description value.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Gets the description length.
   */
  public get length(): number {
    return this._value.length;
  }

  /**
   * Gets the description word count.
   */
  public get wordCount(): number {
    return this._value.split(/\s+/).filter(Boolean).length;
  }

  /**
   * Gets the description sentence count.
   */
  public get sentenceCount(): number {
    return (this._value.match(/[.!?]+/g) ?? []).length;
  }

  /**
   * Truncates the description to the specified length.
   * @param maxLength Maximum length
   * @param suffix Suffix to append if truncated
   * @returns Truncated description
   */
  public truncate(maxLength: number, suffix: string = '...'): ArtifactDescription {
    if (this._value.length <= maxLength) {
      return this;
    }
    const truncated = this._value.slice(0, maxLength - suffix.length).trim() + suffix;
    return new ArtifactDescription(truncated);
  }

  /**
   * Checks equality with another ArtifactDescription.
   * @param other The other ArtifactDescription to compare
   * @returns true if values are equal
   */
  public equals(other: ArtifactDescription): boolean {
    if (!(other instanceof ArtifactDescription)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Returns the string representation of the ArtifactDescription.
   */
  public toString(): string {
    return this._value;
  }
}