/**
 * Report Mapper
 *
 * Maps between QAReport entity and various DTOs.
 * No database logic - pure transformation only.
 */

import type { QAReport, QAReportRecord, QAReportJSON } from '../entities/QAReport';
import type { CreateQAReportDto, QAReportResponseDto, UpdateQAReportDto } from '../dto/QAReport.dto';

/**
 * Mapper for converting between QAReport entity and DTOs.
 */
export class ReportMapper {
  /**
   * Converts a QAReport entity to QAReportResponseDto.
   */
  public static toResponse(report: QAReport): QAReportResponseDto {
    return {
      reportId: report.reportId.value,
      createdAt: report.createdAt.toISOString(),
      passedChecks: report.passedChecks,
      failedChecks: report.failedChecks,
      warnings: report.warnings,
      metadata: report.metadata,
    };
  }

  /**
   * Converts an array of QAReport entities to QAReportResponseDto array.
   */
  public static toResponseList(reports: QAReport[]): QAReportResponseDto[] {
    return reports.map((report) => this.toResponse(report));
  }

  /**
   * Converts a CreateQAReportDto to entity input.
   * Note: This creates input for entity creation, not the entity itself.
   */
  public static fromCreateDto(dto: CreateQAReportDto): Omit<CreateQAReportDto, never> {
    return {
      reportId: dto.reportId,
      passedChecks: dto.passedChecks,
      failedChecks: dto.failedChecks,
      warnings: dto.warnings,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts an UpdateQAReportDto to partial entity input.
   */
  public static fromUpdateDto(dto: UpdateQAReportDto): Partial<CreateQAReportDto> {
    return {
      passedChecks: dto.passedChecks,
      failedChecks: dto.failedChecks,
      warnings: dto.warnings,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts a database record to CreateQAReportDto format.
   */
  public static fromRecordToDto(record: QAReportRecord): CreateQAReportDto {
    return {
      reportId: record.report_id,
      passedChecks: record.passed_checks,
      failedChecks: record.failed_checks,
      warnings: record.warnings,
      metadata: record.metadata,
    };
  }

  /**
   * Converts a QAReport entity to a database record format.
   * Note: This is for mapping TO record format, not actual database operations.
   */
  public static toRecord(report: QAReport): Omit<QAReportRecord, never> {
    return {
      report_id: report.reportId.value,
      created_at: report.createdAt.toISOString(),
      passed_checks: report.passedChecks,
      failed_checks: report.failedChecks,
      warnings: report.warnings,
      metadata: report.metadata,
    };
  }

  /**
   * Converts a QAReport entity to JSON format.
   */
  public static toJSON(report: QAReport): QAReportJSON {
    return report.toJSON();
  }
}
