/**
 * Supabase Monitoring Repository
 *
 * Production Supabase implementation of the Monitoring repository.
 * Handles all persistence operations for monitoring entities.
 * Uses ONLY SupabaseProvider, Logger, and RepositoryError.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../../database/supabase-types';
import {
  IMonitoringRepository,
  HealthCheckFilterParams,
  SystemMetricFilterParams,
  ServiceStatusFilterParams,
} from '../interfaces/IMonitoringRepository';
import { HealthCheck, HealthCheckRecord } from '../entities/HealthCheck';
import { SystemMetric, SystemMetricRecord } from '../entities/SystemMetric';
import { ServiceStatus, ServiceStatusRecord } from '../entities/ServiceStatus';
import { HealthCheckId } from '../value-objects/HealthCheckId';
import { MetricId } from '../value-objects/MetricId';
import { ServiceId } from '../value-objects/ServiceId';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import { SortOrder } from '../../../shared/constants';
import { getSupabaseClient } from '../../../database/providers/supabase.provider';
import { RepositoryError } from '../../../database/errors/repository.error';
import { createLogger } from '../../../core/logging/logger.service';

const logger = createLogger('MonitoringRepository');

/**
 * Table names for monitoring data.
 */
const TABLE_NAMES = {
  HEALTH_CHECKS: 'health_checks',
  SYSTEM_METRICS: 'system_metrics',
  SERVICE_STATUSES: 'service_statuses',
} as const;

/**
 * Supabase implementation of the Monitoring Repository.
 * Implements IMonitoringRepository for monitoring entity persistence.
 * Never exposes raw Supabase rows - always returns domain entities.
 */
export class SupabaseMonitoringRepository implements IMonitoringRepository {
  private readonly _client: SupabaseClient<Database>;

  /**
   * Creates a new SupabaseMonitoringRepository instance.
   * @param client Optional Supabase client (uses default provider if not provided)
   */
  constructor(client?: SupabaseClient<Database>) {
    this._client = client ?? (getSupabaseClient() as SupabaseClient<Database>);
  }

  // ============ Health Check Operations ============

  /**
   * Records a new health check.
   */
  async recordHealthCheck(healthCheck: HealthCheck): Promise<HealthCheck> {
    try {
      logger.debug('Recording health check', { serviceName: healthCheck.serviceName });

      const record: HealthCheckRecord = {
        health_check_id: healthCheck.healthCheckId.value,
        service_name: healthCheck.serviceName,
        status: healthCheck.status,
        checked_at: healthCheck.checkedAt.toISOString(),
        response_time: healthCheck.responseTime,
        details: healthCheck.details,
        metadata: healthCheck.metadata,
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (this._client.from(TABLE_NAMES.HEALTH_CHECKS) as any)
        .insert(record)
        .select()
        .single() as { data: HealthCheckRecord; error: Record<string, unknown> | null };

      if (error) {
        throw RepositoryError.createFailed('HealthCheck', error as Error);
      }

      const entity = HealthCheck.fromDatabase(data);
      logger.info('Health check recorded', { 
        healthCheckId: entity.healthCheckId.value,
        serviceName: entity.serviceName,
        status: entity.status 
      });

      return entity;
    } catch (err) {
      logger.error('Failed to record health check', err as Error);
      throw RepositoryError.createFailed('HealthCheck', err as Error);
    }
  }

  /**
   * Finds a health check by its ID.
   */
  async findHealthCheckById(id: HealthCheckId): Promise<HealthCheck | null> {
    try {
      logger.debug('Finding health check by ID', { id: id.value });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (this._client.from(TABLE_NAMES.HEALTH_CHECKS) as any)
        .select('*')
        .eq('health_check_id', id.value)
        .single() as { data: HealthCheckRecord | null; error: Record<string, unknown> | null };

      if (error) {
        if ((error as { code?: string }).code === 'PGRST116') {
          return null; // Not found
        }
        throw RepositoryError.queryFailed(String(error), error as Error);
      }

      if (!data) {
        return null;
      }

      return HealthCheck.fromDatabase(data);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Failed to find health check by ID', err as Error);
      throw RepositoryError.queryFailed('findHealthCheckById', err as Error);
    }
  }

  /**
   * Lists health checks with pagination and filtering.
   */
  async listHealthChecks(
    params: PaginationParams,
    filters?: HealthCheckFilterParams
  ): Promise<PaginatedResult<HealthCheck>> {
    try {
      logger.debug('Listing health checks', { params, filters });

      const { page, pageSize, sortBy = 'checked_at', sortOrder = SortOrder.DESC } = params;
      const offset = (page - 1) * pageSize;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query = this._client.from(TABLE_NAMES.HEALTH_CHECKS).select('*', { count: 'exact' }) as any;

      // Apply filters
      if (filters?.serviceName) {
        query = query.eq('service_name', filters.serviceName);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.checkedAfter) {
        query = query.gte('checked_at', filters.checkedAfter.toISOString());
      }
      if (filters?.checkedBefore) {
        query = query.lte('checked_at', filters.checkedBefore.toISOString());
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === SortOrder.ASC });

      // Apply pagination
      query = query.range(offset, offset + pageSize - 1);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error, count } = await query as { data: HealthCheckRecord[] | null; error: Record<string, unknown> | null; count: number | null };

      if (error) {
        throw RepositoryError.queryFailed(String(error), error as Error);
      }

      const items = (data || []).map((record) => HealthCheck.fromDatabase(record));
      const total = count || 0;
      const totalPages = Math.ceil(total / pageSize);

      return {
        items,
        total,
        page,
        pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    } catch (err) {
      logger.error('Failed to list health checks', err as Error);
      throw RepositoryError.queryFailed('listHealthChecks', err as Error);
    }
  }

