/**
 * Optimization Mapper
 *
 * Maps between optimization entities and response DTOs.
 * No database logic - pure transformation only.
 */

import type { OptimizationResponseDto, OptimizationSummaryResponseDto } from '../dto/OptimizationResponse.dto';
import type { OptimizationLevel } from '../types/OptimizationLevel';
import type { OptimizationStatistics, INITIAL_OPTIMIZATION_STATISTICS } from '../types/OptimizationStatistics';
import type { OptimizationStatus } from '../types/OptimizationStatus';

/**
 * Mapper for converting between optimization entities and response DTOs.
 */
export class OptimizationMapper {
  /**
   * Creates an OptimizationResponseDto from parameters.
   */
  public static toOptimizationResponse(params: {
    optimizationId: string;
    status: OptimizationStatus;
    level: OptimizationLevel;
    moduleName: string;
    statistics: OptimizationStatistics;
    requestedAt: Date;
    completedAt?: Date;
    recommendations?: string[];
  }): OptimizationResponseDto {
    return {
      optimizationId: params.optimizationId,
      status: params.status,
      level: params.level,
      moduleName: params.moduleName,
      statistics: params.statistics,
      requestedAt: params.requestedAt.toISOString(),
      completedAt: params.completedAt?.toISOString(),
      recommendations: params.recommendations,
    };
  }

  /**
   * Creates an OptimizationSummaryResponseDto from parameters.
   */
  public static toOptimizationSummaryResponse(params: {
    totalProfiles: number;
    totalRules: number;
    totalSnapshots: number;
    averageExecutionTime: number;
    peakExecutionTime: number;
    overallCacheHitRate: number;
    levelDistribution: Record<OptimizationLevel, number>;
    generatedAt: Date;
  }): OptimizationSummaryResponseDto {
    return {
      totalProfiles: params.totalProfiles,
      totalRules: params.totalRules,
      totalSnapshots: params.totalSnapshots,
      averageExecutionTime: params.averageExecutionTime,
      peakExecutionTime: params.peakExecutionTime,
      overallCacheHitRate: params.overallCacheHitRate,
      levelDistribution: params.levelDistribution,
      generatedAt: params.generatedAt.toISOString(),
    };
  }
}
