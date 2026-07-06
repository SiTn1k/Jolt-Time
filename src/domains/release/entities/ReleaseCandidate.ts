/**
 * ReleaseCandidate Entity
 *
 * Domain entity representing a release candidate.
 */

import type { IReleaseCandidate } from '../interfaces/IReleaseCandidate';
import { ReleaseId } from '../value-objects/ReleaseId';
import { ReleaseStatus } from '../types/ReleaseStatus';
import { ReleaseStage } from '../types/ReleaseStage';
import type { ReleaseMetadata } from '../types/ReleaseMetadata';

/**
 * ReleaseCandidate entity props for constructor.
 */
export interface ReleaseCandidateProps {
  releaseId: ReleaseId;
  version: string;
  status: ReleaseStatus;
  stage: ReleaseStage;
  createdAt: Date;
  approvedAt: Date | null;
  metadata: ReleaseMetadata;
  updatedAt: Date;
}

/**
 * Database record representation of ReleaseCandidate.
 */
export interface ReleaseCandidateRecord {
  releaseId: string;
  version: string;
  status: ReleaseStatus;
  stage: ReleaseStage;
  createdAt: string;
  approvedAt: string | null;
  metadata: ReleaseMetadata;
  updatedAt: string;
}

/**
 * JSON serialization representation of ReleaseCandidate.
 */
export interface ReleaseCandidateJSON {
  releaseId: string;
  version: string;
  status: ReleaseStatus;
  stage: ReleaseStage;
  createdAt: string;
  approvedAt: string | null;
  metadata: ReleaseMetadata;
  updatedAt: string;
}

/**
 * ReleaseCandidate entity class.
 * Immutable domain entity representing a release candidate.
 */
export class ReleaseCandidate implements IReleaseCandidate {
  public readonly releaseId: ReleaseId;
  public readonly version: string;
  public readonly status: ReleaseStatus;
  public readonly stage: ReleaseStage;
  public readonly createdAt: Date;
  public readonly approvedAt: Date | null;
  public readonly metadata: ReleaseMetadata;
  public readonly updatedAt: Date;

  /**
   * Creates a new ReleaseCandidate instance.
   */
  constructor(props: ReleaseCandidateProps) {
    this.releaseId = props.releaseId;
    this.version = props.version;
    this.status = props.status;
    this.stage = props.stage;
    this.createdAt = props.createdAt;
    this.approvedAt = props.approvedAt;
    this.metadata = props.metadata;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Creates a new ReleaseCandidate entity.
   */
  public static create(params: {
    releaseId?: ReleaseId;
    version: string;
    status?: ReleaseStatus;
    stage?: ReleaseStage;
    metadata?: ReleaseMetadata;
  }): ReleaseCandidate {
    const now = new Date();
    return new ReleaseCandidate({
      releaseId: params.releaseId ?? ReleaseId.create(),
      version: params.version,
      status: params.status ?? ReleaseStatus.DRAFT,
      stage: params.stage ?? ReleaseStage.RELEASE_CANDIDATE,
      createdAt: now,
      approvedAt: null,
      metadata: params.metadata ?? { notes: '', tags: [] },
      updatedAt: now,
    });
  }

  /**
   * Reconstructs a ReleaseCandidate from stored data.
   */
  public static fromStorage(record: ReleaseCandidateRecord): ReleaseCandidate {
    return new ReleaseCandidate({
      releaseId: ReleaseId.reconstruct(record.releaseId),
      version: record.version,
      status: record.status,
      stage: record.stage,
      createdAt: new Date(record.createdAt),
      approvedAt: record.approvedAt ? new Date(record.approvedAt) : null,
      metadata: record.metadata,
      updatedAt: new Date(record.updatedAt),
    });
  }

  /**
   * Checks if the release is approved.
   */
  public get isApproved(): boolean {
    return this.status === ReleaseStatus.APPROVED;
  }

  /**
   * Checks if the release is draft.
   */
  public get isDraft(): boolean {
    return this.status === ReleaseStatus.DRAFT;
  }

  /**
   * Checks if the release is pending approval.
   */
  public get isPendingApproval(): boolean {
    return this.status === ReleaseStatus.PENDING_APPROVAL;
  }

  /**
   * Checks if the release is published.
   */
  public get isPublished(): boolean {
    return this.status === ReleaseStatus.PUBLISHED;
  }

  /**
   * Checks if the release is in a terminal state.
   */
  public get isTerminal(): boolean {
    return this.status === ReleaseStatus.PUBLISHED || this.status === ReleaseStatus.ARCHIVED;
  }

  /**
   * Creates a copy with updated fields.
   */
  public copyWith(
    params: Partial<Omit<ReleaseCandidateProps, 'releaseId' | 'createdAt'>>
  ): ReleaseCandidate {
    return new ReleaseCandidate({
      releaseId: this.releaseId,
      version: params.version ?? this.version,
      status: params.status ?? this.status,
      stage: params.stage ?? this.stage,
      createdAt: this.createdAt,
      approvedAt: params.approvedAt !== undefined ? params.approvedAt : this.approvedAt,
      metadata: params.metadata ?? this.metadata,
      updatedAt: new Date(),
    });
  }

  /**
   * Creates a copy marked as approved.
   */
  public markApproved(approvedBy?: string): ReleaseCandidate {
    return this.copyWith({
      status: ReleaseStatus.APPROVED,
      approvedAt: new Date(),
      metadata: {
        ...this.metadata,
        approvedBy,
      },
    });
  }

  /**
   * Creates a copy marked as pending approval.
   */
  public markPendingApproval(): ReleaseCandidate {
    return this.copyWith({
      status: ReleaseStatus.PENDING_APPROVAL,
    });
  }

  /**
   * Creates a copy marked as published.
   */
  public markPublished(): ReleaseCandidate {
    return this.copyWith({
      status: ReleaseStatus.PUBLISHED,
    });
  }

  /**
   * Serializes the ReleaseCandidate to a plain object.
   */
  public toJSON(): ReleaseCandidateJSON {
    return {
      releaseId: this.releaseId.value,
      version: this.version,
      status: this.status,
      stage: this.stage,
      createdAt: this.createdAt.toISOString(),
      approvedAt: this.approvedAt?.toISOString() ?? null,
      metadata: this.metadata,
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  /**
   * Converts to database record format.
   */
  public toRecord(): ReleaseCandidateRecord {
    return {
      releaseId: this.releaseId.value,
      version: this.version,
      status: this.status,
      stage: this.stage,
      createdAt: this.createdAt.toISOString(),
      approvedAt: this.approvedAt?.toISOString() ?? null,
      metadata: this.metadata,
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
