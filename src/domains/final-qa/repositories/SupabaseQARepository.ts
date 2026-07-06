/**
 * Supabase QA Repository
 *
 * Production Supabase implementation of the QA repository.
 * Handles all persistence operations for QA entities.
 *
 * IMPORTANT: QA is a FOUNDATION layer. It ONLY stores checks, reports, and snapshots.
 * QA MUST NEVER modify gameplay, balances, rewards, inventory, or player state.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../../database/supabase-types';
import type {
  IQARepository,
  QACheckFilterParams,
  QASnapshotFilterParams,
  QAReportFilterParams,
} from '../interfaces/IQARepository';
import { QACheck, type QACheckRecord } from '../entities/QACheck';
import { QASnapshot, type QASnapshotRecord } from '../entities/QASnapshot';
import { QAReport, type QAReportRecord } from '../entities/QAReport';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import { SortOrder } from '../../../shared/constants';
import { CheckId } from '../value-objects/CheckId';
import { SnapshotId } from '../value-objects/SnapshotId';
import { ReportId } from '../value-objects/ReportId';
import { getSupabaseClient } from '../../../database/providers/supabase.provider';
import { createLogger } from '../../../core/logging/logger.service';
import { RepositoryError } from '../../../database/errors/repository.error';

const logger = createLogger('SupabaseQARepository');

/**
 * Database row types for qa_checks table.
 */
interface CheckRow {
  check_id: string;
  title: string;
  status: string;
  severity: string;
  completed_at: string | null;
  metadata: Record<string, unknown>;
}

/**
 * Database row types for qa_snapshots table.
 */
interface SnapshotRow {
  snapshot_id: string;
  created_at: string;
  backend_version: string;
  module_count: number;
  health_status: string;
  metadata: Record<string, unknown>;
}

/**
 * Database row types for qa_reports table.
 */
interface ReportRow {
  report_id: string;
  created_at: string;
  passed_checks: number;
  failed_checks: number;
  warnings: number;
  metadata: Record<string, unknown>;
}

/**
 * Supabase implementation of the QA Repository.
 * Implements IQARepository for QA entity persistence.
 *
 * Uses ONLY Supabase Provider, Logger, Configuration, Repository Error System.
 * Never exposes raw database rows - always returns domain entities.
 */
export class SupabaseQARepository implements IQARepository {
  private readonly checksTableName = 'qa_checks';
  private readonly snapshotsTableName = 'qa_snapshots';
  private readonly reportsTableName = 'qa_reports';
  private readonly _client?: SupabaseClient<Database>;

  /**
   * Creates a new SupabaseQARepository instance.
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

  /**
   * Helper to get client with proper typing for database operations.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private get db(): any {
    return this.client;
  }

  // ============ QA Check Operations ============

  /**
   * Creates a new QA check.
   */
  async createCheck(check: QACheck): Promise<QACheck> {
    try {
      logger.debug('Creating QA check', { checkId: check.checkId.value });

      const row = this.checkToRow(check);

      const { data, error } = await this.db
        .from(this.checksTableName)
        .insert(row)
        .select()
        .single();

      if (error) {
        throw RepositoryError.createFailed('QACheck', error);
      }

      return this.mapRowToCheck(data as CheckRow);
    } catch (err) {
      logger.error('Failed to create QA check', err as Error, { checkId: check.checkId.value });
      throw err;
    }
  }

