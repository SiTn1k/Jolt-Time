/**
 * Rule Mapper
 *
 * Maps between OptimizationRule entity and various DTOs.
 * No database logic - pure transformation only.
 */

import type { OptimizationRule, OptimizationRuleRecord } from '../entities/OptimizationRule';
import type { CreateOptimizationRuleDto, UpdateOptimizationRuleDto, OptimizationRuleResponseDto } from '../dto/OptimizationRule.dto';

/**
 * Mapper for converting between OptimizationRule entity and DTOs.
 */
export class RuleMapper {
  /**
   * Converts an OptimizationRule entity to OptimizationRuleResponseDto.
   */
  public static toResponse(rule: OptimizationRule): OptimizationRuleResponseDto {
    return {
      ruleId: rule.ruleId.value,
      ruleName: rule.ruleName,
      enabled: rule.enabled,
      priority: rule.priority,
      description: rule.description,
      metadata: rule.metadata,
    };
  }

  /**
   * Converts an array of OptimizationRule entities to OptimizationRuleResponseDto array.
   */
  public static toResponseList(rules: OptimizationRule[]): OptimizationRuleResponseDto[] {
    return rules.map((rule) => this.toResponse(rule));
  }

  /**
   * Converts a CreateOptimizationRuleDto to entity input.
   * Note: This creates input for entity creation, not the entity itself.
   */
  public static fromCreateDto(dto: CreateOptimizationRuleDto): Omit<CreateOptimizationRuleDto, never> {
    return {
      ruleName: dto.ruleName,
      enabled: dto.enabled,
      priority: dto.priority,
      description: dto.description,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts an UpdateOptimizationRuleDto to partial entity input.
   */
  public static fromUpdateDto(dto: UpdateOptimizationRuleDto): Partial<CreateOptimizationRuleDto> {
    return {
      enabled: dto.enabled,
      priority: dto.priority,
      description: dto.description,
      metadata: dto.metadata,
    };
  }

  /**
   * Converts a database record to CreateOptimizationRuleDto format.
   */
  public static fromRecordToDto(record: OptimizationRuleRecord): CreateOptimizationRuleDto {
    return {
      ruleName: record.rule_name,
      enabled: record.enabled,
      priority: record.priority,
      description: record.description,
      metadata: record.metadata,
    };
  }

  /**
   * Converts an OptimizationRule entity to a database record format.
   * Note: This is for mapping TO record format, not actual database operations.
   */
  public static toRecord(rule: OptimizationRule): Omit<OptimizationRuleRecord, never> {
    return {
      rule_id: rule.ruleId.value,
      rule_name: rule.ruleName,
      enabled: rule.enabled,
      priority: rule.priority,
      description: rule.description,
      metadata: rule.metadata,
    };
  }
}
