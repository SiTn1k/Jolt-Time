/**
 * Production Service
 *
 * Main service for managing production certification operations.
 * Handles checklist validation, certificate management, and snapshot generation.
 *
 * IMPORTANT: Production Service is a FOUNDATION layer. It ONLY stores metadata,
 * validates readiness, and generates reports. Production Service MUST NEVER modify
 * gameplay, balances, rewards, inventory, or player state.
 */

import type { IProductionRepository } from '../interfaces/IProductionRepository';
import type { ProductionCertificateFilterParams, ProductionChecklistFilterParams } from '../interfaces/IProductionRepository';
import { ProductionCertificate } from '../entities/ProductionCertificate';
import { ProductionChecklist } from '../entities/ProductionChecklist';
import { ProductionSnapshot } from '../entities/ProductionSnapshot';
import { CertificateId } from '../value-objects/CertificateId';
import { ChecklistId } from '../value-objects/ChecklistId';
import { SnapshotId } from '../value-objects/SnapshotId';
import { ChecklistStatus } from '../types/ChecklistStatus';
import { CertificationStatus } from '../types/CertificationStatus';
import { ProductionStatus } from '../types/ProductionStatus';
import type { SystemHealth } from '../types/ProductionMetadata';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import { createLogger } from '../../../core/logging/logger.service';

const logger = createLogger('ProductionService');

/**
 * Service configuration options.
 */
export interface ProductionServiceConfig {
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
 * Production readiness result.
 */
export interface ProductionReadinessResult {
  isReady: boolean;
  readinessPercentage: number;
  checklistCompletion: number;
  certificateCompletion: number;
  healthyModules: string[];
  warningModules: string[];
  failedModules: string[];
  criticalIssues: string[];
}

/**
 * Production summary result.
 */
export interface ProductionSummary {
  totalChecklists: number;
  completedChecklists: number;
  pendingChecklists: number;
  blockedChecklists: number;
  totalCertificates: number;
  activeCertificates: number;
  expiredCertificates: number;
  latestSnapshotId: string | null;
  latestSnapshotAt: Date | null;
  readinessPercentage: number;
}

/**
 * Production validation report.
 */
export interface ProductionValidationReport {
  generatedAt: Date;
  backendVersion: string;
  databaseVersion: string;
  summary: ProductionSummary;
  readiness: ProductionReadinessResult;
  moduleStatuses: ModuleValidationResult[];
  recentSnapshots: ProductionSnapshot[];
  certificates: ProductionCertificate[];
}

/**
 * Backend system summary for final certification.
 */
export interface BackendSystemSummary {
  backendVersion: string;
  databaseVersion: string;
  gitCommit: string;
  registeredModules: string[];
  healthyModules: string[];
  warningModules: string[];
  failedModules: string[];
  warnings: string[];
  criticalIssues: string[];
  readinessScore: number;
  architectureCompliance: boolean;
  dependencyStatus: 'valid' | 'issues_found' | 'not_validated';
  infrastructureStatus: 'valid' | 'issues_found' | 'not_validated';
  regressionStatus: 'passed' | 'failed' | 'not_run';
}

/**
 * Production service for managing production certification operations.
 */
export class ProductionService {
  private readonly _repository: IProductionRepository;
  private readonly _autoSnapshotEnabled: boolean;

  constructor(
    repository: IProductionRepository,
    config?: ProductionServiceConfig
  ) {
    this._repository = repository;
    this._autoSnapshotEnabled = config?.autoSnapshotEnabled ?? true;
  }

  // ============ Certificate Operations ============

  /**
   * Creates a new certificate.
   */
  async createCertificate(params: {
    version: string;
    approvedBy: string;
    metadata?: Record<string, unknown>;
    productionStatus?: ProductionStatus;
    expiresAt?: Date | null;
  }): Promise<ProductionCertificate> {
    try {
      const certificate = ProductionCertificate.create({
        version: params.version,
        approvedBy: params.approvedBy,
        metadata: params.metadata as { issuer?: string; subject?: string; notes?: string } | undefined,
        productionStatus: params.productionStatus ?? ProductionStatus.NOT_STARTED,
        expiresAt: params.expiresAt,
      });

      const created = await this._repository.createCertificate(certificate);
      logger.info(`Created certificate: ${certificate.certificateId.value}`, {
        version: params.version,
        status: created.status,
      });
      return created;
    } catch (err) {
      logger.error('Failed to create certificate', err as Error);
      throw err;
    }
  }

