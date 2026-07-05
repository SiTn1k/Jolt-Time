/**
 * Database Optimization Analyzer
 *
 * Analyzes database performance patterns including:
 * - Query statistics
 * - Slow query detection
 * - Duplicate query detection
 * - Repository call statistics
 *
 * IMPORTANT: This is analysis ONLY. Never rewrites queries automatically.
 * Analysis only - provides recommendations without modifying logic.
 */

import { createLogger } from '../../../core/logging/logger.service';

const logger = createLogger('DatabaseOptimizationAnalyzer');

/**
 * Database query information.
 */
export interface DatabaseQuery {
  queryId: string;
  operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';
  tableName: string;
  duration: number;
  timestamp: Date;
  parameters?: Record<string, unknown>;
}

/**
 * Slow query information.
 */
export interface SlowQueryInfo {
  queryId: string;
  operation: string;
  tableName: string;
  duration: number;
  threshold: number;
  timestamp: Date;
  recommendation: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

/**
 * Duplicate query pattern.
 */
export interface DuplicateQueryPattern {
  queryPattern: string;
  tableName: string;
  count: number;
  averageDuration: number;
  totalDuration: number;
  lastExecuted: Date;
}

/**
 * Repository call statistics.
 */
export interface RepositoryCallStats {
  repositoryName: string;
  methodName: string;
  callCount: number;
  totalDuration: number;
  averageDuration: number;
  minDuration: number;
  maxDuration: number;
  slowCallCount: number;
}

/**
 * Table access statistics.
 */
export interface TableAccessStats {
  tableName: string;
  selectCount: number;
  insertCount: number;
  updateCount: number;
  deleteCount: number;
  totalCount: number;
  totalDuration: number;
  averageDuration: number;
}

/**
 * Database optimization recommendations.
 */
export interface DatabaseRecommendation {
  type: 'SLOW_QUERY' | 'DUPLICATE_QUERY' | 'MISSING_INDEX' | 'N_PLUS_1' | 'LARGE_TABLE_SCAN' | 'CONNECTION_POOL';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  queryId?: string;
  tableName?: string;
  suggestion: string;
  estimatedImpact?: string;
}

/**
 * Database optimization analysis result.
 */
export interface DatabaseAnalysisResult {
  totalQueries: number;
  totalDuration: number;
  averageDuration: number;
  slowQueries: SlowQueryInfo[];
  duplicatePatterns: DuplicateQueryPattern[];
  repositoryStats: RepositoryCallStats[];
  tableAccessStats: TableAccessStats[];
  recommendations: DatabaseRecommendation[];
  analyzedAt: Date;
}

/**
 * Analyzer configuration.
 */
export interface DatabaseAnalyzerConfig {
  slowQueryThresholdMs?: number;
  duplicateQueryWindowMs?: number;
  maxRecommendations?: number;
}

/**
 * Database optimization analyzer for analyzing database performance patterns.
 * Analysis only - provides recommendations without modifying logic.
 */
export class DatabaseOptimizationAnalyzer {
  private readonly _queries: DatabaseQuery[] = [];
  private readonly _slowQueryThreshold: number;
  private readonly _duplicateQueryWindowMs: number;
  private readonly _maxRecommendations: number;
  private readonly _maxQueries: number;

  constructor(config?: DatabaseAnalyzerConfig) {
    this._slowQueryThreshold = config?.slowQueryThresholdMs ?? 100;
    this._duplicateQueryWindowMs = config?.duplicateQueryWindowMs ?? 60000;
    this._maxRecommendations = config?.maxRecommendations ?? 50;
    this._maxQueries = 10000;
  }

  // ============ Query Recording ============

  /**
   * Records a database query execution.
   */
  recordQuery(query: Omit<DatabaseQuery, 'timestamp'>): void {
    const fullQuery: DatabaseQuery = {
      ...query,
      timestamp: new Date(),
    };

    this._queries.push(fullQuery);
    this.trimQueries();

    if (fullQuery.duration > this._slowQueryThreshold) {
      logger.debug(`Slow query detected: ${fullQuery.operation} on ${fullQuery.tableName} took ${fullQuery.duration}ms`);
    }
  }

  /**
   * Records a SELECT query.
   */
  recordSelect(tableName: string, duration: number, queryId?: string, parameters?: Record<string, unknown>): void {
    this.recordQuery({
      queryId: queryId ?? this.generateQueryId(),
      operation: 'SELECT',
      tableName,
      duration,
      parameters,
    });
  }

  /**
   * Records an INSERT query.
   */
  recordInsert(tableName: string, duration: number, queryId?: string, parameters?: Record<string, unknown>): void {
    this.recordQuery({
      queryId: queryId ?? this.generateQueryId(),
      operation: 'INSERT',
      tableName,
      duration,
      parameters,
    });
  }

