/**
 * RewardRequest Entity
 *
 * Domain entity representing a reward request.
 * Tracks the request for a reward from a source module.
 */

import type { IRewardRequest } from '../interfaces/IRewardRequest';
import { RequestId } from '../value-objects/RequestId';
import { RewardStatus } from '../types/RewardStatus';
import type { RewardSource } from '../types/RewardSource';
import type { RewardRequestMetadata } from '../types/RewardMetadata';
import { PlayerProfileId } from '../../player-profile/value-objects/PlayerProfileId';

/**
 * RewardRequest entity props for constructor.
 */
export interface RewardRequestProps {
  requestId: RequestId;
  playerProfileId: PlayerProfileId;
  sourceModule: RewardSource;
  sourceId: string;
  packageId: string;
  status: RewardStatus;
  requestedAt: Date;
  processedAt?: Date;
  metadata: RewardRequestMetadata;
}

/**
 * Database record representation of RewardRequest.
 */
export interface RewardRequestRecord {
  requestId: string;
  playerProfileId: string;
  sourceModule: RewardSource;
  sourceId: string;
  packageId: string;
  status: RewardStatus;
  requestedAt: string;
  processedAt?: string;
  metadata: RewardRequestMetadata;
  createdAt: string;
  updatedAt: string;
}

/**
 * JSON serialization representation of RewardRequest.
 */
export interface RewardRequestJSON {
  requestId: string;
  playerProfileId: string;
  sourceModule: RewardSource;
  sourceId: string;
  packageId: string;
  status: RewardStatus;
  requestedAt: string;
  processedAt?: string;
  metadata: RewardRequestMetadata;
}

/**
 * RewardRequest entity class.
 * Immutable domain entity representing a reward request.
 */
export class RewardRequest implements IRewardRequest {
  public readonly requestId: RequestId;
  public readonly playerProfileId: PlayerProfileId;
  public readonly sourceModule: RewardSource;
  public readonly sourceId: string;
  public readonly packageId: string;
  public readonly status: RewardStatus;
  public readonly requestedAt: Date;
  public readonly processedAt?: Date;
  public readonly metadata: RewardRequestMetadata;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  /**
   * Creates a new RewardRequest instance.
   */
  constructor(props: RewardRequestProps) {
    this.requestId = props.requestId;
    this.playerProfileId = props.playerProfileId;
    this.sourceModule = props.sourceModule;
    this.sourceId = props.sourceId;
    this.packageId = props.packageId;
    this.status = props.status;
    this.requestedAt = props.requestedAt;
    this.processedAt = props.processedAt;
    this.metadata = props.metadata;
    this.createdAt = props.requestedAt;
    this.updatedAt = props.requestedAt;
  }

  /**
   * Creates a new RewardRequest entity.
   */
  public static create(params: {
    requestId: RequestId;
    playerProfileId: PlayerProfileId;
    sourceModule: RewardSource;
    sourceId: string;
    packageId: string;
    metadata?: RewardRequestMetadata;
  }): RewardRequest {
    const now = new Date();

    return new RewardRequest({
      requestId: params.requestId,
      playerProfileId: params.playerProfileId,
      sourceModule: params.sourceModule,
      sourceId: params.sourceId,
      packageId: params.packageId,
      status: RewardStatus.PENDING,
      requestedAt: now,
      metadata: params.metadata ?? {},
    });
  }

  /**
   * Reconstructs a RewardRequest from stored data.
   */
  public static fromStorage(record: RewardRequestRecord): RewardRequest {
    return new RewardRequest({
      requestId: RequestId.reconstruct(record.requestId),
      playerProfileId: PlayerProfileId.reconstruct(record.playerProfileId),
      sourceModule: record.sourceModule,
      sourceId: record.sourceId,
      packageId: record.packageId,
      status: record.status,
      requestedAt: new Date(record.requestedAt),
      processedAt: record.processedAt ? new Date(record.processedAt) : undefined,
      metadata: record.metadata,
    });
  }

  /**
   * Checks if the request is pending.
   */
  public get isPending(): boolean {
    return this.status === RewardStatus.PENDING || this.status === RewardStatus.PROCESSING;
  }

  /**
   * Checks if the request has been processed.
   */
  public get isProcessed(): boolean {
    return [RewardStatus.GRANTED, RewardStatus.REJECTED, RewardStatus.EXPIRED, RewardStatus.FAILED].includes(this.status);
  }

  /**
   * Creates a copy with updated status.
   */
  public withStatus(status: RewardStatus, processedAt?: Date): RewardRequest {
    return new RewardRequest({
      requestId: this.requestId,
      playerProfileId: this.playerProfileId,
      sourceModule: this.sourceModule,
      sourceId: this.sourceId,
      packageId: this.packageId,
      status,
      requestedAt: this.requestedAt,
      processedAt: processedAt ?? new Date(),
      metadata: this.metadata,
    });
  }

  /**
   * Creates a copy with updated metadata.
   */
  public withMetadata(metadata: RewardRequestMetadata): RewardRequest {
    return new RewardRequest({
      requestId: this.requestId,
      playerProfileId: this.playerProfileId,
      sourceModule: this.sourceModule,
      sourceId: this.sourceId,
      packageId: this.packageId,
      status: this.status,
      requestedAt: this.requestedAt,
      processedAt: this.processedAt,
      metadata,
    });
  }

  /**
   * Serializes the RewardRequest to a plain object.
   */
  public toJSON(): RewardRequestJSON {
    return {
      requestId: this.requestId.value,
      playerProfileId: this.playerProfileId.value,
      sourceModule: this.sourceModule,
      sourceId: this.sourceId,
      packageId: this.packageId,
      status: this.status,
      requestedAt: this.requestedAt.toISOString(),
      processedAt: this.processedAt?.toISOString(),
      metadata: this.metadata,
    };
  }

  /**
   * Converts to database record format.
   */
  public toRecord(): RewardRequestRecord {
    return {
      requestId: this.requestId.value,
      playerProfileId: this.playerProfileId.value,
      sourceModule: this.sourceModule,
      sourceId: this.sourceId,
      packageId: this.packageId,
      status: this.status,
      requestedAt: this.requestedAt.toISOString(),
      processedAt: this.processedAt?.toISOString(),
      metadata: this.metadata,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}