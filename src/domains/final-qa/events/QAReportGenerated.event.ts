/**
 * QA Report Generated Event
 *
 * Domain event emitted when a QA report is generated.
 */

import type { ReportId } from '../value-objects/ReportId';

/**
 * Event data for QA report generation.
 */
export interface QAReportGeneratedEventData {
  /** Report ID */
  reportId: string;

  /** Number of passed checks */
  passedChecks: number;

  /** Number of failed checks */
  failedChecks: number;

  /** Number of warnings */
  warnings: number;

  /** Pass rate percentage */
  passRate: number;

  /** Creation timestamp */
  createdAt: Date;
}

/**
 * Domain event for QA report generation.
 */
export interface QAReportGeneratedEvent {
  /** Event type identifier */
  readonly eventType: 'QAReportGenerated';

  /** Event data */
  readonly data: QAReportGeneratedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a QAReportGeneratedEvent.
 */
export function createQAReportGeneratedEvent(params: {
  reportId: ReportId;
  passedChecks: number;
  failedChecks: number;
  warnings: number;
  passRate: number;
}): QAReportGeneratedEvent {
  return {
    eventType: 'QAReportGenerated',
    version: 1,
    data: {
      reportId: params.reportId.value,
      passedChecks: params.passedChecks,
      failedChecks: params.failedChecks,
      warnings: params.warnings,
      passRate: params.passRate,
      createdAt: new Date(),
    },
  };
}
