/**
 * Security Repository Tests
 *
 * Tests for SupabaseSecurityRepository.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SupabaseSecurityRepository } from '../../../src/domains/security/repositories/SupabaseSecurityRepository';
import { SecurityIncident, IncidentSeverity, IncidentStatus } from '../../../src/domains/security/entities/SecurityIncident';
import { SecurityPolicy, PolicyType } from '../../../src/domains/security/entities/SecurityPolicy';
import { SecuritySession, SessionStatus } from '../../../src/domains/security/entities/SecuritySession';

// Mock Supabase client
const createMockClient = () => {
  const mockData: Record<string, unknown[]> = {
    security_incidents: [],
    security_policies: [],
    security_sessions: [],
  };

  return {
    from: vi.fn((table: string) => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null })),
          select: vi.fn(() => ({
            range: vi.fn(() => Promise.resolve({ data: [], error: null, count: 0 })),
          })),
          update: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn(() => Promise.resolve({ data: null, error: null })),
            })),
          })),
        })),
        order: vi.fn(() => ({
          range: vi.fn(() => Promise.resolve({ data: [], error: null, count: 0 })),
        })),
        range: vi.fn(() => Promise.resolve({ data: [], error: null, count: 0 })),
        update: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({ error: null, count: 0 })),
          select: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({ data: null, error: null })),
          })),
        })),
      })),
    })),
    mockData,
  };
};

describe('SupabaseSecurityRepository', () => {
  let repository: SupabaseSecurityRepository;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockClient: any;

  beforeEach(() => {
    mockClient = createMockClient();
    repository = new SupabaseSecurityRepository(mockClient);
  });

  describe('Entity Creation (Unit Tests)', () => {
    it('should create a SecurityIncident entity', () => {
      const incident = SecurityIncident.create({
        incidentType: 'test_incident',
        severity: IncidentSeverity.LOW,
        status: IncidentStatus.OPEN,
        actorId: 'actor-1',
        source: 'test',
        description: 'Test incident description',
      });

      expect(incident).toBeDefined();
      expect(incident.incidentType).toBe('test_incident');
      expect(incident.severity).toBe(IncidentSeverity.LOW);
      expect(incident.status).toBe(IncidentStatus.OPEN);
      expect(incident.actorId).toBe('actor-1');
      expect(incident.incidentId.value).toBeDefined();
    });

    it('should create a SecurityPolicy entity', () => {
      const policy = SecurityPolicy.create({
        policyName: 'Test Policy',
        policyType: PolicyType.ACCESS_CONTROL,
        enabled: true,
        configuration: { maxAttempts: 5 },
      });

      expect(policy).toBeDefined();
      expect(policy.policyName).toBe('Test Policy');
      expect(policy.policyType).toBe(PolicyType.ACCESS_CONTROL);
      expect(policy.enabled).toBe(true);
      expect(policy.configuration).toEqual({ maxAttempts: 5 });
    });

    it('should create a SecuritySession entity', () => {
      const expiresAt = new Date(Date.now() + 3600000);
      const session = SecuritySession.create({
        actorId: 'actor-1',
        status: SessionStatus.ACTIVE,
        ipAddress: '127.0.0.1',
        device: 'test-device',
        expiresAt,
      });

      expect(session).toBeDefined();
      expect(session.actorId).toBe('actor-1');
      expect(session.status).toBe(SessionStatus.ACTIVE);
      expect(session.ipAddress).toBe('127.0.0.1');
      expect(session.device).toBe('test-device');
    });

    it('should reconstruct SecurityIncident from database record', () => {
      const record = {
        incident_id: '550e8400-e29b-41d4-a716-446655440000',
        incident_type: 'test_type',
        severity: 'high',
        status: 'open',
        actor_id: 'actor-123',
        source: 'test_source',
        description: 'Test description',
        created_at: '2024-01-01T00:00:00.000Z',
        metadata: {},
      };

      const incident = SecurityIncident.fromDatabase(record);

      expect(incident.incidentId.value).toBe('550e8400-e29b-41d4-a716-446655440000');
      expect(incident.incidentType).toBe('test_type');
      expect(incident.severity).toBe(IncidentSeverity.HIGH);
      expect(incident.status).toBe(IncidentStatus.OPEN);
    });

    it('should reconstruct SecurityPolicy from database record', () => {
      const record = {
        policy_id: '550e8400-e29b-41d4-a716-446655440001',
        policy_name: 'Test Policy',
        policy_type: 'access_control',
        enabled: true,
        configuration: { maxAttempts: 10 },
        metadata: {},
      };

      const policy = SecurityPolicy.fromDatabase(record);

      expect(policy.policyId.value).toBe('550e8400-e29b-41d4-a716-446655440001');
      expect(policy.policyName).toBe('Test Policy');
      expect(policy.policyType).toBe(PolicyType.ACCESS_CONTROL);
      expect(policy.enabled).toBe(true);
    });

    it('should reconstruct SecuritySession from database record', () => {
      const record = {
        session_id: '550e8400-e29b-41d4-a716-446655440002',
        actor_id: 'actor-456',
        status: 'active',
        ip_address: '192.168.1.1',
        device: 'mobile-device',
        created_at: '2024-01-01T00:00:00.000Z',
        expires_at: '2024-01-01T01:00:00.000Z',
        metadata: {},
      };

      const session = SecuritySession.fromDatabase(record);

      expect(session.sessionId.value).toBe('550e8400-e29b-41d4-a716-446655440002');
      expect(session.actorId).toBe('actor-456');
      expect(session.status).toBe(SessionStatus.ACTIVE);
      expect(session.ipAddress).toBe('192.168.1.1');
    });
  });

  describe('Value Objects', () => {
    it('should validate IncidentId format', () => {
      const { IncidentId } = require('../../../src/domains/security/value-objects/IncidentId');

      // Valid UUID
      const validId = IncidentId.create('550e8400-e29b-41d4-a716-446655440000');
      expect(validId.value).toBe('550e8400-e29b-41d4-a716-446655440000');

      // Invalid UUID should throw
      expect(() => IncidentId.create('invalid-uuid')).toThrow();
    });

    it('should generate unique IncidentIds', () => {
      const { IncidentId } = require('../../../src/domains/security/value-objects/IncidentId');
      const id1 = IncidentId.generate();
      const id2 = IncidentId.generate();
      expect(id1.value).not.toBe(id2.value);
    });
  });
});
