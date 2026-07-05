/**
 * API Route DTOs
 *
 * Data Transfer Objects for API route operations.
 */

import type { HttpMethod } from '../types/HttpMethod';
import type { ApiVersion } from '../types/ApiVersion';
import type { GatewayMetadata } from '../types/GatewayMetadata';

/**
 * API route data transfer object.
 */
export interface ApiRouteDto {
  routeId: string;
  path: string;
  method: HttpMethod;
  version: ApiVersion;
  enabled: boolean;
  description: string;
  metadata: GatewayMetadata;
}

/**
 * DTO for creating a new API route.
 */
export interface CreateApiRouteDto {
  path: string;
  method: HttpMethod;
  version?: ApiVersion;
  enabled?: boolean;
  description?: string;
  metadata?: GatewayMetadata;
}

/**
 * DTO for updating an existing API route.
 */
export interface UpdateApiRouteDto {
  path?: string;
  method?: HttpMethod;
  version?: ApiVersion;
  enabled?: boolean;
  description?: string;
  metadata?: GatewayMetadata;
}

/**
 * DTO for listing API routes with pagination.
 */
export interface ApiRouteListDto {
  routes: ApiRouteDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
