/**
 * Failure Handler Unit Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FailureHandler, createFailureHandler, FailureSeverity } from '../../../src/domains/integration/services/FailureHandler';

describe('FailureHandler', () => {
  let failureHandler: FailureHandler;

  beforeEach(() => {
    failureHandler = new FailureHandler(undefined, {
      publishEvents: false,
      logFailures: false,
    });
  });

  describe('handle', () => {
    it('should create failure response for unknown errors', () => {
      const response = failureHandler.handle({
        code: 'UNKNOWN_ERROR',
        message: 'An unknown error occurred',
      });

      expect(response.success).toBe(false);
      expect(response.code).toBe('UNKNOWN_ERROR');
      expect(response.category).toBe('unknown');
      expect(response.retryable).toBe(true);
    });

    it('should categorize timeout errors', () => {
      const error = new Error('Request timed out');
      error.name = 'TimeoutError';

      const response = failureHandler.handle({
        code: 'TIMEOUT',
        message: 'Request timed out',
        error,
      });

      expect(response.category).toBe('timeout');
      expect(response.severity).toBe('medium');
      expect(response.retryable).toBe(true);
    });

    it('should categorize rate limit errors', () => {
      const response = failureHandler.handle({
        code: 'RATE_LIMITED',
        message: 'Too many requests',
        statusCode: 429,
      });

      expect(response.category).toBe('rate_limited');
      expect(response.severity).toBe('high');
      expect(response.retryable).toBe(true);
    });

    it('should categorize authentication errors as non-retryable', () => {
      const response = failureHandler.handle({
        code: 'AUTH_FAILED',
        message: 'Authentication failed',
        statusCode: 401,
      });

      expect(response.category).toBe('authentication_failed');
      expect(response.severity).toBe('high');
      expect(response.retryable).toBe(false);
    });

    it('should categorize server errors', () => {
      const response = failureHandler.handle({
        code: 'SERVER_ERROR',
        message: 'Internal server error',
        statusCode: 500,
      });

      expect(response.category).toBe('server_error');
      expect(response.severity).toBe('high');
      expect(response.retryable).toBe(true);
    });

    it('should categorize provider unavailable as critical', () => {
      const response = failureHandler.handle({
        code: 'UNAVAILABLE',
        message: 'Service unavailable',
        statusCode: 503,
      });

      expect(response.category).toBe('provider_unavailable');
      expect(response.severity).toBe('critical');
      expect(response.retryable).toBe(true);
    });

    it('should categorize invalid request as non-retryable', () => {
      const response = failureHandler.handle({
        code: 'BAD_REQUEST',
        message: 'Invalid request',
        statusCode: 400,
      });

      expect(response.category).toBe('invalid_request');
      expect(response.retryable).toBe(false);
    });

    it('should include provider and request IDs when provided', () => {
      const response = failureHandler.handle({
        code: 'TEST_ERROR',
        message: 'Test error',
        providerId: 'provider-123',
        requestId: 'request-456',
      });

      expect(response.providerId).toBe('provider-123');
      expect(response.requestId).toBe('request-456');
    });

    it('should include original error message', () => {
      const error = new Error('Original error message');
      const response = failureHandler.handle({
        code: 'TEST_ERROR',
        message: 'Test error',
        error,
      });

      expect(response.originalError).toBe('Original error message');
    });

    it('should include timestamp', () => {
      const before = new Date();
      const response = failureHandler.handle({
        code: 'TEST_ERROR',
        message: 'Test error',
      });
      const after = new Date();

      expect(response.timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(response.timestamp.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('createSuccessResponse', () => {
    it('should create success response with data', () => {
      const response = failureHandler.createSuccessResponse({ key: 'value' });

      expect(response.success).toBe(true);
      expect(response.data).toEqual({ key: 'value' });
    });
  });

  describe('createFailureResponse', () => {
    it('should create failure response', () => {
      const response = failureHandler.createFailureResponse({
        code: 'FAILED',
        message: 'Operation failed',
      });

      expect(response.success).toBe(false);
      expect(response.code).toBe('FAILED');
    });
  });

  describe('failure tracking', () => {
    it('should track failure count for provider', () => {
      failureHandler.handle({ code: 'ERR1', message: 'Error 1', providerId: 'provider-1' });
      failureHandler.handle({ code: 'ERR2', message: 'Error 2', providerId: 'provider-1' });

      expect(failureHandler.getFailureCount('provider-1')).toBe(2);
    });

    it('should reset failure count', () => {
      failureHandler.handle({ code: 'ERR', message: 'Error', providerId: 'provider-1' });
      failureHandler.resetFailureCount('provider-1');

      expect(failureHandler.getFailureCount('provider-1')).toBe(0);
    });
  });
});

describe('createFailureHandler', () => {
  it('should create failure handler with config', () => {
    const handler = createFailureHandler(undefined, {
      publishEvents: false,
      logFailures: false,
      minSeverityForEvent: 'high',
    });

    expect(handler).toBeInstanceOf(FailureHandler);
  });
});