  /**
   * Finds a certificate by ID.
   */
  async findCertificate(id: string): Promise<ProductionCertificate | null> {
    try {
      const certificateId = CertificateId.reconstruct(id);
      return await this._repository.findCertificateById(certificateId);
    } catch (err) {
      logger.error(`Failed to find certificate: ${id}`, err as Error);
      throw err;
    }
  }

  /**
   * Updates a certificate.
   */
  async updateCertificate(
    id: string,
    updates: {
      version?: string;
      status?: CertificationStatus;
      approvedBy?: string;
      metadata?: Record<string, unknown>;
      productionStatus?: ProductionStatus;
      expiresAt?: Date | null;
    }
  ): Promise<ProductionCertificate> {
    try {
      const certificateId = CertificateId.reconstruct(id);
      const existing = await this._repository.findCertificateById(certificateId);

      if (!existing) {
        throw new Error(`Certificate not found: ${id}`);
      }

      const updated = existing.copyWith(updates);
      const result = await this._repository.updateCertificate(updated);
      logger.info(`Updated certificate: ${id}`, { updates });
      return result;
    } catch (err) {
      logger.error(`Failed to update certificate: ${id}`, err as Error);
      throw err;
    }
  }

  /**
   * Marks a certificate as certified.
   */
  async certifyCertificate(id: string): Promise<ProductionCertificate> {
    try {
      const certificateId = CertificateId.reconstruct(id);
      const existing = await this._repository.findCertificateById(certificateId);

      if (!existing) {
        throw new Error(`Certificate not found: ${id}`);
      }

      const certified = existing.markCertified();
      const result = await this._repository.updateCertificate(certified);
      logger.info(`Certified certificate: ${id}`);
      return result;
    } catch (err) {
      logger.error(`Failed to certify certificate: ${id}`, err as Error);
      throw err;
    }
  }

  /**
   * Revokes a certificate.
   */
  async revokeCertificate(id: string): Promise<ProductionCertificate> {
    try {
      const certificateId = CertificateId.reconstruct(id);
      const existing = await this._repository.findCertificateById(certificateId);

      if (!existing) {
        throw new Error(`Certificate not found: ${id}`);
      }

      const revoked = existing.markRevoked();
      const result = await this._repository.updateCertificate(revoked);
      logger.info(`Revoked certificate: ${id}`);
      return result;
    } catch (err) {
      logger.error(`Failed to revoke certificate: ${id}`, err as Error);
      throw err;
    }
  }

  /**
   * Deletes a certificate.
   */
  async deleteCertificate(id: string): Promise<void> {
    try {
      const certificateId = CertificateId.reconstruct(id);
      await this._repository.deleteCertificate(certificateId);
      logger.info(`Deleted certificate: ${id}`);
    } catch (err) {
      logger.error(`Failed to delete certificate: ${id}`, err as Error);
      throw err;
    }
  }

  /**
   * Lists certificates with pagination and filtering.
   */
  async listCertificates(
    params: PaginationParams,
    filters?: ProductionCertificateFilterParams
  ): Promise<PaginatedResult<ProductionCertificate>> {
    try {
      return await this._repository.listCertificates(params, filters);
    } catch (err) {
      logger.error('Failed to list certificates', err as Error);
      throw err;
    }
  }

