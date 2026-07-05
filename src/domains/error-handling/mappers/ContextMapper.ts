/**
 * Context Mapper
 *
 * Maps between ErrorContext entity and various DTOs.
 * Only mapping - no error handling logic.
 */

import type { ErrorContext } from '../entities/ErrorContext';
import type { ErrorContextRecord } from '../entities/ErrorContext';
import type { CreateErrorContextDto, ErrorContextResponseDto } from '../dto/ErrorContext.dto';

/**
 * Mapper for converting between ErrorContext entity and DTOs.
 */
export class ContextMapper {
  /**
   * Converts an ErrorContext entity to ErrorContextResponseDto.
   */
  public static toResponse(context: ErrorContext): ErrorContextResponseDto {
    return {
      contextId: context.contextId.value,
      service: context.service,
      operation: context.operation,
      requestId: context.requestId,
      actorId: context.actorId,
      metadata: context.metadata,
      createdAt: context.createdAt.toISOString(),
    };
  }

  /**
   * Converts an array of ErrorContext entities to ErrorContextResponseDto array.
   */
  public static toResponseList(contexts: ErrorContext[]): ErrorContextResponseDto[] {
    return contexts.map((context) => this.toResponse(context));
  }

  /**
   * Converts a CreateErrorContextDto to entity input.
   * Note: This creates input for entity creation, not the entity itself.
   */
  public static fromCreateDto(dto: CreateErrorContextDto): Omit<CreateErrorContextDto, never> {
    return {
      contextId: dto.contextId,
      service: dto.service,
      operation: dto.operation,
      requestId: dto.requestId,
      actorId: dto.actorId,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts a database record to CreateErrorContextDto format.
   */
  public static fromRecordToDto(record: ErrorContextRecord): CreateErrorContextDto {
    return {
      contextId: record.context_id,
      service: record.service,
      operation: record.operation,
      requestId: record.request_id,
      actorId: record.actor_id,
      metadata: record.metadata,
    };
  }

  /**
   * Converts an ErrorContext entity to a database record format.
   * Note: This is for mapping TO record format, not actual database operations.
   */
  public static toRecord(context: ErrorContext): Omit<ErrorContextRecord, never> {
    return {
      context_id: context.contextId.value,
      service: context.service,
      operation: context.operation,
      request_id: context.requestId,
      actor_id: context.actorId,
      metadata: context.metadata,
      created_at: context.createdAt.toISOString(),
    };
  }
}
