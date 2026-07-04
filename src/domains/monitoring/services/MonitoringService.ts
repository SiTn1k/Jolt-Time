/**
 * MonitoringService
 *
 * Central service for all monitoring operations.
 * Orchestrates health checks, metrics recording, and service status tracking.
 * 
 * IMPORTANT: This service ONLY observes and records - it NEVER modifies gameplay.
 */

import type { ILogger } from '../../../shared/types';
import { createLogger } from '../../../core/logging/logger.service';
import type { IMonitoringRepository } from '../interfaces/IMonitoringRepository';
import { HealthCheck } from '../entities/HealthCheck';
import { SystemMetric } from '../entities/SystemMetric';
import { ServiceStatus } from '../entities/ServiceStatus';
import { HealthCheckId } from '../value-objects/HealthCheckId';
import { MetricId } from '../value-objects/MetricId';
import { ServiceId } from '../value-objects/ServiceId';
import { HealthStatus } from '../types/HealthStatus';
import { ServiceStatusType } from '../types/ServiceStatusType';
import { MetricUnit } from '../types/MetricUnit';
import type { MonitoringMetadata } from '../types/MonitoringMetadata';
import type { MonitoringStatistics } from '../types/MonitoringStatistics';
import { createEmptyMonitoringStatistics } from '../types/MonitoringStatistics';
import { createHealthCheckedEvent, type HealthCheckedEvent } from '../events/HealthChecked.event';
import { createMetricRecordedEvent, type MetricRecordedEvent } from '../events/MetricRecorded.event';
import { createServiceOnlineEvent, type ServiceOnlineEvent } from '../events/ServiceOnline.event';
import { createServiceOfflineEvent, type ServiceOfflineEvent } from '../events/ServiceOffline.event';
import type { PaginationParams } from '../../../shared/types/base.types';

/**
 * Service names for built-in health checks.
 */
export const MONITORING_SERVICE_NAMES = {
  DATABASE: 'database',
  TELEGRAM_API: 'telegram_api',
  CONFIGURATION_SERVICE: 'configuration_service',
  SCHEDULER: 'scheduler',
  EVENT_BUS: 'event_bus',
  NOTIFICATION: 'notification',
  ANALYTICS: 'analytics',
  AUDIT: 'audit',
} as const;

/**
 * Metric names for built-in metrics.
 */
export const MONITORING_METRIC_NAMES = {
  MEMORY_USAGE: 'memory_usage',
  CPU_USAGE: 'cpu_usage',
  RESPONSE_TIME: 'response_time',
  DATABASE_LATENCY: 'database_latency',
  QUEUE_LENGTH: 'queue_length',
  JOB_COUNT: 'job_count',
  ACTIVE_SESSIONS: 'active_sessions',
  ERROR_COUNT: 'error_count',
} as const;

/**
 * Monitoring Service interface for dependency injection.
 */
export interface IMonitoringService {
  // Health Check Operations
  recordHealthCheck(params: {
    serviceName: string;
    status: HealthStatus;
    responseTime: number;
    details?: string;
    metadata?: MonitoringMetadata;
  }): Promise<HealthCheck>;

  runHealthCheck(serviceName: string): Promise<HealthCheck>;

