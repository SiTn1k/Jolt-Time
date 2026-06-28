/**
 * RequestId Value Object
 *
 * Unique identifier for a reward request.
 */

import { assertIsNonEmptyString } from '../../../shared/utils/assertion.utils';

/**
 * RequestId value object for unique request identification.
 */
export class RequestId {
  private readonly _value: string;

  /**
   * Creates a new RequestId instance.
   */
  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Creates a new random RequestId.
   */
  public static create(): RequestId {
    const value = `req_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    return new RequestId(value);
  }

  /**
   * Reconstructs a RequestId from a stored value.
   */
  public static reconstruct(value: string): RequestId {
    assertIsNonEmptyString(value, 'RequestId');
    return new RequestId(value);
  }

  /**
   * Gets the string value of the RequestId.
   */
  public get value(): string {
    return this._value;
  }

  /**
   * Checks equality with another RequestId.
   */
  public equals(other: RequestId): boolean {
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