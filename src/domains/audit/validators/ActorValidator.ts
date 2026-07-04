/**
 * Actor Validator
 *
 * Validates audit actor data according to game rules.
 */

import { AuditActorType, AUDIT_ACTOR_TYPE_CONSTRAINTS } from '../types/AuditActorType';

/**
 * Result of actor validation.
 */
export interface ActorValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validator for audit actors.
 */
export class ActorValidator {
  /**
   * Validates an actor ID.
   * @param actorId The actor ID to validate
   * @returns Validation result with any error message
   */
  public static validateActorId(actorId: string | null | undefined): ActorValidationResult {
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
   * Validates an actor type.
   * @param actorType The actor type to validate
   * @returns Validation result with any error message
   */
  public static validateActorType(actorType: string | null | undefined): ActorValidationResult {
    if (actorType === null || actorType === undefined) {
      return {
        isValid: false,
        error: 'Actor type is required',
      };
    }

    const validTypes = Object.values(AuditActorType);
    if (!validTypes.includes(actorType as AuditActorType)) {
      return {
        isValid: false,
        error: `Invalid actor type. Must be one of: ${validTypes.join(', ')}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a display name.
   * @param displayName The display name to validate
   * @returns Validation result with any error message
   */
  public static validateDisplayName(displayName: string | null | undefined): ActorValidationResult {
    if (displayName === null || displayName === undefined) {
      return {
        isValid: false,
        error: 'Display name is required',
      };
    }

    if (displayName.trim().length === 0) {
      return {
        isValid: false,
        error: 'Display name cannot be empty',
      };
    }

    if (displayName.trim().length < AUDIT_ACTOR_TYPE_CONSTRAINTS.MIN_DISPLAY_NAME_LENGTH) {
      return {
        isValid: false,
        error: `Display name must be at least ${AUDIT_ACTOR_TYPE_CONSTRAINTS.MIN_DISPLAY_NAME_LENGTH} character(s)`,
      };
    }

    if (displayName.length > AUDIT_ACTOR_TYPE_CONSTRAINTS.MAX_DISPLAY_NAME_LENGTH) {
      return {
        isValid: false,
        error: `Display name must be at most ${AUDIT_ACTOR_TYPE_CONSTRAINTS.MAX_DISPLAY_NAME_LENGTH} characters`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates all actor fields together.
   * @param params Actor fields to validate
   * @returns Validation result with any error message
   */
  public static validateActor(params: {
    actorId?: string;
    actorType?: string;
    displayName?: string;
  }): ActorValidationResult {
    const actorIdResult = this.validateActorId(params.actorId);
    if (!actorIdResult.isValid) return actorIdResult;

    const actorTypeResult = this.validateActorType(params.actorType);
    if (!actorTypeResult.isValid) return actorTypeResult;

    const displayNameResult = this.validateDisplayName(params.displayName);
    if (!displayNameResult.isValid) return displayNameResult;

    return { isValid: true };
  }

  /**
   * Validates an actor and throws if invalid.
   * @param params Actor fields to validate
   * @throws Error with validation details if invalid
   */
  public static validateActorOrThrow(params: {
    actorId?: string;
    actorType?: string;
    displayName?: string;
  }): void {
    const result = this.validateActor(params);
    if (!result.isValid) {
      throw new Error(`Actor validation failed: ${result.error}`);
    }
  }
}
