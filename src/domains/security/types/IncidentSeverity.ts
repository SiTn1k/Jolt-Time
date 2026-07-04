/**
 * Incident Severity Types
 *
 * Defines all supported security incident severity levels.
 */

/**
 * Supported security incident severity levels.
 */
export enum IncidentSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * Constraints for incident severity types.
 */
export const INCIDENT_SEVERITY_CONSTRAINTS = {
  VALID_SEVERITIES: Object.values(IncidentSeverity),
} as const;
