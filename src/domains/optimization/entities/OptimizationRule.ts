/**
 * OptimizationRule Entity
 *
 * Domain entity representing an optimization rule configuration.
 * This entity ONLY stores rule data - it never modifies gameplay.
 *
 * OptimizationRule Entity Responsibilities:
 * - Store rule configuration
 * - Track rule enable/disable state
 * - Provide immutable rule record
 *
 * OptimizationRule Entity is NOT:
 * - A rule evaluator
 * - A threshold monitor
 * - An alert generator
 */

import type { IOptimizationRule } from '../interfaces/IOptimizationRule';
import { RuleId } from '../value-objects/RuleId';
import { OptimizationLevel } from '../types/OptimizationLevel';
import { OptimizationMetadata, INITIAL_OPTIMIZATION_METADATA } from '../types/OptimizationMetadata';

/**
 * OptimizationRule entity class.
 * Immutable domain entity representing an optimization rule.
 */
export class OptimizationRule implements IOptimizationRule {
  /** Unique rule identifier */
  public readonly ruleId: RuleId;

  /** Rule name */
  public readonly ruleName: string;

  /** Whether the rule is enabled */
  public readonly enabled: boolean;

  /** Rule priority */
  public readonly priority: number;

  /** Rule description */
  public readonly description: string;

  /** Rule metadata */
  public readonly metadata: OptimizationMetadata;

  /**
   * Creates a new OptimizationRule instance.
   * @param props OptimizationRule properties
   */
  constructor(props: OptimizationRuleProps) {
    this.ruleId = props.ruleId;
    this.ruleName = props.ruleName;
    this.enabled = props.enabled;
    this.priority = props.priority;
    this.description = props.description;
    this.metadata = props.metadata ?? { ...INITIAL_OPTIMIZATION_METADATA };
  }

  /**
   * Creates a new OptimizationRule for recording.
   * Factory method for new rule creation.
   */
  public static create(params: {
    ruleId: RuleId;
    ruleName: string;
    enabled: boolean;
    priority: number;
    description: string;
    metadata?: OptimizationMetadata;
  }): OptimizationRule {
    return new OptimizationRule({
      ruleId: params.ruleId,
      ruleName: params.ruleName,
      enabled: params.enabled,
      priority: params.priority,
      description: params.description,
      metadata: params.metadata ?? { ...INITIAL_OPTIMIZATION_METADATA },
    });
  }

  /**
   * Creates an OptimizationRule from a database record.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: OptimizationRuleRecord): OptimizationRule {
    return new OptimizationRule({
      ruleId: RuleId.reconstruct(record.rule_id),
      ruleName: record.rule_name,
      enabled: record.enabled,
      priority: record.priority,
      description: record.description,
      metadata: record.metadata ?? { ...INITIAL_OPTIMIZATION_METADATA },
    });
  }

  /**
   * Creates a new OptimizationRule with updated enabled state.
   */
  public withEnabled(enabled: boolean): OptimizationRule {
    return new OptimizationRule({
      ruleId: this.ruleId,
      ruleName: this.ruleName,
      enabled,
      priority: this.priority,
      description: this.description,
      metadata: this.metadata,
    });
  }

  /**
   * Serializes the OptimizationRule to a plain object.
   */
  public toJSON(): OptimizationRuleJSON {
    return {
      ruleId: this.ruleId.value,
      ruleName: this.ruleName,
      enabled: this.enabled,
      priority: this.priority,
      description: this.description,
      metadata: this.metadata,
    };
  }
}

/**
 * OptimizationRule properties interface for constructor.
 */
export interface OptimizationRuleProps {
  ruleId: RuleId;
  ruleName: string;
  enabled: boolean;
  priority: number;
  description: string;
  metadata?: OptimizationMetadata;
}

/**
 * Database record representation of OptimizationRule.
 */
export interface OptimizationRuleRecord {
  rule_id: string;
  rule_name: string;
  enabled: boolean;
  priority: number;
  description: string;
  metadata?: OptimizationMetadata;
}

/**
 * JSON serialization representation of OptimizationRule.
 */
export interface OptimizationRuleJSON {
  ruleId: string;
  ruleName: string;
  enabled: boolean;
  priority: number;
  description: string;
  metadata: OptimizationMetadata;
}
