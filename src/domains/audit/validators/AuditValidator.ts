/**
 * Audit Validator
 *
 * Validates audit record data according to game rules.
 */

import { AuditAction, AUDIT_ACTION_CONSTRAINTS } from '../types/AuditAction';
import { AuditResult } from '../types/AuditResult';
import { AuditActorType } from '../types/AuditActorType';
import { AUDIT_METADATA_CONSTRAINTS } from '../types/AuditMetadata';

/**
 * Result of audit record validation.
 */
export interface AuditValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validator for audit records.
 */
export class AuditValidator {
  /**
   * Validates an audit action type.
   * @param action The action to validate
   * @returns Validation result with any error message
   */
  public static validateAction(action: string | null | undefined): AuditValidationResult {
    if (action === null || action === undefined) {
      return {
        isValid: false,
        error: 'Action is required',
      };
    }

    const validActions = Object.values(AuditAction);
    if (!validActions.includes(action as AuditAction)) {
      return {
        isValid: false,
        error: `Invalid action type. Must be one of: ${validActions.join(', ')}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates an audit result type.
   * @param result The result to validate
   * @returns Validation result with any error message
   */
  public static validateResult(result: string | null | undefined): AuditValidationResult {
    if (result === null || result === undefined) {
      return {
        isValid: false,
        error: 'Result is required',
      };
    }

    const validResults = Object.values(AuditResult);
    if (!validResults.includes(result as AuditResult)) {
      return {
        isValid: false,
        error: `Invalid result type. Must be one of: ${validResults.join(', ')}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates an audit actor type.
   * @param actorType The actor type to validate
   * @returns Validation result with any error message
   */
  public static validateActorType(actorType: string | null | undefined): AuditValidationResult {
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
   * Validates a target type.
   * @param targetType The target type to validate
   * @returns Validation result with any error message
   */
  public static validateTargetType(targetType: string | null | undefined): AuditValidationResult {
    if (targetType === null || targetType === undefined) {
      return {
        isValid: false,
        error: 'Target type is required',
      };
    }

    if (targetType.trim().length === 0) {
      return {
        isValid: false,
        error: 'Target type cannot be empty',
      };
    }

    if (targetType.length > AUDIT_ACTION_CONSTRAINTS.MAX_TARGET_TYPE_LENGTH) {
      return {
        isValid: false,
        error: `Target type must be at most ${AUDIT_ACTION_CONSTRAINTS.MAX_TARGET_TYPE_LENGTH} characters`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates a target ID.
   * @param targetId The target ID to validate
   * @returns Validation result with any error message
   */
  public static validateTargetId(targetId: string | null | undefined): AuditValidationResult {
    if (targetId === null || targetId === undefined) {
      return {
        isValid: false,
        error: 'Target ID is required',
      };
    }

    if (targetId.trim().length === 0) {
      return {
        isValid: false,
        error: 'Target ID cannot be empty',
      };
    }

    if (targetId.length > AUDIT_ACTION_CONSTRAINTS.MAX_TARGET_ID_LENGTH) {
      return {
        isValid: false,
        error: `Target ID must be at most ${AUDIT_ACTION_CONSTRAINTS.MAX_TARGET_ID_LENGTH} characters`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates an actor ID.
   * @param actorId The actor ID to validate
   * @returns Validation result with any error message
   */
  public static validateActorId(actorId: string | null | undefined): AuditValidationResult {
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
   * Validates a category ID.
   * @param categoryId The category ID to validate
   * @returns Validation result with any error message
   */
  public static validateCategoryId(categoryId: string | null | undefined): AuditValidationResult {
    if (categoryId === null || categoryId === undefined) {
      return { isValid: true }; // Category ID is optional
    }

    if (categoryId.trim().length === 0) {
      return {
        isValid: false,
        error: 'Category ID cannot be empty if provided',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates metadata fields.
   * @param metadata The metadata to validate
   * @returns Validation result with any error message
   */
  public static validateMetadata(metadata: Record<string, unknown> | null | undefined): AuditValidationResult {
    if (metadata === null || metadata === undefined) {
      return { isValid: true }; // Metadata is optional
    }

    if (metadata.ipAddress && typeof metadata.ipAddress === 'string') {
      if (metadata.ipAddress.length > AUDIT_METADATA_CONSTRAINTS.MAX_IP_ADDRESS_LENGTH) {
        return {
          isValid: false,
          error: `IP address must be at most ${AUDIT_METADATA_CONSTRAINTS.MAX_IP_ADDRESS_LENGTH} characters`,
        };
      }
    }

    if (metadata.location && typeof metadata.location === 'string') {
      if (metadata.location.length > AUDIT_METADATA_CONSTRAINTS.MAX_LOCATION_LENGTH) {
        return {
          isValid: false,
          error: `Location must be at most ${AUDIT_METADATA_CONSTRAINTS.MAX_LOCATION_LENGTH} characters`,
        };
      }
    }

    if (metadata.reason && typeof metadata.reason === 'string') {
      if (metadata.reason.length > AUDIT_METADATA_CONSTRAINTS.MAX_REASON_LENGTH) {
        return {
          isValid: false,
          error: `Reason must be at most ${AUDIT_METADATA_CONSTRAINTS.MAX_REASON_LENGTH} characters`,
        };
      }
    }

    if (metadata.notes && typeof metadata.notes === 'string') {
      if (metadata.notes.length > AUDIT_METADATA_CONSTRAINTS.MAX_NOTES_LENGTH) {
        return {
          isValid: false,
          error: `Notes must be at most ${AUDIT_METADATA_CONSTRAINTS.MAX_NOTES_LENGTH} characters`,
        };
      }
    }

    return { isValid: true };
  }

  /**
   * Validates all audit record fields together.
   * @param params Audit record fields to validate
   * @returns Validation result with any error message
   */
  public static validateRecord(params: {
    actorId?: string;
    actorType?: string;
    action?: string;
    targetType?: string;
    targetId?: string;
    categoryId?: string;
    result?: string;
    metadata?: Record<string, unknown>;
  }): AuditValidationResult {
    const actorIdResult = this.validateActorId(params.actorId);
    if (!actorIdResult.isValid) return actorIdResult;

    const actorTypeResult = this.validateActorType(params.actorType);
    if (!actorTypeResult.isValid) return actorTypeResult;

    const actionResult = this.validateAction(params.action);
    if (!actionResult.isValid) return actionResult;

    const targetTypeResult = this.validateTargetType(params.targetType);
    if (!targetTypeResult.isValid) return targetTypeResult;

    const targetIdResult = this.validateTargetId(params.targetId);
    if (!targetIdResult.isValid) return targetIdResult;

    const categoryIdResult = this.validateCategoryId(params.categoryId);
    if (!categoryIdResult.isValid) return categoryIdResult;

    const resultResult = this.validateResult(params.result);
    if (!resultResult.isValid) return resultResult;

    const metadataResult = this.validateMetadata(params.metadata);
    if (!metadataResult.isValid) return metadataResult;

    return { isValid: true };
  }

  /**
   * Validates a record and throws if invalid.
   * @param params Record fields to validate
   * @throws Error with validation details if invalid
   */
  public static validateRecordOrThrow(params: {
    actorId?: string;
    actorType?: string;
    action?: string;
    targetType?: string;
    targetId?: string;
    categoryId?: string;
    result?: string;
    metadata?: Record<string, unknown>;
  }): void {
    const result = this.validateRecord(params);
    if (!result.isValid) {
      throw new Error(`Audit record validation failed: ${result.error}`);
    }
  }
}
