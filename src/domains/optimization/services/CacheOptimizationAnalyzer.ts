/**
 * Cache Optimization Analyzer
 *
 * Analyzes cache performance patterns including:
 * - Hit ratio analysis
 * - Miss ratio analysis
 * - Cache lifetime statistics
 * - Region statistics
 *
 * IMPORTANT: This is analysis ONLY. Never modifies cache behavior automatically.
 */

import { createLogger } from '../../../core/logging/logger.service';

const logger = createLogger('CacheOptimizationAnalyzer');

/**
 * Cache entry information.
 */
export interface CacheEntryInfo {
  key: string;
  region: string;
  createdAt: Date;
  expiresAt: Date | null;
  sizeBytes: number;
  hitCount: number;
  lastAccessedAt: Date;
}

/**
 * Cache hit/miss record.
 */
export interface CacheAccessRecord {
  key: string;
  region: string;
  hit: boolean;
  responseTimeMs: number;
  timestamp: Date;
}

/**
 * Region statistics.
 */
export interface RegionCacheStats {
  regionName: string;
  hitCount: number;
  missCount: number;
  hitRatio: number;
  missRatio: number;
  totalAccesses: number;
  totalResponseTime: number;
  averageResponseTime: number;
  uniqueKeys: number;
  entryCount: number;
}

/**
 * Cache lifetime statistics.
 */
export interface CacheLifetimeStats {
  averageLifetime: number;
  minLifetime: number;
  maxLifetime: number;
  medianLifetime: number;
  expiredCount: number;
  activeCount: number;
  ttlDistribution: Record<string, number>;
}

/**
 * Cache recommendation.
 */
export interface CacheRecommendation {
  type: 'LOW_HIT_RATIO' | 'HIGH_MISS_RATE' | 'SHORT_TTL' | 'LARGE_REGION' | 'CACHE_STAMPEDE' | 'COLD_START';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  regionName?: string;
  suggestion: string;
  estimatedImpact?: string;
}

/**
 * Cache analysis result.
 */
export interface CacheAnalysisResult {
  totalHits: number;
  totalMisses: number;
  hitRatio: number;
  missRatio: number;
  averageHitTime: number;
  averageMissTime: number;
  regionStats: RegionCacheStats[];
  lifetimeStats: CacheLifetimeStats;
  recommendations: CacheRecommendation[];
  analyzedAt: Date;
}

/**
 * Analyzer configuration.
 */
export interface CacheAnalyzerConfig {
  hitRatioThreshold?: number;
  missRatioThreshold?: number;
  slowAccessThresholdMs?: number;
  maxRecommendations?: number;
}

/**
 * Cache optimization analyzer for analyzing cache performance patterns.
 */
export class CacheOptimizationAnalyzer {
  private readonly _accessRecords: CacheAccessRecord[] = [];
  private readonly _entries: Map<string, CacheEntryInfo> = new Map();
  private readonly _hitRatioThreshold: number;
  private readonly _missRatioThreshold: number;
  private readonly _slowAccessThresholdMs: number;
  private readonly _maxRecommendations: number;
  private readonly _maxRecords: number;

  constructor(config?: CacheAnalyzerConfig) {
    this._hitRatioThreshold = config?.hitRatioThreshold ?? 0.8;
    this._missRatioThreshold = config?.missRatioThreshold ?? 0.3;
    this._slowAccessThresholdMs = config?.slowAccessThresholdMs ?? 50;
    this._maxRecommendations = config?.maxRecommendations ?? 20;
    this._maxRecords = 10000;
  }

  // ============ Recording Methods ============

  /**
   * Records a cache hit.
   */
  recordHit(key: string, region: string, responseTimeMs?: number): void {
    this._accessRecords.push({
      key,
      region,
      hit: true,
      responseTimeMs: responseTimeMs ?? 0,
      timestamp: new Date(),
    });
    this.trimRecords();

    const entry = this._entries.get(key);
    if (entry) {
      entry.hitCount++;
      entry.lastAccessedAt = new Date();
    }
  }

  /**
   * Records a cache miss.
   */
  recordMiss(key: string, region: string, responseTimeMs?: number): void {
    this._accessRecords.push({
      key,
      region,
      hit: false,
      responseTimeMs: responseTimeMs ?? 0,
      timestamp: new Date(),
    });
    this.trimRecords();
  }

  /**
   * Registers a cache entry.
   */
  registerEntry(entry: Omit<CacheEntryInfo, 'hitCount' | 'lastAccessedAt'>): void {
    this._entries.set(entry.key, {
      ...entry,
      hitCount: 0,
      lastAccessedAt: new Date(),
    });
  }

  /**
   * Removes a cache entry.
   */
  removeEntry(key: string): void {
    this._entries.delete(key);
  }

  /**
   * Records cache operation timing.
   */
  recordAccess(
    key: string,
    region: string,
    hit: boolean,
    responseTimeMs: number
  ): void {
    this._accessRecords.push({
      key,
      region,
      hit,
      responseTimeMs,
      timestamp: new Date(),
    });
    this.trimRecords();
  }

