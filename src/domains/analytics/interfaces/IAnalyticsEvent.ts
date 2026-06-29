/**
 * Analytics Event Interface
 *
 * Interface defining the contract for AnalyticsEvent entities.
 */

import type { AnalyticsEventId } from '../value-objects/AnalyticsEventId';
import type { SessionId } from '../value-objects/SessionId';
import type { AnalyticsEventType } from '../types/AnalyticsEventType';
import type { AnalyticsMetadata } from '../types/AnalyticsMetadata';

/**
 * AnalyticsEvent interface.
 * Defines the contract for analytics event entities.
 */
export interface IAnalyticsEvent {
  /** Unique event identifier */
  readonly eventId: AnalyticsEventId;

  /** Type of analytics event */
  readonly eventType: AnalyticsEventType;

  /** Associated player profile ID */
  readonly playerProfileId: string;

  /** Associated session ID */
  readonly sessionId: SessionId;

  /** Source module that generated the event */
  readonly sourceModule: string;

  /** Event payload data */
  readonly payload: Record<string, unknown>;

  /** Timestamp when event was created */
  readonly createdAt: Date;

  /** Event metadata */
  readonly metadata: AnalyticsMetadata;
}
