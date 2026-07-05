/**
 * ResponseMapper
 *
 * Maps between ApiResponse entity and DTOs.
 * No response handling logic - pure transformation only.
 */

import type { ApiResponseRecord } from '../entities/ApiResponse';
import { ApiResponse } from '../entities/ApiResponse';
import type {
  ApiResponseDto,
  CreateApiResponseDto,
  ApiResponseListDto,
  ResponsePayloadDto,
} from '../dto/ApiResponse.dto';

/**
 * Mapper for converting between ApiResponse entity and DTOs.
 */
export class ResponseMapper {
  /**
   * Converts an ApiResponse entity to ApiResponseDto.
   */
  public static toDto(response: ApiResponse): ApiResponseDto {
    return {
      responseId: response.responseId.value,
      requestId: response.requestId.value,
      statusCode: response.statusCode,
      responseTime: response.responseTime,
      payload: response.payload,
      sentAt: response.sentAt.toISOString(),
      metadata: response.metadata,
    };
  }

  /**
   * Converts an ApiResponse entity to a database record format.
   */
  public static toRecord(response: ApiResponse): ApiResponseRecord {
    return response.toRecord();
  }

  /**
   * Converts a database record to ApiResponseDto.
   */
  public static fromRecordToDto(record: ApiResponseRecord): ApiResponseDto {
    return {
      responseId: record.response_id,
      requestId: record.request_id,
      statusCode: record.status_code,
      responseTime: record.response_time,
      payload: record.payload as ResponsePayloadDto,
      sentAt: record.sent_at,
      metadata: record.metadata,
    };
  }

  /**
   * Converts a database record to ApiResponse entity.
   */
  public static fromRecord(record: ApiResponseRecord): ApiResponse {
    return ApiResponse.fromDatabase(record);
  }

  /**
   * Converts an array of ApiResponse entities to ApiResponseListDto.
   */
  public static toListDto(
    responses: ApiResponse[],
    total: number,
    page: number,
    pageSize: number
  ): ApiResponseListDto {
    return {
      responses: responses.map((r) => this.toDto(r)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Converts a CreateApiResponseDto to response creation params.
   */
  public static fromCreateDto(dto: CreateApiResponseDto): {
    requestId: string;
    statusCode: number;
    responseTime: number;
    payload?: ResponsePayloadDto;
    metadata?: CreateApiResponseDto['metadata'];
  } {
    return {
      requestId: dto.requestId,
      statusCode: dto.statusCode,
      responseTime: dto.responseTime,
      payload: dto.payload,
      metadata: dto.metadata,
    };
  }
}
