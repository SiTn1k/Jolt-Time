/**
 * AnalyticsEvent Entity
 *
 * Domain entity representing an analytics telemetry event.
 * This entity ONLY records events - it never modifies gameplay.
 *
 * AnalyticsEvent Entity Responsibilities:
 * - Store telemetry event data
 * - Track event source and timing
 * - Provide immutable event record
 *
 * AnalyticsEvent Entity is NOT:
 * - A gameplay modifier
 * - A reward distributor
 * - A state changer
 */

import type { IAnalyticsEvent } from '../interfaces/IAnalyticsEvent';
import { AnalyticsEventId } from '../value-objects/AnalyticsEventId';
import { SessionId } from '../value-objects/SessionId';
import { AnalyticsEventType, ANALYTICS_EVENT_TYPE_CONSTRAINTS } from '../types/AnalyticsEventType';
import { AnalyticsMetadata, INITIAL_ANALYTICS_METADATA } from '../types/AnalyticsMetadata';

/**
 * AnalyticsEvent entity class.
 * Immutable domain entity representing a telemetry event.
 */
export class AnalyticsEvent implements IAnalyticsEvent {
  /** Unique event identifier */
  public readonly eventId: AnalyticsEventId;

  /** Type of analytics event */
  public readonly eventType: AnalyticsEventType;

  /** Associated player profile ID */
  public readonly playerProfileId: string;

  /** Associated session ID */
  public readonly sessionId: SessionId;

  /** Source module that generated the event */
  public readonly sourceModule: string;

  /** Event payload data */
  public readonly payload: Record<string, unknown>;

  /** Timestamp when event was created */
  public readonly createdAt: Date;

  /** Event metadata */
  public readonly metadata: AnalyticsMetadata;

  /**
   * Creates a new AnalyticsEvent instance.
   * @param props AnalyticsEvent properties
   */
  constructor(props: AnalyticsEventProps) {
    this.eventId = props.eventId;
    this.eventType = props.eventType;
    this.playerProfileId = props.playerProfileId;
    this.sessionId = props.sessionId;
    this.sourceModule = props.sourceModule;
    this.payload = props.payload ?? {};
    this.createdAt = props.createdAt;
    this.metadata = props.metadata ?? { ...INITIAL_ANALYTICS_METADATA };
  }

  /**
   * Creates a new AnalyticsEvent for recording.
   * Factory method for new event creation.
   */
  public static create(params: {
    eventId: AnalyticsEventId;
    eventType: AnalyticsEventType;
    playerProfileId: string;
    sessionId: SessionId;
    sourceModule: string;
    payload?: Record<string, unknown>;
    metadata?: AnalyticsMetadata;
  }): AnalyticsEvent {
    return new AnalyticsEvent({
      eventId: params.eventId,
      eventType: params.eventType,
      playerProfileId: params.playerProfileId,
      sessionId: params.sessionId,
      sourceModule: params.sourceModule,
      payload: params.payload ?? {},
      createdAt: new Date(),
      metadata: params.metadata ?? { ...INITIAL_ANALYTICS_METADATA },
    });
  }

  /**
   * Creates an AnalyticsEvent from a database record.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: AnalyticsEventRecord): AnalyticsEvent {
    return new AnalyticsEvent({
      eventId: AnalyticsEventId.reconstruct(record.event_id),
      eventType: record.event_type as AnalyticsEventType,
      playerProfileId: record.player_profile_id,
      sessionId: SessionId.reconstruct(record.session_id),
      sourceModule: record.source_module,
      payload: record.payload,
      createdAt: new Date(record.created_at),
      metadata: record.metadata ?? { ...INITIAL_ANALYTICS_METADATA },
    });
  }

  /**
   * Serializes the AnalyticsEvent to a plain object.
   */
  public toJSON(): AnalyticsEventJSON {
    return {
      eventId: this.eventId.value,
      eventType: this.eventType,
      playerProfileId: this.playerProfileId,
      sessionId: this.sessionId.value,
      sourceModule: this.sourceModule,
      payload: this.payload,
      createdAt: this.createdAt.toISOString(),
      metadata: this.metadata,
    };
  }
}

/**
 * AnalyticsEvent properties interface for constructor.
 */
export interface AnalyticsEventProps {
  eventId: AnalyticsEventId;
  eventType: AnalyticsEventType;
  playerProfileId: string;
  sessionId: SessionId;
  sourceModule: string;
  payload?: Record<string, unknown>;
  createdAt: Date;
  metadata?: AnalyticsMetadata;
}

/**
 * Database record representation of AnalyticsEvent.
 */
export interface AnalyticsEventRecord {
  event_id: string;
  event_type: string;
  player_profile_id: string;
  session_id: string;
  source_module: string;
  payload: Record<string, unknown>;
  created_at: string;
  metadata?: AnalyticsMetadata;
}

/**
 * JSON serialization representation of AnalyticsEvent.
 */
export interface AnalyticsEventJSON {
  eventId: string;
  eventType: AnalyticsEventType;
  playerProfileId: string;
  sessionId: string;
  sourceModule: string;
  payload: Record<string, unknown>;
  createdAt: string;
  metadata: AnalyticsMetadata;
}
