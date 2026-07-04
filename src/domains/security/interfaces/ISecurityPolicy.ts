/**
 * Security Policy Interface
 *
 * Interface defining the contract for SecurityPolicy entity.
 */

import type { PolicyId } from '../value-objects/PolicyId';
import type { PolicyType } from '../types/PolicyType';
import type { PolicyMetadata } from '../types/SecurityMetadata';

/**
 * Security policy entity interface.
 */
export interface ISecurityPolicy {
  /** Unique policy identifier */
  readonly policyId: PolicyId;

  /** Policy name */
  readonly policyName: string;

  /** Policy type */
  readonly policyType: PolicyType;

  /** Whether the policy is enabled */
  readonly enabled: boolean;

  /** Policy configuration */
  readonly configuration: Record<string, unknown>;

  /** Additional metadata */
  readonly metadata: PolicyMetadata;

  /**
   * Serializes the policy to a plain object.
   */
  toJSON(): SecurityPolicyJSON;
}

/**
 * JSON serialization representation.
 */
export interface SecurityPolicyJSON {
  policyId: string;
  policyName: string;
  policyType: PolicyType;
  enabled: boolean;
  configuration: Record<string, unknown>;
  metadata: PolicyMetadata;
}
