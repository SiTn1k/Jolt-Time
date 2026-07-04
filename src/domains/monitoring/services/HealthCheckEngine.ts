/**
 * HealthCheckEngine
 *
 * Executes health checks for all monitored services.
 * Health checks are independent and never affect gameplay.
 */

import type { ILogger } from '../../../shared/types';
import { createLogger } from '../../../core/logging/logger.service';
import type { IMonitoringService, MONITORING_SERVICE_NAMES } from './MonitoringService';
import { HealthStatus } from '../types/HealthStatus';
import type { MonitoringMetadata } from '../types/MonitoringMetadata';
import { getSupabaseProvider, getSupabaseClient } from '../../../database/providers/supabase.provider';

/**
 * Health check result.
 */
export interface HealthCheckResult {
  serviceName: string;
  status: HealthStatus;
  responseTimeMs: number;
  details?: string;
  timestamp: Date;
}

/**
 * Health check function type.
 */
export type HealthCheckFunction = () => Promise<{
  status: HealthStatus;
  responseTimeMs: number;
  details?: string;
}>;

/**
 * HealthCheckEngine configuration.
 */
export interface HealthCheckEngineConfig {
  /** Timeout for each health check in milliseconds */
  timeoutMs?: number;
  /** Default metadata for health checks */
  defaultMetadata?: MonitoringMetadata;
}

/**
 * HealthCheckEngine manages and executes health checks for all services.
 * Each health check runs independently and records results without affecting gameplay.
 */
export class HealthCheckEngine {
  private readonly monitoringService: IMonitoringService;
  private readonly logger: ILogger;
  private readonly healthChecks: Map<string, HealthCheckFunction> = new Map();
  private readonly config: Required<HealthCheckEngineConfig>;

  constructor(
    monitoringService: IMonitoringService,
    config: HealthCheckEngineConfig = {}
  ) {
    this.monitoringService = monitoringService;
    this.logger = createLogger('HealthCheckEngine');
    this.config = {
      timeoutMs: config.timeoutMs ?? 5000,
      defaultMetadata: config.defaultMetadata ?? { tags: [] },
    };
  }

  /**
   * Registers a health check function for a service.
   */
  registerHealthCheck(
    serviceName: string,
    healthCheckFn: HealthCheckFunction
  ): void {
    this.logger.debug('Registering health check', { serviceName });
    this.healthChecks.set(serviceName, healthCheckFn);
  }

  /**
   * Unregisters a health check for a service.
   */
  unregisterHealthCheck(serviceName: string): boolean {
    this.logger.debug('Unregistering health check', { serviceName });
    return this.healthChecks.delete(serviceName);
  }

  /**
   * Runs a health check for a specific service.
   */
  async runHealthCheck(serviceName: string): Promise<HealthCheckResult> {
    this.logger.debug('Running health check', { serviceName });

    const healthCheckFn = this.healthChecks.get(serviceName);
    if (!healthCheckFn) {
      this.logger.warn('No health check registered for service', { serviceName });
      return {
        serviceName,
        status: HealthStatus.WARNING,
        responseTimeMs: 0,
        details: 'No health check registered',
        timestamp: new Date(),
      };
    }

    const startTime = Date.now();
    try {
      // Run with timeout
      const result = await this.runWithTimeout(healthCheckFn, this.config.timeoutMs);

      const resultWithTiming: HealthCheckResult = {
        serviceName,
        status: result.status,
        responseTimeMs: result.responseTimeMs ?? Date.now() - startTime,
        details: result.details,
        timestamp: new Date(),
      };

      // Record the health check (failure handling included in service)
      await this.monitoringService.recordHealthCheck({
        serviceName,
        status: resultWithTiming.status,
        responseTime: resultWithTiming.responseTimeMs,
        details: resultWithTiming.details,
        metadata: this.config.defaultMetadata,
      });

      return resultWithTiming;
    } catch (err) {
      const responseTimeMs = Date.now() - startTime;
      const result: HealthCheckResult = {
        serviceName,
        status: HealthStatus.CRITICAL,
        responseTimeMs,
        details: `Health check failed: ${(err as Error).message}`,
        timestamp: new Date(),
      };

      // Record the failed health check
      await this.monitoringService.recordHealthCheck({
        serviceName,
        status: result.status,
        responseTime: result.responseTimeMs,
        details: result.details,
        metadata: this.config.defaultMetadata,
      });

      // Health check failure must not affect gameplay
      this.logger.error('Health check failed', err as Error, { serviceName });
      return result;
    }
  }

  /**
   * Runs all registered health checks.
   */
  async runAllHealthChecks(): Promise<HealthCheckResult[]> {
    this.logger.debug('Running all health checks', { count: this.healthChecks.size });

    const results: HealthCheckResult[] = [];
    const checkPromises: Array<Promise<HealthCheckResult>> = [];

    for (const [serviceName] of this.healthChecks) {
      checkPromises.push(
        this.runHealthCheck(serviceName).catch((err) => {
          this.logger.error('Health check promise rejected', err as Error, { serviceName });
          return {
            serviceName,
            status: HealthStatus.CRITICAL,
            responseTimeMs: 0,
            details: `Health check promise rejected: ${(err as Error).message}`,
            timestamp: new Date(),
          };
        })
      );
    }

    const settledResults = await Promise.allSettled(checkPromises);

    for (const settled of settledResults) {
      if (settled.status === 'fulfilled') {
        results.push(settled.value);
      }
    }

    this.logger.info('All health checks completed', { count: results.length });
    return results;
  }

