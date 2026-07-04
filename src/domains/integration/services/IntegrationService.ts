/**
 * Integration Service
 *
 * Main service for managing integration operations.
 * Orchestrates providers, requests, and responses.
 *
 * IMPORTANT: Integration Service is a COORDINATION layer. It ONLY:
 * - Registers and manages providers
 * - Creates and tracks requests
 * - Stores responses
 * - Applies business rules for integration management
 *
 * Integration Service MUST NEVER:
 * - Execute HTTP requests directly (use Gateway)
 * - Handle retries (use Retry Engine)
 * - Implement circuit breakers (use Circuit Breaker)
 * - Implement rate limiting (use Rate Limiter)
 * - Modify gameplay
 * - Grant rewards
 * - Modify balances
 * - Modify inventory
 * - Execute business logic
 */

import type { IIntegrationRepository } from '../interfaces/IIntegrationRepository';
import { IntegrationProvider } from '../entities/IntegrationProvider';
import { IntegrationRequest } from '../entities/IntegrationRequest';
import { IntegrationResponse } from '../entities/IntegrationResponse';
import { ProviderId } from '../value-objects/ProviderId';
import { RequestId } from '../value-objects/RequestId';
import { ResponseId } from '../value-objects/ResponseId';
import type { PaginationParams } from '../../../shared/types/base.types';
import type { ProviderFilterParams, RequestFilterParams, ResponseFilterParams } from '../interfaces/IIntegrationRepository';
import type { IntegrationStatistics } from '../types/IntegrationStatistics';
import type { CreateIntegrationProviderDto, UpdateIntegrationProviderDto } from '../dto/IntegrationProvider.dto';
import type { CreateIntegrationRequestDto } from '../dto/IntegrationRequest.dto';
import type { CreateIntegrationResponseDto } from '../dto/IntegrationResponse.dto';
import type {
  IntegrationProviderResponseDto,
  IntegrationProviderSummaryDto,
  IntegrationProviderListResponseDto,
} from '../dto/IntegrationProvider.dto';
import type {
  IntegrationRequestResponseDto,
  IntegrationRequestListResponseDto,
} from '../dto/IntegrationRequest.dto';
import type {
  IntegrationResponseResponseDto,
  IntegrationResponseListResponseDto,
  IntegrationResponseWrapperDto,
} from '../dto/IntegrationResponse.dto';
import { IntegrationMapper } from '../mappers/IntegrationMapper';
import { IntegrationValidator } from '../validators/IntegrationValidator';
import { createLogger } from '../../../core/logging/logger.service';
import type { ILogger } from '../../../shared/types/interfaces';
import { createIntegrationRegisteredEvent } from '../events/IntegrationRegistered.event';
import { createIntegrationRequestCreatedEvent } from '../events/IntegrationRequestCreated.event';
import { createIntegrationResponseReceivedEvent } from '../events/IntegrationResponseReceived.event';
import { createIntegrationDisabledEvent } from '../events/IntegrationDisabled.event';
import type { IEventPublisher } from '../../../core/events/interfaces/IEventPublisher';
import type { IntegrationStatus } from '../types/IntegrationStatus';
import type { RequestStatus } from '../types/RequestStatus';
import type { IntegrationProviderMetadata, IntegrationRequestMetadata, IntegrationResponseMetadata } from '../types/IntegrationMetadata';

/**
 * Integration Service configuration.
 */
export interface IntegrationServiceConfig {
  /** Maximum providers allowed per type */
  maxProvidersPerType?: number;
  /** Default pagination page size */
  defaultPageSize?: number;
  /** Maximum pagination page size */
  maxPageSize?: number;
}

/**
 * Integration Service.
 * Main orchestration service for integration management.
 */
export class IntegrationService {
  private readonly logger: ILogger;
  private readonly repository: IIntegrationRepository;
  private readonly eventPublisher: IEventPublisher | null;
  private readonly config: Required<IntegrationServiceConfig>;

