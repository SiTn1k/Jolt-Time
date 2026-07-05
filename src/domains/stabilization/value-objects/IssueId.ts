/**
 * IssueId Value Object
 *
 * Unique identifier for stabilization issues.
 */

import { nanoid } from 'nanoid';

export const ISSUE_ID_PREFIX = 'iss';
export const ISSUE_ID_LENGTH = 12;

/**
 * IssueId value object for unique issue identification.
 */
export class IssueId {
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  /**
   * Generates a new IssueId with a unique value.
   */
  public static generate(): IssueId {
    const uniquePart = nanoid(ISSUE_ID_LENGTH);
    return new IssueId(`${ISSUE_ID_PREFIX}_${uniquePart}`);
  }

  /**
   * Reconstructs an IssueId from a string value.
   * @param value The string value to reconstruct
   */
  public static reconstruct(value: string): IssueId {
    if (!value || value.trim().length === 0) {
      throw new Error('IssueId cannot be empty');
    }
    return new IssueId(value);
  }

  /**
   * Checks equality with another IssueId.
   */
  public equals(other: IssueId): boolean {
    return this.value === other.value;
  }

  /**
   * Returns string representation.
   */
  public toString(): string {
    return this.value;
  }
}
