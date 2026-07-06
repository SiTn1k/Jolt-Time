/**
 * QA Service
 *
 * Main service for managing final QA validation operations.
 * Handles QA check validation, snapshot generation, and report creation.
 *
 * IMPORTANT: QA Service is a VALIDATION layer. It ONLY stores validation metadata,
 * validates readiness, and generates reports. QA Service MUST NEVER modify
 * gameplay, balances, rewards, inventory, or player state.
 */

import type { IQARepository } from '../interfaces/IQARepository';
import type { QACheckFilterParams, QASnapshotFilterParams, QAReportFilterParams } from '../interfaces/IQARepository';
import { QACheck } from '../entities/QACheck';
import { QASnapshot } from '../entities/QASnapshot';
import { QAReport } from '../entities/QAReport';
import { CheckId } from '../value-objects/CheckId';
import { SnapshotId } from '../value-objects/SnapshotId';
import { ReportId } from '../value-objects/ReportId';
import { QAStatus } from '../types/QAStatus';
import { CheckSeverity } from '../types/CheckSeverity';
import { HealthStatus } from '../types/HealthStatus';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import { createLogger } from '../../../core/logging/logger.service';

const logger = createLogger('QAService');

/**
 * Service configuration options.
 */
export interface QAServiceConfig {
  autoSnapshotEnabled?: boolean;
  snapshotIntervalMs?: number;
}

/**
 * Module validation result.
 */
export interface ModuleValidationResult {
  moduleName: string;
  isHealthy: boolean;
  warnings: string[];
  errors: string[];
}

/**
 * QA readiness result.
 */
export interface QAReadinessResult {
  isReady: boolean;
  readinessPercentage: number;
  checkCompletion: number;
  healthyModules: string[];
  warningModules: string[];
  failedModules: string[];
  criticalIssues: string[];
}

/**
 * QA summary result.
 */
export interface QASummary {
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  pendingChecks: number;
  skippedChecks: number;
  totalSnapshots: number;
  totalReports: number;
  latestSnapshotAt: Date | null;
  readinessPercentage: number;
}

/**
 * QA validation report.
 */
export interface QAValidationReport {
  generatedAt: Date;
  backendVersion: string;
  gitCommit: string;
  summary: QASummary;
  readiness: QAReadinessResult;
  moduleStatuses: ModuleValidationResult[];
  recentSnapshots: QASnapshot[];
  warnings: string[];
  criticalIssues: string[];
}

/**
 * QA check creation params.
 */
export interface CreateCheckParams {
  title: string;
  severity: CheckSeverity;
  metadata?: Record<string, unknown>;
}

/**
 * QA check update params.
 */
export interface UpdateCheckParams {
  status?: QAStatus;
  completedAt?: Date | null;
  metadata?: Record<string, unknown>;
}

/**
 * QA service for managing final QA validation operations.
 */
export class QAService {
  private readonly _repository: IQARepository;
  private readonly _autoSnapshotEnabled: boolean;

  constructor(
    repository: IQARepository,
    config?: QAServiceConfig
  ) {
    this._repository = repository;
    this._autoSnapshotEnabled = config?.autoSnapshotEnabled ?? true;
  }

  // ============ QA Check Operations ============

  /**
   * Creates a new QA check.
   */
  async createCheck(params: CreateCheckParams): Promise<QACheck> {
    try {
      const check = QACheck.create({
        title: params.title,
        status: QAStatus.PENDING,
        severity: params.severity,
        metadata: params.metadata as QACheck['metadata'],
      });

      const created = await this._repository.createCheck(check);
      logger.info(`Created QA check: ${check.checkId.value}`, {
        title: params.title,
        severity: params.severity,
      });
      return created;
    } catch (err) {
      logger.error('Failed to create QA check', err as Error);
      throw err;
    }
  }

  /**
   * Finds a QA check by ID.
   */
  async findCheck(id: string): Promise<QACheck | null> {
    try {
      const checkId = CheckId.reconstruct(id);
      return await this._repository.findCheckById(checkId);
    } catch (err) {
      logger.error(`Failed to find QA check: ${id}`, err as Error);
      throw err;
    }
  }

