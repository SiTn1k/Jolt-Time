/**
 * RouteRegistered Event
 *
 * Event emitted when a new API route is registered.
 */

import type { RouteId } from '../value-objects/RouteId';
import type { HttpMethod } from '../types/HttpMethod';
import type { ApiVersion } from '../types/ApiVersion';

/**
 * RouteRegistered event class.
 * Emitted when a new API route is registered.
 */
export class RouteRegistered {
  public readonly eventType = 'RouteRegistered';
  public readonly routeId: string;
  public readonly path: string;
  public readonly method: HttpMethod;
  public readonly version: ApiVersion;
  public readonly timestamp: Date;

  /**
   * Creates a new RouteRegistered event.
   */
  constructor(params: {
    routeId: RouteId;
    path: string;
    method: HttpMethod;
    version: ApiVersion;
    timestamp?: Date;
  }) {
    this.routeId = params.routeId.value;
    this.path = params.path;
    this.method = params.method;
    this.version = params.version;
    this.timestamp = params.timestamp ?? new Date();
  }

  /**
   * Serializes the event to a plain object.
   */
  public toJSON(): RouteRegisteredJSON {
    return {
      eventType: this.eventType,
      routeId: this.routeId,
      path: this.path,
      method: this.method,
      version: this.version,
      timestamp: this.timestamp.toISOString(),
    };
  }
}

/**
 * JSON representation of RouteRegistered event.
 */
export interface RouteRegisteredJSON {
  eventType: string;
  routeId: string;
  path: string;
  method: HttpMethod;
  version: ApiVersion;
  timestamp: string;
}
