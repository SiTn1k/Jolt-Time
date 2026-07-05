/**
 * Optimization Rule DTO
 *
 * Data Transfer Object for optimization rule requests.
 */

import type { OptimizationMetadata } from '../types/OptimizationMetadata';

/**
 * DTO for creating a new optimization rule.
 */
export interface CreateOptimizationRuleDto {
  /** Rule name */
  ruleName: string;

  /** Whether the rule is enabled */
  enabled: boolean;

  /** Rule priority */
  priority: number;

  /** Rule description */
  description: string;

  /** Rule metadata */
  metadata?: OptimizationMetadata;
}

/**
 * DTO for updating an optimization rule.
 */
export interface UpdateOptimizationRuleDto {
  /** Whether the rule is enabled */
  enabled?: boolean;

  /** Rule priority */
  priority?: number;

  /** Rule description */
  description?: string;

  /** Rule metadata */
  metadata?: OptimizationMetadata;
}

/**
 * DTO for optimization rule response.
 */
export interface OptimizationRuleResponseDto {
  /** Rule ID */
  ruleId: string;

  /** Rule name */
  ruleName: string;

  /** Whether the rule is enabled */
  enabled: boolean;

  /** Rule priority */
  priority: number;

  /** Rule description */
  description: string;

  /** Rule metadata */
  metadata: OptimizationMetadata;
}
