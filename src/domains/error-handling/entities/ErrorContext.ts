/**
 * ErrorContext Entity
 *
 * Domain entity representing an error context in the error handling foundation.
 * This entity ONLY stores context data - it never modifies gameplay.
 *
 * ErrorContext Entity Responsibilities:
 * - Store error context data
 * - Track service and operation information
 * - Provide immutable context record
 *
 * ErrorContext Entity is NOT:
 * - A gameplay modifier
 * - A reward distributor
 * - A state changer
 */

import type { IErrorContext } from '../interfaces/IErrorContext';
import { ContextId } from '../value-objects/ContextId';

/**
 * ErrorContext properties interface for constructor.
 */
export interface ErrorContextProps {
  contextId: ContextId;
  service: string;
  operation: string;
  requestId?: string;
  actorId?: string;
  metadata?: Record<string, unknown>;
  createdAt?: Date;
}

/**
 * Database record representation of ErrorContext.
 */
export interface ErrorContextRecord {
  context_id: string;
  service: string;
  operation: string;
  request_id?: string;
  actor_id?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

/**
 * JSON serialization representation of ErrorContext.
 */
export interface ErrorContextJSON {
  contextId: string;
  service: string;
  operation: string;
  requestId?: string;
  actorId?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

/**
 * ErrorContext entity class.
 * Immutable domain entity representing an error context.
 */
export class ErrorContext implements IErrorContext {
  /** Unique context identifier */
  public readonly contextId: ContextId;

  /** Service name */
  public readonly service: string;

  /** Operation name */
  public readonly operation: string;

  /** Associated request ID */
  public readonly requestId?: string;

  /** Associated actor/user ID */
  public readonly actorId?: string;

  /** Context metadata */
  public readonly metadata: Record<string, unknown>;

  /** Timestamp when context was created */
  public readonly createdAt: Date;

  /**
   * Creates a new ErrorContext instance.
   * @param props ErrorContext properties
   */
  constructor(props: ErrorContextProps) {
    this.contextId = props.contextId;
    this.service = props.service;
    this.operation = props.operation;
    this.requestId = props.requestId;
    this.actorId = props.actorId;
    this.metadata = props.metadata ?? {};
    this.createdAt = props.createdAt ?? new Date();
  }

  /**
   * Creates a new ErrorContext.
   * Factory method for new context creation.
   */
  public static create(params: {
    contextId: ContextId;
    service: string;
    operation: string;
    requestId?: string;
    actorId?: string;
    metadata?: Record<string, unknown>;
  }): ErrorContext {
    return new ErrorContext({
      contextId: params.contextId,
      service: params.service,
      operation: params.operation,
      requestId: params.requestId,
      actorId: params.actorId,
      metadata: params.metadata ?? {},
      createdAt: new Date(),
    });
  }

  /**
   * Creates an ErrorContext from a database record.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: ErrorContextRecord): ErrorContext {
    return new ErrorContext({
      contextId: ContextId.reconstruct(record.context_id),
      service: record.service,
      operation: record.operation,
      requestId: record.request_id,
      actorId: record.actor_id,
      metadata: record.metadata ?? {},
      createdAt: new Date(record.created_at),
    });
  }

  /**
   * Creates a copy of the ErrorContext with optional modifications.
   * @param modifications Optional property modifications
   * @returns A new ErrorContext instance with the modifications
   */
  public copyWith(modifications: Partial<ErrorContextProps>): ErrorContext {
    return new ErrorContext({
      contextId: modifications.contextId ?? this.contextId,
      service: modifications.service ?? this.service,
      operation: modifications.operation ?? this.operation,
      requestId: modifications.requestId ?? this.requestId,
      actorId: modifications.actorId ?? this.actorId,
      metadata: modifications.metadata ?? this.metadata,
      createdAt: modifications.createdAt ?? this.createdAt,
    });
  }

  /**
   * Serializes the ErrorContext to a plain object.
   */
  public toJSON(): ErrorContextJSON {
    return {
      contextId: this.contextId.value,
      service: this.service,
      operation: this.operation,
      requestId: this.requestId,
      actorId: this.actorId,
      metadata: this.metadata,
      createdAt: this.createdAt.toISOString(),
    };
  }
}
