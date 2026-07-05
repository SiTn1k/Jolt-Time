/**
 * Security Service Tests
 *
 * Tests for SecurityService covering incidents, sessions, brute force, fraud detection, and permissions.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SecurityService, Permission, PermissionAction } from '../../../src/domains/security/services/SecurityService';
import type { ISecurityRepository } from '../../../src/domains/security/interfaces/ISecurityRepository';
import type { SecurityIncident } from '../../../src/domains/security/entities/SecurityIncident';
import type { SecurityPolicy } from '../../../src/domains/security/entities/SecurityPolicy';
import type { SecuritySession } from '../../../src/domains/security/entities/SecuritySession';
import { IncidentSeverity, IncidentStatus } from '../../../src/domains/security/entities/SecurityIncident';
import { SessionStatus } from '../../../src/domains/security/entities/SecuritySession';
import type { PaginatedResult } from '../../../src/shared/types/base.types';

// Mock repository
const createMockRepository = (): ISecurityRepository => ({
  createIncident: vi.fn(),
  findIncidentById: vi.fn(),
  listIncidents: vi.fn(),
  countIncidents: vi.fn(),
  findIncidentsByActor: vi.fn(),
  createPolicy: vi.fn(),
  findPolicyById: vi.fn(),
  listPolicies: vi.fn(),
  countPolicies: vi.fn(),
  updatePolicy: vi.fn(),
  createSession: vi.fn(),
  findSessionById: vi.fn(),
  listSessions: vi.fn(),
  countSessions: vi.fn(),
  findSessionsByActor: vi.fn(),
  updateSession: vi.fn(),
  expireSessions: vi.fn(),
});

describe('SecurityService', () => {
  let securityService: SecurityService;
  let mockRepository: ISecurityRepository;

  beforeEach(() => {
    mockRepository = createMockRepository();
    securityService = new SecurityService(mockRepository);
  });

  describe('Permission Evaluation', () => {
    it('should grant all permissions to SYSTEM permission', async () => {
      expect(securityService.hasPermission(Permission.SYSTEM, PermissionAction.READ)).toBe(true);
      expect(securityService.hasPermission(Permission.SYSTEM, PermissionAction.WRITE)).toBe(true);
      expect(securityService.hasPermission(Permission.SYSTEM, PermissionAction.DELETE)).toBe(true);
      expect(securityService.hasPermission(Permission.SYSTEM, PermissionAction.ADMIN)).toBe(true);
      expect(securityService.hasPermission(Permission.SYSTEM, PermissionAction.EXECUTE)).toBe(true);
    });

    it('should grant all permissions to SCHEDULER permission', async () => {
      expect(securityService.hasPermission(Permission.SCHEDULER, PermissionAction.EXECUTE)).toBe(true);
    });

    it('should only grant READ permission to PLAYER', () => {
      expect(securityService.hasPermission(Permission.PLAYER, PermissionAction.READ)).toBe(true);
      expect(securityService.hasPermission(Permission.PLAYER, PermissionAction.WRITE)).toBe(false);
      expect(securityService.hasPermission(Permission.PLAYER, PermissionAction.DELETE)).toBe(false);
    });

    it('should grant READ and WRITE to MODERATOR', () => {
      expect(securityService.hasPermission(Permission.MODERATOR, PermissionAction.READ)).toBe(true);
      expect(securityService.hasPermission(Permission.MODERATOR, PermissionAction.WRITE)).toBe(true);
      expect(securityService.hasPermission(Permission.MODERATOR, PermissionAction.DELETE)).toBe(false);
    });

    it('should grant all permissions except EXECUTE to ADMINISTRATOR', () => {
      expect(securityService.hasPermission(Permission.ADMINISTRATOR, PermissionAction.READ)).toBe(true);
      expect(securityService.hasPermission(Permission.ADMINISTRATOR, PermissionAction.WRITE)).toBe(true);
      expect(securityService.hasPermission(Permission.ADMINISTRATOR, PermissionAction.DELETE)).toBe(true);
      expect(securityService.hasPermission(Permission.ADMINISTRATOR, PermissionAction.ADMIN)).toBe(true);
      expect(securityService.hasPermission(Permission.ADMINISTRATOR, PermissionAction.EXECUTE)).toBe(false);
    });

    it('should grant READ and EXECUTE to SERVICE', () => {
      expect(securityService.hasPermission(Permission.SERVICE, PermissionAction.READ)).toBe(true);
      expect(securityService.hasPermission(Permission.SERVICE, PermissionAction.EXECUTE)).toBe(true);
      expect(securityService.hasPermission(Permission.SERVICE, PermissionAction.WRITE)).toBe(false);
    });

    it('should allow SYSTEM to evaluate permission without creating incident', async () => {
      const result = await securityService.evaluatePermission({
        actorId: 'system-actor',
        permission: Permission.SYSTEM,
        action: PermissionAction.DELETE,
      });
      expect(result).toBe(true);
    });

    it('should create incident for unauthorized PLAYER attempting DELETE', async () => {
      (mockRepository.createIncident as ReturnType<typeof vi.fn>).mockResolvedValue({
        incidentId: { value: 'incident-1' } as any,
        incidentType: 'unauthorized_access_attempt',
        severity: IncidentSeverity.MEDIUM,
        status: IncidentStatus.OPEN,
        actorId: 'player-1',
        source: 'permission_engine',
        description: 'test',
        createdAt: new Date(),
        metadata: {},
      });

      const result = await securityService.evaluatePermission({
        actorId: 'player-1',
        permission: Permission.PLAYER,
        action: PermissionAction.DELETE,
      });
      expect(result).toBe(false);
      expect(mockRepository.createIncident).toHaveBeenCalled();
    });
  });

  describe('Brute Force Protection', () => {
    it('should not be locked initially', async () => {
      const status = await securityService.checkBruteForceLockout('actor-1');
      expect(status.isLocked).toBe(false);
      expect(status.attempts).toBe(0);
    });

    it('should increment attempts on failed login', async () => {
      await securityService.recordFailedAttempt('actor-1');
      const status = await securityService.checkBruteForceLockout('actor-1');
      expect(status.attempts).toBe(1);
      expect(status.isLocked).toBe(false);
    });

    it('should lock after max attempts', async () => {
      // Set a low max attempts for testing
      securityService.updateBruteForceProtectionConfig({ maxAttempts: 3 });

      (mockRepository.createIncident as ReturnType<typeof vi.fn>).mockResolvedValue({
        incidentId: { value: 'incident-1' } as any,
        incidentType: 'brute_force_lockout',
        severity: IncidentSeverity.HIGH,
        status: IncidentStatus.OPEN,
        actorId: 'actor-1',
        source: 'brute_force_protection',
        description: 'test',
        createdAt: new Date(),
        metadata: {},
      });

      await securityService.recordFailedAttempt('actor-1');
      await securityService.recordFailedAttempt('actor-1');
      await securityService.recordFailedAttempt('actor-1');

      const status = await securityService.checkBruteForceLockout('actor-1');
      expect(status.isLocked).toBe(true);
      expect(status.attempts).toBe(3);
    });

    it('should reset attempts on successful login', async () => {
      await securityService.recordFailedAttempt('actor-1');
      await securityService.recordFailedAttempt('actor-1');
      await securityService.recordSuccessfulLogin('actor-1');

      const status = await securityService.checkBruteForceLockout('actor-1');
      expect(status.attempts).toBe(0);
    });

    it('should calculate progressive delay', async () => {
      securityService.updateBruteForceProtectionConfig({
        progressiveDelay: true,
        cooldownMinutes: 1,
        delayMultiplier: 2,
      });

      // Simulate attempts
      (mockRepository.createIncident as ReturnType<typeof vi.fn>).mockResolvedValue({} as SecurityIncident);
      await securityService.recordFailedAttempt('actor-1');
      await securityService.recordFailedAttempt('actor-1');
      await securityService.recordFailedAttempt('actor-1');

      const delay = await securityService.getRetryDelay('actor-1');
      // Progressive: 1 min * 2^2 = 4 minutes = 240000 ms
      expect(delay).toBe(240000);
    });
  });

  describe('Fraud Detection', () => {
    it('should not flag normal request frequency', async () => {
      const result = await securityService.detectFraud({
        actorId: 'actor-1',
        action: 'action-1',
        ipAddress: '127.0.0.1',
      });
      expect(result.isSuspicious).toBe(false);
    });

    it('should flag impossible request frequency', async () => {
      (mockRepository.createIncident as ReturnType<typeof vi.fn>).mockResolvedValue({
        incidentId: { value: 'incident-1' } as any,
        incidentType: 'impossible_request_frequency',
        severity: IncidentSeverity.HIGH,
        status: IncidentStatus.OPEN,
        actorId: 'actor-1',
        source: 'fraud_detection',
        description: 'test',
        createdAt: new Date(),
        metadata: {},
      });

      // Make many requests quickly
      for (let i = 0; i < 150; i++) {
        await securityService.detectFraud({
          actorId: 'actor-1',
          action: 'rapid-action',
          ipAddress: '127.0.0.1',
          timestamp: new Date(),
        });
      }

      const result = await securityService.detectFraud({
        actorId: 'actor-1',
        action: 'rapid-action',
        ipAddress: '127.0.0.1',
      });
      expect(result.isSuspicious).toBe(true);
      expect(result.incidentType).toBe('impossible_request_frequency');
    });

    it('should detect duplicate requests', async () => {
      (mockRepository.createIncident as ReturnType<typeof vi.fn>).mockResolvedValue({
        incidentId: { value: 'incident-1' } as any,
        incidentType: 'duplicate_requests',
        severity: IncidentSeverity.MEDIUM,
        status: IncidentStatus.OPEN,
        actorId: 'actor-1',
        source: 'fraud_detection',
        description: 'test',
        createdAt: new Date(),
        metadata: {},
      });

      const timestamp = new Date();
      await securityService.detectFraud({
        actorId: 'actor-1',
        action: 'buy-item',
        ipAddress: '127.0.0.1',
        timestamp,
      });

      // Same request within window
      const result = await securityService.detectFraud({
        actorId: 'actor-1',
        action: 'buy-item',
        ipAddress: '127.0.0.1',
        timestamp: new Date(timestamp.getTime() + 100), // 100ms later
      });

      expect(result.isSuspicious).toBe(true);
      expect(result.incidentType).toBe('duplicate_requests');
    });
  });

  describe('Session Validation', () => {
    it('should validate a valid session', async () => {
      const mockSession = {
        sessionId: { value: 'session-1' },
        actorId: 'actor-1',
        status: SessionStatus.ACTIVE,
        ipAddress: '127.0.0.1',
        device: 'device-1',
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
        metadata: {},
      } as SecuritySession;

      (mockRepository.findSessionById as ReturnType<typeof vi.fn>).mockResolvedValue(mockSession);

      const result = await securityService.findSession('session-1');
      expect(result.isValid).toBe(true);
      expect(result.session).toBeDefined();
    });

    it('should reject an expired session', async () => {
      const mockSession = {
        sessionId: { value: 'session-1' },
        actorId: 'actor-1',
        status: SessionStatus.ACTIVE,
        ipAddress: '127.0.0.1',
        device: 'device-1',
        createdAt: new Date(Date.now() - 7200000), // 2 hours ago
        expiresAt: new Date(Date.now() - 3600000), // 1 hour ago (expired)
        metadata: {},
      } as SecuritySession;

      (mockRepository.findSessionById as ReturnType<typeof vi.fn>).mockResolvedValue(mockSession);

      const result = await securityService.findSession('session-1');
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe('Session expired');
    });

    it('should reject a revoked session', async () => {
      const mockSession = {
        sessionId: { value: 'session-1' },
        actorId: 'actor-1',
        status: SessionStatus.REVOKED,
        ipAddress: '127.0.0.1',
        device: 'device-1',
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 3600000),
        metadata: {},
      } as SecuritySession;

      (mockRepository.findSessionById as ReturnType<typeof vi.fn>).mockResolvedValue(mockSession);

      const result = await securityService.findSession('session-1');
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe('Session status is revoked');
    });

    it('should return not found for missing session', async () => {
      (mockRepository.findSessionById as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      const result = await securityService.findSession('nonexistent');
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe('Session not found');
    });
  });

  describe('IP Validation', () => {
    it('should validate matching IP', async () => {
      const mockSession = {
        sessionId: { value: 'session-1' },
        actorId: 'actor-1',
        status: SessionStatus.ACTIVE,
        ipAddress: '192.168.1.1',
        device: 'device-1',
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 3600000),
        metadata: {},
      } as SecuritySession;

      (mockRepository.findSessionById as ReturnType<typeof vi.fn>).mockResolvedValue(mockSession);

      const result = await securityService.validateSessionIp('session-1', '192.168.1.1');
      expect(result).toBe(true);
    });

    it('should reject non-matching IP', async () => {
      const mockSession = {
        sessionId: { value: 'session-1' },
        actorId: 'actor-1',
        status: SessionStatus.ACTIVE,
        ipAddress: '192.168.1.1',
        device: 'device-1',
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 3600000),
        metadata: {},
      } as SecuritySession;

      (mockRepository.findSessionById as ReturnType<typeof vi.fn>).mockResolvedValue(mockSession);

      const result = await securityService.validateSessionIp('session-1', '10.0.0.1');
      expect(result).toBe(false);
    });
  });

  describe('Incident Creation', () => {
    it('should create an incident', async () => {
      const mockIncident = {
        incidentId: { value: 'incident-1' },
        incidentType: 'test_incident',
        severity: IncidentSeverity.LOW,
        status: IncidentStatus.OPEN,
        actorId: 'actor-1',
        source: 'test',
        description: 'Test incident',
        createdAt: new Date(),
        metadata: {},
      } as SecurityIncident;

      (mockRepository.createIncident as ReturnType<typeof vi.fn>).mockResolvedValue(mockIncident);

      const result = await securityService.createIncident({
        incidentType: 'test_incident',
        severity: IncidentSeverity.LOW,
        status: IncidentStatus.OPEN,
        actorId: 'actor-1',
        source: 'test',
        description: 'Test incident',
      });

      expect(result).toBeDefined();
      expect(mockRepository.createIncident).toHaveBeenCalled();
    });
  });

  describe('Policy Evaluation', () => {
    it('should allow when no matching policy exists', async () => {
      (mockRepository.listPolicies as ReturnType<typeof vi.fn>).mockResolvedValue({
        items: [],
        total: 0,
        page: 1,
        pageSize: 100,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      } as PaginatedResult<SecurityPolicy>);

      const result = await securityService.evaluatePolicy({
        policyType: 'nonexistent',
        context: {},
      });

      expect(result.allowed).toBe(true);
    });
  });

  describe('Configuration', () => {
    it('should update session protection config', () => {
      securityService.updateSessionProtectionConfig({ maxConcurrentSessions: 5 });
      const config = securityService.getConfiguration();
      expect(config.sessionProtection.maxConcurrentSessions).toBe(5);
    });

    it('should update brute force protection config', () => {
      securityService.updateBruteForceProtectionConfig({ maxAttempts: 10 });
      const config = securityService.getConfiguration();
      expect(config.bruteForceProtection.maxAttempts).toBe(10);
    });

    it('should update fraud detection config', () => {
      securityService.updateFraudDetectionConfig({ maxRequestsPerMinute: 50 });
      const config = securityService.getConfiguration();
      expect(config.fraudDetection.maxRequestsPerMinute).toBe(50);
    });
  });
});
