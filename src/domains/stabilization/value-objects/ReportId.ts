/**
 * ReportId Value Object
 *
 * Unique identifier for stabilization reports.
 */

import { nanoid } from 'nanoid';

export const REPORT_ID_PREFIX = 'rpt';
export const REPORT_ID_LENGTH = 12;

/**
 * ReportId value object for unique report identification.
 */
export class ReportId {
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  /**
   * Generates a new ReportId with a unique value.
   */
  public static generate(): ReportId {
    const uniquePart = nanoid(REPORT_ID_LENGTH);
    return new ReportId(`${REPORT_ID_PREFIX}_${uniquePart}`);
  }

  /**
   * Reconstructs a ReportId from a string value.
   * @param value The string value to reconstruct
   */
  public static reconstruct(value: string): ReportId {
    if (!value || value.trim().length === 0) {
      throw new Error('ReportId cannot be empty');
    }
    return new ReportId(value);
  }

  /**
   * Checks equality with another ReportId.
   */
  public equals(other: ReportId): boolean {
    return this.value === other.value;
  }

  /**
   * Returns string representation.
   */
  public toString(): string {
    return this.value;
  }
}
