/**
 * Stabilization Service
 *
 * Main service for managing system stabilization operations.
 * Handles issue collection, report generation, and health snapshots.
 *
 * IMPORTANT: Stabilization is a FOUNDATION layer. It ONLY stores issues,
 * reports, and health snapshots. Stabilization MUST NEVER modify gameplay,
 * balances, rewards, inventory, or player state.
 */

import type { IStabilizationRepository } from '../interfaces/IStabilizationRepository';
import { StabilizationIssue } from '../entities/StabilizationIssue';
import { StabilizationReport } from '../entities/StabilizationReport';
import { HealthSnapshot } from '../entities/HealthSnapshot';
import { IssueId } from '../value-objects/IssueId';
import { ReportId } from '../value-objects/ReportId';
import { HealthSnapshotId } from '../value-objects/HealthSnapshotId';
import { HealthStatus } from '../types/HealthStatus';
import { IssueSeverity } from '../types/IssueSeverity';
import { IssueStatus } from '../types/IssueStatus';
import type { IssueFilterParams, ReportFilterParams, SnapshotFilterParams } from '../interfaces/IStabilizationRepository';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import { createLogger } from '../../../core/logging/logger.service';

const logger = createLogger('StabilizationService');

/**
 * Service configuration options.
 */
export interface StabilizationServiceConfig {
  autoSnapshotEnabled?: boolean;
  snapshotIntervalMs?: number;
}

/**
 * System health result from health scanner.
 */
export interface SystemHealthResult {
  memory: HealthStatus;
  cpu: HealthStatus;
  database: HealthStatus;
  cache: HealthStatus;
  api: HealthStatus;
  overall: HealthStatus;
}

/**
 * Issue collection result.
 */
export interface IssueCollectionResult {
  issuesCollected: number;
  issues: StabilizationIssue[];
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
}

/**
 * Stabilization summary result.
 */
export interface StabilizationSummary {
  totalIssues: number;
  openIssues: number;
  resolvedIssues: number;
  criticalIssues: number;
  totalReports: number;
  latestSnapshotAt: Date | null;
  healthPercentage: number;
}

/**
 * Stabilization service for managing stabilization operations.
 */
export class StabilizationService {
  private readonly _repository: IStabilizationRepository;
  private readonly _autoSnapshotEnabled: boolean;

  constructor(
    repository: IStabilizationRepository,
    config?: StabilizationServiceConfig
  ) {
    this._repository = repository;
    this._autoSnapshotEnabled = config?.autoSnapshotEnabled ?? true;
  }

  // ============ Issue Operations ============

  /**
   * Creates a new stabilization issue.
   */
  async createIssue(params: {
    module: string;
    severity: IssueSeverity;
    description: string;
    status?: IssueStatus;
  }): Promise<StabilizationIssue> {
    try {
      const issue = StabilizationIssue.create({
        module: params.module,
        severity: params.severity,
        description: params.description,
        status: params.status ?? IssueStatus.DETECTED,
      });

      const created = await this._repository.storeIssue(issue);
      logger.info(`Created stabilization issue: ${issue.issueId.value}`, {
        module: params.module,
        severity: params.severity,
      });
      return created;
    } catch (err) {
      logger.error('Failed to create stabilization issue', err as Error);
      throw err;
    }
  }

  /**
   * Finds an issue by ID.
   */
  async findIssue(id: string): Promise<StabilizationIssue | null> {
    try {
      const issueId = IssueId.reconstruct(id);
      return await this._repository.findIssueById(issueId);
    } catch (err) {
      logger.error(`Failed to find issue: ${id}`, err as Error);
      throw err;
    }
  }

  /**
   * Updates an existing issue.
   */
  async updateIssue(
    id: string,
    updates: {
      severity?: IssueSeverity;
      description?: string;
      status?: IssueStatus;
    }
  ): Promise<StabilizationIssue> {
    try {
      const issueId = IssueId.reconstruct(id);
      const issue = StabilizationIssue.create({
        issueId,
        module: '', // Will be ignored in update
        severity: updates.severity ?? IssueSeverity.LOW,
        description: updates.description ?? '',
        status: updates.status ?? IssueStatus.DETECTED,
      });

      const updated = await this._repository.updateIssue(issueId, issue);
      logger.info(`Updated stabilization issue: ${id}`, { updates });
      return updated;
    } catch (err) {
      logger.error(`Failed to update issue: ${id}`, err as Error);
      throw err;
    }
  }

  /**
   * Lists issues with pagination and filtering.
   */
  async listIssues(
    params: PaginationParams,
    filters?: IssueFilterParams
  ): Promise<PaginatedResult<StabilizationIssue>> {
    try {
      return await this._repository.listIssues(params, filters);
    } catch (err) {
      logger.error('Failed to list issues', err as Error);
      throw err;
    }
  }

  /**
   * Counts issues with optional filtering.
   */
  async countIssues(filters?: IssueFilterParams): Promise<number> {
    try {
      return await this._repository.countIssues(filters);
    } catch (err) {
      logger.error('Failed to count issues', err as Error);
      throw err;
    }
  }

  // ============ Report Operations ============

