/**
 * Optimization Service
 *
 * Main service for managing performance optimization.
 * Handles snapshot creation, rule registration, and performance summaries.
 *
 * IMPORTANT: Optimization NEVER modifies gameplay. This is a pure analysis layer.
 * - Store performance profiles
 * - Store optimization rules
 * - Store performance snapshots
 * - Generate analysis and recommendations
 */

import type { IOptimizationRepository } from '../interfaces/IOptimizationRepository';
import { PerformanceProfile } from '../entities/PerformanceProfile';
import { OptimizationRule } from '../entities/OptimizationRule';
import { PerformanceSnapshot } from '../entities/PerformanceSnapshot';
import { ProfileId } from '../value-objects/ProfileId';
import { RuleId } from '../value-objects/RuleId';
import { SnapshotId } from '../value-objects/SnapshotId';
import type { ProfileType } from '../types/ProfileType';
import type { OptimizationMetadata } from '../types/OptimizationMetadata';
import type { OptimizationStatistics } from '../types/OptimizationStatistics';
import type { PaginationParams } from '../../../shared/types/base.types';
import { createLogger } from '../../../core/logging/logger.service';

const logger = createLogger('OptimizationService');

/**
 * Service configuration options.
 */
export interface OptimizationServiceConfig {
  autoSnapshotEnabled?: boolean;
  snapshotIntervalMs?: number;
}

/**
 * Optimization summary result.
 */
export interface OptimizationSummary {
  totalProfiles: number;
  totalRules: number;
  totalSnapshots: number;
  enabledRulesCount: number;
  averageExecutionTime: number;
  peakExecutionTime: number;
  averageMemoryUsage: number;
  peakMemoryUsage: number;
  overallCacheHitRate: number;
  lastSnapshotAt: Date | null;
}

/**
 * Profile summary result.
 */
export interface ProfileSummary {
  profiles: PerformanceProfile[];
  total: number;
  averageExecutionTime: number;
  peakExecutionTime: number;
  averageMemoryUsage: number;
  peakMemoryUsage: number;
  profileTypeDistribution: Record<string, number>;
}

/**
 * Performance summary result.
 */
export interface PerformanceSummary {
  profilesAnalyzed: number;
  rulesAnalyzed: number;
  snapshotsAnalyzed: number;
  statistics: OptimizationStatistics;
  generatedAt: Date;
}

/**
 * Optimization service for managing optimization operations.
 */
export class OptimizationService {
  private readonly _repository: IOptimizationRepository;
  private readonly _autoSnapshotEnabled: boolean;
  private _lastSnapshotTime: Date | null = null;

  constructor(
    repository: IOptimizationRepository,
    config?: OptimizationServiceConfig
  ) {
    this._repository = repository;
    this._autoSnapshotEnabled = config?.autoSnapshotEnabled ?? true;
  }

  // ============ Profile Operations ============

  /**
   * Creates a new performance profile.
   */
  async createProfile(params: {
    moduleName: string;
    averageExecutionTime: number;
    peakExecutionTime: number;
    memoryUsage: number;
    cpuUsage: number;
    profileType: ProfileType;
    metadata?: OptimizationMetadata;
  }): Promise<PerformanceProfile> {
    try {
      const profile = PerformanceProfile.create({
        profileId: ProfileId.generate(),
        moduleName: params.moduleName,
        averageExecutionTime: params.averageExecutionTime,
        peakExecutionTime: params.peakExecutionTime,
        memoryUsage: params.memoryUsage,
        cpuUsage: params.cpuUsage,
        profileType: params.profileType,
        metadata: params.metadata,
      });

      const created = await this._repository.createProfile(profile);
      logger.debug(`Created profile for module: ${params.moduleName}`);
      return created;
    } catch (err) {
      logger.error('Failed to create performance profile', err as Error);
      throw err;
    }
  }

  /**
   * Finds a profile by ID.
   */
  async findProfile(id: string): Promise<PerformanceProfile | null> {
    try {
      const profileId = ProfileId.reconstruct(id);
      return await this._repository.findProfileById(profileId);
    } catch (err) {
      logger.error(`Failed to find profile: ${id}`, err as Error);
      throw err;
    }
  }

