/**
 * HardeningRule Entity
 *
 * Domain entity representing a production hardening rule.
 */

import type { IHardeningRule } from '../interfaces/IHardeningRule';
import { RuleId } from '../value-objects/RuleId';
import { HardeningStatus } from '../types/HardeningStatus';
import { RulePriority } from '../types/RulePriority';
import type { RuleMetadata } from '../types/HardeningMetadata';

/**
 * HardeningRule entity props for constructor.
 */
export interface HardeningRuleProps {
  ruleId: RuleId;
  name: string;
  status: HardeningStatus;
  priority: RulePriority;
  description: string;
  metadata: RuleMetadata;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Database record representation of HardeningRule.
 */
export interface HardeningRuleRecord {
  ruleId: string;
  name: string;
  status: HardeningStatus;
  priority: RulePriority;
  description: string;
  metadata: RuleMetadata;
  createdAt: string;
  updatedAt: string;
}

/**
 * JSON serialization representation of HardeningRule.
 */
export interface HardeningRuleJSON {
  ruleId: string;
  name: string;
  status: HardeningStatus;
  priority: RulePriority;
  description: string;
  metadata: RuleMetadata;
  createdAt: string;
  updatedAt: string;
}

/**
 * HardeningRule entity class.
 * Immutable domain entity representing a production hardening rule.
 */
export class HardeningRule implements IHardeningRule {
  public readonly ruleId: RuleId;
  public readonly name: string;
  public readonly status: HardeningStatus;
  public readonly priority: RulePriority;
  public readonly description: string;
  public readonly metadata: RuleMetadata;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  /**
   * Creates a new HardeningRule instance.
   */
  constructor(props: HardeningRuleProps) {
    this.ruleId = props.ruleId;
    this.name = props.name;
    this.status = props.status;
    this.priority = props.priority;
    this.description = props.description;
    this.metadata = props.metadata;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Creates a new HardeningRule entity.
   */
  public static create(params: {
    ruleId?: RuleId;
    name: string;
    status?: HardeningStatus;
    priority?: RulePriority;
    description?: string;
    metadata?: RuleMetadata;
  }): HardeningRule {
    const now = new Date();
    return new HardeningRule({
      ruleId: params.ruleId ?? RuleId.create(),
      name: params.name,
      status: params.status ?? HardeningStatus.PENDING,
      priority: params.priority ?? RulePriority.MEDIUM,
      description: params.description ?? '',
      metadata: params.metadata ?? { category: 'general', tags: [], owner: '' },
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Reconstructs a HardeningRule from stored data.
   */
  public static fromStorage(record: HardeningRuleRecord): HardeningRule {
    return new HardeningRule({
      ruleId: RuleId.reconstruct(record.ruleId),
      name: record.name,
      status: record.status,
      priority: record.priority,
      description: record.description,
      metadata: record.metadata,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
    });
  }

  /**
   * Checks if the rule is active.
   */
  public get isActive(): boolean {
    return this.status === HardeningStatus.ACTIVE;
  }

  /**
   * Checks if the rule is pending.
   */
  public get isPending(): boolean {
    return this.status === HardeningStatus.PENDING;
  }

  /**
   * Checks if the rule is in progress.
   */
  public get isInProgress(): boolean {
    return this.status === HardeningStatus.IN_PROGRESS;
  }

  /**
   * Checks if the rule is in a terminal state.
   */
  public get isTerminal(): boolean {
    return this.status === HardeningStatus.DEPRECATED || this.status === HardeningStatus.DISABLED;
  }

  /**
   * Checks if this is a high priority rule.
   */
  public get isHighPriority(): boolean {
    return this.priority === RulePriority.CRITICAL || this.priority === RulePriority.HIGH;
  }

  /**
   * Creates a copy with updated fields.
   */
  public copyWith(
    params: Partial<Omit<HardeningRuleProps, 'ruleId' | 'createdAt'>>
  ): HardeningRule {
    return new HardeningRule({
      ruleId: this.ruleId,
      name: params.name ?? this.name,
      status: params.status ?? this.status,
      priority: params.priority ?? this.priority,
      description: params.description ?? this.description,
      metadata: params.metadata ?? this.metadata,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }

  /**
   * Creates a copy marked as active.
   */
  public markActive(): HardeningRule {
    return this.copyWith({
      status: HardeningStatus.ACTIVE,
    });
  }

  /**
   * Creates a copy marked as in progress.
   */
  public markInProgress(): HardeningRule {
    return this.copyWith({
      status: HardeningStatus.IN_PROGRESS,
    });
  }

  /**
   * Creates a copy marked as disabled.
   */
  public markDisabled(): HardeningRule {
    return this.copyWith({
      status: HardeningStatus.DISABLED,
    });
  }

  /**
   * Creates a copy marked as deprecated.
   */
  public markDeprecated(): HardeningRule {
    return this.copyWith({
      status: HardeningStatus.DEPRECATED,
    });
  }

  /**
   * Serializes the HardeningRule to a plain object.
   */
  public toJSON(): HardeningRuleJSON {
    return {
      ruleId: this.ruleId.value,
      name: this.name,
      status: this.status,
      priority: this.priority,
      description: this.description,
      metadata: this.metadata,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  /**
   * Converts to database record format.
   */
  public toRecord(): HardeningRuleRecord {
    return {
      ruleId: this.ruleId.value,
      name: this.name,
      status: this.status,
      priority: this.priority,
      description: this.description,
      metadata: this.metadata,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
