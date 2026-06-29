/**
 * Admin Statistics Types
 *
 * Statistics and metrics for admin domain.
 */

/**
 * Admin account statistics.
 */
export interface AdminStatistics {
  /** Total number of admin accounts */
  totalAdmins: number;

  /** Number of active admins */
  activeAdmins: number;

  /** Number of inactive admins */
  inactiveAdmins: number;

  /** Number of suspended admins */
  suspendedAdmins: number;

  /** Number of pending admins */
  pendingAdmins: number;

  /** Admins by role type */
  adminsByRole: Record<string, number>;

  /** Admins by department */
  adminsByDepartment: Record<string, number>;

  /** Recent login count (last 24 hours) */
  recentLogins24h: number;

  /** Recent login count (last 7 days) */
  recentLogins7d: number;

  /** Average session duration in seconds */
  averageSessionDurationSeconds: number;

  /** Timestamp of last update */
  lastUpdatedAt: Date;
}

/**
 * Creates empty admin statistics.
 */
export function createEmptyAdminStatistics(): AdminStatistics {
  return {
    totalAdmins: 0,
    activeAdmins: 0,
    inactiveAdmins: 0,
    suspendedAdmins: 0,
    pendingAdmins: 0,
    adminsByRole: {},
    adminsByDepartment: {},
    recentLogins24h: 0,
    recentLogins7d: 0,
    averageSessionDurationSeconds: 0,
    lastUpdatedAt: new Date(),
  };
}

/**
 * Admin session statistics.
 */
export interface AdminSessionStatistics {
  /** Total active sessions */
  activeSessions: number;

  /** Sessions by role */
  sessionsByRole: Record<string, number>;

  /** Average session duration */
  averageDurationSeconds: number;

  /** Peak concurrent sessions today */
  peakConcurrentToday: number;

  /** Failed login attempts today */
  failedLoginAttemptsToday: number;
}

/**
 * Admin action statistics.
 */
export interface AdminActionStatistics {
  /** Total actions performed */
  totalActions: number;

  /** Actions by type */
  actionsByType: Record<string, number>;

  /** Actions by admin */
  actionsByAdmin: Record<string, number>;

  /** Recent actions (last 24 hours) */
  recentActions24h: number;

  /** Most active admin */
  mostActiveAdminId?: string;
}