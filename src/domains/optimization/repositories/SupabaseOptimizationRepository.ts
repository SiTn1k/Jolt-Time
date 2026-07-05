/**
 * Supabase Optimization Repository
 *
 * Production Supabase implementation of the Optimization repository.
 * Handles all persistence operations for optimization entities.
 * Uses ONLY SupabaseProvider, Logger, and RepositoryError.
 *
 * IMPORTANT: Never exposes raw Supabase rows - always returns domain entities.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  IOptimizationRepository,
  PerformanceProfileFilterParams,
  OptimizationRuleFilterParams,
  PerformanceSnapshotFilterParams,
} from '../interfaces/IOptimizationRepository';
import { PerformanceProfile } from '../entities/PerformanceProfile';
import { OptimizationRule } from '../entities/OptimizationRule';
import { PerformanceSnapshot } from '../entities/PerformanceSnapshot';
import { ProfileId } from '../value-objects/ProfileId';
import { RuleId } from '../value-objects/RuleId';
import { SnapshotId } from '../value-objects/SnapshotId';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import { getSupabaseClient } from '../../../database/providers/supabase.provider';
import { RepositoryError } from '../../../database/errors/repository.error';
import { createLogger } from '../../../core/logging/logger.service';

const logger = createLogger('OptimizationRepository');

/**
 * Profile database record type.
 */
interface ProfileRecord {
  profile_id: string;
  module_name: string;
  average_execution_time: number;
  peak_execution_time: number;
  memory_usage: number;
  cpu_usage: number;
  profile_type: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
}

/**
 * Rule database record type.
 */
interface RuleRecord {
  rule_id: string;
  rule_name: string;
  enabled: boolean;
  priority: number;
  description: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
}

/**
 * Snapshot database record type.
 */
interface SnapshotRecord {
  snapshot_id: string;
  created_at: string;
  execution_time: number;
  memory_usage: number;
  cache_hit_rate: number;
  database_queries: number;
  metadata?: Record<string, unknown>;
}

/**
 * Supabase implementation of the Optimization Repository.
 * Implements IOptimizationRepository for optimization entity persistence.
 * Never exposes raw Supabase rows - always returns domain entities.
 */
export class SupabaseOptimizationRepository implements IOptimizationRepository {
  private readonly profilesTableName = 'optimization_profiles';
  private readonly rulesTableName = 'optimization_rules';
  private readonly snapshotsTableName = 'optimization_snapshots';
  private readonly _client: SupabaseClient;

  /**
   * Creates a new SupabaseOptimizationRepository instance.
   * @param client Optional Supabase client (uses default provider if not provided)
   */
  constructor(client?: SupabaseClient) {
    this._client = client ?? getSupabaseClient();
  }

  // ============ Profile Operations ============

  /**
   * Creates a new performance profile.
   */
  async createProfile(profile: PerformanceProfile): Promise<PerformanceProfile> {
    try {
      const record: ProfileRecord = {
        profile_id: profile.profileId.value,
        module_name: profile.moduleName,
        average_execution_time: profile.averageExecutionTime,
        peak_execution_time: profile.peakExecutionTime,
        memory_usage: profile.memoryUsage,
        cpu_usage: profile.cpuUsage,
        profile_type: profile.profileType,
        metadata: profile.metadata,
      };

      const { error } = await this._client
        .from(this.profilesTableName)
        .insert(record);

      if (error) {
        logger.error('Failed to create profile', error);
        throw RepositoryError.createFailed('PerformanceProfile', error);
      }

      logger.debug(`Created profile: ${profile.profileId.value}`);
      return profile;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error creating profile', err as Error);
      throw RepositoryError.createFailed('PerformanceProfile', err as Error);
    }
  }

  /**
   * Finds a profile by its ID.
   */
  async findProfileById(id: ProfileId): Promise<PerformanceProfile | null> {
    try {
      const { data, error } = await this._client
        .from(this.profilesTableName)
        .select('*')
        .eq('profile_id', id.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        logger.error('Failed to find profile', error);
        throw RepositoryError.queryFailed(`findProfileById: ${error.message}`, error);
      }

      if (!data) {
        return null;
      }

      return PerformanceProfile.fromDatabase(data as ProfileRecord);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error finding profile', err as Error);
      throw RepositoryError.queryFailed('findProfileById', err as Error);
    }
  }

