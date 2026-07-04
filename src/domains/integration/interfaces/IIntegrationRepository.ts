/**
 * Integration Repository Interface
 *
 * Contract for Integration data access operations.
 * This interface defines all allowed operations on Integration storage.
 *
 * Responsibilities:
 * - Define data access contract for Integration entities
 * - Return strongly typed domain objects
 * - Support pagination for list operations
 * - Handle soft delete semantics
 *
 * This interface does NOT:
 * - Contain any implementation
 * - Contain SQL queries
 * - Contain Supabase types
 * - Contain infrastructure code
 * - Execute HTTP requests
 * - Handle retries or circuit breakers
 */

import type { IntegrationProvider } from '../entities/IntegrationProvider';
import type { IntegrationRequest } from '../entities/IntegrationRequest';
import type { IntegrationResponse } from '../entities/IntegrationResponse';
import type { ProviderId } from '../value-objects/ProviderId';
import type { RequestId } from '../value-objects/RequestId';
import type { ResponseId } from '../value-objects/ResponseId';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import type { RepositoryError } from '../../../shared/errors/repository.error';
import type { IntegrationType } from '../types/IntegrationType';
import type { IntegrationStatus } from '../types/IntegrationStatus';
import type { RequestStatus } from '../types/RequestStatus';

/**
 * Filter parameters for listing integration providers.
 */
export interface ProviderFilterParams {
  /** Filter by integration type */
  type?: IntegrationType;
  /** Filter by status */
  status?: IntegrationStatus;
  /** Filter providers created after this date */
  createdAfter?: Date;
  /** Filter providers created before this date */
  createdBefore?: Date;
}

/**
 * Filter parameters for listing integration requests.
 */
export interface RequestFilterParams {
  /** Filter by provider ID */
  providerId?: ProviderId;
  /** Filter by request type */
  requestType?: string;
  /** Filter requests created after this date */
  createdAfter?: Date;
  /** Filter requests created before this date */
  createdBefore?: Date;
}

/**
 * Filter parameters for listing integration responses.
 */
export interface ResponseFilterParams {
  /** Filter by request ID */
  requestId?: RequestId;
  /** Filter by response status */
  status?: RequestStatus;
  /** Filter by response code range */
  responseCodeRange?: '2xx' | '3xx' | '4xx' | '5xx';
  /** Filter responses received after this date */
  receivedAfter?: Date;
  /** Filter responses received before this date */
  receivedBefore?: Date;
}

/**
 * Integration repository interface.
 * Defines the contract for all Integration persistence operations.
 */
export interface IIntegrationRepository {
  // ============ Integration Provider Operations ============

  /**
   * Creates a new integration provider.
   * @param provider The integration provider entity to create
   * @returns The created integration provider with generated ID
   * @throws RepositoryError if creation fails
   */
  createProvider(provider: IntegrationProvider): Promise<IntegrationProvider>;

  /**
   * Finds an integration provider by their internal ID.
   * @param id The provider ID to find
   * @returns The integration provider if found, null otherwise
   * @throws RepositoryError if query fails
   */
  findProviderById(id: ProviderId): Promise<IntegrationProvider | null>;

  /**
   * Finds an integration provider by name.
   * @param name The provider name to find
   * @returns The integration provider if found, null otherwise
   * @throws RepositoryError if query fails
   */
  findProviderByName(name: string): Promise<IntegrationProvider | null>;

  /**
   * Checks if a provider exists by ID.
   * @param id The provider ID to check
   * @returns True if provider exists, false otherwise
   * @throws RepositoryError if query fails
   */
  providerExists(id: ProviderId): Promise<boolean>;

  /**
   * Updates an existing integration provider.
   * @param provider The integration provider entity with updated data
   * @returns The updated integration provider
   * @throws RepositoryError if update fails
   */
  updateProvider(provider: IntegrationProvider): Promise<IntegrationProvider>;

  /**
   * Deletes an integration provider.
   * @param id The provider ID to delete
   * @throws RepositoryError if deletion fails
   */
  deleteProvider(id: ProviderId): Promise<void>;

  /**
   * Lists integration providers with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of integration providers
   * @throws RepositoryError if query fails
   */
  listProviders(
    params: PaginationParams,
    filters?: ProviderFilterParams
  ): Promise<PaginatedResult<IntegrationProvider>>;

  /**
   * Counts total integration providers with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching integration providers
   * @throws RepositoryError if count fails
   */
  countProviders(filters?: ProviderFilterParams): Promise<number>;

  // ============ Integration Request Operations ============

  /**
   * Creates a new integration request.
   * @param request The integration request entity to create
   * @returns The created integration request with generated ID
   * @throws RepositoryError if creation fails
   */
  createRequest(request: IntegrationRequest): Promise<IntegrationRequest>;

  /**
   * Finds an integration request by its internal ID.
   * @param id The request ID to find
   * @returns The integration request if found, null otherwise
   * @throws RepositoryError if query fails
   */
  findRequestById(id: RequestId): Promise<IntegrationRequest | null>;

  /**
   * Updates an existing integration request.
   * @param request The integration request entity with updated data
   * @returns The updated integration request
   * @throws RepositoryError if update fails
   */
  updateRequest(request: IntegrationRequest): Promise<IntegrationRequest>;

  /**
   * Deletes an integration request.
   * @param id The request ID to delete
   * @throws RepositoryError if deletion fails
   */
  deleteRequest(id: RequestId): Promise<void>;

  /**
   * Lists integration requests with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of integration requests
   * @throws RepositoryError if query fails
   */
  listRequests(
    params: PaginationParams,
    filters?: RequestFilterParams
  ): Promise<PaginatedResult<IntegrationRequest>>;

  /**
   * Counts total integration requests with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching integration requests
   * @throws RepositoryError if count fails
   */
  countRequests(filters?: RequestFilterParams): Promise<number>;

  // ============ Integration Response Operations ============

  /**
   * Creates a new integration response.
   * @param response The integration response entity to create
   * @returns The created integration response with generated ID
   * @throws RepositoryError if creation fails
   */
  createResponse(response: IntegrationResponse): Promise<IntegrationResponse>;

  /**
   * Finds an integration response by its internal ID.
   * @param id The response ID to find
   * @returns The integration response if found, null otherwise
   * @throws RepositoryError if query fails
   */
  findResponseById(id: ResponseId): Promise<IntegrationResponse | null>;

  /**
   * Finds an integration response by request ID.
   * @param requestId The request ID to find response for
   * @returns The integration response if found, null otherwise
   * @throws RepositoryError if query fails
   */
  findResponseByRequestId(requestId: RequestId): Promise<IntegrationResponse | null>;

  /**
   * Updates an existing integration response.
   * @param response The integration response entity with updated data
   * @returns The updated integration response
   * @throws RepositoryError if update fails
   */
  updateResponse(response: IntegrationResponse): Promise<IntegrationResponse>;

  /**
   * Deletes an integration response.
   * @param id The response ID to delete
   * @throws RepositoryError if deletion fails
   */
  deleteResponse(id: ResponseId): Promise<void>;

  /**
   * Lists integration responses with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of integration responses
   * @throws RepositoryError if query fails
   */
  listResponses(
    params: PaginationParams,
    filters?: ResponseFilterParams
  ): Promise<PaginatedResult<IntegrationResponse>>;

  /**
   * Counts total integration responses with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching integration responses
   * @throws RepositoryError if count fails
   */
  countResponses(filters?: ResponseFilterParams): Promise<number>;
}
