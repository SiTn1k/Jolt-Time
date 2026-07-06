/**
 * QA Snapshot DTO
 *
 * Data Transfer Object for QA snapshot requests and responses.
 */

import type { QAMetadata } from '../types/QAMetadata';
import type { HealthStatus } from '../types/HealthStatus';

/**
 * DTO for creating a new QA snapshot.
 */
export interface CreateQASnapshotDto {
  /** Snapshot ID */
  snapshotId?: string;

  /** Backend version at snapshot time */
  backendVersion: string;

  /** Number of modules at snapshot time */
  moduleCount: number;

  /** Health status at snapshot time */
  healthStatus: HealthStatus;

  /** Metadata */
  metadata?: QAMetadata;
}

/**
 * DTO for QA snapshot response.
 */
export interface QASnapshotResponseDto {
  /** Snapshot ID */
  snapshotId: string;

  /** Creation timestamp */
  createdAt: string;

  /** Backend version at snapshot time */
  backendVersion: string;

  /** Number of modules at snapshot time */
  moduleCount: number;

  /** Health status at snapshot time */
  healthStatus: HealthStatus;

  /** Metadata */
  metadata: QAMetadata;
}

/**
 * DTO for updating a QA snapshot.
 */
export interface UpdateQASnapshotDto {
  /** Backend version */
  backendVersion?: string;

  /** Module count */
  moduleCount?: number;

  /** Health status */
  healthStatus?: HealthStatus;

  /** Metadata */
  metadata?: QAMetadata;
}
