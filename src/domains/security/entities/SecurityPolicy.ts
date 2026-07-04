/**
 * SecurityPolicy Entity
 *
 * Domain entity representing a security policy.
 * This entity ONLY stores policy records - it never enforces rules.
 *
 * SecurityPolicy Entity Responsibilities:
 * - Store security policy configuration
 * - Track policy enabled/disabled state
 * - Record policy metadata
 *
 * SecurityPolicy Entity is NOT:
 * - A rule enforcer
 * - An access controller
 * - A gameplay modifier
 */

import type { ISecurityPolicy } from '../interfaces/ISecurityPolicy';
import { PolicyId } from '../value-objects/PolicyId';
import type { PolicyType } from '../types/PolicyType';
import type { PolicyMetadata } from '../types/SecurityMetadata';

/**
 * SecurityPolicy entity class.
 * Immutable domain entity representing a security policy.
 */
export class SecurityPolicy implements ISecurityPolicy {
  /** Unique policy identifier */
  public readonly policyId: PolicyId;

  /** Policy name */
  public readonly policyName: string;

  /** Policy type */
  public readonly policyType: PolicyType;

  /** Whether the policy is enabled */
  public readonly enabled: boolean;

  /** Policy configuration */
  public readonly configuration: Record<string, unknown>;

  /** Additional metadata */
  public readonly metadata: PolicyMetadata;

  /**
   * Creates a new SecurityPolicy instance.
   * @param props SecurityPolicy properties
   */
  constructor(props: SecurityPolicyProps) {
    this.policyId = props.policyId;
    this.policyName = props.policyName;
    this.policyType = props.policyType;
    this.enabled = props.enabled;
    this.configuration = props.configuration ?? {};
    this.metadata = props.metadata ?? {};
  }

  /**
   * Creates a new SecurityPolicy for storing.
   * Factory method for new policy creation.
   */
  public static create(params: {
    policyId?: PolicyId;
    policyName: string;
    policyType: PolicyType;
    enabled?: boolean;
    configuration?: Record<string, unknown>;
    metadata?: PolicyMetadata;
  }): SecurityPolicy {
    return new SecurityPolicy({
      policyId: params.policyId ?? PolicyId.generate(),
      policyName: params.policyName,
      policyType: params.policyType,
      enabled: params.enabled ?? true,
      configuration: params.configuration ?? {},
      metadata: params.metadata ?? {},
    });
  }

  /**
   * Creates a SecurityPolicy from a database record.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: SecurityPolicyRecord): SecurityPolicy {
    return new SecurityPolicy({
      policyId: PolicyId.reconstruct(record.policy_id),
      policyName: record.policy_name,
      policyType: record.policy_type as PolicyType,
      enabled: record.enabled,
      configuration: record.configuration ?? {},
      metadata: record.metadata ?? {},
    });
  }

  /**
   * Serializes the SecurityPolicy to a plain object.
   */
  public toJSON(): SecurityPolicyJSON {
    return {
      policyId: this.policyId.value,
      policyName: this.policyName,
      policyType: this.policyType,
      enabled: this.enabled,
      configuration: this.configuration,
      metadata: this.metadata,
    };
  }
}

/**
 * SecurityPolicy properties interface for constructor.
 */
export interface SecurityPolicyProps {
  policyId: PolicyId;
  policyName: string;
  policyType: PolicyType;
  enabled: boolean;
  configuration?: Record<string, unknown>;
  metadata?: PolicyMetadata;
}

/**
 * Database record representation of SecurityPolicy.
 */
export interface SecurityPolicyRecord {
  policy_id: string;
  policy_name: string;
  policy_type: string;
  enabled: boolean;
  configuration?: Record<string, unknown>;
  metadata?: PolicyMetadata;
}

/**
 * JSON serialization representation of SecurityPolicy.
 */
export interface SecurityPolicyJSON {
  policyId: string;
  policyName: string;
  policyType: PolicyType;
  enabled: boolean;
  configuration: Record<string, unknown>;
  metadata: PolicyMetadata;
}