  /**
   * Updates an existing profile.
   */
  async updateProfile(profile: PerformanceProfile): Promise<PerformanceProfile> {
    try {
      const record: Partial<ProfileRecord> = {
        module_name: profile.moduleName,
        average_execution_time: profile.averageExecutionTime,
        peak_execution_time: profile.peakExecutionTime,
        memory_usage: profile.memoryUsage,
        cpu_usage: profile.cpuUsage,
        profile_type: profile.profileType,
        metadata: profile.metadata,
      };

      const { error } = await this._client
        .from(this.profilesTableName)
        .update(record)
        .eq('profile_id', profile.profileId.value);

      if (error) {
        logger.error('Failed to update profile', error);
        throw RepositoryError.updateFailed('PerformanceProfile', profile.profileId.value, error);
      }

      logger.debug(`Updated profile: ${profile.profileId.value}`);
      return profile;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error updating profile', err as Error);
      throw RepositoryError.updateFailed('PerformanceProfile', profile.profileId.value, err as Error);
    }
  }

  /**
   * Deletes a profile.
   */
  async deleteProfile(id: ProfileId): Promise<void> {
    try {
      const { error } = await this._client
        .from(this.profilesTableName)
        .delete()
        .eq('profile_id', id.value);

      if (error) {
        logger.error('Failed to delete profile', error);
        throw RepositoryError.deleteFailed('PerformanceProfile', id.value, error);
      }

      logger.debug(`Deleted profile: ${id.value}`);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error deleting profile', err as Error);
      throw RepositoryError.deleteFailed('PerformanceProfile', id.value, err as Error);
    }
  }

