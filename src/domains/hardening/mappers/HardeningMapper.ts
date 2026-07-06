/**
 * HardeningMapper
 *
 * Maps between HardeningRule entity and DTOs.
 * No database logic - pure transformation only.
 */

import type { HardeningRule, HardeningRuleRecord } from '../entities/HardeningRule';
import type {
  HardeningRuleDto,
  HardeningRuleResponseDto,
  HardeningRuleListResponseDto,
} from '../dto/HardeningRule.dto';
import type { HardeningStatistics } from '../types/HardeningMetadata';
import type { HardeningOverviewResponseDto } from '../dto/HardeningResponse.dto';

/**
 * Mapper for converting between HardeningRule entity and DTOs.
 */
export class HardeningMapper {
  /**
   * Converts a HardeningRule entity to HardeningRuleDto.
   */
  public static toDto(rule: HardeningRule): HardeningRuleDto {
    return {
      ruleId: rule.ruleId.value,
      name: rule.name,
      status: rule.status,
      priority: rule.priority,
      description: rule.description,
      metadata: rule.metadata,
      createdAt: rule.createdAt.toISOString(),
      updatedAt: rule.updatedAt.toISOString(),
    };
  }

  /**
   * Converts a HardeningRule entity to HardeningRuleResponseDto.
   */
  public static toResponse(rule: HardeningRule): HardeningRuleResponseDto {
    return {
      rule: this.toDto(rule),
    };
  }

  /**
   * Converts a HardeningRule entity to a database record format.
   */
  public static toRecord(rule: HardeningRule): HardeningRuleRecord {
    return rule.toRecord();
  }

  /**
   * Converts a database record to HardeningRuleDto.
   */
  public static fromRecordToDto(record: HardeningRuleRecord): HardeningRuleDto {
    return {
      ruleId: record.ruleId,
      name: record.name,
      status: record.status,
      priority: record.priority,
      description: record.description,
      metadata: record.metadata,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  /**
   * Converts an array of HardeningRule entities to HardeningRuleListResponseDto.
   */
  public static toListResponse(
    rules: HardeningRule[],
    total: number,
    page: number,
    pageSize: number
  ): HardeningRuleListResponseDto {
    return {
      rules: rules.map((rule) => this.toDto(rule)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Converts HardeningRule and statistics to HardeningOverviewResponseDto.
   */
  public static toOverviewResponse(
    rules: HardeningRule[],
    statistics: HardeningStatistics
  ): HardeningOverviewResponseDto {
    return {
      statistics,
      recentRules: rules.slice(0, 10).map((rule) => this.toDto(rule)),
      recentChecklists: [],
      recentSnapshots: [],
    };
  }
}
