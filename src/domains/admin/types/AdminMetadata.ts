/**
 * Admin Metadata Type
 *
 * Metadata structure for admin entities.
 */

/**
 * Admin metadata containing tracking and additional information.
 */
export interface AdminMetadata {
  /** Notes or description */
  notes?: string;

  /** Department or team */
  department?: string;

  /** Contact email */
  email?: string;

  /** Timezone */
  timezone?: string;

  /** Preferred language */
  language?: string;

  /** Custom fields */
  customFields?: Record<string, unknown>;

  /** Last action performed */
  lastAction?: string;

  /** IP address whitelist for admin access */
  allowedIpAddresses?: string[];

  /** Whether 2FA is enabled */
  twoFactorEnabled?: boolean;

  /** Session timeout in seconds */
  sessionTimeoutSeconds?: number;

  /** API key for programmatic access (hashed) */
  apiKeyHash?: string;

  /** Creation metadata */
  createdBy?: string;
  createdFromIp?: string;

  /** Update metadata */
  updatedBy?: string;
  updatedFromIp?: string;

  /** Version for optimistic locking */
  version: number;
}

/**
 * Creates default admin metadata.
 */
export function createDefaultAdminMetadata(createdBy?: string): AdminMetadata {
  return {
    notes: undefined,
    department: undefined,
    email: undefined,
    timezone: 'UTC',
    language: 'en',
    customFields: undefined,
    lastAction: undefined,
    allowedIpAddresses: undefined,
    twoFactorEnabled: false,
    sessionTimeoutSeconds: 3600,
    apiKeyHash: undefined,
    createdBy,
    createdFromIp: undefined,
    updatedBy: undefined,
    updatedFromIp: undefined,
    version: 1,
  };
}

/**
 * Admin role metadata.
 */
export interface AdminRoleMetadata {
  /** Role description */
  description?: string;

  /** Color code for UI display */
  colorCode?: string;

  /** Icon identifier for UI */
  iconName?: string;

  /** Whether this is a system role (cannot be deleted) */
  isSystemRole: boolean;

  /** Whether this role can be assigned by lower priority admins */
  assignable: boolean;

  /** Creation metadata */
  createdBy?: string;

  /** Update metadata */
  updatedBy?: string;

  /** Version for optimistic locking */
  version: number;
}

/**
 * Creates default admin role metadata.
 */
export function createDefaultRoleMetadata(createdBy?: string): AdminRoleMetadata {
  return {
    description: undefined,
    colorCode: undefined,
    iconName: undefined,
    isSystemRole: false,
    assignable: true,
    createdBy,
    updatedBy: undefined,
    version: 1,
  };
}

/**
 * Admin permission metadata.
 */
export interface AdminPermissionMetadata {
  /** Permission description */
  description: string;

  /** Module this permission belongs to */
  module: string;

  /** Category for grouping */
  category?: string;

  /** Whether this is a dangerous permission */
  isDangerous: boolean;

  /** Creation metadata */
  createdBy?: string;

  /** Version for optimistic locking */
  version: number;
}