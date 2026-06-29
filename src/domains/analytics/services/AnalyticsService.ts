/**
 * Analytics Service
 *
 * Main service for the Analytics domain.
 * Orchestrates event recording, session tracking, metric collection, and aggregation.
 * Analytics NEVER modifies gameplay - it ONLY observes and records.
 */

import { IAnalyticsRepository } from '../interfaces/IAnalyticsRepository';
import {
  AnalyticsEvent,
  AnalyticsSession,
  AnalyticsMetric,
} from '../entities';
import {
  AnalyticsEventId,
  SessionId,
  MetricId,
} from '../value-objects';
import { AnalyticsEventType, AnalyticsMetadata } from '../types';
import { MetricType, MetricUnit } from '../types';
import { SessionStatus } from '../types';
import {
  AnalyticsValidator,
  MetricValidator,
  SessionValidator,
} from '../validators';
import { createLogger } from '../../../core/logging/logger.service';
import { RepositoryError } from '../../../database/errors/repository.error';
import type { AnalyticsStatistics } from '../types/AnalyticsStatistics';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import type { AnalyticsEventFilterParams } from '../interfaces/IAnalyticsRepository';
import type { AnalyticsSessionFilterParams } from '../interfaces/IAnalyticsRepository';
import type { AnalyticsMetricFilterParams } from '../interfaces/IAnalyticsRepository';

const logger = createLogger('AnalyticsService');

/**
 * Session tracking state for active sessions.
 */
interface ActiveSessionState {
  session: AnalyticsSession;
  lastActivityAt: Date;
  heartbeatCount: number;
}

/**
 * In-memory aggregation cache for performance.
 */
interface AggregationCache {
  byPlayer: Map<string, PlayerAggregation>;
  bySession: Map<string, SessionAggregation>;
  byDay: Map<string, DayAggregation>;
  lastUpdated: Date;
}

/**
 * Player-level aggregation.
 */
interface PlayerAggregation {
  playerProfileId: string;
  eventCount: number;
  totalPlayTime: number;
  lastActivityAt: Date;
  eventTypes: Record<string, number>;
}

/**
 * Session-level aggregation.
 */
interface SessionAggregation {
  sessionId: string;
  playerProfileId: string;
  eventCount: number;
  startedAt: Date;
  endedAt: Date | null;
  duration: number;
}

/**
 * Day-level aggregation.
 */
interface DayAggregation {
  date: string;
  totalEvents: number;
  totalSessions: number;
  totalPlayTime: number;
  eventTypes: Record<string, number>;
}

/**
 * Analytics Service configuration.
 */
export interface AnalyticsServiceConfig {
  inactiveSessionTimeoutMs?: number;
  heartbeatIntervalMs?: number;
  aggregationFlushIntervalMs?: number;
  maxPayloadSize?: number;
}

/**
 * Default configuration values.
 */
const DEFAULT_CONFIG: Required<AnalyticsServiceConfig> = {
  inactiveSessionTimeoutMs: 5 * 60 * 1000, // 5 minutes
  heartbeatIntervalMs: 60 * 1000, // 1 minute
  aggregationFlushIntervalMs: 60 * 1000, // 1 minute
  maxPayloadSize: 10 * 1024, // 10KB
};

/**
 * Analytics Service
 *
 * Central service for all analytics operations.
 * Handles event recording, session management, metric collection, and aggregation.
 * Analytics NEVER modifies gameplay - only observes and records.
 */
export class AnalyticsService {
  private readonly repository: IAnalyticsRepository;
  private readonly config: Required<AnalyticsServiceConfig>;
  
  // Active sessions tracking
  private readonly activeSessions: Map<string, ActiveSessionState> = new Map();
  
  // Aggregation cache
  private readonly aggregationCache: AggregationCache = {
    byPlayer: new Map(),
    bySession: new Map(),
    byDay: new Map(),
    lastUpdated: new Date(),
  };

  // Validation failures counter (for metrics)
  private validationFailures = 0;
  private repositoryFailures = 0;
  private eventFailures = 0;
  private metricFailures = 0;

  /**
   * Creates a new AnalyticsService instance.
   */
  constructor(
    repository: IAnalyticsRepository,
    config?: AnalyticsServiceConfig
  ) {
    this.repository = repository;
    this.config = { ...DEFAULT_CONFIG, ...config };
    logger.info('AnalyticsService initialized', { config: this.config });
  }

  // ============ Event Recording ============

