/**
 * Audit Domain DTOs
 *
 * Exports all DTOs for the audit domain.
 */

export type { CreateAuditRecordDto, AuditRecordResponseDto } from './AuditRecord.dto';
export type { CreateAuditCategoryDto, AuditCategoryResponseDto } from './AuditCategory.dto';
export type { CreateAuditActorDto, AuditActorResponseDto } from './AuditActor.dto';
export type {
  AuditRecordPaginatedResponseDto,
  AuditCategoryPaginatedResponseDto,
  AuditActorPaginatedResponseDto,
  AuditStatisticsResponseDto,
} from './AuditResponse.dto';
