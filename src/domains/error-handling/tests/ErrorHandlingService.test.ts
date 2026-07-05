/**
 * Error Handling Service Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ErrorHandlingService, ErrorClassification, HTTP_STATUS_CODES } from '../services/ErrorHandlingService';
import { SystemError } from '../entities/SystemError';
import { ErrorContext } from '../entities/ErrorContext';
import { ErrorId } from '../value-objects/ErrorId';
import { ContextId } from '../value-objects/ContextId';
import { ErrorSeverity, ErrorCategoryType, ErrorStatus } from '../types';
import { ValidationError } from '../../../shared/errors/validation.error';
import { BusinessError } from '../../../shared/errors/business.error';
import { RepositoryError } from '../../../shared/errors/repository.error';
import type { IErrorRepository } from '../interfaces/IErrorRepository';
import type { PaginatedResult } from '../../../shared/types/base.types';

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

describe('ErrorHandlingService', () => {
  let service: ErrorHandlingService;
  let mockRepository: IErrorRepository;

  beforeEach(() => {
    mockRepository = createMockRepository();
    service = new ErrorHandlingService(mockRepository);
  });

  describe('classifyError', () => {
    it('should classify ValidationError as ValidationError', () => {
      const error = new ValidationError({ message: 'Invalid input' });
      expect(service.classifyError(error)).toBe(ErrorClassification.ValidationError);
    });

    it('should classify BusinessError as BusinessError', () => {
      const error = new BusinessError({ message: 'Not eligible' });
      expect(service.classifyError(error)).toBe(ErrorClassification.BusinessError);
    });

    it('should classify RepositoryError as RepositoryError', () => {
      const error = new RepositoryError({ message: 'Database error' });
      expect(service.classifyError(error)).toBe(ErrorClassification.RepositoryError);
    });

    it('should classify network errors as ExternalProviderError', () => {
      const error = new Error('fetch failed: network error');
      expect(service.classifyError(error)).toBe(ErrorClassification.ExternalProviderError);
    });

    it('should classify configuration errors as ConfigurationError', () => {
      const error = new Error('configuration not found');
      expect(service.classifyError(error)).toBe(ErrorClassification.ConfigurationError);
    });

    it('should classify unknown errors as InternalError', () => {
      const error = new Error('Something went wrong');
      expect(service.classifyError(error)).toBe(ErrorClassification.InternalError);
    });
  });

  describe('buildErrorResponse', () => {
    it('should build error response from SystemError', async () => {
      const error = SystemError.create({
        errorId: ErrorId.generate(),
        errorCode: 'TEST_ERROR',
        category: ErrorCategoryType.Service,
        severity: ErrorSeverity.Error,
        message: 'Test error message',
      });

      const response = service.buildErrorResponse(error);

      expect(response.errorId).toBe(error.errorId.value);
      expect(response.errorCode).toBe('TEST_ERROR');
      expect(response.category).toBe(ErrorCategoryType.Service);
      expect(response.severity).toBe(ErrorSeverity.Error);
      expect(response.message).toBe('Test error message');
    });
  });

  describe('buildValidationErrorResponse', () => {
    it('should build validation error response', () => {
      const error = new ValidationError({
        message: 'Validation failed',
        errors: [
          { field: 'email', message: 'Invalid email', code: 'INVALID_FORMAT' },
        ],
      });

      const response = service.buildValidationErrorResponse(error);

      expect(response.errorCode).toBe('VALIDATION_ERROR');
      expect(response.message).toBe('Validation failed');
      expect(response.validationErrors).toHaveLength(1);
      expect(response.validationErrors[0].field).toBe('email');
    });
  });

  describe('buildHTTPErrorResponse', () => {
    it('should build HTTP error response for unknown error', () => {
      const error = new Error('Something went wrong');
      const response = service.buildHTTPErrorResponse(error, 500);

      expect(response.errorCode).toBe('INTERNAL_ERROR');
      expect(response.category).toBe(ErrorCategoryType.System);
      expect(response.severity).toBe(ErrorSeverity.Error);
    });

    it('should build HTTP error response for validation error', () => {
      const error = new ValidationError({ message: 'Invalid input' });
      const response = service.buildHTTPErrorResponse(error, 422);

      expect(response.errorCode).toBe('VALIDATION_ERROR');
      expect(response.category).toBe(ErrorCategoryType.Validation);
    });
  });

  describe('getHTTPStatusCode', () => {
    it('should return 422 for ValidationError', () => {
      const error = new ValidationError({ message: 'Invalid' });
      expect(service.getHTTPStatusCode(error)).toBe(422);
    });

    it('should return 401 for unauthorized errors', () => {
      const error = new Error('Unauthorized');
      expect(service.getHTTPStatusCode(error)).toBe(401);
    });

    it('should return 403 for forbidden errors', () => {
      const error = new Error('Forbidden');
      expect(service.getHTTPStatusCode(error)).toBe(403);
    });

    it('should return 404 for not found errors', () => {
      const error = new Error('Not found');
      expect(service.getHTTPStatusCode(error)).toBe(404);
    });

    it('should return 409 for conflict errors', () => {
      const error = new Error('Conflict');
      expect(service.getHTTPStatusCode(error)).toBe(409);
    });

    it('should return 429 for rate limit errors', () => {
      const error = new Error('Rate limit exceeded');
      expect(service.getHTTPStatusCode(error)).toBe(429);
    });

    it('should return 500 for repository errors', () => {
      const error = new RepositoryError({ message: 'DB error' });
      expect(service.getHTTPStatusCode(error)).toBe(500);
    });
  });

  describe('captureError', () => {
    it('should capture and store error', async () => {
      const mockError = SystemError.create({
        errorId: ErrorId.generate(),
        errorCode: 'CAPTURED_ERROR',
        category: ErrorCategoryType.Service,
        severity: ErrorSeverity.Error,
        message: 'Captured error',
      });

      vi.mocked(mockRepository.createError).mockResolvedValue(mockError);

      const result = await service.captureError({
        error: new Error('Captured error'),
        errorCode: 'CAPTURED_ERROR',
      });

      expect(mockRepository.createError).toHaveBeenCalled();
      expect(result.errorCode).toBe('CAPTURED_ERROR');
    });

    it('should re-throw original error if repository fails', async () => {
      const originalError = new Error('Original error');
      vi.mocked(mockRepository.createError).mockRejectedValue(new Error('Repository error'));

      await expect(
        service.captureError({ error: originalError })
      ).rejects.toThrow('Original error');
    });

    it('should handle critical errors correctly', async () => {
      const mockError = SystemError.create({
        errorId: ErrorId.generate(),
        errorCode: 'CRITICAL_ERROR',
        category: ErrorCategoryType.System,
        severity: ErrorSeverity.Critical,
        message: 'Critical error',
      });

      vi.mocked(mockRepository.createError).mockResolvedValue(mockError);

      const result = await service.captureError({
        error: new Error('Critical error'),
        errorCode: 'CRITICAL_ERROR',
        severity: ErrorSeverity.Critical,
      });

      expect(result.severity).toBe(ErrorSeverity.Critical);
    });
  });

  describe('createContext', () => {
    it('should create error context', async () => {
      const mockContext = ErrorContext.create({
        contextId: ContextId.generate(),
        service: 'TestService',
        operation: 'testOperation',
      });

      vi.mocked(mockRepository.createContext).mockResolvedValue(mockContext);

      const result = await service.createContext({
        service: 'TestService',
        operation: 'testOperation',
      });

      expect(mockRepository.createContext).toHaveBeenCalled();
      expect(result.service).toBe('TestService');
    });

    it('should return transient context if repository fails', async () => {
      vi.mocked(mockRepository.createContext).mockRejectedValue(new Error('DB error'));

      const result = await service.createContext({
        service: 'TestService',
        operation: 'testOperation',
      });

      expect(result.service).toBe('TestService');
      expect(result.operation).toBe('testOperation');
    });
  });

  describe('getSystemSummary', () => {
    it('should return error statistics', async () => {
      const mockResult: PaginatedResult<SystemError> = {
        items: [
          SystemError.create({
            errorId: ErrorId.generate(),
            errorCode: 'ERR_1',
            category: ErrorCategoryType.Service,
            severity: ErrorSeverity.Error,
            message: 'Error 1',
          }),
          SystemError.create({
            errorId: ErrorId.generate(),
            errorCode: 'ERR_2',
            category: ErrorCategoryType.Validation,
            severity: ErrorSeverity.Warning,
            message: 'Error 2',
          }),
        ],
        total: 2,
        page: 1,
        pageSize: 20,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      };

      vi.mocked(mockRepository.listErrors).mockResolvedValue(mockResult);

      const summary = await service.getSystemSummary();

      expect(summary.totalCount).toBe(2);
      expect(summary.bySeverity['error']).toBe(1);
      expect(summary.bySeverity['warning']).toBe(1);
    });

    it('should return empty statistics on error', async () => {
      vi.mocked(mockRepository.listErrors).mockRejectedValue(new Error('DB error'));

      const summary = await service.getSystemSummary();

      expect(summary.totalCount).toBe(0);
    });
  });

  describe('listErrors', () => {
    it('should list errors with pagination', async () => {
      const mockResult: PaginatedResult<SystemError> = {
        items: [],
        total: 0,
        page: 1,
        pageSize: 20,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      };

      vi.mocked(mockRepository.listErrors).mockResolvedValue(mockResult);

      const result = await service.listErrors({ page: 1, pageSize: 20 });

      expect(mockRepository.listErrors).toHaveBeenCalled();
      expect(result.items).toHaveLength(0);
    });
  });

  describe('getErrorById', () => {
    it('should return error if found', async () => {
      const mockError = SystemError.create({
        errorId: ErrorId.generate(),
        errorCode: 'FOUND_ERROR',
        category: ErrorCategoryType.Service,
        severity: ErrorSeverity.Error,
        message: 'Found error',
      });

      vi.mocked(mockRepository.findErrorById).mockResolvedValue(mockError);

      const result = await service.getErrorById(mockError.errorId.value);

      expect(result?.errorCode).toBe('FOUND_ERROR');
    });

    it('should return null if error not found', async () => {
      vi.mocked(mockRepository.findErrorById).mockResolvedValue(null);

      const result = await service.getErrorById('non-existent-id');

      expect(result).toBeNull();
    });

    it('should return null on repository error', async () => {
      vi.mocked(mockRepository.findErrorById).mockRejectedValue(new Error('DB error'));

      const result = await service.getErrorById('some-id');

      expect(result).toBeNull();
    });
  });

  describe('getRecentEvents', () => {
    it('should return recent events', async () => {
      const mockError = SystemError.create({
        errorId: ErrorId.generate(),
        errorCode: 'EVENT_TEST',
        category: ErrorCategoryType.Service,
        severity: ErrorSeverity.Error,
        message: 'Event test',
      });

      vi.mocked(mockRepository.createError).mockResolvedValue(mockError);

      await service.captureError({
        error: new Error('Event test'),
        errorCode: 'EVENT_TEST',
      });

      const events = service.getRecentEvents(10);

      expect(events.length).toBeGreaterThan(0);
    });
  });
});

describe('ErrorClassification', () => {
  it('should have correct enum values', () => {
    expect(ErrorClassification.BusinessError).toBe('business_error');
    expect(ErrorClassification.ValidationError).toBe('validation_error');
    expect(ErrorClassification.RepositoryError).toBe('repository_error');
    expect(ErrorClassification.ExternalProviderError).toBe('external_provider_error');
    expect(ErrorClassification.ConfigurationError).toBe('configuration_error');
    expect(ErrorClassification.InternalError).toBe('internal_error');
    expect(ErrorClassification.CriticalError).toBe('critical_error');
  });
});

describe('HTTP_STATUS_CODES', () => {
  it('should have correct status codes', () => {
    expect(HTTP_STATUS_CODES.BAD_REQUEST).toBe(400);
    expect(HTTP_STATUS_CODES.UNAUTHORIZED).toBe(401);
    expect(HTTP_STATUS_CODES.FORBIDDEN).toBe(403);
    expect(HTTP_STATUS_CODES.NOT_FOUND).toBe(404);
    expect(HTTP_STATUS_CODES.CONFLICT).toBe(409);
    expect(HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY).toBe(422);
    expect(HTTP_STATUS_CODES.TOO_MANY_REQUESTS).toBe(429);
    expect(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).toBe(500);
    expect(HTTP_STATUS_CODES.SERVICE_UNAVAILABLE).toBe(503);
  });
});