  // ============ Analysis Methods ============

  /**
   * Performs full cache optimization analysis.
   */
  analyze(): CacheAnalysisResult {
    const totalHits = this.getTotalHits();
    const totalMisses = this.getTotalMisses();
    const total = totalHits + totalMisses;

    const hitRatio = total > 0 ? totalHits / total : 0;
    const missRatio = total > 0 ? totalMisses / total : 0;

    const regionStats = this.calculateRegionStats();
    const lifetimeStats = this.calculateLifetimeStats();
    const recommendations = this.generateRecommendations(hitRatio, missRatio, regionStats, lifetimeStats);

    const hitTimes = this._accessRecords.filter((r) => r.hit).map((r) => r.responseTimeMs);
    const missTimes = this._accessRecords.filter((r) => !r.hit).map((r) => r.responseTimeMs);

    const avgHitTime = hitTimes.length > 0
      ? hitTimes.reduce((a, b) => a + b, 0) / hitTimes.length
      : 0;

    const avgMissTime = missTimes.length > 0
      ? missTimes.reduce((a, b) => a + b, 0) / missTimes.length
      : 0;

    return {
      totalHits,
      totalMisses,
      hitRatio,
      missRatio,
      averageHitTime: avgHitTime,
      averageMissTime: avgMissTime,
      regionStats,
      lifetimeStats,
      recommendations,
      analyzedAt: new Date(),
    };
  }

  /**
   * Gets total hit count.
   */
  getTotalHits(): number {
    return this._accessRecords.filter((r) => r.hit).length;
  }

  /**
   * Gets total miss count.
   */
  getTotalMisses(): number {
    return this._accessRecords.filter((r) => !r.hit).length;
  }

  /**
   * Gets hit ratio.
   */
  getHitRatio(): number {
    const total = this._accessRecords.length;
    if (total === 0) return 0;
    return this.getTotalHits() / total;
  }

  /**
   * Gets miss ratio.
   */
  getMissRatio(): number {
    const total = this._accessRecords.length;
    if (total === 0) return 0;
    return this.getTotalMisses() / total;
  }

  /**
   * Calculates region statistics.
   */
  calculateRegionStats(): RegionCacheStats[] {
    const regions = new Map<string, CacheAccessRecord[]>();

    for (const record of this._accessRecords) {
      const existing = regions.get(record.region) || [];
      existing.push(record);
      regions.set(record.region, existing);
    }

    const stats: RegionCacheStats[] = [];

    for (const [regionName, records] of regions) {
      const hits = records.filter((r) => r.hit).length;
      const misses = records.filter((r) => !r.hit).length;
      const total = records.length;
      const totalResponseTime = records.reduce((sum, r) => sum + r.responseTimeMs, 0);

      const regionEntries = Array.from(this._entries.values()).filter((e) => e.region === regionName);
      const uniqueKeys = new Set(records.map((r) => r.key)).size;

      stats.push({
        regionName,
        hitCount: hits,
        missCount: misses,
        hitRatio: total > 0 ? hits / total : 0,
        missRatio: total > 0 ? misses / total : 0,
        totalAccesses: total,
        totalResponseTime,
        averageResponseTime: total > 0 ? totalResponseTime / total : 0,
        uniqueKeys,
        entryCount: regionEntries.length,
      });
    }

    return stats.sort((a, b) => b.totalAccesses - a.totalAccesses);
  }

  /**
   * Calculates cache lifetime statistics.
   */
  calculateLifetimeStats(): CacheLifetimeStats {
    const now = new Date();
    const lifetimes: number[] = [];
    const ttlDistribution: Record<string, number> = {};
    let expiredCount = 0;
    let activeCount = 0;

    for (const entry of this._entries.values()) {
      const lifetime = entry.expiresAt
        ? Math.max(0, entry.expiresAt.getTime() - entry.createdAt.getTime())
        : now.getTime() - entry.createdAt.getTime();

      if (entry.expiresAt && entry.expiresAt < now) {
        expiredCount++;
      } else {
        activeCount++;
        lifetimes.push(lifetime);
      }

      const ttlBucket = this.getTtlBucket(lifetime);
      ttlDistribution[ttlBucket] = (ttlDistribution[ttlBucket] || 0) + 1;
    }

    if (lifetimes.length === 0) {
      return {
        averageLifetime: 0,
        minLifetime: 0,
        maxLifetime: 0,
        medianLifetime: 0,
        expiredCount,
        activeCount,
        ttlDistribution,
      };
    }

    const sorted = [...lifetimes].sort((a, b) => a - b);
    return {
      averageLifetime: lifetimes.reduce((a, b) => a + b, 0) / lifetimes.length,
      minLifetime: sorted[0],
      maxLifetime: sorted[sorted.length - 1],
      medianLifetime: sorted[Math.floor(sorted.length / 2)],
      expiredCount,
      activeCount,
      ttlDistribution,
    };
  }

  // ============ Recommendation Methods ============

