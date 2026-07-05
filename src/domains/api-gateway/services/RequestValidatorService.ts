/**
 * Request Validator Service
 *
 * Handles validation of incoming HTTP requests.
 * Validates headers, query parameters, body, path parameters, content type, and payload size.
 *
 * IMPORTANT: Request Validator is a VALIDATION layer. It MUST NEVER:
 * - Execute gameplay
 * - Grant rewards
 * - Modify balances
 * - Modify inventory
 * - Execute any business logic
 */

import type { ApiRequest } from '../entities/ApiRequest';
import type { HttpMethod } from '../types/HttpMethod';
import type { ILogger } from '../../../shared/types/interfaces';

/**
 * Validation rule for a specific aspect of the request.
 */
export interface ValidationRule {
  name: string;
  validate: (request: ApiRequest) => ValidationResult;
}

/**
 * Validation result type.
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validation error details.
 */
export interface ValidationError {
  field: string;
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * RequestValidatorService class.
 * Validates incoming requests against defined rules.
 */
export class RequestValidatorService {
  private readonly _rules: ValidationRule[] = [];
  private readonly _logger: ILogger;
  private readonly _config: ValidatorConfig;

  /**
   * Creates a new RequestValidatorService.
   */
  constructor(logger?: ILogger, config?: Partial<ValidatorConfig>) {
    this._logger = logger || this.createDefaultLogger();
    this._config = this.mergeConfig(config);
    this.registerDefaultRules();
  }

  /**
   * Creates a default logger.
   */
  private createDefaultLogger(): ILogger {
    const { createLogger } = require('../../../core/logging/logger.service');
    return createLogger('RequestValidatorService');
  }

  /**
   * Merges provided config with defaults.
   */
  private mergeConfig(config?: Partial<ValidatorConfig>): ValidatorConfig {
    return {
      maxHeaderSize: config?.maxHeaderSize ?? 8192,
      maxQuerySize: config?.maxQuerySize ?? 2048,
      maxBodySize: config?.maxBodySize ?? 10 * 1024 * 1024, // 10MB
      maxPathSize: config?.maxPathSize ?? 2048,
      allowedContentTypes: config?.allowedContentTypes ?? ['application/json', 'text/plain', 'multipart/form-data'],
      requireContentType: config?.requireContentType ?? true,
      ...config,
    };
  }

  /**
   * Registers default validation rules.
   */
  private registerDefaultRules(): void {
    // Path validation
    this.registerRule({
      name: 'path',
      validate: (request) => this.validatePath(request),
    });

    // Method validation
    this.registerRule({
      name: 'method',
      validate: (request) => this.validateMethod(request),
    });

    // Headers validation
    this.registerRule({
      name: 'headers',
      validate: (request) => this.validateHeaders(request),
    });

    // Query validation
    this.registerRule({
      name: 'query',
      validate: (request) => this.validateQuery(request),
    });

    // Body validation
    this.registerRule({
      name: 'body',
      validate: (request) => this.validateBody(request),
    });

    // Content type validation
    this.registerRule({
      name: 'contentType',
      validate: (request) => this.validateContentType(request),
    });
  }

  /**
   * Registers a validation rule.
   */
  public registerRule(rule: ValidationRule): void {
    this._rules.push(rule);
    this._logger.debug(`Validation rule registered: ${rule.name}`);
  }

  /**
   * Validates an incoming request.
   */
  public validate(request: ApiRequest): ValidationResult {
    this._logger.debug('Validating request', {
      path: request.path,
      method: request.method,
    });

    const errors: ValidationError[] = [];

    for (const rule of this._rules) {
      const result = rule.validate(request);
      if (!result.isValid) {
        errors.push(...result.errors);
      }
    }

    const isValid = errors.length === 0;

    if (!isValid) {
      this._logger.warn('Request validation failed', {
        path: request.path,
        errors: errors.map((e) => e.message),
      });
    }

    return { isValid, errors };
  }

