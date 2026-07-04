/**
 * IntegrationStatus
 *
 * Defines the possible states of an integration provider.
 */

/**
 * Possible status values for an integration provider.
 */
export type IntegrationStatus =
  | 'active'
  | 'inactive'
  | 'suspended'
  | 'pending'
  | 'error';

/**
 * Display names for integration statuses.
 */
export const INTEGRATION_STATUS_DISPLAY: Record<IntegrationStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  suspended: 'Suspended',
  pending: 'Pending',
  error: 'Error',
};

/**
 * Status colors for UI display.
 */
export const INTEGRATION_STATUS_COLORS: Record<IntegrationStatus, string> = {
  active: '#10b981',
  inactive: '#9ca3af',
  suspended: '#f59e0b',
  pending: '#3b82f6',
  error: '#ef4444',
};

/**
 * Checks if an integration status represents an operational state.
 */
export function isActiveIntegrationStatus(status: IntegrationStatus): boolean {
  return status === 'active';
}

/**
 * Checks if an integration status represents a non-operational state.
 */
export function isInactiveIntegrationStatus(status: IntegrationStatus): boolean {
  return status === 'inactive' || status === 'suspended' || status === 'pending';
}

/**
 * Checks if an integration status represents an error state.
 */
export function isErrorIntegrationStatus(status: IntegrationStatus): boolean {
  return status === 'error';
}
