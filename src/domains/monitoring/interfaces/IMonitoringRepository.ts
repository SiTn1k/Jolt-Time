/**
 * IMonitoringRepository Interface
 *
 * Interface defining the contract for Monitoring persistence.
 * All monitoring repository implementations must adhere to this interface.
 */

import type { HealthCheckId } from '../value-objects/HealthCheckId';
import type { MetricId } from '../value-objects/MetricId';
import type { ServiceId } from '../value-objects/ServiceId';
import type { HealthCheck } from '../entities/HealthCheck';
import type { SystemMetric } from '../entities/SystemMetric';
import type { ServiceStatus } from '../entities/ServiceStatus';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';

/**
 * Filter parameters for querying health checks.
 */
export interface HealthCheckFilterParams {
  /** Filter by service name */
  serviceName?: string;

  /** Filter by health status */
  status?: string;

  /** Filter by check date after */
  checkedAfter?: Date;

  /** Filter by check date before */
  checkedBefore?: Date;
}

/**
 * Filter parameters for querying system metrics.
 */
export interface SystemMetricFilterParams {
  /** Filter by metric name */
  metricName?: string;

  /** Filter by metric value min */
  minValue?: number;

  /** Filter by metric value max */
  maxValue?: number;

  /** Filter by recording date after */
  recordedAfter?: Date;

  /** Filter by recording date before */
  recordedBefore?: Date;
}

/**
 * Filter parameters for querying service status records.
 */
export interface ServiceStatusFilterParams {
  /** Filter by service name */
  serviceName?: string;

  /** Filter by service status */
  status?: string;

  /** Filter by heartbeat after */
  heartbeatAfter?: Date;

  /** Filter by heartbeat before */
  heartbeatBefore?: Date;
}

/**
 * Monitoring repository interface.
 * Defines all data access operations for monitoring entities.
 */
export interface IMonitoringRepository {
  // ============ Health Check Operations ============

  /**
   * Records a new health check.
   * @param healthCheck The health check to record
   * @returns The recorded health check
   */
  recordHealthCheck(healthCheck: HealthCheck): Promise<HealthCheck>;

  /**
   * Finds a health check by its ID.
   * @param id The health check ID to find
   * @returns The health check if found, null otherwise
   */
  findHealthCheckById(id: HealthCheckId): Promise<HealthCheck | null>;

  /**
   * Lists health checks with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of health checks
   */
  listHealthChecks(
    params: PaginationParams,
    filters?: HealthCheckFilterParams
  ): Promise<PaginatedResult<HealthCheck>>;

  /**
   * Counts health checks with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching health checks
   */
  countHealthChecks(filters?: HealthCheckFilterParams): Promise<number>;

  // ============ System Metric Operations ============

  /**
   * Records a new system metric.
   * @param metric The metric to record
   * @returns The recorded metric
   */
  recordMetric(metric: SystemMetric): Promise<SystemMetric>;

  /**
   * Finds a metric by its ID.
   * @param id The metric ID to find
   * @returns The metric if found, null otherwise
   */
  findMetricById(id: MetricId): Promise<SystemMetric | null>;

  /**
   * Lists metrics with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of metrics
   */
  listMetrics(
    params: PaginationParams,
    filters?: SystemMetricFilterParams
  ): Promise<PaginatedResult<SystemMetric>>;

  /**
   * Counts metrics with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching metrics
   */
  countMetrics(filters?: SystemMetricFilterParams): Promise<number>;

  // ============ Service Status Operations ============

  /**
   * Records or updates a service status.
   * @param serviceStatus The service status to record
   * @returns The recorded/updated service status
   */
  upsertServiceStatus(serviceStatus: ServiceStatus): Promise<ServiceStatus>;

  /**
   * Finds a service status by its ID.
   * @param id The service ID to find
   * @returns The service status if found, null otherwise
   */
  findServiceStatusById(id: ServiceId): Promise<ServiceStatus | null>;

  /**
   * Finds a service status by its name.
   * @param serviceName The service name to find
   * @returns The service status if found, null otherwise
   */
  findServiceStatusByName(serviceName: string): Promise<ServiceStatus | null>;

  /**
   * Lists all services with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of service statuses
   */
  listServiceStatuses(
    params: PaginationParams,
    filters?: ServiceStatusFilterParams
  ): Promise<PaginatedResult<ServiceStatus>>;

  /**
   * Counts service statuses with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching service statuses
   */
  countServiceStatuses(filters?: ServiceStatusFilterParams): Promise<number>;

  /**
   * Deletes a service status by its ID.
   * @param id The service ID to delete
   * @returns True if deleted, false if not found
   */
  deleteServiceStatus(id: ServiceId): Promise<boolean>;
}