  getHealthChecks(params: PaginationParams, filters?: {
    serviceName?: string;
    status?: HealthStatus;
  }): Promise<{
    items: HealthCheck[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }>;

  // Metric Operations
  recordMetric(params: {
    metricName: string;
    metricValue: number;
    unit: MetricUnit;
    metadata?: MonitoringMetadata;
  }): Promise<SystemMetric>;

  recordSystemMetrics(metrics: Array<{
    metricName: string;
    metricValue: number;
    unit: MetricUnit;
    metadata?: MonitoringMetadata;
  }>): Promise<SystemMetric[]>;

  getMetrics(params: PaginationParams, filters?: {
    metricName?: string;
    minValue?: number;
    maxValue?: number;
  }): Promise<{
    items: SystemMetric[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }>;

  // Service Status Operations
  updateServiceStatus(params: {
    serviceName: string;
    status: ServiceStatusType;
    version?: string;
    metadata?: MonitoringMetadata;
  }): Promise<ServiceStatus>;

  recordHeartbeat(serviceName: string, version?: string): Promise<ServiceStatus>;

  getServiceStatus(serviceName: string): Promise<ServiceStatus | null>;

  getServiceStatuses(params: PaginationParams, filters?: {
    status?: ServiceStatusType;
  }): Promise<{
    items: ServiceStatus[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }>;

  // Statistics
  getMonitoringStatistics(): Promise<MonitoringStatistics>;

  // Events
  getLatestHealthEvents(count?: number): HealthCheckedEvent[];

  getLatestMetricEvents(count?: number): MetricRecordedEvent[];

  getLatestServiceEvents(count?: number): Array<ServiceOnlineEvent | ServiceOfflineEvent>;
}

/**
 * MonitoringService implementation.
 * 
 * IMPORTANT: This service ONLY stores and reports - it NEVER:
 * - Modifies gameplay
 * - Restarts services
 * - Grants rewards
 * - Modifies balances
 * - Modifies inventory
 * - Executes business logic
 */
export class MonitoringService implements IMonitoringService {
  private readonly repository: IMonitoringRepository;
  private readonly logger: ILogger;
  private readonly healthEvents: HealthCheckedEvent[] = [];
  private readonly metricEvents: MetricRecordedEvent[] = [];
  private readonly serviceEvents: Array<ServiceOnlineEvent | ServiceOfflineEvent> = [];
  private readonly maxEventHistory = 100;

  constructor(repository: IMonitoringRepository, logger?: ILogger) {
    this.repository = repository;
    this.logger = logger ?? createLogger('MonitoringService');
  }

  // ============ Health Check Operations ============

  /**
   * Records a health check result.
   */
  async recordHealthCheck(params: {
    serviceName: string;
    status: HealthStatus;
    responseTime: number;
    details?: string;
    metadata?: MonitoringMetadata;
  }): Promise<HealthCheck> {
    this.logger.debug('Recording health check', params);

    try {
      const healthCheck = HealthCheck.create({
        healthCheckId: HealthCheckId.create(),
        serviceName: params.serviceName,
        status: params.status,
        responseTime: params.responseTime,
        details: params.details,
        metadata: params.metadata,
      });

      const recorded = await this.repository.recordHealthCheck(healthCheck);

      // Store event
      const event = createHealthCheckedEvent({
        healthCheckId: recorded.healthCheckId,
        serviceName: recorded.serviceName,
        status: recorded.status,
        responseTime: recorded.responseTime,
      });
      this.addHealthEvent(event);

      this.logger.info('Health check recorded', {
        serviceName: recorded.serviceName,
        status: recorded.status,
        responseTime: recorded.responseTime,
      });

      return recorded;
    } catch (err) {
      // Failure handling: Monitoring must never stop gameplay
      this.logger.error('Failed to record health check - continuing', err as Error);
      throw err;
    }
  }

  /**
   * Runs a health check for a service.
   * This is a placeholder - actual health check logic is in HealthCheckEngine.
   */
  async runHealthCheck(serviceName: string): Promise<HealthCheck> {
    this.logger.debug('Running health check', { serviceName });

    // Default implementation returns healthy with 0 response time
    // Actual implementation is in HealthCheckEngine
    return this.recordHealthCheck({
      serviceName,
      status: HealthStatus.HEALTHY,
      responseTime: 0,
      details: 'Health check placeholder',
    });
  }

  /**
   * Gets health checks with pagination.
   */
  async getHealthChecks(params: PaginationParams, filters?: {
    serviceName?: string;
    status?: HealthStatus;
  }): Promise<{
    items: HealthCheck[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }> {
    try {
      return await this.repository.listHealthChecks(params, filters);
    } catch (err) {
      this.logger.error('Failed to get health checks', err as Error);
      throw err;
    }
  }

  // ============ Metric Operations ============

  /**
   * Records a system metric.
   */
  async recordMetric(params: {
    metricName: string;
    metricValue: number;
    unit: MetricUnit;
    metadata?: MonitoringMetadata;
  }): Promise<SystemMetric> {
    this.logger.debug('Recording metric', params);

    try {
      const metric = SystemMetric.create({
        metricId: MetricId.create(),
        metricName: params.metricName,
        metricValue: params.metricValue,
        unit: params.unit,
        metadata: params.metadata,
      });

      const recorded = await this.repository.recordMetric(metric);

      // Store event
      const event = createMetricRecordedEvent({
        metricId: recorded.metricId,
        metricName: recorded.metricName,
        metricValue: recorded.metricValue,
        unit: recorded.unit,
      });
      this.addMetricEvent(event);

      this.logger.info('Metric recorded', {
        metricName: recorded.metricName,
        metricValue: recorded.metricValue,
        unit: recorded.unit,
      });

      return recorded;
    } catch (err) {
      // Failure handling: Monitoring must never stop gameplay
      this.logger.error('Failed to record metric - continuing', err as Error);
      throw err;
    }
  }

  /**
   * Records multiple system metrics in batch.
   */
  async recordSystemMetrics(metrics: Array<{
    metricName: string;
    metricValue: number;
    unit: MetricUnit;
    metadata?: MonitoringMetadata;
  }>): Promise<SystemMetric[]> {
    this.logger.debug('Recording batch metrics', { count: metrics.length });

    const results: SystemMetric[] = [];
    for (const metric of metrics) {
      try {
        const recorded = await this.recordMetric(metric);
        results.push(recorded);
      } catch (err) {
        // Continue recording other metrics even if one fails
        this.logger.warn('Failed to record metric in batch', { metricName: metric.metricName });
      }
    }
    return results;
  }

  /**
   * Gets metrics with pagination.
   */
  async getMetrics(params: PaginationParams, filters?: {
    metricName?: string;
    minValue?: number;
    maxValue?: number;
  }): Promise<{
    items: SystemMetric[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }> {
    try {
      return await this.repository.listMetrics(params, filters);
    } catch (err) {
      this.logger.error('Failed to get metrics', err as Error);
      throw err;
    }
  }

  // ============ Service Status Operations ============

  /**
   * Updates service status.
   */
  async updateServiceStatus(params: {
    serviceName: string;
    status: ServiceStatusType;
    version?: string;
    metadata?: MonitoringMetadata;
  }): Promise<ServiceStatus> {
    this.logger.debug('Updating service status', params);

    try {
      // Check if service exists to detect status changes
      const existing = await this.repository.findServiceStatusByName(params.serviceName);
      const previousStatus = existing?.status;

      const serviceStatus = ServiceStatus.create({
        serviceId: existing?.serviceId ?? ServiceId.create(),
        serviceName: params.serviceName,
        status: params.status,
        version: params.version,
        metadata: params.metadata,
      });

      const updated = await this.repository.upsertServiceStatus(serviceStatus);

      // Detect status transitions and emit events
      if (previousStatus && previousStatus !== params.status) {
        if (params.status === ServiceStatusType.ONLINE) {
          const event = createServiceOnlineEvent({
            serviceId: updated.serviceId,
            serviceName: updated.serviceName,
            version: updated.version,
          });
          this.addServiceEvent(event);
        } else if (params.status === ServiceStatusType.OFFLINE) {
          const event = createServiceOfflineEvent({
            serviceId: updated.serviceId,
            serviceName: updated.serviceName,
            reason: `Status changed from ${previousStatus} to ${params.status}`,
          });
          this.addServiceEvent(event);
        }
      }

      this.logger.info('Service status updated', {
        serviceName: updated.serviceName,
        status: updated.status,
        version: updated.version,
      });

      return updated;
    } catch (err) {
      // Failure handling: Monitoring must never stop gameplay
      this.logger.error('Failed to update service status - continuing', err as Error);
      throw err;
    }
  }

  /**
   * Records a heartbeat for a service.
   */
  async recordHeartbeat(serviceName: string, version?: string): Promise<ServiceStatus> {
    return this.updateServiceStatus({
      serviceName,
      status: ServiceStatusType.ONLINE,
      version,
    });
  }

  /**
   * Gets service status by name.
   */
  async getServiceStatus(serviceName: string): Promise<ServiceStatus | null> {
    try {
      return await this.repository.findServiceStatusByName(serviceName);
    } catch (err) {
      this.logger.error('Failed to get service status', err as Error);
      throw err;
    }
  }

  /**
   * Gets service statuses with pagination.
   */
  async getServiceStatuses(params: PaginationParams, filters?: {
    status?: ServiceStatusType;
  }): Promise<{
    items: ServiceStatus[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }> {
    try {
      return await this.repository.listServiceStatuses(params, filters);
    } catch (err) {
      this.logger.error('Failed to get service statuses', err as Error);
      throw err;
    }
  }

  // ============ Statistics ============

  /**
   * Gets aggregated monitoring statistics.
   */
  async getMonitoringStatistics(): Promise<MonitoringStatistics> {
    this.logger.debug('Computing monitoring statistics');

    try {
      const [healthCheckCount, healthChecks] = await Promise.all([
        this.repository.countHealthChecks(),
        this.repository.listHealthChecks({ page: 1, pageSize: 100 }, {}),
      ]);

      const healthyCount = healthChecks.items.filter((h) => h.status === HealthStatus.HEALTHY).length;
      const warningCount = healthChecks.items.filter((h) => h.status === HealthStatus.WARNING).length;
      const criticalCount = healthChecks.items.filter(
        (h) => h.status === HealthStatus.CRITICAL || h.status === HealthStatus.OFFLINE
      ).length;

      const responseTimes = healthChecks.items.map((h) => h.responseTime);
      const avgResponseTime = responseTimes.length > 0
        ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
        : 0;
      const minResponseTime = responseTimes.length > 0 ? Math.min(...responseTimes) : 0;
      const maxResponseTime = responseTimes.length > 0 ? Math.max(...responseTimes) : 0;

      // Calculate percentiles
      const sorted = [...responseTimes].sort((a, b) => a - b);
      const p95Index = Math.floor(sorted.length * 0.95);
      const p99Index = Math.floor(sorted.length * 0.99);
      const p95ResponseTime = sorted.length > 0 ? sorted[p95Index] || 0 : 0;
      const p99ResponseTime = sorted.length > 0 ? sorted[p99Index] || 0 : 0;

      const stats: MonitoringStatistics = {
        totalCount: healthCheckCount,
        healthyCount,
        warningCount,
        criticalCount,
        averageResponseTimeMs: avgResponseTime,
        minResponseTimeMs: minResponseTime,
        maxResponseTimeMs: maxResponseTime,
        p95ResponseTimeMs: p95ResponseTime,
        p99ResponseTimeMs: p99ResponseTime,
        computedAt: new Date(),
      };

      return stats;
    } catch (err) {
      this.logger.error('Failed to compute monitoring statistics', err as Error);
      // Return empty statistics on error
      return {
        ...createEmptyMonitoringStatistics(),
        computedAt: new Date(),
      };
    }
  }

  // ============ Events ============

  /**
   * Gets the latest health check events.
   */
  getLatestHealthEvents(count = 10): HealthCheckedEvent[] {
    return this.healthEvents.slice(-count);
  }

  /**
   * Gets the latest metric recording events.
   */
  getLatestMetricEvents(count = 10): MetricRecordedEvent[] {
    return this.metricEvents.slice(-count);
  }

  /**
   * Gets the latest service status events.
   */
  getLatestServiceEvents(count = 10): Array<ServiceOnlineEvent | ServiceOfflineEvent> {
    return this.serviceEvents.slice(-count);
  }

  /**
   * Adds a health event to the history.
   */
  private addHealthEvent(event: HealthCheckedEvent): void {
    this.healthEvents.push(event);
    if (this.healthEvents.length > this.maxEventHistory) {
      this.healthEvents.shift();
    }
  }

  /**
   * Adds a metric event to the history.
   */
  private addMetricEvent(event: MetricRecordedEvent): void {
    this.metricEvents.push(event);
    if (this.metricEvents.length > this.maxEventHistory) {
      this.metricEvents.shift();
    }
  }

  /**
   * Adds a service event to the history.
   */
  private addServiceEvent(event: ServiceOnlineEvent | ServiceOfflineEvent): void {
    this.serviceEvents.push(event);
    if (this.serviceEvents.length > this.maxEventHistory) {
      this.serviceEvents.shift();
    }
  }
}

/**
 * Creates a MonitoringService instance.
 */
export function createMonitoringService(repository: IMonitoringRepository): MonitoringService {
  return new MonitoringService(repository);
}
