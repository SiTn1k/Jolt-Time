/**
 * RequestReceived Event
 *
 * Event emitted when an API request is received.
 */

import type { RequestId } from '../value-objects/RequestId';
import type { RouteId } from '../value-objects/RouteId';
import type { HttpMethod } from '../types/HttpMethod';

/**
 * RequestReceived event class.
 * Emitted when an API request is received.
 */
export class RequestReceived {
  public readonly eventType = 'RequestReceived';
  public readonly requestId: string;
  public readonly routeId: string;
  public readonly method: HttpMethod;
  public readonly path: string;
  public readonly timestamp: Date;

  /**
   * Creates a new RequestReceived event.
   */
  constructor(params: {
    requestId: RequestId;
    routeId: RouteId;
    method: HttpMethod;
    path: string;
    timestamp?: Date;
  }) {
    this.requestId = params.requestId.value;
    this.routeId = params.routeId.value;
    this.method = params.method;
    this.path = params.path;
    this.timestamp = params.timestamp ?? new Date();
  }

  /**
   * Serializes the event to a plain object.
   */
  public toJSON(): RequestReceivedJSON {
    return {
      eventType: this.eventType,
      requestId: this.requestId,
      routeId: this.routeId,
      method: this.method,
      path: this.path,
      timestamp: this.timestamp.toISOString(),
    };
  }
}

/**
 * JSON representation of RequestReceived event.
 */
export interface RequestReceivedJSON {
  eventType: string;
  requestId: string;
  routeId: string;
  method: HttpMethod;
  path: string;
  timestamp: string;
}
