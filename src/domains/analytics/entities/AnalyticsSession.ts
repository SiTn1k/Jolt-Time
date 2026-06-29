/**
 * AnalyticsSession Entity
 *
 * Domain entity representing an analytics user session.
 * This entity ONLY records session data - it never modifies gameplay.
 *
 * AnalyticsSession Entity Responsibilities:
 * - Track user session lifecycle
 * - Store session metadata
 * - Calculate session duration
 *
 * AnalyticsSession Entity is NOT:
 * - A session manager
 * - An authentication mechanism
 * - A state changer
 */

import type { IAnalyticsSession } from '../interfaces/IAnalyticsSession';
import { SessionId } from '../value-objects/SessionId';
import { SessionStatus, SESSION_CONSTRAINTS } from '../types/SessionStatus';
import { AnalyticsMetadata, INITIAL_ANALYTICS_METADATA } from '../types/AnalyticsMetadata';

/**
 * AnalyticsSession entity class.
 * Immutable domain entity representing a telemetry session.
 */
export class AnalyticsSession implements IAnalyticsSession {
  /** Unique session identifier */
  public readonly sessionId: SessionId;

  /** Associated player profile ID */
  public readonly playerProfileId: string;

  /** Timestamp when session started */
  public readonly startedAt: Date;

  /** Timestamp when session ended (null if active) */
  public readonly endedAt: Date | null;

  /** Session duration in milliseconds */
  public readonly duration: number;

  /** Device information */
  public readonly device: string;

  /** Platform information */
  public readonly platform: string;

  /** Session metadata */
  public readonly metadata: AnalyticsMetadata;

  /**
   * Creates a new AnalyticsSession instance.
   * @param props AnalyticsSession properties
   */
  constructor(props: AnalyticsSessionProps) {
    this.sessionId = props.sessionId;
    this.playerProfileId = props.playerProfileId;
    this.startedAt = props.startedAt;
    this.endedAt = props.endedAt ?? null;
    this.duration = props.duration ?? this.calculateDuration(props.startedAt, props.endedAt ?? null);
    this.device = props.device ?? 'unknown';
    this.platform = props.platform ?? 'unknown';
    this.metadata = props.metadata ?? { ...INITIAL_ANALYTICS_METADATA };
  }

  /**
   * Calculates duration between start and end times.
   */
  private calculateDuration(startedAt: Date, endedAt: Date | null): number {
    if (!endedAt) {
      return Date.now() - startedAt.getTime();
    }
    return endedAt.getTime() - startedAt.getTime();
  }

  /**
   * Creates a new AnalyticsSession for tracking.
   * Factory method for new session creation.
   */
  public static create(params: {
    sessionId: SessionId;
    playerProfileId: string;
    device?: string;
    platform?: string;
    metadata?: AnalyticsMetadata;
  }): AnalyticsSession {
    const now = new Date();
    return new AnalyticsSession({
      sessionId: params.sessionId,
      playerProfileId: params.playerProfileId,
      startedAt: now,
      endedAt: null,
      duration: 0,
      device: params.device ?? 'unknown',
      platform: params.platform ?? 'unknown',
      metadata: params.metadata ?? { ...INITIAL_ANALYTICS_METADATA },
    });
  }

  /**
   * Ends an active session.
   * Returns a new AnalyticsSession with end time set.
   */
  public end(): AnalyticsSession {
    if (this.endedAt !== null) {
      throw new Error('Session has already ended');
    }
    return new AnalyticsSession({
      sessionId: this.sessionId,
      playerProfileId: this.playerProfileId,
      startedAt: this.startedAt,
      endedAt: new Date(),
      duration: Date.now() - this.startedAt.getTime(),
      device: this.device,
      platform: this.platform,
      metadata: this.metadata,
    });
  }

  /**
   * Gets the current session status.
   */
  public get status(): SessionStatus {
    if (this.endedAt === null) {
      return SessionStatus.ACTIVE;
    }
    if (this.duration < SESSION_CONSTRAINTS.MIN_DURATION_MS) {
      return SessionStatus.ABANDONED;
    }
    return SessionStatus.ENDED;
  }

  /**
   * Creates an AnalyticsSession from a database record.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: AnalyticsSessionRecord): AnalyticsSession {
    return new AnalyticsSession({
      sessionId: SessionId.reconstruct(record.session_id),
      playerProfileId: record.player_profile_id,
      startedAt: new Date(record.started_at),
      endedAt: record.ended_at ? new Date(record.ended_at) : null,
      duration: record.duration,
      device: record.device,
      platform: record.platform,
      metadata: record.metadata ?? { ...INITIAL_ANALYTICS_METADATA },
    });
  }

  /**
   * Serializes the AnalyticsSession to a plain object.
   */
  public toJSON(): AnalyticsSessionJSON {
    return {
      sessionId: this.sessionId.value,
      playerProfileId: this.playerProfileId,
      startedAt: this.startedAt.toISOString(),
      endedAt: this.endedAt?.toISOString() ?? null,
      duration: this.duration,
      device: this.device,
      platform: this.platform,
      metadata: this.metadata,
    };
  }
}

/**
 * AnalyticsSession properties interface for constructor.
 */
export interface AnalyticsSessionProps {
  sessionId: SessionId;
  playerProfileId: string;
  startedAt: Date;
  endedAt?: Date | null;
  duration?: number;
  device?: string;
  platform?: string;
  metadata?: AnalyticsMetadata;
}

/**
 * Database record representation of AnalyticsSession.
 */
export interface AnalyticsSessionRecord {
  session_id: string;
  player_profile_id: string;
  started_at: string;
  ended_at: string | null;
  duration: number;
  device: string;
  platform: string;
  metadata?: AnalyticsMetadata;
}

/**
 * JSON serialization representation of AnalyticsSession.
 */
export interface AnalyticsSessionJSON {
  sessionId: string;
  playerProfileId: string;
  startedAt: string;
  endedAt: string | null;
  duration: number;
  device: string;
  platform: string;
  metadata: AnalyticsMetadata;
}
