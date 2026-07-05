/**
 * Integration Mapper
 *
 * Maps between IntegrationState entity and various DTOs.
 * No database logic - pure transformation only.
 */

import { IntegrationState, type IntegrationStateRecord } from '../entities/IntegrationState';
import type {
  CreateIntegrationStateDto,
  UpdateIntegrationStateDto,
  IntegrationStateResponseDto,
  IntegrationStateListResponseDto,
} from '../dto/IntegrationState.dto';

/**
 * Mapper for converting between IntegrationState entity and DTOs.
 */
export class IntegrationMapper {
  /**
   * Converts an IntegrationState entity to IntegrationStateResponseDto.
   */
  public static toResponse(state: IntegrationState): IntegrationStateResponseDto {
    return {
      stateId: state.stateId.value,
      moduleId: state.moduleId.value,
      status: state.status,
      lastUpdated: state.lastUpdated.toISOString(),
      metadata: state.metadata,
      createdAt: state.createdAt.toISOString(),
      updatedAt: state.updatedAt.toISOString(),
    };
  }

  /**
   * Converts an array of IntegrationState entities to IntegrationStateResponseDto array.
   */
  public static toResponseList(states: IntegrationState[]): IntegrationStateResponseDto[] {
    return states.map((state) => this.toResponse(state));
  }

  /**
   * Converts a CreateIntegrationStateDto to a plain object for entity creation.
   */
  public static fromCreateDto(dto: CreateIntegrationStateDto): {
    moduleId: string;
    status?: string;
    metadata: Record<string, unknown>;
  } {
    return {
      moduleId: dto.moduleId,
      status: dto.status,
      metadata: dto.metadata ?? {},
    };
  }

  /**
   * Converts an UpdateIntegrationStateDto to a plain object for entity updates.
   */
  public static fromUpdateDto(dto: UpdateIntegrationStateDto): Partial<{
    status: string;
    metadata: Record<string, unknown>;
  }> {
    return {
      status: dto.status,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts a database record to IntegrationState entity.
   */
  public static fromRecord(record: IntegrationStateRecord & { created_at?: string; updated_at?: string }): IntegrationState {
    return IntegrationState.fromDatabase(record);
  }

  /**
   * Converts an IntegrationState entity to a database record format.
   */
  public static toRecord(state: IntegrationState): IntegrationStateRecord {
    return {
      state_id: state.stateId.value,
      module_id: state.moduleId.value,
      status: state.status,
      last_updated: state.lastUpdated.toISOString(),
      metadata: state.metadata,
      created_at: state.createdAt.toISOString(),
      updated_at: state.updatedAt.toISOString(),
    };
  }

  /**
   * Converts paginated result to list response DTO.
   */
  public static toListResponse(
    states: IntegrationState[],
    total: number,
    page: number,
    pageSize: number
  ): IntegrationStateListResponseDto {
    return {
      states: this.toResponseList(states),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}
