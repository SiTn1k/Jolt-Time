/**
 * Event Statistics Types
 *
 * Defines statistics and metrics for the event bus.
 */

import type { EventStatus } from './EventStatus';

/**
 * Event processing statistics.
 */
export interface EventStatistics {
  /** Total number of events published */
  totalPublished: number;

  /** Total number of events processed successfully */
  totalProcessed: number;

  /** Total number of events that failed processing */
  totalFailed: number;

  /** Total number of events currently being processed */
  totalProcessing: number;

  /** Total number of events pending processing */
  totalPending: number;

  /** Total number of events in dead letter queue */
  totalDeadLettered: number;

  /** Average processing time in milliseconds */
  averageProcessingTimeMs: number;

  /** Events published in the last minute */
  publishedPerMinute: number;

  /** Events processed in the last minute */
  processedPerMinute: number;

  /** Failure rate as a percentage (0-100) */
  failureRate: number;
}

/**
 * Statistics for a specific event type.
 */
export interface EventTypeStatistics {
  /** Event type identifier */
  eventType: string;

  /** Total events of this type */
  totalEvents: number;

  /** Successfully processed events */
  processedSuccessfully: number;

  /** Failed events */
  processedFailed: number;

  /** Average processing time in milliseconds */
  averageProcessingTimeMs: number;

  /** Last occurrence timestamp */
  lastOccurredAt: Date | null;

  /** First occurrence timestamp */
  firstOccurredAt: Date | null;
}

/**
 * Initial statistics state.
 */
export const INITIAL_EVENT_STATISTICS: EventStatistics = {
  totalPublished: 0,
  totalProcessed: 0,
  totalFailed: 0,
  totalProcessing: 0,
  totalPending: 0,
  totalDeadLettered: 0,
  averageProcessingTimeMs: 0,
  publishedPerMinute: 0,
  processedPerMinute: 0,
  failureRate: 0,
};