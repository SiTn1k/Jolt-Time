/**
 * Performance Analyzer
 *
 * Analyzes performance metrics and provides statistics.
 * Supports execution time, memory usage, CPU usage, repository timing, and cache timing.
 *
 * IMPORTANT: PerformanceAnalyzer NEVER modifies gameplay. This is a pure analysis layer.
 */

import type { OptimizationStatistics } from '../types/OptimizationStatistics';

/**
 * Timing result for measured operations.
 */
export interface TimingResult {
  startTime: number;
  endTime: number;
  duration: number;
}

/**
 * Execution time statistics.
 */
export interface ExecutionTimeStats {
  min: number;
  max: number;
  average: number;
  median: number;
  p95: number;
  p99: number;
  standardDeviation: number;
  sampleCount: number;
}

/**
 * Memory usage statistics.
 */
export interface MemoryStats {
  current: number;
  peak: number;
  average: number;
  min: number;
  max: number;
  sampleCount: number;
}

/**
 * CPU usage statistics.
 */
export interface CpuStats {
  average: number;
  peak: number;
  sampleCount: number;
}

/**
 * Repository timing statistics.
 */
export interface RepositoryTimingStats {
  totalCalls: number;
  totalTime: number;
  averageTime: number;
  minTime: number;
  maxTime: number;
  slowQueries: QueryTimingInfo[];
  byOperation: Record<string, OperationTimingStats>;
}

/**
 * Query timing information.
 */
export interface QueryTimingInfo {
  queryId: string;
  operation: string;
  tableName: string;
  duration: number;
  timestamp: Date;
  isSlow: boolean;
}

/**
 * Operation timing statistics.
 */
export interface OperationTimingStats {
  count: number;
  totalTime: number;
  averageTime: number;
  minTime: number;
  maxTime: number;
}

/**
 * Cache timing statistics.
 */
export interface CacheTimingStats {
  totalHits: number;
  totalMisses: number;
  hitRatio: number;
  missRatio: number;
  averageHitTime: number;
  averageMissTime: number;
  byRegion: Record<string, RegionCacheStats>;
}

/**
 * Region cache statistics.
 */
export interface RegionCacheStats {
  hits: number;
  misses: number;
  hitRatio: number;
  entryCount: number;
  averageLifetime: number;
}

/**
 * Aggregated statistics.
 */
export interface AggregatedStats {
  executionTime: ExecutionTimeStats;
  memory: MemoryStats;
  cpu: CpuStats;
  repository: RepositoryTimingStats;
  cache: CacheTimingStats;
  generatedAt: Date;
}

/**
 * Performance analyzer for measuring and analyzing performance metrics.
 */
export class PerformanceAnalyzer {
  private _executionTimes: number[] = [];
  private _memoryUsages: number[] = [];
  private _cpuUsages: number[] = [];
  private _repositoryCalls: Map<string, QueryTimingInfo> = new Map();
  private _cacheHits: number = 0;
  private _cacheMisses: number = 0;
  private _cacheHitTimes: number[] = [];
  private _cacheMissTimes: number[] = [];
  private _currentMemory: number = 0;
  private _peakMemory: number = 0;
  private _startTime: number = Date.now();

  // Configuration
  private readonly _slowQueryThreshold: number;
  private readonly _maxSamples: number;

  constructor(config?: {
    slowQueryThresholdMs?: number;
    maxSamples?: number;
  }) {
    this._slowQueryThreshold = config?.slowQueryThresholdMs ?? 100;
    this._maxSamples = config?.maxSamples ?? 10000;
  }

  // ============ Timing Methods ============

  /**
   * Starts timing an operation.
   */
  startTiming(): TimingResult {
    return {
      startTime: Date.now(),
      endTime: 0,
      duration: 0,
    };
  }

  /**
   * Ends timing and records the result.
   */
  endTiming(result: TimingResult): number {
    result.endTime = Date.now();
    result.duration = result.endTime - result.startTime;
    this.recordExecutionTime(result.duration);
    return result.duration;
  }

  /**
   * Measures execution time of a function.
   */
  async measure<T>(fn: () => Promise<T> | T): Promise<{ result: T; duration: number }> {
    const timing = this.startTiming();
    try {
      const result = await fn();
      const duration = this.endTiming(timing);
      return { result, duration };
    } catch (error) {
      this.endTiming(timing);
      throw error;
    }
  }

  // ============ Execution Time Methods ============

  /**
   * Records an execution time measurement.
   */
  recordExecutionTime(durationMs: number): void {
    this._executionTimes.push(durationMs);
    this.trimSamples(this._executionTimes);
  }

