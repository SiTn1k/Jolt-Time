/**
 * HardeningMetadata Types
 *
 * Metadata type definitions for hardening domain.
 */

/**
 * Metadata for a hardening rule.
 */
export interface RuleMetadata {
  /** Category of the rule (e.g., security, performance, reliability) */
  category: string;
  /** Tags for additional categorization */
  tags: string[];
  /** Owner team responsible for this rule */
  owner: string;
  /** Estimated effort in hours */
  estimatedHours?: number;
  /** Notes or additional information */
  notes?: string;
}

/**
 * Metadata for a hardening checklist.
 */
export interface ChecklistMetadata {
  /** Category of the checklist item */
  category: string;
  /** Priority level (1-4) */
  priority: number;
  /** Owner team responsible for this item */
  owner: string;
  /** Dependencies on other checklist items */
  dependencies?: string[];
  /** Notes or additional information */
  notes?: string;
}

/**
 * Metadata for a hardening snapshot.
 */
export interface SnapshotMetadata {
  /** Environment this snapshot was taken in */
  environment: string;
  /** Deployment ID if applicable */
  deploymentId?: string;
  /** Build ID if applicable */
  buildId?: string;
  /** Region or data center */
  region?: string;
  /** Additional notes */
  notes?: string;
}

/**
 * System health summary for overview/dashboard.
 */
export interface SystemHealthSummary {
  /** Overall health status */
  status: 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
  /** Last health check timestamp */
  lastChecked: Date;
  /** Total number of modules */
  moduleCount: number;
  /** Number of healthy modules */
  healthyModules: number;
  /** Number of unhealthy modules */
  unhealthyModules: number;
}

/**
 * Hardening statistics for overview/dashboard.
 */
export interface HardeningStatistics {
  /** Total number of rules */
  totalRules: number;
  /** Number of active rules */
  activeRules: number;
  /** Number of pending rules */
  pendingRules: number;
  /** Total number of checklist items */
  totalChecklists: number;
  /** Number of completed checklist items */
  completedChecklists: number;
  /** Number of snapshots taken */
  totalSnapshots: number;
  /** Timestamp of the last snapshot */
  lastSnapshotAt: Date | null;
  /** Compliance score as a percentage (0-100) */
  complianceScore: number;
}

/**
 * Creates default metadata for a rule.
 */
export function createDefaultRuleMetadata(): RuleMetadata {
  return {
    category: 'general',
    tags: [],
    owner: '',
  };
}

/**
 * Creates default metadata for a checklist.
 */
export function createDefaultChecklistMetadata(): ChecklistMetadata {
  return {
    category: 'general',
    priority: 3,
    owner: '',
  };
}

/**
 * Creates default metadata for a snapshot.
 */
export function createDefaultSnapshotMetadata(): SnapshotMetadata {
  return {
    environment: 'production',
  };
}
