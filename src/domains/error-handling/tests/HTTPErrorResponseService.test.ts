/**
 * HTTP Error Response Service Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { HTTPErrorResponseService, HTTP_ERROR_CODES } from '../services/HTTPErrorResponseService';
import { ValidationError } from '../../../shared/errors/validation.error';
import { BusinessError } from '../../../shared/errors/business.error';
import { RepositoryError } from '../../../shared/errors/repository.error';
import { ApplicationError } from '../../../shared/errors/application.error';

describe('HTTPErrorResponseService', () => {
  let service: HTTPErrorResponseService;

  beforeEach(() => {
    service = new HTTPErrorResponseService();
  });

  describe('HTTP Error Factory Methods', () => {
    describe('badRequest', () => {
      it('should create 400 Bad Request response', () => {
        const result = service.badRequest('Invalid input', { field: 'email' });

        expect(result.statusCode).toBe(400);
        expect(result.response.errorCode).toBe('BAD_REQUEST');
        expect(result.response.message).toBe('Invalid input');
        expect(result.isValidationError).toBe(false);
      });
    });

    describe('unauthorized', () => {
      it('should create 401 Unauthorized response', () => {
        const result = service.unauthorized('Invalid token');

        expect(result.statusCode).toBe(401);
        expect(result.response.errorCode).toBe('UNAUTHORIZED');
        expect(result.response.message).toBe('Invalid token');
      });

      it('should use default message when not provided', () => {
        const result = service.unauthorized();

        expect(result.statusCode).toBe(401);
        expect(result.response.message).toBe('Authentication required');
      });
    });

    describe('forbidden', () => {
      it('should create 403 Forbidden response', () => {
        const result = service.forbidden('Access denied');

        expect(result.statusCode).toBe(403);
        expect(result.response.errorCode).toBe('FORBIDDEN');
        expect(result.response.message).toBe('Access denied');
      });
    });

    describe('notFound', () => {
      it('should create 404 Not Found response with resource and id', () => {
        const result = service.notFound('User', '123');

        expect(result.statusCode).toBe(404);
        expect(result.response.errorCode).toBe('NOT_FOUND');
        expect(result.response.message).toBe('User not found: 123');
      });

      it('should create 404 Not Found response with only resource', () => {
        const result = service.notFound('Resource');

        expect(result.statusCode).toBe(404);
        expect(result.response.message).toBe('Resource not found');
      });
    });

    describe('conflict', () => {
      it('should create 409 Conflict response', () => {
        const result = service.conflict('Resource already exists');

        expect(result.statusCode).toBe(409);
        expect(result.response.errorCode).toBe('CONFLICT');
      });
    });

    describe('unprocessableEntity', () => {
      it('should create 422 Unprocessable Entity response', () => {
        const result = service.unprocessableEntity('Cannot process');

        expect(result.statusCode).toBe(422);
        expect(result.response.errorCode).toBe('VALIDATION_ERROR');
      });
    });

    describe('tooManyRequests', () => {
      it('should create 429 Too Many Requests response with retry info', () => {
        const result = service.tooManyRequests(60);

        expect(result.statusCode).toBe(429);
        expect(result.response.errorCode).toBe('RATE_LIMITED');
        expect(result.response.message).toContain('60');
      });

      it('should create 429 without retry info', () => {
        const result = service.tooManyRequests();

        expect(result.statusCode).toBe(429);
        expect(result.response.message).toContain('Please try again later');
      });
    });

    describe('internalError', () => {
      it('should create 500 Internal Server Error response', () => {
        const result = service.internalError('Something went wrong');

        expect(result.statusCode).toBe(500);
        expect(result.response.errorCode).toBe('INTERNAL_ERROR');
      });

      it('should use default message when not provided', () => {
        const result = service.internalError();

        expect(result.response.message).toBe('An unexpected error occurred');
      });
    });

    describe('serviceUnavailable', () => {
      it('should create 503 Service Unavailable response', () => {
        const result = service.serviceUnavailable('Down for maintenance');

        expect(result.statusCode).toBe(503);
        expect(result.response.errorCode).toBe('SERVICE_UNAVAILABLE');
      });
    });
  });

  describe('fromError', () => {
    it('should convert ValidationError to 422', () => {
      const error = new ValidationError({
        message: 'Invalid input',
        errors: [{ field: 'email', message: 'Invalid', code: 'INVALID' }],
      });

      const result = service.fromError(error);

      expect(result.statusCode).toBe(422);
      expect(result.isValidationError).toBe(true);
      expect(result.response.message).toBe('Invalid input');
    });

    it('should convert BusinessError with NOT_FOUND code to 404', () => {
      const error = new BusinessError({
        message: 'User not found',
        code: 'NOT_FOUND',
      });

      const result = service.fromError(error);

      expect(result.statusCode).toBe(404);
    });

    it('should convert BusinessError with INSUFFICIENT_BALANCE to 400', () => {
      const error = new BusinessError({
        message: 'Not enough balance',
        code: 'INSUFFICIENT_BALANCE',
      });

      const result = service.fromError(error);

      expect(result.statusCode).toBe(400);
    });

    it('should convert RepositoryError to 500', () => {
      const error = new RepositoryError({
        message: 'Database connection failed',
        table: 'users',
      });

      const result = service.fromError(error);

      expect(result.statusCode).toBe(500);
      expect(result.isValidationError).toBe(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = result.response as any;
      expect(response.category).toBe('repository');
    });

    it('should convert error with unauthorized in message to 401', () => {
      const error = new Error('Unauthorized access');

      const result = service.fromError(error);

      expect(result.statusCode).toBe(401);
    });

    it('should convert error with forbidden in message to 403', () => {
      const error = new Error('Access forbidden');

      const result = service.fromError(error);

      expect(result.statusCode).toBe(403);
    });

    it('should convert error with rate limit in message to 429', () => {
      const error = new Error('Rate limit exceeded');

      const result = service.fromError(error);

      expect(result.statusCode).toBe(429);
    });

    it('should default to 500 for unknown errors', () => {
      const error = new Error('Some unknown error');

      const result = service.fromError(error);

      expect(result.statusCode).toBe(500);
    });
  });

  describe('fromValidationError', () => {
    it('should convert validation errors correctly', () => {
      const error = new ValidationError({
        message: 'Validation failed',
        errors: [
          { field: 'name', message: 'Name is required', code: 'REQUIRED' },
          { field: 'email', message: 'Invalid email', code: 'INVALID_FORMAT' },
        ],
      });

      const result = service.fromValidationError(error);

      expect(result.statusCode).toBe(422);
      expect(result.isValidationError).toBe(true);
      expect(result.response.errorCode).toBe('VALIDATION_ERROR');
      expect(result.response.message).toBe('Validation failed');
    });
  });

  describe('fromBusinessError', () => {
    it('should convert business errors correctly', () => {
      const error = new BusinessError({
        message: 'Insufficient balance',
        code: 'INSUFFICIENT_BALANCE',
        details: { required: 100, available: 50 },
      });

      const result = service.fromBusinessError(error);

      expect(result.statusCode).toBe(400);
      expect(result.response.errorCode).toBe('INSUFFICIENT_BALANCE');
      expect(result.response.message).toBe('Insufficient balance');
    });

    it('should map business codes to correct status codes', () => {
      const codes: Array<{ code: string; expectedStatus: number }> = [
        { code: 'INSUFFICIENT_BALANCE', expectedStatus: 400 },
        { code: 'NOT_FOUND', expectedStatus: 404 },
        { code: 'ALREADY_EXISTS', expectedStatus: 409 },
        { code: 'CONFLICT', expectedStatus: 409 },
      ];

      for (const { code, expectedStatus } of codes) {
        const error = new BusinessError({ message: 'Test', code });
        const result = service.fromBusinessError(error);
        expect(result.statusCode).toBe(expectedStatus);
      }
    });
  });

  describe('fromRepositoryError', () => {
    it('should convert repository errors correctly', () => {
      const error = new RepositoryError({
        message: 'Database query failed',
        table: 'players',
        constraint: 'players_pkey',
      });

      const result = service.fromRepositoryError(error);

      expect(result.statusCode).toBe(500);
      expect(result.isValidationError).toBe(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = result.response as any;
      expect(response.category).toBe('repository');
      expect(response.severity).toBe('error');
    });
  });

  describe('HTTP_ERROR_CODES', () => {
    it('should have all required status codes', () => {
      expect(HTTP_ERROR_CODES.BAD_REQUEST).toBe(400);
      expect(HTTP_ERROR_CODES.UNAUTHORIZED).toBe(401);
      expect(HTTP_ERROR_CODES.FORBIDDEN).toBe(403);
      expect(HTTP_ERROR_CODES.NOT_FOUND).toBe(404);
      expect(HTTP_ERROR_CODES.CONFLICT).toBe(409);
      expect(HTTP_ERROR_CODES.UNPROCESSABLE_ENTITY).toBe(422);
      expect(HTTP_ERROR_CODES.TOO_MANY_REQUESTS).toBe(429);
      expect(HTTP_ERROR_CODES.INTERNAL_SERVER_ERROR).toBe(500);
      expect(HTTP_ERROR_CODES.SERVICE_UNAVAILABLE).toBe(503);
    });
  });
});
