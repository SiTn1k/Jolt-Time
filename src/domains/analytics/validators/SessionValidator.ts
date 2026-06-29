/**
 * Session Validator
 *
 * Validates analytics session data according to game rules.
 */

import { SessionStatus, SESSION_CONSTRAINTS } from '../types/SessionStatus';

/**
 * Result of session validation.
 */
export interface SessionValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validator for analytics sessions.
 */
export class SessionValidator {
  /**
   * Validates a player profile ID.
   * @param playerProfileId The player profile ID to validate
   * @returns Validation result with any error message
   */
  public static validatePlayerProfileId(playerProfileId: string | null | undefined): SessionValidationResult {
    if (playerProfileId === null || playerProfileId === undefined) {
      return {
        isValid: false,
        error: 'Player profile ID is required',
      };
    }

    if (playerProfileId.trim().length === 0) {
      return {
        isValid: false,
        error: 'Player profile ID cannot be empty',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a device string.
   * @param device The device to validate
   * @returns Validation result with any error message
   */
  public static validateDevice(device: string | null | undefined): SessionValidationResult {
    if (device === null || device === undefined) {
      return { isValid: true }; // Device is optional
    }

    if (device.length > SESSION_CONSTRAINTS.MAX_DEVICE_LENGTH) {
      return {
        isValid: false,
        error: `Device must be at most ${SESSION_CONSTRAINTS.MAX_DEVICE_LENGTH} characters`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a platform string.
   * @param platform The platform to validate
   * @returns Validation result with any error message
   */
  public static validatePlatform(platform: string | null | undefined): SessionValidationResult {
    if (platform === null || platform === undefined) {
      return { isValid: true }; // Platform is optional
    }

    if (platform.length > SESSION_CONSTRAINTS.MAX_PLATFORM_LENGTH) {
      return {
        isValid: false,
        error: `Platform must be at most ${SESSION_CONSTRAINTS.MAX_PLATFORM_LENGTH} characters`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a session duration.
   * @param duration The duration in milliseconds to validate
   * @returns Validation result with any error message
   */
  public static validateDuration(duration: number | null | undefined): SessionValidationResult {
    if (duration === null || duration === undefined) {
      return { isValid: true }; // Duration is optional (calculated)
    }

    if (!Number.isFinite(duration)) {
      return {
        isValid: false,
        error: 'Duration must be a finite number',
      };
    }

    if (duration < 0) {
      return {
        isValid: false,
        error: 'Duration cannot be negative',
      };
    }

    if (duration > SESSION_CONSTRAINTS.MAX_DURATION_MS) {
      return {
        isValid: false,
        error: `Duration exceeds maximum of ${SESSION_CONSTRAINTS.MAX_DURATION_MS} milliseconds`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates session start and end timestamps.
   * @param startedAt Session start timestamp (optional for session creation)
   * @param endedAt Session end timestamp (optional)
   * @returns Validation result with any error message
   */
  public static validateTimestamps(
    startedAt: Date | null | undefined,
    endedAt?: Date | null
  ): SessionValidationResult {
    // Timestamps are optional for session creation validation
    // They will be validated when the session entity is fully formed
    if (startedAt === null || startedAt === undefined) {
      return { isValid: true };
    }

    if (!(startedAt instanceof Date) || isNaN(startedAt.getTime())) {
      return {
        isValid: false,
        error: 'Invalid start timestamp',
      };
    }

    if (endedAt !== null && endedAt !== undefined) {
      if (!(endedAt instanceof Date) || isNaN(endedAt.getTime())) {
        return {
          isValid: false,
          error: 'Invalid end timestamp',
        };
      }

      if (endedAt.getTime() < startedAt.getTime()) {
        return {
          isValid: false,
          error: 'End timestamp cannot be before start timestamp',
        };
      }
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
        error: 'Session status is required',
      };
    }

    const validStatuses = Object.values(SessionStatus);
    if (!validStatuses.includes(status as SessionStatus)) {
      return {
        isValid: false,
        error: `Invalid session status. Must be one of: ${validStatuses.join(', ')}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates all session fields together.
   * @param params Session fields to validate
   * @returns Validation result with any error message
   */
  public static validateSession(params: {
    playerProfileId?: string;
    device?: string;
    platform?: string;
    duration?: number;
    startedAt?: Date;
    endedAt?: Date | null;
  }): SessionValidationResult {
    const playerResult = this.validatePlayerProfileId(params.playerProfileId);
    if (!playerResult.isValid) return playerResult;

    const deviceResult = this.validateDevice(params.device);
    if (!deviceResult.isValid) return deviceResult;

    const platformResult = this.validatePlatform(params.platform);
    if (!platformResult.isValid) return platformResult;

    const durationResult = this.validateDuration(params.duration);
    if (!durationResult.isValid) return durationResult;

    const timestampResult = this.validateTimestamps(params.startedAt, params.endedAt);
    if (!timestampResult.isValid) return timestampResult;

    return { isValid: true };
  }

  /**
   * Validates a session and throws if invalid.
   * @param params Session fields to validate
   * @throws Error with validation details if invalid
   */
  public static validateSessionOrThrow(params: {
    playerProfileId?: string;
    device?: string;
    platform?: string;
    duration?: number;
    startedAt?: Date;
    endedAt?: Date | null;
  }): void {
    const result = this.validateSession(params);
    if (!result.isValid) {
      throw new Error(`Session validation failed: ${result.error}`);
    }
  }
}
