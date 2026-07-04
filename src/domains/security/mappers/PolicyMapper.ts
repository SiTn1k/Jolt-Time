/**
 * Policy Mapper
 *
 * Maps between SecurityPolicy entity and DTOs.
 * No database logic - pure transformation only.
 */

import type { SecurityPolicy, SecurityPolicyRecord } from '../entities/SecurityPolicy';
import type { SecurityPolicyResponseDto, CreateSecurityPolicyDto, UpdateSecurityPolicyDto } from '../dto/SecurityPolicy.dto';

/**
 * Mapper for converting between SecurityPolicy entity and DTOs.
 */
export class PolicyMapper {
  /**
   * Converts a SecurityPolicy entity to SecurityPolicyResponseDto.
   */
  public static toResponse(policy: SecurityPolicy): SecurityPolicyResponseDto {
    return {
      policyId: policy.policyId.value,
      policyName: policy.policyName,
      policyType: policy.policyType,
      enabled: policy.enabled,
      configuration: policy.configuration,
      metadata: policy.metadata,
    };
  }

  /**
   * Converts an array of SecurityPolicy entities to SecurityPolicyResponseDto array.
   */
  public static toResponseList(policies: SecurityPolicy[]): SecurityPolicyResponseDto[] {
    return policies.map((policy) => this.toResponse(policy));
  }

  /**
   * Converts a CreateSecurityPolicyDto to entity input.
   */
  public static fromCreateDto(dto: CreateSecurityPolicyDto): Omit<CreateSecurityPolicyDto, never> {
    return {
      policyName: dto.policyName,
      policyType: dto.policyType,
      enabled: dto.enabled,
      configuration: dto.configuration,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts a database record to CreateSecurityPolicyDto format.
   */
  public static fromRecordToDto(record: SecurityPolicyRecord): CreateSecurityPolicyDto {
    return {
      policyName: record.policy_name,
      policyType: record.policy_type as CreateSecurityPolicyDto['policyType'],
      enabled: record.enabled,
      configuration: record.configuration,
      metadata: record.metadata,
    };
  }

  /**
   * Converts a SecurityPolicy entity to a database record format.
   */
  public static toRecord(policy: SecurityPolicy): Omit<SecurityPolicyRecord, never> {
    return {
      policy_id: policy.policyId.value,
      policy_name: policy.policyName,
      policy_type: policy.policyType,
      enabled: policy.enabled,
      configuration: policy.configuration,
      metadata: policy.metadata,
    };
  }

  /**
   * Converts an UpdateSecurityPolicyDto to partial entity input.
   */
  public static fromUpdateDto(dto: UpdateSecurityPolicyDto): Partial<SecurityPolicy> {
    return {
      policyName: dto.policyName,
      enabled: dto.enabled,
      configuration: dto.configuration,
      metadata: dto.metadata,
    } as Partial<SecurityPolicy>;
  }
}
