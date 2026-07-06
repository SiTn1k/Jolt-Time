/**
 * Release Service
 *
 * Main service for managing release candidate validation operations.
 * Handles release validation, checklist management, and snapshot generation.
 *
 * IMPORTANT: Release Service is a VALIDATION layer. It ONLY stores release metadata,
 * validates readiness, and generates reports. Release Service MUST NEVER modify
 * gameplay, balances, rewards, inventory, or player state.
 */

import type { IReleaseRepository } from '../interfaces/IReleaseRepository';
import type {
  ReleaseFilterParams,
  ChecklistFilterParams,
} from '../interfaces/IReleaseRepository';
import { ReleaseCandidate } from '../entities/ReleaseCandidate';
import { ReleaseChecklist } from '../entities/ReleaseChecklist';
import { ReleaseSnapshot } from '../entities/ReleaseSnapshot';
import { ReleaseId } from '../value-objects/ReleaseId';
import { ChecklistId } from '../value-objects/ChecklistId';
import { SnapshotId } from '../value-objects/SnapshotId';
import { ReleaseStatus } from '../types/ReleaseStatus';
import { ReleaseStage } from '../types/ReleaseStage';
import { ChecklistStatus } from '../types/ChecklistStatus';
import type { SnapshotMetadata } from '../types/ReleaseMetadata';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import { createLogger } from '../../../core/logging/logger.service';

const logger = createLogger('ReleaseService');

/**
 * Service configuration options.
 */
export interface ReleaseServiceConfig {
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
 * Release readiness result.
 */
export interface ReleaseReadinessResult {
  isReady: boolean;
  readinessPercentage: number;
  checklistCompletion: number;
  releaseCandidateCompletion: number;
  healthyModules: string[];
  warningModules: string[];
  failedModules: string[];
  criticalIssues: string[];
}

/**
 * Release summary result.
 */
export interface ReleaseSummary {
  totalReleases: number;
  draftReleases: number;
  pendingReleases: number;
  approvedReleases: number;
  publishedReleases: number;
  totalChecklists: number;
  completedChecklists: number;
  pendingChecklists: number;
  blockedChecklists: number;
  latestSnapshotAt: Date | null;
  readinessPercentage: number;
}

/**
 * Release validation report.
 */
export interface ReleaseValidationReport {
  generatedAt: Date;
  backendVersion: string;
  databaseVersion: string;
  gitCommit: string;
  releaseStage: ReleaseStage;
  summary: ReleaseSummary;
  readiness: ReleaseReadinessResult;
  moduleStatuses: ModuleValidationResult[];
  recentSnapshots: ReleaseSnapshot[];
  warnings: string[];
  criticalIssues: string[];
}

/**
 * Release candidate validation result.
 */
export interface ReleaseCandidateValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Checklist validation result.
 */
export interface ChecklistValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Release service for managing release candidate validation operations.
 */
export class ReleaseService {
  private readonly _repository: IReleaseRepository;
  private readonly _autoSnapshotEnabled: boolean;

  constructor(
    repository: IReleaseRepository,
    config?: ReleaseServiceConfig
  ) {
    this._repository = repository;
    this._autoSnapshotEnabled = config?.autoSnapshotEnabled ?? true;
  }

  // ============ Release Candidate Operations ============

  /**
   * Creates a new release candidate.
   */
  async createRelease(params: {
    version: string;
    status?: ReleaseStatus;
    stage?: ReleaseStage;
    metadata?: Record<string, unknown>;
  }): Promise<ReleaseCandidate> {
    try {
      const release = ReleaseCandidate.create({
        version: params.version,
        status: params.status ?? ReleaseStatus.DRAFT,
        stage: params.stage ?? ReleaseStage.RELEASE_CANDIDATE,
        metadata: params.metadata as { notes?: string; tags?: string[]; approvedBy?: string; branch?: string; pipelineId?: string; buildId?: string; releaseNotes?: string } | undefined,
      });

      const created = await this._repository.createRelease(release);
      logger.info(`Created release: ${release.releaseId.value}`, {
        version: params.version,
        status: params.status,
      });
      return created;
    } catch (err) {
      logger.error('Failed to create release', err as Error);
      throw err;
    }
  }

