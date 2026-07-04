/**
 * MonitoringMapper
 *
 * Main mapper for monitoring entities to DTO conversion.
 * Only handles mapping - no monitoring logic.
 */

import type { HealthCheck } from '../entities/HealthCheck';
import type { SystemMetric } from '../entities/SystemMetric';
import type { ServiceStatus } from '../entities/ServiceStatus';
import type {
  HealthCheckDto,
  SystemMetricDto,
  ServiceStatusDto,
  MonitoringStatisticsDto,
  HealthOverviewDto,
} from '../dto';
import type { MonitoringStatistics } from '../types/MonitoringStatistics';
import { HealthStatus } from '../types/HealthStatus';
import { HealthMapper } from './HealthMapper';
import { MetricMapper } from './MetricMapper';
import { ServiceMapper } from './ServiceMapper';

/**
 * Main mapper for monitoring entities to DTOs.
 */
export class MonitoringMapper {
  private readonly healthMapper: typeof HealthMapper;
  private readonly metricMapper: typeof MetricMapper;
  private readonly serviceMapper: typeof ServiceMapper;

  constructor() {
    this.healthMapper = HealthMapper;
    this.metricMapper = MetricMapper;
    this.serviceMapper = ServiceMapper;
  }

  /**
   * Converts a HealthCheck entity to HealthCheckDto.
   */
  public healthCheckToDto(entity: HealthCheck): HealthCheckDto {
    return this.healthMapper.toDto(entity);
  }

  /**
   * Converts a SystemMetric entity to SystemMetricDto.
   */
  public metricToDto(entity: SystemMetric): SystemMetricDto {
    return this.metricMapper.toDto(entity);
  }

  /**
   * Converts a ServiceStatus entity to ServiceStatusDto.
   */
  public serviceStatusToDto(entity: ServiceStatus): ServiceStatusDto {
    return this.serviceMapper.toDto(entity);
  }

  /**
   * Converts MonitoringStatistics to MonitoringStatisticsDto.
   */
  public statisticsToDto(stats: MonitoringStatistics): MonitoringStatisticsDto {
    return {
      totalHealthChecks: stats.totalCount,
      healthyChecks: stats.healthyCount,
      warningChecks: stats.warningCount,
      criticalChecks: stats.criticalCount,
      totalMetrics: stats.totalCount, // Reusing totalCount as metrics count
      onlineServices: stats.healthyCount, // Reusing healthyCount as online count
      offlineServices: stats.criticalCount, // Reusing criticalCount as offline count
      degradedServices: stats.warningCount, // Reusing warningCount as degraded count
      averageResponseTimeMs: stats.averageResponseTimeMs,
      computedAt: stats.computedAt.toISOString(),
    };
  }

  /**
   * Creates a HealthOverviewDto from health check data.
   */
  public createHealthOverview(
    healthChecks: HealthCheck[],
    overallStatus: HealthStatus
  ): HealthOverviewDto {
    const healthyChecks = healthChecks.filter((h) => h.status === HealthStatus.HEALTHY);
    const warningChecks = healthChecks.filter((h) => h.status === HealthStatus.WARNING);
    const criticalChecks = healthChecks.filter(
      (h) => h.status === HealthStatus.CRITICAL || h.status === HealthStatus.OFFLINE
    );

    const avgResponseTime =
      healthChecks.length > 0
        ? healthChecks.reduce((sum, h) => sum + h.responseTime, 0) / healthChecks.length
        : 0;

    const lastChecked =
      healthChecks.length > 0
        ? healthChecks.reduce((latest, h) => (h.checkedAt > latest ? h.checkedAt : latest), healthChecks[0].checkedAt)
        : new Date();

    return {
      overallStatus,
      servicesChecked: healthChecks.length,
      healthyServices: healthyChecks.length,
      warningServices: warningChecks.length,
      criticalServices: criticalChecks.length,
      averageResponseTimeMs: Math.round(avgResponseTime),
      lastChecked: lastChecked.toISOString(),
    };
  }

  /**
   * Converts an array of HealthCheck entities to DTOs.
   */
  public healthChecksToDtoArray(entities: HealthCheck[]): HealthCheckDto[] {
    return this.healthMapper.toDtoArray(entities);
  }

  /**
   * Converts an array of SystemMetric entities to DTOs.
   */
  public metricsToDtoArray(entities: SystemMetric[]): SystemMetricDto[] {
    return this.metricMapper.toDtoArray(entities);
  }

  /**
   * Converts an array of ServiceStatus entities to DTOs.
   */
  public serviceStatusesToDtoArray(entities: ServiceStatus[]): ServiceStatusDto[] {
    return this.serviceMapper.toDtoArray(entities);
  }
}