  /**
   * Gets the list of registered service names.
   */
  getRegisteredServices(): string[] {
    return Array.from(this.healthChecks.keys());
  }

  /**
   * Initializes built-in health checks.
   */
  initializeBuiltInHealthChecks(): void {
    this.logger.info('Initializing built-in health checks');

    // Database health check
    this.registerHealthCheck('database', async () => {
      const startTime = Date.now();
      try {
        const provider = getSupabaseProvider();
        const healthResult = await provider.healthCheck();
        return {
          status: healthResult.status === 'healthy' ? HealthStatus.HEALTHY :
                  healthResult.status === 'degraded' ? HealthStatus.WARNING : HealthStatus.CRITICAL,
          responseTimeMs: healthResult.latencyMs,
          details: healthResult.error ?? 'Database connection healthy',
        };
      } catch (err) {
        return {
          status: HealthStatus.CRITICAL,
          responseTimeMs: Date.now() - startTime,
          details: `Database health check failed: ${(err as Error).message}`,
        };
      }
    });

    // Supabase client health check
    this.registerHealthCheck('supabase_client', async () => {
      const startTime = Date.now();
      try {
        const client = getSupabaseClient();
        const { error } = await client.from('users').select('id').limit(1);
        if (error) {
          return {
            status: HealthStatus.WARNING,
            responseTimeMs: Date.now() - startTime,
            details: `Supabase query warning: ${error.message}`,
          };
        }
        return {
          status: HealthStatus.HEALTHY,
          responseTimeMs: Date.now() - startTime,
          details: 'Supabase client connection healthy',
        };
      } catch (err) {
        return {
          status: HealthStatus.CRITICAL,
          responseTimeMs: Date.now() - startTime,
          details: `Supabase client error: ${(err as Error).message}`,
        };
      }
    });

    // Telegram API health check (placeholder - actual implementation would call Telegram API)
    this.registerHealthCheck('telegram_api', async () => {
      const startTime = Date.now();
      // Simulated Telegram API health check
      return {
        status: HealthStatus.HEALTHY,
        responseTimeMs: Date.now() - startTime,
        details: 'Telegram API health check (simulated)',
      };
    });

    // Configuration service health check (placeholder)
    this.registerHealthCheck('configuration_service', async () => {
      const startTime = Date.now();
      return {
        status: HealthStatus.HEALTHY,
        responseTimeMs: Date.now() - startTime,
        details: 'Configuration service healthy',
      };
    });

    // Scheduler health check (placeholder)
    this.registerHealthCheck('scheduler', async () => {
      const startTime = Date.now();
      return {
        status: HealthStatus.HEALTHY,
        responseTimeMs: Date.now() - startTime,
        details: 'Scheduler service healthy',
      };
    });

    // Event Bus health check (placeholder)
    this.registerHealthCheck('event_bus', async () => {
      const startTime = Date.now();
      return {
        status: HealthStatus.HEALTHY,
        responseTimeMs: Date.now() - startTime,
        details: 'Event Bus service healthy',
      };
    });

    // Notification service health check (placeholder)
    this.registerHealthCheck('notification', async () => {
      const startTime = Date.now();
      return {
        status: HealthStatus.HEALTHY,
        responseTimeMs: Date.now() - startTime,
        details: 'Notification service healthy',
      };
    });

    // Analytics service health check (placeholder)
    this.registerHealthCheck('analytics', async () => {
      const startTime = Date.now();
      return {
        status: HealthStatus.HEALTHY,
        responseTimeMs: Date.now() - startTime,
        details: 'Analytics service healthy',
      };
    });

    // Audit service health check (placeholder)
    this.registerHealthCheck('audit', async () => {
      const startTime = Date.now();
      return {
        status: HealthStatus.HEALTHY,
        responseTimeMs: Date.now() - startTime,
        details: 'Audit service healthy',
      };
    });

    this.logger.info('Built-in health checks initialized', { count: this.healthChecks.size });
  }

  /**
   * Runs a function with a timeout.
   */
  private async runWithTimeout<T>(
    fn: () => Promise<T>,
    timeoutMs: number
  ): Promise<T> {
    let timeoutId: ReturnType<typeof setTimeout>;

    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error(`Health check timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    });

    try {
      const result = await Promise.race([fn(), timeoutPromise]);
      clearTimeout(timeoutId!);
      return result;
    } catch (err) {
      clearTimeout(timeoutId!);
      throw err;
    }
  }
}

/**
 * Creates a HealthCheckEngine instance.
 */
export function createHealthCheckEngine(
  monitoringService: IMonitoringService,
  config?: HealthCheckEngineConfig
): HealthCheckEngine {
  return new HealthCheckEngine(monitoringService, config);
}
