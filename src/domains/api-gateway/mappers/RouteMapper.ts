/**
 * RouteMapper
 *
 * Maps between ApiRoute entity and DTOs.
 * No routing logic - pure transformation only.
 */

import type { ApiRouteRecord } from '../entities/ApiRoute';
import { ApiRoute } from '../entities/ApiRoute';
import type {
  ApiRouteDto,
  CreateApiRouteDto,
  UpdateApiRouteDto,
  ApiRouteListDto,
} from '../dto/ApiRoute.dto';

/**
 * Mapper for converting between ApiRoute entity and DTOs.
 */
export class RouteMapper {
  /**
   * Converts an ApiRoute entity to ApiRouteDto.
   */
  public static toDto(route: ApiRoute): ApiRouteDto {
    return {
      routeId: route.routeId.value,
      path: route.path,
      method: route.method,
      version: route.version,
      enabled: route.enabled,
      description: route.description,
      metadata: route.metadata,
    };
  }

  /**
   * Converts an ApiRoute entity to a database record format.
   */
  public static toRecord(route: ApiRoute): ApiRouteRecord {
    return route.toRecord();
  }

  /**
   * Converts a database record to ApiRouteDto.
   */
  public static fromRecordToDto(record: ApiRouteRecord): ApiRouteDto {
    return {
      routeId: record.route_id,
      path: record.path,
      method: record.method as ApiRouteDto['method'],
      version: record.version as ApiRouteDto['version'],
      enabled: record.enabled,
      description: record.description,
      metadata: record.metadata,
    };
  }

  /**
   * Converts a database record to ApiRoute entity.
   */
  public static fromRecord(record: ApiRouteRecord): ApiRoute {
    return ApiRoute.fromDatabase(record);
  }

  /**
   * Converts an array of ApiRoute entities to ApiRouteListDto.
   */
  public static toListDto(
    routes: ApiRoute[],
    total: number,
    page: number,
    pageSize: number
  ): ApiRouteListDto {
    return {
      routes: routes.map((r) => this.toDto(r)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Converts a CreateApiRouteDto to route creation params.
   */
  public static fromCreateDto(dto: CreateApiRouteDto): {
    path: string;
    method: CreateApiRouteDto['method'];
    version?: CreateApiRouteDto['version'];
    enabled?: boolean;
    description?: string;
    metadata?: CreateApiRouteDto['metadata'];
  } {
    return {
      path: dto.path,
      method: dto.method,
      version: dto.version,
      enabled: dto.enabled,
      description: dto.description,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts an UpdateApiRouteDto to route update params.
   */
  public static fromUpdateDto(dto: UpdateApiRouteDto): {
    path?: string;
    method?: UpdateApiRouteDto['method'];
    version?: UpdateApiRouteDto['version'];
    enabled?: boolean;
    description?: string;
    metadata?: UpdateApiRouteDto['metadata'];
  } {
    return {
      path: dto.path,
      method: dto.method,
      version: dto.version,
      enabled: dto.enabled,
      description: dto.description,
      metadata: dto.metadata,
    };
  }
}
