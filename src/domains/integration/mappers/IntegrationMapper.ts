/**
 * Integration Mapper
 *
 * Central mapper for all Integration domain entities and DTOs.
 * Provides a unified interface for all mapping operations.
 */

import { ProviderMapper } from './ProviderMapper';
import { RequestMapper } from './RequestMapper';
import { ResponseMapper } from './ResponseMapper';
import type { IntegrationProvider } from '../entities/IntegrationProvider';
import type { IntegrationRequest } from '../entities/IntegrationRequest';
import type { IntegrationResponse } from '../entities/IntegrationResponse';
import type {
  CreateIntegrationProviderDto,
  UpdateIntegrationProviderDto,
  IntegrationProviderResponseDto,
  IntegrationProviderSummaryDto,
  IntegrationProviderListResponseDto,
} from '../dto/IntegrationProvider.dto';
import type {
  CreateIntegrationRequestDto,
  IntegrationRequestResponseDto,
  IntegrationRequestSummaryDto,
  IntegrationRequestListResponseDto,
} from '../dto/IntegrationRequest.dto';
import type {
  CreateIntegrationResponseDto,
  IntegrationResponseResponseDto,
  IntegrationResponseSummaryDto,
  IntegrationResponseListResponseDto,
  IntegrationResponseWrapperDto,
} from '../dto/IntegrationResponse.dto';

/**
 * Unified Integration Mapper.
 * Delegates to specialized mappers for each entity type.
 */
export class IntegrationMapper {
  // ============ Provider Mappings ============

  public static providerToResponse(provider: IntegrationProvider): IntegrationProviderResponseDto {
    return ProviderMapper.toResponse(provider);
  }

  public static providerToSummary(provider: IntegrationProvider): IntegrationProviderSummaryDto {
    return ProviderMapper.toSummary(provider);
  }

  public static providersToResponseList(providers: IntegrationProvider[]): IntegrationProviderResponseDto[] {
    return ProviderMapper.toResponseList(providers);
  }

  public static providerFromCreateDto(dto: CreateIntegrationProviderDto): CreateIntegrationProviderDto {
    return ProviderMapper.fromCreateDto(dto);
  }

  public static providerToListResponse(
    providers: IntegrationProvider[],
    total: number,
    page: number,
    pageSize: number
  ): IntegrationProviderListResponseDto {
    return ProviderMapper.toListResponse(providers, total, page, pageSize);
  }

  // ============ Request Mappings ============

  public static requestToResponse(request: IntegrationRequest): IntegrationRequestResponseDto {
    return RequestMapper.toResponse(request);
  }

  public static requestToSummary(request: IntegrationRequest): IntegrationRequestSummaryDto {
    return RequestMapper.toSummary(request);
  }

  public static requestsToResponseList(requests: IntegrationRequest[]): IntegrationRequestResponseDto[] {
    return RequestMapper.toResponseList(requests);
  }

  public static requestFromCreateDto(dto: CreateIntegrationRequestDto): CreateIntegrationRequestDto {
    return RequestMapper.fromCreateDto(dto);
  }

  public static requestToListResponse(
    requests: IntegrationRequest[],
    total: number,
    page: number,
    pageSize: number
  ): IntegrationRequestListResponseDto {
    return RequestMapper.toListResponse(requests, total, page, pageSize);
  }

  // ============ Response Mappings ============

  public static responseToResponse(response: IntegrationResponse): IntegrationResponseResponseDto {
    return ResponseMapper.toResponse(response);
  }

  public static responseToSummary(response: IntegrationResponse): IntegrationResponseSummaryDto {
    return ResponseMapper.toSummary(response);
  }

  public static responsesToResponseList(responses: IntegrationResponse[]): IntegrationResponseResponseDto[] {
    return ResponseMapper.toResponseList(responses);
  }

  public static responseFromCreateDto(dto: CreateIntegrationResponseDto): CreateIntegrationResponseDto {
    return ResponseMapper.fromCreateDto(dto);
  }

  public static responseToListResponse(
    responses: IntegrationResponse[],
    total: number,
    page: number,
    pageSize: number
  ): IntegrationResponseListResponseDto {
    return ResponseMapper.toListResponse(responses, total, page, pageSize);
  }

  public static responseToWrapperDto(
    request: IntegrationRequest,
    response: IntegrationResponse | null
  ): IntegrationResponseWrapperDto {
    return ResponseMapper.toWrapperDto(request, response);
  }
}
