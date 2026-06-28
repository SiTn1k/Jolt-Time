/**
 * RewardValue Value Object
 *
 * Represents the value/amount of a reward.
 */

import { assertIsPositive } from '../../../shared/utils/assertion.utils';
import type { RewardType } from '../types/RewardType';

/**
 * RewardValue value object for representing reward amounts.
 */
export class RewardValue {
  private readonly _amount: number;
  private readonly _type: RewardType;

  /**
   * Creates a new RewardValue instance.
   */
  private constructor(amount: number, type: RewardType) {
    this._amount = amount;
    this._type = type;
  }

  /**
   * Creates a new RewardValue.
   */
  public static create(params: { amount: number; type: RewardType }): RewardValue {
    assertIsPositive(params.amount, 'Reward amount');
    return new RewardValue(params.amount, params.type);
  }

  /**
   * Reconstructs a RewardValue from stored values.
   */
  public static reconstruct(amount: number, type: RewardType): RewardValue {
    return new RewardValue(amount, type);
  }

  /**
   * Gets the amount value.
   */
  public get amount(): number {
    return this._amount;
  }

  /**
   * Gets the reward type.
   */
  public get type(): RewardType {
    return this._type;
  }

  /**
   * Checks if this value is zero.
   */
  public get isZero(): boolean {
    return this._amount === 0;
  }

  /**
   * Checks if this value is positive.
   */
  public get isPositive(): boolean {
    return this._amount > 0;
  }

  /**
   * Checks equality with another RewardValue.
   */
  public equals(other: RewardValue): boolean {
    return this._amount === other._amount && this._type === other._type;
  }

  /**
   * Returns string representation.
   */
  public toString(): string {
    return `${this._amount} ${this._type}`;
  }

  /**
   * Returns JSON representation.
   */
  public toJSON(): { amount: number; type: RewardType } {
    return { amount: this._amount, type: this._type };
  }
}