/**
 * ResearchProgress Entity
 *
 * Domain entity representing a player's progress on a specific research node.
 * Tracks the status and progress percentage for a single research.
 *
 * ResearchProgress Entity Responsibilities:
 * - Track research status (locked, available, in_progress, completed)
 * - Track progress percentage (0-100)
 * - Record completion timestamp
 *
 * ResearchProgress Entity is NOT:
 * - Currency modification (handled by Currency domain)
 * - Unlock logic (handled by Academy service)
 * - Reward distribution (handled by consuming services)
 */

import type { IResearchProgress } from '../interfaces/IResearchProgress';
import { AcademyId } from '../value-objects/AcademyId';
import { ResearchNodeId } from '../value-objects/ResearchNodeId';
import { ResearchProgressValue } from '../value-objects/ResearchProgressValue';
import type { ResearchStatus } from '../types/ResearchStatus';

/**
 * ResearchProgress entity class.
 * Immutable domain entity representing research progress.
 */
export class ResearchProgress implements IResearchProgress {
  /** Unique progress identifier */
  public readonly progressId: string;

  /** Associated academy ID */
  public readonly academyId: AcademyId;

  /** Research node ID being progressed */
  public readonly nodeId: ResearchNodeId;

  /** Current research status */
  public readonly status: ResearchStatus;

  /** Progress percentage (0-100) */
  public readonly progress: ResearchProgressValue;

  /** Timestamp when research was completed */
  public readonly completedAt: Date | null;

  /** Extended metadata */
  public readonly metadata: Record<string, unknown>;

  /**
   * Creates a new ResearchProgress instance.
   * @param props ResearchProgress properties
   */
  constructor(props: ResearchProgressProps) {
    this.progressId = props.progressId;
    this.academyId = props.academyId;
    this.nodeId = props.nodeId;
    this.status = props.status;
    this.progress = props.progress;
    this.completedAt = props.completedAt;
    this.metadata = props.metadata;
  }

  /**
   * Creates a new ResearchProgress for a research node.
   * Factory method for new progress creation.
   */
  public static create(params: {
    progressId: string;
    academyId: AcademyId;
    nodeId: ResearchNodeId;
    initialStatus?: ResearchStatus;
  }): ResearchProgress {
    return new ResearchProgress({
      progressId: params.progressId,
      academyId: params.academyId,
      nodeId: params.nodeId,
      status: params.initialStatus ?? ('locked' as ResearchStatus),
      progress: ResearchProgressValue.zero(),
      completedAt: null,
      metadata: {},
    });
  }

  /**
   * Reconstructs a ResearchProgress from stored data.
   * Factory method for reconstructing from persistence.
   */
  public static fromStorage(record: ResearchProgressRecord): ResearchProgress {
    return new ResearchProgress({
      progressId: record.progressId,
      academyId: AcademyId.reconstruct(record.academyId),
      nodeId: ResearchNodeId.reconstruct(record.nodeId),
      status: record.status as ResearchStatus,
      progress: ResearchProgressValue.reconstruct(record.progress),
      completedAt: record.completedAt ? new Date(record.completedAt) : null,
      metadata: record.metadata ?? {},
    });
  }

  /**
   * Checks if research is complete.
   */
  public get isComplete(): boolean {
    return this.status === 'completed';
  }

  /**
   * Checks if research is in progress.
   */
  public get isInProgress(): boolean {
    return this.status === 'in_progress';
  }

  /**
   * Checks if research is locked.
   */
  public get isLocked(): boolean {
    return this.status === 'locked';
  }

  /**
   * Checks if research is available.
   */
  public get isAvailable(): boolean {
    return this.status === 'available';
  }

  /**
   * Creates a copy with updated fields.
   * Returns a new ResearchProgress instance.
   */
  public copyWith(params: Partial<ResearchProgressProps>): ResearchProgress {
    return new ResearchProgress({
      progressId: params.progressId ?? this.progressId,
      academyId: params.academyId ?? this.academyId,
      nodeId: params.nodeId ?? this.nodeId,
      status: params.status ?? this.status,
      progress: params.progress ?? this.progress,
      completedAt: params.completedAt ?? this.completedAt,
      metadata: params.metadata ?? this.metadata,
    });
  }

  /**
   * Serializes the ResearchProgress to a plain object.
   */
  public toJSON(): ResearchProgressJSON {
    return {
      progressId: this.progressId,
      academyId: this.academyId.value,
      nodeId: this.nodeId.value,
      status: this.status,
      progress: this.progress.value,
      completedAt: this.completedAt?.toISOString() ?? null,
      metadata: this.metadata,
    };
  }
}

/**
 * ResearchProgress properties interface for constructor.
 */
export interface ResearchProgressProps {
  progressId: string;
  academyId: AcademyId;
  nodeId: ResearchNodeId;
  status: ResearchStatus;
  progress: ResearchProgressValue;
  completedAt: Date | null;
  metadata: Record<string, unknown>;
}

/**
 * Database record representation of ResearchProgress.
 */
export interface ResearchProgressRecord {
  progressId: string;
  academyId: string;
  nodeId: string;
  status: string;
  progress: number;
  completedAt: string | null;
  metadata: Record<string, unknown>;
}

/**
 * JSON serialization representation of ResearchProgress.
 */
export interface ResearchProgressJSON {
  progressId: string;
  academyId: string;
  nodeId: string;
  status: ResearchStatus;
  progress: number;
  completedAt: string | null;
  metadata: Record<string, unknown>;
}