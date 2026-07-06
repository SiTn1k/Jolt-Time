/**
 * HardeningSnapshot DTO
 *
 * Data transfer objects for hardening snapshot operations.
 */

import type { SnapshotMetadata } from '../types/HardeningMetadata';

/**
 * DTO for hardening snapshot data.
 */
export interface HardeningSnapshotDto {
  snapshotId: string;
  createdAt: string;
  systemVersion: string;
  moduleCount: number;
  healthStatus: string;
  metadata: SnapshotMetadata;
}

/**
 * DTO for hardening snapshot response.
 */
export interface HardeningSnapshotResponseDto {
  snapshot: HardeningSnapshotDto;
}

/**
 * DTO for hardening snapshot list response.
 */
export interface HardeningSnapshotListResponseDto {
  snapshots: HardeningSnapshotDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