  /**
   * Updates a QA check.
   */
  async updateCheck(id: string, updates: UpdateCheckParams): Promise<QACheck> {
    try {
      const checkId = CheckId.reconstruct(id);
      const existing = await this._repository.findCheckById(checkId);

      if (!existing) {
        throw new Error(`QA check not found: ${id}`);
      }

      // Create updated check using factory
      const updatedCheck = QACheck.create({
        checkId: existing.checkId,
        title: existing.title,
        status: updates.status ?? existing.status,
        severity: existing.severity,
        completedAt: updates.completedAt,
        metadata: updates.metadata as QACheck['metadata'] ?? existing.metadata,
      });

      const result = await this._repository.updateCheck(updatedCheck);
      logger.info(`Updated QA check: ${id}`, { updates });
      return result;
    } catch (err) {
      logger.error(`Failed to update QA check: ${id}`, err as Error);
      throw err;
    }
  }

  /**
   * Marks a QA check as completed.
   */
  async completeCheck(id: string, passed: boolean): Promise<QACheck> {
    try {
      const checkId = CheckId.reconstruct(id);
      const existing = await this._repository.findCheckById(checkId);

      if (!existing) {
        throw new Error(`QA check not found: ${id}`);
      }

      const completedCheck = QACheck.create({
        checkId: existing.checkId,
        title: existing.title,
        status: passed ? QAStatus.PASSED : QAStatus.FAILED,
        severity: existing.severity,
        completedAt: new Date(),
        metadata: existing.metadata,
      });

      const result = await this._repository.updateCheck(completedCheck);
      logger.info(`Completed QA check: ${id}`, { passed });
      return result;
    } catch (err) {
      logger.error(`Failed to complete QA check: ${id}`, err as Error);
      throw err;
    }
  }

  /**
   * Deletes a QA check.
   */
  async deleteCheck(id: string): Promise<void> {
    try {
      const checkId = CheckId.reconstruct(id);
      await this._repository.deleteCheck(checkId);
      logger.info(`Deleted QA check: ${id}`);
    } catch (err) {
      logger.error(`Failed to delete QA check: ${id}`, err as Error);
      throw err;
    }
  }

  /**
   * Lists QA checks with pagination and filtering.
   */
  async listChecks(
    params: PaginationParams,
    filters?: QACheckFilterParams
  ): Promise<PaginatedResult<QACheck>> {
    try {
      return await this._repository.listChecks(params, filters);
    } catch (err) {
      logger.error('Failed to list QA checks', err as Error);
      throw err;
    }
  }

  /**
   * Counts QA checks with optional filtering.
   */
  async countChecks(filters?: QACheckFilterParams): Promise<number> {
    try {
      return await this._repository.countChecks(filters);
    } catch (err) {
      logger.error('Failed to count QA checks', err as Error);
      throw err;
    }
  }

  // ============ QA Snapshot Operations ============

  /**
   * Creates a new QA snapshot.
   */
  async createSnapshot(params: {
    backendVersion: string;
    moduleCount: number;
    healthStatus: HealthStatus;
    metadata?: Record<string, unknown>;
  }): Promise<QASnapshot> {
    try {
      const snapshot = QASnapshot.create({
        backendVersion: params.backendVersion,
        moduleCount: params.moduleCount,
        healthStatus: params.healthStatus,
        metadata: params.metadata as QASnapshot['metadata'],
      });

      const created = await this._repository.createSnapshot(snapshot);
      logger.info(`Created QA snapshot: ${snapshot.snapshotId.value}`, {
        backendVersion: params.backendVersion,
        moduleCount: params.moduleCount,
      });
      return created;
    } catch (err) {
      logger.error('Failed to create QA snapshot', err as Error);
      throw err;
    }
  }

  /**
   * Finds a QA snapshot by ID.
   */
  async findSnapshot(id: string): Promise<QASnapshot | null> {
    try {
      const snapshotId = SnapshotId.reconstruct(id);
      return await this._repository.findSnapshotById(snapshotId);
    } catch (err) {
      logger.error(`Failed to find QA snapshot: ${id}`, err as Error);
      throw err;
    }
  }

