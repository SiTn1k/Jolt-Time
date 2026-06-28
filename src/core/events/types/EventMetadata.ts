/**
 * Event Metadata Types
 *
 * Defines metadata structures for domain events.
 */

import { EventSource } from './EventSource';
import { EventPriority } from './EventPriority';

/**
 * Core event metadata fields.
 */
export interface EventMetadataCore {
  /** Source domain that published the event */
  source: EventSource;

  /** Correlation ID for tracing related events */
  correlationId?: string;

  /** Causation ID - the event ID that caused this event */
  causationId?: string;

  /** User ID associated with this event (if applicable) */
  userId?: string;

  /** Session ID for tracking user sessions */
  sessionId?: string;

  /** Request ID for tracing HTTP requests */
  requestId?: string;

  /** IP address of the originator */
  ipAddress?: string;

  /** User agent of the originator */
  userAgent?: string;

  /** Timestamp when event was created */
  timestamp: Date;

  /** Schema version for evolution */
  version: number;
}

/**
 * Extended event metadata with processing information.
 */
export interface EventMetadataExtended extends EventMetadataCore {
  /** Priority for processing */
  priority: EventPriority;

  /** Tags for filtering and routing */
  tags: string[];

  /** Custom headers for event routing */
  headers: Record<string, string>;

  /** Maximum retry attempts */
  maxRetries: number;

  /** Timeout in milliseconds for processing */
  timeoutMs: number;
}

/**
 * Default metadata values.
 */
export const DEFAULT_EVENT_METADATA: EventMetadataCore = {
  source: EventSource.UNKNOWN,
  timestamp: new Date(),
  version: 1,
};

export const DEFAULT_EXTENDED_EVENT_METADATA: EventMetadataExtended = {
  ...DEFAULT_EVENT_METADATA,
  priority: EventPriority.NORMAL,
  tags: [],
  headers: {},
  maxRetries: 3,
  timeoutMs: 30000,
};