/**
 * Analytics Statistics
 *
 * Defines aggregated statistics structure for analytics.
 */

/**
 * Aggregated analytics statistics.
 */
export interface AnalyticsStatistics {
  /** Total number of events recorded */
  totalEvents: number;

  /** Total number of sessions */
  totalSessions: number;

  /** Total number of active sessions */
  activeSessions: number;

  /** Average session duration in milliseconds */
  averageSessionDuration: number;

  /** Total metrics recorded */
  totalMetrics: number;

  /** Events by type breakdown */
  eventsByType: Record<string, number>;

  /** Last event timestamp */
  lastEventAt?: Date;

  /** Last session timestamp */
  lastSessionAt?: Date;
}

/**
 * Initial analytics statistics.
 */
export const INITIAL_ANALYTICS_STATISTICS: AnalyticsStatistics = {
  totalEvents: 0,
  totalSessions: 0,
  activeSessions: 0,
  averageSessionDuration: 0,
  totalMetrics: 0,
  eventsByType: {},
  lastEventAt: undefined,
  lastSessionAt: undefined,
};
