/**
 * QuestProgress Entity
 *
 * Domain entity representing a player's progress on a quest.
 * Progress is stored separately from quest definitions.
 */

import type { IQuestProgress } from '../interfaces/IQuestProgress';
import { ProgressValue } from '../value-objects/ProgressValue';
import { QuestStatus } from '../types/QuestStatus';
import { QuestProgressId } from './QuestProgressId';

/**
 * QuestProgress entity props for constructor.
 */
export interface QuestProgressProps {
  progressId: QuestProgressId;
  playerProfileId: string;
  questId: string;
  status: QuestStatus;
  currentValue: number;
  completedAt: Date | null;
  claimedAt: Date | null;
  metadata: Record<string, string | number | boolean>;
  startedAt: Date;
  updatedAt: Date;
}

/**
 * Database record representation of QuestProgress.
 */
export interface QuestProgressRecord {
  progressId: string;
  playerProfileId: string;
  questId: string;
  status: QuestStatus;
  currentValue: number;
  completedAt: string | null;
  claimedAt: string | null;
  metadata: Record<string, string | number | boolean>;
  startedAt: string;
  updatedAt: string;
}

/**
 * JSON serialization representation of QuestProgress.
 */
export interface QuestProgressJSON {
  progressId: string;
  playerProfileId: string;
  questId: string;
  status: QuestStatus;
  currentValue: number;
  completedAt: string | null;
  claimedAt: string | null;
  metadata: Record<string, string | number | boolean>;
  startedAt: string;
  updatedAt: string;
}

/**
 * QuestProgress entity class.
 * Immutable domain entity representing a player's quest progress.
 */
export class QuestProgress implements IQuestProgress {
  public readonly progressId: string;
  private readonly _progressId: QuestProgressId;
  public readonly playerProfileId: string;
  public readonly questId: string;
  public readonly status: QuestStatus;
  public readonly currentValue: number;
  public readonly completedAt: Date | null;
  public readonly claimedAt: Date | null;
  public readonly metadata: Record<string, string | number | boolean>;
  public readonly startedAt: Date;
  public readonly updatedAt: Date;

  /**
   * Creates a new QuestProgress instance.
   */
  constructor(props: QuestProgressProps) {
    this._progressId = props.progressId;
    this.progressId = props.progressId.value;
    this.playerProfileId = props.playerProfileId;
    this.questId = props.questId;
    this.status = props.status;
    this.currentValue = props.currentValue;
    this.completedAt = props.completedAt;
    this.claimedAt = props.claimedAt;
    this.metadata = props.metadata;
    this.startedAt = props.startedAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Creates a new QuestProgress entity for a player starting a quest.
   */
  public static create(params: {
    progressId: QuestProgressId;
    playerProfileId: string;
    questId: string;
    initialValue?: number;
    metadata?: Record<string, string | number | boolean>;
  }): QuestProgress {
    const now = new Date();
    return new QuestProgress({
      progressId: params.progressId,
      playerProfileId: params.playerProfileId,
      questId: params.questId,
      status: QuestStatus.IN_PROGRESS,
      currentValue: params.initialValue ?? 0,
      completedAt: null,
      claimedAt: null,
      metadata: params.metadata ?? {},
      startedAt: now,
      updatedAt: now,
    });
  }

  /**
   * Reconstructs a QuestProgress from stored data.
   */
  public static fromStorage(record: QuestProgressRecord): QuestProgress {
    return new QuestProgress({
      progressId: new QuestProgressId(record.progressId),
      playerProfileId: record.playerProfileId,
      questId: record.questId,
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
   * Checks if the quest is claimable.
   */
  public get isClaimable(): boolean {
    return this.status === 'completed';
  }

  /**
   * Checks if the quest has been claimed.
   */
  public get isClaimed(): boolean {
    return this.status === 'claimed';
  }

  /**
   * Creates a copy with updated fields.
   */
  public copyWith(params: Partial<Omit<QuestProgressProps, 'progressId' | 'playerProfileId' | 'questId' | 'startedAt'>>): QuestProgress {
    return new QuestProgress({
      progressId: this._progressId,
      playerProfileId: this.playerProfileId,
      questId: this.questId,
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
   * Serializes the QuestProgress to a plain object.
   */
  public toJSON(): QuestProgressJSON {
    return {
      progressId: this.progressId,
      playerProfileId: this.playerProfileId,
      questId: this.questId,
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
  public toRecord(): QuestProgressRecord {
    return {
      progressId: this.progressId,
      playerProfileId: this.playerProfileId,
      questId: this.questId,
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
