/**
 * Supabase Stabilization Repository
 *
 * Production Supabase implementation of the Stabilization repository.
 * Handles all persistence operations for stabilization entities.
 *
 * IMPORTANT: Stabilization is a FOUNDATION layer. It ONLY stores issues,
 * reports, and health snapshots. Stabilization MUST NEVER modify gameplay,
 * balances, rewards, inventory, or player state.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../../database/supabase-types';
import type {
  IStabilizationRepository,
  IssueFilterParams,
  ReportFilterParams,
  SnapshotFilterParams,
} from '../interfaces/IStabilizationRepository';
import { StabilizationIssue, StabilizationIssueRecord } from '../entities/StabilizationIssue';
import { StabilizationReport, StabilizationReportRecord } from '../entities/StabilizationReport';
import { HealthSnapshot, HealthSnapshotRecord } from '../entities/HealthSnapshot';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import { IssueId } from '../value-objects/IssueId';
import { ReportId } from '../value-objects/ReportId';
import { HealthSnapshotId } from '../value-objects/HealthSnapshotId';
import { RepositoryError } from '../../../database/errors/repository.error';
import { createLogger } from '../../../core/logging/logger.service';

const logger = createLogger('StabilizationRepository');

/**
 * Supabase implementation of the Stabilization Repository.
 * Implements IStabilizationRepository for stabilization entity persistence.
 *
 * IMPORTANT: Stabilization is a FOUNDATION layer. It ONLY stores issues,
 * reports, and health snapshots. Stabilization MUST NEVER modify gameplay,
 * balances, rewards, inventory, or player state.
 */
export class SupabaseStabilizationRepository implements IStabilizationRepository {
  private readonly _client: SupabaseClient<Database>;
  private readonly _tableNames = {
    issues: 'stabilization_issues',
    reports: 'stabilization_reports',
    snapshots: 'health_snapshots',
  } as const;

  /**
   * Creates a new SupabaseStabilizationRepository instance.
   * @param client Optional Supabase client (uses default provider if not provided)
   */
  constructor(client?: SupabaseClient<Database>) {
    // NOTE: Client initialization deferred to avoid circular dependency
    // In full implementation, this would use getSupabaseClient()
    this._client = client as SupabaseClient<Database>;
  }

  /**
   * Helper to build range for pagination.
   */
  private buildRange(params: PaginationParams): { from: number; to: number } {
    const from = (params.page - 1) * params.pageSize;
    const to = from + params.pageSize - 1;
    return { from, to };
  }

