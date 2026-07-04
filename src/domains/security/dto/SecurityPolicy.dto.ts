/**
 * Security Policy DTO
 *
 * Data Transfer Object for security policy requests and responses.
 */

import type { PolicyType } from '../types/PolicyType';
import type { PolicyMetadata } from '../types/SecurityMetadata';

/**
 * DTO for creating a new security policy.
 */
export interface CreateSecurityPolicyDto {
  /** Policy name */
  policyName: string;

  /** Policy type */
  policyType: PolicyType;

  /** Whether the policy is enabled */
  enabled?: boolean;

  /** Policy configuration */
  configuration?: Record<string, unknown>;

  /** Metadata */
  metadata?: PolicyMetadata;
}

/**
 * DTO for updating a security policy.
 */
export interface UpdateSecurityPolicyDto {
  /** Policy name */
  policyName?: string;

  /** Whether the policy is enabled */
  enabled?: boolean;

  /** Policy configuration */
  configuration?: Record<string, unknown>;

  /** Metadata */
  metadata?: PolicyMetadata;
}

/**
 * DTO for security policy response.
 */
export interface SecurityPolicyResponseDto {
  /** Policy ID */
  policyId: string;

  /** Policy name */
  policyName: string;

  /** Policy type */
  policyType: PolicyType;

  /** Whether the policy is enabled */
  enabled: boolean;

  /** Policy configuration */
  configuration: Record<string, unknown>;

  /** Metadata */
  metadata: PolicyMetadata;
}
