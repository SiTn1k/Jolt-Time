/**
 * HealthSnapshotId Value Object
 *
 * Unique identifier for health snapshots.
 */

import { nanoid } from 'nanoid';

export const HEALTH_SNAPSHOT_ID_PREFIX = 'hs';
export const HEALTH_SNAPSHOT_ID_LENGTH = 12;

/**
 * HealthSnapshotId value object for unique health snapshot identification.
 */
export class HealthSnapshotId {
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  /**
   * Generates a new HealthSnapshotId with a unique value.
   */
  public static generate(): HealthSnapshotId {
    const uniquePart = nanoid(HEALTH_SNAPSHOT_ID_LENGTH);
    return new HealthSnapshotId(`${HEALTH_SNAPSHOT_ID_PREFIX}_${uniquePart}`);
  }

  /**
   * Reconstructs a HealthSnapshotId from a string value.
   * @param value The string value to reconstruct
   */
  public static reconstruct(value: string): HealthSnapshotId {
    if (!value || value.trim().length === 0) {
      throw new Error('HealthSnapshotId cannot be empty');
    }
    return new HealthSnapshotId(value);
  }

  /**
   * Checks equality with another HealthSnapshotId.
   */
  public equals(other: HealthSnapshotId): boolean {
    return this.value === other.value;
  }

  /**
   * Returns string representation.
   */
  public toString(): string {
    return this.value;
  }
}
