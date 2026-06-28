/**
 * Event Response DTO
 *
 * Data transfer objects for event responses.
 */

import type { EventStatistics } from '../types/EventStatistics';
import type { DomainEventDto } from './DomainEventDto';
import type { EventEnvelopeDto } from './EventEnvelopeDto';

/**
 * Event response DTO with full event details.
 */
export interface EventResponseDto {
  /** Event details */
  event: DomainEventDto;

  /** Envelope details */
  envelope?: EventEnvelopeDto;

  /** Processing result */
  result: EventProcessingResult;
}

/**
 * Event processing result.
 */
export interface EventProcessingResult {
  /** Whether processing was successful */
  success: boolean;

  /** Result message */
  message: string;

  /** Processing duration in milliseconds */
  processingTimeMs?: number;

  /** Error details if failed */
  error?: EventErrorDetails;
}

/**
 * Event error details.
 */
export interface EventErrorDetails {
  /** Error code */
  code: string;

  /** Error message */
  message: string;

  /** Stack trace */
  stack?: string;

  /** Whether the event can be retried */
  retriable: boolean;
}

/**
 * Event statistics response DTO.
 */
export interface EventStatisticsResponseDto {
  /** Current event statistics */
  statistics: EventStatistics;

  /** Timestamp when statistics were generated */
  generatedAt: string;

  /** Time period covered */
  periodStart: string;

  /** End of time period */
  periodEnd: string;
}

/**
 * Event list response DTO.
 */
export interface EventListResponseDto {
  /** List of events */
  events: DomainEventDto[];

  /** Total count */
  total: number;

  /** Offset for pagination */
  offset: number;

  /** Limit for pagination */
  limit: number;

  /** Whether there are more events */
  hasMore: boolean;
}