  /**
   * Creates a new IntegrationService instance.
   */
  constructor(
    repository: IIntegrationRepository,
    eventPublisher?: IEventPublisher,
    config?: IntegrationServiceConfig
  ) {
    this.logger = createLogger('IntegrationService');
    this.repository = repository;
    this.eventPublisher = eventPublisher || null;
    this.config = {
      maxProvidersPerType: config?.maxProvidersPerType ?? 10,
      defaultPageSize: config?.defaultPageSize ?? 20,
      maxPageSize: config?.maxPageSize ?? 100,
    };
  }

  // ============ Provider Operations ============

  /**
   * Registers a new integration provider.
   */
  async registerProvider(dto: CreateIntegrationProviderDto): Promise<IntegrationProviderResponseDto> {
    this.logger.info('Registering new integration provider', { name: dto.providerName, type: dto.providerType });

    // Validate DTO
    IntegrationValidator.validateCreateProviderOrThrow(dto);

    // Check for duplicate name
    const existing = await this.repository.findProviderByName(dto.providerName);
    if (existing) {
      throw new Error(`Provider with name '${dto.providerName}' already exists`);
    }

    // Create provider entity
    const provider = IntegrationProvider.create({
      providerName: dto.providerName,
      providerType: dto.providerType,
      status: dto.status ?? 'pending',
      version: dto.version ?? '1.0.0',
      configuration: dto.configuration ?? {},
      metadata: this.buildProviderMetadata(dto.metadata),
    });

    // Persist provider
    const created = await this.repository.createProvider(provider);

    // Publish event
    await this.publishIntegrationRegisteredEvent(created);

    this.logger.info('Integration provider registered', { providerId: created.providerId.value });
    return IntegrationMapper.providerToResponse(created);
  }

  /**
   * Enables an integration provider.
   */
  async enableProvider(providerId: ProviderId): Promise<IntegrationProviderResponseDto> {
    this.logger.info('Enabling integration provider', { providerId: providerId.value });

    const provider = await this.repository.findProviderById(providerId);
    if (!provider) {
      throw new Error(`Provider not found: ${providerId.value}`);
    }

    if (provider.status === 'active') {
      return IntegrationMapper.providerToResponse(provider);
    }

    const updated = provider.copyWith({ status: 'active' });
    const saved = await this.repository.updateProvider(updated);

    this.logger.info('Integration provider enabled', { providerId: providerId.value });
    return IntegrationMapper.providerToResponse(saved);
  }

  /**
   * Disables an integration provider.
   */
  async disableProvider(providerId: ProviderId, reason?: string): Promise<IntegrationProviderResponseDto> {
    this.logger.info('Disabling integration provider', { providerId: providerId.value, reason });

    const provider = await this.repository.findProviderById(providerId);
    if (!provider) {
      throw new Error(`Provider not found: ${providerId.value}`);
    }

    if (provider.status === 'inactive') {
      return IntegrationMapper.providerToResponse(provider);
    }

    const updated = provider.copyWith({ status: 'inactive' });
    const saved = await this.repository.updateProvider(updated);

    // Publish event
    await this.publishIntegrationDisabledEvent(saved, reason);

    this.logger.info('Integration provider disabled', { providerId: providerId.value });
    return IntegrationMapper.providerToResponse(saved);
  }

  /**
   * Updates an integration provider.
   */
  async updateProvider(
    providerId: ProviderId,
    dto: UpdateIntegrationProviderDto
  ): Promise<IntegrationProviderResponseDto> {
    this.logger.info('Updating integration provider', { providerId: providerId.value });

    // Validate DTO
    IntegrationValidator.validateUpdateProviderOrThrow(dto);

    const provider = await this.repository.findProviderById(providerId);
    if (!provider) {
      throw new Error(`Provider not found: ${providerId.value}`);
    }

    // Validate status transition
    if (dto.status && dto.status !== provider.status) {
      const validation = IntegrationValidator.validateProviderStatusTransition(provider.status, dto.status);
      if (!validation.isValid) {
        throw new Error(`Invalid status transition: ${validation.errors.map((e) => e.message).join(', ')}`);
      }
    }

    const updated = provider.copyWith({
      providerName: dto.providerName,
      status: dto.status,
      version: dto.version,
      configuration: dto.configuration,
      metadata: dto.metadata ? { ...provider.metadata, ...dto.metadata } : provider.metadata,
    });

    const saved = await this.repository.updateProvider(updated);

    this.logger.info('Integration provider updated', { providerId: providerId.value });
    return IntegrationMapper.providerToResponse(saved);
  }

