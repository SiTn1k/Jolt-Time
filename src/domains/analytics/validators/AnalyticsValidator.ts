/**
 * Analytics Validator
 *
 * Validates analytics event data according to game rules.
 */

import { AnalyticsEventType, ANALYTICS_EVENT_TYPE_CONSTRAINTS } from '../types/AnalyticsEventType';

/**
 * Result of analytics event validation.
 */
export interface AnalyticsEventValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validator for analytics events.
 */
export class AnalyticsValidator {
  /**
   * Validates an analytics event type.
   * @param eventType The event type to validate
   * @returns Validation result with any error message
   */
  public static validateEventType(eventType: string | null | undefined): AnalyticsEventValidationResult {
    if (eventType === null || eventType === undefined) {
      return {
        isValid: false,
        error: 'Event type is required',
      };
    }

    const validTypes = Object.values(AnalyticsEventType);
    if (!validTypes.includes(eventType as AnalyticsEventType)) {
      return {
        isValid: false,
        error: `Invalid event type. Must be one of: ${validTypes.join(', ')}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a source module name.
   * @param sourceModule The source module to validate
   * @returns Validation result with any error message
   */
  public static validateSourceModule(sourceModule: string | null | undefined): AnalyticsEventValidationResult {
    if (sourceModule === null || sourceModule === undefined) {
      return {
        isValid: false,
        error: 'Source module is required',
      };
    }

    if (sourceModule.trim().length === 0) {
      return {
        isValid: false,
        error: 'Source module cannot be empty',
      };
    }

    if (sourceModule.length > ANALYTICS_EVENT_TYPE_CONSTRAINTS.MAX_SOURCE_MODULE_LENGTH) {
      return {
        isValid: false,
        error: `Source module must be at most ${ANALYTICS_EVENT_TYPE_CONSTRAINTS.MAX_SOURCE_MODULE_LENGTH} characters`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates an event payload size.
   * @param payload The payload to validate
   * @returns Validation result with any error message
   */
  public static validatePayload(payload: Record<string, unknown> | null | undefined): AnalyticsEventValidationResult {
    if (payload === null || payload === undefined) {
      return { isValid: true }; // Empty payload is valid
    }

    const payloadSize = JSON.stringify(payload).length;
    if (payloadSize > ANALYTICS_EVENT_TYPE_CONSTRAINTS.MAX_PAYLOAD_SIZE) {
      return {
        isValid: false,
        error: `Payload size exceeds maximum of ${ANALYTICS_EVENT_TYPE_CONSTRAINTS.MAX_PAYLOAD_SIZE} bytes`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a player profile ID.
   * @param playerProfileId The player profile ID to validate
   * @returns Validation result with any error message
   */
  public static validatePlayerProfileId(playerProfileId: string | null | undefined): AnalyticsEventValidationResult {
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
   * Validates a session ID.
   * @param sessionId The session ID to validate
   * @returns Validation result with any error message
   */
  public static validateSessionId(sessionId: string | null | undefined): AnalyticsEventValidationResult {
    if (sessionId === null || sessionId === undefined) {
      return {
        isValid: false,
        error: 'Session ID is required',
      };
    }

    if (sessionId.trim().length === 0) {
      return {
        isValid: false,
        error: 'Session ID cannot be empty',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates all event fields together.
   * @param params Event fields to validate
   * @returns Validation result with any error message
   */
  public static validateEvent(params: {
    eventType?: string;
    playerProfileId?: string;
    sessionId?: string;
    sourceModule?: string;
    payload?: Record<string, unknown>;
  }): AnalyticsEventValidationResult {
    const typeResult = this.validateEventType(params.eventType);
    if (!typeResult.isValid) return typeResult;

    const playerResult = this.validatePlayerProfileId(params.playerProfileId);
    if (!playerResult.isValid) return playerResult;

    const sessionResult = this.validateSessionId(params.sessionId);
    if (!sessionResult.isValid) return sessionResult;

    const sourceResult = this.validateSourceModule(params.sourceModule);
    if (!sourceResult.isValid) return sourceResult;

    const payloadResult = this.validatePayload(params.payload);
    if (!payloadResult.isValid) return payloadResult;

    return { isValid: true };
  }

  /**
   * Validates an event and throws if invalid.
   * @param params Event fields to validate
   * @throws Error with validation details if invalid
   */
  public static validateEventOrThrow(params: {
    eventType?: string;
    playerProfileId?: string;
    sessionId?: string;
    sourceModule?: string;
    payload?: Record<string, unknown>;
  }): void {
    const result = this.validateEvent(params);
    if (!result.isValid) {
      throw new Error(`Analytics event validation failed: ${result.error}`);
    }
  }
}
