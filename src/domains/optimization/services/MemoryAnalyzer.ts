/**
 * Memory Analyzer
 *
 * Analyzes memory usage patterns including:
 * - Object count tracking
 * - Memory growth detection
 * - Peak usage tracking
 * - Average usage calculation
 * - Snapshot comparison
 *
 * IMPORTANT: This is analysis ONLY. Never modifies memory automatically.
 */

import { createLogger } from '../../../core/logging/logger.service';

const logger = createLogger('MemoryAnalyzer');

/**
 * Memory snapshot.
 */
export interface MemorySnapshot {
  timestamp: Date;
  heapUsed: number;
  heapTotal: number;
  external: number;
  rss: number;
  arrayBuffers: number;
}

/**
 * Object count information.
 */
export interface ObjectCountInfo {
  typeName: string;
  count: number;
  sizeBytes: number;
  averageSize: number;
}

/**
 * Memory growth information.
 */
export interface MemoryGrowthInfo {
  startSnapshot: MemorySnapshot;
  endSnapshot: MemorySnapshot;
  growthBytes: number;
  growthPercent: number;
  duration: number;
  rateBytesPerSecond: number;
}

/**
 * Usage statistics.
 */
export interface MemoryUsageStats {
  current: number;
  peak: number;
  average: number;
  min: number;
  max: number;
  sampleCount: number;
  heapUsed: number;
  heapTotal: number;
  external: number;
  rss: number;
}

/**
 * Snapshot comparison result.
 */
export interface SnapshotComparison {
  startSnapshot: MemorySnapshot;
  endSnapshot: MemorySnapshot;
  heapUsedDelta: number;
  heapTotalDelta: number;
  externalDelta: number;
  rssDelta: number;
  duration: number;
}

/**
 * Memory recommendation.
 */
export interface MemoryRecommendation {
  type: 'MEMORY_LEAK' | 'HIGH_USAGE' | 'MEMORY_GROWTH' | 'LARGE_OBJECT' | 'CACHE_BLOAT';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  suggestion: string;
  estimatedImpact?: string;
}

/**
 * Memory analysis result.
 */
export interface MemoryAnalysisResult {
  currentUsage: MemoryUsageStats;
  peakUsage: MemoryUsageStats;
  averageUsage: MemoryUsageStats;
  objectCounts: ObjectCountInfo[];
  recommendations: MemoryRecommendation[];
  analyzedAt: Date;
}

/**
 * Analyzer configuration.
 */
export interface MemoryAnalyzerConfig {
  highMemoryThresholdBytes?: number;
  growthThresholdPercent?: number;
  maxSnapshots?: number;
  maxRecommendations?: number;
  sampleIntervalMs?: number;
}

/**
 * Memory analyzer for analyzing memory usage patterns.
 */
export class MemoryAnalyzer {
  private readonly _snapshots: MemorySnapshot[] = [];
  private readonly _objectCounts: Map<string, number> = new Map();
  private readonly _highMemoryThreshold: number;
  private readonly _growthThresholdPercent: number;
  private readonly _maxSnapshots: number;
  private readonly _maxRecommendations: number;
  private _peakMemory: number = 0;
  private _startTime: Date;

  constructor(config?: MemoryAnalyzerConfig) {
    this._highMemoryThreshold = config?.highMemoryThresholdBytes ?? 100 * 1024 * 1024; // 100MB
    this._growthThresholdPercent = config?.growthThresholdPercent ?? 50;
    this._maxSnapshots = config?.maxSnapshots ?? 1000;
    this._maxRecommendations = config?.maxRecommendations ?? 20;
    this._startTime = new Date();

    // Record initial memory if available
    this.recordCurrentMemory();
  }

  // ============ Snapshot Methods ============

  /**
   * Records current memory snapshot.
   */
  recordCurrentMemory(): MemorySnapshot | null {
    const mem = this.getCurrentMemoryUsage();
    if (!mem) return null;

    const snapshot: MemorySnapshot = {
      timestamp: new Date(),
      heapUsed: mem.heapUsed,
      heapTotal: mem.heapTotal,
      external: mem.external,
      rss: mem.rss,
      arrayBuffers: mem.arrayBuffers,
    };

    this._snapshots.push(snapshot);
    this._peakMemory = Math.max(this._peakMemory, mem.heapUsed);
    this.trimSnapshots();

    return snapshot;
  }

