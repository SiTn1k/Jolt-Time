/**
 * Supabase API Gateway Repository
 *
 * Production Supabase implementation of the API Gateway repository.
 * Handles all persistence operations for API Gateway entities.
 *
 * IMPORTANT: API Gateway is a METADATA management layer. It ONLY stores routes,
 * requests, and responses. API Gateway MUST NEVER:
 * - Execute gameplay
 * - Grant rewards
 * - Modify balances
 * - Modify inventory
 * - Execute any business logic
 */

import type { SupabaseClient, SupabaseClientOptions } from '@supabase/supabase-js';
import type {
  IApiGatewayRepository,
  ApiRouteFilterParams,
  ApiRequestFilterParams,
  ApiResponseFilterParams,
} from '../interfaces/IApiGatewayRepository';
import { ApiRoute, type ApiRouteRecord } from '../entities/ApiRoute';
import { ApiRequest, type ApiRequestRecord } from '../entities/ApiRequest';
import { ApiResponse, type ApiResponseRecord } from '../entities/ApiResponse';
import type { RouteId } from '../value-objects/RouteId';
import type { RequestId } from '../value-objects/RequestId';
import type { ResponseId } from '../value-objects/ResponseId';
import type { HttpMethod } from '../types/HttpMethod';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import { getSupabaseClient } from '../../../database/providers';
import { RepositoryError } from '../../../database/errors/repository.error';
import { createLogger } from '../../../core/logging/logger.service';
import type { ILogger } from '../../../shared/types/interfaces';

/**
 * Supabase implementation of the API Gateway Repository.
 * Implements IApiGatewayRepository for API Gateway entity persistence.
 */
export class SupabaseApiGatewayRepository implements IApiGatewayRepository {
  private readonly _tableNames = {
    routes: 'api_routes',
    requests: 'api_requests',
    responses: 'api_responses',
  } as const;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly _client: SupabaseClient<any, any, any>;
  private readonly _logger: ILogger;

  /**
   * Creates a new SupabaseApiGatewayRepository instance.
   * @param client Optional Supabase client (uses default provider if not provided)
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(client?: SupabaseClient<any, any, any>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this._client = client ?? (getSupabaseClient() as any);
    this._logger = createLogger('ApiGatewayRepository');
  }

  /**
   * Get the Supabase client.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private get client(): SupabaseClient<any, any, any> {
    return this._client;
  }

  /**
   * Maps a database row to ApiRouteRecord format.
   */
  private mapRowToRouteRecord(row: Record<string, unknown>): ApiRouteRecord {
    return {
      route_id: row.route_id as string,
      path: row.path as string,
      method: row.method as string,
      version: row.version as string,
      enabled: row.enabled as boolean,
      description: row.description as string,
      metadata: row.metadata as ApiRouteRecord['metadata'],
    };
  }

  /**
   * Maps a database row to ApiRoute entity.
   */
  private mapRowToRoute(row: Record<string, unknown>): ApiRoute {
    const record = this.mapRowToRouteRecord(row);
    return ApiRoute.fromDatabase(record);
  }

  /**
   * Maps a database row to ApiRequestRecord format.
   */
  private mapRowToRequestRecord(row: Record<string, unknown>): ApiRequestRecord {
    return {
      request_id: row.request_id as string,
      route_id: row.route_id as string,
      method: row.method as string,
      path: row.path as string,
      headers: row.headers as ApiRequestRecord['headers'],
      query: row.query as ApiRequestRecord['query'],
      body: row.body as ApiRequestRecord['body'],
      received_at: row.received_at as string,
      metadata: row.metadata as ApiRequestRecord['metadata'],
    };
  }

  /**
   * Maps a database row to ApiRequest entity.
   */
  private mapRowToRequest(row: Record<string, unknown>): ApiRequest {
    const record = this.mapRowToRequestRecord(row);
    return ApiRequest.fromDatabase(record);
  }

  /**
   * Maps a database row to ApiResponseRecord format.
   */
  private mapRowToResponseRecord(row: Record<string, unknown>): ApiResponseRecord {
    return {
      response_id: row.response_id as string,
      request_id: row.request_id as string,
      status_code: row.status_code as number,
      response_time: row.response_time as number,
      payload: row.payload as ApiResponseRecord['payload'],
      sent_at: row.sent_at as string,
      metadata: row.metadata as ApiResponseRecord['metadata'],
    };
  }