  /**
   * Creates a new stabilization report.
   */
  async createReport(params: {
    healthyModules: string[];
    warningModules: string[];
    failedModules: string[];
  }): Promise<StabilizationReport> {
    try {
      const report = StabilizationReport.create({
        healthyModules: params.healthyModules,
        warningModules: params.warningModules,
        failedModules: params.failedModules,
      });

      const created = await this._repository.storeReport(report);
      logger.info(`Created stabilization report: ${report.reportId.value}`, {
        healthyCount: params.healthyModules.length,
        warningCount: params.warningModules.length,
        failedCount: params.failedModules.length,
      });
      return created;
    } catch (err) {
      logger.error('Failed to create stabilization report', err as Error);
      throw err;
    }
  }

  /**
   * Finds a report by ID.
   */
  async findReport(id: string): Promise<StabilizationReport | null> {
    try {
      const reportId = ReportId.reconstruct(id);
      return await this._repository.findReportById(reportId);
    } catch (err) {
      logger.error(`Failed to find report: ${id}`, err as Error);
      throw err;
    }
  }

  /**
   * Lists reports with pagination and filtering.
   */
  async listReports(
    params: PaginationParams,
    filters?: ReportFilterParams
  ): Promise<PaginatedResult<StabilizationReport>> {
    try {
      return await this._repository.listReports(params, filters);
    } catch (err) {
      logger.error('Failed to list reports', err as Error);
      throw err;
    }
  }

  /**
   * Counts reports with optional filtering.
   */
  async countReports(filters?: ReportFilterParams): Promise<number> {
    try {
      return await this._repository.countReports(filters);
    } catch (err) {
      logger.error('Failed to count reports', err as Error);
      throw err;
    }
  }

  // ============ Health Snapshot Operations ============

  /**
   * Creates a new health snapshot.
   */
  async createSnapshot(health: SystemHealthResult): Promise<HealthSnapshot> {
    try {
      const snapshot = HealthSnapshot.create({
        memory: health.memory,
        cpu: health.cpu,
        database: health.database,
        cache: health.cache,
        api: health.api,
      });

      const created = await this._repository.storeSnapshot(snapshot);
      logger.info(`Created health snapshot: ${snapshot.snapshotId.value}`, {
        overall: health.overall,
      });
      return created;
    } catch (err) {
      logger.error('Failed to create health snapshot', err as Error);
      throw err;
    }
  }

  /**
   * Finds a snapshot by ID.
   */
  async findSnapshot(id: string): Promise<HealthSnapshot | null> {
    try {
      const snapshotId = HealthSnapshotId.reconstruct(id);
      return await this._repository.findSnapshotById(snapshotId);
    } catch (err) {
      logger.error(`Failed to find snapshot: ${id}`, err as Error);
      throw err;
    }
  }

  /**
   * Lists snapshots with pagination and filtering.
   */
  async listSnapshots(
    params: PaginationParams,
    filters?: SnapshotFilterParams
  ): Promise<PaginatedResult<HealthSnapshot>> {
    try {
      return await this._repository.listSnapshots(params, filters);
    } catch (err) {
      logger.error('Failed to list snapshots', err as Error);
      throw err;
    }
  }

  /**
   * Finds the latest snapshot.
   */
  async findLatestSnapshot(): Promise<HealthSnapshot | null> {
    try {
      return await this._repository.findLatestSnapshot();
    } catch (err) {
      logger.error('Failed to find latest snapshot', err as Error);
      throw err;
    }
  }

  /**
   * Counts snapshots with optional filtering.
   */
  async countSnapshots(filters?: SnapshotFilterParams): Promise<number> {
    try {
      return await this._repository.countSnapshots(filters);
    } catch (err) {
      logger.error('Failed to count snapshots', err as Error);
      throw err;
    }
  }

  // ============ Summary Operations ============

  /**
   * Gets stabilization summary statistics.
   */
  async getStabilizationSummary(): Promise<StabilizationSummary> {
    try {
      const [
        totalIssues,
        detectedIssues,
        investigatingIssues,
        identifiedIssues,
        inProgressIssues,
        criticalIssues,
        totalReports,
        latestSnapshot,
      ] = await Promise.all([
        this._repository.countIssues(),
        this._repository.countIssues({ status: IssueStatus.DETECTED }),
        this._repository.countIssues({ status: IssueStatus.INVESTIGATING }),
        this._repository.countIssues({ status: IssueStatus.IDENTIFIED }),
        this._repository.countIssues({ status: IssueStatus.IN_PROGRESS }),
        this._repository.countIssues({ severity: IssueSeverity.CRITICAL }),
        this._repository.countReports(),
        this._repository.findLatestSnapshot(),
      ]);

      const openIssues = detectedIssues + investigatingIssues + identifiedIssues + inProgressIssues;
      const resolvedIssues = totalIssues - openIssues;

      let healthPercentage = 100;
      if (latestSnapshot) {
        const statuses = [
          latestSnapshot.memory,
          latestSnapshot.cpu,
          latestSnapshot.database,
          latestSnapshot.cache,
          latestSnapshot.api,
        ];
        const healthyCount = statuses.filter(s => s === HealthStatus.HEALTHY).length;
        healthPercentage = (healthyCount / statuses.length) * 100;
      }

      return {
        totalIssues,
        openIssues,
        resolvedIssues,
        criticalIssues,
        totalReports,
        latestSnapshotAt: latestSnapshot?.createdAt ?? null,
        healthPercentage,
      };
    } catch (err) {
      logger.error('Failed to get stabilization summary', err as Error);
      throw err;
    }
  }

  // ============ Configuration ============

  /**
   * Checks if auto snapshot is enabled.
   */
  isAutoSnapshotEnabled(): boolean {
    return this._autoSnapshotEnabled;
  }
}
