/**
 * SessionMapper Tests
 *
 * Unit tests for the SessionMapper.
 */

import { describe, it, expect } from 'vitest';
import { SessionMapper } from '../mappers/SessionMapper';
import { AnalyticsSession } from '../entities/AnalyticsSession';
import { SessionId } from '../value-objects/SessionId';
import { SessionStatus } from '../types/SessionStatus';
import type { CreateAnalyticsSessionDto } from '../dto/AnalyticsSession.dto';

describe('SessionMapper', () => {
  const TEST_SESSION_ID = '123e4567-e89b-42d3-a456-426614174000';
  const TEST_PLAYER_PROFILE_ID = '123e4567-e89b-42d3-a456-426614174001';

  const createTestSession = (ended = false): AnalyticsSession => {
    if (ended) {
      // Create a session that has been started and will be ended with a proper duration
      // We need to use fromDatabase to create a session with a duration that won't be abandoned
      return AnalyticsSession.fromDatabase({
        session_id: TEST_SESSION_ID,
        player_profile_id: TEST_PLAYER_PROFILE_ID,
        started_at: new Date(Date.now() - 60000).toISOString(), // Started 1 minute ago
        ended_at: new Date().toISOString(), // Just ended
        duration: 60000, // 1 minute duration
        device: 'iPhone 15',
        platform: 'iOS',
      });
    }
    
    return AnalyticsSession.create({
      sessionId: SessionId.reconstruct(TEST_SESSION_ID),
      playerProfileId: TEST_PLAYER_PROFILE_ID,
      device: 'iPhone 15',
      platform: 'iOS',
    });
  };

  describe('toResponse', () => {
    it('should convert session to response DTO', () => {
      const session = createTestSession(true);
      const response = SessionMapper.toResponse(session);

      expect(response.sessionId).toBe(TEST_SESSION_ID);
      expect(response.playerProfileId).toBe(TEST_PLAYER_PROFILE_ID);
      expect(response.device).toBe('iPhone 15');
      expect(response.platform).toBe('iOS');
      expect(response.endedAt).not.toBeNull();
      expect(response.status).toBe(SessionStatus.ENDED);
    });

    it('should return null endedAt for active session', () => {
      const session = AnalyticsSession.create({
        sessionId: SessionId.reconstruct(TEST_SESSION_ID),
        playerProfileId: TEST_PLAYER_PROFILE_ID,
        device: 'iPhone 15',
        platform: 'iOS',
      });

      const response = SessionMapper.toResponse(session);

      expect(response.endedAt).toBeNull();
      expect(response.status).toBe(SessionStatus.ACTIVE);
    });
  });

  describe('toResponseList', () => {
    it('should convert array of sessions to response DTOs', () => {
      const sessions = [createTestSession(true), createTestSession(true)];
      const responses = SessionMapper.toResponseList(sessions);

      expect(responses).toHaveLength(2);
      expect(responses[0].sessionId).toBe(TEST_SESSION_ID);
      expect(responses[1].sessionId).toBe(TEST_SESSION_ID);
    });
  });

  describe('fromCreateDto', () => {
    it('should convert DTO to entity input', () => {
      const dto: CreateAnalyticsSessionDto = {
        playerProfileId: TEST_PLAYER_PROFILE_ID,
        device: 'iPhone 15',
        platform: 'iOS',
      };

      const input = SessionMapper.fromCreateDto(dto);

      expect(input.playerProfileId).toBe(TEST_PLAYER_PROFILE_ID);
      expect(input.device).toBe('iPhone 15');
      expect(input.platform).toBe('iOS');
    });
  });

  describe('fromRecordToDto', () => {
    it('should convert database record to DTO', () => {
      const record = {
        session_id: TEST_SESSION_ID,
        player_profile_id: TEST_PLAYER_PROFILE_ID,
        started_at: new Date().toISOString(),
        ended_at: new Date().toISOString(),
        duration: 3600000,
        device: 'iPhone 15',
        platform: 'iOS',
      };

      const dto = SessionMapper.fromRecordToDto(record);

      expect(dto.playerProfileId).toBe(TEST_PLAYER_PROFILE_ID);
      expect(dto.device).toBe('iPhone 15');
      expect(dto.platform).toBe('iOS');
    });
  });

  describe('toRecord', () => {
    it('should convert session to database record format', () => {
      const session = createTestSession(true);
      const record = SessionMapper.toRecord(session);

      expect(record.session_id).toBe(TEST_SESSION_ID);
      expect(record.player_profile_id).toBe(TEST_PLAYER_PROFILE_ID);
      expect(record.device).toBe('iPhone 15');
      expect(record.platform).toBe('iOS');
      // Duration should be 0 for a session that just started and ended
      expect(record.duration).toBeGreaterThanOrEqual(0);
    });
  });
});
