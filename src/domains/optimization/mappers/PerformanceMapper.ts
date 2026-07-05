/**
 * Performance Mapper
 *
 * Maps between PerformanceProfile entity and various DTOs.
 * No database logic - pure transformation only.
 */

import type { PerformanceProfile, PerformanceProfileRecord } from '../entities/PerformanceProfile';
import type { CreatePerformanceProfileDto, UpdatePerformanceProfileDto, PerformanceProfileResponseDto } from '../dto/PerformanceProfile.dto';

/**
 * Mapper for converting between PerformanceProfile entity and DTOs.
 */
export class PerformanceMapper {
  /**
   * Converts a PerformanceProfile entity to PerformanceProfileResponseDto.
   */
  public static toResponse(profile: PerformanceProfile): PerformanceProfileResponseDto {
    return {
      profileId: profile.profileId.value,
      moduleName: profile.moduleName,
      averageExecutionTime: profile.averageExecutionTime,
      peakExecutionTime: profile.peakExecutionTime,
      memoryUsage: profile.memoryUsage,
      cpuUsage: profile.cpuUsage,
      profileType: profile.profileType,
      metadata: profile.metadata,
    };
  }

  /**
   * Converts an array of PerformanceProfile entities to PerformanceProfileResponseDto array.
   */
  public static toResponseList(profiles: PerformanceProfile[]): PerformanceProfileResponseDto[] {
    return profiles.map((profile) => this.toResponse(profile));
  }

  /**
   * Converts a CreatePerformanceProfileDto to entity input.
   * Note: This creates input for entity creation, not the entity itself.
   */
  public static fromCreateDto(dto: CreatePerformanceProfileDto): Omit<CreatePerformanceProfileDto, never> {
    return {
      moduleName: dto.moduleName,
      averageExecutionTime: dto.averageExecutionTime,
      peakExecutionTime: dto.peakExecutionTime,
      memoryUsage: dto.memoryUsage,
      cpuUsage: dto.cpuUsage,
      profileType: dto.profileType,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts an UpdatePerformanceProfileDto to partial entity input.
   */
  public static fromUpdateDto(dto: UpdatePerformanceProfileDto): Partial<CreatePerformanceProfileDto> {
    return {
      averageExecutionTime: dto.averageExecutionTime,
      peakExecutionTime: dto.peakExecutionTime,
      memoryUsage: dto.memoryUsage,
      cpuUsage: dto.cpuUsage,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts a database record to CreatePerformanceProfileDto format.
   */
  public static fromRecordToDto(record: PerformanceProfileRecord): CreatePerformanceProfileDto {
    return {
      moduleName: record.module_name,
      averageExecutionTime: record.average_execution_time,
      peakExecutionTime: record.peak_execution_time,
      memoryUsage: record.memory_usage,
      cpuUsage: record.cpu_usage,
      profileType: record.profile_type as CreatePerformanceProfileDto['profileType'],
      metadata: record.metadata,
    };
  }

  /**
   * Converts a PerformanceProfile entity to a database record format.
   * Note: This is for mapping TO record format, not actual database operations.
   */
  public static toRecord(profile: PerformanceProfile): Omit<PerformanceProfileRecord, never> {
    return {
      profile_id: profile.profileId.value,
      module_name: profile.moduleName,
      average_execution_time: profile.averageExecutionTime,
      peak_execution_time: profile.peakExecutionTime,
      memory_usage: profile.memoryUsage,
      cpu_usage: profile.cpuUsage,
      profile_type: profile.profileType,
      metadata: profile.metadata,
    };
  }
}
