/**
 * Supabase Hardening Repository
 *
 * Production implementation of the Hardening repository for persistence.
 * Handles storage for HardeningRule, HardeningChecklist, and HardeningSnapshot entities.
 *
 * This repository NEVER exposes raw Supabase rows - always returns domain entities.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../../database/supabase-types';
import type {
  IHardeningRepository,
  RuleFilterParams,
  ChecklistFilterParams,
} from '../interfaces/IHardeningRepository';
import {
  HardeningRule,
  type HardeningRuleRecord,
} from '../entities/HardeningRule';
import {
  HardeningChecklist,
  type HardeningChecklistRecord,
} from '../entities/HardeningChecklist';
import {
  HardeningSnapshot,
  type HardeningSnapshotRecord,
} from '../entities/HardeningSnapshot';
import type { RuleId } from '../value-objects/RuleId';
import type { ChecklistId } from '../value-objects/ChecklistId';
import type { SnapshotId } from '../value-objects/SnapshotId';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import { SortOrder } from '../../../shared/constants';
import { getSupabaseClient } from '../../../database/providers/supabase.provider';
import { createLogger } from '../../../core/logging/logger.service';
import { RepositoryError } from '../../../database/errors/repository.error';

const logger = createLogger('SupabaseHardeningRepository');

/**
 * Database row types for hardening_rules table.
 */
interface RuleRow {
  rule_id: string;
  name: string;
  status: string;
  priority: number;
  description: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

/**
 * Database row types for hardening_checklists table.
 */
interface ChecklistRow {
  checklist_id: string;
  title: string;
  status: string;
  completed_at: string | null;
  owner: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

/**
 * Database row types for hardening_snapshots table.
 */
interface SnapshotRow {
  snapshot_id: string;
  created_at: string;
  system_version: string;
  module_count: number;
  health_status: string;
  metadata: Record<string, unknown>;
}

/**
 * Supabase implementation of the Hardening Repository.
 * Implements IHardeningRepository for Hardening entity persistence.
 *
 * Uses ONLY Supabase Provider, Logger, Configuration, Repository Error System.
 * Never exposes raw database rows - always returns domain entities.
 */
export class SupabaseHardeningRepository implements IHardeningRepository {
  private readonly rulesTableName = 'hardening_rules';
  private readonly checklistsTableName = 'hardening_checklists';
  private readonly snapshotsTableName = 'hardening_snapshots';
  private readonly _client?: SupabaseClient<Database>;

  /**
   * Creates a new SupabaseHardeningRepository instance.
   * @param client Optional Supabase client (uses default provider if not provided)
   */
  constructor(client?: SupabaseClient<Database>) {
    this._client = client;
  }

  /**
   * Get the Supabase client.
   */
  private get client(): SupabaseClient<Database> {
    return this._client ?? getSupabaseClient();
  }

  // ============ Rule Operations ============

  /**
   * Creates a new hardening rule.
   */
  async createRule(rule: HardeningRule): Promise<HardeningRule> {
    try {
      logger.debug('Creating hardening rule', { ruleId: rule.ruleId.value });

      const row = this.ruleToRow(rule);

      const { data, error } = await this.client
        .from(this.rulesTableName)
        .insert(row)
        .select()
        .single();

      if (error) {
        throw RepositoryError.createFailed('HardeningRule', error);
      }

      return this.mapRowToRule(data as RuleRow);
    } catch (err) {
      logger.error('Failed to create hardening rule', err as Error, { ruleId: rule.ruleId.value });
      throw err;
    }
  }

  /**
   * Finds a rule by its ID.
   */
  async findRuleById(id: RuleId): Promise<HardeningRule | null> {
    try {
      logger.debug('Finding rule by ID', { ruleId: id.value });

      const { data, error } = await this.client
        .from(this.rulesTableName)
        .select('*')
        .eq('rule_id', id.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw RepositoryError.entityNotFound('HardeningRule', id.value, this.rulesTableName);
      }

      return this.mapRowToRule(data as RuleRow);
    } catch (err) {
      logger.error('Failed to find rule by ID', err as Error, { ruleId: id.value });
      throw err;
    }
  }