  /**
   * Gets execution time statistics.
   */
  getExecutionTimeStats(): ExecutionTimeStats {
    if (this._executionTimes.length === 0) {
      return {
        min: 0,
        max: 0,
        average: 0,
        median: 0,
        p95: 0,
        p99: 0,
        standardDeviation: 0,
        sampleCount: 0,
      };
    }

    const sorted = [...this._executionTimes].sort((a, b) => a - b);
    const sum = sorted.reduce((a, b) => a + b, 0);
    const mean = sum / sorted.length;
    const variance = sorted.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / sorted.length;
    const stdDev = Math.sqrt(variance);

    return {
      min: sorted[0],
      max: sorted[sorted.length - 1],
      average: mean,
      median: sorted[Math.floor(sorted.length / 2)],
      p95: this.percentile(sorted, 95),
      p99: this.percentile(sorted, 99),
      standardDeviation: stdDev,
      sampleCount: sorted.length,
    };
  }

  // ============ Memory Usage Methods ============

  /**
   * Records current memory usage.
   */
  recordMemoryUsage(bytes: number): void {
    this._memoryUsages.push(bytes);
    this._currentMemory = bytes;
    this._peakMemory = Math.max(this._peakMemory, bytes);
    this.trimSamples(this._memoryUsages);
  }