  /**
   * Finds a QA check by its ID.
   */
  async findCheckById(id: CheckId): Promise<QACheck | null> {
    try {
      logger.debug('Finding QA check by ID', { checkId: id.value });

      const { data, error } = await this.db
        .from(this.checksTableName)
        .select('*')
        .eq('check_id', id.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw RepositoryError.entityNotFound('QACheck', id.value, this.checksTableName);
      }

      return this.mapRowToCheck(data as CheckRow);
    } catch (err) {
      logger.error('Failed to find QA check by ID', err as Error, { checkId: id.value });
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
      logger.debug('Listing QA checks', { params, filters });

      let query = this.db.from(this.checksTableName).select('*', { count: 'exact' });

      // Apply filters
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.severity) {
        query = query.eq('severity', filters.severity);
      }
      if (filters?.title) {
        query = query.ilike('title', `%${filters.title}%`);
      }
      if (filters?.completedAfter) {
        query = query.gte('completed_at', filters.completedAfter.toISOString());
      }
      if (filters?.completedBefore) {
        query = query.lte('completed_at', filters.completedBefore.toISOString());
      }

      // Apply sorting
      const sortField = params.sortBy ?? 'completed_at';
      const sortOrder = params.sortOrder === SortOrder.ASC ? true : false;
      query = query.order(sortField, { ascending: sortOrder });

      // Apply pagination
      const from = (params.page - 1) * params.pageSize;
      const to = from + params.pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        throw new RepositoryError({
          message: `Failed to list QA checks: ${error.message}`,
          entityType: 'QACheck',
          table: this.checksTableName,
          operation: 'SELECT',
          cause: error,
        });
      }

      const total = count ?? 0;
      const items = (data as CheckRow[]).map((row) => this.mapRowToCheck(row));