  /**
   * Gets a provider by ID.
   */
  async getProvider(providerId: ProviderId): Promise<IntegrationProviderResponseDto | null> {
    const provider = await this.repository.findProviderById(providerId);
    if (!provider) {
      return null;
    }
    return IntegrationMapper.providerToResponse(provider);
  }

  /**
   * Lists providers with pagination.
   */
  async listProviders(
    params: PaginationParams,
    filters?: ProviderFilterParams
  ): Promise<IntegrationProviderListResponseDto> {
    const pageSize = Math.min(params.pageSize || this.config.defaultPageSize, this.config.maxPageSize);
    const paginatedParams = { ...params, pageSize };

    const result = await this.repository.listProviders(paginatedParams, filters);
    return IntegrationMapper.providerToListResponse(result.items, result.total, result.page, result.pageSize);
  }

  /**
   * Gets provider summary by ID.
   */
  async getProviderById(providerId: ProviderId): Promise<IntegrationProviderSummaryDto | null> {
    const provider = await this.repository.findProviderById(providerId);
    if (!provider) {
      return null;
    }
    return IntegrationMapper.providerToSummary(provider);
  }

  /**
   * Deletes a provider.
   */
  async deleteProvider(providerId: ProviderId): Promise<void> {
    this.logger.info('Deleting integration provider', { providerId: providerId.value });

    const exists = await this.repository.providerExists(providerId);
    if (!exists) {
      throw new Error(`Provider not found: ${providerId.value}`);
    }

    await this.repository.deleteProvider(providerId);
    this.logger.info('Integration provider deleted', { providerId: providerId.value });
  }

  // ============ Request Operations ============

  /**
   * Creates a new integration request.
   */
  async createRequest(dto: CreateIntegrationRequestDto): Promise<IntegrationRequestResponseDto> {
    this.logger.debug('Creating integration request', { providerId: dto.providerId, type: dto.requestType });

    // Validate DTO
    IntegrationValidator.validateCreateRequestOrThrow(dto);

    // Verify provider exists and is active
    const provider = await this.repository.findProviderById(new ProviderId(dto.providerId));
    if (!provider) {
      throw new Error(`Provider not found: ${dto.providerId}`);
    }
    if (!provider.canHandleRequests()) {
      throw new Error(`Provider '${provider.providerName}' is not active and cannot handle requests`);
    }

    // Create request entity
    const request = IntegrationRequest.create({
      providerId: new ProviderId(dto.providerId),
      requestType: dto.requestType,
      payload: dto.payload ?? {},
      metadata: this.buildRequestMetadata(dto.metadata),
    });

    // Persist request
    const created = await this.repository.createRequest(request);

    // Publish event
    await this.publishIntegrationRequestCreatedEvent(created);

    this.logger.debug('Integration request created', { requestId: created.requestId.value });
    return IntegrationMapper.requestToResponse(created);
  }

  /**
   * Gets a request by ID.
   */
  async getRequest(requestId: RequestId): Promise<IntegrationRequestResponseDto | null> {
    const request = await this.repository.findRequestById(requestId);
    if (!request) {
      return null;
    }
    return IntegrationMapper.requestToResponse(request);
  }

  /**
   * Lists requests with pagination.
   */
  async listRequests(
    params: PaginationParams,
    filters?: RequestFilterParams
  ): Promise<IntegrationRequestListResponseDto> {
    const pageSize = Math.min(params.pageSize || this.config.defaultPageSize, this.config.maxPageSize);
    const paginatedParams = { ...params, pageSize };

    const result = await this.repository.listRequests(paginatedParams, filters);
    return IntegrationMapper.requestToListResponse(result.items, result.total, result.page, result.pageSize);
  }

  /**
   * Deletes a request.
   */
  async deleteRequest(requestId: RequestId): Promise<void> {
    this.logger.debug('Deleting integration request', { requestId: requestId.value });

    const request = await this.repository.findRequestById(requestId);
    if (!request) {
      throw new Error(`Request not found: ${requestId.value}`);
    }

    await this.repository.deleteRequest(requestId);
    this.logger.debug('Integration request deleted', { requestId: requestId.value });
  }