  /**
   * Finds a release by ID.
   */
  async findRelease(id: string): Promise<ReleaseCandidate | null> {
    try {
      const releaseId = ReleaseId.reconstruct(id);
      return await this._repository.findReleaseById(releaseId);
    } catch (err) {
      logger.error(`Failed to find release: ${id}`, err as Error);
      throw err;
    }
  }

  /**
   * Updates a release.
   */
  async updateRelease(
    id: string,
    updates: {
      version?: string;
      status?: ReleaseStatus;
      stage?: ReleaseStage;
      approvedAt?: Date | null;
      metadata?: Record<string, unknown>;
    }
  ): Promise<ReleaseCandidate> {
    try {
      const releaseId = ReleaseId.reconstruct(id);
      const existing = await this._repository.findReleaseById(releaseId);

      if (!existing) {
        throw new Error(`Release not found: ${id}`);
      }

      const updated = existing.copyWith(updates);
      const result = await this._repository.updateRelease(updated);
      logger.info(`Updated release: ${id}`, { updates });
      return result;
    } catch (err) {
      logger.error(`Failed to update release: ${id}`, err as Error);
      throw err;
    }
  }

  /**
   * Marks a release as approved.
   */
  async approveRelease(id: string, approvedBy?: string): Promise<ReleaseCandidate> {
    try {
      const releaseId = ReleaseId.reconstruct(id);
      const existing = await this._repository.findReleaseById(releaseId);

      if (!existing) {
        throw new Error(`Release not found: ${id}`);
      }

      const approved = existing.markApproved(approvedBy);
      const result = await this._repository.updateRelease(approved);
      logger.info(`Approved release: ${id}`, { approvedBy });
      return result;
    } catch (err) {
      logger.error(`Failed to approve release: ${id}`, err as Error);
      throw err;
    }
  }

  /**
   * Marks a release as pending approval.
   */
  async submitForApproval(id: string): Promise<ReleaseCandidate> {
    try {
      const releaseId = ReleaseId.reconstruct(id);
      const existing = await this._repository.findReleaseById(releaseId);

      if (!existing) {
        throw new Error(`Release not found: ${id}`);
      }

      const pending = existing.markPendingApproval();
      const result = await this._repository.updateRelease(pending);
      logger.info(`Submitted release for approval: ${id}`);
      return result;
    } catch (err) {
      logger.error(`Failed to submit release for approval: ${id}`, err as Error);
      throw err;
    }
  }

  /**
   * Marks a release as published.
   */
  async publishRelease(id: string): Promise<ReleaseCandidate> {
    try {
      const releaseId = ReleaseId.reconstruct(id);
      const existing = await this._repository.findReleaseById(releaseId);

      if (!existing) {
        throw new Error(`Release not found: ${id}`);
      }

      const published = existing.markPublished();
      const result = await this._repository.updateRelease(published);
      logger.info(`Published release: ${id}`);
      return result;
    } catch (err) {
      logger.error(`Failed to publish release: ${id}`, err as Error);
      throw err;
    }
  }

  /**
   * Deletes a release.
   */
  async deleteRelease(id: string): Promise<void> {
    try {
      const releaseId = ReleaseId.reconstruct(id);
      await this._repository.deleteRelease(releaseId);
      logger.info(`Deleted release: ${id}`);
    } catch (err) {
      logger.error(`Failed to delete release: ${id}`, err as Error);
      throw err;
    }
  }

  /**
   * Lists releases with pagination and filtering.
   */
  async listReleases(
    params: PaginationParams,
    filters?: ReleaseFilterParams
  ): Promise<PaginatedResult<ReleaseCandidate>> {
    try {
      return await this._repository.listReleases(params, filters);
    } catch (err) {
      logger.error('Failed to list releases', err as Error);
      throw err;
    }
  }

