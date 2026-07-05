/**
 * IApiGatewayRepository Interface
 *
 * Interface defining the contract for API Gateway persistence operations.
 */

import type { ApiRoute } from '../entities/ApiRoute';
import type { ApiRequest } from '../entities/ApiRequest';
import type { ApiResponse } from '../entities/ApiResponse';
import type { RouteId } from '../value-objects/RouteId';
import type { RequestId } from '../value-objects/RequestId';
import type { ResponseId } from '../value-objects/ResponseId';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import type { HttpMethod } from '../types/HttpMethod';
import type { ApiVersion } from '../types/ApiVersion';
import type { RouteStatus } from '../types/RouteStatus';

/**
 * Filter parameters for route queries.
 */
export interface ApiRouteFilterParams {
  method?: HttpMethod;
  version?: ApiVersion;
  status?: RouteStatus;
  enabled?: boolean;
  pathContains?: string;
  tags?: string[];
}

/**
 * Filter parameters for request queries.
 */
export interface ApiRequestFilterParams {
  routeId?: string;
  method?: HttpMethod;
  pathContains?: string;
  receivedAfter?: Date;
  receivedBefore?: Date;
}

/**
 * Filter parameters for response queries.
 */
export interface ApiResponseFilterParams {
  requestId?: string;
  statusCode?: number;
  sentAfter?: Date;
  sentBefore?: Date;
  minResponseTime?: number;
  maxResponseTime?: number;
}

/**
 * API Gateway Repository interface.
 * Defines the contract for API Gateway persistence operations.
 */
export interface IApiGatewayRepository {
  // ============ Route Operations ============

  /**
   * Creates a new API route.
   */
  createRoute(route: ApiRoute): Promise<ApiRoute>;

  /**
   * Finds a route by its ID.
   */
  findRouteById(id: RouteId): Promise<ApiRoute | null>;

  /**
   * Finds a route by path and method.
   */
  findRouteByPathAndMethod(path: string, method: HttpMethod): Promise<ApiRoute | null>;

  /**
   * Lists routes with pagination and filtering.
   */
  listRoutes(
    params: PaginationParams,
    filters?: ApiRouteFilterParams
  ): Promise<PaginatedResult<ApiRoute>>;

  /**
   * Counts routes with optional filtering.
   */
  countRoutes(filters?: ApiRouteFilterParams): Promise<number>;

  /**
   * Updates an existing route.
   */
  updateRoute(route: ApiRoute): Promise<ApiRoute>;

  /**
   * Deletes a route by ID.
   */
  deleteRoute(id: RouteId): Promise<boolean>;

  // ============ Request Operations ============

  /**
   * Creates a new API request record.
   */
  createRequest(request: ApiRequest): Promise<ApiRequest>;

  /**
   * Finds a request by its ID.
   */
  findRequestById(id: RequestId): Promise<ApiRequest | null>;

  /**
   * Lists requests with pagination and filtering.
   */
  listRequests(
    params: PaginationParams,
    filters?: ApiRequestFilterParams
  ): Promise<PaginatedResult<ApiRequest>>;

  /**
   * Counts requests with optional filtering.
   */
  countRequests(filters?: ApiRequestFilterParams): Promise<number>;

  // ============ Response Operations ============

  /**
   * Creates a new API response record.
   */
  createResponse(response: ApiResponse): Promise<ApiResponse>;

  /**
   * Finds a response by its ID.
   */
  findResponseById(id: ResponseId): Promise<ApiResponse | null>;

  /**
   * Finds responses by request ID.
   */
  findResponsesByRequestId(requestId: RequestId): Promise<ApiResponse[]>;

  /**
   * Lists responses with pagination and filtering.
   */
  listResponses(
    params: PaginationParams,
    filters?: ApiResponseFilterParams
  ): Promise<PaginatedResult<ApiResponse>>;

  /**
   * Counts responses with optional filtering.
   */
  countResponses(filters?: ApiResponseFilterParams): Promise<number>;
}
