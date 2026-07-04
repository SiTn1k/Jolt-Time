/**
 * Incident Status Types
 *
 * Defines all supported security incident status values.
 */

/**
 * Supported security incident status values.
 */
export enum IncidentStatus {
  OPEN = 'open',
  INVESTIGATING = 'investigating',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  ESCALATED = 'escalated',
}

/**
 * Constraints for incident status types.
 */
export const INCIDENT_STATUS_CONSTRAINTS = {
  VALID_STATUSES: Object.values(IncidentStatus),
} as const;
