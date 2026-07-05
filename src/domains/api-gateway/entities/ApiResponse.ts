/**
 * ApiResponse Entity
 *
 * Domain entity representing an API response.
 * An API response captures all information about an outgoing HTTP response.
 *
 * ApiResponse Entity Responsibilities:
 * - Store response identification and details
 * - Track response status, payload, and timing
 * - Record response metadata
 *
 * ApiResponse Entity is NOT:
 * - A response handler
 * - A gameplay modifier
 * - A state changer
 */

import type { IApiResponse } from '../interfaces/IApiResponse';
import { ResponseId } from '../value-objects/ResponseId';
import { RequestId } from '../value-objects/RequestId';
import type { ResponseMetadata } from '../types/GatewayMetadata';

/**
 * Response payload type.
 */
export type ResponsePayload = unknown;

/**
 * HTTP status code type.
 */
export type StatusCode = number;

/**
 * ApiResponse entity props for constructor.
 */
export interface ApiResponseProps {
  responseId: ResponseId;
  requestId: RequestId;
  statusCode: StatusCode;
  responseTime: number;
  payload: ResponsePayload;
  sentAt: Date;
  metadata: ResponseMetadata;
}

/**
 * Database record representation of ApiResponse.
 */
export interface ApiResponseRecord {
  response_id: string;
  request_id: string;
  status_code: number;
  response_time: number;
  payload: ResponsePayload;
  sent_at: string;
  metadata: ResponseMetadata;
}

/**
 * JSON serialization representation of ApiResponse.
 */
export interface ApiResponseJSON {
  responseId: string;
  requestId: string;
  statusCode: StatusCode;
  responseTime: number;
  payload: ResponsePayload;
  sentAt: string;
  metadata: ResponseMetadata;
}

/**
 * ApiResponse entity class.
 * Immutable domain entity representing an API response.
 */
export class ApiResponse implements IApiResponse {
  public readonly responseId: ResponseId;
  public readonly requestId: RequestId;
  public readonly statusCode: StatusCode;
  public readonly responseTime: number;
  public readonly payload: ResponsePayload;
  public readonly sentAt: Date;
  public readonly metadata: ResponseMetadata;

  /**
   * Creates a new ApiResponse instance.
   */
  constructor(props: ApiResponseProps) {
    this.responseId = props.responseId;
    this.requestId = props.requestId;
    this.statusCode = props.statusCode;
    this.responseTime = props.responseTime;
    this.payload = props.payload;
    this.sentAt = props.sentAt;
    this.metadata = props.metadata;
  }

  /**
   * Creates a new ApiResponse entity.
   * Factory method for new response creation.
   */
  public static create(params: {
    responseId?: ResponseId | string;
    requestId: RequestId | string;
    statusCode: StatusCode;
    responseTime: number;
    payload?: ResponsePayload;
    sentAt?: Date;
    metadata?: ResponseMetadata;
  }): ApiResponse {
    const responseId = params.responseId
      ? typeof params.responseId === 'string'
        ? ResponseId.create(params.responseId)
        : params.responseId
      : ResponseId.generate();

    const requestId = typeof params.requestId === 'string' ? RequestId.reconstruct(params.requestId) : params.requestId;

    return new ApiResponse({
      responseId,
      requestId,
      statusCode: params.statusCode,
      responseTime: params.responseTime,
      payload: params.payload ?? null,
      sentAt: params.sentAt ?? new Date(),
      metadata: params.metadata ?? {
        contentLength: undefined,
        contentType: undefined,
        cacheControl: undefined,
        customFields: {},
      },
    });
  }

  /**
   * Reconstructs an ApiResponse from stored data.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: ApiResponseRecord): ApiResponse {
    return new ApiResponse({
      responseId: ResponseId.reconstruct(record.response_id),
      requestId: RequestId.reconstruct(record.request_id),
      statusCode: record.status_code,
      responseTime: record.response_time,
      payload: record.payload,
      sentAt: new Date(record.sent_at),
      metadata: record.metadata,
    });
  }

  /**
   * Gets the response ID value.
   */
  public get responseIdValue(): string {
    return this.responseId.value;
  }

  /**
   * Gets the request ID value.
   */
  public get requestIdValue(): string {
    return this.requestId.value;
  }

  /**
   * Checks if the response is successful (2xx).
   */
  public get isSuccess(): boolean {
    return this.statusCode >= 200 && this.statusCode < 300;
  }

  /**
   * Checks if the response is a client error (4xx).
   */
  public get isClientError(): boolean {
    return this.statusCode >= 400 && this.statusCode < 500;
  }

  /**
   * Checks if the response is a server error (5xx).
   */
  public get isServerError(): boolean {
    return this.statusCode >= 500 && this.statusCode < 600;
  }

  /**
   * Checks if the response is a redirect (3xx).
   */
  public get isRedirect(): boolean {
    return this.statusCode >= 300 && this.statusCode < 400;
  }

  /**
   * Gets the response time in seconds.
   */
  public get responseTimeSeconds(): number {
    return this.responseTime / 1000;
  }

  /**
   * Serializes the ApiResponse to a plain object.
   */
  public toJSON(): ApiResponseJSON {
    return {
      responseId: this.responseId.value,
      requestId: this.requestId.value,
      statusCode: this.statusCode,
      responseTime: this.responseTime,
      payload: this.payload,
      sentAt: this.sentAt.toISOString(),
      metadata: this.metadata,
    };
  }

  /**
   * Converts to database record format.
   */
  public toRecord(): ApiResponseRecord {
    return {
      response_id: this.responseId.value,
      request_id: this.requestId.value,
      status_code: this.statusCode,
      response_time: this.responseTime,
      payload: this.payload,
      sent_at: this.sentAt.toISOString(),
      metadata: this.metadata,
    };
  }
}