  /**
   * Counts health checks with optional filtering.
   */
  async countHealthChecks(filters?: HealthCheckFilterParams): Promise<number> {
    try {
      logger.debug('Counting health checks', { filters });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query = this._client.from(TABLE_NAMES.HEALTH_CHECKS).select('*', { count: 'exact', head: true }) as any;

      // Apply filters
      if (filters?.serviceName) {
        query = query.eq('service_name', filters.serviceName);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.checkedAfter) {
        query = query.gte('checked_at', filters.checkedAfter.toISOString());
      }
      if (filters?.checkedBefore) {
        query = query.lte('checked_at', filters.checkedBefore.toISOString());
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { count, error } = await query as { count: number | null; error: Record<string, unknown> | null };

      if (error) {
        throw RepositoryError.queryFailed(String(error), error as Error);
      }

      return count || 0;
    } catch (err) {
      logger.error('Failed to count health checks', err as Error);
      throw RepositoryError.queryFailed('countHealthChecks', err as Error);
    }
  }

  // ============ System Metric Operations ============

  /**
   * Records a new system metric.
   */
  async recordMetric(metric: SystemMetric): Promise<SystemMetric> {
    try {
      logger.debug('Recording metric', { metricName: metric.metricName });

      const record: SystemMetricRecord = {
        metric_id: metric.metricId.value,
        metric_name: metric.metricName,
        metric_value: metric.metricValue,
        unit: metric.unit,
        recorded_at: metric.recordedAt.toISOString(),
        metadata: metric.metadata,
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (this._client.from(TABLE_NAMES.SYSTEM_METRICS) as any)
        .insert(record)
        .select()
        .single() as { data: SystemMetricRecord; error: Record<string, unknown> | null };

      if (error) {
        throw RepositoryError.createFailed('SystemMetric', error as Error);
      }

      const entity = SystemMetric.fromDatabase(data);
      logger.info('Metric recorded', { 
        metricId: entity.metricId.value,
        metricName: entity.metricName,
        metricValue: entity.metricValue 
      });

      return entity;
    } catch (err) {
      logger.error('Failed to record metric', err as Error);
      throw RepositoryError.createFailed('SystemMetric', err as Error);
    }
  }

  /**
   * Finds a metric by its ID.
   */
  async findMetricById(id: MetricId): Promise<SystemMetric | null> {
    try {
      logger.debug('Finding metric by ID', { id: id.value });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (this._client.from(TABLE_NAMES.SYSTEM_METRICS) as any)
        .select('*')
        .eq('metric_id', id.value)
        .single() as { data: SystemMetricRecord | null; error: Record<string, unknown> | null };

      if (error) {
        if ((error as { code?: string }).code === 'PGRST116') {
          return null; // Not found
        }
        throw RepositoryError.queryFailed(String(error), error as Error);
      }

      if (!data) {
        return null;
      }

      return SystemMetric.fromDatabase(data);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Failed to find metric by ID', err as Error);
      throw RepositoryError.queryFailed('findMetricById', err as Error);
    }
  }

  /**
   * Lists metrics with pagination and filtering.
   */
  async listMetrics(
    params: PaginationParams,
    filters?: SystemMetricFilterParams
  ): Promise<PaginatedResult<SystemMetric>> {
    try {
      logger.debug('Listing metrics', { params, filters });

      const { page, pageSize, sortBy = 'recorded_at', sortOrder = SortOrder.DESC } = params;
      const offset = (page - 1) * pageSize;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query = this._client.from(TABLE_NAMES.SYSTEM_METRICS).select('*', { count: 'exact' }) as any;

      // Apply filters
      if (filters?.metricName) {
        query = query.eq('metric_name', filters.metricName);
      }
      if (filters?.minValue !== undefined) {
        query = query.gte('metric_value', filters.minValue);
      }
      if (filters?.maxValue !== undefined) {
        query = query.lte('metric_value', filters.maxValue);
      }
      if (filters?.recordedAfter) {
        query = query.gte('recorded_at', filters.recordedAfter.toISOString());
      }
      if (filters?.recordedBefore) {
        query = query.lte('recorded_at', filters.recordedBefore.toISOString());
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === SortOrder.ASC });

      // Apply pagination
      query = query.range(offset, offset + pageSize - 1);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error, count } = await query as { data: SystemMetricRecord[] | null; error: Record<string, unknown> | null; count: number | null };

      if (error) {
        throw RepositoryError.queryFailed(String(error), error as Error);
      }

      const items = (data || []).map((record) => SystemMetric.fromDatabase(record));
      const total = count || 0;
      const totalPages = Math.ceil(total / pageSize);

      return {
        items,
        total,
        page,
        pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    } catch (err) {
      logger.error('Failed to list metrics', err as Error);
      throw RepositoryError.queryFailed('listMetrics', err as Error);
    }
  }

  /**
   * Counts metrics with optional filtering.
   */
  async countMetrics(filters?: SystemMetricFilterParams): Promise<number> {
    try {
      logger.debug('Counting metrics', { filters });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query = this._client.from(TABLE_NAMES.SYSTEM_METRICS).select('*', { count: 'exact', head: true }) as any;

      // Apply filters
      if (filters?.metricName) {
        query = query.eq('metric_name', filters.metricName);
      }
      if (filters?.minValue !== undefined) {
        query = query.gte('metric_value', filters.minValue);
      }
      if (filters?.maxValue !== undefined) {
        query = query.lte('metric_value', filters.maxValue);
      }
      if (filters?.recordedAfter) {
        query = query.gte('recorded_at', filters.recordedAfter.toISOString());
      }
      if (filters?.recordedBefore) {
        query = query.lte('recorded_at', filters.recordedBefore.toISOString());
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { count, error } = await query as { count: number | null; error: Record<string, unknown> | null };

      if (error) {
        throw RepositoryError.queryFailed(String(error), error as Error);
      }

      return count || 0;
    } catch (err) {
      logger.error('Failed to count metrics', err as Error);
      throw RepositoryError.queryFailed('countMetrics', err as Error);
    }
  }

  // ============ Service Status Operations ============

  /**
   * Records or updates a service status.
   */
  async upsertServiceStatus(serviceStatus: ServiceStatus): Promise<ServiceStatus> {
    try {
      logger.debug('Upserting service status', { serviceName: serviceStatus.serviceName });

      const record: ServiceStatusRecord = {
        service_id: serviceStatus.serviceId.value,
        service_name: serviceStatus.serviceName,
        status: serviceStatus.status,
        last_heartbeat: serviceStatus.lastHeartbeat.toISOString(),
        version: serviceStatus.version,
        metadata: serviceStatus.metadata,
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (this._client.from(TABLE_NAMES.SERVICE_STATUSES) as any)
        .upsert(record, { onConflict: 'service_id' })
        .select()
        .single() as { data: ServiceStatusRecord; error: Record<string, unknown> | null };

      if (error) {
        throw RepositoryError.createFailed('ServiceStatus', error as Error);
      }

      const entity = ServiceStatus.fromDatabase(data);
      logger.info('Service status upserted', { 
        serviceId: entity.serviceId.value,
        serviceName: entity.serviceName,
        status: entity.status 
      });

      return entity;
    } catch (err) {
      logger.error('Failed to upsert service status', err as Error);
      throw RepositoryError.createFailed('ServiceStatus', err as Error);
    }
  }

  /**
   * Finds a service status by its ID.
   */
  async findServiceStatusById(id: ServiceId): Promise<ServiceStatus | null> {
    try {
      logger.debug('Finding service status by ID', { id: id.value });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (this._client.from(TABLE_NAMES.SERVICE_STATUSES) as any)
        .select('*')
        .eq('service_id', id.value)
        .single() as { data: ServiceStatusRecord | null; error: Record<string, unknown> | null };

      if (error) {
        if ((error as { code?: string }).code === 'PGRST116') {
          return null; // Not found
        }
        throw RepositoryError.queryFailed(String(error), error as Error);
      }

      if (!data) {
        return null;
      }

      return ServiceStatus.fromDatabase(data);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Failed to find service status by ID', err as Error);
      throw RepositoryError.queryFailed('findServiceStatusById', err as Error);
    }
  }

  /**
   * Finds a service status by its name.
   */
  async findServiceStatusByName(serviceName: string): Promise<ServiceStatus | null> {
    try {
      logger.debug('Finding service status by name', { serviceName });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (this._client.from(TABLE_NAMES.SERVICE_STATUSES) as any)
        .select('*')
        .eq('service_name', serviceName)
        .single() as { data: ServiceStatusRecord | null; error: Record<string, unknown> | null };

      if (error) {
        if ((error as { code?: string }).code === 'PGRST116') {
          return null; // Not found
        }
        throw RepositoryError.queryFailed(String(error), error as Error);
      }

      if (!data) {
        return null;
      }

      return ServiceStatus.fromDatabase(data);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Failed to find service status by name', err as Error);
      throw RepositoryError.queryFailed('findServiceStatusByName', err as Error);
    }
  }

  /**
   * Lists all services with pagination and filtering.
   */
  async listServiceStatuses(
    params: PaginationParams,
    filters?: ServiceStatusFilterParams
  ): Promise<PaginatedResult<ServiceStatus>> {
    try {
      logger.debug('Listing service statuses', { params, filters });

      const { page, pageSize, sortBy = 'last_heartbeat', sortOrder = SortOrder.DESC } = params;
      const offset = (page - 1) * pageSize;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query = this._client.from(TABLE_NAMES.SERVICE_STATUSES).select('*', { count: 'exact' }) as any;

      // Apply filters
      if (filters?.serviceName) {
        query = query.eq('service_name', filters.serviceName);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.heartbeatAfter) {
        query = query.gte('last_heartbeat', filters.heartbeatAfter.toISOString());
      }
      if (filters?.heartbeatBefore) {
        query = query.lte('last_heartbeat', filters.heartbeatBefore.toISOString());
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === SortOrder.ASC });

      // Apply pagination
      query = query.range(offset, offset + pageSize - 1);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error, count } = await query as { data: ServiceStatusRecord[] | null; error: Record<string, unknown> | null; count: number | null };

      if (error) {
        throw RepositoryError.queryFailed(String(error), error as Error);
      }

      const items = (data || []).map((record) => ServiceStatus.fromDatabase(record));
      const total = count || 0;
      const totalPages = Math.ceil(total / pageSize);

      return {
        items,
        total,
        page,
        pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    } catch (err) {
      logger.error('Failed to list service statuses', err as Error);
      throw RepositoryError.queryFailed('listServiceStatuses', err as Error);
    }
  }

  /**
   * Counts service statuses with optional filtering.
   */
  async countServiceStatuses(filters?: ServiceStatusFilterParams): Promise<number> {
    try {
      logger.debug('Counting service statuses', { filters });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query = this._client.from(TABLE_NAMES.SERVICE_STATUSES).select('*', { count: 'exact', head: true }) as any;

      // Apply filters
      if (filters?.serviceName) {
        query = query.eq('service_name', filters.serviceName);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.heartbeatAfter) {
        query = query.gte('last_heartbeat', filters.heartbeatAfter.toISOString());
      }
      if (filters?.heartbeatBefore) {
        query = query.lte('last_heartbeat', filters.heartbeatBefore.toISOString());
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { count, error } = await query as { count: number | null; error: Record<string, unknown> | null };

      if (error) {
        throw RepositoryError.queryFailed(String(error), error as Error);
      }

      return count || 0;
    } catch (err) {
      logger.error('Failed to count service statuses', err as Error);
      throw RepositoryError.queryFailed('countServiceStatuses', err as Error);
    }
  }

  /**
   * Deletes a service status by its ID.
   */
  async deleteServiceStatus(id: ServiceId): Promise<boolean> {
    try {
      logger.debug('Deleting service status', { id: id.value });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (this._client.from(TABLE_NAMES.SERVICE_STATUSES) as any)
        .delete()
        .eq('service_id', id.value) as { error: Record<string, unknown> | null };

      if (error) {
        throw RepositoryError.deleteFailed('ServiceStatus', id.value, error as Error);
      }

      logger.info('Service status deleted', { id: id.value });
      return true;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Failed to delete service status', err as Error);
      throw RepositoryError.deleteFailed('ServiceStatus', id.value, err as Error);
    }
  }
}
