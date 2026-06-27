/**
 * AchievementProgress Entity
 *
 * Domain entity representing a player's progress on an achievement.
 * Progress is stored separately from achievement definitions.
 */

import type { IAchievementProgress } from '../interfaces/IAchievementProgress';
import { AchievementProgressId } from './AchievementProgressId';
import { ProgressValue } from '../value-objects/ProgressValue';
import { AchievementStatus } from '../types/AchievementStatus';

/**
 * AchievementProgress entity props for constructor.
 */
export interface AchievementProgressProps {
  progressId: AchievementProgressId;
  playerProfileId: string;
  achievementId: string;
  status: AchievementStatus;
  currentValue: number;
  completedAt: Date | null;
  claimedAt: Date | null;
  metadata: Record<string, string | number | boolean>;
  startedAt: Date;
  updatedAt: Date;
}

/**
 * Database record representation of AchievementProgress.
 */
export interface AchievementProgressRecord {
  progressId: string;
  playerProfileId: string;
  achievementId: string;
  status: AchievementStatus;
  currentValue: number;
  completedAt: string | null;
  claimedAt: string | null;
  metadata: Record<string, string | number | boolean>;
  startedAt: string;
  updatedAt: string;
}

/**
 * JSON serialization representation of AchievementProgress.
 */
export interface AchievementProgressJSON {
  progressId: string;
  playerProfileId: string;
  achievementId: string;
  status: AchievementStatus;
  currentValue: number;
  completedAt: string | null;
  claimedAt: string | null;
  metadata: Record<string, string | number | boolean>;
  startedAt: string;
  updatedAt: string;
}

/**
 * AchievementProgress entity class.
 * Immutable domain entity representing a player's achievement progress.
 */
export class AchievementProgress implements IAchievementProgress {
  public readonly progressId: string;
  private readonly _progressId: AchievementProgressId;
  public readonly playerProfileId: string;
  public readonly achievementId: string;
  public readonly status: AchievementStatus;
  public readonly currentValue: number;
  public readonly completedAt: Date | null;
  public readonly claimedAt: Date | null;
  public readonly metadata: Record<string, string | number | boolean>;
  public readonly startedAt: Date;
  public readonly updatedAt: Date;

  /**
   * Creates a new AchievementProgress instance.
   */
  constructor(props: AchievementProgressProps) {
    this._progressId = props.progressId;
    this.progressId = props.progressId.value;
    this.playerProfileId = props.playerProfileId;
    this.achievementId = props.achievementId;
    this.status = props.status;
    this.currentValue = props.currentValue;
    this.completedAt = props.completedAt;
    this.claimedAt = props.claimedAt;
    this.metadata = props.metadata;
    this.startedAt = props.startedAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Creates a new AchievementProgress entity for a player starting an achievement.
   */
  public static create(params: {
    progressId: AchievementProgressId;
    playerProfileId: string;
    achievementId: string;
    initialValue?: number;
    metadata?: Record<string, string | number | boolean>;
  }): AchievementProgress {
    const now = new Date();
    return new AchievementProgress({
      progressId: params.progressId,
      playerProfileId: params.playerProfileId,
      achievementId: params.achievementId,
      status: AchievementStatus.LOCKED,
      currentValue: params.initialValue ?? 0,
      completedAt: null,
      claimedAt: null,
      metadata: params.metadata ?? {},
      startedAt: now,
      updatedAt: now,
    });
  }

  /**
   * Reconstructs an AchievementProgress from stored data.
   */
  public static fromStorage(record: AchievementProgressRecord): AchievementProgress {
    return new AchievementProgress({
      progressId: new AchievementProgressId(record.progressId),
      playerProfileId: record.playerProfileId,
      achievementId: record.achievementId,
      status: record.status,
      currentValue: record.currentValue,
      completedAt: record.completedAt ? new Date(record.completedAt) : null,
      claimedAt: record.claimedAt ? new Date(record.claimedAt) : null,
      metadata: record.metadata,
      startedAt: new Date(record.startedAt),
      updatedAt: new Date(record.updatedAt),
    });
  }

  /**
   * Gets the progress value object.
   */
  public get progress(): ProgressValue {
    return ProgressValue.reconstruct(this.currentValue);
  }

  /**
   * Checks if the progress is complete for a given target.
   */
  public isCompleteForTarget(target: number): boolean {
    return this.currentValue >= target;
  }

  /**
   * Gets the completion percentage for a given target.
   */
  public getCompletionPercentage(target: number): number {
    if (target <= 0) {
      return 1;
    }
    const percentage = this.currentValue / target;
    return Math.min(1, Math.max(0, percentage));
  }

  /**
   * Checks if the achievement is claimable.
   */
  public get isClaimable(): boolean {
    return this.status === 'completed';
  }

  /**
   * Checks if the achievement has been claimed.
   */
  public get isClaimed(): boolean {
    return this.status === 'claimed';
  }

  /**
   * Creates a copy with updated fields.
   */
  public copyWith(params: Partial<Omit<AchievementProgressProps, 'progressId' | 'playerProfileId' | 'achievementId' | 'startedAt'>>): AchievementProgress {
    return new AchievementProgress({
      progressId: this._progressId,
      playerProfileId: this.playerProfileId,
      achievementId: this.achievementId,
      status: params.status ?? this.status,
      currentValue: params.currentValue ?? this.currentValue,
      completedAt: params.completedAt ?? this.completedAt,
      claimedAt: params.claimedAt ?? this.claimedAt,
      metadata: params.metadata ?? this.metadata,
      startedAt: this.startedAt,
      updatedAt: new Date(),
    });
  }

  /**
   * Serializes the AchievementProgress to a plain object.
   */
  public toJSON(): AchievementProgressJSON {
    return {
      progressId: this.progressId,
      playerProfileId: this.playerProfileId,
      achievementId: this.achievementId,
      status: this.status,
      currentValue: this.currentValue,
      completedAt: this.completedAt?.toISOString() ?? null,
      claimedAt: this.claimedAt?.toISOString() ?? null,
      metadata: this.metadata,
      startedAt: this.startedAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  /**
   * Converts to database record format.
   */
  public toRecord(): AchievementProgressRecord {
    return {
      progressId: this.progressId,
      playerProfileId: this.playerProfileId,
      achievementId: this.achievementId,
      status: this.status,
      currentValue: this.currentValue,
      completedAt: this.completedAt?.toISOString() ?? null,
      claimedAt: this.claimedAt?.toISOString() ?? null,
      metadata: this.metadata,
      startedAt: this.startedAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