  /**
   * Helper to build paginated result.
   */
  private buildPaginatedResult<T>(
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

  // ============ Issue Operations ============

  /**
   * Stores a new stabilization issue.
   */
  async storeIssue(issue: StabilizationIssue): Promise<StabilizationIssue> {
    try {
      const record: StabilizationIssueRecord = {
        issue_id: issue.issueId.value,
        module: issue.module,
        severity: issue.severity,
        description: issue.description,
        status: issue.status,
        created_at: issue.createdAt.toISOString(),
        metadata: issue.metadata,
      };

      const { data, error } = await this._client
        .from(this._tableNames.issues)
        .insert(record)
        .select()
        .single();

      if (error) {
        logger.error('Failed to store issue', error);
        throw RepositoryError.createFailed('StabilizationIssue', error);
      }

      return StabilizationIssue.fromDatabase(data);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error storing issue', err as Error);
      throw RepositoryError.createFailed('StabilizationIssue', err as Error);
    }
  }

  /**
   * Finds an issue by its ID.
   */
  async findIssueById(id: IssueId): Promise<StabilizationIssue | null> {
    try {
      const { data, error } = await this._client
        .from(this._tableNames.issues)
        .select('*')
        .eq('issue_id', id.value)
        .single();

      if (error) {
        if ((error as { code?: string }).code === 'PGRST116') {
          return null;
        }
        logger.error('Failed to find issue by ID', error);
        throw RepositoryError.queryFailed(`findIssueById: ${error.message}`);
      }

      return StabilizationIssue.fromDatabase(data);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error finding issue by ID', err as Error);
      throw RepositoryError.queryFailed('findIssueById', err as Error);
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
      let query = this._client
        .from(this._tableNames.issues)
        .select('*', { count: 'exact' });

      if (filters) {
        if (filters.module) {
          query = query.eq('module', filters.module);
        }
        if (filters.severity) {
          query = query.eq('severity', filters.severity);
        }
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        if (filters.createdAfter) {
          query = query.gte('created_at', filters.createdAfter.toISOString());
        }
        if (filters.createdBefore) {
          query = query.lte('created_at', filters.createdBefore.toISOString());
        }
      }

      const { from, to } = this.buildRange(params);
      query = query.range(from, to);

      const sortOrder = params.sortOrder === 'asc' ? 'asc' : 'desc';
      const sortBy = params.sortBy || 'created_at';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      const { data, error, count } = await query;

      if (error) {
        logger.error('Failed to list issues', error);
        throw RepositoryError.queryFailed(`listIssues: ${error.message}`);
      }

      const issues = (data || []).map((row) => StabilizationIssue.fromDatabase(row));
      return this.buildPaginatedResult(issues, count || 0, params);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error listing issues', err as Error);
      throw RepositoryError.queryFailed('listIssues', err as Error);
    }
  }

  /**
   * Updates an existing issue.
   */
  async updateIssue(
    id: IssueId,
    updates: Partial<StabilizationIssue>
  ): Promise<StabilizationIssue> {
    try {
      const updateData: Record<string, unknown> = {};

      if (updates.severity !== undefined) {
        updateData.severity = updates.severity;
      }
      if (updates.description !== undefined) {
        updateData.description = updates.description;
      }
      if (updates.status !== undefined) {
        updateData.status = updates.status;
      }
      if (updates.metadata !== undefined) {
        updateData.metadata = updates.metadata;
      }

      const { data, error } = await this._client
        .from(this._tableNames.issues)
        .update(updateData)
        .eq('issue_id', id.value)
        .select()
        .single();

      if (error) {
        logger.error('Failed to update issue', error);
        throw RepositoryError.updateFailed('StabilizationIssue', id.value, error);
      }

      return StabilizationIssue.fromDatabase(data);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error updating issue', err as Error);
      throw RepositoryError.updateFailed('StabilizationIssue', id.value, err as Error);
    }
  }

  /**
   * Counts issues with optional filtering.
   */
  async countIssues(filters?: IssueFilterParams): Promise<number> {
    try {
      let query = this._client
        .from(this._tableNames.issues)
        .select('*', { count: 'exact', head: true });

      if (filters) {
        if (filters.module) {
          query = query.eq('module', filters.module);
        }
        if (filters.severity) {
          query = query.eq('severity', filters.severity);
        }
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        if (filters.createdAfter) {
          query = query.gte('created_at', filters.createdAfter.toISOString());
        }
        if (filters.createdBefore) {
          query = query.lte('created_at', filters.createdBefore.toISOString());
        }
      }

      const { count, error } = await query;

      if (error) {
        logger.error('Failed to count issues', error);
        throw RepositoryError.queryFailed(`countIssues: ${error.message}`);
      }

      return count || 0;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error counting issues', err as Error);
      throw RepositoryError.queryFailed('countIssues', err as Error);
    }
  }

  // ============ Report Operations ============

  /**
   * Stores a new stabilization report.
   */
  async storeReport(report: StabilizationReport): Promise<StabilizationReport> {
    try {
      const record: StabilizationReportRecord = {
        report_id: report.reportId.value,
        created_at: report.createdAt.toISOString(),
        healthy_modules: report.healthyModules,
        warning_modules: report.warningModules,
        failed_modules: report.failedModules,
        metadata: report.metadata,
      };

      const { data, error } = await this._client
        .from(this._tableNames.reports)
        .insert(record)
        .select()
        .single();

      if (error) {
        logger.error('Failed to store report', error);
        throw RepositoryError.createFailed('StabilizationReport', error);
      }

      return StabilizationReport.fromDatabase(data);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error storing report', err as Error);
      throw RepositoryError.createFailed('StabilizationReport', err as Error);
    }
  }

  /**
   * Finds a report by its ID.
   */
  async findReportById(id: ReportId): Promise<StabilizationReport | null> {
    try {
      const { data, error } = await this._client
        .from(this._tableNames.reports)
        .select('*')
        .eq('report_id', id.value)
        .single();

      if (error) {
        if ((error as { code?: string }).code === 'PGRST116') {
          return null;
        }
        logger.error('Failed to find report by ID', error);
        throw RepositoryError.queryFailed(`findReportById: ${error.message}`);
      }

      return StabilizationReport.fromDatabase(data);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error finding report by ID', err as Error);
      throw RepositoryError.queryFailed('findReportById', err as Error);
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
      let query = this._client
        .from(this._tableNames.reports)
        .select('*', { count: 'exact' });

      if (filters) {
        if (filters.createdAfter) {
          query = query.gte('created_at', filters.createdAfter.toISOString());
        }
        if (filters.createdBefore) {
          query = query.lte('created_at', filters.createdBefore.toISOString());
        }
      }

      const { from, to } = this.buildRange(params);
      query = query.range(from, to);

      const sortOrder = params.sortOrder === 'asc' ? 'asc' : 'desc';
      const sortBy = params.sortBy || 'created_at';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      const { data, error, count } = await query;

      if (error) {
        logger.error('Failed to list reports', error);
        throw RepositoryError.queryFailed(`listReports: ${error.message}`);
      }

      const reports = (data || []).map((row) => StabilizationReport.fromDatabase(row));
      return this.buildPaginatedResult(reports, count || 0, params);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error listing reports', err as Error);
      throw RepositoryError.queryFailed('listReports', err as Error);
    }
  }

  /**
   * Counts reports with optional filtering.
   */
  async countReports(filters?: ReportFilterParams): Promise<number> {
    try {
      let query = this._client
        .from(this._tableNames.reports)
        .select('*', { count: 'exact', head: true });

      if (filters) {
        if (filters.createdAfter) {
          query = query.gte('created_at', filters.createdAfter.toISOString());
        }
        if (filters.createdBefore) {
          query = query.lte('created_at', filters.createdBefore.toISOString());
        }
      }

      const { count, error } = await query;

      if (error) {
        logger.error('Failed to count reports', error);
        throw RepositoryError.queryFailed(`countReports: ${error.message}`);
      }

      return count || 0;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error counting reports', err as Error);
      throw RepositoryError.queryFailed('countReports', err as Error);
    }
  }

  // ============ Health Snapshot Operations ============

  /**
   * Stores a new health snapshot.
   */
  async storeSnapshot(snapshot: HealthSnapshot): Promise<HealthSnapshot> {
    try {
      const record: HealthSnapshotRecord = {
        snapshot_id: snapshot.snapshotId.value,
        created_at: snapshot.createdAt.toISOString(),
        memory: snapshot.memory,
        cpu: snapshot.cpu,
        database: snapshot.database,
        cache: snapshot.cache,
        api: snapshot.api,
        metadata: snapshot.metadata,
      };

      const { data, error } = await this._client
        .from(this._tableNames.snapshots)
        .insert(record)
        .select()
        .single();

      if (error) {
        logger.error('Failed to store snapshot', error);
        throw RepositoryError.createFailed('HealthSnapshot', error);
      }

      return HealthSnapshot.fromDatabase(data);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error storing snapshot', err as Error);
      throw RepositoryError.createFailed('HealthSnapshot', err as Error);
    }
  }

  /**
   * Finds a snapshot by its ID.
   */
  async findSnapshotById(id: HealthSnapshotId): Promise<HealthSnapshot | null> {
    try {
      const { data, error } = await this._client
        .from(this._tableNames.snapshots)
        .select('*')
        .eq('snapshot_id', id.value)
        .single();

      if (error) {
        if ((error as { code?: string }).code === 'PGRST116') {
          return null;
        }
        logger.error('Failed to find snapshot by ID', error);
        throw RepositoryError.queryFailed(`findSnapshotById: ${error.message}`);
      }

      return HealthSnapshot.fromDatabase(data);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error finding snapshot by ID', err as Error);
      throw RepositoryError.queryFailed('findSnapshotById', err as Error);
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
      let query = this._client
        .from(this._tableNames.snapshots)
        .select('*', { count: 'exact' });

      if (filters) {
        if (filters.createdAfter) {
          query = query.gte('created_at', filters.createdAfter.toISOString());
        }
        if (filters.createdBefore) {
          query = query.lte('created_at', filters.createdBefore.toISOString());
        }
      }

      const { from, to } = this.buildRange(params);
      query = query.range(from, to);

      const sortOrder = params.sortOrder === 'asc' ? 'asc' : 'desc';
      const sortBy = params.sortBy || 'created_at';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      const { data, error, count } = await query;

      if (error) {
        logger.error('Failed to list snapshots', error);
        throw RepositoryError.queryFailed(`listSnapshots: ${error.message}`);
      }

      const snapshots = (data || []).map((row) => HealthSnapshot.fromDatabase(row));
      return this.buildPaginatedResult(snapshots, count || 0, params);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error listing snapshots', err as Error);
      throw RepositoryError.queryFailed('listSnapshots', err as Error);
    }
  }

  /**
   * Finds the latest snapshot.
   */
  async findLatestSnapshot(): Promise<HealthSnapshot | null> {
    try {
      const { data, error } = await this._client
        .from(this._tableNames.snapshots)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if ((error as { code?: string }).code === 'PGRST116') {
          return null;
        }
        logger.error('Failed to find latest snapshot', error);
        throw RepositoryError.queryFailed(`findLatestSnapshot: ${error.message}`);
      }

      return HealthSnapshot.fromDatabase(data);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Unexpected error finding latest snapshot', err as Error);
      throw RepositoryError.queryFailed('findLatestSnapshot', err as Error);
    }
  }

  /**
   * Counts snapshots with optional filtering.
   */
  async countSnapshots(filters?: SnapshotFilterParams): Promise<number> {
    try {
      let query = this._client
        .from(this._tableNames.snapshots)
        .select('*', { count: 'exact', head: true });

      if (filters) {
        if (filters.createdAfter) {
          query = query.gte('created_at', filters.createdAfter.toISOString());
        }
        if (filters.createdBefore) {
          query = query.lte('created_at', filters.createdBefore.toISOString());
        }
      }

      const { count, error } = await query;

      if (error) {
        logger.error('Failed to count snapshots', error);
        throw RepositoryError.queryFailed(`countSnapshots: ${error.message}`);
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
}
