/**
 * RewardId Value Object
 *
 * Unique identifier for a reward definition.
 */

import { assertIsNonEmptyString } from '../../../shared/utils/assertion.utils';

/**
 * RewardId value object for unique reward identification.
 */
export class RewardId {
  private readonly _value: string;

  /**
   * Creates a new RewardId instance.
   */
  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates a new random RewardId.
   */
  public static create(): RewardId {
    const value = `rew_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    return new RewardId(value);
  }

  /**
   * Reconstructs a RewardId from a stored value.
   */
  public static reconstruct(value: string): RewardId {
    assertIsNonEmptyString(value, 'RewardId');
    return new RewardId(value);
  }

  /**
   * Gets the string value of the RewardId.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another RewardId.
   */
  public equals(other: RewardId): boolean {
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