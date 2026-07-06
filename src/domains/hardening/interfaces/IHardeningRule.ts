/**
 * IHardeningRule Interface
 *
 * Interface for HardeningRule entity.
 */

import type { RuleId } from '../value-objects/RuleId';
import type { HardeningStatus } from '../types/HardeningStatus';
import type { RulePriority } from '../types/RulePriority';
import type { RuleMetadata } from '../types/HardeningMetadata';

/**
 * Interface for HardeningRule entity.
 * Defines the contract for hardening rule operations.
 */
export interface IHardeningRule {
  /** Unique identifier for the rule */
  readonly ruleId: RuleId;
  /** Name of the rule */
  readonly name: string;
  /** Current status of the rule */
  readonly status: HardeningStatus;
  /** Priority level of the rule */
  readonly priority: RulePriority;
  /** Description of what the rule enforces */
  readonly description: string;
  /** Additional metadata */
  readonly metadata: RuleMetadata;
  /** When the rule was created */
  readonly createdAt: Date;
  /** When the rule was last updated */
  readonly updatedAt: Date;

  /** Checks if the rule is active */
  isActive: boolean;
  /** Checks if the rule is pending */
  isPending: boolean;
  /** Checks if the rule is in progress */
  isInProgress: boolean;
  /** Checks if the rule is in a terminal state */
  isTerminal: boolean;
  /** Checks if this is a high priority rule */
  isHighPriority: boolean;

  /** Creates a copy with updated fields */
  copyWith(params: Partial<Omit<IHardeningRule, 'ruleId' | 'createdAt' | 'isActive' | 'isPending' | 'isInProgress' | 'isTerminal' | 'isHighPriority'>>): IHardeningRule;
  /** Creates a copy marked as active */
  markActive(): IHardeningRule;
  /** Creates a copy marked as in progress */
  markInProgress(): IHardeningRule;
  /** Creates a copy marked as disabled */
  markDisabled(): IHardeningRule;
  /** Creates a copy marked as deprecated */
  markDeprecated(): IHardeningRule;
}
