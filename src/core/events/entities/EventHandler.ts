/**
 * Event Handler Entity
 *
 * Entity representing an event handler registration.
 */

import { HandlerId } from '../value-objects/HandlerId';
import { EventType } from '../value-objects/EventType';
import { EventPriority } from '../types/EventPriority';

/**
 * EventHandler entity properties.
 */
export interface EventHandlerProps {
  /** Unique handler identifier */
  handlerId: HandlerId;

  /** Event type this handler subscribes to */
  eventType: EventType;

  /** Human-readable handler name */
  handlerName: string;

  /** Handler priority for ordering */
  priority: EventPriority;

  /** Handler metadata */
  metadata: EventHandlerMetadata;
}

/**
 * Event handler metadata.
 */
export interface EventHandlerMetadata {
  /** Description of what the handler does */
  description?: string;

  /** Domain that owns this handler */
  domain?: string;

  /** Tags for grouping handlers */
  tags: string[];

  /** Whether the handler is enabled */
  enabled: boolean;

  /** Whether to execute asynchronously */
  asynchronous: boolean;
}

/**
 * Default handler metadata.
 */
export const DEFAULT_HANDLER_METADATA: EventHandlerMetadata = {
  tags: [],
  enabled: true,
  asynchronous: false,
};

/**
 * EventHandler entity class.
 * Represents a registered event handler.
 */
export class EventHandler {
  /** Unique handler identifier */
  public readonly handlerId: HandlerId;

  /** Event type this handler subscribes to */
  public readonly eventType: EventType;

  /** Human-readable handler name */
  public readonly handlerName: string;

  /** Handler priority for ordering */
  public readonly priority: EventPriority;

  /** Handler metadata */
  public readonly metadata: EventHandlerMetadata;

  /**
   * Creates a new EventHandler instance.
   */
  constructor(props: EventHandlerProps) {
    this.handlerId = props.handlerId;
    this.eventType = props.eventType;
    this.handlerName = props.handlerName;
    this.priority = props.priority;
    this.metadata = props.metadata;
  }

  /**
   * Creates a new EventHandler.
   */
  public static create(params: {
    handlerId?: HandlerId;
    eventType: EventType;
    handlerName: string;
    priority?: EventPriority;
    description?: string;
    domain?: string;
    tags?: string[];
    enabled?: boolean;
    asynchronous?: boolean;
  }): EventHandler {
    return new EventHandler({
      handlerId: params.handlerId ?? HandlerId.generate(),
      eventType: params.eventType,
      handlerName: params.handlerName,
      priority: params.priority ?? EventPriority.NORMAL,
      metadata: {
        description: params.description,
        domain: params.domain,
        tags: params.tags ?? [],
        enabled: params.enabled ?? true,
        asynchronous: params.asynchronous ?? false,
      },
    });
  }

  /**
   * Reconstructs an EventHandler from a record.
   */
  public static fromRecord(record: EventHandlerRecord): EventHandler {
    return new EventHandler({
      handlerId: HandlerId.reconstruct(record.handler_id),
      eventType: EventType.reconstruct(record.event_type),
      handlerName: record.handler_name,
      priority: record.priority,
      metadata: {
        description: record.description,
        domain: record.domain,
        tags: record.tags,
        enabled: record.enabled,
        asynchronous: record.asynchronous,
      },
    });
  }

  /**
   * Converts the handler to a plain object.
   */
  public toRecord(): EventHandlerRecord {
    return {
      handler_id: this.handlerId.value,
      event_type: this.eventType.value,
      handler_name: this.handlerName,
      priority: this.priority,
      description: this.metadata.description,
      domain: this.metadata.domain,
      tags: this.metadata.tags,
      enabled: this.metadata.enabled,
      asynchronous: this.metadata.asynchronous,
    };
  }

  /**
   * Creates a copy with updated fields.
   */
  public copyWith(params: Partial<EventHandlerProps>): EventHandler {
    return new EventHandler({
      handlerId: params.handlerId ?? this.handlerId,
      eventType: params.eventType ?? this.eventType,
      handlerName: params.handlerName ?? this.handlerName,
      priority: params.priority ?? this.priority,
      metadata: params.metadata ?? this.metadata,
    });
  }

  /**
   * Checks if this handler is enabled.
   */
  public isEnabled(): boolean {
    return this.metadata.enabled;
  }
}

/**
 * Database record representation of EventHandler.
 */
export interface EventHandlerRecord {
  handler_id: string;
  event_type: string;
  handler_name: string;
  priority: EventPriority;
  description?: string;
  domain?: string;
  tags: string[];
  enabled: boolean;
  asynchronous: boolean;
}