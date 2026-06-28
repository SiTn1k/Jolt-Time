/**
 * RequestMapper
 *
 * Maps between RewardRequest entities and DTOs/records.
 * Only mapping - no reward logic.
 */

import { RewardRequest } from '../entities/RewardRequest';
import type { RewardRequestRecord } from '../entities/RewardRequest';
import type { RewardRequestResponseDto } from '../dto/RewardRequest.dto';

/**
 * RequestMapper class for entity-DTO-record mapping.
 */
export class RequestMapper {
  /**
   * Converts a RewardRequest entity to a response DTO.
   */
  public toResponseDto(request: RewardRequest): RewardRequestResponseDto {
    return {
      requestId: request.requestId.value,
      playerProfileId: request.playerProfileId.value,
      sourceModule: request.sourceModule,
      sourceId: request.sourceId,
      packageId: request.packageId,
      status: request.status,
      requestedAt: request.requestedAt.toISOString(),
      processedAt: request.processedAt?.toISOString(),
      metadata: request.metadata,
    };
  }

  /**
   * Converts a database record to a RewardRequest entity.
   */
  public toEntity(record: RewardRequestRecord): RewardRequest {
    return RewardRequest.fromStorage(record);
  }

  /**
   * Converts a RewardRequest entity to a database record.
   */
  public toRecord(request: RewardRequest): RewardRequestRecord {
    return request.toRecord();
  }
}