/**
 * IntegrationResponse Entity
 *
 * Domain entity representing an external service integration response.
 * A response is a single communication from an external service.
 *
 * IntegrationResponse Entity Responsibilities:
 * - Store response identity (ID, request ID)
 * - Store response status and code
 * - Store response payload
 * - Track received timestamp
 * - Store response metadata
 *
 * IntegrationResponse is NOT:
 * - An HTTP client
 * - A webhook handler
 * - A retry mechanism
 * - Any gameplay logic
 *
 * Integration Foundation ONLY stores providers, requests, and responses.
 * All external communication logic belongs to P-187.2.
 */

import type { IIntegrationResponse } from '../interfaces/IIntegrationResponse';
import { ResponseId } from '../value-objects/ResponseId';
import { RequestId } from '../value-objects/RequestId';
import type { RequestStatus } from '../types/RequestStatus';
import type { IntegrationResponseMetadata } from '../types/IntegrationMetadata';

/**
 * IntegrationResponse entity props for constructor.
 */
export interface IntegrationResponseProps {
  /** Unique internal identifier */
  responseId: ResponseId;

  /** Request ID this response is for */
  requestId: RequestId;

  /** Response status */
  status: RequestStatus;

  /** HTTP status code or similar response code */
  responseCode: number;

  /** Response payload (JSON-serializable) */
  payload: Record<string, unknown>;

  /** Timestamp when response was received */
  receivedAt: Date;

  /** Response metadata */
  metadata: IntegrationResponseMetadata;
}

/**
 * Database record representation of IntegrationResponse.
 */
export interface IntegrationResponseRecord {
  response_id: string;
  request_id: string;
  status: string;
  response_code: number;
  payload: Record<string, unknown>;
  received_at: string;
  metadata: IntegrationResponseMetadata;
}

/**
 * JSON serialization representation of IntegrationResponse.
 */
export interface IntegrationResponseJSON {
  responseId: string;
  requestId: string;
  status: RequestStatus;
  responseCode: number;
  payload: Record<string, unknown>;
  receivedAt: string;
  metadata: IntegrationResponseMetadata;
}

/**
 * IntegrationResponse entity class.
 * Immutable domain entity representing an integration response.
 */
export class IntegrationResponse implements IIntegrationResponse {
  /** Unique internal identifier */
  public readonly responseId: ResponseId;

  /** Request ID this response is for */
  public readonly requestId: RequestId;

  /** Response status */
  public readonly status: RequestStatus;

  /** HTTP status code or similar response code */
  public readonly responseCode: number;

  /** Response payload (JSON-serializable) */
  public readonly payload: Record<string, unknown>;

  /** Timestamp when response was received */
  public readonly receivedAt: Date;

  /** Response metadata */
  public readonly metadata: IntegrationResponseMetadata;

  /**
   * Creates a new IntegrationResponse instance.
   */
  constructor(props: IntegrationResponseProps) {
    this.responseId = props.responseId;
    this.requestId = props.requestId;
    this.status = props.status;
    this.responseCode = props.responseCode;
    this.payload = props.payload;
    this.receivedAt = props.receivedAt;
    this.metadata = props.metadata;
  }

  /**
   * Creates a new IntegrationResponse entity.
   * Factory method for new response creation.
   */
  public static create(params: {
    responseId?: ResponseId;
    requestId: RequestId;
    status?: RequestStatus;
    responseCode?: number;
    payload?: Record<string, unknown>;
    metadata?: IntegrationResponseMetadata;
  }): IntegrationResponse {
    return new IntegrationResponse({
      responseId: params.responseId ?? ResponseId.generate(),
      requestId: params.requestId,
      status: params.status ?? 'completed',
      responseCode: params.responseCode ?? 200,
      payload: params.payload ?? {},
      receivedAt: new Date(),
      metadata: params.metadata ?? {},
    });
  }

  /**
   * Reconstructs an IntegrationResponse from stored data.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: IntegrationResponseRecord): IntegrationResponse {
    return new IntegrationResponse({
      responseId: ResponseId.reconstruct(record.response_id),
      requestId: RequestId.reconstruct(record.request_id),
      status: record.status as RequestStatus,
      responseCode: record.response_code,
      payload: record.payload,
      receivedAt: new Date(record.received_at),
      metadata: record.metadata,
    });
  }

  /**
   * Checks if this response indicates success.
   */
  public isSuccess(): boolean {
    return this.status === 'completed' && this.responseCode >= 200 && this.responseCode < 300;
  }

  /**
   * Checks if this response indicates failure.
   */
  public isFailure(): boolean {
    return this.status === 'failed' || this.status === 'timeout' || this.responseCode >= 400;
  }

  /**
   * Creates a copy with updated fields.
   * Note: Immutable entity, returns new instance.
   */
  public copyWith(params: Partial<Omit<IntegrationResponseProps, 'responseId' | 'receivedAt'>>): IntegrationResponse {
    return new IntegrationResponse({
      responseId: this.responseId,
      requestId: params.requestId ?? this.requestId,
      status: params.status ?? this.status,
      responseCode: params.responseCode ?? this.responseCode,
      payload: params.payload ?? this.payload,
      receivedAt: this.receivedAt,
      metadata: params.metadata ?? this.metadata,
    });
  }

  /**
   * Serializes the IntegrationResponse to a plain object.
   */
  public toJSON(): IntegrationResponseJSON {
    return {
      responseId: this.responseId.value,
      requestId: this.requestId.value,
      status: this.status,
      responseCode: this.responseCode,
      payload: this.payload,
      receivedAt: this.receivedAt.toISOString(),
      metadata: this.metadata,
    };
  }

  /**
   * Converts to database record format.
   */
  public toRecord(): IntegrationResponseRecord {
    return {
      response_id: this.responseId.value,
      request_id: this.requestId.value,
      status: this.status,
      response_code: this.responseCode,
      payload: this.payload,
      received_at: this.receivedAt.toISOString(),
      metadata: this.metadata,
    };
  }
}
