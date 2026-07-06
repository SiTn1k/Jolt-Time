/**
 * HardeningService
 *
 * Production hardening validation and reporting service.
 *
 * Responsibilities:
 * - Validate Hardening Rules
 * - Generate Hardening Snapshot
 * - Generate Hardening Report
 * - Generate System Summary
 *
 * This service ONLY checks, verifies, measures, reports - it NEVER:
 * - Modifies gameplay
 * - Grants rewards
 * - Modifies inventory
 * - Rewrites business logic
 * - Automatically repairs issues
 */

import type { IHardeningRepository, RuleFilterParams, ChecklistFilterParams } from '../interfaces/IHardeningRepository';
import type { HardeningRule } from '../entities/HardeningRule';
import { HardeningRule as HardeningRuleClass } from '../entities/HardeningRule';
import type { HardeningChecklist } from '../entities/HardeningChecklist';
import { HardeningChecklist as HardeningChecklistClass } from '../entities/HardeningChecklist';
import type { HardeningSnapshot } from '../entities/HardeningSnapshot';
import { HardeningSnapshot as HardeningSnapshotClass } from '../entities/HardeningSnapshot';
import type { SnapshotId } from '../value-objects/SnapshotId';
import { RuleId } from '../value-objects/RuleId';
import { ChecklistId } from '../value-objects/ChecklistId';
import { HardeningStatus } from '../types/HardeningStatus';
import { RulePriority } from '../types/RulePriority';
import { ChecklistStatus } from '../types/ChecklistStatus';
import type { HardeningStatistics, SystemHealthSummary, SnapshotMetadata } from '../types/HardeningMetadata';
import { createLogger } from '../../../core/logging/logger.service';

const logger = createLogger('HardeningService');

/**
 * System validation result.
 */
export interface SystemValidationResult {
  isHealthy: boolean;
  timestamp: Date;
  checks: ValidationCheck[];
  warnings: string[];
  criticalIssues: string[];
  overallHealth: 'healthy' | 'degraded' | 'unhealthy';
}

/**
 * Individual validation check.
 */
export interface ValidationCheck {
  name: string;
  passed: boolean;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Hardening report containing system analysis.
 */
export interface HardeningReport {
  generatedAt: Date;
  systemVersion: string;
  statistics: HardeningStatistics;
  systemHealth: SystemHealthSummary;
  validationResult: SystemValidationResult;
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Backend module information.
 */
export interface ModuleInfo {
  name: string;
  isRegistered: boolean;
  isHealthy: boolean;
  warnings: string[];
}

/**
 * Dependency check result.
 */
export interface DependencyCheckResult {
  hasCircularDependencies: boolean;
  hasDuplicateProviders: boolean;
  hasMissingRegistrations: boolean;
  issues: string[];
}

/**
 * Configuration integrity check result.
 */
export interface ConfigurationCheckResult {
  isValid: boolean;
  missingKeys: string[];
  invalidValues: string[];
}

/**
 * HardeningService configuration.
 */
export interface HardeningServiceConfig {
  systemVersion: string;
  gitCommit?: string;
}

/**
 * HardeningService for production hardening validation and reporting.
 *
 * This service is non-invasive - it only reads and reports.
 */
export class HardeningService {
  private readonly repository: IHardeningRepository;
  private readonly systemVersion: string;
  private readonly gitCommit?: string;

  /**
   * Creates a new HardeningService instance.
   */
  constructor(repository: IHardeningRepository, config: HardeningServiceConfig) {
    this.repository = repository;
    this.systemVersion = config.systemVersion;
    this.gitCommit = config.gitCommit;
  }

  // =========================================================================
  // SNAPSHOT GENERATION
  // =========================================================================

  /**
   * Generates a hardening snapshot of the current system state.
   */
  async generateSnapshot(
    moduleCount: number,
    healthStatus: string = 'healthy',
    additionalMetadata?: Record<string, unknown>
  ): Promise<HardeningSnapshot> {
    logger.info('Generating hardening snapshot', { systemVersion: this.systemVersion });

    const snapshotMetadata: SnapshotMetadata = {
      environment: process.env.NODE_ENV ?? 'development',
      ...additionalMetadata,
    };

    if (this.gitCommit) {
      snapshotMetadata.deploymentId = this.gitCommit;
    }

    const snapshot = HardeningSnapshotClass.create({
      systemVersion: this.systemVersion,
      moduleCount,
      healthStatus,
      metadata: snapshotMetadata,
    });

    // Persist the snapshot
    const savedSnapshot = await this.repository.createSnapshot(snapshot);

    logger.info('Hardening snapshot generated', { snapshotId: savedSnapshot.snapshotId.value });

    return savedSnapshot;
  }

