/**
 * API Gateway Domain Index
 *
 * Main export file for the API Gateway domain.
 * Provides access to all API Gateway domain entities, types, interfaces, and utilities.
 *
 * API Gateway Domain Responsibilities:
 * - Store API route metadata (path, method, version, status)
 * - Store API request metadata
 * - Store API response metadata
 * - Provide data access interfaces
 *
 * API Gateway Domain is NOT:
 * - A routing engine
 * - A middleware pipeline
 * - A request handler
 * - A gameplay modifier
 * - A state changer
 * - A reward distributor
 * - A balance modifier
 * - An inventory modifier
 *
 * All business logic belongs to P-190.2 — Production API Gateway Implementation.
 */

// ============ Entities ============

export {
  ApiRoute,
  type ApiRouteProps,
  type ApiRouteRecord,
  type ApiRouteJSON,
} from './entities/ApiRoute';

export {
  ApiRequest,
  type ApiRequestProps,
  type ApiRequestRecord,
  type ApiRequestJSON,
  type HttpHeaders,
  type QueryParams,
  type RequestBody,
} from './entities/ApiRequest';

export {
  ApiResponse,
  type ApiResponseProps,
  type ApiResponseRecord,
  type ApiResponseJSON,
  type ResponsePayload,
  type StatusCode,
} from './entities/ApiResponse';

// ============ Value Objects ============

export { RouteId } from './value-objects/RouteId';
export { RequestId } from './value-objects/RequestId';
export { ResponseId } from './value-objects/ResponseId';

// ============ Types ============

export type { HttpMethod } from './types/HttpMethod';
export {
  HTTP_METHODS,
  HTTP_METHOD_DISPLAY,
  HTTP_METHOD_DESCRIPTIONS,
  isHttpMethod,
  parseHttpMethod,
} from './types/HttpMethod';

export type { ApiVersion } from './types/ApiVersion';
export {
  API_VERSIONS,
  API_VERSION_DISPLAY,
  API_VERSION_PREFIX,
  isApiVersion,
  parseApiVersion,
} from './types/ApiVersion';

export type { RouteStatus } from './types/RouteStatus';
export {
  ROUTE_STATUSES,
  ROUTE_STATUS_DISPLAY,
  ROUTE_STATUS_COLORS,
  isAvailableRouteStatus,
  isUnavailableRouteStatus,
  isDeprecatedRouteStatus,
} from './types/RouteStatus';

export type {
  GatewayMetadata,
  RequestMetadata,
  ResponseMetadata,
} from './types/GatewayMetadata';

export {
  INITIAL_GATEWAY_METADATA,
  INITIAL_REQUEST_METADATA,
  INITIAL_RESPONSE_METADATA,
} from './types/GatewayMetadata';

export type {
  GatewayStatistics,
  RouteStatistics,
} from './types/GatewayStatistics';

export {
  createEmptyGatewayStatistics,
  createEmptyRouteStatistics,
} from './types/GatewayStatistics';

// ============ DTOs ============

export type {
  ApiRouteDto,
  CreateApiRouteDto,
  UpdateApiRouteDto,
  ApiRouteListDto,
} from './dto/ApiRoute.dto';

export type {
  ApiRequestDto,
  CreateApiRequestDto,
  ApiRequestListDto,
  HttpHeadersDto,
  QueryParamsDto,
} from './dto/ApiRequest.dto';

export type {
  ApiResponseDto,
  CreateApiResponseDto,
  ApiResponseListDto,
  ResponsePayloadDto,
} from './dto/ApiResponse.dto';

export type {
  GatewayResponseDto,
  GatewayErrorDto,
  PaginatedGatewayResponseDto,
  GatewayHealthDto,
  GatewayStatisticsDto,
} from './dto/GatewayResponse.dto';

// ============ Interfaces ============

export type { IApiRoute } from './interfaces/IApiRoute';
export type { IApiRequest } from './interfaces/IApiRequest';
export type { IApiResponse } from './interfaces/IApiResponse';
export type {
  IApiGatewayRepository,
  ApiRouteFilterParams,
  ApiRequestFilterParams,
  ApiResponseFilterParams,
} from './interfaces/IApiGatewayRepository';

// ============ Validators ============

export { RouteValidator } from './validators/RouteValidator';
export { RequestValidator } from './validators/RequestValidator';
export { ResponseValidator } from './validators/ResponseValidator';

// ============ Mappers ============

export { RouteMapper } from './mappers/RouteMapper';
export { RequestMapper } from './mappers/RequestMapper';
export { ResponseMapper } from './mappers/ResponseMapper';

// ============ Events ============

export { RouteRegistered, type RouteRegisteredJSON } from './events/RouteRegistered.event';
export { RequestReceived, type RequestReceivedJSON } from './events/RequestReceived.event';
export { ResponseSent, type ResponseSentJSON } from './events/ResponseSent.event';
export { RouteDisabled, type RouteDisabledJSON } from './events/RouteDisabled.event';

// ============ Repositories ============

export { SupabaseApiGatewayRepository } from './repositories/SupabaseApiGatewayRepository';

// ============ Services ============

export {
  ApiGatewayService,
  RoutingEngine,
  MiddlewarePipeline,
  RequestValidatorService,
  ResponseBuilder,
  FailureHandler,
  HttpStatusCodes,
  ErrorCodes,
} from './services';

export type {
  RouteMatch,
  RouteRequest,
  MiddlewareContext,
  MiddlewareResult,
  MiddlewareFunction,
  ValidationResult,
  ValidationError,
  ValidationRule,
  GatewaySummaryDto,
  RequestSummary,
} from './services';

// ============ DI ============

export {
  API_GATEWAY_TOKENS,
  registerApiGatewayDependencies,
  setupApiGatewayDomain,
} from './di';