  /**
   * Counts releases with optional filtering.
   */
  async countReleases(filters?: ReleaseFilterParams): Promise<number> {
    try {
      return await this._repository.countReleases(filters);
    } catch (err) {
      logger.error('Failed to count releases', err as Error);
      throw err;
    }
  }

  // ============ Checklist Operations ============

  /**
   * Creates a new checklist item.
   */
  async createChecklist(params: {
    title: string;
    owner?: string;
    status?: ChecklistStatus;
    metadata?: Record<string, unknown>;
  }): Promise<ReleaseChecklist> {
    try {
      const checklist = ReleaseChecklist.create({
        title: params.title,
        owner: params.owner,
        status: params.status ?? ChecklistStatus.PENDING,
        metadata: params.metadata as { category: string; priority: number; releaseId?: string; notes?: string; verifiedAt?: string } | undefined,
      });

      const created = await this._repository.createChecklist(checklist);
      logger.info(`Created checklist: ${checklist.checklistId.value}`, {
        title: params.title,
        status: params.status,
      });
      return created;
    } catch (err) {
      logger.error('Failed to create checklist', err as Error);
      throw err;
    }
  }

  /**
   * Finds a checklist by ID.
   */
  async findChecklist(id: string): Promise<ReleaseChecklist | null> {
    try {
      const checklistId = ChecklistId.reconstruct(id);
      return await this._repository.findChecklistById(checklistId);
    } catch (err) {
      logger.error(`Failed to find checklist: ${id}`, err as Error);
      throw err;
    }
  }

  /**
   * Updates a checklist.
   */
  async updateChecklist(
    id: string,
    updates: {
      title?: string;
      status?: ChecklistStatus;
      owner?: string;
      completedAt?: Date | null;
    }
  ): Promise<ReleaseChecklist> {
    try {
      const checklistId = ChecklistId.reconstruct(id);
      const existing = await this._repository.findChecklistById(checklistId);

      if (!existing) {
        throw new Error(`Checklist not found: ${id}`);
      }

      const updated = existing.copyWith(updates);
      const result = await this._repository.updateChecklist(updated);
      logger.info(`Updated checklist: ${id}`, { updates });
      return result;
    } catch (err) {
      logger.error(`Failed to update checklist: ${id}`, err as Error);
      throw err;
    }
  }

  /**
   * Marks a checklist as completed.
   */
  async completeChecklist(id: string): Promise<ReleaseChecklist> {
    try {
      const checklistId = ChecklistId.reconstruct(id);
      const existing = await this._repository.findChecklistById(checklistId);

      if (!existing) {
        throw new Error(`Checklist not found: ${id}`);
      }

      const completed = existing.markCompleted();
      const result = await this._repository.updateChecklist(completed);
      logger.info(`Completed checklist: ${id}`);
      return result;
    } catch (err) {
      logger.error(`Failed to complete checklist: ${id}`, err as Error);
      throw err;
    }
  }

  /**
   * Marks a checklist as in progress.
   */
  async startChecklist(id: string): Promise<ReleaseChecklist> {
    try {
      const checklistId = ChecklistId.reconstruct(id);
      const existing = await this._repository.findChecklistById(checklistId);

      if (!existing) {
        throw new Error(`Checklist not found: ${id}`);
      }

      const started = existing.markInProgress();
      const result = await this._repository.updateChecklist(started);
      logger.info(`Started checklist: ${id}`);
      return result;
    } catch (err) {
      logger.error(`Failed to start checklist: ${id}`, err as Error);
      throw err;
    }
  }

