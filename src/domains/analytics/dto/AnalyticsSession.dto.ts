/**
 * Analytics Session DTO
 *
 * Data Transfer Object for analytics session requests.
 */

import type { AnalyticsMetadata } from '../types/AnalyticsMetadata';
import type { SessionStatus } from '../types/SessionStatus';

/**
 * DTO for creating a new analytics session.
 */
export interface CreateAnalyticsSessionDto {
  /** Player profile ID */
  playerProfileId: string;

  /** Device information */
  device?: string;

  /** Platform information */
  platform?: string;

  /** Session metadata */
  metadata?: AnalyticsMetadata;
}

/**
 * DTO for ending an analytics session.
 */
export interface EndAnalyticsSessionDto {
  /** Session ID */
  sessionId: string;
}

/**
 * DTO for analytics session response.
 */
export interface AnalyticsSessionResponseDto {
  /** Session ID */
  sessionId: string;

  /** Player profile ID */
  playerProfileId: string;

  /** Session start timestamp */
  startedAt: string;

  /** Session end timestamp (null if active) */
  endedAt: string | null;

  /** Session duration in milliseconds */
  duration: number;

  /** Device information */
  device: string;

  /** Platform information */
  platform: string;

  /** Session status */
  status: SessionStatus;

  /** Session metadata */
  metadata: AnalyticsMetadata;
}