  /**
   * Updates an existing rule.
   */
  async updateRule(rule: HardeningRule): Promise<HardeningRule> {
    try {
      logger.debug('Updating rule', { ruleId: rule.ruleId.value });

      const row = this.ruleToRow(rule);

      const { data, error } = await this.client
        .from(this.rulesTableName)
        .update(row)
        .eq('rule_id', rule.ruleId.value)
        .select()
        .single();

      if (error) {
        throw RepositoryError.updateFailed('HardeningRule', rule.ruleId.value, error);
      }

      return this.mapRowToRule(data as RuleRow);
    } catch (err) {
      logger.error('Failed to update rule', err as Error, { ruleId: rule.ruleId.value });
      throw err;
    }
  }

  /**
   * Deletes a rule.
   */
  async deleteRule(id: RuleId): Promise<void> {
    try {
      logger.debug('Deleting rule', { ruleId: id.value });

      const { error } = await this.client
        .from(this.rulesTableName)
        .delete()
        .eq('rule_id', id.value);

      if (error) {
        throw RepositoryError.deleteFailed('HardeningRule', id.value, error);
      }
    } catch (err) {
      logger.error('Failed to delete rule', err as Error, { ruleId: id.value });
      throw err;
    }
  }

  /**
   * Lists rules with pagination and filtering.
   */
  async listRules(
    params: PaginationParams,
    filters?: RuleFilterParams
  ): Promise<PaginatedResult<HardeningRule>> {
    try {
      logger.debug('Listing rules', { params, filters });

      let query = this.client.from(this.rulesTableName).select('*', { count: 'exact' });

      // Apply filters
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.priority !== undefined) {
        query = query.eq('priority', filters.priority);
      }
      if (filters?.category) {
        query = query.eq('metadata->>category', filters.category);
      }
      if (filters?.owner) {
        query = query.eq('metadata->>owner', filters.owner);
      }

      // Apply sorting
      const sortField = params.sortBy ?? 'created_at';
      const sortOrder = params.sortOrder === SortOrder.ASC ? true : false;
      query = query.order(sortField, { ascending: sortOrder });

      // Apply pagination
      const from = (params.page - 1) * params.pageSize;
      const to = from + params.pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        throw new RepositoryError({
          message: `Failed to list rules: ${error.message}`,
          entityType: 'HardeningRule',
          table: this.rulesTableName,
          operation: 'SELECT',
          cause: error,
        });
      }

      const total = count ?? 0;
      const items = (data as RuleRow[]).map((row) => this.mapRowToRule(row));

      return this.createPaginatedResult(items, total, params);
    } catch (err) {
      logger.error('Failed to list rules', err as Error, { params, filters });
      throw err;
    }
  }

