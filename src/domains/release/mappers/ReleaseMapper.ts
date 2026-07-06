/**
 * ReleaseMapper
 *
 * Maps between ReleaseCandidate entity and DTOs.
 * No database logic - pure transformation only.
 */

import type { ReleaseCandidate, ReleaseCandidateRecord } from '../entities/ReleaseCandidate';
import type {
  ReleaseCandidateDto,
  ReleaseResponseDto,
  ReleaseListResponseDto,
} from '../dto/Release.dto';
import type { ReleaseOverviewResponseDto } from '../dto/ReleaseResponse.dto';
import type { ReleaseStatistics } from '../types/ReleaseMetadata';

/**
 * Mapper for converting between ReleaseCandidate entity and DTOs.
 */
export class ReleaseMapper {
  /**
   * Converts a ReleaseCandidate entity to ReleaseCandidateDto.
   */
  public static toDto(release: ReleaseCandidate): ReleaseCandidateDto {
    return {
      releaseId: release.releaseId.value,
      version: release.version,
      status: release.status,
      stage: release.stage,
      createdAt: release.createdAt.toISOString(),
      approvedAt: release.approvedAt?.toISOString() ?? null,
      metadata: release.metadata,
      updatedAt: release.updatedAt.toISOString(),
    };
  }

  /**
   * Converts a ReleaseCandidate entity to ReleaseResponseDto.
   */
  public static toResponse(release: ReleaseCandidate): ReleaseResponseDto {
    return {
      release: this.toDto(release),
    };
  }

  /**
   * Converts a ReleaseCandidate entity to a database record format.
   */
  public static toRecord(release: ReleaseCandidate): ReleaseCandidateRecord {
    return release.toRecord();
  }

  /**
   * Converts a database record to ReleaseCandidateDto.
   */
  public static fromRecordToDto(record: ReleaseCandidateRecord): ReleaseCandidateDto {
    return {
      releaseId: record.releaseId,
      version: record.version,
      status: record.status,
      stage: record.stage,
      createdAt: record.createdAt,
      approvedAt: record.approvedAt,
      metadata: record.metadata,
      updatedAt: record.updatedAt,
    };
  }

  /**
   * Converts an array of ReleaseCandidate entities to ReleaseListResponseDto.
   */
  public static toListResponse(
    releases: ReleaseCandidate[],
    total: number,
    page: number,
    pageSize: number
  ): ReleaseListResponseDto {
    return {
      releases: releases.map((release) => this.toDto(release)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Converts a ReleaseCandidate and statistics to ReleaseOverviewResponseDto.
   */
  public static toOverviewResponse(
    release: ReleaseCandidate,
    statistics: ReleaseStatistics,
    recentChecklists: ReleaseCandidate['metadata'][],
    recentSnapshots: ReleaseCandidate['metadata'][]
  ): ReleaseOverviewResponseDto {
    return {
      release: this.toDto(release),
      statistics,
      recentChecklists: recentChecklists as ReleaseOverviewResponseDto['recentChecklists'],
      recentSnapshots: recentSnapshots as ReleaseOverviewResponseDto['recentSnapshots'],
    };
  }
}
