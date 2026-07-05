/**
 * Stabilization Repository Interface
 *
 * Interface defining the contract for Stabilization persistence.
 * All stabilization repository implementations must adhere to this interface.
 */

import type { IssueId } from '../value-objects/IssueId';
import type { ReportId } from '../value-objects/ReportId';
import type { HealthSnapshotId } from '../value-objects/HealthSnapshotId';
import type { StabilizationIssue } from '../entities/StabilizationIssue';
import type { StabilizationReport } from '../entities/StabilizationReport';
import type { HealthSnapshot } from '../entities/HealthSnapshot';
import type { IssueSeverity } from '../types/IssueSeverity';
import type { IssueStatus } from '../types/IssueStatus';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';

/**
 * Filter parameters for querying issues.
 */
export interface IssueFilterParams {
  /** Filter by module */
  module?: string;

  /** Filter by severity */
  severity?: IssueSeverity;

  /** Filter by status */
  status?: IssueStatus;

  /** Filter by creation date after */
  createdAfter?: Date;

  /** Filter by creation date before */
  createdBefore?: Date;
}

/**
 * Filter parameters for querying reports.
 */
export interface ReportFilterParams {
  /** Filter by creation date after */
  createdAfter?: Date;

  /** Filter by creation date before */
  createdBefore?: Date;
}

/**
 * Filter parameters for querying health snapshots.
 */
export interface SnapshotFilterParams {
  /** Filter by creation date after */
  createdAfter?: Date;

  /** Filter by creation date before */
  createdBefore?: Date;
}

/**
 * Stabilization repository interface.
 * Defines all data access operations for stabilization entities.
 *
 * IMPORTANT: Stabilization is a FOUNDATION layer. It ONLY stores issues,
 * reports, and health snapshots. Stabilization MUST NEVER modify gameplay,
 * balances, rewards, inventory, or player state.
 */
export interface IStabilizationRepository {
  // ============ Issue Operations ============

  /**
   * Stores a new stabilization issue.
   * @param issue The issue to store
   * @returns The stored issue
   */
  storeIssue(issue: StabilizationIssue): Promise<StabilizationIssue>;

  /**
   * Finds an issue by its ID.
   * @param id The issue ID to find
   * @returns The issue if found, null otherwise
   */
  findIssueById(id: IssueId): Promise<StabilizationIssue | null>;

  /**
   * Lists issues with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of issues
   */
  listIssues(
    params: PaginationParams,
    filters?: IssueFilterParams
  ): Promise<PaginatedResult<StabilizationIssue>>;

  /**
   * Updates an existing issue.
   * @param id The issue ID to update
   * @param updates The updates to apply
   * @returns The updated issue
   */
  updateIssue(
    id: IssueId,
    updates: Partial<StabilizationIssue>
  ): Promise<StabilizationIssue>;

  /**
   * Counts issues with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching issues
   */
  countIssues(filters?: IssueFilterParams): Promise<number>;

  // ============ Report Operations ============

  /**
   * Stores a new stabilization report.
   * @param report The report to store
   * @returns The stored report
   */
  storeReport(report: StabilizationReport): Promise<StabilizationReport>;

  /**
   * Finds a report by its ID.
   * @param id The report ID to find
   * @returns The report if found, null otherwise
   */
  findReportById(id: ReportId): Promise<StabilizationReport | null>;

  /**
   * Lists reports with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of reports
   */
  listReports(
    params: PaginationParams,
    filters?: ReportFilterParams
  ): Promise<PaginatedResult<StabilizationReport>>;

  /**
   * Counts reports with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching reports
   */
  countReports(filters?: ReportFilterParams): Promise<number>;

  // ============ Health Snapshot Operations ============

  /**
   * Stores a new health snapshot.
   * @param snapshot The snapshot to store
   * @returns The stored snapshot
   */
  storeSnapshot(snapshot: HealthSnapshot): Promise<HealthSnapshot>;

  /**
   * Finds a snapshot by its ID.
   * @param id The snapshot ID to find
   * @returns The snapshot if found, null otherwise
   */
  findSnapshotById(id: HealthSnapshotId): Promise<HealthSnapshot | null>;

  /**
   * Lists snapshots with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of snapshots
   */
  listSnapshots(
    params: PaginationParams,
    filters?: SnapshotFilterParams
  ): Promise<PaginatedResult<HealthSnapshot>>;

  /**
   * Finds the latest snapshot.
   * @returns The latest snapshot if found, null otherwise
   */
  findLatestSnapshot(): Promise<HealthSnapshot | null>;

  /**
   * Counts snapshots with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching snapshots
   */
  countSnapshots(filters?: SnapshotFilterParams): Promise<number>;
}
