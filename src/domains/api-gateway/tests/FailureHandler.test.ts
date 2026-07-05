/**
 * Failure Handler Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FailureHandler } from '../services/FailureHandler';
import { ApiRequest } from '../entities/ApiRequest';
import { RepositoryError } from '../../../database/errors/repository.error';
import type { ILogger } from '../../../shared/types/interfaces';

describe('FailureHandler', () => {
  let failureHandler: FailureHandler;
  let mockLogger: ILogger;

  beforeEach(() => {
    mockLogger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      fatal: vi.fn(),
    };
    failureHandler = new FailureHandler(mockLogger);
  });

  const createMockContext = () => ({
    request: ApiRequest.create({
      routeId: 'test-route',
      method: 'GET',
      path: '/test',
    }),
    requestId: 'request-123',
    responseTime: 100,
  });

  describe('handleUnknownRoute', () => {
    it('should create unknown route error response', () => {
      const context = createMockContext();
      const response = failureHandler.handleUnknownRoute(context);

      expect(response.statusCode).toBe(404);
      expect(response.payload).toHaveProperty('success', false);
      expect((response.payload as any).error.code).toBe('ROUTE_NOT_FOUND');
    });

    it('should log warning for unknown route', () => {
      const context = createMockContext();
      failureHandler.handleUnknownRoute(context);

      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Unknown route accessed',
        expect.objectContaining({
          path: '/test',
          method: 'GET',
        })
      );
    });
  });

  describe('handleValidationError', () => {
    it('should create validation error response', () => {
      const context = createMockContext();
      const errors = [
        { field: 'email', code: 'INVALID_FORMAT', message: 'Invalid email format' },
        { field: 'name', code: 'REQUIRED', message: 'Name is required' },
      ];

      const response = failureHandler.handleValidationError(context, errors);

      expect(response.statusCode).toBe(400);
      expect((response.payload as any).error.code).toBe('VALIDATION_ERROR');
      expect((response.payload as any).error.details.validationErrors).toHaveLength(2);
    });
  });

  describe('handleInternalError', () => {
    it('should create internal error response', () => {
      const context = createMockContext();
      const error = new Error('Something went wrong');

      const response = failureHandler.handleInternalError(context, error);

      expect(response.statusCode).toBe(500);
      expect((response.payload as any).error.code).toBe('INTERNAL_ERROR');
    });

    it('should optionally include stack trace', () => {
      const context = createMockContext();
      const error = new Error('Something went wrong');

      const response = failureHandler.handleInternalError(context, error, true);

      expect((response.payload as any).error.details).toHaveProperty('stack');
    });

    it('should log error', () => {
      const context = createMockContext();
      const error = new Error('Something went wrong');

      failureHandler.handleInternalError(context, error);

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Internal error occurred',
        error,
        expect.any(Object)
      );
    });
  });

  describe('handleRepositoryError', () => {
    it('should create error response for repository error', () => {
      const context = createMockContext();
      const error = new Error('Database error');

      const response = failureHandler.handleRepositoryError(context, error as any);

      expect(response.statusCode).toBe(500);
    });

    it('should map DB_NOT_FOUND to 404', () => {
      const context = createMockContext();
      const error = RepositoryError.entityNotFound('User', 'user-123');

      const response = failureHandler.handleRepositoryError(context, error);

      expect(response.statusCode).toBe(404);
    });

    it('should map DB_UNIQUE_VIOLATION to 409', () => {
      const context = createMockContext();
      const error = new RepositoryError({
        message: 'Duplicate key',
        code: 'DB_UNIQUE_VIOLATION',
      });

      const response = failureHandler.handleRepositoryError(context, error);

      expect(response.statusCode).toBe(409);
    });
  });

  describe('handleMethodNotAllowed', () => {
    it('should create method not allowed error', () => {
      const context = createMockContext();
      const allowedMethods = ['GET', 'POST'];

      const response = failureHandler.handleMethodNotAllowed(context, allowedMethods);

      expect(response.statusCode).toBe(405);
      expect((response.payload as any).error.code).toBe('METHOD_NOT_ALLOWED');
      expect((response.payload as any).error.details.allowedMethods).toEqual(['GET', 'POST']);
    });
  });

  describe('handleServiceUnavailable', () => {
    it('should create service unavailable error', () => {
      const context = createMockContext();

      const response = failureHandler.handleServiceUnavailable(context, 'UserService');

      expect(response.statusCode).toBe(503);
      expect((response.payload as any).error.code).toBe('SERVICE_UNAVAILABLE');
      expect((response.payload as any).error.message).toContain('UserService');
    });

    it('should include retry information when provided', () => {
      const context = createMockContext();

      const response = failureHandler.handleServiceUnavailable(context, 'UserService', 60);

      expect((response.payload as any).error.details.retryAfter).toBe(60);
    });
  });

  describe('isRepositoryError', () => {
    it('should return true for RepositoryError', () => {
      const error = new RepositoryError({ message: 'test' });
      expect(failureHandler.isRepositoryError(error)).toBe(true);
    });

    it('should return false for regular Error', () => {
      const error = new Error('test');
      expect(failureHandler.isRepositoryError(error)).toBe(false);
    });
  });

  describe('isValidationError', () => {
    it('should return true for validation error', () => {
      const error = { code: 'VALIDATION_ERROR', message: 'test' };
      expect(failureHandler.isValidationError(error)).toBe(true);
    });

    it('should return false for other errors', () => {
      const error = { code: 'OTHER_ERROR', message: 'test' };
      expect(failureHandler.isValidationError(error)).toBe(false);
    });
  });
});