  /**
   * Validates request path.
   */
  private validatePath(request: ApiRequest): ValidationResult {
    const errors: ValidationError[] = [];

    if (!request.path || request.path.trim().length === 0) {
      errors.push({
        field: 'path',
        code: 'PATH_REQUIRED',
        message: 'Request path is required',
      });
    }

    if (request.path.length > this._config.maxPathSize) {
      errors.push({
        field: 'path',
        code: 'PATH_TOO_LONG',
        message: `Request path exceeds maximum length of ${this._config.maxPathSize} characters`,
        details: { maxSize: this._config.maxPathSize, actualSize: request.path.length },
      });
    }

    if (!request.path.startsWith('/')) {
      errors.push({
        field: 'path',
        code: 'PATH_INVALID_FORMAT',
        message: 'Request path must start with /',
      });
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates HTTP method.
   */
  private validateMethod(request: ApiRequest): ValidationResult {
    const errors: ValidationError[] = [];
    const validMethods: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];

    if (!request.method) {
      errors.push({
        field: 'method',
        code: 'METHOD_REQUIRED',
        message: 'HTTP method is required',
      });
    }

    if (!validMethods.includes(request.method)) {
      errors.push({
        field: 'method',
        code: 'METHOD_INVALID',
        message: `Invalid HTTP method. Valid methods are: ${validMethods.join(', ')}`,
        details: { validMethods },
      });
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates request headers.
   */
  private validateHeaders(request: ApiRequest): ValidationResult {
    const errors: ValidationError[] = [];

    if (!request.headers) {
      return { isValid: true, errors: [] };
    }

    const headerSize = JSON.stringify(request.headers).length;
    if (headerSize > this._config.maxHeaderSize) {
      errors.push({
        field: 'headers',
        code: 'HEADERS_TOO_LARGE',
        message: `Request headers exceed maximum size of ${this._config.maxHeaderSize} bytes`,
        details: { maxSize: this._config.maxHeaderSize, actualSize: headerSize },
      });
    }

    // Validate header values are strings or arrays
    for (const [key, value] of Object.entries(request.headers)) {
      if (value !== undefined && value !== null) {
        if (typeof value !== 'string' && !Array.isArray(value)) {
          errors.push({
            field: `headers.${key}`,
            code: 'HEADER_INVALID_TYPE',
            message: `Header "${key}" must be a string or array`,
            details: { key, valueType: typeof value },
          });
        }
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates query parameters.
   */
  private validateQuery(request: ApiRequest): ValidationResult {
    const errors: ValidationError[] = [];

    if (!request.query || Object.keys(request.query).length === 0) {
      return { isValid: true, errors: [] };
    }

    const querySize = JSON.stringify(request.query).length;
    if (querySize > this._config.maxQuerySize) {
      errors.push({
        field: 'query',
        code: 'QUERY_TOO_LARGE',
        message: `Query parameters exceed maximum size of ${this._config.maxQuerySize} bytes`,
        details: { maxSize: this._config.maxQuerySize, actualSize: querySize },
      });
    }

    // Validate query values are strings or arrays
    for (const [key, value] of Object.entries(request.query)) {
      if (value !== undefined && value !== null) {
        if (typeof value !== 'string' && !Array.isArray(value)) {
          errors.push({
            field: `query.${key}`,
            code: 'QUERY_INVALID_TYPE',
            message: `Query parameter "${key}" must be a string or array`,
            details: { key, valueType: typeof value },
          });
        }
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates request body.
   */
  private validateBody(request: ApiRequest): ValidationResult {
    const errors: ValidationError[] = [];

    if (request.body === undefined || request.body === null) {
      return { isValid: true, errors: [] };
    }

    try {
      const bodySize = JSON.stringify(request.body).length;
      if (bodySize > this._config.maxBodySize) {
        errors.push({
          field: 'body',
          code: 'BODY_TOO_LARGE',
          message: `Request body exceeds maximum size of ${this._config.maxBodySize} bytes`,
          details: { maxSize: this._config.maxBodySize, actualSize: bodySize },
        });
      }
    } catch {
      errors.push({
        field: 'body',
        code: 'BODY_NOT_SERIALIZABLE',
        message: 'Request body must be JSON serializable',
      });
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validates content type.
   */
  private validateContentType(request: ApiRequest): ValidationResult {
    const errors: ValidationError[] = [];

    const contentType = request.getHeader('content-type');
    if (!contentType && this._config.requireContentType) {
      // Only require content-type for methods that typically have bodies
      if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
        errors.push({
          field: 'headers.content-type',
          code: 'CONTENT_TYPE_REQUIRED',
          message: 'Content-Type header is required for this request method',
        });
      }
      return { isValid: errors.length === 0, errors };
    }

    if (contentType) {
      const contentTypeStr = Array.isArray(contentType) ? contentType[0] : contentType;
      const baseContentType = contentTypeStr.split(';')[0].trim();

      if (
        this._config.allowedContentTypes.length > 0 &&
        !this._config.allowedContentTypes.includes(baseContentType)
      ) {
        errors.push({
          field: 'headers.content-type',
          code: 'CONTENT_TYPE_NOT_ALLOWED',
          message: `Content-Type "${baseContentType}" is not allowed`,
          details: {
            provided: baseContentType,
            allowed: this._config.allowedContentTypes,
          },
        });
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Gets the count of registered rules.
   */
  public getRuleCount(): number {
    return this._rules.length;
  }
}

/**
 * Configuration for request validation.
 */
export interface ValidatorConfig {
  maxHeaderSize: number;
  maxQuerySize: number;
  maxBodySize: number;
  maxPathSize: number;
  allowedContentTypes: string[];
  requireContentType: boolean;
}
