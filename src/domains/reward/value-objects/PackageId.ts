/**
 * PackageId Value Object
 *
 * Unique identifier for a reward package.
 */

import { assertIsNonEmptyString } from '../../../shared/utils/assertion.utils';

/**
 * PackageId value object for unique package identification.
 */
export class PackageId {
  private readonly _value: string;

  /**
   * Creates a new PackageId instance.
   */
  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates a new random PackageId.
   */
  public static create(): PackageId {
    const value = `pkg_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    return new PackageId(value);
  }

  /**
   * Reconstructs a PackageId from a stored value.
   */
  public static reconstruct(value: string): PackageId {
    assertIsNonEmptyString(value, 'PackageId');
    return new PackageId(value);
  }

  /**
   * Gets the string value of the PackageId.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another PackageId.
   */
  public equals(other: PackageId): boolean {
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