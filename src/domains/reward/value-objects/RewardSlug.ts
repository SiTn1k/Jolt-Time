/**
 * RewardSlug Value Object
 *
 * URL-safe identifier for a reward.
 */

import { assertIsNonEmptyString } from '../../../shared/utils/assertion.utils';

/**
 * Slug pattern for validation.
 */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * RewardSlug value object for URL-safe reward identification.
 */
export class RewardSlug {
  private readonly _value: string;

  /**
   * Creates a new RewardSlug instance.
   */
  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates a new RewardSlug from a string.
   */
  public static create(value: string): RewardSlug {
    assertIsNonEmptyString(value, 'RewardSlug');
    const normalized = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (!SLUG_PATTERN.test(normalized)) {
      throw new Error('Invalid RewardSlug format');
    }
    return new RewardSlug(normalized);
  }

  /**
   * Reconstructs a RewardSlug from a stored value.
   */
  public static reconstruct(value: string): RewardSlug {
    assertIsNonEmptyString(value, 'RewardSlug');
    if (!SLUG_PATTERN.test(value)) {
      throw new Error('Invalid RewardSlug format');
    }
    return new RewardSlug(value);
  }

  /**
   * Gets the string value of the RewardSlug.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another RewardSlug.
   */
  public equals(other: RewardSlug): boolean {
    return this._value === other._value;
  }

  /**
   * Returns string representation.
   */
  public toString(): string {
    return this._value;
  }

  /**
   * Returns JSON representation.
   */
  public toJSON(): string {
    return this._value;
  }
}