  /**
   * Records an analytics event.
   * Safe operation - never throws, always logs failures.
   */
  async recordEvent(params: {
    eventType: AnalyticsEventType;
    playerProfileId: string;
    sessionId: string;
    sourceModule: string;
    payload?: Record<string, unknown>;
    metadata?: AnalyticsMetadata;
  }): Promise<AnalyticsEvent | null> {
    try {
      // Validate input
      const validationResult = AnalyticsValidator.validateEvent({
        eventType: params.eventType,
        playerProfileId: params.playerProfileId,
        sessionId: params.sessionId,
        sourceModule: params.sourceModule,
        payload: params.payload,
      });

      if (!validationResult.isValid) {
        this.validationFailures++;
        logger.warn('Event validation failed', { 
          error: validationResult.error,
          eventType: params.eventType,
          playerProfileId: params.playerProfileId 
        });
        return null;
      }

      // Create event entity
      const event = AnalyticsEvent.create({
        eventId: AnalyticsEventId.generate(),
        eventType: params.eventType,
        playerProfileId: params.playerProfileId,
        sessionId: SessionId.reconstruct(params.sessionId),
        sourceModule: params.sourceModule,
        payload: params.payload,
        metadata: params.metadata,
      });

      // Record to repository
      const recordedEvent = await this.repository.recordEvent(event);
      
      // Update aggregation cache
      this.updateEventAggregation(recordedEvent);
      
      // Update session activity
      this.updateSessionActivity(params.sessionId);

      logger.debug('Event recorded successfully', { 
        eventId: recordedEvent.eventId.value,
        eventType: recordedEvent.eventType 
      });

      return recordedEvent;
    } catch (err) {
      this.eventFailures++;
      logger.error('Failed to record event', err instanceof Error ? err : new Error(String(err)), {
        eventType: params.eventType,
        playerProfileId: params.playerProfileId,
      });
      return null;
    }
  }

  /**
   * Records an analytics event and throws on failure (for critical paths).
   */
  async recordEventOrThrow(params: {
    eventType: AnalyticsEventType;
    playerProfileId: string;
    sessionId: string;
    sourceModule: string;
    payload?: Record<string, unknown>;
    metadata?: AnalyticsMetadata;
  }): Promise<AnalyticsEvent> {
    const event = await this.recordEvent(params);
    if (!event) {
      throw new Error('Failed to record analytics event');
    }
    return event;
  }

  // ============ Session Management ============

  /**
   * Starts a new analytics session.
   */
  async startSession(params: {
    playerProfileId: string;
    device?: string;
    platform?: string;
    metadata?: AnalyticsMetadata;
  }): Promise<AnalyticsSession | null> {
    try {
      // Validate input
      const validationResult = SessionValidator.validateSession({
        playerProfileId: params.playerProfileId,
        device: params.device,
        platform: params.platform,
      });

      if (!validationResult.isValid) {
        this.validationFailures++;
        logger.warn('Session validation failed', { error: validationResult.error });
        return null;
      }

      // Create session entity
      const session = AnalyticsSession.create({
        sessionId: SessionId.generate(),
        playerProfileId: params.playerProfileId,
        device: params.device,
        platform: params.platform,
        metadata: params.metadata,
      });

      // Save to repository
      const savedSession = await this.repository.createSession(session);
      
      // Track active session
      this.activeSessions.set(savedSession.sessionId.value, {
        session: savedSession,
        lastActivityAt: new Date(),
        heartbeatCount: 0,
      });

      // Update aggregation
      this.updateSessionAggregation(savedSession);

      logger.info('Session started', { 
        sessionId: savedSession.sessionId.value,
        playerProfileId: savedSession.playerProfileId 
      });

      return savedSession;
    } catch (err) {
      this.eventFailures++;
      logger.error('Failed to start session', err instanceof Error ? err : new Error(String(err)), {
        playerProfileId: params.playerProfileId,
      });
      return null;
    }
  }

  /**
   * Ends an analytics session.
   */
  async endSession(sessionId: string): Promise<AnalyticsSession | null> {
    try {
      // Find active session
      const activeState = this.activeSessions.get(sessionId);
      if (!activeState) {
        logger.warn('Attempted to end non-active session', { sessionId });
        return null;
      }

      // End the session
      const endedSession = activeState.session.end();
      
      // Update repository
      const updatedSession = await this.repository.updateSession(endedSession);
      
      // Remove from active sessions
      this.activeSessions.delete(sessionId);
      
      // Update aggregation
      this.updateSessionAggregation(updatedSession);

      logger.info('Session ended', { 
        sessionId: updatedSession.sessionId.value,
        duration: updatedSession.duration 
      });

      return updatedSession;
    } catch (err) {
      this.eventFailures++;
      logger.error('Failed to end session', err instanceof Error ? err : new Error(String(err)), { sessionId });
      return null;
    }
  }