  /**
   * Updates an existing profile.
   */
  async updateProfile(profile: PerformanceProfile): Promise<PerformanceProfile> {
    try {
      const updated = await this._repository.updateProfile(profile);
      logger.debug(`Updated profile: ${profile.profileId.value}`);
      return updated;
    } catch (err) {
      logger.error('Failed to update profile', err as Error);
      throw err;
    }
  }

  /**
   * Deletes a profile.
   */
  async deleteProfile(id: string): Promise<void> {
    try {
      const profileId = ProfileId.reconstruct(id);
      await this._repository.deleteProfile(profileId);
      logger.debug(`Deleted profile: ${id}`);
    } catch (err) {
      logger.error(`Failed to delete profile: ${id}`, err as Error);
      throw err;
    }
  }

  /**
   * Gets profile summary statistics.
   */
  async getProfileSummary(
    params?: PaginationParams,
    moduleName?: string
  ): Promise<ProfileSummary> {
    try {
      const pagination = params ?? { page: 1, pageSize: 100 };
      const filters = moduleName ? { moduleName } : undefined;

      const result = await this._repository.listProfiles(pagination, filters);
      const profiles = result.items;

      if (profiles.length === 0) {
        return {
          profiles: [],
          total: 0,
          averageExecutionTime: 0,
          peakExecutionTime: 0,
          averageMemoryUsage: 0,
          peakMemoryUsage: 0,
          profileTypeDistribution: {},
        };
      }

      let totalExecTime = 0;
      let peakExec = 0;
      let totalMemory = 0;
      let peakMemory = 0;
      const typeDistribution: Record<string, number> = {};

      for (const profile of profiles) {
        totalExecTime += profile.averageExecutionTime;
        peakExec = Math.max(peakExec, profile.peakExecutionTime);
        totalMemory += profile.memoryUsage;
        peakMemory = Math.max(peakMemory, profile.memoryUsage);

        const type = profile.profileType;
        typeDistribution[type] = (typeDistribution[type] || 0) + 1;
      }

      return {
        profiles,
        total: result.total,
        averageExecutionTime: totalExecTime / profiles.length,
        peakExecutionTime: peakExec,
        averageMemoryUsage: totalMemory / profiles.length,
        peakMemoryUsage: peakMemory,
        profileTypeDistribution: typeDistribution,
      };
    } catch (err) {
      logger.error('Failed to get profile summary', err as Error);
      throw err;
    }
  }

  // ============ Rule Operations ============

  /**
   * Registers a new optimization rule.
   */
  async registerRule(params: {
    ruleName: string;
    enabled?: boolean;
    priority?: number;
    description: string;
    metadata?: OptimizationMetadata;
  }): Promise<OptimizationRule> {
    try {
      const rule = OptimizationRule.create({
        ruleId: RuleId.generate(),
        ruleName: params.ruleName,
        enabled: params.enabled ?? true,
        priority: params.priority ?? 50,
        description: params.description,
        metadata: params.metadata,
      });

      const created = await this._repository.createRule(rule);
      logger.info(`Registered optimization rule: ${params.ruleName}`);
      return created;
    } catch (err) {
      logger.error('Failed to register optimization rule', err as Error);
      throw err;
    }
  }

  /**
   * Finds a rule by ID.
   */
  async findRule(id: string): Promise<OptimizationRule | null> {
    try {
      const ruleId = RuleId.reconstruct(id);
      return await this._repository.findRuleById(ruleId);
    } catch (err) {
      logger.error(`Failed to find rule: ${id}`, err as Error);
      throw err;
    }
  }

  /**
   * Updates an existing rule.
   */
  async updateRule(rule: OptimizationRule): Promise<OptimizationRule> {
    try {
      const updated = await this._repository.updateRule(rule);
      logger.debug(`Updated rule: ${rule.ruleId.value}`);
      return updated;
    } catch (err) {
      logger.error('Failed to update rule', err as Error);
      throw err;
    }
  }

