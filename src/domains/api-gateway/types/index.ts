/**
 * Types Index
 *
 * Exports all API Gateway domain types.
 */

export type { HttpMethod } from './HttpMethod';
export {
  HTTP_METHODS,
  HTTP_METHOD_DISPLAY,
  HTTP_METHOD_DESCRIPTIONS,
  isHttpMethod,
  parseHttpMethod,
} from './HttpMethod';

export type { ApiVersion } from './ApiVersion';
export {
  API_VERSIONS,
  API_VERSION_DISPLAY,
  API_VERSION_PREFIX,
  isApiVersion,
  parseApiVersion,
} from './ApiVersion';

export type { RouteStatus } from './RouteStatus';
export {
  ROUTE_STATUSES,
  ROUTE_STATUS_DISPLAY,
  ROUTE_STATUS_COLORS,
  isAvailableRouteStatus,
  isUnavailableRouteStatus,
  isDeprecatedRouteStatus,
} from './RouteStatus';

export type {
  GatewayMetadata,
  RequestMetadata,
  ResponseMetadata,
} from './GatewayMetadata';

export {
  INITIAL_GATEWAY_METADATA,
  INITIAL_REQUEST_METADATA,
  INITIAL_RESPONSE_METADATA,
} from './GatewayMetadata';

export type {
  GatewayStatistics,
  RouteStatistics,
} from './GatewayStatistics';

export {
  createEmptyGatewayStatistics,
  createEmptyRouteStatistics,
} from './GatewayStatistics';
