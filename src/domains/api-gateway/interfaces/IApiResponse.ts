/**
 * IApiResponse Interface
 *
 * Interface defining the contract for API response entities.
 */

import type { ResponseId } from '../value-objects/ResponseId';
import type { RequestId } from '../value-objects/RequestId';
import type { StatusCode, ResponsePayload } from '../entities/ApiResponse';
import type { ResponseMetadata } from '../types/GatewayMetadata';

/**
 * API Response interface.
 * Defines the contract for API response entities.
 */
export interface IApiResponse {
  /**
   * Unique response identifier.
   */
  readonly responseId: ResponseId;

  /**
   * Associated request identifier.
   */
  readonly requestId: RequestId;

  /**
   * HTTP status code.
   */
  readonly statusCode: StatusCode;

  /**
   * Response time in milliseconds.
   */
  readonly responseTime: number;

  /**
   * Response payload.
   */
  readonly payload: ResponsePayload;

  /**
   * Response sent timestamp.
   */
  readonly sentAt: Date;

  /**
   * Response metadata.
   */
  readonly metadata: ResponseMetadata;

  /**
   * Checks if the response is successful (2xx).
   */
  readonly isSuccess: boolean;

  /**
   * Checks if the response is a client error (4xx).
   */
  readonly isClientError: boolean;

  /**
   * Checks if the response is a server error (5xx).
   */
  readonly isServerError: boolean;
}
