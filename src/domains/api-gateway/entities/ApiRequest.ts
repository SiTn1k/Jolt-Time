/**
 * ApiRequest Entity
 *
 * Domain entity representing an API request.
 * An API request captures all information about an incoming HTTP request.
 *
 * ApiRequest Entity Responsibilities:
 * - Store request identification and details
 * - Track request headers, query, and body
 * - Record request timing
 *
 * ApiRequest Entity is NOT:
 * - A request handler
 * - A router
 * - A middleware
 * - A gameplay modifier
 * - A state changer
 */

import type { IApiRequest } from '../interfaces/IApiRequest';
import { RequestId } from '../value-objects/RequestId';
import { RouteId } from '../value-objects/RouteId';
import type { HttpMethod } from '../types/HttpMethod';
import type { RequestMetadata } from '../types/GatewayMetadata';

/**
 * HTTP headers as key-value pairs.
 */
export type HttpHeaders = Record<string, string | string[] | undefined>;

/**
 * Query parameters as key-value pairs.
 */
export type QueryParams = Record<string, string | string[] | undefined>;

/**
 * Request body type.
 */
export type RequestBody = unknown;

/**
 * ApiRequest entity props for constructor.
 */
export interface ApiRequestProps {
  requestId: RequestId;
  routeId: RouteId;
  method: HttpMethod;
  path: string;
  headers: HttpHeaders;
  query: QueryParams;
  body: RequestBody;
  receivedAt: Date;
  metadata: RequestMetadata;
}

/**
 * Database record representation of ApiRequest.
 */
export interface ApiRequestRecord {
  request_id: string;
  route_id: string;
  method: string;
  path: string;
  headers: HttpHeaders;
  query: QueryParams;
  body: RequestBody;
  received_at: string;
  metadata: RequestMetadata;
}

/**
 * JSON serialization representation of ApiRequest.
 */
export interface ApiRequestJSON {
  requestId: string;
  routeId: string;
  method: HttpMethod;
  path: string;
  headers: HttpHeaders;
  query: QueryParams;
  body: RequestBody;
  receivedAt: string;
  metadata: RequestMetadata;
}

/**
 * ApiRequest entity class.
 * Immutable domain entity representing an API request.
 */
export class ApiRequest implements IApiRequest {
  public readonly requestId: RequestId;
  public readonly routeId: RouteId;
  public readonly method: HttpMethod;
  public readonly path: string;
  public readonly headers: HttpHeaders;
  public readonly query: QueryParams;
  public readonly body: RequestBody;
  public readonly receivedAt: Date;
  public readonly metadata: RequestMetadata;

  /**
   * Creates a new ApiRequest instance.
   */
  constructor(props: ApiRequestProps) {
    this.requestId = props.requestId;
    this.routeId = props.routeId;
    this.method = props.method;
    this.path = props.path;
    this.headers = props.headers;
    this.query = props.query;
    this.body = props.body;
    this.receivedAt = props.receivedAt;
    this.metadata = props.metadata;
  }

  /**
   * Creates a new ApiRequest entity.
   * Factory method for new request creation.
   */
  public static create(params: {
    requestId?: RequestId | string;
    routeId: RouteId | string;
    method: HttpMethod;
    path: string;
    headers?: HttpHeaders;
    query?: QueryParams;
    body?: RequestBody;
    receivedAt?: Date;
    metadata?: RequestMetadata;
  }): ApiRequest {
    const requestId = params.requestId
      ? typeof params.requestId === 'string'
        ? RequestId.create(params.requestId)
        : params.requestId
      : RequestId.generate();

    const routeId = typeof params.routeId === 'string' ? RouteId.reconstruct(params.routeId) : params.routeId;

    return new ApiRequest({
      requestId,
      routeId,
      method: params.method,
      path: params.path,
      headers: params.headers ?? {},
      query: params.query ?? {},
      body: params.body ?? null,
      receivedAt: params.receivedAt ?? new Date(),
      metadata: params.metadata ?? {
        clientIp: undefined,
        userAgent: undefined,
        source: undefined,
        sessionId: undefined,
        forwardedFor: undefined,
        customFields: {},
      },
    });
  }

  /**
   * Reconstructs an ApiRequest from stored data.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: ApiRequestRecord): ApiRequest {
    return new ApiRequest({
      requestId: RequestId.reconstruct(record.request_id),
      routeId: RouteId.reconstruct(record.route_id),
      method: record.method as HttpMethod,
      path: record.path,
      headers: record.headers,
      query: record.query,
      body: record.body,
      receivedAt: new Date(record.received_at),
      metadata: record.metadata,
    });
  }

  /**
   * Gets the request ID value.
   */
  public get requestIdValue(): string {
    return this.requestId.value;
  }

  /**
   * Gets the route ID value.
   */
  public get routeIdValue(): string {
    return this.routeId.value;
  }

  /**
   * Checks if the request has a body.
   */
  public get hasBody(): boolean {
    return this.body !== null && this.body !== undefined;
  }

  /**
   * Checks if the request has query parameters.
   */
  public get hasQuery(): boolean {
    return Object.keys(this.query).length > 0;
  }

  /**
   * Gets a header value by name (case-insensitive).
   */
  public getHeader(name: string): string | string[] | undefined {
    const lowerName = name.toLowerCase();
    const keys = Object.keys(this.headers);
    for (const key of keys) {
      if (key.toLowerCase() === lowerName) {
        return this.headers[key];
      }
    }
    return undefined;
  }

  /**
   * Serializes the ApiRequest to a plain object.
   */
  public toJSON(): ApiRequestJSON {
    return {
      requestId: this.requestId.value,
      routeId: this.routeId.value,
      method: this.method,
      path: this.path,
      headers: this.headers,
      query: this.query,
      body: this.body,
      receivedAt: this.receivedAt.toISOString(),
      metadata: this.metadata,
    };
  }

  /**
   * Converts to database record format.
   */
  public toRecord(): ApiRequestRecord {
    return {
      request_id: this.requestId.value,
      route_id: this.routeId.value,
      method: this.method,
      path: this.path,
      headers: this.headers,
      query: this.query,
      body: this.body,
      received_at: this.receivedAt.toISOString(),
      metadata: this.metadata,
    };
  }
}
