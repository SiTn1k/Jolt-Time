/**
 * Report Mapper
 *
 * Maps between StabilizationReport entity and various DTOs.
 * No database logic - pure transformation only.
 */

import type { StabilizationReport, StabilizationReportRecord } from '../entities/StabilizationReport';
import type { ReportResponseDto, CreateReportDto } from '../dto/ReportDto';
import { StabilizationMapper } from './StabilizationMapper';

/**
 * Mapper for converting between StabilizationReport entity and DTOs.
 */
export class ReportMapper {
  /**
   * Converts a StabilizationReport entity to ReportResponseDto.
   */
  public static toResponse(report: StabilizationReport): ReportResponseDto {
    return {
      reportId: report.reportId.value,
      createdAt: report.createdAt.toISOString(),
      healthyModules: report.healthyModules,
      warningModules: report.warningModules,
      failedModules: report.failedModules,
      metadata: report.metadata,
      totalModules: report.totalModules,
      healthPercentage: report.healthPercentage,
    };
  }

  /**
   * Converts an array of StabilizationReport entities to ReportResponseDto array.
   */
  public static toResponseList(reports: StabilizationReport[]): ReportResponseDto[] {
    return reports.map((report) => this.toResponse(report));
  }

  /**
   * Converts a CreateReportDto to entity input.
   * Note: This creates input for entity creation, not the entity itself.
   */
  public static fromCreateDto(dto: CreateReportDto): Omit<CreateReportDto, never> {
    return {
      healthyModules: dto.healthyModules,
      warningModules: dto.warningModules,
      failedModules: dto.failedModules,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts a database record to CreateReportDto format.
   */
  public static fromRecordToDto(record: StabilizationReportRecord): CreateReportDto {
    return {
      healthyModules: record.healthy_modules,
      warningModules: record.warning_modules,
      failedModules: record.failed_modules,
      metadata: record.metadata,
    };
  }

  /**
   * Converts a StabilizationReport entity to a database record format.
   * Note: This is for mapping TO record format, not actual database operations.
   */
  public static toRecord(report: StabilizationReport): Omit<StabilizationReportRecord, never> {
    return {
      report_id: report.reportId.value,
      created_at: report.createdAt.toISOString(),
      healthy_modules: report.healthyModules,
      warning_modules: report.warningModules,
      failed_modules: report.failedModules,
      metadata: report.metadata,
    };
  }
}
