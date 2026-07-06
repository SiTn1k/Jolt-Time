/**
 * ReleaseResponse DTO
 *
 * Response DTOs for release overview operations.
 */

import type { ReleaseCandidateDto } from './Release.dto';
import type { ReleaseChecklistDto } from './Checklist.dto';
import type { ReleaseSnapshotDto } from './Snapshot.dto';
import type { ReleaseStatistics } from '../types/ReleaseMetadata';

/**
 * DTO for release overview response.
 */
export interface ReleaseOverviewResponseDto {
  release: ReleaseCandidateDto;
  statistics: ReleaseStatistics;
  recentChecklists: ReleaseChecklistDto[];
  recentSnapshots: ReleaseSnapshotDto[];
}

/**
 * DTO for release statistics response.
 */
export interface ReleaseStatisticsResponseDto {
  statistics: ReleaseStatistics;
}
