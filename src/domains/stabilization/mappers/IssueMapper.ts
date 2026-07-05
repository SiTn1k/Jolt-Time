/**
 * Issue Mapper
 *
 * Maps between StabilizationIssue entity and various DTOs.
 * No database logic - pure transformation only.
 */

import type { StabilizationIssue, StabilizationIssueRecord } from '../entities/StabilizationIssue';
import type { IssueResponseDto, CreateIssueDto, UpdateIssueDto } from '../dto/IssueDto';

/**
 * Mapper for converting between StabilizationIssue entity and DTOs.
 */
export class IssueMapper {
  /**
   * Converts a StabilizationIssue entity to IssueResponseDto.
   */
  public static toResponse(issue: StabilizationIssue): IssueResponseDto {
    return {
      issueId: issue.issueId.value,
      module: issue.module,
      severity: issue.severity,
      description: issue.description,
      status: issue.status,
      createdAt: issue.createdAt.toISOString(),
      metadata: issue.metadata,
    };
  }

  /**
   * Converts an array of StabilizationIssue entities to IssueResponseDto array.
   */
  public static toResponseList(issues: StabilizationIssue[]): IssueResponseDto[] {
    return issues.map((issue) => this.toResponse(issue));
  }

  /**
   * Converts a CreateIssueDto to entity input.
   * Note: This creates input for entity creation, not the entity itself.
   */
  public static fromCreateDto(dto: CreateIssueDto): Omit<CreateIssueDto, never> {
    return {
      module: dto.module,
      severity: dto.severity,
      description: dto.description,
      status: dto.status,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts an UpdateIssueDto to partial entity input.
   * Note: This creates input for entity updates, not the entity itself.
   */
  public static fromUpdateDto(dto: UpdateIssueDto): {
    severity?: import('../types/IssueSeverity').IssueSeverity;
    description?: string;
    status?: import('../types/IssueStatus').IssueStatus;
    metadata?: import('../types/StabilizationMetadata').StabilizationMetadata;
  } {
    return {
      severity: dto.severity as import('../types/IssueSeverity').IssueSeverity,
      description: dto.description,
      status: dto.status as import('../types/IssueStatus').IssueStatus,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts a database record to CreateIssueDto format.
   */
  public static fromRecordToDto(record: StabilizationIssueRecord): CreateIssueDto {
    return {
      module: record.module,
      severity: record.severity as CreateIssueDto['severity'],
      description: record.description,
      status: record.status as CreateIssueDto['status'],
      metadata: record.metadata,
    };
  }

  /**
   * Converts a StabilizationIssue entity to a database record format.
   * Note: This is for mapping TO record format, not actual database operations.
   */
  public static toRecord(issue: StabilizationIssue): Omit<StabilizationIssueRecord, never> {
    return {
      issue_id: issue.issueId.value,
      module: issue.module,
      severity: issue.severity,
      description: issue.description,
      status: issue.status,
      created_at: issue.createdAt.toISOString(),
      metadata: issue.metadata,
    };
  }
}
