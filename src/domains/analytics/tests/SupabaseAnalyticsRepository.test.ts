/**
 * SupabaseAnalyticsRepository Tests
 *
 * Unit tests for the SupabaseAnalyticsRepository.
 * Uses mocked Supabase client for isolated testing.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { SupabaseAnalyticsRepository } from '../repositories/SupabaseAnalyticsRepository';
import { AnalyticsEvent } from '../entities/AnalyticsEvent';
import { AnalyticsSession } from '../entities/AnalyticsSession';
import { AnalyticsMetric } from '../entities/AnalyticsMetric';
import { AnalyticsEventId } from '../value-objects/AnalyticsEventId';
import { SessionId } from '../value-objects/SessionId';
import { MetricId } from '../value-objects/MetricId';
import { AnalyticsEventType } from '../types/AnalyticsEventType';
import { MetricType, MetricUnit } from '../types/MetricType';

// Mock Supabase client
interface MockSupabaseRow {
  [key: string]: unknown;
}

class MockSupabaseClient {
  private data: Map<string, MockSupabaseRow[]> = new Map();
  private tables = ['analytics_events', 'analytics_sessions', 'analytics_metrics'];

  from(tableName: string) {
    const tableData = this.data.get(tableName) || [];
    
    const query = {
      select: () => query,
      insert: (row: MockSupabaseRow) => ({ 
        select: () => ({ single: async () => ({ data: row, error: null }) }),
      }),
      update: (row: MockSupabaseRow) => ({
        eq: () => ({ select: () => ({ single: async () => ({ data: row, error: null }) }) }),
      }),
      eq: (field: string, value: unknown) => ({
        single: async () => {
          const found = tableData.find(row => row[field] === value);
          if (!found) {
            return { data: null, error: { code: 'PGRST116' } };
          }
          return { data: found, error: null };
        },
        select: () => ({
          count: 'exact',
          range: (from: number, to: number) => ({
            order: () => ({
              items: tableData.slice(from, to + 1),
              error: null,
            }),
          }),
          select: () => query,
        }),
      }),
      gte: (field: string, value: unknown) => query,
      lte: (field: string, value: unknown) => query,
      order: (field: string, options: { ascending: boolean }) => ({
        range: (from: number, to: number) => ({
          items: tableData.slice(from, to + 1),
          error: null,
        }),
      }),
      range: (from: number, to: number) => ({
        order: () => ({
          items: tableData.slice(from, to + 1),
          error: null,
        }),
      }),
    };

    return query;
  }

  setTableData(tableName: string, rows: MockSupabaseRow[]) {
    this.data.set(tableName, rows);
  }

  clear() {
    this.data.clear();
  }
}

describe('SupabaseAnalyticsRepository', () => {
  let mockClient: MockSupabaseClient;
  let repository: SupabaseAnalyticsRepository;

  const TEST_EVENT_ID = '123e4567-e89b-42d3-a456-426614174000';
  const TEST_SESSION_ID = '123e4567-e89b-42d3-a456-426614174001';
  const TEST_METRIC_ID = '123e4567-e89b-42d3-a456-426614174002';
  const TEST_PLAYER_PROFILE_ID = '123e4567-e89b-42d3-a456-426614174003';

  beforeEach(() => {
    mockClient = new MockSupabaseClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    repository = new SupabaseAnalyticsRepository(mockClient as any);
  });

  describe('recordEvent', () => {
    it('should record an analytics event', async () => {
      const event = AnalyticsEvent.create({
        eventId: AnalyticsEventId.reconstruct(TEST_EVENT_ID),
        eventType: AnalyticsEventType.GAMEPLAY,
        playerProfileId: TEST_PLAYER_PROFILE_ID,
        sessionId: SessionId.reconstruct(TEST_SESSION_ID),
        sourceModule: 'test-module',
        payload: { key: 'value' },
      });

      const result = await repository.recordEvent(event);

      expect(result).toBeDefined();
      expect(result.eventId.value).toBe(TEST_EVENT_ID);
      expect(result.eventType).toBe(AnalyticsEventType.GAMEPLAY);
    });
  });

  describe('findEventById', () => {
    it('should return null for non-existent event', async () => {
      const eventId = AnalyticsEventId.generate();
      const result = await repository.findEventById(eventId);
      expect(result).toBeNull();
    });
  });

  describe('countEvents', () => {
    it('should return 0 when no events exist', async () => {
      const count = await repository.countEvents();
      expect(count).toBe(0);
    });
  });

  describe('createSession', () => {
    it('should create an analytics session', async () => {
      const session = AnalyticsSession.create({
        sessionId: SessionId.reconstruct(TEST_SESSION_ID),
        playerProfileId: TEST_PLAYER_PROFILE_ID,
        device: 'iPhone 15',
        platform: 'iOS',
      });

      const result = await repository.createSession(session);

      expect(result).toBeDefined();
      expect(result.sessionId.value).toBe(TEST_SESSION_ID);
      expect(result.playerProfileId).toBe(TEST_PLAYER_PROFILE_ID);
    });
  });

  describe('findSessionById', () => {
    it('should return null for non-existent session', async () => {
      const sessionId = SessionId.generate();
      const result = await repository.findSessionById(sessionId);
      expect(result).toBeNull();
    });
  });

  describe('countSessions', () => {
    it('should return 0 when no sessions exist', async () => {
      const count = await repository.countSessions();
      expect(count).toBe(0);
    });
  });

  describe('recordMetric', () => {
    it('should record an analytics metric', async () => {
      const metric = AnalyticsMetric.create({
        metricId: MetricId.reconstruct(TEST_METRIC_ID),
        metricName: 'play_time',
        metricValue: 3600,
        metricType: MetricType.COUNTER,
        metricUnit: MetricUnit.SECONDS,
      });

      const result = await repository.recordMetric(metric);

      expect(result).toBeDefined();
      expect(result.metricId.value).toBe(TEST_METRIC_ID);
      expect(result.metricName).toBe('play_time');
      expect(result.metricValue).toBe(3600);
    });
  });

  describe('findMetricById', () => {
    it('should return null for non-existent metric', async () => {
      const metricId = MetricId.generate();
      const result = await repository.findMetricById(metricId);
      expect(result).toBeNull();
    });
  });

  describe('countMetrics', () => {
    it('should return 0 when no metrics exist', async () => {
      const count = await repository.countMetrics();
      expect(count).toBe(0);
    });
  });
});
