/**
 * RequestMapper
 *
 * Maps between ApiRequest entity and DTOs.
 * No request handling logic - pure transformation only.
 */

import type { ApiRequestRecord } from '../entities/ApiRequest';
import { ApiRequest } from '../entities/ApiRequest';
import type {
  ApiRequestDto,
  CreateApiRequestDto,
  ApiRequestListDto,
  HttpHeadersDto,
  QueryParamsDto,
} from '../dto/ApiRequest.dto';

/**
 * Mapper for converting between ApiRequest entity and DTOs.
 */
export class RequestMapper {
  /**
   * Converts an ApiRequest entity to ApiRequestDto.
   */
  public static toDto(request: ApiRequest): ApiRequestDto {
    return {
      requestId: request.requestId.value,
      routeId: request.routeId.value,
      method: request.method,
      path: request.path,
      headers: request.headers,
      query: request.query,
      body: request.body,
      receivedAt: request.receivedAt.toISOString(),
      metadata: request.metadata,
    };
  }

  /**
   * Converts an ApiRequest entity to a database record format.
   */
  public static toRecord(request: ApiRequest): ApiRequestRecord {
    return request.toRecord();
  }

  /**
   * Converts a database record to ApiRequestDto.
   */
  public static fromRecordToDto(record: ApiRequestRecord): ApiRequestDto {
    return {
      requestId: record.request_id,
      routeId: record.route_id,
      method: record.method as ApiRequestDto['method'],
      path: record.path,
      headers: record.headers as HttpHeadersDto,
      query: record.query as QueryParamsDto,
      body: record.body,
      receivedAt: record.received_at,
      metadata: record.metadata,
    };
  }

  /**
   * Converts a database record to ApiRequest entity.
   */
  public static fromRecord(record: ApiRequestRecord): ApiRequest {
    return ApiRequest.fromDatabase(record);
  }

  /**
   * Converts an array of ApiRequest entities to ApiRequestListDto.
   */
  public static toListDto(
    requests: ApiRequest[],
    total: number,
    page: number,
    pageSize: number
  ): ApiRequestListDto {
    return {
      requests: requests.map((r) => this.toDto(r)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Converts a CreateApiRequestDto to request creation params.
   */
  public static fromCreateDto(dto: CreateApiRequestDto): {
    routeId: string;
    method: CreateApiRequestDto['method'];
    path: string;
    headers?: HttpHeadersDto;
    query?: QueryParamsDto;
    body?: unknown;
    metadata?: CreateApiRequestDto['metadata'];
  } {
    return {
      routeId: dto.routeId,
      method: dto.method,
      path: dto.path,
      headers: dto.headers,
      query: dto.query,
      body: dto.body,
      metadata: dto.metadata,
    };
  }
}
