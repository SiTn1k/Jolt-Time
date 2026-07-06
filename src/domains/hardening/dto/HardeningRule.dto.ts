/**
 * HardeningRule DTO
 *
 * Data transfer objects for hardening rule operations.
 */

import type { HardeningStatus } from '../types/HardeningStatus';
import type { RulePriority } from '../types/RulePriority';
import type { RuleMetadata } from '../types/HardeningMetadata';

/**
 * DTO for hardening rule data.
 */
export interface HardeningRuleDto {
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
 * DTO for hardening rule response.
 */
export interface HardeningRuleResponseDto {
  rule: HardeningRuleDto;
}

/**
 * DTO for hardening rule list response.
 */
export interface HardeningRuleListResponseDto {
  rules: HardeningRuleDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Validation rules for rule creation.
 */
export const CREATE_RULE_VALIDATION = {
  name: {
    required: true,
    minLength: 3,
    maxLength: 100,
    description: 'Rule name (3-100 characters)',
  },
  status: {
    required: false,
    allowedValues: ['pending', 'in_progress', 'active', 'disabled', 'deprecated'],
  },
  priority: {
    required: false,
    allowedValues: [1, 2, 3, 4],
    description: 'Priority level (1=Critical, 2=High, 3=Medium, 4=Low)',
  },
  description: {
    required: false,
    maxLength: 1000,
    description: 'Rule description (max 1000 characters)',
  },
} as const;
