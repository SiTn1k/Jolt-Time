/**
 * RestorePointDto
 *
 * Data Transfer Object for restore point operations.
 */

import type { RestoreMetadata } from '../types/BackupMetadata';

/**
 * DTO for restore point data.
 */
export interface RestorePointDto {
  restorePointId: string;
  snapshotId: string;
  createdAt: string;
  description: string;
  metadata: RestoreMetadata;
}

/**
 * DTO for creating a new restore point.
 */
export interface CreateRestorePointDto {
  snapshotId: string;
  description?: string;
  metadata?: Partial<RestoreMetadata>;
}

/**
 * DTO for restore point list response.
 */
export interface RestorePointListDto {
  restorePoints: RestorePointDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