  // ============ Response Operations ============

  /**
   * Receives and stores a response for a request.
   */
  async receiveResponse(dto: CreateIntegrationResponseDto): Promise<IntegrationResponseResponseDto> {
    this.logger.debug('Receiving integration response', { requestId: dto.requestId });

    // Validate DTO
    IntegrationValidator.validateCreateResponseOrThrow(dto);

    // Verify request exists
    const request = await this.repository.findRequestById(new RequestId(dto.requestId));
    if (!request) {
      throw new Error(`Request not found: ${dto.requestId}`);
    }

    // Check if response already exists
    const existingResponse = await this.repository.findResponseByRequestId(new RequestId(dto.requestId));
    if (existingResponse) {
      throw new Error(`Response already exists for request: ${dto.requestId}`);
    }

    // Create response entity
    const response = IntegrationResponse.create({
      requestId: new RequestId(dto.requestId),
      status: dto.status ?? this.determineResponseStatus(dto.responseCode),
      responseCode: dto.responseCode ?? 200,
      payload: dto.payload ?? {},
      metadata: this.buildResponseMetadata(dto.metadata),
    });

    // Persist response
    const created = await this.repository.createResponse(response);

    // Publish event
    await this.publishIntegrationResponseReceivedEvent(created, request);

    this.logger.debug('Integration response received', { responseId: created.responseId.value });
    return IntegrationMapper.responseToResponse(created);
  }

  /**
   * Gets a response by ID.
   */
  async getResponse(responseId: ResponseId): Promise<IntegrationResponseResponseDto | null> {
    const response = await this.repository.findResponseById(responseId);
    if (!response) {
      return null;
    }
    return IntegrationMapper.responseToResponse(response);
  }

  /**
   * Gets response for a specific request.
   */
  async getResponseForRequest(requestId: RequestId): Promise<IntegrationResponseResponseDto | null> {
    const response = await this.repository.findResponseByRequestId(requestId);
    if (!response) {
      return null;
    }
    return IntegrationMapper.responseToResponse(response);
  }

  /**
   * Gets request-response pair as wrapper DTO.
   */
  async getRequestResponsePair(requestId: RequestId): Promise<IntegrationResponseWrapperDto | null> {
    const request = await this.repository.findRequestById(requestId);
    if (!request) {
      return null;
    }

    const response = await this.repository.findResponseByRequestId(requestId);
    return IntegrationMapper.responseToWrapperDto(request, response);
  }

  /**
   * Lists responses with pagination.
   */
  async listResponses(
    params: PaginationParams,
    filters?: ResponseFilterParams
  ): Promise<IntegrationResponseListResponseDto> {
    const pageSize = Math.min(params.pageSize || this.config.defaultPageSize, this.config.maxPageSize);
    const paginatedParams = { ...params, pageSize };

    const result = await this.repository.listResponses(paginatedParams, filters);
    return IntegrationMapper.responseToListResponse(result.items, result.total, result.page, result.pageSize);
  }

  // ============ Summary & Statistics ============

  /**
   * Gets provider summary statistics.
   */
  async getProviderStatistics(providerId: ProviderId): Promise<{
    provider: IntegrationProviderSummaryDto;
    requestCount: number;
    successRate: number;
  } | null> {
    const provider = await this.repository.findProviderById(providerId);
    if (!provider) {
      return null;
    }

    const requestCount = await this.repository.countRequests({ providerId });
    const responsesResult = await this.repository.listResponses(
      { page: 1, pageSize: 100 },
      { requestId: undefined }
    );

    let successCount = 0;
    for (const response of responsesResult.items) {
      if (response.isSuccess()) {
        successCount++;
      }
    }

    const successRate = requestCount > 0 ? successCount / requestCount : 0;

    return {
      provider: IntegrationMapper.providerToSummary(provider),
      requestCount,
      successRate,
    };
  }