  /**
   * Sends a heartbeat for an active session.
   */
  async sendHeartbeat(sessionId: string): Promise<boolean> {
    try {
      const activeState = this.activeSessions.get(sessionId);
      if (!activeState) {
        logger.warn('Heartbeat for non-active session', { sessionId });
        return false;
      }

      // Update last activity
      activeState.lastActivityAt = new Date();
      activeState.heartbeatCount++;

      logger.debug('Heartbeat received', { 
        sessionId,
        heartbeatCount: activeState.heartbeatCount 
      });

      return true;
    } catch (err) {
      logger.error('Failed to process heartbeat', err instanceof Error ? err : new Error(String(err)), { sessionId });
      return false;
    }
  }

  /**
   * Gets the current active session for a player.
   */
  getActiveSession(playerProfileId: string): AnalyticsSession | null {
    for (const [, state] of this.activeSessions) {
      if (state.session.playerProfileId === playerProfileId) {
        return state.session;
      }
    }
    return null;
  }

  /**
   * Gets all active sessions.
   */
  getActiveSessions(): AnalyticsSession[] {
    return Array.from(this.activeSessions.values()).map((state) => state.session);
  }

  /**
   * Detects and ends inactive sessions.
   */
  async detectInactiveSessions(): Promise<string[]> {
    const now = new Date();
    const inactiveSessions: string[] = [];

    for (const [sessionId, state] of this.activeSessions) {
      const inactiveDuration = now.getTime() - state.lastActivityAt.getTime();
      if (inactiveDuration > this.config.inactiveSessionTimeoutMs) {
        inactiveSessions.push(sessionId);
        await this.endSession(sessionId);
        logger.info('Inactive session ended', { 
          sessionId, 
          inactiveDuration,
          lastActivityAt: state.lastActivityAt 
        });
      }
    }

    return inactiveSessions;
  }

  // ============ Metric Collection ============

  /**
   * Records an analytics metric.
   */
  async recordMetric(params: {
    metricName: string;
    metricValue: number;
    metricType: MetricType;
    metricUnit: MetricUnit;
    metadata?: AnalyticsMetadata;
  }): Promise<AnalyticsMetric | null> {
    try {
      // Validate input
      const validationResult = MetricValidator.validateMetric({
        metricName: params.metricName,
        metricValue: params.metricValue,
        metricType: params.metricType,
        metricUnit: params.metricUnit,
      });

      if (!validationResult.isValid) {
        this.validationFailures++;
        logger.warn('Metric validation failed', { 
          error: validationResult.error,
          metricName: params.metricName 
        });
        return null;
      }

      // Create metric entity
      const metric = AnalyticsMetric.create({
        metricId: MetricId.generate(),
        metricName: params.metricName,
        metricValue: params.metricValue,
        metricType: params.metricType,
        metricUnit: params.metricUnit,
        metadata: params.metadata,
      });

      // Record to repository
      const recordedMetric = await this.repository.recordMetric(metric);

      // Update metric aggregation
      this.updateMetricAggregation(recordedMetric);

      logger.debug('Metric recorded', { 
        metricId: recordedMetric.metricId.value,
        metricName: recordedMetric.metricName,
        metricValue: recordedMetric.metricValue 
      });

      return recordedMetric;
    } catch (err) {
      this.metricFailures++;
      logger.error('Failed to record metric', err instanceof Error ? err : new Error(String(err)), {
        metricName: params.metricName,
      });
      return null;
    }
  }

  // ============ Data Loading ============

