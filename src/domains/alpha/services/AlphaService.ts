/**
 * Alpha Service
 *
 * Main service for managing alpha testing validation operations.
 * Handles checklist validation, milestone tracking, and snapshot generation.
 *
 * IMPORTANT: Alpha Service is a FOUNDATION layer. It ONLY stores metadata,
 * validates readiness, and generates reports. Alpha Service MUST NEVER modify
 * gameplay, balances, rewards, inventory, or player state.
 */

import type { IAlphaRepository } from '../interfaces/IAlphaRepository';
import type { AlphaChecklistFilterParams, AlphaMilestoneFilterParams } from '../interfaces/IAlphaRepository';
import { AlphaChecklist } from '../entities/AlphaChecklist';
import { AlphaMilestone } from '../entities/AlphaMilestone';
import { AlphaSnapshot } from '../entities/AlphaSnapshot';
import { ChecklistId } from '../value-objects/ChecklistId';
import { MilestoneId } from '../value-objects/MilestoneId';
import { SnapshotId } from '../value-objects/SnapshotId';
import { ChecklistStatus } from '../types/ChecklistStatus';
import { MilestoneStatus } from '../types/MilestoneStatus';
import { ReleaseStage } from '../types/ReleaseStage';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import { createLogger } from '../../../core/logging/logger.service';

const logger = createLogger('AlphaService');

/**
 * Service configuration options.
 */
export interface AlphaServiceConfig {
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
 * Alpha readiness result.
 */
export interface AlphaReadinessResult {
  isReady: boolean;
  readinessPercentage: number;
  checklistCompletion: number;
  milestoneCompletion: number;
  healthyModules: string[];
  warningModules: string[];
  failedModules: string[];
  criticalIssues: string[];
}

/**
 * Alpha summary result.
 */
export interface AlphaSummary {
  totalChecklists: number;
  completedChecklists: number;
  pendingChecklists: number;
  totalMilestones: number;
  completedMilestones: number;
  plannedMilestones: number;
  latestSnapshotAt: Date | null;
  readinessPercentage: number;
}

/**
 * Alpha validation report.
 */
export interface AlphaValidationReport {
  generatedAt: Date;
  backendVersion: string;
  databaseVersion: string;
  releaseStage: ReleaseStage;
  summary: AlphaSummary;
  readiness: AlphaReadinessResult;
  moduleStatuses: ModuleValidationResult[];
  recentSnapshots: AlphaSnapshot[];
}

/**
 * Alpha service for managing alpha testing validation operations.
 */
export class AlphaService {
  private readonly _repository: IAlphaRepository;
  private readonly _autoSnapshotEnabled: boolean;

