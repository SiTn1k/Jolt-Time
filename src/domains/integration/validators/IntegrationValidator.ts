/**
 * Integration Validator
 *
 * Comprehensive validation for integration-related operations.
 */

import type { CreateIntegrationProviderDto } from '../dto/IntegrationProvider.dto';
import type { UpdateIntegrationProviderDto } from '../dto/IntegrationProvider.dto';
import type { CreateIntegrationRequestDto } from '../dto/IntegrationRequest.dto';
import type { CreateIntegrationResponseDto } from '../dto/IntegrationResponse.dto';
import { IntegrationType, isValidIntegrationType } from '../types/IntegrationType';
import { IntegrationStatus } from '../types/IntegrationStatus';
import { RequestStatus } from '../types/RequestStatus';

/** Valid integration type values */
const VALID_INTEGRATION_TYPES: IntegrationType[] = [
  'telegram',
  'webhook',
  'rest_api',
  'payment',
  'email',
  'storage',
  'ai',
  'other',
];

/** Valid integration status values */
const VALID_INTEGRATION_STATUSES: IntegrationStatus[] = [
  'active',
  'inactive',
  'suspended',
  'pending',
  'error',
];

/** Valid request status values */
const VALID_REQUEST_STATUSES: RequestStatus[] = [
  'pending',
  'processing',
  'completed',
  'failed',
  'timeout',
  'cancelled',
];

/**
 * Validation error details.
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validation result for integration validation.
 */
export interface IntegrationValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Comprehensive validator for integration operations.
 */
