/**
 * Response Builder Unit Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ResponseBuilder, HttpStatusCodes, ErrorCodes } from '../services/ResponseBuilder';

describe('ResponseBuilder', () => {
  let responseBuilder: ResponseBuilder;

  beforeEach(() => {
    responseBuilder = new ResponseBuilder();
  });

  describe('success', () => {
    it('should create a success response', () => {
      const result = responseBuilder.success({ key: 'value' });

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ key: 'value' });
      expect(result.timestamp).toBeDefined();
    });

    it('should include meta in success response', () => {
      const result = responseBuilder.success({ key: 'value' }, { meta: { count: 1 } });

      expect(result.success).toBe(true);
      expect((result as any).meta).toEqual({ count: 1 });
    });
  });

  describe('error', () => {
    it('should create an error response', () => {
      const result = responseBuilder.error({
        code: 'TEST_ERROR',
        message: 'Test error message',
      });

      expect(result.success).toBe(false);
      expect(result.error.code).toBe('TEST_ERROR');
      expect(result.error.message).toBe('Test error message');
      expect(result.timestamp).toBeDefined();
    });

    it('should include details in error response', () => {
      const result = responseBuilder.error({
        code: 'TEST_ERROR',
        message: 'Test error',
        details: { field: 'value' },
      });

      expect(result.error.details).toEqual({ field: 'value' });
    });
  });

  describe('validationError', () => {
    it('should create a validation error response', () => {
      const errors = [
        { field: 'email', code: 'INVALID_FORMAT', message: 'Invalid email format' },
        { field: 'name', code: 'REQUIRED', message: 'Name is required' },
      ];

      const result = responseBuilder.validationError(errors);

      expect(result.success).toBe(false);
      expect(result.error.code).toBe('VALIDATION_ERROR');
      expect(result.error.message).toBe('Request validation failed');
      expect(result.error.details?.validationErrors).toEqual(errors);
    });
  });

  describe('notFound', () => {
    it('should create a not found error', () => {
      const result = responseBuilder.notFound('User');

      expect(result.success).toBe(false);
      expect(result.error.code).toBe('NOT_FOUND');
      expect(result.error.message).toBe('User not found');
    });
  });

  describe('unauthorized', () => {
    it('should create an unauthorized error', () => {
      const result = responseBuilder.unauthorized();

      expect(result.success).toBe(false);
      expect(result.error.code).toBe('UNAUTHORIZED');
      expect(result.error.message).toBe('Authentication required');
    });

    it('should use custom message', () => {
      const result = responseBuilder.unauthorized('Token expired');

      expect(result.error.message).toBe('Token expired');
    });
  });

  describe('forbidden', () => {
    it('should create a forbidden error', () => {
      const result = responseBuilder.forbidden();

      expect(result.success).toBe(false);
      expect(result.error.code).toBe('FORBIDDEN');
      expect(result.error.message).toBe('Access denied');
    });
  });

  describe('internalError', () => {
    it('should create an internal error', () => {
      const result = responseBuilder.internalError();

      expect(result.success).toBe(false);
      expect(result.error.code).toBe('INTERNAL_ERROR');
      expect(result.error.message).toBe('Internal server error');
    });
  });

  describe('paginated', () => {
    it('should create a paginated response', () => {
      const result = responseBuilder.paginated({
        items: [{ id: 1 }, { id: 2 }],
        total: 10,
        page: 1,
        pageSize: 2,
      });

      expect(result.success).toBe(true);
      expect(result.data.items).toHaveLength(2);
      expect(result.data.total).toBe(10);
      expect(result.data.page).toBe(1);
      expect(result.data.pageSize).toBe(2);
      expect(result.data.totalPages).toBe(5);
      expect(result.data.hasNextPage).toBe(true);
      expect(result.data.hasPreviousPage).toBe(false);
    });

    it('should calculate hasPreviousPage correctly for page 2', () => {
      const result = responseBuilder.paginated({
        items: [{ id: 3 }],
        total: 10,
        page: 2,
        pageSize: 2,
      });

      expect(result.data.hasPreviousPage).toBe(true);
      expect(result.data.hasNextPage).toBe(true);
    });

    it('should calculate hasNextPage correctly for last page', () => {
      const result = responseBuilder.paginated({
        items: [{ id: 9 }, { id: 10 }],
        total: 10,
        page: 5,
        pageSize: 2,
      });

      expect(result.data.hasNextPage).toBe(false);
      expect(result.data.hasPreviousPage).toBe(true);
    });
  });

  describe('HttpStatusCodes', () => {
    it('should have all expected status codes', () => {
      expect(HttpStatusCodes.OK).toBe(200);
      expect(HttpStatusCodes.CREATED).toBe(201);
      expect(HttpStatusCodes.BAD_REQUEST).toBe(400);
      expect(HttpStatusCodes.UNAUTHORIZED).toBe(401);
      expect(HttpStatusCodes.FORBIDDEN).toBe(403);
      expect(HttpStatusCodes.NOT_FOUND).toBe(404);
      expect(HttpStatusCodes.INTERNAL_SERVER_ERROR).toBe(500);
      expect(HttpStatusCodes.SERVICE_UNAVAILABLE).toBe(503);
    });
  });

  describe('ErrorCodes', () => {
    it('should have all expected error codes', () => {
      expect(ErrorCodes.VALIDATION_ERROR).toBe('VALIDATION_ERROR');
      expect(ErrorCodes.NOT_FOUND).toBe('NOT_FOUND');
      expect(ErrorCodes.UNAUTHORIZED).toBe('UNAUTHORIZED');
      expect(ErrorCodes.FORBIDDEN).toBe('FORBIDDEN');
      expect(ErrorCodes.INTERNAL_ERROR).toBe('INTERNAL_ERROR');
      expect(ErrorCodes.ROUTE_NOT_FOUND).toBe('ROUTE_NOT_FOUND');
    });
  });
});
