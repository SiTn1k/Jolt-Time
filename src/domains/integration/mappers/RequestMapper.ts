/**
 * Request Mapper
 *
 * Maps between IntegrationRequest entity and various DTOs.
 * No database logic - pure transformation only.
 */

import { IntegrationRequest, type IntegrationRequestRecord } from '../entities/IntegrationRequest';
import type {
  CreateIntegrationRequestDto,
  IntegrationRequestResponseDto,
  IntegrationRequestSummaryDto,
  IntegrationRequestListResponseDto,
} from '../dto/IntegrationRequest.dto';

/**
 * Mapper for converting between IntegrationRequest entity and DTOs.
 */
export class RequestMapper {
  /**
   * Converts an IntegrationRequest entity to IntegrationRequestResponseDto.
   */
  public static toResponse(request: IntegrationRequest): IntegrationRequestResponseDto {
    return {
      requestId: request.requestId.value,
      providerId: request.providerId.value,
      requestType: request.requestType,
      payload: request.payload,
      createdAt: request.createdAt.toISOString(),
      metadata: request.metadata,
    };
  }

  /**
   * Converts an IntegrationRequest entity to IntegrationRequestSummaryDto.
   */
  public static toSummary(request: IntegrationRequest): IntegrationRequestSummaryDto {
    return {
      requestId: request.requestId.value,
      providerId: request.providerId.value,
      requestType: request.requestType,
      createdAt: request.createdAt.toISOString(),
    };
  }

  /**
   * Converts an array of IntegrationRequest entities to IntegrationRequestResponseDto array.
   */
  public static toResponseList(requests: IntegrationRequest[]): IntegrationRequestResponseDto[] {
    return requests.map((request) => this.toResponse(request));
  }

  /**
   * Converts a CreateIntegrationRequestDto to a plain object for entity creation.
   */
  public static fromCreateDto(dto: CreateIntegrationRequestDto): CreateIntegrationRequestDto {
    return {
      providerId: dto.providerId,
      requestType: dto.requestType,
      payload: dto.payload,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts a database record to IntegrationRequest entity.
   */
  public static fromRecord(record: IntegrationRequestRecord): IntegrationRequest {
    return IntegrationRequest.fromDatabase(record);
  }

  /**
   * Converts an IntegrationRequest entity to a database record format.
   * Note: This is for mapping TO record format, not actual database operations.
   */
  public static toRecord(request: IntegrationRequest): IntegrationRequestRecord {
    return {
      request_id: request.requestId.value,
      provider_id: request.providerId.value,
      request_type: request.requestType,
      payload: request.payload,
      created_at: request.createdAt.toISOString(),
      metadata: request.metadata,
    };
  }

  /**
   * Converts paginated result to list response DTO.
   */
  public static toListResponse(
    requests: IntegrationRequest[],
    total: number,
    page: number,
    pageSize: number
  ): IntegrationRequestListResponseDto {
    return {
      requests: this.toResponseList(requests),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}
