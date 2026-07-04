/**
 * MonitoringResponseDto
 *
 * Data Transfer Object for aggregated monitoring responses.
 */

import type { HealthCheckDto } from './HealthCheck.dto';
import type { SystemMetricDto } from './SystemMetric.dto';
import type { ServiceStatusDto } from './ServiceStatus.dto';

/**
 * DTO for monitoring statistics response.
 */
export interface MonitoringStatisticsDto {
  totalHealthChecks: number;
  healthyChecks: number;
  warningChecks: number;
  criticalChecks: number;
  totalMetrics: number;
  onlineServices: number;
  offlineServices: number;
  degradedServices: number;
  averageResponseTimeMs: number;
  computedAt: string;
}

/**
 * DTO for paginated monitoring response.
 */
export interface PaginatedMonitoringResponseDto<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * DTO for combined monitoring dashboard response.
 */
export interface MonitoringDashboardDto {
  healthChecks: PaginatedMonitoringResponseDto<HealthCheckDto>;
  metrics: PaginatedMonitoringResponseDto<SystemMetricDto>;
  services: PaginatedMonitoringResponseDto<ServiceStatusDto>;
  statistics: MonitoringStatisticsDto;
}

/**
 * DTO for health overview response.
 */
export interface HealthOverviewDto {
  overallStatus: string;
  servicesChecked: number;
  healthyServices: number;
  warningServices: number;
  criticalServices: number;
  averageResponseTimeMs: number;
  lastChecked: string;
}