  /**
   * Counts certificates with optional filtering.
   */
  async countCertificates(filters?: ProductionCertificateFilterParams): Promise<number> {
    try {
      return await this._repository.countCertificates(filters);
    } catch (err) {
      logger.error('Failed to count certificates', err as Error);
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
  }): Promise<ProductionChecklist> {
    try {
      const checklist = ProductionChecklist.create({
        title: params.title,
        owner: params.owner,
        status: params.status ?? ChecklistStatus.PENDING,
        metadata: params.metadata as { category: string; priority: number; description?: string } | undefined,
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
  async findChecklist(id: string): Promise<ProductionChecklist | null> {
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
      metadata?: Record<string, unknown>;
    }
  ): Promise<ProductionChecklist> {
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
  async completeChecklist(id: string): Promise<ProductionChecklist> {
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
    filters?: ProductionChecklistFilterParams
  ): Promise<PaginatedResult<ProductionChecklist>> {
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
  async countChecklists(filters?: ProductionChecklistFilterParams): Promise<number> {
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
    systemHealth?: SystemHealth;
    metadata?: Record<string, unknown>;
  }): Promise<ProductionSnapshot> {
    try {
      const snapshot = ProductionSnapshot.create({
        backendVersion: params.backendVersion,
        databaseVersion: params.databaseVersion,
        systemHealth: params.systemHealth ?? { status: 'healthy' },
        metadata: params.metadata as { environment: string; region?: string } | undefined,
      });

      const created = await this._repository.createSnapshot(snapshot);
      logger.info(`Created snapshot: ${snapshot.snapshotId.value}`, {
        backendVersion: params.backendVersion,
        databaseVersion: params.databaseVersion,
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
  async findSnapshot(id: string): Promise<ProductionSnapshot | null> {
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
  async listSnapshots(params: PaginationParams): Promise<PaginatedResult<ProductionSnapshot>> {
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
   * Validates all certificates.
   */
  async validateCertificates(): Promise<{
    total: number;
    active: number;
    expired: number;
    revoked: number;
    issues: string[];
  }> {
    try {
      const [total, active, expired, revoked] = await Promise.all([
        this._repository.countCertificates(),
        this._repository.countCertificates({ status: CertificationStatus.CERTIFIED }),
        this._repository.countCertificates({ status: CertificationStatus.EXPIRED }),
        this._repository.countCertificates({ status: CertificationStatus.REVOKED }),
      ]);

      const issues: string[] = [];
      if (revoked > 0) {
        issues.push(`${revoked} certificate(s) have been revoked`);
      }
      if (active === 0 && total > 0) {
        issues.push('No active certificates found');
      }

      return {
        total,
        active,
        expired,
        revoked,
        issues,
      };
    } catch (err) {
      logger.error('Failed to validate certificates', err as Error);
      throw err;
    }
  }

  /**
   * Calculates production readiness.
   */
  async calculateReadiness(healthyModules: string[] = []): Promise<ProductionReadinessResult> {
    try {
      const checklistValidation = await this.validateChecklists();
      const certificateValidation = await this.validateCertificates();

      const checklistCompletion = checklistValidation.total > 0
        ? (checklistValidation.completed / checklistValidation.total) * 100
        : 0;

      const certificateCompletion = certificateValidation.total > 0
        ? (certificateValidation.active / certificateValidation.total) * 100
        : 0;

      const readinessPercentage = (checklistCompletion * 0.6 + certificateCompletion * 0.4);

      const failedModules = [
        ...(checklistValidation.blocked > 0 ? ['checklists'] : []),
        ...(certificateValidation.revoked > 0 ? ['certificates-revoked'] : []),
      ];

      const warningModules = healthyModules.length > 0 && readinessPercentage < 80
        ? healthyModules.slice(0, Math.ceil(healthyModules.length * 0.3))
        : [];

      const criticalIssues = [
        ...checklistValidation.issues,
        ...certificateValidation.issues,
      ];

      const isReady = checklistCompletion >= 90 &&
        certificateValidation.active > 0 &&
        criticalIssues.length === 0;

      return {
        isReady,
        readinessPercentage,
        checklistCompletion,
        certificateCompletion,
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
   * Gets production summary statistics.
   */
  async getProductionSummary(): Promise<ProductionSummary> {
    try {
      const [
        totalChecklists,
        completedChecklists,
        pendingChecklists,
        blockedChecklists,
        totalCertificates,
        activeCertificates,
        expiredCertificates,
        latestSnapshotResult,
      ] = await Promise.all([
        this._repository.countChecklists(),
        this._repository.countChecklists({ status: ChecklistStatus.COMPLETED }),
        this._repository.countChecklists({ status: ChecklistStatus.PENDING }),
        this._repository.countChecklists({ status: ChecklistStatus.BLOCKED }),
        this._repository.countCertificates(),
        this._repository.countCertificates({ status: CertificationStatus.CERTIFIED }),
        this._repository.countCertificates({ status: CertificationStatus.EXPIRED }),
        this._repository.listSnapshots({ page: 1, pageSize: 1 }),
      ]);

      const readiness = await this.calculateReadiness();

      return {
        totalChecklists,
        completedChecklists,
        pendingChecklists,
        blockedChecklists,
        totalCertificates,
        activeCertificates,
        expiredCertificates,
        latestSnapshotId: latestSnapshotResult.items[0]?.snapshotId.value ?? null,
        latestSnapshotAt: latestSnapshotResult.items[0]?.createdAt ?? null,
        readinessPercentage: readiness.readinessPercentage,
      };
    } catch (err) {
      logger.error('Failed to get production summary', err as Error);
      throw err;
    }
  }

  /**
   * Generates a comprehensive production validation report.
   */
  async generateValidationReport(params: {
    backendVersion: string;
    databaseVersion: string;
    healthyModules?: string[];
  }): Promise<ProductionValidationReport> {
    try {
      const [summary, readiness, recentSnapshots, certificates] = await Promise.all([
        this.getProductionSummary(),
        this.calculateReadiness(params.healthyModules ?? []),
        this._repository.listSnapshots({ page: 1, pageSize: 5 }),
        this._repository.listCertificates({ page: 1, pageSize: 10 }),
      ]);

      // Build module statuses from readiness data
      const moduleStatuses: ModuleValidationResult[] = [];

      // Add checklists module status
      moduleStatuses.push({
        moduleName: 'ProductionChecklists',
        isHealthy: readiness.failedModules.every(m => m !== 'checklists'),
        warnings: readiness.warningModules.includes('checklists') ? ['Some checklists remain pending'] : [],
        errors: readiness.failedModules.includes('checklists') ? ['Blocked checklists found'] : [],
      });

      // Add certificates module status
      moduleStatuses.push({
        moduleName: 'ProductionCertificates',
        isHealthy: !readiness.failedModules.some(m => m.includes('certificates')),
        warnings: readiness.warningModules.includes('certificates') ? ['Certificate issues detected'] : [],
        errors: readiness.failedModules.some(m => m.includes('certificates')) ? ['Revoked certificates found'] : [],
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
        summary,
        readiness,
        moduleStatuses,
        recentSnapshots: recentSnapshots.items,
        certificates: certificates.items,
      };
    } catch (err) {
      logger.error('Failed to generate validation report', err as Error);
      throw err;
    }
  }

  /**
   * Generates the final backend system summary for production certification.
   */
  async generateBackendSummary(params: {
    backendVersion: string;
    databaseVersion: string;
    gitCommit: string;
    registeredModules?: string[];
    healthyModules?: string[];
    warningModules?: string[];
    failedModules?: string[];
    warnings?: string[];
    criticalIssues?: string[];
    architectureCompliance?: boolean;
    dependencyStatus?: 'valid' | 'issues_found' | 'not_validated';
    infrastructureStatus?: 'valid' | 'issues_found' | 'not_validated';
    regressionStatus?: 'passed' | 'failed' | 'not_run';
  }): Promise<BackendSystemSummary> {
    try {
      const readiness = await this.calculateReadiness(params.healthyModules ?? []);

      return {
        backendVersion: params.backendVersion,
        databaseVersion: params.databaseVersion,
        gitCommit: params.gitCommit,
        registeredModules: params.registeredModules ?? [],
        healthyModules: params.healthyModules ?? [],
        warningModules: params.warningModules ?? [],
        failedModules: params.failedModules ?? [],
        warnings: params.warnings ?? [],
        criticalIssues: params.criticalIssues ?? [],
        readinessScore: readiness.readinessPercentage,
        architectureCompliance: params.architectureCompliance ?? true,
        dependencyStatus: params.dependencyStatus ?? 'not_validated',
        infrastructureStatus: params.infrastructureStatus ?? 'not_validated',
        regressionStatus: params.regressionStatus ?? 'not_run',
      };
    } catch (err) {
      logger.error('Failed to generate backend summary', err as Error);
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
