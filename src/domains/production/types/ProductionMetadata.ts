/**
 * Production Metadata Types
 *
 * Type definitions for production domain metadata.
 */

/**
 * Certificate metadata for tracking and auditing.
 */
export interface CertificateMetadata {
  /** Certificate issuer information */
  issuer?: string;
  /** Certificate subject */
  subject?: string;
  /** Certification criteria version */
  criteriaVersion?: string;
  /** Certification notes */
  notes?: string;
  /** Approved features */
  approvedFeatures?: string[];
  /** Restricted features */
  restrictedFeatures?: string[];
  /** Compliance standards met */
  complianceStandards?: string[];
  /** Additional metadata */
  [key: string]: unknown;
}

/**
 * Checklist metadata for tracking and categorization.
 */
export interface ChecklistMetadata {
  /** Category of the checklist item */
  category: string;
  /** Priority level (1-5, 1 being highest) */
  priority: number;
  /** Description of the checklist item */
  description?: string;
  /** Dependencies on other checklist items */
  dependencies?: string[];
  /** Tags for organization */
  tags?: string[];
  /** Additional metadata */
  [key: string]: unknown;
}

/**
 * Snapshot metadata for system state capture.
 */
export interface SnapshotMetadata {
  /** Environment identifier */
  environment: string;
  /** Region identifier */
  region?: string;
  /** Deployment identifier */
  deploymentId?: string;
  /** Build information */
  buildInfo?: {
    buildNumber?: string;
    buildTimestamp?: string;
    commitHash?: string;
  };
  /** Additional metadata */
  [key: string]: unknown;
}

/**
 * System health information captured in a snapshot.
 */
export interface SystemHealth {
  /** Overall health status */
  status: 'healthy' | 'degraded' | 'unhealthy';
  /** CPU usage percentage */
  cpuUsage?: number;
  /** Memory usage percentage */
  memoryUsage?: number;
  /** Disk usage percentage */
  diskUsage?: number;
  /** Database connection status */
  databaseConnected?: boolean;
  /** Cache hit rate */
  cacheHitRate?: number;
  /** Response time in milliseconds */
  responseTimeMs?: number;
  /** Error rate percentage */
  errorRate?: number;
  /** Individual component statuses */
  components?: Record<string, 'healthy' | 'degraded' | 'unhealthy'>;
}

/**
 * Creates default certificate metadata.
 */
export function createDefaultCertificateMetadata(): CertificateMetadata {
  return {};
}

/**
 * Creates default checklist metadata.
 */
export function createDefaultChecklistMetadata(): ChecklistMetadata {
  return {
    category: 'general',
    priority: 3,
  };
}

/**
 * Creates default snapshot metadata.
 */
export function createDefaultSnapshotMetadata(): SnapshotMetadata {
  return {
    environment: 'production',
  };
}
