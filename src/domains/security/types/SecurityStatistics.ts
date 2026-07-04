/**
 * Security Statistics Types
 *
 * Defines statistics structures for security domain.
 */

/**
 * Security statistics summary.
 */
export interface SecurityStatistics {
  totalIncidents: number;
  openIncidents: number;
  resolvedIncidents: number;
  closedIncidents: number;
  criticalIncidents: number;
  highIncidents: number;
  mediumIncidents: number;
  lowIncidents: number;
  activeSessions: number;
  revokedSessions: number;
  expiredSessions: number;
  enabledPolicies: number;
  disabledPolicies: number;
  incidentsByType: Record<string, number>;
  incidentsBySource: Record<string, number>;
  averageResolutionTime: number;
  lastUpdated: string;
}

/**
 * Initial security statistics.
 */
export const INITIAL_SECURITY_STATISTICS: SecurityStatistics = {
  totalIncidents: 0,
  openIncidents: 0,
  resolvedIncidents: 0,
  closedIncidents: 0,
  criticalIncidents: 0,
  highIncidents: 0,
  mediumIncidents: 0,
  lowIncidents: 0,
  activeSessions: 0,
  revokedSessions: 0,
  expiredSessions: 0,
  enabledPolicies: 0,
  disabledPolicies: 0,
  incidentsByType: {},
  incidentsBySource: {},
  averageResolutionTime: 0,
  lastUpdated: new Date().toISOString(),
};
