/**
 * Academy Mapper
 *
 * Maps between Academy entity and various DTOs.
 * No database logic - pure transformation only.
 */

import type { Academy } from '../entities/Academy';
import type { CreateAcademyDto } from '../dto/CreateAcademy.dto';
import type { AcademyResponseDto, AcademySummaryDto, AcademyDetailDto, AcademyStatisticsResponseDto } from '../dto/AcademyResponse.dto';
import type { AcademyStatistics } from '../types/AcademyStatistics';
import { getResearchCategoryDisplayName } from '../types/ResearchCategory';
import { getResearchTierDisplayName } from '../types/ResearchTier';

/**
 * Mapper for converting between Academy entity and DTOs.
 */
export class AcademyMapper {
  /**
   * Converts an Academy entity to AcademyResponseDto.
   */
  public static toResponse(academy: Academy): AcademyResponseDto {
    return {
      academyId: academy.academyId.value,
      playerProfileId: academy.playerProfileId.value,
      academyLevel: academy.academyLevel,
      researchPoints: academy.researchPoints.amount,
      metadata: academy.metadata,
      createdAt: academy.createdAt.toISOString(),
      updatedAt: academy.updatedAt.toISOString(),
    };
  }

  /**
   * Converts an Academy entity to AcademySummaryDto.
   */
  public static toSummary(academy: Academy): AcademySummaryDto {
    return {
      academyId: academy.academyId.value,
      academyLevel: academy.academyLevel,
      researchPoints: academy.researchPoints.amount,
    };
  }

  /**
   * Converts an Academy entity to AcademyDetailDto.
   */
  public static toDetail(
    academy: Academy,
    statistics: AcademyStatistics,
    totalResearchCompleted: number
  ): AcademyDetailDto {
    const researchSlots = academy.metadata.researchSlots ?? 1;
    const categoriesExplored = academy.metadata.categoriesExplored ?? [];

    return {
      academyId: academy.academyId.value,
      playerProfileId: academy.playerProfileId.value,
      academyLevel: academy.academyLevel,
      researchPoints: academy.researchPoints.amount,
      metadata: academy.metadata,
      createdAt: academy.createdAt.toISOString(),
      updatedAt: academy.updatedAt.toISOString(),
      statistics,
      totalResearchCompleted,
      researchSlots,
      availableSlots: researchSlots, // Simplified for foundation
      categoriesExploredCount: categoriesExplored.length,
      highestTierReached: academy.metadata.highestTierReached ?? 1,
    };
  }

  /**
   * Converts an Academy entity to AcademyStatisticsResponseDto.
   */
  public static toStatisticsResponse(statistics: AcademyStatistics): AcademyStatisticsResponseDto {
    // Convert category keys to strings for response
    const completedByCategory: Record<string, number> = {};
    for (const [key, value] of Object.entries(statistics.completedByCategory)) {
      completedByCategory[key] = value ?? 0;
    }

    // Convert tier keys to strings for response
    const completedByTier: Record<string, number> = {};
    for (const [key, value] of Object.entries(statistics.completedByTier)) {
      completedByTier[key] = value ?? 0;
    }

    return {
      totalResearchCompleted: statistics.totalResearchCompleted,
      totalPointsSpent: statistics.totalPointsSpent,
      totalPointsEarned: statistics.totalPointsEarned,
      currentPoints: statistics.currentPoints,
      academyLevel: statistics.academyLevel,
      totalResearchTime: statistics.totalResearchTime,
      completedByCategory,
      completedByTier,
      longestStreak: statistics.longestStreak,
      currentStreak: statistics.currentStreak,
      averageResearchDuration: statistics.averageResearchDuration,
      fastestResearchCompletion: statistics.fastestResearchCompletion,
      mostProductiveSession: statistics.mostProductiveSession,
      lastResearchAt: statistics.lastResearchAt,
    };
  }

  /**
   * Converts an array of Academy entities to AcademyResponseDto array.
   */
  public static toResponseList(academies: Academy[]): AcademyResponseDto[] {
    return academies.map((academy) => this.toResponse(academy));
  }

  /**
   * Converts an array of Academy entities to AcademySummaryDto array.
   */
  public static toSummaryList(academies: Academy[]): AcademySummaryDto[] {
    return academies.map((academy) => this.toSummary(academy));
  }

  /**
   * Converts a CreateAcademyDto to entity input.
   * Note: This creates input for entity creation, not the entity itself.
   */
  public static fromCreateDto(dto: CreateAcademyDto): Omit<CreateAcademyDto, never> {
    return {
      playerProfileId: dto.playerProfileId,
      initialResearchPoints: dto.initialResearchPoints,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts an Academy entity to a database record format.
   * Note: This is for mapping TO record format, not actual database operations.
   */
  public static toRecord(academy: Academy): {
    academyId: string;
    playerProfileId: string;
    academyLevel: number;
    researchPoints: number;
    metadata: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
  } {
    return {
      academyId: academy.academyId.value,
      playerProfileId: academy.playerProfileId.value,
      academyLevel: academy.academyLevel,
      researchPoints: academy.researchPoints.amount,
      metadata: academy.metadata as Record<string, unknown>,
      createdAt: academy.createdAt.toISOString(),
      updatedAt: academy.updatedAt.toISOString(),
    };
  }
}

/**
 * Database record representation of Academy.
 * For use in repository mapping.
 */
export interface AcademyRecord {
  academyId: string;
  playerProfileId: string;
  academyLevel: number;
  researchPoints: number;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}