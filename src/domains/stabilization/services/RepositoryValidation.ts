/**
 * Repository Validation Service
 *
 * Validates repository availability, registration, and connectivity.
 * Ensures all repositories are properly configured and accessible.
 *
 * IMPORTANT: Repository Validation is a FOUNDATION layer. It ONLY analyzes
 * and reports. It MUST NEVER modify gameplay, balances, rewards, inventory,
 * or player state.
 */

import { IssueSeverity } from '../types/IssueSeverity';
import { IssueStatus } from '../types/IssueStatus';
import { createLogger } from '../../../core/logging/logger.service';

const logger = createLogger('RepositoryValidation');

/**
 * Repository validation issue.
 */
export interface RepositoryIssue {
  type: 'unavailable' | 'not_registered' | 'connection_failed' | 'crud_failed' | 'missing_table';
  repository: string;
  severity: IssueSeverity;
  message: string;
  details?: string;
}

/**
 * Repository validation result.
 */
export interface RepositoryValidationResult {
  isValid: boolean;
  repositories: RepositoryStatus[];
  issues: RepositoryIssue[];
  summary: {
    total: number;
    healthy: number;
    unhealthy: number;
    unregistered: number;
  };
  validatedAt: Date;
}

/**
 * Repository status.
 */
export interface RepositoryStatus {
  name: string;
  isRegistered: boolean;
  isConnected: boolean;
  lastCheck: Date;
  latencyMs?: number;
  error?: string;
}

/**
 * Repository CRUD test result.
 */
export interface CrudTestResult {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

/**
 * Repository information for validation.
 */
export interface RepositoryInfo {
  name: string;
  tableName?: string;
  isRegistered: boolean;
  connectionString?: string;
}

/**
 * Repository Validation Service
 *
 * Validates:
 * - Repository availability
 * - Repository registration
 * - CRUD operations
 * - Connection validation
 */
export class RepositoryValidation {
  private readonly _repositories: Map<string, RepositoryInfo> = new Map();
  private readonly _connectionTests: Map<string, boolean> = new Map();

  constructor() {
    logger.info('RepositoryValidation service initialized');
  }

  /**
   * Registers a repository for validation.
   */
  registerRepository(info: RepositoryInfo): void {
    this._repositories.set(info.name, info);
    logger.debug(`Registered repository for validation: ${info.name}`);
  }

  /**
   * Validates all registered repositories.
   */
  async validateAll(): Promise<RepositoryValidationResult> {
    logger.info('Starting repository validation');

    const issues: RepositoryIssue[] = [];
    const repositoryStatuses: RepositoryStatus[] = [];

    for (const [name, info] of this._repositories) {
      const status = await this.validateRepository(name, info);
      repositoryStatuses.push(status);

      if (!status.isConnected) {
        issues.push({
          type: status.isRegistered ? 'connection_failed' : 'not_registered',
          repository: name,
          severity: IssueSeverity.HIGH,
          message: `Repository '${name}' is ${status.isRegistered ? 'not connected' : 'not registered'}`,
          details: status.error,
        });
      }
    }

    const total = repositoryStatuses.length;
    const healthy = repositoryStatuses.filter(r => r.isConnected).length;
    const unhealthy = repositoryStatuses.filter(r => r.isRegistered && !r.isConnected).length;
    const unregistered = repositoryStatuses.filter(r => !r.isRegistered).length;

    const result: RepositoryValidationResult = {
      isValid: issues.filter(i => i.severity === IssueSeverity.CRITICAL).length === 0,
      repositories: repositoryStatuses,
      issues,
      summary: {
        total,
        healthy,
        unhealthy,
        unregistered,
      },
      validatedAt: new Date(),
    };

    logger.info('Repository validation completed', {
      isValid: result.isValid,
      total,
      healthy,
      unhealthy,
    });

    return result;
  }

  /**
   * Validates a specific repository.
   */
  async validateRepository(name: string, info: RepositoryInfo): Promise<RepositoryStatus> {
    const startTime = Date.now();

    if (!info.isRegistered) {
      return {
        name,
        isRegistered: false,
        isConnected: false,
        lastCheck: new Date(),
        latencyMs: Date.now() - startTime,
        error: 'Repository not registered',
      };
    }

    try {
      // Simulated connection test
      const isConnected = await this.testConnection(info);

      return {
        name,
        isRegistered: true,
        isConnected,
        lastCheck: new Date(),
        latencyMs: Date.now() - startTime,
        error: isConnected ? undefined : 'Connection test failed',
      };
    } catch (err) {
      return {
        name,
        isRegistered: true,
        isConnected: false,
        lastCheck: new Date(),
        latencyMs: Date.now() - startTime,
        error: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  }

  /**
   * Tests repository connection.
   */
  private async testConnection(info: RepositoryInfo): Promise<boolean> {
    // Simulated connection test - in production, would actually test the connection
    const cached = this._connectionTests.get(info.name);
    if (cached !== undefined) {
      return cached;
    }

    // Simulated success
    const result = true;
    this._connectionTests.set(info.name, result);
    return result;
  }

  /**
   * Tests CRUD operations for a repository.
   */
  async testCrudOperations(repositoryName: string): Promise<CrudTestResult> {
    logger.debug(`Testing CRUD operations for: ${repositoryName}`);

    // Simulated CRUD test - in production, would actually test CRUD
    const result: CrudTestResult = {
      create: true,
      read: true,
      update: true,
      delete: true,
    };

    return result;
  }

  /**
   * Validates repository table exists.
   */
  async validateTable(repositoryName: string, tableName: string): Promise<boolean> {
    // Simulated table validation - in production, would check database schema
    const info = this._repositories.get(repositoryName);
    if (!info) {
      return false;
    }
    return info.tableName === tableName;
  }

  /**
   * Checks if a repository is registered.
   */
  isRepositoryRegistered(name: string): boolean {
    const info = this._repositories.get(name);
    return info?.isRegistered ?? false;
  }

  /**
   * Gets all registered repository names.
   */
  getRegisteredRepositories(): string[] {
    return Array.from(this._repositories.values())
      .filter(info => info.isRegistered)
      .map(info => info.name);
  }

  /**
   * Resets validation state.
   */
  reset(): void {
    this._repositories.clear();
    this._connectionTests.clear();
    logger.info('RepositoryValidation state reset');
  }

  /**
   * Clears connection test cache.
   */
  clearConnectionCache(): void {
    this._connectionTests.clear();
    logger.info('Connection test cache cleared');
  }
}
