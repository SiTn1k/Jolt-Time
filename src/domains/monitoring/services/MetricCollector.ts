/**
 * MetricCollector
 *
 * Collects and records system metrics.
 * Metrics are collected independently without affecting gameplay.
 */

import type { ILogger } from '../../../shared/types';
import { createLogger } from '../../../core/logging/logger.service';
import type { IMonitoringService } from './MonitoringService';
import { MetricUnit } from '../types/MetricUnit';
import type { MonitoringMetadata } from '../types/MonitoringMetadata';

/**
 * Memory statistics.
 */
export interface MemoryStats {
  heapUsed: number;
  heapTotal: number;
  external: number;
  rss: number;
}

/**
 * CPU statistics.
 */
export interface CpuStats {
  usage: number;
  numCpus: number;
}

/**
 * Process statistics.
 */
export interface ProcessStats {
  uptime: number;
  pid: number;
}

/**
 * Metric collector configuration.
 */
export interface MetricCollectorConfig {
  /** Whether to collect memory metrics */
  collectMemory?: boolean;
  /** Whether to collect CPU metrics */
  collectCpu?: boolean;
  /** Whether to collect process metrics */
  collectProcess?: boolean;
  /** Default metadata for metrics */
  defaultMetadata?: MonitoringMetadata;
}

/**
 * MetricCollector collects system metrics and records them via MonitoringService.
 * Collection is passive and never affects gameplay.
 */
export class MetricCollector {
  private readonly monitoringService: IMonitoringService;
  private readonly logger: ILogger;
  private readonly config: Required<MetricCollectorConfig>;

  constructor(
    monitoringService: IMonitoringService,
    config: MetricCollectorConfig = {}
  ) {
    this.monitoringService = monitoringService;
    this.logger = createLogger('MetricCollector');
    this.config = {
      collectMemory: config.collectMemory ?? true,
      collectCpu: config.collectCpu ?? true,
      collectProcess: config.collectProcess ?? true,
      defaultMetadata: config.defaultMetadata ?? { tags: [] },
    };
  }

  /**
   * Collects all enabled metrics.
   */
  async collectAllMetrics(): Promise<void> {
    this.logger.debug('Collecting all metrics');

    try {
      const metricsPromises: Array<Promise<void>> = [];

      if (this.config.collectMemory) {
        metricsPromises.push(this.collectMemoryMetrics());
      }
      if (this.config.collectCpu) {
        metricsPromises.push(this.collectCpuMetrics());
      }
      if (this.config.collectProcess) {
        metricsPromises.push(this.collectProcessMetrics());
      }

      await Promise.allSettled(metricsPromises);

      this.logger.debug('All metrics collected');
    } catch (err) {
      // Metric collection must never affect gameplay
      this.logger.error('Failed to collect metrics - continuing', err as Error);
    }
  }

  /**
   * Collects memory metrics.
   */
  async collectMemoryMetrics(): Promise<void> {
    try {
      const memoryStats = this.getMemoryStats();

      // Record heap used
      await this.monitoringService.recordMetric({
        metricName: 'memory_heap_used',
        metricValue: memoryStats.heapUsed,
        unit: MetricUnit.BYTES,
        metadata: {
          ...this.config.defaultMetadata,
          description: 'V8 heap memory used',
        },
      });

      // Record heap total
      await this.monitoringService.recordMetric({
        metricName: 'memory_heap_total',
        metricValue: memoryStats.heapTotal,
        unit: MetricUnit.BYTES,
        metadata: {
          ...this.config.defaultMetadata,
          description: 'V8 heap memory total',
        },
      });

      // Record RSS (Resident Set Size)
      await this.monitoringService.recordMetric({
        metricName: 'memory_rss',
        metricValue: memoryStats.rss,
        unit: MetricUnit.BYTES,
        metadata: {
          ...this.config.defaultMetadata,
          description: 'Resident Set Size - total memory allocated',
        },
      });

      // Record external memory
      await this.monitoringService.recordMetric({
        metricName: 'memory_external',
        metricValue: memoryStats.external,
        unit: MetricUnit.BYTES,
        metadata: {
          ...this.config.defaultMetadata,
          description: 'C++ objects bound to JavaScript objects',
        },
      });

      // Calculate and record memory usage percentage
      const usagePercent = memoryStats.heapTotal > 0
        ? (memoryStats.heapUsed / memoryStats.heapTotal) * 100
        : 0;

      await this.monitoringService.recordMetric({
        metricName: 'memory_usage_percent',
        metricValue: Math.round(usagePercent * 100) / 100,
        unit: MetricUnit.PERCENT,
        metadata: {
          ...this.config.defaultMetadata,
          description: 'Heap memory usage percentage',
        },
      });

      this.logger.debug('Memory metrics collected', { memoryStats });
    } catch (err) {
      this.logger.error('Failed to collect memory metrics', err as Error);
    }
  }

