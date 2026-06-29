/**
 * Analytics Event DTO
 *
 * Data Transfer Object for analytics event creation requests.
 */

import type { AnalyticsEventType } from '../types/AnalyticsEventType';
import type { AnalyticsMetadata } from '../types/AnalyticsMetadata';

/**
 * DTO for creating a new analytics event.
 */
export interface CreateAnalyticsEventDto {
  /** Event type */
  eventType: AnalyticsEventType;

  /** Player profile ID */
  playerProfileId: string;

  /** Session ID */
  sessionId: string;

  /** Source module name */
  sourceModule: string;

  /** Event payload data */
  payload?: Record<string, unknown>;

  /** Event metadata */
  metadata?: AnalyticsMetadata;
}

/**
 * DTO for analytics event response.
 */
export interface AnalyticsEventResponseDto {
  /** Event ID */
  eventId: string;

  /** Event type */
  eventType: AnalyticsEventType;

  /** Player profile ID */
  playerProfileId: string;

  /** Session ID */
  sessionId: string;

  /** Source module */
  sourceModule: string;

  /** Event payload */
  payload: Record<string, unknown>;

  /** Creation timestamp */
  createdAt: string;

  /** Event metadata */
  metadata: AnalyticsMetadata;
}
