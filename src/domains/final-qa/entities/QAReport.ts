/**
 * QAReport Entity
 *
 * Domain entity representing a quality assurance report.
 * This entity ONLY stores QA report data - it never modifies gameplay.
 *
 * QAReport Entity Responsibilities:
 * - Store immutable QA report data
 * - Track passed/failed checks and warnings
 * - Record report creation time
 *
 * QAReport Entity is NOT:
 * - A gameplay modifier
 * - A reward distributor
 * - A state changer
 */

import type { IQAReport } from '../interfaces/IQAReport';
import { ReportId } from '../value-objects/ReportId';
import { QAMetadata, INITIAL_QA_METADATA } from '../types/QAMetadata';

/**
 * QAReport entity class.
 * Immutable domain entity representing a QA report.
 */
export class QAReport implements IQAReport {
  /** Unique QA report identifier */
  public readonly reportId: ReportId;

  /** Timestamp when the report was created */
  public readonly createdAt: Date;

  /** Number of passed checks */
  public readonly passedChecks: number;

  /** Number of failed checks */
  public readonly failedChecks: number;

  /** Number of warnings */
  public readonly warnings: number;

  /** Additional metadata */
  public readonly metadata: QAMetadata;

  /**
   * Creates a new QAReport instance.
   * @param props QAReport properties
   */
  constructor(props: QAReportProps) {
    this.reportId = props.reportId;
    this.createdAt = props.createdAt;
    this.passedChecks = props.passedChecks;
    this.failedChecks = props.failedChecks;
    this.warnings = props.warnings;
    this.metadata = props.metadata ?? { ...INITIAL_QA_METADATA };
  }

  /**
   * Creates a new QAReport for storing.
   * Factory method for new report creation.
   */
  public static create(params: {
    reportId?: ReportId;
    passedChecks: number;
    failedChecks: number;
    warnings: number;
    metadata?: QAMetadata;
  }): QAReport {
    return new QAReport({
      reportId: params.reportId ?? ReportId.generate(),
      createdAt: new Date(),
      passedChecks: params.passedChecks,
      failedChecks: params.failedChecks,
      warnings: params.warnings,
      metadata: params.metadata ?? { ...INITIAL_QA_METADATA },
    });
  }

  /**
   * Creates a QAReport from a database record.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: QAReportRecord): QAReport {
    return new QAReport({
      reportId: ReportId.reconstruct(record.report_id),
      createdAt: new Date(record.created_at),
      passedChecks: record.passed_checks,
      failedChecks: record.failed_checks,
      warnings: record.warnings,
      metadata: record.metadata ?? { ...INITIAL_QA_METADATA },
    });
  }

  /**
   * Serializes the QAReport to a plain object.
   */
  public toJSON(): QAReportJSON {
    return {
      reportId: this.reportId.value,
      createdAt: this.createdAt.toISOString(),
      passedChecks: this.passedChecks,
      failedChecks: this.failedChecks,
      warnings: this.warnings,
      metadata: this.metadata,
    };
  }
}

/**
 * QAReport properties interface for constructor.
 */
export interface QAReportProps {
  reportId: ReportId;
  createdAt: Date;
  passedChecks: number;
  failedChecks: number;
  warnings: number;
  metadata?: QAMetadata;
}

/**
 * Database record representation of QAReport.
 */
export interface QAReportRecord {
  report_id: string;
  created_at: string;
  passed_checks: number;
  failed_checks: number;
  warnings: number;
  metadata?: QAMetadata;
}

/**
 * JSON serialization representation of QAReport.
 */
export interface QAReportJSON {
  reportId: string;
  createdAt: string;
  passedChecks: number;
  failedChecks: number;
  warnings: number;
  metadata: QAMetadata;
}
