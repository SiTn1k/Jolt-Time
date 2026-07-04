/**
 * Response Mapper
 *
 * Maps between IntegrationResponse entity and various DTOs.
 * No database logic - pure transformation only.
 */

import { IntegrationResponse, type IntegrationResponseRecord } from '../entities/IntegrationResponse';
import type {
  CreateIntegrationResponseDto,
  IntegrationResponseResponseDto,
  IntegrationResponseSummaryDto,
  IntegrationResponseListResponseDto,
  IntegrationResponseWrapperDto,
} from '../dto/IntegrationResponse.dto';
import type { IntegrationRequest } from '../entities/IntegrationRequest';

/**
 * Mapper for converting between IntegrationResponse entity and DTOs.
 */
export class ResponseMapper {
  /**
   * Converts an IntegrationResponse entity to IntegrationResponseResponseDto.
   */
  public static toResponse(response: IntegrationResponse): IntegrationResponseResponseDto {
    return {
      responseId: response.responseId.value,
      requestId: response.requestId.value,
      status: response.status,
      responseCode: response.responseCode,
      payload: response.payload,
      receivedAt: response.receivedAt.toISOString(),
      metadata: response.metadata,
    };
  }

  /**
   * Converts an IntegrationResponse entity to IntegrationResponseSummaryDto.
   */
  public static toSummary(response: IntegrationResponse): IntegrationResponseSummaryDto {
    return {
      responseId: response.responseId.value,
      requestId: response.requestId.value,
      status: response.status,
      responseCode: response.responseCode,
      receivedAt: response.receivedAt.toISOString(),
    };
  }

  /**
   * Converts an array of IntegrationResponse entities to IntegrationResponseResponseDto array.
   */
  public static toResponseList(responses: IntegrationResponse[]): IntegrationResponseResponseDto[] {
    return responses.map((response) => this.toResponse(response));
  }

  /**
   * Converts a CreateIntegrationResponseDto to a plain object for entity creation.
   */
  public static fromCreateDto(dto: CreateIntegrationResponseDto): CreateIntegrationResponseDto {
    return {
      requestId: dto.requestId,
      status: dto.status,
      responseCode: dto.responseCode,
      payload: dto.payload,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts a database record to IntegrationResponse entity.
   */
  public static fromRecord(record: IntegrationResponseRecord): IntegrationResponse {
    return IntegrationResponse.fromDatabase(record);
  }

  /**
   * Converts an IntegrationResponse entity to a database record format.
   * Note: This is for mapping TO record format, not actual database operations.
   */
  public static toRecord(response: IntegrationResponse): IntegrationResponseRecord {
    return {
      response_id: response.responseId.value,
      request_id: response.requestId.value,
      status: response.status,
      response_code: response.responseCode,
      payload: response.payload,
      received_at: response.receivedAt.toISOString(),
      metadata: response.metadata,
    };
  }

  /**
   * Converts paginated result to list response DTO.
   */
  public static toListResponse(
    responses: IntegrationResponse[],
    total: number,
    page: number,
    pageSize: number
  ): IntegrationResponseListResponseDto {
    return {
      responses: this.toResponseList(responses),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Creates a wrapper DTO pairing a request with its response.
   */
  public static toWrapperDto(
    request: IntegrationRequest,
    response: IntegrationResponse | null
  ): IntegrationResponseWrapperDto {
    const processingTimeMs = response
      ? response.receivedAt.getTime() - request.createdAt.getTime()
      : undefined;

    return {
      request: {
        requestId: request.requestId.value,
        providerId: request.providerId.value,
        requestType: request.requestType,
        payload: request.payload,
        createdAt: request.createdAt.toISOString(),
        metadata: request.metadata,
      },
      response: response ? this.toResponse(response) : null,
      processingTimeMs,
    };
  }
}
