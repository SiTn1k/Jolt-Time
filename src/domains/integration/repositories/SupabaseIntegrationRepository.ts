/**
 * Supabase Integration Repository
 *
 * Production Supabase implementation of the Integration repository.
 * Handles all persistence operations for integration entities.
 *
 * IMPORTANT: Integration is a METADATA management layer. It ONLY stores integration
 * providers, requests, and responses. Integration MUST NEVER:
 * - Execute HTTP requests
 * - Handle retries
 * - Implement circuit breakers
 * - Implement rate limiting
 * - Modify gameplay
 * - Grant rewards
 * - Modify balances
 * - Modify inventory
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../../database/supabase-types';
import type {
  IIntegrationRepository,
  ProviderFilterParams,
  RequestFilterParams,
  ResponseFilterParams,
} from '../interfaces/IIntegrationRepository';
import { IntegrationProvider, type IntegrationProviderRecord } from '../entities/IntegrationProvider';
import { IntegrationRequest, type IntegrationRequestRecord } from '../entities/IntegrationRequest';
import { IntegrationResponse, type IntegrationResponseRecord } from '../entities/IntegrationResponse';
import { ProviderId } from '../value-objects/ProviderId';
import { RequestId } from '../value-objects/RequestId';
import { ResponseId } from '../value-objects/ResponseId';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import { getSupabaseClient } from '../../../database/providers';
import { RepositoryError } from '../../../shared/errors/repository.error';

/**
 * Supabase implementation of the Integration Repository.
 * Implements IIntegrationRepository for integration entity persistence.
 */
export class SupabaseIntegrationRepository implements IIntegrationRepository {
  private readonly _client: SupabaseClient<Database>;
  private readonly _tableNames = {
    providers: 'integration_providers',
    requests: 'integration_requests',
    responses: 'integration_responses',
  } as const;

  /**
   * Creates a new SupabaseIntegrationRepository instance.
   * @param client Optional Supabase client (uses default provider if not provided)
   */
  constructor(client?: SupabaseClient<Database>) {
    this._client = client ?? getSupabaseClient();
  }

  // ============ Helper Methods ============

  /**
   * Maps a database row to an IntegrationProvider entity.
   */
  private mapRowToProvider(row: Record<string, unknown>): IntegrationProvider {
    const record: IntegrationProviderRecord = {
      provider_id: row.provider_id as string,
      provider_name: row.provider_name as string,
      provider_type: row.provider_type as string,
      status: row.status as string,
      version: row.version as string,
      configuration: (row.configuration as Record<string, unknown>) || {},
      metadata: (row.metadata as Record<string, unknown>) || {},
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
    };
    return IntegrationProvider.fromDatabase(record);
  }

  /**
   * Maps a database row to an IntegrationRequest entity.
   */
  private mapRowToRequest(row: Record<string, unknown>): IntegrationRequest {
    const record: IntegrationRequestRecord = {
      request_id: row.request_id as string,
      provider_id: row.provider_id as string,
      request_type: row.request_type as string,
      payload: (row.payload as Record<string, unknown>) || {},
      metadata: (row.metadata as Record<string, unknown>) || {},
      created_at: row.created_at as string,
    };
    return IntegrationRequest.fromDatabase(record);
  }

  /**
   * Maps a database row to an IntegrationResponse entity.
   */
  private mapRowToResponse(row: Record<string, unknown>): IntegrationResponse {
    const record: IntegrationResponseRecord = {
      response_id: row.response_id as string,
      request_id: row.request_id as string,
      status: row.status as string,
      response_code: row.response_code as number,
      payload: (row.payload as Record<string, unknown>) || {},
      metadata: (row.metadata as Record<string, unknown>) || {},
      received_at: row.received_at as string,
    };
    return IntegrationResponse.fromDatabase(record);
  }

  /**
   * Builds filter conditions for providers query.
   */
  private buildProviderFilters(filters?: ProviderFilterParams): Record<string, unknown> {
    const conditions: Record<string, unknown> = {};

    if (filters?.type) {
      conditions.provider_type = filters.type;
    }
    if (filters?.status) {
      conditions.status = filters.status;
    }
    if (filters?.createdAfter) {
      conditions.created_at_gte = filters.createdAfter.toISOString();
    }
    if (filters?.createdBefore) {
      conditions.created_at_lte = filters.createdBefore.toISOString();
    }

    return conditions;
  }