  /**
   * Records an UPDATE query.
   */
  recordUpdate(tableName: string, duration: number, queryId?: string, parameters?: Record<string, unknown>): void {
    this.recordQuery({
      queryId: queryId ?? this.generateQueryId(),
      operation: 'UPDATE',
      tableName,
      duration,
      parameters,
    });
  }

  /**
   * Records a DELETE query.
   */
  recordDelete(tableName: string, duration: number, queryId?: string, parameters?: Record<string, unknown>): void {
    this.recordQuery({
      queryId: queryId ?? this.generateQueryId(),
      operation: 'DELETE',
      tableName,
      duration,
      parameters,
    });
  }

  // ============ Analysis Methods ============

  /**
   * Performs full database optimization analysis.
   */
  analyze(): DatabaseAnalysisResult {
    const slowQueries = this.detectSlowQueries();
    const duplicatePatterns = this.detectDuplicateQueries();
    const repositoryStats = this.calculateRepositoryStats();
    const tableAccessStats = this.calculateTableAccessStats();
    const recommendations = this.generateRecommendations(slowQueries, duplicatePatterns, tableAccessStats);

    const totalDuration = this._queries.reduce((sum, q) => sum + q.duration, 0);

    return {
      totalQueries: this._queries.length,
      totalDuration,
      averageDuration: this._queries.length > 0 ? totalDuration / this._queries.length : 0,
      slowQueries,
      duplicatePatterns,
      repositoryStats,
      tableAccessStats,
      recommendations,
      analyzedAt: new Date(),
    };
  }

  /**
   * Detects slow queries based on threshold.
   */
  detectSlowQueries(): SlowQueryInfo[] {
    return this._queries
      .filter((q) => q.duration > this._slowQueryThreshold)
      .map((q) => ({
        queryId: q.queryId,
        operation: q.operation,
        tableName: q.tableName,
        duration: q.duration,
        threshold: this._slowQueryThreshold,
        timestamp: q.timestamp,
        recommendation: this.getSlowQueryRecommendation(q),
      }))
      .sort((a, b) => b.duration - a.duration);
  }

  /**
   * Detects duplicate query patterns.
   */
  detectDuplicateQueries(): DuplicateQueryPattern[] {
    const windowStart = Date.now() - this._duplicateQueryWindowMs;
    const recentQueries = this._queries.filter((q) => q.timestamp.getTime() >= windowStart);

    const patterns = new Map<string, DatabaseQuery[]>();

    for (const query of recentQueries) {
      const pattern = this.getQueryPattern(query);
      const existing = patterns.get(pattern) || [];
      existing.push(query);
      patterns.set(pattern, existing);
    }

    const duplicates: DuplicateQueryPattern[] = [];

    for (const [pattern, queries] of patterns) {
      if (queries.length >= 3) {
        const totalDuration = queries.reduce((sum, q) => sum + q.duration, 0);
        duplicates.push({
          queryPattern: pattern,
          tableName: queries[0].tableName,
          count: queries.length,
          averageDuration: totalDuration / queries.length,
          totalDuration,
          lastExecuted: queries[queries.length - 1].timestamp,
        });
      }
    }

    return duplicates.sort((a, b) => b.totalDuration - a.totalDuration);
  }

  /**
   * Calculates repository call statistics.
   */
  calculateRepositoryStats(): RepositoryCallStats[] {
    const stats = new Map<string, RepositoryCallStats>();

    for (const query of this._queries) {
      const key = `${query.tableName}:${query.operation}`;
      const existing = stats.get(key) || {
        repositoryName: query.tableName,
        methodName: query.operation.toLowerCase(),
        callCount: 0,
        totalDuration: 0,
        averageDuration: 0,
        minDuration: Infinity,
        maxDuration: 0,
        slowCallCount: 0,
      };

      existing.callCount++;
      existing.totalDuration += query.duration;
      existing.minDuration = Math.min(existing.minDuration, query.duration);
      existing.maxDuration = Math.max(existing.maxDuration, query.duration);
      existing.averageDuration = existing.totalDuration / existing.callCount;

      if (query.duration > this._slowQueryThreshold) {
        existing.slowCallCount++;
      }

      stats.set(key, existing);
    }

    const result: RepositoryCallStats[] = [];
    for (const stat of stats.values()) {
      if (stat.minDuration === Infinity) stat.minDuration = 0;
      result.push(stat);
    }

    return result.sort((a, b) => b.totalDuration - a.totalDuration);
  }

  /**
   * Calculates table access statistics.
   */
  calculateTableAccessStats(): TableAccessStats[] {
    const stats = new Map<string, TableAccessStats>();

    for (const query of this._queries) {
      const existing = stats.get(query.tableName) || {
        tableName: query.tableName,
        selectCount: 0,
        insertCount: 0,
        updateCount: 0,
        deleteCount: 0,
        totalCount: 0,
        totalDuration: 0,
        averageDuration: 0,
      };

      switch (query.operation) {
        case 'SELECT':
          existing.selectCount++;
          break;
        case 'INSERT':
          existing.insertCount++;
          break;
        case 'UPDATE':
          existing.updateCount++;
          break;
        case 'DELETE':
          existing.deleteCount++;
          break;
      }

      existing.totalCount++;
      existing.totalDuration += query.duration;
      existing.averageDuration = existing.totalDuration / existing.totalCount;

      stats.set(query.tableName, existing);
    }

    return Array.from(stats.values()).sort((a, b) => b.totalCount - a.totalCount);
  }

