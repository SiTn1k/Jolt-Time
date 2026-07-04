/**
 * Incident Validator
 *
 * Validates security incident data according to domain rules.
 */

import { IncidentSeverity, INCIDENT_SEVERITY_CONSTRAINTS } from '../types/IncidentSeverity';
import { IncidentStatus, INCIDENT_STATUS_CONSTRAINTS } from '../types/IncidentStatus';
import { SECURITY_METADATA_CONSTRAINTS } from '../types/SecurityMetadata';

/**
 * Result of incident validation.
 */
export interface IncidentValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validator for security incidents.
 */
export class IncidentValidator {
  /**
   * Validates an incident type.
   * @param incidentType The incident type to validate
   * @returns Validation result with any error message
   */
  public static validateIncidentType(incidentType: string | null | undefined): IncidentValidationResult {
    if (incidentType === null || incidentType === undefined) {
      return {
        isValid: false,
        error: 'Incident type is required',
      };
    }

    if (incidentType.trim().length === 0) {
      return {
        isValid: false,
        error: 'Incident type cannot be empty',
      };
    }

    if (incidentType.length > 128) {
      return {
        isValid: false,
        error: 'Incident type must be at most 128 characters',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates an incident severity.
   * @param severity The severity to validate
   * @returns Validation result with any error message
   */
  public static validateSeverity(severity: string | null | undefined): IncidentValidationResult {
    if (severity === null || severity === undefined) {
      return {
        isValid: false,
        error: 'Severity is required',
      };
    }

    const validSeverities = INCIDENT_SEVERITY_CONSTRAINTS.VALID_SEVERITIES;
    if (!validSeverities.includes(severity as IncidentSeverity)) {
      return {
        isValid: false,
        error: `Invalid severity. Must be one of: ${validSeverities.join(', ')}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates an incident status.
   * @param status The status to validate
   * @returns Validation result with any error message
   */
  public static validateStatus(status: string | null | undefined): IncidentValidationResult {
    if (status === null || status === undefined) {
      return {
        isValid: false,
        error: 'Status is required',
      };
    }

    const validStatuses = INCIDENT_STATUS_CONSTRAINTS.VALID_STATUSES;
    if (!validStatuses.includes(status as IncidentStatus)) {
      return {
        isValid: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validates an actor ID.
   * @param actorId The actor ID to validate
   * @returns Validation result with any error message
   */
  public static validateActorId(actorId: string | null | undefined): IncidentValidationResult {
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
   * Validates an incident source.
   * @param source The source to validate
   * @returns Validation result with any error message
   */
  public static validateSource(source: string | null | undefined): IncidentValidationResult {
    if (source === null || source === undefined) {
      return {
        isValid: false,
        error: 'Source is required',
      };
    }

    if (source.trim().length === 0) {
      return {
        isValid: false,
        error: 'Source cannot be empty',
      };
    }

    if (source.length > 256) {
      return {
        isValid: false,
        error: 'Source must be at most 256 characters',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates an incident description.
   * @param description The description to validate
   * @returns Validation result with any error message
   */
  public static validateDescription(description: string | null | undefined): IncidentValidationResult {
    if (description === null || description === undefined) {
      return {
        isValid: false,
        error: 'Description is required',
      };
    }

    if (description.trim().length === 0) {
      return {
        isValid: false,
        error: 'Description cannot be empty',
      };
    }

    if (description.length > 2048) {
      return {
        isValid: false,
        error: 'Description must be at most 2048 characters',
      };
    }

    return { isValid: true };
  }

  /**
   * Validates incident metadata.
   * @param metadata The metadata to validate
   * @returns Validation result with any error message
   */
  public static validateMetadata(metadata: Record<string, unknown> | null | undefined): IncidentValidationResult {
    if (metadata === null || metadata === undefined) {
      return { isValid: true };
    }

    if (metadata.ipAddress && typeof metadata.ipAddress === 'string') {
      if (metadata.ipAddress.length > SECURITY_METADATA_CONSTRAINTS.MAX_IP_ADDRESS_LENGTH) {
        return {
          isValid: false,
          error: `IP address must be at most ${SECURITY_METADATA_CONSTRAINTS.MAX_IP_ADDRESS_LENGTH} characters`,
        };
      }
    }

    if (metadata.location && typeof metadata.location === 'string') {
      if (metadata.location.length > SECURITY_METADATA_CONSTRAINTS.MAX_LOCATION_LENGTH) {
        return {
          isValid: false,
          error: `Location must be at most ${SECURITY_METADATA_CONSTRAINTS.MAX_LOCATION_LENGTH} characters`,
        };
      }
    }

    if (metadata.notes && typeof metadata.notes === 'string') {
      if (metadata.notes.length > SECURITY_METADATA_CONSTRAINTS.MAX_NOTES_LENGTH) {
        return {
          isValid: false,
          error: `Notes must be at most ${SECURITY_METADATA_CONSTRAINTS.MAX_NOTES_LENGTH} characters`,
        };
      }
    }

    return { isValid: true };
  }

  /**
   * Validates all incident fields together.
   * @param params Incident fields to validate
   * @returns Validation result with any error message
   */
  public static validateIncident(params: {
    incidentType?: string;
    severity?: string;
    status?: string;
    actorId?: string;
    source?: string;
    description?: string;
    metadata?: Record<string, unknown>;
  }): IncidentValidationResult {
    const incidentTypeResult = this.validateIncidentType(params.incidentType);
    if (!incidentTypeResult.isValid) return incidentTypeResult;

    const severityResult = this.validateSeverity(params.severity);
    if (!severityResult.isValid) return severityResult;

    const statusResult = this.validateStatus(params.status);
    if (!statusResult.isValid) return statusResult;

    const actorIdResult = this.validateActorId(params.actorId);
    if (!actorIdResult.isValid) return actorIdResult;

    const sourceResult = this.validateSource(params.source);
    if (!sourceResult.isValid) return sourceResult;

    const descriptionResult = this.validateDescription(params.description);
    if (!descriptionResult.isValid) return descriptionResult;

    const metadataResult = this.validateMetadata(params.metadata);
    if (!metadataResult.isValid) return metadataResult;

    return { isValid: true };
  }

  /**
   * Validates an incident and throws if invalid.
   * @param params Incident fields to validate
   * @throws Error with validation details if invalid
   */
  public static validateIncidentOrThrow(params: {
    incidentType?: string;
    severity?: string;
    status?: string;
    actorId?: string;
    source?: string;
    description?: string;
    metadata?: Record<string, unknown>;
  }): void {
    const result = this.validateIncident(params);
    if (!result.isValid) {
      throw new Error(`Incident validation failed: ${result.error}`);
    }
  }
}