  /**
   * Takes a named snapshot for comparison.
   */
  takeSnapshot(): MemorySnapshot | null {
    return this.recordCurrentMemory();
  }

  /**
   * Gets current memory usage.
   */
  getCurrentMemoryUsage(): MemoryUsage | null {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const mem = process.memoryUsage();
      return {
        heapUsed: mem.heapUsed,
        heapTotal: mem.heapTotal,
        external: mem.external,
        rss: mem.rss,
        arrayBuffers: mem.arrayBuffers || 0,
      };
    }
    return null;
  }

  // ============ Object Count Methods ============

  /**
   * Records object count for a type.
   */
  recordObjectCount(typeName: string, count: number): void {
    this._objectCounts.set(typeName, count);
  }

  /**
   * Increments object count for a type.
   */
  incrementObjectCount(typeName: string, delta: number = 1): void {
    const current = this._objectCounts.get(typeName) || 0;
    this._objectCounts.set(typeName, current + delta);
  }

  /**
   * Decrements object count for a type.
   */
  decrementObjectCount(typeName: string, delta: number = 1): void {
    const current = this._objectCounts.get(typeName) || 0;
    this._objectCounts.set(typeName, Math.max(0, current - delta));
  }

  /**
   * Gets object counts.
   */
  getObjectCounts(): ObjectCountInfo[] {
    const result: ObjectCountInfo[] = [];

    for (const [typeName, count] of this._objectCounts) {
      result.push({
        typeName,
        count,
        sizeBytes: 0, // Size estimation would require instrumentation
        averageSize: 0,
      });
    }

    return result.sort((a, b) => b.count - a.count);
  }

  // ============ Analysis Methods ============

  /**
   * Performs full memory analysis.
   */
  analyze(): MemoryAnalysisResult {
    const currentMem = this.getCurrentMemoryUsage();
    const current = this.calculateCurrentUsage(currentMem);
    const peak = this.calculatePeakUsage();
    const average = this.calculateAverageUsage();
    const objectCounts = this.getObjectCounts();
    const recommendations = this.generateRecommendations(current, peak, average, objectCounts);

    return {
      currentUsage: current,
      peakUsage: peak,
      averageUsage: average,
      objectCounts,
      recommendations,
      analyzedAt: new Date(),
    };
  }

  /**
   * Calculates current usage statistics.
   */
  calculateCurrentUsage(mem?: MemoryUsage | null): MemoryUsageStats {
    const memory = mem ?? this.getCurrentMemoryUsage();

    if (!memory) {
      return {
        current: 0,
        peak: this._peakMemory,
        average: 0,
        min: 0,
        max: 0,
        sampleCount: 0,
        heapUsed: 0,
        heapTotal: 0,
        external: 0,
        rss: 0,
      };
    }

    return {
      current: memory.heapUsed,
      peak: Math.max(this._peakMemory, memory.heapUsed),
      average: this.calculateAverage(),
      min: this.calculateMin(),
      max: this.calculateMax(),
      sampleCount: this._snapshots.length,
      heapUsed: memory.heapUsed,
      heapTotal: memory.heapTotal,
      external: memory.external,
      rss: memory.rss,
    };
  }

  /**
   * Calculates peak usage statistics.
   */
  calculatePeakUsage(): MemoryUsageStats {
    if (this._snapshots.length === 0) {
      const current = this.getCurrentMemoryUsage();
      return {
        current: current?.heapUsed ?? 0,
        peak: this._peakMemory,
        average: 0,
        min: 0,
        max: 0,
        sampleCount: 0,
        heapUsed: current?.heapUsed ?? 0,
        heapTotal: current?.heapTotal ?? 0,
        external: current?.external ?? 0,
        rss: current?.rss ?? 0,
      };
    }

    let peakHeapUsed = 0;
    let peakHeapTotal = 0;
    let peakExternal = 0;
    let peakRss = 0;

    for (const snapshot of this._snapshots) {
      peakHeapUsed = Math.max(peakHeapUsed, snapshot.heapUsed);
      peakHeapTotal = Math.max(peakHeapTotal, snapshot.heapTotal);
      peakExternal = Math.max(peakExternal, snapshot.external);
      peakRss = Math.max(peakRss, snapshot.rss);
    }

    return {
      current: this._snapshots[this._snapshots.length - 1].heapUsed,
      peak: this._peakMemory,
      average: this.calculateAverage(),
      min: this.calculateMin(),
      max: peakHeapUsed,
      sampleCount: this._snapshots.length,
      heapUsed: peakHeapUsed,
      heapTotal: peakHeapTotal,
      external: peakExternal,
      rss: peakRss,
    };
  }

  /**
   * Calculates average usage.
   */
  calculateAverageUsage(): MemoryUsageStats {
    if (this._snapshots.length === 0) {
      const current = this.getCurrentMemoryUsage();
      return {
        current: current?.heapUsed ?? 0,
        peak: this._peakMemory,
        average: 0,
        min: 0,
        max: 0,
        sampleCount: 0,
        heapUsed: current?.heapUsed ?? 0,
        heapTotal: current?.heapTotal ?? 0,
        external: current?.external ?? 0,
        rss: current?.rss ?? 0,
      };
    }

    let totalHeapUsed = 0;
    let totalHeapTotal = 0;
    let totalExternal = 0;
    let totalRss = 0;
    let minHeapUsed = Infinity;
    let maxHeapUsed = 0;

    for (const snapshot of this._snapshots) {
      totalHeapUsed += snapshot.heapUsed;
      totalHeapTotal += snapshot.heapTotal;
      totalExternal += snapshot.external;
      totalRss += snapshot.rss;
      minHeapUsed = Math.min(minHeapUsed, snapshot.heapUsed);
      maxHeapUsed = Math.max(maxHeapUsed, snapshot.heapUsed);
    }

    const count = this._snapshots.length;

    return {
      current: this._snapshots[count - 1].heapUsed,
      peak: this._peakMemory,
      average: totalHeapUsed / count,
      min: minHeapUsed === Infinity ? 0 : minHeapUsed,
      max: maxHeapUsed,
      sampleCount: count,
      heapUsed: totalHeapUsed / count,
      heapTotal: totalHeapTotal / count,
      external: totalExternal / count,
      rss: totalRss / count,
    };
  }

  // ============ Snapshot Comparison ============

  /**
   * Compares two snapshots.
   */
  compareSnapshots(startIndex: number, endIndex: number): SnapshotComparison | null {
    if (startIndex < 0 || endIndex >= this._snapshots.length || startIndex >= endIndex) {
      return null;
    }

    const start = this._snapshots[startIndex];
    const end = this._snapshots[endIndex];

    return {
      startSnapshot: start,
      endSnapshot: end,
      heapUsedDelta: end.heapUsed - start.heapUsed,
      heapTotalDelta: end.heapTotal - start.heapTotal,
      externalDelta: end.external - start.external,
      rssDelta: end.rss - start.rss,
      duration: end.timestamp.getTime() - start.timestamp.getTime(),
    };
  }

  /**
   * Compares latest snapshot to an earlier one.
   */
  compareToStart(snapshotsAgo: number = 10): SnapshotComparison | null {
    if (this._snapshots.length <= snapshotsAgo) {
      return null;
    }

    const startIndex = 0;
    const endIndex = this._snapshots.length - 1 - snapshotsAgo;
    return this.compareSnapshots(startIndex, endIndex);
  }

  /**
   * Analyzes memory growth between snapshots.
   */
  analyzeGrowth(startIndex?: number, endIndex?: number): MemoryGrowthInfo | null {
    const start = startIndex ?? 0;
    const end = endIndex ?? this._snapshots.length - 1;

    if (start < 0 || end >= this._snapshots.length || start >= end) {
      return null;
    }

    const startSnapshot = this._snapshots[start];
    const endSnapshot = this._snapshots[end];
    const duration = endSnapshot.timestamp.getTime() - startSnapshot.timestamp.getTime();

    const growthBytes = endSnapshot.heapUsed - startSnapshot.heapUsed;
    const growthPercent = startSnapshot.heapUsed > 0
      ? (growthBytes / startSnapshot.heapUsed) * 100
      : 0;

    return {
      startSnapshot,
      endSnapshot,
      growthBytes,
      growthPercent,
      duration,
      rateBytesPerSecond: duration > 0 ? (growthBytes / duration) * 1000 : 0,
    };
  }

  // ============ Private Helpers ============

  /**
   * Calculates average memory usage.
   */
  private calculateAverage(): number {
    if (this._snapshots.length === 0) return 0;
    const sum = this._snapshots.reduce((acc, s) => acc + s.heapUsed, 0);
    return sum / this._snapshots.length;
  }

  /**
   * Calculates minimum memory usage.
   */
  private calculateMin(): number {
    if (this._snapshots.length === 0) return 0;
    return Math.min(...this._snapshots.map((s) => s.heapUsed));
  }

  /**
   * Calculates maximum memory usage.
   */
  private calculateMax(): number {
    if (this._snapshots.length === 0) return 0;
    return Math.max(...this._snapshots.map((s) => s.heapUsed));
  }

  /**
   * Trims snapshots to max size.
   */
  private trimSnapshots(): void {
    if (this._snapshots.length > this._maxSnapshots) {
      this._snapshots.splice(0, this._snapshots.length - this._maxSnapshots);
    }
  }

  // ============ Recommendation Methods ============

  /**
   * Generates memory optimization recommendations.
   */
  private generateRecommendations(
    current: MemoryUsageStats,
    peak: MemoryUsageStats,
    average: MemoryUsageStats,
    objectCounts: ObjectCountInfo[]
  ): MemoryRecommendation[] {
    const recommendations: MemoryRecommendation[] = [];

    // High memory usage
    if (current.heapUsed > this._highMemoryThreshold) {
      recommendations.push({
        type: 'HIGH_USAGE',
        severity: current.heapUsed > this._highMemoryThreshold * 2 ? 'HIGH' : 'MEDIUM',
        description: `Current heap usage is ${this.formatBytes(current.heapUsed)}, exceeding threshold of ${this.formatBytes(this._highMemoryThreshold)}`,
        suggestion: 'Review recent allocations and consider optimizing data structures or implementing streaming',
        estimatedImpact: `${this.formatBytes(current.heapUsed - this._highMemoryThreshold)} potential reduction`,
      });
    }

    // Memory growth detection
    const growth = this.analyzeGrowth(0, this._snapshots.length - 1);
    if (growth && growth.growthPercent > this._growthThresholdPercent) {
      recommendations.push({
        type: 'MEMORY_GROWTH',
        severity: growth.growthPercent > this._growthThresholdPercent * 2 ? 'CRITICAL' : 'HIGH',
        description: `Memory grew ${growth.growthPercent.toFixed(1)}% (${this.formatBytes(growth.growthBytes)}) over analysis period`,
        suggestion: 'Check for memory leaks or unbounded data structures',
        estimatedImpact: `${this.formatBytes(growth.growthBytes)} accumulated`,
      });
    }

    // Peak usage
    if (peak.peak > this._highMemoryThreshold) {
      recommendations.push({
        type: 'HIGH_USAGE',
        severity: 'LOW',
        description: `Peak heap usage reached ${this.formatBytes(peak.peak)}`,
        suggestion: 'Consider increasing memory limits or optimizing peak usage patterns',
      });
    }

    // Large object counts
    for (const obj of objectCounts.slice(0, 5)) {
      if (obj.count > 10000) {
        recommendations.push({
          type: 'LARGE_OBJECT',
          severity: 'LOW',
          description: `Object type '${obj.typeName}' has ${obj.count.toLocaleString()} instances`,
          suggestion: 'Consider object pooling or lazy initialization for high-count types',
        });
      }
    }

    return recommendations.slice(0, this._maxRecommendations);
  }

  /**
   * Formats bytes to human readable string.
   */
  private formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }

  // ============ Utility Methods ============

  /**
   * Gets total snapshots count.
   */
  getSnapshotCount(): number {
    return this._snapshots.length;
  }

  /**
   * Gets peak memory.
   */
  getPeakMemory(): number {
    return this._peakMemory;
  }

  /**
   * Gets uptime.
   */
  getUptime(): number {
    return Date.now() - this._startTime.getTime();
  }

  /**
   * Clears all recorded data.
   */
  clear(): void {
    this._snapshots.length = 0;
    this._objectCounts.clear();
    this._peakMemory = 0;
    this._startTime = new Date();
  }

  /**
   * Gets all snapshots.
   */
  getSnapshots(): MemorySnapshot[] {
    return [...this._snapshots];
  }

  /**
   * Gets current configuration.
   */
  getConfig(): MemoryAnalyzerConfig {
    return {
      highMemoryThresholdBytes: this._highMemoryThreshold,
      growthThresholdPercent: this._growthThresholdPercent,
      maxSnapshots: this._maxSnapshots,
      maxRecommendations: this._maxRecommendations,
    };
  }
}

/**
 * Memory usage interface.
 */
export interface MemoryUsage {
  heapUsed: number;
  heapTotal: number;
  external: number;
  rss: number;
  arrayBuffers: number;
}
