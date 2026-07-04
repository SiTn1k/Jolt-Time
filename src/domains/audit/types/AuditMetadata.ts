/**
 * Audit Metadata Type
 *
 * Defines the metadata structure for audit records.
 * Metadata provides additional context for audit entries.
 */

/**
 * Initial/empty audit metadata.
 */
export const INITIAL_AUDIT_METADATA: AuditMetadata = {
  userAgent: undefined,
  ipAddress: undefined,
  location: undefined,
  sessionId: undefined,
  requestId: undefined,
  correlationId: undefined,
  errorMessage: undefined,
  errorCode: undefined,
  stackTrace: undefined,
  previousValue: undefined,
  newValue: undefined,
  reason: undefined,
  notes: undefined,
  tags: undefined,
  extra: undefined,
};

/**
 * Audit metadata structure.
 * Provides additional context for audit records.
 */
export interface AuditMetadata {
  /** Client user agent string */
  userAgent?: string;

  /** Client IP address */
  ipAddress?: string;

  /** Geographic location */
  location?: string;

  /** Associated session ID */
  sessionId?: string;

  /** Request tracking ID */
  requestId?: string;

  /** Correlation ID for distributed tracing */
  correlationId?: string;

  /** Error message if action failed */
  errorMessage?: string;

  /** Error code if action failed */
  errorCode?: string;

  /** Stack trace if action failed */
  stackTrace?: string;

  /** Previous value before change (for updates) */
  previousValue?: Record<string, unknown>;

  /** New value after change (for updates) */
  newValue?: Record<string, unknown>;

  /** Reason for the action */
  reason?: string;

  /** Additional notes */
  notes?: string;

  /** Tags for categorization */
  tags?: string[];

  /** Extra data */
  extra?: Record<string, unknown>;
}

/**
 * Constraints for audit metadata.
 */
export const AUDIT_METADATA_CONSTRAINTS = {
  MAX_IP_ADDRESS_LENGTH: 45,
  MAX_LOCATION_LENGTH: 128,
  MAX_SESSION_ID_LENGTH: 128,
  MAX_REQUEST_ID_LENGTH: 128,
  MAX_CORRELATION_ID_LENGTH: 128,
  MAX_REASON_LENGTH: 512,
  MAX_NOTES_LENGTH: 2048,
  MAX_TAGS_COUNT: 20,
} as const;