  /**
   * Gets integration summary statistics.
   */
  async getIntegrationSummary(): Promise<IntegrationStatistics> {
    const [providerCount, requestCount, responseCount] = await Promise.all([
      this.repository.countProviders(),
      this.repository.countRequests(),
      this.repository.countResponses(),
    ]);

    const activeProviders = await this.repository.countProviders({ status: 'active' });
    const failedResponses = await this.repository.countResponses({ status: 'failed' });

    return {
      totalProviders: providerCount,
      activeProviders,
      totalRequests: requestCount,
      totalResponses: responseCount,
      failedRequests: failedResponses,
      successRate: responseCount > 0 ? (responseCount - failedResponses) / responseCount : 0,
      averageResponseTimeMs: 0,
      lastUpdatedAt: new Date(),
    };
  }

  // ============ Helper Methods ============

  /**
   * Builds provider metadata from DTO.
   */
  private buildProviderMetadata(partial?: Partial<IntegrationProviderMetadata>): IntegrationProviderMetadata {
    return {
      ...partial,
      createdAt: undefined,
      updatedAt: undefined,
    } as IntegrationProviderMetadata;
  }

  /**
   * Builds request metadata from DTO.
   */
  private buildRequestMetadata(partial?: Partial<IntegrationRequestMetadata>): IntegrationRequestMetadata {
    return {
      ...partial,
    } as IntegrationRequestMetadata;
  }

  /**
   * Builds response metadata from DTO.
   */
  private buildResponseMetadata(partial?: Partial<IntegrationResponseMetadata>): IntegrationResponseMetadata {
    return {
      ...partial,
    } as IntegrationResponseMetadata;
  }

  /**
   * Determines response status based on HTTP code.
   */
  private determineResponseStatus(code?: number): RequestStatus {
    if (!code) {
      return 'completed';
    }
    if (code >= 200 && code < 300) {
      return 'completed';
    }
    if (code >= 400 && code < 500) {
      return 'failed';
    }
    if (code >= 500) {
      return 'failed';
    }
    return 'completed';
  }

  /**
   * Publishes integration registered event.
   */
  private async publishIntegrationRegisteredEvent(provider: IntegrationProvider): Promise<void> {
    if (!this.eventPublisher) {
      return;
    }

    try {
      const event = createIntegrationRegisteredEvent({
        providerId: provider.providerId,
        providerName: provider.providerName,
        providerType: provider.providerType,
        status: provider.status,
      });
      await this.eventPublisher.publish(event);
    } catch (err) {
      this.logger.warn('Failed to publish IntegrationRegistered event', { error: err });
    }
  }

  /**
   * Publishes integration request created event.
   */
  private async publishIntegrationRequestCreatedEvent(request: IntegrationRequest): Promise<void> {
    if (!this.eventPublisher) {
      return;
    }

    try {
      const event = createIntegrationRequestCreatedEvent({
        requestId: request.requestId,
        providerId: request.providerId,
        requestType: request.requestType,
      });
      await this.eventPublisher.publish(event);
    } catch (err) {
      this.logger.warn('Failed to publish IntegrationRequestCreated event', { error: err });
    }
  }

  /**
   * Publishes integration response received event.
   */
  private async publishIntegrationResponseReceivedEvent(
    response: IntegrationResponse,
    request: IntegrationRequest
  ): Promise<void> {
    if (!this.eventPublisher) {
      return;
    }

    try {
      const event = createIntegrationResponseReceivedEvent({
        responseId: response.responseId,
        requestId: response.requestId,
        status: response.status,
        responseCode: response.responseCode,
      });
      await this.eventPublisher.publish(event);
    } catch (err) {
      this.logger.warn('Failed to publish IntegrationResponseReceived event', { error: err });
    }
  }

  /**
   * Publishes integration disabled event.
   */
  private async publishIntegrationDisabledEvent(provider: IntegrationProvider, reason?: string): Promise<void> {
    if (!this.eventPublisher) {
      return;
    }

    try {
      const event = createIntegrationDisabledEvent({
        providerId: provider.providerId,
        previousStatus: provider.status,
        newStatus: 'inactive',
        reason: reason,
      });
      await this.eventPublisher.publish(event);
    } catch (err) {
      this.logger.warn('Failed to publish IntegrationDisabled event', { error: err });
    }
  }
}