  /**
   * Lists profiles with pagination and filtering.
   */
  async listProfiles(
    params: PaginationParams,
    filters?: PerformanceProfileFilterParams
  ): Promise<PaginatedResult<PerformanceProfile>> {
    try {
      const { page, pageSize, sortBy = 'created_at', sortOrder = 'desc' } = params;
      const offset = (page - 1) * pageSize;

      let query = this._client
        .from(this.profilesTableName)
        .select('*', { count: 'exact' });

      if (filters?.moduleName) {
        query = query.eq('module_name', filters.moduleName);
      }

      if (filters?.profileType) {
        query = query.eq('profile_type', filters.profileType);
      }

      if (filters?.createdAfter) {
        query = query.gte('created_at', filters.createdAfter.toISOString());
      }

      if (filters?.createdBefore) {
        query = query.lte('created_at', filters.createdBefore.toISOString());
      }

      const sortColumn = this.mapProfileSortColumn(sortBy);
      query = query.order(sortColumn, { ascending: sortOrder === 'asc' });
      query = query.range(offset, offset + pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        logger.error('Failed to list profiles', error);
        throw RepositoryError.queryFailed(`listProfiles: ${error.message}`, error);
      }

      const profiles = (data || []).map((row) =>
        PerformanceProfile.fromDatabase(row as ProfileRecord)
      );

      const total = count || 0;
      const totalPages = Math.ceil(total / pageSize);

      return {
        items: profiles,
        total,
        page,
        pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error listing profiles', err as Error);
      throw RepositoryError.queryFailed('listProfiles', err as Error);
    }
  }

  /**
   * Counts profiles with optional filtering.
   */
  async countProfiles(filters?: PerformanceProfileFilterParams): Promise<number> {
    try {
      let query = this._client
        .from(this.profilesTableName)
        .select('*', { count: 'exact', head: true });

      if (filters?.moduleName) {
        query = query.eq('module_name', filters.moduleName);
      }

      if (filters?.profileType) {
        query = query.eq('profile_type', filters.profileType);
      }

      if (filters?.createdAfter) {
        query = query.gte('created_at', filters.createdAfter.toISOString());
      }

      if (filters?.createdBefore) {
        query = query.lte('created_at', filters.createdBefore.toISOString());
      }

      const { count, error } = await query;

      if (error) {
        logger.error('Failed to count profiles', error);
        throw RepositoryError.queryFailed(`countProfiles: ${error.message}`, error);
      }

      return count || 0;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error counting profiles', err as Error);
      throw RepositoryError.queryFailed('countProfiles', err as Error);
    }
  }

  // ============ Rule Operations ============

  /**
   * Creates a new optimization rule.
   */
  async createRule(rule: OptimizationRule): Promise<OptimizationRule> {
    try {
      const record: RuleRecord = {
        rule_id: rule.ruleId.value,
        rule_name: rule.ruleName,
        enabled: rule.enabled,
        priority: rule.priority,
        description: rule.description,
        metadata: rule.metadata,
      };

      const { error } = await this._client
        .from(this.rulesTableName)
        .insert(record);

      if (error) {
        logger.error('Failed to create rule', error);
        throw RepositoryError.createFailed('OptimizationRule', error);
      }

      logger.debug(`Created rule: ${rule.ruleId.value}`);
      return rule;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error creating rule', err as Error);
      throw RepositoryError.createFailed('OptimizationRule', err as Error);
    }
  }

  /**
   * Finds a rule by its ID.
   */
  async findRuleById(id: RuleId): Promise<OptimizationRule | null> {
    try {
      const { data, error } = await this._client
        .from(this.rulesTableName)
        .select('*')
        .eq('rule_id', id.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        logger.error('Failed to find rule', error);
        throw RepositoryError.queryFailed(`findRuleById: ${error.message}`, error);
      }

      if (!data) {
        return null;
      }

      return OptimizationRule.fromDatabase(data as RuleRecord);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error finding rule', err as Error);
      throw RepositoryError.queryFailed('findRuleById', err as Error);
    }
  }

  /**
   * Updates an existing rule.
   */
  async updateRule(rule: OptimizationRule): Promise<OptimizationRule> {
    try {
      const record: Partial<RuleRecord> = {
        rule_name: rule.ruleName,
        enabled: rule.enabled,
        priority: rule.priority,
        description: rule.description,
        metadata: rule.metadata,
      };

      const { error } = await this._client
        .from(this.rulesTableName)
        .update(record)
        .eq('rule_id', rule.ruleId.value);

      if (error) {
        logger.error('Failed to update rule', error);
        throw RepositoryError.updateFailed('OptimizationRule', rule.ruleId.value, error);
      }

      logger.debug(`Updated rule: ${rule.ruleId.value}`);
      return rule;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error updating rule', err as Error);
      throw RepositoryError.updateFailed('OptimizationRule', rule.ruleId.value, err as Error);
    }
  }

  /**
   * Deletes a rule.
   */
  async deleteRule(id: RuleId): Promise<void> {
    try {
      const { error } = await this._client
        .from(this.rulesTableName)
        .delete()
        .eq('rule_id', id.value);

      if (error) {
        logger.error('Failed to delete rule', error);
        throw RepositoryError.deleteFailed('OptimizationRule', id.value, error);
      }

      logger.debug(`Deleted rule: ${id.value}`);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error deleting rule', err as Error);
      throw RepositoryError.deleteFailed('OptimizationRule', id.value, err as Error);
    }
  }

  /**
   * Lists rules with pagination and filtering.
   */
  async listRules(
    params: PaginationParams,
    filters?: OptimizationRuleFilterParams
  ): Promise<PaginatedResult<OptimizationRule>> {
    try {
      const { page, pageSize, sortBy = 'priority', sortOrder = 'desc' } = params;
      const offset = (page - 1) * pageSize;

      let query = this._client
        .from(this.rulesTableName)
        .select('*', { count: 'exact' });

      if (filters?.enabled !== undefined) {
        query = query.eq('enabled', filters.enabled);
      }

      if (filters?.ruleName) {
        query = query.eq('rule_name', filters.ruleName);
      }

      if (filters?.minPriority !== undefined) {
        query = query.gte('priority', filters.minPriority);
      }

      if (filters?.maxPriority !== undefined) {
        query = query.lte('priority', filters.maxPriority);
      }

      const sortColumn = this.mapRuleSortColumn(sortBy);
      query = query.order(sortColumn, { ascending: sortOrder === 'asc' });
      query = query.range(offset, offset + pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        logger.error('Failed to list rules', error);
        throw RepositoryError.queryFailed(`listRules: ${error.message}`, error);
      }

      const rules = (data || []).map((row) =>
        OptimizationRule.fromDatabase(row as RuleRecord)
      );

      const total = count || 0;
      const totalPages = Math.ceil(total / pageSize);

      return {
        items: rules,
        total,
        page,
        pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error listing rules', err as Error);
      throw RepositoryError.queryFailed('listRules', err as Error);
    }
  }

  /**
   * Counts rules with optional filtering.
   */
  async countRules(filters?: OptimizationRuleFilterParams): Promise<number> {
    try {
      let query = this._client
        .from(this.rulesTableName)
        .select('*', { count: 'exact', head: true });

      if (filters?.enabled !== undefined) {
        query = query.eq('enabled', filters.enabled);
      }

      if (filters?.ruleName) {
        query = query.eq('rule_name', filters.ruleName);
      }

      if (filters?.minPriority !== undefined) {
        query = query.gte('priority', filters.minPriority);
      }

      if (filters?.maxPriority !== undefined) {
        query = query.lte('priority', filters.maxPriority);
      }

      const { count, error } = await query;

      if (error) {
        logger.error('Failed to count rules', error);
        throw RepositoryError.queryFailed(`countRules: ${error.message}`, error);
      }

      return count || 0;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error counting rules', err as Error);
      throw RepositoryError.queryFailed('countRules', err as Error);
    }
  }

  /**
   * Lists enabled rules ordered by priority.
   */
  async listEnabledRules(): Promise<OptimizationRule[]> {
    try {
      const { data, error } = await this._client
        .from(this.rulesTableName)
        .select('*')
        .eq('enabled', true)
        .order('priority', { ascending: false });

      if (error) {
        logger.error('Failed to list enabled rules', error);
        throw RepositoryError.queryFailed(`listEnabledRules: ${error.message}`, error);
      }

      return (data || []).map((row) =>
        OptimizationRule.fromDatabase(row as RuleRecord)
      );
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error listing enabled rules', err as Error);
      throw RepositoryError.queryFailed('listEnabledRules', err as Error);
    }
  }

  // ============ Snapshot Operations ============

  /**
   * Creates a new performance snapshot.
   */
  async createSnapshot(snapshot: PerformanceSnapshot): Promise<PerformanceSnapshot> {
    try {
      const record: SnapshotRecord = {
        snapshot_id: snapshot.snapshotId.value,
        created_at: snapshot.createdAt.toISOString(),
        execution_time: snapshot.executionTime,
        memory_usage: snapshot.memoryUsage,
        cache_hit_rate: snapshot.cacheHitRate,
        database_queries: snapshot.databaseQueries,
        metadata: snapshot.metadata,
      };

      const { error } = await this._client
        .from(this.snapshotsTableName)
        .insert(record);

      if (error) {
        logger.error('Failed to create snapshot', error);
        throw RepositoryError.createFailed('PerformanceSnapshot', error);
      }

      logger.debug(`Created snapshot: ${snapshot.snapshotId.value}`);
      return snapshot;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error creating snapshot', err as Error);
      throw RepositoryError.createFailed('PerformanceSnapshot', err as Error);
    }
  }

  /**
   * Finds a snapshot by its ID.
   */
  async findSnapshotById(id: SnapshotId): Promise<PerformanceSnapshot | null> {
    try {
      const { data, error } = await this._client
        .from(this.snapshotsTableName)
        .select('*')
        .eq('snapshot_id', id.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        logger.error('Failed to find snapshot', error);
        throw RepositoryError.queryFailed(`findSnapshotById: ${error.message}`, error);
      }

      if (!data) {
        return null;
      }

      return PerformanceSnapshot.fromDatabase(data as SnapshotRecord);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error finding snapshot', err as Error);
      throw RepositoryError.queryFailed('findSnapshotById', err as Error);
    }
  }

  /**
   * Lists snapshots with pagination and filtering.
   */
  async listSnapshots(
    params: PaginationParams,
    filters?: PerformanceSnapshotFilterParams
  ): Promise<PaginatedResult<PerformanceSnapshot>> {
    try {
      const { page, pageSize, sortBy = 'created_at', sortOrder = 'desc' } = params;
      const offset = (page - 1) * pageSize;

      let query = this._client
        .from(this.snapshotsTableName)
        .select('*', { count: 'exact' });

      if (filters?.executionTimeGreaterThan !== undefined) {
        query = query.gt('execution_time', filters.executionTimeGreaterThan);
      }

      if (filters?.executionTimeLessThan !== undefined) {
        query = query.lt('execution_time', filters.executionTimeLessThan);
      }

      if (filters?.createdAfter) {
        query = query.gte('created_at', filters.createdAfter.toISOString());
      }

      if (filters?.createdBefore) {
        query = query.lte('created_at', filters.createdBefore.toISOString());
      }

      const sortColumn = this.mapSnapshotSortColumn(sortBy);
      query = query.order(sortColumn, { ascending: sortOrder === 'asc' });
      query = query.range(offset, offset + pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        logger.error('Failed to list snapshots', error);
        throw RepositoryError.queryFailed(`listSnapshots: ${error.message}`, error);
      }

      const snapshots = (data || []).map((row) =>
        PerformanceSnapshot.fromDatabase(row as SnapshotRecord)
      );

      const total = count || 0;
      const totalPages = Math.ceil(total / pageSize);

      return {
        items: snapshots,
        total,
        page,
        pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error listing snapshots', err as Error);
      throw RepositoryError.queryFailed('listSnapshots', err as Error);
    }
  }

  /**
   * Counts snapshots with optional filtering.
   */
  async countSnapshots(filters?: PerformanceSnapshotFilterParams): Promise<number> {
    try {
      let query = this._client
        .from(this.snapshotsTableName)
        .select('*', { count: 'exact', head: true });

      if (filters?.executionTimeGreaterThan !== undefined) {
        query = query.gt('execution_time', filters.executionTimeGreaterThan);
      }

      if (filters?.executionTimeLessThan !== undefined) {
        query = query.lt('execution_time', filters.executionTimeLessThan);
      }

      if (filters?.createdAfter) {
        query = query.gte('created_at', filters.createdAfter.toISOString());
      }

      if (filters?.createdBefore) {
        query = query.lte('created_at', filters.createdBefore.toISOString());
      }

      const { count, error } = await query;

      if (error) {
        logger.error('Failed to count snapshots', error);
        throw RepositoryError.queryFailed(`countSnapshots: ${error.message}`, error);
      }

      return count || 0;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error counting snapshots', err as Error);
      throw RepositoryError.queryFailed('countSnapshots', err as Error);
    }
  }

  /**
   * Deletes old snapshots older than a specified date.
   */
  async deleteSnapshotsBefore(beforeDate: Date): Promise<number> {
    try {
      const { error, count } = await this._client
        .from(this.snapshotsTableName)
        .delete()
        .lt('created_at', beforeDate.toISOString());

      if (error) {
        logger.error('Failed to delete snapshots', error);
        throw RepositoryError.queryFailed(`deleteSnapshotsBefore: ${error.message}`, error);
      }

      const deletedCount = count || 0;
      logger.debug(`Deleted ${deletedCount} snapshots before ${beforeDate.toISOString()}`);
      return deletedCount;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error deleting snapshots', err as Error);
      throw RepositoryError.queryFailed('deleteSnapshotsBefore', err as Error);
    }
  }

  // ============ Helper Methods ============

  /**
   * Maps sort field to database column for profiles.
   */
  private mapProfileSortColumn(sortBy: string): string {
    const mapping: Record<string, string> = {
      profileId: 'profile_id',
      moduleName: 'module_name',
      averageExecutionTime: 'average_execution_time',
      peakExecutionTime: 'peak_execution_time',
      memoryUsage: 'memory_usage',
      cpuUsage: 'cpu_usage',
      profileType: 'profile_type',
      createdAt: 'created_at',
    };
    return mapping[sortBy] || 'created_at';
  }

  /**
   * Maps sort field to database column for rules.
   */
  private mapRuleSortColumn(sortBy: string): string {
    const mapping: Record<string, string> = {
      ruleId: 'rule_id',
      ruleName: 'rule_name',
      enabled: 'enabled',
      priority: 'priority',
      description: 'description',
      createdAt: 'created_at',
    };
    return mapping[sortBy] || 'priority';
  }

  /**
   * Maps sort field to database column for snapshots.
   */
  private mapSnapshotSortColumn(sortBy: string): string {
    const mapping: Record<string, string> = {
      snapshotId: 'snapshot_id',
      createdAt: 'created_at',
      executionTime: 'execution_time',
      memoryUsage: 'memory_usage',
      cacheHitRate: 'cache_hit_rate',
      databaseQueries: 'database_queries',
    };
    return mapping[sortBy] || 'created_at';
  }
}