export class IntegrationValidator {
  /**
   * Validates a CreateIntegrationProviderDto.
   * @param dto The DTO to validate
   * @returns Validation result with any errors
   */
  public static validateCreateProvider(dto: CreateIntegrationProviderDto): IntegrationValidationResult {
    const errors: ValidationError[] = [];

    // Provider name validation
    if (!dto.providerName || dto.providerName.trim().length === 0) {
      errors.push({ field: 'providerName', message: 'Provider name is required' });
    } else if (dto.providerName.length > 255) {
      errors.push({ field: 'providerName', message: 'Provider name must be at most 255 characters' });
    }

    // Provider type validation
    if (!dto.providerType) {
      errors.push({ field: 'providerType', message: 'Provider type is required' });
    } else if (!isValidIntegrationType(dto.providerType)) {
      errors.push({
        field: 'providerType',
        message: `Invalid provider type. Must be one of: ${VALID_INTEGRATION_TYPES.join(', ')}`,
      });
    }

    // Status validation (optional)
    if (dto.status !== undefined) {
      if (!VALID_INTEGRATION_STATUSES.includes(dto.status)) {
        errors.push({
          field: 'status',
          message: `Invalid status. Must be one of: ${VALID_INTEGRATION_STATUSES.join(', ')}`,
        });
      }
    }

    // Version validation (optional)
    if (dto.version !== undefined && dto.version.length > 50) {
      errors.push({ field: 'version', message: 'Version must be at most 50 characters' });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates an UpdateIntegrationProviderDto.
   * @param dto The DTO to validate
   * @returns Validation result with any errors
   */
  public static validateUpdateProvider(dto: UpdateIntegrationProviderDto): IntegrationValidationResult {
    const errors: ValidationError[] = [];

    // Provider name validation (optional)
    if (dto.providerName !== undefined) {
      if (dto.providerName.trim().length === 0) {
        errors.push({ field: 'providerName', message: 'Provider name cannot be empty' });
      } else if (dto.providerName.length > 255) {
        errors.push({ field: 'providerName', message: 'Provider name must be at most 255 characters' });
      }
    }

    // Status validation (optional)
    if (dto.status !== undefined) {
      if (!VALID_INTEGRATION_STATUSES.includes(dto.status)) {
        errors.push({
          field: 'status',
          message: `Invalid status. Must be one of: ${VALID_INTEGRATION_STATUSES.join(', ')}`,
        });
      }
    }

    // Version validation (optional)
    if (dto.version !== undefined && dto.version.length > 50) {
      errors.push({ field: 'version', message: 'Version must be at most 50 characters' });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates a CreateIntegrationRequestDto.
   * @param dto The DTO to validate
   * @returns Validation result with any errors
   */
  public static validateCreateRequest(dto: CreateIntegrationRequestDto): IntegrationValidationResult {
    const errors: ValidationError[] = [];

    // Provider ID validation
    if (!dto.providerId || dto.providerId.trim().length === 0) {
      errors.push({ field: 'providerId', message: 'Provider ID is required' });
    }

    // Request type validation
    if (!dto.requestType || dto.requestType.trim().length === 0) {
      errors.push({ field: 'requestType', message: 'Request type is required' });
    } else if (dto.requestType.length > 100) {
      errors.push({ field: 'requestType', message: 'Request type must be at most 100 characters' });
    }

    // Payload validation (optional)
    if (dto.payload !== undefined && typeof dto.payload !== 'object') {
      errors.push({ field: 'payload', message: 'Payload must be an object' });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates a CreateIntegrationResponseDto.
   * @param dto The DTO to validate
   * @returns Validation result with any errors
   */
  public static validateCreateResponse(dto: CreateIntegrationResponseDto): IntegrationValidationResult {
    const errors: ValidationError[] = [];

    // Request ID validation
    if (!dto.requestId || dto.requestId.trim().length === 0) {
      errors.push({ field: 'requestId', message: 'Request ID is required' });
    }

    // Status validation (optional)
    if (dto.status !== undefined) {
      if (!VALID_REQUEST_STATUSES.includes(dto.status)) {
        errors.push({
          field: 'status',
          message: `Invalid status. Must be one of: ${VALID_REQUEST_STATUSES.join(', ')}`,
        });
      }
    }

    // Response code validation (optional)
    if (dto.responseCode !== undefined) {
      if (typeof dto.responseCode !== 'number' || dto.responseCode < 100 || dto.responseCode > 599) {
        errors.push({ field: 'responseCode', message: 'Response code must be a valid HTTP status code (100-599)' });
      }
    }

    // Payload validation (optional)
    if (dto.payload !== undefined && typeof dto.payload !== 'object') {
      errors.push({ field: 'payload', message: 'Payload must be an object' });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates a CreateIntegrationProviderDto and throws if invalid.
   * @param dto The DTO to validate
   * @throws Error with validation details if invalid
   */
  public static validateCreateProviderOrThrow(dto: CreateIntegrationProviderDto): void {
    const result = this.validateCreateProvider(dto);
    if (!result.isValid) {
      const messages = result.errors.map((e) => `${e.field}: ${e.message}`).join('; ');
      throw new Error(`Integration validation failed: ${messages}`);
    }
  }

  /**
   * Validates an UpdateIntegrationProviderDto and throws if invalid.
   * @param dto The DTO to validate
   * @throws Error with validation details if invalid
   */
  public static validateUpdateProviderOrThrow(dto: UpdateIntegrationProviderDto): void {
    const result = this.validateUpdateProvider(dto);
    if (!result.isValid) {
      const messages = result.errors.map((e) => `${e.field}: ${e.message}`).join('; ');
      throw new Error(`Integration validation failed: ${messages}`);
    }
  }

  /**
   * Validates a CreateIntegrationRequestDto and throws if invalid.
   * @param dto The DTO to validate
   * @throws Error with validation details if invalid
   */
  public static validateCreateRequestOrThrow(dto: CreateIntegrationRequestDto): void {
    const result = this.validateCreateRequest(dto);
    if (!result.isValid) {
      const messages = result.errors.map((e) => `${e.field}: ${e.message}`).join('; ');
      throw new Error(`Integration validation failed: ${messages}`);
    }
  }

  /**
   * Validates a CreateIntegrationResponseDto and throws if invalid.
   * @param dto The DTO to validate
   * @throws Error with validation details if invalid
   */
  public static validateCreateResponseOrThrow(dto: CreateIntegrationResponseDto): void {
    const result = this.validateCreateResponse(dto);
    if (!result.isValid) {
      const messages = result.errors.map((e) => `${e.field}: ${e.message}`).join('; ');
      throw new Error(`Integration validation failed: ${messages}`);
    }
  }

  /**
   * Validates that a status transition is allowed for providers.
   * @param fromStatus Current status
   * @param toStatus Target status
   * @returns Validation result
   */
  public static validateProviderStatusTransition(
    fromStatus: IntegrationStatus,
    toStatus: IntegrationStatus
  ): IntegrationValidationResult {
    const errors: ValidationError[] = [];

    // Define allowed transitions
    const allowedTransitions: Record<IntegrationStatus, IntegrationStatus[]> = {
      pending: ['active', 'inactive', 'suspended'],
      active: ['inactive', 'suspended', 'error'],
      inactive: ['active', 'suspended', 'error'],
      suspended: ['active', 'inactive', 'error'],
      error: ['active', 'inactive', 'suspended'],
    };

    const allowed = allowedTransitions[fromStatus] || [];
    if (!allowed.includes(toStatus)) {
      errors.push({
        field: 'status',
        message: `Cannot transition from ${fromStatus} to ${toStatus}`,
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