  /**
   * Generates optimization recommendations based on analysis.
   */
  generateRecommendations(
    hitRatio: number,
    missRatio: number,
    regionStats: RegionCacheStats[],
    lifetimeStats: CacheLifetimeStats
  ): CacheRecommendation[] {
    const recommendations: CacheRecommendation[] = [];

    // Low hit ratio recommendation
    if (hitRatio < this._hitRatioThreshold) {
      recommendations.push({
        type: 'LOW_HIT_RATIO',
        severity: hitRatio < 0.5 ? 'HIGH' : 'MEDIUM',
        description: `Cache hit ratio is ${(hitRatio * 100).toFixed(1)}%, below threshold of ${(this._hitRatioThreshold * 100).toFixed(1)}%`,
        suggestion: 'Consider implementing cache warming, improving cache key strategy, or increasing cache TTL',
        estimatedImpact: `${Math.max(0, (this._hitRatioThreshold - hitRatio) * 100).toFixed(1)}% potential improvement`,
      });
    }

    // High miss ratio recommendation
    if (missRatio > this._missRatioThreshold) {
      recommendations.push({
        type: 'HIGH_MISS_RATE',
        severity: missRatio > 0.5 ? 'HIGH' : 'MEDIUM',
        description: `Cache miss ratio is ${(missRatio * 100).toFixed(1)}%, above threshold of ${(this._missRatioThreshold * 100).toFixed(1)}%`,
        suggestion: 'Review cache key strategy and consider implementing cache-aside pattern with fallback',
        estimatedImpact: `${Math.max(0, (missRatio - this._missRatioThreshold) * 100).toFixed(1)}% potential reduction`,
      });
    }

    // Region-specific recommendations
    for (const region of regionStats) {
      if (region.hitRatio < 0.6 && region.totalAccesses > 100) {
        recommendations.push({
          type: 'LOW_HIT_RATIO',
          severity: 'MEDIUM',
          description: `Region '${region.regionName}' has ${(region.hitRatio * 100).toFixed(1)}% hit ratio with ${region.totalAccesses} accesses`,
          regionName: region.regionName,
          suggestion: 'Consider region-specific TTL adjustment or cache preloading',
        });
      }

      if (region.averageResponseTime > this._slowAccessThresholdMs) {
        recommendations.push({
          type: 'COLD_START',
          severity: 'LOW',
          description: `Region '${region.regionName}' has slow average response time of ${region.averageResponseTime.toFixed(2)}ms`,
          regionName: region.regionName,
          suggestion: 'Consider implementing cache preloading or reducing serialized data size',
        });
      }
    }

    // Short TTL recommendation
    if (lifetimeStats.activeCount > 0 && lifetimeStats.averageLifetime < 60000) {
      recommendations.push({
        type: 'SHORT_TTL',
        severity: 'LOW',
        description: `Average cache lifetime is ${(lifetimeStats.averageLifetime / 1000).toFixed(1)}s, which may cause cache thrashing`,
        suggestion: 'Consider increasing TTL for stable data patterns',
      });
    }

    // Large region recommendation
    for (const region of regionStats) {
      if (region.entryCount > 1000) {
        recommendations.push({
          type: 'LARGE_REGION',
          severity: 'LOW',
          description: `Region '${region.regionName}' contains ${region.entryCount} entries`,
          regionName: region.regionName,
          suggestion: 'Consider splitting large regions or implementing region eviction policies',
        });
      }
    }

    return recommendations.slice(0, this._maxRecommendations);
  }

  /**
   * Gets TTL bucket for distribution analysis.
   */
  private getTtlBucket(ttlMs: number): string {
    if (ttlMs < 60000) return '<1min';
    if (ttlMs < 300000) return '1-5min';
    if (ttlMs < 900000) return '5-15min';
    if (ttlMs < 3600000) return '15-60min';
    return '>1hour';
  }

  // ============ Utility Methods ============

  /**
   * Trims access records to max size.
   */
  private trimRecords(): void {
    if (this._accessRecords.length > this._maxRecords) {
      this._accessRecords.splice(0, this._accessRecords.length - this._maxRecords);
    }
  }

  /**
   * Gets cache entry information.
   */
  getEntry(key: string): CacheEntryInfo | undefined {
    return this._entries.get(key);
  }

  /**
   * Gets all entries for a region.
   */
  getEntriesByRegion(region: string): CacheEntryInfo[] {
    return Array.from(this._entries.values()).filter((e) => e.region === region);
  }

  /**
   * Clears all recorded data.
   */
  clear(): void {
    this._accessRecords.length = 0;
    this._entries.clear();
  }

  /**
   * Gets total access count.
   */
  getTotalAccessCount(): number {
    return this._accessRecords.length;
  }

  /**
   * Gets unique key count.
   */
  getUniqueKeyCount(): number {
    return this._entries.size;
  }

  /**
   * Gets current configuration.
   */
  getConfig(): CacheAnalyzerConfig {
    return {
      hitRatioThreshold: this._hitRatioThreshold,
      missRatioThreshold: this._missRatioThreshold,
      slowAccessThresholdMs: this._slowAccessThresholdMs,
      maxRecommendations: this._maxRecommendations,
    };
  }
}
