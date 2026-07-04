/**
 * Security Metadata Types
 *
 * Defines metadata structures for security entities.
 */

/**
 * Incident metadata for additional context.
 */
export interface IncidentMetadata {
  ipAddress?: string;
  userAgent?: string;
  location?: string;
  deviceId?: string;
  previousIncidents?: number;
  relatedIncidentIds?: string[];
  evidence?: Record<string, unknown>;
  notes?: string;
  source?: string;
  target?: string;
}

/**
 * Policy metadata for configuration.
 */
export interface PolicyMetadata {
  version?: string;
  lastModified?: string;
  modifiedBy?: string;
  reason?: string;
  expiresAt?: string;
  priority?: number;
  tags?: string[];
}

/**
 * Session metadata for tracking.
 */
export interface SessionMetadata {
  userAgent?: string;
  deviceInfo?: string;
  location?: string;
  ipAddress?: string;
  loginMethod?: string;
  mfaEnabled?: boolean;
  riskScore?: number;
  fingerprint?: string;
}

/**
 * Initial empty security metadata.
 */
export const INITIAL_INCIDENT_METADATA: IncidentMetadata = {};

export const INITIAL_POLICY_METADATA: PolicyMetadata = {};

export const INITIAL_SESSION_METADATA: SessionMetadata = {};

/**
 * Constraints for security metadata.
 */
export const SECURITY_METADATA_CONSTRAINTS = {
  MAX_IP_ADDRESS_LENGTH: 45,
  MAX_USER_AGENT_LENGTH: 512,
  MAX_LOCATION_LENGTH: 128,
  MAX_DEVICE_ID_LENGTH: 128,
  MAX_NOTES_LENGTH: 1024,
  MAX_SOURCE_LENGTH: 256,
  MAX_TARGET_LENGTH: 256,
} as const;
