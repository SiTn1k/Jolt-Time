/**
 * Policy Type Types
 *
 * Defines all supported security policy types.
 */

/**
 * Supported security policy types.
 */
export enum PolicyType {
  ACCESS_CONTROL = 'access_control',
  RATE_LIMITING = 'rate_limiting',
  IP_WHITELIST = 'ip_whitelist',
  IP_BLACKLIST = 'ip_blacklist',
  SESSION_MANAGEMENT = 'session_management',
  ENCRYPTION = 'encryption',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  AUDIT = 'audit',
  DATA_PROTECTION = 'data_protection',
  NETWORK_SECURITY = 'network_security',
  APPLICATION_SECURITY = 'application_security',
}

/**
 * Constraints for policy type.
 */
export const POLICY_TYPE_CONSTRAINTS = {
  VALID_POLICY_TYPES: Object.values(PolicyType),
} as const;
