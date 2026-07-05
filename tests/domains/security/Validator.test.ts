/**
 * Security Validator Tests
 *
 * Tests for IncidentValidator, PolicyValidator, and SessionValidator.
 */

import { describe, it, expect } from 'vitest';
import { IncidentValidator } from '../../../src/domains/security/validators/IncidentValidator';
import { PolicyValidator } from '../../../src/domains/security/validators/PolicyValidator';
import { SessionValidator } from '../../../src/domains/security/validators/SessionValidator';

describe('IncidentValidator', () => {
  describe('validateIncidentType', () => {
    it('should reject null incident type', () => {
      const result = IncidentValidator.validateIncidentType(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Incident type is required');
    });

    it('should reject empty incident type', () => {
      const result = IncidentValidator.validateIncidentType('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Incident type cannot be empty');
    });

    it('should reject incident type longer than 128 chars', () => {
      const longType = 'a'.repeat(129);
      const result = IncidentValidator.validateIncidentType(longType);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Incident type must be at most 128 characters');
    });

    it('should accept valid incident type', () => {
      const result = IncidentValidator.validateIncidentType('brute_force_attack');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateSeverity', () => {
    it('should reject null severity', () => {
      const result = IncidentValidator.validateSeverity(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Severity is required');
    });

    it('should reject invalid severity', () => {
      const result = IncidentValidator.validateSeverity('invalid');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Invalid severity');
    });

    it('should accept valid severity levels', () => {
      expect(IncidentValidator.validateSeverity('low').isValid).toBe(true);
      expect(IncidentValidator.validateSeverity('medium').isValid).toBe(true);
      expect(IncidentValidator.validateSeverity('high').isValid).toBe(true);
      expect(IncidentValidator.validateSeverity('critical').isValid).toBe(true);
    });
  });

  describe('validateStatus', () => {
    it('should reject null status', () => {
      const result = IncidentValidator.validateStatus(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Status is required');
    });

    it('should reject invalid status', () => {
      const result = IncidentValidator.validateStatus('invalid');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Invalid status');
    });

    it('should accept valid statuses', () => {
      expect(IncidentValidator.validateStatus('open').isValid).toBe(true);
      expect(IncidentValidator.validateStatus('investigating').isValid).toBe(true);
      expect(IncidentValidator.validateStatus('resolved').isValid).toBe(true);
      expect(IncidentValidator.validateStatus('closed').isValid).toBe(true);
      expect(IncidentValidator.validateStatus('escalated').isValid).toBe(true);
    });
  });

  describe('validateActorId', () => {
    it('should reject null actor ID', () => {
      const result = IncidentValidator.validateActorId(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Actor ID is required');
    });

    it('should reject empty actor ID', () => {
      const result = IncidentValidator.validateActorId('  ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Actor ID cannot be empty');
    });

    it('should accept valid actor ID', () => {
      const result = IncidentValidator.validateActorId('actor-123');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateSource', () => {
    it('should reject null source', () => {
      const result = IncidentValidator.validateSource(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Source is required');
    });

    it('should reject empty source', () => {
      const result = IncidentValidator.validateSource('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Source is required');
    });

    it('should reject source longer than 256 chars', () => {
      const longSource = 'a'.repeat(257);
      const result = IncidentValidator.validateSource(longSource);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Source must be at most 256 characters');
    });

    it('should accept valid source', () => {
      const result = IncidentValidator.validateSource('session_management');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateDescription', () => {
    it('should reject null description', () => {
      const result = IncidentValidator.validateDescription(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Description is required');
    });

    it('should reject empty description', () => {
      const result = IncidentValidator.validateDescription('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Description is required');
    });

    it('should reject description longer than 2048 chars', () => {
      const longDesc = 'a'.repeat(2049);
      const result = IncidentValidator.validateDescription(longDesc);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Description must be at most 2048 characters');
    });

    it('should accept valid description', () => {
      const result = IncidentValidator.validateDescription('Multiple failed login attempts detected');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateMetadata', () => {
    it('should accept null metadata', () => {
      const result = IncidentValidator.validateMetadata(null);
      expect(result.isValid).toBe(true);
    });

    it('should accept valid metadata', () => {
      const result = IncidentValidator.validateMetadata({
        ipAddress: '127.0.0.1',
        location: 'New York',
        notes: 'Test note',
      });
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateIncident', () => {
    it('should validate complete incident', () => {
      const result = IncidentValidator.validateIncident({
        incidentType: 'test',
        severity: 'low',
        status: 'open',
        actorId: 'actor-1',
        source: 'test',
        description: 'Test description',
      });
      expect(result.isValid).toBe(true);
    });

    it('should fail on first invalid field', () => {
      const result = IncidentValidator.validateIncident({
        incidentType: null,
        severity: 'low',
        status: 'open',
        actorId: 'actor-1',
        source: 'test',
        description: 'Test description',
      });
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateIncidentOrThrow', () => {
    it('should throw on invalid incident', () => {
      expect(() => {
        IncidentValidator.validateIncidentOrThrow({
          incidentType: null,
          severity: 'low',
          status: 'open',
          actorId: 'actor-1',
          source: 'test',
          description: 'Test',
        });
      }).toThrow('Incident validation failed');
    });

    it('should not throw on valid incident', () => {
      expect(() => {
        IncidentValidator.validateIncidentOrThrow({
          incidentType: 'test',
          severity: 'low',
          status: 'open',
          actorId: 'actor-1',
          source: 'test',
          description: 'Test',
        });
      }).not.toThrow();
    });
  });
});

describe('PolicyValidator', () => {
  describe('validatePolicyName', () => {
    it('should reject null policy name', () => {
      const result = PolicyValidator.validatePolicyName(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Policy name is required');
    });

    it('should reject empty policy name', () => {
      const result = PolicyValidator.validatePolicyName('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Policy name cannot be empty');
    });

    it('should accept valid policy name', () => {
      const result = PolicyValidator.validatePolicyName('Rate Limiting Policy');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validatePolicyType', () => {
    it('should reject null policy type', () => {
      const result = PolicyValidator.validatePolicyType(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Policy type is required');
    });

    it('should reject invalid policy type', () => {
      const result = PolicyValidator.validatePolicyType('invalid_type');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Invalid policy type');
    });

    it('should accept valid policy types', () => {
      expect(PolicyValidator.validatePolicyType('rate_limiting').isValid).toBe(true);
      expect(PolicyValidator.validatePolicyType('access_control').isValid).toBe(true);
      expect(PolicyValidator.validatePolicyType('ip_whitelist').isValid).toBe(true);
    });
  });

  describe('validateConfiguration', () => {
    it('should accept null configuration', () => {
      const result = PolicyValidator.validateConfiguration(null);
      expect(result.isValid).toBe(true);
    });

    it('should accept valid configuration object', () => {
      const result = PolicyValidator.validateConfiguration({ maxAttempts: 5, timeout: 30 });
      expect(result.isValid).toBe(true);
    });
  });

  describe('validatePolicy', () => {
    it('should validate complete policy', () => {
      const result = PolicyValidator.validatePolicy({
        policyName: 'Test Policy',
        policyType: 'rate_limiting',
        enabled: true,
        configuration: { maxAttempts: 5 },
      });
      expect(result.isValid).toBe(true);
    });
  });
});

describe('SessionValidator', () => {
  describe('validateActorId', () => {
    it('should reject null actor ID', () => {
      const result = SessionValidator.validateActorId(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Actor ID is required');
    });

    it('should accept valid actor ID', () => {
      const result = SessionValidator.validateActorId('actor-123');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateStatus', () => {
    it('should reject invalid status', () => {
      const result = SessionValidator.validateStatus('invalid');
      expect(result.isValid).toBe(false);
    });

    it('should accept valid statuses', () => {
      expect(SessionValidator.validateStatus('active').isValid).toBe(true);
      expect(SessionValidator.validateStatus('expired').isValid).toBe(true);
      expect(SessionValidator.validateStatus('revoked').isValid).toBe(true);
    });
  });

  describe('validateIpAddress', () => {
    it('should reject null IP address', () => {
      const result = SessionValidator.validateIpAddress(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('IP address is required');
    });

    it('should accept valid IP address', () => {
      const result = SessionValidator.validateIpAddress('192.168.1.1');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateDevice', () => {
    it('should reject null device', () => {
      const result = SessionValidator.validateDevice(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Device is required');
    });

    it('should reject device longer than 512 chars', () => {
      const longDevice = 'a'.repeat(513);
      const result = SessionValidator.validateDevice(longDevice);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Device must be at most 512 characters');
    });

    it('should accept valid device', () => {
      const result = SessionValidator.validateDevice('Mozilla/5.0 (Windows NT 10.0)');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateExpiresAt', () => {
    it('should reject null expiration', () => {
      const result = SessionValidator.validateExpiresAt(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Expiration date is required');
    });

    it('should accept valid date', () => {
      const result = SessionValidator.validateExpiresAt(new Date());
      expect(result.isValid).toBe(true);
    });

    it('should accept valid date string', () => {
      const result = SessionValidator.validateExpiresAt('2024-12-31T23:59:59.000Z');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateSession', () => {
    it('should validate complete session', () => {
      const result = SessionValidator.validateSession({
        actorId: 'actor-1',
        status: 'active',
        ipAddress: '127.0.0.1',
        device: 'test-device',
        expiresAt: new Date(),
      });
      expect(result.isValid).toBe(true);
    });
  });
});