  /**
   * Builds filter conditions for requests query.
   */
  private buildRequestFilters(filters?: RequestFilterParams): Record<string, unknown> {
    const conditions: Record<string, unknown> = {};

    if (filters?.providerId) {
      conditions.provider_id = filters.providerId.value;
    }
    if (filters?.requestType) {
      conditions.request_type = filters.requestType;
    }
    if (filters?.createdAfter) {
      conditions.created_at_gte = filters.createdAfter.toISOString();
    }
    if (filters?.createdBefore) {
      conditions.created_at_lte = filters.createdBefore.toISOString();
    }

    return conditions;
  }

  /**
   * Builds filter conditions for responses query.
   */
  private buildResponseFilters(filters?: ResponseFilterParams): Record<string, unknown> {
    const conditions: Record<string, unknown> = {};

    if (filters?.requestId) {
      conditions.request_id = filters.requestId.value;
    }
    if (filters?.status) {
      conditions.status = filters.status;
    }
    if (filters?.responseCodeRange) {
      switch (filters.responseCodeRange) {
        case '2xx':
          conditions.response_code_gte = 200;
          conditions.response_code_lte = 299;
          break;
        case '3xx':
          conditions.response_code_gte = 300;
          conditions.response_code_lte = 399;
          break;
        case '4xx':
          conditions.response_code_gte = 400;
          conditions.response_code_lte = 499;
          break;
        case '5xx':
          conditions.response_code_gte = 500;
          conditions.response_code_lte = 599;
          break;
      }
    }
    if (filters?.receivedAfter) {
      conditions.received_at_gte = filters.receivedAfter.toISOString();
    }
    if (filters?.receivedBefore) {
      conditions.received_at_lte = filters.receivedBefore.toISOString();
    }

    return conditions;
  }