  /**
   * Marks a checklist as blocked.
   */
  async blockChecklist(id: string): Promise<ReleaseChecklist> {
    try {
      const checklistId = ChecklistId.reconstruct(id);
      const existing = await this._repository.findChecklistById(checklistId);

      if (!existing) {
        throw new Error(`Checklist not found: ${id}`);
      }

      const blocked = existing.markBlocked();
      const result = await this._repository.updateChecklist(blocked);
      logger.info(`Blocked checklist: ${id}`);
      return result;
    } catch (err) {
      logger.error(`Failed to block checklist: ${id}`, err as Error);
      throw err;
    }
  }

  /**
   * Skips a checklist.
   */
  async skipChecklist(id: string): Promise<ReleaseChecklist> {
    try {
      const checklistId = ChecklistId.reconstruct(id);
      const existing = await this._repository.findChecklistById(checklistId);

      if (!existing) {
        throw new Error(`Checklist not found: ${id}`);
      }

      const skipped = existing.markSkipped();
      const result = await this._repository.updateChecklist(skipped);
      logger.info(`Skipped checklist: ${id}`);
      return result;
    } catch (err) {
      logger.error(`Failed to skip checklist: ${id}`, err as Error);
      throw err;
    }
  }

  /**
   * Deletes a checklist.
   */
  async deleteChecklist(id: string): Promise<void> {
    try {
      const checklistId = ChecklistId.reconstruct(id);
      await this._repository.deleteChecklist(checklistId);
      logger.info(`Deleted checklist: ${id}`);
    } catch (err) {
      logger.error(`Failed to delete checklist: ${id}`, err as Error);
      throw err;
    }
  }

  /**
   * Lists checklists with pagination and filtering.
   */
  async listChecklists(
    params: PaginationParams,
    filters?: ChecklistFilterParams
  ): Promise<PaginatedResult<ReleaseChecklist>> {
    try {
      return await this._repository.listChecklists(params, filters);
    } catch (err) {
      logger.error('Failed to list checklists', err as Error);
      throw err;
    }
  }

  /**
   * Counts checklists with optional filtering.
   */
  async countChecklists(filters?: ChecklistFilterParams): Promise<number> {
    try {
      return await this._repository.countChecklists(filters);
    } catch (err) {
      logger.error('Failed to count checklists', err as Error);
      throw err;
    }
  }

  // ============ Snapshot Operations ============

  /**
   * Creates a new snapshot.
   */
  async createSnapshot(params: {
    backendVersion: string;
    databaseVersion: string;
    gitCommit: string;
    metadata?: SnapshotMetadata;
  }): Promise<ReleaseSnapshot> {
    try {
      const snapshot = ReleaseSnapshot.create({
        backendVersion: params.backendVersion,
        databaseVersion: params.databaseVersion,
        gitCommit: params.gitCommit,
        metadata: params.metadata,
      });

      const created = await this._repository.createSnapshot(snapshot);
      logger.info(`Created snapshot: ${snapshot.snapshotId.value}`, {
        backendVersion: params.backendVersion,
        gitCommit: params.gitCommit,
      });
      return created;
    } catch (err) {
      logger.error('Failed to create snapshot', err as Error);
      throw err;
    }
  }

  /**
   * Finds a snapshot by ID.
   */
  async findSnapshot(id: string): Promise<ReleaseSnapshot | null> {
    try {
      const snapshotId = SnapshotId.reconstruct(id);
      return await this._repository.findSnapshotById(snapshotId);
    } catch (err) {
      logger.error(`Failed to find snapshot: ${id}`, err as Error);
      throw err;
    }
  }

  /**
   * Lists snapshots with pagination.
   */
  async listSnapshots(params: PaginationParams): Promise<PaginatedResult<ReleaseSnapshot>> {
    try {
      return await this._repository.listSnapshots(params);
    } catch (err) {
      logger.error('Failed to list snapshots', err as Error);
      throw err;
    }
  }

  /**
   * Deletes a snapshot.
   */
  async deleteSnapshot(id: string): Promise<void> {
    try {
      const snapshotId = SnapshotId.reconstruct(id);
      await this._repository.deleteSnapshot(snapshotId);
      logger.info(`Deleted snapshot: ${id}`);
    } catch (err) {
      logger.error(`Failed to delete snapshot: ${id}`, err as Error);
      throw err;
    }
  }

