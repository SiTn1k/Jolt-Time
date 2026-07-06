/**
 * Snapshot DTO
 *
 * Data transfer objects for snapshot operations.
 */

import type { SnapshotMetadata, SystemHealth } from '../types/ProductionMetadata';

/**
 * DTO for snapshot data.
 */
export interface SnapshotDto {
  snapshotId: string;
  createdAt: string;
  backendVersion: string;
  databaseVersion: string;
  systemHealth: SystemHealth;
  metadata: SnapshotMetadata;
}

/**
 * DTO for snapshot response.
 */
export interface SnapshotResponseDto {
  snapshot: SnapshotDto;
}

/**
 * DTO for snapshot list response.
 */
export interface SnapshotListResponseDto {
  snapshots: SnapshotDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