  /**
   * Calculates pagination metadata.
   */
  private calculatePagination(total: number, page: number, pageSize: number): {
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } {
    const totalPages = Math.ceil(total / pageSize);
    return {
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  // ============ Integration Provider Operations ============

  /**
   * Creates a new integration provider.
   */
  async createProvider(provider: IntegrationProvider): Promise<IntegrationProvider> {
    try {
      const record = provider.toRecord();
      const { data, error } = await this._client
        .from(this._tableNames.providers)
        .insert(record)
        .select()
        .single();

      if (error) {
        throw RepositoryError.queryFailed(`Failed to create provider: ${error.message}`, error);
      }

      return this.mapRowToProvider(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed('Failed to create provider', err as Error);
    }
  }

  /**
   * Finds an integration provider by ID.
   */
  async findProviderById(id: ProviderId): Promise<IntegrationProvider | null> {
    try {
      const { data, error } = await this._client
        .from(this._tableNames.providers)
        .select('*')
        .eq('provider_id', id.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw RepositoryError.queryFailed(`Failed to find provider: ${error.message}`, error);
      }

      return this.mapRowToProvider(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed('Failed to find provider by ID', err as Error);
    }
  }

  /**
   * Finds an integration provider by name.
   */
  async findProviderByName(name: string): Promise<IntegrationProvider | null> {
    try {
      const { data, error } = await this._client
        .from(this._tableNames.providers)
        .select('*')
        .eq('provider_name', name)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw RepositoryError.queryFailed(`Failed to find provider: ${error.message}`, error);
      }

      return this.mapRowToProvider(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed('Failed to find provider by name', err as Error);
    }
  }

  /**
   * Checks if a provider exists by ID.
   */
  async providerExists(id: ProviderId): Promise<boolean> {
    try {
      const { data, error } = await this._client
        .from(this._tableNames.providers)
        .select('provider_id')
        .eq('provider_id', id.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return false;
        }
        throw RepositoryError.queryFailed(`Failed to check provider: ${error.message}`, error);
      }

      return data !== null;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed('Failed to check provider existence', err as Error);
    }
  }

  /**
   * Updates an existing integration provider.
   */
  async updateProvider(provider: IntegrationProvider): Promise<IntegrationProvider> {
    try {
      const record = provider.toRecord();
      const { data, error } = await this._client
        .from(this._tableNames.providers)
        .update({
          provider_name: record.provider_name,
          status: record.status,
          version: record.version,
          configuration: record.configuration,
          metadata: record.metadata,
          updated_at: record.updated_at,
        })
        .eq('provider_id', record.provider_id)
        .select()
        .single();

      if (error) {
        throw RepositoryError.queryFailed(`Failed to update provider: ${error.message}`, error);
      }

      return this.mapRowToProvider(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed('Failed to update provider', err as Error);
    }
  }

  /**
   * Deletes an integration provider.
   */
  async deleteProvider(id: ProviderId): Promise<void> {
    try {
      const { error } = await this._client
        .from(this._tableNames.providers)
        .delete()
        .eq('provider_id', id.value);

      if (error) {
        throw RepositoryError.queryFailed(`Failed to delete provider: ${error.message}`, error);
      }
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed('Failed to delete provider', err as Error);
    }
  }

  /**
   * Lists integration providers with pagination.
   */
  async listProviders(
    params: PaginationParams,
    filters?: ProviderFilterParams
  ): Promise<PaginatedResult<IntegrationProvider>> {
    try {
      const { page, pageSize, sortBy = 'created_at', sortOrder = 'desc' } = params;
      const offset = (page - 1) * pageSize;

      let query = this._client
        .from(this._tableNames.providers)
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters?.type) {
        query = query.eq('provider_type', filters.type);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.createdAfter) {
        query = query.gte('created_at', filters.createdAfter.toISOString());
      }
      if (filters?.createdBefore) {
        query = query.lte('created_at', filters.createdBefore.toISOString());
      }

      // Apply sorting and pagination
      query = query
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(offset, offset + pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        throw RepositoryError.queryFailed(`Failed to list providers: ${error.message}`, error);
      }

      const providers = (data || []).map((row) => this.mapRowToProvider(row as Record<string, unknown>));
      const total = count || 0;
      const pagination = this.calculatePagination(total, page, pageSize);

      return {
        items: providers,
        total,
        page,
        pageSize,
        ...pagination,
      };
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed('Failed to list providers', err as Error);
    }
  }

  /**
   * Counts integration providers.
   */
  async countProviders(filters?: ProviderFilterParams): Promise<number> {
    try {
      let query = this._client
        .from(this._tableNames.providers)
        .select('*', { count: 'exact', head: true });

      if (filters?.type) {
        query = query.eq('provider_type', filters.type);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.createdAfter) {
        query = query.gte('created_at', filters.createdAfter.toISOString());
      }
      if (filters?.createdBefore) {
        query = query.lte('created_at', filters.createdBefore.toISOString());
      }

      const { count, error } = await query;

      if (error) {
        throw RepositoryError.queryFailed(`Failed to count providers: ${error.message}`, error);
      }

      return count || 0;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed('Failed to count providers', err as Error);
    }
  }

  // ============ Integration Request Operations ============

  /**
   * Creates a new integration request.
   */
  async createRequest(request: IntegrationRequest): Promise<IntegrationRequest> {
    try {
      const record = request.toRecord();
      const { data, error } = await this._client
        .from(this._tableNames.requests)
        .insert(record)
        .select()
        .single();

      if (error) {
        throw RepositoryError.queryFailed(`Failed to create request: ${error.message}`, error);
      }

      return this.mapRowToRequest(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed('Failed to create request', err as Error);
    }
  }

  /**
   * Finds an integration request by ID.
   */
  async findRequestById(id: RequestId): Promise<IntegrationRequest | null> {
    try {
      const { data, error } = await this._client
        .from(this._tableNames.requests)
        .select('*')
        .eq('request_id', id.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw RepositoryError.queryFailed(`Failed to find request: ${error.message}`, error);
      }

      return this.mapRowToRequest(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed('Failed to find request by ID', err as Error);
    }
  }

  /**
   * Updates an existing integration request.
   */
  async updateRequest(request: IntegrationRequest): Promise<IntegrationRequest> {
    try {
      const record = request.toRecord();
      const { data, error } = await this._client
        .from(this._tableNames.requests)
        .update({
          provider_id: record.provider_id,
          request_type: record.request_type,
          payload: record.payload,
          metadata: record.metadata,
        })
        .eq('request_id', record.request_id)
        .select()
        .single();

      if (error) {
        throw RepositoryError.queryFailed(`Failed to update request: ${error.message}`, error);
      }

      return this.mapRowToRequest(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed('Failed to update request', err as Error);
    }
  }

  /**
   * Deletes an integration request.
   */
  async deleteRequest(id: RequestId): Promise<void> {
    try {
      const { error } = await this._client
        .from(this._tableNames.requests)
        .delete()
        .eq('request_id', id.value);

      if (error) {
        throw RepositoryError.queryFailed(`Failed to delete request: ${error.message}`, error);
      }
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed('Failed to delete request', err as Error);
    }
  }

  /**
   * Lists integration requests with pagination.
   */
  async listRequests(
    params: PaginationParams,
    filters?: RequestFilterParams
  ): Promise<PaginatedResult<IntegrationRequest>> {
    try {
      const { page, pageSize, sortBy = 'created_at', sortOrder = 'desc' } = params;
      const offset = (page - 1) * pageSize;

      let query = this._client
        .from(this._tableNames.requests)
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters?.providerId) {
        query = query.eq('provider_id', filters.providerId.value);
      }
      if (filters?.requestType) {
        query = query.eq('request_type', filters.requestType);
      }
      if (filters?.createdAfter) {
        query = query.gte('created_at', filters.createdAfter.toISOString());
      }
      if (filters?.createdBefore) {
        query = query.lte('created_at', filters.createdBefore.toISOString());
      }

      // Apply sorting and pagination
      query = query
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(offset, offset + pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        throw RepositoryError.queryFailed(`Failed to list requests: ${error.message}`, error);
      }

      const requests = (data || []).map((row) => this.mapRowToRequest(row as Record<string, unknown>));
      const total = count || 0;
      const pagination = this.calculatePagination(total, page, pageSize);

      return {
        items: requests,
        total,
        page,
        pageSize,
        ...pagination,
      };
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed('Failed to list requests', err as Error);
    }
  }

  /**
   * Counts integration requests.
   */
  async countRequests(filters?: RequestFilterParams): Promise<number> {
    try {
      let query = this._client
        .from(this._tableNames.requests)
        .select('*', { count: 'exact', head: true });

      if (filters?.providerId) {
        query = query.eq('provider_id', filters.providerId.value);
      }
      if (filters?.requestType) {
        query = query.eq('request_type', filters.requestType);
      }
      if (filters?.createdAfter) {
        query = query.gte('created_at', filters.createdAfter.toISOString());
      }
      if (filters?.createdBefore) {
        query = query.lte('created_at', filters.createdBefore.toISOString());
      }

      const { count, error } = await query;

      if (error) {
        throw RepositoryError.queryFailed(`Failed to count requests: ${error.message}`, error);
      }

      return count || 0;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed('Failed to count requests', err as Error);
    }
  }

  // ============ Integration Response Operations ============

  /**
   * Creates a new integration response.
   */
  async createResponse(response: IntegrationResponse): Promise<IntegrationResponse> {
    try {
      const record = response.toRecord();
      const { data, error } = await this._client
        .from(this._tableNames.responses)
        .insert(record)
        .select()
        .single();

      if (error) {
        throw RepositoryError.queryFailed(`Failed to create response: ${error.message}`, error);
      }

      return this.mapRowToResponse(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed('Failed to create response', err as Error);
    }
  }

  /**
   * Finds an integration response by ID.
   */
  async findResponseById(id: ResponseId): Promise<IntegrationResponse | null> {
    try {
      const { data, error } = await this._client
        .from(this._tableNames.responses)
        .select('*')
        .eq('response_id', id.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw RepositoryError.queryFailed(`Failed to find response: ${error.message}`, error);
      }

      return this.mapRowToResponse(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed('Failed to find response by ID', err as Error);
    }
  }

  /**
   * Finds an integration response by request ID.
   */
  async findResponseByRequestId(requestId: RequestId): Promise<IntegrationResponse | null> {
    try {
      const { data, error } = await this._client
        .from(this._tableNames.responses)
        .select('*')
        .eq('request_id', requestId.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw RepositoryError.queryFailed(`Failed to find response: ${error.message}`, error);
      }

      return this.mapRowToResponse(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed('Failed to find response by request ID', err as Error);
    }
  }

  /**
   * Updates an existing integration response.
   */
  async updateResponse(response: IntegrationResponse): Promise<IntegrationResponse> {
    try {
      const record = response.toRecord();
      const { data, error } = await this._client
        .from(this._tableNames.responses)
        .update({
          status: record.status,
          response_code: record.response_code,
          payload: record.payload,
          metadata: record.metadata,
        })
        .eq('response_id', record.response_id)
        .select()
        .single();

      if (error) {
        throw RepositoryError.queryFailed(`Failed to update response: ${error.message}`, error);
      }

      return this.mapRowToResponse(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed('Failed to update response', err as Error);
    }
  }

  /**
   * Deletes an integration response.
   */
  async deleteResponse(id: ResponseId): Promise<void> {
    try {
      const { error } = await this._client
        .from(this._tableNames.responses)
        .delete()
        .eq('response_id', id.value);

      if (error) {
        throw RepositoryError.queryFailed(`Failed to delete response: ${error.message}`, error);
      }
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed('Failed to delete response', err as Error);
    }
  }

  /**
   * Lists integration responses with pagination.
   */
  async listResponses(
    params: PaginationParams,
    filters?: ResponseFilterParams
  ): Promise<PaginatedResult<IntegrationResponse>> {
    try {
      const { page, pageSize, sortBy = 'received_at', sortOrder = 'desc' } = params;
      const offset = (page - 1) * pageSize;

      let query = this._client
        .from(this._tableNames.responses)
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters?.requestId) {
        query = query.eq('request_id', filters.requestId.value);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.responseCodeRange) {
        switch (filters.responseCodeRange) {
          case '2xx':
            query = query.gte('response_code', 200).lte('response_code', 299);
            break;
          case '3xx':
            query = query.gte('response_code', 300).lte('response_code', 399);
            break;
          case '4xx':
            query = query.gte('response_code', 400).lte('response_code', 499);
            break;
          case '5xx':
            query = query.gte('response_code', 500).lte('response_code', 599);
            break;
        }
      }
      if (filters?.receivedAfter) {
        query = query.gte('received_at', filters.receivedAfter.toISOString());
      }
      if (filters?.receivedBefore) {
        query = query.lte('received_at', filters.receivedBefore.toISOString());
      }

      // Apply sorting and pagination
      query = query
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(offset, offset + pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        throw RepositoryError.queryFailed(`Failed to list responses: ${error.message}`, error);
      }

      const responses = (data || []).map((row) => this.mapRowToResponse(row as Record<string, unknown>));
      const total = count || 0;
      const pagination = this.calculatePagination(total, page, pageSize);

      return {
        items: responses,
        total,
        page,
        pageSize,
        ...pagination,
      };
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed('Failed to list responses', err as Error);
    }
  }

  /**
   * Counts integration responses.
   */
  async countResponses(filters?: ResponseFilterParams): Promise<number> {
    try {
      let query = this._client
        .from(this._tableNames.responses)
        .select('*', { count: 'exact', head: true });

      if (filters?.requestId) {
        query = query.eq('request_id', filters.requestId.value);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.responseCodeRange) {
        switch (filters.responseCodeRange) {
          case '2xx':
            query = query.gte('response_code', 200).lte('response_code', 299);
            break;
          case '3xx':
            query = query.gte('response_code', 300).lte('response_code', 399);
            break;
          case '4xx':
            query = query.gte('response_code', 400).lte('response_code', 499);
            break;
          case '5xx':
            query = query.gte('response_code', 500).lte('response_code', 599);
            break;
        }
      }
      if (filters?.receivedAfter) {
        query = query.gte('received_at', filters.receivedAfter.toISOString());
      }
      if (filters?.receivedBefore) {
        query = query.lte('received_at', filters.receivedBefore.toISOString());
      }

      const { count, error } = await query;

      if (error) {
        throw RepositoryError.queryFailed(`Failed to count responses: ${error.message}`, error);
      }

      return count || 0;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      throw RepositoryError.queryFailed('Failed to count responses', err as Error);
    }
  }
}
