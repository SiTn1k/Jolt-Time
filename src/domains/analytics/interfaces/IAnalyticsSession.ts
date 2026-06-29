/**
 * Analytics Session Interface
 *
 * Interface defining the contract for AnalyticsSession entities.
 */

import type { SessionId } from '../value-objects/SessionId';
import type { SessionStatus } from '../types/SessionStatus';
import type { AnalyticsMetadata } from '../types/AnalyticsMetadata';

/**
 * AnalyticsSession interface.
 * Defines the contract for analytics session entities.
 */
export interface IAnalyticsSession {
  /** Unique session identifier */
  readonly sessionId: SessionId;

  /** Associated player profile ID */
  readonly playerProfileId: string;

  /** Timestamp when session started */
  readonly startedAt: Date;

  /** Timestamp when session ended (null if active) */
  readonly endedAt: Date | null;

  /** Session duration in milliseconds */
  readonly duration: number;

  /** Device information */
  readonly device: string;

  /** Platform information */
  readonly platform: string;

  /** Session metadata */
  readonly metadata: AnalyticsMetadata;

  /** Current session status */
  readonly status: SessionStatus;
}
