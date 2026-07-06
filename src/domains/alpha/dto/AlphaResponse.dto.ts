/**
 * Alpha Response DTO
 *
 * Combined response DTOs for alpha domain.
 */

import type { ReleaseStage } from '../types/ReleaseStage';
import type { ChecklistDto } from './Checklist.dto';
import type { MilestoneDto } from './Milestone.dto';
import type { SnapshotDto } from './Snapshot.dto';

/**
 * DTO for alpha status response.
 */
export interface AlphaStatusResponseDto {
  currentStage: ReleaseStage;
  stageDisplay: string;
  checklistProgress: {
    total: number;
    completed: number;
    percentage: number;
  };
  milestoneProgress: {
    total: number;
    completed: number;
    percentage: number;
  };
  latestSnapshot: SnapshotDto | null;
  isAlphaReady: boolean;
}

/**
 * DTO for alpha overview response.
 */
export interface AlphaOverviewResponseDto {
  currentStage: ReleaseStage;
  stageDisplay: string;
  checklists: ChecklistDto[];
  milestones: MilestoneDto[];
  latestSnapshot: SnapshotDto | null;
  systemReadiness: {
    checklistsComplete: boolean;
    milestonesComplete: boolean;
    snapshotCurrent: boolean;
    isReady: boolean;
  };
}