      return this.createPaginatedResult(items, total, params);
    } catch (err) {
      logger.error('Failed to list QA checks', err as Error, { params, filters });
      throw err;
    }
  }

  /**
   * Updates a QA check.
   */
  async updateCheck(check: QACheck): Promise<QACheck> {
    try {
      logger.debug('Updating QA check', { checkId: check.checkId.value });

      const row = this.checkToRow(check);

      const { data, error } = await this.db
        .from(this.checksTableName)
        .update(row)
        .eq('check_id', check.checkId.value)
        .select()
        .single();

      if (error) {
        throw RepositoryError.updateFailed('QACheck', check.checkId.value, error);
      }

      return this.mapRowToCheck(data as CheckRow);
    } catch (err) {
      logger.error('Failed to update QA check', err as Error, { checkId: check.checkId.value });
      throw err;
    }
  }

  /**
   * Deletes a QA check.
   */
  async deleteCheck(id: CheckId): Promise<void> {
    try {
      logger.debug('Deleting QA check', { checkId: id.value });

      const { error } = await this.db
        .from(this.checksTableName)
        .delete()
        .eq('check_id', id.value);

      if (error) {
        throw RepositoryError.deleteFailed('QACheck', id.value, error);
      }
    } catch (err) {
      logger.error('Failed to delete QA check', err as Error, { checkId: id.value });
      throw err;
    }
  }

  /**
   * Counts QA checks with optional filtering.
   */
  async countChecks(filters?: QACheckFilterParams): Promise<number> {
    try {
      logger.debug('Counting QA checks', { filters });

      let query = this.db
        .from(this.checksTableName)
        .select('*', { count: 'exact', head: true });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.severity) {
        query = query.eq('severity', filters.severity);
      }
      if (filters?.title) {
        query = query.ilike('title', `%${filters.title}%`);
      }
      if (filters?.completedAfter) {
        query = query.gte('completed_at', filters.completedAfter.toISOString());
      }
      if (filters?.completedBefore) {
        query = query.lte('completed_at', filters.completedBefore.toISOString());
      }

      const { error, count } = await query;

      if (error) {
        throw new RepositoryError({
          message: `Failed to count QA checks: ${error.message}`,
          entityType: 'QACheck',
          table: this.checksTableName,
          operation: 'SELECT',
          cause: error,
        });
      }

      return count ?? 0;
    } catch (err) {
      logger.error('Failed to count QA checks', err as Error, { filters });
      throw err;
    }
  }

  // ============ QA Snapshot Operations ============

  /**
   * Creates a new QA snapshot.
   */
  async createSnapshot(snapshot: QASnapshot): Promise<QASnapshot> {
    try {
      logger.debug('Creating QA snapshot', { snapshotId: snapshot.snapshotId.value });

      const row = this.snapshotToRow(snapshot);

      const { data, error } = await this.db
        .from(this.snapshotsTableName)
        .insert(row)
        .select()
        .single();

      if (error) {
        throw RepositoryError.createFailed('QASnapshot', error);
      }

      return this.mapRowToSnapshot(data as SnapshotRow);
    } catch (err) {
      logger.error('Failed to create QA snapshot', err as Error, { snapshotId: snapshot.snapshotId.value });
      throw err;
    }
  }

  /**
   * Finds a QA snapshot by its ID.
   */
  async findSnapshotById(id: SnapshotId): Promise<QASnapshot | null> {
    try {
      logger.debug('Finding QA snapshot by ID', { snapshotId: id.value });

      const { data, error } = await this.db
        .from(this.snapshotsTableName)
        .select('*')
        .eq('snapshot_id', id.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw RepositoryError.entityNotFound('QASnapshot', id.value, this.snapshotsTableName);
      }

      return this.mapRowToSnapshot(data as SnapshotRow);
    } catch (err) {
      logger.error('Failed to find QA snapshot by ID', err as Error, { snapshotId: id.value });
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
      logger.debug('Listing QA snapshots', { params, filters });

      let query = this.db.from(this.snapshotsTableName).select('*', { count: 'exact' });

      // Apply filters
      if (filters?.backendVersion) {
        query = query.eq('backend_version', filters.backendVersion);
      }
      if (filters?.healthStatus) {
        query = query.eq('health_status', filters.healthStatus);
      }
      if (filters?.createdAfter) {
        query = query.gte('created_at', filters.createdAfter.toISOString());
      }
      if (filters?.createdBefore) {
        query = query.lte('created_at', filters.createdBefore.toISOString());
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
          message: `Failed to list QA snapshots: ${error.message}`,
          entityType: 'QASnapshot',
          table: this.snapshotsTableName,
          operation: 'SELECT',
          cause: error,
        });
      }

      const total = count ?? 0;
      const items = (data as SnapshotRow[]).map((row) => this.mapRowToSnapshot(row));

      return this.createPaginatedResult(items, total, params);
    } catch (err) {
      logger.error('Failed to list QA snapshots', err as Error, { params, filters });
      throw err;
    }
  }

  /**
   * Updates a QA snapshot.
   */
  async updateSnapshot(snapshot: QASnapshot): Promise<QASnapshot> {
    try {
      logger.debug('Updating QA snapshot', { snapshotId: snapshot.snapshotId.value });

      const row = this.snapshotToRow(snapshot);

      const { data, error } = await this.db
        .from(this.snapshotsTableName)
        .update(row)
        .eq('snapshot_id', snapshot.snapshotId.value)
        .select()
        .single();

      if (error) {
        throw RepositoryError.updateFailed('QASnapshot', snapshot.snapshotId.value, error);
      }

      return this.mapRowToSnapshot(data as SnapshotRow);
    } catch (err) {
      logger.error('Failed to update QA snapshot', err as Error, { snapshotId: snapshot.snapshotId.value });
      throw err;
    }
  }

  /**
   * Deletes a QA snapshot.
   */
  async deleteSnapshot(id: SnapshotId): Promise<void> {
    try {
      logger.debug('Deleting QA snapshot', { snapshotId: id.value });

      const { error } = await this.db
        .from(this.snapshotsTableName)
        .delete()
        .eq('snapshot_id', id.value);

      if (error) {
        throw RepositoryError.deleteFailed('QASnapshot', id.value, error);
      }
    } catch (err) {
      logger.error('Failed to delete QA snapshot', err as Error, { snapshotId: id.value });
      throw err;
    }
  }

  /**
   * Counts QA snapshots with optional filtering.
   */
  async countSnapshots(filters?: QASnapshotFilterParams): Promise<number> {
    try {
      logger.debug('Counting QA snapshots', { filters });

      let query = this.db
        .from(this.snapshotsTableName)
        .select('*', { count: 'exact', head: true });

      if (filters?.backendVersion) {
        query = query.eq('backend_version', filters.backendVersion);
      }
      if (filters?.healthStatus) {
        query = query.eq('health_status', filters.healthStatus);
      }
      if (filters?.createdAfter) {
        query = query.gte('created_at', filters.createdAfter.toISOString());
      }
      if (filters?.createdBefore) {
        query = query.lte('created_at', filters.createdBefore.toISOString());
      }

      const { error, count } = await query;

      if (error) {
        throw new RepositoryError({
          message: `Failed to count QA snapshots: ${error.message}`,
          entityType: 'QASnapshot',
          table: this.snapshotsTableName,
          operation: 'SELECT',
          cause: error,
        });
      }

      return count ?? 0;
    } catch (err) {
      logger.error('Failed to count QA snapshots', err as Error, { filters });
      throw err;
    }
  }

  // ============ QA Report Operations ============

  /**
   * Creates a new QA report.
   */
  async createReport(report: QAReport): Promise<QAReport> {
    try {
      logger.debug('Creating QA report', { reportId: report.reportId.value });

      const row = this.reportToRow(report);

      const { data, error } = await this.db
        .from(this.reportsTableName)
        .insert(row)
        .select()
        .single();

      if (error) {
        throw RepositoryError.createFailed('QAReport', error);
      }

      return this.mapRowToReport(data as ReportRow);
    } catch (err) {
      logger.error('Failed to create QA report', err as Error, { reportId: report.reportId.value });
      throw err;
    }
  }

  /**
   * Finds a QA report by its ID.
   */
  async findReportById(id: ReportId): Promise<QAReport | null> {
    try {
      logger.debug('Finding QA report by ID', { reportId: id.value });

      const { data, error } = await this.db
        .from(this.reportsTableName)
        .select('*')
        .eq('report_id', id.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw RepositoryError.entityNotFound('QAReport', id.value, this.reportsTableName);
      }

      return this.mapRowToReport(data as ReportRow);
    } catch (err) {
      logger.error('Failed to find QA report by ID', err as Error, { reportId: id.value });
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
      logger.debug('Listing QA reports', { params, filters });

      let query = this.db.from(this.reportsTableName).select('*', { count: 'exact' });

      // Apply filters
      if (filters?.passedChecksMin !== undefined) {
        query = query.gte('passed_checks', filters.passedChecksMin);
      }
      if (filters?.failedChecksMin !== undefined) {
        query = query.gte('failed_checks', filters.failedChecksMin);
      }
      if (filters?.createdAfter) {
        query = query.gte('created_at', filters.createdAfter.toISOString());
      }
      if (filters?.createdBefore) {
        query = query.lte('created_at', filters.createdBefore.toISOString());
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
          message: `Failed to list QA reports: ${error.message}`,
          entityType: 'QAReport',
          table: this.reportsTableName,
          operation: 'SELECT',
          cause: error,
        });
      }

      const total = count ?? 0;
      const items = (data as ReportRow[]).map((row) => this.mapRowToReport(row));

      return this.createPaginatedResult(items, total, params);
    } catch (err) {
      logger.error('Failed to list QA reports', err as Error, { params, filters });
      throw err;
    }
  }

  /**
   * Updates a QA report.
   */
  async updateReport(report: QAReport): Promise<QAReport> {
    try {
      logger.debug('Updating QA report', { reportId: report.reportId.value });

      const row = this.reportToRow(report);

      const { data, error } = await this.db
        .from(this.reportsTableName)
        .update(row)
        .eq('report_id', report.reportId.value)
        .select()
        .single();

      if (error) {
        throw RepositoryError.updateFailed('QAReport', report.reportId.value, error);
      }

      return this.mapRowToReport(data as ReportRow);
    } catch (err) {
      logger.error('Failed to update QA report', err as Error, { reportId: report.reportId.value });
      throw err;
    }
  }

  /**
   * Deletes a QA report.
   */
  async deleteReport(id: ReportId): Promise<void> {
    try {
      logger.debug('Deleting QA report', { reportId: id.value });

      const { error } = await this.db
        .from(this.reportsTableName)
        .delete()
        .eq('report_id', id.value);

      if (error) {
        throw RepositoryError.deleteFailed('QAReport', id.value, error);
      }
    } catch (err) {
      logger.error('Failed to delete QA report', err as Error, { reportId: id.value });
      throw err;
    }
  }

  /**
   * Counts QA reports with optional filtering.
   */
  async countReports(filters?: QAReportFilterParams): Promise<number> {
    try {
      logger.debug('Counting QA reports', { filters });

      let query = this.db
        .from(this.reportsTableName)
        .select('*', { count: 'exact', head: true });

      if (filters?.passedChecksMin !== undefined) {
        query = query.gte('passed_checks', filters.passedChecksMin);
      }
      if (filters?.failedChecksMin !== undefined) {
        query = query.gte('failed_checks', filters.failedChecksMin);
      }
      if (filters?.createdAfter) {
        query = query.gte('created_at', filters.createdAfter.toISOString());
      }
      if (filters?.createdBefore) {
        query = query.lte('created_at', filters.createdBefore.toISOString());
      }

      const { error, count } = await query;

      if (error) {
        throw new RepositoryError({
          message: `Failed to count QA reports: ${error.message}`,
          entityType: 'QAReport',
          table: this.reportsTableName,
          operation: 'SELECT',
          cause: error,
        });
      }

      return count ?? 0;
    } catch (err) {
      logger.error('Failed to count QA reports', err as Error, { filters });
      throw err;
    }
  }

  // ============ Helper Methods ============

  private mapRowToCheck(row: CheckRow): QACheck {
    return QACheck.fromDatabase({
      check_id: row.check_id,
      title: row.title,
      status: row.status,
      severity: row.severity,
      completed_at: row.completed_at,
      metadata: row.metadata,
    });
  }

  private mapRowToSnapshot(row: SnapshotRow): QASnapshot {
    return QASnapshot.fromDatabase({
      snapshot_id: row.snapshot_id,
      created_at: row.created_at,
      backend_version: row.backend_version,
      module_count: row.module_count,
      health_status: row.health_status,
      metadata: row.metadata,
    });
  }

  private mapRowToReport(row: ReportRow): QAReport {
    return QAReport.fromDatabase({
      report_id: row.report_id,
      created_at: row.created_at,
      passed_checks: row.passed_checks,
      failed_checks: row.failed_checks,
      warnings: row.warnings,
      metadata: row.metadata,
    });
  }

  private checkToRow(check: QACheck): CheckRow {
    return {
      check_id: check.checkId.value,
      title: check.title,
      status: check.status,
      severity: check.severity,
      completed_at: check.completedAt?.toISOString() ?? null,
      metadata: check.metadata as unknown as Record<string, unknown>,
    };
  }

  private snapshotToRow(snapshot: QASnapshot): SnapshotRow {
    return {
      snapshot_id: snapshot.snapshotId.value,
      created_at: snapshot.createdAt.toISOString(),
      backend_version: snapshot.backendVersion,
      module_count: snapshot.moduleCount,
      health_status: snapshot.healthStatus,
      metadata: snapshot.metadata as unknown as Record<string, unknown>,
    };
  }

  private reportToRow(report: QAReport): ReportRow {
    return {
      report_id: report.reportId.value,
      created_at: report.createdAt.toISOString(),
      passed_checks: report.passedChecks,
      failed_checks: report.failedChecks,
      warnings: report.warnings,
      metadata: report.metadata as unknown as Record<string, unknown>,
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
