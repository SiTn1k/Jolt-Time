/**
 * Session Validator
 *
 * Validates session-related values according to game rules.
 */

import type { SessionId } from '../value-objects/SessionId';
import { SessionState } from '../types/SessionState';

const SESSION_ID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Result of session validation.
 */
export interface SessionValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validator for session-related values.
 */
export class SessionValidator {
  /**
   * Validates a session ID string.
   * @param sessionId The session ID to validate
   * @returns Validation result with any error message
   */
  public static validateSessionId(sessionId: string): SessionValidationResult {
    if (!sessionId || sessionId.trim().length === 0) {
      return {
        isValid: false,
        error: 'Session ID cannot be empty',
      };
    }

    if (!SESSION_ID_REGEX.test(sessionId)) {
      return {
        isValid: false,
        error: 'Invalid session ID format',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a session ID string and throws if invalid.
   * @param sessionId The session ID to validate
   * @throws Error with validation details if invalid
   */
  public static validateSessionIdOrThrow(sessionId: string): void {
    const result = this.validateSessionId(sessionId);
    if (!result.isValid) {
      throw new Error(`Session ID validation failed: ${result.error}`);
    }
  }

  /**
   * Validates that a session ID is not empty.
   * @param sessionId The session ID to validate
   * @returns Validation result with any error message
   */
  public static validateSessionActive(sessionId: SessionId): SessionValidationResult {
    if (sessionId.isEmpty) {
      return {
        isValid: false,
        error: 'No active session',
      };
    }
    return { isValid: true };
  }

  /**
   * Validates a session state transition.
   * @param currentState Current session state
   * @param newState New session state
   * @returns Validation result with any error message
   */
  public static validateStateTransition(
    currentState: SessionState,
    newState: SessionState
  ): SessionValidationResult {
    // Define valid transitions
    const validTransitions: Record<SessionState, SessionState[]> = {
      [SessionState.NONE]: [SessionState.STARTING],
      [SessionState.STARTING]: [SessionState.ACTIVE, SessionState.NONE],
      [SessionState.ACTIVE]: [SessionState.PAUSED, SessionState.ENDED, SessionState.INTERRUPTED],
      [SessionState.PAUSED]: [SessionState.ACTIVE, SessionState.ENDED, SessionState.INTERRUPTED],
      [SessionState.ENDED]: [SessionState.NONE],
      [SessionState.INTERRUPTED]: [SessionState.STARTING, SessionState.NONE],
    };

    const allowedStates = validTransitions[currentState];
    if (!allowedStates || !allowedStates.includes(newState)) {
      return {
        isValid: false,
        error: `Invalid session state transition from ${currentState} to ${newState}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates that a session state transition is valid and throws if invalid.
   * @param currentState Current session state
   * @param newState New session state
   * @throws Error with validation details if invalid
   */
  public static validateStateTransitionOrThrow(
    currentState: SessionState,
    newState: SessionState
  ): void {
    const result = this.validateStateTransition(currentState, newState);
    if (!result.isValid) {
      throw new Error(`Session state transition validation failed: ${result.error}`);
    }
  }
}