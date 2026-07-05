/**
 * Request Validator Service Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RequestValidatorService } from '../services/RequestValidatorService';
import { ApiRequest } from '../entities/ApiRequest';
import type { ILogger } from '../../../shared/types/interfaces';

describe('RequestValidatorService', () => {
  let validator: RequestValidatorService;
  let mockLogger: ILogger;

  beforeEach(() => {
    mockLogger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      fatal: vi.fn(),
    };
    validator = new RequestValidatorService(mockLogger);
  });

  const createValidRequest = (): ApiRequest =>
    ApiRequest.create({
      routeId: 'test-route',
      method: 'GET',
      path: '/test',
      headers: { 'content-type': 'application/json' },
      query: { page: '1' },
    });

  describe('validate', () => {
    it('should validate a valid request', () => {
      const request = createValidRequest();
      const result = validator.validate(request);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail for empty path', () => {
      const request = ApiRequest.create({
        routeId: 'test-route',
        method: 'GET',
        path: '',
      });

      const result = validator.validate(request);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.code === 'PATH_REQUIRED')).toBe(true);
    });

    it('should fail for path without leading slash', () => {
      const request = ApiRequest.create({
        routeId: 'test-route',
        method: 'GET',
        path: 'test', // Missing leading slash
      });

      const result = validator.validate(request);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.code === 'PATH_INVALID_FORMAT')).toBe(true);
    });

    it('should fail for invalid HTTP method', () => {
      const request = ApiRequest.create({
        routeId: 'test-route',
        method: 'INVALID' as any,
        path: '/test',
      });

      const result = validator.validate(request);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.code === 'METHOD_INVALID')).toBe(true);
    });

    it('should fail for empty method', () => {
      const request = ApiRequest.create({
        routeId: 'test-route',
        method: '' as any,
        path: '/test',
      });

      const result = validator.validate(request);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.code === 'METHOD_REQUIRED')).toBe(true);
    });
  });

  describe('registerRule', () => {
    it('should register a custom validation rule', () => {
      validator.registerRule({
        name: 'custom-rule',
        validate: () => ({
          isValid: true,
          errors: [],
        }),
      });

      expect(validator.getRuleCount()).toBeGreaterThan(6); // 6 default rules
    });

    it('should include custom rule in validation', () => {
      let customRuleCalled = false;

      validator.registerRule({
        name: 'custom-rule',
        validate: () => {
          customRuleCalled = true;
          return { isValid: true, errors: [] };
        },
      });

      const request = createValidRequest();
      validator.validate(request);

      expect(customRuleCalled).toBe(true);
    });
  });

  describe('configuration', () => {
    it('should use custom config for max path size', () => {
      const customValidator = new RequestValidatorService(mockLogger, {
        maxPathSize: 10,
      });

      const request = ApiRequest.create({
        routeId: 'test-route',
        method: 'GET',
        path: '/this-is-a-very-long-path-that-exceeds-limit',
      });

      const result = customValidator.validate(request);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.code === 'PATH_TOO_LONG')).toBe(true);
    });

    it('should use custom config for allowed content types', () => {
      const customValidator = new RequestValidatorService(mockLogger, {
        allowedContentTypes: ['application/xml'],
        requireContentType: true,
      });

      const request = ApiRequest.create({
        routeId: 'test-route',
        method: 'POST',
        path: '/test',
        headers: { 'content-type': 'application/json' },
      });

      const result = customValidator.validate(request);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.code === 'CONTENT_TYPE_NOT_ALLOWED')).toBe(true);
    });
  });

  describe('getRuleCount', () => {
    it('should return the number of registered rules', () => {
      expect(validator.getRuleCount()).toBeGreaterThan(0);
    });
  });
});