  /**
   * Counts total rules with optional filtering.
   */
  async countRules(filters?: RuleFilterParams): Promise<number> {
    try {
      logger.debug('Counting rules', { filters });

      let query = this.client.from(this.rulesTableName).select('*', { count: 'exact', head: true });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.priority !== undefined) {
        query = query.eq('priority', filters.priority);
      }
      if (filters?.category) {
        query = query.eq('metadata->>category', filters.category);
      }
      if (filters?.owner) {
        query = query.eq('metadata->>owner', filters.owner);
      }

      const { error, count } = await query;

      if (error) {
        throw new RepositoryError({
          message: `Failed to count rules: ${error.message}`,
          entityType: 'HardeningRule',
          table: this.rulesTableName,
          operation: 'SELECT',
          cause: error,
        });
      }

      return count ?? 0;
    } catch (err) {
      logger.error('Failed to count rules', err as Error, { filters });
      throw err;
    }
  }

  // ============ Checklist Operations ============

  /**
   * Creates a new checklist item.
   */
  async createChecklist(checklist: HardeningChecklist): Promise<HardeningChecklist> {
    try {
      logger.debug('Creating checklist', { checklistId: checklist.checklistId.value });

      const row = this.checklistToRow(checklist);

      const { data, error } = await this.client
        .from(this.checklistsTableName)
        .insert(row)
        .select()
        .single();

      if (error) {
        throw RepositoryError.createFailed('HardeningChecklist', error);
      }

      return this.mapRowToChecklist(data as ChecklistRow);
    } catch (err) {
      logger.error('Failed to create checklist', err as Error, { checklistId: checklist.checklistId.value });
      throw err;
    }
  }

  /**
   * Finds a checklist by its ID.
   */
  async findChecklistById(id: ChecklistId): Promise<HardeningChecklist | null> {
    try {
      logger.debug('Finding checklist by ID', { checklistId: id.value });

      const { data, error } = await this.client
        .from(this.checklistsTableName)
        .select('*')
        .eq('checklist_id', id.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw RepositoryError.entityNotFound('HardeningChecklist', id.value, this.checklistsTableName);
      }

      return this.mapRowToChecklist(data as ChecklistRow);
    } catch (err) {
      logger.error('Failed to find checklist by ID', err as Error, { checklistId: id.value });
      throw err;
    }
  }

  /**
   * Updates an existing checklist.
   */
  async updateChecklist(checklist: HardeningChecklist): Promise<HardeningChecklist> {
    try {
      logger.debug('Updating checklist', { checklistId: checklist.checklistId.value });

      const row = this.checklistToRow(checklist);

      const { data, error } = await this.client
        .from(this.checklistsTableName)
        .update(row)
        .eq('checklist_id', checklist.checklistId.value)
        .select()
        .single();

      if (error) {
        throw RepositoryError.updateFailed('HardeningChecklist', checklist.checklistId.value, error);
      }

      return this.mapRowToChecklist(data as ChecklistRow);
    } catch (err) {
      logger.error('Failed to update checklist', err as Error, { checklistId: checklist.checklistId.value });
      throw err;
    }
  }

  /**
   * Deletes a checklist.
   */
  async deleteChecklist(id: ChecklistId): Promise<void> {
    try {
      logger.debug('Deleting checklist', { checklistId: id.value });

      const { error } = await this.client
        .from(this.checklistsTableName)
        .delete()
        .eq('checklist_id', id.value);

      if (error) {
        throw RepositoryError.deleteFailed('HardeningChecklist', id.value, error);
      }
    } catch (err) {
      logger.error('Failed to delete checklist', err as Error, { checklistId: id.value });
      throw err;
    }
  }

  /**
   * Lists checklists with pagination and filtering.
   */
  async listChecklists(
    params: PaginationParams,
    filters?: ChecklistFilterParams
  ): Promise<PaginatedResult<HardeningChecklist>> {
    try {
      logger.debug('Listing checklists', { params, filters });

      let query = this.client.from(this.checklistsTableName).select('*', { count: 'exact' });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.owner) {
        query = query.eq('owner', filters.owner);
      }
      if (filters?.category) {
        query = query.eq('metadata->>category', filters.category);
      }

      const sortField = params.sortBy ?? 'created_at';
      const sortOrder = params.sortOrder === SortOrder.ASC ? true : false;
      query = query.order(sortField, { ascending: sortOrder });

      const from = (params.page - 1) * params.pageSize;
      const to = from + params.pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        throw new RepositoryError({
          message: `Failed to list checklists: ${error.message}`,
          entityType: 'HardeningChecklist',
          table: this.checklistsTableName,
          operation: 'SELECT',
          cause: error,
        });
      }

      const total = count ?? 0;
      const items = (data as ChecklistRow[]).map((row) => this.mapRowToChecklist(row));

      return this.createPaginatedResult(items, total, params);
    } catch (err) {
      logger.error('Failed to list checklists', err as Error, { params, filters });
      throw err;
    }
  }

  /**
   * Counts total checklists with optional filtering.
   */
  async countChecklists(filters?: ChecklistFilterParams): Promise<number> {
    try {
      logger.debug('Counting checklists', { filters });

      let query = this.client.from(this.checklistsTableName).select('*', { count: 'exact', head: true });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.owner) {
        query = query.eq('owner', filters.owner);
      }
      if (filters?.category) {
        query = query.eq('metadata->>category', filters.category);
      }

      const { error, count } = await query;

      if (error) {
        throw new RepositoryError({
          message: `Failed to count checklists: ${error.message}`,
          entityType: 'HardeningChecklist',
          table: this.checklistsTableName,
          operation: 'SELECT',
          cause: error,
        });
      }

      return count ?? 0;
    } catch (err) {
      logger.error('Failed to count checklists', err as Error, { filters });
      throw err;
    }
  }

  // ============ Snapshot Operations ============

  /**
   * Creates a new snapshot.
   */
  async createSnapshot(snapshot: HardeningSnapshot): Promise<HardeningSnapshot> {
    try {
      logger.debug('Creating snapshot', { snapshotId: snapshot.snapshotId.value });

      const row = this.snapshotToRow(snapshot);

      const { data, error } = await this.client
        .from(this.snapshotsTableName)
        .insert(row)
        .select()
        .single();

      if (error) {
        throw RepositoryError.createFailed('HardeningSnapshot', error);
      }

      return this.mapRowToSnapshot(data as SnapshotRow);
    } catch (err) {
      logger.error('Failed to create snapshot', err as Error, { snapshotId: snapshot.snapshotId.value });
      throw err;
    }
  }

  /**
   * Finds a snapshot by its ID.
   */
  async findSnapshotById(id: SnapshotId): Promise<HardeningSnapshot | null> {
    try {
      logger.debug('Finding snapshot by ID', { snapshotId: id.value });

      const { data, error } = await this.client
        .from(this.snapshotsTableName)
        .select('*')
        .eq('snapshot_id', id.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw RepositoryError.entityNotFound('HardeningSnapshot', id.value, this.snapshotsTableName);
      }

      return this.mapRowToSnapshot(data as SnapshotRow);
    } catch (err) {
      logger.error('Failed to find snapshot by ID', err as Error, { snapshotId: id.value });
      throw err;
    }
  }

  /**
   * Lists all snapshots with pagination.
   */
  async listSnapshots(params: PaginationParams): Promise<PaginatedResult<HardeningSnapshot>> {
    try {
      logger.debug('Listing snapshots', { params });

      let query = this.client.from(this.snapshotsTableName).select('*', { count: 'exact' });

      const sortField = params.sortBy ?? 'created_at';
      const sortOrder = params.sortOrder === SortOrder.ASC ? true : false;
      query = query.order(sortField, { ascending: sortOrder });

      const from = (params.page - 1) * params.pageSize;
      const to = from + params.pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        throw new RepositoryError({
          message: `Failed to list snapshots: ${error.message}`,
          entityType: 'HardeningSnapshot',
          table: this.snapshotsTableName,
          operation: 'SELECT',
          cause: error,
        });
      }

      const total = count ?? 0;
      const items = (data as SnapshotRow[]).map((row) => this.mapRowToSnapshot(row));

      return this.createPaginatedResult(items, total, params);
    } catch (err) {
      logger.error('Failed to list snapshots', err as Error, { params });
      throw err;
    }
  }

  /**
   * Deletes a snapshot.
   */
  async deleteSnapshot(id: SnapshotId): Promise<void> {
    try {
      logger.debug('Deleting snapshot', { snapshotId: id.value });

      const { error } = await this.client
        .from(this.snapshotsTableName)
        .delete()
        .eq('snapshot_id', id.value);

      if (error) {
        throw RepositoryError.deleteFailed('HardeningSnapshot', id.value, error);
      }
    } catch (err) {
      logger.error('Failed to delete snapshot', err as Error, { snapshotId: id.value });
      throw err;
    }
  }

  /**
   * Counts total snapshots.
   */
  async countSnapshots(): Promise<number> {
    try {
      logger.debug('Counting snapshots');

      const { error, count } = await this.client
        .from(this.snapshotsTableName)
        .select('*', { count: 'exact', head: true });

      if (error) {
        throw new RepositoryError({
          message: `Failed to count snapshots: ${error.message}`,
          entityType: 'HardeningSnapshot',
          table: this.snapshotsTableName,
          operation: 'SELECT',
          cause: error,
        });
      }

      return count ?? 0;
    } catch (err) {
      logger.error('Failed to count snapshots', err as Error);
      throw err;
    }
  }

  // ============ Helper Methods ============

  private mapRowToRule(row: RuleRow): HardeningRule {
    return HardeningRule.fromStorage({
      ruleId: row.rule_id,
      name: row.name,
      status: row.status as HardeningRule['status'],
      priority: row.priority as HardeningRule['priority'],
      description: row.description,
      metadata: row.metadata as HardeningRuleRecord['metadata'],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  private mapRowToChecklist(row: ChecklistRow): HardeningChecklist {
    return HardeningChecklist.fromStorage({
      checklistId: row.checklist_id,
      title: row.title,
      status: row.status as HardeningChecklist['status'],
      completedAt: row.completed_at,
      owner: row.owner,
      metadata: row.metadata as HardeningChecklistRecord['metadata'],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  private mapRowToSnapshot(row: SnapshotRow): HardeningSnapshot {
    return HardeningSnapshot.fromStorage({
      snapshotId: row.snapshot_id,
      createdAt: row.created_at,
      systemVersion: row.system_version,
      moduleCount: row.module_count,
      healthStatus: row.health_status,
      metadata: row.metadata as HardeningSnapshotRecord['metadata'],
    });
  }

  private ruleToRow(rule: HardeningRule): RuleRow {
    return {
      rule_id: rule.ruleId.value,
      name: rule.name,
      status: rule.status,
      priority: rule.priority,
      description: rule.description,
      metadata: rule.metadata as unknown as Record<string, unknown>,
      created_at: rule.createdAt.toISOString(),
      updated_at: rule.updatedAt.toISOString(),
    };
  }

  private checklistToRow(checklist: HardeningChecklist): ChecklistRow {
    return {
      checklist_id: checklist.checklistId.value,
      title: checklist.title,
      status: checklist.status,
      completed_at: checklist.completedAt?.toISOString() ?? null,
      owner: checklist.owner,
      metadata: checklist.metadata as unknown as Record<string, unknown>,
      created_at: checklist.createdAt.toISOString(),
      updated_at: checklist.updatedAt.toISOString(),
    };
  }

  private snapshotToRow(snapshot: HardeningSnapshot): SnapshotRow {
    return {
      snapshot_id: snapshot.snapshotId.value,
      created_at: snapshot.createdAt.toISOString(),
      system_version: snapshot.systemVersion,
      module_count: snapshot.moduleCount,
      health_status: snapshot.healthStatus,
      metadata: snapshot.metadata as unknown as Record<string, unknown>,
    };
  }

  private createPaginatedResult<T>(
    items: T[],
    total: number,
    params: PaginationParams
  ): PaginatedResult<T> {
    const totalPages = Math.ceil(total / params.pageSize);
    return {
      items,
      total,
      page: params.page,
      pageSize: params.pageSize,
      totalPages,
      hasNextPage: params.page < totalPages,
      hasPreviousPage: params.page > 1,
    };
  }
}
