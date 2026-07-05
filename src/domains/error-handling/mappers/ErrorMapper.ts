/**
 * Error Mapper
 *
 * Maps between SystemError entity and various DTOs.
 * Only mapping - no error handling logic.
 */

import type { SystemError } from '../entities/SystemError';
import type { SystemErrorRecord } from '../entities/SystemError';
import type {
  CreateSystemErrorDto,
  UpdateSystemErrorStatusDto,
  SystemErrorResponseDto,
} from '../dto/SystemError.dto';

/**
 * Mapper for converting between SystemError entity and DTOs.
 */
export class ErrorMapper {
  /**
   * Converts a SystemError entity to SystemErrorResponseDto.
   */
  public static toResponse(error: SystemError): SystemErrorResponseDto {
    return {
      errorId: error.errorId.value,
      errorCode: error.errorCode,
      category: error.category,
      severity: error.severity,
      message: error.message,
      stackTrace: error.stackTrace,
      createdAt: error.createdAt.toISOString(),
      metadata: error.metadata,
      status: error.status,
      resolvedAt: error.resolvedAt?.toISOString(),
      contextId: error.contextId,
    };
  }

  /**
   * Converts an array of SystemError entities to SystemErrorResponseDto array.
   */
  public static toResponseList(errors: SystemError[]): SystemErrorResponseDto[] {
    return errors.map((error) => this.toResponse(error));
  }

  /**
   * Converts a CreateSystemErrorDto to entity input.
   * Note: This creates input for entity creation, not the entity itself.
   */
  public static fromCreateDto(dto: CreateSystemErrorDto): Omit<CreateSystemErrorDto, never> {
    return {
      errorCode: dto.errorCode,
      category: dto.category,
      severity: dto.severity,
      message: dto.message,
      stackTrace: dto.stackTrace,
      metadata: dto.metadata,
      contextId: dto.contextId,
    };
  }

  /**
   * Converts an UpdateSystemErrorStatusDto to entity input.
   */
  public static fromUpdateStatusDto(dto: UpdateSystemErrorStatusDto): Omit<UpdateSystemErrorStatusDto, never> {
    return {
      status: dto.status,
      resolvedAt: dto.resolvedAt,
    };
  }

  /**
   * Converts a database record to CreateSystemErrorDto format.
   */
  public static fromRecordToDto(record: SystemErrorRecord): CreateSystemErrorDto {
    return {
      errorCode: record.error_code,
      category: record.category as CreateSystemErrorDto['category'],
      severity: record.severity as CreateSystemErrorDto['severity'],
      message: record.message,
      stackTrace: record.stack_trace,
      metadata: record.metadata,
      contextId: record.context_id,
    };
  }

  /**
   * Converts a SystemError entity to a database record format.
   * Note: This is for mapping TO record format, not actual database operations.
   */
  public static toRecord(error: SystemError): Omit<SystemErrorRecord, never> {
    return {
      error_id: error.errorId.value,
      error_code: error.errorCode,
      category: error.category,
      severity: error.severity,
      message: error.message,
      stack_trace: error.stackTrace,
      created_at: error.createdAt.toISOString(),
      metadata: error.metadata,
      status: error.status,
      resolved_at: error.resolvedAt?.toISOString(),
      context_id: error.contextId,
    };
  }
}
