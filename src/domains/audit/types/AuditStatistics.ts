/**
 * Audit Statistics Types
 *
 * Defines types for audit-related statistics and aggregations.
 */

/**
 * Audit statistics summary.
 */
export interface AuditStatistics {
  /** Total number of audit records */
  totalRecords: number;

  /** Number of records by result */
  byResult: Record<string, number>;

  /** Number of records by actor type */
  byActorType: Record<string, number>;

  /** Number of records by action category */
  byActionCategory: Record<string, number>;

  /** Most active actors */
  topActors: Array<{
    actorId: string;
    actorType: string;
    count: number;
  }>;

  /** Most common actions */
  topActions: Array<{
    action: string;
    count: number;
  }>;

  /** Time range of statistics */
  fromDate: string;
  toDate: string;
}

/**
 * Audit record count by category.
 */
export interface AuditCountByCategory {
  category: string;
  count: number;
}

/**
 * Audit record count by actor.
 */
export interface AuditCountByActor {
  actorId: string;
  actorType: string;
  count: number;
}