  /**
   * Lists QA snapshots with pagination and filtering.
   */
  async listSnapshots(
    params: PaginationParams,
    filters?: QASnapshotFilterParams
  ): Promise<PaginatedResult<QASnapshot>> {
    try {
      return await this._repository.listSnapshots(params, filters);
    } catch (err) {
      logger.error('Failed to list QA snapshots', err as Error);
      throw err;
    }
  }

  /**
   * Deletes a QA snapshot.
   */
  async deleteSnapshot(id: string): Promise<void> {
    try {
      const snapshotId = SnapshotId.reconstruct(id);
      await this._repository.deleteSnapshot(snapshotId);
      logger.info(`Deleted QA snapshot: ${id}`);
    } catch (err) {
      logger.error(`Failed to delete QA snapshot: ${id}`, err as Error);
      throw err;
    }
  }

  /**
   * Counts QA snapshots with optional filtering.
   */
  async countSnapshots(filters?: QASnapshotFilterParams): Promise<number> {
    try {
      return await this._repository.countSnapshots(filters);
    } catch (err) {
      logger.error('Failed to count QA snapshots', err as Error);
      throw err;
    }
  }

  // ============ QA Report Operations ============

  /**
   * Creates a new QA report.
   */
  async createReport(params: {
    passedChecks: number;
    failedChecks: number;
    warnings: number;
    metadata?: Record<string, unknown>;
  }): Promise<QAReport> {
    try {
      const report = QAReport.create({
        passedChecks: params.passedChecks,
        failedChecks: params.failedChecks,
        warnings: params.warnings,
        metadata: params.metadata as QAReport['metadata'],
      });

      const created = await this._repository.createReport(report);
      logger.info(`Created QA report: ${report.reportId.value}`, {
        passedChecks: params.passedChecks,
        failedChecks: params.failedChecks,
      });
      return created;
    } catch (err) {
      logger.error('Failed to create QA report', err as Error);
      throw err;
    }
  }

  /**
   * Finds a QA report by ID.
   */
  async findReport(id: string): Promise<QAReport | null> {
    try {
      const reportId = ReportId.reconstruct(id);
      return await this._repository.findReportById(reportId);
    } catch (err) {
      logger.error(`Failed to find QA report: ${id}`, err as Error);
      throw err;
    }
  }

  /**
   * Lists QA reports with pagination and filtering.
   */
  async listReports(
    params: PaginationParams,
    filters?: QAReportFilterParams
  ): Promise<PaginatedResult<QAReport>> {
    try {
      return await this._repository.listReports(params, filters);
    } catch (err) {
      logger.error('Failed to list QA reports', err as Error);
      throw err;
    }
  }

  /**
   * Deletes a QA report.
   */
  async deleteReport(id: string): Promise<void> {
    try {
      const reportId = ReportId.reconstruct(id);
      await this._repository.deleteReport(reportId);
      logger.info(`Deleted QA report: ${id}`);
    } catch (err) {
      logger.error(`Failed to delete QA report: ${id}`, err as Error);
      throw err;
    }
  }

  /**
   * Counts QA reports with optional filtering.
   */
  async countReports(filters?: QAReportFilterParams): Promise<number> {
    try {
      return await this._repository.countReports(filters);
    } catch (err) {
      logger.error('Failed to count QA reports', err as Error);
      throw err;
    }
  }

  // ============ Validation Operations ============

  /**
   * Validates all QA checks.
   */
  async validateChecks(): Promise<{
    total: number;
    passed: number;
    failed: number;
    pending: number;
    skipped: number;
    issues: string[];
  }> {
    try {
      const [total, passed, failed, pending, skipped] = await Promise.all([
        this._repository.countChecks(),
        this._repository.countChecks({ status: QAStatus.PASSED }),
        this._repository.countChecks({ status: QAStatus.FAILED }),
        this._repository.countChecks({ status: QAStatus.PENDING }),
        this._repository.countChecks({ status: QAStatus.SKIPPED }),
      ]);

      const issues: string[] = [];
      if (failed > 0) {
        issues.push(`${failed} check(s) failed`);
      }
      if (pending > total * 0.5) {
        issues.push(`More than 50% of checks are still pending`);
      }

      return {
        total,
        passed,
        failed,
        pending,
        skipped,
        issues,
      };
    } catch (err) {
      logger.error('Failed to validate checks', err as Error);
      throw err;
    }
  }