  /**
   * Deletes a rule.
   */
  async deleteRule(id: string): Promise<void> {
    try {
      const ruleId = RuleId.reconstruct(id);
      await this._repository.deleteRule(ruleId);
      logger.debug(`Deleted rule: ${id}`);
    } catch (err) {
      logger.error(`Failed to delete rule: ${id}`, err as Error);
      throw err;
    }
  }

  /**
   * Lists all enabled rules.
   */
  async listEnabledRules(): Promise<OptimizationRule[]> {
    try {
      return await this._repository.listEnabledRules();
    } catch (err) {
      logger.error('Failed to list enabled rules', err as Error);
      throw err;
    }
  }

  // ============ Snapshot Operations ============

  /**
   * Creates a performance snapshot.
   */
  async createSnapshot(params: {
    executionTime: number;
    memoryUsage: number;
    cacheHitRate: number;
    databaseQueries: number;
    metadata?: OptimizationMetadata;
  }): Promise<PerformanceSnapshot> {
    try {
      const snapshot = PerformanceSnapshot.create({
        snapshotId: SnapshotId.generate(),
        executionTime: params.executionTime,
        memoryUsage: params.memoryUsage,
        cacheHitRate: params.cacheHitRate,
        databaseQueries: params.databaseQueries,
        metadata: params.metadata,
      });

      const created = await this._repository.createSnapshot(snapshot);
      this._lastSnapshotTime = new Date();
      logger.debug(`Created performance snapshot: ${snapshot.snapshotId.value}`);
      return created;
    } catch (err) {
      logger.error('Failed to create performance snapshot', err as Error);
      throw err;
    }
  }

  /**
   * Finds a snapshot by ID.
   */
  async findSnapshot(id: string): Promise<PerformanceSnapshot | null> {
    try {
      const snapshotId = SnapshotId.reconstruct(id);
      return await this._repository.findSnapshotById(snapshotId);
    } catch (err) {
      logger.error(`Failed to find snapshot: ${id}`, err as Error);
      throw err;
    }
  }

  /**
   * Deletes old snapshots.
   */
  async cleanupOldSnapshots(beforeDate: Date): Promise<number> {
    try {
      const count = await this._repository.deleteSnapshotsBefore(beforeDate);
      logger.info(`Cleaned up ${count} old snapshots before ${beforeDate.toISOString()}`);
      return count;
    } catch (err) {
      logger.error('Failed to cleanup old snapshots', err as Error);
      throw err;
    }
  }

  // ============ Summary Operations ============

  /**
   * Gets optimization summary statistics.
   */
  async getOptimizationSummary(): Promise<OptimizationSummary> {
    try {
      const [profilesResult, rulesResult, snapshotsResult, enabledRules] = await Promise.all([
        this._repository.listProfiles({ page: 1, pageSize: 1000 }),
        this._repository.listRules({ page: 1, pageSize: 1000 }),
        this._repository.listSnapshots({ page: 1, pageSize: 100 }),
        this._repository.listEnabledRules(),
      ]);

      const profiles = profilesResult.items;
      const snapshots = snapshotsResult.items;

      let avgExecTime = 0;
      let peakExecTime = 0;
      let avgMemory = 0;
      let peakMemory = 0;

      if (profiles.length > 0) {
        let totalExec = 0;
        let totalMem = 0;
        for (const p of profiles) {
          totalExec += p.averageExecutionTime;
          totalMem += p.memoryUsage;
          peakExecTime = Math.max(peakExecTime, p.peakExecutionTime);
          peakMemory = Math.max(peakMemory, p.memoryUsage);
        }
        avgExecTime = totalExec / profiles.length;
        avgMemory = totalMem / profiles.length;
      }

      let overallCacheHitRate = 0;
      if (snapshots.length > 0) {
        let totalCacheHit = 0;
        for (const s of snapshots) {
          totalCacheHit += s.cacheHitRate;
        }
        overallCacheHitRate = totalCacheHit / snapshots.length;
      }

      let lastSnapshot: Date | null = null;
      if (snapshots.length > 0) {
        const sorted = [...snapshots].sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
        lastSnapshot = sorted[0].createdAt;
      }

      return {
        totalProfiles: profilesResult.total,
        totalRules: rulesResult.total,
        totalSnapshots: snapshotsResult.total,
        enabledRulesCount: enabledRules.length,
        averageExecutionTime: avgExecTime,
        peakExecutionTime: peakExecTime,
        averageMemoryUsage: avgMemory,
        peakMemoryUsage: peakMemory,
        overallCacheHitRate,
        lastSnapshotAt: lastSnapshot,
      };
    } catch (err) {
      logger.error('Failed to get optimization summary', err as Error);
      throw err;
    }
  }