  /**
   * Collects CPU metrics.
   */
  async collectCpuMetrics(): Promise<void> {
    try {
      const cpuStats = await this.getCpuStats();

      // Record CPU usage percentage
      await this.monitoringService.recordMetric({
        metricName: 'cpu_usage_percent',
        metricValue: cpuStats.usage,
        unit: MetricUnit.PERCENT,
        metadata: {
          ...this.config.defaultMetadata,
          description: 'CPU usage percentage',
        },
      });

      // Record number of CPUs
      await this.monitoringService.recordMetric({
        metricName: 'cpu_count',
        metricValue: cpuStats.numCpus,
        unit: MetricUnit.NONE,
        metadata: {
          ...this.config.defaultMetadata,
          description: 'Number of CPU cores',
        },
      });

      this.logger.debug('CPU metrics collected', { cpuStats });
    } catch (err) {
      this.logger.error('Failed to collect CPU metrics', err as Error);
    }
  }

  /**
   * Collects process metrics.
   */
  async collectProcessMetrics(): Promise<void> {
    try {
      const processStats = this.getProcessStats();

      // Record process uptime
      await this.monitoringService.recordMetric({
        metricName: 'process_uptime_seconds',
        metricValue: processStats.uptime,
        unit: MetricUnit.SECONDS,
        metadata: {
          ...this.config.defaultMetadata,
          description: 'Process uptime in seconds',
        },
      });

      // Record process ID
      await this.monitoringService.recordMetric({
        metricName: 'process_pid',
        metricValue: processStats.pid,
        unit: MetricUnit.NONE,
        metadata: {
          ...this.config.defaultMetadata,
          description: 'Process ID',
        },
      });

      this.logger.debug('Process metrics collected', { processStats });
    } catch (err) {
      this.logger.error('Failed to collect process metrics', err as Error);
    }
  }

  /**
   * Records a custom metric.
   */
  async recordCustomMetric(params: {
    metricName: string;
    metricValue: number;
    unit: MetricUnit;
    description?: string;
  }): Promise<void> {
    try {
      await this.monitoringService.recordMetric({
        metricName: params.metricName,
        metricValue: params.metricValue,
        unit: params.unit,
        metadata: {
          ...this.config.defaultMetadata,
          description: params.description,
        },
      });
      this.logger.debug('Custom metric recorded', params);
    } catch (err) {
      // Must never affect gameplay
      this.logger.error('Failed to record custom metric', err as Error);
    }
  }

  /**
   * Records response time metric.
   */
  async recordResponseTime(endpoint: string, responseTimeMs: number): Promise<void> {
    await this.recordCustomMetric({
      metricName: `response_time_${endpoint}`,
      metricValue: responseTimeMs,
      unit: MetricUnit.MILLISECONDS,
      description: `Response time for ${endpoint}`,
    });
  }

  /**
   * Records database latency metric.
   */
  async recordDatabaseLatency(operation: string, latencyMs: number): Promise<void> {
    await this.recordCustomMetric({
      metricName: `database_latency_${operation}`,
      metricValue: latencyMs,
      unit: MetricUnit.MILLISECONDS,
      description: `Database latency for ${operation}`,
    });
  }

  /**
   * Records queue length metric.
   */
  async recordQueueLength(queueName: string, length: number): Promise<void> {
    await this.recordCustomMetric({
      metricName: `queue_length_${queueName}`,
      metricValue: length,
      unit: MetricUnit.NONE,
      description: `Queue length for ${queueName}`,
    });
  }

  /**
   * Records job count metric.
   */
  async recordJobCount(status: 'pending' | 'processing' | 'completed' | 'failed', count: number): Promise<void> {
    await this.recordCustomMetric({
      metricName: `jobs_${status}`,
      metricValue: count,
      unit: MetricUnit.NONE,
      description: `Number of ${status} jobs`,
    });
  }

  /**
   * Records active sessions metric.
   */
  async recordActiveSessions(count: number): Promise<void> {
    await this.recordCustomMetric({
      metricName: 'active_sessions',
      metricValue: count,
      unit: MetricUnit.NONE,
      description: 'Number of active sessions',
    });
  }

  /**
   * Records error count metric.
   */
  async recordErrorCount(errorType: string, count: number): Promise<void> {
    await this.recordCustomMetric({
      metricName: `errors_${errorType}`,
      metricValue: count,
      unit: MetricUnit.NONE,
      description: `Error count for ${errorType}`,
    });
  }

  /**
   * Gets memory statistics.
   */
  private getMemoryStats(): MemoryStats {
    const memUsage = process.memoryUsage();
    return {
      heapUsed: memUsage.heapUsed,
      heapTotal: memUsage.heapTotal,
      external: memUsage.external,
      rss: memUsage.rss,
    };
  }

  /**
   * Gets CPU statistics.
   */
  private async getCpuStats(): Promise<CpuStats> {
    const cpus = require('os').cpus();
    let totalIdle = 0;
    let totalTick = 0;

    for (const cpu of cpus) {
      for (const type in cpu.times) {
        totalTick += cpu.times[type as keyof typeof cpu.times];
      }
      totalIdle += cpu.times.idle;
    }

    const usage = ((1 - totalIdle / totalTick) * 100);

    return {
      usage: Math.round(usage * 100) / 100,
      numCpus: cpus.length,
    };
  }

  /**
   * Gets process statistics.
   */
  private getProcessStats(): ProcessStats {
    return {
      uptime: process.uptime(),
      pid: process.pid,
    };
  }
}

/**
 * Creates a MetricCollector instance.
 */
export function createMetricCollector(
  monitoringService: IMonitoringService,
  config?: MetricCollectorConfig
): MetricCollector {
  return new MetricCollector(monitoringService, config);
}
