/**
 * HardeningResponse DTO
 *
 * Response DTOs for hardening operations.
 */

import type { HardeningStatistics } from '../types/HardeningMetadata';
import type { HardeningRuleDto } from './HardeningRule.dto';
import type { HardeningChecklistDto } from './HardeningChecklist.dto';
import type { HardeningSnapshotDto } from './HardeningSnapshot.dto';

/**
 * DTO for hardening overview response.
 */
export interface HardeningOverviewResponseDto {
  statistics: HardeningStatistics;
  recentRules: HardeningRuleDto[];
  recentChecklists: HardeningChecklistDto[];
  recentSnapshots: HardeningSnapshotDto[];
}

/**
 * DTO for hardening statistics response.
 */
export interface HardeningStatisticsResponseDto {
  statistics: HardeningStatistics;
}