  /**
   * Finds a snapshot by ID.
   */
  async findSnapshot(id: SnapshotId): Promise<HardeningSnapshot | null> {
    return this.repository.findSnapshotById(id);
  }

  /**
   * Lists snapshots with pagination.
   */
  async listSnapshots(page: number = 1, pageSize: number = 20): Promise<{
    items: HardeningSnapshot[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    return this.repository.listSnapshots({ page, pageSize });
  }

  // =========================================================================
  // RULE VALIDATION
  // =========================================================================

  /**
   * Validates a hardening rule.
   */
  async validateRule(rule: HardeningRule): Promise<ValidationCheck> {
    const check: ValidationCheck = {
      name: `Rule: ${rule.name}`,
      passed: true,
      message: 'Rule validation passed',
      details: {
        ruleId: rule.ruleId.value,
        status: rule.status,
        priority: rule.priority,
      },
    };

    // Check if rule has required fields
    if (!rule.name || rule.name.trim().length === 0) {
      check.passed = false;
      check.message = 'Rule name is required';
      return check;
    }

    // Check if critical rules are active
    if (rule.priority === RulePriority.CRITICAL && rule.status === HardeningStatus.PENDING) {
      check.passed = false;
      check.message = 'Critical rule is in pending status';
      check.details.isBlocking = true;
    }

    // Check if deprecated rules are properly marked
    if (rule.status === HardeningStatus.DEPRECATED) {
      check.details.isDeprecated = true;
    }

    return check;
  }

  /**
   * Validates all hardening rules.
   */
  async validateAllRules(): Promise<{
    results: ValidationCheck[];
    passedCount: number;
    failedCount: number;
  }> {
    logger.info('Validating all hardening rules');

    const rulesResult = await this.repository.listRules({ page: 1, pageSize: 1000 });
    const results: ValidationCheck[] = [];
    let passedCount = 0;
    let failedCount = 0;

    for (const rule of rulesResult.items) {
      const check = await this.validateRule(rule);
      results.push(check);
      if (check.passed) {
        passedCount++;
      } else {
        failedCount++;
      }
    }

    logger.info('Rule validation complete', { passedCount, failedCount });

    return { results, passedCount, failedCount };
  }

  // =========================================================================
  // CHECKLIST VALIDATION
  // =========================================================================

  /**
   * Validates a hardening checklist item.
   */
  async validateChecklist(checklist: HardeningChecklist): Promise<ValidationCheck> {
    const check: ValidationCheck = {
      name: `Checklist: ${checklist.title}`,
      passed: true,
      message: 'Checklist validation passed',
      details: {
        checklistId: checklist.checklistId.value,
        status: checklist.status,
      },
    };

    // Check if checklist has required fields
    if (!checklist.title || checklist.title.trim().length === 0) {
      check.passed = false;
      check.message = 'Checklist title is required';
      return check;
    }

    // Check if completed checklists have completion date
    if (checklist.status === ChecklistStatus.COMPLETED && !checklist.completedAt) {
      check.passed = false;
      check.message = 'Completed checklist must have completion date';
    }

    return check;
  }

  /**
   * Validates all hardening checklists.
   */
  async validateAllChecklists(): Promise<{
    results: ValidationCheck[];
    passedCount: number;
    failedCount: number;
  }> {
    logger.info('Validating all hardening checklists');

    const checklistsResult = await this.repository.listChecklists({ page: 1, pageSize: 1000 });
    const results: ValidationCheck[] = [];
    let passedCount = 0;
    let failedCount = 0;

    for (const checklist of checklistsResult.items) {
      const check = await this.validateChecklist(checklist);
      results.push(check);
      if (check.passed) {
        passedCount++;
      } else {
        failedCount++;
      }
    }

    logger.info('Checklist validation complete', { passedCount, failedCount });

    return { results, passedCount, failedCount };
  }

  // =========================================================================
  // SYSTEM VALIDATION
  // =========================================================================

  /**
   * Validates repository availability.
   */
  async validateRepository(): Promise<ValidationCheck> {
    const check: ValidationCheck = {
      name: 'Repository Availability',
      passed: true,
      message: 'Repository is available',
    };

    try {
      // Try to count rules as a connectivity test
      await this.repository.countRules();
      check.details = { connected: true };
    } catch (err) {
      check.passed = false;
      check.message = `Repository error: ${err instanceof Error ? err.message : 'Unknown error'}`;
      check.details = { connected: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }

    return check;
  }

  /**
   * Validates database connectivity.
   */
  async validateDatabase(): Promise<ValidationCheck> {
    const check: ValidationCheck = {
      name: 'Database Connectivity',
      passed: true,
      message: 'Database is connected',
    };

    try {
      const snapshotCount = await this.repository.countSnapshots();
      check.details = { accessible: true, snapshotCount };
    } catch (err) {
      check.passed = false;
      check.message = `Database error: ${err instanceof Error ? err.message : 'Unknown error'}`;
      check.details = { accessible: false };
    }

    return check;
  }

  /**
   * Performs full system validation.
   */
  async validateSystem(): Promise<SystemValidationResult> {
    logger.info('Starting system validation');

    const checks: ValidationCheck[] = [];
    const warnings: string[] = [];
    const criticalIssues: string[] = [];

    // Validate repository
    checks.push(await this.validateRepository());
    checks.push(await this.validateDatabase());

    // Validate rules
    const ruleValidation = await this.validateAllRules();
    checks.push(...ruleValidation.results);
    if (ruleValidation.failedCount > 0) {
      criticalIssues.push(`${ruleValidation.failedCount} rule(s) failed validation`);
    }

    // Validate checklists
    const checklistValidation = await this.validateAllChecklists();
    checks.push(...checklistValidation.results);
    if (checklistValidation.failedCount > 0) {
      warnings.push(`${checklistValidation.failedCount} checklist(s) failed validation`);
    }

    // Determine overall health
    const failedChecks = checks.filter((c) => !c.passed);
    let overallHealth: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

    if (failedChecks.length > 0) {
      if (criticalIssues.length > 0) {
        overallHealth = 'unhealthy';
      } else {
        overallHealth = 'degraded';
      }
    }

    const result: SystemValidationResult = {
      isHealthy: overallHealth === 'healthy',
      timestamp: new Date(),
      checks,
      warnings,
      criticalIssues,
      overallHealth,
    };

    logger.info('System validation complete', { overallHealth, failedChecks: failedChecks.length });

    return result;
  }

  // =========================================================================
  // REPORTING
  // =========================================================================

  /**
   * Generates a comprehensive hardening report.
   */
  async generateReport(): Promise<HardeningReport> {
    logger.info('Generating hardening report');

    // Get statistics
    const statistics = await this.getStatistics();

    // Get system health summary
    const systemHealth = await this.getSystemHealthSummary();

    // Perform validation
    const validationResult = await this.validateSystem();

    // Generate recommendations
    const recommendations = this.generateRecommendations(validationResult, statistics);

    // Calculate risk level
    const riskLevel = this.calculateRiskLevel(validationResult, statistics);

    const report: HardeningReport = {
      generatedAt: new Date(),
      systemVersion: this.systemVersion,
      statistics,
      systemHealth,
      validationResult,
      recommendations,
      riskLevel,
    };

    logger.info('Hardening report generated', { riskLevel });

    return report;
  }

  /**
   * Gets hardening statistics.
   */
  async getStatistics(): Promise<HardeningStatistics> {
    const [
      totalRules,
      activeRules,
      pendingRules,
      totalChecklists,
      completedChecklists,
      totalSnapshots,
    ] = await Promise.all([
      this.repository.countRules(),
      this.repository.countRules({ status: HardeningStatus.ACTIVE }),
      this.repository.countRules({ status: HardeningStatus.PENDING }),
      this.repository.countRules(), // Will use checklists
      this.repository.countChecklists({ status: ChecklistStatus.COMPLETED }),
      this.repository.countSnapshots(),
    ]);

    // Get checklist counts properly
    const checklistTotal = await this.repository.countChecklists();
    const completedTotal = await this.repository.countChecklists({ status: ChecklistStatus.COMPLETED });

    return {
      totalRules,
      activeRules,
      pendingRules,
      totalChecklists: checklistTotal,
      completedChecklists: completedTotal,
      totalSnapshots,
      lastSnapshotAt: null, // Would need to fetch the most recent snapshot
      complianceScore: totalRules > 0 ? (activeRules / totalRules) * 100 : 0,
    };
  }

  /**
   * Gets system health summary.
   */
  async getSystemHealthSummary(): Promise<SystemHealthSummary> {
    const snapshotCount = await this.repository.countSnapshots();

    // Get the most recent snapshot
    if (snapshotCount > 0) {
      const snapshots = await this.repository.listSnapshots({ page: 1, pageSize: 1 });
      if (snapshots.items.length > 0) {
        const latestSnapshot = snapshots.items[0];
        return {
          status: latestSnapshot.isHealthy ? 'healthy' : 'unhealthy',
          lastChecked: latestSnapshot.createdAt,
          moduleCount: latestSnapshot.moduleCount,
          healthyModules: latestSnapshot.isHealthy ? latestSnapshot.moduleCount : 0,
          unhealthyModules: latestSnapshot.isHealthy ? 0 : 1,
        };
      }
    }

    return {
      status: 'unknown',
      lastChecked: new Date(),
      moduleCount: 0,
      healthyModules: 0,
      unhealthyModules: 0,
    };
  }

  /**
   * Generates recommendations based on validation results.
   */
  private generateRecommendations(
    validationResult: SystemValidationResult,
    statistics: HardeningStatistics
  ): string[] {
    const recommendations: string[] = [];

    // Check compliance score
    if (statistics.complianceScore < 80) {
      recommendations.push('Compliance score is below 80%. Review and activate pending hardening rules.');
    }

    // Check for pending critical rules
    const pendingCriticalRules = validationResult.checks.filter(
      (c) => c.details?.priority === RulePriority.CRITICAL && c.details?.status === HardeningStatus.PENDING
    );
    if (pendingCriticalRules.length > 0) {
      recommendations.push(`${pendingCriticalRules.length} critical rule(s) are pending. Address immediately.`);
    }

    // Check for database issues
    const dbCheck = validationResult.checks.find((c) => c.name === 'Database Connectivity');
    if (dbCheck && !dbCheck.passed) {
      recommendations.push('Database connectivity issues detected. Investigate immediately.');
    }

    // Check for repository issues
    const repoCheck = validationResult.checks.find((c) => c.name === 'Repository Availability');
    if (repoCheck && !repoCheck.passed) {
      recommendations.push('Repository availability issues detected. Check configuration.');
    }

    if (recommendations.length === 0) {
      recommendations.push('System is healthy. Continue monitoring and periodic validation.');
    }

    return recommendations;
  }

  /**
   * Calculates risk level based on validation and statistics.
   */
  private calculateRiskLevel(
    validationResult: SystemValidationResult,
    statistics: HardeningStatistics
  ): 'low' | 'medium' | 'high' | 'critical' {
    // Critical issues immediately bump to critical
    if (validationResult.criticalIssues.length > 0) {
      return 'critical';
    }

    // High number of warnings indicate high risk
    if (validationResult.warnings.length > 5) {
      return 'high';
    }

    // Low compliance indicates medium-high risk
    if (statistics.complianceScore < 70) {
      return 'high';
    }

    // System unhealthy indicates medium-high risk
    if (validationResult.overallHealth === 'unhealthy') {
      return 'high';
    }

    // System degraded indicates medium risk
    if (validationResult.overallHealth === 'degraded') {
      return 'medium';
    }

    // Warnings present indicate medium risk
    if (validationResult.warnings.length > 0) {
      return 'medium';
    }

    // Low compliance indicates medium risk
    if (statistics.complianceScore < 90) {
      return 'medium';
    }

    return 'low';
  }

  // =========================================================================
  // MODULE REGISTRATION (for validation purposes)
  // =========================================================================

  /**
   * Gets information about registered modules.
   * This is a placeholder that would be connected to the actual module registry.
   */
  async getRegisteredModules(): Promise<ModuleInfo[]> {
    // This would typically connect to a module registry
    // For now, return basic info based on available hardening data
    const modules: ModuleInfo[] = [
      {
        name: 'Hardening',
        isRegistered: true,
        isHealthy: true,
        warnings: [],
      },
    ];

    return modules;
  }

  /**
   * Checks for dependency issues.
   */
  async checkDependencies(): Promise<DependencyCheckResult> {
    const result: DependencyCheckResult = {
      hasCircularDependencies: false,
      hasDuplicateProviders: false,
      hasMissingRegistrations: false,
      issues: [],
    };

    // Basic validation - in production this would check the actual DI container
    // and module registry for dependency issues

    return result;
  }

  /**
   * Checks configuration integrity.
   */
  async checkConfiguration(): Promise<ConfigurationCheckResult> {
    const result: ConfigurationCheckResult = {
      isValid: true,
      missingKeys: [],
      invalidValues: [],
    };

    // Check for required environment variables
    const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];

    for (const key of requiredEnvVars) {
      if (!process.env[key]) {
        result.isValid = false;
        result.missingKeys.push(key);
      }
    }

    if (result.missingKeys.length > 0) {
      result.isValid = false;
    }

    return result;
  }
}
