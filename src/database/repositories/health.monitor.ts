/**
 * Health Monitor
 *
 * Monitors database health, latency, and query timing.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../supabase-types';
import type { HealthCheckResult, HealthStatus, QueryTiming } from '../types';

/**
 * Health monitor configuration.
 */
export interface HealthMonitorConfig {
  /** Interval between health checks in milliseconds */
  healthCheckIntervalMs?: number;
  /** Latency threshold in milliseconds for healthy status */
  latencyThresholdMs?: number;
  /** Latency threshold in milliseconds for degraded status */
  degradedThresholdMs?: number;
  /** Maximum query time to record */
  maxQueryHistory?: number;
}

/**
 * Health metrics.
 */
export interface HealthMetrics {
  status: HealthStatus;
  latencyMs: number;
  uptimeSeconds: number;
  totalQueries: number;
  failedQueries: number;
  averageQueryTimeMs: number;
  slowQueries: number;
  lastCheck: Date;
  lastHealthy: Date | null;
}

/**
 * Query history entry.
 */
interface QueryHistoryEntry {
  query: string;
  durationMs: number;
  timestamp: Date;
  success: boolean;
  error?: string;
}

/**
 * Health monitor for database connections and queries.
 */
export class HealthMonitor {
  private client: SupabaseClient<Database>;
  private config: Required<HealthMonitorConfig>;
  private startTime: Date;
  private totalQueries = 0;
  private failedQueries = 0;
  private slowQueries = 0;
  private queryHistory: QueryHistoryEntry[] = [];
  private lastHealthy: Date | null = null;
  private healthCheckInterval: ReturnType<typeof setInterval> | null = null;
  private currentStatus: HealthStatus = 'unhealthy';

  constructor(client: SupabaseClient<Database>, config: HealthMonitorConfig = {}) {
    this.client = client;
    this.startTime = new Date();
    this.config = {
      healthCheckIntervalMs: config.healthCheckIntervalMs ?? 30000,
      latencyThresholdMs: config.latencyThresholdMs ?? 200,
      degradedThresholdMs: config.degradedThresholdMs ?? 1000,
      maxQueryHistory: config.maxQueryHistory ?? 100,
    };
  }

  /**
   * Perform a health check.
   */
  async checkHealth(): Promise<HealthCheckResult> {
    const startTime = Date.now();

    try {
      const { error } = await this.client
        .from('users')
        .select('id')
        .limit(1);

      const latencyMs = Date.now() - startTime;

      if (error) {
        this.currentStatus = 'unhealthy';
        return {
          status: 'unhealthy',
          latencyMs,
          timestamp: new Date(),
          error: error.message,
        };
      }

      if (latencyMs > this.config.degradedThresholdMs) {
        this.currentStatus = 'degraded';
      } else if (latencyMs <= this.config.latencyThresholdMs) {
        this.currentStatus = 'healthy';
        this.lastHealthy = new Date();
      } else {
        this.currentStatus = 'degraded';
      }

      return {
        status: this.currentStatus,
        latencyMs,
        timestamp: new Date(),
      };
    } catch (err) {
      this.currentStatus = 'unhealthy';
      return {
        status: 'unhealthy',
        latencyMs: Date.now() - startTime,
        timestamp: new Date(),
        error: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  }

  /**
   * Get current health status.
   */
  getStatus(): HealthStatus {
    return this.currentStatus;
  }

  /**
   * Record a query execution.
   */
  recordQuery(query: string, durationMs: number, success: boolean, errorMessage?: string): void {
    this.totalQueries++;

    if (!success) {
      this.failedQueries++;
    }

    if (durationMs > this.config.degradedThresholdMs) {
      this.slowQueries++;
    }

    this.queryHistory.push({
      query: this.truncateQuery(query),
      durationMs,
      timestamp: new Date(),
      success,
      error: errorMessage,
    });

    if (this.queryHistory.length > this.config.maxQueryHistory) {
      this.queryHistory.shift();
    }
  }

  /**
   * Get query timings.
   */
  getQueryTimings(limit = 10): QueryTiming[] {
    return this.queryHistory
      .slice(-limit)
      .map((entry) => ({
        query: entry.query,
        durationMs: entry.durationMs,
        timestamp: entry.timestamp,
        success: entry.success,
      }));
  }

  /**
   * Get slow queries.
   */
  getSlowQueries(thresholdMs?: number): QueryTiming[] {
    const threshold = thresholdMs ?? this.config.degradedThresholdMs;
    return this.queryHistory
      .filter((entry) => entry.durationMs > threshold)
      .map((entry) => ({
        query: entry.query,
        durationMs: entry.durationMs,
        timestamp: entry.timestamp,
        success: entry.success,
      }));
  }

  /**
   * Get failed queries.
   */
  getFailedQueries(): QueryTiming[] {
    return this.queryHistory
      .filter((entry) => !entry.success)
      .map((entry) => ({
        query: entry.query,
        durationMs: entry.durationMs,
        timestamp: entry.timestamp,
        success: entry.success,
      }));
  }

  /**
   * Get health metrics.
   */
  async getMetrics(): Promise<HealthMetrics> {
    const health = await this.checkHealth();
    const uptimeSeconds = (Date.now() - this.startTime.getTime()) / 1000;
    const averageQueryTimeMs = this.queryHistory.length > 0
      ? this.queryHistory.reduce((sum, q) => sum + q.durationMs, 0) / this.queryHistory.length
      : 0;

    return {
      status: health.status,
      latencyMs: health.latencyMs,
      uptimeSeconds,
      totalQueries: this.totalQueries,
      failedQueries: this.failedQueries,
      averageQueryTimeMs,
      slowQueries: this.slowQueries,
      lastCheck: health.timestamp,
      lastHealthy: this.lastHealthy,
    };
  }

  /**
   * Start periodic health checks.
   */
  startPeriodicChecks(callback?: (result: HealthCheckResult) => void): void {
    if (this.healthCheckInterval) return;

    this.healthCheckInterval = setInterval(async () => {
      const result = await this.checkHealth();
      callback?.(result);
    }, this.config.healthCheckIntervalMs);
  }

  /**
   * Stop periodic health checks.
   */
  stopPeriodicChecks(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }

  /**
   * Reset metrics.
   */
  resetMetrics(): void {
    this.totalQueries = 0;
    this.failedQueries = 0;
    this.slowQueries = 0;
    this.queryHistory = [];
    this.startTime = new Date();
  }

  /**
   * Dispose of resources.
   */
  dispose(): void {
    this.stopPeriodicChecks();
  }

  /**
   * Truncate query for logging.
   */
  private truncateQuery(query: string, maxLength = 100): string {
    if (query.length <= maxLength) return query;
    return query.substring(0, maxLength) + '...';
  }
}

/**
 * Create a health monitor.
 */
export function createHealthMonitor(
  client: SupabaseClient<Database>,
  config?: HealthMonitorConfig
): HealthMonitor {
  return new HealthMonitor(client, config);
}