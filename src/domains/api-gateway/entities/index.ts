/**
 * Entities Index
 *
 * Exports all API Gateway domain entities.
 */

export {
  ApiRoute,
  type ApiRouteProps,
  type ApiRouteRecord,
  type ApiRouteJSON,
} from './ApiRoute';

export {
  ApiRequest,
  type ApiRequestProps,
  type ApiRequestRecord,
  type ApiRequestJSON,
  type HttpHeaders,
  type QueryParams,
  type RequestBody,
} from './ApiRequest';

export {
  ApiResponse,
  type ApiResponseProps,
  type ApiResponseRecord,
  type ApiResponseJSON,
  type ResponsePayload,
  type StatusCode,
} from './ApiResponse';
