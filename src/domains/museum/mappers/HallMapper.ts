/**
 * Hall Mapper
 *
 * Maps between MuseumHall entity and various DTOs.
 * No database logic - pure transformation only.
 */

import { MuseumHall } from '../entities/MuseumHall';
import type { MuseumHallRecord } from '../entities/MuseumHall';
import type { CreateHallDto } from '../dto/CreateHall.dto';
import type { MuseumHallResponseDto, MuseumHallSummaryDto, HallWithExhibitsDto } from '../dto/MuseumResponse.dto';

/**
 * Mapper for converting between MuseumHall entity and DTOs.
 */
export class HallMapper {
  /**
   * Converts a MuseumHall entity to MuseumHallResponseDto.
   */
  public static toResponse(hall: MuseumHall): MuseumHallResponseDto {
    return {
      hallId: hall.hallId.value,
      museumId: hall.museumId.value,
      hallType: hall.hallType,
      hallName: hall.hallName,
      capacity: hall.capacity.value,
      position: hall.position,
      metadata: hall.metadata,
      statistics: {
        exhibitCount: 0, // Calculated at service level
        utilizationPercentage: 0, // Calculated at service level
        averagePopularity: 0, // Calculated at service level
        version: 1,
      },
      createdAt: hall.createdAt.toISOString(),
      updatedAt: hall.updatedAt.toISOString(),
    };
  }

  /**
   * Converts a MuseumHall entity to MuseumHallResponseDto with statistics.
   */
  public static toResponseWithStatistics(
    hall: MuseumHall,
    exhibitCount: number,
    utilizationPercentage: number,
    averagePopularity: number
  ): MuseumHallResponseDto {
    return {
      hallId: hall.hallId.value,
      museumId: hall.museumId.value,
      hallType: hall.hallType,
      hallName: hall.hallName,
      capacity: hall.capacity.value,
      position: hall.position,
      metadata: hall.metadata,
      statistics: {
        exhibitCount,
        utilizationPercentage,
        averagePopularity,
        version: 1,
      },
      createdAt: hall.createdAt.toISOString(),
      updatedAt: hall.updatedAt.toISOString(),
    };
  }

  /**
   * Converts a MuseumHall entity to MuseumHallSummaryDto.
   */
  public static toSummary(hall: MuseumHall, exhibitCount: number): MuseumHallSummaryDto {
    const utilization = hall.capacity.value > 0
      ? Math.round((exhibitCount / hall.capacity.value) * 100)
      : 0;

    return {
      hallId: hall.hallId.value,
      hallType: hall.hallType,
      hallName: hall.hallName,
      capacity: hall.capacity.value,
      exhibitCount,
      utilizationPercentage: utilization,
    };
  }

  /**
   * Converts a MuseumHall entity to HallWithExhibitsDto.
   */
  public static toWithExhibits(hall: MuseumHall, exhibits: MuseumExhibitSummaryDto[], exhibitCount: number): HallWithExhibitsDto {
    const utilization = hall.capacity.value > 0
      ? Math.round((exhibitCount / hall.capacity.value) * 100)
      : 0;

    return {
      hallId: hall.hallId.value,
      museumId: hall.museumId.value,
      hallType: hall.hallType,
      hallName: hall.hallName,
      capacity: hall.capacity.value,
      position: hall.position,
      metadata: hall.metadata,
      statistics: {
        exhibitCount,
        utilizationPercentage: utilization,
        averagePopularity: 0,
        version: 1,
      },
      exhibits,
      createdAt: hall.createdAt.toISOString(),
      updatedAt: hall.updatedAt.toISOString(),
    };
  }

  /**
   * Converts an array of MuseumHall entities to MuseumHallResponseDto array.
   */
  public static toResponseList(halls: MuseumHall[]): MuseumHallResponseDto[] {
    return halls.map((hall) => this.toResponse(hall));
  }

  /**
   * Converts an array of MuseumHall entities to MuseumHallSummaryDto array.
   */
  public static toSummaryList(halls: MuseumHall[], exhibitCounts: Map<string, number>): MuseumHallSummaryDto[] {
    return halls.map((hall) => this.toSummary(hall, exhibitCounts.get(hall.hallId.value) ?? 0));
  }

  /**
   * Converts a CreateHallDto to entity input.
   * Note: This creates input for entity creation, not the entity itself.
   */
  public static fromCreateDto(dto: CreateHallDto): Omit<CreateHallDto, never> {
    return {
      museumId: dto.museumId,
      hallType: dto.hallType,
      hallName: dto.hallName,
      position: dto.position,
      capacity: dto.capacity,
    };
  }

  /**
   * Converts a database record to MuseumHall entity format.
   */
  public static fromRecord(record: MuseumHallRecord): MuseumHall {
    return MuseumHall.fromDatabase(record);
  }

  /**
   * Converts a MuseumHall entity to a database record format.
   * Note: This is for mapping TO record format, not actual database operations.
   */
  public static toRecord(hall: MuseumHall): MuseumHallRecord {
    return {
      hall_id: hall.hallId.value,
      museum_id: hall.museumId.value,
      hall_type: hall.hallType,
      hall_name: hall.hallName,
      capacity: hall.capacity.value,
      position: hall.position,
      metadata: hall.metadata,
      created_at: hall.createdAt.toISOString(),
      updated_at: hall.updatedAt.toISOString(),
    };
  }
}

/**
 * Placeholder imports - will be resolved at runtime.
 */
import type { MuseumExhibitSummaryDto } from '../dto/MuseumResponse.dto';