  /**
   * Counts snapshots.
   */
  async countSnapshots(): Promise<number> {
    try {
      return await this._repository.countSnapshots();
    } catch (err) {
      logger.error('Failed to count snapshots', err as Error);
      throw err;
    }
  }

  // ============ Validation Operations ============

  /**
   * Validates a release candidate.
   */
  async validateReleaseCandidate(releaseId: string): Promise<ReleaseCandidateValidation> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      const release = await this.findRelease(releaseId);

      if (!release) {
        errors.push(`Release not found: ${releaseId}`);
        return { isValid: false, errors, warnings };
      }

      // Validate version format
      if (!release.version || release.version.trim().length === 0) {
        errors.push('Version is required');
      }

      // Validate status transitions
      if (release.status === ReleaseStatus.PENDING_APPROVAL) {
        warnings.push('Release is pending approval');
      }

      if (release.status === ReleaseStatus.REJECTED) {
        errors.push('Release has been rejected');
      }

      // Check for associated checklists
      const checklists = await this.listChecklists({ page: 1, pageSize: 100 });
      const blockedChecklists = checklists.items.filter(c => c.status === ChecklistStatus.BLOCKED);

      if (blockedChecklists.length > 0) {
        errors.push(`${blockedChecklists.length} checklist(s) are blocked`);
      }

      const pendingChecklists = checklists.items.filter(
        c => c.status === ChecklistStatus.PENDING || c.status === ChecklistStatus.IN_PROGRESS
      );