  /**
   * Gets performance summary statistics.
   */
  async getPerformanceSummary(): Promise<PerformanceSummary> {
    try {
      const [profilesResult, rulesResult, snapshotsResult] = await Promise.all([
        this._repository.listProfiles({ page: 1, pageSize: 1000 }),
        this._repository.listRules({ page: 1, pageSize: 100 }),
        this._repository.listSnapshots({ page: 1, pageSize: 100 }),
      ]);

      const profiles = profilesResult.items;
      const snapshots = snapshotsResult.items;

      const executionTimes: number[] = [];
      const memoryUsages: number[] = [];
      const cacheHitRates: number[] = [];

      for (const p of profiles) {
        executionTimes.push(p.averageExecutionTime);
        memoryUsages.push(p.memoryUsage);
      }

      for (const s of snapshots) {
        executionTimes.push(s.executionTime);
        memoryUsages.push(s.memoryUsage);
        cacheHitRates.push(s.cacheHitRate);
      }

      const statistics = this.calculateStatistics(executionTimes, memoryUsages, cacheHitRates);

      return {
        profilesAnalyzed: profiles.length,
        rulesAnalyzed: rulesResult.total,
        snapshotsAnalyzed: snapshots.length,
        statistics,
        generatedAt: new Date(),
      };
    } catch (err) {
      logger.error('Failed to get performance summary', err as Error);
      throw err;
    }
  }

  // ============ Private Helpers ============

  /**
   * Calculates optimization statistics from collected data.
   */
  private calculateStatistics(
    executionTimes: number[],
    memoryUsages: number[],
    cacheHitRates: number[]
  ): OptimizationStatistics {
    if (executionTimes.length === 0) {
      return {
        sampleCount: 0,
        standardDeviation: 0,
        minExecutionTime: 0,
        maxExecutionTime: 0,
        medianExecutionTime: 0,
        p95ExecutionTime: 0,
        p99ExecutionTime: 0,
        cacheHitRate: 0,
        averageMemoryUsage: 0,
        peakMemoryUsage: 0,
        averageCpuUsage: 0,
      };
    }

    const sorted = [...executionTimes].sort((a, b) => a - b);
    const sum = sorted.reduce((a, b) => a + b, 0);
    const mean = sum / sorted.length;
    const variance = sorted.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / sorted.length;
    const stdDev = Math.sqrt(variance);

    const p95Index = Math.floor(sorted.length * 0.95);
    const p99Index = Math.floor(sorted.length * 0.99);

    const memorySum = memoryUsages.reduce((a, b) => a + b, 0);
    const cacheSum = cacheHitRates.reduce((a, b) => a + b, 0);

    return {
      sampleCount: executionTimes.length,
      standardDeviation: stdDev,
      minExecutionTime: sorted[0],
      maxExecutionTime: sorted[sorted.length - 1],
      medianExecutionTime: sorted[Math.floor(sorted.length / 2)],
      p95ExecutionTime: sorted[p95Index] || sorted[sorted.length - 1],
      p99ExecutionTime: sorted[p99Index] || sorted[sorted.length - 1],
      cacheHitRate: cacheHitRates.length > 0 ? cacheSum / cacheHitRates.length : 0,
      averageMemoryUsage: memorySum / memoryUsages.length,
      peakMemoryUsage: Math.max(...memoryUsages),
      averageCpuUsage: 0,
    };
  }

  /**
   * Gets the last snapshot time.
   */
  getLastSnapshotTime(): Date | null {
    return this._lastSnapshotTime;
  }

  /**
   * Checks if auto snapshot is enabled.
   */
  isAutoSnapshotEnabled(): boolean {
    return this._autoSnapshotEnabled;
  }
}
