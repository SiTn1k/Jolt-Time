/**
 * API Request DTOs
 *
 * Data Transfer Objects for API request operations.
 */

import type { HttpMethod } from '../types/HttpMethod';
import type { RequestMetadata } from '../types/GatewayMetadata';

/**
 * HTTP headers type for DTOs.
 */
export type HttpHeadersDto = Record<string, string | string[] | undefined>;

/**
 * Query parameters type for DTOs.
 */
export type QueryParamsDto = Record<string, string | string[] | undefined>;

/**
 * API request data transfer object.
 */
export interface ApiRequestDto {
  requestId: string;
  routeId: string;
  method: HttpMethod;
  path: string;
  headers: HttpHeadersDto;
  query: QueryParamsDto;
  body: unknown;
  receivedAt: string;
  metadata: RequestMetadata;
}

/**
 * DTO for creating a new API request record.
 */
export interface CreateApiRequestDto {
  routeId: string;
  method: HttpMethod;
  path: string;
  headers?: HttpHeadersDto;
  query?: QueryParamsDto;
  body?: unknown;
  metadata?: RequestMetadata;
}

/**
 * DTO for listing API requests with pagination.
 */
export interface ApiRequestListDto {
  requests: ApiRequestDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