      if (pendingChecklists.length > 0 && release.status === ReleaseStatus.APPROVED) {
        warnings.push(`${pendingChecklists.length} checklist(s) still pending`);
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
      };
    } catch (err) {
      logger.error(`Failed to validate release candidate: ${releaseId}`, err as Error);
      errors.push(`Validation error: ${(err as Error).message}`);
      return { isValid: false, errors, warnings };
    }
  }

  /**
   * Validates all checklists.
   */
  async validateChecklists(): Promise<{
    total: number;
    completed: number;
    pending: number;
    blocked: number;
    issues: string[];
  }> {
    try {
      const [total, completed, pending, blocked] = await Promise.all([
        this._repository.countChecklists(),
        this._repository.countChecklists({ status: ChecklistStatus.COMPLETED }),
        this._repository.countChecklists({ status: ChecklistStatus.PENDING }),
        this._repository.countChecklists({ status: ChecklistStatus.BLOCKED }),
      ]);

      const issues: string[] = [];
      if (blocked > 0) {
        issues.push(`${blocked} checklist(s) are blocked`);
      }
      if (pending > total * 0.5) {
        issues.push(`More than 50% of checklists are still pending`);
      }

      return {
        total,
        completed,
        pending,
        blocked,
        issues,
      };
    } catch (err) {
      logger.error('Failed to validate checklists', err as Error);
      throw err;
    }
  }

  /**
   * Calculates release readiness.
   */
  async calculateReadiness(healthyModules: string[] = []): Promise<ReleaseReadinessResult> {
    try {
      const checklistValidation = await this.validateChecklists();

      const checklistCompletion = checklistValidation.total > 0
        ? (checklistValidation.completed / checklistValidation.total) * 100
        : 0;

      // Calculate release candidate completion based on status
      const [totalReleases, approvedReleases, publishedReleases] = await Promise.all([
        this._repository.countReleases(),
        this._repository.countReleases({ status: ReleaseStatus.APPROVED }),
        this._repository.countReleases({ status: ReleaseStatus.PUBLISHED }),
      ]);

      const releaseCandidateCompletion = totalReleases > 0
        ? ((approvedReleases + publishedReleases) / totalReleases) * 100
        : 0;

      const readinessPercentage = (checklistCompletion * 0.6 + releaseCandidateCompletion * 0.4);

      const failedModules = [
        ...(checklistValidation.blocked > 0 ? ['checklists-blocked'] : []),
      ];

      const warningModules = healthyModules.length > 0 && readinessPercentage < 80
        ? healthyModules.slice(0, Math.ceil(healthyModules.length * 0.3))
        : [];

      const criticalIssues = [...checklistValidation.issues];

      const isReady = checklistCompletion >= 90 &&
        criticalIssues.length === 0;

      return {
        isReady,
        readinessPercentage,
        checklistCompletion,
        releaseCandidateCompletion,
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
   * Gets release summary statistics.
   */
  async getReleaseSummary(): Promise<ReleaseSummary> {
    try {
      const [
        totalReleases,
        draftReleases,
        pendingReleases,
        approvedReleases,
        publishedReleases,
        totalChecklists,
        completedChecklists,
        pendingChecklists,
        blockedChecklists,
        latestSnapshot,
      ] = await Promise.all([
        this._repository.countReleases(),
        this._repository.countReleases({ status: ReleaseStatus.DRAFT }),
        this._repository.countReleases({ status: ReleaseStatus.PENDING_APPROVAL }),
        this._repository.countReleases({ status: ReleaseStatus.APPROVED }),
        this._repository.countReleases({ status: ReleaseStatus.PUBLISHED }),
        this._repository.countChecklists(),
        this._repository.countChecklists({ status: ChecklistStatus.COMPLETED }),
        this._repository.countChecklists({ status: ChecklistStatus.PENDING }),
        this._repository.countChecklists({ status: ChecklistStatus.BLOCKED }),
        this._repository.listSnapshots({ page: 1, pageSize: 1 }),
      ]);

      const readiness = await this.calculateReadiness();

      return {
        totalReleases,
        draftReleases,
        pendingReleases,
        approvedReleases,
        publishedReleases,
        totalChecklists,
        completedChecklists,
        pendingChecklists,
        blockedChecklists,
        latestSnapshotAt: latestSnapshot.items[0]?.createdAt ?? null,
        readinessPercentage: readiness.readinessPercentage,
      };
    } catch (err) {
      logger.error('Failed to get release summary', err as Error);
      throw err;
    }
  }

  /**
   * Generates a comprehensive release validation report.
   */
  async generateValidationReport(params: {
    backendVersion: string;
    databaseVersion: string;
    gitCommit: string;
    releaseStage?: ReleaseStage;
    healthyModules?: string[];
  }): Promise<ReleaseValidationReport> {
    try {
      const [summary, readiness, recentSnapshots] = await Promise.all([
        this.getReleaseSummary(),
        this.calculateReadiness(params.healthyModules ?? []),
        this._repository.listSnapshots({ page: 1, pageSize: 5 }),
      ]);

      // Build module statuses from readiness data
      const moduleStatuses: ModuleValidationResult[] = [];

      // Add checklists module status
      moduleStatuses.push({
        moduleName: 'ReleaseChecklists',
        isHealthy: readiness.failedModules.every(m => m !== 'checklists-blocked'),
        warnings: readiness.warningModules.includes('checklists') ? ['Some checklists remain pending'] : [],
        errors: readiness.failedModules.includes('checklists-blocked') ? ['Blocked checklists found'] : [],
      });

      // Add releases module status
      moduleStatuses.push({
        moduleName: 'ReleaseCandidates',
        isHealthy: summary.pendingReleases === 0,
        warnings: summary.pendingReleases > 0 ? ['Releases pending approval'] : [],
        errors: [],
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
      if (summary.pendingChecklists > summary.totalChecklists * 0.5) {
        warnings.push('More than 50% of checklists are pending');
      }

      return {
        generatedAt: new Date(),
        backendVersion: params.backendVersion,
        databaseVersion: params.databaseVersion,
        gitCommit: params.gitCommit,
        releaseStage: params.releaseStage ?? ReleaseStage.RELEASE_CANDIDATE,
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
