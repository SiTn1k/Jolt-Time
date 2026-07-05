/**
 * IApiRoute Interface
 *
 * Interface defining the contract for API route entities.
 */

import type { RouteId } from '../value-objects/RouteId';
import type { HttpMethod } from '../types/HttpMethod';
import type { ApiVersion } from '../types/ApiVersion';
import type { RouteStatus } from '../types/RouteStatus';
import type { GatewayMetadata } from '../types/GatewayMetadata';

/**
 * API Route interface.
 * Defines the contract for API route entities.
 */
export interface IApiRoute {
  /**
   * Unique route identifier.
   */
  readonly routeId: RouteId;

  /**
   * Route path pattern.
   */
  readonly path: string;

  /**
   * HTTP method.
   */
  readonly method: HttpMethod;

  /**
   * API version.
   */
  readonly version: ApiVersion;

  /**
   * Whether the route is enabled.
   */
  readonly enabled: boolean;

  /**
   * Route description.
   */
  readonly description: string;

  /**
   * Route metadata.
   */
  readonly metadata: GatewayMetadata;

  /**
   * Checks if the route is active.
   */
  readonly isActive: boolean;

  /**
   * Gets the full path including version prefix.
   */
  readonly fullPath: string;

  /**
   * Gets the route status.
   */
  readonly status: RouteStatus;
}
