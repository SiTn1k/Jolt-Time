/**
 * Global Exception Handler Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GlobalExceptionHandler } from '../services/GlobalExceptionHandler';
import { ErrorHandlingService } from '../services/ErrorHandlingService';
import { ValidationError } from '../../../shared/errors/validation.error';
import { BusinessError } from '../../../shared/errors/business.error';
import { RepositoryError } from '../../../shared/errors/repository.error';
import type { IErrorRepository } from '../interfaces/IErrorRepository';
import type { SystemError } from '../entities/SystemError';
import { ErrorId } from '../value-objects/ErrorId';
import { ErrorCategoryType, ErrorSeverity } from '../types';

// Mock repository
const createMockRepository = (): IErrorRepository => ({
  createError: vi.fn(),
  findErrorById: vi.fn(),
  findErrorByCode: vi.fn(),
  updateError: vi.fn(),
  deleteError: vi.fn(),
  listErrors: vi.fn(),
  countErrors: vi.fn(),
  createCategory: vi.fn(),
  findCategoryById: vi.fn(),
  findCategoryByName: vi.fn(),
  updateCategory: vi.fn(),
  deleteCategory: vi.fn(),
  listCategories: vi.fn(),
  countCategories: vi.fn(),
  createContext: vi.fn(),
  findContextById: vi.fn(),
  findContextByRequestId: vi.fn(),
  updateContext: vi.fn(),
  deleteContext: vi.fn(),
  listContexts: vi.fn(),
  countContexts: vi.fn(),
});

describe('GlobalExceptionHandler', () => {
  let handler: GlobalExceptionHandler;
  let errorService: ErrorHandlingService;

  beforeEach(() => {
    const mockRepository = createMockRepository();
    errorService = new ErrorHandlingService(mockRepository);
    handler = new GlobalExceptionHandler(errorService);
  });

  describe('handleException', () => {
    it('should handle ValidationError and return 422', async () => {
      const error = new ValidationError({ message: 'Invalid input' });

      const response = await handler.handleException(error);

      expect(response.success).toBe(false);
      expect(response.httpStatus).toBe(422);
    });

    it('should handle BusinessError correctly', async () => {
      const error = new BusinessError({
        message: 'Not eligible',
        code: 'NOT_ELIGIBLE',
      });

      const response = await handler.handleException(error);

      expect(response.success).toBe(false);
      expect(response.httpStatus).toBe(400);
    });

    it('should handle RepositoryError and return 500', async () => {
      const error = new RepositoryError({ message: 'Database error' });

      const response = await handler.handleException(error);

      expect(response.success).toBe(false);
      expect(response.httpStatus).toBe(500);
    });

    it('should handle generic Error and return 500', async () => {
      const error = new Error('Something went wrong');

      const response = await handler.handleException(error);

      expect(response.success).toBe(false);
      expect(response.httpStatus).toBe(500);
    });

    it('should handle unauthorized errors', async () => {
      const error = new Error('Unauthorized access');

      const response = await handler.handleException(error);

      expect(response.success).toBe(false);
      expect(response.httpStatus).toBe(401);
    });

    it('should handle forbidden errors', async () => {
      const error = new Error('Access forbidden');

      const response = await handler.handleException(error);

      expect(response.success).toBe(false);
      expect(response.httpStatus).toBe(403);
    });

    it('should handle not found errors', async () => {
      const error = new Error('Resource not found');

      const response = await handler.handleException(error);

      expect(response.success).toBe(false);
      expect(response.httpStatus).toBe(404);
    });

    it('should handle conflict errors', async () => {
      const error = new Error('Conflict detected');

      const response = await handler.handleException(error);

      expect(response.success).toBe(false);
      expect(response.httpStatus).toBe(409);
    });

    it('should handle rate limit errors', async () => {
      const error = new Error('Rate limit exceeded');

      const response = await handler.handleException(error);

      expect(response.success).toBe(false);
      expect(response.httpStatus).toBe(429);
    });

    it('should accept custom error code', async () => {
      const error = new Error('Custom error');

      const response = await handler.handleException(error, {
        errorCode: 'CUSTOM_ERROR_CODE',
      });

      expect(response.success).toBe(false);
      expect(response.error.errorCode).toBeDefined();
    });

    it('should accept custom severity', async () => {
      const error = new Error('Critical error');

      const response = await handler.handleException(error, {
        severity: ErrorSeverity.Critical,
      });

      expect(response.success).toBe(false);
    });

    it('should accept custom category', async () => {
      const error = new Error('Custom category error');

      const response = await handler.handleException(error, {
        category: ErrorCategoryType.Telegram,
      });

      expect(response.success).toBe(false);
    });
  });

  describe('handleSync', () => {
    it('should handle errors synchronously', () => {
      const error = new Error('Sync error');

      const response = handler.handleSync(error);

      expect(response.success).toBe(false);
      expect(response.httpStatus).toBe(500);
    });

    it('should handle ValidationError synchronously', () => {
      const error = new ValidationError({ message: 'Sync validation' });

      const response = handler.handleSync(error);

      expect(response.success).toBe(false);
      expect(response.httpStatus).toBe(422);
    });
  });

  describe('wrapAsync', () => {
    it('should return result on success', async () => {
      const result = await handler.wrapAsync(async () => 'success');

      expect(result).toBe('success');
    });

    it('should throw on error', async () => {
      await expect(
        handler.wrapAsync(async () => {
          throw new Error('Wrapped error');
        })
      ).rejects.toThrow('Wrapped error');
    });

    it('should pass metadata to handler', async () => {
      await expect(
        handler.wrapAsync(
          async () => {
            throw new Error('With metadata');
          },
          { metadata: { userId: '123' } }
        )
      ).rejects.toThrow('With metadata');
    });
  });

  describe('wrapSync', () => {
    it('should return result on success', () => {
      const result = handler.wrapSync(() => 'sync success');

      expect(result).toBe('sync success');
    });

    it('should throw on error', () => {
      expect(() => {
        handler.wrapSync(() => {
          throw new Error('Sync wrapped error');
        });
      }).toThrow('Sync wrapped error');
    });
  });

  describe('BusinessError code mapping', () => {
    it('should map INSUFFICIENT_BALANCE to 400', async () => {
      const error = new BusinessError({
        message: 'Not enough balance',
        code: 'INSUFFICIENT_BALANCE',
      });

      const response = await handler.handleException(error);

      expect(response.httpStatus).toBe(400);
    });

    it('should map NOT_FOUND to 404', async () => {
      const error = new BusinessError({
        message: 'Not found',
        code: 'NOT_FOUND',
      });

      const response = await handler.handleException(error);

      expect(response.httpStatus).toBe(404);
    });

    it('should map ALREADY_EXISTS to 409', async () => {
      const error = new BusinessError({
        message: 'Already exists',
        code: 'ALREADY_EXISTS',
      });

      const response = await handler.handleException(error);

      expect(response.httpStatus).toBe(409);
    });
  });
});
