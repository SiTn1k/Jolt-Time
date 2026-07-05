/**
 * StabilizationReport Entity
 *
 * Domain entity representing a stabilization report.
 * This entity ONLY stores reports - it never modifies gameplay.
 *
 * StabilizationReport Entity Responsibilities:
 * - Store report generation data
 * - Track module health status
 * - Record issues found during stabilization
 *
 * StabilizationReport Entity is NOT:
 * - A gameplay modifier
 * - A reward distributor
 * - A state changer
 */

import type { IStabilizationReport } from '../interfaces/IStabilizationReport';
import { ReportId } from '../value-objects/ReportId';
import { StabilizationMetadata, INITIAL_STABILIZATION_METADATA } from '../types/StabilizationMetadata';

/**
 * StabilizationReport entity class.
 * Immutable domain entity representing a stabilization report.
 */
export class StabilizationReport implements IStabilizationReport {
  /** Unique report identifier */
  public readonly reportId: ReportId;

  /** Timestamp when the report was created */
  public readonly createdAt: Date;

  /** List of modules that are healthy */
  public readonly healthyModules: string[];

  /** List of modules with warnings */
  public readonly warningModules: string[];

  /** List of modules that failed */
  public readonly failedModules: string[];

  /** Additional metadata */
  public readonly metadata: StabilizationMetadata;

  /**
   * Creates a new StabilizationReport instance.
   * @param props StabilizationReport properties
   */
  constructor(props: StabilizationReportProps) {
    this.reportId = props.reportId;
    this.createdAt = props.createdAt;
    this.healthyModules = props.healthyModules;
    this.warningModules = props.warningModules;
    this.failedModules = props.failedModules;
    this.metadata = props.metadata ?? { ...INITIAL_STABILIZATION_METADATA };
  }

  /**
   * Creates a new StabilizationReport for storing.
   * Factory method for new report creation.
   */
  public static create(params: {
    reportId?: ReportId;
    healthyModules?: string[];
    warningModules?: string[];
    failedModules?: string[];
    metadata?: StabilizationMetadata;
  }): StabilizationReport {
    return new StabilizationReport({
      reportId: params.reportId ?? ReportId.generate(),
      createdAt: new Date(),
      healthyModules: params.healthyModules ?? [],
      warningModules: params.warningModules ?? [],
      failedModules: params.failedModules ?? [],
      metadata: params.metadata ?? { ...INITIAL_STABILIZATION_METADATA },
    });
  }

  /**
   * Creates a StabilizationReport from a database record.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: StabilizationReportRecord): StabilizationReport {
    return new StabilizationReport({
      reportId: ReportId.reconstruct(record.report_id),
      createdAt: new Date(record.created_at),
      healthyModules: record.healthy_modules ?? [],
      warningModules: record.warning_modules ?? [],
      failedModules: record.failed_modules ?? [],
      metadata: record.metadata ?? { ...INITIAL_STABILIZATION_METADATA },
    });
  }

  /**
   * Serializes the StabilizationReport to a plain object.
   */
  public toJSON(): StabilizationReportJSON {
    return {
      reportId: this.reportId.value,
      createdAt: this.createdAt.toISOString(),
      healthyModules: this.healthyModules,
      warningModules: this.warningModules,
      failedModules: this.failedModules,
      metadata: this.metadata,
    };
  }

  /**
   * Gets the total count of modules in the report.
   */
  public get totalModules(): number {
    return this.healthyModules.length + this.warningModules.length + this.failedModules.length;
  }

  /**
   * Gets the overall health percentage.
   */
  public get healthPercentage(): number {
    if (this.totalModules === 0) return 100;
    return (this.healthyModules.length / this.totalModules) * 100;
  }
}

/**
 * StabilizationReport properties interface for constructor.
 */
export interface StabilizationReportProps {
  reportId: ReportId;
  createdAt: Date;
  healthyModules: string[];
  warningModules: string[];
  failedModules: string[];
  metadata?: StabilizationMetadata;
}

/**
 * Database record representation of StabilizationReport.
 */
export interface StabilizationReportRecord {
  report_id: string;
  created_at: string;
  healthy_modules: string[];
  warning_modules: string[];
  failed_modules: string[];
  metadata?: StabilizationMetadata;
}

/**
 * JSON serialization representation of StabilizationReport.
 */
export interface StabilizationReportJSON {
  reportId: string;
  createdAt: string;
  healthyModules: string[];
  warningModules: string[];
  failedModules: string[];
  metadata: StabilizationMetadata;
}
