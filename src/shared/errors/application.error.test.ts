/**
 * Application Error Tests
 */

import { describe, it, expect } from 'vitest';
import { ApplicationError } from './application.error';
import { ErrorCategory, ErrorSeverity } from '../constants';

describe('ApplicationError', () => {
  describe('constructor', () => {
    it('should create error with all properties', () => {
      const error = new ApplicationError({
        message: 'Test error',
        code: 'TEST_ERROR',
        category: ErrorCategory.BUSINESS,
        severity: ErrorSeverity.MEDIUM,
        details: { field: 'test' },
        recoverable: true,
      });

      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_ERROR');
      expect(error.category).toBe(ErrorCategory.BUSINESS);
      expect(error.severity).toBe(ErrorSeverity.MEDIUM);
      expect(error.recoverable).toBe(true);
      expect(error.details).toEqual({ field: 'test' });
      expect(error.id).toBeDefined();
      expect(error.timestamp).toBeInstanceOf(Date);
    });

    it('should default recoverable to true', () => {
      const error = new ApplicationError({
        message: 'Test',
        code: 'TEST',
        category: ErrorCategory.INTERNAL,
        severity: ErrorSeverity.HIGH,
      });
      expect(error.recoverable).toBe(true);
    });
  });

  describe('withContext', () => {
    it('should add context to error', () => {
      const error = new ApplicationError({
        message: 'Test error',
        code: 'TEST',
        category: ErrorCategory.BUSINESS,
        severity: ErrorSeverity.MEDIUM,
        context: { userId: 'user1' },
      });

      const withContext = error.withContext({ requestId: 'req1' });

      expect(withContext.context).toEqual({ userId: 'user1', requestId: 'req1' });
      expect(withContext.message).toBe(error.message);
      expect(withContext.id).not.toBe(error.id);
    });
  });

  describe('toJSON', () => {
    it('should serialize to JSON', () => {
      const error = new ApplicationError({
        message: 'Test error',
        code: 'TEST',
        category: ErrorCategory.BUSINESS,
        severity: ErrorSeverity.MEDIUM,
      });

      const json = error.toJSON();

      expect(json.message).toBe('Test error');
      expect(json.code).toBe('TEST');
      expect(json.category).toBe('business');
      expect(json.severity).toBe(3);
      expect(json.id).toBeDefined();
      expect(json.timestamp).toBeDefined();
    });
  });

  describe('toSummary', () => {
    it('should return summary string', () => {
      const error = new ApplicationError({
        message: 'Test error',
        code: 'TEST',
        category: ErrorCategory.BUSINESS,
        severity: ErrorSeverity.MEDIUM,
      });

      const summary = error.toSummary();

      expect(summary).toBe('[TEST] business:3 - Test error');
    });
  });

  describe('isApplicationError', () => {
    it('should return true for ApplicationError', () => {
      const error = new ApplicationError({
        message: 'Test',
        code: 'TEST',
        category: ErrorCategory.BUSINESS,
        severity: ErrorSeverity.MEDIUM,
      });
      expect(error instanceof ApplicationError).toBe(true);
    });
  });
});