  /**
   * Maps a database row to ApiResponse entity.
   */
  private mapRowToResponse(row: Record<string, unknown>): ApiResponse {
    const record = this.mapRowToResponseRecord(row);
    return ApiResponse.fromDatabase(record);
  }

  /**
   * Calculates pagination offset from page and pageSize.
   */
  private calculateOffset(params: PaginationParams): number {
    return (params.page - 1) * params.pageSize;
  }

  /**
   * Builds the filter query for routes.
   */
  private buildRouteFilters(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: any,
    filters?: ApiRouteFilterParams
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any {
    let q = query;

    if (filters?.method) {
      q = q.eq('method', filters.method);
    }

    if (filters?.version) {
      q = q.eq('version', filters.version);
    }

    if (filters?.status) {
      if (filters.status === 'disabled') {
        q = q.eq('enabled', false);
      } else if (filters.status === 'active') {
        q = q.eq('enabled', true);
      }
    }

    if (filters?.enabled !== undefined) {
      q = q.eq('enabled', filters.enabled);
    }

    if (filters?.pathContains) {
      q = q.ilike('path', `%${filters.pathContains}%`);
    }

    if (filters?.tags && filters.tags.length > 0) {
      q = q.overlaps('metadata', { tags: filters.tags });
    }

    return q;
  }

  /**
   * Builds the filter query for requests.
   */
  private buildRequestFilters(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: any,
    filters?: ApiRequestFilterParams
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any {
    let q = query;

    if (filters?.routeId) {
      q = q.eq('route_id', filters.routeId);
    }

    if (filters?.method) {
      q = q.eq('method', filters.method);
    }

    if (filters?.pathContains) {
      q = q.ilike('path', `%${filters.pathContains}%`);
    }

    if (filters?.receivedAfter) {
      q = q.gte('received_at', filters.receivedAfter.toISOString());
    }

    if (filters?.receivedBefore) {
      q = q.lte('received_at', filters.receivedBefore.toISOString());
    }

    return q;
  }

  /**
   * Builds the filter query for responses.
   */
  private buildResponseFilters(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: any,
    filters?: ApiResponseFilterParams
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any {
    let q = query;

    if (filters?.requestId) {
      q = q.eq('request_id', filters.requestId);
    }

    if (filters?.statusCode) {
      q = q.eq('status_code', filters.statusCode);
    }

    if (filters?.sentAfter) {
      q = q.gte('sent_at', filters.sentAfter.toISOString());
    }

    if (filters?.sentBefore) {
      q = q.lte('sent_at', filters.sentBefore.toISOString());
    }

    if (filters?.minResponseTime !== undefined) {
      q = q.gte('response_time', filters.minResponseTime);
    }

    if (filters?.maxResponseTime !== undefined) {
      q = q.lte('response_time', filters.maxResponseTime);
    }

    return q;
  }

  // ============ Route Operations ============

  /**
   * Creates a new API route.
   */
  async createRoute(route: ApiRoute): Promise<ApiRoute> {
    try {
      this._logger.debug('Creating API route', { path: route.path, method: route.method });

      const record = route.toRecord();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await this.client
        .from(this._tableNames.routes)
        .insert(record)
        .select()
        .single() as { data: Record<string, unknown> | null; error: Record<string, unknown> | null };

      if (error) {
        this._logger.error('Failed to create API route', error as unknown as Error, { path: route.path });
        throw RepositoryError.createFailed('ApiRoute', error as unknown as Error);
      }

      if (!data) {
        throw RepositoryError.createFailed('ApiRoute');
      }

      this._logger.info('API route created successfully', { routeId: route.routeId.value });
      return this.mapRowToRoute(data);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      this._logger.error('Unexpected error creating API route', err as unknown as Error);
      throw RepositoryError.createFailed('ApiRoute', err as unknown as Error);
    }
  }

  /**
   * Finds a route by its ID.
   */
  async findRouteById(id: RouteId): Promise<ApiRoute | null> {
    try {
      this._logger.debug('Finding route by ID', { routeId: id.value });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await this.client
        .from(this._tableNames.routes)
        .select('*')
        .eq('route_id', id.value)
        .single() as { data: Record<string, unknown> | null; error: Record<string, unknown> | null };

      if (error) {
        if ((error as { code?: string }).code === 'PGRST116') {
          this._logger.debug('Route not found', { routeId: id.value });
          return null;
        }
        this._logger.error('Failed to find route by ID', error as unknown as Error, { routeId: id.value });
        throw RepositoryError.queryFailed(`findRouteById: ${error}`, error as unknown as Error);
      }

      if (!data) {
        return null;
      }

      return this.mapRowToRoute(data);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      this._logger.error('Unexpected error finding route by ID', err as unknown as Error, { routeId: id.value });
      throw RepositoryError.queryFailed(`findRouteById: ${err}`, err as unknown as Error);
    }
  }

  /**
   * Finds a route by path and method.
   */
  async findRouteByPathAndMethod(path: string, method: HttpMethod): Promise<ApiRoute | null> {
    try {
      this._logger.debug('Finding route by path and method', { path, method });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await this.client
        .from(this._tableNames.routes)
        .select('*')
        .eq('path', path)
        .eq('method', method)
        .eq('enabled', true)
        .single() as { data: Record<string, unknown> | null; error: Record<string, unknown> | null };

      if (error) {
        if ((error as { code?: string }).code === 'PGRST116') {
          this._logger.debug('Route not found by path and method', { path, method });
          return null;
        }
        this._logger.error('Failed to find route by path and method', error as unknown as Error, { path, method });
        throw RepositoryError.queryFailed(`findRouteByPathAndMethod: ${error}`, error as unknown as Error);
      }

      if (!data) {
        return null;
      }

      return this.mapRowToRoute(data);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      this._logger.error('Unexpected error finding route by path and method', err as unknown as Error, { path, method });
      throw RepositoryError.queryFailed(`findRouteByPathAndMethod: ${err}`, err as unknown as Error);
    }
  }

  /**
   * Lists routes with pagination and filtering.
   */
  async listRoutes(
    params: PaginationParams,
    filters?: ApiRouteFilterParams
  ): Promise<PaginatedResult<ApiRoute>> {
    try {
      this._logger.debug('Listing routes', { params, filters });

      const offset = this.calculateOffset(params);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query = this.client
        .from(this._tableNames.routes)
        .select('*', { count: 'exact' })
        .range(offset, offset + params.pageSize - 1);

      query = this.buildRouteFilters(query, filters);

      if (params.sortBy) {
        const sortOrder = params.sortOrder === 'asc' ? 'asc' : 'desc';
        query = query.order(params.sortBy, { ascending: sortOrder === 'asc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error, count } = await query as { data: Record<string, unknown>[] | null; error: Record<string, unknown> | null; count: number | null };

      if (error) {
        this._logger.error('Failed to list routes', error as unknown as Error);
        throw RepositoryError.queryFailed(`listRoutes: ${error}`, error as unknown as Error);
      }

      const total = count ?? 0;
      const items = (data ?? []).map((row) => this.mapRowToRoute(row));

      return {
        items,
        total,
        page: params.page,
        pageSize: params.pageSize,
        totalPages: Math.ceil(total / params.pageSize),
        hasNextPage: params.page * params.pageSize < total,
        hasPreviousPage: params.page > 1,
      };
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      this._logger.error('Unexpected error listing routes', err as unknown as Error);
      throw RepositoryError.queryFailed(`listRoutes: ${err}`, err as unknown as Error);
    }
  }

  /**
   * Counts routes with optional filtering.
   */
  async countRoutes(filters?: ApiRouteFilterParams): Promise<number> {
    try {
      this._logger.debug('Counting routes', { filters });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query = this.client
        .from(this._tableNames.routes)
        .select('*', { count: 'exact', head: true });

      query = this.buildRouteFilters(query, filters);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { count, error } = await query as { count: number | null; error: Record<string, unknown> | null };

      if (error) {
        this._logger.error('Failed to count routes', error as unknown as Error);
        throw RepositoryError.queryFailed(`countRoutes: ${error}`, error as unknown as Error);
      }

      return count ?? 0;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      this._logger.error('Unexpected error counting routes', err as unknown as Error);
      throw RepositoryError.queryFailed(`countRoutes: ${err}`, err as unknown as Error);
    }
  }

  /**
   * Updates an existing route.
   */
  async updateRoute(route: ApiRoute): Promise<ApiRoute> {
    try {
      this._logger.debug('Updating API route', { routeId: route.routeId.value });

      const record = route.toRecord();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await this.client
        .from(this._tableNames.routes)
        .update({
          path: record.path,
          method: record.method,
          version: record.version,
          enabled: record.enabled,
          description: record.description,
          metadata: record.metadata,
        })
        .eq('route_id', route.routeId.value)
        .select()
        .single() as { data: Record<string, unknown> | null; error: Record<string, unknown> | null };

      if (error) {
        this._logger.error('Failed to update API route', error as unknown as Error, { routeId: route.routeId.value });
        throw RepositoryError.updateFailed('ApiRoute', route.routeId.value, error as unknown as Error);
      }

      if (!data) {
        throw RepositoryError.updateFailed('ApiRoute', route.routeId.value);
      }

      this._logger.info('API route updated successfully', { routeId: route.routeId.value });
      return this.mapRowToRoute(data);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      this._logger.error('Unexpected error updating API route', err as unknown as Error, { routeId: route.routeId.value });
      throw RepositoryError.updateFailed('ApiRoute', route.routeId.value, err as unknown as Error);
    }
  }

  /**
   * Deletes a route by ID.
   */
  async deleteRoute(id: RouteId): Promise<boolean> {
    try {
      this._logger.debug('Deleting API route', { routeId: id.value });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await this.client
        .from(this._tableNames.routes)
        .delete()
        .eq('route_id', id.value) as { error: Record<string, unknown> | null };

      if (error) {
        this._logger.error('Failed to delete API route', error as unknown as Error, { routeId: id.value });
        throw RepositoryError.deleteFailed('ApiRoute', id.value, error as unknown as Error);
      }

      this._logger.info('API route deleted successfully', { routeId: id.value });
      return true;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      this._logger.error('Unexpected error deleting API route', err as unknown as Error, { routeId: id.value });
      throw RepositoryError.deleteFailed('ApiRoute', id.value, err as unknown as Error);
    }
  }

  // ============ Request Operations ============

  /**
   * Creates a new API request record.
   */
  async createRequest(request: ApiRequest): Promise<ApiRequest> {
    try {
      this._logger.debug('Creating API request', { path: request.path, method: request.method });

      const record = request.toRecord();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await this.client
        .from(this._tableNames.requests)
        .insert(record)
        .select()
        .single() as { data: Record<string, unknown> | null; error: Record<string, unknown> | null };

      if (error) {
        this._logger.error('Failed to create API request', error as unknown as Error, { path: request.path });
        throw RepositoryError.createFailed('ApiRequest', error as unknown as Error);
      }

      if (!data) {
        throw RepositoryError.createFailed('ApiRequest');
      }

      this._logger.debug('API request created successfully', { requestId: request.requestId.value });
      return this.mapRowToRequest(data);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      this._logger.error('Unexpected error creating API request', err as unknown as Error);
      throw RepositoryError.createFailed('ApiRequest', err as unknown as Error);
    }
  }

  /**
   * Finds a request by its ID.
   */
  async findRequestById(id: RequestId): Promise<ApiRequest | null> {
    try {
      this._logger.debug('Finding request by ID', { requestId: id.value });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await this.client
        .from(this._tableNames.requests)
        .select('*')
        .eq('request_id', id.value)
        .single() as { data: Record<string, unknown> | null; error: Record<string, unknown> | null };

      if (error) {
        if ((error as { code?: string }).code === 'PGRST116') {
          this._logger.debug('Request not found', { requestId: id.value });
          return null;
        }
        this._logger.error('Failed to find request by ID', error as unknown as Error, { requestId: id.value });
        throw RepositoryError.queryFailed(`findRequestById: ${error}`, error as unknown as Error);
      }

      if (!data) {
        return null;
      }

      return this.mapRowToRequest(data);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      this._logger.error('Unexpected error finding request by ID', err as unknown as Error, { requestId: id.value });
      throw RepositoryError.queryFailed(`findRequestById: ${err}`, err as unknown as Error);
    }
  }

  /**
   * Lists requests with pagination and filtering.
   */
  async listRequests(
    params: PaginationParams,
    filters?: ApiRequestFilterParams
  ): Promise<PaginatedResult<ApiRequest>> {
    try {
      this._logger.debug('Listing requests', { params, filters });

      const offset = this.calculateOffset(params);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query = this.client
        .from(this._tableNames.requests)
        .select('*', { count: 'exact' })
        .range(offset, offset + params.pageSize - 1);

      query = this.buildRequestFilters(query, filters);

      if (params.sortBy) {
        const sortOrder = params.sortOrder === 'asc' ? 'asc' : 'desc';
        query = query.order(params.sortBy, { ascending: sortOrder === 'asc' });
      } else {
        query = query.order('received_at', { ascending: false });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error, count } = await query as { data: Record<string, unknown>[] | null; error: Record<string, unknown> | null; count: number | null };

      if (error) {
        this._logger.error('Failed to list requests', error as unknown as Error);
        throw RepositoryError.queryFailed(`listRequests: ${error}`, error as unknown as Error);
      }

      const total = count ?? 0;
      const items = (data ?? []).map((row) => this.mapRowToRequest(row));

      return {
        items,
        total,
        page: params.page,
        pageSize: params.pageSize,
        totalPages: Math.ceil(total / params.pageSize),
        hasNextPage: params.page * params.pageSize < total,
        hasPreviousPage: params.page > 1,
      };
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      this._logger.error('Unexpected error listing requests', err as unknown as Error);
      throw RepositoryError.queryFailed(`listRequests: ${err}`, err as unknown as Error);
    }
  }

  /**
   * Counts requests with optional filtering.
   */
  async countRequests(filters?: ApiRequestFilterParams): Promise<number> {
    try {
      this._logger.debug('Counting requests', { filters });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query = this.client
        .from(this._tableNames.requests)
        .select('*', { count: 'exact', head: true });

      query = this.buildRequestFilters(query, filters);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { count, error } = await query as { count: number | null; error: Record<string, unknown> | null };

      if (error) {
        this._logger.error('Failed to count requests', error as unknown as Error);
        throw RepositoryError.queryFailed(`countRequests: ${error}`, error as unknown as Error);
      }

      return count ?? 0;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      this._logger.error('Unexpected error counting requests', err as unknown as Error);
      throw RepositoryError.queryFailed(`countRequests: ${err}`, err as unknown as Error);
    }
  }

  // ============ Response Operations ============

  /**
   * Creates a new API response record.
   */
  async createResponse(response: ApiResponse): Promise<ApiResponse> {
    try {
      this._logger.debug('Creating API response', { requestId: response.requestId.value, statusCode: response.statusCode });

      const record = response.toRecord();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await this.client
        .from(this._tableNames.responses)
        .insert(record)
        .select()
        .single() as { data: Record<string, unknown> | null; error: Record<string, unknown> | null };

      if (error) {
        this._logger.error('Failed to create API response', error as unknown as Error, { requestId: response.requestId.value });
        throw RepositoryError.createFailed('ApiResponse', error as unknown as Error);
      }

      if (!data) {
        throw RepositoryError.createFailed('ApiResponse');
      }

      this._logger.debug('API response created successfully', { responseId: response.responseId.value });
      return this.mapRowToResponse(data);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      this._logger.error('Unexpected error creating API response', err as unknown as Error);
      throw RepositoryError.createFailed('ApiResponse', err as unknown as Error);
    }
  }

  /**
   * Finds a response by its ID.
   */
  async findResponseById(id: ResponseId): Promise<ApiResponse | null> {
    try {
      this._logger.debug('Finding response by ID', { responseId: id.value });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await this.client
        .from(this._tableNames.responses)
        .select('*')
        .eq('response_id', id.value)
        .single() as { data: Record<string, unknown> | null; error: Record<string, unknown> | null };

      if (error) {
        if ((error as { code?: string }).code === 'PGRST116') {
          this._logger.debug('Response not found', { responseId: id.value });
          return null;
        }
        this._logger.error('Failed to find response by ID', error as unknown as Error, { responseId: id.value });
        throw RepositoryError.queryFailed(`findResponseById: ${error}`, error as unknown as Error);
      }

      if (!data) {
        return null;
      }

      return this.mapRowToResponse(data);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      this._logger.error('Unexpected error finding response by ID', err as unknown as Error, { responseId: id.value });
      throw RepositoryError.queryFailed(`findResponseById: ${err}`, err as unknown as Error);
    }
  }

  /**
   * Finds responses by request ID.
   */
  async findResponsesByRequestId(requestId: RequestId): Promise<ApiResponse[]> {
    try {
      this._logger.debug('Finding responses by request ID', { requestId: requestId.value });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await this.client
        .from(this._tableNames.responses)
        .select('*')
        .eq('request_id', requestId.value)
        .order('sent_at', { ascending: false }) as { data: Record<string, unknown>[] | null; error: Record<string, unknown> | null };

      if (error) {
        this._logger.error('Failed to find responses by request ID', error as unknown as Error, { requestId: requestId.value });
        throw RepositoryError.queryFailed(`findResponsesByRequestId: ${error}`, error as unknown as Error);
      }

      return (data ?? []).map((row) => this.mapRowToResponse(row));
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      this._logger.error('Unexpected error finding responses by request ID', err as unknown as Error, { requestId: requestId.value });
      throw RepositoryError.queryFailed(`findResponsesByRequestId: ${err}`, err as unknown as Error);
    }
  }

  /**
   * Lists responses with pagination and filtering.
   */
  async listResponses(
    params: PaginationParams,
    filters?: ApiResponseFilterParams
  ): Promise<PaginatedResult<ApiResponse>> {
    try {
      this._logger.debug('Listing responses', { params, filters });

      const offset = this.calculateOffset(params);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query = this.client
        .from(this._tableNames.responses)
        .select('*', { count: 'exact' })
        .range(offset, offset + params.pageSize - 1);

      query = this.buildResponseFilters(query, filters);

      if (params.sortBy) {
        const sortOrder = params.sortOrder === 'asc' ? 'asc' : 'desc';
        query = query.order(params.sortBy, { ascending: sortOrder === 'asc' });
      } else {
        query = query.order('sent_at', { ascending: false });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error, count } = await query as { data: Record<string, unknown>[] | null; error: Record<string, unknown> | null; count: number | null };

      if (error) {
        this._logger.error('Failed to list responses', error as unknown as Error);
        throw RepositoryError.queryFailed(`listResponses: ${error}`, error as unknown as Error);
      }

      const total = count ?? 0;
      const items = (data ?? []).map((row) => this.mapRowToResponse(row));

      return {
        items,
        total,
        page: params.page,
        pageSize: params.pageSize,
        totalPages: Math.ceil(total / params.pageSize),
        hasNextPage: params.page * params.pageSize < total,
        hasPreviousPage: params.page > 1,
      };
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      this._logger.error('Unexpected error listing responses', err as unknown as Error);
      throw RepositoryError.queryFailed(`listResponses: ${err}`, err as unknown as Error);
    }
  }

  /**
   * Counts responses with optional filtering.
   */
  async countResponses(filters?: ApiResponseFilterParams): Promise<number> {
    try {
      this._logger.debug('Counting responses', { filters });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query = this.client
        .from(this._tableNames.responses)
        .select('*', { count: 'exact', head: true });

      query = this.buildResponseFilters(query, filters);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { count, error } = await query as { count: number | null; error: Record<string, unknown> | null };

      if (error) {
        this._logger.error('Failed to count responses', error as unknown as Error);
        throw RepositoryError.queryFailed(`countResponses: ${error}`, error as unknown as Error);
      }

      return count ?? 0;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      this._logger.error('Unexpected error counting responses', err as unknown as Error);
      throw RepositoryError.queryFailed(`countResponses: ${err}`, err as unknown as Error);
    }
  }
}
