/**
 * ApiRoute Entity
 *
 * Domain entity representing an API route.
 * An API route defines a path, method, version, and configuration for HTTP requests.
 *
 * ApiRoute Entity Responsibilities:
 * - Store route identification and configuration
 * - Track route status and metadata
 * - Record route versioning information
 *
 * ApiRoute Entity is NOT:
 * - A request handler
 * - A router
 * - A middleware
 * - A gameplay modifier
 * - A state changer
 */

import type { IApiRoute } from '../interfaces/IApiRoute';
import { RouteId } from '../value-objects/RouteId';
import type { HttpMethod } from '../types/HttpMethod';
import type { ApiVersion } from '../types/ApiVersion';
import type { RouteStatus } from '../types/RouteStatus';
import type { GatewayMetadata } from '../types/GatewayMetadata';

/**
 * ApiRoute entity props for constructor.
 */
export interface ApiRouteProps {
  routeId: RouteId;
  path: string;
  method: HttpMethod;
  version: ApiVersion;
  enabled: boolean;
  description: string;
  metadata: GatewayMetadata;
}

/**
 * Database record representation of ApiRoute.
 */
export interface ApiRouteRecord {
  route_id: string;
  path: string;
  method: string;
  version: string;
  enabled: boolean;
  description: string;
  metadata: GatewayMetadata;
}

/**
 * JSON serialization representation of ApiRoute.
 */
export interface ApiRouteJSON {
  routeId: string;
  path: string;
  method: HttpMethod;
  version: ApiVersion;
  enabled: boolean;
  description: string;
  metadata: GatewayMetadata;
}

/**
 * ApiRoute entity class.
 * Immutable domain entity representing an API route.
 */
export class ApiRoute implements IApiRoute {
  public readonly routeId: RouteId;
  public readonly path: string;
  public readonly method: HttpMethod;
  public readonly version: ApiVersion;
  public readonly enabled: boolean;
  public readonly description: string;
  public readonly metadata: GatewayMetadata;

  /**
   * Creates a new ApiRoute instance.
   */
  constructor(props: ApiRouteProps) {
    this.routeId = props.routeId;
    this.path = props.path;
    this.method = props.method;
    this.version = props.version;
    this.enabled = props.enabled;
    this.description = props.description;
    this.metadata = props.metadata;
  }

  /**
   * Creates a new ApiRoute entity.
   * Factory method for new route creation.
   */
  public static create(params: {
    routeId?: RouteId | string;
    path: string;
    method: HttpMethod;
    version?: ApiVersion;
    enabled?: boolean;
    description?: string;
    metadata?: GatewayMetadata;
  }): ApiRoute {
    const routeId = params.routeId
      ? typeof params.routeId === 'string'
        ? RouteId.create(params.routeId)
        : params.routeId
      : RouteId.generate();

    return new ApiRoute({
      routeId,
      path: params.path,
      method: params.method,
      version: params.version ?? 'v1',
      enabled: params.enabled ?? true,
      description: params.description ?? '',
      metadata: params.metadata ?? {
        description: '',
        tags: [],
        customFields: {},
      },
    });
  }

  /**
   * Reconstructs an ApiRoute from stored data.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: ApiRouteRecord): ApiRoute {
    return new ApiRoute({
      routeId: RouteId.reconstruct(record.route_id),
      path: record.path,
      method: record.method as HttpMethod,
      version: record.version as ApiVersion,
      enabled: record.enabled,
      description: record.description,
      metadata: record.metadata,
    });
  }

  /**
   * Checks if this route is active.
   */
  public get isActive(): boolean {
    return this.enabled;
  }

  /**
   * Gets the full path including version prefix.
   */
  public get fullPath(): string {
    return `/api/${this.version}${this.path}`;
  }

  /**
   * Gets the route status.
   */
  public get status(): RouteStatus {
    if (!this.enabled) {
      return 'disabled';
    }
    return 'active';
  }

  /**
   * Creates a copy with updated fields.
   */
  public copyWith(params: Partial<Omit<ApiRouteProps, 'routeId'>>): ApiRoute {
    return new ApiRoute({
      routeId: this.routeId,
      path: params.path ?? this.path,
      method: params.method ?? this.method,
      version: params.version ?? this.version,
      enabled: params.enabled ?? this.enabled,
      description: params.description ?? this.description,
      metadata: params.metadata ?? this.metadata,
    });
  }

  /**
   * Creates a copy marked as enabled.
   */
  public enable(): ApiRoute {
    return this.copyWith({ enabled: true });
  }

  /**
   * Creates a copy marked as disabled.
   */
  public disable(): ApiRoute {
    return this.copyWith({ enabled: false });
  }

  /**
   * Serializes the ApiRoute to a plain object.
   */
  public toJSON(): ApiRouteJSON {
    return {
      routeId: this.routeId.value,
      path: this.path,
      method: this.method,
      version: this.version,
      enabled: this.enabled,
      description: this.description,
      metadata: this.metadata,
    };
  }

  /**
   * Converts to database record format.
   */
  public toRecord(): ApiRouteRecord {
    return {
      route_id: this.routeId.value,
      path: this.path,
      method: this.method,
      version: this.version,
      enabled: this.enabled,
      description: this.description,
      metadata: this.metadata,
    };
  }
}
