/**
 * AnalyticsMapper Tests
 *
 * Unit tests for the AnalyticsMapper.
 */

import { describe, it, expect } from 'vitest';
import { AnalyticsMapper } from '../mappers/AnalyticsMapper';
import { AnalyticsEvent } from '../entities/AnalyticsEvent';
import { AnalyticsEventId } from '../value-objects/AnalyticsEventId';
import { SessionId } from '../value-objects/SessionId';
import { AnalyticsEventType } from '../types/AnalyticsEventType';
import type { CreateAnalyticsEventDto } from '../dto/AnalyticsEvent.dto';

describe('AnalyticsMapper', () => {
  const TEST_EVENT_ID = '123e4567-e89b-42d3-a456-426614174000';
  const TEST_SESSION_ID = '123e4567-e89b-42d3-a456-426614174001';
  const TEST_PLAYER_PROFILE_ID = '123e4567-e89b-42d3-a456-426614174002';

  const createTestEvent = (): AnalyticsEvent => {
    return AnalyticsEvent.create({
      eventId: AnalyticsEventId.reconstruct(TEST_EVENT_ID),
      eventType: AnalyticsEventType.GAMEPLAY,
      playerProfileId: TEST_PLAYER_PROFILE_ID,
      sessionId: SessionId.reconstruct(TEST_SESSION_ID),
      sourceModule: 'test-module',
      payload: { key: 'value' },
    });
  };

  describe('toResponse', () => {
    it('should convert event to response DTO', () => {
      const event = createTestEvent();
      const response = AnalyticsMapper.toResponse(event);

      expect(response.eventId).toBe(TEST_EVENT_ID);
      expect(response.eventType).toBe(AnalyticsEventType.GAMEPLAY);
      expect(response.playerProfileId).toBe(TEST_PLAYER_PROFILE_ID);
      expect(response.sessionId).toBe(TEST_SESSION_ID);
      expect(response.sourceModule).toBe('test-module');
      expect(response.payload).toEqual({ key: 'value' });
      expect(response.createdAt).toBeDefined();
    });
  });

  describe('toResponseList', () => {
    it('should convert array of events to response DTOs', () => {
      const events = [createTestEvent(), createTestEvent()];
      const responses = AnalyticsMapper.toResponseList(events);

      expect(responses).toHaveLength(2);
      expect(responses[0].eventId).toBe(TEST_EVENT_ID);
      expect(responses[1].eventId).toBe(TEST_EVENT_ID);
    });
  });

  describe('fromCreateDto', () => {
    it('should convert DTO to entity input', () => {
      const dto: CreateAnalyticsEventDto = {
        eventType: AnalyticsEventType.GAMEPLAY,
        playerProfileId: TEST_PLAYER_PROFILE_ID,
        sessionId: TEST_SESSION_ID,
        sourceModule: 'test-module',
        payload: { key: 'value' },
      };

      const input = AnalyticsMapper.fromCreateDto(dto);

      expect(input.eventType).toBe(AnalyticsEventType.GAMEPLAY);
      expect(input.playerProfileId).toBe(TEST_PLAYER_PROFILE_ID);
      expect(input.sessionId).toBe(TEST_SESSION_ID);
      expect(input.sourceModule).toBe('test-module');
    });
  });

  describe('fromRecordToDto', () => {
    it('should convert database record to DTO', () => {
      const record = {
        event_id: TEST_EVENT_ID,
        event_type: AnalyticsEventType.GAMEPLAY,
        player_profile_id: TEST_PLAYER_PROFILE_ID,
        session_id: TEST_SESSION_ID,
        source_module: 'test-module',
        payload: { key: 'value' },
        created_at: new Date().toISOString(),
      };

      const dto = AnalyticsMapper.fromRecordToDto(record);

      expect(dto.eventType).toBe(AnalyticsEventType.GAMEPLAY);
      expect(dto.playerProfileId).toBe(TEST_PLAYER_PROFILE_ID);
      expect(dto.sessionId).toBe(TEST_SESSION_ID);
      expect(dto.sourceModule).toBe('test-module');
    });
  });

  describe('toRecord', () => {
    it('should convert event to database record format', () => {
      const event = createTestEvent();
      const record = AnalyticsMapper.toRecord(event);

      expect(record.event_id).toBe(TEST_EVENT_ID);
      expect(record.event_type).toBe(AnalyticsEventType.GAMEPLAY);
      expect(record.player_profile_id).toBe(TEST_PLAYER_PROFILE_ID);
      expect(record.session_id).toBe(TEST_SESSION_ID);
      expect(record.source_module).toBe('test-module');
    });
  });
});
