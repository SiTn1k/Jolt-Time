/**
 * API Response DTOs
 *
 * Data Transfer Objects for API response operations.
 */

import type { ResponseMetadata } from '../types/GatewayMetadata';

/**
 * Response payload type for DTOs.
 */
export type ResponsePayloadDto = unknown;

/**
 * API response data transfer object.
 */
export interface ApiResponseDto {
  responseId: string;
  requestId: string;
  statusCode: number;
  responseTime: number;
  payload: ResponsePayloadDto;
  sentAt: string;
  metadata: ResponseMetadata;
}

/**
 * DTO for creating a new API response record.
 */
export interface CreateApiResponseDto {
  requestId: string;
  statusCode: number;
  responseTime: number;
  payload?: ResponsePayloadDto;
  metadata?: ResponseMetadata;
}

/**
 * DTO for listing API responses with pagination.
 */
export interface ApiResponseListDto {
  responses: ApiResponseDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
