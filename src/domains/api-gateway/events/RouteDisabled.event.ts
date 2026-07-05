/**
 * RouteDisabled Event
 *
 * Event emitted when an API route is disabled.
 */

import type { RouteId } from '../value-objects/RouteId';
import type { HttpMethod } from '../types/HttpMethod';
import type { ApiVersion } from '../types/ApiVersion';

/**
 * RouteDisabled event class.
 * Emitted when an API route is disabled.
 */
export class RouteDisabled {
  public readonly eventType = 'RouteDisabled';
  public readonly routeId: string;
  public readonly path: string;
  public readonly method: HttpMethod;
  public readonly version: ApiVersion;
  public readonly timestamp: Date;

  /**
   * Creates a new RouteDisabled event.
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
  public toJSON(): RouteDisabledJSON {
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
 * JSON representation of RouteDisabled event.
 */
export interface RouteDisabledJSON {
  eventType: string;
  routeId: string;
  path: string;
  method: HttpMethod;
  version: ApiVersion;
  timestamp: string;
}
