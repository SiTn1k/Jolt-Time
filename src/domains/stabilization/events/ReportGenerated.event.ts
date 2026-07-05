/**
 * Report Generated Event
 *
 * Domain event emitted when a stabilization report is generated.
 */

import type { ReportId } from '../value-objects/ReportId';

/**
 * Event data for report generation.
 */
export interface ReportGeneratedEventData {
  /** Report ID */
  reportId: string;

  /** List of healthy modules */
  healthyModules: string[];

  /** List of warning modules */
  warningModules: string[];

  /** List of failed modules */
  failedModules: string[];

  /** Total module count */
  totalModules: number;

  /** Health percentage */
  healthPercentage: number;

  /** Timestamp when generated */
  generatedAt: Date;
}

/**
 * Domain event for report generation.
 */
export interface ReportGeneratedEvent {
  /** Event type identifier */
  readonly eventType: 'ReportGenerated';

  /** Event data */
  readonly data: ReportGeneratedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a ReportGeneratedEvent.
 */
export function createReportGeneratedEvent(params: {
  reportId: ReportId;
  healthyModules: string[];
  warningModules: string[];
  failedModules: string[];
}): ReportGeneratedEvent {
  const totalModules = params.healthyModules.length + params.warningModules.length + params.failedModules.length;
  const healthPercentage = totalModules > 0 ? (params.healthyModules.length / totalModules) * 100 : 100;

  return {
    eventType: 'ReportGenerated',
    version: 1,
    data: {
      reportId: params.reportId.value,
      healthyModules: params.healthyModules,
      warningModules: params.warningModules,
      failedModules: params.failedModules,
      totalModules,
      healthPercentage,
      generatedAt: new Date(),
    },
  };
}
