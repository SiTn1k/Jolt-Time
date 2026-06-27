/**
 * Museum Mapper
 *
 * Maps between Museum entity and various DTOs.
 * No database logic - pure transformation only.
 */

import { Museum } from '../entities/Museum';
import type { MuseumRecord } from '../entities/Museum';
import type { CreateMuseumDto } from '../dto/CreateMuseum.dto';
import type { MuseumResponseDto, MuseumSummaryDto, MuseumWithHallsDto } from '../dto/MuseumResponse.dto';
import type { MuseumHallSummaryDto } from '../dto/MuseumResponse.dto';

/**
 * Mapper for converting between Museum entity and DTOs.
 */
export class MuseumMapper {
  /**
   * Converts a Museum entity to MuseumResponseDto.
   */
  public static toResponse(museum: Museum): MuseumResponseDto {
    return {
      museumId: museum.museumId.value,
      playerProfileId: museum.playerProfileId.value,
      museumName: museum.museumName,
      museumType: museum.museumType,
      level: museum.level,
      rating: museum.rating,
      statistics: museum.statistics,
      metadata: museum.metadata,
      createdAt: museum.createdAt.toISOString(),
      updatedAt: museum.updatedAt.toISOString(),
    };
  }

  /**
   * Converts a Museum entity to MuseumSummaryDto.
   */
  public static toSummary(museum: Museum): MuseumSummaryDto {
    return {
      museumId: museum.museumId.value,
      museumName: museum.museumName,
      level: museum.level,
      rating: museum.rating,
      totalExhibits: museum.statistics.totalExhibits,
      hallCount: museum.statistics.hallCount,
      completionPercentage: museum.statistics.completionPercentage,
    };
  }

  /**
   * Converts a Museum entity to MuseumWithHallsDto.
   */
  public static toWithHalls(museum: Museum, halls: MuseumHallSummaryDto[]): MuseumWithHallsDto {
    return {
      ...this.toResponse(museum),
      halls,
    };
  }

  /**
   * Converts an array of Museum entities to MuseumResponseDto array.
   */
  public static toResponseList(museums: Museum[]): MuseumResponseDto[] {
    return museums.map((museum) => this.toResponse(museum));
  }

  /**
   * Converts an array of Museum entities to MuseumSummaryDto array.
   */
  public static toSummaryList(museums: Museum[]): MuseumSummaryDto[] {
    return museums.map((museum) => this.toSummary(museum));
  }

  /**
   * Converts a CreateMuseumDto to entity input.
   * Note: This creates input for entity creation, not the entity itself.
   */
  public static fromCreateDto(dto: CreateMuseumDto): Omit<CreateMuseumDto, never> {
    return {
      museumName: dto.museumName,
      playerProfileId: dto.playerProfileId,
      museumType: dto.museumType,
      level: dto.level,
    };
  }

  /**
   * Converts a database record to Museum entity format.
   */
  public static fromRecord(record: MuseumRecord): Museum {
    return Museum.fromDatabase(record);
  }

  /**
   * Converts a Museum entity to a database record format.
   * Note: This is for mapping TO record format, not actual database operations.
   */
  public static toRecord(museum: Museum): MuseumRecord {
    return {
      museum_id: museum.museumId.value,
      player_profile_id: museum.playerProfileId.value,
      museum_name: museum.museumName,
      museum_type: museum.museumType,
      level: museum.level,
      rating: museum.rating,
      statistics: museum.statistics,
      metadata: museum.metadata,
      created_at: museum.createdAt.toISOString(),
      updated_at: museum.updatedAt.toISOString(),
    };
  }
}


