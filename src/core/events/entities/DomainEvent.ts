/**
 * Domain Event Entity
 *
 * Core entity representing a domain event in the event bus system.
 * Domain events are immutable once created.
 */

import { EventId } from '../value-objects/EventId';
import { EventType } from '../value-objects/EventType';
import { AggregateId } from '../value-objects/AggregateId';
import type { EventSource } from '../types/EventSource';
import type { EventMetadataCore } from '../types/EventMetadata';

/**
 * DomainEvent entity properties.
 */
export interface DomainEventProps {
  /** Unique event identifier */
  eventId: EventId;

  /** Event type identifier (e.g., "PlayerProfile.Created") */
  eventType: EventType;

  /** Aggregate root ID this event belongs to */
  aggregateId: AggregateId;

  /** Type of aggregate that published this event */
  aggregateType: string;

  /** Source module/domain that published this event */
  sourceModule: EventSource;

  /** Timestamp when the event occurred */
  occurredAt: Date;

  /** Event payload/data */
  payload: Record<string, unknown>;

  /** Event metadata */
  metadata: EventMetadataCore;
}

/**
 * DomainEvent entity class.
 * Immutable - represents a domain event in the system.
 */
export class DomainEvent {
  /** Unique event identifier */
  public readonly eventId: EventId;

  /** Event type identifier */
  public readonly eventType: EventType;

  /** Aggregate root ID this event belongs to */
  public readonly aggregateId: AggregateId;

  /** Type of aggregate that published this event */
  public readonly aggregateType: string;

  /** Source module/domain that published this event */
  public readonly sourceModule: EventSource;

  /** Timestamp when the event occurred */
  public readonly occurredAt: Date;

  /** Event payload/data */
  public readonly payload: Record<string, unknown>;

  /** Event metadata */
  public readonly metadata: EventMetadataCore;

  /**
   * Creates a new DomainEvent instance.
   */
  constructor(props: DomainEventProps) {
    this.eventId = props.eventId;
    this.eventType = props.eventType;
    this.aggregateId = props.aggregateId;
    this.aggregateType = props.aggregateType;
    this.sourceModule = props.sourceModule;
    this.occurredAt = props.occurredAt;
    this.payload = props.payload;
    this.metadata = props.metadata;
  }

  /**
   * Creates a new DomainEvent with generated ID and timestamp.
   */
  public static create(params: {
    eventId?: EventId;
    eventType: EventType;
    aggregateId: AggregateId;
    aggregateType: string;
    sourceModule: EventSource;
    payload: Record<string, unknown>;
    metadata?: EventMetadataCore;
    occurredAt?: Date;
  }): DomainEvent {
    return new DomainEvent({
      eventId: params.eventId ?? EventId.generate(),
      eventType: params.eventType,
      aggregateId: params.aggregateId,
      aggregateType: params.aggregateType,
      sourceModule: params.sourceModule,
      occurredAt: params.occurredAt ?? new Date(),
      payload: params.payload,
      metadata: params.metadata ?? {
        source: params.sourceModule,
        timestamp: new Date(),
        version: 1,
      },
    });
  }

  /**
   * Reconstructs a DomainEvent from a plain object (e.g., from database).
   */
  public static fromRecord(record: DomainEventRecord): DomainEvent {
    return new DomainEvent({
      eventId: EventId.reconstruct(record.event_id),
      eventType: EventType.reconstruct(record.event_type),
      aggregateId: AggregateId.reconstruct(record.aggregate_id),
      aggregateType: record.aggregate_type,
      sourceModule: record.source_module as EventSource,
      occurredAt: new Date(record.occurred_at),
      payload: record.payload,
      metadata: {
        source: record.source_module as EventSource,
        timestamp: new Date(record.occurred_at),
        version: record.version,
        correlationId: record.correlation_id,
        causationId: record.causation_id,
        userId: record.user_id,
        sessionId: record.session_id,
        requestId: record.request_id,
        ipAddress: record.ip_address,
        userAgent: record.user_agent,
      },
    });
  }

  /**
   * Converts the event to a plain object for serialization.
   */
  public toRecord(): DomainEventRecord {
    return {
      event_id: this.eventId.value,
      event_type: this.eventType.value,
      aggregate_id: this.aggregateId.value,
      aggregate_type: this.aggregateType,
      source_module: this.sourceModule,
      occurred_at: this.occurredAt.toISOString(),
      payload: this.payload,
      version: this.metadata.version,
      correlation_id: this.metadata.correlationId,
      causation_id: this.metadata.causationId,
      user_id: this.metadata.userId,
      session_id: this.metadata.sessionId,
      request_id: this.metadata.requestId,
      ip_address: this.metadata.ipAddress,
      user_agent: this.metadata.userAgent,
    };
  }

  /**
   * Creates a copy with updated fields.
   * Returns a new DomainEvent instance.
   */
  public copyWith(params: Partial<DomainEventProps>): DomainEvent {
    return new DomainEvent({
      eventId: params.eventId ?? this.eventId,
      eventType: params.eventType ?? this.eventType,
      aggregateId: params.aggregateId ?? this.aggregateId,
      aggregateType: params.aggregateType ?? this.aggregateType,
      sourceModule: params.sourceModule ?? this.sourceModule,
      occurredAt: params.occurredAt ?? this.occurredAt,
      payload: params.payload ?? this.payload,
      metadata: params.metadata ?? this.metadata,
    });
  }

  /**
   * Checks equality with another DomainEvent.
   */
  public equals(other: DomainEvent): boolean {
    if (!(other instanceof DomainEvent)) {
      return false;
    }
    return this.eventId.equals(other.eventId);
  }
}

/**
 * Database record representation of DomainEvent.
 */
export interface DomainEventRecord {
  event_id: string;
  event_type: string;
  aggregate_id: string;
  aggregate_type: string;
  source_module: string;
  occurred_at: string;
  payload: Record<string, unknown>;
  version: number;
  correlation_id?: string;
  causation_id?: string;
  user_id?: string;
  session_id?: string;
  request_id?: string;
  ip_address?: string;
  user_agent?: string;
}

/**
 * JSON representation of DomainEvent.
 */
export interface DomainEventJSON {
  eventId: string;
  eventType: string;
  aggregateId: string;
  aggregateType: string;
  sourceModule: string;
  occurredAt: string;
  payload: Record<string, unknown>;
  metadata: EventMetadataCore;
}