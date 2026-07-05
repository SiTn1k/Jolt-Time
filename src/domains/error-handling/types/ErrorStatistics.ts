/**
 * Error Statistics Types
 *
 * Defines statistics structures for error tracking and analysis.
 * Error Handling Foundation ONLY stores errors - it never modifies gameplay.
 */

/**
 * Error statistics for a given time period.
 */
export interface ErrorStatistics {
  /** Total error count */
  totalCount: number;

  /** Error count by severity */
  bySeverity: Record<string, number>;

  /** Error count by category */
  byCategory: Record<string, number>;

  /** Error count by status */
  byStatus: Record<string, number>;

  /** Critical error count */
  criticalCount: number;

  /** Fatal error count */
  fatalCount: number;

  /** Resolved error count */
  resolvedCount: number;

  /** Average resolution time in milliseconds */
  avgResolutionTimeMs: number;

  /** Time period start */
  periodStart: Date;

  /** Time period end */
  periodEnd: Date;
}

/**
 * Error trend data point.
 */
export interface ErrorTrendPoint {
  /** Timestamp of the trend point */
  timestamp: Date;

  /** Error count at this point */
  count: number;

  /** Severity at this point */
  severity: string;

  /** Category at this point */
  category: string;
}

/**
 * Error frequency statistics.
 */
export interface ErrorFrequency {
  /** Errors per minute */
  perMinute: number;

  /** Errors per hour */
  perHour: number;

  /** Errors per day */
  perDay: number;

  /** Errors per week */
  perWeek: number;

  /** Errors per month */
  perMonth: number;
}

/**
 * Initial/empty error statistics.
 */
export function createEmptyErrorStatistics(periodStart: Date, periodEnd: Date): ErrorStatistics {
  return {
    totalCount: 0,
    bySeverity: {},
    byCategory: {},
    byStatus: {},
    criticalCount: 0,
    fatalCount: 0,
    resolvedCount: 0,
    avgResolutionTimeMs: 0,
    periodStart,
    periodEnd,
  };
}
