/**
 * IntegrationRequest Entity
 *
 * Domain entity representing an external service integration request.
 * A request is a single communication to an external service.
 *
 * IntegrationRequest Entity Responsibilities:
 * - Store request identity (ID, provider ID, type)
 * - Store request payload
 * - Track creation timestamp
 * - Store request metadata
 *
 * IntegrationRequest is NOT:
 * - An HTTP client
 * - A webhook sender
 * - A retry mechanism
 * - Any gameplay logic
 *
 * Integration Foundation ONLY stores providers, requests, and responses.
 * All external communication logic belongs to P-187.2.
 */

import type { IIntegrationRequest } from '../interfaces/IIntegrationRequest';
import { RequestId } from '../value-objects/RequestId';
import { ProviderId } from '../value-objects/ProviderId';
import type { IntegrationRequestMetadata } from '../types/IntegrationMetadata';

/**
 * IntegrationRequest entity props for constructor.
 */
export interface IntegrationRequestProps {
  /** Unique internal identifier */
  requestId: RequestId;

  /** Provider ID this request is for */
  providerId: ProviderId;

  /** Type of request */
  requestType: string;

  /** Request payload (JSON-serializable) */
  payload: Record<string, unknown>;

  /** Timestamp when request was created */
  createdAt: Date;

  /** Request metadata */
  metadata: IntegrationRequestMetadata;
}

/**
 * Database record representation of IntegrationRequest.
 */
export interface IntegrationRequestRecord {
  request_id: string;
  provider_id: string;
  request_type: string;
  payload: Record<string, unknown>;
  created_at: string;
  metadata: IntegrationRequestMetadata;
}

/**
 * JSON serialization representation of IntegrationRequest.
 */
export interface IntegrationRequestJSON {
  requestId: string;
  providerId: string;
  requestType: string;
  payload: Record<string, unknown>;
  createdAt: string;
  metadata: IntegrationRequestMetadata;
}

/**
 * IntegrationRequest entity class.
 * Immutable domain entity representing an integration request.
 */
export class IntegrationRequest implements IIntegrationRequest {
  /** Unique internal identifier */
  public readonly requestId: RequestId;

  /** Provider ID this request is for */
  public readonly providerId: ProviderId;

  /** Type of request */
  public readonly requestType: string;

  /** Request payload (JSON-serializable) */
  public readonly payload: Record<string, unknown>;

  /** Timestamp when request was created */
  public readonly createdAt: Date;

  /** Request metadata */
  public readonly metadata: IntegrationRequestMetadata;

  /**
   * Creates a new IntegrationRequest instance.
   */
  constructor(props: IntegrationRequestProps) {
    this.requestId = props.requestId;
    this.providerId = props.providerId;
    this.requestType = props.requestType;
    this.payload = props.payload;
    this.createdAt = props.createdAt;
    this.metadata = props.metadata;
  }

  /**
   * Creates a new IntegrationRequest entity.
   * Factory method for new request creation.
   */
  public static create(params: {
    requestId?: RequestId;
    providerId: ProviderId;
    requestType: string;
    payload?: Record<string, unknown>;
    metadata?: IntegrationRequestMetadata;
  }): IntegrationRequest {
    return new IntegrationRequest({
      requestId: params.requestId ?? RequestId.generate(),
      providerId: params.providerId,
      requestType: params.requestType,
      payload: params.payload ?? {},
      createdAt: new Date(),
      metadata: params.metadata ?? {},
    });
  }

  /**
   * Reconstructs an IntegrationRequest from stored data.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: IntegrationRequestRecord): IntegrationRequest {
    return new IntegrationRequest({
      requestId: RequestId.reconstruct(record.request_id),
      providerId: ProviderId.reconstruct(record.provider_id),
      requestType: record.request_type,
      payload: record.payload,
      createdAt: new Date(record.created_at),
      metadata: record.metadata,
    });
  }

  /**
   * Creates a copy with updated fields.
   * Note: Immutable entity, returns new instance.
   */
  public copyWith(params: Partial<Omit<IntegrationRequestProps, 'requestId' | 'createdAt'>>): IntegrationRequest {
    return new IntegrationRequest({
      requestId: this.requestId,
      providerId: params.providerId ?? this.providerId,
      requestType: params.requestType ?? this.requestType,
      payload: params.payload ?? this.payload,
      createdAt: this.createdAt,
      metadata: params.metadata ?? this.metadata,
    });
  }

  /**
   * Serializes the IntegrationRequest to a plain object.
   */
  public toJSON(): IntegrationRequestJSON {
    return {
      requestId: this.requestId.value,
      providerId: this.providerId.value,
      requestType: this.requestType,
      payload: this.payload,
      createdAt: this.createdAt.toISOString(),
      metadata: this.metadata,
    };
  }

  /**
   * Converts to database record format.
   */
  public toRecord(): IntegrationRequestRecord {
    return {
      request_id: this.requestId.value,
      provider_id: this.providerId.value,
      request_type: this.requestType,
      payload: this.payload,
      created_at: this.createdAt.toISOString(),
      metadata: this.metadata,
    };
  }
}
