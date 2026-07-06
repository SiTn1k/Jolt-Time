/**
 * IQASnapshot Interface
 *
 * Interface defining the contract for QA snapshot entities.
 */

import type { SnapshotId } from '../value-objects/SnapshotId';
import type { HealthStatus } from '../types/HealthStatus';
import type { QAMetadata } from '../types/QAMetadata';

/**
 * QA snapshot interface.
 * Defines the contract for QA snapshot entities.
 */
export interface IQASnapshot {
  /** Unique QA snapshot identifier */
  readonly snapshotId: SnapshotId;

  /** Timestamp when the snapshot was created */
  readonly createdAt: Date;

  /** Backend version at snapshot time */
  readonly backendVersion: string;

  /** Number of modules at snapshot time */
  readonly moduleCount: number;

  /** Health status at snapshot time */
  readonly healthStatus: HealthStatus;

  /** Additional metadata */
  readonly metadata: QAMetadata;
}