  /**
   * Loads events with pagination and filtering.
   */
  async loadEvents(
    params: PaginationParams,
    filters?: AnalyticsEventFilterParams
  ): Promise<PaginatedResult<AnalyticsEvent>> {
    try {
      return await this.repository.listEvents(params, filters);
    } catch (err) {
      logger.error('Failed to load events', err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  }

  /**
   * Loads sessions with pagination and filtering.
   */
  async loadSessions(
    params: PaginationParams,
    filters?: AnalyticsSessionFilterParams
  ): Promise<PaginatedResult<AnalyticsSession>> {
    try {
      return await this.repository.listSessions(params, filters);
    } catch (err) {
      logger.error('Failed to load sessions', err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  }

  /**
   * Loads metrics with pagination and filtering.
   */
  async loadMetrics(
    params: PaginationParams,
    filters?: AnalyticsMetricFilterParams
  ): Promise<PaginatedResult<AnalyticsMetric>> {
    try {
      return await this.repository.listMetrics(params, filters);
    } catch (err) {
      logger.error('Failed to load metrics', err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  }

  /**
   * Loads player statistics.
   */
  async loadPlayerStatistics(playerProfileId: string): Promise<{
    totalEvents: number;
    totalSessions: number;
    totalPlayTime: number;
    eventTypes: Record<string, number>;
    averageSessionDuration: number;
  }> {
    try {
      // Get all events for player
      const eventsResult = await this.repository.listEvents(
        { page: 1, pageSize: 10000 },
        { playerProfileId }
      );

      // Get all sessions for player
      const sessionsResult = await this.repository.listSessions(
        { page: 1, pageSize: 10000 },
        { playerProfileId }
      );

      // Calculate statistics
      const eventTypes: Record<string, number> = {};
      let totalPlayTime = 0;

      for (const event of eventsResult.items) {
        eventTypes[event.eventType] = (eventTypes[event.eventType] || 0) + 1;
      }

      for (const session of sessionsResult.items) {
        totalPlayTime += session.duration;
      }

      const averageSessionDuration = sessionsResult.items.length > 0
        ? totalPlayTime / sessionsResult.items.length
        : 0;

      return {
        totalEvents: eventsResult.total,
        totalSessions: sessionsResult.total,
        totalPlayTime,
        eventTypes,
        averageSessionDuration,
      };
    } catch (err) {
      logger.error('Failed to load player statistics', err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  }

  /**
   * Gets analytics summary/statistics.
   */
  async getSummary(): Promise<AnalyticsStatistics> {
    try {
      const totalEvents = await this.repository.countEvents();
      const totalSessions = await this.repository.countSessions();
      const activeSessions = this.activeSessions.size;
      const totalMetrics = await this.repository.countMetrics();

      // Calculate average session duration
      const sessionsResult = await this.repository.listSessions(
        { page: 1, pageSize: 1000 },
        {}
      );

      let totalDuration = 0;
      const eventsByType: Record<string, number> = {};

      for (const session of sessionsResult.items) {
        totalDuration += session.duration;
      }

      const averageSessionDuration = sessionsResult.items.length > 0
        ? totalDuration / sessionsResult.items.length
        : 0;

      // Get event type breakdown
      const eventsResult = await this.repository.listEvents(
        { page: 1, pageSize: 10000 },
        {}
      );

      for (const event of eventsResult.items) {
        eventsByType[event.eventType] = (eventsByType[event.eventType] || 0) + 1;
      }

      const lastEvent = eventsResult.items[0];
      const lastSession = sessionsResult.items[0];

      return {
        totalEvents,
        totalSessions,
        activeSessions,
        averageSessionDuration,
        totalMetrics,
        eventsByType,
        lastEventAt: lastEvent?.createdAt,
        lastSessionAt: lastSession?.startedAt,
      };
    } catch (err) {
      logger.error('Failed to get analytics summary', err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  }

  // ============ Aggregation ============

  /**
   * Gets aggregation for a specific player.
   */
  getPlayerAggregation(playerProfileId: string): PlayerAggregation | null {
    return this.aggregationCache.byPlayer.get(playerProfileId) || null;
  }

  /**
   * Gets aggregation for a specific session.
   */
  getSessionAggregation(sessionId: string): SessionAggregation | null {
    return this.aggregationCache.bySession.get(sessionId) || null;
  }

  /**
   * Gets aggregation for a specific day.
   */
  getDayAggregation(date: string): DayAggregation | null {
    return this.aggregationCache.byDay.get(date) || null;
  }

  /**
   * Gets all player aggregations.
   */
  getAllPlayerAggregations(): PlayerAggregation[] {
    return Array.from(this.aggregationCache.byPlayer.values());
  }

  /**
   * Gets all day aggregations.
   */
  getAllDayAggregations(): DayAggregation[] {
    return Array.from(this.aggregationCache.byDay.values());
  }

  /**
   * Clears the aggregation cache.
   */
  clearAggregationCache(): void {
    this.aggregationCache.byPlayer.clear();
    this.aggregationCache.bySession.clear();
    this.aggregationCache.byDay.clear();
    this.aggregationCache.lastUpdated = new Date();
    logger.info('Aggregation cache cleared');
  }

  /**
   * Updates event aggregation cache.
   */
  private updateEventAggregation(event: AnalyticsEvent): void {
    // Update by-player aggregation
    let playerAgg = this.aggregationCache.byPlayer.get(event.playerProfileId);
    if (!playerAgg) {
      playerAgg = {
        playerProfileId: event.playerProfileId,
        eventCount: 0,
        totalPlayTime: 0,
        lastActivityAt: new Date(),
        eventTypes: {},
      };
      this.aggregationCache.byPlayer.set(event.playerProfileId, playerAgg);
    }
    playerAgg.eventCount++;
    playerAgg.eventTypes[event.eventType] = (playerAgg.eventTypes[event.eventType] || 0) + 1;
    if (event.createdAt > playerAgg.lastActivityAt) {
      playerAgg.lastActivityAt = event.createdAt;
    }

    // Update by-session aggregation
    const sessionAgg = this.aggregationCache.bySession.get(event.sessionId.value);
    if (sessionAgg) {
      sessionAgg.eventCount++;
    }

    // Update by-day aggregation
    const dayKey = event.createdAt.toISOString().split('T')[0];
    let dayAgg = this.aggregationCache.byDay.get(dayKey);
    if (!dayAgg) {
      dayAgg = {
        date: dayKey,
        totalEvents: 0,
        totalSessions: 0,
        totalPlayTime: 0,
        eventTypes: {},
      };
      this.aggregationCache.byDay.set(dayKey, dayAgg);
    }
    dayAgg.totalEvents++;
    dayAgg.eventTypes[event.eventType] = (dayAgg.eventTypes[event.eventType] || 0) + 1;

    this.aggregationCache.lastUpdated = new Date();
  }

  /**
   * Updates session aggregation cache.
   */
  private updateSessionAggregation(session: AnalyticsSession): void {
    // Update by-session aggregation
    this.aggregationCache.bySession.set(session.sessionId.value, {
      sessionId: session.sessionId.value,
      playerProfileId: session.playerProfileId,
      eventCount: 0,
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      duration: session.duration,
    });

    // Update by-player aggregation
    const playerAgg = this.aggregationCache.byPlayer.get(session.playerProfileId);
    if (playerAgg) {
      playerAgg.totalPlayTime += session.duration;
    }

    // Update by-day aggregation
    const dayKey = session.startedAt.toISOString().split('T')[0];
    let dayAgg = this.aggregationCache.byDay.get(dayKey);
    if (dayAgg) {
      dayAgg.totalSessions++;
      dayAgg.totalPlayTime += session.duration;
    }
  }

  /**
   * Updates metric aggregation cache.
   */
  private updateMetricAggregation(metric: AnalyticsMetric): void {
    // Metric aggregations are tracked via the by-day structure
    const dayKey = metric.recordedAt.toISOString().split('T')[0];
    let dayAgg = this.aggregationCache.byDay.get(dayKey);
    if (!dayAgg) {
      dayAgg = {
        date: dayKey,
        totalEvents: 0,
        totalSessions: 0,
        totalPlayTime: 0,
        eventTypes: {},
      };
      this.aggregationCache.byDay.set(dayKey, dayAgg);
    }
  }

  /**
   * Updates session activity timestamp.
   */
  private updateSessionActivity(sessionId: string): void {
    const activeState = this.activeSessions.get(sessionId);
    if (activeState) {
      activeState.lastActivityAt = new Date();
    }
  }

  // ============ Health & Metrics ============

  /**
   * Gets service health metrics.
   */
  getHealthMetrics(): {
    activeSessions: number;
    validationFailures: number;
    repositoryFailures: number;
    eventFailures: number;
    metricFailures: number;
    aggregationCacheSize: number;
  } {
    return {
      activeSessions: this.activeSessions.size,
      validationFailures: this.validationFailures,
      repositoryFailures: this.repositoryFailures,
      eventFailures: this.eventFailures,
      metricFailures: this.metricFailures,
      aggregationCacheSize: 
        this.aggregationCache.byPlayer.size +
        this.aggregationCache.bySession.size +
        this.aggregationCache.byDay.size,
    };
  }

  /**
   * Resets health metrics counters.
   */
  resetHealthMetrics(): void {
    this.validationFailures = 0;
    this.repositoryFailures = 0;
    this.eventFailures = 0;
    this.metricFailures = 0;
    logger.info('Health metrics reset');
  }

  // ============ Session Cleanup ============

  /**
   * Ends all active sessions.
   */
  async endAllSessions(): Promise<number> {
    const sessionIds = Array.from(this.activeSessions.keys());
    let endedCount = 0;

    for (const sessionId of sessionIds) {
      const result = await this.endSession(sessionId);
      if (result) {
        endedCount++;
      }
    }

    logger.info('All sessions ended', { endedCount });
    return endedCount;
  }

  /**
   * Shuts down the analytics service gracefully.
   */
  async shutdown(): Promise<void> {
    logger.info('Shutting down AnalyticsService...');
    
    // End all active sessions
    await this.endAllSessions();
    
    // Clear aggregation cache
    this.clearAggregationCache();
    
    logger.info('AnalyticsService shutdown complete');
  }
}
