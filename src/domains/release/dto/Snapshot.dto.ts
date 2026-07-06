/**
 * Snapshot DTO
 *
 * Data transfer objects for snapshot operations.
 */

import type { SnapshotMetadata } from '../types/ReleaseMetadata';

/**
 * DTO for snapshot data.
 */
export interface ReleaseSnapshotDto {
  snapshotId: string;
  createdAt: string;
  backendVersion: string;
  databaseVersion: string;
  gitCommit: string;
  metadata: SnapshotMetadata;
}

/**
 * DTO for snapshot response.
 */
export interface SnapshotResponseDto {
  snapshot: ReleaseSnapshotDto;
}

/**
 * DTO for snapshot list response.
 */
export interface SnapshotListResponseDto {
  snapshots: ReleaseSnapshotDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