  constructor(
    repository: IAlphaRepository,
    config?: AlphaServiceConfig
  ) {
    this._repository = repository;
    this._autoSnapshotEnabled = config?.autoSnapshotEnabled ?? true;
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
  }): Promise<AlphaChecklist> {
    try {
      const checklist = AlphaChecklist.create({
        title: params.title,
        owner: params.owner,
        status: params.status ?? ChecklistStatus.PENDING,
        metadata: params.metadata as { category: string; priority: number } | undefined,
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
  async findChecklist(id: string): Promise<AlphaChecklist | null> {
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
  ): Promise<AlphaChecklist> {
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
  async completeChecklist(id: string): Promise<AlphaChecklist> {
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
    filters?: AlphaChecklistFilterParams
  ): Promise<PaginatedResult<AlphaChecklist>> {
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
  async countChecklists(filters?: AlphaChecklistFilterParams): Promise<number> {
    try {
      return await this._repository.countChecklists(filters);
    } catch (err) {
      logger.error('Failed to count checklists', err as Error);
      throw err;
    }
  }

  // ============ Milestone Operations ============

  /**
   * Creates a new milestone.
   */
  async createMilestone(params: {
    title: string;
    targetDate?: Date | null;
    status?: MilestoneStatus;
    metadata?: Record<string, unknown>;
  }): Promise<AlphaMilestone> {
    try {
      const milestone = AlphaMilestone.create({
        title: params.title,
        targetDate: params.targetDate,
        status: params.status ?? MilestoneStatus.PLANNED,
        metadata: params.metadata as { category: string; goals: string[]; criteria: string[] } | undefined,
      });

      const created = await this._repository.createMilestone(milestone);
      logger.info(`Created milestone: ${milestone.milestoneId.value}`, {
        title: params.title,
        status: params.status,
      });
      return created;
    } catch (err) {
      logger.error('Failed to create milestone', err as Error);
      throw err;
    }
  }

  /**
   * Finds a milestone by ID.
   */
  async findMilestone(id: string): Promise<AlphaMilestone | null> {
    try {
      const milestoneId = MilestoneId.reconstruct(id);
      return await this._repository.findMilestoneById(milestoneId);
    } catch (err) {
      logger.error(`Failed to find milestone: ${id}`, err as Error);
      throw err;
    }
  }

  /**
   * Updates a milestone.
   */
  async updateMilestone(
    id: string,
    updates: {
      title?: string;
      status?: MilestoneStatus;
      targetDate?: Date | null;
      completedAt?: Date | null;
    }
  ): Promise<AlphaMilestone> {
    try {
      const milestoneId = MilestoneId.reconstruct(id);
      const existing = await this._repository.findMilestoneById(milestoneId);

      if (!existing) {
        throw new Error(`Milestone not found: ${id}`);
      }

      const updated = existing.copyWith(updates);
      const result = await this._repository.updateMilestone(updated);
      logger.info(`Updated milestone: ${id}`, { updates });
      return result;
    } catch (err) {
      logger.error(`Failed to update milestone: ${id}`, err as Error);
      throw err;
    }
  }

  /**
   * Marks a milestone as completed.
   */
  async completeMilestone(id: string): Promise<AlphaMilestone> {
    try {
      const milestoneId = MilestoneId.reconstruct(id);
      const existing = await this._repository.findMilestoneById(milestoneId);

      if (!existing) {
        throw new Error(`Milestone not found: ${id}`);
      }

      const completed = existing.markCompleted();
      const result = await this._repository.updateMilestone(completed);
      logger.info(`Completed milestone: ${id}`);
      return result;
    } catch (err) {
      logger.error(`Failed to complete milestone: ${id}`, err as Error);
      throw err;
    }
  }

  /**
   * Deletes a milestone.
   */
  async deleteMilestone(id: string): Promise<void> {
    try {
      const milestoneId = MilestoneId.reconstruct(id);
      await this._repository.deleteMilestone(milestoneId);
      logger.info(`Deleted milestone: ${id}`);
    } catch (err) {
      logger.error(`Failed to delete milestone: ${id}`, err as Error);
      throw err;
    }
  }

  /**
   * Lists milestones with pagination and filtering.
   */
  async listMilestones(
    params: PaginationParams,
    filters?: AlphaMilestoneFilterParams
  ): Promise<PaginatedResult<AlphaMilestone>> {
    try {
      return await this._repository.listMilestones(params, filters);
    } catch (err) {
      logger.error('Failed to list milestones', err as Error);
      throw err;
    }
  }

  /**
   * Counts milestones with optional filtering.
   */
  async countMilestones(filters?: AlphaMilestoneFilterParams): Promise<number> {
    try {
      return await this._repository.countMilestones(filters);
    } catch (err) {
      logger.error('Failed to count milestones', err as Error);
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
    moduleCount: number;
    metadata?: Record<string, unknown>;
  }): Promise<AlphaSnapshot> {
    try {
      const snapshot = AlphaSnapshot.create({
        backendVersion: params.backendVersion,
        databaseVersion: params.databaseVersion,
        moduleCount: params.moduleCount,
        metadata: params.metadata as { environment: string } | undefined,
      });

      const created = await this._repository.createSnapshot(snapshot);
      logger.info(`Created snapshot: ${snapshot.snapshotId.value}`, {
        backendVersion: params.backendVersion,
        moduleCount: params.moduleCount,
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
  async findSnapshot(id: string): Promise<AlphaSnapshot | null> {
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
  async listSnapshots(params: PaginationParams): Promise<PaginatedResult<AlphaSnapshot>> {
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
   * Validates all milestones.
   */
  async validateMilestones(): Promise<{
    total: number;
    completed: number;
    planned: number;
    delayed: number;
    overdue: number;
    issues: string[];
  }> {
    try {
      const [total, completed, planned, delayed] = await Promise.all([
        this._repository.countMilestones(),
        this._repository.countMilestones({ status: MilestoneStatus.COMPLETED }),
        this._repository.countMilestones({ status: MilestoneStatus.PLANNED }),
        this._repository.countMilestones({ status: MilestoneStatus.DELAYED }),
      ]);

      // Check for overdue milestones
      const milestones = await this._repository.listMilestones({ page: 1, pageSize: 100 });
      const overdue = milestones.items.filter(m => m.isOverdue).length;

      const issues: string[] = [];
      if (delayed > 0) {
        issues.push(`${delayed} milestone(s) are delayed`);
      }
      if (overdue > 0) {
        issues.push(`${overdue} milestone(s) are overdue`);
      }
      if (completed < total * 0.3) {
        issues.push(`Less than 30% of milestones are completed`);
      }

      return {
        total,
        completed,
        planned,
        delayed,
        overdue,
        issues,
      };
    } catch (err) {
      logger.error('Failed to validate milestones', err as Error);
      throw err;
    }
  }

  /**
   * Calculates alpha readiness.
   */
  async calculateReadiness(healthyModules: string[] = []): Promise<AlphaReadinessResult> {
    try {
      const checklistValidation = await this.validateChecklists();
      const milestoneValidation = await this.validateMilestones();

      const checklistCompletion = checklistValidation.total > 0
        ? (checklistValidation.completed / checklistValidation.total) * 100
        : 0;

      const milestoneCompletion = milestoneValidation.total > 0
        ? (milestoneValidation.completed / milestoneValidation.total) * 100
        : 0;

      const readinessPercentage = (checklistCompletion * 0.4 + milestoneCompletion * 0.6);

      const failedModules = [
        ...(checklistValidation.blocked > 0 ? ['checklists'] : []),
        ...(milestoneValidation.delayed > 0 ? ['milestones-delayed'] : []),
        ...(milestoneValidation.overdue > 0 ? ['milestones-overdue'] : []),
      ];

      const warningModules = healthyModules.length > 0 && readinessPercentage < 80
        ? healthyModules.slice(0, Math.ceil(healthyModules.length * 0.3))
        : [];

      const criticalIssues = [
        ...checklistValidation.issues,
        ...milestoneValidation.issues,
      ];

      const isReady = checklistCompletion >= 80 &&
        milestoneCompletion >= 70 &&
        criticalIssues.length === 0;

      return {
        isReady,
        readinessPercentage,
        checklistCompletion,
        milestoneCompletion,
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
   * Gets alpha summary statistics.
   */
  async getAlphaSummary(): Promise<AlphaSummary> {
    try {
      const [
        totalChecklists,
        completedChecklists,
        pendingChecklists,
        totalMilestones,
        completedMilestones,
        plannedMilestones,
        latestSnapshot,
      ] = await Promise.all([
        this._repository.countChecklists(),
        this._repository.countChecklists({ status: ChecklistStatus.COMPLETED }),
        this._repository.countChecklists({ status: ChecklistStatus.PENDING }),
        this._repository.countMilestones(),
        this._repository.countMilestones({ status: MilestoneStatus.COMPLETED }),
        this._repository.countMilestones({ status: MilestoneStatus.PLANNED }),
        this._repository.listSnapshots({ page: 1, pageSize: 1 }),
      ]);

      const readiness = await this.calculateReadiness();

      return {
        totalChecklists,
        completedChecklists,
        pendingChecklists,
        totalMilestones,
        completedMilestones,
        plannedMilestones,
        latestSnapshotAt: latestSnapshot.items[0]?.createdAt ?? null,
        readinessPercentage: readiness.readinessPercentage,
      };
    } catch (err) {
      logger.error('Failed to get alpha summary', err as Error);
      throw err;
    }
  }

  /**
   * Generates a comprehensive alpha validation report.
   */
  async generateValidationReport(params: {
    backendVersion: string;
    databaseVersion: string;
    releaseStage?: ReleaseStage;
    healthyModules?: string[];
  }): Promise<AlphaValidationReport> {
    try {
      const [summary, readiness, recentSnapshots] = await Promise.all([
        this.getAlphaSummary(),
        this.calculateReadiness(params.healthyModules ?? []),
        this._repository.listSnapshots({ page: 1, pageSize: 5 }),
      ]);

      // Build module statuses from readiness data
      const moduleStatuses: ModuleValidationResult[] = [];

      // Add checklists module status
      moduleStatuses.push({
        moduleName: 'AlphaChecklists',
        isHealthy: readiness.failedModules.every(m => m !== 'checklists'),
        warnings: readiness.warningModules.includes('checklists') ? ['Some checklists remain pending'] : [],
        errors: readiness.failedModules.includes('checklists') ? ['Blocked checklists found'] : [],
      });

      // Add milestones module status
      moduleStatuses.push({
        moduleName: 'AlphaMilestones',
        isHealthy: !readiness.failedModules.some(m => m.includes('milestones')),
        warnings: readiness.warningModules.includes('milestones-pending') ? ['Milestones pending completion'] : [],
        errors: readiness.failedModules.some(m => m.includes('milestones')) ? ['Delayed or overdue milestones'] : [],
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

      return {
        generatedAt: new Date(),
        backendVersion: params.backendVersion,
        databaseVersion: params.databaseVersion,
        releaseStage: params.releaseStage ?? ReleaseStage.INTERNAL_ALPHA,
        summary,
        readiness,
        moduleStatuses,
        recentSnapshots: recentSnapshots.items,
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