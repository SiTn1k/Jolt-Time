/**
 * IApiRequest Interface
 *
 * Interface defining the contract for API request entities.
 */

import type { RequestId } from '../value-objects/RequestId';
import type { RouteId } from '../value-objects/RouteId';
import type { HttpMethod } from '../types/HttpMethod';
import type { HttpHeaders, QueryParams, RequestBody } from '../entities/ApiRequest';
import type { RequestMetadata } from '../types/GatewayMetadata';

/**
 * API Request interface.
 * Defines the contract for API request entities.
 */
export interface IApiRequest {
  /**
   * Unique request identifier.
   */
  readonly requestId: RequestId;

  /**
   * Associated route identifier.
   */
  readonly routeId: RouteId;

  /**
   * HTTP method.
   */
  readonly method: HttpMethod;

  /**
   * Request path.
   */
  readonly path: string;

  /**
   * HTTP headers.
   */
  readonly headers: HttpHeaders;

  /**
   * Query parameters.
   */
  readonly query: QueryParams;

  /**
   * Request body.
   */
  readonly body: RequestBody;

  /**
   * Request received timestamp.
   */
  readonly receivedAt: Date;

  /**
   * Request metadata.
   */
  readonly metadata: RequestMetadata;

  /**
   * Checks if the request has a body.
   */
  readonly hasBody: boolean;

  /**
   * Checks if the request has query parameters.
   */
  readonly hasQuery: boolean;
}
