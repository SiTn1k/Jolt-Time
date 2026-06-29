/**
 * AnalyticsService Tests
 *
 * Unit tests for the AnalyticsService.
 * Uses mocked repository for isolated testing.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AnalyticsService } from '../services/AnalyticsService';
import { IAnalyticsRepository } from '../interfaces/IAnalyticsRepository';
import { AnalyticsEvent, AnalyticsEventRecord } from '../entities/AnalyticsEvent';
import { AnalyticsSession, AnalyticsSessionRecord } from '../entities/AnalyticsSession';
import { AnalyticsMetric, AnalyticsMetricRecord } from '../entities/AnalyticsMetric';
import { AnalyticsEventId } from '../value-objects/AnalyticsEventId';
import { SessionId } from '../value-objects/SessionId';
import { MetricId } from '../value-objects/MetricId';
import { AnalyticsEventType } from '../types/AnalyticsEventType';
import { MetricType, MetricUnit } from '../types/MetricType';
import type { PaginatedResult, PaginationParams } from '../../../shared/types/base.types';

// Mock repository implementation
class MockAnalyticsRepository implements IAnalyticsRepository {
  private events: AnalyticsEvent[] = [];
  private sessions: AnalyticsSession[] = [];
  private metrics: AnalyticsMetric[] = [];

  async recordEvent(event: AnalyticsEvent): Promise<AnalyticsEvent> {
    this.events.push(event);
    return event;
  }

  async findEventById(id: AnalyticsEventId): Promise<AnalyticsEvent | null> {
    return this.events.find(e => e.eventId.value === id.value) || null;
  }

  async listEvents(
    params: PaginationParams,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _filters?: { playerProfileId?: string; eventType?: AnalyticsEventType }
  ): Promise<PaginatedResult<AnalyticsEvent>> {
    const start = (params.page - 1) * params.pageSize;
    const items = this.events.slice(start, start + params.pageSize);
    return {
      items,
      total: this.events.length,
      page: params.page,
      pageSize: params.pageSize,
      totalPages: Math.ceil(this.events.length / params.pageSize),
      hasNextPage: start + params.pageSize < this.events.length,
      hasPreviousPage: params.page > 1,
    };
  }

  async countEvents(): Promise<number> {
    return this.events.length;
  }

  async createSession(session: AnalyticsSession): Promise<AnalyticsSession> {
    this.sessions.push(session);
    return session;
  }

  async findSessionById(id: SessionId): Promise<AnalyticsSession | null> {
    return this.sessions.find(s => s.sessionId.value === id.value) || null;
  }

  async updateSession(session: AnalyticsSession): Promise<AnalyticsSession> {
    const index = this.sessions.findIndex(s => s.sessionId.value === session.sessionId.value);
    if (index >= 0) {
      this.sessions[index] = session;
    }
    return session;
  }

  async listSessions(
    params: PaginationParams,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _filters?: { playerProfileId?: string }
  ): Promise<PaginatedResult<AnalyticsSession>> {
    const start = (params.page - 1) * params.pageSize;
    const items = this.sessions.slice(start, start + params.pageSize);
    return {
      items,
      total: this.sessions.length,
      page: params.page,
      pageSize: params.pageSize,
      totalPages: Math.ceil(this.sessions.length / params.pageSize),
      hasNextPage: start + params.pageSize < this.sessions.length,
      hasPreviousPage: params.page > 1,
    };
  }

  async countSessions(): Promise<number> {
    return this.sessions.length;
  }

  async recordMetric(metric: AnalyticsMetric): Promise<AnalyticsMetric> {
    this.metrics.push(metric);
    return metric;
  }

  async findMetricById(id: MetricId): Promise<AnalyticsMetric | null> {
    return this.metrics.find(m => m.metricId.value === id.value) || null;
  }

  async listMetrics(
    params: PaginationParams,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _filters?: { metricName?: string }
  ): Promise<PaginatedResult<AnalyticsMetric>> {
    const start = (params.page - 1) * params.pageSize;
    const items = this.metrics.slice(start, start + params.pageSize);
    return {
      items,
      total: this.metrics.length,
      page: params.page,
      pageSize: params.pageSize,
      totalPages: Math.ceil(this.metrics.length / params.pageSize),
      hasNextPage: start + params.pageSize < this.metrics.length,
      hasPreviousPage: params.page > 1,
    };
  }

  async countMetrics(): Promise<number> {
    return this.metrics.length;
  }

  // Test helpers
  getEvents(): AnalyticsEvent[] {
    return this.events;
  }

  getSessions(): AnalyticsSession[] {
    return this.sessions;
  }

  getMetrics(): AnalyticsMetric[] {
    return this.metrics;
  }

  clear(): void {
    this.events = [];
    this.sessions = [];
    this.metrics = [];
  }
}

describe('AnalyticsService', () => {
  let mockRepository: MockAnalyticsRepository;
  let analyticsService: AnalyticsService;

  const TEST_PLAYER_PROFILE_ID = '123e4567-e89b-42d3-a456-426614174000';

  beforeEach(() => {
    mockRepository = new MockAnalyticsRepository();
    analyticsService = new AnalyticsService(mockRepository);
  });

  describe('recordEvent', () => {
    it('should record a valid event', async () => {
      const sessionId = SessionId.generate().value;

      const result = await analyticsService.recordEvent({
        eventType: AnalyticsEventType.GAMEPLAY,
        playerProfileId: TEST_PLAYER_PROFILE_ID,
        sessionId,
        sourceModule: 'test-module',
        payload: { key: 'value' },
      });

      expect(result).not.toBeNull();
      expect(result?.eventType).toBe(AnalyticsEventType.GAMEPLAY);
      expect(result?.playerProfileId).toBe(TEST_PLAYER_PROFILE_ID);
      expect(result?.sourceModule).toBe('test-module');
    });

    it('should return null for invalid event type', async () => {
      const sessionId = SessionId.generate().value;

      const result = await analyticsService.recordEvent({
        // @ts-expect-error - Testing invalid input
        eventType: 'invalid_type',
        playerProfileId: TEST_PLAYER_PROFILE_ID,
        sessionId,
        sourceModule: 'test-module',
      });

      expect(result).toBeNull();
      expect(mockRepository.getEvents().length).toBe(0);
    });

    it('should return null for missing player profile ID', async () => {
      const sessionId = SessionId.generate().value;

      const result = await analyticsService.recordEvent({
        eventType: AnalyticsEventType.GAMEPLAY,
        playerProfileId: '',
        sessionId,
        sourceModule: 'test-module',
      });

      expect(result).toBeNull();
    });

    it('should return null for missing session ID', async () => {
      const result = await analyticsService.recordEvent({
        eventType: AnalyticsEventType.GAMEPLAY,
        playerProfileId: TEST_PLAYER_PROFILE_ID,
        sessionId: '',
        sourceModule: 'test-module',
      });

      expect(result).toBeNull();
    });
  });

  describe('startSession', () => {
    it('should start a new session', async () => {
      const result = await analyticsService.startSession({
        playerProfileId: TEST_PLAYER_PROFILE_ID,
        device: 'iPhone 15',
        platform: 'iOS',
      });

      expect(result).not.toBeNull();
      expect(result?.playerProfileId).toBe(TEST_PLAYER_PROFILE_ID);
      expect(result?.device).toBe('iPhone 15');
      expect(result?.platform).toBe('iOS');
      expect(result?.endedAt).toBeNull();
    });

    it('should return null for missing player profile ID', async () => {
      const result = await analyticsService.startSession({
        playerProfileId: '',
        device: 'iPhone 15',
        platform: 'iOS',
      });

      expect(result).toBeNull();
    });

    it('should track active session', async () => {
      const session = await analyticsService.startSession({
        playerProfileId: TEST_PLAYER_PROFILE_ID,
      });

      const activeSession = analyticsService.getActiveSession(TEST_PLAYER_PROFILE_ID);
      expect(activeSession).not.toBeNull();
      expect(activeSession?.sessionId.value).toBe(session?.sessionId.value);
    });
  });

  describe('endSession', () => {
    it('should end an active session', async () => {
      const session = await analyticsService.startSession({
        playerProfileId: TEST_PLAYER_PROFILE_ID,
      });

      const endedSession = await analyticsService.endSession(session!.sessionId.value);

      expect(endedSession).not.toBeNull();
      expect(endedSession?.endedAt).not.toBeNull();
      expect(analyticsService.getActiveSession(TEST_PLAYER_PROFILE_ID)).toBeNull();
    });

    it('should return null for non-active session', async () => {
      const result = await analyticsService.endSession('non-existent-session');
      expect(result).toBeNull();
    });
  });

  describe('sendHeartbeat', () => {
    it('should process heartbeat for active session', async () => {
      const session = await analyticsService.startSession({
        playerProfileId: TEST_PLAYER_PROFILE_ID,
      });

      const result = await analyticsService.sendHeartbeat(session!.sessionId.value);
      expect(result).toBe(true);
    });

    it('should return false for non-active session', async () => {
      const result = await analyticsService.sendHeartbeat('non-existent-session');
      expect(result).toBe(false);
    });
  });

  describe('recordMetric', () => {
    it('should record a valid metric', async () => {
      const result = await analyticsService.recordMetric({
        metricName: 'play_time',
        metricValue: 3600,
        metricType: MetricType.COUNTER,
        metricUnit: MetricUnit.SECONDS,
      });

      expect(result).not.toBeNull();
      expect(result?.metricName).toBe('play_time');
      expect(result?.metricValue).toBe(3600);
      expect(result?.metricType).toBe(MetricType.COUNTER);
      expect(result?.metricUnit).toBe(MetricUnit.SECONDS);
    });

    it('should return null for invalid metric name', async () => {
      const result = await analyticsService.recordMetric({
        metricName: '' as any,
        metricValue: 3600,
        metricType: MetricType.COUNTER,
        metricUnit: MetricUnit.SECONDS,
      });

      expect(result).toBeNull();
    });

    it('should return null for invalid metric type', async () => {
      const result = await analyticsService.recordMetric({
        metricName: 'play_time',
        metricValue: 3600,
        metricType: 'invalid' as any,
        metricUnit: MetricUnit.SECONDS,
      });

      expect(result).toBeNull();
    });
  });

  describe('getActiveSessions', () => {
    it('should return all active sessions', async () => {
      await analyticsService.startSession({
        playerProfileId: 'player-1',
      });

      await analyticsService.startSession({
        playerProfileId: 'player-2',
      });

      const activeSessions = analyticsService.getActiveSessions();
      expect(activeSessions.length).toBe(2);
    });
  });

  describe('detectInactiveSessions', () => {
    it('should detect inactive sessions with short timeout', async () => {
      // Create service with very short inactive timeout
      const shortTimeoutService = new AnalyticsService(mockRepository, {
        inactiveSessionTimeoutMs: 1, // 1ms timeout
      });

      const session = await shortTimeoutService.startSession({
        playerProfileId: TEST_PLAYER_PROFILE_ID,
      });

      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 10));

      const inactiveSessions = await shortTimeoutService.detectInactiveSessions();

      expect(inactiveSessions.length).toBe(1);
      expect(inactiveSessions[0]).toBe(session!.sessionId.value);
    });
  });

  describe('getHealthMetrics', () => {
    it('should return health metrics', async () => {
      const metrics = analyticsService.getHealthMetrics();

      expect(metrics.activeSessions).toBe(0);
      expect(metrics.validationFailures).toBe(0);
      expect(metrics.eventFailures).toBe(0);
      expect(metrics.metricFailures).toBe(0);
    });
  });

  describe('resetHealthMetrics', () => {
    it('should reset health metrics', async () => {
      // Record an invalid event to increment failures
      await analyticsService.recordEvent({
        // @ts-expect-error - Testing invalid input
        eventType: 'invalid',
        playerProfileId: 'invalid',
        sessionId: 'invalid',
        sourceModule: 'invalid',
      });

      expect(analyticsService.getHealthMetrics().validationFailures).toBeGreaterThan(0);

      analyticsService.resetHealthMetrics();

      expect(analyticsService.getHealthMetrics().validationFailures).toBe(0);
    });
  });

  describe('endAllSessions', () => {
    it('should end all active sessions', async () => {
      await analyticsService.startSession({ playerProfileId: 'player-1' });
      await analyticsService.startSession({ playerProfileId: 'player-2' });

      expect(analyticsService.getActiveSessions().length).toBe(2);

      const endedCount = await analyticsService.endAllSessions();

      expect(endedCount).toBe(2);
      expect(analyticsService.getActiveSessions().length).toBe(0);
    });
  });

  describe('shutdown', () => {
    it('should shutdown gracefully', async () => {
      await analyticsService.startSession({ playerProfileId: 'player-1' });

      await analyticsService.shutdown();

      expect(analyticsService.getActiveSessions().length).toBe(0);
    });
  });
});