  // ============ Recommendation Methods ============

  /**
   * Generates optimization recommendations based on analysis.
   */
  generateRecommendations(
    slowQueries: SlowQueryInfo[],
    duplicatePatterns: DuplicateQueryPattern[],
    tableStats: TableAccessStats[]
  ): DatabaseRecommendation[] {
    const recommendations: DatabaseRecommendation[] = [];

    // Slow query recommendations
    for (const sq of slowQueries.slice(0, 10)) {
      recommendations.push({
        type: 'SLOW_QUERY',
        severity: sq.duration > this._slowQueryThreshold * 5 ? 'HIGH' : 'MEDIUM',
        description: `Query on ${sq.tableName} took ${sq.duration.toFixed(2)}ms`,
        queryId: sq.queryId,
        tableName: sq.tableName,
        suggestion: sq.recommendation,
        estimatedImpact: `${((sq.duration - this._slowQueryThreshold) / 1000).toFixed(2)}s saved per query`,
      });
    }

    // Duplicate query recommendations
    for (const dp of duplicatePatterns.slice(0, 5)) {
      recommendations.push({
        type: 'DUPLICATE_QUERY',
        severity: dp.count > 10 ? 'HIGH' : 'MEDIUM',
        description: `${dp.count} similar queries on ${dp.tableName} in the analysis window`,
        tableName: dp.tableName,
        suggestion: 'Consider implementing query result caching or batch loading',
        estimatedImpact: `${((dp.totalDuration * 0.8) / 1000).toFixed(2)}s potential savings`,
      });
    }

    // Table scan recommendations
    for (const table of tableStats) {
      if (table.selectCount > 100) {
        const avgDuration = table.averageDuration;
        if (avgDuration > 50) {
          recommendations.push({
            type: 'LARGE_TABLE_SCAN',
            severity: 'MEDIUM',
            description: `High frequency SELECT on ${table.tableName} (${table.selectCount} queries, avg ${avgDuration.toFixed(2)}ms)`,
            tableName: table.tableName,
            suggestion: 'Consider adding indexes or implementing pagination for frequent queries',
          });
        }
      }
    }

    // Sort by severity and limit
    return recommendations
      .sort((a, b) => {
        const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
        return severityOrder[a.severity] - severityOrder[b.severity];
      })
      .slice(0, this._maxRecommendations);
  }

  /**
   * Gets slow query recommendation based on query type.
   */
  private getSlowQueryRecommendation(query: DatabaseQuery): string {
    switch (query.operation) {
      case 'SELECT':
        if (query.tableName.includes('_with_') || query.tableName.includes('_and_')) {
          return 'Consider denormalizing or using a materialized view for complex joins';
        }
        return 'Check for missing indexes or consider query optimization';
      case 'INSERT':
        return 'Consider batch inserts or removing unnecessary triggers';
      case 'UPDATE':
        return 'Check for cascading updates or missing indexes on WHERE clause';
      case 'DELETE':
        return 'Consider soft deletes or batch processing for large deletions';
      default:
        return 'Review query execution plan';
    }
  }

  /**
   * Gets query pattern string for duplicate detection.
   */
  private getQueryPattern(query: DatabaseQuery): string {
    return `${query.operation}:${query.tableName}`;
  }

  /**
   * Generates unique query ID.
   */
  private generateQueryId(): string {
    return `q_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Trims queries array to max size.
   */
  private trimQueries(): void {
    if (this._queries.length > this._maxQueries) {
      this._queries.splice(0, this._queries.length - this._maxQueries);
    }
  }

  // ============ Utility Methods ============

  /**
   * Gets total query count.
   */
  getTotalQueryCount(): number {
    return this._queries.length;
  }

  /**
   * Gets queries by operation type.
   */
  getQueriesByOperation(operation: DatabaseQuery['operation']): DatabaseQuery[] {
    return this._queries.filter((q) => q.operation === operation);
  }

  /**
   * Gets queries by table name.
   */
  getQueriesByTable(tableName: string): DatabaseQuery[] {
    return this._queries.filter((q) => q.tableName === tableName);
  }

  /**
   * Clears all recorded queries.
   */
  clear(): void {
    this._queries.length = 0;
  }

  /**
   * Gets current configuration.
   */
  getConfig(): DatabaseAnalyzerConfig {
    return {
      slowQueryThresholdMs: this._slowQueryThreshold,
      duplicateQueryWindowMs: this._duplicateQueryWindowMs,
      maxRecommendations: this._maxRecommendations,
    };
  }
}