  /**
   * Calculates QA readiness.
   */
  async calculateReadiness(healthyModules: string[] = []): Promise<QAReadinessResult> {
    try {
      const validation = await this.validateChecks();

      const checkCompletion = validation.total > 0
        ? (validation.passed / validation.total) * 100
        : 0;

      const readinessPercentage = checkCompletion;

      const failedModules = validation.failed > 0 ? ['checks-failed'] : [];
      const warningModules = validation.pending > validation.total * 0.3
        ? healthyModules.slice(0, Math.ceil(healthyModules.length * 0.3))
        : [];
      const criticalIssues = [...validation.issues];

      const isReady = checkCompletion >= 95 && criticalIssues.length === 0;

      return {
        isReady,
        readinessPercentage,
        checkCompletion,
        healthyModules,
        warningModules,
        failedModules,
        criticalIssues,
      };
    } catch (err) {
      logger.error('Failed to calculate readiness', err as Error);
      throw err;
    }
  }

  // ============ Summary Operations ============

  /**
   * Gets QA summary statistics.
   */
  async getQASummary(): Promise<QASummary> {
    try {
      const [
        totalChecks,
        passedChecks,
        failedChecks,
        pendingChecks,
        skippedChecks,
        totalSnapshots,
        totalReports,
        latestSnapshot,
      ] = await Promise.all([
        this._repository.countChecks(),
        this._repository.countChecks({ status: QAStatus.PASSED }),
        this._repository.countChecks({ status: QAStatus.FAILED }),
        this._repository.countChecks({ status: QAStatus.PENDING }),
        this._repository.countChecks({ status: QAStatus.SKIPPED }),
        this._repository.countSnapshots(),
        this._repository.countReports(),
        this._repository.listSnapshots({ page: 1, pageSize: 1 }),
      ]);

      const readiness = await this.calculateReadiness();

      return {
        totalChecks,
        passedChecks,
        failedChecks,
        pendingChecks,
        skippedChecks,
        totalSnapshots,
        totalReports,
        latestSnapshotAt: latestSnapshot.items[0]?.createdAt ?? null,
        readinessPercentage: readiness.readinessPercentage,
      };
    } catch (err) {
      logger.error('Failed to get QA summary', err as Error);
      throw err;
    }
  }

  /**
   * Generates a comprehensive QA validation report.
   */
  async generateValidationReport(params: {
    backendVersion: string;
    gitCommit: string;
    healthyModules?: string[];
  }): Promise<QAValidationReport> {
    try {
      const [summary, readiness, recentSnapshots] = await Promise.all([
        this.getQASummary(),
        this.calculateReadiness(params.healthyModules ?? []),
        this._repository.listSnapshots({ page: 1, pageSize: 5 }),
      ]);

      // Build module statuses from readiness data
      const moduleStatuses: ModuleValidationResult[] = [];

      // Add checks module status
      moduleStatuses.push({
        moduleName: 'QAChecks',
        isHealthy: readiness.failedModules.every(m => m !== 'checks-failed'),
        warnings: readiness.warningModules.includes('checks') ? ['Some checks remain pending'] : [],
        errors: readiness.failedModules.includes('checks-failed') ? ['Failed checks found'] : [],
      });

      // Add healthy modules from parameter
      for (const moduleName of params.healthyModules ?? []) {
        moduleStatuses.push({
          moduleName,
          isHealthy: !readiness.warningModules.includes(moduleName) && !readiness.failedModules.includes(moduleName),
          warnings: readiness.warningModules.includes(moduleName) ? ['Module has warnings'] : [],
          errors: [],
        });
      }

      const warnings = [...readiness.warningModules];
      if (summary.pendingChecks > summary.totalChecks * 0.5) {
        warnings.push('More than 50% of checks are pending');
      }

      return {
        generatedAt: new Date(),
        backendVersion: params.backendVersion,
        gitCommit: params.gitCommit,
        summary,
        readiness,
        moduleStatuses,
        recentSnapshots: recentSnapshots.items,
        warnings,
        criticalIssues: readiness.criticalIssues,
      };
    } catch (err) {
      logger.error('Failed to generate validation report', err as Error);
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

/**
 * Service index for exports.
 */
export { QAService as default } from './QAService';
