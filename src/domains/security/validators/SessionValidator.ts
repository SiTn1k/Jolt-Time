/**
 * Session Validator
 *
 * Validates security session data according to domain rules.
 */

import { SessionStatus, SESSION_STATUS_CONSTRAINTS } from '../types/SessionStatus';
import { SECURITY_METADATA_CONSTRAINTS } from '../types/SecurityMetadata';

/**
 * Result of session validation.
 */
export interface SessionValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validator for security sessions.
 */
export class SessionValidator {
  /**
   * Validates an actor ID.
   * @param actorId The actor ID to validate
   * @returns Validation result with any error message
   */
  public static validateActorId(actorId: string | null | undefined): SessionValidationResult {
    if (actorId === null || actorId === undefined) {
      return {
        isValid: false,
        error: 'Actor ID is required',
      };
    }

    if (actorId.trim().length === 0) {
      return {
        isValid: false,
        error: 'Actor ID cannot be empty',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a session status.
   * @param status The status to validate
   * @returns Validation result with any error message
   */
  public static validateStatus(status: string | null | undefined): SessionValidationResult {
    if (status === null || status === undefined) {
      return {
        isValid: false,
        error: 'Status is required',
      };
    }

    const validStatuses = SESSION_STATUS_CONSTRAINTS.VALID_STATUSES;
    if (!validStatuses.includes(status as SessionStatus)) {
      return {
        isValid: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates an IP address.
   * @param ipAddress The IP address to validate
   * @returns Validation result with any error message
   */
  public static validateIpAddress(ipAddress: string | null | undefined): SessionValidationResult {
    if (ipAddress === null || ipAddress === undefined) {
      return {
        isValid: false,
        error: 'IP address is required',
      };
    }

    if (ipAddress.trim().length === 0) {
      return {
        isValid: false,
        error: 'IP address cannot be empty',
      };
    }

    if (ipAddress.length > SECURITY_METADATA_CONSTRAINTS.MAX_IP_ADDRESS_LENGTH) {
      return {
        isValid: false,
        error: `IP address must be at most ${SECURITY_METADATA_CONSTRAINTS.MAX_IP_ADDRESS_LENGTH} characters`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a device identifier.
   * @param device The device identifier to validate
   * @returns Validation result with any error message
   */
  public static validateDevice(device: string | null | undefined): SessionValidationResult {
    if (device === null || device === undefined) {
      return {
        isValid: false,
        error: 'Device is required',
      };
    }

    if (device.trim().length === 0) {
      return {
        isValid: false,
        error: 'Device cannot be empty',
      };
    }

    if (device.length > 512) {
      return {
        isValid: false,
        error: 'Device must be at most 512 characters',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates an expiration date.
   * @param expiresAt The expiration date to validate
   * @returns Validation result with any error message
   */
  public static validateExpiresAt(expiresAt: Date | string | null | undefined): SessionValidationResult {
    if (expiresAt === null || expiresAt === undefined) {
      return {
        isValid: false,
        error: 'Expiration date is required',
      };
    }

    const expirationDate = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt;

    if (isNaN(expirationDate.getTime())) {
      return {
        isValid: false,
        error: 'Expiration date must be a valid date',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates session metadata.
   * @param metadata The metadata to validate
   * @returns Validation result with any error message
   */
  public static validateMetadata(metadata: Record<string, unknown> | null | undefined): SessionValidationResult {
    if (metadata === null || metadata === undefined) {
      return { isValid: true };
    }

    if (metadata.userAgent && typeof metadata.userAgent === 'string') {
      if (metadata.userAgent.length > SECURITY_METADATA_CONSTRAINTS.MAX_USER_AGENT_LENGTH) {
        return {
          isValid: false,
          error: `User agent must be at most ${SECURITY_METADATA_CONSTRAINTS.MAX_USER_AGENT_LENGTH} characters`,
        };
      }
    }

    return { isValid: true };
  }

  /**
   * Validates all session fields together.
   * @param params Session fields to validate
   * @returns Validation result with any error message
   */
  public static validateSession(params: {
    actorId?: string;
    status?: string;
    ipAddress?: string;
    device?: string;
    expiresAt?: Date | string;
    metadata?: Record<string, unknown>;
  }): SessionValidationResult {
    const actorIdResult = this.validateActorId(params.actorId);
    if (!actorIdResult.isValid) return actorIdResult;

    const statusResult = this.validateStatus(params.status);
    if (!statusResult.isValid) return statusResult;

    const ipAddressResult = this.validateIpAddress(params.ipAddress);
    if (!ipAddressResult.isValid) return ipAddressResult;

    const deviceResult = this.validateDevice(params.device);
    if (!deviceResult.isValid) return deviceResult;

    const expiresAtResult = this.validateExpiresAt(params.expiresAt);
    if (!expiresAtResult.isValid) return expiresAtResult;

    const metadataResult = this.validateMetadata(params.metadata);
    if (!metadataResult.isValid) return metadataResult;

    return { isValid: true };
  }

  /**
   * Validates a session and throws if invalid.
   * @param params Session fields to validate
   * @throws Error with validation details if invalid
   */
  public static validateSessionOrThrow(params: {
    actorId?: string;
    status?: string;
    ipAddress?: string;
    device?: string;
    expiresAt?: Date | string;
    metadata?: Record<string, unknown>;
  }): void {
    const result = this.validateSession(params);
    if (!result.isValid) {
      throw new Error(`Session validation failed: ${result.error}`);
    }
  }

  /**
   * Validates a session update.
   * @param params Session fields to validate
   * @returns Validation result with any error message
   */
  public static validateSessionUpdate(params: {
    status?: string;
    expiresAt?: Date | string;
    metadata?: Record<string, unknown>;
  }): SessionValidationResult {
    if (params.status !== undefined) {
      const statusResult = this.validateStatus(params.status);
      if (!statusResult.isValid) return statusResult;
    }

    if (params.expiresAt !== undefined) {
      const expiresAtResult = this.validateExpiresAt(params.expiresAt);
      if (!expiresAtResult.isValid) return expiresAtResult;
    }

    if (params.metadata !== undefined) {
      const metadataResult = this.validateMetadata(params.metadata);
      if (!metadataResult.isValid) return metadataResult;
    }

    return { isValid: true };
  }
}
