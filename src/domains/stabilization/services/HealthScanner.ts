/**
 * Health Scanner Service
 *
 * Performs system health checks for various components.
 * Collects health metrics and generates health snapshots.
 *
 * IMPORTANT: Health Scanner is a FOUNDATION layer. It ONLY analyzes and reports.
 * It MUST NEVER modify gameplay, balances, rewards, inventory, or player state.
 */

import { HealthStatus } from '../types/HealthStatus';
import type { SystemHealthResult } from './StabilizationService';
import { createLogger } from '../../../core/logging/logger.service';

const logger = createLogger('HealthScanner');

/**
 * Health check result for a single component.
 */
export interface ComponentHealthCheck {
  component: string;
  status: HealthStatus;
  latencyMs: number;
  message?: string;
  error?: string;
}

/**
 * Full system health check result.
 */
export interface HealthCheckResult {
  timestamp: Date;
  overall: HealthStatus;
  components: ComponentHealthCheck[];
  summary: {
    healthyCount: number;
    warningCount: number;
    failedCount: number;
  };
}

/**
 * Health scanner configuration.
 */
export interface HealthScannerConfig {
  timeoutMs?: number;
  memoryThreshold?: number;
  cpuThreshold?: number;
  databaseTimeoutMs?: number;
  cacheTimeoutMs?: number;
  apiTimeoutMs?: number;
}

/**
 * Health Scanner Service
 *
 * Performs health checks on system components:
 * - Authentication
 * - Database
 * - Repositories
 * - Cache
 * - API Gateway
 * - Monitoring
 * - Scheduler
 * - Configuration
 * - DevOps
 * - Optimization
 */
export class HealthScanner {
  private readonly _config: Required<HealthScannerConfig>;

  constructor(config?: HealthScannerConfig) {
    this._config = {
      timeoutMs: config?.timeoutMs ?? 5000,
      memoryThreshold: config?.memoryThreshold ?? 80,
      cpuThreshold: config?.cpuThreshold ?? 80,
      databaseTimeoutMs: config?.databaseTimeoutMs ?? 3000,
      cacheTimeoutMs: config?.cacheTimeoutMs ?? 1000,
      apiTimeoutMs: config?.apiTimeoutMs ?? 2000,
    };
  }

  /**
   * Performs a full system health check.
   */
  async performHealthCheck(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    logger.info('Starting full system health check');

    const results = await Promise.allSettled([
      this.checkAuthentication(),
      this.checkDatabase(),
      this.checkRepositories(),
      this.checkCache(),
      this.checkApiGateway(),
      this.checkMonitoring(),
      this.checkScheduler(),
      this.checkConfiguration(),
      this.checkDevOps(),
      this.checkOptimization(),
    ]);

    const components: ComponentHealthCheck[] = [];
    let healthyCount = 0;
    let warningCount = 0;
    let failedCount = 0;

    const componentNames = [
      'Authentication',
      'Database',
      'Repositories',
      'Cache',
      'API Gateway',
      'Monitoring',
      'Scheduler',
      'Configuration',
      'DevOps',
      'Optimization',
    ];

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const component = componentNames[i];

      if (result.status === 'fulfilled') {
        components.push(result.value);
        switch (result.value.status) {
          case HealthStatus.HEALTHY:
            healthyCount++;
            break;
          case HealthStatus.WARNING:
            warningCount++;
            break;
          case HealthStatus.FAILED:
            failedCount++;
            break;
          default:
            warningCount++;
        }
      } else {
        components.push({
          component,
          status: HealthStatus.UNKNOWN,
          latencyMs: 0,
          error: result.reason?.message || 'Unknown error',
        });
        warningCount++;
      }
    }

    let overall: HealthStatus;
    if (failedCount > 0) {
      overall = HealthStatus.FAILED;
    } else if (warningCount > 0) {
      overall = HealthStatus.WARNING;
    } else if (healthyCount === components.length) {
      overall = HealthStatus.HEALTHY;
    } else {
      overall = HealthStatus.UNKNOWN;
    }

    const healthResult: HealthCheckResult = {
      timestamp: new Date(),
      overall,
      components,
      summary: {
        healthyCount,
        warningCount,
        failedCount,
      },
    };

    const duration = Date.now() - startTime;
    logger.info('Health check completed', {
      duration,
      overall,
      healthyCount,
      warningCount,
      failedCount,
    });

