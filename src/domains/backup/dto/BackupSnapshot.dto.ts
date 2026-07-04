/**
 * BackupSnapshotDto
 *
 * Data Transfer Object for backup snapshot operations.
 */

import type { BackupType } from '../types/BackupType';
import type { BackupStatus } from '../types/BackupStatus';
import type { SnapshotMetadata } from '../types/BackupMetadata';

/**
 * DTO for snapshot data.
 */
export interface BackupSnapshotDto {
  snapshotId: string;
  snapshotName: string;
  backupType: BackupType;
  status: BackupStatus;
  size: number;
  checksum: string | null;
  storageLocation: string;
  createdAt: string;
  metadata: SnapshotMetadata;
}

/**
 * DTO for creating a new snapshot.
 */
export interface CreateSnapshotDto {
  snapshotName: string;
  backupType: BackupType;
  storageLocation: string;
  metadata?: Partial<SnapshotMetadata>;
}

/**
 * DTO for updating a snapshot.
 */
export interface UpdateSnapshotDto {
  snapshotName?: string;
  status?: BackupStatus;
  size?: number;
  checksum?: string | null;
  metadata?: Partial<SnapshotMetadata>;
}

/**
 * DTO for snapshot list response.
 */
export interface SnapshotListDto {
  snapshots: BackupSnapshotDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
