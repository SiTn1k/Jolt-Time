/**
 * Audit Service Tests
 *
 * Unit tests for the audit logging service.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { AuditService, AuditEventType, AuditResult } from '../services/AuditService';

describe('AuditService', () => {
  let auditService: AuditService;

  beforeEach(() => {
    auditService = new AuditService(100);
    auditService.clear();
  });

  describe('log', () => {
    it('should log an audit entry', () => {
      auditService.logSuccess('admin1', 'admin', AuditEventType.ADMIN_CREATED, 'create', 'admin_account');

      const logs = auditService.getRecentLogs(1);
      expect(logs).toHaveLength(1);
      expect(logs[0].actorId).toBe('admin1');
      expect(logs[0].eventType).toBe(AuditEventType.ADMIN_CREATED);
    });

    it('should store multiple logs', () => {
      auditService.logSuccess('admin1', 'admin', AuditEventType.ADMIN_CREATED, 'create', 'admin_account');
      auditService.logSuccess('admin2', 'admin', AuditEventType.ROLE_ASSIGNED, 'assign', 'admin_role');
      auditService.logSuccess('admin3', 'admin', AuditEventType.PERMISSION_UPDATED, 'update', 'admin_permission');

      const logs = auditService.getRecentLogs(10);
      expect(logs).toHaveLength(3);
    });
  });

  describe('logSuccess', () => {
    it('should log successful action with correct result', () => {
      auditService.logSuccess('admin1', 'admin', AuditEventType.ADMIN_ENABLED, 'enable', 'admin_account', {
        resourceId: 'admin123',
      });

      const logs = auditService.getLogsForAdmin('admin1');
      expect(logs).toHaveLength(1);
      expect(logs[0].success).toBe(true);
      expect(logs[0].result).toBe(AuditResult.SUCCESS);
    });

    it('should include metadata', () => {
      auditService.logSuccess('admin1', 'admin', AuditEventType.PLAYER_BANNED, 'ban', 'player', {
        metadata: { reason: 'cheating', duration: 7 },
      });

      const logs = auditService.getRecentLogs(1);
      expect(logs[0].metadata).toEqual({ reason: 'cheating', duration: 7 });
    });
  });

  describe('logFailure', () => {
    it('should log failed action with reason', () => {
      auditService.logFailure(
        'admin1',
        'admin',
        AuditEventType.ADMIN_DELETED,
        'delete',
        'admin_account',
        'Insufficient permissions',
        'FORBIDDEN'
      );

      const logs = auditService.getRecentLogs(1);
      expect(logs[0].success).toBe(false);
      expect(logs[0].result).toBe(AuditResult.FAILURE);
      expect(logs[0].failureReason).toBe('Insufficient permissions');
      expect(logs[0].errorCode).toBe('FORBIDDEN');
    });
  });

  describe('query', () => {
    beforeEach(() => {
      auditService.logSuccess('admin1', 'admin', AuditEventType.ADMIN_CREATED, 'create', 'admin_account');
      auditService.logSuccess('admin1', 'admin', AuditEventType.ROLE_ASSIGNED, 'assign', 'admin_role');
      auditService.logSuccess('admin2', 'admin', AuditEventType.ADMIN_CREATED, 'create', 'admin_account');
      auditService.logFailure('admin3', 'admin', AuditEventType.ADMIN_DELETED, 'delete', 'admin_account', 'Error');
    });

    it('should filter by actorId', () => {
      const result = auditService.query({ actorId: 'admin1' });
      expect(result.entries).toHaveLength(2);
    });

    it('should filter by eventType', () => {
      const result = auditService.query({ eventType: AuditEventType.ADMIN_CREATED });
      expect(result.entries).toHaveLength(2);
    });

    it('should filter by result', () => {
      const result = auditService.query({ result: AuditResult.FAILURE });
      expect(result.entries).toHaveLength(1);
    });

    it('should paginate results', () => {
      const result = auditService.query({ page: 1, pageSize: 2 });
      expect(result.entries).toHaveLength(2);
      expect(result.total).toBe(4);
      expect(result.totalPages).toBe(2);
    });
  });

  describe('getLogsForAdmin', () => {
    beforeEach(() => {
      auditService.logSuccess('admin1', 'admin', AuditEventType.ADMIN_CREATED, 'create', 'admin_account');
      auditService.logSuccess('admin2', 'admin', AuditEventType.ADMIN_CREATED, 'create', 'admin_account');
      auditService.logSuccess('admin1', 'admin', AuditEventType.ROLE_ASSIGNED, 'assign', 'admin_role');
    });

    it('should get logs where admin was actor', () => {
      const logs = auditService.getLogsForAdmin('admin1');
      expect(logs).toHaveLength(2);
    });

    it('should limit results', () => {
      const logs = auditService.getLogsForAdmin('admin1', 1);
      expect(logs).toHaveLength(1);
    });
  });

  describe('getLogsForResource', () => {
    beforeEach(() => {
      auditService.logSuccess('admin1', 'admin', AuditEventType.ADMIN_UPDATED, 'update', 'admin_account', {
        resourceId: 'resource1',
      });
      auditService.logSuccess('admin2', 'admin', AuditEventType.ADMIN_UPDATED, 'update', 'admin_account', {
        resourceId: 'resource1',
      });
      auditService.logSuccess('admin1', 'admin', AuditEventType.ADMIN_UPDATED, 'update', 'admin_account', {
        resourceId: 'resource2',
      });
    });

    it('should get logs for specific resource', () => {
      const logs = auditService.getLogsForResource('admin_account', 'resource1');
      expect(logs).toHaveLength(2);
    });
  });

  describe('getFailedOperations', () => {
    beforeEach(() => {
      auditService.logSuccess('admin1', 'admin', AuditEventType.ADMIN_CREATED, 'create', 'admin_account');
      auditService.logFailure('admin2', 'admin', AuditEventType.ADMIN_DELETED, 'delete', 'admin_account', 'Error');
      auditService.logFailure('admin3', 'admin', AuditEventType.ROLE_DELETED, 'delete', 'admin_role', 'Error');
    });

    it('should return only failed operations', () => {
      const failures = auditService.getFailedOperations();
      expect(failures).toHaveLength(2);
      expect(failures.every((f) => f.result === AuditResult.FAILURE)).toBe(true);
    });
  });

  describe('getStatistics', () => {
    beforeEach(() => {
      auditService.logSuccess('admin1', 'admin', AuditEventType.ADMIN_CREATED, 'create', 'admin_account');
      auditService.logSuccess('admin2', 'admin', AuditEventType.ROLE_ASSIGNED, 'assign', 'admin_role');
      auditService.logFailure('admin3', 'admin', AuditEventType.ADMIN_DELETED, 'delete', 'admin_account', 'Error');
    });

    it('should return correct statistics', () => {
      const stats = auditService.getStatistics();
      expect(stats.totalLogs).toBe(3);
      expect(stats.successCount).toBe(2);
      expect(stats.failureCount).toBe(1);
    });

    it('should count by event type', () => {
      const stats = auditService.getStatistics();
      expect(stats.byEventType[AuditEventType.ADMIN_CREATED]).toBe(1);
      expect(stats.byEventType[AuditEventType.ROLE_ASSIGNED]).toBe(1);
      expect(stats.byEventType[AuditEventType.ADMIN_DELETED]).toBe(1);
    });
  });

  describe('exportToJson', () => {
    it('should export logs as JSON', () => {
      auditService.logSuccess('admin1', 'admin', AuditEventType.ADMIN_CREATED, 'create', 'admin_account');

      const json = auditService.exportToJson();
      const parsed = JSON.parse(json);

      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].actorId).toBe('admin1');
    });
  });

  describe('clear', () => {
    it('should clear all logs', () => {
      auditService.logSuccess('admin1', 'admin', AuditEventType.ADMIN_CREATED, 'create', 'admin_account');
      auditService.clear();

      const logs = auditService.getRecentLogs();
      expect(logs).toHaveLength(0);
    });
  });

  describe('AuditEntryBuilder', () => {
    it('should build entry with fluent API', () => {
      const entry = auditService.createEntry()
        .actor('admin1', 'admin', 'Test Admin')
        .action(AuditEventType.CONFIG_CHANGED, 'update', 'configuration', 'config1')
        .target('config', 'config1', 'Game Config')
        .success()
        .metadata({ key: 'value' })
        .context('127.0.0.1', 'Mozilla/5.0', 'session123')
        .build();

      expect(entry.actorId).toBe('admin1');
      expect(entry.actorType).toBe('admin');
      expect(entry.actorName).toBe('Test Admin');
      expect(entry.eventType).toBe(AuditEventType.CONFIG_CHANGED);
      expect(entry.success).toBe(true);
      expect(entry.targetType).toBe('config');
      expect(entry.targetId).toBe('config1');
      expect(entry.metadata).toEqual({ key: 'value' });
      expect(entry.ipAddress).toBe('127.0.0.1');
      expect(entry.userAgent).toBe('Mozilla/5.0');
      expect(entry.sessionId).toBe('session123');
    });

    it('should build failure entry', () => {
      const entry = auditService.createEntry()
        .actor('admin1', 'admin')
        .action(AuditEventType.ADMIN_DELETED, 'delete', 'admin_account')
        .failure('Permission denied', 'FORBIDDEN')
        .build();

      expect(entry.success).toBe(false);
      expect(entry.result).toBe(AuditResult.FAILURE);
      expect(entry.failureReason).toBe('Permission denied');
      expect(entry.errorCode).toBe('FORBIDDEN');
    });
  });
});