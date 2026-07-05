/**
 * Optimization Services
 *
 * Exports all optimization service implementations.
 */

export { OptimizationService } from './OptimizationService';
export type {
  OptimizationServiceConfig,
  OptimizationSummary,
  ProfileSummary,
  PerformanceSummary,
} from './OptimizationService';

export { PerformanceAnalyzer } from './PerformanceAnalyzer';
export type {
  TimingResult,
  ExecutionTimeStats,
  MemoryStats,
  CpuStats,
  RepositoryTimingStats,
  QueryTimingInfo,
  OperationTimingStats,
  CacheTimingStats,
  AggregatedStats,
} from './PerformanceAnalyzer';

export { DatabaseOptimizationAnalyzer } from './DatabaseOptimizationAnalyzer';
export type {
  DatabaseQuery,
  SlowQueryInfo,
  DuplicateQueryPattern,
  RepositoryCallStats,
  TableAccessStats,
  DatabaseRecommendation,
  DatabaseAnalysisResult,
  DatabaseAnalyzerConfig,
} from './DatabaseOptimizationAnalyzer';

export { CacheOptimizationAnalyzer } from './CacheOptimizationAnalyzer';
export type {
  CacheEntryInfo,
  CacheAccessRecord,
  RegionCacheStats,
  CacheLifetimeStats,
  CacheRecommendation,
  CacheAnalysisResult,
  CacheAnalyzerConfig,
} from './CacheOptimizationAnalyzer';

export { MemoryAnalyzer } from './MemoryAnalyzer';
export type {
  MemorySnapshot,
  ObjectCountInfo,
  MemoryGrowthInfo,
  MemoryUsageStats,
  SnapshotComparison,
  MemoryRecommendation,
  MemoryAnalysisResult,
  MemoryAnalyzerConfig,
  MemoryUsage,
} from './MemoryAnalyzer';

export { OptimizationFailureHandler, RecoveryStrategy } from './OptimizationFailureHandler';
export type {
  FailureContext,
  RecoveryResult,
  FailureHandlerConfig,
} from './OptimizationFailureHandler';
