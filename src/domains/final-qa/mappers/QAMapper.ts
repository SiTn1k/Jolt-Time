/**
 * QA Mapper
 *
 * General mapping utilities for QA domain.
 * No database logic - pure transformation only.
 */

import type { PaginatedResult } from '../../../shared/types/base.types';
import type { QACheck } from '../entities/QACheck';
import type { QASnapshot } from '../entities/QASnapshot';
import type { QAReport } from '../entities/QAReport';
import type { QACheckResponseDto, QASnapshotResponseDto, QAReportResponseDto } from '../dto';
import type { QASummaryResponseDto } from '../dto/QAResponse.dto';

/**
 * Mapper for general QA transformations.
 */
export class QAMapper {
  /**
   * Creates a QA summary from check counts.
   */
  public static toSummary(params: {
    totalChecks: number;
    passedChecks: number;
    failedChecks: number;
    warnings: number;
  }): QASummaryResponseDto {
    const passRate = params.totalChecks > 0
      ? Math.round((params.passedChecks / params.totalChecks) * 100)
      : 0;

    return {
      totalChecks: params.totalChecks,
      passedChecks: params.passedChecks,
      failedChecks: params.failedChecks,
      warnings: params.warnings,
      passRate,
    };
  }

  /**
   * Calculates pass rate from checks.
   */
  public static calculatePassRate(total: number, passed: number): number {
    if (total === 0) return 0;
    return Math.round((passed / total) * 100);
  }

  /**
   * Determines overall health status from check results.
   */
  public static determineHealthStatus(failedChecks: number, totalChecks: number): string {
    if (totalChecks === 0) return 'UNKNOWN';
    const failureRate = failedChecks / totalChecks;
    if (failureRate >= 0.5) return 'UNHEALTHY';
    if (failureRate >= 0.2) return 'DEGRADED';
    return 'HEALTHY';
  }
}
