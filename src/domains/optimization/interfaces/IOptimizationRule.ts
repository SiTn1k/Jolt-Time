/**
 * OptimizationRule Interface
 *
 * Interface defining the contract for OptimizationRule entities.
 */

import type { RuleId } from '../value-objects/RuleId';
import type { OptimizationMetadata } from '../types/OptimizationMetadata';

/**
 * OptimizationRule interface.
 * Defines the contract for optimization rule entities.
 */
export interface IOptimizationRule {
  /** Unique rule identifier */
  readonly ruleId: RuleId;

  /** Rule name */
  readonly ruleName: string;

  /** Whether the rule is enabled */
  readonly enabled: boolean;

  /** Rule priority */
  readonly priority: number;

  /** Rule description */
  readonly description: string;

  /** Rule metadata */
  readonly metadata: OptimizationMetadata;
}
