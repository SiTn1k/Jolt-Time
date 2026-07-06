/**
 * QA Repository Interface
 *
 * Interface defining the contract for QA entity persistence.
 * All QA repository implementations must adhere to this interface.
 *
 * NOTE: This is the foundation interface. Full implementation belongs to P-199.2.
 */

import type { CheckId } from '../value-objects/CheckId';
import type { SnapshotId } from '../value-objects/SnapshotId';
import type { ReportId } from '../value-objects/ReportId';
import type { QACheck } from '../entities/QACheck';
import type { QASnapshot } from '../entities/QASnapshot';
import type { QAReport } from '../entities/QAReport';
import type { QAStatus } from '../types/QAStatus';
import type { CheckSeverity } from '../types/CheckSeverity';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';

/**
 * Filter parameters for querying QA checks.
 */
export interface QACheckFilterParams {
  /** Filter by status */
  status?: QAStatus;

  /** Filter by severity */
  severity?: CheckSeverity;

  /** Filter by title (partial match) */
  title?: string;

  /** Filter by completion date after */
  completedAfter?: Date;

  /** Filter by completion date before */
  completedBefore?: Date;
}

/**
 * Filter parameters for querying QA snapshots.
 */
export interface QASnapshotFilterParams {
  /** Filter by backend version */
  backendVersion?: string;

  /** Filter by health status */
  healthStatus?: string;

  /** Filter by creation date after */
  createdAfter?: Date;

  /** Filter by creation date before */
  createdBefore?: Date;
}

/**
 * Filter parameters for querying QA reports.
 */
export interface QAReportFilterParams {
  /** Filter by passed checks greater than */
  passedChecksMin?: number;

  /** Filter by failed checks greater than */
  failedChecksMin?: number;

  /** Filter by creation date after */
  createdAfter?: Date;

  /** Filter by creation date before */
  createdBefore?: Date;
}

/**
 * QA repository interface.
 * Defines all data access operations for QA entities.
 *
 * IMPORTANT: QA is a FOUNDATION layer. It ONLY stores checks, reports, and snapshots.
 * QA MUST NEVER modify gameplay, balances, rewards, inventory, or player state.
 */
export interface IQARepository {
  // ============ QA Check Operations ============

  /**
   * Creates a new QA check.
   * @param check The QA check to create
   * @returns The created QA check
   */
  createCheck(check: QACheck): Promise<QACheck>;

  /**
   * Finds a QA check by its ID.
   * @param id The check ID to find
   * @returns The QA check if found, null otherwise
   */
  findCheckById(id: CheckId): Promise<QACheck | null>;

  /**
   * Lists QA checks with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of QA checks
   */
  listChecks(
    params: PaginationParams,
    filters?: QACheckFilterParams
  ): Promise<PaginatedResult<QACheck>>;

  /**
   * Updates a QA check.
   * @param check The QA check to update
   * @returns The updated QA check
   */
  updateCheck(check: QACheck): Promise<QACheck>;

  /**
   * Deletes a QA check.
   * @param id The check ID to delete
   * @returns void
   */
  deleteCheck(id: CheckId): Promise<void>;

  /**
   * Counts QA checks with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching QA checks
   */
  countChecks(filters?: QACheckFilterParams): Promise<number>;

  // ============ QA Snapshot Operations ============

  /**
   * Creates a new QA snapshot.
   * @param snapshot The QA snapshot to create
   * @returns The created QA snapshot
   */
  createSnapshot(snapshot: QASnapshot): Promise<QASnapshot>;

  /**
   * Finds a QA snapshot by its ID.
   * @param id The snapshot ID to find
   * @returns The QA snapshot if found, null otherwise
   */
  findSnapshotById(id: SnapshotId): Promise<QASnapshot | null>;

  /**
   * Lists QA snapshots with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of QA snapshots
   */
  listSnapshots(
    params: PaginationParams,
    filters?: QASnapshotFilterParams
  ): Promise<PaginatedResult<QASnapshot>>;

  /**
   * Updates a QA snapshot.
   * @param snapshot The QA snapshot to update
   * @returns The updated QA snapshot
   */
  updateSnapshot(snapshot: QASnapshot): Promise<QASnapshot>;

  /**
   * Deletes a QA snapshot.
   * @param id The snapshot ID to delete
   * @returns void
   */
  deleteSnapshot(id: SnapshotId): Promise<void>;

  /**
   * Counts QA snapshots with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching QA snapshots
   */
  countSnapshots(filters?: QASnapshotFilterParams): Promise<number>;

  // ============ QA Report Operations ============

  /**
   * Creates a new QA report.
   * @param report The QA report to create
   * @returns The created QA report
   */
  createReport(report: QAReport): Promise<QAReport>;

  /**
   * Finds a QA report by its ID.
   * @param id The report ID to find
   * @returns The QA report if found, null otherwise
   */
  findReportById(id: ReportId): Promise<QAReport | null>;

  /**
   * Lists QA reports with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of QA reports
   */
  listReports(
    params: PaginationParams,
    filters?: QAReportFilterParams
  ): Promise<PaginatedResult<QAReport>>;

  /**
   * Updates a QA report.
   * @param report The QA report to update
   * @returns The updated QA report
   */
  updateReport(report: QAReport): Promise<QAReport>;

  /**
   * Deletes a QA report.
   * @param id The report ID to delete
   * @returns void
   */
  deleteReport(id: ReportId): Promise<void>;

  /**
   * Counts QA reports with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching QA reports
   */
  countReports(filters?: QAReportFilterParams): Promise<number>;
}