  /**
   * Gets current memory usage (estimated).
   */
  getCurrentMemoryUsage(): number {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const mem = process.memoryUsage();
      return mem.heapUsed;
    }
    return this._currentMemory;
  }

  /**
   * Gets peak memory usage.
   */
  getPeakMemoryUsage(): number {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const mem = process.memoryUsage();
      return Math.max(this._peakMemory, mem.heapUsed);
    }
    return this._peakMemory;
  }

  /**
   * Gets memory usage statistics.
   */
  getMemoryStats(): MemoryStats {
    if (this._memoryUsages.length === 0) {
      return {
        current: this.getCurrentMemoryUsage(),
        peak: this.getPeakMemoryUsage(),
        average: 0,
        min: 0,
        max: 0,
        sampleCount: 0,
      };
    }

    const sorted = [...this._memoryUsages].sort((a, b) => a - b);
    const sum = sorted.reduce((a, b) => a + b, 0);

    return {
      current: this.getCurrentMemoryUsage(),
      peak: this.getPeakMemoryUsage(),
      average: sum / sorted.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      sampleCount: sorted.length,
    };
  }

  // ============ CPU Usage Methods ============

  /**
   * Records CPU usage measurement.
   */
  recordCpuUsage(percentage: number): void {
    this._cpuUsages.push(Math.min(100, Math.max(0, percentage)));
    this.trimSamples(this._cpuUsages);
  }

  /**
   * Gets CPU usage statistics.
   */
  getCpuStats(): CpuStats {
    if (this._cpuUsages.length === 0) {
      return {
        average: 0,
        peak: 0,
        sampleCount: 0,
      };
    }

    const sum = this._cpuUsages.reduce((a, b) => a + b, 0);

    return {
      average: sum / this._cpuUsages.length,
      peak: Math.max(...this._cpuUsages),
      sampleCount: this._cpuUsages.length,
    };
  }

  // ============ Repository Timing Methods ============

  /**
   * Records a repository call.
   */
  recordRepositoryCall(params: {
    queryId: string;
    operation: string;
    tableName: string;
    duration: number;
  }): void {
    const info: QueryTimingInfo = {
      queryId: params.queryId,
      operation: params.operation,
      tableName: params.tableName,
      duration: params.duration,
      timestamp: new Date(),
      isSlow: params.duration > this._slowQueryThreshold,
    };

    this._repositoryCalls.set(params.queryId, info);
  }

  /**
   * Gets repository timing statistics.
   */
  getRepositoryTimingStats(): RepositoryTimingStats {
    const calls = Array.from(this._repositoryCalls.values());
    const slowQueries = calls.filter((c) => c.isSlow);

    const byOperation: Record<string, OperationTimingStats> = {};

    for (const call of calls) {
      if (!byOperation[call.operation]) {
        byOperation[call.operation] = {
          count: 0,
          totalTime: 0,
          averageTime: 0,
          minTime: Infinity,
          maxTime: 0,
        };
      }

      const stats = byOperation[call.operation];
      stats.count++;
      stats.totalTime += call.duration;
      stats.minTime = Math.min(stats.minTime, call.duration);
      stats.maxTime = Math.max(stats.maxTime, call.duration);
    }

    for (const op of Object.keys(byOperation)) {
      const stats = byOperation[op];
      stats.averageTime = stats.totalTime / stats.count;
      if (stats.minTime === Infinity) stats.minTime = 0;
    }

    const totalTime = calls.reduce((sum, c) => sum + c.duration, 0);

    return {
      totalCalls: calls.length,
      totalTime,
      averageTime: calls.length > 0 ? totalTime / calls.length : 0,
      minTime: calls.length > 0 ? Math.min(...calls.map((c) => c.duration)) : 0,
      maxTime: calls.length > 0 ? Math.max(...calls.map((c) => c.duration)) : 0,
      slowQueries,
      byOperation,
    };
  }

  /**
   * Gets slow query count.
   */
  getSlowQueryCount(): number {
    return Array.from(this._repositoryCalls.values()).filter((c) => c.isSlow).length;
  }

  // ============ Cache Timing Methods ============

  /**
   * Records a cache hit.
   */
  recordCacheHit(responseTimeMs?: number): void {
    this._cacheHits++;
    if (responseTimeMs !== undefined) {
      this._cacheHitTimes.push(responseTimeMs);
    }
  }

  /**
   * Records a cache miss.
   */
  recordCacheMiss(responseTimeMs?: number): void {
    this._cacheMisses++;
    if (responseTimeMs !== undefined) {
      this._cacheMissTimes.push(responseTimeMs);
    }
  }

  /**
   * Gets cache timing statistics.
   */
  getCacheTimingStats(): CacheTimingStats {
    const total = this._cacheHits + this._cacheMisses;
    const hitRatio = total > 0 ? this._cacheHits / total : 0;
    const missRatio = total > 0 ? this._cacheMisses / total : 0;

    const avgHitTime =
      this._cacheHitTimes.length > 0
        ? this._cacheHitTimes.reduce((a, b) => a + b, 0) / this._cacheHitTimes.length
        : 0;

    const avgMissTime =
      this._cacheMissTimes.length > 0
        ? this._cacheMissTimes.reduce((a, b) => a + b, 0) / this._cacheMissTimes.length
        : 0;

    return {
      totalHits: this._cacheHits,
      totalMisses: this._cacheMisses,
      hitRatio,
      missRatio,
      averageHitTime: avgHitTime,
      averageMissTime: avgMissTime,
      byRegion: {},
    };
  }

  /**
   * Gets cache hit ratio.
   */
  getCacheHitRatio(): number {
    const total = this._cacheHits + this._cacheMisses;
    return total > 0 ? this._cacheHits / total : 0;
  }

  // ============ Statistics Aggregation ============

  /**
   * Gets all aggregated statistics.
   */
  getAggregatedStats(): AggregatedStats {
    return {
      executionTime: this.getExecutionTimeStats(),
      memory: this.getMemoryStats(),
      cpu: this.getCpuStats(),
      repository: this.getRepositoryTimingStats(),
      cache: this.getCacheTimingStats(),
      generatedAt: new Date(),
    };
  }

  /**
   * Generates optimization statistics compatible output.
   */
  toOptimizationStatistics(): OptimizationStatistics {
    const execStats = this.getExecutionTimeStats();
    const memoryStats = this.getMemoryStats();
    const cpuStats = this.getCpuStats();
    const cacheStats = this.getCacheTimingStats();

    return {
      sampleCount: execStats.sampleCount,
      standardDeviation: execStats.standardDeviation,
      minExecutionTime: execStats.min,
      maxExecutionTime: execStats.max,
      medianExecutionTime: execStats.median,
      p95ExecutionTime: execStats.p95,
      p99ExecutionTime: execStats.p99,
      cacheHitRate: cacheStats.hitRatio * 100,
      averageMemoryUsage: memoryStats.average,
      peakMemoryUsage: memoryStats.peak,
      averageCpuUsage: cpuStats.average,
    };
  }

  // ============ Reset Methods ============

  /**
   * Resets all collected statistics.
   */
  reset(): void {
    this._executionTimes = [];
    this._memoryUsages = [];
    this._cpuUsages = [];
    this._repositoryCalls.clear();
    this._cacheHits = 0;
    this._cacheMisses = 0;
    this._cacheHitTimes = [];
    this._cacheMissTimes = [];
    this._currentMemory = 0;
    this._peakMemory = 0;
    this._startTime = Date.now();
  }

  /**
   * Resets only execution time statistics.
   */
  resetExecutionTimes(): void {
    this._executionTimes = [];
  }

  /**
   * Resets only memory statistics.
   */
  resetMemory(): void {
    this._memoryUsages = [];
    this._peakMemory = 0;
  }

  /**
   * Resets only repository timing statistics.
   */
  resetRepositoryTiming(): void {
    this._repositoryCalls.clear();
  }

  /**
   * Resets only cache timing statistics.
   */
  resetCacheTiming(): void {
    this._cacheHits = 0;
    this._cacheMisses = 0;
    this._cacheHitTimes = [];
    this._cacheMissTimes = [];
  }

  // ============ Private Helpers ============

  /**
   * Trims samples array to max size.
   */
  private trimSamples(array: number[]): void {
    if (array.length > this._maxSamples) {
      array.splice(0, array.length - this._maxSamples);
    }
  }

  /**
   * Calculates percentile from sorted array.
   */
  private percentile(sorted: number[], p: number): number {
    if (sorted.length === 0) return 0;
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  }

  /**
   * Gets the analyzer's uptime.
   */
  getUptime(): number {
    return Date.now() - this._startTime;
  }

  /**
   * Gets total samples collected.
   */
  getTotalSamples(): {
    executionTimes: number;
    memoryUsages: number;
    cpuUsages: number;
    repositoryCalls: number;
    cacheHits: number;
    cacheMisses: number;
  } {
    return {
      executionTimes: this._executionTimes.length,
      memoryUsages: this._memoryUsages.length,
      cpuUsages: this._cpuUsages.length,
      repositoryCalls: this._repositoryCalls.size,
      cacheHits: this._cacheHits,
      cacheMisses: this._cacheMisses,
    };
  }
}