    return healthResult;
  }

  /**
   * Performs a quick health check (essential components only).
   */
  async performQuickCheck(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    logger.info('Starting quick health check');

    const results = await Promise.allSettled([
      this.checkDatabase(),
      this.checkCache(),
      this.checkApiGateway(),
    ]);

    const components: ComponentHealthCheck[] = [];
    let healthyCount = 0;
    let warningCount = 0;
    let failedCount = 0;

    const componentNames = ['Database', 'Cache', 'API Gateway'];

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const component = componentNames[i];

      if (result.status === 'fulfilled') {
        components.push(result.value);
        switch (result.value.status) {
          case HealthStatus.HEALTHY:
            healthyCount++;
            break;
          case HealthStatus.WARNING:
            warningCount++;
            break;
          case HealthStatus.FAILED:
            failedCount++;
            break;
          default:
            warningCount++;
        }
      } else {
        components.push({
          component,
          status: HealthStatus.UNKNOWN,
          latencyMs: 0,
          error: result.reason?.message || 'Unknown error',
        });
        warningCount++;
      }
    }

    let overall: HealthStatus;
    if (failedCount > 0) {
      overall = HealthStatus.FAILED;
    } else if (warningCount > 0) {
      overall = HealthStatus.WARNING;
    } else if (healthyCount === components.length) {
      overall = HealthStatus.HEALTHY;
    } else {
      overall = HealthStatus.UNKNOWN;
    }

    const duration = Date.now() - startTime;
    logger.info('Quick health check completed', {
      duration,
      overall,
    });

    return {
      timestamp: new Date(),
      overall,
      components,
      summary: {
        healthyCount,
        warningCount,
        failedCount,
      },
    };
  }

  /**
   * Converts health check result to system health result for stabilization.
   */
  toSystemHealthResult(healthCheck: HealthCheckResult): SystemHealthResult {
    const getStatus = (components: string[]): HealthStatus => {
      const relevantComponents = healthCheck.components.filter(c =>
        components.some(comp => c.component.toLowerCase().includes(comp.toLowerCase()))
      );

      if (relevantComponents.some(c => c.status === HealthStatus.FAILED)) {
        return HealthStatus.FAILED;
      }
      if (relevantComponents.some(c => c.status === HealthStatus.WARNING)) {
        return HealthStatus.WARNING;
      }
      if (relevantComponents.every(c => c.status === HealthStatus.HEALTHY)) {
        return HealthStatus.HEALTHY;
      }
      return HealthStatus.UNKNOWN;
    };

    return {
      memory: getStatus(['memory', 'cache']),
      cpu: getStatus(['cpu', 'optimization']),
      database: getStatus(['database', 'repository']),
      cache: getStatus(['cache']),
      api: getStatus(['api', 'gateway', 'authentication']),
      overall: healthCheck.overall,
    };
  }

  // ============ Individual Component Checks ============

  /**
   * Checks authentication system health.
   */
  private async checkAuthentication(): Promise<ComponentHealthCheck> {
    const startTime = Date.now();
    try {
      // Simulated check - in production, would check actual auth provider
      const latency = Date.now() - startTime;
      return {
        component: 'Authentication',
        status: HealthStatus.HEALTHY,
        latencyMs: latency,
        message: 'Authentication system operational',
      };
    } catch (err) {
      const latency = Date.now() - startTime;
      logger.warn('Authentication health check failed', { error: err instanceof Error ? err.message : String(err) });
      return {
        component: 'Authentication',
        status: HealthStatus.WARNING,
        latencyMs: latency,
        error: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  }

  /**
   * Checks database health.
   */
  private async checkDatabase(): Promise<ComponentHealthCheck> {
    const startTime = Date.now();
    try {
      // Simulated check - in production, would check actual database connection
      const latency = Date.now() - startTime;
      return {
        component: 'Database',
        status: HealthStatus.HEALTHY,
        latencyMs: latency,
        message: 'Database connection healthy',
      };
    } catch (err) {
      const latency = Date.now() - startTime;
      logger.warn('Database health check failed', { error: err instanceof Error ? err.message : String(err) });
      return {
        component: 'Database',
        status: HealthStatus.FAILED,
        latencyMs: latency,
        error: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  }

  /**
   * Checks repository availability.
   */
  private async checkRepositories(): Promise<ComponentHealthCheck> {
    const startTime = Date.now();
    try {
      // Simulated check - in production, would verify repository connections
      const latency = Date.now() - startTime;
      return {
        component: 'Repositories',
        status: HealthStatus.HEALTHY,
        latencyMs: latency,
        message: 'All repositories available',
      };
    } catch (err) {
      const latency = Date.now() - startTime;
      logger.warn('Repositories health check failed', { error: err instanceof Error ? err.message : String(err) });
      return {
        component: 'Repositories',
        status: HealthStatus.WARNING,
        latencyMs: latency,
        error: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  }

  /**
   * Checks cache health.
   */
  private async checkCache(): Promise<ComponentHealthCheck> {
    const startTime = Date.now();
    try {
      // Simulated check - in production, would verify cache availability
      const latency = Date.now() - startTime;
      return {
        component: 'Cache',
        status: HealthStatus.HEALTHY,
        latencyMs: latency,
        message: 'Cache system operational',
      };
    } catch (err) {
      const latency = Date.now() - startTime;
      logger.warn('Cache health check failed', { error: err instanceof Error ? err.message : String(err) });
      return {
        component: 'Cache',
        status: HealthStatus.WARNING,
        latencyMs: latency,
        error: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  }

  /**
   * Checks API Gateway health.
   */
  private async checkApiGateway(): Promise<ComponentHealthCheck> {
    const startTime = Date.now();
    try {
      // Simulated check - in production, would verify gateway availability
      const latency = Date.now() - startTime;
      return {
        component: 'API Gateway',
        status: HealthStatus.HEALTHY,
        latencyMs: latency,
        message: 'API Gateway operational',
      };
    } catch (err) {
      const latency = Date.now() - startTime;
      logger.warn('API Gateway health check failed', { error: err instanceof Error ? err.message : String(err) });
      return {
        component: 'API Gateway',
        status: HealthStatus.WARNING,
        latencyMs: latency,
        error: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  }

  /**
   * Checks monitoring system health.
   */
  private async checkMonitoring(): Promise<ComponentHealthCheck> {
    const startTime = Date.now();
    try {
      // Simulated check - in production, would verify monitoring system
      const latency = Date.now() - startTime;
      return {
        component: 'Monitoring',
        status: HealthStatus.HEALTHY,
        latencyMs: latency,
        message: 'Monitoring system operational',
      };
    } catch (err) {
      const latency = Date.now() - startTime;
      logger.warn('Monitoring health check failed', { error: err instanceof Error ? err.message : String(err) });
      return {
        component: 'Monitoring',
        status: HealthStatus.WARNING,
        latencyMs: latency,
        error: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  }

  /**
   * Checks scheduler health.
   */
  private async checkScheduler(): Promise<ComponentHealthCheck> {
    const startTime = Date.now();
    try {
      // Simulated check - in production, would verify scheduler
      const latency = Date.now() - startTime;
      return {
        component: 'Scheduler',
        status: HealthStatus.HEALTHY,
        latencyMs: latency,
        message: 'Scheduler operational',
      };
    } catch (err) {
      const latency = Date.now() - startTime;
      logger.warn('Scheduler health check failed', { error: err instanceof Error ? err.message : String(err) });
      return {
        component: 'Scheduler',
        status: HealthStatus.WARNING,
        latencyMs: latency,
        error: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  }

  /**
   * Checks configuration system health.
   */
  private async checkConfiguration(): Promise<ComponentHealthCheck> {
    const startTime = Date.now();
    try {
      // Simulated check - in production, would verify configuration
      const latency = Date.now() - startTime;
      return {
        component: 'Configuration',
        status: HealthStatus.HEALTHY,
        latencyMs: latency,
        message: 'Configuration system operational',
      };
    } catch (err) {
      const latency = Date.now() - startTime;
      logger.warn('Configuration health check failed', { error: err instanceof Error ? err.message : String(err) });
      return {
        component: 'Configuration',
        status: HealthStatus.WARNING,
        latencyMs: latency,
        error: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  }

  /**
   * Checks DevOps tooling health.
   */
  private async checkDevOps(): Promise<ComponentHealthCheck> {
    const startTime = Date.now();
    try {
      // Simulated check - in production, would verify DevOps tooling
      const latency = Date.now() - startTime;
      return {
        component: 'DevOps',
        status: HealthStatus.HEALTHY,
        latencyMs: latency,
        message: 'DevOps tooling operational',
      };
    } catch (err) {
      const latency = Date.now() - startTime;
      logger.warn('DevOps health check failed', { error: err instanceof Error ? err.message : String(err) });
      return {
        component: 'DevOps',
        status: HealthStatus.WARNING,
        latencyMs: latency,
        error: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  }

  /**
   * Checks optimization system health.
   */
  private async checkOptimization(): Promise<ComponentHealthCheck> {
    const startTime = Date.now();
    try {
      // Simulated check - in production, would verify optimization system
      const latency = Date.now() - startTime;
      return {
        component: 'Optimization',
        status: HealthStatus.HEALTHY,
        latencyMs: latency,
        message: 'Optimization system operational',
      };
    } catch (err) {
      const latency = Date.now() - startTime;
      logger.warn('Optimization health check failed', { error: err instanceof Error ? err.message : String(err) });
      return {
        component: 'Optimization',
        status: HealthStatus.WARNING,
        latencyMs: latency,
        error: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  }
}
