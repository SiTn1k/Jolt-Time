/**
 * Alpha Mapper
 *
 * Maps between alpha entities and combined response DTOs.
 * No database logic - pure transformation only.
 */

import type { AlphaChecklist } from '../entities/AlphaChecklist';
import type { AlphaMilestone } from '../entities/AlphaMilestone';
import type { AlphaSnapshot } from '../entities/AlphaSnapshot';
import type { AlphaStatusResponseDto, AlphaOverviewResponseDto } from '../dto/AlphaResponse.dto';
import type { ChecklistDto } from '../dto/Checklist.dto';
import type { MilestoneDto } from '../dto/Milestone.dto';
import type { SnapshotDto } from '../dto/Snapshot.dto';
import { ChecklistMapper } from './ChecklistMapper';
import { MilestoneMapper } from './MilestoneMapper';
import { SnapshotMapper } from './SnapshotMapper';
import { RELEASE_STAGE_DISPLAY } from '../types/ReleaseStage';
import { isCompletedChecklistStatus } from '../types/ChecklistStatus';
import { isCompletedMilestoneStatus } from '../types/MilestoneStatus';
import type { ReleaseStage } from '../types/ReleaseStage';

/**
 * Mapper for converting between alpha entities and combined response DTOs.
 */
export class AlphaMapper {
  /**
   * Converts alpha data to AlphaStatusResponseDto.
   */
  public static toStatusResponse(params: {
    currentStage: ReleaseStage;
    checklists: AlphaChecklist[];
    milestones: AlphaMilestone[];
    latestSnapshot: AlphaSnapshot | null;
  }): AlphaStatusResponseDto {
    const completedChecklists = params.checklists.filter((c) =>
      isCompletedChecklistStatus(c.status)
    );
    const completedMilestones = params.milestones.filter((m) =>
      isCompletedMilestoneStatus(m.status)
    );

    const checklistProgress = {
      total: params.checklists.length,
      completed: completedChecklists.length,
      percentage:
        params.checklists.length > 0
          ? Math.round((completedChecklists.length / params.checklists.length) * 100)
          : 0,
    };

    const milestoneProgress = {
      total: params.milestones.length,
      completed: completedMilestones.length,
      percentage:
        params.milestones.length > 0
          ? Math.round((completedMilestones.length / params.milestones.length) * 100)
          : 0,
    };

    return {
      currentStage: params.currentStage,
      stageDisplay: RELEASE_STAGE_DISPLAY[params.currentStage],
      checklistProgress,
      milestoneProgress,
      latestSnapshot: params.latestSnapshot
        ? SnapshotMapper.toDto(params.latestSnapshot)
        : null,
      isAlphaReady: this.calculateAlphaReadiness(params),
    };
  }

  /**
   * Converts alpha data to AlphaOverviewResponseDto.
   */
  public static toOverviewResponse(params: {
    currentStage: ReleaseStage;
    checklists: AlphaChecklist[];
    milestones: AlphaMilestone[];
    latestSnapshot: AlphaSnapshot | null;
  }): AlphaOverviewResponseDto {
    const checklistDtos: ChecklistDto[] = params.checklists.map((c) =>
      ChecklistMapper.toDto(c)
    );
    const milestoneDtos: MilestoneDto[] = params.milestones.map((m) =>
      MilestoneMapper.toDto(m)
    );

    const completedChecklists = params.checklists.filter((c) =>
      isCompletedChecklistStatus(c.status)
    );
    const completedMilestones = params.milestones.filter((m) =>
      isCompletedMilestoneStatus(m.status)
    );

    return {
      currentStage: params.currentStage,
      stageDisplay: RELEASE_STAGE_DISPLAY[params.currentStage],
      checklists: checklistDtos,
      milestones: milestoneDtos,
      latestSnapshot: params.latestSnapshot
        ? SnapshotMapper.toDto(params.latestSnapshot)
        : null,
      systemReadiness: {
        checklistsComplete:
          completedChecklists.length === params.checklists.length &&
          params.checklists.length > 0,
        milestonesComplete:
          completedMilestones.length === params.milestones.length &&
          params.milestones.length > 0,
        snapshotCurrent: params.latestSnapshot !== null,
        isReady: this.calculateAlphaReadiness(params),
      },
    };
  }

  /**
   * Calculates if the system is alpha ready.
   */
  private static calculateAlphaReadiness(params: {
    checklists: AlphaChecklist[];
    milestones: AlphaMilestone[];
    latestSnapshot: AlphaSnapshot | null;
  }): boolean {
    if (params.checklists.length === 0 || params.milestones.length === 0) {
      return false;
    }

    const completedChecklists = params.checklists.filter((c) =>
      isCompletedChecklistStatus(c.status)
    );
    const completedMilestones = params.milestones.filter((m) =>
      isCompletedMilestoneStatus(m.status)
    );

    const allChecklistsComplete =
      completedChecklists.length === params.checklists.length;
    const allMilestonesComplete =
      completedMilestones.length === params.milestones.length;
    const hasSnapshot = params.latestSnapshot !== null;

    return allChecklistsComplete && allMilestonesComplete && hasSnapshot;
  }
}
